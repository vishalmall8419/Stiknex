import { useEffect, useState } from "react";
import Style from "../Simplecalculator/Calculator.module.css";

const padButtons = [
  "(", ")", "%", "⌫",
  "7", "8", "9", "÷",
  "4", "5", "6", "×",
  "1", "2", "3", "−",
  "C", "0", ".", "+",
];

const sciButtons = [
  { label: "sin", fn: "sin" },
  { label: "cos", fn: "cos" },
  { label: "tan", fn: "tan" },
  { label: "log", fn: "log" },
  { label: "ln", fn: "ln" },
  { label: "√", fn: "sqrt" },
  { label: "x²", fn: "sq" },
  { label: "1/x", fn: "inv" },
  { label: "xʸ", fn: "pow" },
  { label: "π", fn: "pi" },
];

const ScientificCalculator = ({ darkMode }) => {
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

  const applySci = (fn) => {
    if (fn === "pi") {
      setExpr((prev) => prev + String(Math.PI));
      return;
    }

    if (fn === "pow") {
      setExpr((prev) => (prev === "" ? prev : prev + "**"));
      return;
    }

    const current = safeEval(expr);
    const value = current === "" || current === "Error" ? 0 : current;

    let result;
    switch (fn) {
      case "sin":
        result = Math.sin((value * Math.PI) / 180);
        break;
      case "cos":
        result = Math.cos((value * Math.PI) / 180);
        break;
      case "tan":
        result = Math.tan((value * Math.PI) / 180);
        break;
      case "log":
        result = Math.log10(value);
        break;
      case "ln":
        result = Math.log(value);
        break;
      case "sqrt":
        result = Math.sqrt(value);
        break;
      case "sq":
        result = value * value;
        break;
      case "inv":
        result = 1 / value;
        break;
      default:
        result = value;
    }

    if (!isFinite(result)) {
      setExpr("Error");
      return;
    }

    setExpr(String(Math.round(result * 1e10) / 1e10));
  };

  const preview = expr ? safeEval(expr) : "";

  useEffect(() => {
    const onKeyDown = (e) => {
      const map = {
        "*": "×",
        "/": "÷",
        "-": "−",
        "Enter": "=",
        "(": "(",
        ")": ")",
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

      <div className={Style.sciPad}>
        {sciButtons.map((b) => (
          <button
            key={b.label}
            onClick={() => applySci(b.fn)}
            className={`${Style.btn} ${Style.sciBtn} ${
              darkMode ? Style.darkBtn : ""
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className={Style.pad}>
        {padButtons.map((b, i) => (
          <button
            key={i}
            onClick={() => press(b)}
            className={`${Style.btn} ${darkMode ? Style.darkBtn : ""} ${
              ["÷", "×", "−", "+", "%"].includes(b) ? Style.opBtn : ""
            }`}
          >
            {b}
          </button>
        ))}
        <button
          onClick={() => press("=")}
          className={`${Style.btn} ${Style.equalBtn} col-span-4`}
        >
          =
        </button>
      </div>
    </div>
  );
};

export default ScientificCalculator;