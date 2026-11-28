# SEO, AEO, GEO and Entity strategy for Stiknex

Labels: [V] verified on Stiknex or a competitor this session | [K] general knowledge of search-engine guidance, not re-verified here | [O] my recommendation.
No ranking, traffic, or citation outcome is promised anywhere in this document.

## 1. Strategic position
Stiknex has ~190 tool URLs with thin static content [V] and 10 indexed pages [user]. The constraint is not the number of pages but **how many pages earn crawling and indexing**. Strategy: **fewer, better, well-linked pages first**, in this order: core notes suite → typing → text tools → high-intent calculators/converters → developer utilities.

## 2. SEO

### 2.1 Technical SEO (details and tests are in `antigravity_implementation_master_plan.md`)
- Make every indexable page reachable by plain crawlable `<a href>` links within 2 to 3 clicks of the homepage, through category hubs [O]. Today only 26 are linked in static HTML [V].
- Put the answer text in server-rendered or prerendered HTML so non-rendering crawlers see it [O]. Google does render JavaScript, but delayed rendering plus thin first-pass content is a risk; other crawlers and AI fetchers may not render [K].
- Fix `/dataconverter` link; return real 404s for unknown paths [V bug, 404 behaviour unverified].
- Sitemap: list only canonical, indexable, 200 URLs; give `lastmod` real per-page modification dates, or omit it [K: Google uses lastmod only when consistently accurate].
- Remove redirecting URLs from the sitemap.

### 2.2 On-page
- **Title pattern:** `<Primary keyword> – <differentiator> | Stiknex`, under ~60 characters where possible. Fetched titles already follow `<Name> – Free Online Utility | Stiknex` [V]; differentiate beyond "Free Online Utility".
- **H1:** match the primary intent; one H1 per page [V present].
- **Above the fold:** the working tool. Below it: a 2 to 3 sentence answer-first intro, how-to steps, 2 to 4 real use cases, formulas/rules where they apply, privacy statement, related tools, and 3 to 6 useful FAQs.
- **Meta descriptions:** unique, benefit-led (fetched ones are already unique per page [V]).
- **Duplicate boilerplate:** the identical 26-link directory on every page should be shortened or replaced with contextual related-tool links [O].

### 2.3 Topical authority
Build clusters, not isolated pages:
1. **Notes & capture:** sticky-notes, online-notebook, to-do-list, checklist-maker, daily-journal, meeting-notes-template, + blog.
2. **Typing:** typing-speed-test (primary), practice-lessons, accuracy, games + blog.
3. **Writing & text:** word/character counters, reading-time, readability, case-converter, text-diff.
4. **Calculators:** hub with child pages grouped by finance, date/time, math.
5. **Converters:** unit-converter hub → spokes.
6. **Developer utilities:** formatters, encoders, hashing.
7. **Visual thinking (new):** whiteboard + mind map + diagram + brainstorming (see `tool_growth_specifications.md`).
Each hub page links to its spokes; spokes link back and to 2 to 3 siblings.

### 2.4 Keyword mapping
See `final_keyword_mapping.csv` (actual sitemap URLs) and `url_consolidation_plan.csv`. **One intent, one URL.**

### 2.5 Content quality
- Original value per page: formulas explained, worked examples, edge cases, limits of the tool, privacy behaviour. TypeLynx [V] is a reference for depth.
- Avoid: mass-generated FAQs, near-identical pages, programmatic size variants without real function.

### 2.6 Backlinks (legitimate only)
- Create linkable assets: a "How Stiknex handles your data" page (local-first claims must be verified first), a typing-speed methodology page with formulas, printable/downloadable templates (meeting notes, habit tracker, decision matrix).
- Submit to **relevant** tool directories and "alternative to" lists (e.g., for online notepad) one at a time and only if Stiknex genuinely fits.
- Outreach to educator resource lists (whiteboard, typing, calculators) and developer newsletters (JSON/regex/JWT tools) with a short, specific message.
- Do not buy links, use PBNs, comment spam, or mass-submit.
- Backlink counts for competitors were not available, so there are no link targets by number. Measure your own referring domains in GSC Links.

### 2.7 Image and video SEO
- **Images:** descriptive file names and alt text for screenshots of the actual tool UI; compress; specify width/height; lazy-load below the fold. Current OG image is a single 512×512 PNG shared across pages [V]; use 1200×630 per-hub OG images.
- **Video:** short (30 to 90 s) screen recordings per core tool (sticky notes, notebook, typing test, whiteboard) hosted on YouTube and embedded, with transcript text on the page. `VideoObject` schema only where a video is genuinely on the page [K].
- Screenshots and short demos help humans and sometimes image/video results; no promise of ranking.

## 3. AEO (answer engine optimisation)
**Principle:** every page should answer the question a person would actually ask, in the first screen, in plain language.

### 3.1 Question targets from CSVs (examples actually present in your files)
- Notes: "sticky notes vs notepad windows 11", "what is sticky notes windows 11", "how does sticky notes work", "sticky notes backup location windows 11", "sticky notes disappeared".
- Brainstorming/mind map: "what is reverse brainstorming", "difference between brainstorming and mind mapping", "mindmap vs concept map", "is it mindmap or mind map".
- Typing: "average typing speed", "how to master typing", "typing for beginners", "40 wpm typing speed".
- Blog: "blog vs vlog meaning", "blog post examples".
- Whiteboard: "what is online whiteboard", "how to use online whiteboard in google meet".
Not all deserve a page. Check the intent: Windows-specific troubleshooting ("sticky notes disappeared") is about Microsoft's app; answer it only in a clearly relevant article that offers Stiknex as an alternative, not as a tool page.

