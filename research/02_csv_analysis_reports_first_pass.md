# CSV analysis reports (first pass)

Data in every CSV: one column ("Keywords"), no volume/CPC/KD/country/ranking. All metrics marked **unavailable**.

Triage labels are **regex heuristics**, not manual judgement. Treat "relevant" as "candidate", "review" as unresolved, and "reject" as "likely reject, spot-check before deleting".


## blog.csv

- Total rows: 680; exact duplicates: 0; near-duplicates (same words, different order/punctuation): 36
- Triage: relevant-candidate 74, needs review 436, likely reject 170, market decision 0
- Question/comparison keywords: 27; long-tail (4+ words): 132; brand/navigational: 21
- Intent mix (heuristic): informational/unclear 589, informational 55, navigational 23, transactional (tool-use) 9, commercial investigation 4
- Question examples: blog or blog post; is blog a portmanteau; is medium a blog; is a blog a website; is wordpress a blog; is it free to start a blog; is not a blog; is a blog a video
- Relevant-candidate examples: blog and vlog difference; blog and vlog meaning; blog or blog post; blog writing blog writing; blog definition and examples; blog design ideas; blog directory; blog examples; blog examples for students; example of blog; example of blog post; free blog sites
- Likely-reject examples: blog gif; blog lyrics; blog 06880; new blog job; 4 hour work week blog; blog github; blog youtube; 8020 fashion blog tanzania
- Needs functionality check: seed keywords map to tools only if the tool exists on the live site (not verified).

## test.csv

- Total rows: 674; exact duplicates: 0; near-duplicates (same words, different order/punctuation): 36
- Triage: relevant-candidate 121, needs review 279, likely reject 272, market decision 2
- Question/comparison keywords: 31; long-tail (4+ words): 251; brand/navigational: 21
- Intent mix (heuristic): transactional (tool-use) 604, informational 40, navigational 24, commercial investigation 4, informational/unclear 2
- Question examples: afg vs ind test; test e vs test c; test e vs test c vs test p; f test vs t test; how much is a pregnancy test; how to book a driving test; how much is a driving test; how to test internet speed
- Relevant-candidate examples: speed test; internet speed test; wifi speed test; typing test; net speed test; ookla speed test; network speed test; typing speed test; a speed test; an iq test; broadband speed test; briggs myers personality test
- Likely-reject examples: on a blood test; test anxiety strategies; quest test menu; test blood sugar at home; test pdf; 4 panel drug test; test 2026; xbox controller test
- Needs functionality check: seed keywords map to tools only if the tool exists on the live site (not verified).

## convertor.csv

- Total rows: 333; exact duplicates: 0; near-duplicates (same words, different order/punctuation): 17
- Triage: relevant-candidate 77, needs review 86, likely reject 164, market decision 6
- Question/comparison keywords: 13; long-tail (4+ words): 123; brand/navigational: 23
- Intent mix (heuristic): transactional (tool-use) 296, navigational 24, informational 12, commercial investigation 1
- Question examples: converter or convertor; how much is a catalytic convertor; convertor or converter; convertor or converter spelling; convertor or inverter; convertor or adaptor; convertor or converter which is correct; convertor or converter uk
- Relevant-candidate examples: currency convertor; calendar convertor; date convertor; area convertor; audio to text convertor; currency convertor uk; currency convertor usd to aud; doc to pdf convertor; docx to pdf convertor; epoch time convertor; excel to pdf convertor; epub to pdf convertor
- Likely-reject examples: national id convertor online; free online youtube convertor; national id convertor online free; 8d music convertor; discord time convertor; av to hdmi convertor; bank statement convertor; 700r4 torque convertor cover
- Needs functionality check: seed keywords map to tools only if the tool exists on the live site (not verified).

## calculator.csv

- Total rows: 696; exact duplicates: 0; near-duplicates (same words, different order/punctuation): 65
- Triage: relevant-candidate 213, needs review 314, likely reject 169, market decision 0
- Question/comparison keywords: 17; long-tail (4+ words): 159; brand/navigational: 29
- Intent mix (heuristic): transactional (tool-use) 629, navigational 32, informational 19, commercial investigation 16
- Question examples: how to percentage calculator; how much is a scientific calculator; how to bmi calculator; how loan calculator; how much time calculator; how much tax calculator; how is due date calculator; how to age calculator
- Relevant-candidate examples: age calculator; bmi calculator; mortgage calculator; sip calculator; emi calculator; calorie calculator; date calculator; loan calculator; percentage calculator; compound interest calculator; calculator app free; calculator age
- Likely-reject examples: nhs bmi calculator; calculator in asl; qdoba nutrition calculator; calculator ti 84; calculator ebay; blox fruit calculator; calculator download; 7th house astrology calculator
- Needs functionality check: seed keywords map to tools only if the tool exists on the live site (not verified).

## mindmap.csv

