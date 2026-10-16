import connectToDatabase from "./_utils/db.js";
import Supporter from "./_models/Supporter.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();
    const totalSupporters = await Supporter.countDocuments({ status: "paid" });
    return res.status(200).json({ totalSupporters });
  } catch (error) {
    console.error("Error fetching supporters count:", error);
    return res.status(200).json({ totalSupporters: 0 });
  }
}

