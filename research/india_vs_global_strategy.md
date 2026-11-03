# Market strategy: India vs English-speaking global

## 0. Evidence limits
- **No search volumes, CPC, KD or country splits** exist in the 12 CSV files. Every demand statement below is **qualitative**, based on keyword wording in the CSVs and on the Stiknex sitemap.
- I have **no GSC country report**, so I cannot say where Stiknex impressions come from. That report is the decisive evidence (see test plan).
- "Competition" descriptions come from the pages I fetched [V] or from general knowledge [K].

## 1. What the CSVs suggest (counts from my first-pass triage, heuristic)
- Clear India-flavoured finance keywords in the calculator CSV (example terms seen: "sip calculator", "emi calculator", "gratuity calculator", "swp calculator", "rd calculator", "jeevan labh calculator", "personal loan emi calculator"). Stiknex **already has** `/emi-calculator`, `/sip-calculator`, `/gst-calculator`, so the catalogue is partly India-oriented.
- Typing CSV: 83 "market-decision" keywords in other languages (Hindi, Marathi, Telugu, Tamil, Malayalam, Nepali, Sinhala, Bangla, Gujarati, Kannada, Spanish...). Examples: "hindi typing test", "english to hindi typing", "marathi typing". Also exam-style terms such as "ssc cgl typing test" (I classified it as likely out of scope for now).
- English-global signals: "typing test", "typing speed test", "online notepad", "sticky notes online", "diagram maker", "online whiteboard", "word counter" patterns.
- Spelling: the converter CSV uses "convertor" (common in Indian and some non-US English). Your site uses "converter"; one page can cover both via natural wording (see next section).

## 2. A. India strategy
**Where it has a real edge**
1. **Finance calculators with Indian context:** EMI, SIP, GST, plus candidates from the CSV (SWP, RD, gratuity). Differentiator: INR formatting, Indian tax/GST slabs stated with effective dates and sources, worked examples in ₹. These rely on *facts that change* (rates, rules), so each page needs an "as of" date and a source link.
2. **Typing:** Hindi typing is a real functional difference (Devanagari input, layout choices such as Inscript, Hindi passages), so it justifies a separate page **only if** the tool actually supports it.
3. **Exam-oriented typing tests (e.g., government-exam style)**: only worth building if you can state test rules accurately from official notices. Don't claim exam equivalence.
**Competition [K/O]:** India-built competitors exist (Notexo is one [V]); large calculators/finance portals dominate finance queries [K]. I did not verify rankings.
**Language rules**
- **Separate URLs only for genuinely different tools** (Hindi typing). Never place Hindi and English text on one page to catch more keywords.
- Use `/hi/` or `/hindi-typing-test` with its own title, content and `hreflang` pairing **only when an equivalent English page exists**.
- Do not machine-translate all 190 tools into Hindi.

## 3. B. English-speaking global strategy
- Targets: notes/whiteboard/sticky notes ("free", "no login", "simple"), typing tests, word/character counters, developer utilities, general calculators/converters.
- **Competition [V/K]:** very crowded for generic utilities (10.tools alone lists ~146; SmallSEOTools has many). Head terms like "online notepad" are saturated by many small tools [S].
- **Where Stiknex can differentiate:** the combined notes suite (sticky board + notebook + whiteboard), local-first privacy statement, and no-login convenience. Competing on "word counter" or "unit converter" with generic pages is a long shot without distinctive content.

## 4. Comparison
| | India | English global |
|---|---|---|
| Strongest product fit | EMI/SIP/GST + other INR calculators; Hindi typing (if built) | Notes suite; typing test; text tools; dev tools |
| Competition (qualitative) | Mixed; established finance portals for calculators | Heavy for generic utilities; moderate for "free no-login notes suite" |
| Required extra work | Verified, dated Indian rates; Hindi functionality | Strong content depth, trust pages, comparison pages |
| Risk | Rule/rate errors (YMYL-adjacent finance content) | Commodity pages, thin content |
| Evidence strength here | Keyword wording only | Keyword wording + competitor structure |

## 5. Recommendation (with its limits)
- **Primary market: English-language, global**, written in plain international English (works for India, too, because many Indian users search in English). Reason: the whole catalogue and your keyword files are English-first, and the notes/typing/dev tools are market-neutral.
- **First targeted expansion: India-specific finance calculators** (already partly present), improved with INR context and dated sources.
- **Second: Hindi typing**, only after verifying the tool can actually do it. Third, other languages: only if GSC shows demand.
- **This is a hypothesis, not a finding.** Replace it with data after 4 to 6 weeks.

## 6. Test plan (decisive evidence)
1. GSC → Performance → Countries: share of impressions/clicks from India vs US/UK/CA/AU for the pages already indexed.
2. GA4: country, device, language by landing page.
3. For each India-specific improvement, compare impressions/clicks for the specific page group in GSC before/after.
4. Decide on Hindi pages only if Hindi/Devanagari queries show impressions or if the tool is functionally unique.
