import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Divide,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  PieChart,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react";

/**
 * Euclidean GCD helper
 */
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

/**
 * Least Common Multiple
 */
function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Parses mixed number string (e.g. "2 1/3", "-3 3/4", "5/6", "4") into { num, den }
 */
function parseFractionTerm(str) {
  if (!str) return null;
  const clean = str.trim();
  const isNegative = clean.startsWith("-");
  const absStr = isNegative ? clean.slice(1).trim() : clean;

  // Check if mixed: e.g. "2 1/3" or "2-1/3"
  const mixedParts = absStr.split(/\s+/);
  if (mixedParts.length === 2 && mixedParts[1].includes("/")) {
    const whole = parseInt(mixedParts[0], 10);
    const [numStr, denStr] = mixedParts[1].split("/");
    const num = parseInt(numStr, 10);
    const den = parseInt(denStr, 10);
    if (isNaN(whole) || isNaN(num) || isNaN(den) || den === 0) return null;
    const improperNum = whole * den + num;
    return {
      whole,
      origNum: num,
      origDen: den,
      isMixed: true,
      num: isNegative ? -improperNum : improperNum,
      den
    };
  }

  // Check simple fraction "3/4"
  if (absStr.includes("/")) {
    const [numStr, denStr] = absStr.split("/");
    const num = parseInt(numStr, 10);
    const den = parseInt(denStr, 10);
    if (isNaN(num) || isNaN(den) || den === 0) return null;
    return {
      whole: 0,
      origNum: num,
      origDen: den,
      isMixed: false,
      num: isNegative ? -num : num,
      den
    };
  }

  // Check decimal e.g. "0.75"
  if (absStr.includes(".")) {
    const dec = parseFloat(absStr);
    if (isNaN(dec)) return null;
    const decPlaces = absStr.split(".")[1]?.length || 0;
    const den = Math.pow(10, decPlaces);
    const num = Math.round(dec * den);
    const g = gcd(num, den);
    return {
      whole: 0,
      origNum: num / g,
      origDen: den / g,
      isMixed: false,
      num: isNegative ? -(num / g) : (num / g),
      den: den / g
    };
  }

  // Check pure integer "5"
  const val = parseInt(absStr, 10);
  if (!isNaN(val)) {
    return {
      whole: val,
      origNum: 0,
      origDen: 1,
      isMixed: false,
      num: isNegative ? -val : val,
      den: 1
    };
  }

  return null;
}

