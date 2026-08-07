import "dotenv/config";
import express from "express";
import cors from "cors";
import paymentRoutes from "./routes/payment.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://stiknex.vercel.app"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", paymentRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Stiknex payment server running on port ${PORT}`);
});
