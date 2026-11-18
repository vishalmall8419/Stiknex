import mongoose from 'mongoose';

const NotebookSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, sparse: true },
    title: { type: String, default: 'Untitled Note' },
    content: { type: String, default: '' },
    folder: { type: String, default: 'General' },
    isDeleted: { type: Boolean, default: false, index: true },
    updatedAt: { type: Number, default: Date.now, index: true },
    createdAt: { type: Number, default: Date.now }
  },
  { timestamps: false }
);

NotebookSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.models.Notebook || mongoose.model('Notebook', NotebookSchema);
