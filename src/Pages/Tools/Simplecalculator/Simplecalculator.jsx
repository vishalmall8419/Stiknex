import { useEffect, useState, useCallback } from "react";
import { Copy, Check, RotateCcw } from "lucide-react";

const buttons = [
  "C", "%", "\u232B", "\u00F7",
  "7", "8", "9", "\u00D7",
  "4", "5", "6", "\u2212",
  "1", "2", "3", "+",
  "0", ".", "=", ""
];

export default function SimpleCalculator() {
  const [expr, setExpr] = useState("");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

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
      if (value !== "" && value !== "Error") {
        setHistory((prev) => [{ eq: expr, res: String(value) }, ...prev.slice(0, 2)]);
        setExpr(String(value));
      }
      return;
    }
    setExpr((prev) => prev + key);
  }, [expr, safeEval]);

  const preview = expr ? safeEval(expr) : "";
  const displayVal = expr ? (preview === "" ? expr : preview) : "0";

  const copyResult = () => {
    navigator.clipboard.writeText(String(displayVal));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <div className="w-full flex flex-col h-full max-w-sm mx-auto space-y-4">
      {/* Display Screen */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-800 text-right shrink-0 relative overflow-hidden">
        {/* Top bar with copy button & expression */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={copyResult}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            title="Copy Result"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <div className="h-6 text-slate-400 font-mono tracking-wide text-sm overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
            {expr || "0"}
          </div>
        </div>

        {/* Big Calculated Result */}
        <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white overflow-hidden text-ellipsis whitespace-nowrap">
          {displayVal}
        </div>
      </div>

      {/* Recent History Strip */}
      {history.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Recent:</span>
          {history.map((h, idx) => (
            <button
              key={idx}
              onClick={() => setExpr(h.res)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 shrink-0 transition cursor-pointer"
            >
              {h.eq} = <strong>{h.res}</strong>
            </button>
          ))}
        </div>
      )}

      {/* Tactile Keypad */}
      <div className="grid grid-cols-4 gap-2.5 flex-1 min-h-[300px]">
        {buttons.map((b, i) => {
          if (b === "") return <div key={i} />;
          const isOp = ["\u00F7", "\u00D7", "\u2212", "+", "%"].includes(b);
          const isClear = b === "C" || b === "\u232B";
          let btnClass = "rounded-2xl text-lg font-bold transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-xs ";
          
          if (isOp) {
            btnClass += "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-100 dark:border-indigo-900/50";
          } else if (isClear) {
            btnClass += "bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-100 dark:border-rose-900/50";
          } else if (b === "=") {
            btnClass += "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 text-xl font-black";
          } else {
            btnClass += "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80";
          }
          
          return (
            <button key={i} onClick={() => press(b)} className={btnClass}>
              {b}
            </button>
          );
        })}
      </div>
    </div>
  );
}
