import { getSeoForPath, BASE_URL, SITE_URL } from './_utils/seoConfig.js';
import connectToDatabase from './_utils/db.js';
import Blog from './_models/Blog.js';
import fs from 'fs';
import path from 'path';

function replaceRootHtml(templateHtml, newRoot) {
    if (templateHtml.includes('<!-- stiknex-root-end -->')) {
        return templateHtml.replace(/<div id="root">[\s\S]*?<\/div><!-- stiknex-root-end -->/, newRoot);
    }
    if (/<div id="root">[\s\S]*?<\/div>\s*<script type="module"/.test(templateHtml)) {
        return templateHtml.replace(/<div id="root">[\s\S]*?<\/div>\s*<script type="module"/, `${newRoot}\n    <script type="module"`);
    }
    return templateHtml.replace(/<div id="root">[\s\S]*?<\/div>/, newRoot);
}

export default async function handler(req, res) {
    const { slug, type } = req.query;
    const rawPath = req.query.path || '/';
    const cleanPath = rawPath.startsWith('/') ? rawPath : '/' + rawPath;

    // Always use authoritative primary production domain for SEO metadata & canonicals
    const primaryDomain = SITE_URL || BASE_URL || 'https://stiknex.site';

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
            const host = req.headers.host || 'stiknex.site';
            const protocol = req.headers['x-forwarded-proto'] || 'https';
            const htmlRes = await fetch(`${protocol}://${host}/index.html`);
            html = await htmlRes.text();
        }

        // Global safety: replace any legacy domain references in base template with primary domain
        html = html.replace(/https:\/\/stiknex\.vercel\.app/g, primaryDomain);

        // Protected Admin / Dashboard / Auth routes: do NOT inject public marketing tools or FAQs
        const isAdminRoute = cleanPath.startsWith('/dashboard') ||
                             cleanPath.startsWith('/stiknex-secure-login-portal') ||
                             cleanPath.startsWith('/setup-2fa') ||
                             cleanPath === '/login';

        if (isAdminRoute) {
            html = html
                .replace(/<title>[\s\S]*?<\/title>/, `<title>Admin Portal | Stiknex</title>`)
                .replace(/<meta\s+name="robots"[\s\S]*?>/i, `<meta name="robots" content="noindex, nofollow" />`);
            html = replaceRootHtml(html, `
    <div id="root">
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0f172a; color: #94a3b8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="width: 32px; height: 32px; border: 3px solid #6366f1; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 12px;"></div>
        <p style="font-size: 13px; font-weight: 500;">Loading Stiknex Workspace...</p>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
      </div>
    </div>`);

            if (!html.includes('content="noindex, nofollow"')) {
                html = html.replace('</head>', `<meta name="robots" content="noindex, nofollow" />\n</head>`);
            }
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Cache-Control', 'no-store, max-age=0');
            return res.status(200).send(html);
        }

        // If requesting a dynamic blog post
        if (slug || type === 'blog') {
            await connectToDatabase();
            const blog = await Blog.findOne({ slug, published: true });

            if (!blog) {
                let notFoundHtml = html
                    .replace(/<title>[\s\S]*?<\/title>/, `<title>404 Blog Post Not Found | Stiknex</title>`);
                notFoundHtml = replaceRootHtml(notFoundHtml, `
    <div id="root">
      <header style="padding: 24px 16px; text-align: center; border-bottom: 1px solid #e2e8f0;">
        <a href="${primaryDomain}/" style="font-size: 24px; font-weight: 800; color: #4f46e5; text-decoration: none;">Stiknex</a>
      </header>
      <main style="max-width: 800px; margin: 0 auto; padding: 48px 16px; text-align: center;">
        <h1 style="font-size: 32px; font-weight: 800; color: #0f172a;">Article Not Found</h1>
        <p style="color: #64748b; margin-top: 12px; font-size: 16px;">The requested article may have been removed or moved to another address.</p>
        <p style="margin-top: 24px;"><a href="${primaryDomain}/blog" style="display: inline-block; padding: 10px 20px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Browse All Blog Articles</a></p>
      </main>
    </div>`);
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                return res.status(404).send(notFoundHtml);
            }

            const title = blog.metaTitle || blog.title;
            const description = blog.metaDescription || blog.excerpt || '';
            const keywords = blog.keywords || '';
            const imageUrl = blog.imageUrl || `${primaryDomain}/Stiknex.png`;
            const blogUrl = `${primaryDomain}/blog/${encodeURIComponent(slug)}`;

            // Convert raw markdown headings to HTML with IDs for TOC anchor navigation
            let formattedBody = (blog.content || `<p>${description}</p>`)
                .replace(/^##\s+(.+)$/gm, (m, h) => {
                    const id = h.toLowerCase().replace(/^[\d.]+\s*/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    return `<h2 id="${id}" style="font-size: 24px; font-weight: 700; color: #0f172a; margin-top: 36px; margin-bottom: 12px;">${h}</h2>`;
                })
                .replace(/^###\s+(.+)$/gm, (m, h) => {
                    const id = h.toLowerCase().replace(/^[\d.]+\s*/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    return `<h3 id="${id}" style="font-size: 20px; font-weight: 600; color: #1e293b; margin-top: 24px; margin-bottom: 8px;">${h}</h3>`;
                })
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #4f46e5; font-weight: 600; text-decoration: underline;">$1</a>')
                .replace(/\n\n+/g, '</p><p style="margin-bottom: 18px;">');

            html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title} | Stiknex</title>`);
            html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`);
            html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title} | Stiknex" />`);
            html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`);
            html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/, `<meta property="og:url" content="${blogUrl}" />`);
            html = html.replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/, `<meta property="og:image" content="${imageUrl}" />`);
            html = html.replace(/<meta\s+property="og:image:secure_url"\s+content="[^"]*"\s*\/>/, `<meta property="og:image:secure_url" content="${imageUrl}" />`);
            html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${title} | Stiknex" />`);
            html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${description}" />`);
            html = html.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${imageUrl}" />`);

            if (html.includes('<link rel="canonical"')) {
                html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${blogUrl}" />`);
            } else {
                html = html.replace('</head>', `<link rel="canonical" href="${blogUrl}" />\n</head>`);
            }

            const blogRoot = `
    <div id="root">
      <header style="padding: 20px 16px; border-bottom: 1px solid #e2e8f0; text-align: center;">
        <a href="${primaryDomain}/" style="font-size: 24px; font-weight: 800; color: #4f46e5; text-decoration: none;">Stiknex</a>
        <nav style="margin-top: 8px; font-size: 14px;">
          <a href="${primaryDomain}/" style="color: #64748b; margin: 0 8px; text-decoration: none;">Home</a> &gt;
          <a href="${primaryDomain}/blog" style="color: #64748b; margin: 0 8px; text-decoration: none;">Blog</a> &gt;
          <span style="color: #0f172a; font-weight: 600;">${title}</span>
        </nav>
      </header>
      <main style="max-width: 800px; margin: 0 auto; padding: 40px 16px;">
        <article>
          <header style="margin-bottom: 24px;">
            <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; line-height: 1.3;">${title}</h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Published on ${new Date(blog.publishedAt || Date.now()).toLocaleDateString()}</p>
          </header>
          <div style="font-size: 18px; line-height: 1.7; color: #334155; margin-bottom: 32px;">
            ${formattedBody}
          </div>
        </article>
        <footer style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
          <p style="font-weight: 700; color: #0f172a; margin-bottom: 12px;">Explore Stiknex Productivity Tools:</p>
          <nav aria-label="Explore Stiknex Tools">
            <ul style="display: flex; flex-wrap: wrap; gap: 12px; list-style: none; padding: 0;">
              <li><a href="${primaryDomain}/sticky-notes" style="color: #4f46e5; text-decoration: none; font-weight: 600;">Sticky Notes</a></li>
              <li><a href="${primaryDomain}/online-notebook" style="color: #4f46e5; text-decoration: none; font-weight: 600;">Online Notebook</a></li>
              <li><a href="${primaryDomain}/whiteboard" style="color: #4f46e5; text-decoration: none; font-weight: 600;">Whiteboard</a></li>
              <li><a href="${primaryDomain}/word-counter" style="color: #4f46e5; text-decoration: none; font-weight: 600;">Word Counter</a></li>
              <li><a href="${primaryDomain}/character-counter" style="color: #4f46e5; text-decoration: none; font-weight: 600;">Character Counter</a></li>
              <li><a href="${primaryDomain}/tools" style="color: #4f46e5; text-decoration: none; font-weight: 600;">All Tools</a></li>
            </ul>
          </nav>
        </footer>
      </main>
    </div>`;

            html = replaceRootHtml(html, blogRoot);

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
        const canonicalPath = seo.path || cleanPath;
        const canonicalUrl = canonicalPath === '/' ? `${primaryDomain}/` : `${primaryDomain}${canonicalPath}`;
        const pageUrl = cleanPath === '/' ? `${primaryDomain}/` : `${primaryDomain}${cleanPath}`;

        html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
        html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`);
        html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title}" />`);
        html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`);
        html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/, `<meta property="og:url" content="${pageUrl}" />`);
        html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${title}" />`);
        html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${description}" />`);

        if (html.includes('<link rel="canonical"')) {
            html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`);
        } else {
            html = html.replace('</head>', `<link rel="canonical" href="${canonicalUrl}" />\n</head>`);
        }

        let faqsHtml = '';
        if (seo.faqs && seo.faqs.length > 0) {
            faqsHtml = `
        <section style="margin: 32px 0;">
            <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">Frequently Asked Questions</h2>
            ${seo.faqs.map(f => `
            <div style="margin-bottom: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">${f.q}</h3>
                <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0;">${f.a}</p>
            </div>
            `).join('')}
        </section>`;
        }

        let relatedHtml = '';
        if (seo.relatedTools && seo.relatedTools.length > 0) {
            relatedHtml = `
        <section style="margin: 28px 0;">
            <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">Related Productivity Tools</h2>
            <ul style="display: flex; flex-wrap: wrap; gap: 10px; list-style: none; padding: 0;">
                ${seo.relatedTools.map(rt => {
                    const relSeo = getSeoForPath(rt);
                    const relTitle = relSeo?.title ? relSeo.title.split('–')[0].split('-')[0].split('|')[0].trim() : rt.replace('/', '');
                    return `<li><a href="${primaryDomain}${rt}" style="display: inline-block; padding: 8px 14px; background: #eef2ff; color: #4f46e5; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px;">${relTitle}</a></li>`;
                }).join('')}
            </ul>
        </section>`;
        }

        const homeRoot = `
    <div id="root">
      <nav style="position: fixed; top: 16px; left: 50%; transform: translateX(-50%); z-index: 50; padding: 10px 24px; background: rgba(255,255,255,0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(226,232,240,0.8); border-radius: 9999px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 16px; max-width: 96vw; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif;">
        <a href="${primaryDomain}/" style="display: flex; align-items: center; gap: 8px; text-decoration: none; font-weight: 900; font-size: 18px; color: #4f46e5; letter-spacing: -0.02em;">
          <img src="${primaryDomain}/logo.png" alt="Stiknex" width="24" height="24" style="object-fit: contain;" />
          <span style="background: linear-gradient(to right, #6366f1, #9333ea); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Stiknex</span>
        </a>
        <div style="display: flex; align-items: center; gap: 12px; font-size: 13px; font-weight: 500; color: #475569;">
          <a href="${primaryDomain}/sticky-notes" style="color: #475569; text-decoration: none; padding: 4px 8px;">Sticky Notes</a>
          <a href="${primaryDomain}/online-notebook" style="color: #475569; text-decoration: none; padding: 4px 8px;">Notepad</a>
          <a href="${primaryDomain}/whiteboard" style="color: #475569; text-decoration: none; padding: 4px 8px;">Whiteboard</a>
          <a href="${primaryDomain}/tools" style="color: #475569; text-decoration: none; padding: 4px 8px;">Tools</a>
          <a href="${primaryDomain}/blog" style="color: #475569; text-decoration: none; padding: 4px 8px;">Blog</a>
        </div>
      </nav>

      <main style="padding-top: 140px; padding-bottom: 60px; padding-left: 20px; padding-right: 20px; max-width: 1100px; margin: 0 auto; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif;">
        <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 9999px; background: #eef2ff; color: #4f46e5; font-size: 13px; font-weight: 500; margin-bottom: 24px; border: 1px solid #e0e7ff;">
          ✨ Welcome to the new standard of ideation
        </div>
        
        <h1 style="font-size: clamp(2.4rem, 5.5vw, 4.5rem); font-weight: 900; line-height: 1.1; margin: 0 auto 20px; color: #0f172a; letter-spacing: -0.03em; max-width: 900px;">
          Think Freely. <span style="background: linear-gradient(to right, #6366f1, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Create Boundlessly.</span>
        </h1>

        <p style="font-size: clamp(1rem, 2vw, 1.25rem); color: #475569; max-width: 680px; margin: 0 auto 36px; line-height: 1.6; font-weight: 300;">
          An infinite canvas for your sticky notes, integrated whiteboards, and structured notebooks. All in one place.
        </p>

        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin-bottom: 48px;">
          <a href="${primaryDomain}/sticky-notes" style="padding: 14px 32px; background: #4f46e5; color: #ffffff; border-radius: 9999px; font-size: 16px; font-weight: 600; text-decoration: none; box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);">Start Brainstorming &rarr;</a>
          <a href="${primaryDomain}/tools" style="padding: 14px 32px; background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 9999px; font-size: 16px; font-weight: 600; text-decoration: none;">Explore 15+ Tools</a>
        </div>

        <section style="margin-top: 48px; text-align: left; border-top: 1px solid #e2e8f0; padding-top: 36px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 16px; text-align: center;">Free Online Productivity Tools &amp; Utilities</h2>
          <nav aria-label="Tools Directory">
            <ul style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; list-style: none; padding: 0; margin: 0;">
              <li><a href="${primaryDomain}/sticky-notes" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Sticky Notes Board</a></li>
              <li><a href="${primaryDomain}/online-notebook" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Online Notebook</a></li>
              <li><a href="${primaryDomain}/whiteboard" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Online Whiteboard</a></li>
              <li><a href="${primaryDomain}/word-counter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Word Counter Online</a></li>
              <li><a href="${primaryDomain}/character-counter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Character Counter</a></li>
              <li><a href="${primaryDomain}/reading-time-calculator" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Reading Time Calculator</a></li>
              <li><a href="${primaryDomain}/simple-calculator" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Simple Calculator</a></li>
              <li><a href="${primaryDomain}/scientific-calculator" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Scientific Calculator</a></li>
              <li><a href="${primaryDomain}/date-calculator" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Date &amp; Time Calculator</a></li>
              <li><a href="${primaryDomain}/currency-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Live Currency Converter</a></li>
              <li><a href="${primaryDomain}/unit-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Universal Unit Converter</a></li>
              <li><a href="${primaryDomain}/length-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Length Converter</a></li>
              <li><a href="${primaryDomain}/area-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Area Converter</a></li>
              <li><a href="${primaryDomain}/volume-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Volume Converter</a></li>
              <li><a href="${primaryDomain}/weight-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Weight Converter</a></li>
              <li><a href="${primaryDomain}/temperature-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Temperature Converter</a></li>
              <li><a href="${primaryDomain}/speed-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Speed Converter</a></li>
              <li><a href="${primaryDomain}/pressure-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Pressure Converter</a></li>
              <li><a href="${primaryDomain}/power-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Power Converter</a></li>
              <li><a href="${primaryDomain}/dataconverter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Data Storage Converter</a></li>
              <li><a href="${primaryDomain}/qr-code-generator" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">QR Code Generator</a></li>
              <li><a href="${primaryDomain}/password-generator" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Password Generator</a></li>
              <li><a href="${primaryDomain}/color-picker" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Color Picker</a></li>
              <li><a href="${primaryDomain}/tools" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">All Tools Directory</a></li>
              <li><a href="${primaryDomain}/blog" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Productivity Blog</a></li>
              <li><a href="${primaryDomain}/about" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">About Stiknex</a></li>
            </ul>
          </nav>
        </section>
      </main>
    </div>`;

        const standardRoot = `
    <div id="root">
      <header style="padding: 24px 16px; text-align: center; border-bottom: 1px solid #e2e8f0;">
        <a href="${primaryDomain}/" style="font-size: 24px; font-weight: 800; text-decoration: none; color: #4f46e5;">Stiknex</a>
        <p style="margin-top: 6px; color: #64748b; font-size: 14px;">Free Online Sticky Notes, Digital Notebook &amp; Productivity Tools</p>
        <nav style="margin-top: 8px; font-size: 14px;">
          <a href="${primaryDomain}/" style="color: #64748b; margin: 0 8px; text-decoration: none;">Home</a>
          ${cleanPath !== '/' ? `&gt; <span style="color: #0f172a; font-weight: 600;">${seo.h1 || title}</span>` : ''}
        </nav>
      </header>
      <main style="max-width: 960px; margin: 0 auto; padding: 32px 16px;">
        <h1 style="font-size: 30px; font-weight: 800; color: #0f172a; margin-bottom: 12px; line-height: 1.3;">${seo.h1 || title}</h1>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">${description}</p>
        ${faqsHtml}
        ${relatedHtml}
        <section style="margin-top: 36px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 14px;">Stiknex Online Tools Directory</h2>
          <nav aria-label="Tools Directory">
            <ul style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; list-style: none; padding: 0;">
              <li><a href="${primaryDomain}/sticky-notes" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Sticky Notes Board</a></li>
              <li><a href="${primaryDomain}/online-notebook" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Online Notebook</a></li>
              <li><a href="${primaryDomain}/whiteboard" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Online Whiteboard</a></li>
              <li><a href="${primaryDomain}/word-counter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Word Counter Online</a></li>
              <li><a href="${primaryDomain}/character-counter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Character Counter</a></li>
              <li><a href="${primaryDomain}/reading-time-calculator" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Reading Time Calculator</a></li>
              <li><a href="${primaryDomain}/simple-calculator" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Simple Calculator</a></li>
              <li><a href="${primaryDomain}/scientific-calculator" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Scientific Calculator</a></li>
              <li><a href="${primaryDomain}/date-calculator" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Date &amp; Time Calculator</a></li>
              <li><a href="${primaryDomain}/currency-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Live Currency Converter</a></li>
              <li><a href="${primaryDomain}/unit-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Universal Unit Converter</a></li>
              <li><a href="${primaryDomain}/length-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Length Converter</a></li>
              <li><a href="${primaryDomain}/area-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Area Converter</a></li>
              <li><a href="${primaryDomain}/volume-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Volume Converter</a></li>
              <li><a href="${primaryDomain}/weight-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Weight Converter</a></li>
              <li><a href="${primaryDomain}/temperature-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Temperature Converter</a></li>
              <li><a href="${primaryDomain}/speed-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Speed Converter</a></li>
              <li><a href="${primaryDomain}/pressure-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Pressure Converter</a></li>
              <li><a href="${primaryDomain}/power-converter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Power Converter</a></li>
              <li><a href="${primaryDomain}/dataconverter" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Data Storage Converter</a></li>
              <li><a href="${primaryDomain}/qr-code-generator" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">QR Code Generator</a></li>
              <li><a href="${primaryDomain}/password-generator" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Password Generator</a></li>
              <li><a href="${primaryDomain}/color-picker" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Color Picker</a></li>
              <li><a href="${primaryDomain}/tools" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">All Tools Directory</a></li>
              <li><a href="${primaryDomain}/blog" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">Productivity Blog</a></li>
              <li><a href="${primaryDomain}/about" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">About Stiknex</a></li>
            </ul>
          </nav>
        </section>
      </main>
    </div>`;

        const rootToInject = cleanPath === '/' ? homeRoot : standardRoot;
        html = replaceRootHtml(html, rootToInject);

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
        return res.status(200).send(html);

    } catch (error) {
        console.error('Error in render-page:', error);
        res.redirect(302, '/');
    }
}
