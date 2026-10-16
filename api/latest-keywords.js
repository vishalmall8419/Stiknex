import connectToDatabase from './_utils/db.js';
import Trend from './_models/Trend.js';

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const baseKeywords = [
        "sticky notes", "online sticky notes", "free sticky notes app", 
        "online notebook", "digital whiteboard", "productivity tools", 
        "excalidraw", "note taking app", "free online tools", "digital workspace"
    ];

    try {
        await connectToDatabase();
        
        // Fetch top 100 relevant or used keywords, sorted by numericTraffic
        const trends = await Trend.find({ status: { $in: ['relevant', 'used'] } })
            .sort({ numericTraffic: -1, createdAt: -1 })
            .limit(100)
            .select('keyword -_id')
            .lean();

        let keywords = (trends || []).map(t => t.keyword).filter(Boolean);
        keywords = [...new Set([...baseKeywords, ...keywords])];

        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
        return res.status(200).json({ success: true, count: keywords.length, keywords });
    } catch (error) {
        console.error('Error fetching keywords:', error);
        // Resilient fallback: return baseKeywords with 200 so UI and SEO never fail
        return res.status(200).json({ success: true, count: baseKeywords.length, keywords: baseKeywords, fallback: true });
    }
}
