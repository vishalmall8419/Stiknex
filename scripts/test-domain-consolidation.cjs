const fs = require('fs');
const path = require('path');
const renderHandler = require('../api/render-page.js').default;
const sitemapHandler = require('../api/sitemap.xml.js').default;

async function mockRequest(handler, { path = '/', query = {}, host = 'stiknex.site', url = null }) {
  let statusCode = 200;
  const headers = {};
  let body = '';

  const req = {
    url: url || (Object.keys(query).length ? `${path}?${new URLSearchParams(query).toString()}` : path),
    query: { path, ...query },
    headers: { host, 'x-forwarded-host': host, 'x-forwarded-proto': 'https' }
  };

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    setHeader(key, val) {
      headers[key] = val;
    },
    send(content) {
      body = content;
      return this;
    },
    end() {
      return this;
    },
    redirect(code, loc) {
      statusCode = code;
      headers['Location'] = loc;
      return this;
    }
  };

  await handler(req, res);
  return { statusCode, headers, body };
}

async function runAudit() {
  console.log('====================================================');
  console.log('Stiknex SEO Domain Consolidation & Redirect Audit');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assertTest(name, condition, details = '') {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}`);
      if (details) console.error(`   Details: ${details}`);
    }
  }

  // 1. Host canonicalization from stiknex.vercel.app -> stiknex.site
  console.log('\n--- 1. Vercel Domain (stiknex.vercel.app) 301 Redirects ---');
  
  // 1a. Root homepage
  const r1 = await mockRequest(renderHandler, { path: '/', host: 'stiknex.vercel.app' });
  assertTest('stiknex.vercel.app/ -> 301 https://stiknex.site/', 
    r1.statusCode === 301 && r1.headers['Location'] === 'https://stiknex.site/',
    `Status: ${r1.statusCode}, Location: ${r1.headers['Location']}`);

  // 1b. Root with query params
  const r2 = await mockRequest(renderHandler, { path: '/', host: 'stiknex.vercel.app', url: '/?ref=twitter&utm_source=test' });
  assertTest('stiknex.vercel.app/?ref=... -> 301 preserves query parameters', 
    r2.statusCode === 301 && r2.headers['Location'] === 'https://stiknex.site/?ref=twitter&utm_source=test',
    `Location: ${r2.headers['Location']}`);

  // 1c. Direct tool on Vercel domain
  const r3 = await mockRequest(renderHandler, { path: '/word-counter', host: 'stiknex.vercel.app' });
  assertTest('stiknex.vercel.app/word-counter -> 301 https://stiknex.site/word-counter', 
    r3.statusCode === 301 && r3.headers['Location'] === 'https://stiknex.site/word-counter',
    `Location: ${r3.headers['Location']}`);

  // 1d. Subroute tool on Vercel domain (single hop consolidation)
  const r4 = await mockRequest(renderHandler, { path: '/tools/percentage-calculator', host: 'stiknex.vercel.app' });
  assertTest('stiknex.vercel.app/tools/percentage-calculator -> 301 https://stiknex.site/percentage-calculator (1 HOP)', 
    r4.statusCode === 301 && r4.headers['Location'] === 'https://stiknex.site/percentage-calculator',
    `Location: ${r4.headers['Location']}`);

  // 1e. Obsolete /notes on Vercel domain
  const r5 = await mockRequest(renderHandler, { path: '/notes', host: 'stiknex.vercel.app' });
  assertTest('stiknex.vercel.app/notes -> 301 https://stiknex.site/sticky-notes (1 HOP)', 
    r5.statusCode === 301 && r5.headers['Location'] === 'https://stiknex.site/sticky-notes',
    `Location: ${r5.headers['Location']}`);

  // 1f. Obsolete /notebook on Vercel domain
  const r6 = await mockRequest(renderHandler, { path: '/notebook', host: 'stiknex.vercel.app' });
  assertTest('stiknex.vercel.app/notebook -> 301 https://stiknex.site/online-notebook (1 HOP)', 
    r6.statusCode === 301 && r6.headers['Location'] === 'https://stiknex.site/online-notebook',
    `Location: ${r6.headers['Location']}`);

  // 1g. Obsolete /dataconverter on Vercel domain
  const r7 = await mockRequest(renderHandler, { path: '/dataconverter', host: 'stiknex.vercel.app' });
  assertTest('stiknex.vercel.app/dataconverter -> 301 https://stiknex.site/data-converter (1 HOP)', 
    r7.statusCode === 301 && r7.headers['Location'] === 'https://stiknex.site/data-converter',
    `Location: ${r7.headers['Location']}`);

  // 1h. Blog post on Vercel domain
  const r8 = await mockRequest(renderHandler, { path: '/blog/test-article', query: { slug: 'test-article', type: 'blog' }, host: 'stiknex.vercel.app' });
  assertTest('stiknex.vercel.app/blog/test-article -> 301 https://stiknex.site/blog/test-article', 
    r8.statusCode === 301 && r8.headers['Location'] === 'https://stiknex.site/blog/test-article',
    `Location: ${r8.headers['Location']}`);

  // 1i. Sitemap on Vercel domain
  const r9 = await mockRequest(sitemapHandler, { path: '/sitemap.xml', host: 'stiknex.vercel.app' });
  assertTest('stiknex.vercel.app/sitemap.xml -> 301 https://stiknex.site/sitemap.xml', 
    r9.statusCode === 301 && r9.headers['Location'] === 'https://stiknex.site/sitemap.xml',
    `Location: ${r9.headers['Location']}`);

  // 2. Host canonicalization from www.stiknex.site -> stiknex.site
  console.log('\n--- 2. WWW Domain (www.stiknex.site) 301 Redirects ---');
  const r10 = await mockRequest(renderHandler, { path: '/sticky-notes', host: 'www.stiknex.site' });
  assertTest('www.stiknex.site/sticky-notes -> 301 https://stiknex.site/sticky-notes', 
    r10.statusCode === 301 && r10.headers['Location'] === 'https://stiknex.site/sticky-notes',
    `Location: ${r10.headers['Location']}`);

  // 3. Path canonicalization on primary domain (stiknex.site)
  console.log('\n--- 3. Primary Domain Path Canonicalization & 1-Hop Redirects ---');
  
  const r11 = await mockRequest(renderHandler, { path: '/notes', host: 'stiknex.site' });
  assertTest('stiknex.site/notes -> 301 https://stiknex.site/sticky-notes', 
    r11.statusCode === 301 && r11.headers['Location'] === 'https://stiknex.site/sticky-notes',
    `Location: ${r11.headers['Location']}`);

  const r12 = await mockRequest(renderHandler, { path: '/notebook', host: 'stiknex.site' });
  assertTest('stiknex.site/notebook -> 301 https://stiknex.site/online-notebook', 
    r12.statusCode === 301 && r12.headers['Location'] === 'https://stiknex.site/online-notebook',
    `Location: ${r12.headers['Location']}`);

  const r13 = await mockRequest(renderHandler, { path: '/dataconverter', host: 'stiknex.site' });
  assertTest('stiknex.site/dataconverter -> 301 https://stiknex.site/data-converter', 
    r13.statusCode === 301 && r13.headers['Location'] === 'https://stiknex.site/data-converter',
    `Location: ${r13.headers['Location']}`);

  const r14 = await mockRequest(renderHandler, { path: '/tools/word-counter', host: 'stiknex.site' });
  assertTest('stiknex.site/tools/word-counter -> 301 https://stiknex.site/word-counter', 
    r14.statusCode === 301 && r14.headers['Location'] === 'https://stiknex.site/word-counter',
    `Location: ${r14.headers['Location']}`);

  const r15 = await mockRequest(renderHandler, { path: '/tools/scientific-calculator', host: 'stiknex.site' });
  assertTest('stiknex.site/tools/scientific-calculator -> 301 https://stiknex.site/scientific-calculator', 
    r15.statusCode === 301 && r15.headers['Location'] === 'https://stiknex.site/scientific-calculator',
    `Location: ${r15.headers['Location']}`);

  // 4. Primary Domain 200 OK & Self-Referencing Canonicals
  console.log('\n--- 4. Primary Domain 200 OK & Self-Referencing Canonicals ---');

  const r16 = await mockRequest(renderHandler, { path: '/tools', host: 'stiknex.site' });
  assertTest('stiknex.site/tools -> 200 OK (Catalog hub preserved)', 
    r16.statusCode === 200 && r16.body.includes('<link rel="canonical" href="https://stiknex.site/tools" />'),
    `Status: ${r16.statusCode}`);

  const r17 = await mockRequest(renderHandler, { path: '/word-counter', host: 'stiknex.site' });
  assertTest('stiknex.site/word-counter -> 200 OK with self-referencing canonical', 
    r17.statusCode === 200 && r17.body.includes('<link rel="canonical" href="https://stiknex.site/word-counter" />'),
    `Status: ${r17.statusCode}`);

  const r18 = await mockRequest(renderHandler, { path: '/sticky-notes', host: 'stiknex.site' });
  assertTest('stiknex.site/sticky-notes -> 200 OK with self-referencing canonical', 
    r18.statusCode === 200 && r18.body.includes('<link rel="canonical" href="https://stiknex.site/sticky-notes" />'),
    `Status: ${r18.statusCode}`);

  const r19 = await mockRequest(renderHandler, { path: '/online-notebook', host: 'stiknex.site' });
  assertTest('stiknex.site/online-notebook -> 200 OK with self-referencing canonical', 
    r19.statusCode === 200 && r19.body.includes('<link rel="canonical" href="https://stiknex.site/online-notebook" />'),
    `Status: ${r19.statusCode}`);

  const r20 = await mockRequest(renderHandler, { path: '/data-converter', host: 'stiknex.site' });
  assertTest('stiknex.site/data-converter -> 200 OK with self-referencing canonical', 
    r20.statusCode === 200 && r20.body.includes('<link rel="canonical" href="https://stiknex.site/data-converter" />'),
    `Status: ${r20.statusCode}`);

  // 5. 404 Status for genuinely non-existent routes
  console.log('\n--- 5. 404 Behavior for Non-Existent Routes ---');

  const r21 = await mockRequest(renderHandler, { path: '/nonexistent-random-route-xyz', host: 'stiknex.site' });
  assertTest('stiknex.site/nonexistent-random-route-xyz -> 404 Not Found with noindex', 
    r21.statusCode === 404 && r21.body.includes('noindex, nofollow'),
    `Status: ${r21.statusCode}`);

  const r22 = await mockRequest(renderHandler, { path: '/tools/fake-tool-never-existed', host: 'stiknex.site' });
  assertTest('stiknex.site/tools/fake-tool-never-existed -> 404 Not Found with noindex', 
    r22.statusCode === 404 && r22.body.includes('noindex, nofollow'),
    `Status: ${r22.statusCode}`);

  // 6. Robots.txt and Sitemap Validation
  console.log('\n--- 6. Robots.txt & Sitemap URL Audit ---');

  const robots = fs.readFileSync(path.join(__dirname, '..', 'public', 'robots.txt'), 'utf8');
  assertTest('public/robots.txt references https://stiknex.site/sitemap.xml', 
    robots.includes('Sitemap: https://stiknex.site/sitemap.xml'),
    'Missing correct sitemap line');
  assertTest('public/robots.txt has NO vercel.app references', 
    !robots.includes('vercel.app'),
    'Found vercel.app reference in robots.txt');

  const sitemapXml = fs.readFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), 'utf8');
  const locMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g) || [];
  const invalidLocs = locMatches.filter(l => !l.includes('https://stiknex.site/'));
  assertTest(`public/sitemap.xml contains ${locMatches.length} URLs, ALL on https://stiknex.site/`, 
    locMatches.length > 200 && invalidLocs.length === 0,
    `Invalid locs: ${invalidLocs.slice(0, 5).join(', ')}`);

  console.log('\n====================================================');
  console.log(`Audit Summary: ${passed} / ${total} tests PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================');

  process.exit(passed === total ? 0 : 1);
}

runAudit().catch(err => {
  console.error('Audit fatal error:', err);
  process.exit(1);
});

