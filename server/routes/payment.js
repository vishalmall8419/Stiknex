import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { getCount, incrementCount } from "../supporterStore.js";

const router = Router();

const MIN_AMOUNT_INR = 10;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const numericAmount = Number(amount);

    if (!numericAmount || Number.isNaN(numericAmount)) {
      return res.status(400).json({ error: "A valid amount is required." });
    }

    if (numericAmount < MIN_AMOUNT_INR) {
      return res
        .status(400)
        .json({ error: `Minimum donation amount is ₹${MIN_AMOUNT_INR}.` });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(numericAmount * 100),
      currency: "INR",
      receipt: `stiknex_rcpt_${Date.now()}`,
    });

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
     console.error(err);
    return res.status(500).json({ error: err.message,});
  }
});

router.post("/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: "Missing payment details." });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ success: false, error: "Signature verification failed." });
    }

    const totalSupporters = incrementCount();
    return res.json({ success: true, totalSupporters });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Verification failed. Please try again." });
  }
});

router.get("/supporters", (req, res) => {
  res.json({ totalSupporters: getCount() });
});

export default router;
