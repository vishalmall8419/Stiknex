import { useEffect, useState } from "react";
import ToolsStyle from "../Tools.module.css";

const inputCls = (darkMode) =>
  `${ToolsStyle.input} ${darkMode ? ToolsStyle.darkInput : ""}`;

const CHAR_SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

const generatePassword = (length, options) => {
  let pool = "";
  Object.keys(options).forEach((key) => {
    if (options[key]) pool += CHAR_SETS[key];
  });
  if (!pool) return "";

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += pool[array[i] % pool.length];
  }
  return result;
};

const getStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 14) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", pct: 25 };
  if (score <= 3) return { label: "Good", pct: 60 };
  return { label: "Strong", pct: 100 };
};

const PasswordGenerator = ({ darkMode }) => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    lower: true,
    upper: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const regenerate = () => setPassword(generatePassword(length, options));

  useEffect(() => {
    regenerate();
  }, [length, options]);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      return;
    }
  };

  const toggleOption = (key) => {
    setOptions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!Object.values(next).some(Boolean)) return prev;
      return next;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") regenerate();
  };

  const strength = password ? getStrength(password) : { label: "", pct: 0 };

  return (
    <div onKeyDown={handleKeyDown}>
      <div
        className={`${ToolsStyle.resultPanel} ${
          darkMode ? ToolsStyle.darkResultPanel : ""
        }`}
      >
        <div className={ToolsStyle.resultBig} style={{ wordBreak: "break-all" }}>
          {password || "—"}
        </div>
        {password && (
          <div className={ToolsStyle.resultSub}>Strength: {strength.label}</div>
        )}
      </div>

      <div className={ToolsStyle.actionRow}>
        <button type="button" className="greenButton" onClick={regenerate}>
          <i className="fa-solid fa-rotate"></i> Generate
        </button>
        <button type="button" className="whiteButton" onClick={handleCopy}>
          <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`}></i>{" "}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className={ToolsStyle.field} style={{ marginTop: "1.1rem" }}>
        <label>Length: {length}</label>
        <input
          type="range"
          min={6}
          max={32}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className={inputCls(darkMode)}
          style={{ padding: 0 }}
        />
      </div>

      <div className={ToolsStyle.resultGrid}>
        {[
          { key: "lower", label: "Lowercase (a-z)" },
          { key: "upper", label: "Uppercase (A-Z)" },
          { key: "numbers", label: "Numbers (0-9)" },
          { key: "symbols", label: "Symbols (!@#…)" },
        ].map((opt) => (
          <button
            type="button"
            key={opt.key}
            onClick={() => toggleOption(opt.key)}
            className={`${ToolsStyle.tabBtn} ${
              darkMode ? ToolsStyle.darkTabBtn : ""
            } ${options[opt.key] ? ToolsStyle.tabActive : ""}`}
            style={{ width: "100%", textAlign: "center" }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PasswordGenerator;
