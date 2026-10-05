import connectToDatabase from "./_utils/db.js";
import Blog from "./_models/Blog.js";
import { verifyAdminToken } from "./_utils/auth.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const dummyReq = { headers: { authorization: req.headers.authorization } };
    const isAdmin = verifyAdminToken(dummyReq).valid;
    if (!isAdmin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      await connectToDatabase();
      const newBlog = new Blog({
        ...req.body,
        trendScore: req.body.trendScore || 0,
        trendKeyword: req.body.trendKeyword || "Manual",
        metaTitle: req.body.metaTitle || req.body.title || "Blog Post",
        metaDescription: req.body.metaDescription || req.body.excerpt || "A new blog post.",
        keywords: req.body.keywords || "blog, stiknex",
      });
      await newBlog.save();
      return res
        .status(201)
        .json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
      console.error("Create Blog Error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    const { slug } = req.query;

    if (slug) {
      const blog = await Blog.findOne({ slug, published: true });
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      return res.status(200).json(blog);
    }

    // Fetch published blogs, sorted by newest first
    const blogs = await Blog.find({ published: true })
      .select("title slug excerpt imageUrl imageSource publishedAt")
      .sort({ publishedAt: -1 })
      .limit(50); // Pagination could be added later

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Fetch Blogs Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
