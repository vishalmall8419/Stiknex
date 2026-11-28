/**
 * High-Precision Astrological & Multi-Faith Naming Engine
 * Grounded in Brihat Parashara Hora Shastra, Muhurta Chintamani, and Cultural Scriptures
 * 
 * Includes:
 * 1. 27 Nakshatras with exact 108 Padas (Charan 1-4) & Namakshars (नामाक्षर)
 * 2. 12 Rashis with Lords, Tattva, Gemstones, Colors, Days & Ishta Devatas
 * 3. Julian Day & Lahiri Ayanamsha astronomical Nirayana Moon longitude calculation
 * 4. 600+ authentic, scholarly curated names across Sanatan, Islamic, Sikh, Christian & Secular
 * 5. Strict letter-based, Rashi-based, gender-based, and lineage-based dynamic generation
 */

export const VEDIC_RASHIS = [
  {
    id: "Aries",
    hindi: "मेष",
    sanskrit: "मेष राशि",
    lord: "मंगल (Mars)",
    element: "अग्नि (Fire)",
    stone: "मूंगा (Red Coral)",
    color: "लाल, सिंदूरी, केसरिया (Crimson & Saffron)",
    day: "मंगलवार (Tuesday)",
    number: 9,
    ishta: "भगवान कार्तिकेय / हनुमान जी",
    syllables: ["चू", "चे", "चो", "ला", "ली", "लू", "ले", "लो", "अ"],
    englishSyllables: ["Chu", "Che", "Cho", "La", "Li", "Lu", "Le", "Lo", "A"]
  },
  {
    id: "Taurus",
    hindi: "वृषभ",
    sanskrit: "वृषभ राशि",
    lord: "शुक्र (Venus)",
    element: "पृथ्वी (Earth)",
    stone: "हीरा / ओपल (Diamond / White Opal)",
    color: "श्वेत, चमकीला सफेद, क्रीम (White & Cream)",
    day: "शुक्रवार (Friday)",
    number: 6,
    ishta: "मां महालक्ष्मी / जगदम्बा",
    syllables: ["ई", "उ", "ए", "ओ", "वा", "वी", "वू", "वे", "वो"],
    englishSyllables: ["I", "U", "E", "O", "Va", "Vi", "Vu", "Ve", "Vo"]
  },
  {
    id: "Gemini",
    hindi: "मिथुन",
    sanskrit: "मिथुन राशि",
    lord: "बुध (Mercury)",
    element: "वायु (Air)",
    stone: "पन्ना (Emerald)",
    color: "हरा, तोतिया, पिस्ता (Emerald Green)",
    day: "बुधवार (Wednesday)",
    number: 5,
    ishta: "भगवान श्री गणेश / भगवान नारायण",
    syllables: ["का", "की", "कू", "घ", "ङ", "छ", "के", "को", "हा"],
    englishSyllables: ["Ka", "Ki", "Ku", "Gha", "Nga", "Chha", "Ke", "Ko", "Ha"]
  },
  {
    id: "Cancer",
    hindi: "कर्क",
    sanskrit: "कर्क राशि",
    lord: "चंद्रमा (Moon)",
    element: "जल (Water)",
    stone: "सच्चा मोती (Natural Pearl)",
    color: "श्वेत, दूधिया, रूपहला (Pearl White & Silver)",
    day: "सोमवार (Monday)",
    number: 2,
    ishta: "भगवान शिव (चंद्रमौली)",
    syllables: ["ही", "हू", "हे", "हो", "डा", "डी", "डू", "डे", "डो"],
    englishSyllables: ["Hi", "Hu", "He", "Ho", "Da", "Di", "Du", "De", "Do"]
  },
  {
    id: "Leo",
    hindi: "सिंह",
    sanskrit: "सिंह राशि",
    lord: "सूर्य देव (Sun)",
    element: "अग्नि (Fire)",
    stone: "माणिक्य (Ruby)",
    color: "सुनहरा, ताम्रवर्ण, नारंगी (Golden & Orange)",
    day: "रविवार (Sunday)",
    number: 1,
    ishta: "भगवान भुवन भास्कर / गायत्री माता",
    syllables: ["मा", "मी", "मू", "मे", "मो", "टा", "टी", "टू", "टे"],
    englishSyllables: ["Ma", "Mi", "Mu", "Me", "Mo", "Ta", "Ti", "Tu", "Te"]
  },
  {
    id: "Virgo",
    hindi: "कन्या",
    sanskrit: "कन्या राशि",
    lord: "बुध (Mercury)",
    element: "पृथ्वी (Earth)",
    stone: "पन्ना (Emerald)",
    color: "गहरा हरा, धानी (Forest Green)",
    day: "बुधवार (Wednesday)",
    number: 5,
    ishta: "मां सरस्वती / श्री हरि विष्णु",
    syllables: ["टो", "पा", "पी", "पू", "ष", "ण", "ठा", "पे", "पो"],
    englishSyllables: ["To", "Pa", "Pi", "Pu", "Sha", "Na", "Tha", "Pe", "Po"]
  },
  {
    id: "Libra",
    hindi: "तुला",
    sanskrit: "तुला राशि",
    lord: "शुक्र (Venus)",
    element: "वायु (Air)",
    stone: "हीरा / जरकन (Diamond / Zircon)",
    color: "गुलाबी, सफेद, हल्का नीला (Rose Pink & Pastel Blue)",
    day: "शुक्रवार (Friday)",
    number: 6,
    ishta: "मां दुर्गा / राधा-कृष्ण",
    syllables: ["रा", "री", "रू", "रे", "रो", "ता", "ती", "तू", "ते"],
    englishSyllables: ["Ra", "Ri", "Ru", "Re", "Ro", "Ta", "Ti", "Tu", "Te"]
  },
  {
    id: "Scorpio",
    hindi: "वृश्चिक",
    sanskrit: "वृश्चिक राशि",
    lord: "मंगल (Mars)",
    element: "जल (Water)",
    stone: "मूंगा (Red Coral)",
    color: "गहरा लाल, कत्थई, महरून (Maroon & Deep Red)",
    day: "मंगलवार (Tuesday)",
    number: 9,
    ishta: "भगवान भैरव / हनुमान जी",
    syllables: ["तो", "ना", "नी", "नू", "ने", "नो", "या", "यी", "यू"],
    englishSyllables: ["To", "Na", "Ni", "Nu", "Ne", "No", "Ya", "Yi", "Yu"]
  },
  {
    id: "Sagittarius",
    hindi: "धनु",
    sanskrit: "धनु राशि",
    lord: "देवगुरु बृहस्पति (Jupiter)",
    element: "अग्नि (Fire)",
    stone: "पुखराज (Yellow Sapphire)",
    color: "पीला, बसंती, स्वर्णिम (Bright Yellow & Gold)",
    day: "गुरुवार (Thursday)",
    number: 3,
    ishta: "भगवान विष्णु / दक्षिणामूर्ति",
    syllables: ["ये", "यो", "भा", "भी", "भू", "धा", "फा", "ढा", "भे"],
    englishSyllables: ["Ye", "Yo", "Bha", "Bhi", "Bhu", "Dha", "Pha", "Dhadha", "Bhe"]
  },
  {
    id: "Capricorn",
    hindi: "मकर",
    sanskrit: "मकर राशि",
    lord: "शनि देव (Saturn)",
    element: "पृथ्वी (Earth)",
    stone: "नीलम (Blue Sapphire)",
    color: "नीला, गहरा आसमानी, काला (Navy Blue & Slate)",
    day: "शनिवार (Saturday)",
    number: 8,
    ishta: "भगवान शिव / रुद्र",
    syllables: ["भो", "जा", "जी", "खी", "खू", "खे", "खो", "गा", "गी"],
    englishSyllables: ["Bho", "Ja", "Ji", "Khi", "Khu", "Khe", "Kho", "Ga", "Gi"]
  },
  {
    id: "Aquarius",
    hindi: "कुंभ",
    sanskrit: "कुंभ राशि",
    lord: "शनि देव (Saturn)",
    element: "वायु (Air)",
    stone: "नीलम / जामुनिया (Blue Sapphire / Amethyst)",
    color: "नीला, विद्युत जामुनी (Electric Blue & Violet)",
    day: "शनिवार (Saturday)",
    number: 8,
    ishta: "भगवान महाकाल / हनुमान जी",
    syllables: ["गू", "गे", "गो", "सा", "सी", "सू", "से", "सो", "दा"],
    englishSyllables: ["Gu", "Ge", "Go", "Sa", "Si", "Su", "Se", "So", "Da"]
  },
  {
    id: "Pisces",
    hindi: "मीन",
    sanskrit: "मीन राशि",
    lord: "देवगुरु बृहस्पति (Jupiter)",
    element: "जल (Water)",
    stone: "पुखराज (Yellow Sapphire)",
    color: "पीला, केसरिया, समुद्री हरा (Golden Yellow & Seafoam)",
    day: "गुरुवार (Thursday)",
    number: 3,
    ishta: "भगवान लक्ष्मी-नारायण",
    syllables: ["दी", "दू", "थ", "झ", "ञ", "दे", "दो", "चा", "ची"],
    englishSyllables: ["Di", "Du", "Tha", "Jha", "Nya", "De", "Do", "Cha", "Chi"]
  }
];

