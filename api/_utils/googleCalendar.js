import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import mongoose from "mongoose";
import process from "node:process";
import { google } from "googleapis";
import connectToDatabase from "./db.js";
import Admin from "../_models/Admin.js";
import { GoogleCalendarCredential, GoogleCalendarOAuthState } from "../_models/GoogleCalendar.js";
import { verifyAdminToken } from "./auth.js";

const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";
const CALLBACK_PATH = "/api/google-calendar/callback";
const STATE_TTL_MS = 10 * 60 * 1000;

class CalendarError extends Error {
  constructor(message, status = 500, code = "calendar_error") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const getConfiguration = () => {
  const missing = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI", "GOOGLE_TOKEN_ENCRYPTION_KEY"]
    .filter((name) => !process.env[name]);
  if (missing.length) {
    throw new CalendarError(`Google Calendar is not configured. Missing environment variable(s): ${missing.join(", ")}.`, 503, "configuration_missing");
  }

  let redirectUri;
  try {
    redirectUri = new URL(process.env.GOOGLE_REDIRECT_URI);
  } catch {
    throw new CalendarError("GOOGLE_REDIRECT_URI must be an absolute callback URL.", 503, "configuration_invalid");
  }
  if (!["http:", "https:"].includes(redirectUri.protocol) || redirectUri.pathname !== CALLBACK_PATH || redirectUri.search || redirectUri.hash) {
    throw new CalendarError(`GOOGLE_REDIRECT_URI must be an absolute URL ending in ${CALLBACK_PATH}, without query or fragment.`, 503, "configuration_invalid");
  }

  return {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: redirectUri.toString(),
    encryptionKey: getEncryptionKey(),
  };
};

const getEncryptionKey = () => {
  const encoded = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;
  if (!encoded) {
    throw new CalendarError("Google Calendar is not configured. Missing environment variable: GOOGLE_TOKEN_ENCRYPTION_KEY.", 503, "configuration_missing");
  }

  const key = Buffer.from(encoded, "base64");
  if (key.length !== 32 || key.toString("base64") !== encoded) {
    throw new CalendarError("GOOGLE_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key.", 503, "configuration_invalid");
  }
  return key;
};

const createOAuthClient = ({ clientId, clientSecret, redirectUri }) => (
  new google.auth.OAuth2(clientId, clientSecret, redirectUri)
);

const encryptRefreshToken = (token, key) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  return {
    encryptedRefreshToken: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
  };
};

const decryptRefreshToken = (credential, key) => {
  try {
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(credential.iv, "base64"));
    decipher.setAuthTag(Buffer.from(credential.authTag, "base64"));
    return Buffer.concat([
      decipher.update(Buffer.from(credential.encryptedRefreshToken, "base64")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    throw new CalendarError("The saved Google Calendar credential could not be decrypted. Check that GOOGLE_TOKEN_ENCRYPTION_KEY has not changed.", 500, "credential_decryption_failed");
  }
};

const requireAdmin = async (req) => {
  const auth = verifyAdminToken(req);
  const adminId = auth.valid ? String(auth.decoded?.id || "") : "";
  if (!auth.valid || !mongoose.Types.ObjectId.isValid(adminId)) {
    throw new CalendarError("A valid administrator session is required.", 401, "admin_auth_required");
  }
  if (!process.env.JWT_SECRET) {
    throw new CalendarError("JWT_SECRET must be configured before Google Calendar access can be enabled.", 503, "admin_auth_not_configured");
  }
  const admin = await Admin.findById(adminId).select("_id role");
  if (!admin || admin.role !== "admin") {
    throw new CalendarError("A valid administrator session is required.", 401, "admin_auth_required");
  }
  return admin._id;
};

const getOAuthConfig = () => {
  const config = getConfiguration();
  return { ...config, oauthClient: createOAuthClient(config) };
};

const handleConnect = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }
  const adminId = await requireAdmin(req);
  const { oauthClient } = getOAuthConfig();
  const state = crypto.randomBytes(32).toString("base64url");
  await GoogleCalendarOAuthState.create({
    stateHash: crypto.createHash("sha256").update(state).digest("hex"),
    adminId,
    expiresAt: new Date(Date.now() + STATE_TTL_MS),
  });
  const authorizationUrl = oauthClient.generateAuthUrl({
    access_type: "offline",
    include_granted_scopes: true,
    prompt: "consent",
    scope: [CALENDAR_SCOPE],
    state,
  });
  return res.status(200).json({ success: true, authorizationUrl });
};

const redirectFromCallback = (res, result) => {
  res.setHeader("Location", `/dashboard/calendar?googleCalendar=${encodeURIComponent(result)}`);
  return res.status(302).end();
};

