import mongoose from 'mongoose';

const supporterSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  paymentId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['paid', 'refunded'], default: 'paid' },
  donorName: { type: String, default: 'Anonymous Supporter' },
  donorEmail: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Supporter || mongoose.model('Supporter', supporterSchema);

