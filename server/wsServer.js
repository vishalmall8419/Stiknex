import { WebSocketServer } from "ws";
import * as Y from "yjs";
import * as syncProtocol from "y-protocols/sync";
import * as awarenessProtocol from "y-protocols/awareness";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import YjsNote from "./models/YjsNote.js";

const MSG_SYNC = 0;
const MSG_AWARENESS = 1;
const PERSIST_DEBOUNCE_MS = 2500;

// Active rooms: roomName -> { doc, awareness, conns: Map<ws, Set<number>>, persistTimer, loadingPromise }
const rooms = new Map();

function isMongoReady() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

function parseRoomName(roomName) {
  const match = /^user_([^_]+)_note_(.+)$/.exec(roomName || "");
  if (!match) return null;
  return { userId: match[1], noteId: match[2] };
}

function verifyToken(req, urlObj) {
  const secret = process.env.JWT_SECRET;
  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const queryToken = urlObj.searchParams.get("token") || "";
  const token = bearerToken || queryToken;

  if (!token || !secret) return null;
  try {
    const decoded = jwt.verify(token, secret);
    const userId = String(decoded.userId || decoded.id || decoded._id || "");
    if (!userId) return null;
    return { userId, decoded };
  } catch {
    return null;
  }
}

async function persistRoomToMongo(roomName, doc) {
  if (!isMongoReady()) return;
  const parsed = parseRoomName(roomName);
  if (!parsed) return;

  try {
    const encodedState = Buffer.from(Y.encodeStateAsUpdate(doc));
    const plainContent = doc.getText("content").toString();

    await YjsNote.findOneAndUpdate(
      { roomName },
      {
        $set: {
          roomName,
          userId: parsed.userId,
          noteId: parsed.noteId,
          yjsState: encodedState,
          content: plainContent,
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error(`[Yjs] Failed to persist room ${roomName}:`, err.message);
  }
}

function schedulePersist(roomName, room) {
  if (room.persistTimer) clearTimeout(room.persistTimer);
  room.persistTimer = setTimeout(() => {
    room.persistTimer = null;
    persistRoomToMongo(roomName, room.doc);
  }, PERSIST_DEBOUNCE_MS);
}

async function getOrCreateRoom(roomName) {
  let room = rooms.get(roomName);
  if (room) {
    await room.loadingPromise;
    return room;
  }

  const doc = new Y.Doc();
  const awareness = new awarenessProtocol.Awareness(doc);
  awareness.setLocalState(null);

  room = {
    doc,
    awareness,
    conns: new Map(),
    persistTimer: null,
    loadingPromise: null,
  };

  room.loadingPromise = (async () => {
    if (isMongoReady()) {
      try {
        const existing = await YjsNote.findOne({ roomName }).lean();
        if (existing?.yjsState) {
          const stateBytes = existing.yjsState.buffer
            ? new Uint8Array(existing.yjsState.buffer, existing.yjsState.byteOffset, existing.yjsState.byteLength)
            : new Uint8Array(existing.yjsState);
          if (stateBytes.byteLength > 0) {
            Y.applyUpdate(doc, stateBytes, "mongodb-init");
          }
        } else if (existing?.content) {
          doc.transact(() => {
            doc.getText("content").insert(0, existing.content);
          }, "mongodb-init");
        }
      } catch (err) {
        console.warn(`[Yjs] Could not load state for ${roomName}:`, err.message);
      }
    }
  })();

  doc.on("update", (update, origin) => {
    if (origin !== "mongodb-init") {
      schedulePersist(roomName, room);
    }

    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MSG_SYNC);
    syncProtocol.writeUpdate(encoder, update);
    const message = encoding.toUint8Array(encoder);

    room.conns.forEach((_, clientWs) => {
      if (clientWs !== origin && clientWs.readyState === 1) {
        clientWs.send(message);
      }
    });
  });

  awareness.on("update", ({ added, updated, removed }, origin) => {
    const changedClients = added.concat(updated, removed);
    if (origin && room.conns.has(origin)) {
      const controlledIds = room.conns.get(origin);
      added.forEach((id) => controlledIds.add(id));
      removed.forEach((id) => controlledIds.delete(id));
    }

    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MSG_AWARENESS);
    encoding.writeVarUint8Array(
      encoder,
      awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients)
    );
    const message = encoding.toUint8Array(encoder);

    room.conns.forEach((_, clientWs) => {
      if (clientWs.readyState === 1) {
        clientWs.send(message);
      }
    });
  });

  rooms.set(roomName, room);
  await room.loadingPromise;
  return room;
}

