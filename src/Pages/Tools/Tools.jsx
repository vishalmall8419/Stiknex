import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Layers,
  Wrench
} from "lucide-react";
import AppShell from "../../Component/Layout/AppShell";
import PageSEO from "../../Component/SEO/PageSEO";
import { getSeoForPath, seoConfig } from "../../utils/seoConfig";

// Tool components
import SimpleCalculator from "./Simplecalculator/Simplecalculator";
import ScientificCalculator from "./Scientificcalculator/Scientificcalculator";
import DateTimeCalculator from "./Datetimecalculator/Datetimecalculator";
import DataConverter from "./Dataconverter/Dataconverter";
import UnitConverter from "./UnitConverter/UnitConverter";
import TemperatureConverter from "./UnitConverter/TemperatureConverter";
import CurrencyConverter from "./CurrencyConverter/CurrencyConverter";
import QRCodeGenerator from "./QRCodeGenerator/QRCodeGenerator";
import PasswordGenerator from "./PasswordGenerator/PasswordGenerator";
import ColorPicker from "./ColorPicker/ColorPicker";
import WordCounter from "./WordCounter/WordCounter";

import {
  LENGTH_UNITS,
  AREA_UNITS,
  VOLUME_UNITS,
  WEIGHT_UNITS,
  SPEED_UNITS,
  PRESSURE_UNITS,
  POWER_UNITS,
} from "./UnitConverter/unitData";

