import { useEffect, useState } from "react";
import ToolsStyle from "../Tools.module.css";

const inputCls = (darkMode) =>
  `${ToolsStyle.input} ${darkMode ? ToolsStyle.darkInput : ""}`;

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "CNY", "SGD", "CHF"];

const FALLBACK_RATES_USD = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  INR: 87,
  JPY: 151,
  AUD: 1.52,
  CAD: 1.36,
  CNY: 7.24,
  SGD: 1.34,
  CHF: 0.88,
};

const CurrencyConverter = ({ darkMode }) => {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [rates, setRates] = useState(FALLBACK_RATES_USD);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    const fetchRates = async () => {
      setStatus("loading");
      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?from=${from}&to=${CURRENCIES.filter(
            (c) => c !== from,
          ).join(",")}`,
        );
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        if (cancelled) return;
        setRates({ ...data.rates, [from]: 1 });
        setStatus("live");
      } catch {
        if (cancelled) return;
        const usdRate = FALLBACK_RATES_USD[from] || 1;
        const converted = {};
        CURRENCIES.forEach((c) => {
          converted[c] = FALLBACK_RATES_USD[c] / usdRate;
        });
        setRates(converted);
        setStatus("offline");
      }
    };

    fetchRates();
    return () => {
      cancelled = true;
    };
  }, [from]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setAmount("");
  };

  const numValue = Number(amount);
  const valid = amount !== "" && !isNaN(numValue);

  return (
    <div>
      <div className={ToolsStyle.row}>
        <div className={ToolsStyle.field}>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={handleKeyDown}
            className={inputCls(darkMode)}
          />
        </div>
        <div className={ToolsStyle.field}>
          <label>From Currency</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={inputCls(darkMode)}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className={ToolsStyle.resultSub}>
        {status === "loading" && "Fetching live exchange rates…"}
        {status === "live" && "Live exchange rates."}
        {status === "offline" && "Using approximate offline rates — connect to the internet for live rates."}
      </p>

      <div className={ToolsStyle.resultGrid}>
        {CURRENCIES.filter((c) => c !== from).map((c) => (
          <div
            key={c}
            className={`${ToolsStyle.resultItem} ${
              darkMode ? ToolsStyle.darkResultItem : ""
            }`}
          >
            <div className={ToolsStyle.resultLabel}>{c}</div>
            <div className={ToolsStyle.resultValue}>
              {valid && rates[c] !== undefined
                ? (numValue * rates[c]).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                : "0"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrencyConverter;
