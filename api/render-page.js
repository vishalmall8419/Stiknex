import { getSeoForPath, BASE_URL } from './_utils/seoConfig.js';
import connectToDatabase from './_utils/db.js';
import Blog from './_models/Blog.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    const { slug, type } = req.query;
    const rawPath = req.query.path || '/';
    const cleanPath = rawPath.startsWith('/') ? rawPath : '/' + rawPath;
    
    // Determine protocol and host
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'stiknex.vercel.app';
    const baseUrl = `${protocol}://${host}`;

    try {
        // Load index.html: try local dist first, then fetch fallback
        let html = '';
        try {
            const indexPath = path.join(process.cwd(), 'dist', 'index.html');
            if (fs.existsSync(indexPath)) {
                html = await fs.promises.readFile(indexPath, 'utf-8');
            }
        } catch (_) {}

        if (!html) {
            const htmlRes = await fetch(`${baseUrl}/index.html`);
            html = await htmlRes.text();
        }

        // If requesting a blog post
        if (slug || type === 'blog') {
            await connectToDatabase();
            const blog = await Blog.findOne({ slug });

            if (!blog) {
                return res.redirect(301, '/blog');
            }

            const title = blog.metaTitle || blog.title;
            const description = blog.metaDescription || blog.excerpt || '';
            const keywords = blog.keywords || '';
            const imageUrl = blog.imageUrl || `${baseUrl}/Stiknex.png`;
            const blogUrl = `${baseUrl}/blog/${slug}`;

            html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
            html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`);
            html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title}" />`);
            html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`);
            html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/, `<meta property="og:url" content="${blogUrl}" />`);
            html = html.replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/, `<meta property="og:image" content="${imageUrl}" />`);
            html = html.replace(/<meta\s+property="og:image:secure_url"\s+content="[^"]*"\s*\/>/, `<meta property="og:image:secure_url" content="${imageUrl}" />`);
            html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${title}" />`);
            html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${description}" />`);
            html = html.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${imageUrl}" />`);

            if (html.includes('<link rel="canonical"')) {
                html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${blogUrl}" />`);
            } else {
                html = html.replace('</head>', `<link rel="canonical" href="${blogUrl}" />\n</head>`);
            }

            const semanticPayload = `
            <noscript>
                <main>
                    <h1>${title}</h1>
                    <p>${description}</p>
                    <article>
                        ${blog.content || ''}
                    </article>
                </main>
            </noscript>
            `;
            html = html.replace('</head>', `${semanticPayload}</head>`);

            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
            return res.status(200).send(html);
        }

        // Otherwise handle standard route SEO
        let matchPath = cleanPath;
        if (matchPath.length > 1 && matchPath.endsWith('/')) {
            matchPath = matchPath.slice(0, -1);
        }
        const seo = getSeoForPath(matchPath);

        const title = seo.title;
        const description = seo.description;
        const keywords = seo.keywords;
        const pageUrl = `${baseUrl}${cleanPath}`;

        html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
        html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`);
        html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title}" />`);
        html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`);
        html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/, `<meta property="og:url" content="${pageUrl}" />`);
        html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${title}" />`);
        html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${description}" />`);

        const canonicalUrl = `${baseUrl}${seo.path || cleanPath}`;
        if (html.includes('<link rel="canonical"')) {
            html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`);
        } else {
            html = html.replace('</head>', `<link rel="canonical" href="${canonicalUrl}" />\n</head>`);
        }

        const semanticPayload = `
        <noscript>
            <main>
                <h1>${seo.h1 || title}</h1>
                <p>${description}</p>
                <p>Keywords: ${keywords}</p>
                <nav aria-label="Breadcrumb">
                    <a href="${baseUrl}/">Home</a> &gt; <span>${title}</span>
                </nav>
            </main>
        </noscript>
        `;
        html = html.replace('</head>', `${semanticPayload}</head>`);

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
        return res.status(200).send(html);

    } catch (error) {
        console.error('Error in render-page:', error);
        res.redirect(302, '/');
    }
}
