const fs = require('fs');

async function verify() {
  const results = {
    item1_tools: {},
    item2_hubs: {},
    item3_routes: {},
    item4_ssr: {},
    item5_tier1: [],
    item6_schema: {},
    item7_formulas: {},
    item8_sitemap: {},
    item9_vercel: {}
  };

  // 1 & 2. Verify all 201 tools against toolsRegistry & hubs
  const { ALL_TOOLS, TOOL_HUBS } = await import('../src/data/toolsRegistry.js');
  results.item1_tools.totalTools = ALL_TOOLS.length;

  const hubBreakdown = {};
  let totalInHubs = 0;
  TOOL_HUBS.forEach(h => {
    const matched = ALL_TOOLS.filter(t => h.subcategories.includes(t.category));
    hubBreakdown[h.id] = { name: h.name, count: matched.length };
    totalInHubs += matched.length;
  });
  results.item2_hubs.hubs = hubBreakdown;
  results.item2_hubs.totalInHubs = totalInHubs;
  results.item2_hubs.orphans = ALL_TOOLS.length - totalInHubs;

  // 3. Verify App.jsx routes for tool rendering
  const appJsx = fs.readFileSync('src/App.jsx', 'utf8');
  results.item3_routes.hasDynamicToolRoute = appJsx.includes('/:toolSlug') || appJsx.includes('/:slug');
  results.item3_routes.sampleToolSlugsInRegistry = ALL_TOOLS.slice(0, 5).map(t => t.slug);

  // 4. Fetch actual SSR HTML for representative tool pages
  const renderPage = (await import('../api/render-page.js')).default;
  const samplePages = [
    '/typing-speed-test',
    '/emi-calculator',
    '/sip-calculator',
    '/data-converter',
    '/word-counter'
  ];

  const ssrSamples = {};
  for (const pagePath of samplePages) {
    let outputHtml = '';
    const cleanSlug = pagePath.replace(/^\//, '');
    const req = {
      url: pagePath,
      headers: { host: 'stiknex.site' },
      query: { path: cleanSlug }
    };
    const res = {
      statusCode: 200,
      headers: {},
      setHeader(k, v) { this.headers[k] = v; },
      status(c) { this.statusCode = c; return this; },
      send(html) { outputHtml = html; return this; },
      end(html) { if (html) outputHtml = html; return this; },
      redirect(code, url) { this.statusCode = code; this.redirectUrl = url; return this; }
    };

    await renderPage(req, res);

    const titleMatch = outputHtml.match(/<title>(.*?)<\/title>/);
    const descMatch = outputHtml.match(/<meta name="description" content="(.*?)"/);
    const h1Match = outputHtml.match(/<h1[^>]*>(.*?)<\/h1>/);
    const hasFaq = outputHtml.includes('faq-question') || outputHtml.includes('Frequently Asked Questions') || outputHtml.includes('FAQ');
    const hasHubs = outputHtml.includes('Typing &amp; Keyboard') || outputHtml.includes('Calculators') || outputHtml.includes('Converters');

    ssrSamples[pagePath] = {
      statusCode: res.statusCode,
      title: titleMatch ? titleMatch[1] : null,
      description: descMatch ? descMatch[1] : null,
      descriptionLength: descMatch ? descMatch[1].length : 0,
      h1: h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : null,
      hasFaq,
      hasHubsInHtml: hasHubs,
      hasInternalLinks: outputHtml.includes('<a href='),
      htmlLength: outputHtml.length,
      htmlPreviewSnippet: outputHtml.slice(outputHtml.indexOf('<h1'), outputHtml.indexOf('<h1') + 400)
    };
  }
  results.item4_ssr = ssrSamples;

  // 5. Verify all 25 Tier 1 pages + Data Converter
  const seoConfigModule = await import('../src/utils/seoConfig.js');
  const seoConfig = seoConfigModule.seoConfig || seoConfigModule.default || {};
  const tier1Keys = [
    '/typing-speed-test',
    '/typing-test-10-fast-fingers',
    '/word-counter',
    '/character-counter',
    '/reading-time-calculator',
    '/simple-calculator',
    '/scientific-calculator',
    '/percentage-calculator',
    '/emi-calculator',
    '/sip-calculator',
    '/compound-interest-calculator',
    '/mortgage-calculator',
    '/currency-converter',
    '/unit-converter',
    '/length-converter',
    '/weight-converter',
    '/data-converter',
    '/json-formatter',
    '/json-validator',
    '/base64-encoder-decoder',
    '/qr-code-generator',
    '/password-generator',
    '/password-strength-checker',
    '/meta-description-counter',
    '/slug-generator',
    '/image-compressor'
  ];

  const tier1Report = [];
  const titlesSet = new Set();
  const canonicalSet = new Set();

  tier1Keys.forEach(route => {
    const data = seoConfig[route];
    if (!data) {
      tier1Report.push({ route, status: 'MISSING' });
      return;
    }

    const titleUnique = !titlesSet.has(data.title);
    titlesSet.add(data.title);

    const canonicalUnique = !canonicalSet.has(data.canonical);
    canonicalSet.add(data.canonical);

    tier1Report.push({
      route,
      status: 'OK',
      title: data.title,
      titleLength: data.title ? data.title.length : 0,
      titleUnique,
      descLength: data.description ? data.description.length : 0,
      canonical: data.canonical,
      canonicalMatchesRoute: data.canonical === `https://stiknex.site${route}`,
      h1: data.h1,
      faqCount: Array.isArray(data.faqs) ? data.faqs.length : 0
    });
  });
  results.item5_tier1 = tier1Report;

  // 6. JSON-LD validation
  const sampleJsonLd = {};
  ['/typing-speed-test', '/emi-calculator', '/data-converter'].forEach(r => {
    const d = seoConfig[r];
    if (d?.schema) {
      sampleJsonLd[r] = {
        type: d.schema['@type'],
        name: d.schema.name,
        price: d.schema.offers?.price,
        applicationCategory: d.schema.applicationCategory
      };
    }
  });
  results.item6_schema = sampleJsonLd;

  // 7. Formula Verification against code & references
  const typingCode = fs.readFileSync('src/Pages/TypingLab/TypingLab.jsx', 'utf8');
  results.item7_formulas.wpmInCode = typingCode.includes('/ 5') && (typingCode.includes('wpm') || typingCode.includes('WPM'));

  let calcEngCode = '';
  try {
    calcEngCode = fs.readFileSync('src/Pages/Tools/engines/CalculatorEngine.jsx', 'utf8');
  } catch (_) {}
  results.item7_formulas.emiFormulaFound = calcEngCode.includes('Math.pow(1 + r, n)');
  results.item7_formulas.sipFormulaFound = calcEngCode.includes('Math.pow(1 + i, n)');

  // 8. Sitemap validation (234 URLs)
  const sitemapXml = fs.readFileSync('public/sitemap.xml', 'utf8');
  const urlMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g) || [];
  const sitemapUrls = urlMatches.map(u => u.replace(/<\/?loc>/g, '').trim());
  const uniqueUrls = new Set(sitemapUrls);

  results.item8_sitemap.totalInSitemap = sitemapUrls.length;
  results.item8_sitemap.uniqueCount = uniqueUrls.size;
  results.item8_sitemap.duplicates = sitemapUrls.length - uniqueUrls.size;
  results.item8_sitemap.hasDataConverter = sitemapUrls.includes('https://stiknex.site/data-converter');
  results.item8_sitemap.hasObsoleteDataconverter = sitemapUrls.includes('https://stiknex.site/dataconverter');

  // 9. Vercel 11-function limit & maxDuration check
  const apiFiles = fs.readdirSync('api').filter(f => f.endsWith('.js') && !f.startsWith('_'));
  results.item9_vercel.functionCount = apiFiles.length;
  results.item9_vercel.functions = apiFiles;

  const vercelJson = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  results.item9_vercel.maxDuration = vercelJson.functions ? Object.values(vercelJson.functions).map(f => f.maxDuration) : [];

  fs.writeFileSync('scripts/verification_results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('VERIFICATION COMPLETE! Results saved to scripts/verification_results.json');
}

verify().catch(console.error);