const handleCallback = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }
  const state = typeof req.query?.state === "string" ? req.query.state : "";
  if (!state || state.length > 200) {
    throw new CalendarError("The Google OAuth state is missing or invalid. Start the connection again.", 400, "oauth_state_invalid");
  }

  const stateHash = crypto.createHash("sha256").update(state).digest("hex");
  const storedState = await GoogleCalendarOAuthState.findOneAndDelete({
    stateHash,
    expiresAt: { $gt: new Date() },
  });
  if (!storedState) {
    throw new CalendarError("The Google OAuth state is invalid, expired, or already used. Start the connection again.", 400, "oauth_state_invalid");
  }

  const oauthError = typeof req.query?.error === "string" ? req.query.error : "";
  if (oauthError) return redirectFromCallback(res, "error");

  const code = typeof req.query?.code === "string" ? req.query.code : "";
  if (!code) {
    throw new CalendarError("Google did not return an authorization code. Start the connection again.", 400, "oauth_code_missing");
  }

  const config = getConfiguration();
  const oauthClient = createOAuthClient(config);
  try {
    const { tokens } = await oauthClient.getToken(code);
    let refreshToken = tokens.refresh_token;
    if (!refreshToken) {
      const existing = await GoogleCalendarCredential.findOne({ adminId: storedState.adminId });
      if (existing) refreshToken = decryptRefreshToken(existing, config.encryptionKey);
    }
    if (!refreshToken) {
      throw new CalendarError("Google did not issue a refresh token. Reconnect and approve offline access.", 400, "refresh_token_missing");
    }

    const encryptedToken = encryptRefreshToken(refreshToken, config.encryptionKey);
    await GoogleCalendarCredential.findOneAndUpdate(
      { adminId: storedState.adminId },
      { $set: { ...encryptedToken, calendarId: "primary" } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
    return redirectFromCallback(res, "connected");
  } catch (error) {
    if (error instanceof CalendarError) throw error;
    console.error("Google Calendar OAuth token exchange failed.", {
      code: error?.code || error?.response?.data?.error || "oauth_exchange_failed",
      status: error?.response?.status,
    });
    return redirectFromCallback(res, "error");
  }
};

const getAuthorizedCalendar = async (adminId) => {
  const config = getConfiguration();
  const credential = await GoogleCalendarCredential.findOne({ adminId });
  if (!credential) return null;

  const oauthClient = createOAuthClient(config);
  oauthClient.setCredentials({ refresh_token: decryptRefreshToken(credential, config.encryptionKey) });
  try {
    await oauthClient.getAccessToken();
  } catch (error) {
    if (error?.response?.data?.error === "invalid_grant") {
      throw new CalendarError("Google authorization has expired or been revoked. Reconnect Google Calendar.", 401, "google_reconnect_required");
    }
    console.error("Google Calendar access-token refresh failed.", {
      code: error?.code || error?.response?.data?.error || "token_refresh_failed",
      status: error?.response?.status,
    });
    throw new CalendarError("Could not refresh Google access. Check the Google OAuth configuration and try reconnecting.", 502, "token_refresh_failed");
  }
  return { calendar: google.calendar({ version: "v3", auth: oauthClient }), calendarId: credential.calendarId };
};

const formatEvent = (event) => ({
  id: event.id,
  summary: event.summary || "(No title)",
  description: event.description || "",
  start: event.start,
  end: event.end,
  htmlLink: event.htmlLink,
});

const handleListEvents = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }
  const adminId = await requireAdmin(req);
  const connected = await getAuthorizedCalendar(adminId);
  if (!connected) return res.status(200).json({ success: true, connected: false, events: [] });

  try {
    const { data } = await connected.calendar.events.list({
      calendarId: connected.calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 50,
      orderBy: "startTime",
      singleEvents: true,
    });
    return res.status(200).json({
      success: true,
      connected: true,
      events: (data.items || []).map(formatEvent),
    });
  } catch (error) {
    return handleCalendarApiError(error, res);
  }
};

const handleCreateEvent = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }
  const adminId = await requireAdmin(req);
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  const summary = typeof body.summary === "string" ? body.summary.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const start = typeof body.start === "string" ? body.start : "";
  const end = typeof body.end === "string" ? body.end : "";
  if (!summary || summary.length > 200 || description.length > 5000) {
    throw new CalendarError("Enter an event title (up to 200 characters) and a description no longer than 5,000 characters.", 400, "event_input_invalid");
  }
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (!start || !end || !Number.isFinite(startDate.getTime()) || !Number.isFinite(endDate.getTime()) || endDate <= startDate) {
    throw new CalendarError("Enter valid start and end times, with the end after the start.", 400, "event_time_invalid");
  }

  const connected = await getAuthorizedCalendar(adminId);
  if (!connected) {
    throw new CalendarError("Connect Google Calendar before creating events.", 409, "calendar_not_connected");
  }
  try {
    const data = await insertCalendarEvent(connected, {
      summary,
      description,
      start: startDate,
      end: endDate,
    });
    return res.status(201).json({ success: true, event: formatEvent(data) });
  } catch (error) {
    return handleCalendarApiError(error, res);
  }
};

