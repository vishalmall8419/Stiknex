const renderHandler = require('../api/render-page.js').default;

async function testRoute(path, query = {}) {
  let statusCode = 200;
  const headers = {};
  let body = '';

  const req = {
    query: { path, ...query },
    headers: { host: 'stiknex.site', 'x-forwarded-proto': 'https' }
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
    redirect(code, url) {
      statusCode = code;
      headers['Location'] = url;
      return this;
    }
  };

  await renderHandler(req, res);
  return { path, statusCode, headers, bodyLength: body.length, body };
}

async function run() {
  console.log('Testing routes with render-page handler:\n');

  const tests = [
    { path: '/data-converter', expectedStatus: 200, check: (res) => res.body.includes('Data Storage Converter') },
    { path: '/dataconverter', expectedStatus: 301, check: (res) => res.headers['Location'] === 'https://stiknex.site/data-converter' },
    { path: '/tools/dataconverter', expectedStatus: 301, check: (res) => res.headers['Location'] === 'https://stiknex.site/data-converter' },
    { path: '/privacy-policy', expectedStatus: 200, check: (res) => res.body.includes('Privacy Policy') },
    { path: '/terms-of-service', expectedStatus: 200, check: (res) => res.body.includes('Terms of Service') },
    { path: '/contact', expectedStatus: 200, check: (res) => res.body.includes('Contact') },
    { path: '/sticky-notes', expectedStatus: 200, check: (res) => res.body.includes('Sticky Notes') },
    { path: '/word-counter', expectedStatus: 200, check: (res) => res.body.includes('Word Counter') },
    { path: '/random-nonexistent-route-1234', expectedStatus: 404, check: (res) => res.body.includes('404 Page Not Found') && res.body.includes('noindex, nofollow') },
    { path: '/tools/fake-tool-does-not-exist', expectedStatus: 404, check: (res) => res.body.includes('404 Page Not Found') && res.body.includes('noindex, nofollow') }
  ];

  let passed = 0;
  for (const t of tests) {
    const res = await testRoute(t.path);
    const statusMatch = res.statusCode === t.expectedStatus;
    const contentMatch = t.check(res);
    const ok = statusMatch && contentMatch;

    if (ok) {
      console.log(`✅ [${res.statusCode}] ${t.path} -> PASSED`);
      passed++;
    } else {
      console.error(`❌ [${res.statusCode}] ${t.path} -> FAILED (Expected: ${t.expectedStatus})`);
      console.error('   Headers:', res.headers);
      console.error('   Preview:', res.bodyPreview.replace(/\n/g, ' '));
    }
  }

  console.log(`\nRoute Verification: ${passed}/${tests.length} tests passed.`);
  process.exit(passed === tests.length ? 0 : 1);
}

run();
