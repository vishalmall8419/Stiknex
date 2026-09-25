import { useEffect, useState, useCallback } from "react";

const buttons = [
  "C", "%", "\u232B", "\u00F7",
  "7", "8", "9", "\u00D7",
  "4", "5", "6", "\u2212",
  "1", "2", "3", "+",
  "0", ".", "=", ""
];

const SimpleCalculator = () => {
  const [expr, setExpr] = useState("");

  const safeEval = useCallback((input) => {
    try {
      const sanitized = input
        .replace(/\u00D7/g, "*")
        .replace(/\u00F7/g, "/")
        .replace(/\u2212/g, "-")
        .replace(/%/g, "/100");

      if (!/^[0-9+\-*/.() ]*$/.test(sanitized) || sanitized.trim() === "") {
        return "";
      }

       
      const value = Function(`"use strict"; return (${sanitized})`)();
      if (typeof value !== "number" || !isFinite(value)) return "Error";
      return Math.round(value * 1e10) / 1e10;
    } catch {
      return "";
    }
  }, []);

  const press = useCallback((key) => {
    if (key === "") return;
    if (key === "C") return setExpr("");
    if (key === "\u232B") return setExpr((prev) => prev.slice(0, -1));
    if (key === "=") {
      const value = safeEval(expr);
      setExpr(value === "" ? expr : String(value));
      return;
    }
    setExpr((prev) => prev + key);
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
      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 text-right border border-gray-100 dark:border-slate-800 shrink-0">
        <div className="h-6 text-slate-500 dark:text-slate-400 font-medium tracking-wide mb-1 text-sm overflow-hidden whitespace-nowrap text-ellipsis">
          {expr || " "}
        </div>
        <div className="h-10 sm:h-12 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white overflow-hidden text-ellipsis whitespace-nowrap">
          {expr ? (preview === "" ? expr : preview) : "0"}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 flex-1 min-h-0">
        {buttons.map((b, i) => {
          if (b === "") return <div key={i} />;
          const isOp = ["\u00F7", "\u00D7", "\u2212", "+", "%"].includes(b);
          const isClear = b === "C" || b === "\u232B";
          let btnClass = "rounded-xl text-lg font-medium transition-all active:scale-95 flex items-center justify-center ";
          
          if (isOp) btnClass += "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 shadow-sm";
          else if (isClear) btnClass += "bg-rose-50 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 shadow-sm";
          else if (b === "=") btnClass += "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md font-bold text-xl";
          else btnClass += "bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-100 dark:border-slate-800/50 shadow-sm";
          
          return (
            <button key={i} onClick={() => press(b)} className={btnClass}>
              {b}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleCalculator;