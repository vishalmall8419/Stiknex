import connectToDatabase from "./_utils/db.js";
import Review from "./_models/Review.js";
import { verifyAdminToken } from "./_utils/auth.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();
  } catch (dbErr) {
    console.error("DB connection error in reviews:", dbErr);
    return res
      .status(500)
      .json({ error: "Database connection failed", details: dbErr.message });
  }

  if (req.method === "POST") {
    try {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const rating = Number(body.rating) || 5;
      const message = (body.message || body.content || body.text || "").trim();
      const tool = (body.tool || (body.type === "message" ? "Direct Message" : "stiknex")).trim();
      const userName = (body.userName || body.name || "Anonymous").trim();
      const userEmail = (body.userEmail || body.email || "").trim();

      if (!message) {
        return res
          .status(400)
          .json({ error: "Message content is required" });
      }

      const review = new Review({
        rating,
        message,
        tool,
        userName,
        userEmail,
        isPublic: body.isPublic !== undefined ? body.isPublic : false,
      });
      await review.save();
      return res
        .status(201)
        .json({ success: true, message: "Review submitted successfully", review });
    } catch (error) {
      console.error("Save review error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "GET") {
    // If query has ?public=true, return only public reviews for homepage testimonials
    if (req.query.public === "true") {
      try {
        const reviews = await Review.find({ isPublic: true })
          .sort({ createdAt: -1 })
          .limit(10);
        return res.status(200).json(reviews);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    // Return all reviews for admin dashboard and feedback manager
    try {
      const reviews = await Review.find().sort({ createdAt: -1 });
      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    // Update isPublic status (Admin only)
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

    const tokenInfo = verifyAdminToken({
      headers: { authorization: authHeader },
    });
    if (!tokenInfo.valid)
      return res.status(401).json({ error: "Unauthorized" });

    try {
      const { id, isPublic } = req.body;
      const review = await Review.findByIdAndUpdate(
        id,
        { isPublic },
        { new: true },
      );
      return res.status(200).json(review);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    // Delete review (Admin only)
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

    const tokenInfo = verifyAdminToken({
      headers: { authorization: authHeader },
    });
    if (!tokenInfo.valid)
      return res.status(401).json({ error: "Unauthorized" });

    try {
      const { id } = req.body;
      await Review.findByIdAndDelete(id);
      return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.status(405).json({ error: "Method Not Allowed" });
}
