import { db } from '../db/localDb';

let currentSyncStatus = typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'idle';
const listeners = new Set();
let debounceTimer = null;
let isSyncing = false;

export function getSyncStatus() {
  return currentSyncStatus;
}

export function subscribeSyncStatus(callback) {
  listeners.add(callback);
  callback(currentSyncStatus);
  return () => listeners.delete(callback);
}

function setSyncStatus(status) {
  currentSyncStatus = status;
  listeners.forEach((cb) => {
    try { cb(status); } catch {}
  });
}

/**
 * Perform Push + Pull Two-Way Synchronization with MongoDB
 */
export async function triggerSync() {
  if (isSyncing) return;
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    setSyncStatus('offline');
    return;
  }

  isSyncing = true;
  setSyncStatus('syncing');

  try {
    const changes = await db.syncQueue.toArray();
    const metaLastSynced = await db.meta.get('lastSyncedAt');
    const lastSyncedAt = metaLastSynced?.value || 0;

    let token = null;
    let syncGroupId = null;
    try {
      token = localStorage.getItem('stiknex_token');
      const rawIdentity = localStorage.getItem('stiknex_sync_identity');
      if (rawIdentity) syncGroupId = JSON.parse(rawIdentity)?.syncGroupId || null;
    } catch {}

    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/sync', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        changes,
        lastSyncedAt,
        syncGroupId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Sync request failed with HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      // 1. Remove synced changes from syncQueue
      if (Array.isArray(data.syncedIds) && data.syncedIds.length > 0) {
        await db.syncQueue.where('id').anyOf(data.syncedIds).delete();
      }

      // 2. Bulk upsert pulled server records into Dexie
      if (data.updates) {
        const collections = ['notes', 'whiteboards', 'notebooks'];
        for (const colName of collections) {
          const items = data.updates[colName];
          if (!Array.isArray(items) || !db[colName]) continue;

          for (const item of items) {
            const clientId = item.clientId || item.id;
            if (!clientId) continue;

            const local = await db[colName].get(clientId);
            // Last-Write-Wins: if local item was updated more recently, preserve local
            if (local && local.updatedAt && Number(local.updatedAt) > Number(item.updatedAt)) {
              continue;
            }

            if (item.isDeleted) {
              await db[colName].put({
                ...item,
                clientId,
                id: item.id || clientId,
                isDeleted: true,
              });
            } else {
              await db[colName].put({
                ...item,
                clientId,
                id: item.id || clientId,
                isDeleted: false,
              });
            }
          }
        }
      }

      // 3. Update lastSyncedAt timestamp
      if (data.serverTime) {
        await db.meta.put({ key: 'lastSyncedAt', value: data.serverTime });
      }

      setSyncStatus('synced');

      // Dispatch event for UI components to refresh data from Dexie
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('stiknex_sync_completed', { detail: data }));
      }

      // Reset to idle after 3 seconds of showing 'synced'
      setTimeout(() => {
        if (currentSyncStatus === 'synced') {
          setSyncStatus('idle');
        }
      }, 3000);
    } else {
      throw new Error(data.error || 'Server reported sync failure');
    }
  } catch (err) {
    console.warn('[SyncManager] Sync failed or offline:', err.message);
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setSyncStatus('offline');
    } else {
      setSyncStatus('error');
      // Automatically retry in the background after 15s with zero user interaction
      setTimeout(() => {
        if (typeof navigator !== 'undefined' && navigator.onLine) {
          triggerSync();
        }
      }, 15000);
    }
  } finally {
    isSyncing = false;
  }
}

/**
 * Schedule a debounced write-behind sync after a local mutation (6 seconds of user idle)
 * Prevents hammering MongoDB while actively typing or editing.
 */
export function scheduleDebouncedSync(delay = 6000) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    triggerSync();
  }, delay);
}

/**
 * Emergency background flush on tab close / hide using keepalive / sendBeacon
 */
export async function emergencyFlush() {
  try {
    const pending = await db.syncQueue.toArray();
    if (!pending || pending.length === 0) return;

    let token = null;
    let syncGroupId = null;
    try {
      token = localStorage.getItem('stiknex_token');
      const raw = localStorage.getItem('stiknex_sync_identity');
      if (raw) syncGroupId = JSON.parse(raw)?.syncGroupId || null;
    } catch {}

    const payload = JSON.stringify({
      changes: pending,
      lastSyncedAt: Date.now(),
      syncGroupId,
    });

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/sync', new Blob([payload], { type: 'application/json' }));
    } else {
      fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch (_) {}
}

/**
 * Initialize event listeners for network changes, idle batching, and tab close flush
 */
export function initSyncEngine() {
  if (typeof window === 'undefined') return;

  // Sync automatically as soon as internet reconnects or tab becomes active
  window.addEventListener('online', () => {
    setSyncStatus('idle');
    triggerSync();
  });

  window.addEventListener('offline', () => {
    setSyncStatus('offline');
  });

  window.addEventListener('focus', () => {
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      triggerSync();
    }
  });

  // Emergency flush on tab hide / browser minimize / navigation
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      emergencyFlush();
    } else if (typeof navigator !== 'undefined' && navigator.onLine) {
      triggerSync();
    }
  });

  // Emergency flush on tab close / browser quit
  window.addEventListener('pagehide', emergencyFlush);
  window.addEventListener('beforeunload', emergencyFlush);

  // Trigger initial sync on startup if online
  if (navigator.onLine) {
    setTimeout(() => {
      triggerSync();
    }, 2500);
  }

  // Gentle periodic background sync: every 3 minutes (180s) instead of 10s
  // Minimizes MongoDB load by 95% while keeping devices aligned
  setInterval(async () => {
    if (typeof navigator !== 'undefined' && navigator.onLine && !document.hidden) {
      try {
        triggerSync();
      } catch {}
    }
  }, 180000);
}

