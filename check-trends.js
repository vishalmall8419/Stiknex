import connectToDatabase from './api/_utils/db.js';
import Trend from './api/_models/Trend.js';

async function run() {
    await connectToDatabase();
    const trends = await Trend.find().sort({trendScore: -1}).limit(5);
    console.log("Top trends:", trends.map(t => `${t.keyword} (${t.trendScore} - ${t.status})`));
    process.exit(0);
}
run().catch(console.error);
