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
    try {
      token = localStorage.getItem('stiknex_token');
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
    }
  } finally {
    isSyncing = false;
  }
}

/**
 * Schedule a debounced sync after a local mutation (2 seconds)
 */
export function scheduleDebouncedSync(delay = 2000) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    triggerSync();
  }, delay);
}

/**
 * Initialize event listeners for network changes and app startup
 */
export function initSyncEngine() {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    console.log('[SyncManager] Online detected. Starting sync...');
    setSyncStatus('idle');
    triggerSync();
  });

  window.addEventListener('offline', () => {
    console.log('[SyncManager] Offline mode active.');
    setSyncStatus('offline');
  });

  // Trigger initial sync on startup if online
  if (navigator.onLine) {
    setTimeout(() => {
      triggerSync();
    }, 1500);
  }
}

