import { io } from "socket.io-client";
import { db } from "../db/localDb";
import { getOrCreateDeviceId, getDeviceName, getSyncIdentity } from "../Pages/Notebook/notebookSyncManager";

let socket = null;
let broadcastChannel = null;
const listeners = new Set();

// Determine socket server target
function getSocketUrl() {
  if (typeof window === "undefined") return null;

  const rawEnv = import.meta.env.VITE_SOCKET_URL;
  if (
    rawEnv &&
    typeof rawEnv === "string" &&
    !rawEnv.includes("5173") &&
    (rawEnv.startsWith("http://") || rawEnv.startsWith("https://") || rawEnv.startsWith("ws://") || rawEnv.startsWith("wss://"))
  ) {
    return rawEnv;
  }

  try {
    const custom = localStorage.getItem("stiknex_custom_socket_url");
    if (custom && !custom.includes("5173")) {
      return custom;
    } else if (custom) {
      localStorage.removeItem("stiknex_custom_socket_url");
    }
  } catch {}

  // Auto-connect to local socket server if running on localhost / 127.0.0.1 or local network
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.") || hostname.startsWith("10.") || hostname.startsWith("172.")) {
    return `http://${hostname}:5000`;
  }

  // On production serverless hosting (Vercel) without an external socket relay,
  // return null so it falls back cleanly to native BroadcastChannel and adaptive cloud sync.
  return null;
}

/**
 * Initialize Socket.io client and multi-tab BroadcastChannel
 */
export function initSocketService() {
  if (typeof window === "undefined") return null;
  if (socket) return socket;

  // Initialize native local multi-tab mesh
  try {
    if (typeof BroadcastChannel !== "undefined") {
      broadcastChannel = new BroadcastChannel("stiknex_mesh_channel");
      broadcastChannel.onmessage = (event) => {
        handleIncomingMeshMessage(event.data, true);
      };
    }
  } catch (err) {
    console.warn("[BroadcastChannel] Not supported:", err);
  }

  const socketUrl = getSocketUrl();
  if (!socketUrl) {
    // In production on Vercel without an external socket relay, native BroadcastChannel
    // and adaptive cloud polling handle sync without throwing WebSocket connection errors.
    console.log("[Realtime Sync] Active via Local Mesh Channel & Cloud Synchronization.");
    return null;
  }

  console.log("[Socket.io] Connecting to realtime mesh at:", socketUrl);

  let warnedConnectionError = false;
  let connectionFailures = 0;

  try {
    socket = io(socketUrl, {
      transports: ["websocket"],
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: 2,
      reconnectionDelay: 5000,
      timeout: 3000,
      autoConnect: true,
    });
  } catch (err) {
    console.warn("[Socket.io] Init warning:", err);
    return null;
  }

  socket.on("connect", () => {
    warnedConnectionError = false;
    connectionFailures = 0;
    console.log("[Socket.io] Connected to realtime mesh with id:", socket.id);
    joinCurrentMesh();
  });

  socket.on("connect_error", (error) => {
    connectionFailures++;
    if (!warnedConnectionError) {
      console.info("[Socket.io] Realtime server offline. Using local BroadcastChannel & Cloud sync fallback.");
      warnedConnectionError = true;
    }
    // Disconnect after 2 failed tries so console doesn't spam errors when local dev server isn't running
    if (connectionFailures >= 2) {
      try {
        socket.disconnect();
      } catch {}
    }
  });

  // Listen to remote changes
  socket.on("remote_note_change", (data) => {
    handleIncomingNoteChange(data);
  });

  socket.on("remote_whiteboard_change", (data) => {
    handleIncomingWhiteboardChange(data);
  });

  socket.on("remote_notebook_change", (data) => {
    handleIncomingNotebookChange(data);
  });

  socket.on("remote_yjs_update", (data) => {
    handleIncomingYjsUpdate(data);
  });

  socket.on("remote_feedback_received", (data) => {
    handleIncomingFeedback(data);
  });

  socket.on("devices_updated", (data) => {
    if (data?.devices && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("stiknex_devices_updated", { detail: data }));
    }
  });

  return socket;
}

/**
 * Join current user and sync group rooms
 */
