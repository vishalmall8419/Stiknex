import { seoConfig, getSeoForPath, BASE_URL } from './_utils/seoConfig.js';

export default async function handler(req, res) {
    const rawPath = req.query.path || '/';
    const cleanPath = rawPath.startsWith('/') ? rawPath : '/' + rawPath;
    
    // Remove trailing slash for matching, except if it's strictly "/"
    let matchPath = cleanPath;
    if (matchPath.length > 1 && matchPath.endsWith('/')) {
        matchPath = matchPath.slice(0, -1);
    }
    
    // Retrieve matched or alias SEO
    const seo = getSeoForPath(matchPath);

    try {
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers.host || 'stiknex.vercel.app';
        const baseUrl = `${protocol}://${host}`;

        // Fetch the compiled index.html
        const htmlRes = await fetch(`${baseUrl}/index.html`);
        let html = await htmlRes.text();

        // Inject dynamic SEO tags
        const title = seo.title;
        const description = seo.description;
        const keywords = seo.keywords;
        const url = `${baseUrl}${cleanPath}`;

        // Replace default title
        html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
        
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

        // Replace Twitter tags
        html = html.replace(
            /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
            `<meta name="twitter:title" content="${title}" />`
        );
        html = html.replace(
            /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
            `<meta name="twitter:description" content="${description}" />`
        );

        // Replace standard meta description
        html = html.replace(
            /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
            `<meta name="description" content="${description}" />`
        );

        // Ensure canonical link is present and correct
        const canonicalUrl = `${baseUrl}${seo.path || cleanPath}`;
        if (html.includes('<link rel="canonical"')) {
            html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`);
        } else {
            html = html.replace('</head>', `<link rel="canonical" href="${canonicalUrl}" />\n</head>`);
        }

        // Add semantic markup payload into rendered HTML for search engine indexing
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

        // Send the customized HTML
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200'); // Cache for 24 hours
        return res.status(200).send(html);

    } catch (error) {
        console.error('Error in render-page:', error);
        // Fallback to sending the raw index.html or simple redirect
        res.redirect(302, '/');
    }
}
