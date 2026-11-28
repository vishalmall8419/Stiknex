import crypto from "crypto";
import connectToDatabase from "./_utils/db.js";
import Supporter from "./_models/Supporter.js";

const MIN_AMOUNT_INR = 10;
const FALLBACK_RAZORPAY_KEY_ID = "rzp_test_TMMQZgMhvSGNKx";
const FALLBACK_RAZORPAY_KEY_SECRET = "JABhiZQ72yyDbLeKhnUasFbz";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 1. GET — Fetch total paid supporters count
  if (req.method === "GET") {
    try {
      await connectToDatabase();
      const totalSupporters = await Supporter.countDocuments({ status: "paid" });
      return res.status(200).json({ totalSupporters });
    } catch (error) {
      console.error("Error fetching supporters count:", error);
      return res.status(200).json({ totalSupporters: 0 });
    }
  }

  // 2. POST — Actions: create-order, verify-payment, or direct record
  if (req.method === "POST") {
    const action = String(req.query.action || req.body?.action || "").toLowerCase();

    // Action A: Create Razorpay Order
    if (action === "create-order") {
      try {
        const { amount } = req.body || {};
        const numericAmount = Number(amount);

        if (!numericAmount || Number.isNaN(numericAmount) || numericAmount < MIN_AMOUNT_INR) {
          return res.status(400).json({ error: `Minimum donation amount is ₹${MIN_AMOUNT_INR}.` });
        }

        const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || FALLBACK_RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET || FALLBACK_RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
          console.error("Razorpay API credentials not configured in environment");
          return res.status(500).json({ error: "Payment gateway is not configured properly." });
        }

        const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(numericAmount * 100),
            currency: "INR",
            receipt: `stiknex_rcpt_${Date.now()}`,
          }),
        });

        const orderData = await rzpRes.json();
        if (!rzpRes.ok) {
          console.error("Razorpay order creation failed:", orderData);
          return res.status(rzpRes.status).json({
            error: orderData.error?.description || "Failed to create payment order.",
          });
        }

        return res.status(200).json({
          orderId: orderData.id,
          amount: orderData.amount,
          currency: orderData.currency,
          keyId,
        });
      } catch (err) {
        console.error("Error in create-order:", err);
        return res.status(500).json({ error: err.message || "Failed to create order." });
      }
    }

    // Action B: Verify Razorpay Payment & Save Supporter to DB
    if (action === "verify-payment") {
      try {
        const {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          amount,
          donorName,
          donorEmail,
        } = req.body || {};

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return res.status(400).json({ success: false, error: "Missing payment details." });
        }

        const keySecret = process.env.RAZORPAY_KEY_SECRET || FALLBACK_RAZORPAY_KEY_SECRET;
        if (keySecret) {
          const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

          if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, error: "Signature verification failed." });
          }
        }

        await connectToDatabase();
        await Supporter.findOneAndUpdate(
          { paymentId: razorpay_payment_id },
          {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            amount: Number(amount) || 0,
            currency: "INR",
            status: "paid",
            donorName: donorName || "Anonymous Supporter",
            donorEmail: donorEmail || "",
            createdAt: new Date(),
          },
          { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
        );

        const totalSupporters = await Supporter.countDocuments({ status: "paid" });
        return res.status(200).json({ success: true, totalSupporters });
      } catch (err) {
        console.error("Payment verification / DB error:", err);
        return res.status(500).json({ success: false, error: "Verification failed. Please try again." });
      }
    }

    // Action C: Direct Supporter Record
    try {
      const { orderId, paymentId, amount, donorName, donorEmail } = req.body || {};
      if (!paymentId) {
        return res.status(400).json({ success: false, error: "paymentId is required." });
      }

      await connectToDatabase();
      await Supporter.findOneAndUpdate(
        { paymentId },
        {
          orderId: orderId || `stiknex_ord_${Date.now()}`,
          paymentId,
          amount: Number(amount) || 0,
          currency: "INR",
          status: "paid",
          donorName: donorName || "Anonymous Supporter",
          donorEmail: donorEmail || "",
          createdAt: new Date(),
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );

      const totalSupporters = await Supporter.countDocuments({ status: "paid" });
      return res.status(200).json({ success: true, totalSupporters });
    } catch (err) {
      console.error("Direct record supporter error:", err);
      return res.status(500).json({ success: false, error: err.message || "Failed to record supporter." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
