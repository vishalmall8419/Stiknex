/**
 * Stiknex Typing Master — 50 Comprehensive Professional Touch Typing Lessons
 * Structured across 10 Progressive Biomechanical Stages:
 * - Stage 1: Home Row Foundations (Lessons 1 - 5)
 * - Stage 2: Top Row Expansion (Lessons 6 - 10)
 * - Stage 3: Bottom Row Dexterity (Lessons 11 - 15)
 * - Stage 4: Dual-Shift & Capitalization (Lessons 16 - 20)
 * - Stage 5: Number Row Precision (Lessons 21 - 25)
 * - Stage 6: Punctuation & Literary Prose (Lessons 26 - 30)
 * - Stage 7: Developer Syntax & Symbols (Lessons 31 - 35)
 * - Stage 8: Multi-Syllabic Lexicon (Lessons 36 - 40)
 * - Stage 9: Bigrams & Alternating Rolls (Lessons 41 - 45)
 * - Stage 10: Grand Master Certification Marathon (Lessons 46 - 50)
 *
 * Strict progression: Each lesson requires >= 90% accuracy (up to 95% on final exam) to unlock Lesson N+1.
 * Progress persists in localStorage under 'stiknex_typing_unlocked_lesson'.
 */

export const TYPING_STAGES = [
  {
    "id": 1,
    "name": "Stage 1: Home Row Foundations",
    "range": "Lessons 1 - 5",
    "desc": "Build anchor points and hand stability on the central rest row (ASDF JKL;)."
  },
  {
    "id": 2,
    "name": "Stage 2: Top Row Expansion",
    "range": "Lessons 6 - 10",
    "desc": "Vertical upward reaches for high-frequency English vowels and consonants (QWERTY UIOP)."
  },
  {
    "id": 3,
    "name": "Stage 3: Bottom Row Dexterity",
    "range": "Lessons 11 - 15",
    "desc": "Downward curl reaches and lower punctuation marks (ZXCVBNM ,./)."
  },
  {
    "id": 4,
    "name": "Stage 4: Dual-Shift & Capitalization",
    "range": "Lessons 16 - 20",
    "desc": "Independent pinky shift coordination, proper nouns, and geographic places."
  },
  {
    "id": 5,
    "name": "Stage 5: Number Row Precision",
    "range": "Lessons 21 - 25",
    "desc": "Blind reach to top numerical keys, financial amounts, and date formats."
  },
  {
    "id": 6,
    "name": "Stage 6: Punctuation & Literary Prose",
    "range": "Lessons 26 - 30",
    "desc": "Semicolons, colons, hyphens, quotation marks, and complex literary sentence rhythm."
  },
  {
    "id": 7,
    "name": "Stage 7: Developer Syntax & Symbols",
    "range": "Lessons 31 - 35",
    "desc": "Brackets {}, [], (), arrows =>, logical operators, and real code keywords."
  },
  {
    "id": 8,
    "name": "Stage 8: Multi-Syllabic Lexicon",
    "range": "Lessons 36 - 40",
    "desc": "Scientific vocabulary, philosophy, law, and academic multi-syllable word flows."
  },
  {
    "id": 9,
    "name": "Stage 9: Bigrams & Alternating Rolls",
    "range": "Lessons 41 - 45",
    "desc": "Challenging same-finger bigrams, alternating hand rolls, and tricky consonant clusters."
  },
  {
    "id": 10,
    "name": "Stage 10: Grand Master Certification Marathon",
    "range": "Lessons 46 - 50",
    "desc": "Multi-paragraph stamina certifications testing speed, accuracy, and sustained focus."
  }
];

