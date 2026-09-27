import * as dotenv from 'dotenv';
dotenv.config();

import handler from './api/fetch-trends.js';
import connectToDatabase from './api/utils/db.js';
import Trend from './api/models/Trend.js';

async function runE2E() {
    console.log("=== STARTING E2E LIVE TEST ===");
    
    console.log("1. Triggering fetch-trends.js (CRON SIMULATION)...");
    
    let statusCode = null;
    let jsonResponse = null;
    
    const req = {
        headers: {
            authorization: "Bearer " + process.env.CRON_SECRET
        }
    };
    
    const res = {
        status: (code) => {
            statusCode = code;
            return {
                json: (data) => {
                    jsonResponse = data;
                }
            };
        }
    };

    const startTime = Date.now();
    await handler(req, res);
    const endTime = Date.now();

    console.log("Fetch-Trends API Result (Status " + statusCode + ") in " + ((endTime - startTime)/1000).toFixed(2) + "s:");
    console.log(jsonResponse);
    
    if (statusCode !== 200) {
        console.error("FAILED: fetch-trends.js did not return 200");
        process.exit(1);
    }
    
    console.log("\n2. Querying MongoDB for actual inserted trends...");
    await connectToDatabase();
    
    const relevantCount = await Trend.countDocuments({ status: 'relevant' });
    const pendingCount = await Trend.countDocuments({ status: 'pending' });
    const ignoredCount = await Trend.countDocuments({ status: 'ignored' });
    const totalCount = await Trend.countDocuments();
    
    console.log("MongoDB State: " + totalCount + " total trends (" + relevantCount + " relevant, " + pendingCount + " pending, " + ignoredCount + " ignored).");
    
    const sampleTrend = await Trend.findOne().sort({ date: -1 });
    if (sampleTrend) {
        console.log("Latest DB Inserted Document Sample:", {
            keyword: sampleTrend.keyword,
            traffic: sampleTrend.traffic,
            relevanceScore: sampleTrend.relevanceScore,
            trendScore: sampleTrend.trendScore,
            searchIntent: sampleTrend.searchIntent,
            suggestionType: sampleTrend.suggestionType,
            status: sampleTrend.status
        });
    }

    process.exit(0);
}

runE2E();
