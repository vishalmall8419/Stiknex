// Client-Side Sync Manager for Stiknex Online Notebook
// Handles Zero-Knowledge E2EE Cloud Sync, Multi-Device Pairing, and 3-Way Conflict Merging.

import {
  generateSyncKey,
  importSyncKey,
  deriveDeviceToken,
  encryptData,
  decryptData,
  generatePairingKey,
  importPairingKey,
} from './notebookCrypto';

import {
  saveImageToDb,
  getImageFromDb,
  saveDrawingToDb,
  getDrawingFromDb,
  saveExtendedNote,
  getExtendedNote,
} from './notebookStorage';

const SYNC_IDENTITY_KEY = 'stiknex_sync_identity';
const DEVICE_ID_KEY = 'stiknex_device_id';
const DEVICE_NAME_KEY = 'stiknex_device_name';
const NOTEBOOKS_KEY = 'stiknexNotebooks';
const SETTINGS_KEY = 'notebookSettings';

// Helper to get or create this device's unique ID
export function getOrCreateDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

// Detect human-friendly device name (e.g. "Chrome on Windows", "Safari on iPhone")
export function getDeviceName() {
  const saved = localStorage.getItem(DEVICE_NAME_KEY);
  if (saved) return saved;

  const ua = navigator.userAgent || '';
  let browser = 'Browser';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  let os = 'Device';
  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  const generated = `${browser} on ${os}`;
  localStorage.setItem(DEVICE_NAME_KEY, generated);
  return generated;
}

// Read current sync identity from local storage
export function getSyncIdentity() {
  try {
    const raw = localStorage.getItem(SYNC_IDENTITY_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Save sync identity
export function saveSyncIdentity(identity) {
  localStorage.setItem(SYNC_IDENTITY_KEY, JSON.stringify(identity));
}

// Clear sync identity (disconnect)
export function clearSyncIdentity() {
  localStorage.removeItem(SYNC_IDENTITY_KEY);
}

/**
 * Enables Cloud Sync for the first time on this device
 */
export async function enableCloudSync() {
  const deviceId = getOrCreateDeviceId();
  const deviceName = getDeviceName();

  const { cryptoKey, rawKeyHex, syncGroupId } = await generateSyncKey();
  const deviceToken = await deriveDeviceToken(rawKeyHex, deviceId);

  const identity = {
    syncGroupId,
    rawKeyHex,
    deviceId,
    deviceName,
    deviceToken,
    version: 1,
    lastSyncTime: Date.now(),
  };

  saveSyncIdentity(identity);

  // Initial push of existing local notes to cloud
  await pushToCloud(identity, cryptoKey);
  return identity;
}

/**
 * Connects an existing sync group using a Recovery Key (manual pairing)
 */
export async function connectWithRecoveryKey(recoveryKeyHex, customDeviceName) {
  const deviceId = getOrCreateDeviceId();
  const deviceName = customDeviceName || getDeviceName();

  const { cryptoKey, rawKeyHex, syncGroupId } = await importSyncKey(recoveryKeyHex);
  const deviceToken = await deriveDeviceToken(rawKeyHex, deviceId);

  // Register device with server
  const regRes = await fetch('/api/auth?action=notebook-sync-register-device', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      syncGroupId,
      deviceId,
      deviceName,
      deviceToken,
    }),
  });

  if (!regRes.ok) {
    const errData = await regRes.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to connect using recovery key.');
  }

  const identity = {
    syncGroupId,
    rawKeyHex,
    deviceId,
    deviceName,
    deviceToken,
    version: 1,
    lastSyncTime: Date.now(),
  };

  saveSyncIdentity(identity);

  // Pull latest notebooks from cloud
  await pullFromCloud(identity, cryptoKey);
  return identity;
}

/**
 * Collects local data to build encrypted sync payload
 */