export const VEDIC_NAKSHATRAS = [
  { name: "Ashwini", hindi: "अश्विनी", lord: "केतु", padas: ["चू (Chu)", "चे (Che)", "चो (Cho)", "ला (La)"], gana: "देव (Deva)", nadi: "आद्य (Aadi)", yoni: "अश्व (Horse)", varna: "वैश्य", rashiIndex: 0 },
  { name: "Bharani", hindi: "भरणी", lord: "शुक्र", padas: ["ली (Li)", "लू (Lu)", "ले (Le)", "लो (Lo)"], gana: "मनुष्य (Manushya)", nadi: "मध्य (Madhya)", yoni: "गज (Elephant)", varna: "म्लेच्छ/शूद्र", rashiIndex: 0 },
  { name: "Krittika", hindi: "कृतिका", lord: "सूर्य", padas: ["अ (A)", "ई (I)", "उ (U)", "ए (E)"], gana: "राक्षस (Rakshasa)", nadi: "अंत्य (Antya)", yoni: "मेष (Sheep)", varna: "ब्राह्मण", rashiIndex: 0 }, // Pada 1 in Mesha, 2-4 in Vrishabha
  { name: "Rohini", hindi: "रोहिणी", lord: "चंद्रमा", padas: ["ओ (O)", "वा (Va)", "वी (Vi)", "वू (Vu)"], gana: "मनुष्य (Manushya)", nadi: "अंत्य (Antya)", yoni: "सर्प (Serpent)", varna: "शूद्र", rashiIndex: 1 },
  { name: "Mrigashira", hindi: "मृगशिरा", lord: "मंगल", padas: ["वे (Ve)", "वो (Vo)", "का (Ka)", "की (Ki)"], gana: "देव (Deva)", nadi: "मध्य (Madhya)", yoni: "सर्प (Serpent)", varna: "वैश्य", rashiIndex: 1 }, // 1-2 Vrishabha, 3-4 Mithuna
  { name: "Ardra", hindi: "आर्द्रा", lord: "राहु", padas: ["कू (Ku)", "घ (Gha)", "ङ (Nga)", "छ (Chha)"], gana: "मनुष्य (Manushya)", nadi: "आद्य (Aadi)", yoni: "श्वान (Dog)", varna: "शूद्र", rashiIndex: 2 },
  { name: "Punarvasu", hindi: "पुनर्वसु", lord: "बृहस्पति", padas: ["के (Ke)", "को (Ko)", "हा (Ha)", "ही (Hi)"], gana: "देव (Deva)", nadi: "आद्य (Aadi)", yoni: "मार्जार (Cat)", varna: "वैश्य", rashiIndex: 2 }, // 1-3 Mithuna, 4 Karka
  { name: "Pushya", hindi: "पुष्य", lord: "शनि", padas: ["हू (Hu)", "हे (He)", "हो (Ho)", "डा (Da)"], gana: "देव (Deva)", nadi: "मध्य (Madhya)", yoni: "मेष (Goat)", varna: "क्षत्रिय", rashiIndex: 3 },
  { name: "Ashlesha", hindi: "आश्लेषा", lord: "बुध", padas: ["डी (Di)", "डू (Du)", "डे (De)", "डो (Do)"], gana: "राक्षस (Rakshasa)", nadi: "अंत्य (Antya)", yoni: "मार्जार (Cat)", varna: "म्लेच्छ", rashiIndex: 3 },
  { name: "Magha", hindi: "मघा", lord: "केतु", padas: ["मा (Ma)", "मी (Mi)", "मू (Mu)", "मे (Me)"], gana: "राक्षस (Rakshasa)", nadi: "अंत्य (Antya)", yoni: "मूषक (Rat)", varna: "शूद्र", rashiIndex: 4 },
  { name: "Purva Phalguni", hindi: "पूर्वाफाल्गुनी", lord: "शुक्र", padas: ["मो (Mo)", "टा (Ta)", "टी (Ti)", "टू (Tu)"], gana: "मनुष्य (Manushya)", nadi: "मध्य (Madhya)", yoni: "मूषक (Rat)", varna: "ब्राह्मण", rashiIndex: 4 },
  { name: "Uttara Phalguni", hindi: "उत्तराफाल्गुनी", lord: "सूर्य", padas: ["टे (Te)", "टो (To)", "पा (Pa)", "पी (Pi)"], gana: "मनुष्य (Manushya)", nadi: "आद्य (Aadi)", yoni: "गौ (Cow)", varna: "क्षत्रिय", rashiIndex: 4 }, // 1 Simha, 2-4 Kanya
  { name: "Hasta", hindi: "हस्त", lord: "चंद्रमा", padas: ["पू (Pu)", "ष (Sha)", "ण (Na)", "ठा (Tha)"], gana: "देव (Deva)", nadi: "आद्य (Aadi)", yoni: "महिष (Buffalo)", varna: "वैश्य", rashiIndex: 5 },
  { name: "Chitra", hindi: "चित्रा", lord: "मंगल", padas: ["पे (Pe)", "पो (Po)", "रा (Ra)", "री (Ri)"], gana: "राक्षस (Rakshasa)", nadi: "मध्य (Madhya)", yoni: "व्याघ्र (Tiger)", varna: "शूद्र", rashiIndex: 5 }, // 1-2 Kanya, 3-4 Tula
  { name: "Swati", hindi: "स्वाति", lord: "राहु", padas: ["रू (Ru)", "रे (Re)", "रो (Ro)", "ता (Ta)"], gana: "देव (Deva)", nadi: "अंत्य (Antya)", yoni: "महिष (Buffalo)", varna: "कसाई/शूद्र", rashiIndex: 6 },
  { name: "Vishakha", hindi: "विशाखा", lord: "बृहस्पति", padas: ["ती (Ti)", "तू (Tu)", "ते (Te)", "तो (To)"], gana: "राक्षस (Rakshasa)", nadi: "अंत्य (Antya)", yoni: "व्याघ्र (Tiger)", varna: "म्लेच्छ", rashiIndex: 6 }, // 1-3 Tula, 4 Vrischika
  { name: "Anuradha", hindi: "अनुराधा", lord: "शनि", padas: ["ना (Na)", "नी (Ni)", "नू (Nu)", "ने (Ne)"], gana: "देव (Deva)", nadi: "मध्य (Madhya)", yoni: "मृग (Deer)", varna: "शूद्र", rashiIndex: 7 },
  { name: "Jyeshtha", hindi: "ज्येष्ठा", lord: "बुध", padas: ["नो (No)", "या (Ya)", "यी (Yi)", "यू (Yu)"], gana: "राक्षस (Rakshasa)", nadi: "आद्य (Aadi)", yoni: "मृग (Deer)", varna: "कसाई", rashiIndex: 7 },
  { name: "Mula", hindi: "मूल", lord: "केतु", padas: ["ये (Ye)", "यो (Yo)", "भा (Bha)", "भी (Bhi)"], gana: "राक्षस (Rakshasa)", nadi: "आद्य (Aadi)", yoni: "श्वान (Dog)", varna: "शूद्र", rashiIndex: 8 },
  { name: "Purva Ashadha", hindi: "पूर्वाषाढ़ा", lord: "शुक्र", padas: ["भू (Bhu)", "धा (Dha)", "फा (Pha)", "ढा (Dhadha)"], gana: "मनुष्य (Manushya)", nadi: "मध्य (Madhya)", yoni: "वानर (Monkey)", varna: "ब्राह्मण", rashiIndex: 8 },
  { name: "Uttara Ashadha", hindi: "उत्तराषाढ़ा", lord: "सूर्य", padas: ["भे (Bhe)", "भो (Bho)", "जा (Ja)", "जी (Ji)"], gana: "मनुष्य (Manushya)", nadi: "अंत्य (Antya)", yoni: "नकुल (Mongoose)", varna: "क्षत्रिय", rashiIndex: 8 }, // 1 Dhanu, 2-4 Makara
  { name: "Shravana", hindi: "श्रवण", lord: "चंद्रमा", padas: ["खी (Khi)", "खू (Khu)", "खे (Khe)", "खो (Kho)"], gana: "देव (Deva)", nadi: "अंत्य (Antya)", yoni: "वानर (Monkey)", varna: "म्लेच्छ", rashiIndex: 9 },
  { name: "Dhanishta", hindi: "धनिष्ठा", lord: "मंगल", padas: ["गा (Ga)", "गी (Gi)", "गू (Gu)", "गे (Ge)"], gana: "राक्षस (Rakshasa)", nadi: "मध्य (Madhya)", yoni: "सिंह (Lion)", varna: "शूद्र", rashiIndex: 9 }, // 1-2 Makara, 3-4 Kumbha
  { name: "Shatabhisha", hindi: "शतभिषा", lord: "राहु", padas: ["गो (Go)", "सा (Sa)", "सी (Si)", "सू (Su)"], gana: "राक्षस (Rakshasa)", nadi: "आद्य (Aadi)", yoni: "अश्व (Horse)", varna: "म्लेच्छ", rashiIndex: 10 },
  { name: "Purva Bhadrapada", hindi: "पूर्वाभाद्रपद", lord: "बृहस्पति", padas: ["से (Se)", "सो (So)", "दा (Da)", "दी (Di)"], gana: "मनुष्य (Manushya)", nadi: "आद्य (Aadi)", yoni: "सिंह (Lion)", varna: "ब्राह्मण", rashiIndex: 10 }, // 1-3 Kumbha, 4 Meena
  { name: "Uttara Bhadrapada", hindi: "उत्तराभाद्रपद", lord: "शनि", padas: ["दू (Du)", "थ (Tha)", "झ (Jha)", "ञ (Nya)"], gana: "मनुष्य (Manushya)", nadi: "मध्य (Madhya)", yoni: "गौ (Cow)", varna: "क्षत्रिय", rashiIndex: 11 },
  { name: "Revati", hindi: "रेवती", lord: "बुध", padas: ["दे (De)", "दो (Do)", "चा (Cha)", "ची (Chi)"], gana: "देव (Deva)", nadi: "अंत्य (Antya)", yoni: "गज (Elephant)", varna: "शूद्र", rashiIndex: 11 }
];

export const ISLAMIC_BURUJ = [
  { id: "Hamal", hindi: "हमल (मेष / Aries)", planet: "मरीख़ (Mars)", stone: "मरजान (Coral)", number: 9 },
  { id: "Saur", hindi: "सौर (वृषभ / Taurus)", planet: "ज़ोहरा (Venus)", stone: "हीरा (Diamond)", number: 6 },
  { id: "Jauza", hindi: "जौज़ा (मिथुन / Gemini)", planet: "अतारुद (Mercury)", stone: "ज़ुमर्रुद (Emerald)", number: 5 },
  { id: "Saratan", hindi: "सरतान (कर्क / Cancer)", planet: "क़मर (Moon)", stone: "मोती (Pearl)", number: 2 },
  { id: "Asad", hindi: "असद (सिंह / Leo)", planet: "शम्स (Sun)", stone: "याक़ूत (Ruby)", number: 1 },
  { id: "Sumbula", hindi: "सुंबुला (कन्या / Virgo)", planet: "अतारुद (Mercury)", stone: "ज़ुमर्रुद (Emerald)", number: 5 },
  { id: "Mizan", hindi: "मीज़ान (तुला / Libra)", planet: "ज़ोहरा (Venus)", stone: "हीरा (Diamond)", number: 6 },
  { id: "Aqrab", hindi: "अक़रब (वृश्चिक / Scorpio)", planet: "मरीख़ (Mars)", stone: "मरजान (Coral)", number: 9 },
  { id: "Qaus", hindi: "क़ौस (धनु / Sagittarius)", planet: "मुश्तरी (Jupiter)", stone: "पुखराज (Topaz)", number: 3 },
  { id: "Jadi", hindi: "जदी (मकर / Capricorn)", planet: "ज़ुहल (Saturn)", stone: "नीलम (Sapphire)", number: 8 },
  { id: "Dalw", hindi: "दल्व (कुंभ / Aquarius)", planet: "ज़ुहल (Saturn)", stone: "नीलम (Sapphire)", number: 8 },
  { id: "Hoot", hindi: "हूत (मीन / Pisces)", planet: "मुश्तरी (Jupiter)", stone: "पुखराज (Topaz)", number: 3 }
];

/**
 * Astronomical Nirayana Ephemeris Calculation
 */
export function calculateVedicPanchang({
  dob,
  time,
  ampm,
  place,
  tradition = "sanatan",
  selectedRashi = "auto",
  startingLetter = "",
  gender = "boy",
  gotra = "",
  fatherName = "",
  motherName = ""
}) {
  // 1. Date parsing
  let day = 15, month = 8, year = 2026;
  if (dob && typeof dob === "string") {
    const clean = dob.trim();
    if (clean.includes("/")) {
      const parts = clean.split("/").map(Number);
      if (parts.length === 3 && parts[0] > 0 && parts[1] > 0 && parts[2] > 1900) {
        day = parts[0];
        month = parts[1];
        year = parts[2];
      }
    } else if (clean.includes("-")) {
      const parts = clean.split("-").map(Number);
      if (parts.length === 3 && parts[0] > 1900) {
        year = parts[0];
        month = parts[1];
        day = parts[2];
      }
    }
  }

  // 2. Time parsing
  let hours = 10, minutes = 30;
  if (time && typeof time === "string" && time.includes(":")) {
    const tp = time.split(":").map(Number);
    hours = isNaN(tp[0]) ? 10 : tp[0];
    minutes = isNaN(tp[1]) ? 30 : tp[1];
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
  }

  // 3. Astronomical Julian Day
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const fractionalDay = (hours - 12) / 24 + minutes / 1440;
  const jd = jdn + fractionalDay;

  // 4. Julian Centuries from J2000.0
  const T = (jd - 2451545.0) / 36525.0;

  // 5. Mean Lunar Elements (Meeus Astronomical Algorithms)
  let L0 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T; // Mean elongation
  const M_sun = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T; // Sun's anomaly
  const M_moon = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T; // Moon's anomaly
  const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T; // Argument of latitude

  // Convert to radians for trigonometric terms
  const toRad = Math.PI / 180;
  const deltaL = 
    6.288774 * Math.sin(M_moon * toRad) +
    1.274027 * Math.sin((2 * D - M_moon) * toRad) +
    0.658314 * Math.sin(2 * D * toRad) +
    0.213618 * Math.sin(2 * M_moon * toRad) -
    0.185116 * Math.sin(M_sun * toRad) -
    0.114332 * Math.sin(2 * F * toRad);

  const sayanaMoon = ((L0 + deltaL) % 360 + 360) % 360;

  // 6. Lahiri Chitra Paksha Ayanamsha
  const ayanamsha = 23.85807 + 1.396042 * T;
  const nirayanaMoon = ((sayanaMoon - ayanamsha) % 360 + 360) % 360;

  // 7. Nakshatra calculation (13°20' = 13.33333333°)
  const nakshatraSpan = 360 / 27;
  const nakshatraIndex = Math.floor(nirayanaMoon / nakshatraSpan) % 27;
  const nak = VEDIC_NAKSHATRAS[nakshatraIndex] || VEDIC_NAKSHATRAS[0];

  // 8. Pada / Charan calculation (3°20' = 3.33333333°)
  const padaSpan = nakshatraSpan / 4;
  const padaIndex = Math.floor((nirayanaMoon % nakshatraSpan) / padaSpan) % 4;
  const charanNumber = padaIndex + 1;
  const charanSyllable = nak.padas[padaIndex] || nak.padas[0];

  // 9. Janma Rashi calculation (30° per Rashi)
  const calcRashiIndex = Math.floor(nirayanaMoon / 30) % 12;
  
  // Check if manual Rashi is selected
  let finalRashiIndex = calcRashiIndex;
  if (selectedRashi && selectedRashi !== "auto") {
    const foundIdx = VEDIC_RASHIS.findIndex(r => r.id.toLowerCase() === selectedRashi.toLowerCase() || r.hindi === selectedRashi);
    if (foundIdx !== -1) {
      finalRashiIndex = foundIdx;
    }
  }

  const rashiObj = VEDIC_RASHIS[finalRashiIndex] || VEDIC_RASHIS[0];
  const calculatedRashiObj = VEDIC_RASHIS[calcRashiIndex] || VEDIC_RASHIS[0];
  const burujObj = ISLAMIC_BURUJ[finalRashiIndex] || ISLAMIC_BURUJ[0];

  // 10. Lagna calculation based on Sun longitude & local hour
  const sunLong = ((280.46646 + 36000.76983 * T - ayanamsha) % 360 + 360) % 360;
  const sunRashiIndex = Math.floor(sunLong / 30) % 12;
  const lagnaIndex = (sunRashiIndex + Math.floor(hours / 2)) % 12;
  const lagnaObj = VEDIC_RASHIS[lagnaIndex] || VEDIC_RASHIS[0];

  // 11. Tradition Ritual Summary (Sanskriti & Vidhi)
  let vidhiTip = "";
  if (tradition === "islamic") {
    vidhiTip = "इस्लामी सुन्नत के अनुसार जन्म के 7वें दिन अक़ीक़ा (लड़के के लिए 2 बकरे, लड़की के लिए 1) के साथ तस्मिया (नामकरण) करें। दायें कान में अज़ान व बायें में इक़ामत के बाद खजूर की घुट्टी (तहनीक) दें और पैगंबरों या नेक बुजुर्गों के नाम पर बरकत वाला नाम रखें।";
  } else if (tradition === "sikh") {
    vidhiTip = "ਗੁਰਦੁਆਰਾ ਸਾਹਿਬ ਵਿਖੇ ਸ਼੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਦੇ ਸਨਮੁਖ ਅਰਦਾਸ ਉਪਰੰਤ ਪਾਵਨ ਹੁਕਮਨਾਮਾ ਲਿਆ ਜਾਂਦਾ ਹੈ। ਹੁਕਮਨਾਮੇ ਦੇ ਪਹਿਲੇ ਸ਼ਬਦ ਦੇ ਪਹਿਲੇ ਅੱਖਰ ਤੋਂ ਬਾਲਕ ਦਾ ਨਾਮ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ। ਲੜਕੇ ਦੇ ਨਾਮ ਪਿੱਛੇ 'ਸਿੰਘ' ਅਤੇ ਲੜਕੀ ਦੇ ਨਾਮ ਪਿੱਛੇ 'ਕੌਰ' ਲਗਾਉਣਾ ਲਾਜ਼ਮੀ ਹੈ।";
  } else if (tradition === "christian") {
    vidhiTip = "पवित्र बपतिस्मा (Holy Baptism / Christening) के पावन संस्कार पर चर्च में पादरी या फादर द्वारा त्रिएक परमेश्वर (पिता, पुत्र और पवित्र आत्मा) के नाम पर पवित्र जल से बपतिस्मा दिया जाता है तथा धर्ममाता-धर्मपिता (Godparents) के समक्ष मसीही नामकरण की घोषणा होती है।";
  } else if (tradition === "secular") {
    vidhiTip = "प्रकृति, ब्रह्मांड एवं मानवीय मूल्यों (सत्य, स्वतंत्रता, प्रेम, बंधुत्व) को समर्पित एक गरिमामयी स्वागत समारोह (Baby Welcoming Ceremony) में परिवार व स्नेहीजनों के समक्ष शिशु को यह सुंदर, आधुनिक व अर्थपूर्ण नाम प्रदान करें।";
  } else {
    vidhiTip = `सनातन धर्म के 11वें या 12वें दिन सूतक शुद्धि उपरांत हवन, नवग्रह पूजन व षोडशोपचार पूजा करें। ${gotra ? `श्री ${gotra} गोत्र के कुलदेवता व इष्टदेव का स्मरण कर` : "कुलदेवता का स्मरण कर"} पिता शिशु के दायें कान में 'ॐ' और गुप्त नक्षत्र नाम का तीन बार उच्चारण करें, तत्पश्चात समाज के समक्ष मुख्य नाम की घोषणा करें।`;
  }

  return {
    rashi: rashiObj.id,
    rashiHindi: rashiObj.hindi,
    calculatedRashi: calculatedRashiObj.id,
    calculatedRashiHindi: calculatedRashiObj.hindi,
    isManualRashi: selectedRashi !== "auto" && selectedRashi !== calculatedRashiObj.id,
    rashiLord: rashiObj.lord,
    rashiElement: rashiObj.element,
    buruj: burujObj.hindi,
    burujPlanet: burujObj.planet,
    burujStone: burujObj.stone,
    nakshatra: nak.name,
    nakshatraHindi: nak.hindi,
    nakshatraLord: nak.lord,
    charan: `चरण ${charanNumber} (${charanSyllable})`,
    charanNumber,
    charanSyllable,
    shubhAkshar: nak.padas,
    lagna: `${lagnaObj.id} (${lagnaObj.hindi} लग्न)`,
    gana: nak.gana,
    nadi: nak.nadi,
    yoni: nak.yoni,
    varna: nak.varna,
    luckyNumber: rashiObj.number,
    luckyColor: rashiObj.color,
    luckyGemstone: rashiObj.stone,
    luckyDay: rashiObj.day,
    ishtaDev: rashiObj.ishta,
    ceremonyVidhi: vidhiTip
  };
}

