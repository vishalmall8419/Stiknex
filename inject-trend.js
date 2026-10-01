import connectToDatabase from './api/_utils/db.js';
import Trend from './api/_models/Trend.js';
import Blog from './api/_models/Blog.js';

async function run() {
    await connectToDatabase();
    
    // Inject fake trend
    await Trend.updateOne(
        { keyword: 'best offline drawing apps 2026' },
        { 
            $set: { 
                keyword: 'best offline drawing apps 2026',
                traffic: '100K+',
                numericTraffic: 100000,
                status: 'relevant',
                trendScore: 83,
                relevanceScore: 20,
                searchIntent: 'Informational',
                suggestionType: 'Blog',
                date: new Date()
            }
        },
        { upsert: true }
    );
    console.log('Injected test trend');

    // Bypass daily limit
    const blogs = await Blog.find().sort({publishedAt: -1}).limit(2);
    for (let b of blogs) {
        b.publishedAt = new Date(Date.now() - 86400000 * 2);
        await b.save();
    }
    console.log('Bypassed daily limit');

    process.exit(0);
}
run().catch(console.error);
