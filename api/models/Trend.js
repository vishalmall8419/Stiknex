import mongoose from 'mongoose';

const TrendSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    unique: true
  },
  traffic: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  relevanceScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'used', 'ignored'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.models.Trend || mongoose.model('Trend', TrendSchema);