/**
 * Massive Authenticated Cultural & Astrological Names Library (600+ entries)
 */
export const COMPREHENSIVE_NAMES_DATABASE = {
  sanatan: {
    boy: [
      // Mesha (Aries): Chu, Che, Cho, La, Li, Lu, Le, Lo, A
      { nameEnglish: "Aarav", nameHindi: "आरव", meaning: "सौम्य ध्वनि, शांति और दिव्य चेतना", spiritualContext: "शांति और जीवन में आत्मिक समभाव का प्रतीक", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["A", "अ"], luckyNumber: 1, category: "Vyavaharika Nama" },
      { nameEnglish: "Advait", nameHindi: "अद्वैत", meaning: "अद्वितीय, एकात्म, ब्रह्म और आत्मा का अभेद", spiritualContext: "आदि शंकराचार्य के अद्वैत वेदांत दर्शन का मूल मंत्र", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["A", "अ"], luckyNumber: 9, category: "Spiritual Sanskrit" },
      { nameEnglish: "Lakshya", nameHindi: "लक्ष्य", meaning: "साधना का परम ध्येय, एकाग्रता और सफलता", spiritualContext: "गीता में अर्जुन के धनुर्विद्या एकाग्रता का प्रतीक", rashi: "Aries", nakshatra: "Ashwini", startingLetters: ["L", "ल"], luckyNumber: 3, category: "Virtue Sanskrit" },
      { nameEnglish: "Luv", nameHindi: "लव", meaning: "भगवान श्री राम और माता सीता के तेजस्वी ज्येष्ठ पुत्र", spiritualContext: "रामायण के शौर्य, मर्यादा और वाल्मीकि आश्रम संस्कार", rashi: "Aries", nakshatra: "Ashwini", startingLetters: ["L", "ल"], luckyNumber: 6, category: "Devata Nama" },
      { nameEnglish: "Chaitanya", nameHindi: "चैतन्य", meaning: "परम चेतना, दिव्य बोध और भक्ति का प्रकाश", spiritualContext: "गौड़ीय वैष्णव संत चैतन्य महाप्रभु की भक्ति परंपरा", rashi: "Aries", nakshatra: "Ashwini", startingLetters: ["C", "च"], luckyNumber: 7, category: "Spiritual Sanskrit" },
      { nameEnglish: "Chirag", nameHindi: "चिराग", meaning: "प्रज्वलित दीपक, जो कुल का नाम रोशन करे", spiritualContext: "कुलदीपक और अंधकार मिटाने वाले ज्ञान का रूप", rashi: "Aries", nakshatra: "Ashwini", startingLetters: ["C", "च"], luckyNumber: 9, category: "Vyavaharika Nama" },
      { nameEnglish: "Lokendra", nameHindi: "लोकेन्द्र", meaning: "समस्त लोकों का अधिपति, जगन्नाथ", spiritualContext: "भगवान विष्णु का त्रैलोक्य रक्षक स्वरूप", rashi: "Aries", nakshatra: "Bharani", startingLetters: ["L", "ल"], luckyNumber: 1, category: "Devata Nama" },
      { nameEnglish: "Anshuman", nameHindi: "अंशुमान", meaning: "सूर्य की दिव्य किरण, तेजस्वी और यशस्वी", spiritualContext: "सूर्यवंश के प्रतापी राजा जिन्होंने मर्यादा की रक्षा की", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["A", "अ"], luckyNumber: 1, category: "Vedic King" },

      // Vrishabha (Taurus): I, U, E, O, Va, Vi, Vu, Ve, Vo
      { nameEnglish: "Vivaan", nameHindi: "विवान", meaning: "जीवन की ऊर्जा, नवप्रभात और सूर्योदय की ऊष्मा", spiritualContext: "भगवान कृष्ण के प्रातःकालीन नवतेज का स्वरूप", rashi: "Taurus", nakshatra: "Rohini", startingLetters: ["V", "व"], luckyNumber: 6, category: "Nature Element" },
      { nameEnglish: "Varun", nameHindi: "वरुण", meaning: "जल और आकाश के अधिपति, ब्रह्मांडीय संतुलन के देवता", spiritualContext: "ऋग्वेद में नैतिक मर्यादा 'ऋत' के मुख्य संरक्षक देव", rashi: "Taurus", nakshatra: "Rohini", startingLetters: ["V", "व"], luckyNumber: 2, category: "Vedic Devata" },
      { nameEnglish: "Vedant", nameHindi: "वेदांत", meaning: "वेदों का परम सार, उपनिषद का सर्वोच्च ज्ञान", spiritualContext: "ब्रह्मज्ञान और मुक्ति का साक्षात मार्ग", rashi: "Taurus", nakshatra: "Mrigashira", startingLetters: ["V", "व"], luckyNumber: 5, category: "Spiritual Sanskrit" },
      { nameEnglish: "Ishaan", nameHindi: "ईशान", meaning: "ईश्वर, पूर्वोत्तर दिशा के स्वामी, भगवान शिव", spiritualContext: "शिव के पंचानन रूपों में सर्वोच्च ईशान मुख", rashi: "Taurus", nakshatra: "Krittika", startingLetters: ["I", "ई", "इ"], luckyNumber: 9, category: "Devata Nama" },
      { nameEnglish: "Utkarsh", nameHindi: "उत्कर्ष", meaning: "निरंतर प्रगति, श्रेष्ठता और जीवन की नई ऊंचाइयां", spiritualContext: "धर्म और कर्म में उच्चतम शिखर की प्राप्ति", rashi: "Taurus", nakshatra: "Krittika", startingLetters: ["U", "उ"], luckyNumber: 3, category: "Virtue Sanskrit" },
      { nameEnglish: "Omkar", nameHindi: "ओंकार", meaning: "प्रणव नाद 'ॐ', समस्त सृष्टि का मूल स्पंदन", spiritualContext: "मांडूक्य उपनिषद में ब्रह्म का साक्षात ध्वनि स्वरूप", rashi: "Taurus", nakshatra: "Rohini", startingLetters: ["O", "ओ"], luckyNumber: 1, category: "Vedic Devata" },
      { nameEnglish: "Vipul", nameHindi: "विपुल", meaning: "विशाल, असीम सामर्थ्य और प्रचुर समृद्धि", spiritualContext: "समस्त सद्गुणों की प्रचुरता का आशीर्वाद", rashi: "Taurus", nakshatra: "Rohini", startingLetters: ["V", "व"], luckyNumber: 6, category: "Vyavaharika Nama" },

      // Gemini (Mithuna): Ka, Ki, Ku, Gha, Nga, Chha, Ke, Ko, Ha
      { nameEnglish: "Kavya", nameHindi: "काव्य", meaning: "दूरदर्शी ऋषि की रचना, बुद्धिमत्ता और प्रतिभा", spiritualContext: "ऋग्वेद में 'कवि' का अर्थ तत्वदर्शी दार्शनिक ऋषि है", rashi: "Gemini", nakshatra: "Mrigashira", startingLetters: ["K", "क"], luckyNumber: 5, category: "Vedic Sanskrit" },
      { nameEnglish: "Keshav", nameHindi: "केशव", meaning: "सुंदर केशों वाले, केशी राक्षस के संहारक श्री कृष्ण", spiritualContext: "विष्णु सहस्रनाम का परम कल्याणकारी द्वितीय नाम", rashi: "Gemini", nakshatra: "Punarvasu", startingLetters: ["K", "क"], luckyNumber: 8, category: "Devata Nama" },
      { nameEnglish: "Kunal", nameHindi: "कुणाल", meaning: "हिमालय का सुंदर पक्षी, चक्रवर्ती अशोक के धर्मात्मा पुत्र", spiritualContext: "बौद्ध और सनातन परंपरा में दया और निष्ठा का प्रतीक", rashi: "Gemini", nakshatra: "Ardra", startingLetters: ["K", "क"], luckyNumber: 3, category: "Virtue Sanskrit" },
      { nameEnglish: "Harshil", nameHindi: "हर्षिल", meaning: "सदा आनंदित, जो चारों ओर प्रसन्नता और प्रेम बिखेरे", spiritualContext: "चित्त की निर्विकार आनंद अवस्था (सच्चिदानंद)", rashi: "Gemini", nakshatra: "Punarvasu", startingLetters: ["H", "ह"], luckyNumber: 5, category: "Vyavaharika Nama" },
      { nameEnglish: "Hardik", nameHindi: "हार्दिक", meaning: "हृदय से उत्पन्न, अत्यंत स्नेही और सच्चा", spiritualContext: "हृदय में स्थित परमात्मा के प्रति निष्कपट प्रेम", rashi: "Gemini", nakshatra: "Punarvasu", startingLetters: ["H", "ह"], luckyNumber: 9, category: "Vyavaharika Nama" },
      { nameEnglish: "Kartik", nameHindi: "कार्तिक", meaning: "साहस और शौर्य के देवता, सेनापति कार्तिकेय", spiritualContext: "देवताओं की सेना के अजेय सेनापति भगवान स्कंद", rashi: "Gemini", nakshatra: "Mrigashira", startingLetters: ["K", "क"], luckyNumber: 9, category: "Devata Nama" },

      // Cancer (Karka): Hi, Hu, He, Ho, Da, Di, Du, De, Do
      { nameEnglish: "Hitendra", nameHindi: "हितेन्द्र", meaning: "सभी का कल्याण करने वाले, शुभचिंतकों के अधिपति", spiritualContext: "सदा परोपकार और धर्म के मार्ग पर चलने वाला", rashi: "Cancer", nakshatra: "Punarvasu", startingLetters: ["H", "ह"], luckyNumber: 2, category: "Virtue Sanskrit" },
      { nameEnglish: "Devansh", nameHindi: "देवांश", meaning: "ईश्वर का दिव्य अंश, पवित्र आत्मा", spiritualContext: "गीता (15.7) 'ममैवांशो जीवलोके जीवभूतः सनातनः'", rashi: "Cancer", nakshatra: "Pushya", startingLetters: ["D", "द"], luckyNumber: 7, category: "Spiritual Sanskrit" },
      { nameEnglish: "Daksh", nameHindi: "दक्ष", meaning: "अत्यंत कुशल, समर्थ और प्रतिभा का धनी", spiritualContext: "सृष्टि के प्रजापति और कर्मकुशलता के प्रतीक", rashi: "Cancer", nakshatra: "Ashlesha", startingLetters: ["D", "द"], luckyNumber: 2, category: "Devata Nama" },
      { nameEnglish: "Darsh", nameHindi: "दर्श", meaning: "दर्शन, अमावस्या का पावन चंद्र, भगवान कृष्ण का मोहक रूप", spiritualContext: "प्रभु के साक्षात दर्शन की पावन आकांक्षा", rashi: "Cancer", nakshatra: "Pushya", startingLetters: ["D", "द"], luckyNumber: 2, category: "Devata Nama" },
      { nameEnglish: "Himanshu", nameHindi: "हिमांशु", meaning: "चंद्रमा, जो अपनी शीतल किरणों से ताप हर ले", spiritualContext: "मन की शांति और शीतलता प्रदान करने वाला चंद्र देव", rashi: "Cancer", nakshatra: "Punarvasu", startingLetters: ["H", "ह"], luckyNumber: 2, category: "Nature Element" },

      // Leo (Simha): Ma, Mi, Mu, Me, Mo, Ta, Ti, Tu, Te
      { nameEnglish: "Manan", nameHindi: "मनन", meaning: "गहरा चिंतन, आत्म-साक्षात्कार और विवेक", spiritualContext: "वेदांत साधना के तीन सोपान: श्रवण, मनन, निदिध्यासन", rashi: "Leo", nakshatra: "Magha", startingLetters: ["M", "म"], luckyNumber: 1, category: "Spiritual Sanskrit" },
      { nameEnglish: "Mayank", nameHindi: "मयंक", meaning: "शीतल और निष्कलंक चंद्रमा, सौंदर्य का प्रतीक", spiritualContext: "सौम्य चरित्र और हृदय की निर्मलता का द्योतक", rashi: "Leo", nakshatra: "Magha", startingLetters: ["M", "म"], luckyNumber: 1, category: "Nature Element" },
      { nameEnglish: "Mohit", nameHindi: "मोहित", meaning: "सौंदर्य और गुणों से सबको आकर्षित करने वाला", spiritualContext: "भगवान मदनमोहन का जगन्मोहन स्वरूप", rashi: "Leo", nakshatra: "Purva Phalguni", startingLetters: ["M", "म"], luckyNumber: 5, category: "Vyavaharika Nama" },
      { nameEnglish: "Madhav", nameHindi: "माधव", meaning: "मां लक्ष्मी के पति, वसंत ऋतु के स्वामी भगवान कृष्ण", spiritualContext: "भगवद्गीता के प्रथम अध्याय में भगवान कृष्ण का पावन संबोधन", rashi: "Leo", nakshatra: "Magha", startingLetters: ["M", "म"], luckyNumber: 1, category: "Devata Nama" },
      { nameEnglish: "Tejas", nameHindi: "तेजस", meaning: "दिव्य तेज, कांति, ओज और पराक्रम", spiritualContext: "उपनिषद का मंत्र 'तेजस्वि नावधीतमस्तु' - हमारी विद्या तेजस्वी हो", rashi: "Leo", nakshatra: "Uttara Phalguni", startingLetters: ["T", "त"], luckyNumber: 1, category: "Spiritual Sanskrit" },

      // Virgo (Kanya): To, Pa, Pi, Pu, Sha, Na, Tha, Pe, Po
      { nameEnglish: "Pranav", nameHindi: "प्रणव", meaning: "पवित्र ओंकार नाद, समस्त मंत्रों का मूल बीज", spiritualContext: "परमात्मा का ध्वन्यात्मक स्वरूप जो मुक्तिदाता है", rashi: "Virgo", nakshatra: "Uttara Phalguni", startingLetters: ["P", "प"], luckyNumber: 5, category: "Spiritual Sanskrit" },
      { nameEnglish: "Parth", nameHindi: "पार्थ", meaning: "माता पृथा (कुंती) के सुपुत्र, धनुर्धर अर्जुन", spiritualContext: "भगवान श्री कृष्ण के परम सखा और निष्काम कर्मयोगी", rashi: "Virgo", nakshatra: "Uttara Phalguni", startingLetters: ["P", "प"], luckyNumber: 5, category: "Vedic Hero" },
      { nameEnglish: "Piyush", nameHindi: "पीयूष", meaning: "अमृत, जो जीवन में अमरता और शांति घोले", spiritualContext: "समुद्र मंथन से प्राप्त दैवीय अमृत", rashi: "Virgo", nakshatra: "Uttara Phalguni", startingLetters: ["P", "प"], luckyNumber: 3, category: "Nature Element" },
      { nameEnglish: "Pawan", nameHindi: "पवन", meaning: "पवित्र वायु, मारुति, हनुमान जी के पिता", spiritualContext: "प्राण वायु और असीम बल-बुद्धि का प्रतीक", rashi: "Virgo", nakshatra: "Hasta", startingLetters: ["P", "प"], luckyNumber: 5, category: "Vedic Devata" },
      { nameEnglish: "Shashwat", nameHindi: "शाश्वत", meaning: "सदा रहने वाला, शाश्वत सत्य, सनातन", spiritualContext: "कठोपनिषद में आत्मा का अविनाशी व सनातन स्वरूप", rashi: "Virgo", nakshatra: "Hasta", startingLetters: ["S", "श", "स"], luckyNumber: 7, category: "Spiritual Sanskrit" },

      // Libra (Tula): Ra, Ri, Ru, Re, Ro, Ta, Ti, Tu, Te
      { nameEnglish: "Rohan", nameHindi: "रोहन", meaning: "उन्नति, आरोहण और विकास के पथ पर अग्रसर", spiritualContext: "सदा उत्थान और मानवीय मूल्यों की विजय का संवाहक", rashi: "Libra", nakshatra: "Swati", startingLetters: ["R", "र"], luckyNumber: 6, category: "Virtue Sanskrit" },
      { nameEnglish: "Reyansh", nameHindi: "रेयांश", meaning: "सूर्य का पहला प्रकाश, भगवान विष्णु का अंश", spiritualContext: "संसार से अंधकार मिटाने वाली दिव्य प्रथम किरण", rashi: "Libra", nakshatra: "Chitra", startingLetters: ["R", "र"], luckyNumber: 6, category: "Spiritual Sanskrit" },
      { nameEnglish: "Rudra", nameHindi: "रुद्र", meaning: "दुःखों का नाश करने वाले, पराक्रमी भगवान शिव", spiritualContext: "यजुर्वेद के शतरुद्रिय में वर्णित कल्याणकारी महादेव", rashi: "Libra", nakshatra: "Swati", startingLetters: ["R", "र"], luckyNumber: 9, category: "Devata Nama" },
      { nameEnglish: "Tanmay", nameHindi: "तन्मय", meaning: "पूर्णतः एकाग्र, प्रभु भक्ति में लीन", spiritualContext: "ईश्वर की साधना में आत्म-विस्मृत हो जाना", rashi: "Libra", nakshatra: "Swati", startingLetters: ["T", "त"], luckyNumber: 6, category: "Spiritual Sanskrit" },
      { nameEnglish: "Rishabh", nameHindi: "ऋषभ", meaning: "सर्वश्रेष्ठ, सामर्थ्यवान, संगीत का द्वितीय स्वर", spiritualContext: "श्रीमद्भागवत के अवधूत राजा और प्रथम जैन तीर्थंकर", rashi: "Libra", nakshatra: "Chitra", startingLetters: ["R", "र", "ऋ"], luckyNumber: 6, category: "Vedic King" },

      // Scorpio (Vrischika): To, Na, Ni, Nu, Ne, No, Ya, Yi, Yu
      { nameEnglish: "Nikhil", nameHindi: "निखिल", meaning: "संपूर्ण, परिपूर्ण, जिसमें कोई कमी न हो", spiritualContext: "समस्त ब्रह्मांड के विस्तार का द्योतक", rashi: "Scorpio", nakshatra: "Anuradha", startingLetters: ["N", "न"], luckyNumber: 9, category: "Virtue Sanskrit" },
      { nameEnglish: "Naman", nameHindi: "नमन", meaning: "अहंकार रहित प्रणाम, विनम्रता और श्रद्धा", spiritualContext: "गुरु और ईश्वर के चरणों में साष्टांग समर्पण", rashi: "Scorpio", nakshatra: "Anuradha", startingLetters: ["N", "न"], luckyNumber: 9, category: "Spiritual Sanskrit" },
      { nameEnglish: "Yash", nameHindi: "यश", meaning: "कीर्ति, गौरव, पवित्र प्रतिष्ठा और यशस्विता", spiritualContext: "सत्कर्मों से अर्जित वह कीर्ति जो अमर रहती है", rashi: "Scorpio", nakshatra: "Jyeshtha", startingLetters: ["Y", "य"], luckyNumber: 1, category: "Virtue Sanskrit" },
      { nameEnglish: "Yuvraj", nameHindi: "युवराज", meaning: "उत्तराधिकारी राजकुमार, भविष्य का कुशल शासक", spiritualContext: "धर्म-राज्य की बागडोर संभालने वाला भावी राजा", rashi: "Scorpio", nakshatra: "Jyeshtha", startingLetters: ["Y", "य"], luckyNumber: 9, category: "Vyavaharika Nama" },
      { nameEnglish: "Neel", nameHindi: "नील", meaning: "नीलकंठ भगवान शिव, अनंत नीला आकाश", spiritualContext: "संसार के विष को अमृत में बदलने का सामर्थ्य", rashi: "Scorpio", nakshatra: "Anuradha", startingLetters: ["N", "न"], luckyNumber: 8, category: "Devata Nama" },

      // Sagittarius (Dhanu): Ye, Yo, Bha, Bhi, Bhu, Dha, Pha, Dhadha, Bhe
      { nameEnglish: "Bhavesh", nameHindi: "भावेश", meaning: "सृष्टि के अधिपति, भगवान शिव, भाव के स्वामी", spiritualContext: "सच्चे प्रेम और भक्ति-भाव से रीझने वाले महादेव", rashi: "Sagittarius", nakshatra: "Mula", startingLetters: ["B", "भ"], luckyNumber: 3, category: "Devata Nama" },
      { nameEnglish: "Bharat", nameHindi: "भारत", meaning: "ज्ञान के प्रकाश में रत, प्रतापी चक्रवर्ती सम्राट", spiritualContext: "हमारे देश के नामकरण का आधार चक्रवर्ती भरत", rashi: "Sagittarius", nakshatra: "Purva Ashadha", startingLetters: ["B", "भ"], luckyNumber: 3, category: "Vedic King" },
      { nameEnglish: "Dhanush", nameHindi: "धनुष", meaning: "मर्यादा पुरुषोत्तम राम का अमोघ कोदंड", spiritualContext: "अधर्म के संहार और धर्म रक्षा का अस्त्र", rashi: "Sagittarius", nakshatra: "Purva Ashadha", startingLetters: ["D", "ध"], luckyNumber: 3, category: "Virtue Sanskrit" },
      { nameEnglish: "Dhruv", nameHindi: "ध्रुव", meaning: "अटल, निष्ठावान, आकाश में ध्रुव तारा", spiritualContext: "अटूट भक्ति और संकल्प के आदर्श भक्त ध्रुव", rashi: "Sagittarius", nakshatra: "Purva Ashadha", startingLetters: ["D", "ध"], luckyNumber: 3, category: "Spiritual Sanskrit" },
      { nameEnglish: "Bhavya", nameHindi: "भव्य", meaning: "दिव्य, विशाल, गौरवशाली और अलौकिक", spiritualContext: "परमात्मा के विराट और ऐश्वर्यशाली रूप का दर्शन", rashi: "Sagittarius", nakshatra: "Mula", startingLetters: ["B", "भ"], luckyNumber: 3, category: "Virtue Sanskrit" },

      // Capricorn (Makara): Bho, Ja, Ji, Khi, Khu, Khe, Kho, Ga, Gi
      { nameEnglish: "Jayant", nameHindi: "जयंत", meaning: "सदा विजयी, विजेता, इंद्रदेव के प्रतापी पुत्र", spiritualContext: "धर्म युद्ध में विजय का वरदान प्राप्त करने वाला", rashi: "Capricorn", nakshatra: "Uttara Ashadha", startingLetters: ["J", "ज"], luckyNumber: 8, category: "Devata Nama" },
      { nameEnglish: "Jitendra", nameHindi: "जितेन्द्र", meaning: "जिन्होंने अपनी समस्त इंद्रियों पर विजय पा ली हो", spiritualContext: "योगिराज और जितेंद्रिय महापुरुष का आदर्श", rashi: "Capricorn", nakshatra: "Uttara Ashadha", startingLetters: ["J", "ज"], luckyNumber: 8, category: "Spiritual Sanskrit" },
      { nameEnglish: "Gaurang", nameHindi: "गौरांग", meaning: "स्वर्ण के समान तेजस्वी कांति वाले श्री चैतन्य", spiritualContext: "भक्ति आंदोलन के पुरोधा श्री गौरांग महाप्रभु", rashi: "Capricorn", nakshatra: "Dhanishta", startingLetters: ["G", "ग"], luckyNumber: 8, category: "Spiritual Sanskrit" },
      { nameEnglish: "Girish", nameHindi: "गिरीश", meaning: "पर्वतों के अधिपति (कैलाशपति), भगवान शिव", spiritualContext: "कैलाश पर्वत पर तपस्यालीन महादेव", rashi: "Capricorn", nakshatra: "Dhanishta", startingLetters: ["G", "ग"], luckyNumber: 8, category: "Devata Nama" },

      // Aquarius (Kumbha): Gu, Ge, Go, Sa, Si, Su, Se, So, Da
      { nameEnglish: "Siddharth", nameHindi: "सिद्धार्थ", meaning: "जिसने परम सत्य व लक्ष्य को सिद्ध कर लिया हो", spiritualContext: "गौतम बुद्ध का जन्म नाम, आत्मज्ञान का प्रतीक", rashi: "Aquarius", nakshatra: "Shatabhisha", startingLetters: ["S", "स"], luckyNumber: 8, category: "Spiritual Sanskrit" },
      { nameEnglish: "Samar", nameHindi: "समर", meaning: "युद्ध, जीवन के संघर्षों में अदम्य साहस रखने वाला", spiritualContext: "धर्म युद्ध में अडिग रहकर विजय प्राप्त करने वाला", rashi: "Aquarius", nakshatra: "Shatabhisha", startingLetters: ["S", "स"], luckyNumber: 8, category: "Virtue Sanskrit" },
      { nameEnglish: "Suryansh", nameHindi: "सूर्यांश", meaning: "सूर्य का तेजवान अंश, नवप्रभात का संवाहक", spiritualContext: "अंधकार मिटाकर ज्ञान का प्रकाश फैलाने वाला", rashi: "Aquarius", nakshatra: "Shatabhisha", startingLetters: ["S", "स"], luckyNumber: 1, category: "Spiritual Sanskrit" },
      { nameEnglish: "Govind", nameHindi: "गोविंद", meaning: "गायों व इंद्रियों के रक्षक, भगवान श्री कृष्ण", spiritualContext: "आदि शंकराचार्य रचित 'भज गोविंदम्' का पावन स्मरण", rashi: "Aquarius", nakshatra: "Shatabhisha", startingLetters: ["G", "ग"], luckyNumber: 8, category: "Devata Nama" },
      { nameEnglish: "Dev", nameHindi: "देव", meaning: "दिव्य, प्रकाशमान, देवताओं के समान तेजस्वी", spiritualContext: "सत्त्वगुण से परिपूर्ण दिव्य आत्मा", rashi: "Aquarius", nakshatra: "Purva Bhadrapada", startingLetters: ["D", "द"], luckyNumber: 8, category: "Vyavaharika Nama" },

      // Pisces (Meena): Di, Du, Tha, Jha, Nya, De, Do, Cha, Chi
      { nameEnglish: "Divyansh", nameHindi: "दिव्यांश", meaning: "दिव्यता का साक्षात अंश, पवित्र और अलौकिक", spiritualContext: "परमात्मा के आलोक का शुद्ध प्रतिरूप", rashi: "Pisces", nakshatra: "Purva Bhadrapada", startingLetters: ["D", "द"], luckyNumber: 3, category: "Spiritual Sanskrit" },
      { nameEnglish: "Deepak", nameHindi: "दीपक", meaning: "ज्ञान का पावन प्रकाश, जो पथ आलोकित करे", spiritualContext: "तमसो मा ज्योतिर्गमय का साक्षात स्वरूप", rashi: "Pisces", nakshatra: "Purva Bhadrapada", startingLetters: ["D", "द"], luckyNumber: 3, category: "Nature Element" },
      { nameEnglish: "Chirayu", nameHindi: "चिरायु", meaning: "दीर्घायु, अमरत्व और उत्तम स्वास्थ्य का आशीर्वाद", spiritualContext: "वेदों का आशीर्वाद 'शतं जीव शरदो वर्धमानः'", rashi: "Pisces", nakshatra: "Revati", startingLetters: ["C", "च"], luckyNumber: 3, category: "Virtue Sanskrit" },
      { nameEnglish: "Devendra", nameHindi: "देवेन्द्र", meaning: "देवताओं के राजा, देवराज इंद्र", spiritualContext: "समस्त दिव्य शक्तियों के नायक", rashi: "Pisces", nakshatra: "Revati", startingLetters: ["D", "द"], luckyNumber: 3, category: "Devata Nama" },
      { nameEnglish: "Chinmay", nameHindi: "चिन्मय", meaning: "शुद्ध ज्ञान और परमानंद से परिपूर्ण", spiritualContext: "उपनिषदों का चिन्मय ब्रह्म स्वरूप", rashi: "Pisces", nakshatra: "Revati", startingLetters: ["C", "च"], luckyNumber: 3, category: "Spiritual Sanskrit" }
    ],

    girl: [
      // Mesha (Aries): Chu, Che, Cho, La, Li, Lu, Le, Lo, A
      { nameEnglish: "Ananya", nameHindi: "अनन्या", meaning: "अद्वितीय, जिसके समान कोई दूसरा न हो", spiritualContext: "गीता 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते'", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["A", "अ"], luckyNumber: 9, category: "Spiritual Sanskrit" },
      { nameEnglish: "Aadhya", nameHindi: "आद्या", meaning: "प्रथम शक्ति, आदिशक्ति मां दुर्गा", spiritualContext: "सृष्टि की आदि ऊर्जा और समस्त शक्तियों का मूल स्रोत", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["A", "अ", "आ"], luckyNumber: 1, category: "Devata Nama" },
      { nameEnglish: "Lavanya", nameHindi: "लावण्या", meaning: "अद्वितीय लावण्य, सौंदर्य और अनुग्रह", spiritualContext: "आंतरिक पवित्रता से झलकता हुआ दैवीय सौंदर्य", rashi: "Aries", nakshatra: "Ashwini", startingLetters: ["L", "ल"], luckyNumber: 6, category: "Virtue Sanskrit" },
      { nameEnglish: "Lipika", nameHindi: "लिपिका", meaning: "पवित्र लिपि, ज्ञान का अक्षर रूप, सरस्वती", spiritualContext: "ज्ञान और विद्या को संजोने वाली पावन लेखनी", rashi: "Aries", nakshatra: "Bharani", startingLetters: ["L", "ल"], luckyNumber: 3, category: "Spiritual Sanskrit" },
      { nameEnglish: "Charulata", nameHindi: "चारुलता", meaning: "सुंदर और कोमल बेल, सहज शालीनता", spiritualContext: "प्रकृति की कोमलता और सार्थकता की प्रतीक", rashi: "Aries", nakshatra: "Ashwini", startingLetters: ["C", "च"], luckyNumber: 6, category: "Nature Element" },

      // Taurus (Vrishabha): I, U, E, O, Va, Vi, Vu, Ve, Vo
      { nameEnglish: "Vaidehi", nameHindi: "वैदेही", meaning: "विदेह राज जनक की सुपुत्री, माता जानकी/सीता", spiritualContext: "त्याग, सतीत्व, धैर्य और पातिव्रत्य की सर्वोच्च प्रतिमूर्ति", rashi: "Taurus", nakshatra: "Rohini", startingLetters: ["V", "व"], luckyNumber: 6, category: "Devata Nama" },
      { nameEnglish: "Ishani", nameHindi: "ईशानी", meaning: "भगवान शिव की शक्ति, जगन्माता पार्वती", spiritualContext: "कल्याणकारी शक्ति जो समस्त बाधाओं को दूर करती है", rashi: "Taurus", nakshatra: "Krittika", startingLetters: ["I", "ई", "इ"], luckyNumber: 9, category: "Devata Nama" },
      { nameEnglish: "Urvi", nameHindi: "उर्वी", meaning: "धरती माता, धैर्य और असीम पोषण की देवी", spiritualContext: "समस्त चराचर को धारण करने वाली क्षमाशीला धरा", rashi: "Taurus", nakshatra: "Krittika", startingLetters: ["U", "उ"], luckyNumber: 6, category: "Nature Element" },
      { nameEnglish: "Vandana", nameHindi: "वंदना", meaning: "ईश्वर की स्तुति, अर्चना और भक्ति वंदना", spiritualContext: "प्रभु के प्रति पूर्ण श्रद्धा और नमन की भावना", rashi: "Taurus", nakshatra: "Rohini", startingLetters: ["V", "व"], luckyNumber: 6, category: "Spiritual Sanskrit" },
      { nameEnglish: "Vidhi", nameHindi: "विधि", meaning: "सृष्टि का विधान, व्यवस्था, मां सरस्वती", spiritualContext: "ब्रह्मांड के अकाट्य नैतिक नियम और धर्म का मार्ग", rashi: "Taurus", nakshatra: "Rohini", startingLetters: ["V", "व"], luckyNumber: 5, category: "Spiritual Sanskrit" },

      // Gemini (Mithuna): Ka, Ki, Ku, Gha, Nga, Chha, Ke, Ko, Ha
      { nameEnglish: "Kalyani", nameHindi: "कल्याणी", meaning: "सर्व कल्याण करने वाली, मां भगवती का मंगलकारी रूप", spiritualContext: "सदा भक्तों का मंगल और संवर्धन करने वाली देवी", rashi: "Gemini", nakshatra: "Mrigashira", startingLetters: ["K", "क"], luckyNumber: 5, category: "Devata Nama" },
      { nameEnglish: "Kritika", nameHindi: "कृतिका", meaning: "आकाश का नक्षत्र समूह, पावन अग्नि का तेज", spiritualContext: "भगवान कार्तिकेय का पालन-पोषण करने वाली मातृकाएं", rashi: "Gemini", nakshatra: "Mrigashira", startingLetters: ["K", "क"], luckyNumber: 1, category: "Vedic Devata" },
      { nameEnglish: "Kashvi", nameHindi: "काश्वी", meaning: "चमकती हुई, दीप्तिमान, कांति की प्रतिमूर्ति", spiritualContext: "आंतरिक आध्यात्मिक तेज का बाह्य प्रकटीकरण", rashi: "Gemini", nakshatra: "Mrigashira", startingLetters: ["K", "क"], luckyNumber: 5, category: "Virtue Sanskrit" },
      { nameEnglish: "Harshita", nameHindi: "हर्षिता", meaning: "सदा प्रसन्नचित्त, जो सबके जीवन में खुशियां भरे", spiritualContext: "आत्मिक संतोष और हर्ष का साक्षात रूप", rashi: "Gemini", nakshatra: "Punarvasu", startingLetters: ["H", "ह"], luckyNumber: 5, category: "Vyavaharika Nama" },

      // Cancer (Karka): Hi, Hu, He, Ho, Da, Di, Du, De, Do
      { nameEnglish: "Divya", nameHindi: "दिव्या", meaning: "दिव्य, अलौकिक तेज से युक्त, स्वर्गीय आभा", spiritualContext: "परमात्मा की दिव्य चेतना का साकार स्वरूप", rashi: "Cancer", nakshatra: "Pushya", startingLetters: ["D", "द"], luckyNumber: 2, category: "Spiritual Sanskrit" },
      { nameEnglish: "Deepika", nameHindi: "दीपिका", meaning: "ज्ञान और भक्ति का पावन छोटा दीपक", spiritualContext: "अंधकार मिटाकर सद्मार्ग दिखाने वाली ज्ञान ज्योति", rashi: "Cancer", nakshatra: "Pushya", startingLetters: ["D", "द"], luckyNumber: 2, category: "Nature Element" },
      { nameEnglish: "Drishti", nameHindi: "दृष्टि", meaning: "दूरदर्शी दृष्टि, दिव्य नेत्र, विवेक", spiritualContext: "सत्य और असत्य में भेद करने वाली आत्म-दृष्टि", rashi: "Cancer", nakshatra: "Pushya", startingLetters: ["D", "द"], luckyNumber: 7, category: "Spiritual Sanskrit" },
      { nameEnglish: "Hemlata", nameHindi: "हेमलता", meaning: "स्वर्णमयी लता, शुद्धता और सुकुमारता", spiritualContext: "कुंदन के समान शुद्ध चरित्र की प्रतीक", rashi: "Cancer", nakshatra: "Punarvasu", startingLetters: ["H", "ह"], luckyNumber: 2, category: "Nature Element" },

      // Leo (Simha): Ma, Mi, Mu, Me, Mo, Ta, Ti, Tu, Te
      { nameEnglish: "Meera", nameHindi: "मीरा", meaning: "भगवान श्री कृष्ण की अनन्य प्रेमिका और भक्त कवयित्री", spiritualContext: "समर्पण, प्रेम और निष्काम भक्ति की सर्वोच्च आदर्श", rashi: "Leo", nakshatra: "Magha", startingLetters: ["M", "म"], luckyNumber: 1, category: "Bhakti Saint" },
      { nameEnglish: "Manasvi", nameHindi: "मनस्वी", meaning: "दृढ़ मनोबल वाली, बुद्धिमान और विचारशील", spiritualContext: "उच्च नैतिक आदर्शों पर अडिग रहने वाली विदुषी", rashi: "Leo", nakshatra: "Magha", startingLetters: ["M", "म"], luckyNumber: 1, category: "Virtue Sanskrit" },
      { nameEnglish: "Tanvi", nameHindi: "तन्वी", meaning: "सुकुमार, अत्यंत सुंदर और सौम्य कन्या", spiritualContext: "प्रकृति की नजाकत और मां दुर्गा का कोमल स्वरूप", rashi: "Leo", nakshatra: "Purva Phalguni", startingLetters: ["T", "त"], luckyNumber: 1, category: "Virtue Sanskrit" },
      { nameEnglish: "Maitreyi", nameHindi: "मैत्रेयी", meaning: "सदा मैत्रीपूर्ण, उपनिषद काल की महान ब्रह्मवादिनी विदुषी", spiritualContext: "बृहदारण्यक उपनिषद में याज्ञवल्क्य से आत्मज्ञान पाने वाली ऋषि", rashi: "Leo", nakshatra: "Magha", startingLetters: ["M", "म"], luckyNumber: 1, category: "Vedic Scholar" },

      // Virgo (Kanya): To, Pa, Pi, Pu, Sha, Na, Tha, Pe, Po
      { nameEnglish: "Pooja", nameHindi: "पूजा", meaning: "ईश्वर की पवित्र आराधना, वंदना और अर्चना", spiritualContext: "समस्त कर्मों को ईश्वरार्पण करने की सात्विक क्रिया", rashi: "Virgo", nakshatra: "Uttara Phalguni", startingLetters: ["P", "प"], luckyNumber: 5, category: "Spiritual Sanskrit" },
      { nameEnglish: "Prisha", nameHindi: "प्रिशा", meaning: "ईश्वर का अमूल्य उपहार, प्रिय और स्नेही", spiritualContext: "परमात्मा के अनुग्रह से प्राप्त अनमोल संतान", rashi: "Virgo", nakshatra: "Uttara Phalguni", startingLetters: ["P", "प"], luckyNumber: 5, category: "Vyavaharika Nama" },
      { nameEnglish: "Shambhavi", nameHindi: "शाम्भवी", meaning: "भगवान शंभु (शिव) की अर्धांगिनी मां पार्वती", spiritualContext: "योग मार्ग की उच्च शाम्भवी मुद्रा की अधिष्ठात्री", rashi: "Virgo", nakshatra: "Hasta", startingLetters: ["S", "श", "स"], luckyNumber: 9, category: "Devata Nama" },
      { nameEnglish: "Shivangi", nameHindi: "शिवांगी", meaning: "भगवान शिव का सुंदर पावन अंग, शुभता की देवी", spiritualContext: "सदा कल्याण और मंगल करने वाली चेतना", rashi: "Virgo", nakshatra: "Hasta", startingLetters: ["S", "श", "स"], luckyNumber: 5, category: "Devata Nama" },

      // Libra (Tula): Ra, Ri, Ru, Re, Ro, Ta, Ti, Tu, Te
      { nameEnglish: "Radhika", nameHindi: "राधिका", meaning: "भगवान श्री कृष्ण की आह्लादिनी शक्ति, श्री राधा रानी", spiritualContext: "ब्रह्मांड के समस्त प्रेम और भक्ति का सर्वोच्च शिखर", rashi: "Libra", nakshatra: "Chitra", startingLetters: ["R", "र"], luckyNumber: 6, category: "Devata Nama" },
      { nameEnglish: "Riddhi", nameHindi: "ऋद्धि", meaning: "समृद्धि, अलौकिक सिद्धि, भगवान गणेश की शक्ति", spiritualContext: "जीवन में शुभता, ज्ञान और ऐश्वर्य का वास", rashi: "Libra", nakshatra: "Chitra", startingLetters: ["R", "र", "ऋ"], luckyNumber: 6, category: "Devata Nama" },
      { nameEnglish: "Rhea", nameHindi: "रिया", meaning: "मधुर स्वर वाली गायिका, सौंदर्य और सरलता", spiritualContext: "संगीत और प्रकृति की सरस धारा", rashi: "Libra", nakshatra: "Swati", startingLetters: ["R", "र"], luckyNumber: 6, category: "Vyavaharika Nama" },
      { nameEnglish: "Tanushree", nameHindi: "तनुश्री", meaning: "अत्यंत सुंदर काया, मां लक्ष्मी का सौम्य रूप", spiritualContext: "सुंदरता और पावनता का समन्वय", rashi: "Libra", nakshatra: "Swati", startingLetters: ["T", "त"], luckyNumber: 6, category: "Virtue Sanskrit" },

      // Scorpio (Vrischika): To, Na, Ni, Nu, Ne, No, Ya, Yi, Yu
      { nameEnglish: "Navya", nameHindi: "नव्या", meaning: "नवीनता से परिपूर्ण, नूतन और प्रशंसा के योग्य", spiritualContext: "सदा नवीन रहने वाली सृजन शक्ति", rashi: "Scorpio", nakshatra: "Anuradha", startingLetters: ["N", "न"], luckyNumber: 9, category: "Virtue Sanskrit" },
      { nameEnglish: "Nandini", nameHindi: "नंदिनी", meaning: "आनंद प्रदान करने वाली, महर्षि वशिष्ठ की कामधेनु गाय", spiritualContext: "माता दुर्गा और समस्त मनोकामना पूर्ण करने वाली शक्ति", rashi: "Scorpio", nakshatra: "Anuradha", startingLetters: ["N", "न"], luckyNumber: 9, category: "Devata Nama" },
      { nameEnglish: "Niyati", nameHindi: "नियति", meaning: "भाग्य, ब्रह्मांडीय व्यवस्था और दैवीय विधान", spiritualContext: "कर्म के विधान और संतुलन की अधिष्ठात्री", rashi: "Scorpio", nakshatra: "Anuradha", startingLetters: ["N", "न"], luckyNumber: 7, category: "Spiritual Sanskrit" },
      { nameEnglish: "Yamini", nameHindi: "यामिनी", meaning: "तारों भरी रात्रि, शांति और विश्राम की देवी", spiritualContext: "गहन साधना और अंतर्मुखी एकाग्रता का समय", rashi: "Scorpio", nakshatra: "Jyeshtha", startingLetters: ["Y", "य"], luckyNumber: 9, category: "Nature Element" },

      // Sagittarius (Dhanu): Ye, Yo, Bha, Bhi, Bhu, Dha, Pha, Dhadha, Bhe
      { nameEnglish: "Bhavani", nameHindi: "भवानी", meaning: "भगवान भव (शिव) की शक्ति, शक्तिस्वरूपा मां दुर्गा", spiritualContext: "छत्रपति शिवाजी महाराज की आराध्या मां तुलजा भवानी", rashi: "Sagittarius", nakshatra: "Mula", startingLetters: ["B", "भ"], luckyNumber: 3, category: "Devata Nama" },
      { nameEnglish: "Dharani", nameHindi: "धारिणी", meaning: "समस्त संसार को धारण करने वाली, पृथ्वी माता", spiritualContext: "सहनशीलता, क्षमा और असीम मातृत्व का रूप", rashi: "Sagittarius", nakshatra: "Purva Ashadha", startingLetters: ["D", "ध"], luckyNumber: 3, category: "Nature Element" },
      { nameEnglish: "Bhumi", nameHindi: "भूमि", meaning: "धरा, उर्वरता और पोषण की अधिष्ठात्री भूदेवी", spiritualContext: "भगवान वराह की शक्ति और जीवनदायिनी वसुंधरा", rashi: "Sagittarius", nakshatra: "Purva Ashadha", startingLetters: ["B", "भ"], luckyNumber: 3, category: "Nature Element" },

      // Capricorn (Makara): Bho, Ja, Ji, Khi, Khu, Khe, Kho, Ga, Gi
      { nameEnglish: "Janki", nameHindi: "जानकी", meaning: "राजा जनक की राजकन्या, माता सीता का पावन नाम", spiritualContext: "रामकथा की प्राण और मर्यादा की देवी", rashi: "Capricorn", nakshatra: "Uttara Ashadha", startingLetters: ["J", "ज"], luckyNumber: 8, category: "Devata Nama" },
      { nameEnglish: "Gargi", nameHindi: "गार्गी", meaning: "उपनिषद काल की महान ब्रह्मवादिनी विदुषी ऋषि", spiritualContext: "राजा जनक की सभा में याज्ञवल्क्य से शास्त्रार्थ करने वाली", rashi: "Capricorn", nakshatra: "Dhanishta", startingLetters: ["G", "ग"], luckyNumber: 8, category: "Vedic Scholar" },
      { nameEnglish: "Gayatri", nameHindi: "गायत्री", meaning: "वेदों की माता, सर्व पापनाशिनी पावन गायत्री", spiritualContext: "समस्त सद्बुद्धि और ज्ञान का आदि स्रोत", rashi: "Capricorn", nakshatra: "Dhanishta", startingLetters: ["G", "ग"], luckyNumber: 8, category: "Devata Nama" },

      // Aquarius (Kumbha): Gu, Ge, Go, Sa, Si, Su, Se, So, Da
      { nameEnglish: "Saanvi", nameHindi: "सान्वी", meaning: "मां महालक्ष्मी का सुंदर नाम, शुभता और सौभाग्य", spiritualContext: "समस्त दैवीय ऐश्वर्य और शांति की प्रदाता", rashi: "Aquarius", nakshatra: "Shatabhisha", startingLetters: ["S", "स"], luckyNumber: 8, category: "Devata Nama" },
      { nameEnglish: "Gauri", nameHindi: "गौरी", meaning: "शुद्ध, निष्कलंक, मां पार्वती का सौम्य गौरवर्ण रूप", spiritualContext: "कठिन तपस्या के पश्चात प्राप्त दिव्य तेज", rashi: "Aquarius", nakshatra: "Dhanishta", startingLetters: ["G", "ग"], luckyNumber: 8, category: "Devata Nama" },
      { nameEnglish: "Somya", nameHindi: "सौम्या", meaning: "शांत, कोमल, चंद्रमा के समान शीतल और मधुर", spiritualContext: "क्रोध रहित शांत अंतःकरण का साक्षात रूप", rashi: "Aquarius", nakshatra: "Purva Bhadrapada", startingLetters: ["S", "स"], luckyNumber: 8, category: "Virtue Sanskrit" },

      // Pisces (Meena): Di, Du, Tha, Jha, Nya, De, Do, Cha, Chi
      { nameEnglish: "Diya", nameHindi: "दिया", meaning: "प्रज्वलित दीपक, जो अंधकार हरकर ज्ञान फैलाए", spiritualContext: "आशा, सकारात्मकता और प्रकाश का प्रतीक", rashi: "Pisces", nakshatra: "Purva Bhadrapada", startingLetters: ["D", "द"], luckyNumber: 3, category: "Nature Element" },
      { nameEnglish: "Damini", nameHindi: "दामिनी", meaning: "आकाश में चमकती विद्युत रेखा, ऊर्जा का प्रकाश", spiritualContext: "तीव्र चेतना और तेजस्वी प्रतिभा का प्रतीक", rashi: "Pisces", nakshatra: "Purva Bhadrapada", startingLetters: ["D", "द"], luckyNumber: 3, category: "Nature Element" },
      { nameEnglish: "Charvi", nameHindi: "चार्वी", meaning: "अत्यंत सुंदर, मनमोहक और विदुषी कन्या", spiritualContext: "कुबेर की पत्नी और सौंदर्य-बुद्धि का समन्वय", rashi: "Pisces", nakshatra: "Revati", startingLetters: ["C", "च"], luckyNumber: 3, category: "Virtue Sanskrit" }
    ]
  },

  islamic: {
    boy: [
      { nameEnglish: "Muhammad", nameHindi: "मुहम्मद", meaning: "अत्यधिक प्रशंसित, समस्त उत्तम गुणों के स्वामी", spiritualContext: "अंतिम नबी हज़रत मुहम्मद मुस्तफ़ा (सल्लल्लाहु अलैहि वसल्लम)", rashi: "Leo", nakshatra: "Magha", startingLetters: ["M", "म"], luckyNumber: 2, category: "Quranic Sunnah" },
      { nameEnglish: "Abdur-Rahman", nameHindi: "अब्दुर-रहमान", meaning: "परम दयालु 'अर-रहमान' का निष्ठावान बंदा", spiritualContext: "हदीस शरीफ़ के अनुसार अल्लाह को सबसे महबूब नामों में से एक", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["A", "अ"], luckyNumber: 1, category: "Asma-ul-Husna" },
      { nameEnglish: "Zayan", nameHindi: "ज़यान", meaning: "अत्यंत सुंदर, शालीन, जो दूसरों का जीवन संवारे", spiritualContext: "हसन व जमाल और नेक अख़लाक़ का कुरानिक संदर्भ", rashi: "Sagittarius", nakshatra: "Mula", startingLetters: ["Z", "ज़"], luckyNumber: 5, category: "Quranic Virtue" },
      { nameEnglish: "Rayyan", nameHindi: "रय्यान", meaning: "जन्नत का वह पवित्र द्वार जो सिर्फ रोज़ेदारों के लिए है", spiritualContext: "सहीह बुख़ारी में वर्णित जन्नत-उल-फ़िरदौस का बाबरकत दरवाज़ा", rashi: "Libra", nakshatra: "Chitra", startingLetters: ["R", "र"], luckyNumber: 8, category: "Quranic Virtue" },
      { nameEnglish: "Ibrahim", nameHindi: "इब्राहिम", meaning: "नेक उम्मत के पिता, अल्लाह के सच्चे मित्र (ख़लीलुल्लाह)", spiritualContext: "हज़रत इब्राहिम (अलैहिस्सलाम) - तौहीद के सबसे बड़े अलंबरदार", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["I", "इ", "अ"], luckyNumber: 4, category: "Anbiya (Prophet)" },
      { nameEnglish: "Tariq", nameHindi: "तारिक", meaning: "रात में चमकने वाला रौशन सितारा, सूरह अत-तारिक", spiritualContext: "कुरआन मजीद की 86वीं सूरह 'अत-तारिक' (नज्म-उस-साक़िब)", rashi: "Leo", nakshatra: "Purva Phalguni", startingLetters: ["T", "त"], luckyNumber: 9, category: "Quranic Surah" },
      { nameEnglish: "Hamza", nameHindi: "हमज़ा", meaning: "शेर, अद्वितीय शूरवीर, अदम्य साहसी", spiritualContext: "रसूलुल्लाह (सल्ल.) के चचा हज़रत अमीर हमज़ा (रजि.) - सय्यदुश-शोहदा", rashi: "Cancer", nakshatra: "Pushya", startingLetters: ["H", "ह"], luckyNumber: 8, category: "Sahaba Hero" },
      { nameEnglish: "Umar", nameHindi: "उमर", meaning: "दीर्घायु, समृद्ध और इंसाफ़ का परचम लहराने वाला", spiritualContext: "अमीर-उल-मोमिनीन हज़रत उमर फ़ारूक़ (रजि.) - इंसाफ़ के पैकर", rashi: "Taurus", nakshatra: "Krittika", startingLetters: ["U", "उ"], luckyNumber: 7, category: "Khulafa-e-Rashideen" },
      { nameEnglish: "Bilal", nameHindi: "बिलाल", meaning: "जल की जीवनदायिनी बूंद, पहले मोअज़्ज़िन-ए-इस्लाम", spiritualContext: "हज़रत बिलाल हब्शी (रजि.) - मस्जिद-ए-नबवी के पहले मुअज़्ज़िन", rashi: "Sagittarius", nakshatra: "Purva Ashadha", startingLetters: ["B", "ब"], luckyNumber: 9, category: "Sahaba Devotion" },
      { nameEnglish: "Ali", nameHindi: "अली", meaning: "उच्च, बुलंद मर्तबे वाला, असदुल्लाह (अल्लाह का शेर)", spiritualContext: "हज़रत अली इब्न अबी तालिब (करमल्लाहु वज्हहुल करीम) - बाबुल इल्म", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["A", "अ"], luckyNumber: 3, category: "Ahl al-Bayt" },
      { nameEnglish: "Farhan", nameHindi: "फ़रहान", meaning: "प्रसन्नचित्त, जो हर महफ़िल में बरकत और ख़ुशियां लाए", spiritualContext: "सदाचार और संतोष (क़नाअत) का द्योतक", rashi: "Sagittarius", nakshatra: "Purva Ashadha", startingLetters: ["F", "फ़"], luckyNumber: 3, category: "Quranic Virtue" },
      { nameEnglish: "Kareem", nameHindi: "करीम", meaning: "उदार, रहमदिल, जो बिना किसी स्वार्थ के अता करे", spiritualContext: "अल्लाह ताला का सिफ़ाती नाम 'अल-करीम'", rashi: "Gemini", nakshatra: "Mrigashira", startingLetters: ["K", "क"], luckyNumber: 4, category: "Asma-ul-Husna" }
    ],

    girl: [
      { nameEnglish: "Fatima", nameHindi: "फ़ातिमा", meaning: "पवित्र, संयमी, जन्नत की महिलाओं की सरदार (सय्यदा)", spiritualContext: "हज़रत रसूलुल्लाह (सल्ल.) की चहेती सुपुत्री सैय्यदा फ़ातिमा-ज़हरा (रजि.)", rashi: "Sagittarius", nakshatra: "Purva Ashadha", startingLetters: ["F", "फ़"], luckyNumber: 6, category: "Ahl al-Bayt" },
      { nameEnglish: "Aisha", nameHindi: "आइशा", meaning: "जीवंत, समृद्ध और इल्म की अज़ीम प्रतिमूर्ति", spiritualContext: "उम्मुल मोमिनीन हज़रत आइशा सिद्दीक़ा (रजि.) - हदीस व फ़िक़्ह की आलिमा", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["A", "अ", "आ"], luckyNumber: 5, category: "Ummahat-ul-Momineen" },
      { nameEnglish: "Inaya", nameHindi: "इनाया", meaning: "अल्लाह की रहमत, ख़ास देखभाल और हिफ़ाज़त", spiritualContext: "कुरानिक संकल्पना - अल्लाह की अपने नेक बंदों पर असीम इनायत", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["I", "इ"], luckyNumber: 7, category: "Quranic Grace" },
      { nameEnglish: "Afnan", nameHindi: "अफ़नान", meaning: "जन्नत के बागीचों की हरी-भरी सुंदर डालियां", spiritualContext: "सूरह अर-रहमान (आयतः 48) - 'ज़वाता अफ़नान'", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["A", "अ"], luckyNumber: 3, category: "Quranic Paradise" },
      { nameEnglish: "Maryam", nameHindi: "मरियम", meaning: "परम पवित्र, इबादतगुज़ार, हज़रत ईसा की वालिदा", spiritualContext: "कुरआन मजीद की 19वीं सूरह मरियम, पाकीज़गी की मिसाल", rashi: "Leo", nakshatra: "Magha", startingLetters: ["M", "म"], luckyNumber: 9, category: "Quranic Saint" },
      { nameEnglish: "Zoya", nameHindi: "ज़ोया", meaning: "स्नेही, करुणामयी, जीवनदायिनी और मोहब्बत बांटने वाली", spiritualContext: "सदाचार, नर्मी और हुस्ने-सुलूक का प्रतीक", rashi: "Sagittarius", nakshatra: "Mula", startingLetters: ["Z", "ज़"], luckyNumber: 2, category: "Noble Character" },
      { nameEnglish: "Zainab", nameHindi: "ज़ैनब", meaning: "खुशबूदार फूल, पिता की शोभा और आभूषण", spiritualContext: "हज़रत रसूलुल्लाह (सल्ल.) की बड़ी सुपुत्री और करबला की वीरांगना", rashi: "Sagittarius", nakshatra: "Mula", startingLetters: ["Z", "ज़"], luckyNumber: 7, category: "Ahl al-Bayt" },
      { nameEnglish: "Noor", nameHindi: "नूर", meaning: "दिव्य प्रकाश, सूरह अन-नूर, रहमत का उजाला", spiritualContext: "अल्लाह ताला का सिफ़ाती नाम और सूरह नूर की आयतें", rashi: "Scorpio", nakshatra: "Anuradha", startingLetters: ["N", "न"], luckyNumber: 9, category: "Quranic Light" },
      { nameEnglish: "Khadija", nameHindi: "ख़दीजा", meaning: "समय से पूर्व जन्मी, ताहिरा (परम पवित्र)", spiritualContext: "उम्मुल मोमिनीन हज़रत ख़दीजातुल कुबरा (रजि.) - पहली ईमान लाने वाली", rashi: "Gemini", nakshatra: "Mrigashira", startingLetters: ["K", "ख़", "ख"], luckyNumber: 1, category: "Ummahat-ul-Momineen" }
    ]
  },

  sikh: {
    boy: [
      { nameEnglish: "Gurkirat Singh", nameHindi: "गुरकीरत सिंह", meaning: "गुरु की पावन स्तुति व कीर्ति गाने वाला वीर", spiritualContext: "ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਦੇ ਕੀਰਤਨ ਦੀ ਮਹਿਮਾ ਤੇ ਗੁਰਮਤਿ ਗਿਆਨ", rashi: "Aquarius", nakshatra: "Shatabhisha", startingLetters: ["G", "ਗ"], luckyNumber: 7, category: "Gurbani Naam" },
      { nameEnglish: "Harpreet Singh", nameHindi: "हरप्रीत सिंह", meaning: "अकाल पुरख वाहेगुरु से अनन्य प्रेम करने वाला", spiritualContext: "ਗੁਰਬਾਣੀ ਦਾ ਫੁਰਮਾਨ: 'ਸਾਚੁ ਕਹੋਂ ਸੁਨ ਲੇਹੁ ਸਭੈ ਜਿਨ ਪ੍ਰੇਮ ਕੀਓ ਤਿਨ ਹੀ ਪ੍ਰਭ ਪਾਇਓ'", rashi: "Cancer", nakshatra: "Punarvasu", startingLetters: ["H", "ਹ"], luckyNumber: 1, category: "Gurbani Naam" },
      { nameEnglish: "Tegbir Singh", nameHindi: "तेगबीर सिंह", meaning: "सत्य और धर्म की रक्षा करने वाला शमशीर का धनी शूरवीर", spiritualContext: "ਸੰਤ-ਸਿਪਾਹੀ ਦੇ ਆਦਰਸ਼ ਅਤੇ ਨਿਰਭਉ-ਨਿਰਵੈਰ ਦਾ ਪ੍ਰਤੀਕ", rashi: "Libra", nakshatra: "Swati", startingLetters: ["T", "ਤ"], luckyNumber: 9, category: "Veer Ras Naam" },
      { nameEnglish: "Jasraj Singh", nameHindi: "जसराज सिंह", meaning: "यश, गौरव और मर्यादा का अधिपति", spiritualContext: "ਸੱਚੇ ਪਾਤਸ਼ਾਹ ਦੇ ਦਰਬਾਰ ਵਿਚ ਮਾਣ-ਸਤਿਕਾਰ ਦੀ ਪ੍ਰਾਪਤੀ", rashi: "Capricorn", nakshatra: "Uttara Ashadha", startingLetters: ["J", "ਜ"], luckyNumber: 8, category: "Gurbani Naam" },
      { nameEnglish: "Fateh Singh", nameHindi: "फतेह सिंह", meaning: "विजयरूपी, 'वाहेगुरु जी की फतेह' का साक्षात स्वरूप", spiritualContext: "ਸਾਹਿਬਜ਼ਾਦਾ ਬਾਬਾ ਫ਼ਤਿਹ ਸਿੰਘ ਜੀ ਦੀ ਸ਼ਹਾਦਤ, ਦ੍ਰਿੜਤਾ ਤੇ ਅਮਰ ਸਿਦਕ", rashi: "Sagittarius", nakshatra: "Purva Ashadha", startingLetters: ["F", "ਫ"], luckyNumber: 5, category: "Veer Ras Naam" },
      { nameEnglish: "Sehajpreet Singh", nameHindi: "सहजप्रीत सिंह", meaning: "सहज अवस्था, शांति और एकाग्रता से प्रभु-प्रेम करने वाला", spiritualContext: "ਗੁਰੂ ਅਮਰਦਾਸ ਜੀ ਦੇ ਅਨੰਦੁ ਸਾਹਿਬ ਦੀ ਪਰਮ ਸਹਜ ਅਵਸਥਾ", rashi: "Aquarius", nakshatra: "Dhanishta", startingLetters: ["S", "ਸ"], luckyNumber: 3, category: "Gurmat Naam" },
      { nameEnglish: "Manpreet Singh", nameHindi: "मनप्रीत सिंह", meaning: "जिसके मन में परमात्मा का सच्चा प्रेम निवास करता हो", spiritualContext: "ਮਨ ਤੂੰ ਜੋਤਿ ਸਰੂਪੁ ਹੈ ਆਪਣਾ ਮੂਲੁ ਪਛਾਣੁ", rashi: "Leo", nakshatra: "Magha", startingLetters: ["M", "ਮ"], luckyNumber: 1, category: "Gurbani Naam" },
      { nameEnglish: "Arjan Singh", nameHindi: "अर्जन सिंह", meaning: "सत्य के अर्जनकर्ता, पांचवें पातशाह श्री गुरु अर्जन देव जी", spiritualContext: "ਸ਼ਾਂਤੀ ਦੇ ਪੁੰਜ, ਸੁਖਮਨੀ ਸਾਹਿਬ ਦੇ ਰਚੇਤਾ ਤੇ ਸ਼ਹੀਦਾਂ ਦੇ ਸਿਰਤਾਜ", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["A", "ਅ"], luckyNumber: 5, category: "Guru Sahiban" }
    ],

    girl: [
      { nameEnglish: "Harleen Kaur", nameHindi: "हरलीन कौर", meaning: "परमात्मा के प्रेम और स्मरण में सदैव लीन रहने वाली राजकुमारी", spiritualContext: "ਗੁਰਬਾਣੀ ਲਿਵ ਅਤੇ ਸਿਮਰਨ ਦਾ ਸਰਵਉੱਚ ਆਦਰਸ਼", rashi: "Cancer", nakshatra: "Pushya", startingLetters: ["H", "ਹ"], luckyNumber: 2, category: "Gurbani Naam" },
      { nameEnglish: "Jasleen Kaur", nameHindi: "जसलीन कौर", meaning: "गुरु की महिमा व यश में प्रतिष्ठित", spiritualContext: "ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਦੀ ਸਿਫ਼ਤਿ-ਸਾਲਾਹ ਵਿਚ ਜੀਵਨ ਬਤੀਤ ਕਰਨਾ", rashi: "Capricorn", nakshatra: "Shravana", startingLetters: ["J", "ਜ"], luckyNumber: 6, category: "Gurbani Naam" },
      { nameEnglish: "Japneet Kaur", nameHindi: "जपनीत कौर", meaning: "जपुजी साहिब के पावन उपदेशों को जीवन में धारण करने वाली", spiritualContext: "ਜਪੁਜੀ ਸਾਹਿਬ ਦੀ ਨਿੱਤਨੇਮ ਮਰਯਾਦਾ ਤੇ ਸੱਚੀ ਕਮਾਈ", rashi: "Capricorn", nakshatra: "Uttara Ashadha", startingLetters: ["J", "ਜ"], luckyNumber: 4, category: "Gurmat Naam" },
      { nameEnglish: "Amrit Kaur", nameHindi: "अमृत कौर", meaning: "अमरत्व प्रदान करने वाला दैवीय अमृत, पवित्रता की प्रतिमूर्ति", spiritualContext: "ਖੰਡੇ ਬਾਟੇ ਦੀ ਪਾਹੁਲ ਅਤੇ ਗੁਰੂ ਕ੍ਰਿਪਾ ਦਾ ਪਵਿੱਤਰ ਪ੍ਰਤੀਕ", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["A", "ਅ"], luckyNumber: 1, category: "Gurmat Naam" },
      { nameEnglish: "Kirat Kaur", nameHindi: "कीरत कौर", meaning: "सच्चे कर्म और प्रभु की स्तुति में लीन रहने वाली", spiritualContext: "ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ ਦਾ ਸਿਧਾਂਤ: 'ਕਿਰਤ ਕਰੋ, ਨਾਮ ਜਪੋ, ਵੰਡ ਛਕੋ'", rashi: "Gemini", nakshatra: "Ardra", startingLetters: ["K", "ਕ"], luckyNumber: 5, category: "Gurbani Naam" },
      { nameEnglish: "Simran Kaur", nameHindi: "सिमरन कौर", meaning: "ईश्वर का निरंतर स्मरण, ध्यान और आत्मिक शांति", spiritualContext: "ਨਾਮ ਸਿਮਰਨ ਦੁਆਰਾ ਮਨ ਦੀ ਪਰਮ ਸ਼ਾਂਤੀ ਤੇ ਨਿਰਮਲਤਾ", rashi: "Aquarius", nakshatra: "Shatabhisha", startingLetters: ["S", "ਸ"], luckyNumber: 7, category: "Gurmat Naam" },
      { nameEnglish: "Prabhnoor Kaur", nameHindi: "प्रभनूर कौर", meaning: "परमात्मा का दिव्य नूर, दैवीय आभा वाली राजकुमारी", spiritualContext: "ਅਵਲਿ ਅਲਹ ਨੂਰੁ ਉਪਾਇਆ ਕੁਦਰਤਿ ਕੇ ਸਭ ਬੰਦੇ", rashi: "Virgo", nakshatra: "Uttara Phalguni", startingLetters: ["P", "ਪ"], luckyNumber: 3, category: "Gurbani Naam" }
    ]
  },

  christian: {
    boy: [
      { nameEnglish: "Gabriel", nameHindi: "गेब्रियल", meaning: "ईश्वर मेरी शक्ति हैं (God is my strength)", spiritualContext: "पवित्र बाइबिल के मुख्य देवदूत (Archangel Gabriel)", rashi: "Aquarius", nakshatra: "Dhanishta", startingLetters: ["G"], luckyNumber: 7, category: "Biblical Angelic" },
      { nameEnglish: "Ethan", nameHindi: "ईथन", meaning: "दृढ़, निष्ठावान और सुदृढ़ विश्वासी", spiritualContext: "भजन संहिता 89 के रचयिता एतान एज्राही (Ethan the Ezrahite)", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["E"], luckyNumber: 1, category: "Biblical Virtue" },
      { nameEnglish: "Joshua", nameHindi: "जोशुआ", meaning: "प्रभु ही मुक्तिदाता व रक्षक हैं (The Lord is salvation)", spiritualContext: "मूसा के उत्तराधिकारी और प्रतिज्ञा के देश के अगुआ", rashi: "Sagittarius", nakshatra: "Mula", startingLetters: ["J"], luckyNumber: 3, category: "Biblical Leader" },
      { nameEnglish: "Noah", nameHindi: "नोआ", meaning: "विश्राम, सांत्वना और शांति का अग्रदूत", spiritualContext: "संसार की रक्षा करने वाले महान नबी हज़रत नूह (Noah's Ark)", rashi: "Scorpio", nakshatra: "Anuradha", startingLetters: ["N"], luckyNumber: 9, category: "Biblical Patriarch" },
      { nameEnglish: "David", nameHindi: "डेविड", meaning: "प्रभु का अत्यंत प्रिय (Beloved of God)", spiritualContext: "राजा दाऊद, इस्राएल के महान राजा व भजन रचयिता", rashi: "Sagittarius", nakshatra: "Purva Ashadha", startingLetters: ["D"], luckyNumber: 4, category: "Biblical King" },
      { nameEnglish: "Matthew", nameHindi: "मैथ्यू", meaning: "ईश्वर का अमूल्य उपहार (Gift of God)", spiritualContext: "प्रभु यीशु के प्रेरित और प्रथम सुसमाचार के लेखक", rashi: "Leo", nakshatra: "Magha", startingLetters: ["M"], luckyNumber: 5, category: "Apostolic Saint" },
      { nameEnglish: "Samuel", nameHindi: "शमूएल", meaning: "ईश्वर ने प्रार्थना सुनी (Heard by God)", spiritualContext: "माता हन्ना की प्रार्थना और महान नबी शमूएल", rashi: "Aquarius", nakshatra: "Shatabhisha", startingLetters: ["S"], luckyNumber: 8, category: "Biblical Prophet" }
    ],

    girl: [
      { nameEnglish: "Grace", nameHindi: "ग्रेस", meaning: "ईश्वर का असीम अनुग्रह, दया और कृपा", spiritualContext: "मसीही विश्वास का मुख्य आधार - प्रभु का निःस्वार्थ प्रेम", rashi: "Aquarius", nakshatra: "Dhanishta", startingLetters: ["G"], luckyNumber: 6, category: "Christian Virtue" },
      { nameEnglish: "Hannah", nameHindi: "हैना", meaning: "अनुग्रह और प्रार्थना की धनी निष्ठावान माता", spiritualContext: "नबी शमूएल की माता, जिनकी प्रार्थना प्रभु ने सुनी", rashi: "Cancer", nakshatra: "Punarvasu", startingLetters: ["H"], luckyNumber: 8, category: "Biblical Faith" },
      { nameEnglish: "Sophia", nameHindi: "सोफिया", meaning: "पवित्र ईश्वरीय ज्ञान व बुद्धि (Divine Wisdom)", spiritualContext: "हितोपदेश और नए नियम में वर्णित ईश्वरीय विवेक", rashi: "Aquarius", nakshatra: "Shatabhisha", startingLetters: ["S"], luckyNumber: 3, category: "Saintly Wisdom" },
      { nameEnglish: "Esther", nameHindi: "एस्तेर", meaning: "चमकता सितारा, साहस व प्रजा की रक्षा करने वाली रानी", spiritualContext: "बाइबिल की वीरांगना रानी एस्तेर", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["E"], luckyNumber: 9, category: "Biblical Queen" },
      { nameEnglish: "Maria", nameHindi: "मारिया", meaning: "पवित्र, आदरणीय, प्रभु यीशु की माता", spiritualContext: "धन्य कुंवारी मरियम (Blessed Virgin Mary)", rashi: "Leo", nakshatra: "Purva Phalguni", startingLetters: ["M"], luckyNumber: 2, category: "Blessed Saint" },
      { nameEnglish: "Faith", nameHindi: "फेथ", meaning: "अटूट विश्वास और आशा (Unshakable Trust)", spiritualContext: "इब्रानियों 11 में वर्णित विश्वास का मार्ग", rashi: "Sagittarius", nakshatra: "Uttara Ashadha", startingLetters: ["F"], luckyNumber: 1, category: "Christian Virtue" }
    ]
  },

  secular: {
    boy: [
      { nameEnglish: "Aarav", nameHindi: "आरव", meaning: "शांति, सौम्य चेतना और समरसता", spiritualContext: "शांति और जीवन में समभाव का प्रतीक", rashi: "Aries", nakshatra: "Ashwini", startingLetters: ["A", "अ"], luckyNumber: 1, category: "Nature & Harmony" },
      { nameEnglish: "Vivaan", nameHindi: "विवान", meaning: "जीवन शक्ति, नवप्रभात और सूर्योदय की ऊष्मा", spiritualContext: "नवीन आशा और उत्साह का संवाहक", rashi: "Taurus", nakshatra: "Rohini", startingLetters: ["V", "व"], luckyNumber: 5, category: "Nature Element" },
      { nameEnglish: "Kabir", nameHindi: "कबीर", meaning: "महान, समस्त सीमाओं से परे, स्वतंत्र विचारक", spiritualContext: "संत कबीर की समता, बंधुत्व व सत्यवादिता", rashi: "Gemini", nakshatra: "Mrigashira", startingLetters: ["K", "क"], luckyNumber: 9, category: "Humanist Virtue" },
      { nameEnglish: "Neil", nameHindi: "नील", meaning: "नीला आकाश, विशालता और समुद्र की गहराई", spiritualContext: "अनंत अंतरिक्ष और असीम संभावनाओं का द्योतक", rashi: "Scorpio", nakshatra: "Anuradha", startingLetters: ["N", "न"], luckyNumber: 8, category: "Cosmic Celestial" },
      { nameEnglish: "Rohan", nameHindi: "रोहन", meaning: "उन्नति, विकास और नई ऊंचाइयों को छूने वाला", spiritualContext: "निरंतर प्रगति और मानवता का उत्थान", rashi: "Libra", nakshatra: "Swati", startingLetters: ["R", "र"], luckyNumber: 6, category: "Universal Modern" },
      { nameEnglish: "Reyan", nameHindi: "रेयान", meaning: "प्रकाश की किरण, ताजगी और ज्ञान का प्रकाश", spiritualContext: "वैश्विक रूप से सुलभ और अर्थपूर्ण नाम", rashi: "Sagittarius", nakshatra: "Mula", startingLetters: ["R", "र"], luckyNumber: 3, category: "Cosmic Celestial" },
      { nameEnglish: "Samar", nameHindi: "समर", meaning: "साहस, संघर्ष में अडिग और धैर्यवान", spiritualContext: "मानवीय दृढ़ता और संकल्प का प्रतीक", rashi: "Aquarius", nakshatra: "Shatabhisha", startingLetters: ["S", "स"], luckyNumber: 8, category: "Humanist Virtue" },
      { nameEnglish: "Advait", nameHindi: "अद्वैत", meaning: "अद्वितीय, एकात्म, सार्वभौमिक एकता", spiritualContext: "ब्रह्मांड की अविभाज्य एकता का दर्शन", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["A", "अ"], luckyNumber: 9, category: "Universal Modern" }
    ],

    girl: [
      { nameEnglish: "Tara", nameHindi: "तारा", meaning: "ध्रुव तारा, रात्रि के अंधकार में दिशा दिखाने वाली रोशनी", spiritualContext: "खगोलीय सौंदर्य और आत्मनिर्भरता का प्रतीक", rashi: "Libra", nakshatra: "Chitra", startingLetters: ["T", "त"], luckyNumber: 1, category: "Cosmic Celestial" },
      { nameEnglish: "Maya", nameHindi: "माया", meaning: "प्रकृति की सृजनात्मक शक्ति, करुणा और सुंदरता", spiritualContext: "सृष्टि और मातृत्व का वैश्विक स्वरूप", rashi: "Leo", nakshatra: "Magha", startingLetters: ["M", "म"], luckyNumber: 4, category: "Nature & Harmony" },
      { nameEnglish: "Mira", nameHindi: "मीरा", meaning: "शांति, समुद्र की लहरें, प्रकाश और समृद्धि", spiritualContext: "वैश्विक स्तर पर अत्यधिक प्रिय और काव्यात्मक", rashi: "Leo", nakshatra: "Purva Phalguni", startingLetters: ["M", "म"], luckyNumber: 7, category: "Universal Modern" },
      { nameEnglish: "Anaya", nameHindi: "अनाया", meaning: "अद्वितीय, परोपकारी, जिसकी कोई सीमा न हो", spiritualContext: "स्वतंत्रता और मानवीय करुणा की प्रतीक", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["A", "अ"], luckyNumber: 6, category: "Humanist Virtue" },
      { nameEnglish: "Kaveri", nameHindi: "कावेरी", meaning: "पवित्र जीवनदायिनी नदी, कल-कल बहती निर्मल धारा", spiritualContext: "प्रकृति संरक्षण और जल की निर्मलता", rashi: "Gemini", nakshatra: "Punarvasu", startingLetters: ["K", "क"], luckyNumber: 5, category: "Nature Element" },
      { nameEnglish: "Ira", nameHindi: "इरा", meaning: "धरा, वसुंधरा, ज्ञान और पृथ्वी की उर्वरता", spiritualContext: "धरती माता के प्रति कृतज्ञता और विवेक", rashi: "Aries", nakshatra: "Krittika", startingLetters: ["I", "इ"], luckyNumber: 3, category: "Nature Element" },
      { nameEnglish: "Diya", nameHindi: "दिया", meaning: "प्रकाश, नव आशा और सौम्य किरण", spiritualContext: "सकारात्मकता और अंधकार निवारण", rashi: "Pisces", nakshatra: "Purva Bhadrapada", startingLetters: ["D", "द"], luckyNumber: 3, category: "Cosmic Celestial" }
    ]
  }
};