export async function collectLocalPayload(version) {
  let notebooks = [];
  let stickyNotes = [];
  let stickyConnections = [];
  try {
    const raw = localStorage.getItem(NOTEBOOKS_KEY) || localStorage.getItem('stiknex_notebooks');
    if (raw) notebooks = JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse local notebooks:', e);
  }
  try {
    const raw = localStorage.getItem('notes');
    if (raw) stickyNotes = JSON.parse(raw);
    if (!Array.isArray(stickyNotes)) stickyNotes = [];
  } catch (e) {
    console.warn('Failed to parse local sticky notes:', e);
  }
  try {
    const raw = localStorage.getItem('stiknex_connections');
    if (raw) stickyConnections = JSON.parse(raw);
    if (!Array.isArray(stickyConnections)) stickyConnections = [];
  } catch (e) {
    console.warn('Failed to parse sticky note connections:', e);
  }

  // Fetch high-capacity full content from IndexedDB if available
  for (const nb of notebooks) {
    try {
      const fullContent = await getExtendedNote(nb.id);
      if (fullContent) {
        nb.content = fullContent;
      }
    } catch (e) {
      console.warn('Failed to read note from IndexedDB:', e);
    }
  }

  let settings = {};
  try {
    const raw = localStorage.getItem(SETTINGS_KEY) || localStorage.getItem('stiknex_notebook_settings');
    if (raw) settings = JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse notebook settings:', e);
  }

  // Gather drawing data for notebooks
  const drawings = {};
  for (const nb of notebooks) {
    try {
      const drawingData = (await getDrawingFromDb(nb.id)) || (await getImageFromDb(`drawing_${nb.id}`));
      if (drawingData) drawings[nb.id] = drawingData;
    } catch (e) {
      console.warn('Failed to read drawing data:', e);
    }
  }

  const stickyImages = {};
  for (const note of stickyNotes) {
    for (const image of note.images || []) {
      if (!image?.id) continue;
      try {
        const imageData = await getImageFromDb(image.id);
        if (!imageData) throw new Error(`Sticky note image ${image.id} is missing from browser storage.`);
        stickyImages[image.id] = imageData;
      } catch (e) {
        console.error('Failed to read sticky note image for sync:', e);
        throw e;
      }
    }
  }

  return {
    notebooks,
    stickyNotes,
    stickyImages,
    stickyConnections,
    settings,
    drawings,
    version: version || 1,
    deviceId: getOrCreateDeviceId(),
    deviceName: getDeviceName(),
    timestamp: Date.now(),
  };
}

/**
 * Pushes local state to cloud with E2EE
 */
