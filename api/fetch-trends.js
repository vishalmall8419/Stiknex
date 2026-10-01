import connectToDatabase from './_utils/db.js';
import Trend from './_models/Trend.js';
import ActiveSeoKeyword from './_models/ActiveSeoKeyword.js';
import { verifyAdminToken } from './_utils/auth.js';
import redisClient from './_utils/redis.js';


const POSITIVE_KEYWORDS = [
    'sticky notes', 'notes', 'notebook', 'markdown', 'whiteboard', 
    'excalidraw', 'productivity', 'todo', 'task', 'kanban', 
    'journal', 'diary', 'offline app', 'pwa', 'drawing', 
    'mindmap', 'planning', 'tools', 'calculator', 'workspace', 'study', 'focus'
];
const NEGATIVE_KEYWORDS = [
    'movie', 'cricket', 'match', 'ipl', 'football', 'election', 
    'murder', 'death', 'scandal', 'gossip', 'porn', 'sex', 
    'nude', 'xxx', 'rape', 'kill', 'weather', 'stock', 'share price',
    'celebrity', 'actor', 'actress', 'music', 'song'
];

const INTENT_MAPPING = {
    Informational: ['how', 'what', 'why', 'ideas', 'meaning', 'tutorial', 'guide', 'best', 'top', 'tips', 'tricks'],
    Transactional: ['app', 'software', 'download', 'online', 'free', 'tool', 'maker', 'generator', 'template'],
    Navigational: ['stiknex', 'login', 'signup', 'dashboard']
};

function parseTraffic(trafficStr) {
    if (!trafficStr) return 0;
    let num = parseFloat(trafficStr.replace(/[^0-9.]/g, ''));
    if (trafficStr.toLowerCase().includes('k')) num *= 1000;
    if (trafficStr.toLowerCase().includes('m')) num *= 1000000;
    return num;
}

function processRelevanceEngine(keyword, trafficStr) {
    const lower = keyword.toLowerCase();
    
    // 1. Filter Irrelevant
    for (let term of NEGATIVE_KEYWORDS) {
        if (lower.includes(term)) return { status: 'ignored' };
    }

    // 2. Base Relevance Score
    let relevanceScore = 0;
    for (let term of POSITIVE_KEYWORDS) {
        if (lower.includes(term)) {
            relevanceScore += (term === 'sticky notes' || term === 'whiteboard' || term === 'productivity') ? 40 : 20;
        }
    }

    let status = 'relevant'; // Auto-marking all non-ignored as relevant for automatic 100 SEO injection
    // Removed over-aggressive ignore for 0 score so Admin can manually review non-negative trends in Pending tab 

    // 3. Search Intent
    let searchIntent = 'Unknown';
    for (let intent in INTENT_MAPPING) {
        if (INTENT_MAPPING[intent].some(term => lower.includes(term))) {
            searchIntent = intent;
            break;
        }
    }

    // 4. Suggestion Type
    let suggestionType = 'None';
    if (status !== 'ignored') {
        if (searchIntent === 'Informational') suggestionType = 'Blog';
        else if (searchIntent === 'Transactional') {
            if (lower.includes('tool') || lower.includes('generator')) suggestionType = 'Tool Page';
            else suggestionType = 'Existing Content';
        } else {
            suggestionType = 'Blog';
        }
    }

    // 5. Trend Score 
    const numericTraffic = parseTraffic(trafficStr);
    let trendScore = 0;
    if (numericTraffic > 0) {
        trendScore = Math.min(100, Math.round((Math.log10(numericTraffic) / 6) * 100));
    }

    return { status, relevanceScore, searchIntent, suggestionType, numericTraffic, trendScore };
}

