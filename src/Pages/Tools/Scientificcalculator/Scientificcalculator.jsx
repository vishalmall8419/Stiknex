import { useEffect, useState, useCallback } from "react";

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

  const safeEval = useCallback((input) => {
    try {
      const sanitized = input
        .replace(/\u00D7/g, "*")
        .replace(/\u00F7/g, "/")
        .replace(/\u2212/g, "-")
        .replace(/%/g, "/100");

      if (!/^[0-9+\-*/.() ]*$/.test(sanitized) || sanitized.trim() === "") return "";
      
      // eslint-disable-next-line no-new-func
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

    let result;
    switch (fn) {
      case "sin": result = Math.sin((value * Math.PI) / 180); break;
      case "cos": result = Math.cos((value * Math.PI) / 180); break;
      case "tan": result = Math.tan((value * Math.PI) / 180); break;
      case "log": result = Math.log10(value); break;
      case "ln": result = Math.log(value); break;
      case "sqrt": result = Math.sqrt(value); break;
      case "sq": result = value * value; break;
      case "inv": result = 1 / value; break;
      default: result = value;
    }
    if (!isFinite(result)) return setExpr("Error");
    setExpr(String(Math.round(result * 1e10) / 1e10));
  }, [expr, safeEval]);

  const preview = expr ? safeEval(expr) : "";

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
    <div className="w-full flex flex-col h-full max-w-sm mx-auto">
      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-5 mb-3 sm:mb-4 text-right border border-gray-100 dark:border-slate-800 shrink-0">
        <div className="h-5 sm:h-6 text-slate-500 dark:text-slate-400 font-medium tracking-wide mb-1 text-xs sm:text-sm overflow-hidden whitespace-nowrap text-ellipsis">
          {expr || " "}
        </div>
        <div className="h-8 sm:h-10 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white overflow-hidden text-ellipsis whitespace-nowrap">
          {expr ? (preview === "" ? expr : preview) : "0"}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-3 shrink-0">
        {sciButtons.map((b) => (
          <button
            key={b.label}
            onClick={() => applySci(b.fn)}
            className="py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-indigo-50/50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all active:scale-95 border border-indigo-100/50 dark:border-indigo-500/10"
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 flex-1 min-h-0">
        {padButtons.map((b, i) => {
          const isOp = ["\u00F7", "\u00D7", "\u2212", "+", "%", "(", ")"].includes(b);
          const isClear = b === "C" || b === "\u232B";
          let btnClass = "rounded-xl text-sm sm:text-base font-medium transition-all active:scale-95 flex items-center justify-center ";
          
          if (isOp) btnClass += "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 shadow-sm border border-transparent";
          else if (isClear) btnClass += "bg-rose-50 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 shadow-sm border border-transparent";
          else btnClass += "bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-100 dark:border-slate-800/50 shadow-sm";
          
          return (
            <button key={i} onClick={() => press(b)} className={btnClass}>
              {b}
            </button>
          );
        })}
        <button onClick={() => press("=")} className="col-span-4 rounded-xl text-lg font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all active:scale-95 mt-1 sm:mt-2">
          =
        </button>
      </div>
    </div>
  );
};

export default ScientificCalculator;