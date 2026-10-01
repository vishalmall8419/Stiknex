import connectToDatabase from './_utils/db.js';
import Trend from './_models/Trend.js';
import Blog from './_models/Blog.js';
import { verifyAdminToken } from './_utils/auth.js';
import { put } from '@vercel/blob';

// Re-usable fetch helper
const fetchJson = async (url, options) => {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    return res.json();
};

export default async function handler(req, res) {
    // 1. Auth check
    const isCron = req.headers['authorization'] === `Bearer ${process.env.CRON_SECRET}`;
    const isAdmin = verifyAdminToken(req.cookies.stiknex_auth_token);
    if (!isCron && !isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        await connectToDatabase();

        // 2. Daily limit check (only 1 blog per day)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const alreadyPublishedToday = await Blog.findOne({ publishedAt: { $gte: startOfDay } });
        if (alreadyPublishedToday) {
            return res.status(200).json({ message: 'Daily blog limit reached. Skipped.', blog: alreadyPublishedToday.slug });
        }

        // 3. Select a Trend Keyword
        // Get keywords that don't have a blog yet. We sort by trendScore (descending).
        const existingBlogs = await Blog.find({}, { trendKeyword: 1 });
        const usedKeywords = existingBlogs.map(b => b.trendKeyword);

        const topTrend = await Trend.findOne({ keyword: { $nin: usedKeywords } }).sort({ trendScore: -1 });
        if (!topTrend) {
            return res.status(404).json({ message: 'No unused trending keywords found.' });
        }
        const keyword = topTrend.keyword;

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
        const prompt = `
You are an expert tech, productivity, and lifestyle blog writer. 
Write a high-quality, comprehensive, and original blog post based on the keyword: "${keyword}".

Important Rules:
1. Do not copy or reuse sentences from Wikipedia. Write in a completely original, engaging, and human-readable tone.
2. Make it highly useful and factual. Break it into clear sections. DO NOT USE HTML. Use plain text formatting: Use all caps for HEADERS (e.g. "INTRODUCTION") and separate paragraphs with exactly two newlines (\\n\\n).
3. Do not invent fake facts. 
4. Include a catchy title, a short excerpt (max 160 chars), SEO meta title, SEO meta description, and 5-8 SEO keywords.
5. Create a prompt for an AI image generator to create the header image. The image prompt MUST NOT mention copyrighted logos, real people's likenesses, or exact Wikipedia artwork. Make it conceptual, illustrative, or artistic.

Reference Information (Use for facts only, DO NOT COPY):
${wikiExtract ? wikiExtract : 'No specific Wikipedia data found, rely on general safe knowledge.'}

Output STRICTLY as JSON with no markdown block wrappers. Use this schema:
{
  "title": "...",
  "slug": "url-friendly-slug",
  "excerpt": "...",
  "content": "MAIN HEADER\\n\\nParagraph one.\\n\\nParagraph two.\\n\\nSECOND HEADER\\n\\nParagraph three.",
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": "...",
  "imagePrompt": "...",
  "imageAlt": "..."
}
`;

        const geminiRes = await fetchJson(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
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

        // 6. Generate Image via Gemini (Imagen 3)
        // If Imagen endpoint is not enabled on this key, this might fail, so we wrap in try-catch
        let imageUrl = '';
        try {
            const imagenRes = await fetchJson(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-images?key=${process.env.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instances: [{ prompt: articleData.imagePrompt }],
                    parameters: { sampleCount: 1, outputOptions: { mimeType: "image/jpeg" } }
                })
            });

            const base64Image = imagenRes.predictions[0].bytesBase64Encoded;
            const buffer = Buffer.from(base64Image, 'base64');

            // 7. Save Image to Vercel Blob (Fallback to Data URI if no token)
            if (process.env.BLOB_READ_WRITE_TOKEN) {
                const blob = await put(`blogs/${articleData.slug}-${Date.now()}.jpg`, buffer, {
                    access: 'public',
                    contentType: 'image/jpeg'
                });
                imageUrl = blob.url;
            } else {
                // Fallback: Embed directly in DB as base64 (not recommended for many blogs, but works out-of-box)
                imageUrl = `data:image/jpeg;base64,${base64Image}`;
            }
        } catch (e) {
            console.error('Image generation failed:', e.message);
            // Fallback generic image
            imageUrl = 'https://stiknex.vercel.app/Stiknex.png';
        }

        // 8. Quality/Safety Checks (Strict Enforcement)
        const contentLen = articleData.content?.length || 0;
        
        // A. Minimum Content Quality & Metadata
        if (!articleData.title || !articleData.content || contentLen < 800) {
            throw new Error(`Quality check failed: Content too short (${contentLen} chars) or missing core fields.`);
        }
        if (!articleData.metaTitle || !articleData.metaDescription || !articleData.keywords) {
            throw new Error("Quality check failed: Missing SEO metadata.");
        }
        
        // B. Duplicate Content / Title Check
        const duplicateTitle = await Blog.findOne({ title: articleData.title });
        if (duplicateTitle) {
            throw new Error("Quality check failed: Duplicate title detected.");
        }

        // C. Factual consistency & Spun content check
        // (Simple heuristic: ensure no exact Wikipedia phrases over 50 chars match)
        if (wikiExtract && wikiExtract.length > 100) {
            const wikiSentences = wikiExtract.split('.').filter(s => s.trim().length > 50);
            for (let sentence of wikiSentences) {
                if (articleData.content.includes(sentence.trim())) {
                    throw new Error("Safety check failed: Direct Wikipedia copy detected (Plagiarism risk).");
                }
            }
        }

        // D. Internal Link Injection Check (Enforce natural linking)
        const stiknexPages = ['/tools', '/notebook', '/whiteboard', '/blog'];
        let hasInternalLink = stiknexPages.some(page => articleData.content.includes(page) || articleData.content.toLowerCase().includes('stiknex'));
        
        // Auto-inject a contextual internal link if missing
        if (!hasInternalLink) {
            articleData.content += `\n\nEXPLORE MORE\n\nEnhance your productivity with [Stiknex's free online tools](/tools) and our [infinite whiteboard](/whiteboard).`;
        }

        // E. Image validation
        if (!imageUrl || imageUrl.includes('Stiknex.png')) {
            console.warn("Warning: AI image failed, using fallback.");
            // We allow fallback to proceed, but log it.
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
            trendScore: topTrend.trendScore,
            sourceResearch: "Wikipedia + AI Generation",
            imageUrl: imageUrl,
            imageAlt: articleData.imageAlt,
            imageSource: "AI Generated"
        });

        await newBlog.save();

        res.status(200).json({
            message: 'Daily blog published successfully',
            blog: newBlog.slug
        });

    } catch (error) {
        console.error('Generate Blog Error:', error);
        res.status(500).json({ error: error.message });
    }
}
