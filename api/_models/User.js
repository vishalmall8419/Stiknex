import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true, sparse: true, index: true },
    age: { type: Number, required: true, min: 5, max: 120 },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: '' },
    tier: { type: String, default: 'Standard' }, // Standard, Pro, Master, Mythical
    xp: { type: Number, default: 0 },
    bestWpm: { type: Number, default: 0 },
    avgWpm: { type: Number, default: 0 },
    avgAccuracy: { type: Number, default: 0 },
    testsCompleted: { type: Number, default: 0 },
    totalTimeSeconds: { type: Number, default: 0 },
    syncGroupId: { type: String, default: null },
    workspaceData: { type: mongoose.Schema.Types.Mixed, default: null }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
