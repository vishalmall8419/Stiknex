import connectToDatabase from './_utils/db.js';
import Trend from './_models/Trend.js';
import Blog from './_models/Blog.js';
import { verifyAdminToken } from './_utils/auth.js';
import { validateBlogArticle, countArticleWords, extractTableOfContents } from './_utils/blogValidator.js';

// Robust fetch helper with timeout, transient-only retries, exponential backoff and jitter
const fetchJson = async (url, options = {}, retries = 2) => {
    const timeoutMs = options.timeoutMs || 25000;
    for (let i = 0; i < retries; i++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const res = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) return await res.json();
            const errBody = await res.text().catch(() => '');

            // Permanent errors: fail fast, do not retry
            if ([400, 401, 403, 404].includes(res.status)) {
                throw new Error(`HTTP ${res.status}: ${errBody.slice(0, 180)}`);
            }

            // If last attempt on transient error (429, 503, etc.)
            if (i === retries - 1) {
                throw new Error(`HTTP ${res.status}: ${errBody.slice(0, 180)}`);
            }

            // Exponential backoff with random jitter
            const jitter = Math.floor(Math.random() * 200);
            const backoff = (Math.pow(2, i) * 600) + jitter;
            await new Promise(r => setTimeout(r, backoff));
        } catch (err) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
                throw new Error(`Request timed out after ${timeoutMs}ms`);
            }
            if (i === retries - 1) throw err;
            const jitter = Math.floor(Math.random() * 200);
            const backoff = (Math.pow(2, i) * 500) + jitter;
            await new Promise(r => setTimeout(r, backoff));
        }
    }
};

const CANDIDATE_MODELS = [
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    'gemini-flash-lite-latest'
];

/**
 * Executes a Gemini prompt with automatic model fallback and retry logic.
 */
async function callGeminiWithFallback(prompt, isJson = false, maxTokens = 2200, timeoutMs = 25000) {
    let lastError = null;
    for (const model of CANDIDATE_MODELS) {
        try {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
            const body = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: maxTokens
                }
            };
            if (isJson) {
                body.generationConfig.responseMimeType = "application/json";
            }

            const res = await fetchJson(geminiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                timeoutMs,
                body: JSON.stringify(body)
            }, 1);

            const text = res?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim().length > 100) {
                return { text, model };
            }
        } catch (mErr) {
            console.warn(`Model ${model} failed for prompt (${mErr.message}), trying next candidate...`);
            lastError = mErr;
            // Brief backoff before next model to allow transient spikes to settle
            await new Promise(r => setTimeout(r, 1200));
        }
    }
    throw new Error(`All Gemini models failed. Last error: ${lastError?.message || 'No text content returned.'}`);
}

// Internal Stiknex tool dictionary for automatic contextual linking
const TOOL_LINK_MAP = [
    { regex: /\b(sticky notes?|digital sticky notes?|sticky note boards?|sticky canvas)\b/i, url: '/sticky-notes' },
    { regex: /\b(online notebook|digital notebook|notepad|rich text notebook|note taking app)\b/i, url: '/online-notebook' },
    { regex: /\b(whiteboards?|excalidraw whiteboard|digital whiteboard|mind maps?|sketching canvas)\b/i, url: '/whiteboard' },
    { regex: /\b(word counters?|character counters?|word count tool)\b/i, url: '/word-counter' },
    { regex: /\b(reading time|reading time calculator|estimate reading speed)\b/i, url: '/reading-time-calculator' },
    { regex: /\b(scientific calculators?|math calculator)\b/i, url: '/scientific-calculator' },
    { regex: /\b(unit converters?|metric conversion|convert units)\b/i, url: '/unit-converter' },
    { regex: /\b(qr code generators?|free qr code|create qr code)\b/i, url: '/qr-code-generator' },
    { regex: /\b(password generators?|secure passwords?|generate strong password)\b/i, url: '/password-generator' },
    { regex: /\b(color pickers?|hex color palette|color tools?)\b/i, url: '/color-picker' },
    { regex: /\b(free online tools|online utilities collection|productivity tools suite)\b/i, url: '/tools' },
];

/**
 * Injects natural, contextual links to Stiknex tools without corrupting headings,
 * table of contents, code blocks, existing links, or producing self-links.
 */
