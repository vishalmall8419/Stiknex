// Unique, answer-first AEO/GEO content, verified converter tables, and 4 unique FAQs
// for the 15 scoped routes. Shared across client (WorkspaceSeoSection, Tools, seoConfig)
// and server (api/render-page.js, api/_utils/seoConfig.js).

export const SCOPED_SEO_CONTENT = {
  "/speed-converter": {
    answerHeading: "What is the Stiknex Speed Converter?",
    answerFirst: `The Stiknex Speed Converter is a free, browser-based velocity calculator that converts between km/h, mph, meters per second (m/s), nautical knots, and feet per second (ft/s) with zero login or sign-up. Every calculation runs locally in your browser, so values update live as you type without page reloads or server uploads.

To use it, enter any numeric speed, pick your starting unit, and choose a target unit—or read the full equivalent matrix below the main readout. You can also adjust decimal precision (from 2 decimals up to auto precision) and copy any converted figure with one click.

This tool is useful for comparing road speed limits (such as 140 km/h to mph or 60 mph to km/h), converting wind or marine speeds in knots, and checking physics lab values in m/s or m/hr to km/hr. For example, 100 km/h = 62.14 mph, 140 km/h = 86.99 mph, and 10 m/s = 36 km/h (rounded to 2 decimal places).`,
    conversionTable: {
      caption: "Common Speed Conversions (rounded to 2 decimal places)",
      columns: ["Input Speed", "Converted Value", "Notes"],
      rows: [
        ["1 m/s", "3.6 km/h", "SI speed to road speed"],
        ["10 m/s", "36 km/h", "Sprint / wind speed"],
        ["50 km/h", "31.07 mph", "Urban speed limit"],
        ["100 km/h", "62.14 mph", "Highway benchmark"],
        ["140 km/h", "86.99 mph", "High-speed motorway"],
        ["60 mph", "96.56 km/h", "US highway speed"],
        ["100 mph", "160.93 km/h", "High-speed mph to km/h"],
        ["1 knot", "1.85 km/h", "Nautical mile per hour"],
        ["20 knots", "23.02 mph", "Marine / aviation wind"],
        ["1,000 m/s", "2,236.94 mph", "Supersonic reference"]
      ]
    },
    faqs: [
      {
        q: "How do I convert km/h to mph accurately?",
        a: "Divide the speed in kilometers per hour by 1.60934, or multiply by 0.621371. For example, 100 km/h equals 62.14 mph and 140 km/h equals 86.99 mph when rounded to two decimal places. Enter any km/h value in the converter above for instant results."
      },
      {
        q: "How many km/h is 60 mph?",
        a: "60 miles per hour equals 96.56 km/h (rounded to two decimal places), because one international mile equals 1.609344 kilometers. You can type any mph value into the input box to see km/h, m/s, knots, and ft/s side by side."
      },
      {
        q: "What is the difference between m/s, knots, and km/h?",
        a: "Meters per second (m/s) is the SI physics unit, km/h is standard for road speeds, and knots measure nautical miles per hour in aviation and sailing. One m/s equals 3.6 km/h, while one knot equals 1.85 km/h (rounded to two decimals)."
      },
      {
        q: "Can I convert meters per hour (m/hr) to km/hr?",
        a: "Yes. Because one kilometer equals 1,000 meters, divide meters per hour by 1,000 to get km/h. For instance, 5,000 m/hr equals 5 km/h. You can also convert m/s directly to km/h by multiplying by 3.6 in the converter."
      }
    ],
    relatedTools: [
      { path: "/unit-converter", label: "Unit Converter" },
      { path: "/length-converter", label: "Length Converter" },
      { path: "/temperature-converter", label: "Temperature Converter" }
    ]
  },

  "/temperature-converter": {
    answerHeading: "What is the Stiknex Temperature Converter?",
    answerFirst: `The Stiknex Temperature Converter is a free, no-login online tool that converts temperatures simultaneously between Celsius (°C), Fahrenheit (°F), and Kelvin (K) directly in your browser. It runs client-side with zero data tracking, giving instant, accurate results as soon as you type a number.

Select your input scale, enter any positive or negative temperature, and read the converted values across all three scales at once. Built-in physical benchmark shortcuts—including absolute zero (-273.15 °C), water freezing (0 °C), room temperature (21 °C), human body temperature (37 °C), and boiling water (100 °C)—let you jump to common reference points in one click.

Use it for cooking and oven temperatures (such as 180 °C = 356 °F or 200 °C = 392 °F), weather forecasts, or chemistry and physics coursework in Kelvin. For example, 0 °C = 32 °F (273.15 K), 37 °C = 98.6 °F (310.15 K), and -40 °C = -40 °F (233.15 K), rounded to 2 decimal places.`,
    conversionTable: {
      caption: "Common Temperature Conversions (rounded to 2 decimal places)",
      columns: ["Celsius (°C)", "Fahrenheit (°F)", "Kelvin (K)"],
      rows: [
        ["-40 °C", "-40 °F", "233.15 K"],
        ["0 °C", "32 °F", "273.15 K"],
        ["20 °C", "68 °F", "293.15 K"],
        ["25 °C", "77 °F", "298.15 K"],
        ["37 °C", "98.6 °F", "310.15 K"],
        ["100 °C", "212 °F", "373.15 K"],
        ["180 °C", "356 °F", "453.15 K"],
        ["200 °C", "392 °F", "473.15 K"],
        ["220 °C", "428 °F", "493.15 K"]
      ]
    },
    faqs: [
      {
        q: "How do I convert Celsius to Fahrenheit?",
        a: "Multiply the Celsius temperature by 9/5 (1.8) and add 32. For example, 20 °C equals 68 °F and 100 °C equals 212 °F. Our converter performs this formula live as you type and also shows Kelvin at the same time."
      },
      {
        q: "How do I convert Fahrenheit to Celsius?",
        a: "Subtract 32 from the Fahrenheit value and multiply the result by 5/9. For instance, 98.6 °F minus 32 is 66.6, which multiplied by 5/9 gives 37 °C. Enter any Fahrenheit figure above to see Celsius and Kelvin immediately."
      },
      {
        q: "At what temperature are Celsius and Fahrenheit equal?",
        a: "Celsius and Fahrenheit meet at exactly -40 degrees (-40 °C = -40 °F), which equals 233.15 Kelvin. You can verify this directly in the converter by typing -40 in either the Celsius or Fahrenheit field."
      },
      {
        q: "How do you convert Celsius to Kelvin?",
        a: "Add 273.15 to the Celsius temperature to get Kelvin. Because Kelvin starts at absolute zero (0 K = -273.15 °C), each 1 K step is identical in size to 1 °C. For example, 25 °C equals 298.15 K."
      }
    ],
    relatedTools: [
      { path: "/unit-converter", label: "Unit Converter" },
      { path: "/speed-converter", label: "Speed Converter" },
      { path: "/volume-converter", label: "Volume Converter" }
    ]
  },

  "/unit-converter": {
    answerHeading: "What is the Stiknex Unit Converter?",
    answerFirst: `The Stiknex Unit Converter is a free, browser-based universal measurement calculator that converts between Metric (SI) and US Imperial units with no sign-up or account required. All calculations execute locally in your browser memory, so inputs never leave your device and results appear instantaneously.

Enter any number, select your source unit and target unit, and view both the primary conversion and a full equivalent table of all units in that category. You can swap units in one click, adjust decimal precision from 2 decimals to auto, or copy any converted value straight to your clipboard. Recent conversions are saved locally in your browser history panel for quick reference.

It is built for everyday engineering, cooking, travel, schoolwork, and international shopping—whether you are converting kilometers to miles, kilograms to pounds, liters to US gallons, or bar to PSI. For example, 1 km = 0.62 mi, 1 kg = 2.2 lb, and 100 km/h = 62.14 mph (rounded to 2 decimal places).`,
    conversionTable: {
      caption: "Common Metric and Imperial Unit Conversions (rounded to 2 decimal places)",
      columns: ["From Unit", "To Unit", "Category"],
      rows: [
        ["1 km", "0.62 mi", "Length"],
        ["1 m", "3.28 ft", "Length"],
        ["1 kg", "2.2 lb", "Weight / Mass"],
        ["1 lb", "453.59 g", "Weight / Mass"],
        ["1 L", "0.26 gal (US)", "Volume"],
        ["100 °C", "212 °F", "Temperature"],
        ["100 km/h", "62.14 mph", "Speed"],
        ["1 acre", "4,046.86 m²", "Area"],
        ["1 bar", "14.5 psi", "Pressure"],
        ["1 hp", "745.7 W", "Power"]
      ]
    },
    faqs: [
      {
        q: "Which measurement systems does this unit converter support?",
        a: "It supports both the International System of Units (SI Metric) and US Customary / Imperial units across length, weight, volume, temperature, area, speed, pressure, and power. You can switch between systems or compare all equivalents in one view."
      },
      {
        q: "How accurate are the unit conversion factors?",
        a: "Conversions use standard international definitions—such as 1 inch = 0.0254 meters, 1 mile = 1,609.344 meters, and 1 pound = 453.592 grams. You can choose 2 to 4 decimal places or auto precision depending on how exact your task needs to be."
      },
      {
        q: "Can I use the unit converter offline?",
        a: "Yes. Once loaded, all conversion math runs locally in JavaScript without calling an external API or server. As long as the page is open or cached in your browser, you can convert units without an internet connection."
      },
      {
        q: "How do I quickly reverse a unit conversion?",
        a: "Click the swap button between the source and target unit selectors to flip the conversion direction immediately. Your current numeric value stays in place and the converted output recalculates right away without losing your history."
      }
    ],
    relatedTools: [
      { path: "/length-converter", label: "Length Converter" },
      { path: "/volume-converter", label: "Volume Converter" },
      { path: "/speed-converter", label: "Speed Converter" }
    ]
  },

  "/volume-converter": {
    answerHeading: "What is the Stiknex Volume Converter?",
    answerFirst: `The Stiknex Volume Converter is a free, offline-ready online tool that converts liquid and cubic volume measurements—including milliliters (mL), liters (L), cubic meters (m³), teaspoons (tsp), tablespoons (tbsp), cups, and US gallons—directly in your browser with no login required.

Type a volume amount, choose your starting unit, and pick your target unit to see the converted value immediately along with an all-units comparison list. Precision controls let you round to 2 decimal places for everyday recipes or keep higher precision for laboratory and industrial calculations, and you can copy any value in one click.

It is practical for scaling kitchen recipes between metric milliliters and US cups or spoons, sizing aquariums and water tanks in liters versus gallons, or estimating shipping volumes in cubic meters. For example, 1 US gallon = 3.79 liters, 1 cup = 240 mL, and 1 cubic meter = 1,000 liters (rounded to 2 decimal places).`,
    conversionTable: {
      caption: "Common Volume Conversions (rounded to 2 decimal places)",
      columns: ["Input Volume", "Converted Value", "Common Use"],
      rows: [
        ["1 L", "1,000 mL", "Metric liquid base"],
        ["1 L", "0.26 gal (US)", "Bottles to gallons"],
        ["1 gal (US)", "3.79 L", "US liquid gallon"],
        ["5 gal (US)", "18.93 L", "Water jug / tank"],
        ["1 cup", "240 mL", "Baking & cooking"],
        ["2 cups", "480 mL", "Recipe scaling"],
        ["1 tbsp", "14.79 mL", "Tablespoon to mL"],
        ["1 tsp", "4.93 mL", "Teaspoon to mL"],
        ["1 m³", "1,000 L", "Cubic volume to liters"]
      ]
    },
    faqs: [
      {
        q: "How many liters are in a US gallon?",
        a: "One US liquid gallon equals 3.79 liters (3.78541 L before rounding to two decimals). Conversely, one liter equals 0.26 US gallons. Enter any gallon or liter amount above to convert both ways instantly."
      },
      {
        q: "How many milliliters are in a cup, tablespoon, and teaspoon?",
        a: "Using the standard metric-friendly definitions in this converter, 1 cup equals 240 mL, 1 tablespoon equals 14.79 mL, and 1 teaspoon equals 4.93 mL (rounded to two decimal places). These values update automatically for any fractional input."
      },
      {
        q: "How do I convert cubic meters (m³) to liters?",
        a: "Multiply cubic meters by 1,000 to get liters, because one cubic meter holds 1,000 liters (and 1,000,000 milliliters). For example, 0.5 m³ equals 500 liters. You can check any cubic meter figure in the converter."
      },
      {
        q: "Are US gallons different from UK Imperial gallons?",
        a: "Yes. A US gallon is 3.79 liters, whereas a UK Imperial gallon is larger at about 4.55 liters. This tool specifically labels and calculates US gallons (galus) so recipe and fuel calculations remain consistent."
      }
    ],
    relatedTools: [
      { path: "/unit-converter", label: "Unit Converter" },
      { path: "/length-converter", label: "Length Converter" },
      { path: "/temperature-converter", label: "Temperature Converter" }
    ]
  },

  "/length-converter": {
    answerHeading: "What is the Stiknex Length Converter?",
    answerFirst: `The Stiknex Length Converter is a free, browser-based distance and dimension calculator that converts between millimeters (mm), centimeters (cm), meters (m), kilometers (km), inches (in), feet (ft), yards (yd), and miles (mi) with no sign-up or installation. All calculations run locally in your browser memory for instant, private results.

Enter any length, choose your starting and target units, and view the converted result immediately alongside every other length unit in the equivalent matrix. You can adjust decimal precision from 2 decimals to auto, swap units in one click, or copy any converted figure straight to your clipboard.

Whether you are converting personal height from feet to meters, screen or furniture dimensions from inches to centimeters, or running routes from kilometers to miles, the numbers stay consistent and easy to read. For example, 1 inch = 2.54 cm, 1 mile = 1.61 km, and 6 feet = 1.83 meters (rounded to 2 decimal places).`,
    conversionTable: {
      caption: "Common Length Conversions (rounded to 2 decimal places)",
      columns: ["Input Length", "Converted Value", "Common Use"],
      rows: [
        ["1 in", "2.54 cm", "Exact international inch"],
        ["12 in", "30.48 cm", "1 foot in centimeters"],
        ["1 ft", "0.3 m", "Foot to meters"],
        ["6 ft", "1.83 m", "Height conversion"],
        ["1 m", "3.28 ft", "Meter to feet"],
        ["1 yd", "0.91 m", "Yard to meters"],
        ["1 km", "0.62 mi", "Kilometer to miles"],
        ["5 km", "3.11 mi", "5K running distance"],
        ["1 mi", "1.61 km", "Mile to kilometers"],
        ["10 mi", "16.09 km", "10-mile distance"]
      ]
    },
    faqs: [
      {
        q: "How many centimeters are in an inch?",
        a: "One international inch is defined as exactly 2.54 centimeters (25.4 millimeters). Twelve inches (1 foot) equal 30.48 cm. Type any inch measurement into the converter to get centimeters, millimeters, or meters immediately."
      },
      {
        q: "How do I convert feet to meters?",
        a: "Multiply the number of feet by 0.3048, because one international foot is exactly 0.3048 meters. For example, 6 feet equals 1.83 meters when rounded to two decimal places, and 1 meter equals 3.28 feet."
      },
      {
        q: "How many kilometers are in a mile?",
        a: "One mile equals 1.61 kilometers (1.609344 km exact), while one kilometer equals 0.62 miles. For example, a 5 km run is 3.11 miles and a 10-mile route is 16.09 km when rounded to two decimal places."
      },
      {
        q: "How do I convert meters to yards?",
        a: "Divide meters by 0.9144, because one yard equals 0.9144 meters. That means 1 meter equals approximately 1.09 yards, and 100 meters equals 109.36 yards. Enter any meter or yard value above for instant conversion."
      }
    ],
    relatedTools: [
      { path: "/unit-converter", label: "Unit Converter" },
      { path: "/speed-converter", label: "Speed Converter" },
      { path: "/volume-converter", label: "Volume Converter" }
    ]
  },

  "/word-counter": {
    answerHeading: "What is the Stiknex Word Counter?",
    answerFirst: `The Stiknex Word Counter is a free, real-time online text analyzer that counts words, characters (with and without spaces), sentences, paragraphs, reading time, and speaking time directly in your browser with no login required. Your text stays strictly in browser memory and is never uploaded or logged on any external server.

Paste or type your draft into the editor to see all metrics update live on every keystroke without page reloads. The tool also extracts your top four recurring keywords with percentage density, includes quick case-transform buttons (UPPERCASE, lowercase, Title Case), and tracks character limits for Twitter/X (280), Instagram (2,200), and LinkedIn (3,000). You can copy or clear your text with a single click.

Writers, students, bloggers, and editors use it to meet strict essay word targets, estimate speech or article duration (at 200 words per minute reading and 130 words per minute speaking), and verify keyword balance before publishing.`,
    faqs: [
      {
        q: "How does the word counter calculate reading and speaking time?",
        a: "Reading time is estimated at an average pace of 200 words per minute, and speaking time at 130 words per minute. Short drafts under a minute display in seconds, making it easy to time speeches, scripts, and blog posts."
      },
      {
        q: "Is my text stored or sent to a server?",
        a: "No. All word, character, sentence, and keyword density calculations run locally in your browser using JavaScript. Nothing you type or paste is saved to a remote database or logged on a server."
      },
      {
        q: "How are sentences and paragraphs counted?",
        a: "Sentences are detected by terminal punctuation marks (periods, exclamation points, and question marks), while paragraphs are counted by non-empty line-break blocks. This gives reliable structure metrics for essays, reports, and articles."
      },
      {
        q: "Does it show keyword density?",
        a: "Yes. The tool automatically extracts the top four most frequent words of three or more characters and displays each word's count and percentage share of your total word count for quick editorial review."
      }
    ],
    relatedTools: [
      { path: "/character-counter", label: "Character Counter" },
      { path: "/case-converter", label: "Case Converter" },
      { path: "/online-notebook", label: "Online Notebook" }
    ]
  },

  "/character-counter": {
    answerHeading: "What is the Stiknex Character Counter?",
    answerFirst: `The Stiknex Character Counter is a free, instant browser tool that measures total characters with spaces, characters without spaces, words, sentences, and paragraphs with no account or sign-up. Everything runs locally in your browser memory so private drafts, emails, and unpublished copy never leave your device.

Type or paste your text into the editor to see live character counts alongside built-in platform limit bars for Twitter/X (280 characters), Instagram captions (2,200 characters), and LinkedIn posts (3,000 characters). You can copy or clear your text in one click, inspect top keyword density, or convert text between uppercase, lowercase, and title case without leaving the page. Reading and speaking time estimates also update automatically as you edit.

It is ideal for checking SEO title tags (under 60 characters), meta descriptions (under 160 characters), social media posts, SMS message lengths, ad headlines, and web form fields with strict character caps without any software install.`,
    faqs: [
      {
        q: "What is the difference between characters with and without spaces?",
        a: "Characters with spaces counts every character including spaces, tabs, and line breaks. Characters without spaces removes all whitespace so you see only letters, digits, and punctuation symbols across your entire draft."
      },
      {
        q: "What character limits are built into the checker?",
        a: "The tool includes live progress bars for Twitter/X (280 characters), Instagram captions (2,200 characters), and LinkedIn posts (3,000 characters), helping you stay comfortably within social platform limits before publishing your post."
      },
      {
        q: "Can I use this to check SEO title and meta description lengths?",
        a: "Yes. Paste your page title or meta description into the box and watch the total character count (with spaces) to keep titles around 50–60 characters and descriptions under 155–160 characters."
      },
      {
        q: "Does the character counter work offline?",
        a: "Yes. Because all counting logic runs purely in client-side JavaScript without external server requests, the character counter continues to work offline smoothly once the page is loaded in your browser."
      }
    ],
    relatedTools: [
      { path: "/word-counter", label: "Word Counter" },
      { path: "/case-converter", label: "Case Converter" },
      { path: "/online-notebook", label: "Online Notebook" }
    ]
  },

  "/case-converter": {
    answerHeading: "What is the Stiknex Case Converter?",
    answerFirst: `The Stiknex Case Converter is a free online text formatting tool that transforms text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case right in your browser with no login, installation, or server uploads. All formatting runs client-side so sensitive notes and code identifiers stay private.

Paste or type your text into the input panel, click any case mode to transform it instantly, and copy the formatted output in one click. You can also save local snapshots in your browser if you want to compare or revisit earlier text transformations during an editing session, and clear the workspace whenever you start fresh.

Writers, students, and editors use it to fix accidental Caps Lock typing and format headlines in Title Case, while developers use it to convert variable names, CSS classes, URL slugs, and database keys between camelCase, snake_case, and kebab-case without writing manual scripts or regular expressions.`,
    faqs: [
      {
        q: "What is the difference between camelCase and PascalCase?",
        a: "camelCase starts with a lowercase letter and capitalizes each subsequent word (for example, myVariableName), while PascalCase capitalizes the first letter of every word including the first (for example, MyClassName) for classes and components."
      },
      {
        q: "When should I use snake_case vs kebab-case?",
        a: "snake_case joins lowercase words with underscores (my_variable_name) and is common in Python and SQL columns. kebab-case joins lowercase words with hyphens (my-url-slug) and is standard for URLs and CSS class names."
      },
      {
        q: "How does Sentence case differ from Title Case?",
        a: "Sentence case capitalizes only the first letter of each sentence while lowercasing the rest, whereas Title Case capitalizes the first letter of major words in a headline, title, or section heading."
      },
      {
        q: "Is my pasted text sent anywhere?",
        a: "No. All text case transformations happen locally in your browser's memory, and any optional snapshots you save are stored strictly in your browser's localStorage without any external server uploads or tracking."
      }
    ],
    relatedTools: [
      { path: "/word-counter", label: "Word Counter" },
      { path: "/character-counter", label: "Character Counter" },
      { path: "/json-formatter", label: "JSON Formatter" }
    ]
  },

  "/json-formatter": {
    answerHeading: "What is the Stiknex JSON Formatter?",
    answerFirst: `The Stiknex JSON Formatter is a free, browser-based JSON beautifier, validator, and minifier that formats raw JSON, detects syntax errors, and compresses payloads with no login or server upload. All parsing runs locally in your browser's JavaScript engine, keeping confidential API payloads, tokens, and configuration files completely private.

Paste any JSON string into the editor, then choose Format/Beautify to indent nested objects and arrays cleanly or Minify to strip whitespace for production use. If your JSON is invalid, the parser highlights the syntax error so you can fix missing quotes, trailing commas, or mismatched brackets quickly before copying the clean output with one click. You can also load sample data or clear the workspace anytime.

Developers, data analysts, and QA engineers use it daily to inspect REST API responses, clean up configuration files, validate webhook payloads, debug malformed data from logs, and minify JSON before embedding it into web applications.`,
    faqs: [
      {
        q: "Does the JSON formatter upload my data to a server?",
        a: "No. All JSON parsing, formatting, validation, and minification happen client-side in your browser using native JavaScript. Sensitive API responses, tokens, and configuration files never leave your device or touch a server."
      },
      {
        q: "What is the difference between beautifying and minifying JSON?",
        a: "Beautifying adds indentation and line breaks so nested objects and arrays are easy for humans to read. Minifying removes all unnecessary whitespace and newlines to reduce payload size for network transfer."
      },
      {
        q: "What are the most common JSON syntax errors?",
        a: "Standard JSON errors include trailing commas after the last item in an object or array, using single quotes instead of double quotes, unquoted property keys, and unescaped line breaks inside strings."
      },
      {
        q: "Can I validate large API responses with this tool?",
        a: "Yes. Because parsing runs natively in your browser's JavaScript engine without network round-trips or server limits, it formats and validates typical API payloads and configuration files almost instantaneously on your device."
      }
    ],
    relatedTools: [
      { path: "/case-converter", label: "Case Converter" },
      { path: "/word-counter", label: "Word Counter" },
      { path: "/online-notebook", label: "Online Notebook" }
    ]
  },

  "/qr-code-generator": {
    answerHeading: "What is the Stiknex QR Code Generator?",
    answerFirst: `The Stiknex QR Code Generator is a free, client-side tool that creates custom QR codes for URLs, plain text, email addresses, or Wi-Fi strings directly in your browser with no account or sign-up. Generated codes are static pixel matrices encoded locally with no tracking redirects and never expire.

Enter your URL or text, pick custom foreground and background colors, and select an error correction level—Low (7%), Medium (15%), Quartile (25%), or High (30%). Higher error correction adds redundancy so codes remain scannable even when partially covered or printed small. When ready, download a 1000×1000 pixel PNG image or copy the crisp SVG vector markup in one click. All rendering happens in your browser without uploading your links.

It is useful for sharing website links on flyers, printing Wi-Fi access codes for guests, adding portfolio links to business cards, labeling physical equipment, and embedding scannable vector graphics into modern design tools.`,
    faqs: [
      {
        q: "Do Stiknex QR codes expire or contain tracking?",
        a: "No. Your text or URL is encoded directly into the QR pixel pattern in your browser without a redirect server, so the QR code never expires and works as long as your destination link works."
      },
      {
        q: "Which error correction level should I choose?",
        a: "Medium (15%) works well for clean screens and print. Choose Quartile (25%) or High (30%) if the QR code will be printed small, placed outdoors, or exposed to wear and smudges."
      },
      {
        q: "What formats can I download or export?",
        a: "You can download a high-resolution 1000×1000 pixel PNG file for print and social sharing, or copy the raw SVG vector code to paste directly into Figma, Illustrator, or web code."
      },
      {
        q: "Can I customize QR code colors safely?",
        a: "Yes. You can pick any foreground and background hex color, though keeping strong contrast—such as a dark foreground on a light background—ensures reliable scanning across phone cameras and QR readers."
      }
    ],
    relatedTools: [
      { path: "/password-generator", label: "Password Generator" },
      { path: "/sticky-notes", label: "Sticky Notes" },
      { path: "/online-notebook", label: "Online Notebook" }
    ]
  },

  "/password-generator": {
    answerHeading: "What is the Stiknex Password Generator?",
    answerFirst: `The Stiknex Password Generator is a free, browser-based random password maker that uses the Web Crypto API (window.crypto.getRandomValues) to generate unpredictable passwords with no login or server transmission. Everything runs strictly in local device memory and is never stored, logged, or sent over the network.

Adjust the password length slider and toggle lowercase letters, uppercase letters, numbers, and symbols (at least one character set always remains active). As you customize, the tool calculates bit entropy and displays a live strength rating along with an estimated crack-time benchmark so you can see how length and character variety affect resistance to brute-force guessing. Copy your new password to the clipboard or regenerate a fresh one with a single click.

Use it to create unique, high-entropy credentials for email, banking, cloud accounts, and API keys without relying on predictable words, personal dates, or reused password patterns across different websites, services, and online apps.`,
    faqs: [
      {
        q: "How are passwords generated without a server?",
        a: "The generator uses your browser's native window.crypto.getRandomValues() cryptographically secure pseudorandom number generator (CSPRNG). Passwords are created strictly in local device RAM and are never sent over the network or saved."
      },
      {
        q: "How long should a strong password be?",
        a: "At least 16 characters mixing uppercase, lowercase, numbers, and symbols is a solid baseline for important accounts. Longer passwords increase bit entropy exponentially and are much harder to brute-force over time."
      },
      {
        q: "What does the entropy score mean?",
        a: "Entropy (measured in bits) estimates how many guesses an attacker would need on average to crack the password, based on password length and the size of the selected character pool."
      },
      {
        q: "Can I exclude symbols if a website forbids them?",
        a: "Yes. Uncheck the symbols toggle to generate alphanumeric passwords using only uppercase letters, lowercase letters, and numbers, while increasing password length to maintain strong overall bit entropy and account security."
      }
    ],
    relatedTools: [
      { path: "/qr-code-generator", label: "QR Code Generator" },
      { path: "/online-notebook", label: "Online Notebook" },
      { path: "/json-formatter", label: "JSON Formatter" }
    ]
  },

  "/pomodoro-timer": {
    answerHeading: "What is the Stiknex Pomodoro Timer?",
    answerFirst: `The Stiknex Pomodoro Timer is a free online focus timer built around 25-minute work intervals and 5-minute breaks, running directly in your browser with no account, download, or installation needed. All timer controls and session state stay local in your browser without tracking or login walls.

Start a 25-minute focus sprint, work on a single chosen task until the session finishes, and take a 5-minute short break before starting the next cycle. Running the timer in your browser keeps your workspace lightweight and distraction-free without needing a separate desktop app, browser extension, or phone alarm. You can pause, reset, or switch between focus and break intervals anytime as your schedule changes.

Students, developers, writers, and remote workers use the Pomodoro rhythm to overcome procrastination on large assignments, track focused study blocks, and prevent mental fatigue during long coding, reading, exam prep, research, or technical writing sessions throughout the entire workday.`,
    faqs: [
      {
        q: "What is the standard Pomodoro Technique schedule?",
        a: "A standard Pomodoro cycle consists of 25 minutes of uninterrupted focus followed by a 5-minute break. After completing four focus cycles, most people take a longer 15 to 30 minute rest."
      },
      {
        q: "Do I need to create an account to use the timer?",
        a: "No. You can open the Stiknex Pomodoro timer and start a 25-minute focus session immediately with zero sign-up, email verification, login wall, or paid subscription required to use the tool."
      },
      {
        q: "Who is the Pomodoro Timer most useful for?",
        a: "It works well for studying, essay writing, coding sprints, and clearing repetitive inbox tasks—any work where breaking a large goal into 25-minute intervals makes starting and staying focused much easier."
      },
      {
        q: "Can I pair the Pomodoro timer with a task list?",
        a: "Yes. Many people list their top three priorities in the Stiknex To-Do List or Sticky Notes first, then dedicate one or two 25-minute Pomodoro sprints to finishing each specific task."
      }
    ],
    relatedTools: [
      { path: "/to-do-list", label: "To-Do List" },
      { path: "/sticky-notes", label: "Sticky Notes" },
      { path: "/online-notebook", label: "Online Notebook" }
    ]
  },

  "/to-do-list": {
    answerHeading: "What is the Stiknex To-Do List?",
    answerFirst: `The Stiknex To-Do List is a free, browser-based task checklist that lets you add tasks, check off completed items, track a live completion percentage bar, and export your list as Markdown with no login or sign-up required. Everything runs locally in your browser without server round-trips or account setup.

Type a task and press Enter or click Add to append it to your checklist, click any item to toggle strikethrough completion, or remove finished items with the delete button. A progress bar at the top updates automatically to show how many tasks are done out of your total list, and you can copy the entire list in Markdown format (- [x] / - [ ]) in one click.

It is useful for daily work checklists, study assignments, sprint planning, grocery or packing lists, and breaking larger tasks into small, concrete actionable steps you can finish, check off, and export directly into your notes.`,
    faqs: [
      {
        q: "How do I export or save my to-do list?",
        a: "Click Copy as Markdown at the top of the checklist to copy every task in standard - [x] and - [ ] Markdown format. You can paste that checklist directly into Stiknex Online Notebook or any Markdown editor."
      },
      {
        q: "Do I need to sign in to manage my tasks?",
        a: "No. There is no login wall, email signup, or account requirement—you can start adding, checking off, and deleting your daily tasks right away as soon as the page opens in your browser."
      },
      {
        q: "Does the to-do list show task completion progress?",
        a: "Yes. As you check off items, the progress header calculates your completed task count and percentage automatically and updates the visual progress bar so you can see how much remains."
      },
      {
        q: "When should I use To-Do List vs Sticky Notes?",
        a: "Use To-Do List for a structured, linear checklist with a completion progress bar and Markdown export, and use Sticky Notes when you want a freeform visual board with persistent local storage and QR sync."
      }
    ],
    relatedTools: [
      { path: "/pomodoro-timer", label: "Pomodoro Timer" },
      { path: "/sticky-notes", label: "Sticky Notes" },
      { path: "/online-notebook", label: "Online Notebook" }
    ]
  },

  "/sticky-notes": {
    answerHeading: "What is Stiknex Online Sticky Notes?",
    answerFirst: `Stiknex Online Sticky Notes is a free digital sticky notes board that runs in your browser with no login, works offline, and lets you sync your sticky notes between phone and PC by scanning a QR code with client-side AES-256-GCM end-to-end encryption.

Create color-coded notes on an interactive canvas, drag and arrange ideas freely, and edit checklists or quick reminders—all auto-saved locally in your browser without waiting for a server. When you want your board on another device, open Sync, scan the single-use QR code, and your encrypted sticky notes sync without creating an account or typing a password. You can also export or back up your notes locally anytime you want an extra copy.

It is ideal for visual brainstorming, daily desk reminders, study boards, project planning, and keeping quick thoughts synced between your laptop and phone without relying on cloud accounts, emails, passwords, or any third-party logins at all.`,
    faqs: [
      {
        q: "Can I sync notes without logging in?",
        a: "Yes. Stiknex generates a local sync identity automatically with no account, email, or password. Open the sync modal on your first device, scan the QR code from your second device, and your sticky notes sync directly."
      },
      {
        q: "Is my synced data encrypted?",
        a: "Yes. Before leaving your browser, synced notes are encrypted client-side using Web Crypto AES-256-GCM with random 96-bit nonces. Only devices holding your sync key can decrypt and read your sticky notes."
      },
      {
        q: "Do online sticky notes work offline?",
        a: "Yes. All notes, colors, and board positions are saved locally in your browser so you can view and edit sticky notes offline, and sync updates automatically when your device reconnects."
      },
      {
        q: "What happens during QR pairing between phone and PC?",
        a: "The QR code transfers your sync credentials over a single-use ephemeral AES-GCM pairing session that expires automatically, linking your phone and PC without typing long keys or logging into an account."
      }
    ],
    relatedTools: [
      { path: "/online-notebook", label: "Online Notebook" },
      { path: "/to-do-list", label: "To-Do List" },
      { path: "/pomodoro-timer", label: "Pomodoro Timer" }
    ]
  },

  "/online-notebook": {
    answerHeading: "What is Stiknex Online Notebook & Notepad?",
    answerFirst: `Stiknex Online Notebook is a free browser-based lined-paper notepad and code editor that requires no login, works offline, and syncs notebooks across devices by scanning a QR code with client-side AES-256-GCM end-to-end encryption.

Start typing notes, lists, or formatted documents immediately—every keystroke saves locally in your browser's storage and IndexedDB without waiting for a server. You can create multiple notebooks, switch into the built-in code editor to format or run HTML and JavaScript snippets, and optionally pair your phone or second computer via a single-use QR code without creating an account, entering an email address, or remembering a password.

It is built for distraction-free writing, meeting notes, offline travel journaling, study outlines, and quick code snippets that stay private on your device unless you explicitly choose to sync them across your paired devices. You can also export, copy, or organize your notes anytime without any login or account restrictions whatsoever.`,
    faqs: [
      {
        q: "Can I sync notebooks without logging in?",
        a: "Yes. You never need an email or password. Enable sync to generate a local sync identity, then scan the QR code on another device to pair and sync your notebooks without creating an account."
      },
      {
        q: "Is my synced notebook data encrypted?",
        a: "Yes. Synced notebooks are encrypted client-side in your browser using 256-bit AES-GCM (Web Crypto API) before transmission, so only your paired devices with the sync key can read the content."
      },
      {
        q: "Does the online notebook work offline?",
        a: "Yes. Notes are stored locally in browser storage and IndexedDB, allowing you to open, write, and organize notebooks offline and reconcile changes automatically when your device is back online again."
      },
      {
        q: "Can I use it as both a plain notepad and a code editor?",
        a: "Yes. Stiknex combines a lined-paper rich-text notepad with an in-browser code editor supporting syntax highlighting and HTML/JS execution, all saved locally in your browser with zero account sign-up needed here."
      }
    ],
    relatedTools: [
      { path: "/sticky-notes", label: "Sticky Notes" },
      { path: "/word-counter", label: "Word Counter" },
      { path: "/json-formatter", label: "JSON Formatter" }
    ]
  }
};