export async function pushToCloud(customIdentity = null, customCryptoKey = null) {
  const identity = customIdentity || getSyncIdentity();
  if (!identity || !identity.rawKeyHex) return { success: false, reason: 'Sync not enabled' };

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { success: false, reason: 'Offline' };
  }

  try {
    const { cryptoKey } = customCryptoKey
      ? { cryptoKey: customCryptoKey }
      : await importSyncKey(identity.rawKeyHex);

    const payload = await collectLocalPayload(identity.version);
    const { ciphertext, iv } = await encryptData(payload, cryptoKey);

    const response = await fetch('/api/auth?action=notebook-sync-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        syncGroupId: identity.syncGroupId,
        ciphertext,
        iv,
        expectedVersion: identity.version,
        deviceId: identity.deviceId,
        deviceName: identity.deviceName,
        deviceToken: identity.deviceToken,
      }),
    });

    if (response.status === 409) {
      // Conflict: Server has a newer version. Perform 3-way merge!
      const conflictData = await response.json();
      return handleConflictResolution(identity, cryptoKey, conflictData);
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: err.error || 'Sync push failed' };
    }

    const data = await response.json();
    identity.version = data.version;
    identity.lastSyncTime = Date.now();
    saveSyncIdentity(identity);

    return { success: true, version: data.version };
  } catch (err) {
    console.error('pushToCloud error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Pulls latest state from cloud with E2EE
 */
export async function pullFromCloud(customIdentity = null, customCryptoKey = null) {
  const identity = customIdentity || getSyncIdentity();
  if (!identity || !identity.rawKeyHex) return { success: false, reason: 'Sync not enabled' };

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { success: false, reason: 'Offline' };
  }

  try {
    const response = await fetch(
      `/api/auth?action=notebook-sync-pull&syncGroupId=${encodeURIComponent(identity.syncGroupId)}&deviceId=${encodeURIComponent(
        identity.deviceId
      )}&token=${encodeURIComponent(identity.deviceToken)}`
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: err.error || 'Sync pull failed' };
    }

    const data = await response.json();
    if (!data.ciphertext || !data.iv) {
      return { success: true, message: 'No remote data yet' };
    }

    const { cryptoKey } = customCryptoKey
      ? { cryptoKey: customCryptoKey }
      : await importSyncKey(identity.rawKeyHex);

    const remotePayload = await decryptData(data.ciphertext, data.iv, cryptoKey);
    await applyRemotePayload(remotePayload);

    identity.version = data.version;
    identity.lastSyncTime = Date.now();
    identity.devices = data.devices || [];
    saveSyncIdentity(identity);

    // Notify UI to refresh content
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('stiknex_notebook_synced', { detail: { remotePayload } }));
    }

    return { success: true, version: data.version, devices: data.devices };
  } catch (err) {
    console.error('pullFromCloud error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 3-Way Merge for resolving concurrent edits across devices
 */
async function handleConflictResolution(identity, cryptoKey, conflictData) {
  try {
    const remotePayload = await decryptData(conflictData.ciphertext, conflictData.iv, cryptoKey);
    const localPayload = await collectLocalPayload(identity.version);

    // Merge notebooks list
    const remoteList = remotePayload.notebooks || [];
    const localList = localPayload.notebooks || [];
    const mergedList = [...localList];

    for (const rNote of remoteList) {
      const localIdx = mergedList.findIndex((n) => n.id === rNote.id);
      if (localIdx === -1) {
        // Remote note created on another device -> Add it
        mergedList.push(rNote);
      } else {
        const lNote = mergedList[localIdx];
        if (lNote.content !== rNote.content) {
          // Both devices edited the same note!
          // Preserve local version and preserve remote version as a conflict copy
          if ((rNote.updatedAt || 0) > (lNote.updatedAt || 0)) {
            mergedList[localIdx] = rNote;
            mergedList.push({
              ...lNote,
              id: 'conflict_' + Math.random().toString(36).substring(2, 9),
              title: `${lNote.title} (Local conflict copy)`,
              updatedAt: Date.now(),
            });
          } else {
            mergedList.push({
              ...rNote,
              id: 'conflict_' + Math.random().toString(36).substring(2, 9),
              title: `${rNote.title} (Cloud copy from ${remotePayload.deviceName || 'another device'})`,
              updatedAt: Date.now(),
            });
          }
        }
      }
    }

    const mergedStickyNotes = new Map(
      (Array.isArray(localPayload.stickyNotes) ? localPayload.stickyNotes : [])
        .map((note) => [note.id, note]),
    );
    for (const remoteNote of Array.isArray(remotePayload.stickyNotes) ? remotePayload.stickyNotes : []) {
      if (!remoteNote?.id) continue;
      const localNote = mergedStickyNotes.get(remoteNote.id);
      if (!localNote || (remoteNote.updatedAt || 0) > (localNote.updatedAt || 0)) {
        mergedStickyNotes.set(remoteNote.id, remoteNote);
      }
    }
    const stickyNotes = [...mergedStickyNotes.values()];
    const stickyImages = {
      ...(remotePayload.stickyImages || {}),
      ...(localPayload.stickyImages || {}),
    };
    const stickyConnections = [...new Map(
      [
        ...(Array.isArray(remotePayload.stickyConnections) ? remotePayload.stickyConnections : []),
        ...(Array.isArray(localPayload.stickyConnections) ? localPayload.stickyConnections : []),
      ].filter((connection) => connection?.id).map((connection) => [connection.id, connection]),
    ).values()];

    // Merge drawings
    const mergedDrawings = { ...(remotePayload.drawings || {}), ...(localPayload.drawings || {}) };

    // Apply merged state locally
    localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(mergedList));
    localStorage.setItem('notes', JSON.stringify(stickyNotes));
    localStorage.setItem('stiknex_connections', JSON.stringify(stickyConnections));
    for (const nb of mergedList) {
      if (nb.id && nb.content) {
        await saveExtendedNote(nb.id, nb.content);
      }
    }
    for (const [noteId, dataUrl] of Object.entries(mergedDrawings)) {
      await saveDrawingToDb(noteId, dataUrl);
      await saveImageToDb(`drawing_${noteId}`, dataUrl);
    }
    for (const [imageId, dataUrl] of Object.entries(stickyImages)) {
      if (!(await saveImageToDb(imageId, dataUrl))) {
        throw new Error(`Could not save synchronized sticky note image ${imageId}.`);
      }
    }
    localStorage.setItem('notes', JSON.stringify(stickyNotes));
    localStorage.setItem('stiknex_connections', JSON.stringify(stickyConnections));

    // Push the merged resolution to server with the latest server version
    identity.version = conflictData.serverVersion;
    const resolvedPayload = {
      notebooks: mergedList,
      stickyNotes,
      stickyImages,
      stickyConnections,
      settings: localPayload.settings,
      drawings: mergedDrawings,
      version: identity.version,
      deviceId: identity.deviceId,
      deviceName: identity.deviceName,
      timestamp: Date.now(),
    };

    const { ciphertext, iv } = await encryptData(resolvedPayload, cryptoKey);
    const pushRes = await fetch('/api/auth?action=notebook-sync-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        syncGroupId: identity.syncGroupId,
        ciphertext,
        iv,
        expectedVersion: identity.version,
        deviceId: identity.deviceId,
        deviceName: identity.deviceName,
        deviceToken: identity.deviceToken,
      }),
    });

    if (pushRes.ok) {
      const resData = await pushRes.json();
      identity.version = resData.version;
      identity.lastSyncTime = Date.now();
      saveSyncIdentity(identity);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('stiknex_notebook_synced', { detail: { remotePayload: resolvedPayload } }));
      }
      return { success: true, resolved: true, version: resData.version };
    }

    return { success: false, error: 'Failed to push resolved merge' };
  } catch (err) {
    console.error('handleConflictResolution error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Applies decrypted remote payload to local IndexedDB and localStorage
 */
async function applyRemotePayload(payload) {
  if (!payload) return;

  if (payload.stickyImages && typeof payload.stickyImages === 'object') {
    for (const [imageId, dataUrl] of Object.entries(payload.stickyImages)) {
      if (typeof dataUrl === 'string' && !(await saveImageToDb(imageId, dataUrl))) {
        throw new Error(`Could not save synchronized sticky note image ${imageId}.`);
      }
    }
  }

  if (Array.isArray(payload.stickyNotes)) {
    localStorage.setItem('notes', JSON.stringify(payload.stickyNotes));
  }
  if (Array.isArray(payload.stickyConnections)) {
    localStorage.setItem('stiknex_connections', JSON.stringify(payload.stickyConnections));
  }

  if (Array.isArray(payload.notebooks)) {
    localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(payload.notebooks));
    for (const nb of payload.notebooks) {
      if (nb.id && nb.content) {
        await saveExtendedNote(nb.id, nb.content);
      }
    }
  }

  if (payload.settings && typeof payload.settings === 'object') {
    try {
      const existing = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...existing, ...payload.settings }));
    } catch (e) {
      console.warn('Failed to parse existing settings:', e);
    }
  }

  if (payload.drawings && typeof payload.drawings === 'object') {
    for (const [noteId, dataUrl] of Object.entries(payload.drawings)) {
      await saveDrawingToDb(noteId, dataUrl);
      await saveImageToDb(`drawing_${noteId}`, dataUrl);
    }
  }
}

