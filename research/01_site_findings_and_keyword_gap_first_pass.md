# Stiknex: verified site findings and keyword gap (first pass)

Evidence labels: **[Verified]** = fetched live on 2026-11-03; **[Sitemap]** = listed in sitemap.xml only; **[CSV]** = from your keyword files; **[Inference]** = my reading, needs confirmation.

## 1. What was verified
Pages fetched: `/` , `/tools`, `/online-notebook`, `/json-formatter`, `/data-converter`, `/dataconverter`, `/blog`, plus `/sitemap.xml`.

- [Verified] sitemap.xml lists **212 URLs** (no duplicates). About 190 are tool pages, 3 are core apps (sticky notes, online notebook, whiteboard), plus /tools, /blog, /about, /buy-me-a-coffee and the homepage.
- [Verified] Each fetched page has its own title, meta description, canonical, OG and Twitter tags, a breadcrumb, and an H1 with one intro sentence.
- [Verified] Static HTML for every fetched page also contains the same 26-link "Stiknex Online Tools Directory". Tool interfaces are not in the fetched HTML, so they are probably rendered by JavaScript [Inference].
- [Verified] Author/creator meta is "Vishal Mall"; Google AdSense account tag and Search Console verification tag are present on every page.
- [Verified] The `/online-notebook` description mentions a rich-text editor with local auto-save and no account. The fallback homepage description mentions an Excalidraw-based whiteboard and infinite sticky-note boards.

## 2. Issues found (ordered by severity)

### P0 - verified bug: broken navigation link
- The site-wide directory links "Data Storage Converter" to `/dataconverter`.
- `/dataconverter` returns homepage content with the **homepage canonical**, and its OG URL points at itself. It does not return a 404.
- The real page is `/data-converter` (listed in the sitemap, fetched OK).
- Effect: the nav link sends users and crawlers to a duplicate of the homepage instead of the tool. Fix the link, and make unknown paths return a real 404 or redirect.
- Related: unknown paths appear to fall back to a homepage-like page. Test a made-up URL to confirm whether soft-404s exist.

### P0 - ~186 of 212 sitemap URLs are not linked from the static directory
- The directory on `/`, `/tools`, `/online-notebook`, `/json-formatter` and `/blog` links only 26 URLs.
- `/tools` says "18+ free online tools" while the sitemap lists about 190 tool URLs. The copy is out of date and contradicts the sitemap.
- If the JavaScript UI does not link the rest either, those pages are orphans reachable only via the sitemap. Check with a rendered crawl before concluding [Inference].

### P1 - thin static content
- Fetched pages show an H1 and one sentence in raw HTML. No how-to, FAQ, use cases, or privacy explanation is visible to a non-rendering crawler.
- Mass production of near-identical utility pages is a thin-content and doorway risk if the pages add little beyond the tool.

### P1 - sitemap hygiene
- Every `lastmod` is 2026-11-03 (today). That suggests it is stamped at build time, not when each page changed. Google says it uses lastmod only when it is consistently accurate. `changefreq` and `priority` are ignored by Google.

### P1 - repeated site-wide boilerplate
- The 26-link directory and tagline are identical on every page, so most of the visible text on the fetched pages is shared.

### P2 - blog
- `/blog` shows an H1 and intro, but **no article links** in static HTML, and the sitemap contains **no post URLs**. Either the blog has no posts or they are not crawlable/listed.

### P2 - trust pages
- Sitemap has `/about` but no privacy policy, terms or contact page. Several tools handle user files or text (PDF, image, JSON, password), and the site runs AdSense, so a privacy page matters for users, ad policy and AI-citation trust. Check that these exist at other URLs.

### Not yet checked
robots.txt, structured data (JSON-LD), Core Web Vitals, redirect behaviour, mobile rendering, whether each tool actually works, and 200+ individual page titles. I could only fetch URLs that appeared in the sitemap or fetched pages, and I can't run a browser here.

## 3. Keyword gap: CSV seeds vs real URLs
| CSV seed | Existing URL [Sitemap] | Status |
|---|---|---|
| online notepad | /online-notebook (title says "Notebook & Digital Notepad") | Exists. Optimise, do not create a second page |
| sticky notes | /sticky-notes | Exists |
| online whiteboard | /whiteboard | Exists (Excalidraw-based per meta; verify) |
| typing | /typing-speed-test, /typing-lab, /typing-practice-lessons, /typing-accuracy-test (+6) | Exists, but 4+ pages share one intent: cannibalisation risk |
| calculator | 38 calculator pages, incl. simple + basic duplicates | Exists |
| convertor | currency + 10 unit converters + many format converters | Exists. Note CSV spelling "convertor" vs site "converter": small variant, one page |
| free online tools | /tools | Exists, copy outdated |
| blog | /blog | Index only |
| **mind map** | none | **Gap**: new tool or reject if out of scope |
| **diagram maker** | none | **Gap**: largest relevant CSV cluster (~450 candidates), needs real functionality |
| **brainstorming** | none | **Gap**: informational cluster (what is / techniques / vs mind mapping) fits a guide, plus a tool link |

## 4. Cannibalisation candidates (see `06_...inventory` column `possible_overlap_group`)
84 URLs sit in 19 overlap groups. Highest risk: simple vs basic calculator; typing test/lab/accuracy/practice; date-calculator vs date-difference vs business-days; word-counter vs word-counter-for-documents vs character-counter; stopwatch vs stopwatch-with-laps; aspect-ratio vs video-aspect-ratio. Decide per group: merge, redirect, or differentiate intent. Do not delete without checking Search Console data.

## 5. Open questions
1. Do `/typing-lab`, `/typing-speed-test` etc. each contain a distinct tool?
2. Is the blog empty?
3. Which markets matter (country/language)? Typing and converter CSVs include many Hindi, Nepali and other-language terms.
4. Do you have Search Console access to share impressions/clicks per URL? That would replace the missing keyword metrics.
