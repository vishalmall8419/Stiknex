import { useEffect, useRef, useState, useCallback } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";

const DEFAULT_WS_URL =
  import.meta.env.VITE_WS_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "ws://localhost:5000/yjs"
    : "");

/**
 * Computes minimal common-prefix/common-suffix diff so Y.Text updates
 * preserve cursor positions and avoid full-document replacement undo glitches.
 */
function applyMinimalTextDiff(ydoc, ytext, nextText) {
  if (typeof nextText !== "string") return;
  const prevText = ytext.toString();
  if (prevText === nextText) return;

  let prefix = 0;
  const minLen = Math.min(prevText.length, nextText.length);
  while (prefix < minLen && prevText.charCodeAt(prefix) === nextText.charCodeAt(prefix)) {
    prefix++;
  }

  let suffix = 0;
  while (
    suffix < minLen - prefix &&
    prevText.charCodeAt(prevText.length - 1 - suffix) ===
      nextText.charCodeAt(nextText.length - 1 - suffix)
  ) {
    suffix++;
  }

  const deleteLen = prevText.length - prefix - suffix;
  const insertText = nextText.slice(prefix, nextText.length - suffix);

  ydoc.transact(() => {
    if (deleteLen > 0) ytext.delete(prefix, deleteLen);
    if (insertText.length > 0) ytext.insert(prefix, insertText);
  }, "local");
}

/**
 * Real-time, conflict-free, local-first multi-device note sync using
 * Yjs + y-indexeddb + y-websocket.
 */
export function useSyncedNote(noteId, userId, token, initialContent = "", onRemoteContent = null) {
  const [syncStatus, setSyncStatus] = useState(() =>
    typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "syncing"
  );

  const ydocRef = useRef(null);
  const ytextRef = useRef(null);
  const onRemoteRef = useRef(onRemoteContent);
  const initialContentRef = useRef(initialContent);

  useEffect(() => {
    onRemoteRef.current = onRemoteContent;
  }, [onRemoteContent]);

  useEffect(() => {
    initialContentRef.current = initialContent;
  }, [initialContent]);

  useEffect(() => {
    if (!noteId) return;

    const roomName = userId ? `user_${userId}_note_${noteId}` : `local_note_${noteId}`;
    const ydoc = new Y.Doc();
    const ytext = ydoc.getText("content");
    ydocRef.current = ydoc;
    ytextRef.current = ytext;

    const idbProvider = new IndexeddbPersistence(`stiknex_yjs_${roomName}`, ydoc);
    let wsProvider = null;

    idbProvider.on("synced", () => {
      if (ytext.length === 0 && initialContentRef.current) {
        ydoc.transact(() => {
          ytext.insert(0, initialContentRef.current);
        }, "init");
      } else if (ytext.length > 0 && !initialContentRef.current && onRemoteRef.current) {
        onRemoteRef.current(ytext.toString());
      }
      if (!userId || !token || !DEFAULT_WS_URL) {
        setSyncStatus(typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "synced");
      }
    });

    const handleTextObserve = (_event, transaction) => {
      if (transaction.origin !== "local" && transaction.origin !== "init") {
        if (onRemoteRef.current) {
          onRemoteRef.current(ytext.toString());
        }
      }
    };
    ytext.observe(handleTextObserve);

    if (userId && token && DEFAULT_WS_URL) {
      setSyncStatus(typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "syncing");
      wsProvider = new WebsocketProvider(DEFAULT_WS_URL, roomName, ydoc, {
        params: { token },
        connect: typeof navigator === "undefined" ? true : navigator.onLine,
      });

      wsProvider.on("status", ({ status }) => {
        if (status === "disconnected") {
          setSyncStatus(typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "syncing");
        } else if (status === "connecting") {
          setSyncStatus("syncing");
        }
      });

      wsProvider.on("sync", (isSynced) => {
        if (isSynced) {
          setSyncStatus("synced");
        }
      });
    }

    const handleOnline = () => {
      if (wsProvider) {
        setSyncStatus("syncing");
        wsProvider.connect();
      } else {
        setSyncStatus("synced");
      }
    };

    const handleOffline = () => {
      setSyncStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      ytext.unobserve(handleTextObserve);
      if (wsProvider) {
        wsProvider.destroy();
      }
      idbProvider.destroy();
      ydoc.destroy();
      if (ydocRef.current === ydoc) ydocRef.current = null;
      if (ytextRef.current === ytext) ytextRef.current = null;
    };
  }, [noteId, userId, token]);

  const applyLocalText = useCallback((nextText) => {
    if (!ydocRef.current || !ytextRef.current) return;
    applyMinimalTextDiff(ydocRef.current, ytextRef.current, nextText);
  }, []);

  return {
    syncStatus,
    applyLocalText,
  };
}
