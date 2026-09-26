import connectToDatabase from './utils/db.js';
import Trend from './models/Trend.js';

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

        // Using Google Trends public RSS feed to avoid bot-blocking issues on Vercel
        const response = await fetch('https://trends.google.com/trends/trendingsearches/daily/rss?geo=US');
        
        if (!response.ok) {
            throw new Error(`Google RSS returned status: ${response.status}`);
        }
        
        const xml = await response.text();
        
        // Regex to extract items, titles, and traffic from XML
        const itemRegex = /<item>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>[\s\S]*?<ht:approx_traffic>(.*?)<\/ht:approx_traffic>[\s\S]*?<\/item>/gi;
        
        let match;
        let addedCount = 0;
        let totalProcessed = 0;

        while ((match = itemRegex.exec(xml)) !== null) {
            totalProcessed++;
            const keyword = match[1];
            const traffic = match[2] || '10K+';
            
            // Apply Relevance Filter
            if (isRelevant(keyword)) {
                // Save to Database
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

        res.status(200).json({ 
            success: true, 
            message: `Processed ${totalProcessed} trends from Google RSS. Added/Updated ${addedCount} relevant trends.` 
        });

    } catch (error) {
        console.error('Error fetching trends:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
