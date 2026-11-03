# Antigravity implementation master plan (research output only; no code written)

**How to use:** Work in priority order. Every task has a verification step: **do not change behaviour until the root cause is confirmed.** Items marked **[HUMAN]** need your approval.
**Evidence:** [V] verified this session; [U] from your Search Console summary; [H] hypothesis to test.
**Limits:** the Search Console screenshots did not reach me; the URL lists of the 21/1/5 statuses are unknown. Tool functionality was not tested.

## Known facts
- Sitemap `https://stiknex.site/sitemap.xml` lists 212 URLs; `lastmod` identical (2026-11-03) for all [V].
- GSC: 10 indexed, 27 not indexed (21 discovered, 1 crawled, 5 redirected, 0 alternate) [U].
- Static HTML of fetched pages: head metadata, breadcrumb, H1, one-sentence intro, and an identical 26-link directory [V]. Interfaces appear JS-rendered [H].
- `/dataconverter` (linked in nav) returns homepage content with homepage canonical; real page is `/data-converter` [V].
- `/tools` says "18+ tools", links 22 [V]. `/blog` shows no article links; sitemap has no posts [V].
- No privacy/terms/contact URLs in sitemap [V].

# P0: Indexing and critical technical issues (days 1 to 7)
| # | URL / module | Problem | Root cause (confirm first) | Recommended change | Expected outcome | Depends on | Test / acceptance criteria | Human approval |
|---|---|---|---|---|---|---|---|---|
| P0-1 | Site-wide nav, `/dataconverter` | Nav link goes to a URL that serves homepage content | Wrong slug in nav config [V] | Change link to `/data-converter`; make `/dataconverter` 301 → `/data-converter` or return 404 | Users/crawlers reach the real tool | none | `curl -I` shows 301/404; nav link target returns 200 with canonical = itself | No |
| P0-2 | Router/server 404 handling | Unknown paths may return homepage-like content with 200 | SPA fallback [H] | Return HTTP 404 with a proper 404 page for unknown paths | Avoids soft-404s | P0-1 | `/zzz-test-404` returns status 404 | No |
| P0-3 | GSC export | 21/1/5 URLs unknown | missing data | Export the three lists; map to `url_consolidation_plan.csv` tiers | Targeted fixes | [HUMAN] export | CSVs received | **Yes: provide exports** |
| P0-4 | Redirected URLs (5) | Redirecting URLs present in GSC (maybe in sitemap) | unknown | List source→destination; remove redirecting URLs from sitemap; update internal links to final URLs | Cleaner crawl signals | P0-3 | No sitemap URL returns 3xx; no internal link points at a redirecting URL | No |
| P0-5 | Internal links on all pages | Only 26 of 212 URLs linked in static HTML | Directory block is a fixed 26-link list [V] | Build crawlable `<a href>` links: homepage → category hubs → every tool; keep within 3 clicks | Orphan pages become discoverable | P1-1 (hubs) | Crawl with JS disabled: every Tier 1/2 URL is reachable ≤3 clicks; inlinks ≥ 3 per tool | No |
| P0-6 | Tool pages (sample first 20) | Little text in raw HTML | JS rendering [H] | Compare raw vs rendered HTML; server-render/prerender titles, intro, how-to, FAQ | Crawlers see content without JS | Framework capability review | Raw HTML contains H1, intro, how-to, FAQ text; Rich Results/URL Inspection "rendered HTML" matches | **Yes (architecture change)** |
| P0-7 | Sitemap generator | Identical lastmod; includes Tier 3 and overlap duplicates | Build-time stamping [H] | Per-page real lastmod (or omit); include only canonical 200 indexable URLs; temporarily hold Tier 3 and consolidation candidates | Cleaner sitemap | `url_consolidation_plan.csv` decisions | Sitemap URLs all 200, canonical=self, indexable; lastmod changes only when page content changes | **Yes (which URLs to hold)** |
| P0-8 | `robots.txt` | Not inspected | n/a | Verify it references the sitemap and doesn't block CSS/JS or intended crawlers | Safe crawling | none | File fetched; no unintended Disallow; Sitemap line present | No |
| P0-9 | Trust pages | No privacy/terms/contact URLs | missing | Create Privacy, Terms, Contact; link in footer; add to sitemap | Trust/AdSense hygiene | Verified data-handling facts | Pages return 200 and are linked sitewide | **Yes (legal text)** |

