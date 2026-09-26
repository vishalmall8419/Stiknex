import connectToDatabase from './utils/db.js';
import Trend from './models/Trend.js';
import googleTrends from 'google-trends-api';

// Simple manual relevance filter based on keywords
function isRelevant(keyword) {
    const lower = keyword.toLowerCase();
    const relevantTerms = ['app', 'tool', 'notes', 'study', 'work', 'office', 'ai', 'tech', 'productivity', 'calculator', 'software', 'digital', 'student'];
    const irrelevantTerms = ['movie', 'cricket', 'match', 'ipl', 'football', 'election', 'murder', 'death', 'scandal', 'gossip'];
    
    // Quick reject
    for (let term of irrelevantTerms) {
        if (lower.includes(term)) return false;
    }
    
    // Quick accept
    for (let term of relevantTerms) {
        if (lower.includes(term)) return true;
    }
    
    // Default neutral (requires human review)
    return true; 
}

export default async function handler(req, res) {
    try {
        await connectToDatabase();

        // 1. Fetch Daily Trends (Worldwide or specific region)
        const results = await googleTrends.dailyTrends({
            geo: 'US', // Can change to IN or worldwide if available
        });
        
        const parsedResults = JSON.parse(results);
        const days = parsedResults.default.trendingSearchesDays;
        
        let addedCount = 0;
        let totalProcessed = 0;

        // 2. Loop through recent trends
        for (const day of days) {
            for (const search of day.trendingSearches) {
                totalProcessed++;
                const keyword = search.title.query;
                const traffic = search.formattedTraffic;
                
                // 3. Apply Relevance Filter
                if (isRelevant(keyword)) {
                    // 4. Save to Database
                    try {
                        await Trend.updateOne(
                            { keyword },
                            { 
                                $setOnInsert: { keyword, traffic, date: new Date() } 
                            },
                            { upsert: true }
                        );
                        addedCount++;
                    } catch (dbErr) {
                        console.error('DB Error:', dbErr);
                    }
                }
            }
        }

        res.status(200).json({ 
            success: true, 
            message: `Processed ${totalProcessed} trends. Added/Updated ${addedCount} relevant trends.` 
        });

    } catch (error) {
        console.error('Error fetching trends:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