const insertCalendarEvent = async (connected, { summary, description, start, end }) => {
  const { data } = await connected.calendar.events.insert({
    calendarId: connected.calendarId,
    requestBody: {
      summary,
      description,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
      reminders: {
        useDefault: false,
        overrides: [{ method: "popup", minutes: 0 }],
      },
    },
  });
  return data;
};

const handleCreateTimelineEvents = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }
  const adminId = await requireAdmin(req);
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  if (!Array.isArray(body.events) || body.events.length === 0 || body.events.length > 20) {
    throw new CalendarError("Provide between 1 and 20 dated timeline events.", 400, "timeline_events_invalid");
  }
  const events = body.events.map((event) => {
    const summary = typeof event?.summary === "string" ? event.summary.trim() : "";
    const description = typeof event?.description === "string" ? event.description.trim() : "";
    const start = new Date(event?.start);
    const end = new Date(event?.end);
    if (!summary || summary.length > 200 || description.length > 5000
      || !Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
      throw new CalendarError("A timeline event has an invalid title, description, or date.", 400, "timeline_event_invalid");
    }
    return { summary, description, start, end };
  });

  const connected = await getAuthorizedCalendar(adminId);
  if (!connected) {
    throw new CalendarError("Connect Google Calendar from the admin Calendar page first.", 409, "calendar_not_connected");
  }

  const results = [];
  for (const event of events) {
    try {
      results.push({ success: true, event: formatEvent(await insertCalendarEvent(connected, event)) });
    } catch (error) {
      console.error("Could not create a Google Calendar timeline event.", {
        code: error?.code || error?.response?.data?.error || "calendar_event_create_failed",
        status: error?.response?.status,
      });
      results.push({ success: false });
    }
  }
  const created = results.filter((result) => result.success).map((result) => result.event);
  const failedCount = results.length - created.length;
  return res.status(failedCount ? (created.length ? 207 : 502) : 201).json({
    success: failedCount === 0,
    createdCount: created.length,
    failedCount,
    events: created,
    ...(failedCount ? { error: "Some timeline events could not be added to Google Calendar. Check Calendar permissions and try again." } : {}),
  });
};

const handleCalendarApiError = (error, res) => {
  const status = Number(error?.response?.status);
  const googleCode = error?.response?.data?.error;
  console.error("Google Calendar API request failed.", {
    code: error?.code || googleCode || "calendar_api_failed",
    status: Number.isFinite(status) ? status : undefined,
  });
  if (status === 401 || googleCode === "invalid_grant") {
    return res.status(401).json({ success: false, code: "google_reconnect_required", error: "Google authorization expired or was revoked. Reconnect Google Calendar." });
  }
  return res.status(502).json({ success: false, code: "calendar_api_failed", error: "Google Calendar could not complete the request. Try again shortly." });
};

export const handleGoogleCalendarAction = async (action, req, res) => {
  try {
    await connectToDatabase();
    if (action === "google-calendar-connect") return await handleConnect(req, res);
    if (action === "google-calendar-callback") return await handleCallback(req, res);
    if (action === "google-calendar-events") return await handleListEvents(req, res);
    if (action === "google-calendar-events-create") return await handleCreateEvent(req, res);
    if (action === "google-calendar-timeline") return await handleCreateTimelineEvents(req, res);
    return res.status(404).json({ success: false, error: "Google Calendar action not found." });
  } catch (error) {
    if (error instanceof CalendarError) {
      return res.status(error.status).json({ success: false, code: error.code, error: error.message });
    }
    if (error?.name === "SyntaxError") {
      return res.status(400).json({ success: false, code: "invalid_json", error: "The request body must be valid JSON." });
    }
    if (error?.message?.includes("MONGODB_URI")) {
      return res.status(503).json({ success: false, code: "storage_not_configured", error: "Google Calendar requires MONGODB_URI for persistent, encrypted credential storage." });
    }
    console.error("Google Calendar request failed.", {
      code: error?.code || error?.name || "calendar_request_failed",
      status: error?.response?.status,
    });
    return res.status(500).json({ success: false, code: "calendar_request_failed", error: "Google Calendar request failed. Check server configuration and try again." });
  }
};