export const TYPING_LESSONS = [
  {
    "id": 1,
    "stage": 1,
    "title": "Home Row Anchors: Index Keys (F & J)",
    "desc": "Feel the tactile bumps on F and J with your index fingers. Maintain floating wrists above your keyboard.",
    "keys": [
      "f",
      "j",
      "space"
    ],
    "minAccuracy": 90,
    "targetWpm": 20,
    "text": "fff jjj fff jjj fjf jfj ff jj ff jj fff jjj fj fj fjf jfj fff jjj ff jj fff jjj fjf jfj ff jj ff jj fff jjj fjf jfj fj fj ff jj fff jjj fjf jfj ff jj fff jjj fjf jfj fj fj ff jj fff jjj ff jj fjf jfj ff jj fff jjj fj fj ff jj fff jjj fjf jfj ff jj ff jj fff jjj fjf jfj ff jj fff jjj fj fj ff jj fff jjj fjf jfj ff jj fff jjj fjf jfj ff jj ff jj fff jjj fjf jfj fj fj ff jj fff jjj ff jj fjf jfj ff jj fff jjj fjf jfj ff jj fff jjj fjf jfj"
  },
  {
    "id": 2,
    "stage": 1,
    "title": "Middle Finger Anchors (D & K)",
    "desc": "Rest left middle finger on D and right middle finger on K. Alternate hands without looking down at keys.",
    "keys": [
      "d",
      "k",
      "f",
      "j"
    ],
    "minAccuracy": 90,
    "targetWpm": 22,
    "text": "ddd kkk ddd kkk dkd kdk dk kd dk kd fdf jkj fdf jkj ddd kkk dkd kdk dk kd fdf jkj ddd kkk dkd kdk dk kd fdf jkj ddd kkk dkd kdk dk kd fdf jkj ddd kkk dkd kdk dk kd fdf jkj fdf jkj dkd kdk ddd kkk dk kd fdf jkj ddd kkk dkd kdk dk kd fdf jkj ddd kkk dkd kdk dk kd fdf jkj ddd kkk dkd kdk dk kd fdf jkj ddd kkk dkd kdk dk kd fdf jkj fdf jkj dkd kdk ddd kkk dk kd fdf jkj ddd kkk dkd kdk dk kd fdf jkj"
  },
  {
    "id": 3,
    "stage": 1,
    "title": "Ring Finger Dexterity (S & L)",
    "desc": "The ring finger is naturally less independent. Keep knuckles stable and avoid excess hand tension.",
    "keys": [
      "s",
      "l",
      "d",
      "k",
      "f",
      "j"
    ],
    "minAccuracy": 90,
    "targetWpm": 24,
    "text": "sss lll sss lll sls lsl sl ls sl ls sds lkl sds lkl fsf jlj fsf jlj sss lll sls lsl sl ls sds lkl fsf jlj sss lll sls lsl sl ls sds lkl fsf jlj sss lll sls lsl sl ls sds lkl fsf jlj sss lll sls lsl sl ls sds lkl fsf jlj sss lll sls lsl sl ls sds lkl fsf jlj sss lll sls lsl sl ls sds lkl fsf jlj sss lll sls lsl sl ls sds lkl fsf jlj sss lll sls lsl sl ls sds lkl fsf jlj sss lll sls lsl sl ls sds lkl fsf jlj"
  },
  {
    "id": 4,
    "stage": 1,
    "title": "Pinky Anchors & Semicolon (A & ;)",
    "desc": "Anchor left pinky on A and right pinky on semicolon. Pinkies must strike lightly without wrist twist.",
    "keys": [
      "a",
      ";",
      "s",
      "l",
      "d",
      "k",
      "f",
      "j"
    ],
    "minAccuracy": 90,
    "targetWpm": 25,
    "text": "aaa ;;; aaa ;;; a;a ;a; a; ;a asdf jkl; asdf jkl; asdf jkl; aaa ;;; a;a ;a; a; ;a asdf jkl; asdf jkl; aaa ;;; a;a ;a; a; ;a asdf jkl; asdf jkl; aaa ;;; a;a ;a; a; ;a asdf jkl; asdf jkl; aaa ;;; a;a ;a; a; ;a asdf jkl; asdf jkl; aaa ;;; a;a ;a; a; ;a asdf jkl; asdf jkl; aaa ;;; a;a ;a; a; ;a asdf jkl; asdf jkl; aaa ;;; a;a ;a; a; ;a asdf jkl; asdf jkl; aaa ;;; a;a ;a; a; ;a asdf jkl; asdf jkl;"
  },
  {
    "id": 5,
    "stage": 1,
    "title": "Complete Home Row: Real English Vocabulary",
    "desc": "Form genuine English words using only the 8 home row keys. Maintain a smooth, rhythmic cadence.",
    "keys": [
      "a",
      "s",
      "d",
      "f",
      "j",
      "k",
      "l",
      ";"
    ],
    "minAccuracy": 90,
    "targetWpm": 28,
    "text": "a fall lad ask salad flask salsa alfalfa salad fall lad ask flask salad dad fads lads alas salad asks falls dads fads salads flash flasks fall salad lad asks dad alfalfa alas fads lads flask salad asks falls dads fads salads flash flasks fall salad lad asks dad alfalfa alas fads lads flask salad asks falls dads fads salads flash flasks fall salad lad asks dad alfalfa alas fads lads flask salad asks falls dads fads salads flash flasks"
  },
  {
    "id": 6,
    "stage": 2,
    "title": "Top Row Vowels: E & I",
    "desc": "Reach upward with your left middle finger to E and right middle finger to I, returning to home row.",
    "keys": [
      "e",
      "i",
      "d",
      "k",
      "f",
      "j"
    ],
    "minAccuracy": 90,
    "targetWpm": 30,
    "text": "ded kik ded kik de ki fee die kid life idle silk seek side like bike dive dial file feed fell fill feed life like die kid silk idle side dial feed kid life like seek bike side file fill dive fell idle feed life seek bike dial file side feed fell kid idle like die silk seek side like bike dive dial file feed fell fill feed life like die kid silk idle side dial feed kid life like seek bike side file fill dive fell idle feed"
  },
  {
    "id": 7,
    "stage": 2,
    "title": "Top Row Consonants: R & U",
    "desc": "Reach upward with your left index finger to R and right index finger to U.",
    "keys": [
      "r",
      "u",
      "f",
      "j",
      "e",
      "i"
    ],
    "minAccuracy": 90,
    "targetWpm": 32,
    "text": "frf juj frf juj fr ju fur rug run jug jar cure surf pure true user rust rude rule dark sure lure fire dire wire tire ruin rush rust ruth fur rug run jug jar cure surf pure true user rust rude rule dark sure lure fire dire wire tire ruin rush rust ruth fur rug run jug jar cure surf pure true user rust rude rule dark sure lure fire dire wire tire ruin rush rust ruth fur rug run jug jar cure surf pure true user"
  },
  {
    "id": 8,
    "stage": 2,
    "title": "Top Row Vowel & Consonant: T & Y",
    "desc": "Extend your index fingers upward and inward to reach T and Y. Do not shift your resting wrists.",
    "keys": [
      "t",
      "y",
      "f",
      "j",
      "r",
      "u"
    ],
    "minAccuracy": 90,
    "targetWpm": 32,
    "text": "ftf jyj ftf jyj ft jy try yet tiny duty tray city easy stay they your type rate year tell tidy duty tasty dryly try yet tiny duty tray city easy stay they your type rate year tell tidy duty tasty dryly try yet tiny duty tray city easy stay they your type rate year tell tidy duty tasty dryly try yet tiny duty tray city easy stay they your type rate year tell tidy duty tasty dryly try yet tiny duty tray city easy stay they your"
  },
  {
    "id": 9,
    "stage": 2,
    "title": "Top Row Pinky Reaches: Q & P",
    "desc": "Reach outward and upward with your pinky fingers to reach Q and P. Return to A and ; immediately.",
    "keys": [
      "q",
      "p",
      "a",
      ";",
      "e",
      "r",
      "t",
      "y",
      "u",
      "i",
      "o"
    ],
    "minAccuracy": 90,
    "targetWpm": 34,
    "text": "aqa ;p; aqa ;p; qa ;p quit park quick pure port query pride plot spot drop quiet quote paper equip pride pace keep trip ripe post peak port equip drop quiet quote paper quick pure plot spot query pride quiet quote paper quick pure plot spot query pride pace keep trip ripe post peak port equip drop quiet quote paper quick pure plot spot query pride quiet quote paper quick pure plot spot query pride pace keep trip ripe"
  },
  {
    "id": 10,
    "stage": 2,
    "title": "Complete Top & Home Row Synthesis",
    "desc": "Synthesize full sentences using top and home rows. Focus on seamless hand coordination.",
    "keys": [
      "q",
      "w",
      "e",
      "r",
      "t",
      "y",
      "u",
      "i",
      "o",
      "p",
      "a",
      "s",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      ";"
    ],
    "minAccuracy": 90,
    "targetWpm": 35,
    "text": "the quick quiet writer wrote great poetry while the proud eagle flew high over the deep green forest trees. every poet tried to write pure lines with true power and poise. they thought deeply about their work and kept their ideals pure. early sunrise revealed quiet paths through the old quiet woods where tired travelers found rest and peaceful shelter. the quick quiet writer wrote great poetry while the proud eagle flew high over the trees."
  },
  {
    "id": 11,
    "stage": 3,
    "title": "Bottom Row Middle Curls: C & M",
    "desc": "Curl left middle finger down to C and right index finger to M without shifting your home anchor.",
    "keys": [
      "c",
      "m",
      "d",
      "k",
      "f",
      "j"
    ],
    "minAccuracy": 90,
    "targetWpm": 35,
    "text": "dcd jmj dcd jmj dc jm com mac cam calm claim cream music come came mock much farm calm march chime mica climb camp custom micro match com mac cam calm claim cream music come came mock much farm calm march chime mica climb camp custom micro match com mac cam calm claim cream music come came mock much farm calm march chime mica climb camp custom micro match com mac cam calm claim cream music come came mock"
  },
  {
    "id": 12,
    "stage": 3,
    "title": "Bottom Row Index Reaches: V & N",
    "desc": "Extend your index fingers downward to V and N smoothly. Keep typing movement light and elastic.",
    "keys": [
      "v",
      "n",
      "f",
      "j",
      "c",
      "m"
    ],
    "minAccuracy": 90,
    "targetWpm": 36,
    "text": "fvf jnj fvf jnj fv jn van now vine nine vein view vain voice nave nova vent novel never vine navy van now vine nine vein view vain voice nave nova vent novel never vine navy van now vine nine vein view vain voice nave nova vent novel never vine navy van now vine nine vein view vain voice nave nova vent novel never vine navy van now vine nine vein view vain voice nave nova vent novel never vine navy"
  },
  {
    "id": 13,
    "stage": 3,
    "title": "Bottom Row Inner & Outer Stretches: B & X",
    "desc": "Reach index finger diagonally inward to B and left ring finger down to X.",
    "keys": [
      "b",
      "x",
      "f",
      "s",
      "v",
      "c"
    ],
    "minAccuracy": 90,
    "targetWpm": 36,
    "text": "fbf sxs fbf sxs fb sx box boy back basic text exam exact curb herb labor noble boast box boy back basic text exam exact curb herb labor noble boast box boy back basic text exam exact curb herb labor noble boast box boy back basic text exam exact curb herb labor noble boast box boy back basic text exam exact curb herb labor noble boast box boy back basic text exam exact curb herb labor noble boast"
  },
  {
    "id": 14,
    "stage": 3,
    "title": "Bottom Row Pinky Reaches: Z & Punctuation (, and .)",
    "desc": "Curl left pinky down to Z, right middle finger to comma, and right ring finger to period.",
    "keys": [
      "z",
      ",",
      ".",
      "a",
      "k",
      "l"
    ],
    "minAccuracy": 90,
    "targetWpm": 36,
    "text": "aza k,k l.l aza k,k l.l zero, zeal, zone, zoom, size, maze, haze, blaze. quick, calm, bold. we saw zero zeal, great calm, and true focus. size, maze, haze, blaze. quick, calm, bold. we saw zero zeal, great calm, and true focus. zero, zeal, zone, zoom, size, maze, haze, blaze. quick, calm, bold. we saw zero zeal, great calm, and true focus. size, maze, haze, blaze. quick, calm, bold. we saw zero zeal."
  },
  {
    "id": 15,
    "stage": 3,
    "title": "Three-Row Full Alphabet Symphony",
    "desc": "Integrate all 26 lowercase alphabet letters across the entire standard keyboard canvas.",
    "keys": [
      "all 26 lowercase letters"
    ],
    "minAccuracy": 90,
    "targetWpm": 38,
    "text": "the quick brown fox jumps over the lazy dog near the quiet river bank. five boxing wizards jump quickly around the magical glowing crystal sphere. pack my red box with five dozen modern liquor jugs. crazy fredrick bought many very exquisite opal jewels from the strange old bazaar. every good typist learns to coordinate all ten fingers across every single row with precision and steady discipline."
  },
  {
    "id": 16,
    "stage": 4,
    "title": "Opposite-Hand Shift Pinky Discipline",
    "desc": "Hold right Shift with your right pinky for left-hand capitals; hold left Shift for right-hand capitals.",
    "keys": [
      "ShiftLeft",
      "ShiftRight",
      "all letters"
    ],
    "minAccuracy": 90,
    "targetWpm": 38,
    "text": "Rome Tokyo London Delhi Paris Berlin Madrid Cairo Vienna Oslo Stockholm Dublin Prague Warsaw Athens Seoul Lima Ottawa Nairobi Santiago Rome Tokyo London Delhi Paris Berlin Madrid Cairo Vienna Oslo Stockholm Dublin Prague Warsaw Athens Seoul Lima Ottawa Nairobi Santiago Rome Tokyo London Delhi Paris Berlin Madrid Cairo Vienna Oslo Stockholm Dublin Prague Warsaw Athens Seoul Lima Ottawa Nairobi Santiago"
  },
  {
    "id": 17,
    "stage": 4,
    "title": "Proper Nouns & Global Geography",
    "desc": "Capitalize names of oceans, mountains, and continents smoothly without losing forward typing momentum.",
    "keys": [
      "Shift",
      "proper nouns"
    ],
    "minAccuracy": 90,
    "targetWpm": 40,
    "text": "The Atlantic Ocean touches Europe and Africa, while the Pacific Ocean stretches across Asia and the Americas. Mount Everest rises high above Nepal and Tibet. The Amazon River runs deeply through Brazil and Peru. Mount Kilimanjaro overlooks the plains of Tanzania. Across the Mediterranean Sea, ships travel between Greece, Italy, and Egypt under clear blue summer skies."
  },
  {
    "id": 18,
    "stage": 4,
    "title": "Historical Figures & Scientific Innovators",
    "desc": "Practice sustained capital letters in names, titles, and institutions.",
    "keys": [
      "Shift",
      "historical names"
    ],
    "minAccuracy": 90,
    "targetWpm": 40,
    "text": "Albert Einstein, Isaac Newton, Marie Curie, Charles Darwin, Ada Lovelace, and Alan Turing transformed our understanding of physics, mathematics, and computation. Galileo Galilei observed Jupiter with an early telescope in Padua. Nikola Tesla pioneered alternating current electricity in New York. Rosalind Franklin contributed vital radiographic data toward discovering DNA structure."
  },
  {
    "id": 19,
    "stage": 4,
    "title": "Conversational Dialogue & Quoted Speech",
    "desc": "Coordinate quotation marks, commas, capitalized speech starts, and periods.",
    "keys": [
      "Shift",
      "quotes",
      "dialogue"
    ],
    "minAccuracy": 90,
    "targetWpm": 42,
    "text": "\"Look closely at the data,\" Dr. Evans whispered quietly. \"Every single sample confirms our initial hypothesis.\" Marcus replied, \"We must proceed with utmost caution before publishing these findings.\" \"Indeed,\" agreed Sophia. \"The scientific community demands thorough replication and empirical rigor before any conclusion is accepted.\""
  },
  {
    "id": 20,
    "stage": 4,
    "title": "Formal Professional Correspondence",
    "desc": "Type formal executive email correspondence with salutations, dates, and closing signatures.",
    "keys": [
      "Shift",
      "formal prose"
    ],
    "minAccuracy": 90,
    "targetWpm": 42,
    "text": "Dear Dr. Harrison, Thank you for reviewing our comprehensive Q3 Technical Architecture Report. Our engineering team has implemented all recommendations regarding database indexing and cache invalidation. We look forward to meeting with your steering committee this Thursday afternoon in Chicago. Sincerely, Elizabeth Vance, Principal Solutions Architect."
  },
  {
    "id": 21,
    "stage": 5,
    "title": "Left-Hand Number Row (1, 2, 3, 4, 5)",
    "desc": "Reach upward from home row with left fingers: pinky to 1, ring to 2, middle to 3, index to 4 and 5.",
    "keys": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "minAccuracy": 90,
    "targetWpm": 32,
    "text": "111 222 333 444 555 12 23 34 45 54 43 32 21 135 242 314 521 142 531 245 12345 54321 111 222 333 444 555 12 23 34 45 54 43 32 21 135 242 314 521 142 531 245 12345 54321 111 222 333 444 555 12 23 34 45 54 43 32 21 135 242 314 521 142 531 245 12345 54321 111 222 333 444 555 12 23 34 45 54 43 32 21 135 242 314"
  },
  {
    "id": 22,
    "stage": 5,
    "title": "Right-Hand Number Row (6, 7, 8, 9, 0)",
    "desc": "Reach upward with right fingers: index to 6 and 7, middle to 8, ring to 9, pinky to 0.",
    "keys": [
      "6",
      "7",
      "8",
      "9",
      "0"
    ],
    "minAccuracy": 90,
    "targetWpm": 32,
    "text": "666 777 888 999 000 67 78 89 90 09 98 87 76 680 791 802 67890 09876 666 777 888 999 000 67 78 89 90 09 98 87 76 680 791 802 67890 09876 666 777 888 999 000 67 78 89 90 09 98 87 76 680 791 802 67890 09876 666 777 888 999 000 67 78 89 90 09 98 87 76 680 791 802 67890 09876 666 777 888"
  },
  {
    "id": 23,
    "stage": 5,
    "title": "Calendar Dates, Years & Chronologies",
    "desc": "Type mixed alphanumeric calendar strings and historical dates without glancing down.",
    "keys": [
      "0-9",
      "dates"
    ],
    "minAccuracy": 90,
    "targetWpm": 35,
    "text": "The Apollo 11 lunar landing occurred on July 20, 1969. The World Wide Web was introduced in 1989 by Tim Berners-Lee. On October 14, 1066, the Battle of Hastings took place in England. The United States Declaration of Independence was adopted on July 4, 1776. The year 2026 marks another milestone in high-performance digital tools."
  },
  {
    "id": 24,
    "stage": 5,
    "title": "Financial Currency & Numerical Data",
    "desc": "Type dollar amounts, percentages, invoice totals, and numeric metric values.",
    "keys": [
      "$",
      "%",
      "0-9",
      ".",
      ","
    ],
    "minAccuracy": 90,
    "targetWpm": 35,
    "text": "The quarterly revenue reached $4,850,200, reflecting an annual growth of 18.5%. Operating expenses totaled $2,120,400 with a net margin of 24.8%. The capital expenditure budget was set at $750,000 for server infrastructure, while user acquisition costs dropped by 12.4% down to $34.50 per verified account."
  },
  {
    "id": 25,
    "stage": 5,
    "title": "Scientific Coordinates & Mathematical Units",
    "desc": "Blend numbers with scientific metric units (kg, m/s, km, GHz, Mbps).",
    "keys": [
      "0-9",
      "scientific units"
    ],
    "minAccuracy": 90,
    "targetWpm": 36,
    "text": "The telescope tracked a celestial body located at coordinates 14h 29m 42s right ascension and -62° 40' declination, approximately 4.24 light-years away. The satellite orbit altitude was measured at 550 km with an orbital speed of 7.6 km/s. Radio telemetry was broadcast at 2.45 GHz across a 100 Mbps uplink channel."
  },
  {
    "id": 26,
    "stage": 6,
    "title": "Complex Punctuation: Semicolons & Colons",
    "desc": "Master the semicolon (;) and colon (:) with proper spacing before and after.",
    "keys": [
      ";",
      ":",
      "Shift"
    ],
    "minAccuracy": 90,
    "targetWpm": 38,
    "text": "Patience is not simply the ability to wait; it is how we behave while we are waiting. Consider three primary virtues: discipline, curiosity, and integrity. He knew the risks were formidable; nonetheless, he proceeded with steady determination. The criteria were clear: reliability, speed, security, and elegant simplicity."
  },
  {
    "id": 27,
    "stage": 6,
    "title": "Hyphens, Dashes & Parenthetical Clauses",
    "desc": "Type compound words with hyphens (-) and parenthetical remarks (like this) smoothly.",
    "keys": [
      "-",
      "(",
      ")"
    ],
    "minAccuracy": 90,
    "targetWpm": 40,
    "text": "The state-of-the-art computational engine (developed over three grueling years) demonstrated exceptional fault-tolerance under load. User-friendly interfaces require deep, long-term engineering discipline. Well-designed architectures prevent high-priority regressions in production-grade software applications."
  },
  {
    "id": 28,
    "stage": 6,
    "title": "Literary Prose: Classic Victorian Rhythm",
    "desc": "Type expansive 19th-century descriptive prose with rich adjectives and punctuation.",
    "keys": [
      "classic literature"
    ],
    "minAccuracy": 90,
    "targetWpm": 42,
    "text": "It was a crisp, autumn morning; the golden sunlight filtered gently through the ancient oak branches, casting intricate patterns upon the damp stone courtyard. The air smelled of woodsmoke and rain-washed earth. In the quiet distance, church bells chimed softly across the tranquil valley, welcoming the dawn."
  },
  {
    "id": 29,
    "stage": 6,
    "title": "Philosophical Discourse: Epistemology & Logic",
    "desc": "Challenging philosophical sentences exploring logic, truth, and scientific deduction.",
    "keys": [
      "philosophy",
      "logic"
    ],
    "minAccuracy": 90,
    "targetWpm": 44,
    "text": "Empirical observation forms the bedrock of rational inquiry; yet, human perception remains fundamentally susceptible to systematic cognitive biases. To distinguish valid causal relationships from mere statistical correlation requires rigorous experimentation, falsifiable hypotheses, and transparent peer replication."
  },
  {
    "id": 30,
    "stage": 6,
    "title": "Literary Mastery: Extended Narration",
    "desc": "Long-form narrative prose with varied sentence lengths and expressive punctuation.",
    "keys": [
      "narrative"
    ],
    "minAccuracy": 90,
    "targetWpm": 45,
    "text": "Far beyond the northern mountain passes, where glacial winds swept across desolate tundra, ancient watchtowers stood silent against the twilight sky. For centuries, travelers had spoken of forgotten cities buried beneath perpetual snow. Every solitary stone seemed to whisper quiet legends of courage, perseverance, and forgotten wisdom."
  },
  {
    "id": 31,
    "stage": 7,
    "title": "Brackets, Braces & Parentheses: {}, [], ()",
    "desc": "Coordinate curly braces {}, square brackets [], and parentheses () with pinkies and shifts.",
    "keys": [
      "{",
      "}",
      "[",
      "]",
      "(",
      ")"
    ],
    "minAccuracy": 90,
    "targetWpm": 32,
    "text": "function parse({ data, options = {} }) { const items = [data.id, data.name]; if (items.length > 0) { return { status: 200, payload: items[0] }; } return null; } const matrix = [[1, 2], [3, 4]]; const config = { active: true, ports: [3000, 8080] }; console.log(parse({ data: { id: 42, name: \"Stiknex\" } }));"
  },
  {
    "id": 32,
    "stage": 7,
    "title": "Comparison & Logical Operators: ===, &&, ||, !=",
    "desc": "Type programming operators with equal signs, ampersands, exclamation marks, and pipes.",
    "keys": [
      "=",
      "&",
      "|",
      "!",
      "<",
      ">"
    ],
    "minAccuracy": 90,
    "targetWpm": 34,
    "text": "if (user.role === \"admin\" && user.status === \"active\") { accessGranted = true; } else if (user.role !== \"guest\" || isSuperUser) { accessGranted = (score >= 80 && level > 2); } const isValid = Boolean(token && !isExpired && (attempts <= 3)); const result = (a !== b) ? (x + y) : (x * y);"
  },
  {
    "id": 33,
    "stage": 7,
    "title": "Modern JavaScript & TypeScript Syntax",
    "desc": "Real async/await, arrow functions, object destructuring, and template literals.",
    "keys": [
      "JavaScript",
      "TypeScript"
    ],
    "minAccuracy": 90,
    "targetWpm": 36,
    "text": "export const fetchUserData = async (userId: string): Promise<User> => {\n  const response = await fetch(`/api/users/${encodeURIComponent(userId)}`, {\n    headers: { \"Content-Type\": \"application/json\" },\n  });\n  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);\n  const { user } = await response.json();\n  return user;\n};"
  },
  {
    "id": 34,
    "stage": 7,
    "title": "Python Data Science & Algorithms",
    "desc": "Python list comprehensions, lambda expressions, and algorithmic functions.",
    "keys": [
      "Python"
    ],
    "minAccuracy": 90,
    "targetWpm": 36,
    "text": "def compute_metrics(records):\n    cleaned = [r for r in records if r.get('active', False)]\n    values = list(map(lambda x: x['score'] * 1.5, cleaned))\n    total = sum(values)\n    mean = total / max(1, len(values))\n    return {\n        'count': len(cleaned),\n        'mean': round(mean, 2),\n        'is_passing': mean >= 75.0\n    }"
  },
  {
    "id": 35,
    "stage": 7,
    "title": "SQL Relational Queries & Database Schema",
    "desc": "Uppercase SQL keywords with table aliases, joins, and aggregates.",
    "keys": [
      "SQL"
    ],
    "minAccuracy": 90,
    "targetWpm": 38,
    "text": "SELECT o.order_id, c.customer_name, SUM(oi.quantity * oi.unit_price) AS total_amount\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.customer_id\nLEFT JOIN order_items oi ON o.order_id = oi.order_id\nWHERE o.order_date >= '2026-01-01' AND o.status = 'COMPLETED'\nGROUP BY o.order_id, c.customer_name\nHAVING total_amount > 500.00\nORDER BY total_amount DESC\nLIMIT 25;"
  },
  {
    "id": 36,
    "stage": 8,
    "title": "Biological & Anatomical Terminology",
    "desc": "Challenging anatomical and medical terms with complex vowel combinations.",
    "keys": [
      "medical",
      "biology"
    ],
    "minAccuracy": 90,
    "targetWpm": 40,
    "text": "The physiological homeostasis of eukaryotic organisms relies upon mitochondrial respiration, phosphorylation pathways, and deoxyribonucleic acid replication. Endothelial microvascular networks regulate hemodynamic equilibrium, preventing cardiovascular arteriosclerosis and hypercholesterolemia across arterial pathways."
  },
  {
    "id": 37,
    "stage": 8,
    "title": "Legal Jurisprudence & Statutory Language",
    "desc": "Formal contractual terminology with intricate punctuation and archaic phrasing.",
    "keys": [
      "legal"
    ],
    "minAccuracy": 90,
    "targetWpm": 42,
    "text": "Notwithstanding anything to the contrary herein contained, the indemnifying party hereby agrees to defend, indemnify, and hold harmless the indemnified entity against any and all liabilities, adjudications, damages, and expenditures arising out of any material breach of fiduciary responsibility or statutory noncompliance."
  },
  {
    "id": 38,
    "stage": 8,
    "title": "Astrophysical & Cosmological Phenomena",
    "desc": "Cosmic terminology including gravitational singularities, interferometry, and nucleosynthesis.",
    "keys": [
      "astrophysics"
    ],
    "minAccuracy": 90,
    "targetWpm": 44,
    "text": "Supermassive black holes at the center of active galactic nuclei accelerate accretion disks to relativistic velocities, emitting synchrotron radiation across electromagnetic spectra. Gravitational wave interferometry measures minute spatial perturbations caused by binary neutron star coalescence across cosmic distances."
  },
  {
    "id": 39,
    "stage": 8,
    "title": "Computational Complexity & Graph Theory",
    "desc": "Algorithms, asymptotic big-O notation, NP-completeness, and graph traversal.",
    "keys": [
      "computer science"
    ],
    "minAccuracy": 90,
    "targetWpm": 45,
    "text": "Determining whether deterministic polynomial-time algorithms can solve nondeterministic polynomial-time problems remains the foremost unsolved dilemma in theoretical computer science. Topological sorting of directed acyclic graphs requires linear traversal utilizing depth-first search or Kahn's algorithm with O(V + E) complexity."
  },
  {
    "id": 40,
    "stage": 8,
    "title": "Economic Macro-Analysis & Quantitative Finance",
    "desc": "Macroeconomic inflation, liquidity, derivatives, and algorithmic trade execution.",
    "keys": [
      "finance",
      "economics"
    ],
    "minAccuracy": 90,
    "targetWpm": 46,
    "text": "Central bank monetary policy balancing quantitative tightening against persistent inflationary pressures directly impacts sovereign bond yields, currency exchange volatility, and collateralized debt obligations. High-frequency arbitrage systems execute statistical cointegration strategies within microseconds."
  },
  {
    "id": 41,
    "stage": 9,
    "title": "High-Frequency English Bigrams (th, he, in, er, an)",
    "desc": "Train muscle memory for the most common 2-letter bigram rolls in English.",
    "keys": [
      "bigrams"
    ],
    "minAccuracy": 92,
    "targetWpm": 48,
    "text": "the there their then they them other rather mother father brother together another in enter into winter winner inner dinner under under land and hand stand brand strand grand demand expand command the there their then they them other rather mother father brother together another in enter into winter winner inner dinner under land and hand stand brand strand grand demand expand command"
  },
  {
    "id": 42,
    "stage": 9,
    "title": "Tricky Same-Finger Bigrams (ed, de, un, nu, ce, ec)",
    "desc": "Same-finger sequences require rapid vertical finger recovery without wrist jerk.",
    "keys": [
      "same finger"
    ],
    "minAccuracy": 92,
    "targetWpm": 48,
    "text": "ded ed ed ded deduce deduct decide declare degrade detect defend defeat under number tune nun null nuance certain century cellar receive decimal decline deduce deduct decide declare degrade detect defend defeat under number tune nun null nuance certain century cellar receive decimal decline deduce deduct decide declare degrade detect defend defeat under number"
  },
  {
    "id": 43,
    "stage": 9,
    "title": "Inward & Outward Hand Rolls (ion, ent, ing, ould)",
    "desc": "Smooth inward rolls mimic a piano arpeggio. Let fingers roll effortlessly.",
    "keys": [
      "hand rolls"
    ],
    "minAccuracy": 92,
    "targetWpm": 50,
    "text": "action nation option creation section friction mention mention client talent silent movement element payment running singing thinking writing building bringing would could should would could should action nation option creation section friction client talent silent movement element payment running singing thinking writing building bringing would could should"
  },
  {
    "id": 44,
    "stage": 9,
    "title": "Awkward Consonant Clusters (str, scr, spl, thr, chr)",
    "desc": "Multi-consonant clusters require balanced bilateral hand coordination.",
    "keys": [
      "consonant clusters"
    ],
    "minAccuracy": 92,
    "targetWpm": 50,
    "text": "structure strong stream strict struggle screen scratch script scribe scroll splash split splendid splinter splice throat through thrive thread threshold chronology chronic chrome chronicle structure strong stream strict struggle screen scratch script scribe scroll splash split splendid splinter splice throat through thrive thread threshold chronology chronic chrome chronicle"
  },
  {
    "id": 45,
    "stage": 9,
    "title": "Bilingual Borrowings & International Lexicon",
    "desc": "Words adopted into English with distinctive rhythmic cadences.",
    "keys": [
      "loan words"
    ],
    "minAccuracy": 92,
    "targetWpm": 52,
    "text": "renaissance silhouette rendezvous gourmet boutique silhouette avant-garde cliché façade tsunami origami karaoke kimono canyon fiesta siesta patio guerrilla kindergarten blitzzeitgeist angst wanderlust fjord smorgasbord kiosk robot czar bazaar caravan zenith nadir alkali algebra zero hazard cipher magazine"
  },
  {
    "id": 46,
    "stage": 10,
    "title": "The Lincoln Gettysburg Address Marathon",
    "desc": "Historic rhetorical masterpiece demanding flawless rhythmic cadence and zero typos.",
    "keys": [
      "historical speech"
    ],
    "minAccuracy": 92,
    "targetWpm": 55,
    "text": "Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal. Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battlefield of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this."
  },
  {
    "id": 47,
    "stage": 10,
    "title": "UN Universal Declaration of Human Rights",
    "desc": "Formal international legal treaty text with solemn legal terms and long clauses.",
    "keys": [
      "human rights"
    ],
    "minAccuracy": 92,
    "targetWpm": 55,
    "text": "Whereas recognition of the inherent dignity and of the equal and inalienable rights of all members of the human family is the foundation of freedom, justice and peace in the world, Whereas disregard and contempt for human rights have resulted in barbarous acts which have outraged the conscience of mankind, All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood."
  },
  {
    "id": 48,
    "stage": 10,
    "title": "Software Engineering Clean Code Manifesto",
    "desc": "Professional software design thesis emphasizing refactoring and readability.",
    "keys": [
      "software engineering"
    ],
    "minAccuracy": 93,
    "targetWpm": 60,
    "text": "Clean code is not written by chance; it is the deliberate result of relentless refactoring, disciplined test-driven development, and unambiguous naming conventions. Bad code tries to do too much; clean code is focused, elegant, and readable. You know you are reading clean code when each routine you read turns out to be pretty much what you expected. Master engineers take professional responsibility for the clarity and longevity of every single line they ship to production."
  },
  {
    "id": 49,
    "stage": 10,
    "title": "Scientific Synthesis: Quantum Mechanics & Relativity",
    "desc": "Rigorous scientific essay harmonizing micro and macro physics.",
    "keys": [
      "scientific essay"
    ],
    "minAccuracy": 94,
    "targetWpm": 62,
    "text": "The fundamental tension between general relativity—which describes gravity as smooth geometric curvature of four-dimensional spacetime—and quantum field theory—which models fundamental interactions via discrete probabilistic field excitations—represents the ultimate frontier of theoretical physics. Any coherent theory of quantum gravity must reconcile the singularity of black hole event horizons with unitary quantum mechanics and information conservation."
  },
  {
    "id": 50,
    "stage": 10,
    "title": "The Ultimate Grand Master Typist Marathon Exam",
    "desc": "Final certification exam. 250+ words blending literature, numbers, code, and philosophy. Pass requirement: ≥95% accuracy.",
    "keys": [
      "all keyboard keys",
      "symbols",
      "numbers"
    ],
    "minAccuracy": 95,
    "targetWpm": 65,
    "text": "True mastery in touch typing is not merely about rapid velocity; it is the complete synchronization of mind, intention, and biomechanical movement. When fingers float gracefully across the keyboard—striking home keys, numerical rows, and complex programming syntax with zero hesitation—the physical machine disappears, leaving pure thought transcribed into reality. In the digital era of 2026, where lines of code (such as `const velocity = distance / time;`) govern global infrastructure, the disciplined typist wields tremendous creative power. Maintain your focus; breathe steadily; honor the craft. Congratulations on reaching the pinnacle of the Stiknex 50-Lesson Master Curriculum!"
  }
];
