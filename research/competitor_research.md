# Competitor research (Stiknex)

**Evidence labels:** [V] verified by fetching the page on 2026-11-03 | [S] search-result snippet only | [O] my observation/inference | [K] general knowledge, not re-verified in this session.
**Not available:** organic traffic, keyword rankings, backlink counts or domain authority for any competitor. I had no SEO-tool access, so none are given. Anything resembling a number below comes from the competitor's own page.

## 1. Fetch coverage and limitations
| Competitor | Fetched? | What I could see |
|---|---|---|
| txtnotepad.com | Yes, homepage | Head metadata only; body is JS-rendered (only "Skip to editor" and ad placeholders visible) |
| notexo.in | Yes, homepage | Full static content |
| 10.tools | Yes, homepage | Full static content, complete tool inventory |
| typelynx.com | Yes, homepage | Full static content, plus text from its lesson, tool, privacy and terms pages (bundled in the response) |
| smallseotools.com | Yes, homepage | Navigation and tool list; no body copy |
| miro.com | Yes, homepage | Navigation, positioning, footer; no organic landing-page data |
| onlinenotepad.org, onlinenotepad.io, simplestickynotes.com, onenote.com/stickynotes, webwhiteboard.com, whiteboard.chat, canva whiteboard, zoom whiteboard, tutorialspoint whiteboard, typingmaster.com, typing.com, detailed.com, Microsoft Store listing | **No** | The fetch tool refused these URLs, and I did not search for each one. They remain unresearched. |
One search for "online notepad free no sign up" returned the competitor set in section 4. Those are snippets [S], not page analyses.

## 2. Analysis of the six required competitors

### 10.tools [V] (closest structural model for Stiknex)
- **Positioning:** "Free online tools that run in your browser"; privacy-first ("files stay on your device"), no sign-up, Pro tier for heavy jobs.
- **Scale:** 8 categories: PDF 17, Image 22, Video & audio 17, Files 13, Text 25, Calculators 17, Developer 21, Business & productivity 14 (about 146 tools on the homepage).
- **Structure:** category hubs (`/pdf/`, `/calculators/`, `/developer/`) with tools nested one level (`/calculators/age-calculator/`). Homepage links every tool directly, so every tool is one click from the home page.
- **Consolidation:** merges overlapping intents into one page ("JSON formatter & validator", "Sort lines & remove duplicates", "Timer, stopwatch & Pomodoro", "Online notepad & whiteboard", "Unit converter" as one page).
- **Trust:** About, Contact, Privacy, Terms, Refunds, How it works, Changelog; 21 language versions including Hindi (`/hi/`).
- **Comparison pages:** "iLovePDF alternative", "Smallpdf alternative" (bottom-of-funnel capture).
- **Includes:** typing test, typing tutor, online notepad & whiteboard, wheel spinner, timer, QR, password, JSON, regex. So it overlaps with much of Stiknex's catalogue.
- **Weakness for Stiknex to exploit [O]:** notes/notepad is one combined page, not a core product; no sticky notes board, mind map, diagram maker, or brainstorming.
- **Lesson:** Stiknex's 212 flat URLs have no hierarchy; 10.tools shows how to organise ~150 tools so each is discoverable.

### typelynx.com [V] (typing)
- **Pages:** `/typing-test`, `/wpm-test`, `/typing-accuracy`, `/typing-practice`, `/lessons` (+4 lesson pages), `/text-tools` (+3 tools), About, Contact, Privacy, Terms, Affiliate disclosure.
- **Content depth:** each page is a working tool plus long answer-first text: WPM formula (correct characters ÷ 5 ÷ minutes), accuracy formula, "what is a good typing speed" (ranges flagged as rough), step-by-step "how the test works", beginner tips, and per-page FAQ (6 to 8 questions). Entities used consistently: operator named (Primitive Holdings, LLC), contact emails, privacy statement naming GA4.
- **Differentiators:** WCAG 2.1 AA claims, dyslexia font, high contrast, text-to-speech, Spanish/French/"plain language" prompts, localStorage history and badges.
- **Weaknesses [O]:** only 4 lessons; small tool set; copy is highly repetitive across pages (same FAQ blocks reused), which may limit distinct ranking value. Built with Hostinger Horizons per its generator meta [V].
- **Overlap with Stiknex:** Stiknex has `/typing-speed-test`, `/typing-accuracy-test`, `/typing-practice-lessons` plus games. TypeLynx split speed/WPM/accuracy into three pages, the same overlap risk I flagged for Stiknex; whether that helps or hurts them is unknown.

### notexo.in [V] (notepad, India-built)
- **Concept:** every URL is a note (`notexo.in/yourname`); no login for public notes; rich editor (tables, code blocks, task lists), password protection, sharing with view/edit permissions, expiry, PDF export.
- **Page structure:** single homepage with How-it-works (3 steps), Features, "Perfect for" (developers, students, teams, writers), CTA; footer with About, Changelog, Pricing, Privacy, Terms, Security Guide, Support, Feedback.
- **Metadata:** very long `meta keywords` list (Google ignores it); author and creator named (Vignesh Yadav) with GitHub link: a visible author-entity signal.
- **Weakness [O]:** one main landing page for a competitive term; positioning as "pastebin/Notion alternative".
- **Opportunity:** URL-based shareable notes are a feature Stiknex's notebook (local autosave per its meta description) does not appear to have. Whether to add it is a product decision, not an SEO fix.

### txtnotepad.com [V partial]
- Meta description claims no sign-up, local autosave, image paste, note search, developer syntax highlighting, password-protected share links. Body not visible in static HTML, so all of it is JS-rendered. Shows ad placeholders ("Advertisement" x2) in static HTML.
- **Weakness [O]:** if its content is JS-only, crawlers see little text, a similar risk to Stiknex's.

