import connectToDatabase from './_utils/db.js';
import ActiveSeoKeyword from './_models/ActiveSeoKeyword.js';
import Trend from './_models/Trend.js';
import redisClient from './_utils/redis.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Read index.html directly from disk — avoids HTTP loop through this same handler
    const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    if (!html || !html.includes('<html')) {
      return res.status(500).send('Failed to read HTML template from disk');
    }

    // Try Redis cache first (expires after 7 hours — same as cron interval)
    const cacheKey = 'seo_meta_tags_html';
    let keywordsStr = await redisClient.get(cacheKey);

    if (!keywordsStr) {
      await connectToDatabase();

      // PRIMARY: Use ActiveSeoKeyword (freshest trending keywords, replaced each cron run)
      let activeKeywords = await ActiveSeoKeyword.find({})
        .sort({ numericTraffic: -1, trendScore: -1 })
        .limit(120)
        .lean();

      if (activeKeywords.length > 0) {
        keywordsStr = activeKeywords.map(k => k.keyword).join(', ');
      } else {
        // FALLBACK: Use Trend collection (in case cron hasn't run yet)
        const trends = await Trend.find({ status: { $ne: 'ignored' } })
          .sort({ numericTraffic: -1, trendScore: -1 })
          .limit(100)
          .lean();
        keywordsStr = trends.map(t => t.keyword).join(', ');
      }

      if (keywordsStr) {
        // Cache for 7 hours (matches cron refresh interval)
        await redisClient.setex(cacheKey, 7 * 60 * 60, keywordsStr);
      }
    }

    if (keywordsStr) {
      // Fully replace the keywords meta tag with fresh trending keywords from DB
      html = html.replace(
        /<meta[^>]*name=["']keywords["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/is,
        '<meta name="keywords" content="' + keywordsStr + '" />'
      );

      // Append top 15 trending terms to the description
      const top15 = keywordsStr.split(',').slice(0, 15).join(', ');
      html = html.replace(
        /<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*\/?>/is,
        (match, p1) =>
          '<meta name="description" content="' +
          p1.replace(/\s+/g, ' ').trim() +
          ' Live Trends: ' +
          top15 +
          '." />'
      );
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Short edge cache — let Vercel CDN cache for 15 min, revalidate in background
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    return res.status(200).send(html);

  } catch (error) {
    console.error('HTML SSR Injection Error:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
}