function injectInternalLinks(content, currentSlug = '') {
    if (!content || typeof content !== 'string') return content;

    const lines = content.split('\n');
    const linkedTools = new Set();
    let inCodeBlock = false;
    let inTOC = false;

    const updatedLines = lines.map(line => {
        const trimmed = line.trim();

        // 1. Skip code blocks
        if (trimmed.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            return line;
        }
        if (inCodeBlock) return line;

        // 2. Skip Table of Contents block
        if (/^##\s+Table of Contents/i.test(trimmed)) {
            inTOC = true;
            return line;
        }
        if (inTOC && /^##\s+/i.test(trimmed) && !/^##\s+Table of Contents/i.test(trimmed)) {
            inTOC = false;
        }
        if (inTOC) return line;

        // 3. Skip headings, list links in TOC, blockquotes, and table structure
        if (/^#{1,6}\s+/.test(trimmed) || /^\s*[-*]\s+\[/.test(trimmed) || trimmed.startsWith('|')) {
            return line;
        }

        let updatedLine = line;

        for (const tool of TOOL_LINK_MAP) {
            // Strictly at most 1 link per tool across the entire article
            if (linkedTools.has(tool.url)) continue;

            // Avoid self-linking to current article
            const cleanToolSlug = tool.url.replace(/^\//, '');
            if (currentSlug && (currentSlug.includes(cleanToolSlug) || cleanToolSlug.includes(currentSlug))) {
                continue;
            }

            tool.regex.lastIndex = 0;
            if (tool.regex.test(updatedLine)) {
                let replaced = false;
                updatedLine = updatedLine.replace(tool.regex, (match, p1, offset, fullStr) => {
                    if (replaced) return match;
                    const before = fullStr.slice(0, offset);
                    const after = fullStr.slice(offset + match.length);

                    // Ensure not already inside Markdown link syntax [text](url)
                    const openBrackets = (before.match(/\[/g) || []).length;
                    const closeBrackets = (before.match(/\]/g) || []).length;
                    if (openBrackets > closeBrackets) return match;

                    const openParens = (before.match(/\(/g) || []).length;
                    const closeParens = (before.match(/\)/g) || []).length;
                    if (openParens > closeParens) return match;

                    replaced = true;
                    linkedTools.add(tool.url);
                    // Use natural written anchor text from author
                    return `[${match}](${tool.url})`;
                });
            }
        }

        return updatedLine;
    });

    return updatedLines.join('\n');
}

// Evergreen topics library for automatic fallback when trending keywords are exhausted
const EVERGREEN_TOPICS = [
    "The Science of Visual Thinking: How Sticky Notes Boost Creative Problem Solving",
    "Digital Minimalism in 2026: Streamlining Your Workspace for Deep Focus",
    "How to Build a Second Brain: Note-Taking Architecture and Knowledge Management",
    "The Feynman Technique: Mastering Any Subject with Structured Explanations",
    "Digital Whiteboarding for Remote Teams: Collaborative Ideation and Systems Design",
    "Time Blocking vs Pomodoro Technique: Cognitive Science Behind Flow States",
    "The Psychology of Cognitive Offloading: Why Writing Things Down Reduces Anxiety",
    "Markdown for Thinkers: Why Plain Text Outlasts Every Proprietary App",
    "The Eisenhower Matrix in Action: Ruthlessly Prioritizing What Truly Matters",
    "Analog Intuition meets Digital Speed: The Future of Hybrid Productivity",
    "How Leonardo da Vinci and Thomas Edison Kept Notebooks: Historical Workflows",
    "Combating Information Overload: Curating Input to Maximize Creative Output",
    "Kanban for Personal Life: Visualizing Workflows from Concept to Completion",
    "The Cognitive Benefits of Sketching and Mind Mapping for Memory Retention",
    "Building Atomic Habits Through Daily Reflection and Micro-Journals",
    "The Deep Work Blueprint: Protecting Uninterrupted Time in a Distracted World",
    "Speed vs Comprehension: Calculating Reading Time and Optimizing Information Intake",
    "Mastering Unit Conversions and Scientific Accuracy in Everyday Engineering",
    "Cryptographic Password Security in 2026: Protecting Your Digital Identity",
    "QR Codes and Physical-to-Digital Workflows: Frictionless Sharing Systems"
];

export default async function handler(req, res) {
    // 1. Auth check: support Vercel Cron, CRON_SECRET, and Admin Bearer token
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const isVercelCron = req.headers['x-vercel-cron'] === '1' ||
                         req.headers['user-agent']?.includes('vercel-cron') ||
                         (process.env.CRON_SECRET && token === process.env.CRON_SECRET);
    const tokenAuth = verifyAdminToken({ headers: { authorization: authHeader } });
    const isAdmin = tokenAuth.valid;

    // Allow auto-generation via cron or authenticated admin
    if (!isVercelCron && !isAdmin) {
        return res.status(401).json({ error: 'Unauthorized: Admin authentication or cron trigger required.' });
    }

    try {
        await connectToDatabase();

        const query = req.query || {};
        const body = req.body || {};
        const step = parseInt(query.step || body.step || '0', 10);
        const reqSlug = (query.slug || body.slug || '').trim();

        // -----------------------------------------------------------------
        // STEP-BASED RESUMABLE PIPELINE (Designed for Vercel 15s Timeout)
        // -----------------------------------------------------------------

        if (step === 1) {
            // STEP 1: Title, Slug, Metadata, Excerpt, Image & Foundations (Part 1: ~1,000 words)
            let keyword = (query.keyword || body.keyword || '').trim();
            let trendScore = 85;

            if (!keyword) {
                const existingBlogs = await Blog.find({}, { trendKeyword: 1, title: 1 });
                const usedKeywords = new Set(existingBlogs.map(b => (b.trendKeyword || '').toLowerCase().trim()).filter(Boolean));
                const usedTitles = new Set(existingBlogs.map(b => (b.title || '').toLowerCase().trim()).filter(Boolean));

                const topTrend = await Trend.findOne({
                    status: { $ne: 'ignored' },
                    keyword: { $nin: Array.from(usedKeywords) }
                }).sort({ relevanceScore: -1, trendScore: -1 });

                if (topTrend) {
                    keyword = topTrend.keyword;
                    trendScore = topTrend.trendScore || 90;
                    topTrend.status = 'covered';
                    await topTrend.save();
                } else {
                    const availableEvergreens = EVERGREEN_TOPICS.filter(
                        t => !usedTitles.has(t.toLowerCase()) && !usedKeywords.has(t.toLowerCase())
                    );
                    keyword = availableEvergreens.length > 0 
                        ? availableEvergreens[Math.floor(Math.random() * availableEvergreens.length)]
                        : EVERGREEN_TOPICS[Math.floor(Math.random() * EVERGREEN_TOPICS.length)];
                    trendScore = 80;
                }
            }

            // Fetch Wikipedia grounding
            let wikiExtract = "";
            let wikiImageUrl = "";
            try {
                const wikiRes = await fetchJson(
                    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro&piprop=original|thumbnail&pithumbsize=1200&titles=${encodeURIComponent(keyword)}&format=json`,
                    { timeoutMs: 4000 }
                );
                if (wikiRes?.query?.pages) {
                    const pages = wikiRes.query.pages;
                    const pageId = Object.keys(pages)[0];
                    if (pageId !== '-1') {
                        const pageData = pages[pageId];
                        if (pageData.extract) wikiExtract = pageData.extract.replace(/<[^>]*>?/gm, '');
                        if (pageData.original?.source) wikiImageUrl = pageData.original.source;
                        else if (pageData.thumbnail?.source) wikiImageUrl = pageData.thumbnail.source;
                    }
                }
            } catch (_) {}

            const promptPart1 = `
You are a senior investigative author writing for "Stiknex" (a privacy-first productivity and online tools ecosystem).
Write PART 1 of an authoritative masterclass handbook on "${keyword}".
Reference: ${wikiExtract ? wikiExtract.slice(0, 1500) : 'Authoritative knowledge.'}

SECTIONS TO WRITE (Target 1000 to 1200 words):
# [Authoritative Masterclass Title]
## 1. Executive Prologue & Contemporary Relevance
Explore foundational definitions, the current cultural and technological landscape, why this matters today, and the core pain points addressed.
## 2. Historical Genesis & Milestone Timeline
Document the evolutionary timeline, pivotal discoveries, historical pioneers, and paradigm shifts.
## 3. Theoretical Pillars & Cognitive Foundations
Examine the underlying mechanisms, cognitive psychology models, neuroscience principles, and theoretical frameworks.

RULES: Output STRICTLY as valid JSON with NO markdown backticks around the json:
{
  "title": "Authoritative Masterclass Title",
  "slug": "url-friendly-slug",
  "excerpt": "Detailed 150-160 character summary...",
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "SEO description under 160 chars",
  "category": "Productivity",
  "keywords": "keyword1, keyword2, keyword3, keyword4, keyword5",
  "imagePrompt": "Cinematic visual representing ${keyword}, 8k photorealistic",
  "content": "# Title\\n\\n## 1. Executive Prologue...\\n\\n## 2. Historical Genesis...\\n\\n## 3. Theoretical Pillars..."
}
`;
            const p1Res = await callGeminiWithFallback(promptPart1, true, 2200, 12000);

            let p1Data = {
                title: keyword,
                slug: keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                excerpt: `Comprehensive masterclass on ${keyword}.`,
                metaTitle: `${keyword} Masterclass | Stiknex`,
                metaDescription: `Comprehensive guide, practical frameworks, and strategies for ${keyword}.`,
                category: "Productivity",
                keywords: `${keyword}, productivity, tools, stiknex`,
                content: p1Res.text
            };

            try {
                const parsed = JSON.parse(p1Res.text);
                Object.assign(p1Data, parsed);
            } catch (_) {
                const titleMatch = p1Res.text.match(/^#\s+(.+)$/m);
                if (titleMatch) p1Data.title = titleMatch[1].replace(/[*_#]/g, '').trim();
                const jsonMatch = p1Res.text.match(/\{[\s\S]*"title"[\s\S]*\}/);
                if (jsonMatch) {
                    try { Object.assign(p1Data, JSON.parse(jsonMatch[0])); } catch (__) {}
                }
            }

            // Prevent overwriting already published articles
            let cleanSlug = (p1Data.slug || keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');
            const existingPublished = await Blog.findOne({ slug: cleanSlug, published: true });
            if (existingPublished) {
                cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
            }

            let finalImageUrl = wikiImageUrl;
            if (!finalImageUrl || finalImageUrl.includes('.svg')) {
                const cleanPrompt = (p1Data.imagePrompt || `${keyword} conceptual creative scene modern illustration`).replace(/["'\n\r]/g, ' ').slice(0, 180);
                const seed = Math.floor(Math.random() * 90000) + 10000;
                finalImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1200&height=630&nologo=true&model=flux&seed=${seed}`;
            }

            let initialContent = p1Data.content;
            if (!initialContent.startsWith('# ')) {
                initialContent = `# ${p1Data.title}\n\n${initialContent}`;
            }

            const draftWords = countArticleWords(initialContent);

            const draftDoc = await Blog.findOneAndUpdate(
                { slug: cleanSlug },
                {
                    title: p1Data.title,
                    slug: cleanSlug,
                    excerpt: p1Data.excerpt,
                    content: initialContent,
                    metaTitle: p1Data.metaTitle || p1Data.title,
                    metaDescription: p1Data.metaDescription || p1Data.excerpt,
                    category: p1Data.category || "Productivity",
                    keywords: p1Data.keywords || `${keyword}, productivity, stiknex`,
                    trendKeyword: keyword,
                    trendScore: trendScore,
                    imageUrl: finalImageUrl,
                    imageAlt: p1Data.title,
                    wordCount: draftWords,
                    validationStatus: 'pending',
                    validationError: 'Draft in progress: Step 1 of 4 completed.',
                    published: false,
                    updatedAt: new Date()
                },
                { upsert: true, returnDocument: 'after' }
            );

            return res.status(200).json({
                success: true,
                step: 1,
                nextStep: 2,
                slug: draftDoc.slug,
                title: draftDoc.title,
                wordCount: draftWords,
                published: false,
                message: `Step 1/4 completed: Architecture initialized with ${draftWords} words.`
            });
        }

        if (step === 2) {
            // STEP 2: Frameworks, Implementation Blueprint, Comparison Table & Case Studies (Part 2: ~1,100 words)
            if (!reqSlug) return res.status(400).json({ error: "Slug required for Step 2." });
            const draft = await Blog.findOne({ slug: reqSlug });
            if (!draft) return res.status(404).json({ error: `Draft not found for slug: ${reqSlug}` });
            if (draft.published) return res.status(400).json({ error: "Cannot modify already published article." });

            const promptPart2 = `
Write PART 2 of the masterclass handbook on "${draft.trendKeyword || draft.title}".
SECTIONS TO WRITE (Target 1000 to 1200 words):
## 4. Operational Frameworks & Methodological Blueprints
Deeply explain the core systems, mental models, and structured methodologies.
## 5. Step-by-Step Practical Execution Guide
Provide an actionable, step-by-step implementation blueprint that readers can execute immediately.
## 6. Comparative Tradeoff Matrix
Include a comprehensive Markdown comparison table evaluating traditional vs modern approaches, tradeoffs, and performance metrics.
## 7. In-Depth Real-World Case Studies
Deconstruct two concrete real-world case studies with background, challenges, interventions, and documented outcomes.

RULES: Highly descriptive, multi-paragraph sections. Output directly in clean Markdown without backticks.
`;
            const p2Res = await callGeminiWithFallback(promptPart2, false, 2200, 12000);
            const p2Text = p2Res.text.replace(/^```markdown/gi, '').replace(/^```/g, '').trim();

            let updatedContent = draft.content;
            if (updatedContent.includes('## 4. Operational Frameworks')) {
                const splitIndex = updatedContent.indexOf('## 4. Operational Frameworks');
                updatedContent = `${updatedContent.slice(0, splitIndex).trim()}\n\n${p2Text}`;
            } else {
                updatedContent = `${updatedContent}\n\n${p2Text}`;
            }
            const updatedWords = countArticleWords(updatedContent);

            await Blog.findByIdAndUpdate(draft._id, {
                content: updatedContent,
                wordCount: updatedWords,
                validationError: 'Draft in progress: Step 2 of 4 completed.',
                updatedAt: new Date()
            });

            return res.status(200).json({
                success: true,
                step: 2,
                nextStep: 3,
                slug: draft.slug,
                wordCount: updatedWords,
                published: false,
                message: `Step 2/4 completed: Core frameworks added. Total words: ${updatedWords}.`
            });
        }

        if (step === 3) {
            // STEP 3: Traps, Tool Integration, Comprehensive FAQ, Conclusion & References (Part 3: ~1,100 words)
            if (!reqSlug) return res.status(400).json({ error: "Slug required for Step 3." });
            const draft = await Blog.findOne({ slug: reqSlug });
            if (!draft) return res.status(404).json({ error: `Draft not found for slug: ${reqSlug}` });
            if (draft.published) return res.status(400).json({ error: "Cannot modify already published article." });

            const promptPart3 = `
Write PART 3 of the masterclass handbook on "${draft.trendKeyword || draft.title}".
SECTIONS TO WRITE (Target 1000 to 1200 words):
## 8. Common Traps, Subtle Misconceptions & Counter-Strategies
Analyze nuanced pitfalls, cognitive biases, and exact mitigation tactics.
## 9. Digital Workspace Systems & External Cognition Workflows
Explain how to integrate visual artifacts, digital notes, and thinking systems into daily workflows.
## 10. Frequently Asked Questions (FAQ)
Provide 4-5 thorough, multi-paragraph answers addressing the most critical reader questions.
## 11. Conclusion & Strategic Synthesis
Deliver a powerful, actionable summary synthesizing the major takeaways.
## 12. Authoritative Sources & Further Reading
List 3-5 real, verified citations in format: - [Title](https://...) (using Wikipedia, research papers, or educational resources).

RULES: Highly descriptive, authoritative paragraphs. Output directly in clean Markdown without backticks.
`;
            const p3Res = await callGeminiWithFallback(promptPart3, false, 2200, 12000);
            const p3Text = p3Res.text.replace(/^```markdown/gi, '').replace(/^```/g, '').trim();

            let updatedContent = draft.content;
            if (updatedContent.includes('## 8. Common Traps')) {
                const splitIndex = updatedContent.indexOf('## 8. Common Traps');
                updatedContent = `${updatedContent.slice(0, splitIndex).trim()}\n\n${p3Text}`;
            } else {
                updatedContent = `${updatedContent}\n\n${p3Text}`;
            }
            const updatedWords = countArticleWords(updatedContent);

            await Blog.findByIdAndUpdate(draft._id, {
                content: updatedContent,
                wordCount: updatedWords,
                validationError: 'Draft in progress: Step 3 of 4 completed.',
                updatedAt: new Date()
            });

            return res.status(200).json({
                success: true,
                step: 3,
                nextStep: 4,
                slug: draft.slug,
                wordCount: updatedWords,
                published: false,
                message: `Step 3/4 completed: Traps, FAQ, and references added. Total words: ${updatedWords}.`
            });
        }

        if (step === 4) {
            // STEP 4: Table of Contents, Internal Linking, Word Count Validation Gate & Publication
            if (!reqSlug) return res.status(400).json({ error: "Slug required for Step 4." });
            const draft = await Blog.findOne({ slug: reqSlug });
            if (!draft) return res.status(404).json({ error: `Draft not found for slug: ${reqSlug}` });
            if (draft.published) {
                return res.status(200).json({
                    success: true,
                    published: true,
                    complete: true,
                    id: draft._id.toString(),
                    blog: draft.slug,
                    title: draft.title,
                    wordCount: draft.wordCount,
                    message: "Article already published."
                });
            }

            let finalContent = draft.content;

            // Insert Table of Contents if missing
            if (!finalContent.includes('## Table of Contents')) {
                const tocMarkdown = `
## Table of Contents
- [1. Executive Prologue & Contemporary Relevance](#executive-prologue-contemporary-relevance)
- [2. Historical Genesis & Milestone Timeline](#historical-genesis-milestone-timeline)
- [3. Theoretical Pillars & Cognitive Foundations](#theoretical-pillars-cognitive-foundations)
- [4. Operational Frameworks & Methodological Blueprints](#operational-frameworks-methodological-blueprints)
- [5. Step-by-Step Practical Execution Guide](#step-by-step-practical-execution-guide)
- [6. Comparative Tradeoff Matrix](#comparative-tradeoff-matrix)
- [7. In-Depth Real-World Case Studies](#in-depth-real-world-case-studies)
- [8. Common Traps, Subtle Misconceptions & Counter-Strategies](#common-traps-subtle-misconceptions-counter-strategies)
- [9. Digital Workspace Systems & External Cognition Workflows](#digital-workspace-systems-external-cognition-workflows)
- [10. Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
- [11. Conclusion & Strategic Synthesis](#conclusion-strategic-synthesis)
- [12. Authoritative Sources & Further Reading](#authoritative-sources-further-reading)
`;
                if (finalContent.includes('## 1.')) {
                    finalContent = finalContent.replace('## 1.', `${tocMarkdown}\n\n## 1.`);
                } else {
                    finalContent = `${finalContent}\n\n${tocMarkdown}`;
                }
            }

            // Inject smart contextual links to Stiknex tools without self-linking
            finalContent = injectInternalLinks(finalContent, draft.slug);

            // Bounded Continuation if below 3,000 words
            let currentWords = countArticleWords(finalContent);
            if (currentWords < 3000) {
                console.log(`[BlogEngine] Step 4 expansion required: ${currentWords} words < 3000.`);
                const continuationPrompt = `
You are completing an exhaustive 3000+ words masterclass handbook on "${draft.trendKeyword || draft.title}".
The article is currently at ${currentWords} words and needs an in-depth expansion.

GENERATE AN EXTENDED DEEP EXPANSION SECTION (Target 900 to 1200 words):
## 7.1 Advanced Field Scenarios & Diagnostic Workflows
Provide 2 concrete, in-depth technical walkthroughs with exact problem statements, step-by-step diagnostic procedures, and measurable performance outcomes.
## 7.2 Implementation Edge Cases & Resilience Protocols
Address nuanced bottlenecks, complex system constraints, and counter-intuitive remediation strategies.

RULES: Rich, highly descriptive paragraphs. DO NOT repeat existing paragraphs. Format in clean Markdown without backticks.
`;
                try {
                    const contRes = await callGeminiWithFallback(continuationPrompt, false, 2000, 12000);
                    const contText = contRes.text.replace(/^```markdown/gi, '').replace(/^```/g, '').trim();
                    if (finalContent.includes('## 8.')) {
                        finalContent = finalContent.replace('## 8.', `${contText}\n\n## 8.`);
                    } else {
                        finalContent = `${finalContent}\n\n${contText}`;
                    }
                    currentWords = countArticleWords(finalContent);
                } catch (cErr) {
                    console.warn('[BlogEngine] Step 4 expansion error:', cErr.message);
                }
            }

            // Validate entire article
            const articleData = {
                title: draft.title,
                slug: draft.slug,
                excerpt: draft.excerpt,
                metaTitle: draft.metaTitle,
                metaDescription: draft.metaDescription,
                content: finalContent
            };
            const validation = validateBlogArticle(articleData);

            const isPublished = validation.valid && validation.wordCount >= 3000;
            const validationStatus = isPublished ? 'passed' : 'failed';
            const validationError = validation.errors.join('; ');

            const updatedBlog = await Blog.findByIdAndUpdate(
                draft._id,
                {
                    content: finalContent,
                    wordCount: validation.wordCount,
                    validationStatus,
                    validationError,
                    tableOfContents: validation.tableOfContents,
                    sources: validation.sources,
                    published: isPublished,
                    publishedAt: isPublished ? (draft.publishedAt || new Date()) : undefined,
                    updatedAt: new Date()
                },
                { returnDocument: 'after' }
            );

            return res.status(isPublished ? 200 : 202).json({
                success: isPublished,
                published: updatedBlog.published,
                step: 4,
                complete: true,
                id: updatedBlog._id.toString(),
                blog: updatedBlog.slug,
                title: updatedBlog.title,
                wordCount: updatedBlog.wordCount,
                validationStatus: updatedBlog.validationStatus,
                validationError: updatedBlog.validationError,
                tableOfContentsCount: updatedBlog.tableOfContents?.length || 0,
                sourcesCount: updatedBlog.sources?.length || 0,
                message: isPublished
                    ? `Article validated and published with ${updatedBlog.wordCount} verified words!`
                    : `Article saved as draft (${updatedBlog.wordCount} words). Validation notice: ${validationError}`
            });
        }

        // -----------------------------------------------------------------
        // ALL-IN-ONE MODE (For Cron, CLI Scripts & Local Test Runs)
        // -----------------------------------------------------------------

        let keyword = (query.keyword || body.keyword || '').trim();
        let trendScore = 85;

        if (!keyword) {
            const existingBlogs = await Blog.find({}, { trendKeyword: 1, title: 1 });
            const usedKeywords = new Set(existingBlogs.map(b => (b.trendKeyword || '').toLowerCase().trim()).filter(Boolean));
            const usedTitles = new Set(existingBlogs.map(b => (b.title || '').toLowerCase().trim()).filter(Boolean));

            const topTrend = await Trend.findOne({
                status: { $ne: 'ignored' },
                keyword: { $nin: Array.from(usedKeywords) }
            }).sort({ relevanceScore: -1, trendScore: -1 });

            if (topTrend) {
                keyword = topTrend.keyword;
                trendScore = topTrend.trendScore || 90;
                topTrend.status = 'covered';
                await topTrend.save();
            } else {
                const availableEvergreens = EVERGREEN_TOPICS.filter(
                    t => !usedTitles.has(t.toLowerCase()) && !usedKeywords.has(t.toLowerCase())
                );
                keyword = availableEvergreens.length > 0 
                    ? availableEvergreens[Math.floor(Math.random() * availableEvergreens.length)]
                    : EVERGREEN_TOPICS[Math.floor(Math.random() * EVERGREEN_TOPICS.length)];
                trendScore = 80;
            }
        }

        let wikiExtract = "";
        let wikiImageUrl = "";
        try {
            const wikiRes = await fetchJson(
                `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro&piprop=original|thumbnail&pithumbsize=1200&titles=${encodeURIComponent(keyword)}&format=json`,
                { timeoutMs: 5000 }
            );
            if (wikiRes?.query?.pages) {
                const pages = wikiRes.query.pages;
                const pageId = Object.keys(pages)[0];
                if (pageId !== '-1') {
                    const pageData = pages[pageId];
                    if (pageData.extract) wikiExtract = pageData.extract.replace(/<[^>]*>?/gm, '');
                    if (pageData.original?.source) wikiImageUrl = pageData.original.source;
                    else if (pageData.thumbnail?.source) wikiImageUrl = pageData.thumbnail.source;
                }
            }
        } catch (_) {}

        const promptPart1 = `
You are a distinguished investigative author writing for "Stiknex".
Write PART 1 of an encyclopedic masterclass on: "${keyword}".
Reference: ${wikiExtract ? wikiExtract.slice(0, 1500) : 'Authoritative contemporary knowledge.'}

SECTIONS TO WRITE (Target 1100 to 1300 words):
# [Authoritative Masterclass Title]
## 1. Executive Prologue & Contemporary Relevance
Explore foundational definitions, current cultural and technological landscape, and core pain points.
## 2. Historical Genesis & Milestone Timeline
Document the evolutionary timeline, pivotal discoveries, pioneers, and paradigm shifts.
## 3. Theoretical Pillars & Cognitive Foundations
Examine the underlying mechanisms, cognitive psychology models, neuroscience principles, and theoretical frameworks.

RULES: Output STRICTLY as valid JSON with NO markdown backticks:
{
  "title": "Authoritative Masterclass Title",
  "slug": "url-friendly-slug",
  "excerpt": "Detailed 150-160 character summary...",
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "SEO description under 160 chars",
  "category": "Productivity",
  "keywords": "keyword1, keyword2, keyword3, keyword4, keyword5",
  "imagePrompt": "Cinematic visual representing ${keyword}, 8k photorealistic",
  "content": "# Title\\n\\n## 1. Executive Prologue...\\n\\n## 2. Historical Genesis...\\n\\n## 3. Theoretical Pillars..."
}
`;

        const promptPart2 = `
Write PART 2 of an authoritative masterclass on "${keyword}".
SECTIONS TO WRITE (Target 1100 to 1300 words):
## 4. Operational Frameworks & Methodological Blueprints
Deeply explain the core systems, mental models, and structured methodologies.
## 5. Step-by-Step Practical Execution Guide
Provide an actionable, step-by-step implementation blueprint that readers can execute immediately.
## 6. Comparative Tradeoff Matrix
Include a comprehensive Markdown comparison table evaluating traditional vs modern approaches, tradeoffs, and performance metrics.
## 7. In-Depth Real-World Case Studies
Deconstruct two concrete real-world case studies with background, challenges, interventions, and documented outcomes.

RULES: Rich, multi-paragraph sections. Output directly in clean Markdown without backticks.
`;

        const promptPart3 = `
Write PART 3 of an authoritative masterclass on "${keyword}".
SECTIONS TO WRITE (Target 1100 to 1300 words):
## 8. Common Traps, Subtle Misconceptions & Counter-Strategies
Analyze nuanced pitfalls, cognitive biases, and exact mitigation tactics.
## 9. Digital Workspace Systems & External Cognition Workflows
Explain how to integrate visual artifacts, digital notes, and thinking systems into daily workflows.
## 10. Frequently Asked Questions (FAQ)
Provide 4-5 thorough, multi-paragraph answers addressing the most critical reader questions.
## 11. Conclusion & Strategic Synthesis
Deliver a powerful, actionable summary synthesizing the major takeaways.
## 12. Authoritative Sources & Further Reading
List 3-5 real, verified citations in format: - [Title](https://...) (using Wikipedia, research papers, or educational resources).

RULES: Authoritative paragraphs. Output directly in clean Markdown without backticks.
`;

        console.log(`[BlogEngine] Initiating parallel generation for "${keyword}"...`);
        const startTime = Date.now();

        const p1Promise = callGeminiWithFallback(promptPart1, true, 2200, 25000);
        const p2Promise = (async () => {
            await new Promise(r => setTimeout(r, 600));
            return callGeminiWithFallback(promptPart2, false, 2200, 25000);
        })();
        const p3Promise = (async () => {
            await new Promise(r => setTimeout(r, 1200));
            return callGeminiWithFallback(promptPart3, false, 2200, 25000);
        })();

        const [p1Res, p2Res, p3Res] = await Promise.all([p1Promise, p2Promise, p3Promise]);

        console.log(`[BlogEngine] Parallel parts completed in ${((Date.now() - startTime) / 1000).toFixed(2)}s`);

        let articleData = {
            title: keyword,
            slug: keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            excerpt: `Comprehensive masterclass and actionable strategies on ${keyword}.`,
            metaTitle: `${keyword} Masterclass | Stiknex`,
            metaDescription: `Comprehensive guide, practical frameworks, and strategies for ${keyword}.`,
            category: "Productivity",
            keywords: `${keyword}, productivity, tools, stiknex`,
            content: p1Res.text
        };

        try {
            const parsed = JSON.parse(p1Res.text);
            Object.assign(articleData, parsed);
        } catch (_) {
            const titleMatch = p1Res.text.match(/^#\s+(.+)$/m);
            if (titleMatch) articleData.title = titleMatch[1].replace(/[*_#]/g, '').trim();
            const jsonMatch = p1Res.text.match(/\{[\s\S]*"title"[\s\S]*\}/);
            if (jsonMatch) {
                try { Object.assign(articleData, JSON.parse(jsonMatch[0])); } catch (__) {}
            }
        }

        let p1Content = articleData.content;
        if (!p1Content.startsWith('# ')) {
            p1Content = `# ${articleData.title}\n\n${p1Content}`;
        }
        const p2Content = p2Res.text.replace(/^```markdown/gi, '').replace(/^```/g, '').trim();
        const p3Content = p3Res.text.replace(/^```markdown/gi, '').replace(/^```/g, '').trim();

        const tocMarkdown = `
## Table of Contents
- [1. Executive Prologue & Contemporary Relevance](#executive-prologue-contemporary-relevance)
- [2. Historical Genesis & Milestone Timeline](#historical-genesis-milestone-timeline)
- [3. Theoretical Pillars & Cognitive Foundations](#theoretical-pillars-cognitive-foundations)
- [4. Operational Frameworks & Methodological Blueprints](#operational-frameworks-methodological-blueprints)
- [5. Step-by-Step Practical Execution Guide](#step-by-step-practical-execution-guide)
- [6. Comparative Tradeoff Matrix](#comparative-tradeoff-matrix)
- [7. In-Depth Real-World Case Studies](#in-depth-real-world-case-studies)
- [8. Common Traps, Subtle Misconceptions & Counter-Strategies](#common-traps-subtle-misconceptions-counter-strategies)
- [9. Digital Workspace Systems & External Cognition Workflows](#digital-workspace-systems-external-cognition-workflows)
- [10. Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
- [11. Conclusion & Strategic Synthesis](#conclusion-strategic-synthesis)
- [12. Authoritative Sources & Further Reading](#authoritative-sources-further-reading)
`;

        const cleanSlug = (articleData.slug || keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');
        let combinedContent = `${p1Content}\n\n${tocMarkdown}\n\n${p2Content}\n\n${p3Content}`;
        combinedContent = injectInternalLinks(combinedContent, cleanSlug);

        // Bounded Continuation if below 3,000 words (guarded by 11s execution budget)
        let currentWords = countArticleWords(combinedContent);
        let continuationAttempts = 0;
        const MAX_CONTINUATIONS = 2;

        while (currentWords < 3000 && continuationAttempts < MAX_CONTINUATIONS && (Date.now() - startTime) < 11000) {
            continuationAttempts++;
            console.log(`[BlogEngine] Article at ${currentWords} words (< 3000). Triggering continuation attempt ${continuationAttempts}...`);

            const continuationPrompt = `
You are continuing an exhaustive 3000+ words masterclass on "${keyword}".
The current article is at ${currentWords} words.

GENERATE AN EXTENDED DEEP EXPANSION SECTION (Target 900 to 1200 words):
## 7.1 Advanced Field Scenarios & Diagnostic Workflows
Provide 2 concrete, in-depth technical walkthroughs with exact problem statements, step-by-step diagnostic procedures, and measurable performance outcomes.
## 7.2 Implementation Edge Cases & Resilience Protocols
Address nuanced bottlenecks, complex system constraints, and counter-intuitive remediation strategies.

RULES: Rich, highly descriptive paragraphs. DO NOT repeat existing paragraphs. Format in clean Markdown without backticks.
`;
            try {
                const continuationRes = await callGeminiWithFallback(continuationPrompt, false, 2000, 15000);
                const contText = continuationRes.text.replace(/^```markdown/gi, '').replace(/^```/g, '').trim();

                if (combinedContent.includes('## 8.')) {
                    combinedContent = combinedContent.replace('## 8.', `${contText}\n\n## 8.`);
                } else {
                    combinedContent = `${combinedContent}\n\n${contText}`;
                }
                currentWords = countArticleWords(combinedContent);
                console.log(`[BlogEngine] Continuation ${continuationAttempts} merged. New word count: ${currentWords}`);
            } catch (cErr) {
                console.warn(`[BlogEngine] Continuation attempt ${continuationAttempts} failed:`, cErr.message);
                break;
            }
        }

        let finalImageUrl = wikiImageUrl;
        if (!finalImageUrl || finalImageUrl.includes('.svg')) {
            const cleanPrompt = (articleData.imagePrompt || `${keyword} conceptual creative scene modern illustration`).replace(/["'\n\r]/g, ' ').slice(0, 180);
            const seed = Math.floor(Math.random() * 90000) + 10000;
            finalImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1200&height=630&nologo=true&model=flux&seed=${seed}`;
        }

        articleData.content = combinedContent;
        const validation = validateBlogArticle(articleData);

        const isPublished = validation.valid && validation.wordCount >= 3000;
        const validationStatus = isPublished ? 'passed' : 'failed';
        const validationError = validation.errors.join('; ');

        // Prevent overwriting existing published articles
        let targetSlug = cleanSlug;
        const existingPublished = await Blog.findOne({ slug: cleanSlug, published: true });
        if (existingPublished) {
            targetSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
        }

        const savedBlog = await Blog.findOneAndUpdate(
            { slug: targetSlug },
            {
                title: articleData.title,
                slug: cleanSlug,
                excerpt: articleData.excerpt,
                content: combinedContent,
                metaTitle: articleData.metaTitle || articleData.title,
                metaDescription: articleData.metaDescription || articleData.excerpt,
                category: articleData.category || "Productivity",
                keywords: articleData.keywords || `${keyword}, productivity, stiknex`,
                trendKeyword: keyword,
                trendScore: trendScore,
                sourceResearch: wikiExtract ? "Wikipedia + Gemini Analysis" : "Gemini Research",
                imageUrl: finalImageUrl,
                imageAlt: articleData.title,
                imageSource: wikiImageUrl ? "Wikimedia Commons" : "Pollinations AI (Flux)",
                wordCount: validation.wordCount,
                validationStatus,
                validationError,
                tableOfContents: validation.tableOfContents,
                sources: validation.sources,
                published: isPublished,
                publishedAt: isPublished ? new Date() : undefined,
                updatedAt: new Date()
            },
            { upsert: true, returnDocument: 'after' }
        );

        const verifiedDoc = await Blog.findById(savedBlog._id).lean();
        if (!verifiedDoc) {
            throw new Error(`Failed to verify persisted blog in MongoDB with ID ${savedBlog._id}`);
        }

        return res.status(isPublished ? 200 : 202).json({
            success: isPublished,
            published: verifiedDoc.published,
            validationStatus: verifiedDoc.validationStatus,
            validationError: verifiedDoc.validationError,
            id: verifiedDoc._id.toString(),
            blog: verifiedDoc.slug,
            title: verifiedDoc.title,
            wordCount: verifiedDoc.wordCount,
            tableOfContentsCount: verifiedDoc.tableOfContents?.length || 0,
            sourcesCount: verifiedDoc.sources?.length || 0,
            imageUrl: finalImageUrl,
            message: isPublished
                ? `Article successfully generated and published with ${verifiedDoc.wordCount} verified words!`
                : `Article saved as draft (${verifiedDoc.wordCount} words). Validation failed: ${validationError}`
        });

    } catch (error) {
        console.error('Generate Blog Error:', error);
        return res.status(500).json({ error: error.message || 'Failed to generate blog.' });
    }
}