### smallseotools.com [V]
- **Positioning:** broad "100% free SEO tools" suite; revenue from Pro plans (plagiarism, paraphraser, image search etc.), 22 language versions, blog, FAQs, sitemap.html, testimonials page.
- **Structure:** category hubs (Text analysis, Image editing, Keywords, Backlinks, Website management, Domains, PDF, Calculators, Other). Many "programmatic" size variants (Compress image to 50KB/20KB/100KB..., Compress PDF to 50KB...300KB).
- **Calculators:** only Age and Hours calculator are listed; so Stiknex's 38 calculator pages are broader there.
- **Weaknesses [O]:** ad-blocker wall and heavy popups visible in the HTML; text tools are SEO-focused rather than notes/productivity.
- **Lesson:** its "compress to N KB" pages are a documented example of intent-specific pages. Stiknex's `/image-compressor` could test one or two if the tool supports target sizes.

### miro.com [V]
- Enterprise visual collaboration platform: Whiteboard, Diagrams, Mind Maps, Concept Maps, Flowcharts, Brainstorming, Online Sticky Notes, Kanban, AI diagram/mind map/flowchart generators, 6,000+ templates (its own claim), ISO 27001/SOC 2/GDPR badges, Mermaid diagram page, MCP server.
- **Page architecture:** a dedicated use-case page per intent (`/mind-map/`, `/brainstorming/`, `/online-whiteboard/`, `/online-sticky-notes/`, `/flowchart/online/`, `/diagramming/online/`, plus `/ai/mind-map-ai/`). This is the page set that ranks for your mind map, diagram, brainstorming, whiteboard and sticky notes CSV clusters.
- **Weakness for Stiknex [O]:** sign-in/paid team tiers (per its Pricing and Enterprise navigation), heavy platform; users searching "no login", "free", "simple" phrases (e.g., "free online whiteboard no sign up", "mindmap no login", "diagram maker no login" in your CSVs) are not Miro's core audience.
- **Do not target:** enterprise/workshop/collaboration queries.

## 3. Competitor comparison
| Dimension | Stiknex [V] | 10.tools [V] | TypeLynx [V] | Notexo [V] | SmallSEOTools [V] | Miro [V] |
|---|---|---|---|---|---|---|
| Tool count | ~190 in sitemap | ~146 | ~10 | 1 | many | platform |
| All tools linked from home | No: 26-link directory | Yes | Yes | n/a | Yes | Yes |
| Page copy depth | One intro sentence on fetched pages | Not sampled | Long, answer-first, FAQs | Short landing | Not sampled | Marketing |
| Trust pages | About only in sitemap | About, Contact, Privacy, Terms | All + affiliate disclosure | Privacy, Terms, Security | Full | Full |
| Author/entity | "Vishal Mall" in meta only | Company pages | Named operator + emails | Named developer + GitHub | London address | Company |
| Languages | EN | 21 | EN/ES/FR prompts | EN | 22 | many |
| Notes/whiteboard/mind map | Notebook, sticky, whiteboard | Notepad & whiteboard combined | None | Notepad | None | Full suite |
| Pricing | Free + AdSense | Free + Pro | Free (+affiliate planned) | Free + Pricing page | Free + Pro | Paid tiers |

## 4. Additional competitors by category (candidates)
- **Online notepad** [S]: hypernotepad.com, quillbot.com/notepad, onlinenotepad.org, JustNotepad, Editpad (named in a third-party "best notepads" article on hypernotepad.com, which is self-interested), onlinenotepad.app (Product Hunt listing). Common selling points: no sign-up, encryption, share links, export. SERP is crowded; most competitors are small tools, so Stiknex is competing on features and trust, not scale.
- **Sticky notes, mind map, diagram, whiteboard, typing, calculators, converters** [K, not verified in this session]: candidate rivals to check next include Excalidraw, tldraw, diagrams.net, mermaid.live, MindMeister/Coggle/Xmind (mind map), Monkeytype/10FastFingers/typing.com/Keybr (typing), calculator.net/Omni Calculator (calculators), ConvertUnits/UnitConverters.net (converters). I haven't fetched or analysed any of them.

## 5. Gaps Stiknex can exploit (evidence-based)
1. **Free, no-login, local-first notes suite** (sticky board + notebook + whiteboard): none of the six fetched competitors has all three in one site [V/O]. Miro requires accounts for team use per its navigation; 10.tools merges notepad and whiteboard into one page.
2. **Page-level content depth:** TypeLynx shows what a ranking-oriented tool page contains; Stiknex's fetched pages do not yet.
3. **Hierarchy and discoverability:** 10.tools links all tools from the homepage by category.
4. **Mind map, diagram, brainstorming gap:** Miro covers them, but the "free/no-login/simple" CSV phrasing indicates demand for lighter alternatives (CSV evidence only, no volume).
5. **Trust and entity pages:** Competitors have Contact/Privacy/Terms; Stiknex's sitemap has none.

## 6. Backlink and brand-authority opportunities (no metrics available)
- **Alternative-to listings** (AlternativeTo, Product Hunt) already carry many online-notepad competitors [S]; listing Stiknex there is legitimate, but their individual traffic value is unknown.
- **Educational/teacher resource lists** for whiteboard, typing and calculators; **developer lists** for the JSON/regex/JWT tools.
- Create something link-worthy first (for example a typing speed benchmark methodology page, or a privacy explainer for local-first tools), then do outreach. See `seo_aeo_geo_strategy.md`.
