import { useState, useMemo, useEffect, useRef } from "react";
import { Copy, Check, RotateCcw, Download, Sparkles, ArrowRightLeft, Calendar, Clock, Percent, Calculator } from "lucide-react";
import SimpleCalculator from "../Simplecalculator/Simplecalculator";
import ScientificCalculator from "../Scientificcalculator/Scientificcalculator";
import DateTimeCalculator from "../Datetimecalculator/Datetimecalculator";
import UnitConverter from "../UnitConverter/UnitConverter";
import TemperatureConverter from "../UnitConverter/TemperatureConverter";
import { LENGTH_UNITS, WEIGHT_UNITS } from "../UnitConverter/unitData";

export default function CalculatorsEngine({ toolId, slug }) {
  const [copied, setCopied] = useState(false);

  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. BASIC CALCULATOR
  if (slug === "basic-calculator" || toolId === "basic-calculator") {
    return <SimpleCalculator />;
  }

  // 2. SCIENTIFIC CALCULATOR
  if (slug === "scientific-calculator" || toolId === "scientific-calculator") {
    return <ScientificCalculator />;
  }

  // 3. DATE DIFFERENCE CALCULATOR
  if (slug === "date-difference-calculator" || slug === "date-calculator" || toolId === "date-calculator") {
    return <DateTimeCalculator />;
  }

  // 4. UNIT CONVERTERS
  if (slug === "length-converter" || toolId === "length-converter") {
    return <UnitConverter units={LENGTH_UNITS} defaultUnit="m" />;
  }

  if (slug === "weight-converter" || toolId === "weight-converter") {
    return <UnitConverter units={WEIGHT_UNITS} defaultUnit="kg" />;
  }

  if (slug === "temperature-converter" || toolId === "temperature-converter") {
    return <TemperatureConverter />;
  }

  if (slug === "unit-converter" || toolId === "unit-converter") {
    return <UnitConverter units={LENGTH_UNITS} defaultUnit="m" />;
  }

  // 5. PERCENTAGE CALCULATOR (Big Tool)
  if (slug === "percentage-calculator" || toolId === "percentage-calculator") {
    return <PercentageCalculatorTool copyText={copyText} copied={copied} />;
  }

  // 6. AGE CALCULATOR (Big Tool)
  if (slug === "age-calculator" || toolId === "age-calculator") {
    return <AgeCalculatorTool copyText={copyText} copied={copied} />;
  }

  // 7. TIME CALCULATOR (Big Tool)
  if (slug === "time-calculator" || toolId === "time-calculator") {
    return <TimeCalculatorTool copyText={copyText} copied={copied} />;
  }

  return <SimpleCalculator />;
}

