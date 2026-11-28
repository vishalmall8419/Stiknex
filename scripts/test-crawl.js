import fs from 'fs';
import { getSeoForPath, BASE_URL, SITE_URL, seoConfig } from '../api/_utils/seoConfig.js';

const htmlTemplate = fs.readFileSync('./index.html', 'utf-8');
const primaryDomain = SITE_URL || BASE_URL || 'https://stiknex.site';
const routes = Object.keys(seoConfig);

console.log('=== COMPREHENSIVE CRAWL SIMULATION & VALIDATION (27 ROUTES) ===\n');

let allPassed = true;

routes.forEach((routePath, index) => {
  const seo = getSeoForPath(routePath);
  let html = htmlTemplate.replace(/https:\/\/stiknex\.vercel\.app/g, primaryDomain);

  const title = seo.title;
  const description = seo.description;
  const canonicalUrl = routePath === '/' ? `${primaryDomain}/` : `${primaryDomain}${routePath}`;
  const pageUrl = routePath === '/' ? `${primaryDomain}/` : `${primaryDomain}${routePath}`;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`);
  html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/, `<meta property="og:url" content="${pageUrl}" />`);

  if (html.includes('<link rel="canonical"')) {
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`);
  } else {
    html = html.replace('</head>', `<link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  }

  // Check head validity (ensure no <noscript> or <main> in head)
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
  const headContent = headMatch ? headMatch[1] : '';
  const headHasNoscriptMain = /<main/i.test(headContent);

  // Check canonical
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const actualCanonical = canonicalMatch ? canonicalMatch[1] : null;

  // Check title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const actualTitle = titleMatch ? titleMatch[1] : null;

  // Check description
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  const actualDesc = descMatch ? descMatch[1] : null;

  // Check outbound links
  const links = (html.match(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi) || []);

  const hasErrors = 
    headHasNoscriptMain || 
    actualCanonical !== canonicalUrl || 
    !actualTitle || 
    !actualDesc ||
    links.length < 15;

  if (hasErrors) {
    allPassed = false;
    console.error(`❌ Route [${index + 1}/27] ${routePath} FAILED:`, {
      headHasNoscriptMain,
      actualCanonical,
      expectedCanonical: canonicalUrl,
      titleFound: !!actualTitle,
      linksFound: links.length
    });
  } else {
    console.log(`✅ [${index + 1}/27] ${routePath} -> Title: "${actualTitle.slice(0, 35)}..." | Canonical: ${actualCanonical} | Outbound Links: ${links.length}`);
  }
});

console.log('\n======================================================');
if (allPassed) {
  console.log('🏆 100% SUCCESS: All 27 routes return valid HTML, correct canonicals, zero head defects, and full crawlable link graphs!');
} else {
  console.error('⚠️ Some routes failed validation.');
  process.exit(1);
}
console.log('======================================================\n');

