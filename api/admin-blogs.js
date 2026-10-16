import connectToDatabase from './_utils/db.js';
import Blog from './_models/Blog.js';
import { verifyAdminToken } from './_utils/auth.js';

export default async function handler(req, res) {
    try {
        await connectToDatabase();
        
        const authResult = verifyAdminToken(req);
        if (!authResult.valid) {
            return res.status(401).json({ error: 'Unauthorized: ' + authResult.message });
        }

        if (req.method === 'GET') {
            const blogs = await Blog.find().sort({ publishedAt: -1 });
            return res.status(200).json({ success: true, blogs });
        }

        if (req.method === 'POST') {
            const { title, slug, excerpt, content, fullContent, imageUrl, imageAlt, imageSource, published, category, metaTitle, metaDescription, keywords } = req.body;
            const newBlog = new Blog({
                title, 
                slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                excerpt: excerpt || '',
                content: content || fullContent || '',
                imageUrl: imageUrl || 'https://image.pollinations.ai/prompt/' + encodeURIComponent(title + ' tech visual') + '?width=1200&height=630&nologo=true',
                imageAlt: imageAlt || title,
                imageSource: imageSource || 'Manual Entry',
                category: category || 'Productivity',
                metaTitle: metaTitle || title,
                metaDescription: metaDescription || excerpt || '',
                keywords: keywords || 'stiknex, blog',
                trendKeyword: 'Manual',
                trendScore: 100,
                published: published !== undefined ? published : true,
                publishedAt: new Date()
            });
            await newBlog.save();
            return res.status(201).json({ success: true, blog: newBlog });
        }

        if (req.method === 'PATCH' || req.method === 'PUT') {
            const id = req.query.id || req.body._id || req.body.id;
            const updates = { ...req.body };
            delete updates._id;
            delete updates.id;
            if (updates.published && !updates.publishedAt) updates.publishedAt = new Date();
            const blog = await Blog.findByIdAndUpdate(id, updates, { new: true });
            return res.status(200).json({ success: true, blog });
        }

        if (req.method === 'DELETE') {
            const id = req.query.id || req.body.id;
            await Blog.findByIdAndDelete(id);
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method Not Allowed' });
    } catch (error) {
        console.error('Admin Blogs API Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
