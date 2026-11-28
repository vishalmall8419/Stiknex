import mongoose from 'mongoose';

const UrlClickSchema = new mongoose.Schema(
  {
    shortUrlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShortUrl',
      required: true,
      index: true,
    },
    shortCode: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    visitorHash: {
      type: String,
      required: true,
      index: true,
    },
    isUnique: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBot: {
      type: Boolean,
      default: false,
      index: true,
    },
    botName: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'Unknown',
      index: true,
    },
    countryCode: {
      type: String,
      default: 'XX',
    },
    region: {
      type: String,
      default: 'Unknown',
    },
    city: {
      type: String,
      default: 'Unknown',
    },
    deviceType: {
      type: String,
      default: 'desktop', // desktop | mobile | tablet | bot | other
      index: true,
    },
    browser: {
      type: String,
      default: 'Unknown',
      index: true,
    },
    os: {
      type: String,
      default: 'Unknown',
      index: true,
    },
    referrer: {
      type: String,
      default: '',
    },
    referrerDomain: {
      type: String,
      default: 'Direct / None',
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Compound indexes for analytics queries
UrlClickSchema.index({ shortUrlId: 1, timestamp: -1 });
UrlClickSchema.index({ shortUrlId: 1, isBot: 1, timestamp: -1 });
UrlClickSchema.index({ shortUrlId: 1, visitorHash: 1 });

export default mongoose.models.UrlClick || mongoose.model('UrlClick', UrlClickSchema);
