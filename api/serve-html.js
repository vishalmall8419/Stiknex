import connectToDatabase from './_utils/db.js';
import Trend from './_models/Trend.js';
import redisClient from './_utils/redis.js';

export default async function handler(req, res) {
  try {
    // 1. Fetch the raw static index.html from Vercel's static edge network
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = protocol + '://' + host;
    
    // We append ?raw=1 to avoid redirect loops if there was one, but /index.html is static
    const htmlRes = await fetch(baseUrl + '/index.html');
    let html = await htmlRes.text();

    if (!html || !html.includes('<html')) {
        return res.status(500).send('Failed to fetch base HTML template');
    }

    // 2. Fetch SEO Trends from Cache or DB
    const cacheKey = 'seo_meta_tags_html';
    let keywordsStr = await redisClient.get(cacheKey);

    if (!keywordsStr) {
        await connectToDatabase();
        const trends = await Trend.find({ status: { $ne: 'ignored' } })
            .sort({ trendScore: -1 })
            .limit(100);
        
        keywordsStr = trends.map(t => t.keyword).join(', ');
        
        if (keywordsStr) {
            await redisClient.setex(cacheKey, 14400, keywordsStr); // Cache for 4 hrs
        }
    }

    // 3. Server-Side Injection of Meta Tags for SEO Crawlers!
    if (keywordsStr) {
      html = html.replace(
        /<meta name="keywords" content="(.*?)"\s*\/?>/i,
        <meta name="keywords" content=" + keywordsStr + , $1" />
      );

      const top10 = keywordsStr.split(',').slice(0, 15).join(',');
      html = html.replace(
        /<meta name="description" content="(.*?)"\s*\/?>/i,
        <meta name="description" content="$1 Live Trends:  + top10 + ." />
      );
    }

    // 4. Send the Server-Side Rendered HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).send(html);

  } catch (error) {
    console.error("HTML SSR Injection Error:", error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
}
