import connectToDatabase from './_utils/db.js';
import Blog from './_models/Blog.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await connectToDatabase();
        
        // Fetch published blogs, sorted by newest first
        const blogs = await Blog.find({ published: true })
            .select('title slug excerpt imageUrl publishedAt')
            .sort({ publishedAt: -1 })
            .limit(50); // Pagination could be added later

        res.status(200).json(blogs);
    } catch (error) {
        console.error('Fetch Blogs Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
