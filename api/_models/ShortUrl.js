import mongoose from 'mongoose';

const ShortUrlSchema = new mongoose.Schema(
  {
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    campaign: {
      type: String,
      default: '',
      trim: true,
    },
    utmSource: {
      type: String,
      default: '',
      trim: true,
    },
    utmMedium: {
      type: String,
      default: '',
      trim: true,
    },
    utmCampaign: {
      type: String,
      default: '',
      trim: true,
    },
    utmTerm: {
      type: String,
      default: '',
      trim: true,
    },
    utmContent: {
      type: String,
      default: '',
      trim: true,
    },
    ownerKey: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0,
      index: true,
    },
    uniqueClicks: {
      type: Number,
      default: 0,
    },
    botClicks: {
      type: Number,
      default: 0,
    },
    lastClickedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    disabled: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for owner link queries
ShortUrlSchema.index({ ownerKey: 1, createdAt: -1 });

export default mongoose.models.ShortUrl || mongoose.model('ShortUrl', ShortUrlSchema);