// ==============================================================
// QR PAIRING LIFECYCLE (Host Device A)
// ==============================================================

/**
 * Starts a 5-minute ephemeral QR pairing session on Device A
 */
export async function createQRPairingSession() {
  if (!getSyncIdentity()) await enableCloudSync();

  const pairingId = 'pair_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
  const { cryptoKey: pairingCryptoKey, pairingKeyHex } = await generatePairingKey();

  const res = await fetch('/api/auth?action=notebook-pair-create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pairingId }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to create pairing session. Please verify connection.');
  }

  // The pairing key is in the hash (#) so it is NEVER sent to the server in HTTP headers
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://stiknex.site';
  const pairingUrl = `${origin}/online-notebook?pair=${encodeURIComponent(pairingId)}#${pairingKeyHex}`;

  return {
    pairingId,
    pairingKeyHex,
    pairingCryptoKey,
    pairingUrl,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };
}

/**
 * Device A polls to check if Device B scanned the QR code and claimed the session
 */
export async function checkPairingStatus(pairingId) {
  try {
    const res = await fetch(`/api/auth?action=notebook-pair-check&pairingId=${encodeURIComponent(pairingId)}`);
    if (res.status === 404) {
      // Treat transient 404 as pending so polling does not prematurely abort the active QR code
      return { status: 'pending', notFound: true };
    }
    if (!res.ok) {
      // Return pending on 500, 502, 429 so polling does NOT prematurely abort the QR code
      return { status: 'pending', transientError: true, statusCode: res.status };
    }
    return await res.json();
  } catch (err) {
    return { status: 'pending', transientError: true, error: err.message };
  }
}

