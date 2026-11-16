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
  Calendar,
  Clock,
  Cake,
  Heart,
  Sparkles,
  ArrowRight,
  RotateCcw,
  History,
  Trash2,
  Volume2,
  VolumeX,
  Hourglass,
  CalendarDays,
  Layers,
  Star,
  Activity,
  Calculator
} from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import ToolSidebarDrawer from "../components/ToolSidebarDrawer";
import { formatDateDDMMYYYY, formatHistoryTimestamp } from "../../../utils/dateFormat";

/**
 * Enterprise Chronological Age Calculator & Life Milestones Workstation
 * Full-Page Desktop View (>= lg) + Snug Mobile Chassis (< lg)
 * - Desktop: Full-page dual-station layout with expansive inputs, live countdowns,
 *   granular milestone grids, Western/Chinese Zodiac cards, and companion History & Benchmarks panel.
 * - Mobile: Pinned snug handheld chassis with bottom safe clearance (pb-8) and slide-over panels.
 */

const RELATED_CALCULATORS = [
  { slug: "date-difference-calculator", title: "Date Calculator", icon: "fa-solid fa-calendar-days", desc: "Compute exact calendar and business days between dates" },
  { slug: "time-calculator", title: "Time Calculator", icon: "fa-solid fa-clock", desc: "Add, subtract, and convert hours, minutes, and seconds" },
  { slug: "percentage-calculator", title: "Percentage Calculator", icon: "fa-solid fa-percent", desc: "Fast percentage of value, ratio, change, and discounts" },
  { slug: "basic-calculator", title: "Basic Calculator", icon: "fa-solid fa-calculator", desc: "Clean in-browser arithmetic with calculation tape" },
  { slug: "scientific-calculator", title: "Scientific Calculator", icon: "fa-solid fa-square-root-variable", desc: "High-precision trigonometry, logarithms, and powers" }
];

const HISTORICAL_BENCHMARKS = [
  { age: "22 Years", who: "Isaac Newton", feat: "Developed calculus and laws of motion" },
  { age: "26 Years", who: "Albert Einstein", feat: "Published Theory of Special Relativity" },
  { age: "31 Years", who: "Marie Curie", feat: "Discovered polonium and radium" },
  { age: "33 Years", who: "Alexander the Great", feat: "Conquered the known ancient world" }
];

function getZodiac(month, day) {
  const signs = [
    { sign: "Capricorn", symbol: "♑", from: [12, 22], to: [1, 19] },
    { sign: "Aquarius", symbol: "♒", from: [1, 20], to: [2, 18] },
    { sign: "Pisces", symbol: "♓", from: [2, 19], to: [3, 20] },
    { sign: "Aries", symbol: "♈", from: [3, 21], to: [4, 19] },
    { sign: "Taurus", symbol: "♉", from: [4, 20], to: [5, 20] },
    { sign: "Gemini", symbol: "♊", from: [5, 21], to: [6, 20] },
    { sign: "Cancer", symbol: "♋", from: [6, 21], to: [7, 22] },
    { sign: "Leo", symbol: "♌", from: [7, 23], to: [8, 22] },
    { sign: "Virgo", symbol: "♍", from: [8, 23], to: [9, 22] },
    { sign: "Libra", symbol: "♎", from: [9, 23], to: [10, 22] },
    { sign: "Scorpio", symbol: "♏", from: [10, 23], to: [11, 21] },
    { sign: "Sagittarius", symbol: "♐", from: [11, 22], to: [12, 21] }
  ];
  for (const z of signs) {
    if (
      (month === z.from[0] && day >= z.from[1]) ||
      (month === z.to[0] && day <= z.to[1])
    ) {
      return z;
    }
  }
  return { sign: "Capricorn", symbol: "♑" };
}

function getChineseZodiac(year) {
  const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  const index = (year - 4) % 12;
  return animals[index >= 0 ? index : index + 12];
}

function formatHistoryTime(iso) {
  return formatHistoryTimestamp(iso);
}

