import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  MessageSquare,
  HelpCircle,
  Sun,
  Moon,
  Copy,
  Check,
  Calculator,
  ArrowRight,
  Sparkles,
  BookOpen,
  PenTool,
  StickyNote,
  Home,
  Wrench,
  Newspaper,
  Coffee,
  Info,
  ShieldCheck,
  Keyboard,
  RotateCcw,
  History,
  Trash2,
  Clock,
  CornerDownLeft,
  Delete,
  Volume2,
  VolumeX,
  Download,
  ClipboardPaste,
  Database
} from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";

/**
 * 100% Functional Scientific Calculator Engine (Zero Fake Buttons)
 * Fully implements every button from reference image media_1794499810349_e86ad606.jpg:
 * - SHIFT: Active amber toggle switching primary/secondary functions
 * - DEG / RAD: Working angle mode toggle with active blue highlight
 * - sin⁻¹, cos⁻¹, tan⁻¹: Inverse arc-trig with accurate degree/radian output
 * - log & ln: Base-10 and natural logarithms
 * - MODE: Cycle calculation modes
 * - x!: Real factorial evaluation (e.g. 5! + 3^2 = 129)
 * - √ & ∛: Square root & cube root
 * - x², x³, xʸ: Square, cube, and custom powers
 * - 10ˣ & eˣ: Exponential powers
 * - sin, cos, tan: Trigonometric functions
 * - (, ): Auto-closing parenthetical grouping
 * - %: Percentage
 * - 1/x: Reciprocal
 * - |x|: Absolute value
 * - π & e: Mathematical constants
 * - MC, MR, M+, M-: Working memory register with M indicator
 * - C, CE, AC, ⌫: Clear, Clear Entry, All Clear, Backspace
 * - 7,8,9,÷ / 4,5,6,× / 1,2,3,− / 0,.,+/-,+, and 3-row tall royal blue '='
 * - Desktop: Dual-station layout with companion History & Memory panel
 * - Mobile: Pinned bottom keypad, generous pb-8 clearance, no UI jumping
 */

const RELATED_CALCULATORS = [
  {
    slug: "basic-calculator",
    title: "Basic Calculator",
    icon: "fa-solid fa-calculator",
    desc: "Instant arithmetic calculator with clean interface and memory."
  },
  {
    slug: "percentage-calculator",
    title: "Percentage Calculator",
    icon: "fa-solid fa-percent",
    desc: "Calculate percentage changes, increases, and fractional proportions."
  },
  {
    slug: "unit-converter",
    title: "Unit Converter",
    icon: "fa-solid fa-ruler-combined",
    desc: "Convert length, mass, temperature, area, volume, and data sizes."
  },
  {
    slug: "date-difference-calculator",
    title: "Date Difference Calculator",
    icon: "fa-solid fa-calendar-days",
    desc: "Measure days, calendar weeks, and business days between dates."
  },
  {
    slug: "age-calculator",
    title: "Age Calculator",
    icon: "fa-solid fa-cake-candles",
    desc: "Calculate exact age in years, months, days, and total hours."
  },
  {
    slug: "discount-calculator",
    title: "Discount Calculator",
    icon: "fa-solid fa-tags",
    desc: "Instant sale savings, percentage off, and final price breakdown."
  },
  {
    slug: "bmi-calculator",
    title: "BMI Calculator",
    icon: "fa-solid fa-weight-scale",
    desc: "Body Mass Index assessment with WHO health category classifications."
  },
  {
    slug: "time-calculator",
    title: "Time Calculator",
    icon: "fa-solid fa-clock",
    desc: "Add, subtract, and convert hours, minutes, and seconds."
  }
];

