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
        
        const cacheKey = 'seo_opportunities_all';
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.status(200).json({ success: true, source: 'redis', data: JSON.parse(cached) });
        }

        // Fetch up to 500 non-ignored trends, sorted by relevance and trend score
        const trends = await Trend.find()
                                  .sort({ relevanceScore: -1, trendScore: -1, date: -1 })
                                  .limit(500);
                                  
        await redisClient.setex(cacheKey, 3600, JSON.stringify(trends)); // Cache 1 hour
        res.status(200).json({ success: true, source: 'db', data: trends });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}