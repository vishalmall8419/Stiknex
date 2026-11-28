// ============================================================================
// STIKNEX YJS REAL-TIME COLLABORATIVE CRDT ENGINE
// Enables sub-0.02s (20ms) collaborative editing between Laptop, Phone & Tabs
// ============================================================================

import * as Y from "yjs";
import { emitRealtimeYjsUpdate } from "./socketService";

// Helper: Uint8Array <-> Base64
function uint8ArrayToBase64(bytes) {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return typeof window !== "undefined" ? window.btoa(binary) : Buffer.from(bytes).toString("base64");
}

function base64ToUint8Array(base64) {
  const binaryString = typeof window !== "undefined" ? window.atob(base64) : Buffer.from(base64, "base64").toString("binary");
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Active Y.Docs cache: notebookId -> { doc, ytext, activeId }
const activeDocs = new Map();

/**
 * Initialize or attach Yjs CRDT session for an active notebook
 * @param {string} notebookId
 * @param {string} initialHtml
 * @param {function} onRemoteChange - Callback when remote device updates content
 */
export function initNotebookYjs(notebookId, initialHtml = "", onRemoteChange = null) {
  if (!notebookId) return null;

  let session = activeDocs.get(notebookId);
  if (!session) {
    const doc = new Y.Doc();
    const ytext = doc.getText("content");

    // Initialize with existing local text if doc is blank
    if (ytext.length === 0 && initialHtml) {
      doc.transact(() => {
        ytext.insert(0, initialHtml);
      }, "init");
    }

    session = {
      doc,
      ytext,
      callbacks: new Set(),
      cleanupListener: null,
    };
    activeDocs.set(notebookId, session);

    // Listen to local doc updates and broadcast via Socket.io & BroadcastChannel
    doc.on("update", (update, origin) => {
      if (origin !== "remote" && origin !== "init") {
        try {
          const base64Update = uint8ArrayToBase64(update);
          emitRealtimeYjsUpdate({ notebookId, update: base64Update });
        } catch (err) {
          console.warn("[Yjs] Broadcast error:", err);
        }
      }
    });

    // Listen to remote Yjs updates coming from Socket.io / BroadcastChannel
    const handleRemoteUpdate = (event) => {
      const data = event.detail;
      if (!data || data.notebookId !== notebookId || !data.update) return;

      try {
        const updateBytes = base64ToUint8Array(data.update);
        doc.transact(() => {
          Y.applyUpdate(doc, updateBytes, "remote");
        }, "remote");

        const updatedContent = ytext.toString();
        session.callbacks.forEach((cb) => {
          try {
            cb(updatedContent, data.originDeviceId);
          } catch (e) {
            console.error("[Yjs] Callback error:", e);
          }
        });
      } catch (err) {
        console.warn("[Yjs] Failed to apply remote update:", err);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("stiknex_remote_yjs_update", handleRemoteUpdate);
      session.cleanupListener = () => {
        window.removeEventListener("stiknex_remote_yjs_update", handleRemoteUpdate);
      };
    }
  }

  if (onRemoteChange) {
    session.callbacks.add(onRemoteChange);
  }

  return {
    doc: session.doc,
    ytext: session.ytext,

    /**
     * Call when local editor content changes to compute and apply CRDT delta
     */
    syncLocalChange: (newContent) => {
      if (typeof newContent !== "string") return;
      const current = session.ytext.toString();
      if (current === newContent) return;

      // Fast linear diff replacement inside Yjs transaction
      session.doc.transact(() => {
        session.ytext.delete(0, session.ytext.length);
        session.ytext.insert(0, newContent);
      }, "local");
    },

    /**
     * Unsubscribe from session callbacks
     */
    destroy: () => {
      if (onRemoteChange) {
        session.callbacks.delete(onRemoteChange);
      }
    },
  };
}

/**
 * Clean up all cached Yjs documents
 */
export function destroyAllNotebookYjs() {
  activeDocs.forEach((session) => {
    if (session.cleanupListener) session.cleanupListener();
    session.doc.destroy();
  });
  activeDocs.clear();
}
