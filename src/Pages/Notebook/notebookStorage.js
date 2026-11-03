// IndexedDB Storage Helper for Stiknex Online Notebook
// Allows storing high-resolution pasted images and large notes
// without exceeding the browser's 5MB localStorage quota.

const DB_NAME = "stiknex_notebook_db";
const DB_VERSION = 2;
const IMAGE_STORE = "images";
const NOTE_STORE = "notes_extended";

let dbPromise = null;

function getDb() {
  if (dbPromise) return dbPromise;
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.resolve(null);
  }

  dbPromise = new Promise((resolve) => {
    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.warn("IndexedDB open timed out, falling back to localStorage.");
        resolve(null);
      }
    }, 1500);

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
      request.onblocked = () => {
        console.warn("IndexedDB upgrade blocked by another open tab.");
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          resolve(null);
        }
      };
      request.onsuccess = (e) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          const db = e.target.result;
          db.onversionchange = () => {
            db.close();
            dbPromise = null;
          };
          if (navigator.storage?.persist) {
            navigator.storage.persist().then((granted) => {
              if (!granted) {
                console.warn("Browser storage may be cleared when device storage is low.");
              }
            }).catch((error) => {
              console.warn("Could not request persistent browser storage:", error);
            });
          }
          resolve(db);
        }
      };
      request.onerror = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          console.error("Could not open notebook IndexedDB:", request.error);
          dbPromise = null;
          resolve(null);
        }
      };
    } catch {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        dbPromise = null;
        resolve(null);
      }
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
    if (!db || !db.objectStoreNames.contains(NOTE_STORE)) return false;
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
  const db = await getDb();
  if (!db || !db.objectStoreNames.contains(NOTE_STORE)) return null;
  return new Promise((resolve) => {
    const tx = db.transaction(NOTE_STORE, "readonly");
    const req = tx.objectStore(NOTE_STORE).get(id);
    req.onsuccess = () => resolve(req.result ? req.result.html : null);
    req.onerror = () => resolve(null);
    tx.onerror = () => resolve(null);
  });
}

export async function deleteExtendedNote(id) {
  try {
    const db = await getDb();
    if (!db || !db.objectStoreNames.contains(NOTE_STORE)) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(NOTE_STORE, "readwrite");
      tx.objectStore(NOTE_STORE).delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

export async function saveNotebookComments(notebookId, comments) {
  try {
    const db = await getDb();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(NOTE_STORE, "readwrite");
      tx.objectStore(NOTE_STORE).put({
        id: `comments_${notebookId}`,
        comments,
        updatedAt: Date.now(),
      });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

export async function getNotebookComments(notebookId) {
  try {
    const db = await getDb();
    if (!db || !db.objectStoreNames.contains(NOTE_STORE)) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(NOTE_STORE, "readonly");
      const req = tx.objectStore(NOTE_STORE).get(`comments_${notebookId}`);
      req.onsuccess = () => resolve(Array.isArray(req.result?.comments) ? req.result.comments : null);
      req.onerror = () => resolve(null);
      tx.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function deleteNotebookComments(notebookId) {
  return deleteExtendedNote(`comments_${notebookId}`);
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
  try {
    const db = await getDb();
    if (!db || !db.objectStoreNames.contains(IMAGE_STORE)) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(IMAGE_STORE, "readonly");
      const req = tx.objectStore(IMAGE_STORE).get(`drawing_${noteId}`);
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => resolve(null);
      tx.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Deletes canvas drawing for a note
 */
export async function deleteDrawingFromDb(noteId) {
  return deleteImageFromDb(`drawing_${noteId}`);
}