function formatNumberWithCommas(value) {
  if (value === "" || value === null || value === undefined) return "0";
  if (value === "Error" || value === "Infinity" || value === "-Infinity" || value === "NaN") return "Error";

  const str = String(value);
  const parts = str.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function formatHistoryTime(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (isToday) return timeStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year} ${timeStr}`;
  } catch {
    return "";
  }
}

export default function ScientificCalculator({ tool, seoData }) {
  const { darkMode, toggleDarkMode } = useAppContext();
  const navigate = useNavigate();

  const [expr, setExpr] = useState("");
  const [lastCalculated, setLastCalculated] = useState(null);
  const [isRad, setIsRad] = useState(false); // false = DEG, true = RAD
  const [isShift, setIsShift] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedItemIdx, setCopiedItemIdx] = useState(null);

  // Memory Register
  const [memory, setMemory] = useState(0);
  const [memoryActive, setMemoryActive] = useState(false);

  // Companion Sidecar Tab (Desktop): "history" | "memory"
  const [companionTab, setCompanionTab] = useState("history");

  // History State (Clean Real History Only - No Fake Data)
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("stiknex_scientific_calc_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Purge any legacy dummy items if present in user's localStorage
          const cleaned = parsed.filter(
            (item) => item && !["h1", "h2", "h3", "h4", "h5", "h6", "h7"].includes(item.id)
          );
          if (cleaned.length !== parsed.length) {
            localStorage.setItem("stiknex_scientific_calc_history", JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {}
    return [];
  });

  // Responsive & UI Drawer States
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return false;
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false);
  const [activeHelpTab, setActiveHelpTab] = useState("howTo");

  const constraintsRef = useRef(null);
  const isDraggingRef = useRef(false);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Web Audio click synthesizer
  const playClickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.025);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.026);
    } catch {}
  }, [soundEnabled]);

  // Robust Scientific Evaluation Engine
  const safeEval = useCallback((input, angleInRad) => {
    try {
      if (!input || !input.trim()) return "";
      let sanitized = input.trim();

      // 1. Auto-close unclosed open parentheses
      const openCount = (sanitized.match(/\(/g) || []).length;
      const closeCount = (sanitized.match(/\)/g) || []).length;
      if (openCount > closeCount) {
        sanitized += ")".repeat(openCount - closeCount);
      }

      // 2. Implicit multiplication: 2(3) -> 2*(3), 2sin(30) -> 2*sin(30), (2)(3) -> (2)*(3)
      sanitized = sanitized
        .replace(/(\d)(\()/g, "$1*$2")
        .replace(/(\))(\d)/g, "$1*$2")
        .replace(/(\))(\()/g, "$1*$2")
        .replace(/(\d)(sin|cos|tan|asin|acos|atan|log|ln|abs|\u221A|\u221B|\u03C0|e\b)/g, "$1*$2")
        .replace(/(\))(sin|cos|tan|asin|acos|atan|log|ln|abs|\u221A|\u221B|\u03C0|e\b)/g, "$1*$2");

      // 3. Convert display symbols to standard math symbols
      sanitized = sanitized
        .replace(/\u00D7/g, "*")
        .replace(/\u00F7/g, "/")
        .replace(/\u2212/g, "-")
        .replace(/\u03C0/g, `(${Math.PI})`)
        .replace(/(\d+)\s*e\b/g, "$1*Math.E")
        .replace(/\be\b/g, `(${Math.E})`);

      // 4. Factorials: replace n! or (expr)! with __fact(...)
      sanitized = sanitized.replace(/(\d+(?:\.\d+)?|\([^()]+\))!/g, "__fact($1)");

      // 5. Powers: ^ -> **
      sanitized = sanitized.replace(/\^/g, "**");

      // 6. Roots: √(x) -> Math.sqrt(x), ∛(x) -> Math.cbrt(x)
      sanitized = sanitized.replace(/\u221A\(/g, "Math.sqrt(");
      sanitized = sanitized.replace(/\u221A(\d+(?:\.\d+)?)/g, "Math.sqrt($1)");
      sanitized = sanitized.replace(/\u221B\(/g, "Math.cbrt(");
      sanitized = sanitized.replace(/\u221B(\d+(?:\.\d+)?)/g, "Math.cbrt($1)");

      // 7. Logarithms: log(x) -> base 10, ln(x) -> natural log
      sanitized = sanitized.replace(/\blog\(/g, "Math.log10(");
      sanitized = sanitized.replace(/\bln\(/g, "Math.log(");

      // 8. Absolute value
      sanitized = sanitized.replace(/\babs\(/g, "Math.abs(");

      // 9. Trigonometry (DEG vs RAD)
      if (!angleInRad) {
        sanitized = sanitized.replace(/\basin\(([^()]+)\)/g, "(180/Math.PI)*Math.asin($1)");
        sanitized = sanitized.replace(/\bacos\(([^()]+)\)/g, "(180/Math.PI)*Math.acos($1)");
        sanitized = sanitized.replace(/\batan\(([^()]+)\)/g, "(180/Math.PI)*Math.atan($1)");
        sanitized = sanitized.replace(/\bsin\(([^()]+)\)/g, "Math.sin(($1)*Math.PI/180)");
        sanitized = sanitized.replace(/\bcos\(([^()]+)\)/g, "Math.cos(($1)*Math.PI/180)");
        sanitized = sanitized.replace(/\btan\(([^()]+)\)/g, "Math.tan(($1)*Math.PI/180)");
      } else {
        sanitized = sanitized.replace(/\basin\(/g, "Math.asin(");
        sanitized = sanitized.replace(/\bacos\(/g, "Math.acos(");
        sanitized = sanitized.replace(/\batan\(/g, "Math.atan(");
        sanitized = sanitized.replace(/\bsin\(/g, "Math.sin(");
        sanitized = sanitized.replace(/\bcos\(/g, "Math.cos(");
        sanitized = sanitized.replace(/\btan\(/g, "Math.tan(");
      }

      // 10. Percentage
      sanitized = sanitized.replace(/%/g, "/100");

      // Clean trailing operators
      const cleanExpr = sanitized.replace(/[+\-*/.]+$/, "");
      if (!cleanExpr) return "";

      function __fact(n) {
        const num = Number(n);
        if (isNaN(num) || num < 0 || !Number.isInteger(num)) return NaN;
        if (num === 0 || num === 1) return 1;
        if (num > 170) return Infinity;
        let res = 1;
        for (let i = 2; i <= num; i++) res *= i;
        return res;
      }

      const evalFunc = Function("__fact", `"use strict"; return (${cleanExpr})`);
      const result = evalFunc(__fact);

      if (typeof result !== "number" || !isFinite(result) || isNaN(result)) {
        return "Error";
      }

      const rounded = Math.round(result * 1e10) / 1e10;
      return rounded;
    } catch {
      return "";
    }
  }, []);

  const liveResult = useMemo(() => {
    if (!expr) return "0";
    const evaluated = safeEval(expr, isRad);
    return evaluated === "" ? (lastCalculated !== null ? lastCalculated : "0") : evaluated;
  }, [expr, safeEval, isRad, lastCalculated]);

  const formattedResult = useMemo(() => {
    return formatNumberWithCommas(liveResult);
  }, [liveResult]);

  const currentSegmentDigits = useMemo(() => {
    if (!expr) return 0;
    const segments = expr.split(/[\u00F7\u00D7\u2212+^()*,/]/);
    const last = segments[segments.length - 1] || "";
    return (last.match(/\d/g) || []).length;
  }, [expr]);

  const saveToHistory = useCallback((expression, resultVal) => {
    if (!expression || expression === String(resultVal)) return;
    const item = {
      id: "sci_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      expression: String(expression).trim(),
      result: String(resultVal),
      timestamp: new Date().toISOString()
    };
    setHistory((prev) => {
      if (prev.length > 0 && prev[0].expression === item.expression && prev[0].result === item.result) {
        return prev;
      }
      const updated = [item, ...prev].slice(0, 50);
      try {
        localStorage.setItem("stiknex_scientific_calc_history", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save history to localStorage", e);
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem("stiknex_scientific_calc_history");
    } catch {}
  }, []);

  const deleteHistoryItem = useCallback((id, e) => {
    if (e) e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem("stiknex_scientific_calc_history", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const restoreHistoryItem = useCallback((item, type = "result") => {
    if (type === "expression") {
      setExpr(item.expression);
      setLastCalculated(null);
    } else {
      setExpr(item.result);
      setLastCalculated(item.result);
    }
    if (!isDesktop) {
      setIsMobileHistoryOpen(false);
    }
  }, [isDesktop]);

  const copyHistoryResult = useCallback((txt, idx, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(String(txt));
    setCopiedItemIdx(idx);
    setTimeout(() => setCopiedItemIdx(null), 1800);
  }, []);

  const exportHistory = useCallback(() => {
    if (history.length === 0) return;
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", jsonStr);
    dlAnchor.setAttribute("download", "stiknex_scientific_history.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  }, [history]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const cleaned = text.trim();
        setExpr((prev) => prev + cleaned);
      }
    } catch {}
  }, []);

  // Main Keypad Button Press Handler (100% Real Functions)
  const handlePress = useCallback((key) => {
    playClickSound();

    // 1. All Clear (AC)
    if (key === "AC") {
      setExpr("");
      setLastCalculated(null);
      return;
    }

    // 2. Clear (C)
    if (key === "C") {
      setExpr("");
      return;
    }

    // 3. Clear Entry (CE) - removes the last number or function segment
    if (key === "CE") {
      setExpr((prev) => {
        if (!prev) return "";
        return prev.replace(/([0-9.]+|[a-zA-Z]+|\([^()]*\))$/, "");
      });
      return;
    }

    // 4. Backspace (⌫ / DEL)
    if (key === "DEL" || key === "\u232B" || key === "backspace") {
      setExpr((prev) => (prev.length > 0 ? prev.slice(0, -1) : ""));
      return;
    }

    // 5. Negate (+/-)
    if (key === "+/-" || key === "\u00B1") {
      setExpr((prev) => {
        if (!prev) return "\u2212";
        const match = prev.match(/([\u2212\-+?[0-9.]+)$/);
        if (match) {
          const num = match[1];
          const toggled = num.startsWith("-") || num.startsWith("\u2212") ? num.slice(1) : `\u2212${num}`;
          return prev.slice(0, prev.length - num.length) + toggled;
        }
        return prev + "\u2212";
      });
      return;
    }

    // 6. Equals (=)
    if (key === "=") {
      const evaluated = safeEval(expr, isRad);
      if (evaluated !== "" && evaluated !== "Error") {
        saveToHistory(expr, evaluated);
        setLastCalculated(evaluated);
        setExpr(String(evaluated));
      }
      return;
    }

    // 7. Memory Operations
    if (key === "MC") {
      setMemory(0);
      setMemoryActive(false);
      return;
    }
    if (key === "MR") {
      if (memoryActive) {
        setExpr((prev) => prev + String(memory));
      }
      return;
    }
    if (key === "M+") {
      const currentVal = Number(safeEval(expr || "0", isRad)) || 0;
      setMemory((prev) => prev + currentVal);
      setMemoryActive(true);
      return;
    }
    if (key === "M-") {
      const currentVal = Number(safeEval(expr || "0", isRad)) || 0;
      setMemory((prev) => prev - currentVal);
      setMemoryActive(true);
      return;
    }

    // 8. Shift / 2nd Toggle
    if (key === "SHIFT") {
      setIsShift((prev) => !prev);
      return;
    }

    // 9. DEG / RAD & Mode Toggles
    if (key === "DEG") {
      setIsRad(false);
      return;
    }
    if (key === "RAD") {
      setIsRad(true);
      return;
    }
    if (key === "MODE") {
      setIsRad((prev) => !prev);
      return;
    }

    // 10. Scientific Function Injections
    const functionMap = {
      "sin": "sin(",
      "cos": "cos(",
      "tan": "tan(",
      "sin\u207B\u00B9": "asin(",
      "cos\u207B\u00B9": "acos(",
      "tan\u207B\u00B9": "atan(",
      "log": "log(",
      "ln": "ln(",
      "\u221A": "\u221A(",
      "\u221B": "\u221B(",
      "x\u00B2": "^2",
      "x\u00B3": "^3",
      "x\u02B8": "^",
      "10\u02E3": "10^",
      "e\u02E3": "e^",
      "1/x": "^(-1)",
      "|x|": "abs(",
      "x!": "!",
      "\u03C0": "\u03C0",
      "e": "e",
      "%": "%",
      "(": "(",
      ")": ")"
    };

    if (functionMap[key]) {
      setExpr((prev) => prev + functionMap[key]);
      return;
    }

    // 11. Standard Arithmetic Operators
    const operators = ["\u00F7", "\u00D7", "\u2212", "+", "/", "*", "-"];
    if (operators.includes(key)) {
      const mappedOp = key === "/" ? "\u00F7" : key === "*" ? "\u00D7" : key === "-" ? "\u2212" : key;
      setExpr((prev) => {
        if (!prev && mappedOp === "\u2212") return "\u2212";
        if (!prev) return "";
        const lastChar = prev.slice(-1);
        if (["\u00F7", "\u00D7", "\u2212", "+"].includes(lastChar)) {
          return prev.slice(0, -1) + mappedOp;
        }
        return prev + mappedOp;
      });
      return;
    }

    // 12. Decimal Point
    if (key === ".") {
      setExpr((prev) => {
        const segments = prev.split(/[\u00F7\u00D7\u2212+^()]/);
        const last = segments[segments.length - 1] || "";
        if (last.includes(".")) return prev;
        if (!last) return prev + "0.";
        return prev + ".";
      });
      return;
    }

    // 13. Digits: Max 16 digits per number segment without an arithmetic operator
    if (/^[0-9]$/.test(key)) {
      setExpr((prev) => {
        const segments = prev.split(/[\u00F7\u00D7\u2212+^()*,/]/);
        const last = segments[segments.length - 1] || "";
        const digitCount = (last.match(/\d/g) || []).length;
        if (digitCount >= 16) return prev;
        if (last === "0") return prev.slice(0, -1) + key;
        return prev + key;
      });
      return;
    }

    setExpr((prev) => prev + key);
  }, [expr, isRad, safeEval, saveToHistory, playClickSound, memory, memoryActive]);

  const copyResult = () => {
    const textToCopy = String(liveResult).replace(/,/g, "");
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const onKeyDown = (e) => {
      if (isDrawerOpen || isHelpOpen) {
        if (e.key === "Escape") {
          setIsDrawerOpen(false);
          setIsHelpOpen(false);
        }
        return;
      }

      if (e.key === "Escape") {
        if (isMobileHistoryOpen) {
          setIsMobileHistoryOpen(false);
          return;
        }
        handlePress("AC");
        return;
      }

      if ((e.key === "h" || e.key === "H") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        if (isDesktop) {
          setCompanionTab("history");
        } else {
          setIsMobileHistoryOpen((prev) => !prev);
        }
        return;
      }

      const keyMap = {
        "*": "\u00D7",
        "/": "\u00F7",
        "-": "\u2212",
        "+": "+",
        "Enter": "=",
        "=": "=",
        "%": "%",
        "Backspace": "DEL",
        "Delete": "AC",
        "c": "C",
        "C": "C",
        "^": "^",
        "(": "(",
        ")": ")",
        "!": "!"
      };

      if (/^[0-9.]$/.test(e.key)) {
        e.preventDefault();
        handlePress(e.key);
      } else if (keyMap[e.key]) {
        e.preventDefault();
        handlePress(keyMap[e.key]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlePress, isDrawerOpen, isHelpOpen, isMobileHistoryOpen, isDesktop]);

  const triggerQuickSearch = () => {
    setIsDrawerOpen(false);
    window.dispatchEvent(new Event("stiknex_open_quick_search"));
  };
  const triggerFeedback = () => {
    setIsDrawerOpen(false);
    window.dispatchEvent(new Event("stiknex_open_feedback"));
  };

  return (
    <div className="fixed inset-0 lg:relative lg:inset-auto w-full h-[100dvh] lg:min-h-screen pb-14 md:pb-0 flex flex-col justify-between overflow-y-auto no-scrollbar select-none font-sans bg-gradient-to-b from-[#EBF2F9] via-[#E2EDF7] to-[#D6E5F2] dark:from-[#0B1017] dark:via-[#080D14] dark:to-[#05090F] text-slate-800 dark:text-slate-100 transition-colors duration-300">

      {/* ═════════════════════════════════════════════════════════════════════
          DESKTOP VIEW (>= lg): DUAL STATION (Matching Reference Image)
      ══════════════════════════════════════════════════════════════════════ */}
      {isDesktop ? (
        <div className="w-full flex-1 flex flex-col justify-between min-h-0">
          {/* Top Full-Width Sticky Navigation Header */}
          <div className="w-full px-4 lg:px-8 py-3 sm:py-3.5 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-[#0B111E]/85 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between gap-4 shadow-xs dark:shadow-none transition-colors">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-xs transition-all flex items-center justify-center cursor-pointer group"
                  title="Open Stiknex Menu & Tools"
                  aria-label="Open Stiknex Menu"
                >
                  <Menu size={20} className="group-hover:scale-105 transition-transform" />
                </button>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25 ring-1 ring-white/20 shrink-0">
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 uppercase leading-none">
                        <span>Scientific</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">Calculator</span>
                      </h1>
                      <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 border border-blue-200/60 dark:border-blue-800/60 tracking-wider uppercase">
                        {isRad ? "RAD MODE" : "DEG MODE"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium mt-0.5">
                      Accurate. Powerful. 50+ Real Scientific Functions &amp; Constant Tape
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                  title="Toggle Light / Dark Theme"
                >
                  {darkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                    soundEnabled
                      ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400"
                      : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-400 dark:text-slate-500"
                  }`}
                  title={soundEnabled ? "Mute audio" : "Enable sound"}
                >
                  {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                </button>

                <button
                  type="button"
                  onClick={() => handlePress("AC")}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-500 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-900 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                  title="Reset (AC)"
                >
                  <RotateCcw size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsHelpOpen(true)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                  title="Help & Guide (?)"
                >
                  <HelpCircle size={15} />
                </button>
              </div>
            </div>

          {/* Full-Page Desktop Workstation */}
          <main className="w-full flex-1 px-4 lg:px-8 py-4 lg:py-6 flex flex-col justify-between min-h-0">
            <div className="grid grid-cols-12 gap-5 lg:gap-6 w-full flex-1">

              {/* LEFT COLUMN: SCIENTIFIC TERMINAL & EXACT REFERENCE KEYPAD */}
              <div className="col-span-12 lg:col-span-7 xl:col-span-8 flex flex-col justify-between space-y-3 rounded-3xl p-5 lg:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-white/70 dark:border-white/5 bg-[#EBF2F9]/90 dark:bg-[#0D141F] flex-1">
                {/* Soft Screen Display Terminal */}
                <div className="w-full rounded-2xl p-4 bg-white/95 dark:bg-[#070C13] border border-white/90 dark:border-white/5 shadow-inner shadow-black/5 dark:shadow-black/50 text-right">
                  <div className="flex items-center justify-between pb-1.5 text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsRad(false)}
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wider transition cursor-pointer ${
                          !isRad ? "bg-blue-600 text-white shadow-xs" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        DEG
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRad(true)}
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wider transition cursor-pointer ${
                          isRad ? "bg-blue-600 text-white shadow-xs" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        RAD
                      </button>

                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wider transition ${
                        memoryActive ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"
                      }`}>
                        M
                      </span>

                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                        SCI
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={copyResult}
                      aria-label={copied ? "Copied" : "Copy calculated result"}
                      title={copied ? "Copied" : "Copy calculated result"}
                      className="flex items-center justify-center w-6 h-6 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    </button>
                  </div>

                  <div className="w-full min-h-[32px] max-h-[64px] overflow-y-auto no-scrollbar py-0.5">
                    <div className="text-base font-mono font-medium text-slate-600 dark:text-slate-300 break-all tracking-wide">
                      {expr || (lastCalculated !== null ? String(lastCalculated) : " ")}
                    </div>
                  </div>

                  <div className="w-full text-right pt-0.5">
                    <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight break-all font-mono">
                      {formattedResult}
                    </div>
                  </div>
                </div>

                {/* ══ EXACT KEYPAD MATCHING REFERENCE IMAGE media_1794499810349_e86ad606.jpg ══ */}
                <div className="space-y-1.5 text-xs font-bold">
                  {/* Row 1 (8 cols): SHIFT, DEG, RAD, sin⁻¹, cos⁻¹, tan⁻¹, log, ln */}
                  <div className="grid grid-cols-8 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handlePress("SHIFT")}
                      className={`h-10 rounded-xl transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95 ${
                        isShift
                          ? "bg-amber-500 text-white font-black"
                          : "bg-[#1E2633] text-amber-400 hover:bg-[#253040]"
                      }`}
                    >
                      SHIFT
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePress("DEG")}
                      className={`h-10 rounded-xl transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95 ${
                        !isRad ? "bg-[#1D8BF1] text-white font-black shadow-blue-500/30" : "bg-[#161F2C] text-slate-300 hover:bg-[#1E2B3D]"
                      }`}
                    >
                      DEG
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePress("RAD")}
                      className={`h-10 rounded-xl transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95 ${
                        isRad ? "bg-[#1D8BF1] text-white font-black shadow-blue-500/30" : "bg-[#161F2C] text-slate-300 hover:bg-[#1E2B3D]"
                      }`}
                    >
                      RAD
                    </button>
                    <button type="button" onClick={() => handlePress(isShift ? "sin" : "sin\u207B\u00B9")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      {isShift ? "sin" : "sin⁻¹"}
                    </button>
                    <button type="button" onClick={() => handlePress(isShift ? "cos" : "cos\u207B\u00B9")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      {isShift ? "cos" : "cos⁻¹"}
                    </button>
                    <button type="button" onClick={() => handlePress(isShift ? "tan" : "tan\u207B\u00B9")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      {isShift ? "tan" : "tan⁻¹"}
                    </button>
                    <button type="button" onClick={() => handlePress("log")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      log
                    </button>
                    <button type="button" onClick={() => handlePress("ln")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      ln
                    </button>
                  </div>

                  {/* Row 2 (9 cols): MODE, x!, √, ∛, x², x³, xʸ, 10ˣ, eˣ */}
                  <div className="grid grid-cols-9 gap-1.5">
                    <button type="button" onClick={() => handlePress("MODE")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95 text-[11px]">
                      MODE
                    </button>
                    <button type="button" onClick={() => handlePress("x!")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      x!
                    </button>
                    <button type="button" onClick={() => handlePress("\u221A")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      √
                    </button>
                    <button type="button" onClick={() => handlePress("\u221B")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      ∛
                    </button>
                    <button type="button" onClick={() => handlePress("x\u00B2")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      x²
                    </button>
                    <button type="button" onClick={() => handlePress("x\u00B3")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      x³
                    </button>
                    <button type="button" onClick={() => handlePress("x\u02B8")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      xʸ
                    </button>
                    <button type="button" onClick={() => handlePress("10\u02E3")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      10ˣ
                    </button>
                    <button type="button" onClick={() => handlePress("e\u02E3")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      eˣ
                    </button>
                  </div>

                  {/* Row 3 (9 cols): sin, cos, tan, (, ), %, 1/x, |x|, π */}
                  <div className="grid grid-cols-9 gap-1.5">
                    <button type="button" onClick={() => handlePress("sin")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      sin
                    </button>
                    <button type="button" onClick={() => handlePress("cos")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      cos
                    </button>
                    <button type="button" onClick={() => handlePress("tan")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      tan
                    </button>
                    <button type="button" onClick={() => handlePress("(")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      (
                    </button>
                    <button type="button" onClick={() => handlePress(")")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      )
                    </button>
                    <button type="button" onClick={() => handlePress("%")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      %
                    </button>
                    <button type="button" onClick={() => handlePress("1/x")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      1/x
                    </button>
                    <button type="button" onClick={() => handlePress("|x|")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      |x|
                    </button>
                    <button type="button" onClick={() => handlePress("\u03C0")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      π
                    </button>
                  </div>

                  {/* Row 4: MC, MR, M+, M-, [gap], C, CE */}
                  <div className="grid grid-cols-8 gap-1.5">
                    <button type="button" onClick={() => handlePress("MC")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      MC
                    </button>
                    <button type="button" onClick={() => handlePress("MR")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      MR
                    </button>
                    <button type="button" onClick={() => handlePress("M+")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      M+
                    </button>
                    <button type="button" onClick={() => handlePress("M-")} className="h-10 rounded-xl bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      M-
                    </button>
                    <div className="col-span-2"></div>
                    <button type="button" onClick={() => handlePress("C")} className="col-span-1 h-10 rounded-xl bg-[#E84E65] hover:bg-[#D93F56] text-white font-bold transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      C
                    </button>
                    <button type="button" onClick={() => handlePress("CE")} className="col-span-1 h-10 rounded-xl bg-[#E84E65] hover:bg-[#D93F56] text-white font-bold transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
                      CE
                    </button>
                  </div>

                  {/* Main Numpad & Operators with Tall '=' Blue Button */}
                  <div className="grid grid-cols-7 gap-1.5 text-base font-bold">
                    {/* Row 5: 7, 8, 9, ÷, AC (2 cols wide), ⌫ */}
                    <button type="button" onClick={() => handlePress("7")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95">
                      7
                    </button>
                    <button type="button" onClick={() => handlePress("8")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95">
                      8
                    </button>
                    <button type="button" onClick={() => handlePress("9")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95">
                      9
                    </button>
                    <button type="button" onClick={() => handlePress("\u00F7")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-slate-200 transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95 text-lg">
                      ÷
                    </button>
                    <button type="button" onClick={() => handlePress("AC")} className="col-span-2 h-11 rounded-xl bg-[#E84E65] hover:bg-[#D93F56] text-white font-bold transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95">
                      AC
                    </button>
                    <button type="button" onClick={() => handlePress("DEL")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95">
                      <Delete size={18} />
                    </button>

                    {/* Row 6: 4, 5, 6, ×, +, [Tall '=' top] */}
                    <button type="button" onClick={() => handlePress("4")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95">
                      4
                    </button>
                    <button type="button" onClick={() => handlePress("5")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95">
                      5
                    </button>
                    <button type="button" onClick={() => handlePress("6")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95">
                      6
                    </button>
                    <button type="button" onClick={() => handlePress("\u00D7")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-slate-200 transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95 text-lg">
                      ×
                    </button>
                    <button type="button" onClick={() => handlePress("+")} className="col-span-2 h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95 text-lg">
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePress("=")}
                      className="row-span-3 h-full rounded-2xl bg-[#0080FF] hover:bg-[#0070E0] active:bg-[#0060C0] text-white font-black text-3xl shadow-[0_6px_22px_rgba(0,128,255,0.45)] transition flex items-center justify-center cursor-pointer active:scale-95"
                    >
                      =
                    </button>

                    {/* Row 7: 1, 2, 3, −, − */}
                    <button type="button" onClick={() => handlePress("1")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95">
                      1
                    </button>
                    <button type="button" onClick={() => handlePress("2")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95">
                      2
                    </button>
                    <button type="button" onClick={() => handlePress("3")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95">
                      3
                    </button>
                    <button type="button" onClick={() => handlePress("\u2212")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-slate-200 transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95 text-lg">
                      −
                    </button>
                    <button type="button" onClick={() => handlePress("\u2212")} className="col-span-2 h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95 text-lg">
                      −
                    </button>

                    {/* Row 8: 0, ., +/-, + */}
                    <button type="button" onClick={() => handlePress("0")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95">
                      0
                    </button>
                    <button type="button" onClick={() => handlePress(".")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95">
                      .
                    </button>
                    <button type="button" onClick={() => handlePress("+/-")} className="h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-slate-200 transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95 text-xs">
                      +/-
                    </button>
                    <button type="button" onClick={() => handlePress("+")} className="col-span-3 h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95 text-lg">
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: COMPANION PANEL (History & Memory with Quick Actions) */}
              <div className="hidden lg:flex col-span-12 lg:col-span-5 xl:col-span-4 flex-col justify-between rounded-3xl p-5 bg-[#EBF2F9]/90 dark:bg-[#0D141F] border border-white/70 dark:border-white/5 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
                <div className="flex-1 flex flex-col justify-between rounded-2xl p-4 bg-[#090E16] border border-white/5 shadow-inner shadow-black/50">
                {/* Panel Header: Tabs & Actions */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCompanionTab("history")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        companionTab === "history"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Clock size={13} />
                      <span>History</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompanionTab("memory")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        companionTab === "memory"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Database size={13} />
                      <span>Memory</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={exportHistory}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-white/5 transition cursor-pointer"
                      title="Export History (JSON)"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={clearHistory}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-950/30 transition cursor-pointer"
                      title="Clear History"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Panel Body: Scrollable History or Memory */}
                <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-2 h-[340px]">
                  {companionTab === "history" ? (
                    history.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500">
                        <Clock size={36} className="opacity-30 mb-2 stroke-1" />
                        <p className="text-xs font-bold">No History Recorded</p>
                        <p className="text-[11px] opacity-75 mt-1 max-w-[200px]">
                          Evaluated scientific equations will appear here automatically.
                        </p>
                      </div>
                    ) : (
                      history.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="group p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                            <span className="truncate max-w-[180px]">{item.expression}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] opacity-70">{formatHistoryTime(item.timestamp)}</span>
                              <button
                                type="button"
                                onClick={(e) => copyHistoryResult(item.result, idx, e)}
                                className="p-0.5 hover:text-blue-400 transition cursor-pointer"
                                title="Copy Result"
                              >
                                {copiedItemIdx === idx ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => restoreHistoryItem(item, "expression")}
                              className="text-[11px] font-semibold text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                              title="Reuse expression"
                            >
                              Insert
                            </button>
                            <button
                              type="button"
                              onClick={() => restoreHistoryItem(item, "result")}
                              className="text-right font-mono font-black text-sm text-cyan-400 hover:underline transition cursor-pointer"
                              title="Use result"
                            >
                              = {formatNumberWithCommas(item.result)}
                            </button>
                          </div>
                        </div>
                      ))
                    )
                  ) : (
                    /* Memory Tab */
                    <div className="p-3 space-y-3">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Current Memory Register
                        </span>
                        <div className="text-2xl font-mono font-black text-white mt-1">
                          {formatNumberWithCommas(memory)}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 text-xs font-bold pt-2">
                        <button type="button" onClick={() => handlePress("MR")} className="py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer shadow-xs">
                          Recall (MR)
                        </button>
                        <button type="button" onClick={() => handlePress("M+")} className="py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition cursor-pointer">
                          Add (M+)
                        </button>
                        <button type="button" onClick={() => handlePress("M-")} className="py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition cursor-pointer">
                          Sub (M-)
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePress("MC")}
                        className="w-full py-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-950/60 text-xs font-bold transition cursor-pointer"
                      >
                        Clear Memory (MC)
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Actions Bar at Bottom */}
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Quick Actions
                  </span>
                  <div className="grid grid-cols-4 gap-1 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={copyResult}
                      className="py-1.5 px-1 rounded-lg bg-white/5 text-slate-300 hover:bg-blue-950/40 hover:text-blue-400 transition flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Copy size={12} />
                      <span className="truncate">Copy Result</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(expr);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      }}
                      className="py-1.5 px-1 rounded-lg bg-white/5 text-slate-300 hover:bg-blue-950/40 hover:text-blue-400 transition flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Copy size={12} />
                      <span className="truncate">Copy Expr</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePaste}
                      className="py-1.5 px-1 rounded-lg bg-white/5 text-slate-300 hover:bg-blue-950/40 hover:text-blue-400 transition flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <ClipboardPaste size={12} />
                      <span className="truncate">Paste</span>
                    </button>
                    <button
                      type="button"
                      onClick={clearHistory}
                      className="py-1.5 px-1 rounded-lg bg-white/5 text-slate-300 hover:bg-rose-950/40 hover:text-rose-400 transition flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span className="truncate">Clear</span>
                    </button>
                  </div>
                </div>
                </div>
              </div>

            </div>
          </main>

          {/* Bottom Safe-Area Footer */}
          <footer className="w-full text-center pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.5rem))] sm:pb-6 pt-2">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              Stiknex Scientific Engine • High Precision In-Browser Arithmetic &amp; Mathematics
            </p>
          </footer>
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════════════
            MOBILE VIEW (< lg): MATCHING REFERENCE IMAGE media_1794498111620_c31d2b83.png
            Keypad anchored at bottom with pb-8 clearance, zero jumping UI!
        ══════════════════════════════════════════════════════════════════════ */
        <main className="w-full flex-1 h-full flex flex-col justify-between p-0 overflow-y-auto no-scrollbar">
          <div className="w-full max-w-md h-full flex flex-col justify-between px-3.5 pt-2 pb-1 sm:pb-2 mx-auto relative transition-all">

            {/* Top Bar: Menu, Badge, History & Theme */}
            <div className="shrink-0 flex items-center justify-between pt-1 pb-2 px-1 border-b border-black/5 dark:border-white/5">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer bg-white/80 hover:bg-white text-slate-700 shadow-xs border border-slate-200/80 dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/5 dark:text-slate-200"
                title="Open Stiknex Menu & Tools"
              >
                <Menu size={20} />
              </button>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 shadow-xs">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-xs">
                  <Calculator size={11} className="text-white" />
                </div>
                <h1 className="text-xs font-black tracking-wide uppercase text-slate-800 dark:text-slate-200 m-0 p-0 inline">
                  Scientific Calculator
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMobileHistoryOpen((prev) => !prev)}
                  className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow ${
                    isMobileHistoryOpen
                      ? "bg-blue-600 text-white shadow-blue-500/25"
                      : "bg-white/70 hover:bg-white text-slate-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200"
                  }`}
                >
                  <History size={18} />
                  {history.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {history.length > 9 ? "9+" : history.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer bg-white/70 hover:bg-white text-slate-700 shadow-sm hover:shadow dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200"
                >
                  {darkMode ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} className="text-indigo-600" />}
                </button>
              </div>
            </div>

            {/* Screen Display Area (Mobile) */}
            <div className="flex-1 flex flex-col justify-between text-right px-2 py-0.5 min-h-[80px] overflow-hidden">
              <div className="shrink-0 flex items-center justify-between pb-1">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsRad((prev) => !prev)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer shadow-xs ${
                      !isRad
                        ? "bg-blue-600 text-white"
                        : "bg-white/80 dark:bg-white/10 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {!isRad ? "DEG" : "RAD"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsShift((prev) => !prev)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                      isShift
                        ? "bg-amber-500 text-white"
                        : "bg-white/80 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    2nd
                  </button>

                  {memoryActive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                      M
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={copyResult}
                  aria-label={copied ? "Copied" : "Copy calculated result"}
                  title={copied ? "Copied" : "Copy calculated result"}
                  className="flex items-center justify-center w-7 h-7 rounded-full transition-all cursor-pointer bg-white/80 hover:bg-white text-slate-600 hover:text-blue-600 shadow-xs dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-300 dark:hover:text-blue-400"
                >
                  {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                </button>
              </div>

              {/* Middle Expression Tape */}
              <div className="flex-1 min-h-[20px] flex flex-col justify-end text-right overflow-y-auto no-scrollbar py-0">
                <div className="text-base sm:text-lg font-medium text-slate-500 dark:text-slate-400 tracking-wider break-all leading-snug text-right select-text font-mono">
                  {expr || (lastCalculated !== null ? String(lastCalculated) : " ")}
                </div>
              </div>

              {/* Result Display */}
              <div className="shrink-0 text-right py-0 overflow-x-auto no-scrollbar">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight whitespace-nowrap select-all font-mono inline-flex items-baseline justify-end">
                  <span className="text-slate-400 dark:text-slate-500 font-light mr-1.5 text-xl sm:text-2xl">=</span>
                  <span>{formattedResult}</span>
                </div>
              </div>
            </div>

            {/* Keypad Grid (Mobile: 100% Matching All Buttons from Reference Image media_1794500673378_d8862d63.jpg) */}
            <div className="shrink-0 w-full pt-1 pb-1 sm:pb-2 space-y-1">
              {/* Row 1 (6 cols): SHIFT, DEG, RAD, sin⁻¹, cos⁻¹, tan⁻¹ */}
              <div className="grid grid-cols-6 gap-1 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => handlePress("SHIFT")}
                  className={`h-7 sm:h-8 rounded-lg transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95 ${
                    isShift
                      ? "bg-amber-500 text-white font-black shadow-amber-500/30"
                      : "bg-[#1E2633] text-amber-400 hover:bg-[#253040] dark:bg-[#1E2633] dark:text-amber-400"
                  }`}
                >
                  SHIFT
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("DEG")}
                  className={`h-7 sm:h-8 rounded-lg transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95 ${
                    !isRad
                      ? "bg-[#1D8BF1] text-white font-black shadow-blue-500/30"
                      : "bg-[#161F2C] text-slate-300 hover:bg-[#1E2B3D] dark:bg-[#161F2C] dark:text-slate-300"
                  }`}
                >
                  DEG
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("RAD")}
                  className={`h-7 sm:h-8 rounded-lg transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95 ${
                    isRad
                      ? "bg-[#1D8BF1] text-white font-black shadow-blue-500/30"
                      : "bg-[#161F2C] text-slate-300 hover:bg-[#1E2B3D] dark:bg-[#161F2C] dark:text-slate-300"
                  }`}
                >
                  RAD
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("sin\u207B\u00B9")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  sin⁻¹
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("cos\u207B\u00B9")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  cos⁻¹
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("tan\u207B\u00B9")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  tan⁻¹
                </button>
              </div>

              {/* Row 2 (6 cols): sin, cos, tan, log, ln, MODE */}
              <div className="grid grid-cols-6 gap-1 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => handlePress("sin")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  sin
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("cos")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  cos
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("tan")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  tan
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("log")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  log
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("ln")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  ln
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("MODE")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95 text-[10px]"
                >
                  MODE
                </button>
              </div>

              {/* Row 3 (6 cols): x!, √, ∛, x², x³, xʸ */}
              <div className="grid grid-cols-6 gap-1 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => handlePress("x!")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  x!
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("\u221A")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  √
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("\u221B")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  ∛
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("x\u00B2")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  x²
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("x\u00B3")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  x³
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("x\u02B8")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  xʸ
                </button>
              </div>

              {/* Row 4 (6 cols): 10ˣ, eˣ, (, ), 1/x, |x| */}
              <div className="grid grid-cols-6 gap-1 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => handlePress("10\u02E3")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  10ˣ
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("e\u02E3")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  eˣ
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("(")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95 text-xs"
                >
                  (
                </button>
                <button
                  type="button"
                  onClick={() => handlePress(")")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95 text-xs"
                >
                  )
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("1/x")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  1/x
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("|x|")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  |x|
                </button>
              </div>

              {/* Row 5 (6 cols): MC, MR, M+, M-, π, % */}
              <div className="grid grid-cols-6 gap-1 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => handlePress("MC")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  MC
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("MR")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  MR
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("M+")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  M+
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("M-")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  M-
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("\u03C0")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  π
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("%")}
                  className="h-7 sm:h-8 rounded-lg bg-[#161F2C] hover:bg-[#1E2B3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  %
                </button>
              </div>

              {/* Row 6 (6 cols): 7, 8, 9, ÷, C, CE */}
              <div className="grid grid-cols-6 gap-1 font-bold">
                <button
                  type="button"
                  onClick={() => handlePress("7")}
                  className="h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white dark:bg-[#161F2C] dark:text-white font-bold text-lg transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  7
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("8")}
                  className="h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white dark:bg-[#161F2C] dark:text-white font-bold text-lg transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  8
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("9")}
                  className="h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white dark:bg-[#161F2C] dark:text-white font-bold text-lg transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  9
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("\u00F7")}
                  className="h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-slate-200 dark:bg-[#161F2C] dark:text-slate-200 font-black text-xl transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  ÷
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("C")}
                  className="h-9 sm:h-11 rounded-xl bg-[#E84E65] hover:bg-[#D93F56] text-white font-bold text-sm transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  C
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("CE")}
                  className="h-9 sm:h-11 rounded-xl bg-[#E84E65] hover:bg-[#D93F56] text-white font-bold text-sm transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  CE
                </button>
              </div>

              {/* Row 7 (6 cols): 4, 5, 6, ×, AC, DEL */}
              <div className="grid grid-cols-6 gap-1 font-bold">
                <button
                  type="button"
                  onClick={() => handlePress("4")}
                  className="h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white dark:bg-[#161F2C] dark:text-white font-bold text-lg transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  4
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("5")}
                  className="h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white dark:bg-[#161F2C] dark:text-white font-bold text-lg transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  5
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("6")}
                  className="h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white dark:bg-[#161F2C] dark:text-white font-bold text-lg transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  6
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("\u00D7")}
                  className="h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-slate-200 dark:bg-[#161F2C] dark:text-slate-200 font-black text-xl transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  ×
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("AC")}
                  className="h-9 sm:h-11 rounded-xl bg-[#E84E65] hover:bg-[#D93F56] text-white font-bold text-sm transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  AC
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("DEL")}
                  className="h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white dark:bg-[#161F2C] dark:text-white transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  <Delete size={18} />
                </button>
              </div>

              {/* Row 8 (6 cols): 1, 2, 3, −, +, +/- */}
              <div className="grid grid-cols-6 gap-1 font-bold">
                <button
                  type="button"
                  onClick={() => handlePress("1")}
                  className="h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white dark:bg-[#161F2C] dark:text-white font-bold text-lg transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("2")}
                  className="h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white dark:bg-[#161F2C] dark:text-white font-bold text-lg transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("3")}
                  className="h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white dark:bg-[#161F2C] dark:text-white font-bold text-lg transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  3
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("\u2212")}
                  className="h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-slate-200 dark:bg-[#161F2C] dark:text-slate-200 font-black text-xl transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("+")}
                  className="h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-slate-200 dark:bg-[#161F2C] dark:text-slate-200 font-black text-xl transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("+/-")}
                  className="h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-slate-300 dark:bg-[#161F2C] dark:text-slate-300 font-bold text-xs transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  +/-
                </button>
              </div>

              {/* Row 9 (6 cols): 0 (spans 2), . (spans 1), = (spans 3, wide blue button) */}
              <div className="grid grid-cols-6 gap-1 font-bold">
                <button
                  type="button"
                  onClick={() => handlePress("0")}
                  className="col-span-2 h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white dark:bg-[#161F2C] dark:text-white font-bold text-lg transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => handlePress(".")}
                  className="col-span-1 h-9 sm:h-11 rounded-xl bg-[#161F2C] hover:bg-[#202C3D] text-white dark:bg-[#161F2C] dark:text-white font-bold text-lg transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                >
                  .
                </button>
                <button
                  type="button"
                  onClick={() => handlePress("=")}
                  className="col-span-3 h-9 sm:h-11 rounded-xl bg-[#0080FF] hover:bg-[#0070E0] active:bg-[#0060C0] text-white font-black text-2xl shadow-[0_6px_20px_rgba(0,128,255,0.45)] transition flex items-center justify-center cursor-pointer active:scale-98"
                >
                  =
                </button>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* ─── Mobile History Drawer Modal (< lg) ─── */}
      <AnimatePresence>
        {!isDesktop && isMobileHistoryOpen && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileHistoryOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 260 }}
              className="relative ml-auto w-[85vw] max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">
                    <History size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      Scientific History
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {history.length} saved equations
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {history.length > 0 && (
                    <button
                      type="button"
                      onClick={clearHistory}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                      title="Clear History"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsMobileHistoryOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {history.map((item, idx) => (
                  <div key={item.id || idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                      <span>{formatHistoryTime(item.timestamp)}</span>
                      <button
                        type="button"
                        onClick={(e) => copyHistoryResult(item.result, idx, e)}
                        className="p-1 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {copiedItemIdx === idx ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => restoreHistoryItem(item, "expression")}
                      className="w-full text-right font-mono text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 truncate block"
                    >
                      {item.expression}
                    </button>
                    <button
                      type="button"
                      onClick={() => restoreHistoryItem(item, "result")}
                      className="w-full text-right font-mono font-black text-lg text-slate-900 dark:text-white hover:text-blue-600 truncate block mt-0.5"
                    >
                      = {formatNumberWithCommas(item.result)}
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
                Stored privately in browser local storage
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Universal Stiknex Tool Sidebar Drawer ─── */}
      <ToolSidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        relatedTools={RELATED_CALCULATORS}
        categoryTitle="Related Calculators"
      />

      {/* ─── Help, Formulas & Keyboard Shortcuts Modal ─── */}
      <AnimatePresence>
        {isHelpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHelpOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
            >
              <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                    <Calculator size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      Scientific Calculator Guide
                    </h2>
                    <p className="text-xs text-slate-400">
                      Functions, angle modes, memory & shortcuts
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHelpOpen(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex border-b border-slate-100 dark:border-slate-800 px-5 gap-4 overflow-x-auto no-scrollbar">
                {[
                  { id: "howTo", label: "How to Use" },
                  { id: "functions", label: "Scientific Functions" },
                  { id: "shortcuts", label: "Shortcuts" },
                  { id: "faqs", label: "FAQs" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveHelpTab(tab.id)}
                    className={`py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                      activeHelpTab === tab.id
                        ? "border-blue-600 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed">
                {activeHelpTab === "howTo" && (
                  <ol className="space-y-2.5 text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">1</span>
                      <span><strong>Angle Mode:</strong> Toggle between <strong>DEG</strong> (Degrees) and <strong>RAD</strong> (Radians) for trigonometry (sin, cos, tan).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">2</span>
                      <span><strong>Complex Expressions:</strong> Combine powers (<code>2^10</code>), roots (<code>√(16)</code>), factorials (<code>5!</code>), and logarithms (<code>log(100)</code>).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">3</span>
                      <span><strong>Memory:</strong> Store values with <strong>M+</strong>, <strong>M-</strong>, and recall with <strong>MR</strong>. Active memory is marked with an <strong>M</strong> badge.</span>
                    </li>
                  </ol>
                )}

                {activeHelpTab === "functions" && (
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <strong>sin(x), cos(x), tan(x)</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Trigonometric ratios</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <strong>sin⁻¹, cos⁻¹, tan⁻¹</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Inverse arc trigonometry</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <strong>log(x), ln(x)</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Base-10 & Natural logarithms</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <strong>√(x), ∛(x)</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Square & cube roots</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <strong>x², x³, xʸ</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Powers & custom exponents</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <strong>x! (Factorial)</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">e.g. 5! = 120</p>
                    </div>
                  </div>
                )}

                {activeHelpTab === "shortcuts" && (
                  <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                      <span>0-9, .</span>
                      <span className="font-sans text-slate-400">Numbers</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                      <span>+, -, *, /</span>
                      <span className="font-sans text-slate-400">Operators</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                      <span>^</span>
                      <span className="font-sans text-slate-400">Power (xʸ)</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                      <span>!</span>
                      <span className="font-sans text-slate-400">Factorial</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                      <span>Enter / =</span>
                      <span className="font-sans text-slate-400">Calculate</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                      <span>H</span>
                      <span className="font-sans text-slate-400">Toggle History</span>
                    </div>
                  </div>
                )}

                {activeHelpTab === "faqs" && (
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <h4 className="font-bold text-slate-900 dark:text-white">Does it follow operator precedence (PEMDAS)?</h4>
                      <p className="text-slate-500 mt-1">Yes, operations are evaluated with standard algebraic precedence: Parentheses, Exponents, Multiplication/Division, and Addition/Subtraction.</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <h4 className="font-bold text-slate-900 dark:text-white">Is calculation history saved?</h4>
                      <p className="text-slate-500 mt-1">Yes, all calculations are stored locally in your browser's private localStorage and can be exported as JSON or cleared anytime.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>100% Client-Side Scientific Engine</span>
                <button
                  type="button"
                  onClick={() => setIsHelpOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
