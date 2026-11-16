import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sigma,
  Compass
} from "lucide-react";

/**
 * Standard known trigonometric angles lookup in radians and degrees
 */
const KNOWN_TRIG_VALS = {
  sin: {
    "0": { rad: "0", deg: "0°" },
    "0.5": { rad: "π/6, 5π/6", deg: "30°, 150°" },
    "1": { rad: "π/2", deg: "90°" },
    "-0.5": { rad: "7π/6, 11π/6", deg: "210°, 330°" },
    "-1": { rad: "3π/2", deg: "270°" },
    "0.7071": { rad: "π/4, 3π/4", deg: "45°, 135°" },
    "-0.7071": { rad: "5π/4, 7π/4", deg: "225°, 315°" },
    "0.866": { rad: "π/3, 2π/3", deg: "60°, 120°" },
    "-0.866": { rad: "4π/3, 5π/3", deg: "240°, 300°" }
  },
  cos: {
    "1": { rad: "0", deg: "0°" },
    "0.866": { rad: "π/6, 11π/6", deg: "30°, 330°" },
    "0.7071": { rad: "π/4, 7π/4", deg: "45°, 315°" },
    "0.5": { rad: "π/3, 5π/3", deg: "60°, 300°" },
    "0": { rad: "π/2, 3π/2", deg: "90°, 270°" },
    "-0.5": { rad: "2π/3, 4π/3", deg: "120°, 240°" },
    "-0.7071": { rad: "3π/4, 5π/4", deg: "135°, 225°" },
    "-0.866": { rad: "5π/6, 7π/6", deg: "150°, 210°" },
    "-1": { rad: "π", deg: "180°" }
  },
  tan: {
    "0": { rad: "0, π", deg: "0°, 180°" },
    "1": { rad: "π/4, 5π/4", deg: "45°, 225°" },
    "-1": { rad: "3π/4, 7π/4", deg: "135°, 315°" },
    "1.732": { rad: "π/3, 4π/3", deg: "60°, 240°" },
    "-1.732": { rad: "2π/3, 5π/3", deg: "120°, 300°" },
    "0.577": { rad: "π/6, 7π/6", deg: "30°, 210°" },
    "-0.577": { rad: "5π/6, 11π/6", deg: "150°, 330°" }
  }
};

