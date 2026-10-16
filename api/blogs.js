import connectToDatabase from "./_utils/db.js";
import Blog from "./_models/Blog.js";
import { verifyAdminToken } from "./_utils/auth.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    const { slug, admin, id } = req.query;
    const isAdminRequest = admin === "true" || req.headers.authorization;

    // Admin-only mutation methods
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) || (req.method === "GET" && admin === "true")) {
      const authResult = verifyAdminToken(req);
      if (!authResult.valid) {
        return res.status(401).json({ error: "Unauthorized: " + authResult.message });
      }

      if (req.method === "GET") {
        const blogs = await Blog.find().sort({ publishedAt: -1 });
        return res.status(200).json({ success: true, blogs });
      }

      if (req.method === "POST") {
        const { title, slug: customSlug, excerpt, content, fullContent, imageUrl, imageAlt, imageSource, published, category, metaTitle, metaDescription, keywords } = req.body;
        const newBlog = new Blog({
          title,
          slug: customSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
          excerpt: excerpt || "",
          content: content || fullContent || "",
          imageUrl: imageUrl || "https://image.pollinations.ai/prompt/" + encodeURIComponent(title + " tech visual") + "?width=1200&height=630&nologo=true",
          imageAlt: imageAlt || title,
          imageSource: imageSource || "Manual Entry",
          category: category || "Productivity",
          metaTitle: metaTitle || title,
          metaDescription: metaDescription || excerpt || "",
          keywords: keywords || "stiknex, blog",
          trendKeyword: req.body.trendKeyword || "Manual",
          trendScore: req.body.trendScore || 100,
          published: published !== undefined ? published : true,
          publishedAt: new Date(),
        });
        await newBlog.save();
        return res.status(201).json({ success: true, blog: newBlog });
      }

      if (req.method === "PATCH" || req.method === "PUT") {
        const targetId = id || req.body._id || req.body.id;
        const updates = { ...req.body };
        delete updates._id;
        delete updates.id;
        if (updates.published && !updates.publishedAt) updates.publishedAt = new Date();
        const blog = await Blog.findByIdAndUpdate(targetId, updates, { new: true });
        return res.status(200).json({ success: true, blog });
      }

      if (req.method === "DELETE") {
        const targetId = id || req.body.id;
        await Blog.findByIdAndDelete(targetId);
        return res.status(200).json({ success: true });
      }
    }

    // Public GET endpoints
    if (req.method === "GET") {
      if (slug) {
        const blog = await Blog.findOne({ slug, published: true });
        if (!blog) {
          return res.status(404).json({ error: "Blog not found" });
        }
        return res.status(200).json(blog);
      }

      const blogs = await Blog.find({ published: true })
        .select("title slug excerpt imageUrl imageSource publishedAt")
        .sort({ publishedAt: -1 })
        .limit(50);

      return res.status(200).json(blogs);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Blogs API Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
