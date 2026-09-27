import connectToDatabase from './_utils/db.js';
import Trend from './_models/Trend.js';
import redisClient from './_utils/redis.js';

export default async function handler(req, res) {
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = protocol + '://' + host;
    
    const htmlRes = await fetch(baseUrl + '/index.html');
    let html = await htmlRes.text();

    if (!html || !html.includes('<html')) {
        return res.status(500).send('Failed to fetch base HTML template');
    }

    const cacheKey = 'seo_meta_tags_html';
    let keywordsStr = await redisClient.get(cacheKey);

    if (!keywordsStr) {
        await connectToDatabase();
        const trends = await Trend.find({ status: { $ne: 'ignored' } })
            .sort({ trendScore: -1 })
            .limit(100);
        
        keywordsStr = trends.map(t => t.keyword).join(', ');
        
        if (keywordsStr) {
            await redisClient.setex(cacheKey, 14400, keywordsStr);
        }
    }

    if (keywordsStr) {
      html = html.replace(
        /<meta[^>]*name=["']keywords["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/is,
        (match, p1) => '<meta name="keywords" content="' + keywordsStr + ', ' + p1.replace(/\s+/g, ' ').trim() + '" />'
      );

      const top10 = keywordsStr.split(',').slice(0, 15).join(', ');
      html = html.replace(
        /<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/is,
        (match, p1) => '<meta name="description" content="' + p1.replace(/\s+/g, ' ').trim() + ' Live Trends: ' + top10 + '." />'
      );
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).send(html);

  } catch (error) {
    console.error("HTML SSR Injection Error:", error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
}