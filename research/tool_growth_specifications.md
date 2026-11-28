# Tool-by-tool growth specifications

**Important limits:** I verified only metadata/H1/intro text for 7 Stiknex pages and the sitemap. **No tool's actual functionality was tested.** Every "verify" item below must be checked in a browser before content claims are written. Section A is SEO/content/UX work on existing tools; Section B is new product development. Keep the two separate in planning.

## Common page template (applies to every Tier 1/2 tool page)
1. **Tool first** above the fold; no SEO block above it.
2. **Answer-first intro** (2 to 3 sentences): what it does, who for, free/no-sign-up (only if true).
3. **How to use** (3 to 6 steps).
4. **Rules/formulas/limits** (what it counts, rounding, supported formats).
5. **2 to 4 real use cases.**
6. **Privacy** (what stays on device; verified).
7. **Related tools** (3 contextual links) and parent hub breadcrumb.
8. **3 to 6 FAQs** that are specific to the tool (different per page).
9. Schema: `BreadcrumbList` (always); `WebApplication` only when true; FAQ markup optional.
10. Titles ≤ ~60 chars; unique meta description; 1200×630 OG image per hub.

# A. Existing tools: SEO and UX improvements

## A1. Online Notebook: `/online-notebook` (Tier 1; maps to "online notepad")
- **Verified [V]:** title "Free Online Notebook & Digital Notepad | Stiknex"; meta says rich-text, headings, bullet lists, code snippets, local auto-save, no sign-up.
- **Search intent:** transactional ("online notepad", "notepad online free", "digital notepad"); 690 CSV suggestions mapped, most are noise (see mapping file).
- **Competition [S/V]:** crowded; competitors win on share links, passwords, encryption, export (Notexo, TxtNotepad, Hyper Notepad).
- **SEO changes:** answer-first intro ("An online notepad is…"), how autosave works and where notes are stored, comparison section "Notepad vs notebook vs sticky notes", FAQ (is it private? offline? export? limit?), related: sticky-notes, word-counter, to-do-list.
- **Product improvements (separate decision):** export (txt/md/pdf), search, shareable note links, dark mode, character/word count in the editor. Each is a product choice; competitors offer them [V].
- **Title test:** "Online Notepad – Free, No Sign-Up Notebook Editor | Stiknex".
- **Verify:** actual storage (localStorage vs server), data loss behaviour, mobile editing.

## A2. Sticky Notes: `/sticky-notes` (Tier 1)
- **Intent:** transactional/app-seeking ("sticky notes online", "digital sticky notes desktop", "sticky notes app for mac").
- **SEO:** how it works; colours/resize/drag; backup/export explanation; comparison vs Windows Sticky Notes (article, see calendar); FAQ: "Does it sync across devices?" (answer must match reality).
- **Product:** export/import backup JSON, optional PWA install ("sticky notes for desktop" intent), pin-on-top where browser allows.
- **Avoid:** targeting product/stationery queries from the CSV ("sticky notes 3x3", brand/size terms); these are off-intent.
- **Competition:** Miro online sticky notes (team context), Windows/OneNote apps.

## A3. Typing Test: `/typing-speed-test` (Tier 1, primary of typing cluster)
- **Intent:** transactional; 221 CSV keywords map here (duration, WPM, "online typing test").
- **Content to add:** WPM and accuracy formulas as the tool actually computes them; "what is a good WPM" (with sources, flagged as rough); beginner section; duration guide.
- **UX:** duration selector, result summary (WPM, accuracy, errors), retry flow, mobile caveat, accessibility (keyboard-only, font size).
- **Structure decision:** keep `/typing-speed-test` as the single "typing test" landing page; make `/typing-lab` a hub or merge; keep `/typing-accuracy-test` only if distinct (see consolidation plan).
- **Competition [V]:** TypeLynx (deep content, accessibility), 10.tools (test + tutor).
- **Differentiator ideas:** code-typing challenge (already in sitemap), daily challenge; these are product features, not SEO pages.
- **Hindi:** only as a separate page if a real Devanagari test exists (see market strategy).

## A4. Calculators (38 URLs)
- **Priority order:** age, percentage, scientific, simple (consolidate with basic), EMI, SIP, compound interest, date difference, time, GST, fraction.
- **Per page:** formula shown, worked example, edge cases, rounding, "assumptions" box. Finance pages: "as of" date for any rates/rules and a not-advice note; India-specific ones use INR.
- **Hub:** a `/calculators` hub grouping finance / date & time / math, linking every child (today only 4 calculators are in the static nav [V]).
- **Hold:** niche math pages (matrix, probability, geometry) in Tier 2 until content exists.
- **Gaps from CSV (no page in sitemap):** BMI, mortgage, grade calculator, salary/paycheck, calorie. Treat as **new tools** (section B), and only where you can verify formulas.

