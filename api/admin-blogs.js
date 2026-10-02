import connectToDatabase from './_utils/db.js';
import Blog from './_models/Blog.js';
import { verifyAdminToken } from './_utils/auth.js';

export default async function handler(req, res) {
    try {
        await connectToDatabase();
        
        const isAdmin = verifyAdminToken(req.headers['authorization']?.split(' ')[1] || req.cookies?.stkx_admin_token);
        if (!isAdmin.valid) return res.status(401).json({ error: 'Unauthorized' });

        if (req.method === 'GET') {
            const blogs = await Blog.find().sort({ publishedAt: -1 });
            return res.status(200).json({ success: true, blogs });
        }

        if (req.method === 'POST') {
            const { title, slug, excerpt, fullContent, imageUrl, imageSource, published } = req.body;
            const newBlog = new Blog({
                title, slug, excerpt, fullContent, imageUrl, imageSource,
                published,
                publishedAt: published ? new Date() : null,
                metrics: { relevanceScore: 100, originalTrendScore: 0 }
            });
            await newBlog.save();
            return res.status(201).json({ success: true, blog: newBlog });
        }

        if (req.method === 'PATCH') {
            const { id } = req.query;
            const updates = req.body;
            if (updates.published && !updates.publishedAt) updates.publishedAt = new Date();
            const blog = await Blog.findByIdAndUpdate(id, updates, { new: true });
            return res.status(200).json({ success: true, blog });
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            await Blog.findByIdAndDelete(id);
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method Not Allowed' });
    } catch (error) {
        console.error('Admin Blogs API Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