export function joinCurrentMesh() {
  if (!socket || !socket.connected) return;

  let user = null;
  try {
    const raw = localStorage.getItem("stiknex_user");
    if (raw) user = JSON.parse(raw);
  } catch {}

  const syncIdentity = getSyncIdentity();
  const deviceId = getOrCreateDeviceId();
  const deviceName = getDeviceName();

  const userId = user?.id || user?._id || null;
  const syncGroupId = syncIdentity?.syncGroupId || user?.syncGroupId || null;

  if (userId || syncGroupId) {
    socket.emit("join_mesh", {
      userId,
      syncGroupId,
      deviceId,
      deviceName,
    });
  }
}

/**
 * Handle incoming note change (from Socket or BroadcastChannel)
 */
async function handleIncomingNoteChange(data) {
  if (!data || !data.note) return;
  const currentDeviceId = getOrCreateDeviceId();
  if (data.originDeviceId === currentDeviceId) return;

  const { note, action } = data;
  try {
    if (action === "DELETE" || note.isDeleted) {
      await db.notes.put({ ...note, isDeleted: true });
    } else {
      await db.notes.put({ ...note, isDeleted: false });
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("stiknex_realtime_note", { detail: { note, action } }));
    }
  } catch (err) {
    console.warn("[Socket.io] Error applying note change:", err);
  }
}

/**
 * Handle incoming whiteboard change
 */
async function handleIncomingWhiteboardChange(data) {
  if (!data || !data.whiteboard) return;
  const currentDeviceId = getOrCreateDeviceId();
  if (data.originDeviceId === currentDeviceId) return;

  const { whiteboard, action } = data;
  try {
    if (action === "DELETE" || whiteboard.isDeleted) {
      await db.whiteboards.put({ ...whiteboard, isDeleted: true });
    } else {
      await db.whiteboards.put({ ...whiteboard, isDeleted: false });
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("stiknex_realtime_whiteboard", { detail: { whiteboard, action } }));
    }
  } catch (err) {
    console.warn("[Socket.io] Error applying whiteboard change:", err);
  }
}

/**
 * Handle incoming notebook change
 */
function handleIncomingNotebookChange(data) {
  if (!data) return;
  const currentDeviceId = getOrCreateDeviceId();
  if (data.originDeviceId === currentDeviceId || data.deviceId === currentDeviceId) return;

  const { notebook, notebooks, comments } = data;
  if (notebook?.id && notebook?.content) {
    try {
      localStorage.setItem(`nb_content_${notebook.id}`, notebook.content);
    } catch {}
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("stiknex_notebook_synced", {
        detail: {
          remotePayload: {
            notebooks: Array.isArray(notebooks) ? notebooks : (notebook ? [notebook] : []),
            comments: comments || {},
          },
        },
      })
    );
  }
}

function handleIncomingMeshMessage(message, isLocalBroadcast = false) {
  if (!message || typeof message !== "object") return;
  if (message.type === "NOTE_CHANGE") {
    handleIncomingNoteChange(message.data);
  } else if (message.type === "WHITEBOARD_CHANGE") {
    handleIncomingWhiteboardChange(message.data);
  } else if (message.type === "NOTEBOOK_CHANGE") {
    handleIncomingNotebookChange(message.data);
  } else if (message.type === "YJS_UPDATE") {
    handleIncomingYjsUpdate(message.data);
  } else if (message.type === "FEEDBACK_SUBMITTED") {
    handleIncomingFeedback(message.data);
  }
}

/**
 * Handle incoming feedback or direct message broadcast
 */
function handleIncomingFeedback(data) {
  if (!data) return;
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("stiknex_remote_feedback", {
        detail: data,
      })
    );
  }
}

/**
 * Handle incoming real-time Yjs CRDT delta update (< 0.02s)
 */
function handleIncomingYjsUpdate(data) {
  if (!data || !data.update) return;
  const currentDeviceId = getOrCreateDeviceId();
  if (data.originDeviceId === currentDeviceId || data.deviceId === currentDeviceId) return;

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("stiknex_remote_yjs_update", {
        detail: data,
      })
    );
  }
}

/**
 * Emit Sticky Note change to Socket.io and local BroadcastChannel
 */