// Tool Definitions
export const toolsData = [
  {
    id: "word",
    slug: "word-counter",
    icon: "fa-solid fa-file-lines",
    category: "Writing",
    title: "Word Counter",
    tagline: "Instant word, sentence, and paragraph counting with speaking & reading time analysis.",
    component: () => <WordCounter initialMode="word" />,
    howTo: [
      "Paste or type your draft text into the main editor area.",
      "Watch word, character, and sentence totals update automatically in real time.",
      "Review the estimated silent reading time and spoken presentation duration.",
      "Use the one-click case conversion buttons to adjust your typography if needed."
    ],
    features: [
      "Real-time word, character, and whitespace separation",
      "Calculated reading time at 200 WPM and speech time at 130 WPM",
      "Paragraph and sentence detection",
      "One-click UPPERCASE, lowercase, and Title Case conversions",
      "100% private and offline-first — no text ever leaves your browser"
    ],
    guide: "Word counts are critical for essay submissions, social media captions, SEO meta descriptions, and conference speeches. Stiknex Word Counter processes text locally in your browser memory for immediate feedback without server delays.",
    related: ["/character-counter", "/reading-time-calculator", "/online-notebook", "/sticky-notes"]
  },
  {
    id: "character",
    slug: "character-counter",
    icon: "fa-solid fa-font",
    category: "Writing",
    title: "Character Counter",
    tagline: "Exact character counting with and without spaces for social media and text limits.",
    component: () => <WordCounter initialMode="character" />,
    howTo: [
      "Type or paste your text snippet into the box.",
      "Check both the total character count and character count without spaces.",
      "Ensure your copy meets Twitter/X (280 chars), SMS (160 chars), or SEO meta tag (155 chars) restrictions.",
      "Copy your optimized copy with one click."
    ],
    features: [
      "Simultaneous counts for characters with and without whitespace",
      "Instant feedback on text boundaries and length limits",
      "Integrated sentence and paragraph statistics",
      "Client-side processing ensuring confidential drafts remain private"
    ],
    guide: "Different platforms count characters differently. For instance, SMS gateways charge per 160 GSM characters, while search engine snippets truncate titles beyond ~60 characters. Stiknex provides exact metrics for both total and whitespace-free characters.",
    related: ["/word-counter", "/reading-time-calculator", "/online-notebook"]
  },
  {
    id: "reading-time",
    slug: "reading-time-calculator",
    icon: "fa-solid fa-stopwatch",
    category: "Writing",
    title: "Reading Time Calculator",
    tagline: "Accurately estimate how long it will take readers to consume your article or speech.",
    component: () => <WordCounter initialMode="reading-time" />,
    howTo: [
      "Paste your article, blog post draft, or speech script.",
      "Check the calculated silent reading duration (calibrated to the standard 200 WPM).",
      "Check the speaking time duration (calibrated to natural speech cadence of 130 WPM).",
      "Adjust section lengths to meet target speaking slots or blog reading expectations."
    ],
    features: [
      "Dual calculation for silent reader pacing and public speaker delivery",
      "Seconds and minutes granular precision",
      "Compliant with Medium and Substack reading time standards",
      "Free and instantaneous without account requirements"
    ],
    guide: "The average adult reads English non-technical text at approximately 200 to 250 words per minute. For spoken delivery, the natural cadence slows down to 125–140 words per minute to maintain clarity and audience comprehension.",
    related: ["/word-counter", "/character-counter", "/online-notebook"]
  },
  {
    id: "simple",
    slug: "simple-calculator",
    icon: "fa-solid fa-calculator",
    category: "Calculators",
    title: "Simple Calculator",
    tagline: "Fast, everyday arithmetic with clear display and full keyboard support.",
    component: () => <SimpleCalculator />,
    howTo: [
      "Click the keypad buttons or type numbers directly on your physical keyboard.",
      "Use +, -, ×, ÷, and % operators to build your expression.",
      "Press '=' or Hit 'Enter' to view the computed result.",
      "Press 'C' to clear the display or backspace to delete the last digit."
    ],
    features: [
      "Responsive keypad supporting mouse, touch, and physical keyboard inputs",
      "Live expression preview while typing",
      "Accurate percentage calculation and decimal floating point handling",
      "Minimalist dark-mode ready design"
    ],
    guide: "Designed for quick math without the clunky bloat of standard operating system calculator apps. Perfect for balancing budgets, quick invoices, and homework checks.",
    related: ["/scientific-calculator", "/date-calculator", "/currency-converter"]
  },
  {
    id: "scientific",
    slug: "scientific-calculator",
    icon: "fa-solid fa-square-root-variable",
    category: "Calculators",
    title: "Scientific Calculator",
    tagline: "Advanced math computation with trigonometry, logarithms, powers, and roots.",
    component: () => <ScientificCalculator />,
    howTo: [
      "Select degree or radian mode for trigonometric operations.",
      "Enter numbers and functions such as sin, cos, tan, log, ln, or square root.",
      "Use parentheses to structure complex multi-step algebraic operations.",
      "Review the computation history log to verify previous steps."
    ],
    features: [
      "Trigonometric functions (sin, cos, tan, and inverses)",
      "Logarithmic functions (log base 10, natural log ln)",
      "Powers, square roots, and factorial calculations",
      "Parentheses nesting for complex formulas"
    ],
    guide: "Ideal for engineering, physics, algebra, and statistics students who need a dependable browser scientific calculator without ad interruptions.",
    related: ["/simple-calculator", "/date-calculator", "/unit-converter"]
  },
  {
    id: "datetime",
    slug: "date-calculator",
    icon: "fa-solid fa-calendar-days",
    category: "Calculators",
    title: "Date Calculator",
    tagline: "Calculate days between dates, countdowns, and age milestones.",
    component: () => <DateTimeCalculator />,
    howTo: [
      "Select your start date and end date from the calendar selectors.",
      "View the exact difference displayed in total days, weeks, months, and years.",
      "Use the date addition tool to find what date falls X days into the future.",
      "Calculate exact current age in years, months, and days."
    ],
    features: [
      "Calendar duration calculations between any two dates",
      "Add or subtract days, weeks, or months to target dates",
      "Precise age calculator down to the day",
      "Automatic leap year and timezone adjustment"
    ],
    guide: "Whether planning project deadlines, calculating invoice payment windows, or checking legal age milestones, our date calculator eliminates manual calendar counting.",
    related: ["/simple-calculator", "/scientific-calculator", "/unit-converter"]
  },
  {
    id: "currency",
    slug: "currency-converter",
    icon: "fa-solid fa-money-bill-transfer",
    category: "Converters",
    title: "Currency Converter",
    tagline: "Live foreign exchange rates for 150+ global fiat currencies.",
    component: () => <CurrencyConverter />,
    howTo: [
      "Enter the financial amount you want to convert.",
      "Choose your base currency (e.g., USD, EUR, INR, GBP).",
      "Select your target destination currency.",
      "View the converted value with live market exchange rates."
    ],
    features: [
      "Support for 150+ international currencies",
      "Cached live exchange rates for instant zero-latency conversions",
      "Bidirectional currency swap button",
      "Responsive layout for mobile and travel use"
    ],
    guide: "Foreign currency values fluctuate continuously based on global macroeconomic factors. Stiknex provides fast, accurate reference conversions for travelers, remote workers, and eCommerce shoppers.",
    related: ["/unit-converter", "/simple-calculator", "/date-calculator"]
  },
  {
    id: "length",
    slug: "length-converter",
    icon: "fa-solid fa-ruler",
    category: "Converters",
    title: "Length Converter",
    tagline: "Convert millimeters, centimeters, meters, feet, inches, and miles.",
    component: () => <UnitConverter units={LENGTH_UNITS} defaultUnit="m" />,
    howTo: [
      "Input the length or distance measurement.",
      "Select the source unit (e.g., meters or inches).",
      "Select the target unit (e.g., feet, centimeters, or miles).",
      "Read the converted result with high decimal precision."
    ],
    features: [
      "Covers metric (mm, cm, m, km) and imperial (in, ft, yd, mi)",
      "High precision conversion formulas",
      "Instant two-way calculation",
      "Clean unit comparison table"
    ],
    guide: "Conversion between metric and US customary units is essential in construction, 3D printing, DIY crafts, and international travel. 1 inch is legally defined as exactly 2.54 centimeters.",
    related: ["/area-converter", "/volume-converter", "/weight-converter", "/unit-converter"]
  },
  {
    id: "area",
    slug: "area-converter",
    icon: "fa-solid fa-border-all",
    category: "Converters",
    title: "Area Converter",
    tagline: "Convert square meters, square feet, acres, and hectares.",
    component: () => <UnitConverter units={AREA_UNITS} defaultUnit="sqm" />,
    howTo: [
      "Type the land or surface area value.",
      "Pick your starting unit (e.g., square feet or acres).",
      "Pick the target unit (e.g., square meters or hectares).",
      "View the exact land or floor space equivalent."
    ],
    features: [
      "Calculates square feet, square meters, acres, hectares, and square kilometers",
      "Standardized conversion ratios for real estate and agriculture",
      "Works on both small room dimensions and large land plots"
    ],
    guide: "One acre equals 43,560 square feet or approximately 4,046.86 square meters. Use this tool for property planning, flooring calculations, and architecture.",
    related: ["/length-converter", "/volume-converter", "/unit-converter"]
  },
  {
    id: "volume",
    slug: "volume-converter",
    icon: "fa-solid fa-flask",
    category: "Converters",
    title: "Volume Converter",
    tagline: "Convert liters, milliliters, gallons, fluid ounces, and cups.",
    component: () => <UnitConverter units={VOLUME_UNITS} defaultUnit="l" />,
    howTo: [
      "Enter the liquid or dry volume amount.",
      "Select source measurement (e.g., liters, cups, or gallons).",
      "Select destination measurement (e.g., milliliters or fluid ounces).",
      "View the culinary and engineering volume conversion."
    ],
    features: [
      "Covers kitchen units (cups, tablespoons, teaspoons, fluid oz)",
      "Covers commercial units (gallons, quarts, pints, liters)",
      "Instant conversion for cooking and science recipes"
    ],
    guide: "Converting between US cups, fluid ounces, and metric milliliters is common when adapting international cooking recipes and chemistry solutions.",
    related: ["/weight-converter", "/length-converter", "/unit-converter"]
  },
  {
    id: "weight",
    slug: "weight-converter",
    icon: "fa-solid fa-weight-hanging",
    category: "Converters",
    title: "Weight Converter",
    tagline: "Convert kilograms, pounds, ounces, grams, and stone.",
    component: () => <UnitConverter units={WEIGHT_UNITS} defaultUnit="kg" />,
    howTo: [
      "Input the weight or mass value.",
      "Choose the starting unit (e.g., kilograms or pounds).",
      "Choose the target unit (e.g., grams or ounces).",
      "See the calculated weight instantly."
    ],
    features: [
      "Precision conversion between kg, grams, lbs, oz, and metric tonnes",
      "Standard international mass constant definitions",
      "Ideal for fitness, luggage weighing, cooking, and postal shipments"
    ],
    guide: "One kilogram equals approximately 2.20462 pounds. Having an accurate weight converter helps avoid airport luggage fees and ensures correct recipe measurements.",
    related: ["/volume-converter", "/length-converter", "/unit-converter"]
  },
  {
    id: "temperature",
    slug: "temperature-converter",
    icon: "fa-solid fa-temperature-half",
    category: "Converters",
    title: "Temperature Converter",
    tagline: "Convert Celsius, Fahrenheit, and Kelvin temperature scales.",
    component: () => <TemperatureConverter />,
    howTo: [
      "Enter the degrees in any scale.",
      "Select Celsius (°C), Fahrenheit (°F), or Kelvin (K).",
      "Read the simultaneous conversion across the remaining temperature scales.",
      "Observe boiling, freezing, and room temperature indicators."
    ],
    features: [
      "Simultaneous 3-way conversion across °C, °F, and K",
      "Scientific thermodynamic formulas implemented with floating precision",
      "Common reference indicators for water freezing and boiling points"
    ],
    guide: "Water freezes at 0°C (32°F) and boils at 100°C (212°F). The Kelvin scale begins at absolute zero (-273.15°C).",
    related: ["/speed-converter", "/pressure-converter", "/unit-converter"]
  },
  {
    id: "speed",
    slug: "speed-converter",
    icon: "fa-solid fa-gauge-high",
    category: "Converters",
    title: "Speed Converter",
    tagline: "Convert miles per hour (mph), km/h, knots, and m/s.",
    component: () => <UnitConverter units={SPEED_UNITS} defaultUnit="kph" />,
    howTo: [
      "Input the speed value.",
      "Choose source speed unit (e.g., km/h or mph).",
      "Choose target velocity unit (e.g., knots or meters per second).",
      "View the normalized speed rate."
    ],
    features: [
      "Supports automotive speeds (km/h, mph)",
      "Supports nautical and aviation speeds (knots)",
      "Supports physics metric units (m/s)"
    ],
    guide: "Sixty miles per hour translates to 96.56 kilometers per hour or 26.82 meters per second. Essential for travel and driving across metric/imperial borders.",
    related: ["/length-converter", "/pressure-converter", "/unit-converter"]
  },
  {
    id: "pressure",
    slug: "pressure-converter",
    icon: "fa-solid fa-compress",
    category: "Converters",
    title: "Pressure Converter",
    tagline: "Convert PSI, Bar, Pascals, and standard Atmospheres.",
    component: () => <UnitConverter units={PRESSURE_UNITS} defaultUnit="pa" />,
    howTo: [
      "Enter the pressure reading.",
      "Select unit (e.g., PSI for tires or Bar for scuba).",
      "Select destination unit (e.g., Kilopascal or Atmospheres).",
      "Check the verified converted pressure."
    ],
    features: [
      "Supports tire pressure units (PSI, Bar)",
      "Supports scientific units (Pascal, Kilopascal, Megapascal)",
      "Standard atmosphere (atm) normalization"
    ],
    guide: "One bar is equal to 100,000 Pascals (100 kPa) and approximately 14.5038 PSI. Car tire pressures typically specify both PSI and Bar on the door jamb sticker.",
    related: ["/power-converter", "/speed-converter", "/unit-converter"]
  },
  {
    id: "power",
    slug: "power-converter",
    icon: "fa-solid fa-bolt",
    category: "Converters",
    title: "Power Converter",
    tagline: "Convert Watts, Kilowatts, metric Horsepower, and BTU.",
    component: () => <UnitConverter units={POWER_UNITS} defaultUnit="w" />,
    howTo: [
      "Enter the energy rate or power rating.",
      "Select input unit (Watts, Kilowatts, Horsepower, BTU/hr).",
      "Select target output power rating.",
      "Read the power equivalent for engines or electrical loads."
    ],
    features: [
      "Mechanical and electrical power support",
      "Instant conversion between Watts, Kilowatts, HP, and BTU/hr",
      "Useful for vehicle specs, solar panels, and HVAC calculations"
    ],
    guide: "One mechanical horsepower equals 745.7 Watts. 1 Kilowatt equals 1.341 Horsepower.",
    related: ["/pressure-converter", "/speed-converter", "/unit-converter"]
  },
  {
    id: "converter",
    slug: "data-converter",
    icon: "fa-solid fa-arrows-turn-to-dots",
    category: "Converters",
    title: "Data Converter",
    tagline: "Convert storage and file sizes: Bytes, KB, MB, GB, and TB.",
    component: () => <DataConverter />,
    howTo: [
      "Enter the file size or storage capacity.",
      "Select base data unit (e.g., Megabytes or Gigabytes).",
      "Select target unit (e.g., Terabytes or Kilobytes).",
      "Inspect both decimal (1000) and binary (1024) conversions."
    ],
    features: [
      "Covers Bytes, Kilobytes, Megabytes, Gigabytes, Terabytes, and Petabytes",
      "Instant file transfer estimation support",
      "Essential for cloud storage, SSDs, and upload limit checks"
    ],
    guide: "Operating systems (like Windows) calculate data in binary Gibibytes (1024 MB), while drive manufacturers market in decimal Gigabytes (1000 MB).",
    related: ["/unit-converter", "/power-converter", "/simple-calculator"]
  },
  {
    id: "qrcode",
    slug: "qr-code-generator",
    icon: "fa-solid fa-qrcode",
    category: "Generators & Utilities",
    title: "QR Code Generator",
    tagline: "Generate custom, high-resolution QR codes that never expire.",
    component: () => <QRCodeGenerator />,
    howTo: [
      "Enter the website URL, WiFi credentials, or plain text message.",
      "Select your custom foreground color for your brand.",
      "Preview the responsive QR code render in real time.",
      "Click Download to save the PNG image directly to your device."
    ],
    features: [
      "Static QR codes with unlimited scans and zero expiration dates",
      "Customizable foreground color palette",
      "Download high-res PNG for print and digital posters",
      "100% private local generation without redirection links"
    ],
    guide: "Unlike commercial QR generators that wrap links in tracking redirects that break after free trials, Stiknex encodes your raw URL directly into the QR matrix so your codes work forever.",
    related: ["/password-generator", "/color-picker", "/word-counter"]
  },
  {
    id: "password",
    slug: "password-generator",
    icon: "fa-solid fa-key",
    category: "Generators & Utilities",
    title: "Password Generator",
    tagline: "Generate strong, entropy-tested passwords with client-side privacy.",
    component: () => <PasswordGenerator />,
    howTo: [
      "Adjust the password length slider to your desired length (12-32 chars recommended).",
      "Toggle character options: uppercase, lowercase, numbers, and special symbols.",
      "Review the visual password strength security meter.",
      "Click the Copy button to securely paste into your password manager."
    ],
    features: [
      "Crypto-grade random number generation via browser Web Crypto API",
      "Visual password entropy and strength meter",
      "Customizable length and character set toggles",
      "Zero server interaction — passwords never touch a network"
    ],
    guide: "A secure password should have at least 14 characters and mix character sets. Generated locally in your browser memory, ensuring neither Stiknex nor third parties ever see your credentials.",
    related: ["/qr-code-generator", "/color-picker", "/word-counter"]
  },
  {
    id: "color",
    slug: "color-picker",
    icon: "fa-solid fa-palette",
    category: "Generators & Utilities",
    title: "Color Picker",
    tagline: "Inspect colors and convert HEX, RGB, HSL, and Tailwind classes.",
    component: () => <ColorPicker />,
    howTo: [
      "Click or drag on the interactive color canvas or color slider.",
      "Paste any existing HEX, RGB, or HSL color code.",
      "Use the browser eyedropper tool to pick any pixel color from your screen.",
      "Copy formatted HEX, RGB, or HSL values with one click."
    ],
    features: [
      "Seamless 3-way conversion between HEX, RGB, and HSL",
      "Native browser eyedropper integration for screen color sampling",
      "One-click copy for CSS stylesheets and Tailwind classes",
      "Responsive visual contrast preview"
    ],
    guide: "Essential for web designers, frontend developers, and digital artists who need rapid color inspection without opening heavy design software.",
    related: ["/qr-code-generator", "/password-generator", "/word-counter"]
  }
];

