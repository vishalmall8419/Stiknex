import { seoConfig } from './seoConfig.js';

/**
 * Normalizes article body content by stripping HTML, Markdown formatting,
 * code blocks, image markup, and link URLs so only genuine readable body text is counted.
 */
export function normalizeArticleBody(content) {
    if (!content || typeof content !== 'string') return '';

    let clean = content;
    // Strip fenced code blocks
    clean = clean.replace(/```[\s\S]*?```/g, ' ');
    // Strip inline code
    clean = clean.replace(/`[^`]*`/g, ' ');
    // Strip HTML tags
    clean = clean.replace(/<[^>]*>/g, ' ');
    // Strip Markdown images: ![alt](url)
    clean = clean.replace(/!\[.*?\]\(.*?\)/g, ' ');
    // Replace Markdown links [anchor text](url) with just the anchor text
    clean = clean.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    // Strip Markdown table structure (e.g. |---|---|)
    clean = clean.replace(/\|[-:\s|]+\|/g, ' ');
    clean = clean.replace(/\|/g, ' ');
    // Strip Markdown heading prefixes (e.g. #, ##, ###)
    clean = clean.replace(/^#{1,6}\s+/gm, ' ');
    // Strip blockquote markers and list markers
    clean = clean.replace(/^[>*\-+]\s+/gm, ' ');
    clean = clean.replace(/^\d+\.\s+/gm, ' ');
    // Strip emphasis and formatting symbols (*, _, ~, =)
    clean = clean.replace(/[*_~=]/g, ' ');
    // Strip horizontal rules
    clean = clean.replace(/^[-*_]{3,}\s*$/gm, ' ');
    // Collapse excess whitespace
    clean = clean.replace(/\s+/g, ' ').trim();

    return clean;
}

/**
 * Standardized, authoritative word-count function for Stiknex.
 * Counts readable alphanumeric words from normalized body text.
 */
export function countArticleWords(content) {
    const normalized = normalizeArticleBody(content);
    if (!normalized) return 0;

    const tokens = normalized.split(/\s+/).filter(token => {
        // Must contain at least one alphanumeric character
        return token.length > 0 && /[a-zA-Z0-9]/.test(token);
    });

    return tokens.length;
}

/**
 * Creates a clean URL-friendly anchor ID for headings.
 */
export function slugifyHeading(text) {
    if (!text || typeof text !== 'string') return '';
    return text
        .toLowerCase()
        .replace(/^[\d.]+\s*/, '') // Remove leading numbers like "1. " or "2.1 "
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Extracts H2 and H3 headings and builds Table of Contents entries.
 */
export function extractTableOfContents(content) {
    if (!content || typeof content !== 'string') return [];

    const lines = content.split('\n');
    const toc = [];
    const seenIds = new Set();

    for (const line of lines) {
        const trimmed = line.trim();
        const isH2 = /^##\s+(?!#)(.+)$/.test(trimmed);
        const isH3 = /^###\s+(?!#)(.+)$/.test(trimmed);

        if (isH2 || isH3) {
            const rawTitle = trimmed.replace(/^#{2,3}\s+/, '').trim();
            // Skip the TOC's own heading if present
            if (/^table of contents/i.test(rawTitle)) continue;

            let id = slugifyHeading(rawTitle);
            if (!id) id = `section-${toc.length + 1}`;

            // Ensure unique anchor IDs
            let uniqueId = id;
            let counter = 1;
            while (seenIds.has(uniqueId)) {
                uniqueId = `${id}-${counter}`;
                counter++;
            }
            seenIds.add(uniqueId);

            toc.push({
                title: rawTitle,
                id: uniqueId,
                level: isH2 ? 2 : 3
            });
        }
    }

    return toc;
}

/**
 * Detects whether any substantial paragraph (>= 15 words) is repeated.
 */
export function detectDuplicateParagraphs(content) {
    if (!content || typeof content !== 'string') return { hasDuplicates: false };

    const paragraphs = content.split(/\n\s*\n/).map(p => normalizeArticleBody(p));
    const seen = new Map();

    for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i];
        const words = p.split(/\s+/).filter(Boolean);
        if (words.length < 15) continue; // Skip short lines like headings or captions

        // Check fingerprint
        const fingerprint = p.toLowerCase().slice(0, 200);
        if (seen.has(fingerprint)) {
            return {
                hasDuplicates: true,
                duplicateText: p.slice(0, 100) + '...',
                firstIndex: seen.get(fingerprint),
                secondIndex: i
            };
        }
        seen.set(fingerprint, i);
    }

    return { hasDuplicates: false };
}

/**
 * Extracts external sources cited in the markdown.
 */
export function extractSources(content) {
    if (!content || typeof content !== 'string') return [];

    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    const sources = [];
    const seen = new Set();
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
        const title = match[1].trim();
        const url = match[2].trim();

        // Skip internal Stiknex links
        if (url.includes('stiknex.site') || url.startsWith('/')) continue;

        if (!seen.has(url)) {
            seen.add(url);
            sources.push({ title, url });
        }
    }

    return sources;
}

/**
 * Validates internal links against actual routes in Stiknex.
 */
export function validateInternalLinks(content, customValidRoutes = null) {
    if (!content || typeof content !== 'string') return { valid: true, internalLinks: [], invalidLinks: [] };

    const validRoutes = customValidRoutes || Object.keys(seoConfig);
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const internalLinks = [];
    const invalidLinks = [];
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
        const anchor = match[1].trim();
        let target = match[2].trim();

        // Check if internal link
        const isInternal = target.startsWith('/') || target.includes('stiknex.site');
        if (!isInternal) continue;

        // Normalize URL to path
        let path = target;
        try {
            if (path.startsWith('http')) {
                const parsed = new URL(path);
                path = parsed.pathname;
            }
        } catch {
            // Keep path as is
        }

        // Clean trailing slash (except for root)
        if (path.length > 1 && path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        // Remove in-page hash from comparison
        const basePath = path.split('#')[0] || '/';

        // Check against valid routes or dynamic blog routes (/blog or /blog/...)
        const isValid = validRoutes.includes(basePath) || basePath.startsWith('/blog');

        const record = { anchor, target, path: basePath, valid: isValid };
        internalLinks.push(record);
        if (!isValid) invalidLinks.push(record);
    }

    return {
        valid: invalidLinks.length === 0,
        internalLinks,
        invalidLinks
    };
}

/**
 * Validates external sources to ensure no placeholder or malformed URLs.
 */
export function validateExternalLinks(content) {
    const sources = extractSources(content);
    const invalidSources = [];
    const DISALLOWED_HOSTS = ['example.com', 'test.com', 'domain.com', 'sample.com', 'url.com', 'localhost'];

    for (const src of sources) {
        try {
            const parsed = new URL(src.url);
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                invalidSources.push({ ...src, reason: 'Invalid protocol' });
                continue;
            }
            if (DISALLOWED_HOSTS.some(h => parsed.hostname.includes(h))) {
                invalidSources.push({ ...src, reason: 'Placeholder hostname not permitted' });
            }
        } catch {
            invalidSources.push({ ...src, reason: 'Malformed URL' });
        }
    }

    return {
        valid: invalidSources.length === 0,
        sources,
        invalidSources
    };
}

/**
 * Comprehensive Quality Gate & Validation for Stiknex Blog Articles.
 * Enforces the strict 3,000 verified word count minimum and architectural integrity.
 */
export function validateBlogArticle(articleData) {
    const errors = [];
    const content = articleData.content || '';

    // 1. Minimum Word Count Validation (Strict 3,000 words on normalized body)
    const wordCount = countArticleWords(content);
    if (wordCount < 3000) {
        errors.push(`Article body contains ${wordCount} words, which fails the strict minimum required threshold of 3,000 verified words.`);
    }

    // 2. Title & Metadata
    if (!articleData.title || articleData.title.trim().length < 15) {
        errors.push('Article title is missing or under 15 characters.');
    }
    if (!articleData.slug || articleData.slug.trim().length < 3) {
        errors.push('Article slug is missing or invalid.');
    }
    if (!articleData.excerpt || articleData.excerpt.trim().length < 50) {
        errors.push('Article excerpt is missing or under 50 characters.');
    }

    // 3. Heading Hierarchy & Structural Completeness
    const h2Count = (content.match(/^##\s+.+$/gm) || []).length;
    const h3Count = (content.match(/^###\s+.+$/gm) || []).length;

    if (h2Count < 4) {
        errors.push(`Article contains only ${h2Count} H2 sections. A comprehensive long-form article requires at least 4 distinct H2 sections.`);
    }
    if (h3Count < 2) {
        errors.push(`Article contains only ${h3Count} H3 subsections. At least 2 H3 subsections are required for hierarchical depth.`);
    }

    // 4. Placeholder & Truncation Checks
    const placeholderRegex = /\b(TODO|FIXME|LOREM IPSUM|\[INSERT\s+|\[TBD\]|\[PLACEHOLDER\])\b/i;
    if (placeholderRegex.test(content)) {
        errors.push('Article contains placeholder or incomplete draft markers.');
    }

    // 5. Duplicate Paragraph Inflation Check
    const dupCheck = detectDuplicateParagraphs(content);
    if (dupCheck.hasDuplicates) {
        errors.push(`Article contains duplicate paragraph used to artificially inflate length: "${dupCheck.duplicateText}"`);
    }

    // 6. Internal Link Validation
    const internalCheck = validateInternalLinks(content);
    if (!internalCheck.valid) {
        const brokenList = internalCheck.invalidLinks.map(l => l.target).join(', ');
        errors.push(`Article contains invalid internal Stiknex link destination(s): ${brokenList}`);
    }

    // 7. External Link Validation
    const externalCheck = validateExternalLinks(content);
    if (!externalCheck.valid) {
        const brokenExt = externalCheck.invalidSources.map(s => `${s.url} (${s.reason})`).join(', ');
        errors.push(`Article contains invalid external reference link(s): ${brokenExt}`);
    }

    // 8. Table of Contents Extraction & Anchor Verification
    const tableOfContents = extractTableOfContents(content);
    if (tableOfContents.length < 3) {
        errors.push(`Table of Contents only found ${tableOfContents.length} headings. At least 3 structured sections are required.`);
    }

    return {
        valid: errors.length === 0,
        wordCount,
        errors,
        tableOfContents,
        sources: externalCheck.sources,
        internalLinksCount: internalCheck.internalLinks.length
    };
}

