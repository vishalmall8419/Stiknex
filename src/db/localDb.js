import Dexie from 'dexie';

export const db = new Dexie('StiknexLocalDb');

db.version(1).stores({
  notes: 'clientId, id, updatedAt, isDeleted, trashedAt',
  whiteboards: 'clientId, id, updatedAt, isDeleted',
  notebooks: 'clientId, id, updatedAt, isDeleted',
  typingResults: 'clientId, userId, wpm, updatedAt, isDeleted',
  reviews: 'clientId, updatedAt, isDeleted',
  syncQueue: '++id, clientId, action, collection, updatedAt',
  meta: 'key'
});

/**
 * Generate client UUID safely in browser environment
 */
export function generateClientId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Queue a local mutation with smart queue coalescing
 */
export async function enqueueSyncOperation({ collection, action, clientId, payload = {} }) {
  const updatedAt = payload.updatedAt || Date.now();

  try {
    const existing = await db.syncQueue
      .where('clientId')
      .equals(clientId)
      .and(item => item.collection === collection)
      .first();

    if (existing) {
      if (action === 'DELETE') {
        if (existing.action === 'CREATE') {
          // Never sent to server, simply remove from syncQueue
          await db.syncQueue.delete(existing.id);
          return;
        } else {
          // Exists on server, update queue to soft-delete
          await db.syncQueue.update(existing.id, {
            action: 'DELETE',
            payload: { ...existing.payload, ...payload, isDeleted: true, updatedAt },
            updatedAt
          });
          return;
        }
      }

      if (existing.action === 'CREATE') {
        // Retain CREATE action but update payload to latest state
        await db.syncQueue.update(existing.id, {
          payload: { ...existing.payload, ...payload, updatedAt },
          updatedAt
        });
        return;
      }

      // Existing UPDATE
      await db.syncQueue.update(existing.id, {
        action: 'UPDATE',
        payload: { ...existing.payload, ...payload, updatedAt },
        updatedAt
      });
      return;
    }

    // Add new queued operation
    await db.syncQueue.add({
      clientId,
      action,
      collection,
      payload: { ...payload, clientId, updatedAt },
      updatedAt
    });
  } catch (err) {
    console.error('[Dexie SyncQueue] Error enqueuing operation:', err);
  }
}

/**
 * Migrate legacy localStorage notes and whiteboards into Dexie
 */
export async function migrateLocalStorageToDexie() {
  try {
    const metaMigration = await db.meta.get('hasMigratedLocalStorage');
    if (metaMigration?.value) return;

    // Migrate Sticky Notes
    try {
      const rawNotes = localStorage.getItem('notes');
      if (rawNotes) {
        const parsedNotes = JSON.parse(rawNotes);
        if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
          const formatted = parsedNotes.map((n, idx) => {
            const clientId = n.clientId || n.id || generateClientId();
            return {
              ...n,
              clientId,
              id: n.id || clientId,
              zIndex: n.zIndex !== undefined ? n.zIndex : idx + 1,
              isDeleted: false,
              updatedAt: n.updatedAt || Date.now(),
              createdAt: n.createdAt || Date.now(),
            };
          });
          await db.notes.bulkPut(formatted);
          console.log(`[Dexie Migration] Migrated ${formatted.length} notes from localStorage.`);
        }
      }
    } catch (noteErr) {
      console.warn('[Dexie Migration] Notes migration error:', noteErr);
    }

    // Migrate Whiteboards
    try {
      const rawWb = localStorage.getItem('whiteboards');
      if (rawWb) {
        const parsedWb = JSON.parse(rawWb);
        if (Array.isArray(parsedWb) && parsedWb.length > 0) {
          const formattedWb = parsedWb.map((wb) => {
            const clientId = wb.clientId || wb.id || generateClientId();
            return {
              ...wb,
              clientId,
              id: wb.id || clientId,
              title: wb.title || 'Untitled Drawing',
              isDeleted: false,
              updatedAt: wb.updatedAt || Date.now(),
              createdAt: wb.createdAt || Date.now(),
            };
          });
          await db.whiteboards.bulkPut(formattedWb);
          console.log(`[Dexie Migration] Migrated ${formattedWb.length} whiteboards from localStorage.`);
        }
      }
    } catch (wbErr) {
      console.warn('[Dexie Migration] Whiteboards migration error:', wbErr);
    }

    await db.meta.put({ key: 'hasMigratedLocalStorage', value: true });
  } catch (err) {
    console.warn('[Dexie Migration] Migration failed:', err);
  }
}
