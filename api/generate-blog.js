import connectToDatabase from './_utils/db.js';
import Trend from './_models/Trend.js';
import Blog from './_models/Blog.js';
import { verifyAdminToken } from './_utils/auth.js';

// Re-usable fetch helper
const fetchJson = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        const res = await fetch(url, options);
        if (res.ok) return res.json();
        if (i === retries - 1) throw new Error(`Fetch failed: ${res.statusText} (${res.status})`);
        await new Promise(r => setTimeout(r, 2000 * (i + 1))); // exponential backoff
    }
};

export default async function handler(req, res) {
    // 1. Auth check
    const isCron = req.headers['authorization'] === `Bearer ${process.env.CRON_SECRET}`;
    const dummyReq = { headers: { authorization: `Bearer ${req.cookies?.stiknex_auth_token || ''}` } };
    const isAdmin = verifyAdminToken(dummyReq).valid;
    if (!isCron && !isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        await connectToDatabase();

        // 2. Daily limit check (only 1 blog per day) (commented out to allow admin to generate manually if they want)
        // const startOfDay = new Date();
        // startOfDay.setHours(0, 0, 0, 0);
        // const alreadyPublishedToday = await Blog.findOne({ publishedAt: { $gte: startOfDay } });
        // if (alreadyPublishedToday && isCron) {
        //     return res.status(200).json({ message: 'Daily blog limit reached. Skipped.', blog: alreadyPublishedToday.slug });
        // }

        // 3. Select a Trend Keyword
        // Get keywords that don't have a blog yet. We sort by trendScore (descending).
        const existingBlogs = await Blog.find({}, { trendKeyword: 1 });
        const usedKeywords = existingBlogs.map(b => b.trendKeyword);

        const topTrend = await Trend.findOne({ keyword: { $nin: usedKeywords } }).sort({ trendScore: -1 });
        let keyword = req.query.keyword || req.body?.keyword; // Allow manual keyword
        let trendScore = 100;
        
        if (!keyword) {
            if (!topTrend) {
                return res.status(404).json({ message: 'No unused trending keywords found.' });
            }
            keyword = topTrend.keyword;
            trendScore = topTrend.trendScore;
        }

        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY missing in environment variables.');
        }

        // 4. Research via Wikipedia
        let wikiExtract = "";
        try {
            const wikiRes = await fetchJson(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=${encodeURIComponent(keyword)}&format=json`);
            const pages = wikiRes.query.pages;
            const pageId = Object.keys(pages)[0];
            if (pageId !== '-1') {
                wikiExtract = pages[pageId].extract.replace(/<[^>]*>?/gm, ''); // Strip basic HTML
            }
        } catch (e) {
            console.warn(`Wikipedia fetch failed for ${keyword}`, e.message);
        }

        // 5. Generate Article via Gemini (JSON structured output)
        const prompt = 
You are an expert tech, productivity, and lifestyle blog writer for "Stiknex" (a free online productivity tools platform). 
Write a highly detailed, comprehensive, original blog post (MINIMUM 2000 words, deep dive analysis) based on the trending keyword: "".

CRITICAL RELEVANCE RULE: 
You MUST frame the topic of the keyword through the lens of productivity, learning, note-taking, organization, technology, or self-improvement. 
For example, if the keyword is a celebrity or movie, discuss the tools/workflows behind their success, how fans organize information about them, or lessons learned.
If you absolutely cannot connect the topic to these themes naturally, focus on the educational and informational aspects of the topic.

Important Rules:
1. Write in a completely original, engaging, and human-readable tone. Use deep analysis, case studies, step-by-step guides, and provide great value. The blog MUST BE LONG and detailed.
2. The 'content' field MUST be formatted using standard Markdown (e.g. #, ##, ###, **, -, etc.). Use lots of paragraphs, lists, and subheadings to break down the topic.
3. HYPERLINK STRATEGY (CRITICAL): 
   - PRIMARY PRIORITY: Whenever you mention anything related to Stiknex tools, you MUST add a markdown hyperlink to that specific page. 
     - Taking notes, writing, journal, notepad -> [Stiknex Notebook](/notebook)
     - Drawing, whiteboard, diagram, mindmap, excalidraw -> [Stiknex Whiteboard](/whiteboard)
     - Calculators, unit converters, QR code generator, passwords -> [Stiknex Tools](/tools)
     - Sticky notes, boards, quick notes -> [Stiknex Sticky Notes](/)
   - SECONDARY PRIORITY: For general knowledge, historical figures (like Gandhi ji), places, or concepts, you MUST add inline Hyperlinks to authoritative external sources (e.g., [Wikipedia](https://en.wikipedia.org/wiki/Main_Page) or other relevant sites).
   - If writing about weather, link to [Google Weather](https://www.google.com/search?q=weather) or a relevant weather site.
   - Embed these links naturally within the sentences. Do not just list them at the end.
4. Include a catchy title, a short excerpt (max 160 chars), SEO meta title, SEO meta description, and 5-8 SEO keywords.
5. Create a highly descriptive prompt for an AI image generator to create the header image. Make it conceptual, illustrative, or artistic, without text.

Reference Information (Use for facts only, DO NOT COPY):


Output STRICTLY as JSON with no markdown block wrappers. Use this schema:
{
  "title": "...",
  "slug": "url-friendly-slug",
  "excerpt": "...",
  "content": "# MAIN HEADER

Paragraph one with [link](url).

## SECOND HEADER

...",
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": "...",
  "imagePrompt": "...",
  "imageAlt": "..."
}
;

        const geminiRes = await fetchJson(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.7
                }
            })
        });

        const articleDataStr = geminiRes.candidates[0].content.parts[0].text;
        const articleData = JSON.parse(articleDataStr);

        // 6. Generate Image via Pollinations.ai (Free, Fast, No Auth required)
        const imageUrl = \`https://image.pollinations.ai/prompt/\${encodeURIComponent(articleData.imagePrompt)}?width=1200&height=630&nologo=true&seed=\${Math.floor(Math.random() * 10000)}\`;

        // 8. Quality/Safety Checks (Basic)
        if (!articleData.title || !articleData.content || articleData.content.length < 500) {
            throw new Error("Content quality check failed: Too short or missing fields.");
        }

        // 9. Save to MongoDB
        const newBlog = new Blog({
            title: articleData.title,
            slug: articleData.slug,
            excerpt: articleData.excerpt,
            content: articleData.content,
            metaTitle: articleData.metaTitle,
            metaDescription: articleData.metaDescription,
            keywords: articleData.keywords,
            trendKeyword: keyword,
            trendScore: trendScore,
            sourceResearch: "Wikipedia + AI Generation",
            imageUrl: imageUrl,
            imageAlt: articleData.imageAlt,
            imageSource: "Pollinations AI"
        });

        await newBlog.save();

        res.status(200).json({
            message: 'Blog published successfully',
            blog: newBlog.slug
        });

    } catch (error) {
        console.error('Generate Blog Error:', error);
        res.status(500).json({ error: error.message });
    }
}

