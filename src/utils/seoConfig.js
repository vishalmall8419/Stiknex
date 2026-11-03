import { ALL_TOOLS } from "../data/toolsRegistry.js";

// Centralized SEO Configuration for Stiknex
// Supports Phase 2, Phase 3, Phase 4, Phase 6, Phase 10, Phase 12

export const SITE_URL = "https://stiknex.site";
export const BASE_URL = SITE_URL;

export const seoConfig = {
  "/about": {
  "path": "/about",
  "canonical": "https://stiknex.site/about",
  "title": "About Stiknex – Free Local-First Productivity Platform | Stiknex",
  "h1": "About Stiknex & Creator Vishal Mall",
  "description": "Learn about Stiknex, built by Vishal Mall. Our mission is to provide fast, privacy-first, ad-light productivity tools and infinite canvas editors for everyone.",
  "primaryIntent": "about stiknex / vishal mall",
  "secondaryIntents": [
    "who built stiknex",
    "local-first productivity software"
  ],
  "keywords": "about stiknex, vishal mall, local first productivity, privacy friendly tools, free software",
  "schemaType": "AboutPage",
  "cluster": "Platform",
  "relatedTools": [
    "/tools",
    "/privacy-policy",
    "/contact"
  ],
  "faqs": [
    {
      "q": "Why was Stiknex built?",
      "a": "Stiknex was engineered to replace bloated, ad-heavy tool websites with clean, fast, local-first browser applications that respect user privacy."
    }
  ]
},

  "/blog": {
  "path": "/blog",
  "canonical": "https://stiknex.site/blog",
  "title": "Productivity & Tech Blog – Guides, Tutorials & Benchmarks | Stiknex",
  "h1": "Stiknex Productivity & Tech Blog",
  "description": "In-depth engineering tutorials, typing speed benchmarks, productivity workflows, and practical guides for developers, students, and writers.",
  "primaryIntent": "productivity blog / tech guides",
  "secondaryIntents": [
    "typing speed benchmarks",
    "developer tutorials",
    "productivity tools guides"
  ],
  "keywords": "productivity blog, tech blog, typing benchmarks, engineering guides, utility tutorials",
  "schemaType": "Blog",
  "cluster": "Content",
  "relatedTools": [
    "/tools",
    "/typing-speed-test",
    "/online-notebook"
  ],
  "faqs": [
    {
      "q": "Who writes the Stiknex blog articles?",
      "a": "Articles are authored by software engineers and technical contributors, providing actionable advice grounded in working tools and verifiable data."
    }
  ]
},

  "/tools": {
  "path": "/tools",
  "canonical": "https://stiknex.site/tools",
  "title": "Free Online Tools Directory (200+ Utilities) – Stiknex",
  "h1": "200+ Free Online Browser Utilities",
  "description": "Explore 200+ free online utility tools across 9 streamlined categories. Calculators, converters, developer tools, formatters, and typing lab.",
  "primaryIntent": "free online tools / web utilities directory",
  "secondaryIntents": [
    "browser utilities online",
    "online tools directory",
    "developer tools free",
    "calculator tools online"
  ],
  "keywords": "free online tools, web utilities, online calculators, unit converters, developer tools, typing test, free productivity tools",
  "schemaType": "WebApplication",
  "cluster": "Directory Hub",
  "relatedTools": [
    "/sticky-notes",
    "/online-notebook",
    "/whiteboard"
  ],
  "faqs": [
    {
      "q": "Are all tools on Stiknex free?",
      "a": "Yes, all 201 tools are 100% free forever with no account signups, subscriptions, or usage limits."
    },
    {
      "q": "How is user privacy protected?",
      "a": "All utilities run client-side in your browser's local sandbox memory. No file contents, inputs, or calculations are sent to external servers."
    }
  ]
},

  "/whiteboard": {
  "path": "/whiteboard",
  "canonical": "https://stiknex.site/whiteboard",
  "title": "Free Online Whiteboard – Infinite Drawing Canvas & Shapes | Stiknex",
  "h1": "Free Online Interactive Whiteboard Canvas",
  "description": "Collaborative infinite whiteboard powered by Excalidraw. Sketch diagrams, wireframes, flowcharts, and mind maps with vector shapes and image export.",
  "primaryIntent": "online whiteboard / free whiteboard canvas",
  "secondaryIntents": [
    "excalidraw whiteboard online",
    "free online whiteboard no sign up",
    "sketching whiteboard online",
    "diagram canvas"
  ],
  "keywords": "online whiteboard, free whiteboard, infinite canvas, excalidraw online, digital whiteboard, sketch whiteboard, draw online",
  "schemaType": "WebApplication",
  "cluster": "Notes & Planning",
  "relatedTools": [
    "/sticky-notes",
    "/online-notebook",
    "/tools"
  ],
  "faqs": [
    {
      "q": "Is the whiteboard completely free?",
      "a": "Yes, Stiknex Whiteboard is 100% free with unlimited canvases, drawing tools, and export formats."
    },
    {
      "q": "Can I export my whiteboard drawings?",
      "a": "Yes, you can export your drawings as high-resolution PNG, SVG, or JSON project files with transparent background options."
    }
  ]
},

  "/to-do-list": {
  "path": "/to-do-list",
  "canonical": "https://stiknex.site/to-do-list",
  "title": "To-Do List Online – Daily Tasks, Checklists & Priorities | Stiknex",
  "h1": "Free Online To-Do List & Task Manager",
  "description": "Organize your daily workflow with an intuitive task checklist. Drag-and-drop priorities, strike-through completion, and auto-saving local storage.",
  "primaryIntent": "to do list online / daily task checklist",
  "secondaryIntents": [
    "online checklist maker",
    "free task manager",
    "daily planner checklist",
    "browser to-do list"
  ],
  "keywords": "to-do list, online to-do list, task manager, checklist maker, daily task list, priority to do list, task checklist",
  "schemaType": "WebApplication",
  "cluster": "Notes & Planning",
  "relatedTools": [
    "/pomodoro-timer",
    "/sticky-notes",
    "/online-notebook"
  ],
  "faqs": [
    {
      "q": "Do I need an account to save my tasks?",
      "a": "No. Tasks are stored directly in your browser's persistent storage, ready whenever you return."
    },
    {
      "q": "Can I organize tasks by priority?",
      "a": "Yes, you can tag items with high, medium, or low priority badges to focus on high-impact objectives first."
    }
  ]
},

  "/typing-practice-lessons": {
  "path": "/typing-practice-lessons",
  "canonical": "https://stiknex.site/typing-practice-lessons",
  "title": "Typing Practice Lessons – Master Touch Typing & Home Row | Stiknex",
  "h1": "Free Online Touch Typing Lessons & Practice",
  "description": "Learn touch typing step-by-step. Interactive home-row (ASDF JKL;), top-row, and bottom-row finger placement exercises to build speed without looking.",
  "primaryIntent": "typing practice lessons / learn touch typing",
  "secondaryIntents": [
    "home row typing practice",
    "touch typing tutor",
    "typing exercises for beginners"
  ],
  "keywords": "typing practice, typing lessons, touch typing, home row practice, learn typing, typing practice online, keyboard finger placement",
  "schemaType": "WebApplication",
  "cluster": "Typing & Keyboard",
  "relatedTools": [
    "/typing-speed-test",
    "/typing-lab",
    "/word-counter"
  ],
  "faqs": [
    {
      "q": "What is touch typing?",
      "a": "Touch typing is typing without looking at the keyboard, relying on muscle memory and resting your fingers on the anchor home row keys (F and J)."
    },
    {
      "q": "How long does it take to improve typing speed?",
      "a": "Practicing for 15 minutes daily typically produces noticeable speed and accuracy improvements within two to three weeks."
    }
  ]
},

  "/pomodoro-timer": {
  "path": "/pomodoro-timer",
  "canonical": "https://stiknex.site/pomodoro-timer",
  "title": "Pomodoro Timer – 25/5 Focus & Study Productivity Timer | Stiknex",
  "h1": "Free Online Pomodoro Focus Timer",
  "description": "Boost focus and prevent burnout with the Pomodoro technique. 25-minute work intervals, 5-minute short breaks, audio notifications, and task tracker.",
  "primaryIntent": "pomodoro timer / study timer online",
  "secondaryIntents": [
    "25 5 timer",
    "pomodoro technique timer",
    "productivity timer online",
    "focus timer"
  ],
  "keywords": "pomodoro timer, study timer, 25 minute timer, pomodoro technique, focus timer, productivity timer, work break timer",
  "schemaType": "WebApplication",
  "cluster": "Notes & Planning",
  "relatedTools": [
    "/to-do-list",
    "/online-notebook",
    "/stopwatch"
  ],
  "faqs": [
    {
      "q": "What is the standard Pomodoro Technique interval?",
      "a": "The traditional rhythm consists of 25 minutes of deep focus followed by a 5-minute break. After completing four cycles (Pomodoros), take a longer 15–30 minute break."
    },
    {
      "q": "Does the timer run if I switch tabs?",
      "a": "Yes, browser background timers keep running, and an audio bell alerts you when a session ends."
    }
  ]
},

  "/json-formatter": {
  "path": "/json-formatter",
  "canonical": "https://stiknex.site/json-formatter",
  "title": "JSON Formatter & Validator – Beautify, Minify & Fix JSON | Stiknex",
  "h1": "Free Online JSON Formatter & Validator",
  "description": "Format, beautify, validate, and minify JSON code online. Instant syntax error detection with line numbers, tree view, and 100% private browser parsing.",
  "primaryIntent": "json formatter / json validator",
  "secondaryIntents": [
    "beautify json online",
    "json syntax checker",
    "minify json",
    "json parser online"
  ],
  "keywords": "json formatter, json validator, beautify json, json beautifier, format json online, json parser, minify json",
  "schemaType": "WebApplication",
  "cluster": "Developer Tools",
  "relatedTools": [
    "/json-validator",
    "/json-to-csv",
    "/base64-encode-decode"
  ],
  "faqs": [
    {
      "q": "Does this JSON tool upload my data to a server?",
      "a": "No. Unlike other online formatters, Stiknex parses JSON entirely client-side using browser JavaScript engines. Confidential APIs and tokens stay safe."
    },
    {
      "q": "How do I fix common JSON syntax errors?",
      "a": "Common issues include unquoted keys, trailing commas in objects or arrays, single quotes instead of double quotes, and unescaped special characters."
    }
  ]
},

  "/case-converter": {
  "path": "/case-converter",
  "canonical": "https://stiknex.site/case-converter",
  "title": "Case Converter – Uppercase, Lowercase, Title Case, CamelCase | Stiknex",
  "h1": "Free Online Text Case Converter",
  "description": "Convert text case instantly: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case for writers and developers.",
  "primaryIntent": "case converter / text case converter",
  "secondaryIntents": [
    "uppercase to lowercase converter",
    "title case converter",
    "camelcase converter",
    "snake case to camelcase"
  ],
  "keywords": "case converter, uppercase to lowercase, title case, sentence case, camelCase, snake_case, kebab-case, convert text case",
  "schemaType": "WebApplication",
  "cluster": "Writing & Text",
  "relatedTools": [
    "/word-counter",
    "/character-counter",
    "/remove-extra-spaces"
  ],
  "faqs": [
    {
      "q": "What is the difference between camelCase and PascalCase?",
      "a": "camelCase starts with a lowercase letter and capitalizes subsequent words (e.g. `myVariableName`), while PascalCase capitalizes all words (e.g. `MyClassName`)."
    },
    {
      "q": "Can I copy the converted text with one click?",
      "a": "Yes, simply click the copy button to transfer the formatted output directly to your clipboard."
    }
  ]
},

  "/password-generator": {
  "path": "/password-generator",
  "canonical": "https://stiknex.site/password-generator",
  "title": "Password Generator – Secure Random Passwords & Entropy | Stiknex",
  "h1": "Free Secure Random Password Generator",
  "description": "Generate cryptographically secure random passwords using Web Crypto API. Customize length, uppercase, lowercase, numbers, symbols, and view entropy bits.",
  "primaryIntent": "password generator / secure password generator",
  "secondaryIntents": [
    "strong password generator",
    "random password maker",
    "password entropy calculator"
  ],
  "keywords": "password generator, secure password generator, random password, strong password, password maker, password security",
  "schemaType": "WebApplication",
  "cluster": "Security & Generators",
  "relatedTools": [
    "/qr-code-generator",
    "/uuid-generator",
    "/sha256-hash-generator"
  ],
  "faqs": [
    {
      "q": "How are passwords generated securely in my browser?",
      "a": "Stiknex uses `window.crypto.getRandomValues()`, a cryptographically secure pseudorandom number generator (CSPRNG) running natively on your hardware."
    },
    {
      "q": "Does Stiknex see or store generated passwords?",
      "a": "Never. Passwords are generated strictly in your device's RAM and never transmitted across the network or stored in any database."
    }
  ]
},

  "/qr-code-generator": {
  "path": "/qr-code-generator",
  "canonical": "https://stiknex.site/qr-code-generator",
  "title": "QR Code Generator – Free Custom High-Res QR Codes | Stiknex",
  "h1": "Free Online QR Code Generator",
  "description": "Create custom high-resolution QR codes for websites, plain text, Wi-Fi networks, emails, and vCards. Instant client-side PNG and SVG downloads.",
  "primaryIntent": "qr code generator / create qr code",
  "secondaryIntents": [
    "free qr code creator",
    "custom qr code maker",
    "qr code with logo",
    "wifi qr code"
  ],
  "keywords": "qr code generator, create qr code, free qr code maker, qr generator, custom qr code, high resolution qr code",
  "schemaType": "WebApplication",
  "cluster": "Security & Generators",
  "relatedTools": [
    "/password-generator",
    "/url-shortener",
    "/color-picker"
  ],
  "faqs": [
    {
      "q": "Do Stiknex QR codes expire?",
      "a": "No. The generated static QR codes encode your data directly into the pixel matrix. They never expire and contain zero redirects."
    },
    {
      "q": "Can I customize QR code colors?",
      "a": "Yes, you can adjust both foreground and background colors to match your brand styling."
    }
  ]
},

  "/unit-converter": {
  "path": "/unit-converter",
  "canonical": "https://stiknex.site/unit-converter",
  "title": "Unit Converter – Universal Metric & Imperial Conversions | Stiknex",
  "h1": "Free Universal Online Unit Converter",
  "description": "Universal converter for length, mass, volume, temperature, area, speed, pressure, and energy. Convert between Metric (SI) and US Imperial units accurately.",
  "primaryIntent": "unit converter / metric to imperial",
  "secondaryIntents": [
    "universal unit conversion",
    "measurement converter",
    "length converter",
    "weight converter"
  ],
  "keywords": "unit converter, measurement converter, metric to imperial, conversion calculator, convert units, length weight volume",
  "schemaType": "WebApplication",
  "cluster": "Converters",
  "relatedTools": [
    "/length-converter",
    "/weight-converter",
    "/temperature-converter",
    "/data-converter"
  ],
  "faqs": [
    {
      "q": "Which measurement standards are supported?",
      "a": "Both the International System of Units (SI Metric) and the US Customary / Imperial measurement standards are fully supported."
    },
    {
      "q": "Can I convert compound units like km/h to mph?",
      "a": "Yes! Stiknex covers speed, pressure, density, energy, power, and fuel economy conversions."
    }
  ]
},

  "/currency-converter": {
  "path": "/currency-converter",
  "canonical": "https://stiknex.site/currency-converter",
  "title": "Currency Converter – Live Forex Rates & Currency Exchange | Stiknex",
  "h1": "Free Live Currency Converter & Exchange Rates",
  "description": "Convert 150+ world currencies with up-to-date foreign exchange rates. Convert USD, EUR, INR, GBP, CAD, AUD, JPY and more with exact precision.",
  "primaryIntent": "currency converter / forex rates",
  "secondaryIntents": [
    "live currency exchange",
    "usd to inr converter",
    "eur to usd",
    "money converter online"
  ],
  "keywords": "currency converter, exchange rate calculator, live currency rates, money converter, forex converter, usd to inr, eur to usd",
  "schemaType": "WebApplication",
  "cluster": "Converters",
  "relatedTools": [
    "/unit-converter",
    "/simple-calculator",
    "/date-calculator"
  ],
  "faqs": [
    {
      "q": "How frequently are exchange rates updated?",
      "a": "Exchange rates are refreshed periodically from international financial forex feeds and cached for rapid, low-latency conversion."
    },
    {
      "q": "Is currency conversion private?",
      "a": "Yes, currency lookups run locally in your browser session without storing your transaction amounts or personal data."
    }
  ]
},

  "/sip-calculator": {
  "path": "/sip-calculator",
  "canonical": "https://stiknex.site/sip-calculator",
  "title": "SIP Calculator – Calculate Mutual Fund Returns & Wealth | Stiknex",
  "h1": "Free Online SIP Calculator (Mutual Funds & Wealth)",
  "description": "Calculate future value of Systematic Investment Plans (SIP) in mutual funds. Compounded monthly investment returns, wealth gain, and growth visualizer.",
  "primaryIntent": "sip calculator / mutual fund sip returns",
  "secondaryIntents": [
    "systematic investment plan calculator",
    "mutual fund return calculator",
    "monthly sip wealth calculator"
  ],
  "keywords": "sip calculator, mutual fund calculator, sip returns, systematic investment plan, wealth calculator, investment growth",
  "schemaType": "WebApplication",
  "cluster": "Calculators",
  "relatedTools": [
    "/emi-calculator",
    "/compound-interest-calculator",
    "/percentage-calculator"
  ],
  "faqs": [
    {
      "q": "How does a Systematic Investment Plan (SIP) work?",
      "a": "A SIP allows you to invest a fixed sum periodically (monthly or quarterly) into mutual funds, leveraging rupee cost averaging and compounding interest over time."
    },
    {
      "q": "Are SIP returns guaranteed?",
      "a": "No. Mutual fund investments are subject to market risks. SIP calculators project wealth based on an assumed expected annual rate of return."
    }
  ]
},

  "/emi-calculator": {
  "path": "/emi-calculator",
  "canonical": "https://stiknex.site/emi-calculator",
  "title": "EMI Calculator – Calculate Loan EMI, Interest & Total Payoff | Stiknex",
  "h1": "Free Online EMI Calculator (Loan & Interest)",
  "description": "Calculate Equated Monthly Installments (EMI) for home loans, car loans, and personal loans. Amortization schedule, total interest breakdown in ₹ / $.",
  "primaryIntent": "emi calculator / loan emi calculator",
  "secondaryIntents": [
    "home loan emi calculator",
    "car loan emi",
    "personal loan emi calculator",
    "monthly emi calculation"
  ],
  "keywords": "emi calculator, loan emi calculator, home loan emi, personal loan emi, emi calculation formula, loan interest calculator",
  "schemaType": "WebApplication",
  "cluster": "Calculators",
  "relatedTools": [
    "/sip-calculator",
    "/compound-interest-calculator",
    "/simple-calculator"
  ],
  "faqs": [
    {
      "q": "What is the mathematical formula for EMI calculation?",
      "a": "EMI = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is principal loan amount, r is monthly interest rate (annual rate / 12 / 100), and n is total months."
    },
    {
      "q": "How do loan prepayments affect total EMI interest?",
      "a": "Prepaying principal early drastically reduces the remaining balance, cutting total tenure and compound interest charges significantly."
    }
  ]
},

  "/age-calculator": {
  "path": "/age-calculator",
  "canonical": "https://stiknex.site/age-calculator",
  "title": "Age Calculator – Exact Age in Years, Months, Days | Stiknex",
  "h1": "Free Online Age Calculator",
  "description": "Calculate your exact age down to the day, hours, and minutes from your date of birth. View total days lived, leap years passed, and next birthday countdown.",
  "primaryIntent": "age calculator / calculate my age",
  "secondaryIntents": [
    "exact age calculator",
    "date of birth calculator",
    "how old am i calculator"
  ],
  "keywords": "age calculator, calculate age, date of birth calculator, how old am i, birthday countdown, exact age in days",
  "schemaType": "WebApplication",
  "cluster": "Calculators",
  "relatedTools": [
    "/date-calculator",
    "/time-calculator",
    "/simple-calculator"
  ],
  "faqs": [
    {
      "q": "Does the age calculator account for leap years?",
      "a": "Yes, the algorithm accurately accounts for leap years (366 days) and varying month lengths (28, 29, 30, and 31 days)."
    },
    {
      "q": "Can I calculate age between two arbitrary historical dates?",
      "a": "Yes, you can choose any start date and end date to determine the exact time elapsed between two moments in history."
    }
  ]
},

  "/percentage-calculator": {
  "path": "/percentage-calculator",
  "canonical": "https://stiknex.site/percentage-calculator",
  "title": "Percentage Calculator – Fast Percentage Increases & Diffs | Stiknex",
  "h1": "Free Online Percentage Calculator",
  "description": "Calculate percentage increases, percentage decreases, differences, discounts, and fractions instantly. Step-by-step formulas and practical math examples.",
  "primaryIntent": "percentage calculator",
  "secondaryIntents": [
    "calculate percentage increase",
    "percent difference calculator",
    "percentage discount calculator"
  ],
  "keywords": "percentage calculator, percent calculator, percentage increase, percent difference, calculate percentage, discount calculator",
  "schemaType": "WebApplication",
  "cluster": "Calculators",
  "relatedTools": [
    "/simple-calculator",
    "/fraction-calculator",
    "/ratio-calculator"
  ],
  "faqs": [
    {
      "q": "How do you calculate a percentage increase?",
      "a": "Percentage increase = ((New Value - Original Value) / Original Value) * 100. For example, from 50 to 75 is ((75 - 50) / 50) * 100 = 50% increase."
    },
    {
      "q": "How do you find what percentage X is of Y?",
      "a": "Divide X by Y and multiply by 100: (X / Y) * 100. For example, 25 of 200 is (25 / 200) * 100 = 12.5%."
    }
  ]
},

  "/scientific-calculator": {
  "path": "/scientific-calculator",
  "canonical": "https://stiknex.site/scientific-calculator",
  "title": "Scientific Calculator Online – Trig, Log & Powers | Stiknex",
  "h1": "Free Online Scientific Calculator",
  "description": "Advanced scientific calculator in your browser. Calculate trigonometry (sin, cos, tan), logarithms, square roots, exponents, factorials, and constants.",
  "primaryIntent": "scientific calculator online",
  "secondaryIntents": [
    "advanced scientific calculator",
    "trigonometry calculator",
    "log calculator online"
  ],
  "keywords": "scientific calculator, online scientific calculator, trig calculator, log calculator, math calculator, exponents, square root",
  "schemaType": "WebApplication",
  "cluster": "Calculators",
  "relatedTools": [
    "/simple-calculator",
    "/fraction-calculator",
    "/percentage-calculator"
  ],
  "faqs": [
    {
      "q": "Does the calculator support degrees and radians?",
      "a": "Yes, you can toggle between Degree (DEG) and Radian (RAD) modes for all trigonometric functions with a single click."
    },
    {
      "q": "Which mathematical constants are supported?",
      "a": "Euler's constant (e = 2.71828...) and Pi (π = 3.14159...) are built directly into the keyboard layout."
    }
  ]
},

  "/simple-calculator": {
  "path": "/simple-calculator",
  "canonical": "https://stiknex.site/simple-calculator",
  "title": "Simple Online Calculator – Fast Arithmetic & Keyboard Math | Stiknex",
  "h1": "Free Simple Online Calculator",
  "description": "Fast, clean online basic calculator for everyday addition, subtraction, multiplication, and division. Full keyboard input support and calculation history.",
  "primaryIntent": "simple calculator / basic calculator online",
  "secondaryIntents": [
    "free online calculator",
    "arithmetic calculator",
    "simple math calculator",
    "easy calculator"
  ],
  "keywords": "simple calculator, basic calculator, online calculator, arithmetic calculator, math calculator, simple online calculator",
  "schemaType": "WebApplication",
  "cluster": "Calculators",
  "relatedTools": [
    "/scientific-calculator",
    "/percentage-calculator",
    "/fraction-calculator"
  ],
  "faqs": [
    {
      "q": "Can I use my physical keyboard to enter numbers?",
      "a": "Yes! You can use the standard number keys or numpad, Enter for equals (=), Backspace to delete digits, and Escape (Esc) to clear."
    },
    {
      "q": "Does the calculator follow standard order of operations?",
      "a": "Yes, operations follow standard mathematical precedence (BODMAS / PEMDAS), resolving multiplication and division before addition and subtraction."
    }
  ]
},

  "/character-counter": {
  "path": "/character-counter",
  "canonical": "https://stiknex.site/character-counter",
  "title": "Character Counter – Letter, Space & Social Post Limits | Stiknex",
  "h1": "Free Online Character Counter & Limit Checker",
  "description": "Count characters with and without spaces, words, and verify social media limits for Twitter/X (280), LinkedIn, Instagram, and SEO meta descriptions.",
  "primaryIntent": "character counter / letter counter",
  "secondaryIntents": [
    "character count with spaces",
    "twitter character limit checker",
    "character count without spaces"
  ],
  "keywords": "character counter, count characters, letter counter, character limit checker, twitter 280 checker, meta description length",
  "schemaType": "WebApplication",
  "cluster": "Writing & Text",
  "relatedTools": [
    "/word-counter",
    "/reading-time-calculator",
    "/case-converter"
  ],
  "faqs": [
    {
      "q": "What are the common social media character limits?",
      "a": "Twitter/X allows 280 characters; SEO meta descriptions perform best between 150-160 characters; LinkedIn posts permit 3,000 characters; Instagram captions allow up to 2,200 characters."
    },
    {
      "q": "What is the difference between characters with and without spaces?",
      "a": "Characters with spaces counts every keystroke including whitespace, line breaks, and tabs. Characters without spaces isolates only letters, digits, and punctuation symbols."
    }
  ]
},

  "/word-counter": {
  "path": "/word-counter",
  "canonical": "https://stiknex.site/word-counter",
  "title": "Word Counter Online – Real-Time Word & Character Count | Stiknex",
  "h1": "Free Online Word & Character Counter",
  "description": "Count words, characters, sentences, paragraphs, and calculate reading time in real time. Accurate text statistics, case conversion, and readability metrics.",
  "primaryIntent": "word counter / online word counter",
  "secondaryIntents": [
    "count words online",
    "character count tool",
    "essay word counter",
    "reading time calculator"
  ],
  "keywords": "word counter, online word counter, count words, word count tool, character counter, paragraph counter, reading time estimator",
  "schemaType": "WebApplication",
  "cluster": "Writing & Text",
  "relatedTools": [
    "/character-counter",
    "/reading-time-calculator",
    "/case-converter"
  ],
  "faqs": [
    {
      "q": "Does the word counter count hyphenated words and numbers?",
      "a": "Yes, hyphenated words (e.g., state-of-the-art) count as single words, while alphanumeric sequences are counted according to standard linguistic rules."
    },
    {
      "q": "How is estimated reading time calculated?",
      "a": "Reading time is calculated at an average reading pace of 200 words per minute, and speaking time at approximately 130 words per minute."
    },
    {
      "q": "Is my text sent to a remote server?",
      "a": "No. All text parsing runs client-side in your browser's memory using JavaScript String APIs. Your text is never uploaded or logged."
    }
  ]
},

  "/typing-speed-test": {
  "path": "/typing-speed-test",
  "canonical": "https://stiknex.site/typing-speed-test",
  "title": "Typing Speed Test – Free WPM Test & Accuracy Check | Stiknex",
  "h1": "Free Online Typing Speed Test (WPM)",
  "description": "Test your typing speed (WPM) and accuracy with 1-minute, 2-minute, and 5-minute timed challenges. Real-time error tracking and speed benchmarks.",
  "primaryIntent": "typing speed test / wpm test",
  "secondaryIntents": [
    "typing test online",
    "test my typing speed",
    "words per minute test",
    "free typing speed test"
  ],
  "keywords": "typing speed test, typing test online, wpm test, words per minute, typing accuracy test, 1 minute typing test, 5 minute typing test",
  "schemaType": "WebApplication",
  "cluster": "Typing & Keyboard",
  "relatedTools": [
    "/typing-practice-lessons",
    "/word-counter",
    "/online-notebook"
  ],
  "faqs": [
    {
      "q": "How is typing speed (WPM) calculated?",
      "a": "WPM (Words Per Minute) is calculated using the international standard formula: (Total Characters Typed / 5) divided by time in minutes, adjusted for uncorrected errors."
    },
    {
      "q": "What is considered a good typing speed?",
      "a": "The average typing speed is roughly 40 WPM. Professional typists, programmers, and transcriptionists typically average between 65 and 90+ WPM."
    },
    {
      "q": "Which test duration should I choose?",
      "a": "A 1-minute test offers a quick speed snapshot. For true endurance and real-world typing accuracy benchmarks, 2-minute or 5-minute tests are recommended."
    }
  ]
},

  "/online-notebook": {
  "path": "/online-notebook",
  "canonical": "https://stiknex.site/online-notebook",
  "title": "Online Notepad – Free, No Sign-Up Digital Notebook | Stiknex",
  "h1": "Free Online Notepad & Digital Notebook",
  "description": "Distraction-free online notepad and digital lined paper notebook. Format headings, lists, code snippets, and auto-save notes locally with zero sign-up.",
  "primaryIntent": "online notepad / digital notepad",
  "secondaryIntents": [
    "notepad online free",
    "free online notebook",
    "browser notepad no signup",
    "digital notepad for students"
  ],
  "keywords": "online notepad, digital notepad, online notebook, free online notepad, browser text editor, note taking online, lined paper notebook",
  "schemaType": "WebApplication",
  "cluster": "Notes & Planning",
  "relatedTools": [
    "/sticky-notes",
    "/word-counter",
    "/to-do-list"
  ],
  "faqs": [
    {
      "q": "Is this online notepad free to use without signing in?",
      "a": "Yes, Stiknex Online Notebook is 100% free with zero registration, accounts, or subscription walls required."
    },
    {
      "q": "Where are my notebook notes saved?",
      "a": "Your notes are saved in your browser's secure IndexedDB and localStorage cache. They persist across browser restarts and tab closures."
    },
    {
      "q": "How does this compare to Windows Notepad or desktop apps?",
      "a": "Stiknex runs inside any web browser on desktop, tablet, or phone, offering lined paper aesthetics, rich formatting, word count, and optional multi-device sync."
    }
  ]
},

  "/sticky-notes": {
  "path": "/sticky-notes",
  "canonical": "https://stiknex.site/sticky-notes",
  "title": "Online Sticky Notes – Free Infinite Idea Canvas | Stiknex",
  "h1": "Free Online Sticky Notes & Brainstorming Canvas",
  "description": "Create, color-code, and organize infinite digital sticky notes in your browser. Markdown formatting, drag-and-drop, and private zero-knowledge encryption.",
  "primaryIntent": "online sticky notes / digital sticky notes",
  "secondaryIntents": [
    "sticky notes canvas",
    "free sticky notes app",
    "virtual sticky notes board",
    "desktop sticky notes alternative"
  ],
  "keywords": "online sticky notes, digital sticky notes, free sticky notes app, virtual sticky notes, note board online, brainstorm sticky notes",
  "schemaType": "WebApplication",
  "cluster": "Notes & Planning",
  "relatedTools": [
    "/online-notebook",
    "/whiteboard",
    "/to-do-list"
  ],
  "faqs": [
    {
      "q": "How do online sticky notes work?",
      "a": "Stiknex provides an infinite draggable board where you can add, edit, and organize color-coded notes. Notes auto-save to your browser's local memory instantly."
    },
    {
      "q": "Are my sticky notes private?",
      "a": "Yes. Stiknex processes your notes 100% client-side. When using cloud sync, data is end-to-end encrypted with AES-256-GCM so only you hold the keys."
    },
    {
      "q": "Can I export or back up my notes?",
      "a": "Yes, you can copy notes, download text backups, or synchronize them seamlessly across your desktop and mobile devices."
    }
  ]
},

    "/data-converter": {
  "path": "/data-converter",
  "canonical": "https://stiknex.site/data-converter",
  "title": "Data Storage Converter – Bytes, KB, MB, GB, TB, PB | Stiknex",
  "h1": "Free Online Data Storage Converter",
  "description": "Convert digital storage units between bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes in decimal (1000) and binary (1024) standards instantly.",
  "primaryIntent": "data storage converter / bytes to mb gb",
  "secondaryIntents": [
    "binary storage calculator",
    "mb to gb converter",
    "tb to gb converter",
    "bytes to megabytes"
  ],
  "keywords": "data converter, data storage converter, bytes to mb, mb to gb, gb to tb, binary storage calculator, bits and bytes converter",
  "schemaType": "WebApplication",
  "cluster": "Converters",
  "relatedTools": [
    "/unit-converter",
    "/developer",
    "/text-to-binary"
  ],
  "faqs": [
    {
      "q": "What is the difference between binary (1024) and decimal (1000) storage?",
      "a": "Operating systems like Windows measure data in binary (1024 bytes = 1 KiB), while drive manufacturers use decimal (1000 bytes = 1 KB), explaining why a 1TB drive displays as ~931 GB."
    },
    {
      "q": "How many megabytes are in one gigabyte?",
      "a": "In decimal (SI) standard, 1 GB = 1,000 MB. In binary (IEC) standard, 1 GiB = 1,024 MiB."
    }
  ]
},
  "/privacy-policy": {
    path: "/privacy-policy",
    canonical: `${BASE_URL}/privacy-policy`,
    title: "Privacy Policy | Stiknex",
    h1: "Stiknex Privacy Policy",
    description: "Read the Stiknex Privacy Policy. We prioritize user privacy with client-side processing, zero data sales, local storage retention, and encrypted multi-device sync.",
    keywords: "stiknex privacy policy, privacy, data protection, zero knowledge storage"
  },
  "/terms-of-service": {
    path: "/terms-of-service",
    canonical: `${BASE_URL}/terms-of-service`,
    title: "Terms of Service | Stiknex",
    h1: "Stiknex Terms of Service",
    description: "Review the Stiknex Terms of Service. Understand the conditions of using our free productivity tools, notebooks, canvas whiteboards, and shortener services.",
    keywords: "stiknex terms of service, terms and conditions, terms of use"
  },
  "/contact": {
    path: "/contact",
    canonical: `${BASE_URL}/contact`,
    title: "Contact Us – Feedback, Support & Bug Reports | Stiknex",
    h1: "Contact Stiknex Team",
    description: "Get in touch with the Stiknex team for support, feature suggestions, or security vulnerability disclosures. Direct email and fast feedback response.",
    keywords: "contact stiknex, support, feedback, help center"
  },
  "/url-shortener": {
    path: "/url-shortener",
    canonical: `${BASE_URL}/url-shortener`,
    title: "Free URL Shortener with Real-Time Click Analytics & QR Code | Stiknex",
    h1: "Free URL Shortener & Live Click Tracking Analytics",
    description: "Shorten links, track real-time clicks, unique visitors, countries, referrers, and UTM campaigns. Fast server-side redirects, privacy-friendly, zero signup required.",
    primaryIntent: "free url shortener with analytics",
    secondaryIntents: ["link shortener click tracking", "custom url shortener", "utm link shortener", "qr code url shortener"],
    keywords: "url shortener, link shortener, click tracking, url analytics, utm campaign tracking, qr code generator, free link shortener with analytics",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "URL Shortener", item: `${BASE_URL}/url-shortener` }
    ],
    cluster: "SEO & Web Utilities",
    relatedTools: ["/tools", "/qr-code-generator", "/online-notebook"],
    faqs: [
      { q: "Is Stiknex URL Shortener free?", a: "Yes, Stiknex URL Shortener is 100% free with unlimited link creation and real-time click tracking." },
      { q: "Does Stiknex store my visitors' IP addresses?", a: "No. Raw IP addresses are never saved. Stiknex uses pseudonymous cryptographic hashing to estimate unique visitors while protecting privacy." },
      { q: "Can I use custom aliases and UTM campaign tracking?", a: "Yes, you can specify custom short aliases and build full UTM campaign tags for marketing attribution." }
    ]
  },
  "/": {
    path: "/",
    canonical: `${BASE_URL}/`,
    title: "Stiknex – Free Sticky Notes, Online Notebook & Productivity Tools",
    h1: "Free Online Productivity & Utility Tools",
    description: "Stiknex is a free online productivity platform featuring infinite sticky notes boards, a rich-text notebook, Excalidraw whiteboard, calculators, converters, QR code generator and more. No sign-up required.",
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
  },

  "/typing-lab": {
    path: "/typing-lab",
    canonical: `${BASE_URL}/typing-lab`,
    title: "Stiknex Typing Lab – Free Typing Speed Test, Lessons & Arcade Games",
    h1: "Stiknex Typing Lab",
    description: "Improve your typing speed and accuracy with 15s/30s/60s/120s WPM tests, interactive touch typing lessons, developer code challenges, and arcade typing games.",
    primaryIntent: "typing speed test / learn touch typing",
    secondaryIntents: ["wpm test", "typing games", "code typing practice"],
    keywords: "typing speed test, typing test online, wpm test, learn touch typing, typing practice, typing games, code typing challenge",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: `${BASE_URL}/` },
      { name: "Typing Lab", item: `${BASE_URL}/typing-lab` }
    ],
    relatedTools: ["/tools", "/word-counter", "/sticky-notes"],
    faqs: [
      { q: "How is typing speed (WPM) calculated?", a: "Words Per Minute (WPM) is calculated as (Characters Typed / 5) divided by the time elapsed in minutes, penalized for uncorrected errors." },
      { q: "Is the Typing Lab free?", a: "Yes, the Stiknex Typing Lab is completely free with zero ads, signups, or usage limits." }
    ]
  }
};