export default function NextGenFractionCalculator({ copyText, copied }) {
  // Input Mode: "builder" (Visual Interactive Pad) or "expression" (Smart Text) or "simplify" or "decimal"
  const [activeTab, setActiveTab] = useState("builder");

  // Visual Builder State (Fraction 1 op Fraction 2)
  const [w1, setW1] = useState("");
  const [n1, setN1] = useState("3");
  const [d1, setD1] = useState("4");
  const [op, setOp] = useState("+");
  const [w2, setW2] = useState("");
  const [n2, setN2] = useState("2");
  const [d2, setD2] = useState("3");

  // Expression Mode State
  const [expressionInput, setExpressionInput] = useState("2 1/3 + 3 3/4");

  // Simplifier / Decimal State
  const [simplifyNum, setSimplifyNum] = useState("48");
  const [simplifyDen, setSimplifyDen] = useState("180");
  const [decimalInput, setDecimalInput] = useState("0.625");

  // Gemini AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSolution, setAiSolution] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [showAiPedagogy, setShowAiPedagogy] = useState(true);

  // Compute Builder Solution
  const builderSolution = useMemo(() => {
    const whole1 = parseInt(w1 || "0", 10) || 0;
    const num1 = parseInt(n1 || "0", 10);
    const den1 = parseInt(d1 || "1", 10);

    const whole2 = parseInt(w2 || "0", 10) || 0;
    const num2 = parseInt(n2 || "0", 10);
    const den2 = parseInt(d2 || "1", 10);

    if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2)) {
      return { error: "Please enter valid integers for numerators and denominators." };
    }
    if (den1 === 0 || den2 === 0) {
      return { error: "Denominator cannot be zero (division by zero is undefined)." };
    }

    // Convert both to improper fractions
    const imp1 = whole1 >= 0 ? whole1 * den1 + num1 : whole1 * den1 - num1;
    const imp2 = whole2 >= 0 ? whole2 * den2 + num2 : whole2 * den2 - num2;

    const commonLcm = lcm(den1, den2);
    const scale1 = commonLcm / den1;
    const scale2 = commonLcm / den2;

    let resNum = 0;
    let resDen = commonLcm;
    const steps = [];

    // Step 1: Mixed to improper
    if (whole1 !== 0 || whole2 !== 0) {
      steps.push({
        title: "Convert Mixed Numbers to Improper Fractions",
        detail: `Fraction 1: ${whole1 !== 0 ? `${whole1} ` : ""}${num1}/${den1} = (${whole1} × ${den1} + ${num1}) / ${den1} = ${imp1}/${den1}\nFraction 2: ${whole2 !== 0 ? `${whole2} ` : ""}${num2}/${den2} = (${whole2} × ${den2} + ${num2}) / ${den2} = ${imp2}/${den2}`
      });
    }

    if (op === "+" || op === "-") {
      steps.push({
        title: "Find Least Common Denominator (LCD)",
        detail: `The denominators are ${den1} and ${den2}. LCM(${den1}, ${den2}) = ${commonLcm}.`
      });

      const scaledNum1 = imp1 * scale1;
      const scaledNum2 = imp2 * scale2;

      steps.push({
        title: "Convert to Equivalent Fractions with LCD",
        detail: `${imp1}/${den1} = (${imp1} × ${scale1}) / (${den1} × ${scale1}) = ${scaledNum1}/${commonLcm}\n${imp2}/${den2} = (${imp2} × ${scale2}) / (${den2} × ${scale2}) = ${scaledNum2}/${commonLcm}`
      });

      if (op === "+") {
        resNum = scaledNum1 + scaledNum2;
        steps.push({
          title: "Add Numerators",
          detail: `(${scaledNum1} + ${scaledNum2}) / ${commonLcm} = ${resNum}/${commonLcm}`
        });
      } else {
        resNum = scaledNum1 - scaledNum2;
        steps.push({
          title: "Subtract Numerators",
          detail: `(${scaledNum1} - ${scaledNum2}) / ${commonLcm} = ${resNum}/${commonLcm}`
        });
      }
    } else if (op === "×" || op === "*") {
      resNum = imp1 * imp2;
      resDen = den1 * den2;
      steps.push({
        title: "Multiply Numerators & Denominators Directly",
        detail: `(${imp1} × ${imp2}) / (${den1} × ${den2}) = ${resNum}/${resDen}`
      });
    } else if (op === "÷" || op === "/") {
      if (imp2 === 0) {
        return { error: "Cannot divide by a fraction equal to zero." };
      }
      resNum = imp1 * den2;
      resDen = den1 * imp2;
      if (resDen < 0) {
        resNum = -resNum;
        resDen = -resDen;
      }
      steps.push({
        title: "Multiply by Reciprocal (Flip & Multiply)",
        detail: `(${imp1}/${den1}) ÷ (${imp2}/${den2}) = (${imp1}/${den1}) × (${den2}/${imp2}) = (${imp1} × ${den2}) / (${den1} × ${imp2}) = ${resNum}/${resDen}`
      });
    }

    // Step: Simplify by GCD
    const commonGcd = gcd(resNum, resDen);
    const finalNum = resNum / commonGcd;
    const finalDen = resDen / commonGcd;

    if (commonGcd > 1) {
      steps.push({
        title: `Simplify by Greatest Common Divisor (GCD = ${commonGcd})`,
        detail: `Divide both numerator and denominator by ${commonGcd}:\n${resNum} ÷ ${commonGcd} = ${finalNum}\n${resDen} ÷ ${commonGcd} = ${finalDen}\nSimplified Fraction = ${finalNum}/${finalDen}`
      });
    }

    // Mixed Number representation
    const absFinalNum = Math.abs(finalNum);
    const sign = finalNum < 0 ? "-" : "";
    const wholePart = Math.floor(absFinalNum / finalDen);
    const remainder = absFinalNum % finalDen;
    let mixedStr = "";
    if (finalDen === 1) {
      mixedStr = `${finalNum}`;
    } else if (wholePart > 0 && remainder > 0) {
      mixedStr = `${sign}${wholePart} ${remainder}/${finalDen}`;
    } else if (wholePart > 0 && remainder === 0) {
      mixedStr = `${sign}${wholePart}`;
    } else {
      mixedStr = `${finalNum}/${finalDen}`;
    }

    const decimalVal = (finalNum / finalDen);
    const percentVal = (decimalVal * 100);

    return {
      rawFraction: `${finalNum}/${finalDen}`,
      numerator: finalNum,
      denominator: finalDen,
      mixedNumber: mixedStr,
      decimal: decimalVal.toFixed(4).replace(/\.?0+$/, "") || "0",
      percentage: percentVal.toFixed(2).replace(/\.?0+$/, "") + "%",
      steps,
      lcd: commonLcm,
      gcd: commonGcd
    };
  }, [w1, n1, d1, op, w2, n2, d2]);

  // Request Gemini AI Explanation
  const requestAiTutor = useCallback(async (customInput) => {
    setAiLoading(true);
    setAiError(null);
    setAiSolution(null);

    const problemToSolve = customInput || (
      activeTab === "builder"
        ? `${w1 ? `${w1} ` : ""}${n1}/${d1} ${op} ${w2 ? `${w2} ` : ""}${n2}/${d2}`
        : activeTab === "simplify"
        ? `Simplify fraction ${simplifyNum}/${simplifyDen}`
        : activeTab === "decimal"
        ? `Convert decimal ${decimalInput} to fraction and mixed number`
        : expressionInput
    );

    try {
      const res = await fetch("/api/fraction/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: problemToSolve,
          mode: "fraction"
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAiSolution(json.data);
      } else {
        setAiError(json.error || "Could not retrieve AI solution. Please check network.");
      }
    } catch (err) {
      setAiError(err.message || "Failed to reach AI Math Tutor.");
    } finally {
      setAiLoading(false);
    }
  }, [activeTab, w1, n1, d1, op, w2, n2, d2, expressionInput, simplifyNum, simplifyDen, decimalInput]);

  return (
    <div className="space-y-8">
      {/* Top Engine Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-500/20 dark:border-amber-400/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
              NEXT-GEN FRACTION WORKSTATION
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] border border-indigo-500/20">
              ✨ Gemini AI Tutor Integrated
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Comprehensive Fraction Calculator & Step-by-Step Solver
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Solve, add, subtract, multiply, divide, simplify any fractions, mixed numbers, and complex expressions with instant algorithmic proofs and deep Gemini AI explanations.
          </p>
        </div>

        <button
          onClick={() => requestAiTutor()}
          disabled={aiLoading}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 transition active:scale-95 cursor-pointer disabled:opacity-60 whitespace-nowrap self-stretch md:self-auto justify-center"
        >
          <Sparkles size={16} className={aiLoading ? "animate-spin" : "animate-pulse"} />
          <span>{aiLoading ? "Gemini AI Thinking..." : "✨ Solve with Gemini AI"}</span>
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: "builder", label: "Fraction Arithmetic (+ - × ÷)", icon: <Divide size={15} /> },
          { id: "expression", label: "Smart Expression Solver", icon: <BookOpen size={15} /> },
          { id: "simplify", label: "Fraction Simplifier / GCD", icon: <PieChart size={15} /> },
          { id: "decimal", label: "Decimal / Percent to Fraction", icon: <ArrowRight size={15} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setAiSolution(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === tab.id
                ? "bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-md"
                : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: VISUAL BUILDER */}
      {activeTab === "builder" && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 py-4">
              {/* Fraction 1 Card */}
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Whole</label>
                  <input
                    type="number"
                    value={w1}
                    onChange={(e) => setW1(e.target.value)}
                    placeholder="—"
                    className="w-16 px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-black text-center text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Numerator</label>
                  <input
                    type="number"
                    value={n1}
                    onChange={(e) => setN1(e.target.value)}
                    className="w-20 px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-black text-center text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="w-full h-0.5 bg-slate-400 dark:bg-slate-600 rounded-full" />
                  <input
                    type="number"
                    value={d1}
                    onChange={(e) => setD1(e.target.value)}
                    className="w-20 px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-black text-center text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Denominator</label>
                </div>
              </div>

              {/* Operator Pills */}
              <div className="flex lg:flex-col items-center justify-center gap-2">
                {["+", "-", "×", "÷"].map((operator) => (
                  <button
                    key={operator}
                    onClick={() => setOp(operator)}
                    className={`w-12 h-12 rounded-2xl font-black text-lg transition flex items-center justify-center shadow-sm cursor-pointer ${
                      op === operator
                        ? "bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 scale-105"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {operator}
                  </button>
                ))}
              </div>

              {/* Fraction 2 Card */}
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Whole</label>
                  <input
                    type="number"
                    value={w2}
                    onChange={(e) => setW2(e.target.value)}
                    placeholder="—"
                    className="w-16 px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-black text-center text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Numerator</label>
                  <input
                    type="number"
                    value={n2}
                    onChange={(e) => setN2(e.target.value)}
                    className="w-20 px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-black text-center text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="w-full h-0.5 bg-slate-400 dark:bg-slate-600 rounded-full" />
                  <input
                    type="number"
                    value={d2}
                    onChange={(e) => setD2(e.target.value)}
                    className="w-20 px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-black text-center text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Denominator</label>
                </div>
              </div>

              {/* Equals Arrow */}
              <div className="hidden lg:flex items-center justify-center text-slate-400">
                <ArrowRight size={24} />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex lg:flex-col gap-2">
                <button
                  onClick={() => {
                    setW1("2"); setN1("1"); setD1("3");
                    setOp("+");
                    setW2("3"); setN2("3"); setD2("4");
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-amber-500 transition cursor-pointer"
                >
                  Mixed Example
                </button>
                <button
                  onClick={() => {
                    setW1(""); setN1("3"); setD1("4");
                    setOp("÷");
                    setW2(""); setN2("5"); setD2("6");
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-amber-500 transition cursor-pointer"
                >
                  Divide Example
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SMART EXPRESSION SOLVER */}
      {activeTab === "expression" && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Type or Paste Any Fraction Expression (Mixed, Nested, Chained)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={expressionInput}
                onChange={(e) => setExpressionInput(e.target.value)}
                placeholder="e.g. 2 1/3 + 3 3/4 * (1/2 - 1/5)"
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono font-bold text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={() => requestAiTutor(expressionInput)}
                disabled={aiLoading}
                className="px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 hover:bg-amber-600 transition cursor-pointer active:scale-95 disabled:opacity-60"
              >
                <Sparkles size={16} />
                <span>{aiLoading ? "Solving..." : "Solve with AI"}</span>
              </button>
            </div>

            {/* Quick Math Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-[11px] font-mono text-slate-400">Quick Presets:</span>
              {[
                "2 1/3 + 3 3/4",
                "3/4 * 5/8",
                "(1/2 + 3/4) / (2/3 - 1/6)",
                "7/8 - 2/3 + 5/12",
                "15/4 to mixed"
              ].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setExpressionInput(preset);
                    requestAiTutor(preset);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FRACTION SIMPLIFIER */}
      {activeTab === "simplify" && (
        <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Simplify Any Fraction to Lowest Terms with Greatest Common Divisor (GCD)
          </label>
          <div className="flex items-center justify-center gap-4 py-2">
            <input
              type="number"
              value={simplifyNum}
              onChange={(e) => setSimplifyNum(e.target.value)}
              className="w-32 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono font-black text-center text-slate-900 dark:text-white text-xl"
            />
            <span className="text-2xl font-black text-slate-400">/</span>
            <input
              type="number"
              value={simplifyDen}
              onChange={(e) => setSimplifyDen(e.target.value)}
              className="w-32 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono font-black text-center text-slate-900 dark:text-white text-xl"
            />
            <button
              onClick={() => requestAiTutor(`Simplify the fraction ${simplifyNum}/${simplifyDen} step-by-step with prime factorization and GCD`)}
              className="px-5 py-3 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 hover:bg-amber-600 transition cursor-pointer"
            >
              <Sparkles size={16} /> Explain with AI
            </button>
          </div>

          {/* Instant Local Simplification */}
          {(() => {
            const sn = parseInt(simplifyNum || "0", 10);
            const sd = parseInt(simplifyDen || "1", 10);
            if (sd === 0) return <div className="text-rose-500 font-bold text-center">Denominator cannot be zero.</div>;
            const g = gcd(sn, sd);
            const rNum = sn / g;
            const rDen = sd / g;
            return (
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 block">Simplified Result:</span>
                  <span className="text-2xl font-mono font-black text-slate-900 dark:text-white">
                    {rNum} / {rDen} {rDen === 1 ? `(= ${rNum})` : ""}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-500">
                  <span>Greatest Common Divisor (GCD): </span>
                  <strong className="text-amber-500 font-bold">{g}</strong>
                </div>
                <button
                  onClick={() => copyText(`${rNum}/${rDen}`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <Copy size={13} /> Copy
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 4: DECIMAL TO FRACTION */}
      {activeTab === "decimal" && (
        <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Convert Decimal or Percentage to Simplified Fraction & Mixed Number
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={decimalInput}
              onChange={(e) => setDecimalInput(e.target.value)}
              placeholder="e.g. 0.625 or 45%"
              className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono font-bold text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={() => requestAiTutor(`Convert ${decimalInput} to an exact fraction with step-by-step explanation`)}
              className="px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-amber-600 transition cursor-pointer"
            >
              <Sparkles size={16} /> Explain Conversion
            </button>
          </div>

          {/* Quick Local Converter */}
          {(() => {
            const parsed = parseFractionTerm(decimalInput);
            if (!parsed) return null;
            const g = gcd(parsed.num, parsed.den);
            const num = parsed.num / g;
            const den = parsed.den / g;
            const whole = Math.floor(Math.abs(num) / den);
            const rem = Math.abs(num) % den;
            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-400 block mb-1">Exact Fraction</span>
                  <span className="text-xl font-mono font-black text-slate-900 dark:text-white">{num}/{den}</span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-400 block mb-1">Mixed Number</span>
                  <span className="text-xl font-mono font-black text-slate-900 dark:text-white">
                    {whole > 0 && rem > 0 ? `${whole} ${rem}/${den}` : whole > 0 ? `${whole}` : `${num}/${den}`}
                  </span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-400 block mb-1">Percentage</span>
                  <span className="text-xl font-mono font-black text-slate-900 dark:text-white">
                    {((num / den) * 100).toFixed(2).replace(/\.?0+$/, "")}%
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* INSTANT STEP-BY-STEP RESULT CARD (BUILDER MODE) */}
      {activeTab === "builder" && (
        <div className="space-y-6">
          {builderSolution.error ? (
            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-3">
              <AlertCircle size={20} />
              <span>{builderSolution.error}</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Primary Solution Summary Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-transparent rounded-3xl border border-amber-500/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                      Simplified Fraction
                    </span>
                    <span className="text-3xl font-mono font-black text-slate-900 dark:text-white break-all">
                      {builderSolution.rawFraction}
                    </span>
                  </div>
                  <button
                    onClick={() => copyText(builderSolution.rawFraction)}
                    className="mt-4 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Copy size={13} /> {copied ? "Copied" : "Copy Result"}
                  </button>
                </div>

                <div className="p-6 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Mixed Number
                    </span>
                    <span className="text-3xl font-mono font-black text-slate-900 dark:text-white break-all">
                      {builderSolution.mixedNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => copyText(builderSolution.mixedNumber)}
                    className="mt-4 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Copy size={13} /> Copy
                  </button>
                </div>

                <div className="p-6 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Decimal Value
                    </span>
                    <span className="text-3xl font-mono font-black text-slate-900 dark:text-white break-all">
                      {builderSolution.decimal}
                    </span>
                  </div>
                  <button
                    onClick={() => copyText(builderSolution.decimal)}
                    className="mt-4 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Copy size={13} /> Copy
                  </button>
                </div>

                <div className="p-6 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Percentage
                    </span>
                    <span className="text-3xl font-mono font-black text-slate-900 dark:text-white break-all">
                      {builderSolution.percentage}
                    </span>
                  </div>
                  <button
                    onClick={() => copyText(builderSolution.percentage)}
                    className="mt-4 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Copy size={13} /> Copy
                  </button>
                </div>
              </div>

              {/* Step-by-Step Derivation Flow */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-500" />
                    Algorithmic Step-by-Step Mathematical Solution
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    LCD: {builderSolution.lcd} • GCD: {builderSolution.gcd}
                  </span>
                </div>

                <div className="space-y-3">
                  {builderSolution.steps.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        <span>{st.title}</span>
                      </div>
                      <pre className="text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap pl-7">
                        {st.detail}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GEMINI AI TUTOR SECTION */}
      <AnimatePresence>
        {(aiLoading || aiSolution || aiError) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-amber-50/50 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-amber-950/30 border-2 border-indigo-500/30 shadow-xl space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-200/60 dark:border-indigo-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Sparkles size={20} className={aiLoading ? "animate-spin" : ""} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                      Google Gemini 3.5 AI Tutor
                    </span>
                    <span className="text-xs text-slate-400">• Pedagogical Step-by-Step Breakdown</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    AI Guided Solution & Concept Mastery
                  </h3>
                </div>
              </div>

              {aiSolution && (
                <button
                  onClick={() => setShowAiPedagogy(!showAiPedagogy)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 self-start cursor-pointer"
                >
                  {showAiPedagogy ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  <span>{showAiPedagogy ? "Hide Insights" : "Show Insights"}</span>
                </button>
              )}
            </div>

            {aiLoading && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <Sparkles size={32} className="text-amber-500 animate-spin" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Gemini is analyzing the fraction, determining LCD, reducing terms, and formatting pedagogical steps...
                </p>
              </div>
            )}

            {aiError && (
              <div className="p-4 rounded-2xl bg-rose-50 text-rose-600 font-bold text-sm">
                {aiError}
              </div>
            )}

            {aiSolution && (
              <div className="space-y-6">
                {/* Result Pill Header */}
                <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                  <span className="text-xs font-bold text-slate-400">Problem:</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white">{aiSolution.problem}</span>
                  <span className="text-slate-300 dark:text-slate-700">➔</span>
                  <span className="text-xs font-bold text-slate-400">Final Answer:</span>
                  <span className="font-mono font-black text-amber-500 text-lg">{aiSolution.result?.fraction || aiSolution.result?.mixedNumber}</span>
                  {aiSolution.result?.mixedNumber && aiSolution.result?.mixedNumber !== aiSolution.result?.fraction && (
                    <span className="text-xs font-mono text-slate-500">({aiSolution.result.mixedNumber})</span>
                  )}
                  {aiSolution.result?.decimal && (
                    <span className="text-xs font-mono text-slate-500">• {aiSolution.result.decimal}</span>
                  )}
                </div>

                {/* Gemini Steps */}
                {aiSolution.steps && aiSolution.steps.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Step-by-Step Derivation
                    </h4>
                    {aiSolution.steps.map((st, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black">
                            {st.stepNumber || i + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {st.title}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pl-7 leading-relaxed">
                          {st.explanation}
                        </p>
                        {st.math && (
                          <div className="ml-7 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {st.math}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Pedagogy Insights */}
                {showAiPedagogy && aiSolution.pedagogy && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {aiSolution.pedagogy.keyConcept && (
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 block mb-1">
                          Core Mathematical Concept
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          {aiSolution.pedagogy.keyConcept}
                        </p>
                      </div>
                    )}
                    {aiSolution.pedagogy.realWorldAnalogy && (
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block mb-1">
                          Real-World Analogy
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          {aiSolution.pedagogy.realWorldAnalogy}
                        </p>
                      </div>
                    )}
                    {aiSolution.pedagogy.commonPitfall && (
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 block mb-1">
                          Common Pitfall to Avoid
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          {aiSolution.pedagogy.commonPitfall}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