- Total rows: 458; exact duplicates: 0; near-duplicates (same words, different order/punctuation): 58
- Triage: relevant-candidate 83, needs review 222, likely reject 153, market decision 0
- Question/comparison keywords: 20; long-tail (4+ words): 84; brand/navigational: 57
- Intent mix (heuristic): informational/unclear 321, navigational 62, informational 28, commercial investigation 25, transactional (tool-use) 22
- Question examples: how to make a mindmap on word; how to create a mindmap on word; how to make a mindmap on powerpoint; how to do mindmap; how i taught my grandmother to read mindmap; how to make a mindmap on google docs; is mindmap one word; is it mindmap or mind map
- Relevant-candidate examples: simple mindmap; free mindmap software; mindmap ai; mindmap app; mindmap ai free; mindmap app free; mindmap app for ipad; mindmap ai tools; ai mindmap; ai mindmap generator; ai mindmap free; ai mindmap generator free
- Likely-reject examples: conceptdraw mindmap; notion mindmap; mindmap technologies chennai; mindmap bagus; zotero mindmap; mindmap 12 thì tiếng anh; mymap ai mindmap; sơ đồ mindmap
- Needs functionality check: seed keywords map to tools only if the tool exists on the live site (not verified).

## typing.csv

- Total rows: 661; exact duplicates: 0; near-duplicates (same words, different order/punctuation): 47
- Triage: relevant-candidate 267, needs review 175, likely reject 144, market decision 75
- Question/comparison keywords: 13; long-tail (4+ words): 234; brand/navigational: 39
- Intent mix (heuristic): informational/unclear 429, transactional (tool-use) 169, navigational 41, informational 16, commercial investigation 6
- Question examples: how to practice typing; how to test typing speed; how to typing fast; how to download typing master; how to typing speed; how to master typing; how to typing test; typing vs writing notes for memory
- Relevant-candidate examples: online typing test; english typing test; typing apps for free; typing accuracy test; typing agent free; ar typing test; average typing speed; a paragraph for typing practice; a paragraph for typing test; typing books practice; baba typing test; best keyboard for typing
- Likely-reject examples: typing jobs online; 802 23 typing date; xyz typing game; typing bubble gif; typing games for kids; typing 500 words; typing instructor for kids; www typing com games
- Needs functionality check: seed keywords map to tools only if the tool exists on the live site (not verified).

## stiky_notes.csv

- Total rows: 599; exact duplicates: 0; near-duplicates (same words, different order/punctuation): 18
- Triage: relevant-candidate 66, needs review 287, likely reject 246, market decision 0
- Question/comparison keywords: 24; long-tail (4+ words): 377; brand/navigational: 57
- Intent mix (heuristic): informational/unclear 491, navigational 63, informational 25, commercial investigation 17, transactional (tool-use) 3
- Question examples: how long is a sticky note; what makes sticky notes sticky; what is the meaning of sticky notes; what is sticky note; do sticky notes; how does sticky notes work; why sticky notes not working; is sticky notes free
- Relevant-candidate examples: sticky notes app; sticky notes for desktop; sticky notes for mac; sticky notes online; sticky notes app for mac; sticky notes app that syncs across devices; sticky notes app do i need it; sticky notes app for android; sticky notes app for chromebook; a sticky notes app; how long is a sticky note; what is the meaning of sticky notes
- Likely-reject examples: 1.5 x 2 sticky notes; sticky notes quotes for love; sticky notes 76x76; sticky notes 1x3; gif sticky note; sticky notes 3 x 5; sticky notes 8 for windows 10; sticky notes version history
- Needs functionality check: seed keywords map to tools only if the tool exists on the live site (not verified).

## notepad.csv

- Total rows: 689; exact duplicates: 0; near-duplicates (same words, different order/punctuation): 82
- Triage: relevant-candidate 106, needs review 310, likely reject 273, market decision 0
- Question/comparison keywords: 37; long-tail (4+ words): 177; brand/navigational: 55
- Intent mix (heuristic): transactional (tool-use) 546, navigational 81, informational 36, commercial investigation 26
- Question examples: how to compare two files in notepad ++; how to download notepad ++; how to format json in notepad ++; how to compare in notepad ++; how to install notepad ++; how to convert notepad to pdf; how to compare files in notepad ++; how to download notepad ++ on mac
- Relevant-candidate examples: online notepad; memo notepad; digital notepad; notepad app; notepad++ for mac; notepad free; notepad app for android; notepad app for android free download; notepad app free; notepad app for mac; android notepad; android notepad app
- Likely-reject examples: leather notepad holder; notepad compare two files; neelgagan notepad; notepad download; notepad missing windows 11; 3x6 notepad; notepad yahoo calendar; notepad windows 11 download offline installer
- Needs functionality check: seed keywords map to tools only if the tool exists on the live site (not verified).

## free_online_tools.csv