// Augment with all 200 tools from ALL_TOOLS
ALL_TOOLS.forEach((t) => {
  const route = `/${t.slug}`;
  if (!seoConfig[route]) {
    seoConfig[route] = {
      path: route,
      canonical: `${BASE_URL}${route}`,
      title: `${t.title} – Free Online Utility | Stiknex`,
      h1: t.h1 || `Free Online ${t.title}`,
      description: t.tagline,
      primaryIntent: `${t.title.toLowerCase()} online / free ${t.title.toLowerCase()}`,
      secondaryIntents: [`browser ${t.title.toLowerCase()}`, `free online ${t.title.toLowerCase()}`],
      keywords: Array.isArray(t.keywords) ? t.keywords.join(", ") : t.keywords,
      schemaType: "WebApplication",
      breadcrumbs: [
        { name: "Home", item: `${BASE_URL}/` },
        { name: "Tools", item: `${BASE_URL}/tools` },
        { name: t.title, item: `${BASE_URL}${route}` }
      ],
      relatedTools: ALL_TOOLS.filter(ot => ot.category === t.category && ot.slug !== t.slug).slice(0, 4).map(ot => `/${ot.slug}`),
      faqs: [
        { q: `What is the Stiknex ${t.title}?`, a: `The Stiknex ${t.title} is a free, browser-based online utility designed for instant calculation, conversion, and formatting with zero server uploads.` },
        { q: `Is the ${t.title} free to use?`, a: "Yes, all tools on Stiknex are 100% free with no account creation, subscriptions, or hidden limits." },
        { q: `Does ${t.title} store my data?`, a: "No. All computations run 100% client-side in your device's browser memory. Your data is never transmitted to any external server." }
      ]
    };
  }
});

// Aliases for legacy and sub-path links
export const seoAliases = {
  "/dataconverter": "/data-converter",
  "/tools/data-converter": "/data-converter",
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
  if (seoConfig[clean]) return seoConfig[clean];
  const unaliased = seoAliases[clean] || (clean.startsWith("/tools/") ? clean.replace(/^\/tools\//, "/") : clean);
  return seoConfig[unaliased] || seoConfig["/"];
};


export const isKnownRoute = (path) => {
  if (!path) return false;
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/" || seoConfig[clean]) return true;
  if (seoAliases[clean]) return true;
  if (clean.startsWith("/tools/") && (seoConfig[clean.replace(/^\/tools\//, "/")] || seoAliases[clean])) return true;
  return false;
};