function closeConnection(roomName, room, ws) {
  const controlledIds = room.conns.get(ws);
  if (controlledIds) {
    room.conns.delete(ws);
    awarenessProtocol.removeAwarenessStates(room.awareness, Array.from(controlledIds), null);
  }

  if (room.conns.size === 0) {
    if (room.persistTimer) {
      clearTimeout(room.persistTimer);
      room.persistTimer = null;
    }
    persistRoomToMongo(roomName, room.doc).finally(() => {
      if (room.conns.size === 0) {
        room.awareness.destroy();
        room.doc.destroy();
        rooms.delete(roomName);
      }
    });
  }
}

export function attachYjsWebSocketServer(httpServer) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (req, socket, head) => {
    const urlObj = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (!urlObj.pathname.startsWith("/yjs")) {
      return;
    }

    const auth = verifyToken(req, urlObj);
    if (!auth) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    // Room name is either /yjs/<roomName> (y-websocket default) or ?room=<roomName>
    const pathRoom = urlObj.pathname.replace(/^\/yjs\/?/, "");
    const roomName = decodeURIComponent(pathRoom || urlObj.searchParams.get("room") || "");
    const parsedRoom = parseRoomName(roomName);

    if (!parsedRoom || parsedRoom.userId !== auth.userId) {
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req, roomName);
    });
  });

  wss.on("connection", async (ws, _req, roomName) => {
    ws.binaryType = "arraybuffer";
    const room = await getOrCreateRoom(roomName);
    room.conns.set(ws, new Set());

    // Send initial sync step 1
    const syncEncoder = encoding.createEncoder();
    encoding.writeVarUint(syncEncoder, MSG_SYNC);
    syncProtocol.writeSyncStep1(syncEncoder, room.doc);
    ws.send(encoding.toUint8Array(syncEncoder));

    // Send existing awareness states if any
    const awarenessStates = room.awareness.getStates();
    if (awarenessStates.size > 0) {
      const awEncoder = encoding.createEncoder();
      encoding.writeVarUint(awEncoder, MSG_AWARENESS);
      encoding.writeVarUint8Array(
        awEncoder,
        awarenessProtocol.encodeAwarenessUpdate(room.awareness, Array.from(awarenessStates.keys()))
      );
      ws.send(encoding.toUint8Array(awEncoder));
    }

    ws.on("message", (rawData) => {
      try {
        const message = rawData instanceof ArrayBuffer ? new Uint8Array(rawData) : new Uint8Array(rawData);
        const decoder = decoding.createDecoder(message);
        const messageType = decoding.readVarUint(decoder);

        if (messageType === MSG_SYNC) {
          const encoder = encoding.createEncoder();
          encoding.writeVarUint(encoder, MSG_SYNC);
          const syncMessageType = syncProtocol.readSyncMessage(decoder, encoder, room.doc, ws);
          if (syncMessageType === syncProtocol.messageYjsSyncStep1 || encoding.length(encoder) > 1) {
            if (ws.readyState === 1) {
              ws.send(encoding.toUint8Array(encoder));
            }
          }
        } else if (messageType === MSG_AWARENESS) {
          awarenessProtocol.applyAwarenessUpdate(
            room.awareness,
            decoding.readVarUint8Array(decoder),
            ws
          );
        }
      } catch (err) {
        console.warn(`[Yjs] Message error in room ${roomName}:`, err.message);
      }
    });

    ws.on("close", () => closeConnection(roomName, room, ws));
    ws.on("error", () => closeConnection(roomName, room, ws));
  });

  return wss;
}
