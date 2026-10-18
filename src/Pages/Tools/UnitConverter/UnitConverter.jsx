import { useState } from "react";
import ToolsStyle from "../Tools.module.css";

const inputCls = (darkMode) =>
  `${ToolsStyle.input} ${darkMode ? ToolsStyle.darkInput : ""}`;

const formatNum = (n) => {
  if (!isFinite(n)) return "0";
  return Number(n.toPrecision(10))
    .toString()
    .replace(/\.?0+$/, (m) => (m.includes(".") ? "" : m));
};

const UnitConverter = ({ darkMode, units, defaultUnit }) => {
  const [value, setValue] = useState("1");
  const [unit, setUnit] = useState(defaultUnit || units[0].id);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setValue("");
  };

  const numValue = Number(value);
  const valid = value !== "" && !isNaN(numValue);
  const base = valid
    ? numValue * units.find((u) => u.id === unit).factor
    : 0;

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
              {valid ? formatNum(base / u.factor) : "0"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitConverter;


// this is unit converter