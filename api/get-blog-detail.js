import connectToDatabase from './_utils/db.js';
import Blog from './_models/Blog.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { slug } = req.query;
    if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
    }

    try {
        await connectToDatabase();
        
        const blog = await Blog.findOne({ slug, published: true });
        
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.status(200).json(blog);
    } catch (error) {
        console.error('Fetch Blog Detail Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