export default function AgeCalculator({ tool, seoData }) {
  const { theme, toggleTheme, openFeedback } = useAppContext();

  const [dob, setDob] = useState("2000-01-01");
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Companion Panel Tab
  const [companionTab, setCompanionTab] = useState("history");

  // Common UI State
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Web Audio Tactile Sound
  const audioCtxRef = useRef(null);
  const playClickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(540, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, audioCtxRef.current.currentTime + 0.04);
        gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.04);
      }
    } catch {
      // AudioContext
    }
  }, [soundEnabled]);

  // Persistent History
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("stiknex_age_calc_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveToHistory = useCallback((entry) => {
    setHistory((prev) => {
      const updated = [
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          ...entry
        },
        ...prev.slice(0, 39)
      ];
      try {
        localStorage.setItem("stiknex_age_calc_history", JSON.stringify(updated));
      } catch {
        // quota
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    playClickSound();
    setHistory([]);
    try {
      localStorage.removeItem("stiknex_age_calc_history");
    } catch {
      // ignore
    }
  }, [playClickSound]);

  // Calculation logic
  const ageData = useMemo(() => {
    if (!dob) return null;
    const birth = new Date(dob + "T00:00:00");
    const target = targetDate ? new Date(targetDate + "T00:00:00") : new Date();

    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;
    if (birth > target) return { isFuture: true };

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const approxHeartbeats = totalMinutes * 72; // average 72 bpm
    const approxBreaths = totalMinutes * 16; // average 16 breaths/min

    // Next Birthday countdown
    const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1);
    }
    const daysUntilNext = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
    const nextBdayDayOfWeek = nextBday.toLocaleDateString(undefined, { weekday: "long" });
    const nextBdayFormatted = formatDateDDMMYYYY(nextBday);

    // Zodiac
    const westernZodiac = getZodiac(birth.getMonth() + 1, birth.getDate());
    const chineseZodiac = getChineseZodiac(birth.getFullYear());

    const summary = `${years} Years, ${months} Months, ${days} Days`;

    return {
      isFuture: false,
      years,
      months,
      days,
      summary,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      approxHeartbeats,
      approxBreaths,
      daysUntilNext,
      nextBdayDayOfWeek,
      nextBdayFormatted,
      westernZodiac,
      chineseZodiac
    };
  }, [dob, targetDate]);

  const copyResult = useCallback(() => {
    playClickSound();
    if (!ageData || ageData.isFuture) return;
    navigator.clipboard.writeText(ageData.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    saveToHistory({
      dob,
      result: ageData.summary,
      nextBday: `${ageData.daysUntilNext} days`
    });
  }, [playClickSound, ageData, dob, saveToHistory]);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return RELATED_CALCULATORS;
    const q = searchQuery.toLowerCase();
    return RELATED_CALCULATORS.filter(
      (c) => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* 100% Crawlable Semantic SEO Hidden in DOM */}
      <header className="sr-only">
        <h1>{seoData?.h1 || "Free Online Age Calculator"}</h1>
        <p>{seoData?.description || "Exact chronological age in years, months, days, minutes, next birthday countdown, and life milestones."}</p>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          TOP NAVIGATION BAR (FULL-WIDTH EXPANSIVE)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full px-4 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0B111E]/85 backdrop-blur-xl sticky top-0 z-30 shadow-xs dark:shadow-none transition-colors">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClickSound();
              setSidebarOpen(true);
            }}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-400 shadow-xs transition-all flex items-center justify-center cursor-pointer group"
            title="Open Tools Drawer"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-5 h-5 group-hover:scale-105 transition-transform" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-rose-500/25 ring-1 ring-white/20 shrink-0">
              <Cake className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  Age <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400">Calculator</span>
                </h2>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60 tracking-wider uppercase">
                  Chronological
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium mt-0.5">
                Exact Chronological Age, Life Milestones &amp; Zodiac Determination
              </p>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playClickSound();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-rose-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title={soundEnabled ? "Mute audio" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Help Modal Button */}
          <button
            onClick={() => {
              playClickSound();
              setHelpOpen(true);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title="Help & Calculation Guide (?)"
            aria-label="Open Help Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Mobile History Toggle */}
          <button
            onClick={() => {
              playClickSound();
              setMobileHistoryOpen(true);
            }}
            className="lg:hidden relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-rose-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title="View History"
          >
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-4 text-[10px] font-bold rounded-full bg-rose-600 text-white flex items-center justify-center animate-pulse">
                {history.length}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              playClickSound();
              toggleTheme();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-rose-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title="Toggle Light / Dark Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-rose-600" />}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN WORKSTATION LAYOUT (FULL-SCREEN EXPANSIVE ON DESKTOP)
      ══════════════════════════════════════════════════════════════════ */}
      <main className="w-full flex-1 px-4 lg:px-8 py-4 lg:py-6 flex flex-col justify-between">
        
        {/* Full-Width 12-Column Grid on Desktop */}
        <div className="grid grid-cols-12 gap-5 lg:gap-6 w-full flex-1">
          
          {/* ─────────────────────────────────────────────────────────────
              LEFT / PRIMARY TERMINAL (8 COLS ON DESKTOP)
          ───────────────────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-8 flex flex-col space-y-4 lg:space-y-6">
            
            {/* Input Selection Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Date of Birth
                    </label>
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                      {formatDateDDMMYYYY(dob)}
                    </span>
                  </div>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => {
                      playClickSound();
                      setDob(e.target.value);
                    }}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Age At The Date Of
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {formatDateDDMMYYYY(targetDate)}
                      </span>
                      <button
                        onClick={() => {
                          playClickSound();
                          setTargetDate(new Date().toISOString().split("T")[0]);
                        }}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Today
                      </button>
                    </div>
                  </div>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => {
                      playClickSound();
                      setTargetDate(e.target.value);
                    }}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                  />
                </div>
              </div>

              {/* Quick Preset Dates */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-xs text-slate-400 font-bold mr-1">Sample Birthdays:</span>
                {[
                  { label: "Y2K (2000)", date: "2000-01-01", dmy: "01/01/2000" },
                  { label: "1995", date: "1995-06-15", dmy: "15/06/1995" },
                  { label: "1990", date: "1990-10-24", dmy: "24/10/1990" },
                  { label: "1980", date: "1980-03-12", dmy: "12/03/1980" }
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => {
                      playClickSound();
                      setDob(s.date);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  >
                    {s.label} ({s.dmy})
                  </button>
                ))}
              </div>
            </div>

            {/* HERO EXACT AGE DISPLAY */}
            {ageData && !ageData.isFuture && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 shadow-xl shadow-indigo-100/30 dark:shadow-none text-center relative space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={copyResult}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Exact Age"}</span>
                  </button>
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  Exact Chronological Age
                </span>

                <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                  {ageData.years} <span className="text-xl sm:text-2xl font-bold text-slate-500">Years</span> {ageData.months} <span className="text-xl sm:text-2xl font-bold text-slate-500">Months</span> {ageData.days} <span className="text-xl sm:text-2xl font-bold text-slate-500">Days</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700/60 max-w-md mx-auto">
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    🎉 Next birthday: <strong className="text-indigo-600 dark:text-indigo-400">{ageData.nextBdayFormatted}</strong> (in {ageData.daysUntilNext} days, {ageData.nextBdayDayOfWeek})
                  </p>
                </div>
              </div>
            )}

            {/* COMPREHENSIVE LIFE MILESTONES GRID (Spans full left column) */}
            {ageData && !ageData.isFuture && (
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Cumulative Life Milestones
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Days</span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
                      {ageData.totalDays.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Weeks</span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
                      {ageData.totalWeeks.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Hours</span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
                      {ageData.totalHours.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Minutes</span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
                      {ageData.totalMinutes.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Heartbeats</span>
                    <span className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      ~{(ageData.approxHeartbeats / 1e6).toFixed(1)}M
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Breaths</span>
                    <span className="text-lg sm:text-xl font-black text-purple-600 dark:text-purple-400 font-mono">
                      ~{(ageData.approxBreaths / 1e6).toFixed(1)}M
                    </span>
                  </div>
                </div>

                {/* Zodiac Signs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/60 to-white dark:from-slate-800/60 dark:to-slate-800/20 border border-amber-200/60 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 block">
                        Western Zodiac Sign
                      </span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        {ageData.westernZodiac.sign}
                      </span>
                    </div>
                    <span className="text-3xl">{ageData.westernZodiac.symbol}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/60 to-white dark:from-slate-800/60 dark:to-slate-800/20 border border-purple-200/60 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 block">
                        Chinese Zodiac Animal
                      </span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        Year of the {ageData.chineseZodiac}
                      </span>
                    </div>
                    <Star className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT / COMPANION PANEL (4 COLS ON DESKTOP, MATCHING MOCKUP)
          ───────────────────────────────────────────────────────────── */}
          <div className="hidden lg:flex col-span-4 flex-col justify-between p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-4">
            
            {/* Companion Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => {
                      playClickSound();
                      setCompanionTab("history");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      companionTab === "history"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Saved ({history.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      setCompanionTab("benchmarks");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      companionTab === "benchmarks"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Benchmarks</span>
                  </button>
                </div>

                {companionTab === "history" && history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                    title="Clear History"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Companion Body */}
              <div className="mt-3 space-y-2 overflow-y-auto max-h-[500px] pr-1">
                {companionTab === "history" ? (
                  history.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-xs">
                      <Cake className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="font-bold">No Saved Birthdays</p>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] mx-auto">
                        Copying your age will save your calculation milestone here.
                      </p>
                    </div>
                  ) : (
                    history.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1 hover:border-indigo-400 transition"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                          <span>DOB: {formatDateDDMMYYYY(item.dob)}</span>
                          <span>{formatHistoryTime(item.timestamp)}</span>
                        </div>
                        <div className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between pt-0.5">
                          <span className="truncate pr-2 font-mono">{item.result}</span>
                          <button
                            onClick={() => {
                              playClickSound();
                              navigator.clipboard.writeText(item.result);
                            }}
                            className="p-1 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
                            title="Copy result"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  /* Historical Benchmarks */
                  <div className="space-y-2">
                    {HISTORICAL_BENCHMARKS.map((b) => (
                      <div
                        key={b.who}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                          <span>{b.who}</span>
                          <span className="text-indigo-600 dark:text-indigo-400 text-[11px] font-mono">{b.age}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{b.feat}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={copyResult}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Age</span>
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setHelpOpen(true);
                }}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Guide</span>
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* BOTTOM SAFE-AREA FOOTER CLEARANCE */}
      <footer className="w-full text-center pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.5rem))] sm:pb-6 pt-2">
        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          Stiknex Age Engine • Accurate Chronological &amp; Planetary Time Metrics
        </p>
      </footer>

      {/* FLOATABLE / DRAGGABLE HELP (?) BUTTON */}
      <motion.button
        drag
        dragMomentum={false}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          playClickSound();
          setHelpOpen(true);
        }}
        className="fixed top-20 right-4 z-40 p-3 rounded-full bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-indigo-500/20 cursor-grab active:cursor-grabbing transition-colors"
        title="Age Calculator Guide (Drag anywhere)"
        aria-label="Help Guide"
      >
        <HelpCircle className="w-5 h-5" />
      </motion.button>

      {/* UNIVERSAL STIKNEX TOOL SIDEBAR DRAWER */}
      <ToolSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        relatedTools={RELATED_CALCULATORS}
        categoryTitle="Related Calculators"
        onFeedback={openFeedback}
      />

      {/* MOBILE HISTORY SLIDE-OVER (< lg) */}
      <AnimatePresence>
        {mobileHistoryOpen && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                playClickSound();
                setMobileHistoryOpen(false);
              }}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-84 max-w-[90vw] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Saved Birthdays ({history.length})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title="Clear All History"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      playClickSound();
                      setMobileHistoryOpen(false);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    <Cake className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No saved birthdays yet.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>DOB: {item.dob}</span>
                        <span>{formatHistoryTime(item.timestamp)}</span>
                      </div>
                      <div className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between pt-1">
                        <span className="truncate pr-2 font-mono">{item.result}</span>
                        <button
                          onClick={() => {
                            playClickSound();
                            navigator.clipboard.writeText(item.result);
                          }}
                          className="p-1 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* HELP & FORMULA MODAL */}
      <AnimatePresence>
        {helpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                playClickSound();
                setHelpOpen(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Cake className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Age Calculation Guide
                  </h2>
                </div>
                <button
                  onClick={() => {
                    playClickSound();
                    setHelpOpen(false);
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                    How Chronological Age is Calculated
                  </h3>
                  <p>
                    Age is calculated from your birth date to the target date taking into account variable month lengths (28, 30, or 31 days) and leap years (366 days).
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                    Heartbeats and Breaths Estimation
                  </h3>
                  <p>
                    Based on standard resting human physiological averages: 72 heartbeats per minute and 16 breaths per minute over your total lifespan.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    playClickSound();
                    setHelpOpen(false);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
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
