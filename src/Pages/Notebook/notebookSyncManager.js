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
  getAllImagesFromDb,
  saveDrawingToDb,
  getDrawingFromDb,
  saveExtendedNote,
  getExtendedNote,
  saveNotebookComments,
  getNotebookComments,
} from './notebookStorage';

const SYNC_IDENTITY_KEY = 'stiknex_sync_identity';
const DEVICE_ID_KEY = 'stiknex_device_id';
const DEVICE_NAME_KEY = 'stiknex_device_name';
const NOTEBOOKS_KEY = 'stiknexNotebooks';
const SETTINGS_KEY = 'notebookSettings';

function notebookMetadata(notebooks) {
  return notebooks.map((notebook) => ({ ...notebook, content: '' }));
}

// Tombstone tracking for robust distributed deletes (prevents deleted items from resurrecting)
export function recordDeletedNotebookId(id) {
  if (!id) return;
  try {
    const raw = localStorage.getItem('stiknex_deleted_notebook_ids');
    const map = raw ? JSON.parse(raw) : {};
    map[id] = Date.now();
    localStorage.setItem('stiknex_deleted_notebook_ids', JSON.stringify(map));
  } catch {}
}

export function getDeletedNotebookIds() {
  try {
    const raw = localStorage.getItem('stiknex_deleted_notebook_ids');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordDeletedNoteId(id) {
  if (!id) return;
  try {
    const raw = localStorage.getItem('stiknex_deleted_note_ids');
    const map = raw ? JSON.parse(raw) : {};
    map[id] = Date.now();
    localStorage.setItem('stiknex_deleted_note_ids', JSON.stringify(map));
  } catch {}
}

export function getDeletedNoteIds() {
  try {
    const raw = localStorage.getItem('stiknex_deleted_note_ids');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

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

  // Save identity immediately so it persists locally
  saveSyncIdentity(identity);

  // Initial push of existing local notes to cloud (non-blocking)
  try {
    const syncResult = await pushToCloud(identity, cryptoKey);
    if (!syncResult.success) {
      console.warn('Initial sync push notice:', syncResult.error || syncResult.reason);
    }
  } catch (pushErr) {
    console.warn('Initial push non-blocking notice:', pushErr);
  }

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

  // Pull latest notebooks from cloud
  const syncResult = await pullFromCloud(identity, cryptoKey);
  if (!syncResult.success) {
    throw new Error(syncResult.error || 'Failed to load the recovery-key sync group.');
  }
  return identity;
}

/**
 * Automatically links and synchronizes a logged-in user's account
 * with Multi-Device Cloud Sync, registering the device and syncing data
 */
export async function linkAccountSync(user) {
  if (!user || !user.syncGroupId || !user.syncKeyHex) return null;

  const deviceId = getOrCreateDeviceId();
  const deviceName = getDeviceName();

  const { cryptoKey, rawKeyHex } = await importSyncKey(user.syncKeyHex);
  const deviceToken = await deriveDeviceToken(rawKeyHex, deviceId);

  // 1. Register device with server so it appears in "Paired Devices"
  try {
    await fetch('/api/auth?action=notebook-sync-register-device', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        syncGroupId: user.syncGroupId,
        deviceId,
        deviceName,
        deviceToken,
      }),
    });
  } catch (regErr) {
    console.warn('Account device registration notice:', regErr);
  }

  const identity = {
    syncGroupId: user.syncGroupId,
    rawKeyHex: user.syncKeyHex,
    deviceId,
    deviceName,
    deviceToken,
    version: 1,
    lastSyncTime: Date.now(),
    accountLinked: true,
    userEmail: user.email,
  };

  saveSyncIdentity(identity);

  // 2. Pull remote notebooks from cloud and merge with local notes
  try {
    await pullFromCloud(identity, cryptoKey);
    await pushToCloud(identity, cryptoKey);
  } catch (syncErr) {
    console.warn('Account sync initial pull/push notice:', syncErr);
  }

  return identity;
}

/**
 * Collects local data to build encrypted sync payload
 */
