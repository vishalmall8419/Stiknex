import connectToDatabase from './api/_utils/db.js';
import Trend from './api/_models/Trend.js';
import Blog from './api/_models/Blog.js';
import handler from './api/generate-blog.js';

async function runTest() {
    console.log("=== STARTING BLOG GENERATION TEST ===");
    
    // 1. Check DB for trends
    await connectToDatabase();
    const existingBlogs = await Blog.find({}, { trendKeyword: 1 });
    const usedKeywords = existingBlogs.map(b => b.trendKeyword);
    
    const topTrend = await Trend.findOne({ keyword: { $nin: usedKeywords } }).sort({ trendScore: -1 });
    
    if (!topTrend) {
        console.log("FAIL: No unused relevant trend found.");
        process.exit(1);
    }
    
    console.log(`[PASS] Trend Selected: "${topTrend.keyword}" (Relevance Score: ${topTrend.trendScore})`);
    
    // 2. Mock Request & Response
    const mockReq = { 
        headers: { authorization: 'Bearer ' + process.env.CRON_SECRET },
        cookies: {}
    };
    
    let generatedSlug = null;
    const mockRes = { 
        status: (code) => ({ 
            json: (data) => {
                console.log(`[API RESPONSE] Status: ${code}`, data);
                if (data.blog) generatedSlug = data.blog;
            } 
        }) 
    };

    console.log("=> Calling generate-blog.js handler (This may take 30-60s due to AI)...");
    const startTime = Date.now();
    try {
        await handler(mockReq, mockRes);
    } catch (e) {
        console.log("FAIL: Handler threw error:", e);
        process.exit(1);
    }
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`=> Handler completed in ${duration}s`);
    
    if (!generatedSlug) {
        console.log("FAIL: No blog slug returned from handler.");
        process.exit(1);
    }
    
    // 3. Verify Database Creation
    const savedBlog = await Blog.findOne({ slug: generatedSlug });
    if (!savedBlog) {
        console.log("FAIL: Blog not found in MongoDB.");
        process.exit(1);
    }
    console.log(`[PASS] MongoDB document created: Slug = ${savedBlog.slug}`);
    console.log(`[PASS] AI Article Generated (Length: ${savedBlog.content.length} chars)`);
    console.log(`[PASS] AI Image URL: ${savedBlog.imageUrl}`);
    
    console.log("=== TEST COMPLETED SUCCESSFULLY ===");
    process.exit(0);
}

runTest().catch(console.error);