// ============================================================================
// BIG TOOL: PERCENTAGE CALCULATOR
// ============================================================================
function PercentageCalculatorTool({ copyText, copied }) {
  // Mode 1: What is X% of Y?
  const [p1, setP1] = useState(15);
  const [v1, setV1] = useState(250);

  // Mode 2: X is what percent of Y?
  const [p2x, setP2x] = useState(45);
  const [p2y, setP2y] = useState(180);

  // Mode 3: Percentage increase / decrease from X to Y
  const [fromVal, setFromVal] = useState(80);
  const [toVal, setToVal] = useState(120);

  // Computed results
  const res1 = useMemo(() => {
    const val = (Number(p1) / 100) * Number(v1);
    return isNaN(val) ? 0 : Number(val.toFixed(4));
  }, [p1, v1]);

  const res2 = useMemo(() => {
    if (!p2y || Number(p2y) === 0) return 0;
    const val = (Number(p2x) / Number(p2y)) * 100;
    return isNaN(val) ? 0 : Number(val.toFixed(2));
  }, [p2x, p2y]);

  const res3 = useMemo(() => {
    if (!fromVal || Number(fromVal) === 0) return { change: 0, type: "none" };
    const diff = Number(toVal) - Number(fromVal);
    const pct = (diff / Math.abs(Number(fromVal))) * 100;
    return {
      change: Number(Math.abs(pct).toFixed(2)),
      type: diff >= 0 ? "increase" : "decrease",
      diff: Number(diff.toFixed(2))
    };
  }, [fromVal, toVal]);

  return (
    <div className="space-y-8">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: What is X% of Y? */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Basic Percentage</span>
            <Percent size={18} className="text-indigo-500" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">What is X% of Y?</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500">Percentage (X %)</label>
              <input
                type="number"
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Of Total Value (Y)</label>
              <input
                type="number"
                value={v1}
                onChange={(e) => setV1(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Calculated Result</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{res1}</span>
            </div>
            <button
              onClick={() => copyText(res1)}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1.5"
            >
              <Copy size={13} /> Copy
            </button>
          </div>
        </div>

        {/* Card 2: X is what % of Y? */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Ratio Percentage</span>
            <Calculator size={18} className="text-emerald-500" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">X is what % of Y?</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500">Part Value (X)</label>
              <input
                type="number"
                value={p2x}
                onChange={(e) => setP2x(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Whole Value (Y)</label>
              <input
                type="number"
                value={p2y}
                onChange={(e) => setP2y(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Calculated Ratio</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{res2}%</span>
            </div>
            <button
              onClick={() => copyText(`${res2}%`)}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5"
            >
              <Copy size={13} /> Copy
            </button>
          </div>
        </div>

        {/* Card 3: Percentage Change */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Change & Growth</span>
            <ArrowRightLeft size={18} className="text-purple-500" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">% Change from X to Y</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500">Initial Value (From)</label>
              <input
                type="number"
                value={fromVal}
                onChange={(e) => setFromVal(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Final Value (To)</label>
              <input
                type="number"
                value={toVal}
                onChange={(e) => setToVal(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block capitalize">{res3.type}</span>
              <span className={`text-2xl font-black ${res3.type === "increase" ? "text-emerald-600" : "text-rose-600"}`}>
                {res3.type === "increase" ? "+" : "-"}{res3.change}%
              </span>
            </div>
            <button
              onClick={() => copyText(`${res3.change}%`)}
              className="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 flex items-center gap-1.5"
            >
              <Copy size={13} /> Copy
            </button>
          </div>
        </div>
      </div>

      {/* Quick Common Percentage Reference Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Quick Benchmark Table for ${v1}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-center">
          {[5, 10, 15, 20, 25, 50].map((pct) => (
            <div key={pct} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs text-slate-500 font-semibold block">{pct}%</span>
              <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">
                ${((pct / 100) * Number(v1 || 0)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG TOOL: AGE CALCULATOR
// ============================================================================
function AgeCalculatorTool({ copyText, copied }) {
  const [birthDate, setBirthDate] = useState("2000-01-15");
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split("T")[0]);

  const ageData = useMemo(() => {
    if (!birthDate || !targetDate) return null;
    const b = new Date(birthDate);
    const t = new Date(targetDate);
    if (isNaN(b) || isNaN(t) || b > t) return null;

    let years = t.getFullYear() - b.getFullYear();
    let months = t.getMonth() - b.getMonth();
    let days = t.getDate() - b.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(t.getFullYear(), t.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = t.getTime() - b.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    // Next birthday countdown
    const nextBday = new Date(t.getFullYear(), b.getMonth(), b.getDate());
    if (nextBday < t) {
      nextBday.setFullYear(t.getFullYear() + 1);
    }
    const daysToNext = Math.ceil((nextBday.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      daysToNext
    };
  }, [birthDate, targetDate]);

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Date of Birth
          </label>
          <div className="relative">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Age at the Date of
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Primary Result Banner */}
      {ageData ? (
        <div className="space-y-6">
          <div className="p-8 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-3xl text-white shadow-xl shadow-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">
                Your Exact Chronological Age
              </span>
              <div className="text-3xl sm:text-5xl font-black tracking-tight">
                {ageData.years} <span className="text-2xl font-semibold opacity-90">years</span>, {ageData.months} <span className="text-2xl font-semibold opacity-90">months</span>, {ageData.days} <span className="text-2xl font-semibold opacity-90">days</span>
              </div>
              <p className="text-indigo-100 text-sm mt-2">
                🎂 Next Birthday in <strong className="text-white underline">{ageData.daysToNext} days</strong>!
              </p>
            </div>
            <button
              onClick={() => copyText(`${ageData.years} years, ${ageData.months} months, ${ageData.days} days`)}
              className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition shadow-md flex items-center gap-2 shrink-0"
            >
              <Copy size={16} /> Copy Age
            </button>
          </div>

          {/* Granular Milestone Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 block font-semibold">Total Weeks Lived</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{ageData.totalWeeks.toLocaleString()}</span>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 block font-semibold">Total Days Lived</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{ageData.totalDays.toLocaleString()}</span>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 block font-semibold">Total Hours Lived</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{ageData.totalHours.toLocaleString()}</span>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 block font-semibold">Total Minutes Lived</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{ageData.totalMinutes.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-rose-500 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/50">
          Please enter a valid birth date that occurs before the target date.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BIG TOOL: TIME CALCULATOR
// ============================================================================
function TimeCalculatorTool({ copyText, copied }) {
  const [h1, setH1] = useState(8);
  const [m1, setM1] = useState(30);
  const [s1, setS1] = useState(0);

  const [operation, setOperation] = useState("add"); // "add" or "subtract"

  const [h2, setH2] = useState(2);
  const [m2, setM2] = useState(45);
  const [s2, setS2] = useState(30);

  const result = useMemo(() => {
    const totalSec1 = Number(h1) * 3600 + Number(m1) * 60 + Number(s1);
    const totalSec2 = Number(h2) * 3600 + Number(m2) * 60 + Number(s2);
    let diff = operation === "add" ? totalSec1 + totalSec2 : totalSec1 - totalSec2;

    const isNegative = diff < 0;
    diff = Math.abs(diff);

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    const totalHoursFloat = Number((diff / 3600).toFixed(2));
    const totalMinutesFloat = Number((diff / 60).toFixed(1));

    return {
      formatted: `${isNegative ? "-" : ""}${hours}h ${minutes}m ${seconds}s`,
      digital: `${isNegative ? "-" : ""}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      totalHoursFloat,
      totalMinutesFloat,
      totalSeconds: diff
    };
  }, [h1, m1, s1, operation, h2, m2, s2]);

  return (
    <div className="space-y-8">
      {/* Time Calculator Interface */}
      <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        {/* Time 1 Input */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Time 1</label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Hours</span>
              <input
                type="number"
                min="0"
                value={h1}
                onChange={(e) => setH1(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-center text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Minutes</span>
              <input
                type="number"
                min="0"
                max="59"
                value={m1}
                onChange={(e) => setM1(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-center text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Seconds</span>
              <input
                type="number"
                min="0"
                max="59"
                value={s1}
                onChange={(e) => setS1(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-center text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Operation Selector */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setOperation("add")}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition ${
              operation === "add" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            + Add Time
          </button>
          <button
            onClick={() => setOperation("subtract")}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition ${
              operation === "subtract" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            − Subtract Time
          </button>
        </div>

        {/* Time 2 Input */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Time 2</label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Hours</span>
              <input
                type="number"
                min="0"
                value={h2}
                onChange={(e) => setH2(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-center text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Minutes</span>
              <input
                type="number"
                min="0"
                max="59"
                value={m2}
                onChange={(e) => setM2(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-center text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Seconds</span>
              <input
                type="number"
                min="0"
                max="59"
                value={s2}
                onChange={(e) => setS2(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-center text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Result Display */}
      <div className="p-8 bg-indigo-600 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-500/20">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">
            Calculated Duration
          </span>
          <div className="text-4xl sm:text-5xl font-black tracking-tight">
            {result.formatted}
          </div>
          <p className="text-indigo-200 text-sm mt-1">
            Digital: <strong>{result.digital}</strong> | Decimal Hours: <strong>{result.totalHoursFloat} hrs</strong>
          </p>
        </div>
        <button
          onClick={() => copyText(result.formatted)}
          className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition shadow-md flex items-center gap-2 shrink-0"
        >
          <Copy size={16} /> Copy Time
        </button>
      </div>
    </div>
  );
}