/**
 * Device A transfers encrypted sync credentials to Device B
 */
export async function transferPairingCredentials(pairingId, pairingCryptoKey, claimedDevice) {
  const identity = getSyncIdentity();
  if (!identity) throw new Error('No sync identity found');

  // Derive device token for Device B
  const deviceToken = await deriveDeviceToken(identity.rawKeyHex, claimedDevice.deviceId);
  const enc = new TextEncoder();
  const tokenDigest = await window.crypto.subtle.digest('SHA-256', enc.encode(deviceToken));
  const deviceTokenHash = Array.from(new Uint8Array(tokenDigest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const secretPayload = {
    syncGroupId: identity.syncGroupId,
    rawKeyHex: identity.rawKeyHex,
    deviceId: claimedDevice.deviceId,
    deviceName: claimedDevice.deviceName,
    deviceToken,
  };

  const { ciphertext: encryptedPayload, iv } = await encryptData(secretPayload, pairingCryptoKey);

  const res = await fetch('/api/auth?action=notebook-pair-transfer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pairingId,
      encryptedPayload,
      iv,
      syncGroupId: identity.syncGroupId,
      deviceId: claimedDevice.deviceId,
      deviceName: claimedDevice.deviceName,
      deviceTokenHash,
    }),
  });

  if (!res.ok) throw new Error('Failed to transfer pairing credentials.');
  return { success: true };
}

// ==============================================================
// QR PAIRING LIFECYCLE (Client Device B)
// ==============================================================

/**
 * Device B scans QR code and completes pairing
 */
export async function joinPairingSession(pairingId, pairingKeyHex, customDeviceName) {
  const deviceId = getOrCreateDeviceId();
  const deviceName = customDeviceName || getDeviceName();

  const pairingCryptoKey = await importPairingKey(pairingKeyHex);

  // 1. Claim session
  const claimRes = await fetch('/api/auth?action=notebook-pair-claim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pairingId,
      deviceId,
      deviceName,
    }),
  });

  if (!claimRes.ok) {
    const err = await claimRes.json().catch(() => ({}));
    throw new Error(err.error || 'Pairing session is invalid or has expired.');
  }

  // 2. Poll for transferred key (timeout 45s)
  const startTime = Date.now();
  let payload = null;

  while (Date.now() - startTime < 45000) {
    await new Promise((r) => setTimeout(r, 1200));
    const fetchRes = await fetch(`/api/auth?action=notebook-pair-fetch&pairingId=${encodeURIComponent(pairingId)}`);
    if (fetchRes.status === 200) {
      const data = await fetchRes.json();
      if (data.encryptedPayload && data.iv) {
        payload = await decryptData(data.encryptedPayload, data.iv, pairingCryptoKey);
        break;
      }
    }
  }

  if (!payload || !payload.rawKeyHex || !payload.syncGroupId) {
    throw new Error('Pairing timed out. Please try scanning the QR code again.');
  }

  const identity = {
    syncGroupId: payload.syncGroupId,
    rawKeyHex: payload.rawKeyHex,
    deviceId,
    deviceName,
    deviceToken: payload.deviceToken,
    version: 1,
    lastSyncTime: Date.now(),
  };

  saveSyncIdentity(identity);

  // Pull all encrypted notes immediately
  await pullFromCloud(identity);

  return identity;
}

/**
 * Revokes a device from the sync group
 */
export async function revokeDevice(targetDeviceId) {
  const identity = getSyncIdentity();
  if (!identity) throw new Error('Not connected to cloud sync');

  const res = await fetch('/api/auth?action=notebook-sync-revoke-device', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      syncGroupId: identity.syncGroupId,
      deviceId: identity.deviceId,
      deviceToken: identity.deviceToken,
      targetDeviceId,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to revoke device');
  }

  const data = await res.json();
  identity.devices = data.remainingDevices;
  saveSyncIdentity(identity);
  return data;
}
