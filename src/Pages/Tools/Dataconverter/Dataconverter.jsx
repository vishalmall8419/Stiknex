import { useState } from "react";
import ToolsStyle from "../Tools.module.css";

const tabs = [
  { id: "storage", label: "Storage Units" },
  { id: "base", label: "Number Base" },
];

const inputCls = (darkMode) =>
  `${ToolsStyle.input} ${darkMode ? ToolsStyle.darkInput : ""}`;

const DataConverter = ({ darkMode }) => {
  const [tab, setTab] = useState("storage");

  return (
    <div>
      <div className={ToolsStyle.tabRow}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`${ToolsStyle.tabBtn} ${
              darkMode ? ToolsStyle.darkTabBtn : ""
            } ${tab === t.id ? ToolsStyle.tabActive : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "storage" && <StorageConverter darkMode={darkMode} />}
      {tab === "base" && <BaseConverter darkMode={darkMode} />}
    </div>
  );
};


const storageUnits = [
  { id: "bit", label: "Bits", factor: 1 },
  { id: "byte", label: "Bytes", factor: 8 },
  { id: "kb", label: "KB", factor: 8 * 1024 },
  { id: "mb", label: "MB", factor: 8 * 1024 ** 2 },
  { id: "gb", label: "GB", factor: 8 * 1024 ** 3 },
  { id: "tb", label: "TB", factor: 8 * 1024 ** 4 },
];

const formatNum = (n) => {
  if (!isFinite(n)) return "0";
  return Number(n.toPrecision(10))
    .toString()
    .replace(/\.?0+$/, (m) => (m.includes(".") ? "" : m));
};

const StorageConverter = ({ darkMode }) => {
  const [value, setValue] = useState("1");
  const [unit, setUnit] = useState("mb");

  const numValue = Number(value);
  const valid = value !== "" && !isNaN(numValue);
  const bits = valid
    ? numValue * storageUnits.find((u) => u.id === unit).factor
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
            {storageUnits.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={ToolsStyle.resultGrid}>
        {storageUnits.map((u) => (
          <div
            key={u.id}
            className={`${ToolsStyle.resultItem} ${
              darkMode ? ToolsStyle.darkResultItem : ""
            }`}
          >
            <div className={ToolsStyle.resultLabel}>{u.label}</div>
            <div className={ToolsStyle.resultValue}>
              {valid ? formatNum(bits / u.factor) : "0"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const bases = [
  { id: "2", label: "Binary" },
  { id: "10", label: "Decimal" },
  { id: "16", label: "Hexadecimal" },
];

const BaseConverter = ({ darkMode }) => {
  const [value, setValue] = useState("255");
  const [base, setBase] = useState("10");

  const validPattern = {
    "2": /^[01]*$/,
    "10": /^[0-9]*$/,
    "16": /^[0-9a-fA-F]*$/,
  }[base];

  const isValid = value === "" || validPattern.test(value);
  const decimalValue = isValid && value !== "" ? parseInt(value, Number(base)) : NaN;

  return (
    <div>
      <div className={ToolsStyle.row}>
        <div className={ToolsStyle.field}>
          <label>Value</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={inputCls(darkMode)}
            placeholder="Enter a number"
          />
        </div>
        <div className={ToolsStyle.field}>
          <label>From Base</label>
          <select
            value={base}
            onChange={(e) => setBase(e.target.value)}
            className={inputCls(darkMode)}
          >
            {bases.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!isValid && (
        <p className={ToolsStyle.resultSub}>
          That value isn't valid for the selected base.
        </p>
      )}

      <div className={ToolsStyle.resultGrid}>
        {bases.map((b) => (
          <div
            key={b.id}
            className={`${ToolsStyle.resultItem} ${
              darkMode ? ToolsStyle.darkResultItem : ""
            }`}
          >
            <div className={ToolsStyle.resultLabel}>{b.label}</div>
            <div className={ToolsStyle.resultValue}>
              {!isNaN(decimalValue)
                ? decimalValue.toString(Number(b.id)).toUpperCase()
                : "0"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataConverter;