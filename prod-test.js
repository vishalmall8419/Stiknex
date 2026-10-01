async function runProdTest() {
    const CRON_SECRET = process.env.CRON_SECRET;
    const BASE_URL = 'https://stiknex.vercel.app';
    const HEADERS = { 'Authorization': `Bearer ${CRON_SECRET}` };

    console.log("=== STARTING PRODUCTION END-TO-END TEST ===");

    // 1. Trigger live generate-blog cron
    console.log(`\n[1] Triggering ${BASE_URL}/api/generate-blog...`);
    const genStart = Date.now();
    const genRes = await fetch(`${BASE_URL}/api/generate-blog`, { headers: HEADERS });
    const genText = await genRes.text();
    
    console.log(`    Status: ${genRes.status}`);
    console.log(`    Response: ${genText}`);
    console.log(`    Time: ${Math.round((Date.now() - genStart)/1000)}s`);

    if (genRes.status !== 200) {
        console.error("FAIL: generate-blog API returned non-200.");
        process.exit(1);
    }

    const genData = JSON.parse(genText);
    const slug = genData.blog;

    if (!slug) {
         console.error("FAIL: No blog slug returned in production response.");
         process.exit(1);
    }

    console.log(`\n[PASS] Blog generated successfully with slug: ${slug}`);

    // 2. Fetch the blog page HTML to test Edge SSR
    const blogUrl = `${BASE_URL}/blog/${slug}`;
    console.log(`\n[2] Fetching live blog URL: ${blogUrl}`);
    const htmlRes = await fetch(blogUrl);
    const html = await htmlRes.text();

    console.log(`    Status: ${htmlRes.status}`);
    
    if (htmlRes.status !== 200) {
         console.error("FAIL: Blog page returned non-200.");
         process.exit(1);
    }

    // Verify injected metadata
    console.log("\n[3] Verifying injected Edge SSR Metadata...");
    const hasTitle = html.includes('<title>');
    const hasOG = html.includes('property="og:title"');
    const hasCanonical = html.includes('rel="canonical"');
    const hasSchema = html.includes('application/ld+json');
    const hasKeywords = html.includes('name="keywords"');

    console.log(`    Title injected: ${hasTitle ? '✅' : '❌'}`);
    if (hasTitle) console.log(`      -> ${html.match(/<title>([\s\S]*?)<\/title>/)[1].trim()}`);
    console.log(`    OG Data injected: ${hasOG ? '✅' : '❌'}`);
    console.log(`    Canonical injected: ${hasCanonical ? '✅' : '❌'}`);
    console.log(`    JSON-LD Schema injected: ${hasSchema ? '✅' : '❌'}`);
    console.log(`    Keywords injected: ${hasKeywords ? '✅' : '❌'}`);

    if (!hasTitle || !hasOG || !hasCanonical || !hasSchema) {
         console.error("FAIL: Missing metadata injections in the raw HTML response.");
         process.exit(1);
    }

    // 4. Fetch the Sitemap
    console.log(`\n[4] Fetching sitemap.xml...`);
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    const sitemap = await sitemapRes.text();
    
    if (sitemap.includes(slug)) {
        console.log(`[PASS] Blog slug '${slug}' found in live sitemap! ✅`);
    } else {
        console.error(`FAIL: Blog slug '${slug}' NOT FOUND in live sitemap ❌`);
        process.exit(1);
    }

    console.log("\n=== FULL PRODUCTION PIPELINE TEST PASSED! ===");
    process.exit(0);
}

runProdTest().catch(console.error);
