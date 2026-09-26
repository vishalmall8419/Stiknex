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
  }
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
