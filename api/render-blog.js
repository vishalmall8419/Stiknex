import connectToDatabase from './_utils/db.js';
import Blog from './_models/Blog.js';

export default async function handler(req, res) {
    const { slug } = req.query;

    try {
        await connectToDatabase();
        const blog = await Blog.findOne({ slug });

        // Fallback to home page if blog not found
        if (!blog) {
            return res.redirect(301, '/');
        }

        // Determine protocol and host
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host || 'stiknex.vercel.app';
        const baseUrl = `${protocol}://${host}`;

        // Fetch the compiled index.html
        const htmlRes = await fetch(`${baseUrl}/index.html`);
        let html = await htmlRes.text();

        // Inject dynamic SEO tags
        const title = blog.metaTitle || blog.title;
        const description = blog.metaDescription || blog.excerpt;
        const keywords = blog.keywords || "";
        const imageUrl = blog.imageUrl || `${baseUrl}/Stiknex.png`;
        const url = `${baseUrl}/blog/${slug}`;

        // Replace default title
        html = html.replace(//<title>[\s\S]*?<\/title>/`);
        
        // Replace or add keywords
        html = html.replace(
            /<!-- =========================================================\s*KEYWORDS\s*========================================================== -->/,
            `<!-- KEYWORDS --><meta name="keywords" content="${keywords}" />`
        );

        // Replace OG tags
        html = html.replace(
            /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
            `<meta property="og:title" content="${title}" />`
        );
        html = html.replace(
            /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
            `<meta property="og:description" content="${description}" />`
        );
        html = html.replace(
            /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
            `<meta property="og:url" content="${url}" />`
        );
        html = html.replace(
            /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/,
            `<meta property="og:image" content="${imageUrl}" />`
        );
        html = html.replace(
            /<meta\s+property="og:image:secure_url"\s+content="[^"]*"\s*\/>/,
            `<meta property="og:image:secure_url" content="${imageUrl}" />`
        );
        
        // Replace Twitter tags
        html = html.replace(
            /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
            `<meta name="twitter:title" content="${title}" />`
        );
        html = html.replace(
            /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
            `<meta name="twitter:description" content="${description}" />`
        );
        html = html.replace(
            /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/,
            `<meta name="twitter:image" content="${imageUrl}" />`
        );

        // Send modified HTML with cache headers (cache for 1 hour at Edge)
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        res.status(200).send(html);
        
    } catch (error) {
        console.error('Error rendering blog HTML:', error);
        res.redirect(302, '/blog');
    }
}
