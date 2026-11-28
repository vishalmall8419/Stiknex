// Shared sitemap rules — single source of truth for both api/sitemap.xml.js and scripts/generate-sitemap.js

export const SITE_URL = 'https://stiknex.site';

export const WHITELIST_PATHS = [
  // 25 Tier-1 URLs from research/url_consolidation_plan.csv
  '/',
  '/sticky-notes',
  '/online-notebook',
  '/word-counter',
  '/character-counter',
  '/simple-calculator',
  '/scientific-calculator',
  '/currency-converter',
  '/unit-converter',
  '/qr-code-generator',
  '/password-generator',
  '/tools',
  '/blog',
  '/about',
  '/whiteboard',
  '/percentage-calculator',
  '/age-calculator',
  '/case-converter',
  '/json-formatter',
  '/pomodoro-timer',
  '/emi-calculator',
  '/sip-calculator',
  '/typing-speed-test',
  '/typing-practice-lessons',
  '/to-do-list',

  // 10 URLs already receiving Google impressions
  '/speed-converter',
  '/temperature-converter',
  '/volume-converter',
  '/length-converter',
  '/pressure-converter',
  '/power-converter',
  '/area-converter',
  '/reading-time-calculator',
  '/color-picker',
  '/data-converter',

  // 5 utility / legal / support pages
  '/buy-me-a-coffee',
  '/name-generator',
  '/privacy-policy',
  '/terms-of-service',
  '/contact'
];

// re-add in batches of ~20 after the first set is indexed
export const EXCLUDED_PATHS = [
  '/online-notepad',
  '/basic-calculator',
  '/text-cleaner',
  '/word-counter-for-documents',
  '/json-validator',
  '/entropy-estimator',
  '/rgb-to-hex',
  '/meeting-time-planner',
  '/typing-accuracy-test',
  '/checklist-maker',
  '/focus-session-planner',
  '/personal-task-planner',
  '/delimited-text-converter',
  '/video-aspect-ratio-calculator',
  '/random-name-picker',
  '/stopwatch-with-laps',
  '/decision-helper',
  '/reorder-pdf-pages',
  '/pdf-metadata-viewer',
  '/document-page-counter',
  '/hmac-calculator',
  '/file-hash-checker',
  '/secret-free-redaction-tool',
  '/css-clamp-generator',
  '/css-animation-previewer',
  '/keyboard-shortcut-finder',
  '/typing-error-analyzer',
  '/data-sampling-tool',
  '/audio-volume-normalizer',
  '/video-metadata-viewer',
  '/subtitle-time-calculator',
  '/audio-waveform-viewer',
  '/link-in-bio-page-builder',
  '/typographic-scale-generator',
  '/receipt-generator',
  '/random-quiz-generator'
];

const EXCLUDED_SET = new Set(EXCLUDED_PATHS);

/**
 * Returns the filtered, deduplicated list of allowed static routes.
 * A route is included only if it is in WHITELIST_PATHS, not in EXCLUDED_PATHS,
 * exists in seoConfig, and its seoConfig canonical equals its own URL.
 */
export function getAllowedStaticRoutes(seoConfig, baseUrl = SITE_URL) {
  const seen = new Set();
  const routes = [];

  for (const routePath of WHITELIST_PATHS) {
    if (seen.has(routePath) || EXCLUDED_SET.has(routePath)) continue;
    const config = seoConfig[routePath];
    if (!config) continue;

    const fullUrl = routePath === '/' ? `${baseUrl}/` : `${baseUrl}${routePath}`;
    if (config.canonical !== fullUrl) continue;

    seen.add(routePath);
    routes.push({
      routePath,
      fullUrl,
      priority: (routePath === '/online-notepad' || routePath === '/sticky-notes') ? '0.9' : null
    });
  }

  return routes;
}

/**
 * Formats a Date/string into YYYY-MM-DD, or returns null if invalid.
 */
function formatIsoDate(val) {
  if (!val) return null;
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0];
  } catch (_) {
    return null;
  }
}

/**
 * Builds the sitemap.xml string from static routes, optional routeDates, and published blogs.
 * Never invents or falls back to a hard-coded lastmod date.
 */
export function buildSitemapXml({ staticRoutes, routeDates = {}, blogs = [], baseUrl = SITE_URL }) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const route of staticRoutes) {
    const lastmod = routeDates[route.routePath] || null;
    xml += `  <url>\n`;
    xml += `    <loc>${route.fullUrl}</loc>\n`;
    if (lastmod) {
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
    }
    if (route.priority) {
      xml += `    <priority>${route.priority}</priority>\n`;
    }
    xml += `  </url>\n`;
  }

  if (Array.isArray(blogs) && blogs.length > 0) {
    const seenSlugs = new Set();
    for (const blog of blogs) {
      if (!blog?.slug || seenSlugs.has(blog.slug)) continue;
      seenSlugs.add(blog.slug);
      const modDate = formatIsoDate(blog.updatedAt || blog.publishedAt);
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${encodeURIComponent(blog.slug)}</loc>\n`;
      if (modDate) {
        xml += `    <lastmod>${modDate}</lastmod>\n`;
      }
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;
  return xml;
}