- Total rows: 462; exact duplicates: 0; near-duplicates (same words, different order/punctuation): 20
- Triage: relevant-candidate 145, needs review 201, likely reject 116, market decision 0
- Question/comparison keywords: 8; long-tail (4+ words): 428; brand/navigational: 30
- Intent mix (heuristic): commercial investigation 391, navigational 35, transactional (tool-use) 26, informational 10
- Question examples: how to convert jpg to excel with free online tools; how might ransomware be spread through free online tools; how to learn ai tools for free online; how to get free tools online; where to buy cheap tools online; free online sales tools or solutions; how can i get free tools; where to get free tools
- Relevant-candidate examples: free online tools; empowering 150+ free online tools; best free online tools; ai free online tools; osint free online tools; great free online tools; pdf free online tools; paraphrasing free online tools; free online tools and calculators; free online assessment tools for students; free online assessment tools for teachers; free online ai tools for image generation
- Likely-reject examples: interior decorating tools online free; 2 free online games; free online drawing tools for kids; free online survey tools uk; adobe acrobat free online tools; similartoolz free online tools fa; pinetools free online tools; tool free games
- Needs functionality check: seed keywords map to tools only if the tool exists on the live site (not verified).

## brainstorming.csv

- Total rows: 613; exact duplicates: 0; near-duplicates (same words, different order/punctuation): 49
- Triage: relevant-candidate 177, needs review 295, likely reject 141, market decision 0
- Question/comparison keywords: 37; long-tail (4+ words): 220; brand/navigational: 32
- Intent mix (heuristic): informational/unclear 468, informational 81, navigational 32, commercial investigation 27, transactional (tool-use) 5
- Question examples: brainwriting vs brainstorming; claude vs chatgpt for brainstorming; difference between brainstorming and mind mapping; difference between brainstorming and brainwriting; do brainstorming; how many types of brainstorming; how to do brainstorming; how does brainstorming help in problem solving
- Relevant-candidate examples: reverse brainstorming; define brainstorming; brainstorming meaning; brainstorming techniques; brainstorming ideas; brainstorming app; brainstorming apps for writers; brainstorming app free; another word for brainstorming session; ai brainstorming tools; app brainstorming; brainstorming bubble map
- Likely-reject examples: 6 aturan brainstorming; 3.6 group discussion brainstorming; 365 brainstorming; notion brainstorming; brainstorming crossword clue; hunxho brainstorming lyrics; brainstorming question crossword clue 7 letters; 5 whys brainstorming
- Needs functionality check: seed keywords map to tools only if the tool exists on the live site (not verified).

## diagram_maker.csv

- Total rows: 599; exact duplicates: 0; near-duplicates (same words, different order/punctuation): 85
- Triage: relevant-candidate 454, needs review 23, likely reject 122, market decision 0
- Question/comparison keywords: 10; long-tail (4+ words): 281; brand/navigational: 23
- Intent mix (heuristic): transactional (tool-use) 533, navigational 24, informational/unclear 17, commercial investigation 13, informational 12
- Question examples: how to make a simple diagram; how to make animated diagrams; how to make a txy diagram; how to make circuit diagram online; how to make a diagram; how to make a diagram in word; how to make a sign diagram; what is a simple diagram
- Relevant-candidate examples: diagram maker; venn diagram maker; er diagram maker; block diagram maker; uml diagram maker; flow diagram maker; use case diagram maker; tree diagram maker; schematic diagram maker; network diagram maker; diagram maker ai; diagram maker ai free
- Likely-reject examples: 9 diagram method; 12v wiring diagram maker; graph maker google sheets; chart maker in canva; how to make circuit diagram online; diagram maker aws; diagram maker for arduino; microsoft diagram maker
- Needs functionality check: seed keywords map to tools only if the tool exists on the live site (not verified).

## online_whiteboard.csv

- Total rows: 463; exact duplicates: 0; near-duplicates (same words, different order/punctuation): 73
- Triage: relevant-candidate 136, needs review 200, likely reject 127, market decision 0
- Question/comparison keywords: 19; long-tail (4+ words): 227; brand/navigational: 58
- Intent mix (heuristic): transactional (tool-use) 340, navigational 72, commercial investigation 36, informational 15
- Question examples: does google have an online whiteboard; what is the best online whiteboard; how to write on online whiteboard; how to use online whiteboard; how to use online whiteboard in google meet; how to create an online whiteboard; how to use miro online whiteboard; how to tutor online whiteboard
- Relevant-candidate examples: free online whiteboard for teaching; draw together online whiteboard; draw online whiteboard; online whiteboard free; simple online whiteboard; interactive online whiteboard; online whiteboard app; online whiteboard app for teaching; online whiteboard app free; online whiteboard alternatives; aww app online whiteboard; whiteboard app online
- Likely-reject examples: whiteboard games for 2 players online; wbo online whiteboard; does google have an online whiteboard; online whiteboard animation video maker free; online whiteboard in google meet; online whiteboard github; 4k whiteboard online; lucid online whiteboard
- Needs functionality check: seed keywords map to tools only if the tool exists on the live site (not verified).