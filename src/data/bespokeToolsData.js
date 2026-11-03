/**
 * Bespoke editorial data, formulas, how-to steps, and guides for tools
 * Shared across client (Tools.jsx) and SSR engine (api/render-page.js)
 */

export const TIER_1_BESPOKE = {
  "typing-speed-test": {
    guide: "The Stiknex Typing Speed Test is a high-precision, client-side WPM benchmarking tool. Using the international standard scoring formula: Net WPM = (Total Characters Typed / 5 - Uncorrected Errors) / Time in Minutes. Choose between 1-minute quick sprints or 2, 3, and 5-minute endurance benchmarks.",
    howTo: [
      "Select your preferred test duration (1, 2, or 5 minutes).",
      "Begin typing the displayed passage as soon as the timer starts.",
      "Watch real-time WPM, character count, and error highlights as you type.",
      "Review your final Net WPM, Raw WPM, Accuracy percentage, and keystroke breakdown."
    ],
    features: [
      "Standard WPM Formula: (Total Characters / 5) - Uncorrected Errors per minute",
      "100% Client-Side Privacy: no keystroke logging or server monitoring",
      "Adaptive error highlighting with instant backspace correction feedback",
      "Clean distraction-free interface with keyboard accessibility"
    ],
    related: ["/typing-practice-lessons", "/word-counter", "/online-notebook"]
  },
  "data-converter": {
    guide: "The Stiknex Data Storage Converter performs instant, accurate conversions between digital storage units from Bytes up to Petabytes. It supports both the decimal SI standard (1 KB = 1,000 Bytes) used by drive manufacturers and the binary IEC standard (1 KiB = 1,024 Bytes) used by operating systems like Windows and Linux.",
    howTo: [
      "Enter the numeric data amount into the input field.",
      "Select your source unit (Bytes, KB, MB, GB, TB, or PB).",
      "Instantly view calculated values across all other storage units in real time.",
      "Toggle between Decimal (1,000) and Binary (1,024) computation modes."
    ],
    features: [
      "Supports Decimal (SI standard, 1000^n) and Binary (IEC standard, 1024^n)",
      "Exact conversions for Bytes, KB, MB, GB, TB, PB, KiB, MiB, GiB, TiB, and PiB",
      "Explains drive storage discrepancies (e.g. why 1TB formats to ~931 GiB)",
      "100% in-browser computation with zero latency and zero data tracking"
    ],
    related: ["/unit-converter", "/developer", "/text-to-binary"]
  },
  "emi-calculator": {
    guide: "The Stiknex EMI Calculator computes your exact Equated Monthly Installment for home loans, vehicle financing, and personal loans. Formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is principal, r is the monthly interest rate, and n is duration in months.",
    howTo: [
      "Enter your total loan principal amount (in ₹ or $).",
      "Input the annual interest rate offered by your lender.",
      "Specify the loan tenure in years or months.",
      "Review your monthly EMI, total interest payable, and total loan cost."
    ],
    features: [
      "Mathematical Formula: P × r × (1 + r)^n / ((1 + r)^n - 1)",
      "Visual breakdown of principal loan amount vs total interest payable",
      "Interactive tenure adjustment to compare monthly commitments",
      "100% client-side privacy: your loan figures remain strictly on your device"
    ],
    related: ["/sip-calculator", "/compound-interest-calculator", "/simple-calculator"]
  },
  "sip-calculator": {
    guide: "The Stiknex SIP Calculator visualizes wealth accumulation through Systematic Investment Plans in mutual funds. Compounded returns formula: M = P × [((1 + i)^n - 1) / i] × (1 + i), where P is monthly deposit, i is periodic interest rate, and n is total months.",
    howTo: [
      "Enter your intended monthly investment amount.",
      "Specify the expected annual rate of return (e.g., 12% for equity mutual funds).",
      "Select your total investment horizon in years.",
      "Inspect total wealth created, invested principal, and compound gains."
    ],
    features: [
      "Compound Formula: M = P × [((1 + i)^n - 1) / i] × (1 + i)",
      "Detailed breakdown of invested capital vs estimated returns",
      "Inflation and compounding visualization for long-term financial planning",
      "Private in-memory calculation with zero tracking or sign-up"
    ],
    related: ["/emi-calculator", "/compound-interest-calculator", "/percentage-calculator"]
  },
  "percentage-calculator": {
    guide: "The Stiknex Percentage Calculator solves everyday mathematical percentage problems instantly. Calculate percentage increases, percentage decreases, differences, discounts, and what percent one number is of another with clear step-by-step mathematical working.",
    howTo: [
      "Choose the percentage calculation mode you need.",
      "Enter the base numbers into the designated input fields.",
      "View instant results calculated in real time with the underlying formula.",
      "Copy the result with one click for work, study, or shopping."
    ],
    features: [
      "Percentage Increase Formula: ((New Value - Original) / Original) × 100",
      "Percentage of a Number Formula: (Percentage / 100) × Total",
      "Discount & Margin calculation with tax and savings breakdown",
      "Instant in-browser math with full keyboard and mobile support"
    ],
    related: ["/simple-calculator", "/fraction-calculator", "/ratio-calculator"]
  },
  "age-calculator": {
    guide: "The Stiknex Age Calculator calculates your exact age down to the day, hours, and minutes from your date of birth. It accurately accounts for leap years and varying month lengths, and provides a countdown to your next birthday.",
    howTo: [
      "Select your birth date using the calendar picker or manual entry.",
      "Optionally choose a custom end date (defaults to today).",
      "View your exact age in years, months, and days.",
      "Check your next birthday countdown and total days lived."
    ],
    features: [
      "Exact Gregorian calendar precision accounting for all leap years",
      "Multiple interval views: total days, hours, minutes, and seconds",
      "Next birthday countdown indicator with day-of-the-week forecast",
      "100% private local date calculation"
    ],
    related: ["/date-calculator", "/time-calculator", "/simple-calculator"]
  },
  "word-counter": {
    guide: "The Stiknex Word Counter provides real-time word, character, sentence, and paragraph statistics as you type or paste text. It includes reading time estimates (at 200 WPM) and speaking time estimates (at 130 WPM) with instant case transformation tools.",
    howTo: [
      "Type or paste your text directly into the input editor.",
      "Review live word, character, sentence, and paragraph tallies.",
      "Check estimated reading time and speaking duration.",
      "Use the one-click case conversion or clean formatting buttons."
    ],
    features: [
      "Real-time counting with zero latency or remote server calls",
      "Reading time estimated at 200 WPM; speaking time at 130 WPM",
      "Character count with spaces and without spaces",
      "100% private in-browser string processing"
    ],
    related: ["/character-counter", "/reading-time-calculator", "/case-converter"]
  },
  "character-counter": {
    guide: "The Stiknex Character Counter is an essential utility for writers, marketers, and social media managers. It counts letters with and without spaces, and validates length against character limits for Twitter/X (280), SEO meta descriptions (150-160), LinkedIn, and Instagram.",
    howTo: [
      "Paste your copy into the text area.",
      "Inspect character counts with spaces and without spaces.",
      "Compare your text length against social media limit bars.",
      "Copy the optimized copy with a single click."
    ],
    features: [
      "Character limit badges for Twitter/X (280), Meta Description (160), LinkedIn (3000)",
      "Separate counts for letters, whitespace, numbers, and symbols",
      "100% client-side privacy: confidential drafts are never sent to a server",
      "Clean responsive mobile and desktop layout"
    ],
    related: ["/word-counter", "/reading-time-calculator", "/case-converter"]
  },
  "json-formatter": {
    guide: "The Stiknex JSON Formatter & Validator beautifies, minifies, and inspects JSON code in your browser. Unlike third-party formatters that transmit confidential API payloads across the internet, Stiknex formats your JSON 100% client-side in memory with line-numbered syntax error detection.",
    howTo: [
      "Paste unformatted or minified JSON into the editor.",
      "Click 'Format' to beautify with clean 2-space or 4-space indentation.",
      "Use 'Validate' to pinpoint syntax errors with exact line and column numbers.",
      "Click 'Minify' to strip whitespace for production payloads."
    ],
    features: [
      "100% Client-Side Parsing: private tokens and API payloads stay in your browser",
      "Instant syntax error detection with line numbers and character positions",
      "One-click beautify (2/4 spaces) and minify options",
      "JSON tree preview and copy to clipboard"
    ],
    related: ["/json-validator", "/json-to-csv", "/base64-encode-decode"]
  },
  "scientific-calculator": {
    guide: "The Stiknex Scientific Calculator performs advanced arithmetic, trigonometry (sine, cosine, tangent), logarithmic, exponential, and factorial calculations. Includes live expression preview, DEG/RAD angle modes, and 1-click answer recall.",
    howTo: [
      "Enter expressions using the interactive buttons or physical keyboard.",
      "Toggle between DEG (Degrees) and RAD (Radians) for trigonometric functions.",
      "Use parentheses to group operations and maintain mathematical order.",
      "Press '=' or Enter to evaluate, and click 'Copy' to use the result."
    ],
    features: [
      "High-precision floating point arithmetic with automatic formatting",
      "Full scientific suite: sin, cos, tan, log, ln, sqrt, powers, factorials",
      "DEG/RAD mode toggle for academic and engineering calculations",
      "Live expression preview tape and answer history recall"
    ],
    related: ["/simple-calculator", "/percentage-calculator", "/fraction-calculator"]
  },
  "unit-converter": {
    guide: "The Stiknex Universal Unit Converter provides bidirectional conversion across 7 metric and imperial measurement dimensions: length, area, volume, mass/weight, speed, pressure, and power. Equipped with precision decimal controls and 1-click copying.",
    howTo: [
      "Enter your starting numeric value.",
      "Select your source unit from the dropdown.",
      "Choose your desired destination unit or inspect the all-units comparison table.",
      "Copy any converted value directly to your clipboard."
    ],
    features: [
      "Comprehensive support for metric, imperial, and US customary units",
      "Customizable decimal precision (2, 4, 6 decimals or auto-precision)",
      "Instant dual-card swap (⇄) between source and target units",
      "Zero server latency: calculated locally via standard SI physical constants"
    ],
    related: ["/length-converter", "/weight-converter", "/area-converter"]
  },
  "currency-converter": {
    guide: "The Stiknex Live Currency Converter computes real-time foreign exchange rates for the world's major currencies (USD, EUR, GBP, INR, JPY, CAD, AUD, CHF, CNY, SGD). Features offline fallback tables and instant currency pair swaps.",
    howTo: [
      "Enter the currency amount to convert.",
      "Select your base source currency and target destination currency.",
      "Review the live exchanged total and current per-unit exchange rate.",
      "Check popular currency pairs or the complete rates matrix below."
    ],
    features: [
      "Real-time central bank foreign exchange data via Frankfurter API",
      "Built-in offline reference fallback for resilient calculation",
      "One-click currency swap (⇄) and popular currency shortcut chips",
      "Complete multi-currency conversion table updated simultaneously"
    ],
    related: ["/sip-calculator", "/emi-calculator", "/unit-converter"]
  },
  "password-generator": {
    guide: "The Stiknex Password Generator creates cryptographically secure, random passwords directly in your browser using the Web Crypto API. Includes entropy scoring in bits and estimated brute-force crack times to ensure impenetrable account security.",
    howTo: [
      "Choose your desired password length using the slider (6 to 64 characters).",
      "Toggle uppercase letters, lowercase letters, numbers, and symbols.",
      "Review the real-time strength meter and estimated brute-force time.",
      "Click 'Copy Password' to securely store in your password manager."
    ],
    features: [
      "Cryptographically secure randomness via window.crypto.getRandomValues",
      "Entropy bit calculation and realistic brute-force crack time estimates",
      "Custom character pool selection: uppercase, lowercase, numbers, symbols",
      "100% private: passwords are never logged, cached, or transmitted"
    ],
    related: ["/qr-code-generator", "/uuid-generator", "/base64-encode-decode"]
  },
  "qr-code-generator": {
    guide: "The Stiknex QR Code Generator renders high-resolution, custom QR codes for URLs, WiFi passwords, contact details, and plain text entirely in your browser. Export in 1000px high-resolution PNG or crisp vector SVG formats.",
    howTo: [
      "Type or paste your destination URL, text, or data into the input field.",
      "Customize foreground and background colors to match your brand.",
      "Select your desired error correction level (Low, Medium, Quartile, High).",
      "Download high-res 1000px PNG or copy raw vector SVG code."
    ],
    features: [
      "100% client-side vector SVG rendering with zero remote server tracking",
      "Custom foreground and background color pickers with hex codes",
      "Four error correction levels (L 7%, M 15%, Q 25%, H 30%) for damaged scans",
      "One-click high-resolution PNG download and vector SVG clipboard copy"
    ],
    related: ["/url-shortener", "/password-generator", "/color-picker"]
  }
};

export const getBespokeDataForSlug = (slug) => {
  return TIER_1_BESPOKE[slug] || null;
};