## A5. Converters (23+ URLs)
- **Hub-and-spoke:** `/unit-converter` as hub; length/area/volume/weight/temperature/speed/pressure/power as spokes; each spoke needs unique content (common conversions table, factor sources), not a copy of the hub.
- **Fix:** nav link `/dataconverter` → `/data-converter`.
- **Gaps from CSV:** calendar/date converters (many language-specific), file-format converters (audio/video from YouTube = reject), "convertor" spelling variant (write "converter (also spelled convertor)" naturally once where relevant; no stuffing).
- **Currency converter:** if "live" rates are claimed [V in nav label "Live Currency Converter"], state rate source and update time on the page.

## A6. Online Whiteboard: `/whiteboard` (Tier 1)
- **Evidence [V]:** fallback homepage meta says "Excalidraw whiteboard"; I did not open `/whiteboard`.
- **SEO:** how to use, export, use cases (teaching, brainstorming, planning), shortcuts, vs Miro/Excalidraw honest comparison.
- **Product:** export PNG/SVG, shareable link, templates (brainstorm, retrospective).
- **CSV queries to target:** "free online whiteboard no sign up", "online whiteboard for teaching", "simple online whiteboard".
- **Reject:** sport-specific, interview-platform, vendor-specific queries.

## A7. Free Online Tools directory: `/tools` (Tier 1)
- **Verified problems:** copy says "18+" tools [V]; links only 22 tools [V].
- **Rebuild as:** category index (Notes & Planning, Typing, Writing & Text, Calculators, Converters, Developer, Security, SEO, Image/PDF/Audio) → category hubs → tools. Model: 10.tools [V].
- **Target keyword:** "free online tools" (CSV cluster has 366 suggestions; a lot are brand/niche). Keep it a navigational hub; do not stuff.
- **Add:** short description under each tool link, search box (client-side), "popular tools" block.

# B. New product opportunities

## B1. Mind Map Maker (`/mind-map-maker`)
- **User problem:** quickly turn ideas into a branching map without signup.
- **Search intent:** transactional ("mindmap free online", "mindmap no login", "mindmap generator"); informational comparison queries.
- **Competition:** Miro, MindMeister/Coggle/Xmind [K].
- **Minimum viable functionality:** nodes, children, drag/move, collapse, colours, export PNG/JSON, local save. **Option:** reuse the whiteboard engine (Excalidraw) with a mind-map template instead of building a new engine [O, check license/fit].
- **Complexity:** medium (custom) / low (template on existing whiteboard).
- **Fit:** good (visual thinking cluster). **Priority P3, after P0 to P2.**

## B2. Diagram Maker (`/diagram-maker`)
- **User problem:** flowcharts/UML/ER from text without signing up.
- **Demand evidence:** diagram maker CSV is the biggest relevant cluster (~450 candidates, includes "diagram maker mermaid", "from code", "flow diagram maker free").
- **MVP:** text-to-diagram using Mermaid (client-side), live preview, SVG/PNG export, 4 templates (flowchart, sequence, ER, class). 
- **Competition:** Miro, diagrams.net, mermaid.live [K].
- **Complexity:** medium; library integration, accessibility, export.
- **Reject:** circuit/wiring/appliance parts-diagram queries.

## B3. Brainstorming (`/brainstorming-guide` with embedded tool)
- **Intent:** informational ("what is brainstorming", "reverse brainstorming", "brainstorming techniques").
- **Form:** guide page with techniques, plus a lightweight "idea board" using sticky notes (link to `/sticky-notes`). Do not build a separate tool if sticky notes already covers capture.
- **Complexity:** low (content), low-medium (guided prompts).

## B4. Other calculators from CSV
BMI, mortgage, grade, salary/paycheck, calorie. **Complexity:** low each, but formulas/rules must be accurate; health/finance sensitivity; add disclaimers. **Priority P3.**

## B5. Not recommended
Video/audio downloaders (YouTube/Spotify/TikTok to MP3: legal and policy risk), "unblocked/games" queries, brand-navigational keywords, product/stationery terms for sticky notes and notepads.
