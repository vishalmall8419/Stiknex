import "dotenv/config";
import http from "node:http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import paymentRoutes from "./routes/payment.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://stiknex.site",
  "https://stiknex.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith("stiknex.site") ||
        origin.includes("localhost")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", paymentRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "stiknex-realtime-server", socketIo: true });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 30000,
  pingInterval: 10000
});

// Map of active device connections: syncGroupId -> Map(deviceId -> { deviceName, lastActiveAt, socketId })
const activeDeviceRegistry = new Map();

io.on("connection", (socket) => {
  // 1. Join user account room and sync group room
  socket.on("join_mesh", ({ userId, syncGroupId, deviceId, deviceName }) => {
    if (userId) {
      socket.join(`user:${userId}`);
    }
    if (syncGroupId) {
      socket.join(`sync:${syncGroupId}`);

      if (!activeDeviceRegistry.has(syncGroupId)) {
        activeDeviceRegistry.set(syncGroupId, new Map());
      }
      const groupMap = activeDeviceRegistry.get(syncGroupId);
      if (deviceId) {
        groupMap.set(deviceId, {
          deviceId,
          deviceName: deviceName || "Connected Device",
          lastActiveAt: new Date().toISOString(),
          socketId: socket.id
        });
      }

      // Broadcast active devices in this group to all group members
      const devices = Array.from(groupMap.values());
      io.to(`sync:${syncGroupId}`).emit("devices_updated", { syncGroupId, devices });
    }
  });

  // 2. Real-Time Sticky Note Change
  socket.on("note_change", (data) => {
    const { userId, syncGroupId, note, action, deviceId } = data || {};
    if (userId) {
      socket.to(`user:${userId}`).emit("remote_note_change", { note, action, originDeviceId: deviceId });
    }
    if (syncGroupId) {
      socket.to(`sync:${syncGroupId}`).emit("remote_note_change", { note, action, originDeviceId: deviceId });
    }
  });

  // 3. Real-Time Whiteboard Change
  socket.on("whiteboard_change", (data) => {
    const { userId, syncGroupId, whiteboard, action, deviceId } = data || {};
    if (userId) {
      socket.to(`user:${userId}`).emit("remote_whiteboard_change", { whiteboard, action, originDeviceId: deviceId });
    }
    if (syncGroupId) {
      socket.to(`sync:${syncGroupId}`).emit("remote_whiteboard_change", { whiteboard, action, originDeviceId: deviceId });
    }
  });

  // 4. Real-Time Notebook Change
  socket.on("notebook_change", (data) => {
    const { userId, syncGroupId, notebook, notebooks, comments, deviceId } = data || {};
    if (userId) {
      socket.to(`user:${userId}`).emit("remote_notebook_change", {
        notebook,
        notebooks,
        comments,
        originDeviceId: deviceId,
        timestamp: Date.now()
      });
    }
    if (syncGroupId) {
      socket.to(`sync:${syncGroupId}`).emit("remote_notebook_change", {
        notebook,
        notebooks,
        comments,
        originDeviceId: deviceId,
        timestamp: Date.now()
      });
    }
  });

  // 4b. Ultra-low latency Real-Time Yjs CRDT Delta Update (< 0.02s)
  socket.on("yjs_update", (data) => {
    const { userId, syncGroupId, notebookId, update, deviceId } = data || {};
    if (userId) {
      socket.to(`user:${userId}`).emit("remote_yjs_update", {
        notebookId,
        update,
        originDeviceId: deviceId,
        timestamp: Date.now()
      });
    }
    if (syncGroupId) {
      socket.to(`sync:${syncGroupId}`).emit("remote_yjs_update", {
        notebookId,
        update,
        originDeviceId: deviceId,
        timestamp: Date.now()
      });
    }
  });

  // 5. User Feedback & Direct Message Real-Time Event
  socket.on("user_feedback", (feedbackData) => {
    // Broadcast instantly to all connected admin dashboards & monitoring clients
    io.emit("remote_feedback_received", {
      ...feedbackData,
      socketId: socket.id,
      receivedAt: new Date().toISOString(),
    });
  });

  // 6. Explicit pull request ping
  socket.on("request_sync_pulse", ({ userId, syncGroupId }) => {
    if (userId) {
      socket.to(`user:${userId}`).emit("sync_pulse_received");
    }
    if (syncGroupId) {
      socket.to(`sync:${syncGroupId}`).emit("sync_pulse_received");
    }
  });

  socket.on("disconnect", () => {
    // Device disconnected
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Stiknex real-time Socket.io server running on port ${PORT}`);
});
