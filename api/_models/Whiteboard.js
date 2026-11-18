import mongoose from 'mongoose';

const WhiteboardSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, sparse: true },
    title: { type: String, default: 'Untitled Drawing' },
    elements: { type: Array, default: [] },
    appState: { type: Object, default: {} },
    thumbnail: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false, index: true },
    updatedAt: { type: Number, default: Date.now, index: true },
    createdAt: { type: Number, default: Date.now }
  },
  { timestamps: false }
);

WhiteboardSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.models.Whiteboard || mongoose.model('Whiteboard', WhiteboardSchema);

