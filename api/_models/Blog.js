import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true }, // HTML or Markdown
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    keywords: { type: String, required: true },
    trendKeyword: { type: String, required: true },
    trendScore: { type: Number, required: true },
    sourceResearch: { type: String, default: "Wikipedia + other reliable sources" },
    imageUrl: { type: String, required: true },
    imageAlt: { type: String, required: true },
    imageSource: { type: String, default: "AI Generated" },
    published: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
