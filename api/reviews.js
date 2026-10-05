import connectToDatabase from './_utils/db.js';
import Review from './_models/Review.js';
import { verifyAdminToken } from './_utils/auth.js';

export default async function handler(req, res) {
    await connectToDatabase();

    if (req.method === 'POST') {
        try {
            const { rating, message, tool, userName, userEmail } = req.body;
            if (!rating || !message) {
                return res.status(400).json({ error: 'Rating and message are required' });
            }
            const review = new Review({ rating, message, tool: tool || 'stiknex', userName, userEmail });
            await review.save();
            return res.status(201).json({ message: 'Review submitted successfully', review });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } 
    
    if (req.method === 'GET') {
        // If query has ?public=true, return only public reviews (no auth needed)
        if (req.query.public === 'true') {
            try {
                const reviews = await Review.find({ isPublic: true }).sort({ createdAt: -1 }).limit(10);
                return res.status(200).json(reviews);
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        }

        // Otherwise, require admin auth to get all reviews
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
        
        const tokenInfo = verifyAdminToken({ headers: { authorization: authHeader } });
        if (!tokenInfo.valid) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const reviews = await Review.find().sort({ createdAt: -1 });
            return res.status(200).json(reviews);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'PUT') {
        // Update isPublic status (Admin only)
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
        
        const tokenInfo = verifyAdminToken({ headers: { authorization: authHeader } });
        if (!tokenInfo.valid) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const { id, isPublic } = req.body;
            const review = await Review.findByIdAndUpdate(id, { isPublic }, { new: true });
            return res.status(200).json(review);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'DELETE') {
        // Delete review (Admin only)
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
        
        const tokenInfo = verifyAdminToken({ headers: { authorization: authHeader } });
        if (!tokenInfo.valid) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const { id } = req.body;
            await Review.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    res.status(405).json({ error: 'Method Not Allowed' });
}
