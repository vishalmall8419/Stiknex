import connectToDatabase from './_utils/db.js';
import Review from './_models/Review.js';
import { verifyAdminToken } from './_utils/auth.js';

export default async function handler(req, res) {
    try {
        await connectToDatabase();

        if (req.method === 'POST') {
            // Public endpoint to submit a review or message
            const { name, email, type, tool, rating, content } = req.body;
            
            if (!name || !email || !content || !type) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const newReview = new Review({
                name,
                email,
                type,
                tool,
                rating: type === 'review' ? rating : null,
                content
            });

            await newReview.save();
            return res.status(201).json({ success: true, message: 'Submitted successfully' });
        }

        if (req.method === 'GET') {
            // Public fetching of APPROVED testimonials
            if (req.query.public === 'true') {
                const testimonials = await Review.find({ type: 'review', status: 'approved' })
                                                .sort({ createdAt: -1 })
                                                .limit(10);
                return res.status(200).json({ success: true, testimonials });
            }

            // ADMIN ONLY GET ALL
            const isAdmin = verifyAdminToken(req.headers['authorization']?.split(' ')[1] || req.cookies?.stkx_admin_token);
            if (!isAdmin.valid) return res.status(401).json({ error: 'Unauthorized' });

            const reviews = await Review.find().sort({ createdAt: -1 });
            return res.status(200).json({ success: true, reviews });
        }

        if (req.method === 'PATCH') {
            // ADMIN ONLY UPDATE STATUS
            const isAdmin = verifyAdminToken(req.headers['authorization']?.split(' ')[1] || req.cookies?.stkx_admin_token);
            if (!isAdmin.valid) return res.status(401).json({ error: 'Unauthorized' });

            const { id } = req.query;
            const { status } = req.body;

            if (!id || !status) return res.status(400).json({ error: 'Missing id or status' });

            await Review.findByIdAndUpdate(id, { status });
            return res.status(200).json({ success: true, message: 'Status updated' });
        }

        if (req.method === 'DELETE') {
            // ADMIN ONLY DELETE
            const isAdmin = verifyAdminToken(req.headers['authorization']?.split(' ')[1] || req.cookies?.stkx_admin_token);
            if (!isAdmin.valid) return res.status(401).json({ error: 'Unauthorized' });

            const { id } = req.query;
            if (!id) return res.status(400).json({ error: 'Missing id' });

            await Review.findByIdAndDelete(id);
            return res.status(200).json({ success: true, message: 'Deleted' });
        }

        return res.status(405).json({ error: 'Method Not Allowed' });
    } catch (error) {
        console.error('Reviews API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
