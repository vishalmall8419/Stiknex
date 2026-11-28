import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true }, // HTML or Markdown
  category: { type: String, default: "Productivity" },
  metaTitle: { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  keywords: { type: String, default: "stiknex, productivity, tools" },
  trendKeyword: { type: String, default: "General" },
  trendScore: { type: Number, default: 80 },
  sourceResearch: {
    type: String,
    default: "Wikipedia + other reliable sources",
  },
  imageUrl: { type: String, required: true },
  imageAlt: { type: String, required: true },
  imageSource: { type: String, default: "AI Generated" },
  wordCount: { type: Number, default: 0 },
  validationStatus: {
    type: String,
    enum: ["passed", "failed", "pending"],
    default: "pending",
  },
  validationError: { type: String, default: "" },
  tableOfContents: [
    {
      title: { type: String },
      id: { type: String },
      level: { type: Number, default: 2 },
    },
  ],
  sources: [
    {
      title: { type: String },
      url: { type: String },
    },
  ],
  published: { type: Boolean, default: false },
  publishedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