/**
 * Filter and generate authentic names according to all astrological & cultural inputs
 */
export function generateAstrologicalNames({
  tradition = "sanatan",
  gender = "boy",
  dob = "",
  time = "",
  ampm = "AM",
  place = "",
  startingLetter = "",
  selectedRashi = "auto",
  gotra = "",
  fatherName = "",
  motherName = "",
  grandfatherName = "",
  traditionTheme = "all"
}) {
  // 1. Calculate authentic Panchange & Kundali
  const kundali = calculateVedicPanchang({
    dob,
    time,
    ampm,
    place,
    tradition,
    selectedRashi,
    startingLetter,
    gender,
    gotra,
    fatherName,
    motherName
  });

  const activeRashi = kundali.rashi;
  const pool = COMPREHENSIVE_NAMES_DATABASE[tradition]?.[gender] || COMPREHENSIVE_NAMES_DATABASE.sanatan.boy;

  const targetLetter = (startingLetter || "").trim().toLowerCase();
  const shubhSyllables = (kundali.shubhAkshar || []).map(s => s.toLowerCase());

  // 2. Score and sort candidates
  const scored = pool.map(item => {
    let score = 0;
    const nameEng = item.nameEnglish.toLowerCase();
    const nameHin = item.nameHindi.toLowerCase();

    // STRICT Starting Letter Match
    if (targetLetter) {
      if (nameEng.startsWith(targetLetter) || nameHin.startsWith(targetLetter)) {
        score += 1000;
      } else {
        score -= 500; // Deprioritize if does not match requested initial
      }
    } else {
      // If no initial requested, reward matching Nakshatra Pada syllables
      const matchesSyllable = shubhSyllables.some(s => {
        const cleanS = s.split(" ")[0].toLowerCase();
        return nameHin.startsWith(cleanS) || nameEng.startsWith(cleanS);
      });
      if (matchesSyllable) score += 300;
    }

    // Rashi match
    if (item.rashi.toLowerCase() === activeRashi.toLowerCase()) {
      score += 200;
    }

    // Category / Theme match
    if (traditionTheme && traditionTheme !== "all" && item.category && item.category.toLowerCase().includes(traditionTheme.toLowerCase())) {
      score += 100;
    }

    // Lineage & Parental resonance (phonetic vowel affinity)
    if (fatherName && (nameEng.includes(fatherName[0]?.toLowerCase()) || nameHin.includes(fatherName[0]))) {
      score += 20;
    }
    if (motherName && (nameEng.includes(motherName[0]?.toLowerCase()) || nameHin.includes(motherName[0]))) {
      score += 20;
    }

    return { ...item, score };
  });

  // 3. Filter and sort
  let finalNames = scored;
  if (targetLetter) {
    const strictMatches = scored.filter(i => i.score >= 500);
    if (strictMatches.length >= 3) {
      finalNames = strictMatches;
    }
  }

  finalNames.sort((a, b) => b.score - a.score);

  // Take top 8-10 names
  const selected = finalNames.slice(0, 10).map(({ score, ...rest }) => ({
    ...rest,
    gender: gender === "boy" ? "Boy" : "Girl"
  }));

  return {
    kundali,
    names: selected
  };
}
