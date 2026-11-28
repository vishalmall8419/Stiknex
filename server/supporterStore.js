import mongoose from "mongoose";

const supporterSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  paymentId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: { type: String, enum: ["paid", "refunded"], default: "paid" },
  donorName: { type: String, default: "Anonymous Supporter" },
  donorEmail: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Supporter = mongoose.models.Supporter || mongoose.model("Supporter", supporterSchema);

let isConnected = false;

async function connectDb() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured in environment.");
  }
  await mongoose.connect(uri);
  isConnected = true;
}

export async function getCount() {
  try {
    await connectDb();
    return await Supporter.countDocuments({ status: "paid" });
  } catch (err) {
    console.error("Error fetching supporter count from MongoDB:", err.message);
    return 0;
  }
}

export async function recordSupporter({ orderId, paymentId, amount, currency, donorName, donorEmail }) {
  try {
    await connectDb();
    await Supporter.findOneAndUpdate(
      { paymentId },
      {
        orderId,
        paymentId,
        amount: Number(amount) || 0,
        currency: currency || "INR",
        status: "paid",
        donorName: donorName || "Anonymous Supporter",
        donorEmail: donorEmail || "",
      },
      { upsert: true, new: true }
    );
    return await Supporter.countDocuments({ status: "paid" });
  } catch (err) {
    console.error("Error storing payee in MongoDB database:", err.message);
    throw err;
  }
}

export { Supporter };
