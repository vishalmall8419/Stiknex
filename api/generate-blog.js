import connectToDatabase from './_utils/db.js';
import Trend from './_models/Trend.js';
import Blog from './_models/Blog.js';
import { verifyAdminToken } from './_utils/auth.js';

// Re-usable fetch helper
const fetchJson = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url, options);
            if (res.ok) return await res.json();
        } catch (err) {
            if (i === retries - 1) throw err;
        }
        await new Promise(r => setTimeout(r, 1500 * (i + 1)));
    }
};

// Internal Stiknex tool dictionary for automatic contextual linking
const TOOL_LINK_MAP = [
    { regex: /\b(sticky notes?|sticky boards?|digital sticky notes?)\b/gi, link: '[Stiknex Sticky Notes](/sticky-notes)' },
    { regex: /\b(online notebook|digital notebook|notepad|rich text notebook)\b/gi, link: '[Stiknex Online Notebook](/online-notebook)' },
    { regex: /\b(whiteboards?|excalidraw whiteboard|digital whiteboard|mind maps?|sketching canvas)\b/gi, link: '[Stiknex Whiteboard](/whiteboard)' },
    { regex: /\b(word counters?|character counters?|reading time calculator)\b/gi, link: '[Stiknex Word Counter](/word-counter)' },
    { regex: /\b(scientific calculators?|online calculators?|math calculators?)\b/gi, link: '[Stiknex Scientific Calculator](/scientific-calculator)' },
    { regex: /\b(unit converters?|length converters?|weight converters?|temperature converters?)\b/gi, link: '[Stiknex Unit Converter](/unit-converter)' },
    { regex: /\b(qr code generators?|free qr code)\b/gi, link: '[Stiknex QR Code Generator](/qr-code-generator)' },
    { regex: /\b(password generators?|secure password generator)\b/gi, link: '[Stiknex Password Generator](/password-generator)' },
    { regex: /\b(color pickers?|hex color picker)\b/gi, link: '[Stiknex Color Picker](/color-picker)' },
];

function injectInternalLinks(content) {
    let updated = content;
    for (const tool of TOOL_LINK_MAP) {
        // Only replace first 2 occurrences of each tool to avoid link stuffing
        let count = 0;
        updated = updated.replace(tool.regex, (match, p1, offset, string) => {
            // Check if already inside a markdown link [match](...)
            const prefix = string.slice(Math.max(0, offset - 30), offset);
            const suffix = string.slice(offset + match.length, offset + match.length + 30);
            if (prefix.includes('[') && !prefix.includes(']') && suffix.includes(')')) {
                return match;
            }
            if (count < 2) {
                count++;
                return tool.link;
            }
            return match;
        });
    }
    return updated;
}

