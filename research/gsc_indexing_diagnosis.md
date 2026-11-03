# Google Search Console indexing diagnosis (Stiknex)

## 0. Read this first: what I could and could not use
- **The screenshots did not arrive in this chat.** I received only your typed summary. So I could not read the URL lists behind any status.
- Therefore I **cannot name** the 21 "Discovered", the 1 "Crawled" or the 5 "Redirected" URLs. Naming them would be invention. Section 5 says exactly what to export so this can be finished in one step.
- Numbers used (from you): 10 indexed, 27 not indexed (21 discovered-not-indexed, 1 crawled-not-indexed, 5 redirected, 0 alternate-with-canonical).
- 10 + 27 = **37 URLs known to this report snapshot, versus 212 in the sitemap** [V sitemap]. About 175 sitemap URLs are not accounted for in the snapshot. Possible reasons: Google has not processed them yet, the report lags, or they sit in other statuses not shown. This is an **inference [O]**; Search Console's Sitemaps report ("Discovered URLs") would show the number Google read from the sitemap.

## 1. What each status means (Google's standard definitions, general knowledge [K])
| Status | Meaning | Usual causes |
|---|---|---|
| Discovered, currently not indexed | Google knows the URL but has not crawled it yet | Low perceived site quality/authority, new site, many URLs found at once, few or no internal links, crawl-rate limits |
| Crawled, currently not indexed | Google fetched it and chose not to index | Thin/duplicate/low-value content, soft-404 behaviour, rendering that shows little content |
| Page with redirect | URL redirects elsewhere; the source URL is not indexed (the destination may be) | http→https, www/non-www, trailing slash, URLs changed but still in sitemap |
| Alternate page with proper canonical tag | URL canonicalises to another indexed page | Intentional duplicates; 0 here |

## 2. How the snapshot relates to what I found on the site
| Finding from earlier audit [V] | Likely link to GSC statuses | Confidence |
|---|---|---|
| ~186 of 212 sitemap URLs are not linked from the static HTML directory (only 26 are) | Orphan-like URLs found only through the sitemap are the classic "Discovered, not indexed" group | **Medium**: strong fit, but unconfirmed. Test below. |
| Fetched tool pages carry a title, description, H1 and one intro sentence in raw HTML; the interface is likely JS-rendered | Thin-looking pages on first crawl → "Crawled, not indexed" and low priority for crawling | Medium |
| All 212 `lastmod` values are today's date | Google treats lastmod as a hint only when reliable; uniform values reduce its usefulness | Medium; not a direct cause of non-indexing |
| `/dataconverter` (the nav link) returns homepage content with the homepage canonical, instead of a 404 or redirect | Would normally appear as "Duplicate, Google chose different canonical" or a soft 404, not as a redirect | Low; **0 alternates** reported, so Google may not have crawled it yet |
| Repeated 26-link block on every page; boilerplate dominates text | Pages look alike to quality systems | Low-medium |
| 84 URLs sit in 19 overlap groups | Near-duplicate intent pages can be left out of the index | Low-medium; needs per-group check |
| No privacy/terms/contact pages in the sitemap | Weak trust signals for a site with AdSense and file/text tools | Low (trust factor, not a direct indexing cause) |

**Testable hypothesis:** the 10 indexed URLs are mostly among the 26 pages linked from the site directory. Compare the indexed-10 list with the nav list in `06_stiknex_url_inventory_from_sitemap.csv` (column `in_static_site_directory_nav`). If so, internal linking is the primary lever. If the 10 include unlinked URLs, or linked pages are not indexed, the cause is more likely content/quality.

## 3. The 5 redirected URLs: what to look for
I cannot identify them. Common candidates given what I observed:
1. `http://` vs `https://` variants, or `www.` vs non-www, of the homepage.
2. Trailing-slash variants (for example `/sticky-notes/` → `/sticky-notes`).
3. Any URL in the sitemap that later got redirected.
For each, record **source → destination → status code → in sitemap?** Redirects are normal for the first two; the only fix is **removing redirecting URLs from the sitemap and fixing internal links to point at final URLs**.

## 4. The 1 "Crawled, not indexed" URL
Cannot identify. Diagnosis checklist once you have it:
1. URL Inspection → "View crawled page" → compare **rendered HTML** with the live page. If rendered text is only the shell and directory, Google sees a thin page.
2. Is the page in an overlap group (`06_...csv`, `possible_overlap_group`)? If yes, check whether a sibling is already indexed with the same intent.
3. Does it have unique visible content beyond the 26-link block (how-to, FAQ, use cases)?
4. Does it return 200 with a self-referencing canonical?
Typical remedies: add unique answer-first content, differentiate from the sibling, or consolidate. Do not "request indexing" repeatedly before changing the page.

## 5. The 21 "Discovered" URLs: how to decide which deserve indexing
**What I need:** Page indexing → click "Discovered – currently not indexed" → Export (CSV/Sheets). Same for "Crawled", and "Page with redirect". Paste or upload the lists.

**Decision framework (applies to each URL; judgement, not Google rules):**
| Test | Index priority if... |
|---|---|
| Distinct search intent | No sibling in the overlap-group table already covers it |
| Working, differentiated tool | Tool works and offers something beyond the sibling |
| Evidence of demand | CSV cluster exists, or GSC shows impressions |
| Content readiness | Can carry 300+ words of useful content (how-to, FAQ, formulas, privacy) |
| Strategic fit | Fits notes/productivity/calculators/converters positioning |

**Pre-ranked tiers for all 212 URLs** are in `url_consolidation_plan.csv` (column `tier`). When the 21 URLs arrive, each inherits its tier:
- **Tier 1 (index first):** core notes tools, typing test, high-intent calculators/converters, tools hub, blog.
- **Tier 2:** mainstream single-intent utilities.
- **Tier 3 (hold):** niche, experimental or ambiguous pages. Do not push for indexing until content and function are verified. Remove from sitemap temporarily (this does not cause deindexing; it just stops asking Google to prioritise them), or `noindex` if the page is not meant for search.

## 6. Do not do these
- Do not "request indexing" for all 212 URLs.
- Do not add the same boilerplate FAQ to every page to look thick.
- Do not delete pages that already receive impressions before checking Search Console performance.

## 7. Verification checklist for Antigravity (all tests run in a browser or crawler)
1. List which URLs of the 26 nav-linked pages are in the indexed-10 set.
2. For 20 sampled sitemap URLs: fetch raw HTML and rendered HTML; compare visible text length and links.
3. Request a nonexistent path (e.g. `/zzz-test-404`): confirm status code is 404, not 200 with homepage content.
4. Fetch `/robots.txt` and confirm it references the sitemap and does not block scripts/CSS.
5. Check redirect chains for http/https, www/non-www, trailing slash.
6. Run URL Inspection on `/dataconverter` and `/data-converter`.
7. Compare Sitemaps report "Discovered URLs" with 212.
