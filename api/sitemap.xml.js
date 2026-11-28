import connectToDatabase from './_utils/db.js';
import Blog from './_models/Blog.js';
import { seoConfig, BASE_URL } from './_utils/seoConfig.js';
import { getAllowedStaticRoutes, buildSitemapXml, SITE_URL } from './_utils/sitemapRules.js';
import fs from 'fs';
import path from 'path';

// Load pre-generated genuine route dates if available
let routeDates = {};
try {
    const datesPath = path.join(process.cwd(), 'api', '_utils', 'routeDates.json');
    if (fs.existsSync(datesPath)) {
        routeDates = JSON.parse(fs.readFileSync(datesPath, 'utf8'));
    }
} catch (_) {}

export default async function handler(req, res) {
    try {
        const hostHeader = (req.headers['x-forwarded-host'] || req.headers.host || '').toLowerCase().split(':')[0];
        if (hostHeader === 'stiknex.vercel.app' || (hostHeader.endsWith('.vercel.app') && !hostHeader.includes('localhost')) || hostHeader === 'www.stiknex.site') {
            res.setHeader('Location', 'https://stiknex.site/sitemap.xml');
            return res.status(301).end();
        }
        const baseUrl = BASE_URL || SITE_URL;

        let blogs = [];
        try {
            await connectToDatabase();
            blogs = await Blog.find({ published: true, validationStatus: { $ne: 'failed' } })
                .select('slug publishedAt updatedAt')
                .sort({ publishedAt: -1 })
                .lean();
        } catch (dbErr) {
            console.warn('Sitemap DB fetch warning (using static routes):', dbErr.message);
        }

        const staticRoutes = getAllowedStaticRoutes(seoConfig, baseUrl);
        const xml = buildSitemapXml({ staticRoutes, routeDates, blogs, baseUrl });

        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
        return res.status(200).send(xml);
    } catch (error) {
        console.error('Sitemap Error:', error);
        return res.status(500).json({ error: 'Failed to generate sitemap', message: error.message });
    }
}