# P1: Existing page and tool optimisation (days 8 to 30)
| # | Module | Task | Acceptance criteria |
|---|---|---|---|
| P1-1 | `/tools` + category hubs | Replace "18+" copy; build category hubs (Notes & Planning, Typing, Writing & Text, Calculators, Converters, Developer, Security, SEO, Image/PDF/Audio) modelled on 10.tools [V] | Hubs exist, list all tools with one-line descriptions, are in sitemap |
| P1-2 | Tier 1 pages (25) | Apply common template (see `tool_growth_specifications.md`): answer-first intro, how-to, formulas, use cases, privacy, FAQs, related links | Each has ≥300 words of unique, useful text below the tool, tool still above the fold |
| P1-3 | Overlap groups | Execute consolidation decisions only after verification columns are satisfied: e.g. basic→simple calculator; stopwatch-with-laps→stopwatch; word-counter-for-documents→word-counter | 301s in place, canonical targets updated, removed from sitemap, no 404s; check GSC performance first |
| P1-4 | Typing cluster | Decide role of `/typing-lab` (hub or merge) and `/typing-accuracy-test` | One clear primary page for "typing test"; siblings linked, differentiated |
| P1-5 | Metadata | Rewrite titles/meta for Tier 1 using keyword map; avoid "Free Online Utility" suffix on all pages | Unique title ≤~60 chars; unique description |
| P1-6 | Boilerplate directory | Replace the identical 26-link block with category-aware related links | Pages differ in link sets |
| P1-7 | Structured data | `Organization`, `WebSite`, `BreadcrumbList` sitewide; `WebApplication` on verified working tools only | Rich Results Test: no errors; properties true |
| P1-8 | Images | 1200×630 OG images per hub; alt text and dimensions on screenshots | Lighthouse image checks pass |
| P1-9 | Core Web Vitals | Measure LCP, INP, CLS on 10 sample URLs (PageSpeed/CrUX) and fix root causes | Field data "good" where available; document baseline first |
| P1-10 | Currency/finance pages | Add data source, update time, "not advice" notes | Statements match actual data source |
| P1-11 | GSC/Bing | Verify Bing Webmaster Tools, submit sitemap, consider IndexNow | Sitemap accepted in both |

# P2: AEO, GEO, topical authority and content (days 31 to 90)
| # | Task | Acceptance criteria |
|---|---|---|
| P2-1 | Publish `90_day_content_calendar.csv` articles (one per week; only where a related tool is verified) | Each article links to its tool and 2 siblings; author named |
| P2-2 | Comparison pages (honest): sticky notes, notepad | Include Stiknex limitations; sources cited |
| P2-3 | "How Stiknex handles your data" page | All claims engineering-verified |
| P2-4 | About page expansion; Organization + `sameAs` | Only real profiles listed |
| P2-5 | Outreach (see `seo_aeo_geo_strategy.md`): Product Hunt, AlternativeTo, educator lists | Manual, relevant, tracked in a sheet |
| P2-6 | AI-answer monitoring: monthly 20-query check across engines | Log only; no promises |
| P2-7 | India finance calculators: dated sources, INR examples | Reviewed for accuracy |

# P3: New tools and expansion (after P0 to P2 stabilise)
1. Diagram Maker (Mermaid-based MVP) [HUMAN decision].
2. Mind Map Maker (reuse whiteboard engine if viable) [HUMAN decision].
3. Brainstorming guide + idea board.
4. BMI/mortgage/grade/salary calculators (verified formulas).
5. Hindi typing test **only** if Devanagari input is truly supported.

# Measurement baseline (before changes)
Record: GSC indexed/not-indexed counts by status; impressions/clicks/CTR/avg position by page and country; GA4 organic landing sessions, engagement, tool-usage events; Bing indexed pages; referring domains; AI referrals (small, incomplete). Report monthly. Keep measured data separate from third-party estimates.

# Do-not list
- Do not request indexing for all URLs, mass-generate pages, or reuse identical FAQ blocks.
- Do not redirect or noindex anything until functionality and GSC performance are checked.
- Do not change working tool code without identifying the root cause.
- Do not promise rankings, traffic or AI citations.
