import connectToDatabase from './_utils/db.js';
import Trend from './_models/Trend.js';
import redisClient from './_utils/redis.js';
import { verifyAdminToken } from './_utils/auth.js';

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { view } = req.query;

    if (view === 'keywords' || req.url?.includes('latest-keywords')) {
        return handleKeywords(req, res);
    }

    if (view === 'admin' || req.url?.includes('trends-admin')) {
        return handleAdmin(req, res);
    }

    return handleDashboard(req, res);
}

// ─── 1. KEYWORDS HANDLER ───────────────────────────────────────────────────────
async function handleKeywords(req, res) {
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
        return res.status(200).json({ success: true, count: baseKeywords.length, keywords: baseKeywords, fallback: true });
    }
}

// ─── 2. ADMIN TRENDS HANDLER ───────────────────────────────────────────────────
async function handleAdmin(req, res) {
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
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
            const { id, status } = body;

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
        console.error('Admin Trends Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}

// ─── 3. DASHBOARD TRENDS HANDLER ───────────────────────────────────────────────
async function handleDashboard(req, res) {
    try {
        const geo = req.query.geo || 'IN';
        const startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        await connectToDatabase();

        const trends = await Trend.find({ date: { $gte: startTime } }).sort({ date: -1 });

        const relevantTrends = trends.filter(t => t.status === 'relevant' || t.status === 'used');
        let totalTraffic = 0;
        trends.forEach(t => {
            let tval = (t.traffic || '').toString().replace(/[^0-9]/g, '');
            if (tval) totalTraffic += parseInt(tval);
        });
        
        const avgScore = trends.length > 0 ? Math.floor(trends.reduce((sum, t) => sum + (t.trendScore || 0), 0) / trends.length) : 0;
        
        const dateMap = {};
        for (let i = 29; i >= 0; i--) {
            const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dateMap[d] = { date: d, pending: 0, relevant: 0, used: 0 };
        }
        
        trends.forEach(t => {
            const d = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (dateMap[d]) {
                if (t.status === 'relevant') dateMap[d].relevant += 1;
                else if (t.status === 'pending') dateMap[d].pending += 1;
                else if (t.status === 'used') dateMap[d].used += 1;
            }
        });
        const timeData = Object.values(dateMap);

        const formatK = (num) => num > 1000 ? (num/1000).toFixed(1) + 'K' : num.toString();

        const kpis = [
            { title: "Total Trends Found", value: trends.length.toString(), change: "Active", color: "#f97316" },
            { title: "Total Est. Traffic", value: formatK(totalTraffic), change: "Global", color: "#10b981" },
            { title: "Relevant Keywords", value: relevantTrends.length.toString(), change: "SEO", color: "#8b5cf6" },
            { title: "Keywords Used", value: trends.filter(t=>t.status==='used').length.toString(), change: "Content", color: "#ec4899" },
            { title: "Avg. Trend Score", value: avgScore.toString(), change: "Score", color: "#3b82f6" },
            { title: "Database Health", value: "100%", change: "Live", color: "#10b981" }
        ];

        const topKeywords = trends
            .sort((a,b) => (b.trendScore || 0) - (a.trendScore || 0))
            .slice(0, 100)
            .map(t => ({ kw: t.keyword, score: t.trendScore || 0, traffic: t.traffic || '10K+', intent: t.searchIntent || 'Search' }));
       
        const responseData = {
            success: true,
            data: {
                searchInterestData: timeData,
                topStates: topKeywords.slice(0, 25).map((k) => ({ state: k.kw, score: k.score })),
                relatedQueries: topKeywords.map((k) => ({ query: k.kw, growth: k.traffic })),
                trendingTopics: topKeywords.map((k) => ({ topic: k.kw, score: k.score, growth: k.traffic })),
                trendingCategories: topKeywords.map((k) => ({ cat: k.intent, score: k.score, growth: k.traffic })),
                topKeywords: topKeywords,
                kpis
            }
        };
        
        return res.status(200).json(responseData);

    } catch (err) {
        console.error("Trends Dashboard Error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

