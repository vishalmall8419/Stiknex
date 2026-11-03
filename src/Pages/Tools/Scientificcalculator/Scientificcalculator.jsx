import { useEffect, useState, useCallback } from "react";
import { Copy, Check, RotateCcw } from "lucide-react";

const padButtons = [
  "(", ")", "%", "\u232B",
  "7", "8", "9", "\u00F7",
  "4", "5", "6", "\u00D7",
  "1", "2", "3", "\u2212",
  "C", "0", ".", "+",
];

const sciButtons = [
  { label: "sin", fn: "sin" }, { label: "cos", fn: "cos" }, { label: "tan", fn: "tan" },
  { label: "log", fn: "log" }, { label: "ln", fn: "ln" }, { label: "\u221A", fn: "sqrt" },
  { label: "x\u00B2", fn: "sq" }, { label: "1/x", fn: "inv" }, { label: "x\u02B8", fn: "pow" },
  { label: "\u03C0", fn: "pi" },
];

const ScientificCalculator = () => {
  const [expr, setExpr] = useState("");
  const [isRad, setIsRad] = useState(false);
  const [copied, setCopied] = useState(false);

  const safeEval = useCallback((input) => {
    try {
      const sanitized = input
        .replace(/\u00D7/g, "*")
        .replace(/\u00F7/g, "/")
        .replace(/\u2212/g, "-")
        .replace(/%/g, "/100");

      if (!/^[0-9+\-*/.() ]*$/.test(sanitized) || sanitized.trim() === "") return "";
      
      const value = Function(`"use strict"; return (${sanitized})`)();
      if (typeof value !== "number" || !isFinite(value)) return "Error";
      return Math.round(value * 1e10) / 1e10;
    } catch {
      return "";
    }
  }, []);

  const press = useCallback((key) => {
    if (key === "C") return setExpr("");
    if (key === "\u232B") return setExpr((prev) => prev.slice(0, -1));
    if (key === "=") {
      const value = safeEval(expr);
      setExpr(value === "" ? expr : String(value));
      return;
    }
    setExpr((prev) => prev + key);
  }, [expr, safeEval]);

  const applySci = useCallback((fn) => {
    if (fn === "pi") return setExpr((prev) => prev + String(Math.PI));
    if (fn === "pow") return setExpr((prev) => (prev === "" ? prev : prev + "**"));

    const current = safeEval(expr);
    const value = current === "" || current === "Error" ? 0 : current;

    const angleMultiplier = isRad ? 1 : Math.PI / 180;

    let result;
    switch (fn) {
      case "sin": result = Math.sin(value * angleMultiplier); break;
      case "cos": result = Math.cos(value * angleMultiplier); break;
      case "tan": result = Math.tan(value * angleMultiplier); break;
      case "log": result = Math.log10(value); break;
      case "ln": result = Math.log(value); break;
      case "sqrt": result = Math.sqrt(value); break;
      case "sq": result = value * value; break;
      case "inv": result = 1 / value; break;
      default: result = value;
    }
    if (!isFinite(result)) return setExpr("Error");
    setExpr(String(Math.round(result * 1e10) / 1e10));
  }, [expr, safeEval, isRad]);

  const preview = expr ? safeEval(expr) : "";
  const displayResult = expr ? (preview === "" ? expr : preview) : "0";

  const handleCopy = () => {
    if (displayResult && displayResult !== "Error") {
      navigator.clipboard.writeText(String(displayResult));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      const map = { "*": "\u00D7", "/": "\u00F7", "-": "\u2212", "Enter": "=", "(": "(", ")": ")" };
      if (/^[0-9.]$/.test(e.key)) { e.preventDefault(); press(e.key); }
      else if (map[e.key]) { e.preventDefault(); press(map[e.key]); }
      else if (e.key === "Backspace") { e.preventDefault(); press("\u232B"); }
      else if (e.key === "Delete" || e.key.toLowerCase() === "c") { e.preventDefault(); press("C"); }
      else if (e.key === "%") { e.preventDefault(); press("%"); }
      else if (e.key === "Escape") { e.preventDefault(); setExpr(""); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [press]);

  return (
    <div className="w-full flex flex-col max-w-md mx-auto">
      {/* Top Display Terminal */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 mb-4 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Quick Mode Indicator & Actions */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <button
            type="button"
            onClick={() => setIsRad((prev) => !prev)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold transition cursor-pointer"
            title="Toggle Radian / Degree mode"
          >
            {isRad ? "RAD" : "DEG"}
          </button>

          <div className="flex items-center gap-2">
            {expr && (
              <button
                type="button"
                onClick={() => setExpr("")}
                className="p-1.5 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                title="Clear (Esc)"
              >
                <RotateCcw size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-xs font-semibold"
              title="Copy active result to clipboard"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Expression Tape */}
        <div className="h-6 text-slate-400 font-mono text-xs sm:text-sm tracking-wider text-right overflow-hidden whitespace-nowrap text-ellipsis">
          {expr || "Ready"}
        </div>

        {/* Active Result */}
        <div className="h-10 sm:h-12 text-3xl sm:text-4xl font-mono font-bold text-white text-right overflow-hidden text-ellipsis whitespace-nowrap tracking-tight">
          {displayResult}
        </div>
      </div>

      {/* Scientific Function Keys */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {sciButtons.map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={() => applySci(b.fn)}
            className="py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-100 dark:border-indigo-900/50 shadow-xs transition-all active:scale-95 cursor-pointer font-mono"
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Primary Keypad Grid */}
      <div className="grid grid-cols-4 gap-2">
        {padButtons.map((b, i) => {
          const isOp = ["\u00F7", "\u00D7", "\u2212", "+", "%", "(", ")"].includes(b);
          const isClear = b === "C" || b === "\u232B";
          let btnClass = "h-12 sm:h-14 rounded-2xl text-base sm:text-lg font-bold transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-xs ";
          
          if (isOp) {
            btnClass += "bg-indigo-100/70 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 hover:bg-indigo-200/70 dark:hover:bg-indigo-800/60 border border-indigo-200/50 dark:border-indigo-800/50";
          } else if (isClear) {
            btnClass += "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200/60 dark:border-rose-900/40";
          } else {
            btnClass += "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60";
          }
          
          return (
            <button key={i} type="button" onClick={() => press(b)} className={btnClass}>
              {b}
            </button>
          );
        })}
        
        {/* Equal Action Button */}
        <button
          type="button"
          onClick={() => press("=")}
          className="col-span-4 h-12 sm:h-14 rounded-2xl text-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center cursor-pointer mt-1"
        >
          =
        </button>
      </div>
    </div>
  );
};

export default ScientificCalculator;
