import redisClient from './_utils/redis.js';
import connectToDatabase from './_utils/db.js';
import { verifyAdminToken } from './_utils/auth.js';
import Trend from './_models/Trend.js';

export default async function handler(req, res) {
    try {
        await connectToDatabase();

        const auth = verifyAdminToken(req);
        if (!auth.valid) {
            return res.status(401).json({ success: false, message: auth.message });
        }

        if (req.method === 'GET') {
            const cacheKey = 'seo_opportunities_all';
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                return res.status(200).json({ success: true, source: 'redis', data: JSON.parse(cached) });
            }

            const trends = await Trend.find()
                                      .sort({ relevanceScore: -1, trendScore: -1, date: -1 })
                                      .limit(500);
                                      
            await redisClient.setex(cacheKey, 3600, JSON.stringify(trends)); 
            return res.status(200).json({ success: true, source: 'db', data: trends });
        }
        
        if (req.method === 'POST') {
            const { id, status } = req.body;

            if (!id || !status) {
                return res.status(400).json({ success: false, message: 'ID and status are required' });
            }

            if (!['pending', 'relevant', 'used', 'ignored'].includes(status)) {
                return res.status(400).json({ success: false, message: 'Invalid status' });
            }

            const updatedTrend = await Trend.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

            if (!updatedTrend) {
                return res.status(404).json({ success: false, message: 'Trend not found' });
            }

            return res.status(200).json({ success: true, data: updatedTrend });
        }

        return res.status(405).json({ success: false, message: 'Method not allowed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
