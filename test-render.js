import handler from './api/render-blog.js';

async function testRender() {
    const mockReq = { 
        headers: { 'x-forwarded-proto': 'https', 'host': 'stiknex.vercel.app' },
        query: { slug: 'best-study-planning-tools-2026' }
    };
    
    const mockRes = {
        redirect: (code, url) => console.log('REDIRECT:', code, url),
        setHeader: (k, v) => console.log('SET HEADER:', k, v),
        status: (code) => ({
            send: (html) => {
                console.log(`[PASS] HTML Returned (Length: ${html.length})`);
                if (html.includes('best-study-planning-tools-2026')) console.log('[PASS] URL Injected');
                if (html.includes('<title>')) console.log('[PASS] Title Injected:', html.match(/<title>(.*?)<\/title>/)[1]);
                if (html.includes('<meta property="og:description"')) console.log('[PASS] OG Description Injected');
                if (html.includes('<meta name="keywords"')) console.log('[PASS] Keywords Injected');
            }
        })
    };

    await handler(mockReq, mockRes);
    process.exit(0);
}

testRender();
