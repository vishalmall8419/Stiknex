import mongoose from 'mongoose';

const DevicePairingSchema = new mongoose.Schema({
  pairingId: { type: String, required: true, unique: true, index: true },
  status: {
    type: String,
    enum: ['pending', 'claimed', 'transferred', 'completed', 'expired'],
    default: 'pending',
    index: true,
  },
  claimedDevice: {
    deviceId: String,
    deviceName: String,
  },
  encryptedPayload: String, // Encrypted with ephemeral pairing key (E2EE)
  iv: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // MongoDB TTL: automatically purged after 5 minutes (300 seconds)
  },
});

export default mongoose.models.DevicePairing || mongoose.model('DevicePairing', DevicePairingSchema);

