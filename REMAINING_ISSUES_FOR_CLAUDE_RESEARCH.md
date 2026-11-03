# STIKNEX — REMAINING ISSUES & STRATEGIC HANDOFF FOR PHASE 1 SEO RESEARCH

**Target Domain:** https://stiknex.site/  
**Prepared By:** Technical SEO Architect & Senior React Engineer  
**Recipient:** Claude / External Strategy Team (Keyword Research, GEO/AEO, Content Optimization)  
**Date:** November 3, 2026  

---

## 1. Context & Purpose

In Phase 0, all critical technical routing, sitemap hygiene, HTTP status code (404/301), and crawlability bottlenecks were fixed in code and verified.

Per explicit instructions:
> *"Do not start keyword-based content changes, mass SEO title changes, page consolidation or new SEO landing-page creation. Those will be handled after the final keyword and competitor research is available."*

This document serves as the formal technical dossier and handoff guide detailing architecture boundaries, technical constraints, and strategic opportunities for the Phase 1 team.

---

## 2. Hard Technical & Infrastructure Constraints

The Phase 1 strategy team **MUST** respect the following architectural constraints:

1. **Vercel Hobby Serverless Function Hard Limit (Strictly ≤ 12 Functions):**
   - Stiknex currently operates **11 serverless functions** in `api/`:
     1. `api/analytics.js`
     2. `api/auth.js`
     3. `api/blogs.js`
     4. `api/fetch-trends.js`
     5. `api/generate-blog.js`
     6. `api/render-page.js`
     7. `api/reviews.js`
     8. `api/seo-stats.js`
     9. `api/sitemap.xml.js`
     10. `api/supporters.js`
     11. `api/trends.js`
   - **Constraint:** Do **NOT** propose creating new standalone `.js` API endpoints. Any new backend API capability must be consolidated into existing handlers using action/query routing.
2. **Function Duration Limit (Strictly ≤ 15 Seconds):**
   - On Vercel Hobby, `"maxDuration"` in `vercel.json` must **NEVER** exceed 15s. Deployments will fail if set to 60s.
3. **No Autonomous Git Push:**
   - Any deployment commits must be pushed by the human project owner.

---

## 3. High-Priority Strategic Opportunities for Phase 1

### A. Intent Clustering & Category Hub Pages
- **Current State:** The 201 individual tools are grouped into 20 categories inside `src/data/toolsRegistry.js` and rendered via `src/Pages/Tools/Tools.jsx`.
- **Phase 1 Opportunity:**  
  Develop dedicated category landing pages with rich search intent copy (e.g. `/tools/calculators`, `/tools/converters`, `/tools/developer`, `/tools/image`).  
  *Note:* Use query parameters or React subroutes to preserve the existing URL hierarchy without exceeding function limits.

### B. Answer Engine Optimization (AEO) & Generative Engine Optimization (GEO)
- **Current State:** Every tool has basic structured FAQs and WebApplication JSON-LD schemas in `seoConfig.js`.
- **Phase 1 Opportunity:**
  - Elevate FAQ schemas to `HowTo` and `SoftwareApplication` rich snippets.
  - Tailor concise "direct answers" (40–60 words) targeting Perplexity, ChatGPT Search, and Google AI Overviews for high-volume conversion queries (e.g., "how to convert mb to gb binary vs decimal").

### C. Search Intent Content Depth for Top-Performing Tools
- **Current State:** Tools share high-standard boilerplate guides and how-to steps generated from metadata.
- **Phase 1 Opportunity:**
  - Once keyword research identifies Stiknex's highest-opportunity tools (e.g., URL Shortener, Word Counter, Data Converter, Sticky Notes, Color Picker), write bespoke, high-depth editorial content, benchmark comparison tables, and visual tutorials directly into their `guide` properties.

### D. Blog Content Strategy & Automation Oversight
- **Current State:** MongoDB contains 18 published articles. Automated cron jobs (`api/fetch-trends.js` at 07:00 UTC and `api/generate-blog.js` at 07:30 UTC) leverage Google Trends and Gemini AI to draft technical blog posts.
- **Phase 1 Opportunity:**
  - Review automated blog generation prompts to align topic selection with Phase 1 keyword clusters rather than raw trending news spikes.
  - Establish an automated or semi-automated editorial quality gate ensuring posts include contextual internal links back to relevant Stiknex tools.

### E. Page Consolidation & Thin Content Review
- **Current State:** All 201 tools have been kept active, crawlable, and indexed to preserve historical equity.
- **Phase 1 Opportunity:**
  - Following competitor and traffic analysis, if any tools demonstrate zero search demand or cannibalize sister utilities (e.g. minor variations of simple math operations), prepare a consolidation roadmap using permanent 301 redirects rather than 404 deletion.

---

## 4. Summary Checklist for Phase 1 Readiness

- [x] Phase 0 technical plumbing 100% verified (301 redirects, 404 handling, sitemap hygiene).
- [x] All 233 URLs verified with 200/301 statuses and genuine lastmod timestamps.
- [x] Legal pages (Privacy, Terms, Contact) active and linked.
- [x] Static HTML crawl paths established to all 201 tools.
- [ ] **Pending Phase 1:** Keyword research data delivery.
- [ ] **Pending Phase 1:** Competitor gap analysis.
- [ ] **Pending Phase 1:** Keyword-to-URL mapping matrix.
- [ ] **Pending Phase 1:** GEO/AEO prompt and schema enrichment.