export default function NextGenAlgebraSolver({ copyText, copied }) {
  const [equation, setEquation] = useState("sin(x) + cos(x) = 1");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSolution, setAiSolution] = useState(null);
  const [aiError, setAiError] = useState(null);

  // Quick insertion into equation input
  const insertSymbol = (sym) => {
    setEquation((prev) => prev + sym);
  };

  // Instant Local Mathematical Analyzer
  const localAnalysis = useMemo(() => {
    const raw = equation.trim().replace(/\s+/g, "");
    if (!raw.includes("=")) {
      return {
        type: "Expression / Incomplete",
        error: "Please include an '=' sign (e.g. sin(x) + cos(x) = 1 or 2x + 5 = 15)"
      };
    }

    const [lhs, rhs] = raw.split("=");
    const isTrig = /sin|cos|tan|sec|csc|cot/.test(raw);

    // 1. Basic Single-Function Trig Check: e.g. sin(x) = 0.5 or tan(x) = 1
    if (isTrig) {
      const match = raw.match(/^(sin|cos|tan)\(x\)=([-\d\.\/sqrt]+)$/i);
      if (match) {
        const fn = match[1].toLowerCase();
        let targetValStr = match[2];
        let targetNum = parseFloat(targetValStr);
        if (targetValStr === "1/2") targetNum = 0.5;
        if (targetValStr === "-1/2") targetNum = -0.5;
        if (targetValStr.includes("sqrt(2)/2") || targetValStr.includes("1/sqrt(2)")) targetNum = 0.7071;
        if (targetValStr.includes("sqrt(3)/2")) targetNum = 0.866;
        if (targetValStr.includes("sqrt(3)")) targetNum = 1.732;

        const known = KNOWN_TRIG_VALS[fn]?.[targetNum.toFixed(4)] ||
                      KNOWN_TRIG_VALS[fn]?.[targetNum.toFixed(3)] ||
                      KNOWN_TRIG_VALS[fn]?.[targetNum.toFixed(1)] ||
                      KNOWN_TRIG_VALS[fn]?.[targetNum.toString()];

        if (known) {
          let general = "";
          if (fn === "sin") general = "x = nπ + (-1)ⁿ θ, n ∈ ℤ";
          if (fn === "cos") general = "x = 2kπ ± θ, k ∈ ℤ";
          if (fn === "tan") general = "x = kπ + θ, k ∈ ℤ";

          return {
            type: "Trigonometric Equation (Elementary)",
            roots: [known.rad],
            degrees: [known.deg],
            generalForm: general,
            steps: [
              {
                title: `Isolate Trigonometric Function ${fn}(x)`,
                math: `${fn}(x) = ${targetValStr}`
              },
              {
                title: "Identify Principal Angles on the Unit Circle",
                math: `x = ${known.rad} (${known.deg})`
              },
              {
                title: "Apply Periodic General Solution",
                math: general
              }
            ]
          };
        }
      }

      return {
        type: "Advanced Trigonometric Equation",
        isAdvancedTrig: true,
        steps: [
          {
            title: "Apply Trigonometric Identities & Angle Formulas",
            math: `${lhs} - (${rhs}) = 0`
          },
          {
            title: "Isolate Roots / General Periodic Form",
            math: "Click '✨ Solve with Gemini AI' for deep step-by-step analytical proof and roots!"
          }
        ]
      };
    }

    // 2. Simple Linear: ax + b = c
    const linearMatch = raw.match(/^([+-]?\d*)x([+-]\d+)?=([+-]?\d+)$/);
    if (linearMatch) {
      let aStr = linearMatch[1];
      let a = aStr === "" || aStr === "+" ? 1 : aStr === "-" ? -1 : parseFloat(aStr);
      let b = linearMatch[2] ? parseFloat(linearMatch[2]) : 0;
      let c = parseFloat(linearMatch[3]);

      if (a !== 0) {
        const x = (c - b) / a;
        return {
          type: "Linear Equation",
          roots: [`x = ${x.toFixed(4).replace(/\.?0+$/, "")}`],
          steps: [
            {
              title: "Subtract Constant Term from Both Sides",
              math: `${a}x = ${c} - (${b}) ⟹ ${a}x = ${c - b}`
            },
            {
              title: "Divide Both Sides by Coefficient of x",
              math: `x = (${c - b}) / ${a} ⟹ x = ${x.toFixed(4).replace(/\.?0+$/, "")}`
            }
          ]
        };
      }
    }

    // 3. Simple Quadratic: ax^2 + bx + c = 0
    const quadMatch = raw.match(/^([+-]?\d*)x\^2([+-]\d*x)?([+-]\d+)?=0$/);
    if (quadMatch) {
      let aStr = quadMatch[1];
      let a = aStr === "" || aStr === "+" ? 1 : aStr === "-" ? -1 : parseFloat(aStr);
      let bStr = quadMatch[2] ? quadMatch[2].replace("x", "") : "0";
      let b = bStr === "" || bStr === "+" ? 1 : bStr === "-" ? -1 : parseFloat(bStr);
      let c = quadMatch[3] ? parseFloat(quadMatch[3]) : 0;

      if (a !== 0) {
        const d = b * b - 4 * a * c;
        let roots = [];
        if (d > 0) {
          const r1 = (-b + Math.sqrt(d)) / (2 * a);
          const r2 = (-b - Math.sqrt(d)) / (2 * a);
          roots = [`x₁ = ${r1.toFixed(4).replace(/\.?0+$/, "")}`, `x₂ = ${r2.toFixed(4).replace(/\.?0+$/, "")}`];
        } else if (d === 0) {
          const r = -b / (2 * a);
          roots = [`x = ${r.toFixed(4).replace(/\.?0+$/, "")} (double root)`];
        } else {
          const real = (-b / (2 * a)).toFixed(2);
          const imag = (Math.sqrt(-d) / (2 * a)).toFixed(2);
          roots = [`x = ${real} ± ${imag}i (complex conjugate roots)`];
        }

        return {
          type: "Quadratic Equation",
          roots,
          discriminant: d,
          steps: [
            {
              title: "Identify Coefficients",
              math: `a = ${a}, b = ${b}, c = ${c}`
            },
            {
              title: "Calculate Discriminant Δ = b² - 4ac",
              math: `Δ = (${b})² - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${d}`
            },
            {
              title: "Apply Quadratic Formula: x = (-b ± √Δ) / 2a",
              math: `x = (-(${b}) ± √${d}) / (2 × ${a}) ⟹ ${roots.join(", ")}`
            }
          ]
        };
      }
    }

    // Generic fallback for any other equation
    return {
      type: "Algebraic Equation",
      steps: [
        {
          title: "Standard Equation Form",
          math: `${lhs} = ${rhs}`
        },
        {
          title: "Step-by-Step AI Guidance",
          math: "Click '✨ Solve with Gemini AI' for complete step-by-step deductive steps, identities, and domain analysis."
        }
      ]
    };
  }, [equation]);

  // Request Gemini AI Deep Solver
  const requestAiSolver = useCallback(async (customEq) => {
    setAiLoading(true);
    setAiError(null);
    setAiSolution(null);

    const eqToSolve = customEq || equation;

    try {
      const res = await fetch("/api/math/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: eqToSolve,
          mode: "algebra"
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAiSolution(json.data);
      } else {
        setAiError(json.error || "Could not retrieve solution from Gemini AI.");
      }
    } catch (err) {
      setAiError(err.message || "Failed to reach AI Math Solver server.");
    } finally {
      setAiLoading(false);
    }
  }, [equation]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-amber-500/10 border border-indigo-500/20 dark:border-indigo-400/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500 text-white font-black text-[10px] uppercase tracking-wider">
              UNIVERSAL EQUATION & TRIG SOLVER
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px] border border-amber-500/20">
              ✨ Gemini AI Step-by-Step Enabled
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Algebra, Polynomials & Trigonometry Step-by-Step Solver
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Write any equation: linear, quadratic, polynomial, systems, or complex trigonometric equations (e.g. sin(x) + cos(x) = 1, tan²(x) = 3) and view complete step-by-step mathematical proofs with Google Gemini AI.
          </p>
        </div>

        <button
          onClick={() => requestAiSolver()}
          disabled={aiLoading}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition active:scale-95 cursor-pointer disabled:opacity-60 whitespace-nowrap self-stretch md:self-auto justify-center"
        >
          <Sparkles size={16} className={aiLoading ? "animate-spin" : "animate-pulse"} />
          <span>{aiLoading ? "Gemini Solving..." : "✨ Solve with Gemini AI"}</span>
        </button>
      </div>

      {/* Input Section & Keypad */}
      <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Enter Any Algebraic or Trigonometric Equation
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder="e.g. sin(x) + cos(x) = 1 or 2x^2 + 5x - 3 = 0"
              className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono font-black text-slate-900 dark:text-white text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <button
            onClick={() => requestAiSolver()}
            disabled={aiLoading}
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer active:scale-95 disabled:opacity-60"
          >
            <Sparkles size={16} />
            <span>Solve</span>
          </button>
        </div>

        {/* Virtual Trig & Math Keypad */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Quick Math & Trig Shortcuts:</span>
            <button
              onClick={() => setEquation("")}
              className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              "sin(x)", "cos(x)", "tan(x)", "sin²(x)", "cos²(x)", "tan²(x)",
              "π", "θ", "x", "x²", "√", "=", "+", "-", "*", "/", "(", ")"
            ].map((keySym) => (
              <button
                key={keySym}
                onClick={() => insertSymbol(keySym)}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer active:scale-95 shadow-2xs"
              >
                {keySym}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Equation Examples */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
          <span className="text-[11px] font-mono text-slate-400">Popular Presets:</span>
          {[
            "sin(x) + cos(x) = 1",
            "2*sin^2(x) - sin(x) - 1 = 0",
            "tan(x) = 1",
            "cos(2x) = cos(x)",
            "3x + 12 = 45",
            "x^2 - 5x + 6 = 0",
            "2(x - 3) = 4x + 10",
            "3/(x+1) + 2/(x-1) = 4"
          ].map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setEquation(preset);
                requestAiSolver(preset);
              }}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* INSTANT LOCAL SOLUTION PREVIEW */}
      <div className="p-6 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Instant In-Browser Mathematical Classification
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/60">
            {localAnalysis.type}
          </span>
        </div>

        {localAnalysis.error ? (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-2">
            <Info size={16} />
            <span>{localAnalysis.error}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {localAnalysis.roots && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">
                    Calculated Roots:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {localAnalysis.roots.map((r, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-black text-lg">
                        {r}
                      </span>
                    ))}
                    {localAnalysis.degrees && (
                      <span className="text-xs font-mono text-slate-500">
                        ({localAnalysis.degrees.join(", ")})
                      </span>
                    )}
                  </div>
                </div>

                {localAnalysis.generalForm && (
                  <div className="text-xs font-mono text-slate-500">
                    <span className="font-bold text-slate-400 block">General Solution:</span>
                    <span className="text-amber-500 font-bold">{localAnalysis.generalForm}</span>
                  </div>
                )}
              </div>
            )}

            {/* Local Derivation Steps */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Derivation Steps
              </span>
              {localAnalysis.steps.map((st, i) => (
                <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {st.title}
                  </div>
                  <div className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {st.math}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GEMINI AI DEEP STEP-BY-STEP SOLVER ACCORDION */}
      <AnimatePresence>
        {(aiLoading || aiSolution || aiError) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-amber-50/50 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-amber-950/30 border-2 border-indigo-500/30 shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-indigo-200/60 dark:border-indigo-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <Sparkles size={20} className={aiLoading ? "animate-spin" : ""} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                      Google Gemini 3.5 AI Step-by-Step Solver
                    </span>
                    <span className="text-xs text-slate-400">• Comprehensive Mathematical Proof</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Step-by-Step Deductive Solution
                  </h3>
                </div>
              </div>
            </div>

            {aiLoading && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <Sparkles size={32} className="text-indigo-500 animate-spin" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Gemini is classifying the equation, applying trigonometric identities, determining domain constraints, and solving for roots...
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
                {/* Equation & Domain Badge Card */}
                <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block mb-0.5">Equation to Solve:</span>
                    <span className="text-xl font-mono font-black text-indigo-600 dark:text-indigo-400">
                      {aiSolution.equation}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold">
                        Category: {aiSolution.category}
                      </span>
                      {aiSolution.domain && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-mono">
                          Domain: {aiSolution.domain}
                        </span>
                      )}
                    </div>
                  </div>

                  {aiSolution.summary && (
                    <div className="max-w-md p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/60 dark:border-indigo-800/50 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {aiSolution.summary}
                    </div>
                  )}
                </div>

                {/* Solutions Grid */}
                {aiSolution.solutions && aiSolution.solutions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Solution Set (Principal & General Periodic Roots)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {aiSolution.solutions.map((sol, i) => (
                        <div
                          key={i}
                          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              Solution #{i + 1}
                            </span>
                            <span className="text-xl font-mono font-black text-amber-500 break-all block">
                              x = {sol.exact}
                            </span>
                            {sol.generalTrigForm && (
                              <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                                General: {sol.generalTrigForm}
                              </div>
                            )}
                            {sol.degrees && (
                              <div className="text-xs font-mono text-slate-500 mt-0.5">
                                Degrees: {sol.degrees}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => copyText(`x = ${sol.exact}${sol.generalTrigForm ? ` (${sol.generalTrigForm})` : ""}`)}
                            className="mt-3 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <Copy size={13} /> Copy Root
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Numbered Step-by-Step Derivation */}
                {aiSolution.steps && aiSolution.steps.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Step-by-Step Mathematical Walkthrough
                    </h4>
                    {aiSolution.steps.map((st, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                            {st.stepNumber || i + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {st.title}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pl-7 leading-relaxed">
                          {st.explanation}
                        </p>
                        {st.math && (
                          <div className="ml-7 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {st.math}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Rules & Verification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiSolution.rulesUsed && aiSolution.rulesUsed.length > 0 && (
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 block">
                        Rules, Theorems & Identities Applied
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiSolution.rulesUsed.map((rule, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                            {rule}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiSolution.verification && (
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 block flex items-center gap-1.5">
                        <CheckCircle2 size={13} /> Mathematical Verification Check
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-mono leading-relaxed">
                        {aiSolution.verification}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
