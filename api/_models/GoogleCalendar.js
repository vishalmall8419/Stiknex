import mongoose from "mongoose";

const GoogleCalendarCredentialSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
    unique: true,
  },
  calendarId: {
    type: String,
    default: "primary",
    required: true,
  },
  encryptedRefreshToken: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  authTag: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const GoogleCalendarOAuthStateSchema = new mongoose.Schema({
  stateHash: {
    type: String,
    required: true,
    unique: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0,
  },
}, { timestamps: true });

export const GoogleCalendarCredential = mongoose.models.GoogleCalendarCredential
  || mongoose.model("GoogleCalendarCredential", GoogleCalendarCredentialSchema);

export const GoogleCalendarOAuthState = mongoose.models.GoogleCalendarOAuthState
  || mongoose.model("GoogleCalendarOAuthState", GoogleCalendarOAuthStateSchema);
