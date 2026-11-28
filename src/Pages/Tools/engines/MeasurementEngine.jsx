import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  RotateCcw,
  ArrowRightLeft,
  Sparkles,
  Scale,
  Database,
  Menu,
  Sun,
  Moon,
  CheckCircle2,
  Trash2,
  Layers,
  Ruler,
  Clock
} from "lucide-react";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import NextGenFractionCalculator from "../components/NextGenFractionCalculator";
import { useAppContext } from "../../../context/AppContext";
import UnitConverter from "../UnitConverter/UnitConverter";
import DataConverter from "../Dataconverter/Dataconverter";
import {
  AREA_UNITS,
  VOLUME_UNITS,
  SPEED_UNITS,
  PRESSURE_UNITS
} from "../UnitConverter/unitData";

/* =========================================================================================
   MEASUREMENT & NUMERICAL CONVERSION TOOLS METADATA
   ========================================================================================= */
const MEASUREMENT_TOOLS = [
  { slug: "roman-numeral-converter", title: "Roman Numerals", highlight: "TRANSLATION", tag: "Roman to Decimal", desc: "Convert standard integers to Roman numerals and decode Roman numerals to numbers", icon: <ArrowRightLeft size={16} /> },
  { slug: "fraction-calculator", title: "Fraction Calc", highlight: "ARITHMETIC", tag: "Add, Sub, Mult, Div", desc: "Add, subtract, multiply, and divide fractions with simplifying steps", icon: <Scale size={16} /> },
  { slug: "ratio-calculator", title: "Ratio & Proportion", highlight: "PROPORTIONS", tag: "A:B = C:D", desc: "Solve ratio proportions, scaling factors, and aspect ratios", icon: <Scale size={16} /> },
  { slug: "number-base-converter", title: "Number Base", highlight: "RADIX CONVERT", tag: "Binary, Hex, Octal", desc: "Convert between Binary (Base 2), Octal (Base 8), Decimal (Base 10), and Hexadecimal (Base 16)", icon: <Database size={16} /> },
  { slug: "fuel-economy-converter", title: "Fuel Economy", highlight: "EFFICIENCY", tag: "MPG & L/100km", desc: "Convert between US MPG, Imperial MPG, km/L, and L/100km", icon: <Scale size={16} /> },
  { slug: "area-converter", title: "Area Converter", highlight: "MENSURATION", tag: "Sq meters, Acres, Sq ft", desc: "Convert between square meters, square feet, acres, and hectares", icon: <Scale size={16} /> },
  { slug: "volume-converter", title: "Volume Converter", highlight: "CAPACITY", tag: "Liters, Gallons, m³", desc: "Convert between liters, gallons, cubic meters, and fluid ounces", icon: <Scale size={16} /> },
  { slug: "speed-converter", title: "Speed Converter", highlight: "VELOCITY", tag: "km/h, mph, m/s, knots", desc: "Convert between km/h, mph, meters per second, and nautical knots", icon: <Scale size={16} /> },
  { slug: "pressure-converter", title: "Pressure Converter", highlight: "PHYSICS", tag: "Pascal, Bar, PSI, atm", desc: "Convert between Pascals, PSI, Bar, and standard atmospheres", icon: <Scale size={16} /> },
  { slug: "data-converter", title: "Data Storage", highlight: "BYTES & BITS", tag: "KB, MB, GB, TB", desc: "Convert between bits, bytes, kilobytes, megabytes, gigabytes, and terabytes", icon: <Database size={16} /> }
];

export default function MeasurementEngine({ slug = "roman-numeral-converter", toolId = "roman-numeral-converter", tool, seoData }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();
  const navigate = useNavigate();

  const [activeSlug, setActiveSlug] = useState(slug || "roman-numeral-converter");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug && slug !== activeSlug) {
      setActiveSlug(slug);
    }
  }, [slug]);

  const handleSelectTool = (targetSlug) => {
    setActiveSlug(targetSlug);
    window.history.replaceState(null, "", `/${targetSlug}`);
  };

  const copyText = useCallback((txt) => {
    if (!txt) return;
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const currentTool = useMemo(() => {
    return MEASUREMENT_TOOLS.find((t) => t.slug === activeSlug) || MEASUREMENT_TOOLS[0];
  }, [activeSlug]);

  const relatedToolsForDrawer = useMemo(() => {
    return MEASUREMENT_TOOLS.map((t) => ({
      slug: t.slug,
      name: t.title,
      desc: t.desc,
      icon: t.icon
    }));
  }, []);

  // Standard Unit Converter sub-pages (Area, Volume, Speed, Pressure, Data)
  if (activeSlug === "area-converter") {
    return <UnitConverter units={AREA_UNITS} defaultUnit="sqm" tool={tool} seoData={seoData} title="Area Converter" />;
  }
  if (activeSlug === "volume-converter") {
    return <UnitConverter units={VOLUME_UNITS} defaultUnit="l" tool={tool} seoData={seoData} title="Volume Converter" />;
  }
  if (activeSlug === "speed-converter") {
    return <UnitConverter units={SPEED_UNITS} defaultUnit="kph" tool={tool} seoData={seoData} title="Speed Converter" />;
  }
  if (activeSlug === "pressure-converter") {
    return <UnitConverter units={PRESSURE_UNITS} defaultUnit="pa" tool={tool} seoData={seoData} title="Pressure Converter" />;
  }
  if (activeSlug === "data-converter" || activeSlug === "dataconverter") {
    return <DataConverter />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      <ToolSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        relatedTools={relatedToolsForDrawer}
        categoryTitle="Measurement & Conversion Tools"
        onFeedback={openFeedback}
      />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Open Tools Menu"
          >
            <Menu size={20} />
          </button>
          <Link to="/tools" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline">
            <span>Tools</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 dark:text-white capitalize">Measurement</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/tools"
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            All 200 Tools
          </Link>
        </div>
      </header>

      {/* Horizontal Tool Selector Tab Bar */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max max-w-7xl mx-auto">
          {MEASUREMENT_TOOLS.map((toolItem) => {
            const isActive = toolItem.slug === activeSlug;
            return (
              <button
                key={toolItem.slug}
                onClick={() => handleSelectTool(toolItem.slug)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{toolItem.icon}</span>
                <span>{toolItem.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workstation Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-wider border border-indigo-200/60 dark:border-indigo-800/50">
                {currentTool.highlight}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{currentTool.tag}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentTool.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {currentTool.desc}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40">
              <CheckCircle2 size={13} /> 100% In-Browser Math Engine
            </span>
          </div>
        </div>

        {/* Dynamic Tool Rendering */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-black/40 p-5 sm:p-8">
          {(activeSlug === "roman-numeral-converter" || toolId === "roman-numeral-converter") && (
            <RomanNumeralConverter copyText={copyText} copied={copied} />
          )}
          {(activeSlug === "fraction-calculator" || toolId === "fraction-calculator") && (
            <NextGenFractionCalculator copyText={copyText} copied={copied} />
          )}
          {(activeSlug === "ratio-calculator" || activeSlug === "ratio-and-proportion-calculator" || toolId === "ratio-calculator") && (
            <RatioCalculator copyText={copyText} copied={copied} />
          )}
          {(activeSlug === "number-base-converter" || toolId === "number-base-converter") && (
            <NumberBaseConverter copyText={copyText} copied={copied} />
          )}
          {(activeSlug === "fuel-economy-converter" || toolId === "fuel-economy-converter") && (
            <FuelEconomyConverter copyText={copyText} copied={copied} />
          )}
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// BIG TOOL: FUEL ECONOMY CONVERTER
// ============================================================================
function FuelEconomyConverter({ copyText, copied }) {
  const [val, setVal] = useState(30);
  const [unit, setUnit] = useState("mpg_us"); // mpg_us, mpg_uk, l_100km, km_l

  const conversions = useMemo(() => {
    const num = Number(val);
    if (!num || num <= 0) return { mpg_us: 0, mpg_uk: 0, l_100km: 0, km_l: 0 };

    let l_100km = 0;
    if (unit === "l_100km") l_100km = num;
    else if (unit === "mpg_us") l_100km = 235.214583 / num;
    else if (unit === "mpg_uk") l_100km = 282.4809363 / num;
    else if (unit === "km_l") l_100km = 100 / num;

    return {
      mpg_us: Number((235.214583 / l_100km).toFixed(2)),
      mpg_uk: Number((282.4809363 / l_100km).toFixed(2)),
      l_100km: Number(l_100km.toFixed(2)),
      km_l: Number((100 / l_100km).toFixed(2))
    };
  }, [val, unit]);

  return (
    <div className="space-y-8">
      <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Fuel Economy Value</label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="w-full sm:w-64">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Select Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="mpg_us">Miles per Gallon (US MPG)</option>
            <option value="mpg_uk">Miles per Gallon (Imperial/UK MPG)</option>
            <option value="l_100km">Liters per 100 km (L/100km)</option>
            <option value="km_l">Kilometers per Liter (km/L)</option>
          </select>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "US MPG", val: conversions.mpg_us, desc: "Standard United States" },
          { label: "UK / Imperial MPG", val: conversions.mpg_uk, desc: "United Kingdom & Commonwealth" },
          { label: "L/100km", val: conversions.l_100km, desc: "Europe & International Metric" },
          { label: "km/L", val: conversions.km_l, desc: "Asia & South America" },
        ].map((item, idx) => (
          <div key={idx} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">{item.label}</span>
              <span className="text-3xl font-black text-slate-900 dark:text-white block">{item.val}</span>
              <span className="text-xs text-slate-500 mt-1 block">{item.desc}</span>
            </div>
            <button
              onClick={() => copyText(item.val)}
              className="mt-4 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5"
            >
              <Copy size={13} /> Copy {item.val}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: NUMBER BASE CONVERTER
// ============================================================================
function NumberBaseConverter({ copyText, copied }) {
  const [inputVal, setInputVal] = useState("255");
  const [base, setBase] = useState(10); // 10, 2, 16, 8

  const converted = useMemo(() => {
    try {
      const clean = inputVal.trim();
      if (!clean) return { dec: "0", bin: "0", hex: "0", oct: "0" };
      const dec = parseInt(clean, base);
      if (isNaN(dec)) return { error: "Invalid number for selected base radix." };

      return {
        dec: dec.toString(10),
        bin: dec.toString(2),
        hex: dec.toString(16).toUpperCase(),
        oct: dec.toString(8)
      };
    } catch {
      return { error: "Computation error." };
    }
  }, [inputVal, base]);

  return (
    <div className="space-y-8">
      <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Input Value</label>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-slate-900 dark:text-white text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="w-full sm:w-60">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">From Base Radix</label>
          <select
            value={base}
            onChange={(e) => setBase(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={10}>Decimal (Base 10)</option>
            <option value={2}>Binary (Base 2)</option>
            <option value={16}>Hexadecimal (Base 16)</option>
            <option value={8}>Octal (Base 8)</option>
          </select>
        </div>
      </div>

      {converted.error ? (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-200 font-bold text-sm">
          {converted.error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Decimal (Base 10)", val: converted.dec },
            { label: "Binary (Base 2)", val: converted.bin },
            { label: "Hexadecimal (Base 16)", val: `0x${converted.hex}` },
            { label: "Octal (Base 8)", val: converted.oct },
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-2">{item.label}</span>
                <span className="text-2xl font-mono font-black text-slate-900 dark:text-white break-all block">{item.val}</span>
              </div>
              <button
                onClick={() => copyText(item.val)}
                className="mt-4 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5"
              >
                <Copy size={13} /> Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BIG TOOL: ROMAN NUMERAL CONVERTER
// ============================================================================
function RomanNumeralConverter({ copyText, copied }) {
  const [val, setVal] = useState("2026");
  const [mode, setMode] = useState("numToRoman"); // numToRoman or romanToNum

  const romanMap = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
  ];

  const result = useMemo(() => {
    const input = val.trim().toUpperCase();
    if (!input) return "";

    if (mode === "numToRoman") {
      let num = parseInt(input, 10);
      if (isNaN(num) || num <= 0 || num > 3999999) return "Enter a valid integer between 1 and 3,999,999.";
      let str = "";
      for (const [v, r] of romanMap) {
        while (num >= v) {
          str += r;
          num -= v;
        }
      }
      return str;
    } else {
      const romanVal = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
      let sum = 0;
      for (let i = 0; i < input.length; i++) {
        const cur = romanVal[input[i]];
        const next = romanVal[input[i + 1]];
        if (!cur) return "Invalid Roman character found.";
        if (next && next > cur) {
          sum += next - cur;
          i++;
        } else {
          sum += cur;
        }
      }
      return String(sum);
    }
  }, [val, mode]);

  return (
    <div className="space-y-8">
      <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex gap-3">
          <button
            onClick={() => { setMode("numToRoman"); setVal("2026"); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${mode === "numToRoman" ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600"}`}
          >
            Number &rarr; Roman
          </button>
          <button
            onClick={() => { setMode("romanToNum"); setVal("MMXXVI"); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${mode === "romanToNum" ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600"}`}
          >
            Roman &rarr; Number
          </button>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            {mode === "numToRoman" ? "Enter Number (e.g. 2026)" : "Enter Roman Numeral (e.g. MMXXVI)"}
          </label>
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-slate-900 dark:text-white text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="p-8 bg-indigo-600 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-500/20">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">Converted Value</span>
          <div className="text-4xl sm:text-5xl font-mono font-black tracking-tight">{result}</div>
        </div>
        <button
          onClick={() => copyText(result)}
          className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition shadow-md flex items-center gap-2 shrink-0"
        >
          <Copy size={16} /> Copy Result
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: FRACTION CALCULATOR
// ============================================================================
function FractionCalculator({ copyText, copied }) {
  const [n1, setN1] = useState(3);
  const [d1, setD1] = useState(4);
  const [op, setOp] = useState("+");
  const [n2, setN2] = useState(2);
  const [d2, setD2] = useState(5);

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  const result = useMemo(() => {
    const num1 = Number(n1);
    const den1 = Number(d1);
    const num2 = Number(n2);
    const den2 = Number(d2);

    if (den1 === 0 || den2 === 0) return { error: "Denominator cannot be zero." };

    let resNum = 0;
    let resDen = den1 * den2;

    if (op === "+") resNum = num1 * den2 + num2 * den1;
    if (op === "-") resNum = num1 * den2 - num2 * den1;
    if (op === "*") { resNum = num1 * num2; resDen = den1 * den2; }
    if (op === "/") {
      if (num2 === 0) return { error: "Cannot divide by a zero fraction." };
      resNum = num1 * den2;
      resDen = den1 * num2;
    }

    const divisor = Math.abs(gcd(resNum, resDen));
    const simpNum = resNum / divisor;
    const simpDen = resDen / divisor;

    const decimal = Number((simpNum / simpDen).toFixed(4));
    const whole = Math.floor(Math.abs(simpNum) / simpDen);
    const rem = Math.abs(simpNum) % simpDen;
    const mixed = whole > 0 && rem > 0 ? `${simpNum < 0 ? "-" : ""}${whole} ${rem}/${simpDen}` : null;

    return {
      simplified: `${simpNum}/${simpDen}`,
      decimal,
      mixed
    };
  }, [n1, d1, op, n2, d2]);

  return (
    <div className="space-y-8">
      <div className="p-8 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-6">
        {/* Fraction 1 */}
        <div className="flex flex-col items-center gap-2">
          <input
            type="number"
            value={n1}
            onChange={(e) => setN1(e.target.value)}
            className="w-20 px-3 py-2 text-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-lg"
          />
          <div className="w-20 h-1 bg-slate-400 dark:bg-slate-600 rounded-full"></div>
          <input
            type="number"
            value={d1}
            onChange={(e) => setD1(e.target.value)}
            className="w-20 px-3 py-2 text-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-lg"
          />
        </div>

        {/* Operator */}
        <div className="flex flex-col gap-1">
          {["+", "-", "*", "/"].map((o) => (
            <button
              key={o}
              onClick={() => setOp(o)}
              className={`w-10 h-10 rounded-xl font-bold text-lg transition ${op === o ? "bg-indigo-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"}`}
            >
              {o === "*" ? "×" : o === "/" ? "÷" : o}
            </button>
          ))}
        </div>

        {/* Fraction 2 */}
        <div className="flex flex-col items-center gap-2">
          <input
            type="number"
            value={n2}
            onChange={(e) => setN2(e.target.value)}
            className="w-20 px-3 py-2 text-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-lg"
          />
          <div className="w-20 h-1 bg-slate-400 dark:bg-slate-600 rounded-full"></div>
          <input
            type="number"
            value={d2}
            onChange={(e) => setD2(e.target.value)}
            className="w-20 px-3 py-2 text-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-lg"
          />
        </div>
      </div>

      {result.error ? (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl font-bold text-center">{result.error}</div>
      ) : (
        <div className="p-8 bg-indigo-600 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-500/20">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">Resulting Fraction</span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight">{result.simplified}</div>
            <p className="text-indigo-200 text-sm mt-1">
              Decimal: <strong>{result.decimal}</strong> {result.mixed ? `| Mixed: ${result.mixed}` : ""}
            </p>
          </div>
          <button
            onClick={() => copyText(result.simplified)}
            className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition shadow-md flex items-center gap-2 shrink-0"
          >
            <Copy size={16} /> Copy Fraction
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BIG TOOL: RATIO AND PROPORTION CALCULATOR
// ============================================================================
function RatioCalculator({ copyText, copied }) {
  // A : B = C : D
  const [a, setA] = useState("10");
  const [b, setB] = useState("20");
  const [c, setC] = useState("30");
  const [d, setD] = useState("");

  const solved = useMemo(() => {
    const na = a === "" ? null : Number(a);
    const nb = b === "" ? null : Number(b);
    const nc = c === "" ? null : Number(c);
    const nd = d === "" ? null : Number(d);

    const missing = [na, nb, nc, nd].filter((x) => x === null).length;
    if (missing !== 1) return { error: "Leave exactly one field blank to solve for it." };

    if (na === null && nb && nc && nd) return { var: "A", val: Number(((nb * nc) / nd).toFixed(4)) };
    if (nb === null && na && nc && nd) return { var: "B", val: Number(((na * nd) / nc).toFixed(4)) };
    if (nc === null && na && nb && nd) return { var: "C", val: Number(((na * nd) / nb).toFixed(4)) };
    if (nd === null && na && nb && nc) return { var: "D", val: Number(((nb * nc) / na).toFixed(4)) };

    return { error: "Invalid proportion values." };
  }, [a, b, c, d]);

  return (
    <div className="space-y-8">
      <div className="p-8 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Proportion Formula: A : B = C : D (Leave one box blank to solve)
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-2xl font-black text-slate-900 dark:text-white">
          <input
            type="number"
            placeholder="A"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="w-24 px-3 py-3 text-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
          <span>:</span>
          <input
            type="number"
            placeholder="B"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="w-24 px-3 py-3 text-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
          <span>=</span>
          <input
            type="number"
            placeholder="C"
            value={c}
            onChange={(e) => setC(e.target.value)}
            className="w-24 px-3 py-3 text-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
          <span>:</span>
          <input
            type="number"
            placeholder="D (Blank)"
            value={d}
            onChange={(e) => setD(e.target.value)}
            className="w-24 px-3 py-3 text-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
      </div>

      {solved.error ? (
        <div className="p-4 bg-amber-50 text-amber-700 rounded-xl font-bold text-center text-sm">{solved.error}</div>
      ) : (
        <div className="p-8 bg-emerald-600 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-500/20">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 block mb-1">Solved Variable</span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight">{solved.var} = {solved.val}</div>
          </div>
          <button
            onClick={() => copyText(solved.val)}
            className="px-5 py-3 rounded-xl bg-white text-emerald-700 font-bold hover:bg-emerald-50 transition shadow-md flex items-center gap-2 shrink-0"
          >
            <Copy size={16} /> Copy Solution
          </button>
        </div>
      )}
    </div>
  );
}
