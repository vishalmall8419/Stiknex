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
  numericTraffic: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  url: {
    type: String
  },
  trendScore: {
    type: Number,
    default: 0
  },
  relevanceScore: {
    type: Number,
    default: 0
  },
  searchIntent: {
    type: String,
    enum: ['Informational', 'Transactional', 'Navigational', 'Commercial', 'Unknown'],
    default: 'Unknown'
  },
  suggestionType: {
    type: String,
    enum: ['Blog', 'Existing Content', 'Tool Page', 'None'],
    default: 'None'
  },
  status: {
    type: String,
    enum: ['pending', 'relevant', 'used', 'ignored'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.models.Trend || mongoose.model('Trend', TrendSchema);
