import connectToDatabase from './_utils/db.js';
import Blog from './_models/Blog.js';
import Trend from './_models/Trend.js';
import { verifyAdminToken } from './_utils/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // --- MULTIPLEXED EXTERNAL MONITORING LOGIC ---
        if (req.query.action === 'monitor-external') {
            const endpoints = [
                { 
                    id: 'portfolio', 
                    name: 'Vishal Portfolio Backend', 
                    url: 'https://vishal-portfolio-backend-yzb1.onrender.com',
                    type: 'Render API'
                },
                { 
                    id: 'narama', 
                    name: 'Narama Cosmetics Health', 
                    url: 'https://narama-cosmetics.onrender.com/api/health',
                    type: 'Render API'
                }
            ];

            const results = await Promise.all(endpoints.map(async (ep) => {
                const startTime = Date.now();
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 30000);

                    const response = await fetch(ep.url, { signal: controller.signal });
                    clearTimeout(timeoutId);

                    const timeTaken = Date.now() - startTime;
                    
                    let data = null;
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        data = await response.json();
                    } else {
                        data = await response.text();
                        if (data.length > 500) data = data.substring(0, 500) + '...';
                    }

                    return {
                        ...ep,
                        status: response.status,
                        ok: response.ok,
                        timeTaken,
                        data
                    };
                } catch (error) {
                    return {
                        ...ep,
                        status: error.name === 'AbortError' ? 408 : 500,
                        ok: false,
                        timeTaken: Date.now() - startTime,
                        error: error.name === 'AbortError' ? 'Request Timeout (Render might be waking up)' : error.message
                    };
                }
            }));

            return res.status(200).json({ success: true, services: results, timestamp: new Date().toISOString() });
        }

        // --- ORIGINAL SEO STATS LOGIC ---
        const isAdmin = verifyAdminToken(req.headers['authorization']?.split(' ')[1] || req.cookies.stkx_admin_token);
        const isAdmin = verifyAdminToken(req.headers['authorization']?.split(' ')[1] || req.cookies?.stkx_admin_token);
        
        await connectToDatabase();
        
        const publishedBlogsCount = await Blog.countDocuments({ published: true });
        const totalKeywordsCount = await Trend.countDocuments();
        
        res.status(200).json({
            publishedBlogs: publishedBlogsCount,
            totalKeywords: totalKeywordsCount,
            lastCronRun: 'Running on Vercel Cron (0 3 * * *)',
            sitemapStatus: "Active",
            robotsStatus: "Active"
        });
    } catch (error) {
        console.error('Fetch Stats Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
