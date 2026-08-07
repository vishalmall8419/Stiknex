import { useEffect, useState } from "react";
import ToolsStyle from "../Tools.module.css";

const tabs = [
  { id: "age", label: "Age Calculator" },
  { id: "between", label: "Days Between Dates" },
  { id: "timediff", label: "Time Difference" },
  { id: "addDays", label: "Add Days" },
  { id: "countdown", label: "Countdown" },
];

const inputCls = (darkMode) =>
  `${ToolsStyle.input} ${darkMode ? ToolsStyle.darkInput : ""}`;

const DateTimeCalculator = ({ darkMode }) => {
  const [tab, setTab] = useState("age");

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

      {tab === "age" && <AgeCalculator darkMode={darkMode} />}
      {tab === "between" && <DaysBetween darkMode={darkMode} />}
      {tab === "timediff" && <TimeDifference darkMode={darkMode} />}
      {tab === "addDays" && <AddDays darkMode={darkMode} />}
      {tab === "countdown" && <Countdown darkMode={darkMode} />}
    </div>
  );
};


const AgeCalculator = ({ darkMode }) => {
  const [dob, setDob] = useState("");

  let result = null;
  if (dob) {
    const birth = new Date(dob);
    const today = new Date();

    if (birth <= today) {
      let years = today.getFullYear() - birth.getFullYear();
      let months = today.getMonth() - birth.getMonth();
      let days = today.getDate() - birth.getDate();

      if (days < 0) {
        months -= 1;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const totalDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));

      result = { years, months, days, totalDays };
    }
  }

  return (
    <div>
      <div className={ToolsStyle.field}>
        <label>Date of Birth</label>
        <input
          type="date"
          value={dob}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDob(e.target.value)}
          className={inputCls(darkMode)}
        />
      </div>

      {result && (
        <div
          className={`${ToolsStyle.resultPanel} ${
            darkMode ? ToolsStyle.darkResultPanel : ""
          }`}
        >
          <div className={ToolsStyle.resultBig}>
            {result.years}y {result.months}m {result.days}d
          </div>
          <div className={ToolsStyle.resultSub}>
            {result.totalDays.toLocaleString()} total days lived
          </div>
        </div>
      )}
    </div>
  );
};


const DaysBetween = ({ darkMode }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  let result = null;
  if (start && end) {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffMs = d2 - d1;
    const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    result = {
      totalDays: Math.abs(totalDays),
      weeks: Math.floor(Math.abs(totalDays) / 7),
      isFuture: totalDays >= 0,
    };
  }

  return (
    <div>
      <div className={ToolsStyle.row}>
        <div className={ToolsStyle.field}>
          <label>Start Date</label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className={inputCls(darkMode)}
          />
        </div>
        <div className={ToolsStyle.field}>
          <label>End Date</label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className={inputCls(darkMode)}
          />
        </div>
      </div>

      {result && (
        <div
          className={`${ToolsStyle.resultPanel} ${
            darkMode ? ToolsStyle.darkResultPanel : ""
          }`}
        >
          <div className={ToolsStyle.resultBig}>
            {result.totalDays.toLocaleString()} days
          </div>
          <div className={ToolsStyle.resultSub}>
            ≈ {result.weeks.toLocaleString()} weeks
            {result.isFuture ? "" : " (end date is before start date)"}
          </div>
        </div>
      )}
    </div>
  );
};


const TimeDifference = ({ darkMode }) => {
  const [t1, setT1] = useState("");
  const [t2, setT2] = useState("");

  let result = null;
  if (t1 && t2) {
    const [h1, m1] = t1.split(":").map(Number);
    const [h2, m2] = t2.split(":").map(Number);

    let diff = h2 * 60 + m2 - (h1 * 60 + m1);
    if (diff < 0) diff += 24 * 60;

    result = {
      hours: Math.floor(diff / 60),
      minutes: diff % 60,
      totalMinutes: diff,
    };
  }

  return (
    <div>
      <div className={ToolsStyle.row}>
        <div className={ToolsStyle.field}>
          <label>Start Time</label>
          <input
            type="time"
            value={t1}
            onChange={(e) => setT1(e.target.value)}
            className={inputCls(darkMode)}
          />
        </div>
        <div className={ToolsStyle.field}>
          <label>End Time</label>
          <input
            type="time"
            value={t2}
            onChange={(e) => setT2(e.target.value)}
            className={inputCls(darkMode)}
          />
        </div>
      </div>

      {result && (
        <div
          className={`${ToolsStyle.resultPanel} ${
            darkMode ? ToolsStyle.darkResultPanel : ""
          }`}
        >
          <div className={ToolsStyle.resultBig}>
            {result.hours}h {result.minutes}m
          </div>
          <div className={ToolsStyle.resultSub}>
            {result.totalMinutes} total minutes (assumes end is next
            occurrence after start)
          </div>
        </div>
      )}
    </div>
  );
};


const AddDays = ({ darkMode }) => {
  const [date, setDate] = useState("");
  const [days, setDays] = useState("");

  let result = null;
  if (date && days !== "") {
    const base = new Date(date);
    base.setDate(base.getDate() + Number(days));
    result = base.toDateString();
  }

  return (
    <div>
      <div className={ToolsStyle.row}>
        <div className={ToolsStyle.field}>
          <label>Start Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls(darkMode)}
          />
        </div>
        <div className={ToolsStyle.field}>
          <label>Days (use − to subtract)</label>
          <input
            type="number"
            placeholder="e.g. 30 or -14"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className={inputCls(darkMode)}
          />
        </div>
      </div>

      {result && (
        <div
          className={`${ToolsStyle.resultPanel} ${
            darkMode ? ToolsStyle.darkResultPanel : ""
          }`}
        >
          <div className={ToolsStyle.resultBig}>{result}</div>
        </div>
      )}
    </div>
  );
};


const Countdown = ({ darkMode }) => {
  const [target, setTarget] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  let result = null;
  if (target) {
    const diff = new Date(target).getTime() - now;

    if (diff <= 0) {
      result = { done: true };
    } else {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      result = { days, hours, minutes, seconds, done: false };
    }
  }

  return (
    <div>
      <div className={ToolsStyle.field}>
        <label>Target Date & Time</label>
        <input
          type="datetime-local"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className={inputCls(darkMode)}
        />
      </div>

      {result && (
        <div
          className={`${ToolsStyle.resultPanel} ${
            darkMode ? ToolsStyle.darkResultPanel : ""
          }`}
        >
          {result.done ? (
            <div className={ToolsStyle.resultBig}>🎉 Time's up!</div>
          ) : (
            <div className={`${ToolsStyle.resultGrid}`}>
              {[
                ["Days", result.days],
                ["Hours", result.hours],
                ["Minutes", result.minutes],
                ["Seconds", result.seconds],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className={`${ToolsStyle.resultItem} ${
                    darkMode ? ToolsStyle.darkResultItem : ""
                  }`}
                >
                  <div className={ToolsStyle.resultLabel}>{label}</div>
                  <div className={ToolsStyle.resultValue}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimeCalculator;