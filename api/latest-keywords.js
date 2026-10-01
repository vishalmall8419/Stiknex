import { connectDB } from './_utils/db.js';
import Trend from './_models/Trend.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        await connectDB();
        
        // Fetch top 100 relevant or used keywords, sorted by numericTraffic
        const trends = await Trend.find({ status: { $in: ['relevant', 'used'] } })
            .sort({ numericTraffic: -1, createdAt: -1 })
            .limit(100)
            .select('keyword -_id')
            .lean();

        let keywords = trends.map(t => t.keyword);
        
        // Ensure some base keywords are always present to maintain app context
        const baseKeywords = [
            "sticky notes", "online sticky notes", "free sticky notes app", 
            "online notebook", "digital whiteboard", "productivity tools", 
            "excalidraw", "note taking app", "free online tools", "digital workspace"
        ];
        
        // Combine base keywords and trending keywords, remove duplicates
        keywords = [...new Set([...baseKeywords, ...keywords])];

        res.status(200).json({ success: true, count: keywords.length, keywords });
    } catch (error) {
        console.error('Error fetching keywords:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch keywords' });
    }
}
