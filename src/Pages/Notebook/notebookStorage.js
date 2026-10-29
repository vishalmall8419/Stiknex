// IndexedDB Storage Helper for Stiknex Online Notebook
// Allows storing high-resolution pasted images and large notes
// without exceeding the browser's 5MB localStorage quota.

const DB_NAME = "stiknex_notebook_db";
const DB_VERSION = 1;
const IMAGE_STORE = "images";
const NOTE_STORE = "notes_extended";

let dbPromise = null;

function getDb() {
  if (dbPromise) return dbPromise;
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.resolve(null);
  }

  dbPromise = new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IMAGE_STORE)) {
          db.createObjectStore(IMAGE_STORE, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(NOTE_STORE)) {
          db.createObjectStore(NOTE_STORE, { keyPath: "id" });
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });

  return dbPromise;
}

/**
 * Saves an image data URL or blob to IndexedDB
 */
export async function saveImageToDb(id, dataUrl) {
  try {
    const db = await getDb();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(IMAGE_STORE, "readwrite");
      const store = tx.objectStore(IMAGE_STORE);
      store.put({ id, data: dataUrl, updatedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Retrieves an image by its ID from IndexedDB
 */
export async function getImageFromDb(id) {
  try {
    const db = await getDb();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(IMAGE_STORE, "readonly");
      const store = tx.objectStore(IMAGE_STORE);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Deletes an image from IndexedDB
 */
export async function deleteImageFromDb(id) {
  try {
    const db = await getDb();
    if (!db) return;
    const tx = db.transaction(IMAGE_STORE, "readwrite");
    tx.objectStore(IMAGE_STORE).delete(id);
  } catch {
    // Ignore error
  }
}

/**
 * Safely writes extended content to IndexedDB if localStorage fails
 */
export async function saveExtendedNote(id, html) {
  try {
    const db = await getDb();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(NOTE_STORE, "readwrite");
      tx.objectStore(NOTE_STORE).put({ id, html, updatedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Retrieves extended content from IndexedDB
 */
export async function getExtendedNote(id) {
  try {
    const db = await getDb();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(NOTE_STORE, "readonly");
      const req = tx.objectStore(NOTE_STORE).get(id);
      req.onsuccess = () => resolve(req.result ? req.result.html : null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Saves canvas drawing for a note
 */
export async function saveDrawingToDb(noteId, dataUrl) {
  return saveImageToDb(`drawing_${noteId}`, dataUrl);
}

/**
 * Retrieves canvas drawing for a note
 */
export async function getDrawingFromDb(noteId) {
  return getImageFromDb(`drawing_${noteId}`);
}

/**
 * Deletes canvas drawing for a note
 */
export async function deleteDrawingFromDb(noteId) {
  return deleteImageFromDb(`drawing_${noteId}`);
}


