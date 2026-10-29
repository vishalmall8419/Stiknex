import crypto from 'crypto';
import { Buffer } from 'node:buffer';
import connectToDatabase from './db.js';
import NotebookSync from '../_models/NotebookSync.js';
import DevicePairing from '../_models/DevicePairing.js';

// Simple in-memory rate limiter per IP
const rateLimits = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 120;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now - entry.startTime > RATE_LIMIT_WINDOW_MS) {
    rateLimits.set(ip, { startTime: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token || '').digest('hex');
}

export default async function handleNotebookSync(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ success: false, error: 'Too many requests. Please try again shortly.' });
  }

  try {
    await connectToDatabase();
  } catch (dbErr) {
    console.error('NotebookSync DB connection failed:', dbErr);
    return res.status(500).json({ success: false, error: 'Database connection failed' });
  }

  let urlParams = {};
  try {
    const parsedUrl = new URL(req.url || '', 'http://localhost');
    urlParams = Object.fromEntries(parsedUrl.searchParams);
  } catch {}

  req.query = {
    ...urlParams,
    ...(req.query || {}),
  };

  const action = req.query.action || '';

  try {
    switch (action) {
      // ==========================================
      // 1. CLOUD SYNC PUSH
      // ==========================================
      case 'notebook-sync-push':
      case 'notebook-push': {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const { syncGroupId, ciphertext, iv, expectedVersion, deviceId, deviceName, deviceToken } = body;

        if (!syncGroupId || !ciphertext || !iv || !deviceId || !deviceToken) {
          return res.status(400).json({ success: false, error: 'Missing required sync fields' });
        }

        // Limit payload size to 15MB to protect database & free-tier limits
        const payloadSize = Buffer.byteLength(ciphertext, 'utf8');
        if (payloadSize > 15 * 1024 * 1024) {
          return res.status(413).json({ success: false, error: 'Payload exceeds 15MB maximum size limit' });
        }

        const tokenHash = hashToken(deviceToken);
        let record = await NotebookSync.findOne({ syncGroupId });

        if (!record) {
          // Initialize first device and first version
          record = new NotebookSync({
            syncGroupId,
            ciphertext,
            iv,
            version: 1,
            devices: [{
              deviceId,
              deviceName: deviceName || 'Primary Device',
              tokenHash,
              lastActiveAt: new Date(),
            }],
          });
          await record.save();
          return res.status(200).json({ success: true, version: 1 });
        }

        // Verify device authorization
        const existingDevice = record.devices.find((d) => d.deviceId === deviceId);
        if (!existingDevice) {
          return res.status(403).json({ success: false, error: 'Device is not authorized for this sync group' });
        }
        if (existingDevice.tokenHash !== tokenHash) {
          return res.status(403).json({ success: false, error: 'Invalid device credentials' });
        }

        // Conflict Detection: optimistic concurrency check
        if (typeof expectedVersion === 'number' && expectedVersion < record.version) {
          return res.status(409).json({
            success: false,
            error: 'Conflict: Server has a newer version',
            serverVersion: record.version,
            ciphertext: record.ciphertext,
            iv: record.iv,
            updatedAt: record.updatedAt,
          });
        }

        // Apply update
        record.ciphertext = ciphertext;
        record.iv = iv;
        record.version += 1;
        record.updatedAt = new Date();
        existingDevice.lastActiveAt = new Date();
        if (deviceName) existingDevice.deviceName = deviceName;

        await record.save();
        return res.status(200).json({ success: true, version: record.version });
      }

      // ==========================================
      // 2. CLOUD SYNC PULL
      // ==========================================
      case 'notebook-sync-pull':
      case 'notebook-pull': {
        const syncGroupId = req.query.syncGroupId || req.headers['x-sync-group-id'];
        const deviceId = req.query.deviceId || req.headers['x-device-id'];
        const deviceToken = req.headers['authorization']?.replace(/^Bearer\s+/i, '') || req.query.token;

        if (!syncGroupId || !deviceId || !deviceToken) {
          return res.status(400).json({ success: false, error: 'Missing syncGroupId or device credentials' });
        }

        const record = await NotebookSync.findOne({ syncGroupId });
        if (!record) {
          return res.status(404).json({ success: false, error: 'Sync group not found' });
        }

        const tokenHash = hashToken(deviceToken);
        const device = record.devices.find((d) => d.deviceId === deviceId);
        if (!device || device.tokenHash !== tokenHash) {
          return res.status(403).json({ success: false, error: 'Device is not authorized' });
        }

        // Update device last active time
        device.lastActiveAt = new Date();
        await record.save();

        return res.status(200).json({
          success: true,
          ciphertext: record.ciphertext,
          iv: record.iv,
          version: record.version,
          updatedAt: record.updatedAt,
          devices: record.devices.map((d) => ({
            deviceId: d.deviceId,
            deviceName: d.deviceName,
            lastActiveAt: d.lastActiveAt,
            createdAt: d.createdAt,
          })),
        });
      }

      // ==========================================
      // 3. DEVICE REVOCATION
      // ==========================================
      case 'notebook-sync-revoke-device': {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const { syncGroupId, deviceId, deviceToken, targetDeviceId } = body;

        if (!syncGroupId || !deviceId || !deviceToken || !targetDeviceId) {
          return res.status(400).json({ success: false, error: 'Missing required revocation parameters' });
        }

        const record = await NotebookSync.findOne({ syncGroupId });
        if (!record) return res.status(404).json({ success: false, error: 'Sync group not found' });

        const tokenHash = hashToken(deviceToken);
        const callerDevice = record.devices.find((d) => d.deviceId === deviceId);
        if (!callerDevice || callerDevice.tokenHash !== tokenHash) {
          return res.status(403).json({ success: false, error: 'Unauthorized to revoke devices' });
        }

        record.devices = record.devices.filter((d) => d.deviceId !== targetDeviceId);
        await record.save();

        return res.status(200).json({
          success: true,
          remainingDevices: record.devices.map((d) => ({
            deviceId: d.deviceId,
            deviceName: d.deviceName,
            lastActiveAt: d.lastActiveAt,
          })),
        });
      }

      // ==========================================
      // 4. QR PAIRING: STEP 1 - CREATE SESSION (Device A)
      // ==========================================
      case 'notebook-pair-create': {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const { pairingId } = body;

        if (!pairingId || typeof pairingId !== 'string' || pairingId.length < 16) {
          return res.status(400).json({ success: false, error: 'Invalid pairingId' });
        }

        await DevicePairing.deleteMany({ pairingId }); // remove stale if any
        const pairing = new DevicePairing({
          pairingId,
          status: 'pending',
        });
        await pairing.save();

        return res.status(200).json({ success: true, pairingId });
      }

      // ==========================================
      // 5. QR PAIRING: STEP 2 - CLAIM SESSION (Device B)
      // ==========================================
      case 'notebook-pair-claim': {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const { pairingId, deviceId, deviceName } = body;

        if (!pairingId || !deviceId) {
          return res.status(400).json({ success: false, error: 'Missing pairingId or deviceId' });
        }

        const pairing = await DevicePairing.findOne({ pairingId, status: 'pending' });
        if (!pairing) {
          return res.status(404).json({ success: false, error: 'Pairing session expired or not found' });
        }

        pairing.status = 'claimed';
        pairing.claimedDevice = {
          deviceId,
          deviceName: deviceName || 'New Device',
        };
        await pairing.save();

        return res.status(200).json({ success: true, message: 'Pairing claimed. Awaiting key transfer.' });
      }

      // ==========================================
      // 6. QR PAIRING: STEP 3 - CHECK STATUS (Device A polls)
      // ==========================================
      case 'notebook-pair-check': {
        const pairingId = req.query.pairingId;
        if (!pairingId) return res.status(400).json({ success: false, error: 'Missing pairingId' });

        const pairing = await DevicePairing.findOne({ pairingId });
        if (!pairing) {
          return res.status(404).json({ success: false, error: 'Pairing session expired' });
        }

        return res.status(200).json({
          success: true,
          status: pairing.status,
          claimedDevice: pairing.claimedDevice || null,
        });
      }

      // ==========================================
      // 7. QR PAIRING: STEP 4 - TRANSFER ENCRYPTED KEY (Device A)
      // ==========================================
      case 'notebook-pair-transfer': {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const { pairingId, encryptedPayload, iv, syncGroupId, deviceId, deviceName, deviceTokenHash } = body;

        if (!pairingId || !encryptedPayload || !iv || !syncGroupId || !deviceId || !deviceTokenHash) {
          return res.status(400).json({ success: false, error: 'Missing pairing transfer parameters' });
        }

        const pairing = await DevicePairing.findOne({ pairingId, status: 'claimed' });
        if (!pairing) {
          return res.status(404).json({ success: false, error: 'Pairing session is no longer claimed or has expired' });
        }

        // Authorize Device B in the sync group
        const record = await NotebookSync.findOne({ syncGroupId });
        if (record) {
          const alreadyExists = record.devices.some((d) => d.deviceId === deviceId);
          if (!alreadyExists) {
            record.devices.push({
              deviceId,
              deviceName: deviceName || 'Connected Device',
              tokenHash: deviceTokenHash,
              lastActiveAt: new Date(),
            });
            await record.save();
          }
        }

        pairing.encryptedPayload = encryptedPayload;
        pairing.iv = iv;
        pairing.status = 'transferred';
        await pairing.save();

        return res.status(200).json({ success: true, message: 'Key payload transferred' });
      }

      // ==========================================
      // 8. QR PAIRING: STEP 5 - FETCH KEY & COMPLETE (Device B)
      // ==========================================
      case 'notebook-pair-fetch': {
        const pairingId = req.query.pairingId;
        if (!pairingId) return res.status(400).json({ success: false, error: 'Missing pairingId' });

        const pairing = await DevicePairing.findOne({ pairingId });
        if (!pairing) {
          return res.status(404).json({ success: false, error: 'Pairing session not found or expired' });
        }

        if (pairing.status !== 'transferred' || !pairing.encryptedPayload) {
          return res.status(202).json({ success: false, status: pairing.status, message: 'Awaiting host transfer' });
        }

        const result = {
          success: true,
          encryptedPayload: pairing.encryptedPayload,
          iv: pairing.iv,
        };

        // Complete and burn session immediately
        await DevicePairing.deleteOne({ _id: pairing._id });

        return res.status(200).json(result);
      }

      // ==========================================
      // 9. MANUAL PAIRING VIA RECOVERY KEY REGISTRATION
      // ==========================================
      case 'notebook-sync-register-device': {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const { syncGroupId, deviceId, deviceName, deviceToken } = body;

        if (!syncGroupId || !deviceId || !deviceToken) {
          return res.status(400).json({ success: false, error: 'Missing parameters' });
        }

        const tokenHash = hashToken(deviceToken);
        const record = await NotebookSync.findOne({ syncGroupId });
        if (!record) {
          return res.status(404).json({ success: false, error: 'Sync group not found' });
        }

        const existingDevice = record.devices.find((d) => d.deviceId === deviceId);
        if (existingDevice) {
          existingDevice.tokenHash = tokenHash;
          existingDevice.lastActiveAt = new Date();
          if (deviceName) existingDevice.deviceName = deviceName;
        } else {
          record.devices.push({
            deviceId,
            deviceName: deviceName || 'Manual Paired Device',
            tokenHash,
            lastActiveAt: new Date(),
          });
        }
        await record.save();

        return res.status(200).json({ success: true, message: 'Device successfully registered' });
      }

      default:
        return res.status(400).json({ success: false, error: `Unknown notebook-sync action: ${action}` });
    }
  } catch (err) {
    console.error('NotebookSync Handler Error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error', details: err.message });
  }
}

