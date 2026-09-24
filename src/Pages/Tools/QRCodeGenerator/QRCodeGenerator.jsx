import { useState } from "react";
import ToolsStyle from "../Tools.module.css";

const inputCls = (darkMode) =>
  `${ToolsStyle.input} ${darkMode ? ToolsStyle.darkInput : ""}`;

const SIZES = [
  { id: "200", label: "Small" },
  { id: "300", label: "Medium" },
  { id: "400", label: "Large" },
];

const QRCodeGenerator = ({ darkMode }) => {
  const [text, setText] = useState("https://stiknex.vercel.app");
  const [size, setSize] = useState("300");

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setText("");
  };

  const encoded = encodeURIComponent(text || " ");
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`;

  return (
    <div>
      <div className={ToolsStyle.field}>
        <label>Text or URL</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter text or a link"
          className={inputCls(darkMode)}
        />
      </div>

      <div className={ToolsStyle.field}>
        <label>Size</label>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className={inputCls(darkMode)}
        >
          {SIZES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {text && (
        <div
          className={`${ToolsStyle.resultPanel} ${
            darkMode ? ToolsStyle.darkResultPanel : ""
          }`}
          style={{ textAlign: "center" }}
        >
          <img
            src={qrUrl}
            alt="Generated QR code"
            width={200}
            height={200}
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "0.75rem",
              background: "white",
              padding: "0.5rem",
            }}
          />

          <div className={ToolsStyle.actionRow} style={{ justifyContent: "center" }}>
            <a
              href={qrUrl}
              target="_blank"
              rel="noreferrer"
              download="stiknex-qr-code.png"
              className="greenButton"
            >
              <i className="fa-solid fa-download"></i> Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
