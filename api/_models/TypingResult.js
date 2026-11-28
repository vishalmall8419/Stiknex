import mongoose from 'mongoose';

const TypingResultSchema = new mongoose.Schema(
  {
    clientId: { type: String, sparse: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    username: { type: String, required: true, index: true },
    name: { type: String, required: true },
    tier: { type: String, default: 'Standard' },
    avatar: { type: String, default: '' },
    wpm: { type: Number, required: true, index: true },
    rawWpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    consistency: { type: Number, default: 0 },
    subMode: { type: String, default: 'time' },
    timeLimit: { type: Number, default: 15 },
    wordLimit: { type: Number, default: 0 },
    language: { type: String, default: 'english' },
    hasPunctuation: { type: Boolean, default: false },
    hasNumbers: { type: Boolean, default: false },
    characters: {
      correct: { type: Number, default: 0 },
      incorrect: { type: Number, default: 0 },
      extra: { type: Number, default: 0 },
      missed: { type: Number, default: 0 }
    },
    isDeleted: { type: Boolean, default: false, index: true },
    updatedAt: { type: Number, default: Date.now, index: true }
  },
  { timestamps: true }
);

export default mongoose.models.TypingResult || mongoose.model('TypingResult', TypingResultSchema);