export default async function handler(req, res) {
    // 1. Auth check: support both CRON_SECRET and Admin Bearer token
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const isCron = process.env.CRON_SECRET && token === process.env.CRON_SECRET;
    const tokenAuth = verifyAdminToken({ headers: { authorization: authHeader } });
    const isAdmin = tokenAuth.valid;

    if (!isCron && !isAdmin) {
        return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
    }

    try {
        await connectToDatabase();

        // 2. Determine keyword: manual query param takes precedence
        const queryKeyword = (req.query.keyword || req.body?.keyword || '').trim();
        let keyword = queryKeyword;
        let trendScore = 85;

        if (!keyword) {
            // Pick from unused trends
            const existingBlogs = await Blog.find({}, { trendKeyword: 1 });
            const usedKeywords = existingBlogs.map(b => b.trendKeyword).filter(Boolean);

            const topTrend = await Trend.findOne({ keyword: { $nin: usedKeywords } }).sort({ trendScore: -1 });
            if (!topTrend) {
                return res.status(404).json({ message: 'No unused trending keywords found. Please specify a keyword.' });
            }
            keyword = topTrend.keyword;
            trendScore = topTrend.trendScore || 80;
        }

        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured in environment variables.');
        }

        // 3. Research via Wikipedia (Extract + Page Image)
        let wikiExtract = "";
        let wikiImageUrl = "";
        try {
            const wikiRes = await fetchJson(
                `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro&piprop=original|thumbnail&pithumbsize=1200&titles=${encodeURIComponent(keyword)}&format=json`
            );
            if (wikiRes?.query?.pages) {
                const pages = wikiRes.query.pages;
                const pageId = Object.keys(pages)[0];
                if (pageId !== '-1') {
                    const pageData = pages[pageId];
                    if (pageData.extract) {
                        wikiExtract = pageData.extract.replace(/<[^>]*>?/gm, '');
                    }
                    if (pageData.original?.source) {
                        wikiImageUrl = pageData.original.source;
                    } else if (pageData.thumbnail?.source) {
                        wikiImageUrl = pageData.thumbnail.source;
                    }
                }
            }
        } catch (e) {
            console.warn(`Wikipedia query warning for "${keyword}":`, e.message);
        }

        // 4. Exhaustive 3000+ words Gemini Prompt
        const prompt = `
You are a world-class senior investigative writer, researcher, and analytical author writing for "Stiknex" (a privacy-first productivity and online tools ecosystem).
Write an encyclopedic, exhaustive, masterclass blog handbook of A MINIMUM OF 3000 WORDS (Target: 3000 to 3500 words) on the topic: "${keyword}".

CRITICAL WORD COUNT & DEPTH RULE (NON-NEGOTIABLE):
- The article MUST BE AT LEAST 3000 WORDS LONG.
- Do NOT summarize or write short high-level points.
- You must write extensively under every heading with deep historical nuance, psychological principles, real-life examples, case studies, comparative analyses, and step-by-step methodologies.
- Every single section must consist of multiple rich, deeply explanatory paragraphs. Cover every dimension of the topic comprehensively.

MANDATORY 11-PART COMPREHENSIVE BLUEPRINT (All formatted in standard Markdown):
1. # Catchy, Authoritative Masterclass Title
2. Comprehensive Prologue & Modern Relevance (300+ words): Why this topic demands attention today, foundational definitions, and societal/intellectual impact.
3. Historical Genesis & Timeline of Evolution (400+ words): Deep historical roots, key pioneers, turning points, and how perception shifted over the centuries.
4. Core Theoretical Pillars & Philosophical Framework (400+ words): Fundamental principles, underlying psychology, scientific or cultural mechanisms.
5. In-Depth Analytical Examination & Case Studies (400+ words): Granular breakdown, real-world examples, documented case studies, and critical discussions.
6. The Practical Playbook: Step-by-Step Execution Framework (400+ words): Detailed actionable blueprint that readers can implement immediately.
7. Visual Thinking, Systems & Tool Integration (350+ words): How visual organization, structured note-taking, calculations, and workflows empower mastery (natural contextual integration of tools).
8. Psychological & Cognitive Dynamics (300+ words): Mental models, cognitive biases, behavioral habits, and mindset shifts required.
9. Major Misconceptions & Pitfalls to Avoid (300+ words): What people get wrong, subtle traps, and counter-strategies.
10. Future Horizons & Long-Term Trajectory (250+ words): Emerging trends, technological shifts, and future predictions.
11. Definitive Frequently Asked Questions (FAQ) (350+ words): 6 detailed, multi-paragraph answers resolving the most nuanced reader questions.

HYPERLINK RULES (STRICT COMPLIANCE):
1. EXTERNAL HISTORICAL & FACTUAL ENTITY LINKS:
   Whenever you mention prominent historical figures (e.g. [Mahatma Gandhi](https://en.wikipedia.org/wiki/Mahatma_Gandhi)), scientists (e.g. [Albert Einstein](https://en.wikipedia.org/wiki/Albert_Einstein)), philosophers, famous books, historical treaties, or external organizations, ALWAYS generate an inline Markdown link to their Wikipedia page.
2. INTERNAL STIKNEX TOOL LINKS:
   Whenever workflows call for notes, canvas, calculation, or quick digital utilities, integrate natural Markdown links:
   - Sticky notes / ideation canvas -> [Stiknex Sticky Notes](/sticky-notes)
   - Taking notes, writing, journal, notepad -> [Stiknex Online Notebook](/online-notebook)
   - Sketching, diagrams, mind maps, whiteboards -> [Stiknex Whiteboard](/whiteboard)
   - Word count, reading time analysis -> [Word Counter](/word-counter)
   - Math, calculations -> [Scientific Calculator](/scientific-calculator)
   - Measurements, conversions -> [Unit Converter](/unit-converter)
   - Free utilities suite -> [Stiknex Tools](/tools)
3. Ensure all links are woven directly inside readable paragraph prose.

Reference Research Context:
${wikiExtract ? wikiExtract.slice(0, 3000) : 'Rely on authoritative verified knowledge.'}

Output STRICTLY as valid JSON with NO markdown backticks:
{
  "title": "...",
  "slug": "url-friendly-slug-with-hyphens",
  "excerpt": "Detailed 150-160 character summary...",
  "content": "# Title\\n\\nComprehensive 3000+ words content with rich paragraphs and inline markdown links...",
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "SEO description under 160 chars",
  "category": "Productivity",
  "keywords": "keyword1, keyword2, keyword3, keyword4, keyword5, keyword6",
  "imagePrompt": "A cinematic high-resolution visual representing ${keyword}, modern digital art, vibrant lighting, highly detailed, photorealistic, 8k",
  "imageAlt": "Visual representation of ${keyword}"
}
`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const geminiRes = await fetchJson(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.7,
                    maxOutputTokens: 8192
                }
            })
        });

        const articlePart = geminiRes?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!articlePart) {
            throw new Error('Gemini API did not return text content.');
        }

        const articleData = JSON.parse(articlePart);

        // Inject smart internal links to guarantee Stiknex tool mentions are linked
        let finalContent = injectInternalLinks(articleData.content);

        // 5. High-Resolution Topic Image Selection
        let finalImageUrl = "";
        let imageSource = "AI Generated";

        if (wikiImageUrl && !wikiImageUrl.includes('.svg')) {
            // Real topic image from Wikipedia (e.g. historical person, landmark, scientific object)
            finalImageUrl = wikiImageUrl;
            imageSource = "Wikimedia Commons";
        } else {
            // Generate contextual image via Pollinations AI with flux model
            const cleanPrompt = (articleData.imagePrompt || `${keyword} conceptual creative scene modern illustration`)
                .replace(/["'\n\r]/g, ' ')
                .slice(0, 180);
            
            const seed = Math.floor(Math.random() * 90000) + 10000;
            finalImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1200&height=630&nologo=true&model=flux&seed=${seed}`;
            imageSource = "Pollinations AI (Flux)";
        }

        // Verify quality
        if (!articleData.title || !finalContent || finalContent.length < 500) {
            throw new Error("Generated content was too short or malformed.");
        }

        // 6. Save or update in MongoDB
        const cleanSlug = (articleData.slug || keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');

        const savedBlog = await Blog.findOneAndUpdate(
            { slug: cleanSlug },
            {
                title: articleData.title,
                slug: cleanSlug,
                excerpt: articleData.excerpt,
                content: finalContent,
                metaTitle: articleData.metaTitle || articleData.title,
                metaDescription: articleData.metaDescription || articleData.excerpt,
                category: articleData.category || "Productivity",
                keywords: articleData.keywords || `${keyword}, productivity, stiknex`,
                trendKeyword: keyword,
                trendScore: trendScore,
                sourceResearch: wikiExtract ? "Wikipedia + Gemini Analysis" : "Gemini Research",
                imageUrl: finalImageUrl,
                imageAlt: articleData.imageAlt || articleData.title,
                imageSource: imageSource,
                published: true,
                publishedAt: new Date()
            },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Blog generated and published successfully!',
            blog: savedBlog.slug,
            wordCount: finalContent.split(/\s+/).length,
            imageUrl: finalImageUrl
        });

    } catch (error) {
        console.error('Generate Blog Error:', error);
        return res.status(500).json({ error: error.message || 'Failed to generate blog.' });
    }
}
