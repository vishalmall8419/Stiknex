import mongoose from 'mongoose';

// Stores the LATEST batch of trending keywords for SEO injection
// This collection is REPLACED (not appended) on every cron run
const ActiveSeoKeywordSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  traffic: { type: String, default: '0' },
  numericTraffic: { type: Number, default: 0 },
  trendScore: { type: Number, default: 0 },
  relevanceScore: { type: Number, default: 0 },
  geo: { type: String, default: 'US' },
  fetchedAt: { type: Date, default: Date.now }
}, { timestamps: false });

export default mongoose.models.ActiveSeoKeyword ||
  mongoose.model('ActiveSeoKeyword', ActiveSeoKeywordSchema);
