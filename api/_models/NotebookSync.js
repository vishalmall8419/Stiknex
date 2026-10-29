import mongoose from 'mongoose';
import { Buffer } from 'node:buffer';

const DeviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  deviceName: { type: String, default: 'Browser Device' },
  tokenHash: { type: String, required: true },
  lastActiveAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const NotebookSyncSchema = new mongoose.Schema({
  syncGroupId: { type: String, required: true, unique: true, index: true },
  ciphertext: { type: String, required: true },
  iv: { type: String, required: true },
  version: { type: Number, default: 1, index: true },
  devices: [DeviceSchema],
  payloadSize: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now, index: true },
  createdAt: { type: Date, default: Date.now },
});

// Auto-update updatedAt on save
NotebookSyncSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  if (this.ciphertext) {
    this.payloadSize = Buffer.byteLength(this.ciphertext, 'utf8');
  }
  next();
});

export default mongoose.models.NotebookSync || mongoose.model('NotebookSync', NotebookSyncSchema);

