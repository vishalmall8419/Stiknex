import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    type: { type: String, enum: ['review', 'message'], required: true },
    tool: { type: String, default: 'Website' }, // Website, Notebook, Whiteboard, Tools, Sticky Notes
    rating: { type: Number, min: 1, max: 5 }, // 1 to 5 stars (null if just a message)
    content: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
