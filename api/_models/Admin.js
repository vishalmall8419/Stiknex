import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  twoFactorSecret: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'admin'
  },
  // Anti-Brute Force fields
  failedLoginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, { timestamps: true });

// Virtual to check if currently locked
AdminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
