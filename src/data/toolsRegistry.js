// ============================================================================
// STIKNEX 200-TOOL CATALOGUE & METADATA REGISTRY
// Single Source of Truth for Tools, Categories, Routes, Engines & SEO
// ============================================================================

export const TOOL_CATEGORIES = [
  { id: "calculators", name: "Calculators & Converters", icon: "fa-solid fa-calculator", description: "Everyday arithmetic, percentages, dates, and measurement conversions." },
  { id: "measurement", name: "Advanced Measurement", icon: "fa-solid fa-ruler-combined", description: "Engineering, speed, volume, pressure, and ratio calculations." },
  { id: "writing", name: "Text & Writing", icon: "fa-solid fa-pen-nib", description: "Real-time counters, case transformers, line utilities, and formatting." },
  { id: "text-analysis", name: "Text Comparison & Extraction", icon: "fa-solid fa-code-compare", description: "Diff checkers, markdown editors, binary encoders, and cleaners." },
  { id: "image", name: "Image Tools", icon: "fa-solid fa-image", description: "Browser-side compression, cropping, conversion, and palette extraction." },
  { id: "pdf", name: "PDF & Documents", icon: "fa-solid fa-file-pdf", description: "Client-side PDF page merging, splitting, rotation, and inspection." },
  { id: "developer", name: "Developer Tools", icon: "fa-solid fa-code", description: "JSON formatters, regex testers, CSV converters, and code beautifiers." },
  { id: "encoding", name: "Encoding & Web Utilities", icon: "fa-solid fa-network-wired", description: "URL, HTML, Base64, JWT decoders, timestamp, and HTTP references." },
  { id: "security", name: "Security & Passwords", icon: "fa-solid fa-shield-halved", description: "Entropy password generators, SHA/HMAC hashing, and data sanitizers." },
  { id: "design", name: "Color & Design", icon: "fa-solid fa-palette", description: "Color pickers, contrast checkers, box shadow, and CSS generators." },
  { id: "time", name: "Date & Time", icon: "fa-solid fa-clock", description: "World clocks, countdowns, stopwatches, and business day calculators." },
  { id: "math", name: "Education & Mathematics", icon: "fa-solid fa-square-root-variable", description: "Algebra solvers, prime checkers, statistics, and matrix calculators." },
  { id: "finance", name: "Personal Finance", icon: "fa-solid fa-coins", description: "EMI, compound interest, SIP, loan payoff, and GST calculators." },
  { id: "typing", name: "Typing & Keyboard", icon: "fa-solid fa-keyboard", description: "Typing speed tests, home-row lessons, accuracy games, and challenges." },
  { id: "productivity", name: "Notes & Productivity", icon: "fa-solid fa-note-sticky", description: "Sticky notes boards, online notebooks, to-do lists, and planners." },
  { id: "seo", name: "SEO & Website Tools", icon: "fa-solid fa-magnifying-glass-chart", description: "SERP previews, meta tag counters, robots/sitemap generators, and slug checkers." },
  { id: "data", name: "Data & Spreadsheets", icon: "fa-solid fa-table", description: "CSV viewers, JSON/XML converters, deduplicators, and table tools." },
  { id: "media", name: "Audio & Video", icon: "fa-solid fa-video", description: "Waveform viewers, aspect ratios, hardware testers, and media utilities." },
  { id: "generators", name: "QR, Sharing & Generators", icon: "fa-solid fa-qrcode", description: "QR code creators, barcode generators, randomizers, and decision wheels." },
  { id: "helpers", name: "Everyday Helpers", icon: "fa-solid fa-toolbox", description: "Screen checks, invoice builders, flashcards, and decision helpers." }
];

