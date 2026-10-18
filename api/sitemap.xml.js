import connectToDatabase from './_utils/db.js';
import Blog from './_models/Blog.js';
import { seoConfig, BASE_URL } from './_utils/seoConfig.js';

export default async function handler(req, res) {
    try {
        const baseUrl = BASE_URL || 'https://stiknex.site';
        const today = new Date().toISOString().split('T')[0];
        
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
        for (const [path, config] of Object.entries(seoConfig)) {
            let priority = "0.8";
            let changefreq = "weekly";

            if (path === "/") {
                priority = "1.0";
                changefreq = "daily";
            } else if (["/sticky-notes", "/online-notebook", "/whiteboard", "/tools"].includes(path)) {
                priority = "0.9";
                changefreq = "daily";
            } else if (path === "/blog") {
                priority = "0.8";
                changefreq = "daily";
            } else if (["/about", "/buy-me-a-coffee"].includes(path)) {
                priority = "0.6";
                changefreq = "monthly";
            }

            const fullUrl = path === "/" ? `${baseUrl}/` : `${baseUrl}${path}`;

            xml += `  <url>\n`;
            xml += `    <loc>${fullUrl}</loc>\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += `    <changefreq>${changefreq}</changefreq>\n`;
            xml += `    <priority>${priority}</priority>\n`;
            xml += `  </url>\n`;
        }

        // Dynamic Published Blog Pages
        if (Array.isArray(blogs) && blogs.length > 0) {
            const seenSlugs = new Set();
            blogs.forEach(blog => {
                if (!blog.slug || seenSlugs.has(blog.slug)) return;
                seenSlugs.add(blog.slug);
                let modDate = today;
                const dateVal = blog.updatedAt || blog.publishedAt;
                if (dateVal) {
                    try {
                        modDate = new Date(dateVal).toISOString().split('T')[0];
                    } catch (_) {}
                }

                xml += `  <url>\n`;
                xml += `    <loc>${baseUrl}/blog/${encodeURIComponent(blog.slug)}</loc>\n`;
                xml += `    <lastmod>${modDate}</lastmod>\n`;
                xml += `    <changefreq>monthly</changefreq>\n`;
                xml += `    <priority>0.7</priority>\n`;
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
