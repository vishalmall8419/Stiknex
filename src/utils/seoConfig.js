// Centralized SEO Configuration for Stiknex
// Supports Phase 2, Phase 3, Phase 4, Phase 6, Phase 10, Phase 12

export const BASE_URL = "https://stiknex.vercel.app";

export const seoConfig = {
  "/": {
    path: "/",
    canonical: `${BASE_URL}/`,
    title: "Stiknex – Free Sticky Notes, Online Notebook & Productivity Tools",
    h1: "Free Online Productivity & Utility Tools",
    description: "Stiknex is a free online productivity platform featuring infinite sticky notes boards, an AI-powered notebook, Excalidraw whiteboard, calculators, converters, QR code generator and more. No sign-up required.",
    primaryIntent: "free productivity tools, sticky notes, online notebook",
    secondaryIntents: ["digital sticky notes", "online notepad", "free utility tools"],
    keywords: "sticky notes, online sticky notes, free sticky notes app, online notebook, digital whiteboard, productivity tools, excalidraw, note taking app, free online tools",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` }
    ],
    relatedTools: ["/sticky-notes", "/online-notebook", "/whiteboard", "/word-counter", "/tools"],
    faqs: [
      { q: "What is Stiknex?", a: "Stiknex is a completely free online productivity platform featuring infinite sticky notes, an online notebook, digital whiteboard, and utility tools." },
      { q: "Is Stiknex completely free?", a: "Yes, Stiknex is 100% free with no account creation or subscription required." },
      { q: "Does Stiknex save my notes locally?", a: "Yes, your notes, boards, and tool states are automatically saved directly in your browser's local storage for privacy and instant offline access." }
    ]
  },

  "/sticky-notes": {
    path: "/sticky-notes",
    canonical: `${BASE_URL}/sticky-notes`,
    title: "Free Online Sticky Notes & Infinite Canvas | Stiknex",
    h1: "Free Online Sticky Notes Board",
    description: "Create, organize, and color-code infinite digital sticky notes on an interactive canvas. Brainstorm ideas, track tasks, and drag notes freely without signing in.",
    primaryIntent: "online sticky notes / sticky notes online / digital sticky notes",
    secondaryIntents: ["free sticky notes app", "virtual corkboard", "sticky note organizer"],
    keywords: "online sticky notes, sticky notes online, digital sticky notes, free sticky notes, virtual sticky notes, note board online",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Sticky Notes", item: `${BASE_URL}/sticky-notes` }
    ],
    cluster: "Writing & Organization",
    relatedTools: ["/online-notebook", "/whiteboard", "/word-counter"],
    faqs: [
      { q: "Can I move sticky notes around?", a: "Yes, you can drag and drop sticky notes anywhere on the infinite canvas and organize them by color." },
      { q: "Are my sticky notes saved when I close the tab?", a: "Yes, Stiknex automatically preserves all your sticky notes locally in your browser so you never lose your thoughts." }
    ]
  },

  "/online-notebook": {
    path: "/online-notebook",
    canonical: `${BASE_URL}/online-notebook`,
    title: "Free Online Notebook & Digital Notepad | Stiknex",
    h1: "Free Online Notebook & Text Editor",
    description: "Distraction-free rich text notebook editor online. Format headings, bullet lists, code snippets, and auto-save notes locally with zero account sign-up.",
    primaryIntent: "online notebook / digital notebook / free online notebook",
    secondaryIntents: ["online notepad", "browser note editor", "distraction free writing"],
    keywords: "online notebook, digital notebook, free online notebook, online notepad, browser text editor, note taking online",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Notebook", item: `${BASE_URL}/online-notebook` }
    ],
    cluster: "Writing & Organization",
    relatedTools: ["/sticky-notes", "/word-counter", "/character-counter", "/whiteboard"],
    faqs: [
      { q: "Is the online notebook free to use?", a: "Yes, Stiknex Online Notebook is completely free and requires no registration." },
      { q: "Can I export my notes?", a: "Yes, you can copy, print, or download your formatted notes anytime." }
    ]
  },

  "/word-counter": {
    path: "/word-counter",
    canonical: `${BASE_URL}/word-counter`,
    title: "Free Online Word Counter – Real-Time Word & Character Count | Stiknex",
    h1: "Free Online Word Counter",
    description: "Count words, characters, sentences, and paragraphs in real time. Accurately calculate reading time, speaking time, and convert text case instantly.",
    primaryIntent: "word counter / online word counter / count words",
    secondaryIntents: ["text word count", "word counter tool", "essay word count"],
    keywords: "word counter, online word counter, count words, word count tool, free word counter, sentence counter, paragraph counter",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Word Counter", item: `${BASE_URL}/word-counter` }
    ],
    cluster: "Writing",
    relatedTools: ["/character-counter", "/reading-time-calculator", "/online-notebook"],
    faqs: [
      { q: "How does the Word Counter calculate word count?", a: "It splits text by whitespace boundaries and filters out empty spaces, punctuation, and formatting symbols." },
      { q: "Is there a limit on how much text I can paste?", a: "No, you can paste entire articles, essays, or chapters with zero lag." }
    ]
  },

  "/character-counter": {
    path: "/character-counter",
    canonical: `${BASE_URL}/character-counter`,
    title: "Character Counter Online – Characters With & Without Spaces | Stiknex",
    h1: "Free Online Character Counter",
    description: "Measure exact character count with and without spaces for social media, SEO meta tags, essays, and text limits. Fast, free, and private.",
    primaryIntent: "character counter / character count / online character counter",
    secondaryIntents: ["twitter character counter", "letter counter", "spaces character count"],
    keywords: "character counter, character count, online character counter, count characters, letter counter, text length checker",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Character Counter", item: `${BASE_URL}/character-counter` }
    ],
    cluster: "Writing",
    relatedTools: ["/word-counter", "/reading-time-calculator", "/online-notebook"],
    faqs: [
      { q: "Does the counter show characters without spaces?", a: "Yes, both total characters and characters excluding spaces are calculated in real time." }
    ]
  },

  "/reading-time-calculator": {
    path: "/reading-time-calculator",
    canonical: `${BASE_URL}/reading-time-calculator`,
    title: "Reading Time Calculator – Estimate Article & Speech Duration | Stiknex",
    h1: "Free Reading Time Calculator",
    description: "Estimate how long it will take to read or speak your text. Based on standard 200 words-per-minute silent reading and 130 wpm speech delivery.",
    primaryIntent: "reading time calculator / calculate reading time",
    secondaryIntents: ["speech time calculator", "reading duration estimator", "words per minute timer"],
    keywords: "reading time calculator, calculate reading time, speech time calculator, reading speed estimator, wpm calculator",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Reading Time Calculator", item: `${BASE_URL}/reading-time-calculator` }
    ],
    cluster: "Writing",
    relatedTools: ["/word-counter", "/character-counter", "/online-notebook"],
    faqs: [
      { q: "What average reading speed is used?", a: "Silent reading is calculated at 200 words per minute, and oral presentation at 130 words per minute." }
    ]
  },

  "/simple-calculator": {
    path: "/simple-calculator",
    canonical: `${BASE_URL}/simple-calculator`,
    title: "Simple Calculator Online – Quick Arithmetic & Math | Stiknex",
    h1: "Free Simple Online Calculator",
    description: "Perform quick everyday calculations with addition, subtraction, multiplication, division, and percentages. Clean, responsive, and easy to use.",
    primaryIntent: "online calculator / simple calculator",
    secondaryIntents: ["basic math calculator", "easy calculator", "free web calculator"],
    keywords: "simple calculator, online calculator, basic calculator, math calculator, simple math tool",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Simple Calculator", item: `${BASE_URL}/simple-calculator` }
    ],
    cluster: "Calculators",
    relatedTools: ["/scientific-calculator", "/date-calculator", "/currency-converter"],
    faqs: [
      { q: "Can I use keyboard shortcuts?", a: "Yes, you can use numpad and standard keyboard number keys to calculate." }
    ]
  },

  "/scientific-calculator": {
    path: "/scientific-calculator",
    canonical: `${BASE_URL}/scientific-calculator`,
    title: "Online Scientific Calculator – Trig, Log & Powers | Stiknex",
    h1: "Free Online Scientific Calculator",
    description: "Advanced scientific calculator supporting trigonometry, logarithms, exponential powers, square roots, and parentheses for students and professionals.",
    primaryIntent: "scientific calculator online",
    secondaryIntents: ["advanced online calculator", "trig calculator", "log calculator"],
    keywords: "scientific calculator online, online scientific calculator, advanced math calculator, trigonometry calculator",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Scientific Calculator", item: `${BASE_URL}/scientific-calculator` }
    ],
    cluster: "Calculators",
    relatedTools: ["/simple-calculator", "/date-calculator", "/unit-converter"],
    faqs: [
      { q: "Does the scientific calculator support radian and degree modes?", a: "Yes, you can switch between radian and degree angle modes freely." }
    ]
  },

  "/date-calculator": {
    path: "/date-calculator",
    canonical: `${BASE_URL}/date-calculator`,
    title: "Date Calculator – Calculate Days Between Dates & Age | Stiknex",
    h1: "Free Online Date & Time Calculator",
    description: "Calculate exact duration between two dates in days, weeks, and months. Add or subtract days, calculate age, or find target calendar milestones.",
    primaryIntent: "date calculator / calculate days between dates",
    secondaryIntents: ["days between dates", "age calculator online", "add days to date"],
    keywords: "date calculator, calculate days between dates, age calculator, days counter, calendar duration calculator",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Date Calculator", item: `${BASE_URL}/date-calculator` }
    ],
    cluster: "Calculators",
    relatedTools: ["/simple-calculator", "/scientific-calculator", "/unit-converter"],
    faqs: [
      { q: "How accurate is the date calculator?", a: "It accounts for leap years, month lengths, and calendar daylight conventions." }
    ]
  },

  "/currency-converter": {
    path: "/currency-converter",
    canonical: `${BASE_URL}/currency-converter`,
    title: "Live Currency Converter – Real-Time Foreign Exchange Rates | Stiknex",
    h1: "Free Live Currency Converter",
    description: "Convert 150+ world currencies with up-to-date foreign exchange rates. Convert USD, EUR, INR, GBP, CAD, AUD, JPY and more instantly.",
    primaryIntent: "currency converter / exchange rate calculator",
    secondaryIntents: ["live forex rates", "money converter", "foreign exchange calculator"],
    keywords: "currency converter, exchange rate calculator, live currency rates, money converter, forex converter, usd to inr, eur to usd",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Currency Converter", item: `${BASE_URL}/currency-converter` }
    ],
    cluster: "Converters",
    relatedTools: ["/unit-converter", "/simple-calculator", "/date-calculator"],
    faqs: [
      { q: "Are currency exchange rates updated?", a: "Yes, rates are sourced from live financial data feeds and cached for rapid conversion." }
    ]
  },

  "/unit-converter": {
    path: "/unit-converter",
    canonical: `${BASE_URL}/unit-converter`,
    title: "Free Online Unit Converter – Metric & Imperial Conversion | Stiknex",
    h1: "Free Universal Unit Converter",
    description: "Convert length, area, volume, mass, temperature, speed, pressure, and power between metric and imperial standards with exact precision.",
    primaryIntent: "unit converter",
    secondaryIntents: ["metric to imperial converter", "measurement converter", "online unit conversion"],
    keywords: "unit converter, measurement converter, metric to imperial, conversion calculator, convert units",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Unit Converter", item: `${BASE_URL}/unit-converter` }
    ],
    cluster: "Converters",
    relatedTools: ["/length-converter", "/weight-converter", "/temperature-converter", "/area-converter"],
    faqs: [
      { q: "Which measurement systems are supported?", a: "Both Metric (SI) and US Imperial measurement units are fully supported across all categories." }
    ]
  },

  "/length-converter": {
    path: "/length-converter",
    canonical: `${BASE_URL}/length-converter`,
    title: "Length Converter – Meters, Feet, Inches, Miles & Kilometers | Stiknex",
    h1: "Free Online Length Converter",
    description: "Convert length and distance units: millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles accurately.",
    primaryIntent: "length converter",
    secondaryIntents: ["meters to feet", "inches to cm", "distance converter"],
    keywords: "length converter, distance converter, meters to feet, inches to cm, miles to km, unit converter length",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Length Converter", item: `${BASE_URL}/length-converter` }
    ],
    cluster: "Converters",
    relatedTools: ["/area-converter", "/volume-converter", "/weight-converter", "/unit-converter"],
    faqs: [
      { q: "How do I convert inches to centimeters?", a: "One inch equals exactly 2.54 centimeters. Simply enter your value in our calculator for immediate conversion." }
    ]
  },

  "/area-converter": {
    path: "/area-converter",
    canonical: `${BASE_URL}/area-converter`,
    title: "Area Converter – Square Meters, Feet, Acres & Hectares | Stiknex",
    h1: "Free Online Area Converter",
    description: "Convert area measurements: square meters, square feet, acres, hectares, square kilometers, and square miles with instant calculations.",
    primaryIntent: "area converter",
    secondaryIntents: ["acres to square feet", "hectares to acres", "land measurement converter"],
    keywords: "area converter, square feet to square meters, acres to hectares, land area converter",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Area Converter", item: `${BASE_URL}/area-converter` }
    ],
    cluster: "Converters",
    relatedTools: ["/length-converter", "/volume-converter", "/unit-converter"],
    faqs: [
      { q: "How many square feet are in an acre?", a: "There are exactly 43,560 square feet in one acre." }
    ]
  },

  "/volume-converter": {
    path: "/volume-converter",
    canonical: `${BASE_URL}/volume-converter`,
    title: "Volume Converter – Liters, Gallons, Cups & Milliliters | Stiknex",
    h1: "Free Online Volume Converter",
    description: "Convert volume and liquid capacity: liters, milliliters, US gallons, fluid ounces, cups, tablespoons, and cubic meters.",
    primaryIntent: "volume converter",
    secondaryIntents: ["liters to gallons", "cups to ml", "liquid measurement converter"],
    keywords: "volume converter, liters to gallons, cups to ml, fluid ounces to ml, liquid volume converter",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Volume Converter", item: `${BASE_URL}/volume-converter` }
    ],
    cluster: "Converters",
    relatedTools: ["/weight-converter", "/length-converter", "/unit-converter"],
    faqs: [
      { q: "How many milliliters are in a US cup?", a: "One standard US cup equals approximately 236.588 milliliters." }
    ]
  },

  "/weight-converter": {
    path: "/weight-converter",
    canonical: `${BASE_URL}/weight-converter`,
    title: "Weight Converter – Kilograms, Pounds, Ounces & Grams | Stiknex",
    h1: "Free Online Weight & Mass Converter",
    description: "Convert weight and mass between kilograms, grams, pounds, ounces, stones, and metric tons with precise conversion formulas.",
    primaryIntent: "weight converter",
    secondaryIntents: ["kg to lbs", "pounds to kilograms", "ounces to grams"],
    keywords: "weight converter, mass converter, kg to lbs, pounds to kg, ounces to grams, weight conversion calculator",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Weight Converter", item: `${BASE_URL}/weight-converter` }
    ],
    cluster: "Converters",
    relatedTools: ["/volume-converter", "/length-converter", "/unit-converter"],
    faqs: [
      { q: "How many pounds are in one kilogram?", a: "One kilogram is approximately 2.20462 pounds." }
    ]
  },

  "/temperature-converter": {
    path: "/temperature-converter",
    canonical: `${BASE_URL}/temperature-converter`,
    title: "Temperature Converter – Celsius, Fahrenheit & Kelvin | Stiknex",
    h1: "Free Online Temperature Converter",
    description: "Convert temperatures between Celsius (°C), Fahrenheit (°F), and Kelvin (K) instantly with accurate thermodynamic formulas.",
    primaryIntent: "temperature converter",
    secondaryIntents: ["celsius to fahrenheit", "fahrenheit to celsius", "kelvin to celsius"],
    keywords: "temperature converter, celsius to fahrenheit, fahrenheit to celsius, kelvin converter, temperature conversion formula",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Temperature Converter", item: `${BASE_URL}/temperature-converter` }
    ],
    cluster: "Converters",
    relatedTools: ["/unit-converter", "/speed-converter", "/pressure-converter"],
    faqs: [
      { q: "What is the formula for Celsius to Fahrenheit?", a: "°F = (°C × 9/5) + 32." }
    ]
  },

  "/speed-converter": {
    path: "/speed-converter",
    canonical: `${BASE_URL}/speed-converter`,
    title: "Speed Converter – MPH, KM/H, Knots & Meters per Second | Stiknex",
    h1: "Free Online Speed Converter",
    description: "Convert speed and velocity units: miles per hour (mph), kilometers per hour (km/h), knots, and meters per second (m/s).",
    primaryIntent: "speed converter",
    secondaryIntents: ["mph to kmh", "knots to mph", "velocity conversion"],
    keywords: "speed converter, mph to kmh, kmh to mph, knots to kmh, meters per second converter",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Speed Converter", item: `${BASE_URL}/speed-converter` }
    ],
    cluster: "Converters",
    relatedTools: ["/length-converter", "/pressure-converter", "/power-converter"],
    faqs: [
      { q: "How many km/h is 60 mph?", a: "60 mph equals approximately 96.56 km/h." }
    ]
  },

  "/pressure-converter": {
    path: "/pressure-converter",
    canonical: `${BASE_URL}/pressure-converter`,
    title: "Pressure Converter – PSI, Bar, Pascal & Atmospheres | Stiknex",
    h1: "Free Online Pressure Converter",
    description: "Convert pressure units between Pascals, Kilopascals, Bar, PSI (Pounds per Square Inch), and standard Atmospheres (atm).",
    primaryIntent: "pressure converter",
    secondaryIntents: ["psi to bar", "bar to psi", "pascal to atm"],
    keywords: "pressure converter, psi to bar, bar to psi, pascal converter, atmospheres to psi",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Pressure Converter", item: `${BASE_URL}/pressure-converter` }
    ],
    cluster: "Converters",
    relatedTools: ["/power-converter", "/speed-converter", "/unit-converter"],
    faqs: [
      { q: "How many PSI are in 1 bar?", a: "One bar equals approximately 14.5038 PSI." }
    ]
  },

  "/power-converter": {
    path: "/power-converter",
    canonical: `${BASE_URL}/power-converter`,
    title: "Power Converter – Watts, Kilowatts, Horsepower & BTU | Stiknex",
    h1: "Free Online Power Converter",
    description: "Convert electrical and mechanical power: Watts (W), Kilowatts (kW), Megawatts, metric Horsepower (hp), and BTU/hour.",
    primaryIntent: "power converter",
    secondaryIntents: ["watts to horsepower", "kw to hp", "electrical power converter"],
    keywords: "power converter, watts to horsepower, kw to hp, horsepower to watts, energy rate converter",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Power Converter", item: `${BASE_URL}/power-converter` }
    ],
    cluster: "Converters",
    relatedTools: ["/pressure-converter", "/speed-converter", "/unit-converter"],
    faqs: [
      { q: "How many Watts are in one mechanical Horsepower?", a: "One mechanical horsepower equals approximately 745.7 Watts." }
    ]
  },

  "/qr-code-generator": {
    path: "/qr-code-generator",
    canonical: `${BASE_URL}/qr-code-generator`,
    title: "Free QR Code Generator – Custom Colors & Instant Download | Stiknex",
    h1: "Free Custom QR Code Generator",
    description: "Generate high-resolution QR codes for websites, WiFi networks, plain text, and contact links. Customize foreground colors and download as PNG free.",
    primaryIntent: "QR code generator",
    secondaryIntents: ["free qr code maker", "custom qr code online", "generate qr code"],
    keywords: "qr code generator, free qr code maker, create qr code, custom qr code online, qr code creator",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "QR Code Generator", item: `${BASE_URL}/qr-code-generator` }
    ],
    cluster: "Generators & Utilities",
    relatedTools: ["/password-generator", "/color-picker", "/word-counter"],
    faqs: [
      { q: "Do the generated QR codes expire?", a: "No, Stiknex QR codes are direct, static QR codes that never expire and have no scan limits." },
      { q: "Is the QR Code Generator free for commercial use?", a: "Yes, you can download and use your QR codes for both personal and commercial purposes with zero charge." }
    ]
  },

  "/password-generator": {
    path: "/password-generator",
    canonical: `${BASE_URL}/password-generator`,
    title: "Random Password Generator – Strong & Secure Password Maker | Stiknex",
    h1: "Free Strong Random Password Generator",
    description: "Generate cryptographically secure, random passwords with custom lengths, numbers, symbols, and uppercase characters. 100% client-side privacy.",
    primaryIntent: "password generator",
    secondaryIntents: ["strong password maker", "secure password generator", "random password creator"],
    keywords: "password generator, strong password generator, random password maker, secure password tool, password creator",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Password Generator", item: `${BASE_URL}/password-generator` }
    ],
    cluster: "Generators & Utilities",
    relatedTools: ["/qr-code-generator", "/color-picker", "/word-counter"],
    faqs: [
      { q: "Is my generated password safe and private?", a: "Yes, passwords are created entirely inside your web browser using crypto-secure algorithms. Nothing is sent to any server." }
    ]
  },

  "/color-picker": {
    path: "/color-picker",
    canonical: `${BASE_URL}/color-picker`,
    title: "Free Color Picker & Palette Tool – HEX, RGB, HSL Converter | Stiknex",
    h1: "Free Online Color Picker & Converter",
    description: "Inspect colors, convert between HEX, RGB, and HSL color spaces, and copy CSS color values instantly. Interactive palette and eyedropper support.",
    primaryIntent: "color picker",
    secondaryIntents: ["hex to rgb converter", "color code picker", "css color palette"],
    keywords: "color picker, hex to rgb, rgb to hsl, color palette generator, css color picker, online color tool",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` },
      { name: "Color Picker", item: `${BASE_URL}/color-picker` }
    ],
    cluster: "Generators & Utilities",
    relatedTools: ["/qr-code-generator", "/password-generator", "/word-counter"],
    faqs: [
      { q: "Can I convert HEX colors directly to RGB and HSL?", a: "Yes, whenever you pick or type a color, the HEX, RGB, and HSL formats update simultaneously." }
    ]
  },

  "/tools": {
    path: "/tools",
    canonical: `${BASE_URL}/tools`,
    title: "Free Online Tools – Calculators, Converters & Generators | Stiknex",
    h1: "Free Online Productivity & Utility Tools Directory",
    description: "Explore Stiknex's full suite of 18+ free online productivity tools: scientific calculators, universal unit converters, QR code generator, password generator, word counter and more.",
    primaryIntent: "free online tools directory",
    secondaryIntents: ["web productivity tools", "online utilities", "free calculators and converters"],
    keywords: "free online tools, productivity tools, calculators, unit converters, qr code generator, password generator, color picker, online utilities",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Tools", item: `${BASE_URL}/tools` }
    ],
    relatedTools: ["/word-counter", "/simple-calculator", "/unit-converter", "/qr-code-generator", "/password-generator", "/color-picker"],
    faqs: [
      { q: "Are all tools on Stiknex free?", a: "Yes, all utilities on Stiknex are 100% free with no subscriptions or accounts required." }
    ]
  },

  "/blog": {
    path: "/blog",
    canonical: `${BASE_URL}/blog`,
    title: "Blog – Productivity Guides, Writing Tips & Online Tools | Stiknex",
    h1: "Stiknex Productivity & Technology Blog",
    description: "Read in-depth articles on productivity workflows, note-taking strategies, writing efficiency, math shortcuts, and modern digital utility guides.",
    primaryIntent: "productivity blog / note taking tips / online tools guides",
    secondaryIntents: ["study hacks", "writing guides", "stiknex articles"],
    keywords: "productivity blog, note taking tips, sticky notes guide, online tools blog, digital workspace tips, writing productivity",
    schemaType: "Blog",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Blog", item: `${BASE_URL}/blog` }
    ],
    relatedTools: ["/word-counter", "/online-notebook", "/sticky-notes", "/tools"]
  },

  "/about": {
    path: "/about",
    canonical: `${BASE_URL}/about`,
    title: "About Stiknex – Free Productivity Platform by Vishal Mall",
    h1: "About Stiknex",
    description: "Learn about the mission behind Stiknex, a lightweight, privacy-focused suite of online productivity tools built by Vishal Mall to help people write, calculate, and create without friction.",
    primaryIntent: "about stiknex / stiknex creator",
    secondaryIntents: ["vishal mall developer", "free productivity mission"],
    keywords: "about stiknex, stiknex developer, vishal mall, productivity app, free notes app story",
    schemaType: "AboutPage",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "About", item: `${BASE_URL}/about` }
    ],
    relatedTools: ["/sticky-notes", "/online-notebook", "/tools"]
  },

  "/whiteboard": {
    path: "/whiteboard",
    canonical: `${BASE_URL}/whiteboard`,
    title: "Free Online Whiteboard – Draw, Sketch & Diagram | Stiknex",
    h1: "Free Online Digital Whiteboard",
    description: "Sketch, diagram, brainstorm, and collaborate with Stiknex's free digital whiteboard powered by Excalidraw. Infinite canvas with shapes, arrows, and freehand drawing.",
    primaryIntent: "free online whiteboard / excalidraw digital whiteboard",
    secondaryIntents: ["online sketch board", "collaborative drawing", "mind mapping whiteboard"],
    keywords: "free online whiteboard, excalidraw, digital whiteboard, online drawing board, whiteboard app, free sketch tool",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Whiteboard", item: `${BASE_URL}/whiteboard` }
    ],
    cluster: "Writing & Organization",
    relatedTools: ["/sticky-notes", "/online-notebook", "/tools"]
  },

  "/buy-me-a-coffee": {
    path: "/buy-me-a-coffee",
    canonical: `${BASE_URL}/buy-me-a-coffee`,
    title: "Support Stiknex – Buy Me a Coffee | Vishal Mall",
    h1: "Support Stiknex Development",
    description: "Support the ongoing maintenance and development of Stiknex free productivity tools. Your support keeps Stiknex ad-light, free, and accessible for everyone.",
    primaryIntent: "support stiknex / buy me a coffee",
    secondaryIntents: ["support indie developer", "donate to stiknex"],
    keywords: "support stiknex, buy me a coffee, support developer, vishal mall, donate",
    schemaType: "WebPage",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Support", item: `${BASE_URL}/buy-me-a-coffee` }
    ],
    relatedTools: ["/about", "/tools"]
  }
};