### 3.2 Page patterns
- **Definition block** (30 to 50 words), then **steps** (numbered), then **comparison table** (for "X vs Y" pages), then **limits/caveats**.
- **"Is it free / no sign-up / is it safe" answers** should be true statements about Stiknex's actual behaviour. Verify before writing (e.g., local storage vs server storage).
- FAQs: only questions people genuinely ask, 3 to 6 per page, with different answers per page. Do not repeat the same FAQ block everywhere (TypeLynx's repetition is a weakness [O]).

### 3.3 Structured data (use only what truthfully describes the page)
- `WebSite` + `Organization` on the home page; `BreadcrumbList` on all pages (breadcrumbs already visible [V]).
- `WebApplication` / `SoftwareApplication` on tool pages **only** when the page really is a working app and the properties are true (free price, category). Google's software-app rich result has requirements (e.g., ratings); don't invent ratings [K].
- `FAQPage` and `HowTo`: Google restricted FAQ rich results to a narrow set of sites and removed HowTo rich results in 2023 [K, re-verify]. They don't hurt if accurate, but don't expect a SERP feature. Treat as optional.
- Validate with Google's Rich Results Test and Schema.org validator.
- I did **not** inspect Stiknex's current JSON-LD (not visible in fetched output), so I can't say what exists.

## 4. GEO (generative engine optimisation)
**What is known [K]:** Google states that AI Overviews/AI Mode use the same indexing and quality systems, with no special markup required. Other AI search systems retrieve from their own indexes or from Bing/other partners; behaviours change. Nobody can guarantee a citation.

### 4.1 What to do (all are good SEO and user practice too)
1. **Be indexable and fetchable:** server-rendered text, no blocked CSS/JS, correct robots rules. Check you aren't blocking AI crawlers by accident, and decide deliberately which crawlers to allow (Googlebot, Bingbot, OAI-SearchBot, PerplexityBot, etc. [K, verify current names in each vendor's docs]).
2. **Be quotable:** short self-contained definitions, explicit numbers, formulas, tables, dates.
3. **Be distinct:** original facts others lack, for example: how each tool calculates (typing WPM formula as TypeLynx does [V]), supported units and rounding, privacy model, limits, keyboard shortcuts, template downloads.
4. **Be consistent:** one brand name, same description everywhere (Stiknex = free online sticky notes, notebook and productivity tools), same author/organisation.
5. **Be corroborated:** listings and mentions on independent sites (Product Hunt, AlternativeTo, GitHub if open-sourced, educator lists) so the entity exists beyond your own domain.
6. **Be fresh where facts change:** finance rates/rules pages show an "as of" date and source.
7. **Comparison pages:** "Stiknex vs Windows Sticky Notes", "Stiknex vs Google Keep"-style pages that are honest, including where competitors are better. 10.tools does this at the bottom of the funnel [V].

### 4.2 Per engine
| Engine | Practical guidance |
|---|---|
| Google AI Overviews / AI Mode | Standard Search eligibility; strong, indexed, helpful pages. No special tags. |
| Gemini | Draws on Google's index and other sources; same basics. |
| ChatGPT Search | Pulls web results via partners/own crawler; make pages fetchable and allow its search crawler if you want inclusion [K, verify]. |
| Perplexity | Cites live sources; clear, citable text and factual pages help. |
| Bing Copilot | Uses Bing's index; register Bing Webmaster Tools, submit sitemap, consider IndexNow [K]. |
| Others | Unknown; same fundamentals. |
### 4.3 What not to do
- No claim that `llms.txt`, AI-specific meta tags or schema guarantee citations. An `llms.txt` file is optional and harmless but has no confirmed ranking or citation effect [K].
- No hidden text, prompt-injection text, or fake "AI-friendly" boilerplate.
- No keyword stuffing for "AI search".

### 4.4 Measurement
- GA4: filter referrals from chatgpt.com, perplexity.ai, copilot.microsoft.com, gemini.google.com (names may change); counts will be small and incomplete.
- Manual query set: every month, run 20 target questions in each engine and record whether Stiknex is cited. Log as observation, not as a KPI target.

## 5. Entity SEO and brand authority
**Verified now [V]:** consistent site name "Stiknex"; author/creator meta "Vishal Mall"; publisher "Stiknex"; AdSense and Search Console tags; sitemap has `/about` but no privacy/terms/contact.
**Recommendations [O]:**
1. Create **Privacy Policy, Terms, Contact** pages (competitors all have them [V]); link in the footer.
2. **About page:** who is behind Stiknex, why built, what the tools do and don't do, contact email, last updated date. A named person or entity is a trust signal; only include what is true.
3. **Organization** schema with name, URL, logo, `sameAs` links to real profiles (GitHub, LinkedIn, X, Product Hunt). Only list profiles that exist.
4. **Person** schema for the author on blog posts only if an author page exists.
5. **Brand search consistency:** same name, tagline and logo across profiles.
6. **Trust documentation:** a plain-language "Your data" page: what stays in the browser (e.g., notes in local storage), what is sent to servers (e.g., currency rates), what ads/analytics run. **Verify each claim technically before publishing**, particularly for tools handling files, passwords and text.
7. **Brand mentions:** earn them through Product Hunt launch, directory listings, educator mentions; track brand-name queries in GSC.
