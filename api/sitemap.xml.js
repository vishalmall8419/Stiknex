import connectToDatabase from './_utils/db.js';
import Blog from './_models/Blog.js';
import { seoConfig, BASE_URL } from './_utils/seoConfig.js';
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
        const baseUrl = BASE_URL || 'https://stiknex.site';
        const defaultDate = '2026-10-30';
        
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

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Core Public Pages from seoConfig (Excludes private / admin routes)
        for (const [routePath, config] of Object.entries(seoConfig)) {
            const fullUrl = routePath === "/" ? `${baseUrl}/` : `${baseUrl}${routePath}`;
            const lastmod = routeDates[routePath] || defaultDate;

            xml += `  <url>\n`;
            xml += `    <loc>${fullUrl}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += `  </url>\n`;
        }

        // Dynamic Published Blog Pages
        if (Array.isArray(blogs) && blogs.length > 0) {
            const seenSlugs = new Set();
            blogs.forEach(blog => {
                if (!blog.slug || seenSlugs.has(blog.slug)) return;
                seenSlugs.add(blog.slug);
                let modDate = defaultDate;
                const dateVal = blog.updatedAt || blog.publishedAt;
                if (dateVal) {
                    try {
                        modDate = new Date(dateVal).toISOString().split('T')[0];
                    } catch (_) {}
                }

                xml += `  <url>\n`;
                xml += `    <loc>${baseUrl}/blog/${encodeURIComponent(blog.slug)}</loc>\n`;
                xml += `    <lastmod>${modDate}</lastmod>\n`;
                xml += `  </url>\n`;
            });
        }

        xml += `</urlset>`;

        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
        return res.status(200).send(xml);
    } catch (error) {
        console.error('Sitemap Error:', error);
        return res.status(500).json({ error: 'Failed to generate sitemap', message: error.message });
    }
}