export async function collectLocalPayload(version) {
  let notebooks = [];
  let stickyNotes = [];
  let stickyConnections = [];
  const comments = {};
  try {
    const raw = localStorage.getItem(NOTEBOOKS_KEY) || localStorage.getItem('stiknex_notebooks');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) notebooks = parsed;
    }
  } catch (e) {
    console.warn('Failed to read local notebooks for sync:', e);
  }
  try {
    const raw = localStorage.getItem('notes');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) stickyNotes = parsed;
    }
  } catch (e) {
    console.warn('Failed to read local sticky notes for sync:', e);
  }
  try {
    const raw = localStorage.getItem('stiknex_connections');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) stickyConnections = parsed;
    }
  } catch (e) {
    console.warn('Failed to read sticky-note connections for sync:', e);
  }

  // Fetch high-capacity full content from IndexedDB if available
  for (const nb of notebooks) {
    try {
      const fullContent = await getExtendedNote(nb.id);
      if (fullContent) {
        nb.content = fullContent;
      }
    } catch (e) {
      console.warn('Failed to read notebook content from IndexedDB:', e);
    }

    if (!nb.content) {
      try {
        const cached = localStorage.getItem(`nb_content_${nb.id}`);
        if (cached) nb.content = cached;
      } catch (_) {}
    }

    try {
      const nbComments = await getNotebookComments(nb.id);
      if (Array.isArray(nbComments)) {
        comments[nb.id] = nbComments;
      } else {
        const rawComments = localStorage.getItem(`nb_comments_${nb.id}`);
        comments[nb.id] = rawComments ? JSON.parse(rawComments) : [];
      }
    } catch (e) {
      console.warn('Failed to read notebook comments for sync:', e);
      comments[nb.id] = [];
    }
  }

  let settings = {};
  try {
    const raw = localStorage.getItem(SETTINGS_KEY) || localStorage.getItem('stiknex_notebook_settings');
    if (raw) settings = JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse notebook settings for sync:', e);
  }

  // Gather drawing data for notebooks
  const drawings = {};
  for (const nb of notebooks) {
    try {
      const drawingData = (await getDrawingFromDb(nb.id)) || (await getImageFromDb(`drawing_${nb.id}`));
      if (drawingData) drawings[nb.id] = drawingData;
    } catch (e) {
      console.warn('Failed to read notebook drawing for sync:', e);
    }
  }

  // Gather all images from IndexedDB (both sticky notes and notebooks)
  let allStoredImages = {};
  try {
    allStoredImages = await getAllImagesFromDb();
  } catch (e) {
    console.warn('Failed to read stored images for sync:', e);
  }

  const stickyImages = { ...allStoredImages };
  for (const note of stickyNotes) {
    for (const image of note.images || []) {
      if (!image?.id) continue;
      try {
        const imageData = await getImageFromDb(image.id);
        if (imageData) {
          stickyImages[image.id] = imageData;
        }
      } catch (e) {
        console.warn('Failed to read sticky note image for sync:', e);
      }
    }
  }

  // Filter out any locally deleted notebooks and sticky notes to prevent resurrection
  const deletedNotebookIds = getDeletedNotebookIds();
  const deletedNoteIds = getDeletedNoteIds();
  notebooks = notebooks.filter((nb) => nb?.id && !deletedNotebookIds[nb.id]);
  stickyNotes = stickyNotes.filter((sn) => sn?.id && !deletedNoteIds[sn.id]);

  return {
    notebooks,
    deletedNotebookIds,
    deletedNoteIds,
    comments,
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
      const message = response.status === 413
        ? 'Cloud sync payload is too large for the API request limit. Reduce large attachments before syncing.'
        : err.error || `Sync push failed (HTTP ${response.status}).`;
      return { success: false, error: message };
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
    if (!data.ciphertext || !data.iv || data.ciphertext === 'init') {
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

    // Track tombstones across both devices to prevent deleted items from resurrecting
    const deletedNotebooks = {
      ...getDeletedNotebookIds(),
      ...(remotePayload.deletedNotebookIds || {}),
    };
    const deletedNotes = {
      ...getDeletedNoteIds(),
      ...(remotePayload.deletedNoteIds || {}),
    };
    try {
      localStorage.setItem('stiknex_deleted_notebook_ids', JSON.stringify(deletedNotebooks));
      localStorage.setItem('stiknex_deleted_note_ids', JSON.stringify(deletedNotes));
    } catch {}

    // Merge notebooks list (strictly excluding deleted ones)
    const remoteList = (remotePayload.notebooks || []).filter((n) => n?.id && !deletedNotebooks[n.id]);
    const localList = (localPayload.notebooks || []).filter((n) => n?.id && !deletedNotebooks[n.id]);
    const mergedList = [...localList];

    for (const rNote of remoteList) {
      let localIdx = mergedList.findIndex((n) => n.id === rNote.id);
      if (localIdx === -1 && rNote.title) {
        // Also match by normalized title so different IDs for the same notebook are merged in-place
        const rTitleNorm = rNote.title.trim().toLowerCase();
        localIdx = mergedList.findIndex((n) => n.title && n.title.trim().toLowerCase() === rTitleNorm);
      }

      if (localIdx === -1) {
        // Remote note created on another device -> Add it
        mergedList.push(rNote);
        if (rNote.id && rNote.content) {
          try {
            localStorage.setItem(`nb_content_${rNote.id}`, rNote.content);
          } catch {}
          saveExtendedNote(rNote.id, rNote.content).catch(() => {});
        }
      } else {
        const lNote = mergedList[localIdx];
        const canonicalId = rNote.id || lNote.id;

        // Zero-Conflict Content-Aware Scheduling Algorithm:
        // 1. Content Preservation Check: If one note has substantive content and the other is empty / whitespace,
        //    ALWAYS preserve the note with content! Never overwrite real content with empty data.
        const lHasContent = lNote.content && lNote.content.replace(/<[^>]+>/g, '').trim().length > 0;
        const rHasContent = rNote.content && rNote.content.replace(/<[^>]+>/g, '').trim().length > 0;

        let winningContent = lNote.content;
        let winningNote = lNote;

        if (rHasContent && !lHasContent) {
          // Remote has real content, local is empty -> Remote wins in-place
          winningContent = rNote.content;
          winningNote = rNote;
        } else if (lHasContent && !rHasContent) {
          // Local has real content, remote is empty -> Local wins in-place
          winningContent = lNote.content;
          winningNote = lNote;
        } else {
          // Both have content -> FIFO / Timestamp Scheduling: newest version cleanly updates in-place!
          if ((rNote.updatedAt || 0) >= (lNote.updatedAt || 0)) {
            winningContent = rNote.content;
            winningNote = rNote;
          } else {
            winningContent = lNote.content;
            winningNote = lNote;
          }
        }

        mergedList[localIdx] = {
          ...lNote,
          ...winningNote,
          id: canonicalId,
          title: rNote.title || lNote.title,
          content: winningContent,
          updatedAt: Math.max(lNote.updatedAt || 0, rNote.updatedAt || 0, Date.now()),
        };

        // Cache winning content under both IDs and title
        try {
          localStorage.setItem(`nb_content_${canonicalId}`, winningContent);
          if (lNote.id && lNote.id !== canonicalId) localStorage.setItem(`nb_content_${lNote.id}`, winningContent);
          if (rNote.id && rNote.id !== canonicalId) localStorage.setItem(`nb_content_${rNote.id}`, winningContent);
        } catch {}
        saveExtendedNote(canonicalId, winningContent).catch(() => {});
      }
    }

    const mergedStickyNotes = new Map(
      (Array.isArray(localPayload.stickyNotes) ? localPayload.stickyNotes : [])
        .filter((note) => note?.id && !deletedNotes[note.id])
        .map((note) => [note.id, note]),
    );
    for (const remoteNote of Array.isArray(remotePayload.stickyNotes) ? remotePayload.stickyNotes : []) {
      if (!remoteNote?.id || deletedNotes[remoteNote.id]) continue;
      const localNote = mergedStickyNotes.get(remoteNote.id);
      if (!localNote) {
        mergedStickyNotes.set(remoteNote.id, remoteNote);
      } else if ((remoteNote.updatedAt || 0) > (localNote.updatedAt || 0)) {
        const lText = localNote.text || localNote.content || "";
        const rText = remoteNote.text || remoteNote.content || "";
        if (lText && !rText) {
          mergedStickyNotes.set(remoteNote.id, { ...remoteNote, text: lText, content: lText });
        } else {
          mergedStickyNotes.set(remoteNote.id, remoteNote);
        }
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
    const mergedComments = {};
    for (const notebookId of new Set([
      ...Object.keys(remotePayload.comments || {}),
      ...Object.keys(localPayload.comments || {}),
    ])) {
      mergedComments[notebookId] = [...new Map([
        ...(remotePayload.comments?.[notebookId] || []),
        ...(localPayload.comments?.[notebookId] || []),
      ].filter((comment) => comment?.id).map((comment) => [comment.id, comment])).values()];
    }

    // Merge drawings
    const mergedDrawings = { ...(remotePayload.drawings || {}), ...(localPayload.drawings || {}) };

    // Apply merged state locally
    localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(notebookMetadata(mergedList)));
    localStorage.setItem('notes', JSON.stringify(stickyNotes));
    localStorage.setItem('stiknex_connections', JSON.stringify(stickyConnections));
    for (const [notebookId, notebookComments] of Object.entries(mergedComments)) {
      if (!(await saveNotebookComments(notebookId, notebookComments))) {
        throw new Error(`Could not save comments for notebook ${notebookId} to IndexedDB.`);
      }
      localStorage.setItem(`nb_comments_${notebookId}`, JSON.stringify(notebookComments));
    }
    for (const nb of mergedList) {
      if (nb.id && nb.content) {
        if (!(await saveExtendedNote(nb.id, nb.content))) {
          throw new Error(`Could not save notebook ${nb.id} to IndexedDB.`);
        }
      }
    }
    for (const [noteId, dataUrl] of Object.entries(mergedDrawings)) {
      if (!(await saveDrawingToDb(noteId, dataUrl)) || !(await saveImageToDb(`drawing_${noteId}`, dataUrl))) {
        throw new Error(`Could not save drawing for notebook ${noteId} to IndexedDB.`);
      }
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
      comments: mergedComments,
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

  // 1. Merge tombstones from remote payload to prevent deleted items from resurrecting
  const remoteDelNbs = payload.deletedNotebookIds || {};
  const remoteDelNotes = payload.deletedNoteIds || {};
  const mergedDelNbs = { ...getDeletedNotebookIds(), ...remoteDelNbs };
  const mergedDelNotes = { ...getDeletedNoteIds(), ...remoteDelNotes };
  try {
    localStorage.setItem('stiknex_deleted_notebook_ids', JSON.stringify(mergedDelNbs));
    localStorage.setItem('stiknex_deleted_note_ids', JSON.stringify(mergedDelNotes));
  } catch {}

  // 2. Sticky Images
  if (payload.stickyImages && typeof payload.stickyImages === 'object') {
    for (const [imageId, dataUrl] of Object.entries(payload.stickyImages)) {
      if (typeof dataUrl === 'string') {
        await saveImageToDb(imageId, dataUrl).catch(() => {});
      }
    }
  }

  // 3. Smart Merge Sticky Notes: Never resurrect deleted notes, never overwrite newer local notes or replace text with empty
  if (Array.isArray(payload.stickyNotes)) {
    let localNotes = [];
    try {
      const raw = localStorage.getItem('notes');
      if (raw) localNotes = JSON.parse(raw);
    } catch {}

    const noteMap = new Map();
    // Start with local notes that are NOT deleted
    for (const lNote of (Array.isArray(localNotes) ? localNotes : [])) {
      if (lNote?.id && !mergedDelNotes[lNote.id] && !lNote.isDeleted) {
        noteMap.set(lNote.id, lNote);
      }
    }

    // Merge in remote notes
    for (const rNote of payload.stickyNotes) {
      if (!rNote?.id || mergedDelNotes[rNote.id] || rNote.isDeleted) continue;
      const lNote = noteMap.get(rNote.id);
      if (!lNote) {
        noteMap.set(rNote.id, rNote);
      } else {
        const lTime = lNote.updatedAt || 0;
        const rTime = rNote.updatedAt || 0;
        const lText = lNote.text || lNote.content || '';
        const rText = rNote.text || rNote.content || '';

        // If remote has empty text but local has text, preserve local text!
        if (lText && !rText) {
          noteMap.set(rNote.id, { ...rNote, text: lText, content: lText });
        } else if (rTime >= lTime) {
          noteMap.set(rNote.id, rNote);
        }
      }
    }

    const mergedNotes = Array.from(noteMap.values());
    try {
      localStorage.setItem('notes', JSON.stringify(mergedNotes));
    } catch {}
  }

  if (Array.isArray(payload.stickyConnections)) {
    localStorage.setItem('stiknex_connections', JSON.stringify(payload.stickyConnections));
  }

  // 4. Smart Merge Notebooks: Strictly exclude deleted notebooks, preserve active local unsaved edits
  if (Array.isArray(payload.notebooks)) {
    let localNotes = [];
    try {
      const raw = localStorage.getItem(NOTEBOOKS_KEY);
      if (raw) localNotes = JSON.parse(raw);
    } catch {}

    // Filter out deleted notebooks
    const validRemote = payload.notebooks.filter((nb) => nb?.id && !mergedDelNbs[nb.id]);

    for (const nb of validRemote) {
      if (nb.id && nb.content) {
        try {
          const existingContent = localStorage.getItem(`nb_content_${nb.id}`) || '';
          // Don't overwrite if existing local content has real text and remote is empty
          if (!existingContent || nb.content.trim()) {
            localStorage.setItem(`nb_content_${nb.id}`, nb.content);
            await saveExtendedNote(nb.id, nb.content);
          }
        } catch {}

        // Check if existing local note had the same title with another ID
        if (nb.title) {
          const titleNorm = nb.title.trim().toLowerCase();
          const localMatch = localNotes.find(
            (l) => l.title && l.title.trim().toLowerCase() === titleNorm && l.id !== nb.id
          );
          if (localMatch && !mergedDelNbs[localMatch.id]) {
            try {
              localStorage.setItem(`nb_content_${localMatch.id}`, nb.content);
              await saveExtendedNote(localMatch.id, nb.content);
            } catch {}
          }
        }
      }
    }

    // Merge notebook list preserving local notebooks that aren't on remote yet
    const nbMap = new Map();
    for (const lNb of localNotes) {
      if (lNb?.id && !mergedDelNbs[lNb.id]) {
        nbMap.set(lNb.id, lNb);
      }
    }
    for (const rNb of validRemote) {
      if (!nbMap.has(rNb.id) || (rNb.updatedAt || 0) >= (nbMap.get(rNb.id).updatedAt || 0)) {
        nbMap.set(rNb.id, rNb);
      }
    }
    const mergedNbList = Array.from(nbMap.values());
    try {
      localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(notebookMetadata(mergedNbList)));
    } catch {}
  }

  if (payload.comments && typeof payload.comments === 'object') {
    for (const [notebookId, notebookComments] of Object.entries(payload.comments)) {
      if (!(await saveNotebookComments(notebookId, notebookComments))) {
        throw new Error(`Could not save comments for notebook ${notebookId} to IndexedDB.`);
      }
      localStorage.setItem(`nb_comments_${notebookId}`, JSON.stringify(notebookComments));
    }
  }

  if (payload.settings && typeof payload.settings === 'object') {
    try {
      const existing = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...existing, ...payload.settings }));
    } catch (e) {
      console.error('Failed to restore notebook settings:', e);
      throw e;
    }
  }

  if (payload.drawings && typeof payload.drawings === 'object') {
    for (const [noteId, dataUrl] of Object.entries(payload.drawings)) {
      if (!(await saveDrawingToDb(noteId, dataUrl)) || !(await saveImageToDb(`drawing_${noteId}`, dataUrl))) {
        throw new Error(`Could not save drawing for notebook ${noteId} to IndexedDB.`);
      }
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
  const identity = getSyncIdentity();
  if (!identity) {
    await enableCloudSync();
  } else {
    try {
      const syncResult = await pushToCloud(identity);
      if (!syncResult.success) {
        console.warn('Pre-pairing push notice:', syncResult.error || syncResult.reason);
      }
    } catch (pushErr) {
      console.warn('Pre-pairing push non-blocking notice:', pushErr);
    }
  }

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
  const pairingOrigin = new URL(typeof window !== 'undefined' ? window.location.origin : 'https://stiknex.site');
  if (pairingOrigin.protocol === 'http:' && pairingOrigin.hostname !== 'localhost' && pairingOrigin.hostname !== '127.0.0.1') {
    pairingOrigin.protocol = 'https:';
  }
  if (pairingOrigin.hostname === 'stiknex.site' || pairingOrigin.hostname.endsWith('stiknex.site')) {
    pairingOrigin.protocol = 'https:';
  }
  const devLanHost = import.meta.env.VITE_DEV_LAN_HOST;
  if (
    import.meta.env.DEV &&
    devLanHost &&
    (pairingOrigin.hostname === 'localhost' || pairingOrigin.hostname === '127.0.0.1')
  ) {
    pairingOrigin.hostname = devLanHost;
  }
  const pairingUrl = `${pairingOrigin.origin}/online-notebook?pair=${encodeURIComponent(pairingId)}#${pairingKeyHex}`;

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

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to transfer pairing credentials.');
  }
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
    } else if (fetchRes.status !== 202) {
      const err = await fetchRes.json().catch(() => ({}));
      throw new Error(err.error || 'The pairing session is no longer available.');
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

  // Only persist the new identity after confirming the cloud group is available.
  const syncResult = await pullFromCloud(identity);
  if (!syncResult.success) {
    throw new Error(syncResult.error || 'Could not load the existing sync group.');
  }

  return { success: true, identity };
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
