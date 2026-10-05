import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
  tool: { type: String, required: true }, // e.g. 'notepad', 'whiteboard', 'tools', 'stiknex'
  userName: { type: String, default: 'Anonymous' },
  userEmail: { type: String },
  isPublic: { type: Boolean, default: false }, // If admin wants to show it on homepage
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