export const slugMap = Object.fromEntries(toolsData.map(t => [t.slug, t.id]));
export const idMap = Object.fromEntries(toolsData.map(t => [t.id, t.slug]));

const Tools = ({ directSlug = null }) => {
  const { toolId: paramSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current active tool slug
  const activeSlug = useMemo(() => {
    if (directSlug) return directSlug;
    if (paramSlug) return paramSlug;
    
    // Check if pathname matches any tool slug directly (e.g. /word-counter)
    const currentPath = location.pathname.replace(/^\//, "");
    if (slugMap[currentPath]) return currentPath;
    
    return null;
  }, [directSlug, paramSlug, location.pathname]);

  const activeToolData = useMemo(() => {
    if (!activeSlug) return null;
    return toolsData.find(t => t.slug === activeSlug || t.id === activeSlug) || null;
  }, [activeSlug]);

  const seoData = useMemo(() => {
    if (activeToolData) {
      return getSeoForPath(`/${activeToolData.slug}`);
    }
    return getSeoForPath("/tools");
  }, [activeToolData]);

  // Selected filter category on catalog page
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Writing", "Calculators", "Converters", "Generators & Utilities"];

  const filteredTools = useMemo(() => {
    if (selectedCategory === "All") return toolsData;
    return toolsData.filter(t => t.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <AppShell fullWidth={true}>
      <PageSEO
        title={seoData.title}
        description={seoData.description}
        path={seoData.path || (activeToolData ? `/${activeToolData.slug}` : "/tools")}
        type="webapp"
        keywords={seoData.keywords}
        faqs={seoData.faqs || null}
      />

      <div className="relative min-h-screen pb-32 overflow-x-hidden font-sans">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-25 -z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-80 h-80 md:w-[600px] md:h-[600px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute top-[30%] left-0 w-80 h-80 md:w-[600px] md:h-[600px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28">

          {/* =========================================================
              IF A SPECIFIC TOOL IS ACTIVE: RENDER DEDICATED TOOL PAGE
          ========================================================== */}
          {activeToolData ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              {/* Breadcrumb Navigation */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Home</Link>
                <ChevronRight size={14} />
                <Link to="/tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Tools</Link>
                <ChevronRight size={14} />
                <span className="text-slate-900 dark:text-white font-bold">{activeToolData.title}</span>
              </nav>

              {/* Tool Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/25 shrink-0">
                    <i className={activeToolData.icon}></i>
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                      {seoData.h1 || `Free Online ${activeToolData.title}`}
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium mt-1">
                      {activeToolData.tagline}
                    </p>
                  </div>
                </div>

                <Link
                  to="/tools"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition self-start sm:self-center"
                >
                  <ArrowLeft size={16} /> All Tools
                </Link>
              </div>

              {/* Interactive Tool Card (Above the fold) */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-200/40 dark:shadow-black/50">
                <activeToolData.component />
              </div>

              {/* Tool Guide & Deep Explanation (Phase 4 & Phase 5) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {/* How to Use */}
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
                    How to Use the {activeToolData.title}
                  </h2>
                  <ol className="space-y-3">
                    {activeToolData.howTo.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Key Features */}
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />
                    Key Features & Advantages
                  </h2>
                  <ul className="space-y-3">
                    {activeToolData.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contextual In-Depth Explanation */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Why Use Stiknex for {activeToolData.title}?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                  {activeToolData.guide}
                </p>
              </div>

              {/* Related Sibling Tools Cluster (Phase 6 Internal Links) */}
              <div className="pt-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers size={18} className="text-indigo-600" /> Related Productivity Tools
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {activeToolData.related.map((relPath) => {
                    const relSeo = getSeoForPath(relPath);
                    return (
                      <Link
                        key={relPath}
                        to={relPath}
                        className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm transition group"
                      >
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition block truncate">
                          {relSeo.title.split("–")[0].split("-")[0].split("|")[0].trim()}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {relSeo.description.slice(0, 45)}...
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Frequently Asked Questions (Structured Data visible content) */}
              {seoData.faqs && seoData.faqs.length > 0 && (
                <div className="pt-6 space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle size={20} className="text-indigo-600" /> Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    {seoData.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                        <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">{faq.q}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (

            /* =========================================================
                IF NO SPECIFIC TOOL: RENDER FULL TOOLS CATALOG DIRECTORY
            ========================================================== */
            <div>
              {/* Hero Section */}
              <div className="text-center mb-12 sm:mb-16 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 100 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/25"
                >
                  <Wrench size={32} className="text-white" />
                </motion.div>

                <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                  Free Online Tools Directory
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
                  Fast, accurate, and completely free productivity tools built right into your browser. No sign-up, no ads, no trackers.
                </p>

                {/* Filter Categories */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                        selectedCategory === cat
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tools Grid with Crawlable Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map((t) => (
                  <Link
                    key={t.id}
                    to={`/${t.slug}`}
                    className="group flex flex-col text-left p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl mb-5 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <i className={t.icon}></i>
                    </div>

                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-500 mb-1">
                      {t.category}
                    </div>

                    <h2 className="font-bold text-xl mb-2 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {t.title}
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed mb-6">
                      {t.tagline}
                    </p>

                    <div className="mt-auto flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                      Open Tool <ChevronRight size={14} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
};

export default Tools;
