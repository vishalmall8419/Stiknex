import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { getCount, recordSupporter } from "../supporterStore.js";

const router = Router();

const MIN_AMOUNT_INR = 10;
const FALLBACK_RAZORPAY_KEY_ID = "rzp_test_TMMQZgMhvSGNKx";
const FALLBACK_RAZORPAY_KEY_SECRET = "JABhiZQ72yyDbLeKhnUasFbz";

const activeKeyId = process.env.RAZORPAY_KEY_ID || FALLBACK_RAZORPAY_KEY_ID;
const activeKeySecret = process.env.RAZORPAY_KEY_SECRET || FALLBACK_RAZORPAY_KEY_SECRET;

let razorpay;
try {
  if (activeKeyId && activeKeySecret) {
    razorpay = new Razorpay({
      key_id: activeKeyId,
      key_secret: activeKeySecret,
    });
  } else {
    console.warn("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set in environment. Payments will not work.");
  }
} catch (error) {
  console.error("Error initializing Razorpay:", error);
}

router.post("/create-order", async (req, res) => {
  if (!razorpay) {
    return res.status(500).json({ error: "Payment gateway is not configured properly." });
  }

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
      keyId: activeKeyId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, donorName, donorEmail } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: "Missing payment details." });
    }

    const expectedSignature = crypto
      .createHmac("sha256", activeKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ success: false, error: "Signature verification failed." });
    }

    let verifiedAmount = Number(amount) || 0;
    try {
      if (razorpay && !verifiedAmount) {
        const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
        if (paymentDetails && paymentDetails.amount) {
          verifiedAmount = paymentDetails.amount / 100;
        }
      }
    } catch (fetchErr) {
      console.warn("Could not fetch payment detail from Razorpay:", fetchErr.message);
    }

    // Persist payee and payment record into MongoDB database
    const totalSupporters = await recordSupporter({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: verifiedAmount,
      currency: "INR",
      donorName: donorName || "Anonymous Supporter",
      donorEmail: donorEmail || "",
    });

    return res.json({ success: true, totalSupporters });
  } catch (err) {
    console.error("Payment verification / DB error:", err);
    return res.status(500).json({ success: false, error: "Verification failed. Please try again." });
  }
});

router.get("/supporters", async (req, res) => {
  try {
    const totalSupporters = await getCount();
    return res.json({ totalSupporters });
  } catch (err) {
    console.error("Error fetching supporters:", err);
    return res.json({ totalSupporters: 0 });
  }
});

export default router;