export function emitRealtimeNoteChange(note, action = "UPSERT") {
  const currentDeviceId = getOrCreateDeviceId();
  const syncIdentity = getSyncIdentity();
  let user = null;
  try {
    const raw = localStorage.getItem("stiknex_user");
    if (raw) user = JSON.parse(raw);
  } catch {}

  const data = {
    userId: user?.id || user?._id || null,
    syncGroupId: syncIdentity?.syncGroupId || user?.syncGroupId || null,
    note,
    action,
    deviceId: currentDeviceId,
  };

  // 1. Broadcast to other tabs on same machine (0.001s)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: "NOTE_CHANGE", data });
    } catch {}
  }

  // 2. Broadcast via Socket.io to all other devices (< 0.05s)
  if (socket && socket.connected) {
    socket.emit("note_change", data);
  }
}

/**
 * Emit Whiteboard change to Socket.io and local BroadcastChannel
 */
export function emitRealtimeWhiteboardChange(whiteboard, action = "UPSERT") {
  const currentDeviceId = getOrCreateDeviceId();
  const syncIdentity = getSyncIdentity();
  let user = null;
  try {
    const raw = localStorage.getItem("stiknex_user");
    if (raw) user = JSON.parse(raw);
  } catch {}

  const data = {
    userId: user?.id || user?._id || null,
    syncGroupId: syncIdentity?.syncGroupId || user?.syncGroupId || null,
    whiteboard,
    action,
    deviceId: currentDeviceId,
  };

  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: "WHITEBOARD_CHANGE", data });
    } catch {}
  }

  if (socket && socket.connected) {
    socket.emit("whiteboard_change", data);
  }
}

/**
 * Emit Notebook change to Socket.io and local BroadcastChannel
 */
export function emitRealtimeNotebookChange(notebookData) {
  const currentDeviceId = getOrCreateDeviceId();
  const syncIdentity = getSyncIdentity();
  let user = null;
  try {
    const raw = localStorage.getItem("stiknex_user");
    if (raw) user = JSON.parse(raw);
  } catch {}

  const data = {
    userId: user?.id || user?._id || null,
    syncGroupId: syncIdentity?.syncGroupId || user?.syncGroupId || null,
    ...notebookData,
    deviceId: currentDeviceId,
    originDeviceId: currentDeviceId,
  };

  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: "NOTEBOOK_CHANGE", data });
    } catch {}
  }

  if (socket && socket.connected) {
    socket.emit("notebook_change", data);
  }
}

/**
 * Emit Yjs CRDT delta update to Socket.io and local BroadcastChannel (< 0.02s latency)
 */
export function emitRealtimeYjsUpdate({ notebookId, update }) {
  const currentDeviceId = getOrCreateDeviceId();
  const syncIdentity = getSyncIdentity();
  let user = null;
  try {
    const raw = localStorage.getItem("stiknex_user");
    if (raw) user = JSON.parse(raw);
  } catch {}

  const data = {
    userId: user?.id || user?._id || null,
    syncGroupId: syncIdentity?.syncGroupId || user?.syncGroupId || null,
    notebookId,
    update,
    deviceId: currentDeviceId,
    originDeviceId: currentDeviceId,
  };

  // 1. BroadcastChannel: instant (< 1ms) to other tabs/windows on same device
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: "YJS_UPDATE", data });
    } catch {}
  }

  // 2. Socket.io: ultra-fast (< 20ms) to phone, tablet, and remote laptops
  if (socket && socket.connected) {
    socket.emit("yjs_update", data);
  }
}

/**
 * Emit Feedback or User Direct Message via Socket.io and local BroadcastChannel (< 20ms)
 */
export function emitRealtimeFeedback(feedbackPayload) {
  const currentDeviceId = getOrCreateDeviceId();
  const data = {
    ...feedbackPayload,
    originDeviceId: currentDeviceId,
    timestamp: Date.now(),
  };

  // 1. BroadcastChannel: instant (< 1ms)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: "FEEDBACK_SUBMITTED", data });
    } catch {}
  }

  // 2. Socket.io: instant (< 20ms)
  const activeSocket = getSocket();
  if (activeSocket && activeSocket.connected) {
    activeSocket.emit("user_feedback", data);
  } else {
    initSocketService();
    if (socket) {
      socket.emit("user_feedback", data);
    }
  }

  // 3. Local UI notification event
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("stiknex_remote_feedback", {
        detail: data,
      })
    );
  }
}
