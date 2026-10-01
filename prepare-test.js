import connectToDatabase from './api/_utils/db.js';
import Blog from './api/_models/Blog.js';
import Trend from './api/_models/Trend.js';

async function run() {
    await connectToDatabase();
    console.log("Connected to DB.");

    // Fix daily limit
    const blogs = await Blog.find().sort({publishedAt: -1}).limit(1);
    if (blogs.length > 0) {
        console.log('Latest blog:', blogs[0].title);
        blogs[0].publishedAt = new Date(Date.now() - 86400000 * 2);
        await blogs[0].save();
        console.log('Updated to 2 days ago to allow new generation');
    }

    // Check trends
    const usedBlogs = await Blog.find({}, { trendKeyword: 1 });
    const usedKeywords = usedBlogs.map(b => b.trendKeyword);
    const topTrend = await Trend.findOne({ keyword: { $nin: usedKeywords } }).sort({ trendScore: -1 });
    console.log("Top unused trend:", topTrend ? topTrend.keyword : "NONE");

    process.exit(0);
}

run().catch(console.error);
