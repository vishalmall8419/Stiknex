import connectToDatabase from './_utils/db.js';
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

    // Fetch trending keywords from Redis cache first, then DB
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
      // Fully replace the keywords meta tag with DB-driven keywords
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
    // No CDN cache — always serve fresh SSR HTML
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(html);

  } catch (error) {
    console.error('HTML SSR Injection Error:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
}