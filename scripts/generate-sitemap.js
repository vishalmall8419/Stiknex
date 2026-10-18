import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { seoConfig, BASE_URL } from '../src/utils/seoConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

const today = new Date().toISOString().split('T')[0];
const baseUrl = BASE_URL || 'https://stiknex.site';

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const [routePath, config] of Object.entries(seoConfig)) {
    let priority = "0.8";
    let changefreq = "weekly";

    if (routePath === "/") {
        priority = "1.0";
        changefreq = "daily";
    } else if (["/sticky-notes", "/online-notebook", "/whiteboard", "/tools"].includes(routePath)) {
        priority = "0.9";
        changefreq = "daily";
    } else if (routePath === "/blog") {
        priority = "0.8";
        changefreq = "daily";
    } else if (["/about", "/buy-me-a-coffee"].includes(routePath)) {
        priority = "0.6";
        changefreq = "monthly";
    }

    const fullUrl = routePath === "/" ? `${baseUrl}/` : `${baseUrl}${routePath}`;

    xml += `  <url>\n`;
    xml += `    <loc>${fullUrl}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
}

xml += `</urlset>`;

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(sitemapPath, xml, 'utf-8');
console.log(`✅ Successfully generated static sitemap at ${sitemapPath} with ${Object.keys(seoConfig).length} URLs.`);