export const ALL_TOOLS = [
  // -------------------------------------------------------------
  // CATEGORY 1: CALCULATORS & CONVERTERS
  // -------------------------------------------------------------
  {
    id: "basic-calculator",
    slug: "basic-calculator",
    category: "calculators",
    title: "Basic Calculator",
    h1: "Free Online Basic Calculator",
    tagline: "Instant arithmetic calculator with keyboard support, decimals, and clean display.",
    keywords: "basic calculator, online calculator, simple math calculator, free arithmetic tool",
    icon: "fa-solid fa-calculator",
    engine: "calculator-basic"
  },
  {
    id: "scientific-calculator",
    slug: "scientific-calculator",
    category: "calculators",
    title: "Scientific Calculator",
    h1: "Free Online Scientific Calculator",
    tagline: "Advanced mathematical computation with trigonometry, logarithms, powers, and roots.",
    keywords: "scientific calculator, online scientific calculator, trig calculator, log calculator",
    icon: "fa-solid fa-square-root-variable",
    engine: "calculator-scientific"
  },
  {
    id: "percentage-calculator",
    slug: "percentage-calculator",
    category: "calculators",
    title: "Percentage Calculator",
    h1: "Free Online Percentage Calculator",
    tagline: "Calculate percent change, discounts, increases, and proportions in seconds.",
    keywords: "percentage calculator, calculate percent, percentage increase calculator, discount percentage",
    icon: "fa-solid fa-percent",
    engine: "calculator-percentage"
  },
  {
    id: "age-calculator",
    slug: "age-calculator",
    category: "calculators",
    title: "Age Calculator",
    h1: "Free Online Age Calculator",
    tagline: "Find your exact chronological age in years, months, weeks, days, and minutes.",
    keywords: "age calculator, exact age calculator, birthday age calculator, calculate age from date of birth",
    icon: "fa-solid fa-cake-candles",
    engine: "calculator-age"
  },
  {
    id: "date-calculator",
    slug: "date-difference-calculator",
    aliases: ["date-calculator"],
    category: "calculators",
    title: "Date Difference Calculator",
    h1: "Free Online Date Difference Calculator",
    tagline: "Compute the exact duration, days, and business weeks between two calendar dates.",
    keywords: "date difference calculator, days between dates, calendar calculator, date duration",
    icon: "fa-solid fa-calendar-days",
    engine: "calculator-date-diff"
  },
  {
    id: "time-calculator",
    slug: "time-calculator",
    category: "calculators",
    title: "Time Calculator",
    h1: "Free Online Time Calculator",
    tagline: "Add, subtract, and convert hours, minutes, and seconds for timesheets and logs.",
    keywords: "time calculator, add time, subtract hours, time duration calculator, timesheet math",
    icon: "fa-solid fa-clock",
    engine: "calculator-time"
  },
  {
    id: "unit-converter",
    slug: "unit-converter",
    category: "calculators",
    title: "Unit Converter",
    h1: "Free Universal Unit Converter",
    tagline: "All-in-one measurement converter for length, mass, volume, and temperature.",
    keywords: "unit converter, universal converter, metric to imperial, measurement converter",
    icon: "fa-solid fa-scale-balanced",
    engine: "converter-universal"
  },
  {
    id: "length-converter",
    slug: "length-converter",
    category: "calculators",
    title: "Length Converter",
    h1: "Free Online Length Converter",
    tagline: "Convert meters, feet, inches, kilometers, miles, and yards with zero lag.",
    keywords: "length converter, feet to meters, inches to cm, miles to km, distance converter",
    icon: "fa-solid fa-ruler",
    engine: "converter-length"
  },
  {
    id: "weight-converter",
    slug: "weight-converter",
    category: "calculators",
    title: "Weight Converter",
    h1: "Free Online Weight & Mass Converter",
    tagline: "Convert kilograms, pounds, ounces, grams, stones, and metric tons instantly.",
    keywords: "weight converter, kg to lbs, pounds to kilograms, grams to ounces, mass conversion",
    icon: "fa-solid fa-weight-hanging",
    engine: "converter-weight"
  },
  {
    id: "temperature-converter",
    slug: "temperature-converter",
    category: "calculators",
    title: "Temperature Converter",
    h1: "Free Online Temperature Converter",
    tagline: "Simultaneous 3-way conversion between Celsius (°C), Fahrenheit (°F), and Kelvin (K).",
    keywords: "temperature converter, celsius to fahrenheit, fahrenheit to celsius, kelvin conversion",
    icon: "fa-solid fa-temperature-half",
    engine: "converter-temperature"
  },

  // -------------------------------------------------------------
  // CATEGORY 2: ADVANCED MEASUREMENT
  // -------------------------------------------------------------
  {
    id: "area-converter",
    slug: "area-converter",
    category: "measurement",
    title: "Area Converter",
    h1: "Free Online Area Converter",
    tagline: "Convert square feet, square meters, acres, hectares, and square kilometers.",
    keywords: "area converter, square feet to square meters, acres to hectares, land area calculator",
    icon: "fa-solid fa-border-all",
    engine: "converter-area"
  },
  {
    id: "volume-converter",
    slug: "volume-converter",
    category: "measurement",
    title: "Volume Converter",
    h1: "Free Online Volume & Capacity Converter",
    tagline: "Convert liters, milliliters, gallons, fluid ounces, cubic meters, and kitchen cups.",
    keywords: "volume converter, liters to gallons, ml to cups, fluid ounces conversion, capacity math",
    icon: "fa-solid fa-flask",
    engine: "converter-volume"
  },
  {
    id: "speed-converter",
    slug: "speed-converter",
    category: "measurement",
    title: "Speed Converter",
    h1: "Free Online Speed & Velocity Converter",
    tagline: "Convert mph, km/h, knots, meters per second, and Mach speed with precision.",
    keywords: "speed converter, mph to kmh, knots to mph, velocity conversion, mach calculator",
    icon: "fa-solid fa-gauge-high",
    engine: "converter-speed"
  },
  {
    id: "pressure-converter",
    slug: "pressure-converter",
    category: "measurement",
    title: "Pressure Converter",
    h1: "Free Online Pressure Converter",
    tagline: "Convert PSI, Bar, Pascals, Kilopascals, and standard Atmospheres.",
    keywords: "pressure converter, psi to bar, kpa to psi, atmospheric pressure conversion",
    icon: "fa-solid fa-compress",
    engine: "converter-pressure"
  },
  {
    id: "data-converter",
    slug: "data-converter",
    aliases: ["dataconverter"],
    category: "measurement",
    title: "Data Storage Converter",
    h1: "Free Online Data Storage Converter",
    tagline: "Convert bytes, KB, MB, GB, TB, and PB across binary (1024) and decimal (1000) standards.",
    keywords: "data converter, mb to gb, bytes to gigabytes, data storage conversion, terabyte calculator",
    icon: "fa-solid fa-database",
    engine: "converter-data"
  },
  {
    id: "fuel-economy-converter",
    slug: "fuel-economy-converter",
    category: "measurement",
    title: "Fuel Economy Converter",
    h1: "Free Online Fuel Economy Converter",
    tagline: "Convert MPG (US & UK), L/100km, and km/L for automotive mileage comparison.",
    keywords: "fuel economy converter, mpg to l/100km, km/l to mpg, gas mileage conversion",
    icon: "fa-solid fa-gas-pump",
    engine: "converter-fuel"
  },
  {
    id: "number-base-converter",
    slug: "number-base-converter",
    category: "measurement",
    title: "Number Base Converter",
    h1: "Free Online Number Base Converter",
    tagline: "Convert numbers across Decimal, Binary, Hexadecimal, and Octal radix representations.",
    keywords: "number base converter, binary to decimal, hex to binary, octal converter, radix math",
    icon: "fa-solid fa-hashtag",
    engine: "converter-base"
  },
  {
    id: "roman-numeral-converter",
    slug: "roman-numeral-converter",
    category: "measurement",
    title: "Roman Numeral Converter",
    h1: "Free Online Roman Numeral Converter",
    tagline: "Two-way translation between standard numbers and classic Roman numerals (I, V, X, L, C, D, M).",
    keywords: "roman numeral converter, roman numbers to decimal, numbers to roman, roman numerals chart",
    icon: "fa-solid fa-landmark",
    engine: "converter-roman"
  },
  {
    id: "fraction-calculator",
    slug: "fraction-calculator",
    category: "measurement",
    title: "Fraction Calculator",
    h1: "Free Online Fraction Calculator",
    tagline: "Add, subtract, multiply, divide, and simplify proper, improper, and mixed fractions.",
    keywords: "fraction calculator, simplify fractions, add fractions, mixed numbers calculator",
    icon: "fa-solid fa-divide",
    engine: "calculator-fraction"
  },
  {
    id: "ratio-calculator",
    slug: "ratio-calculator",
    category: "measurement",
    title: "Ratio & Proportion Calculator",
    h1: "Free Online Ratio & Proportion Calculator",
    tagline: "Solve for missing ratio variables (A:B = C:D), simplify ratios, and scale proportions.",
    keywords: "ratio calculator, proportion calculator, solve ratios, scale ratio, simplify ratio",
    icon: "fa-solid fa-arrows-split-up-and-left",
    engine: "calculator-ratio"
  },

  // -------------------------------------------------------------
  // CATEGORY 3: TEXT & WRITING
  // -------------------------------------------------------------
  {
    id: "word-counter",
    slug: "word-counter",
    category: "writing",
    title: "Word Counter",
    h1: "Free Online Word Counter",
    tagline: "Real-time word, sentence, and paragraph counting with reading & speaking time estimation.",
    keywords: "word counter, online word counter, count words, essay word count, sentence counter",
    icon: "fa-solid fa-file-lines",
    engine: "text-word-counter"
  },
  {
    id: "character-counter",
    slug: "character-counter",
    category: "writing",
    title: "Character Counter",
    h1: "Free Online Character Counter",
    tagline: "Count characters with and without spaces for Twitter/X, SMS, and SEO limits.",
    keywords: "character counter, count characters, characters without spaces, tweet length checker",
    icon: "fa-solid fa-font",
    engine: "text-char-counter"
  },
  {
    id: "case-converter",
    slug: "case-converter",
    category: "writing",
    title: "Case Converter",
    h1: "Free Online Text Case Converter",
    tagline: "Transform text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.",
    keywords: "case converter, uppercase to lowercase, title case converter, camelcase generator",
    icon: "fa-solid fa-text-height",
    engine: "text-case-converter"
  },
  {
    id: "remove-extra-spaces",
    slug: "remove-extra-spaces",
    category: "writing",
    title: "Remove Extra Spaces",
    h1: "Free Online Whitespace Cleaner",
    tagline: "Strip leading, trailing, and duplicate consecutive spaces, tabs, and line gaps.",
    keywords: "remove extra spaces, clean whitespace, strip spaces, trim text online",
    icon: "fa-solid fa-minimize",
    engine: "text-remove-spaces"
  },
  {
    id: "remove-duplicate-lines",
    slug: "remove-duplicate-lines",
    category: "writing",
    title: "Remove Duplicate Lines",
    h1: "Free Online Duplicate Line Remover",
    tagline: "Deduplicate lists, emails, keywords, and text lines with optional case sensitivity.",
    keywords: "remove duplicate lines, deduplicate list, unique lines extractor, list cleaner",
    icon: "fa-solid fa-list-check",
    engine: "text-remove-dup-lines"
  },
  {
    id: "sort-lines",
    slug: "sort-lines",
    category: "writing",
    title: "Sort Lines",
    h1: "Free Online Line Sorter",
    tagline: "Sort text lines alphabetically (A-Z, Z-A), by length, numerically, or randomly shuffle.",
    keywords: "sort lines, alphabetical sorter, sort list online, reverse list, shuffle lines",
    icon: "fa-solid fa-arrow-down-a-z",
    engine: "text-sort-lines"
  },
  {
    id: "find-and-replace",
    slug: "find-and-replace",
    category: "writing",
    title: "Find and Replace",
    h1: "Free Online Find and Replace Tool",
    tagline: "Search and batch-replace words or patterns with regex support and occurrence counts.",
    keywords: "find and replace, replace words in text, batch text replacer, regex find replace",
    icon: "fa-solid fa-magnifying-glass-arrow-right",
    engine: "text-find-replace"
  },
  {
    id: "text-reverser",
    slug: "text-reverser",
    category: "writing",
    title: "Text Reverser",
    h1: "Free Online Text Reverser",
    tagline: "Reverse characters, words, or full line orders for puzzles, ciphers, and encoding.",
    keywords: "text reverser, reverse text, reverse words, backwards text generator, mirror text",
    icon: "fa-solid fa-arrows-left-right",
    engine: "text-reverser"
  },
  {
    id: "slug-generator",
    slug: "slug-generator",
    category: "writing",
    title: "URL Slug Generator",
    h1: "Free Online URL Slug Generator",
    tagline: "Convert article titles and headlines into SEO-friendly, URL-safe kebab-case slugs.",
    keywords: "slug generator, url slug generator, seo friendly slug, title to slug converter",
    icon: "fa-solid fa-link",
    engine: "text-slug-generator"
  },
  {
    id: "lorem-ipsum-generator",
    slug: "lorem-ipsum-generator",
    category: "writing",
    title: "Lorem Ipsum Generator",
    h1: "Free Online Lorem Ipsum Generator",
    tagline: "Generate customized placeholder dummy text by paragraphs, sentences, or words.",
    keywords: "lorem ipsum generator, dummy text generator, placeholder text, latin placeholder",
    icon: "fa-solid fa-paragraph",
    engine: "text-lorem-ipsum"
  },

  // -------------------------------------------------------------
  // CATEGORY 4: TEXT COMPARISON & EXTRACTION
  // -------------------------------------------------------------
  {
    id: "text-diff-checker",
    slug: "text-diff-checker",
    category: "text-analysis",
    title: "Text Diff Checker",
    h1: "Free Online Text Diff & Comparison Tool",
    tagline: "Compare two text snippets side-by-side or inline to highlight additions and deletions.",
    keywords: "text diff checker, compare text online, diff tool, text comparison, find differences",
    icon: "fa-solid fa-code-compare",
    engine: "analysis-diff"
  },
  {
    id: "markdown-editor",
    slug: "markdown-editor",
    category: "text-analysis",
    title: "Markdown Editor",
    h1: "Free Online Markdown Editor & Live Previewer",
    tagline: "Split-screen Markdown editor with live HTML rendering, cheatsheet, and instant export.",
    keywords: "markdown editor, markdown preview online, write markdown, live markdown editor",
    icon: "fa-brands fa-markdown",
    engine: "analysis-markdown-editor"
  },
  {
    id: "markdown-to-html",
    slug: "markdown-to-html",
    category: "text-analysis",
    title: "Markdown to HTML Converter",
    h1: "Free Online Markdown to HTML Converter",
    tagline: "Compile CommonMark/GFM Markdown into clean, ready-to-paste semantic HTML code.",
    keywords: "markdown to html, convert markdown, md to html code, clean html generator",
    icon: "fa-solid fa-file-code",
    engine: "analysis-md-to-html"
  },
  {
    id: "html-to-markdown",
    slug: "html-to-markdown",
    category: "text-analysis",
    title: "HTML to Markdown Converter",
    h1: "Free Online HTML to Markdown Converter",
    tagline: "Convert web page snippets, tables, headings, and links into clean Markdown syntax.",
    keywords: "html to markdown, convert html to md, clean markdown generator, html parser",
    icon: "fa-solid fa-code",
    engine: "analysis-html-to-md"
  },
  {
    id: "text-to-binary",
    slug: "text-to-binary",
    category: "text-analysis",
    title: "Text to Binary Converter",
    h1: "Free Online Text to Binary Converter",
    tagline: "Convert plain ASCII/Unicode text into 8-bit binary code strings with spaces or delimiters.",
    keywords: "text to binary, letters to binary, text to 01, binary translator, ascii to binary",
    icon: "fa-solid fa-0",
    engine: "analysis-text-to-binary"
  },
  {
    id: "binary-to-text",
    slug: "binary-to-text",
    category: "text-analysis",
    title: "Binary to Text Converter",
    h1: "Free Online Binary to Text Converter",
    tagline: "Decode 0s and 1s binary strings back into human-readable English text.",
    keywords: "binary to text, decode binary, 01 to text, binary code reader, binary translator",
    icon: "fa-solid fa-1",
    engine: "analysis-binary-to-text"
  },
  {
    id: "morse-code-translator",
    slug: "morse-code-translator",
    category: "text-analysis",
    title: "Morse Code Translator",
    h1: "Free Online Morse Code Translator & Audio Player",
    tagline: "Two-way translation between English and International Morse Code with audio playback.",
    keywords: "morse code translator, text to morse code, morse code audio player, sos translator",
    icon: "fa-solid fa-ellipsis",
    engine: "analysis-morse-code"
  },
  {
    id: "nato-phonetic-converter",
    slug: "nato-phonetic-converter",
    category: "text-analysis",
    title: "NATO Phonetic Alphabet Converter",
    h1: "Free Online NATO Phonetic Alphabet Converter",
    tagline: "Spell words using international aviation radio alphabet (Alfa, Bravo, Charlie, Delta).",
    keywords: "nato phonetic converter, aviation alphabet, spell words radio, phonetic alphabet chart",
    icon: "fa-solid fa-plane-departure",
    engine: "analysis-nato-phonetic"
  },
  {
    id: "reading-time-calculator",
    slug: "reading-time-calculator",
    category: "text-analysis",
    title: "Reading Time Calculator",
    h1: "Free Online Reading Time Calculator",
    tagline: "Calculate exact silent reading and spoken presentation times for essays and speeches.",
    keywords: "reading time calculator, speech duration calculator, words per minute estimate, article read time",
    icon: "fa-solid fa-stopwatch",
    engine: "analysis-reading-time"
  },
  {
    id: "text-cleaner",
    slug: "text-cleaner",
    category: "text-analysis",
    title: "Text Cleaner & Sanitizer",
    h1: "Free Online Text Cleaner",
    tagline: "Strip HTML tags, smart quotes, zero-width characters, emojis, and non-ASCII artifacts.",
    keywords: "text cleaner, strip html tags, remove non ascii, remove zero width spaces, sanitize text",
    icon: "fa-solid fa-broom",
    engine: "analysis-text-cleaner"
  },

  // -------------------------------------------------------------
  // CATEGORY 5: IMAGE TOOLS (100% Client-Side Canvas & Web APIs)
  // -------------------------------------------------------------
  {
    id: "image-compressor",
    slug: "image-compressor",
    category: "image",
    title: "Image Compressor",
    h1: "Free Online Image Compressor (Client-Side)",
    tagline: "Compress JPG, PNG, and WebP files locally in your browser with zero quality loss and no uploads.",
    keywords: "image compressor, compress image online, reduce image size, local image compression, privacy image tool",
    icon: "fa-solid fa-file-zipper",
    engine: "image-compressor"
  },
  {
    id: "image-resizer",
    slug: "image-resizer",
    category: "image",
    title: "Image Resizer",
    h1: "Free Online Image Resizer",
    tagline: "Resize image dimensions by pixels or percentages with aspect ratio lock.",
    keywords: "image resizer, resize photo online, change image dimensions, pixel resizer",
    icon: "fa-solid fa-expand",
    engine: "image-resizer"
  },
  {
    id: "image-cropper",
    slug: "image-cropper",
    category: "image",
    title: "Image Cropper",
    h1: "Free Online Image Cropper",
    tagline: "Crop photos to exact aspect ratios (1:1, 16:9, 4:3) with canvas export.",
    keywords: "image cropper, crop photo online, square crop, avatar cropper tool",
    icon: "fa-solid fa-crop-simple",
    engine: "image-cropper"
  },
  {
    id: "jpg-to-png",
    slug: "jpg-to-png",
    category: "image",
    title: "JPG to PNG Converter",
    h1: "Free Online JPG to PNG Converter",
    tagline: "Convert JPEG photos into lossless PNG format directly in memory without cloud uploads.",
    keywords: "jpg to png, convert jpeg to png, image format converter, free png converter",
    icon: "fa-solid fa-file-image",
    engine: "image-jpg-to-png"
  },
  {
    id: "png-to-jpg",
    slug: "png-to-jpg",
    category: "image",
    title: "PNG to JPG Converter",
    h1: "Free Online PNG to JPG Converter",
    tagline: "Convert PNG images into high-compression JPG files with custom background color.",
    keywords: "png to jpg, convert png to jpeg, transparent png to jpg, photo converter",
    icon: "fa-solid fa-image",
    engine: "image-png-to-jpg"
  },
  {
    id: "webp-converter",
    slug: "webp-converter",
    category: "image",
    title: "WebP Converter",
    h1: "Free Online WebP Converter",
    tagline: "Convert images to and from modern WebP format for high-speed website loading.",
    keywords: "webp converter, jpg to webp, png to webp, convert webp to png, modern image format",
    icon: "fa-solid fa-photo-film",
    engine: "image-webp-converter"
  },
  {
    id: "image-to-base64",
    slug: "image-to-base64",
    category: "image",
    title: "Image to Base64 Converter",
    h1: "Free Online Image to Base64 Converter",
    tagline: "Convert any graphic into an inline Data URI / Base64 string for CSS and HTML embeds.",
    keywords: "image to base64, data uri generator, embed image css, base64 image encoder",
    icon: "fa-solid fa-binary",
    engine: "image-to-base64"
  },
  {
    id: "base64-to-image",
    slug: "base64-to-image",
    category: "image",
    title: "Base64 to Image Decoder",
    h1: "Free Online Base64 to Image Decoder",
    tagline: "Paste Base64 data strings to preview, render, and download the decoded picture.",
    keywords: "base64 to image, decode base64 image, data uri viewer, base64 image downloader",
    icon: "fa-solid fa-file-arrow-down",
    engine: "image-base64-to-image"
  },
  {
    id: "favicon-generator",
    slug: "favicon-generator",
    category: "image",
    title: "Favicon Generator",
    h1: "Free Online Favicon Generator",
    tagline: "Generate standard 16x16, 32x32, 48x48, and 180x180 icons with HTML meta tags.",
    keywords: "favicon generator, create favicon online, icon generator, website favicon creator",
    icon: "fa-solid fa-icons",
    engine: "image-favicon-gen"
  },
  {
    id: "color-palette-extractor",
    slug: "color-palette-extractor",
    category: "image",
    title: "Color Palette Extractor",
    h1: "Free Online Color Palette Extractor from Image",
    tagline: "Extract dominant HEX color palettes and accents from any uploaded image file.",
    keywords: "color palette extractor, extract colors from image, photo color picker, dominant colors",
    icon: "fa-solid fa-eye-dropper",
    engine: "image-palette-extractor"
  },

  // -------------------------------------------------------------
  // CATEGORY 6: PDF & DOCUMENTS (Client-Side PDF Engines)
  // -------------------------------------------------------------
  {
    id: "merge-pdf",
    slug: "merge-pdf",
    category: "pdf",
    title: "Merge PDF",
    h1: "Free Online PDF Merger (Private & Local)",
    tagline: "Combine multiple PDF documents into a single file directly in your browser.",
    keywords: "merge pdf, combine pdf files online, join pdf, free pdf merger, client side pdf merge",
    icon: "fa-solid fa-object-group",
    engine: "pdf-merge"
  },
  {
    id: "split-pdf",
    slug: "split-pdf",
    category: "pdf",
    title: "Split PDF",
    h1: "Free Online PDF Splitter",
    tagline: "Extract individual pages or custom page ranges from any PDF document.",
    keywords: "split pdf, extract pdf pages, separate pdf pages, cut pdf online",
    icon: "fa-solid fa-scissors",
    engine: "pdf-split"
  },
  {
    id: "rotate-pdf",
    slug: "rotate-pdf",
    category: "pdf",
    title: "Rotate PDF",
    h1: "Free Online PDF Rotator",
    tagline: "Rotate PDF pages 90, 180, or 270 degrees and download the updated document.",
    keywords: "rotate pdf, turn pdf pages, fix upside down pdf, rotate pdf online",
    icon: "fa-solid fa-rotate",
    engine: "pdf-rotate"
  },
  {
    id: "reorder-pdf-pages",
    slug: "reorder-pdf-pages",
    category: "pdf",
    title: "Reorder PDF Pages",
    h1: "Free Online PDF Page Organizer",
    tagline: "Drag and drop PDF page thumbnails to reorder, delete, and rearrange pages.",
    keywords: "reorder pdf pages, organize pdf, rearrange pdf pages, change pdf page order",
    icon: "fa-solid fa-arrow-down-up-across-line",
    engine: "pdf-reorder"
  },
  {
    id: "images-to-pdf",
    slug: "images-to-pdf",
    category: "pdf",
    title: "Images to PDF Converter",
    h1: "Free Online Images to PDF Converter",
    tagline: "Convert JPG, PNG, and WebP images into a single clean printable PDF document.",
    keywords: "images to pdf, jpg to pdf, convert photos to pdf, make pdf from images",
    icon: "fa-solid fa-file-export",
    engine: "pdf-images-to-pdf"
  },
  {
    id: "pdf-to-images",
    slug: "pdf-to-images",
    category: "pdf",
    title: "PDF to Images Converter",
    h1: "Free Online PDF to Images Converter",
    tagline: "Render each page of a PDF document as high-resolution PNG image files.",
    keywords: "pdf to images, pdf to png, export pdf pages as images, pdf page extractor",
    icon: "fa-solid fa-file-arrow-up",
    engine: "pdf-to-images"
  },
  {
    id: "pdf-metadata-viewer",
    slug: "pdf-metadata-viewer",
    category: "pdf",
    title: "PDF Metadata Viewer",
    h1: "Free Online PDF Metadata Viewer",
    tagline: "Inspect author, title, creation date, producer, version, and page counts of PDFs.",
    keywords: "pdf metadata viewer, check pdf properties, pdf author info, view pdf details",
    icon: "fa-solid fa-circle-info",
    engine: "pdf-metadata"
  },
  {
    id: "extract-pdf-text",
    slug: "extract-pdf-text",
    category: "pdf",
    title: "Extract PDF Text",
    h1: "Free Online PDF Text Extractor",
    tagline: "Extract clean readable text from PDF documents for copying, analysis, or editing.",
    keywords: "extract pdf text, copy text from pdf, pdf to text converter, extract text online",
    icon: "fa-solid fa-align-left",
    engine: "pdf-extract-text"
  },
  {
    id: "word-counter-documents",
    slug: "word-counter-for-documents",
    category: "pdf",
    title: "Word Counter for Documents",
    h1: "Free Online Document Word Counter",
    tagline: "Count words, characters, and pages in text, markdown, and document files.",
    keywords: "document word counter, count words in document, pdf word count, file text counter",
    icon: "fa-solid fa-file-waveform",
    engine: "pdf-doc-word-count"
  },
  {
    id: "document-page-counter",
    slug: "document-page-counter",
    category: "pdf",
    title: "Document Page Counter",
    h1: "Free Online Document Page Counter",
    tagline: "Check total page count and layout dimensions across multiple documents instantly.",
    keywords: "page counter, count pdf pages, document page tally, inspect page numbers",
    icon: "fa-solid fa-book-bookmark",
    engine: "pdf-page-counter"
  },

  // -------------------------------------------------------------
  // CATEGORY 7: DEVELOPER TOOLS
  // -------------------------------------------------------------
  {
    id: "json-formatter",
    slug: "json-formatter",
    category: "developer",
    title: "JSON Formatter & Beautifier",
    h1: "Free Online JSON Formatter & Beautifier",
    tagline: "Format, indent, minify, and colorize messy JSON strings with instant syntax validation.",
    keywords: "json formatter, beautify json, format json online, json validator, indent json",
    icon: "fa-solid fa-brackets-curly",
    engine: "dev-json-formatter"
  },
  {
    id: "json-validator",
    slug: "json-validator",
    category: "developer",
    title: "JSON Validator",
    h1: "Free Online JSON Validator & Syntax Checker",
    tagline: "Locate exact syntax errors, missing commas, and mismatched brackets in JSON payloads.",
    keywords: "json validator, check json syntax, find json errors, lint json online",
    icon: "fa-solid fa-circle-check",
    engine: "dev-json-validator"
  },
  {
    id: "json-to-csv",
    slug: "json-to-csv",
    category: "developer",
    title: "JSON to CSV Converter",
    h1: "Free Online JSON to CSV Converter",
    tagline: "Convert JSON arrays and nested object data into clean, downloadable CSV tables.",
    keywords: "json to csv, convert json to excel, json table converter, export json to csv",
    icon: "fa-solid fa-file-csv",
    engine: "dev-json-to-csv"
  },
  {
    id: "csv-to-json",
    slug: "csv-to-json",
    category: "developer",
    title: "CSV to JSON Converter",
    h1: "Free Online CSV to JSON Converter",
    tagline: "Transform spreadsheet CSV files or text rows into structured JSON arrays.",
    keywords: "csv to json, convert spreadsheet to json, csv parser, csv data to json",
    icon: "fa-solid fa-table-cells-large",
    engine: "dev-csv-to-json"
  },
  {
    id: "xml-formatter",
    slug: "xml-formatter",
    category: "developer",
    title: "XML Formatter",
    h1: "Free Online XML Formatter & Beautifier",
    tagline: "Format, beautify, and indent raw XML documents with clean indentation tags.",
    keywords: "xml formatter, beautify xml, clean xml code, xml syntax highlighter",
    icon: "fa-solid fa-code-branch",
    engine: "dev-xml-formatter"
  },
  {
    id: "html-formatter",
    slug: "html-formatter",
    category: "developer",
    title: "HTML Formatter",
    h1: "Free Online HTML Formatter & Minifier",
    tagline: "Beautify or minify HTML markup with customizable indent levels and tag preservation.",
    keywords: "html formatter, beautify html, minify html code, clean html syntax",
    icon: "fa-brands fa-html5",
    engine: "dev-html-formatter"
  },
  {
    id: "css-formatter",
    slug: "css-formatter",
    category: "developer",
    title: "CSS Formatter",
    h1: "Free Online CSS Formatter & Minifier",
    tagline: "Organize, format, and minify CSS style rules for maximum readability or minimal byte weight.",
    keywords: "css formatter, beautify css, minify css, clean stylesheet code",
    icon: "fa-brands fa-css3-alt",
    engine: "dev-css-formatter"
  },
  {
    id: "js-formatter",
    slug: "javascript-formatter",
    category: "developer",
    title: "JavaScript Formatter",
    h1: "Free Online JavaScript Formatter",
    tagline: "Format, beautify, and inspect JavaScript and TypeScript snippets in your browser.",
    keywords: "javascript formatter, beautify js, format js code, clean javascript syntax",
    icon: "fa-brands fa-js",
    engine: "dev-js-formatter"
  },
  {
    id: "regex-tester",
    slug: "regex-tester",
    category: "developer",
    title: "Regex Tester & Matcher",
    h1: "Free Online Regular Expression Tester",
    tagline: "Test regex patterns in real time with group highlights, flags, and match breakdowns.",
    keywords: "regex tester, regular expression matcher, test regex online, regex validator",
    icon: "fa-solid fa-asterisk",
    engine: "dev-regex-tester"
  },
  {
    id: "uuid-generator",
    slug: "uuid-generator",
    category: "developer",
    title: "UUID / GUID Generator",
    h1: "Free Online UUID / GUID Generator",
    tagline: "Generate RFC-compliant Version 4 UUIDs in bulk with uppercase, hyphens, and brackets options.",
    keywords: "uuid generator, guid generator, v4 uuid, bulk uuid generator, random guid",
    icon: "fa-solid fa-fingerprint",
    engine: "dev-uuid-gen"
  },

  // -------------------------------------------------------------
  // CATEGORY 8: ENCODING & WEB UTILITIES
  // -------------------------------------------------------------
  {
    id: "url-encoder-decoder",
    slug: "url-encoder-decoder",
    category: "encoding",
    title: "URL Encoder / Decoder",
    h1: "Free Online URL Encoder & Decoder",
    tagline: "Encode query parameters into percentage-encoded characters or decode raw URLs.",
    keywords: "url encoder, url decoder, percent encoding, encode url string, decode uri component",
    icon: "fa-solid fa-link-slash",
    engine: "encode-url"
  },
  {
    id: "html-entity-encoder",
    slug: "html-entity-encoder-decoder",
    category: "encoding",
    title: "HTML Entity Encoder / Decoder",
    h1: "Free Online HTML Entity Encoder & Decoder",
    tagline: "Convert special characters (<, >, &, \") into safe HTML entities (&lt;, &gt;, &amp;) and back.",
    keywords: "html entity encoder, html decoder, escape html characters, convert entities",
    icon: "fa-solid fa-code-commit",
    engine: "encode-html-entities"
  },
  {
    id: "base64-encoder-decoder",
    slug: "base64-encoder-decoder",
    category: "encoding",
    title: "Base64 Encoder / Decoder",
    h1: "Free Online Base64 Encoder & Decoder",
    tagline: "Encode UTF-8 text into standard Base64 representation or decode Base64 back to text.",
    keywords: "base64 encoder, base64 decoder, text to base64, decode base64 online",
    icon: "fa-solid fa-barcode",
    engine: "encode-base64"
  },
  {
    id: "jwt-decoder",
    slug: "jwt-decoder",
    category: "encoding",
    title: "JWT Decoder",
    h1: "Free Online JWT Decoder (Client-Side)",
    tagline: "Inspect header, payload claims, timestamps, and signature structure with zero network requests.",
    keywords: "jwt decoder, json web token inspector, decode jwt online, parse jwt payload",
    icon: "fa-solid fa-key",
    engine: "encode-jwt-decoder"
  },
  {
    id: "unix-timestamp-converter",
    slug: "unix-timestamp-converter",
    category: "encoding",
    title: "Unix Timestamp Converter",
    h1: "Free Online Unix Timestamp Converter",
    tagline: "Convert epoch seconds and milliseconds to human-readable UTC and local date formats.",
    keywords: "unix timestamp converter, epoch to date, timestamp to datetime, current epoch time",
    icon: "fa-solid fa-stopwatch-20",
    engine: "encode-unix-timestamp"
  },
  {
    id: "cron-expression-explainer",
    slug: "cron-expression-explainer",
    category: "encoding",
    title: "Cron Expression Explainer",
    h1: "Free Online Cron Expression Explainer & Builder",
    tagline: "Translate cron strings into plain English schedules and calculate next execution dates.",
    keywords: "cron expression explainer, cron schedule builder, crontab translator, next cron run",
    icon: "fa-solid fa-business-time",
    engine: "encode-cron"
  },
  {
    id: "query-string-parser",
    slug: "query-string-parser",
    category: "encoding",
    title: "Query String Parser",
    h1: "Free Online Query String Parser",
    tagline: "Parse URL search params into a clean key-value table and JSON object.",
    keywords: "query string parser, url parameters parser, parse search params, url query to json",
    icon: "fa-solid fa-filter",
    engine: "encode-query-string"
  },
  {
    id: "http-status-reference",
    slug: "http-status-code-reference",
    category: "encoding",
    title: "HTTP Status Code Reference",
    h1: "Interactive HTTP Status Code Reference",
    tagline: "Fast searchable directory for 1xx, 2xx, 3xx, 4xx, and 5xx HTTP response codes.",
    keywords: "http status codes, 404 meaning, 500 error code, http status reference, rest api status",
    icon: "fa-solid fa-network-wired",
    engine: "encode-http-status"
  },
  {
    id: "mime-type-lookup",
    slug: "mime-type-lookup",
    category: "encoding",
    title: "MIME Type Lookup",
    h1: "Free Online MIME Type Lookup",
    tagline: "Find the official Content-Type header and media type for any file extension.",
    keywords: "mime type lookup, content type list, file extension mime type, media type lookup",
    icon: "fa-solid fa-file-lines",
    engine: "encode-mime-type"
  },
  {
    id: "meta-tag-preview",
    slug: "meta-tag-preview-generator",
    category: "encoding",
    title: "Meta Tag Preview Generator",
    h1: "Free Online Meta Tag Preview Generator",
    tagline: "Generate HTML head meta tags with live Google, Facebook, and Twitter link preview cards.",
    keywords: "meta tag generator, open graph generator, twitter card preview, seo meta tags builder",
    icon: "fa-solid fa-share-nodes",
    engine: "encode-meta-preview"
  },

  // -------------------------------------------------------------
  // CATEGORY 9: SECURITY & PASSWORD UTILITIES
  // -------------------------------------------------------------
  {
    id: "password-generator",
    slug: "password-generator",
    category: "security",
    title: "Password Generator",
    h1: "Free Online Password Generator (Web Crypto)",
    tagline: "Generate strong, entropy-tested passwords using cryptographic browser randomness.",
    keywords: "password generator, strong password generator, random password, secure password maker",
    icon: "fa-solid fa-key",
    engine: "sec-password-gen"
  },
  {
    id: "password-strength-checker",
    slug: "password-strength-checker",
    category: "security",
    title: "Password Strength Checker",
    h1: "Free Online Password Strength & Entropy Checker",
    tagline: "Test password crack time, bits of entropy, and common vulnerability patterns locally.",
    keywords: "password strength checker, password crack time, password entropy test, how secure is my password",
    icon: "fa-solid fa-shield-halved",
    engine: "sec-password-strength"
  },
  {
    id: "passphrase-generator",
    slug: "passphrase-generator",
    category: "security",
    title: "Passphrase Generator",
    h1: "Free Online Diceware Passphrase Generator",
    tagline: "Generate memorable, high-security multi-word passphrases (e.g. correct-horse-battery-staple).",
    keywords: "passphrase generator, diceware generator, multi word password, secure passphrase",
    icon: "fa-solid fa-lock",
    engine: "sec-passphrase-gen"
  },
  {
    id: "random-number-generator",
    slug: "random-number-generator",
    category: "security",
    title: "Random Number Generator",
    h1: "Free Online True Random Number Generator",
    tagline: "Generate cryptographically secure random integers, floats, and dice rolls in custom ranges.",
    keywords: "random number generator, rng online, random integer generator, crypto random number",
    icon: "fa-solid fa-dice",
    engine: "sec-random-number"
  },
  {
    id: "random-string-generator",
    slug: "random-string-generator",
    category: "security",
    title: "Random String Generator",
    h1: "Free Online Random String Generator",
    tagline: "Generate API keys, salt strings, alphanumeric tokens, and hex codes.",
    keywords: "random string generator, api key generator, random token maker, generate random text",
    icon: "fa-solid fa-shapes",
    engine: "sec-random-string"
  },
  {
    id: "sha-hash-calculator",
    slug: "sha-hash-calculator",
    category: "security",
    title: "SHA Hash Calculator",
    h1: "Free Online SHA Hash Calculator (SHA-1, SHA-256, SHA-512)",
    tagline: "Compute cryptographic hashes for text snippets using native Web Crypto APIs.",
    keywords: "sha hash calculator, sha256 generator, sha512 calculator, sha1 hash online",
    icon: "fa-solid fa-hashtag",
    engine: "sec-sha-hash"
  },
  {
    id: "hmac-calculator",
    slug: "hmac-calculator",
    category: "security",
    title: "HMAC Calculator",
    h1: "Free Online HMAC Calculator",
    tagline: "Compute Keyed-Hash Message Authentication Codes (HMAC-SHA256, HMAC-SHA512).",
    keywords: "hmac calculator, hmac sha256, keyed hash calculator, message authentication code",
    icon: "fa-solid fa-fingerprint",
    engine: "sec-hmac-calc"
  },
  {
    id: "file-hash-checker",
    slug: "file-hash-checker",
    category: "security",
    title: "File Hash & Checksum Checker",
    h1: "Free Online File Hash & Checksum Checker",
    tagline: "Verify downloaded file integrity by computing SHA-256 and MD5-style checksums locally.",
    keywords: "file hash checker, file checksum tool, verify file integrity, sha256 checksum online",
    icon: "fa-solid fa-file-shield",
    engine: "sec-file-hash"
  },
  {
    id: "secret-redaction-tool",
    slug: "secret-free-redaction-tool",
    category: "security",
    title: "Secret-Free Redaction Tool",
    h1: "Free Online Text Redaction & Sanitizer",
    tagline: "Automatically mask API tokens, email addresses, credit cards, and phone numbers before sharing.",
    keywords: "redaction tool, mask api keys, sanitize logs, hide sensitive data, redact text",
    icon: "fa-solid fa-mask",
    engine: "sec-redaction-tool"
  },
  {
    id: "entropy-estimator",
    slug: "entropy-estimator",
    category: "security",
    title: "Entropy Estimator",
    h1: "Free Online Information Entropy Estimator",
    tagline: "Calculate Shannon entropy in bits for text, strings, and cryptographic randomness.",
    keywords: "entropy estimator, shannon entropy calculator, string entropy, randomness test",
    icon: "fa-solid fa-chart-line",
    engine: "sec-entropy-calc"
  },

  // -------------------------------------------------------------
  // CATEGORY 10: COLOR & DESIGN
  // -------------------------------------------------------------
  {
    id: "color-picker",
    slug: "color-picker",
    category: "design",
    title: "Color Picker & Inspector",
    h1: "Free Online Color Picker & Eyedropper",
    tagline: "Interactive color palette canvas with browser eyedropper and instant HEX/RGB/HSL conversion.",
    keywords: "color picker, online color picker, eyedropper tool, hex color picker, rgb picker",
    icon: "fa-solid fa-palette",
    engine: "design-color-picker"
  },
  {
    id: "hex-to-rgb",
    slug: "hex-to-rgb",
    category: "design",
    title: "HEX to RGB Converter",
    h1: "Free Online HEX to RGB Converter",
    tagline: "Convert hex color codes into rgb() and rgba() with alpha transparency support.",
    keywords: "hex to rgb, convert hex to rgb, hex color converter, hex to rgba online",
    icon: "fa-solid fa-sliders",
    engine: "design-hex-to-rgb"
  },
  {
    id: "rgb-to-hex",
    slug: "rgb-to-hex",
    category: "design",
    title: "RGB to HEX Converter",
    h1: "Free Online RGB to HEX Converter",
    tagline: "Convert Red, Green, Blue channel numbers into 6-digit or 8-digit HEX color codes.",
    keywords: "rgb to hex, convert rgb to hex, rgb color code, rgb to hex calculator",
    icon: "fa-solid fa-droplet",
    engine: "design-rgb-to-hex"
  },
  {
    id: "hsl-converter",
    slug: "hsl-converter",
    category: "design",
    title: "HSL Color Converter",
    h1: "Free Online HSL to HEX & RGB Converter",
    tagline: "Convert Hue, Saturation, and Lightness values into HEX, RGB, and CSS variables.",
    keywords: "hsl converter, hsl to hex, hsl to rgb, color hue calculator",
    icon: "fa-solid fa-circle-half-stroke",
    engine: "design-hsl-converter"
  },
  {
    id: "contrast-checker",
    slug: "contrast-checker",
    category: "design",
    title: "WCAG Color Contrast Checker",
    h1: "Free Online WCAG Color Contrast Checker",
    tagline: "Test text and background contrast ratios against WCAG 2.1 AA and AAA standards.",
    keywords: "contrast checker, wcag contrast ratio, accessible colors checker, color accessibility",
    icon: "fa-solid fa-universal-access",
    engine: "design-contrast-checker"
  },
  {
    id: "gradient-generator",
    slug: "gradient-generator",
    category: "design",
    title: "CSS Gradient Generator",
    h1: "Free Online CSS Gradient Generator",
    tagline: "Design linear and radial gradients with color stops and copy ready-to-use CSS.",
    keywords: "gradient generator, css gradient maker, linear gradient generator, css background gradient",
    icon: "fa-solid fa-wand-magic-sparkles",
    engine: "design-gradient-gen"
  },
  {
    id: "box-shadow-generator",
    slug: "box-shadow-generator",
    category: "design",
    title: "Box Shadow Generator",
    h1: "Free Online CSS Box Shadow Generator",
    tagline: "Design modern layered box shadows with blur, spread, offset, and inset preview.",
    keywords: "box shadow generator, css shadow maker, smooth box shadow, drop shadow css",
    icon: "fa-solid fa-square",
    engine: "design-box-shadow"
  },
  {
    id: "border-radius-generator",
    slug: "border-radius-generator",
    category: "design",
    title: "Border Radius Generator",
    h1: "Free Online CSS Border Radius Generator",
    tagline: "Interactive 8-point border-radius builder for organic shapes and smooth rounded corners.",
    keywords: "border radius generator, 8 point border radius, fancy border radius, rounded corners css",
    icon: "fa-solid fa-shapes",
    engine: "design-border-radius"
  },
  {
    id: "css-clamp-generator",
    slug: "css-clamp-generator",
    category: "design",
    title: "CSS Clamp Generator",
    h1: "Free Online CSS Clamp() Fluid Typography Generator",
    tagline: "Generate responsive typography and spacing clamp(min, val, max) formulas for modern CSS.",
    keywords: "css clamp generator, fluid typography calculator, clamp calculator css, responsive font size",
    icon: "fa-solid fa-text-width",
    engine: "design-css-clamp"
  },
  {
    id: "css-animation-previewer",
    slug: "css-animation-previewer",
    category: "design",
    title: "CSS Animation Previewer",
    h1: "Free Online CSS Animation Previewer",
    tagline: "Preview keyframe animations, easing curves, bounce effects, and copy pure CSS.",
    keywords: "css animation previewer, keyframe animation maker, cubic bezier preview, easing curves",
    icon: "fa-solid fa-play",
    engine: "design-animation-preview"
  },

  // -------------------------------------------------------------
  // CATEGORIES 11 - 20 (Full Registry Continuation)
  // -------------------------------------------------------------
  { id: "world-clock", slug: "world-clock", category: "time", title: "World Clock", h1: "Free Online World Clock", tagline: "Live time across major world financial capitals and custom time zones.", keywords: "world clock, global time zones, current time in new york, london time", icon: "fa-solid fa-globe", engine: "time-world-clock" },
  { id: "time-zone-converter", slug: "time-zone-converter", category: "time", title: "Time Zone Converter", h1: "Free Online Time Zone Converter", tagline: "Convert meeting times across PST, EST, UTC, GMT, IST, and JST.", keywords: "time zone converter, pst to est, utc to ist, meeting time converter", icon: "fa-solid fa-earth-americas", engine: "time-zone-converter" },
  { id: "meeting-time-planner", slug: "meeting-time-planner", category: "time", title: "Meeting Time Planner", h1: "Free Online Remote Meeting Time Planner", tagline: "Find overlapping working hours across multiple global team locations.", keywords: "meeting time planner, remote team hours, global meeting scheduler", icon: "fa-solid fa-people-arrows", engine: "time-meeting-planner" },
  { id: "countdown-timer", slug: "countdown-timer", category: "time", title: "Countdown Timer", h1: "Free Online Countdown Timer", tagline: "Set custom alarms and countdown timers for presentations, events, and tasks.", keywords: "countdown timer, online timer, set timer online, event countdown", icon: "fa-solid fa-hourglass-start", engine: "time-countdown" },
  { id: "stopwatch", slug: "stopwatch", category: "time", title: "Online Stopwatch", h1: "Free Online Stopwatch with Milliseconds", tagline: "Accurate stopwatch with lap timing, split counters, and fullscreen display.", keywords: "online stopwatch, lap timer, chronometer online, sports stopwatch", icon: "fa-solid fa-stopwatch", engine: "time-stopwatch" },
  { id: "pomodoro-timer", slug: "pomodoro-timer", category: "time", title: "Pomodoro Timer", h1: "Free Online Pomodoro Focus Timer", tagline: "Boost productivity with 25-minute focus intervals and 5-minute break cycles.", keywords: "pomodoro timer, focus timer, productivity timer, 25 minute timer", icon: "fa-solid fa-brain", engine: "time-pomodoro" },
  { id: "calendar-generator", slug: "calendar-generator", category: "time", title: "Calendar Generator", h1: "Free Online Printable Calendar Generator", tagline: "Generate monthly and yearly printable calendars with custom week starts.", keywords: "calendar generator, printable monthly calendar, custom year calendar", icon: "fa-solid fa-calendar", engine: "time-calendar-gen" },
  { id: "week-number-calculator", slug: "week-number-calculator", category: "time", title: "Week Number Calculator", h1: "Free Online ISO Week Number Calculator", tagline: "Find the current week number and ISO-8601 calendar weeks for any date.", keywords: "week number calculator, what week is it, iso week number, current week", icon: "fa-solid fa-calendar-week", engine: "time-week-number" },
  { id: "business-days-calculator", slug: "business-days-calculator", category: "time", title: "Business Days Calculator", h1: "Free Online Business Days Calculator", tagline: "Calculate working days between dates excluding weekends and holidays.", keywords: "business days calculator, working days between dates, exclude weekends", icon: "fa-solid fa-briefcase", engine: "time-business-days" },
  { id: "birthday-countdown", slug: "birthday-countdown", category: "time", title: "Birthday Countdown", h1: "Free Online Birthday Countdown Timer", tagline: "Count down days, hours, and minutes to your next upcoming birthday celebration.", keywords: "birthday countdown, days until birthday, age countdown timer", icon: "fa-solid fa-gift", engine: "time-birthday-countdown" },

  // CATEGORY 12: EDUCATION & MATHEMATICS
  { id: "algebra-calculator", slug: "algebra-calculator", category: "math", title: "Algebra Calculator", h1: "Free Online Algebra Solver", tagline: "Solve linear equations, simplify expressions, and balance algebraic formulas.", keywords: "algebra calculator, solve linear equations, math solver online", icon: "fa-solid fa-equals", engine: "math-algebra" },
  { id: "quadratic-equation-solver", slug: "quadratic-equation-solver", category: "math", title: "Quadratic Equation Solver", h1: "Free Online Quadratic Equation Solver", tagline: "Calculate real and complex roots (ax² + bx + c = 0) with step-by-step discriminant.", keywords: "quadratic equation solver, quadratic formula calculator, discriminant roots", icon: "fa-solid fa-superscript", engine: "math-quadratic" },
  { id: "prime-number-checker", slug: "prime-number-checker", category: "math", title: "Prime Number Checker", h1: "Free Online Prime Number Checker & Factorizer", tagline: "Check primality and find prime factorization trees for any integer.", keywords: "prime number checker, is it prime, prime factorizer, prime factors calculator", icon: "fa-solid fa-certificate", engine: "math-prime" },
  { id: "gcd-lcm-calculator", slug: "gcd-lcm-calculator", category: "math", title: "GCD & LCM Calculator", h1: "Free Online GCD & LCM Calculator", tagline: "Find Greatest Common Divisor and Least Common Multiple for sets of numbers.", keywords: "gcd calculator, lcm calculator, greatest common divisor, least common multiple", icon: "fa-solid fa-network-wired", engine: "math-gcd-lcm" },
  { id: "statistics-calculator", slug: "statistics-calculator", category: "math", title: "Statistics Calculator", h1: "Free Online Statistics Calculator", tagline: "Compute standard deviation, variance, range, and sums for number sets.", keywords: "statistics calculator, standard deviation calculator, variance calculator, data range", icon: "fa-solid fa-chart-bar", engine: "math-statistics" },
  { id: "mean-median-mode", slug: "mean-median-mode-calculator", category: "math", title: "Mean, Median & Mode Calculator", h1: "Free Online Mean, Median & Mode Calculator", tagline: "Calculate average (mean), middle value (median), and frequency (mode) instantly.", keywords: "mean median mode calculator, calculate average, find median, math mode", icon: "fa-solid fa-chart-column", engine: "math-mean-median-mode" },
  { id: "probability-calculator", slug: "probability-calculator", category: "math", title: "Probability Calculator", h1: "Free Online Probability Calculator", tagline: "Calculate single-event, combined (AND/OR), and conditional probabilities.", keywords: "probability calculator, odds calculator, chance calculator, statistics probability", icon: "fa-solid fa-dice-d20", engine: "math-probability" },
  { id: "scientific-notation-converter", slug: "scientific-notation-converter", category: "math", title: "Scientific Notation Converter", h1: "Free Online Scientific Notation Converter", tagline: "Convert between standard decimals and scientific exponential notation (e.g. 1.5e+8).", keywords: "scientific notation converter, standard to scientific, e notation calculator", icon: "fa-solid fa-subscript", engine: "math-scientific-notation" },
  { id: "matrix-calculator", slug: "matrix-calculator", category: "math", title: "Matrix Calculator", h1: "Free Online Matrix Calculator", tagline: "Add, subtract, multiply, and calculate determinants for 2x2 and 3x3 matrices.", keywords: "matrix calculator, matrix multiplication, determinant calculator, matrix inverse", icon: "fa-solid fa-border-none", engine: "math-matrix" },
  { id: "geometry-calculator", slug: "geometry-calculator", category: "math", title: "Geometry Calculator", h1: "Free Online Geometry Calculator", tagline: "Calculate perimeter, area, surface area, and volume for 2D and 3D shapes.", keywords: "geometry calculator, area of circle, volume of cylinder, triangle perimeter", icon: "fa-solid fa-draw-polygon", engine: "math-geometry" },

  // CATEGORY 13: PERSONAL FINANCE
  { id: "emi-calculator", slug: "emi-calculator", category: "finance", title: "EMI Calculator", h1: "Free Online Loan EMI Calculator", tagline: "Calculate monthly installment, total interest, and amortization for loans.", keywords: "emi calculator, loan emi calculator, home loan emi, monthly payment calculator", icon: "fa-solid fa-hand-holding-dollar", engine: "fin-emi" },
  { id: "simple-interest-calculator", slug: "simple-interest-calculator", category: "finance", title: "Simple Interest Calculator", h1: "Free Online Simple Interest Calculator", tagline: "Calculate simple interest (P × R × T / 100) and total accumulated balance.", keywords: "simple interest calculator, calculate interest, loan interest formula", icon: "fa-solid fa-percent", engine: "fin-simple-interest" },
  { id: "compound-interest-calculator", slug: "compound-interest-calculator", category: "finance", title: "Compound Interest Calculator", h1: "Free Online Compound Interest Calculator", tagline: "Project investment growth with monthly, quarterly, and annual compounding schedules.", keywords: "compound interest calculator, investment growth, compound interest formula", icon: "fa-solid fa-chart-line-up", engine: "fin-compound-interest" },
  { id: "sip-calculator", slug: "sip-calculator", category: "finance", title: "SIP Calculator", h1: "Free Online SIP Investment Calculator", tagline: "Calculate returns on Systematic Investment Plans for mutual funds.", keywords: "sip calculator, mutual fund sip, monthly investment return calculator", icon: "fa-solid fa-piggy-bank", engine: "fin-sip" },
  { id: "loan-payoff-calculator", slug: "loan-payoff-calculator", category: "finance", title: "Loan Payoff Calculator", h1: "Free Online Loan Payoff Calculator", tagline: "See how extra monthly payments reduce your loan tenure and interest charges.", keywords: "loan payoff calculator, pay off debt early, extra payment calculator", icon: "fa-solid fa-credit-card", engine: "fin-loan-payoff" },
  { id: "discount-calculator", slug: "discount-calculator", category: "finance", title: "Discount Calculator", h1: "Free Online Shopping Discount Calculator", tagline: "Find sale prices, dollar savings, and stacked discount percentages in stores.", keywords: "discount calculator, sale price calculator, percent off calculator", icon: "fa-solid fa-tag", engine: "fin-discount" },
  { id: "gst-calculator", slug: "gst-calculator", category: "finance", title: "GST & Sales Tax Calculator", h1: "Free Online GST & Sales Tax Calculator", tagline: "Calculate gross price and net price with inclusive or exclusive tax percentages.", keywords: "gst calculator, sales tax calculator, add tax, tax inclusive calculator", icon: "fa-solid fa-receipt", engine: "fin-gst" },
  { id: "tip-calculator", slug: "tip-calculator", category: "finance", title: "Tip Calculator", h1: "Free Online Restaurant Tip Calculator", tagline: "Calculate tip percentages and split bills evenly among dining party members.", keywords: "tip calculator, bill split calculator, restaurant tip, split check", icon: "fa-solid fa-utensils", engine: "fin-tip" },
  { id: "budget-planner", slug: "budget-planner", category: "finance", title: "Budget Planner Calculator", h1: "Free Online 50/30/20 Budget Planner", tagline: "Organize monthly take-home income into Needs (50%), Wants (30%), and Savings (20%).", keywords: "budget planner, 50 30 20 budget calculator, personal budget tool", icon: "fa-solid fa-wallet", engine: "fin-budget" },
  { id: "savings-goal-calculator", slug: "savings-goal-calculator", category: "finance", title: "Savings Goal Calculator", h1: "Free Online Savings Goal Calculator", tagline: "Determine how much you need to save each month to achieve your target milestone.", keywords: "savings goal calculator, monthly savings target, reach savings goal", icon: "fa-solid fa-vault", engine: "fin-savings-goal" },

  // CATEGORY 14: TYPING & KEYBOARD (Stiknex Flagship Suite)
  { id: "typing-speed-test", slug: "typing-speed-test", category: "typing", title: "Stiknex Typing", h1: "Stiknex Typing Speed Test (WPM & Accuracy)", tagline: "Test your words-per-minute speed and character accuracy with real-time feedback.", keywords: "stiknex typing, typing speed test, wpm test, typing test online, test typing speed", icon: "fa-solid fa-keyboard", engine: "typing-speed-test" },
  { id: "url-shortener", slug: "url-shortener", category: "encoding", title: "URL Shortener", h1: "Free URL Shortener & Live Click Tracking Analytics", tagline: "Shorten links, create QR codes, and track clicks, visitors, countries, and campaign analytics.", keywords: "url shortener, link shortener, shorten links, click tracking, qr code, campaign analytics", icon: "fa-solid fa-link", engine: "url-shortener" },
  { id: "typing-practice-lessons", slug: "typing-practice-lessons", category: "typing", title: "Typing Practice Lessons", h1: "Free Online Touch Typing Practice & Lessons", tagline: "Master touch typing from beginner home row to advanced punctuation drills.", keywords: "typing lessons, touch typing practice, learn to type, home row training", icon: "fa-solid fa-graduation-cap", engine: "typing-lessons" },
  { id: "typing-accuracy-test", slug: "typing-accuracy-test", category: "typing", title: "Typing Accuracy Test", h1: "Free Online Typing Accuracy Challenge", tagline: "A strict typing test that rewards flawless accuracy and low error rates over raw speed.", keywords: "typing accuracy test, test typing accuracy, error free typing, precision typing", icon: "fa-solid fa-bullseye", engine: "typing-accuracy" },
  { id: "falling-words-game", slug: "falling-words-game", category: "typing", title: "Falling Words Game", h1: "Falling Words Interactive Typing Game", tagline: "Type the falling words before they hit the ground in this fast-paced arcade game.", keywords: "falling words game, typing game, arcade typing game, type falling words", icon: "fa-solid fa-cloud-arrow-down", engine: "typing-falling-words" },
  { id: "word-rush-game", slug: "word-rush-game", category: "typing", title: "Word Rush Typing Game", h1: "Word Rush High-Speed Typing Game", tagline: "Beat the clock by clearing as many vocabulary words as possible before time runs out.", keywords: "word rush game, fast typing game, speed typing game, word rush", icon: "fa-solid fa-bolt", engine: "typing-word-rush" },
  { id: "code-typing-challenge", slug: "code-typing-challenge", category: "typing", title: "Code Typing Challenge", h1: "Free Online Code Typing Challenge", tagline: "Practice typing real HTML, CSS, JavaScript, and Python code syntax and brackets.", keywords: "code typing challenge, programmers typing test, syntax typing practice", icon: "fa-solid fa-code", engine: "typing-code-challenge" },
  { id: "keyboard-shortcut-finder", slug: "keyboard-shortcut-finder", category: "typing", title: "Keyboard Shortcut Finder", h1: "Searchable Keyboard Shortcut Directory", tagline: "Instant shortcuts for VS Code, Chrome, Mac, Windows, and Google Docs.", keywords: "keyboard shortcuts, vs code shortcuts, chrome shortcuts, hotkeys directory", icon: "fa-solid fa-command", engine: "typing-shortcuts" },
  { id: "keyboard-key-tester", slug: "keyboard-key-tester", category: "typing", title: "Keyboard Key Tester", h1: "Free Online Keyboard Key Tester", tagline: "Test sticky, broken, or ghosting keys on your physical mechanical or laptop keyboard.", keywords: "keyboard tester, test keyboard keys, check keyboard online, key ghosting test", icon: "fa-solid fa-computer", engine: "typing-key-tester" },
  { id: "typing-error-analyzer", slug: "typing-error-analyzer", category: "typing", title: "Typing Error Analyzer", h1: "Diagnostic Typing Error Analyzer", tagline: "Identify your slowest fingers, most frequent typos, and difficult character pairs.", keywords: "typing error analyzer, weak key diagnostic, typing mistakes finder", icon: "fa-solid fa-stethoscope", engine: "typing-error-analyzer" },
  { id: "daily-typing-challenge", slug: "daily-typing-challenge", category: "typing", title: "Daily Typing Challenge", h1: "Daily Typing Challenge & Streak Tracker", tagline: "A unique daily quote or passage challenge to build your consistency and streaks.", keywords: "daily typing challenge, typing streak, daily typing quote, wordle of typing", icon: "fa-solid fa-calendar-check", engine: "typing-daily-challenge" },

  // CATEGORY 15: NOTES & PRODUCTIVITY
  { id: "sticky-notes", slug: "sticky-notes", category: "productivity", title: "Sticky Notes Board", h1: "Free Online Sticky Notes Board", tagline: "Infinite canvas for organizing, color-coding, and linking thoughts.", keywords: "sticky notes, online sticky notes, virtual corkboard, brainstorm canvas", icon: "fa-solid fa-note-sticky", engine: "core-sticky-notes" },
  { id: "online-notebook", slug: "online-notebook", category: "productivity", title: "Online Notebook", h1: "Free Online Notebook & Text Editor", tagline: "Distraction-free rich-text notepad with snapshot history and local saving.", keywords: "online notebook, digital notepad, browser editor, rich text notes", icon: "fa-solid fa-book", engine: "core-notebook" },
  { id: "checklist-maker", slug: "checklist-maker", category: "productivity", title: "Checklist Maker", h1: "Free Online Interactive Checklist Maker", tagline: "Create, reorder, check off, and export interactive reusable checklists.", keywords: "checklist maker, online checklist, task checklist, to do checklist", icon: "fa-solid fa-square-check", engine: "prod-checklist" },
  { id: "todo-list", slug: "to-do-list", category: "productivity", title: "To-Do List", h1: "Free Online Minimalist To-Do List", tagline: "Track priorities, filter completed tasks, and clear clutter in your browser.", keywords: "to do list, online task list, simple todo app, task manager", icon: "fa-solid fa-list-ul", engine: "prod-todo" },
  { id: "habit-tracker", slug: "habit-tracker", category: "productivity", title: "Habit Tracker", h1: "Free Online Habit Tracker & Streak Counter", tagline: "Build positive routines and track weekly completion streaks locally.", keywords: "habit tracker, daily habit tracker, streak counter, routine planner", icon: "fa-solid fa-chart-simple", engine: "prod-habit-tracker" },
  { id: "daily-journal", slug: "daily-journal", category: "productivity", title: "Daily Journal", h1: "Free Private Daily Journal & Diary", tagline: "Private, local-first reflection log with mood ratings and export.", keywords: "daily journal, private online diary, gratitude journal, daily reflection", icon: "fa-solid fa-book-open", engine: "prod-journal" },
  { id: "meeting-notes-template", slug: "meeting-notes-template", category: "productivity", title: "Meeting Notes Template", h1: "Free Online Meeting Notes Template & Builder", tagline: "Pre-structured format for agendas, discussion points, and action items.", keywords: "meeting notes template, team meeting notes, action items tracker", icon: "fa-solid fa-clipboard-list", engine: "prod-meeting-notes" },
  { id: "decision-matrix", slug: "decision-matrix", category: "productivity", title: "Decision Matrix", h1: "Free Weighted Decision Matrix Tool", tagline: "Compare competing options with weighted criteria to choose objectively.", keywords: "decision matrix, weighted decision tool, compare choices, decision helper", icon: "fa-solid fa-table-columns", engine: "prod-decision-matrix" },
  { id: "focus-session-planner", slug: "focus-session-planner", category: "productivity", title: "Focus Session Planner", h1: "Free Online Deep Work Session Planner", tagline: "Plan your deep work intervals, define targets, and minimize interruptions.", keywords: "focus session planner, deep work planner, productivity session", icon: "fa-solid fa-crosshairs", engine: "prod-focus-planner" },
  { id: "personal-task-planner", slug: "personal-task-planner", category: "productivity", title: "Personal Task Planner", h1: "Free Online Daily Task Planner", tagline: "Time-box your daily tasks into morning, afternoon, and evening blocks.", keywords: "task planner, daily planner, time blocking tool, schedule tasks", icon: "fa-solid fa-calendar-day", engine: "prod-task-planner" },

  // CATEGORY 16: SEO & WEBSITE TOOLS
  { id: "serp-snippet-preview", slug: "serp-snippet-preview", category: "seo", title: "SERP Snippet Preview", h1: "Free Google SERP Snippet Preview Tool", tagline: "Preview title tags and meta descriptions in desktop and mobile Google results.", keywords: "serp preview, google snippet preview, meta title pixel length, seo preview", icon: "fa-solid fa-magnifying-glass", engine: "seo-serp-preview" },
  { id: "meta-description-counter", slug: "meta-description-counter", category: "seo", title: "Meta Description Counter", h1: "Free Online Meta Description Counter", tagline: "Measure character and pixel lengths for SEO titles and meta descriptions.", keywords: "meta description counter, meta title length, pixel length counter, seo characters", icon: "fa-solid fa-text-slash", engine: "seo-meta-counter" },
  { id: "keyword-density-checker", slug: "keyword-density-checker", category: "seo", title: "Keyword Density Checker", h1: "Free Online Keyword Density Checker", tagline: "Analyze 1-word, 2-word, and 3-word phrase frequencies and percentage density.", keywords: "keyword density checker, keyword frequency tool, seo content analysis", icon: "fa-solid fa-chart-pie", engine: "seo-keyword-density" },
  { id: "robots-txt-generator", slug: "robots-txt-generator", category: "seo", title: "Robots.txt Generator", h1: "Free Online Robots.txt Generator", tagline: "Build search engine crawl directives for Googlebot, Bingbot, and AI agents.", keywords: "robots.txt generator, create robots.txt, disallow crawler, crawl directives", icon: "fa-solid fa-robot", engine: "seo-robots-gen" },
  { id: "sitemap-xml-generator", slug: "sitemap-xml-generator", category: "seo", title: "Sitemap XML Generator", h1: "Free Online XML Sitemap Generator", tagline: "Generate structured, clean XML sitemaps for Google Search Console indexing.", keywords: "sitemap xml generator, create sitemap, xml sitemap builder, seo sitemap", icon: "fa-solid fa-sitemap", engine: "seo-sitemap-gen" },
  { id: "open-graph-preview", slug: "open-graph-preview", category: "seo", title: "Open Graph Preview", h1: "Free Social Media Open Graph Card Preview", tagline: "Test how your links will appear on Facebook, LinkedIn, Twitter, and WhatsApp.", keywords: "open graph preview, og tag tester, social share card preview, og image test", icon: "fa-solid fa-share-nodes", engine: "seo-og-preview" },
  { id: "schema-markup-generator", slug: "schema-markup-generator", category: "seo", title: "Schema Markup Generator", h1: "Free JSON-LD Schema Markup Generator", tagline: "Generate valid schema markup for Articles, FAQs, Products, and WebApps.", keywords: "schema markup generator, json ld generator, structured data maker, faq schema", icon: "fa-solid fa-diagram-project", engine: "seo-schema-gen" },
  { id: "utm-link-builder", slug: "utm-link-builder", category: "seo", title: "UTM Link Builder", h1: "Free Online UTM Campaign Link Builder", tagline: "Attach utm_source, utm_medium, and utm_campaign tracking parameters to URLs.", keywords: "utm builder, campaign url builder, track links google analytics, utm generator", icon: "fa-solid fa-bullhorn", engine: "seo-utm-builder" },
  { id: "url-slug-checker", slug: "url-slug-checker", category: "seo", title: "URL Slug Checker", h1: "Free Online URL Slug & Syntax Checker", tagline: "Verify that web slugs are lowercase, hyphenated, readable, and free of invalid characters.", keywords: "url slug checker, validate url slug, clean url validator", icon: "fa-solid fa-check-double", engine: "seo-slug-checker" },
  { id: "readability-checker", slug: "readability-checker", category: "seo", title: "Readability Checker", h1: "Free Online Flesch-Kincaid Readability Checker", tagline: "Score text complexity with Flesch Reading Ease and school grade levels.", keywords: "readability checker, flesch kincaid score, reading ease test, grade level text", icon: "fa-solid fa-glasses", engine: "seo-readability" },

  // CATEGORY 17: DATA & SPREADSHEETS
  { id: "csv-viewer", slug: "csv-viewer", category: "data", title: "CSV Viewer & Table Explorer", h1: "Free Online CSV Viewer & Searchable Table", tagline: "Upload or paste CSV files to explore, sort, and filter records in your browser.", keywords: "csv viewer, online csv reader, view csv table, filter csv online", icon: "fa-solid fa-table", engine: "data-csv-viewer" },
  { id: "csv-merger", slug: "csv-merger", category: "data", title: "CSV Merger", h1: "Free Online CSV File Merger", tagline: "Combine multiple CSV files sharing column headers into one unified table.", keywords: "csv merger, combine csv files, join csv tables, merge spreadsheets", icon: "fa-solid fa-code-merge", engine: "data-csv-merger" },
  { id: "csv-deduplicator", slug: "csv-deduplicator", category: "data", title: "CSV Deduplicator", h1: "Free Online CSV Row Deduplicator", tagline: "Remove duplicate rows or deduplicate based on specific key columns.", keywords: "csv deduplicator, remove duplicate csv rows, clean csv data", icon: "fa-solid fa-filter-circle-xmark", engine: "data-csv-dedupe" },
  { id: "csv-column-extractor", slug: "csv-column-extractor", category: "data", title: "CSV Column Extractor", h1: "Free Online CSV Column Extractor", tagline: "Extract selected columns from massive CSV datasets and export clean subsets.", keywords: "csv column extractor, extract columns, filter csv columns, split csv", icon: "fa-solid fa-columns", engine: "data-csv-column" },
  { id: "json-to-xml", slug: "json-to-xml", category: "data", title: "JSON to XML Converter", h1: "Free Online JSON to XML Converter", tagline: "Convert nested JSON objects into well-formed XML tag trees.", keywords: "json to xml, convert json to xml, json xml translator", icon: "fa-solid fa-shuffle", engine: "data-json-to-xml" },
  { id: "xml-to-json", slug: "xml-to-json", category: "data", title: "XML to JSON Converter", h1: "Free Online XML to JSON Converter", tagline: "Convert XML attributes and elements into lightweight JSON objects.", keywords: "xml to json, parse xml to json, xml converter online", icon: "fa-solid fa-repeat", engine: "data-xml-to-json" },
  { id: "tsv-to-csv", slug: "tsv-to-csv", category: "data", title: "TSV to CSV Converter", h1: "Free Online TSV to CSV Converter", tagline: "Convert tab-separated values into comma-separated rows effortlessly.", keywords: "tsv to csv, tab to comma converter, convert tsv file", icon: "fa-solid fa-arrow-right-arrow-left", engine: "data-tsv-to-csv" },
  { id: "delimited-text-converter", slug: "delimited-text-converter", category: "data", title: "Delimited Text Converter", h1: "Free Online Delimited Text Converter", tagline: "Swap delimiters between commas, pipes, tabs, semicolons, and spaces.", keywords: "delimited text converter, change delimiter, pipe to comma, semicolon to comma", icon: "fa-solid fa-arrows-turn-right", engine: "data-delimited" },
  { id: "table-to-markdown", slug: "table-to-markdown", category: "data", title: "Table to Markdown Converter", h1: "Free Online Table to Markdown Converter", tagline: "Paste spreadsheet cells to generate formatted GitHub Markdown tables.", keywords: "table to markdown, excel to markdown, convert table to md, markdown table maker", icon: "fa-solid fa-table-cells", engine: "data-table-to-md" },
  { id: "data-sampling-tool", slug: "data-sampling-tool", category: "data", title: "Data Sampling Tool", h1: "Free Online Random Data Sampler", tagline: "Extract random or nth-row representative samples from lists and datasets.", keywords: "data sampling tool, random row sampler, sample dataset online", icon: "fa-solid fa-vial", engine: "data-sampler" },

  // CATEGORY 18: AUDIO & VIDEO (100% Client-Side Web APIs)
  { id: "audio-trimmer", slug: "audio-trimmer", category: "media", title: "Audio Trimmer", h1: "Free Online Audio Trimmer (Local)", tagline: "Trim MP3 and WAV files with visual waveform preview and instant save.", keywords: "audio trimmer, cut audio online, trim mp3, ringtone maker online", icon: "fa-solid fa-scissors", engine: "media-audio-trimmer" },
  { id: "audio-format-converter", slug: "audio-format-converter", category: "media", title: "Audio Format Converter", h1: "Free Online Audio Converter (WAV/MP3)", tagline: "Convert audio files between standard Web formats locally in memory.", keywords: "audio converter, convert wav to mp3, web audio converter", icon: "fa-solid fa-music", engine: "media-audio-converter" },
  { id: "audio-volume-normalizer", slug: "audio-volume-normalizer", category: "media", title: "Audio Volume Normalizer", h1: "Free Online Audio Volume Normalizer & Booster", tagline: "Boost quiet audio or normalize peak volume levels without clipping.", keywords: "audio normalizer, boost audio volume, audio gain tool online", icon: "fa-solid fa-volume-high", engine: "media-volume-normalizer" },
  { id: "video-to-gif", slug: "video-to-gif", category: "media", title: "Video to GIF Converter", h1: "Free Online Video to Animated GIF Converter", tagline: "Convert short video clips into lightweight animated GIFs using canvas rendering.", keywords: "video to gif, convert mp4 to gif, make animated gif from video", icon: "fa-solid fa-film", engine: "media-video-to-gif" },
  { id: "video-metadata-viewer", slug: "video-metadata-viewer", category: "media", title: "Video Metadata Viewer", h1: "Free Online Video Metadata Inspector", tagline: "Inspect resolution, duration, bitrate, frame rate, and codec format.", keywords: "video metadata viewer, check video resolution, video duration inspector", icon: "fa-solid fa-clapperboard", engine: "media-video-meta" },
  { id: "video-aspect-ratio", slug: "video-aspect-ratio-calculator", category: "media", title: "Video Aspect Ratio Calculator", h1: "Free Video Aspect Ratio Calculator", tagline: "Calculate width and height dimensions for 16:9, 9:16 Reels, 4:3, and 21:9.", keywords: "video aspect ratio calculator, 16 9 dimensions, calculate video resolution", icon: "fa-solid fa-video", engine: "media-aspect-ratio" },
  { id: "subtitle-time-calculator", slug: "subtitle-time-calculator", category: "media", title: "Subtitle Time Shift Calculator", h1: "Free Online Subtitle Time Shift Calculator", tagline: "Synchronize SRT/VTT subtitles by shifting timecodes forward or backward.", keywords: "subtitle time calculator, shift srt subtitles, sync subtitles online", icon: "fa-solid fa-closed-captioning", engine: "media-subtitle-calc" },
  { id: "audio-waveform-viewer", slug: "audio-waveform-viewer", category: "media", title: "Audio Waveform Viewer", h1: "Free Online Audio Waveform Visualizer", tagline: "Visualize frequencies, amplitude peaks, and stereo balance in real time.", keywords: "audio waveform viewer, visualize audio, sound frequency analyzer", icon: "fa-solid fa-wave-square", engine: "media-waveform" },
  { id: "microphone-test", slug: "microphone-test", category: "media", title: "Microphone Test", h1: "Free Online Microphone Test & Volume Meter", tagline: "Test your computer or smartphone microphone with real-time decibel meter.", keywords: "microphone test, test mic online, check mic volume, microphone tester", icon: "fa-solid fa-microphone", engine: "media-mic-test" },
  { id: "webcam-test", slug: "webcam-test", category: "media", title: "Webcam Test", h1: "Free Online Webcam Test & Resolution Checker", tagline: "Test your camera feed, inspect maximum supported resolution, and take snaps.", keywords: "webcam test, test camera online, check webcam resolution, selfie test", icon: "fa-solid fa-camera", engine: "media-webcam-test" },

  // CATEGORY 19: QR, SHARING & GENERATORS
  { id: "qr-code-generator", slug: "qr-code-generator", category: "generators", title: "QR Code Generator", h1: "Free Online QR Code Generator (Never Expires)", tagline: "Create customized static QR codes for links, text, and contacts with PNG download.", keywords: "qr code generator, free qr maker, create qr code online, download qr code", icon: "fa-solid fa-qrcode", engine: "gen-qrcode" },
  { id: "qr-code-reader", slug: "qr-code-reader", category: "generators", title: "QR Code Reader & Scanner", h1: "Free Online QR Code Scanner & Reader", tagline: "Scan QR codes using your device camera or upload image files to decode instantly.", keywords: "qr code reader, scan qr code online, decode qr image, camera qr scanner", icon: "fa-solid fa-expand", engine: "gen-qr-reader" },
  { id: "barcode-generator", slug: "barcode-generator", category: "generators", title: "Barcode Generator", h1: "Free Online Barcode Generator (CODE128 & EAN)", tagline: "Generate standard retail and inventory barcodes with high-resolution download.", keywords: "barcode generator, create barcode online, code 128 barcode, ean barcode maker", icon: "fa-solid fa-barcode", engine: "gen-barcode" },
  { id: "wifi-qr-generator", slug: "wifi-qr-generator", category: "generators", title: "Wi-Fi QR Code Generator", h1: "Free Online Wi-Fi QR Code Generator", tagline: "Share Wi-Fi credentials effortlessly: guests scan the QR to connect instantly.", keywords: "wifi qr generator, scan wifi qr code, share wifi password qr, wifi connect qr", icon: "fa-solid fa-wifi", engine: "gen-wifi-qr" },
  { id: "vcard-qr-generator", slug: "vcard-qr-generator", category: "generators", title: "vCard QR Generator", h1: "Free Online vCard Contact QR Generator", tagline: "Encode your name, phone, email, and company into a digital business card QR.", keywords: "vcard qr generator, contact qr code, digital business card qr", icon: "fa-solid fa-address-card", engine: "gen-vcard-qr" },
  { id: "link-in-bio-builder", slug: "link-in-bio-page-builder", category: "generators", title: "Link-in-Bio Page Builder", h1: "Free Online Link-in-Bio Page Builder", tagline: "Build a single responsive profile page showcasing all your social links and projects.", keywords: "link in bio builder, free linktree alternative, social link hub, profile links", icon: "fa-solid fa-id-badge", engine: "gen-link-in-bio" },
  { id: "random-name-picker", slug: "random-name-picker", category: "generators", title: "Random Name Picker", h1: "Free Online Random Name Picker", tagline: "Paste a list of names to draw raffle winners or pick student volunteers randomly.", keywords: "random name picker, raffle name drawer, classroom name picker, draw random name", icon: "fa-solid fa-shuffle", engine: "gen-random-name" },
  { id: "team-randomizer", slug: "team-randomizer", category: "generators", title: "Team Randomizer & Group Generator", h1: "Free Online Team Randomizer", tagline: "Divide a list of people into balanced teams or breakout groups automatically.", keywords: "team randomizer, group generator, split names into teams, random group maker", icon: "fa-solid fa-users", engine: "gen-team-randomizer" },
  { id: "decision-wheel", slug: "decision-wheel", category: "generators", title: "Decision Wheel (Spin the Wheel)", h1: "Free Online Decision Wheel & Spinner", tagline: "Spin the colorful wheel to make fun choices, settle debates, or pick prizes.", keywords: "decision wheel, spin the wheel online, random choice spinner, prize wheel", icon: "fa-solid fa-dharmachakra", engine: "gen-decision-wheel" },
  { id: "poll-generator", slug: "poll-generator", category: "generators", title: "Poll Generator", h1: "Free Online Interactive Poll & Survey Creator", tagline: "Design interactive multiple-choice questions with instant percentage results.", keywords: "poll generator, create online poll, survey maker, vote counter", icon: "fa-solid fa-square-poll-vertical", engine: "gen-poll-generator" },

  // CATEGORY 20: EVERYDAY HELPERS
  { id: "stopwatch-with-laps", slug: "stopwatch-with-laps", category: "helpers", title: "Stopwatch with Laps", h1: "Free Online Stopwatch with Lap Splits", tagline: "Track multiple concurrent lap splits with fastest and slowest lap indicators.", keywords: "stopwatch with laps, lap split timer, precise stopwatch online", icon: "fa-solid fa-stopwatch-20", engine: "help-stopwatch-laps" },
  { id: "screen-resolution-checker", slug: "screen-resolution-checker", category: "helpers", title: "Screen Resolution Checker", h1: "Free Online Screen Resolution & DPI Checker", tagline: "Detect your display resolution, CSS viewport size, pixel ratio, and color depth.", keywords: "screen resolution checker, what is my screen resolution, display dpi test, viewport checker", icon: "fa-solid fa-display", engine: "help-screen-res" },
  { id: "aspect-ratio-calculator", slug: "aspect-ratio-calculator", category: "helpers", title: "Aspect Ratio Calculator", h1: "Free Online Aspect Ratio Calculator", tagline: "Calculate matching dimensions for photos, displays, and video formats.", keywords: "aspect ratio calculator, 16:9 ratio calculator, calculate aspect ratio", icon: "fa-solid fa-vector-square", engine: "help-aspect-ratio" },
  { id: "typographic-scale-generator", slug: "typographic-scale-generator", category: "helpers", title: "Typographic Scale Generator", h1: "Free Online Typographic Scale Generator", tagline: "Compute proportional font size hierarchies based on golden ratio and musical scales.", keywords: "typographic scale generator, modular scale typography, font size scale calculator", icon: "fa-solid fa-font-awesome", engine: "help-type-scale" },
  { id: "invoice-generator", slug: "invoice-generator", category: "helpers", title: "Invoice Generator", h1: "Free Online Invoice Generator (Printable PDF)", tagline: "Generate clean professional invoices with line items, tax, and instant print/PDF.", keywords: "invoice generator, create invoice online, free printable invoice, freelancer invoice", icon: "fa-solid fa-file-invoice-dollar", engine: "help-invoice-gen" },
  { id: "receipt-generator", slug: "receipt-generator", category: "helpers", title: "Receipt Generator", h1: "Free Online Receipt Generator", tagline: "Create customizable itemized sales receipts with company details and print view.", keywords: "receipt generator, make receipt online, sales receipt maker, customer receipt", icon: "fa-solid fa-receipt", engine: "help-receipt-gen" },
  { id: "name-generator", slug: "name-generator", category: "helpers", title: "Random Name Generator", h1: "Free Online Random Name Generator", tagline: "Generate realistic first and last names across diverse cultures and languages.", keywords: "name generator, random names, character name generator, baby name generator", icon: "fa-solid fa-signature", engine: "help-name-gen" },
  { id: "flashcard-maker", slug: "flashcard-maker", category: "helpers", title: "Flashcard Maker", h1: "Free Online Flashcard Maker & Study Deck", tagline: "Create flip study cards with questions and answers for fast exam revision.", keywords: "flashcard maker, online flashcards, study cards, digital flashcards tool", icon: "fa-solid fa-layer-group", engine: "help-flashcard" },
  { id: "random-quiz-generator", slug: "random-quiz-generator", category: "helpers", title: "Random Quiz Generator", h1: "Free Online Trivia & Quiz Generator", tagline: "Generate interactive multi-category trivia challenges to test your knowledge.", keywords: "random quiz generator, trivia generator, online quiz, test your knowledge", icon: "fa-solid fa-lightbulb", engine: "help-quiz-gen" },
  { id: "decision-helper", slug: "decision-helper", category: "helpers", title: "Decision Helper & Coin Flipper", h1: "Free Online Decision Helper & Coin Flipper", tagline: "Flip a 3D coin or roll a die to make quick, impartial decisions without hesitation.", keywords: "decision helper, coin flipper, flip a coin online, roll a die, yes or no decision", icon: "fa-solid fa-circle-question", engine: "help-decision-helper" }
];

// Helper dictionaries for rapid lookup
export const TOOLS_BY_SLUG = Object.fromEntries(
  ALL_TOOLS.map(t => [t.slug, t])
);

export const TOOLS_BY_ID = Object.fromEntries(
  ALL_TOOLS.map(t => [t.id, t])
);

// Map any legacy aliases to canonical slug
export const TOOL_ALIASES = {};
ALL_TOOLS.forEach(t => {
  if (t.aliases) {
    t.aliases.forEach(alias => {
      TOOL_ALIASES[alias] = t.slug;
    });
  }
});
