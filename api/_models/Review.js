import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  clientId: { type: String, sparse: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
  tool: { type: String, required: true }, // e.g. 'notepad', 'whiteboard', 'tools', 'stiknex'
  userName: { type: String, default: 'Anonymous' },
  userEmail: { type: String },
  isPublic: { type: Boolean, default: false }, // If admin wants to show it on homepage
  isDeleted: { type: Boolean, default: false, index: true },
  updatedAt: { type: Number, default: Date.now, index: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
