import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, sparse: true },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    color: { type: String, default: '#FEF08A' },
    x: { type: Number, default: 40 },
    y: { type: Number, default: 40 },
    width: { type: Number, default: 240 },
    height: { type: Number, default: 240 },
    isPinned: { type: Boolean, default: false },
    zIndex: { type: Number, default: 1 },
    trashedAt: { type: Number, default: null },
    isDeleted: { type: Boolean, default: false, index: true },
    updatedAt: { type: Number, default: Date.now, index: true },
    createdAt: { type: Number, default: Date.now }
  },
  { timestamps: false }
);

NoteSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
