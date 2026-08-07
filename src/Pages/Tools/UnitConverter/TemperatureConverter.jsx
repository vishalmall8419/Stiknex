import { useState } from "react";
import ToolsStyle from "../Tools.module.css";

const inputCls = (darkMode) =>
  `${ToolsStyle.input} ${darkMode ? ToolsStyle.darkInput : ""}`;

const units = [
  { id: "c", label: "Celsius" },
  { id: "f", label: "Fahrenheit" },
  { id: "k", label: "Kelvin" },
];

const toCelsius = (value, unit) => {
  if (unit === "c") return value;
  if (unit === "f") return ((value - 32) * 5) / 9;
  return value - 273.15;
};

const fromCelsius = (celsius, unit) => {
  if (unit === "c") return celsius;
  if (unit === "f") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
};

const formatNum = (n) => {
  if (!isFinite(n)) return "0";
  return Math.round(n * 100) / 100;
};

const TemperatureConverter = ({ darkMode }) => {
  const [value, setValue] = useState("0");
  const [unit, setUnit] = useState("c");

  const numValue = Number(value);
  const valid = value !== "" && !isNaN(numValue);
  const celsius = valid ? toCelsius(numValue, unit) : 0;

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setValue("");
  };

  return (
    <div>
      <div className={ToolsStyle.row}>
        <div className={ToolsStyle.field}>
          <label>Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={inputCls(darkMode)}
          />
        </div>
        <div className={ToolsStyle.field}>
          <label>From Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className={inputCls(darkMode)}
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={ToolsStyle.resultGrid}>
        {units.map((u) => (
          <div
            key={u.id}
            className={`${ToolsStyle.resultItem} ${
              darkMode ? ToolsStyle.darkResultItem : ""
            }`}
          >
            <div className={ToolsStyle.resultLabel}>{u.label}</div>
            <div className={ToolsStyle.resultValue}>
              {valid ? formatNum(fromCelsius(celsius, u.id)) : "0"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemperatureConverter;