// Aliases for legacy and sub-path links
export const seoAliases = {
  "/notes": "/sticky-notes",
  "/tools/word-counter": "/word-counter",
  "/tools/character-counter": "/character-counter",
  "/tools/reading-time-calculator": "/reading-time-calculator",
  "/tools/simple-calculator": "/simple-calculator",
  "/tools/scientific-calculator": "/scientific-calculator",
  "/tools/date-calculator": "/date-calculator",
  "/tools/currency-converter": "/currency-converter",
  "/tools/unit-converter": "/unit-converter",
  "/tools/length-converter": "/length-converter",
  "/tools/area-converter": "/area-converter",
  "/tools/volume-converter": "/volume-converter",
  "/tools/weight-converter": "/weight-converter",
  "/tools/temperature-converter": "/temperature-converter",
  "/tools/speed-converter": "/speed-converter",
  "/tools/pressure-converter": "/pressure-converter",
  "/tools/power-converter": "/power-converter",
  "/tools/qr-generator": "/qr-code-generator",
  "/tools/qr-code-generator": "/qr-code-generator",
  "/tools/password-generator": "/password-generator",
  "/tools/color-picker": "/color-picker"
};

export const getSeoForPath = (path) => {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const unaliased = seoAliases[clean] || clean;
  return seoConfig[unaliased] || seoConfig["/"];
};

