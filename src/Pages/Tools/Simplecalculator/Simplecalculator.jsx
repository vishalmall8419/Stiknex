import { useEffect, useState } from "react";
import Style from "./Calculator.module.css";

const buttons = [
  "C", "%", "⌫", "÷",
  "7", "8", "9", "×",
  "4", "5", "6", "−",
  "1", "2", "3", "+",
  "0", ".", "=", "",
];

const SimpleCalculator = ({ darkMode }) => {
  const [expr, setExpr] = useState("");

  const safeEval = (input) => {
    try {
      const sanitized = input
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-")
        .replace(/%/g, "/100");

      if (!/^[0-9+\-*/.() ]*$/.test(sanitized) || sanitized.trim() === "") {
        return "";
      }

      // eslint-disable-next-line no-new-func
      const value = Function(`"use strict"; return (${sanitized})`)();
      if (typeof value !== "number" || !isFinite(value)) return "Error";
      return Math.round(value * 1e10) / 1e10;
    } catch {
      return "";
    }
  };

  const press = (key) => {
    if (key === "") return;
    if (key === "C") {
      setExpr("");
      return;
    }
    if (key === "⌫") {
      setExpr((prev) => prev.slice(0, -1));
      return;
    }
    if (key === "=") {
      const value = safeEval(expr);
      setExpr(value === "" ? expr : String(value));
      return;
    }
    setExpr((prev) => prev + key);
  };

  const preview = expr ? safeEval(expr) : "";

  useEffect(() => {
    const onKeyDown = (e) => {
      const map = {
        "*": "×",
        "/": "÷",
        "-": "−",
        "Enter": "=",
        "=": "=",
      };

      if (/^[0-9.]$/.test(e.key)) {
        e.preventDefault();
        press(e.key);
      } else if (map[e.key]) {
        e.preventDefault();
        press(map[e.key]);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        press("⌫");
      } else if (e.key === "Delete" || e.key.toLowerCase() === "c") {
        e.preventDefault();
        press("C");
      } else if (e.key === "%") {
        e.preventDefault();
        press("%");
      } else if (e.key === "Escape") {
        e.preventDefault();
        setExpr("");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div>
      <div className={`${Style.display} ${darkMode ? Style.darkDisplay : ""}`}>
        <div className={Style.expr}>{expr || " "}</div>
        <div className={Style.result}>
          {expr ? (preview === "" ? expr : preview) : "0"}
        </div>
      </div>

      <div className={Style.pad}>
        {buttons.map((b, i) =>
          b === "" ? (
            <div key={i}></div>
          ) : (
            <button
              key={i}
              onClick={() => press(b)}
              className={`${Style.btn} ${darkMode ? Style.darkBtn : ""} ${
                ["÷", "×", "−", "+", "%"].includes(b) ? Style.opBtn : ""
              } ${b === "=" ? Style.equalBtn : ""}`}
            >
              {b}
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default SimpleCalculator;