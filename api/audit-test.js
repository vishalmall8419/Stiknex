import connectToDatabase from './_utils/db.js';
import Trend from './_models/Trend.js';
import Blog from './_models/Blog.js';
import { put } from '@vercel/blob';

const fetchJson = async (url, options) => {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    return res.json();
};

export default async function handler(req, res) {
    if (req.query.secret !== 'audit2026') return res.status(401).json({ error: 'Unauthorized' });

    try {
        await connectToDatabase();

        // 1. Check trends
        const latestTrends = await Trend.find({ status: { $ne: 'ignored' } }).sort({ date: -1 }).limit(5);

        // 2. Select a keyword that doesn't have a blog
        const existingBlogs = await Blog.find({}, { trendKeyword: 1 });
        const usedKeywords = existingBlogs.map(b => b.trendKeyword);
        const topTrend = await Trend.findOne({ keyword: { $nin: usedKeywords }, status: { $ne: 'ignored' } }).sort({ trendScore: -1 });

        let keyword = topTrend ? topTrend.keyword : null;
        let articleData = null;
        let imageUrl = null;
        let blogSaved = false;

        if (keyword && req.query.generate === 'true') {
            // Generate Blog
            if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing');

            let wikiExtract = "";
            try {
                const wikiRes = await fetchJson(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=${encodeURIComponent(keyword)}&format=json`);
                const pages = wikiRes.query.pages;
                const pageId = Object.keys(pages)[0];
                if (pageId !== '-1') {
                    wikiExtract = pages[pageId].extract.replace(/<[^>]*>?/gm, '');
                }
            } catch (e) {}

            const prompt = `
You are an expert tech, productivity, and lifestyle blog writer. 
Write a high-quality, comprehensive, and original blog post based on the keyword: "${keyword}".
Important Rules:
1. Do not copy Wikipedia. Write completely original content.
2. Break it into clear sections. DO NOT USE HTML. Use plain text formatting with EXACTLY TWO NEWLINES between paragraphs. Use ALL CAPS for headers.
3. Include title, short excerpt (160 chars), metaTitle, metaDescription, 5-8 keywords, and a creative imagePrompt.
Reference: ${wikiExtract}
Output STRICTLY as JSON:
{
  "title": "...", "slug": "url-slug", "excerpt": "...", "content": "MAIN HEADER\\n\\nPar 1\\n\\nPar 2", "metaTitle": "...", "metaDescription": "...", "keywords": "...", "imagePrompt": "...", "imageAlt": "..."
}
`;
            const geminiRes = await fetchJson(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json", temperature: 0.7 }
                })
            });

            articleData = JSON.parse(geminiRes.candidates[0].content.parts[0].text);

            try {
                const imagenRes = await fetchJson(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: articleData.imagePrompt }] }] })
                });
                const base64Image = imagenRes.candidates[0].content.parts[0].inlineData.data;
                const buffer = Buffer.from(base64Image, 'base64');
                
                if (process.env.BLOB_READ_WRITE_TOKEN) {
                    const blob = await put(`blogs/${articleData.slug}-${Date.now()}.jpg`, buffer, { access: 'public', contentType: 'image/jpeg' });
                    imageUrl = blob.url;
                } else {
                    imageUrl = `data:image/jpeg;base64,${base64Image}`;
                }
            } catch (e) {
                imageUrl = 'https://stiknex.vercel.app/Stiknex.png';
            }

            const newBlog = new Blog({
                title: articleData.title, slug: articleData.slug, excerpt: articleData.excerpt, content: articleData.content,
                metaTitle: articleData.metaTitle, metaDescription: articleData.metaDescription, keywords: articleData.keywords,
                trendKeyword: keyword, trendScore: topTrend.trendScore, sourceResearch: "Wikipedia + AI",
                imageUrl: imageUrl, imageAlt: articleData.imageAlt, imageSource: "AI Generated"
            });
            await newBlog.save();
            blogSaved = true;
        }

        res.status(200).json({
            success: true,
            dbConnected: true,
            latestTrends,
            topTrendToUse: topTrend,
            usedKeywords,
            blogSaved,
            articleData,
            imageUrl
        });
    } catch (e) {
        res.status(500).json({ error: e.message, stack: e.stack });
    }
}
