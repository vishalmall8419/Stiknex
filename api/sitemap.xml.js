import connectToDatabase from './_utils/db.js';
import Blog from './_models/Blog.js';
import { seoConfig } from './_utils/seoConfig.js';

export default async function handler(req, res) {
    try {
        await connectToDatabase();
        const blogs = await Blog.find({ published: true }).select('slug publishedAt').sort({ publishedAt: -1 });

        const baseUrl = 'https://stiknex.vercel.app';
        
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Iterate over static routes defined in seoConfig
        const today = new Date().toISOString().split('T')[0];
        
        for (const [path, config] of Object.entries(seoConfig)) {
            let priority = "0.8";
            let changefreq = "weekly";
            
            if (path === "/") {
                priority = "1.0";
                changefreq = "daily";
            } else if (path.startsWith("/tools/")) {
                priority = "0.9";
                changefreq = "weekly";
            } else if (path === "/notes" || path === "/notebook" || path === "/whiteboard") {
                priority = "0.9";
            } else if (path === "/blog") {
                changefreq = "daily";
            }

            // Remove trailing slash for root or format properly
            const fullUrl = path === "/" ? `${baseUrl}/` : `${baseUrl}${path}`;

            xml += `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
        }

        // Add Notes since it's not in seoConfig explicitly (or maybe add it manually)
        xml += `
  <url>
    <loc>${baseUrl}/notes</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

        // Add dynamic blogs
        blogs.forEach(blog => {
            let modDate = today;
            if (blog.publishedAt) {
                try {
                    modDate = blog.publishedAt.toISOString().split('T')[0];
                } catch(e) {}
            }
            xml += `
  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${modDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });

        xml += `\n</urlset>`;

        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400'); // 1 hr cache
        res.status(200).send(xml);
    } catch (error) {
        console.error('Sitemap Error:', error);
        res.status(500).end();
    }
}