async function fetchRssFeed(geo) {
    const url = `https://trends.google.com/trending/rss?geo=${geo}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    const xml = await response.text();
    
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
        const itemContent = match[1];
        
        const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
        const trafficMatch = itemContent.match(/<ht:approx_traffic>([\s\S]*?)<\/ht:approx_traffic>/);
        const linkMatch = itemContent.match(/<ht:news_item_url>([\s\S]*?)<\/ht:news_item_url>/);
        
        if (titleMatch) {
            items.push({
                query: titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim(),
                traffic: trafficMatch ? trafficMatch[1].trim() : "10K+",
                url: linkMatch ? linkMatch[1].trim() : ""
            });
        }
    }
    return items;
}

export default async function handler(req, res) {
    try {
        const authHeader = req.headers.authorization;
        const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
        
        let isAuth = false;
        if (isCron) {
            isAuth = true;
        } else {
            const auth = verifyAdminToken(req);
            isAuth = auth.valid;
        }
        
        if (!isAuth) {
            return res.status(401).json({ success: false, message: 'Unauthorized fetch trigger' });
        }

        await connectToDatabase();

        // Top 12 Geos
        const geos = ['US', 'IN', 'GB', 'CA', 'AU', 'DE', 'FR', 'BR', 'JP', 'ZA', 'SG', 'AE', 'IT', 'ES', 'MX', 'NL', 'SE', 'CH', 'TR', 'AR', 'CO', 'CL', 'PH', 'MY'];
        
        let addedCount = 0;
        let totalProcessed = 0;
        let ignoredCount = 0;
        let errorGeos = [];

        for (const geo of geos) {
            try {
                const trends = await fetchRssFeed(geo);
                
                for (const search of trends) {
                    totalProcessed++;
                    const engineResult = processRelevanceEngine(search.query, search.traffic);
                    
                    if (engineResult.status === 'ignored') {
                        ignoredCount++;
                        continue; 
                    }

                    try {
                        const result = await Trend.updateOne(
                            { keyword: search.query },
                            { 
                                $setOnInsert: { 
                                    keyword: search.query, 
                                    traffic: search.traffic, 
                                    numericTraffic: engineResult.numericTraffic,
                                    url: search.url,
                                    date: new Date(),
                                    status: engineResult.status,
                                    trendScore: engineResult.trendScore,
                                    relevanceScore: engineResult.relevanceScore,
                                    searchIntent: engineResult.searchIntent,
                                    suggestionType: engineResult.suggestionType
                                } 
                            },
                            { upsert: true }
                        );
                        // upsertedCount is 1 if new doc was inserted
                        if (result.upsertedCount > 0 || (result.upserted && result.upserted.length > 0) || result.upsertedId) {
                            addedCount++;
                        }
                    } catch (dbErr) {
                        // Ignore specific duplicate key errors during parallel race conditions
                    }
                }
            } catch (err) {
                console.error(`Failed RSS fetch for geo ${geo}:`, err.message);
                errorGeos.push(geo);
            }
        }

        // ─── ACTIVE SEO KEYWORDS UPDATE ───────────────────────────────────
        // Collect all non-ignored trends from this run, sorted by traffic desc
        // These are FRESH keywords from Google Trends for live SEO injection
        try {
            // Get top 100 most-trending non-ignored keywords from DB (latest 7 days)
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const freshTrends = await Trend.find({
                status: { $ne: 'ignored' },
                date: { $gte: sevenDaysAgo }
            })
            .sort({ numericTraffic: -1, trendScore: -1 })
            .limit(150)
            .lean();

            if (freshTrends.length > 0) {
                // Wipe old active SEO keywords and replace with latest
                await ActiveSeoKeyword.deleteMany({});
                const seoKeywordDocs = freshTrends.map(t => ({
                    keyword: t.keyword,
                    traffic: t.traffic,
                    numericTraffic: t.numericTraffic || 0,
                    trendScore: t.trendScore || 0,
                    relevanceScore: t.relevanceScore || 0,
                    fetchedAt: new Date()
                }));
                await ActiveSeoKeyword.insertMany(seoKeywordDocs, { ordered: false });
                console.log(`Updated ActiveSeoKeyword with ${seoKeywordDocs.length} fresh SEO keywords`);
            }
        } catch (seoErr) {
            console.error('Failed to update ActiveSeoKeyword:', seoErr.message);
        }

        // Clear Redis SEO cache so next page load picks up fresh keywords
        try {
            if (redisClient && redisClient.del) {
                await redisClient.del('seo_meta_tags_html');
                await redisClient.del('seo_opportunities_all');
            }
        } catch (e) {}

        const responseJson = { 
            success: true, 
            metrics: {
                totalTrendsFetched: totalProcessed,
                ignoredCount: ignoredCount,
                newlyAddedToDB: addedCount,
                geosProcessed: geos.length - errorGeos.length,
                failedGeos: errorGeos
            },
            message: `Fetched ${totalProcessed} global trends. Ignored ${ignoredCount}. Added ${addedCount} new SEO keywords to DB.` 
        };
        
        res.status(200).json(responseJson);

    } catch (error) {
        console.error('Critical Error fetching trends:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
