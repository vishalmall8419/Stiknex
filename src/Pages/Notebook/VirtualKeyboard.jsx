import { useState } from "react";
import { onBtnEnter, onBtnLeave } from "../../utils/gsapButtonHover";
import Style from "./VirtualKeyboard.module.css";

const ROWS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

// In-app on-screen keyboard shown when the browser blocks/lacks a
// native way to summon the OS on-screen keyboard on desktop.
const VirtualKeyboard = ({ darkMode, text, setText, textareaRef, onClose }) => {
  const [shift, setShift] = useState(false);

  const getSelection = () => {
    const ta = textareaRef?.current;
    if (!ta) return { start: text.length, end: text.length };
    return { start: ta.selectionStart, end: ta.selectionEnd };
  };

  const setCaret = (pos) => {
    requestAnimationFrame(() => {
      const ta = textareaRef?.current;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(pos, pos);
    });
  };

  const insert = (str) => {
    const { start, end } = getSelection();
    const next = text.slice(0, start) + str + text.slice(end);
    setText(next);
    setCaret(start + str.length);
  };

  const handleBackspace = () => {
    const { start, end } = getSelection();
    if (start !== end) {
      const next = text.slice(0, start) + text.slice(end);
      setText(next);
      setCaret(start);
      return;
    }
    if (start === 0) return;
    const next = text.slice(0, start - 1) + text.slice(end);
    setText(next);
    setCaret(start - 1);
  };

  return (
    <div
      className={`${Style.overlay} ${darkMode ? Style.darkOverlay : ""}`}
      role="group"
      aria-label="Virtual keyboard"
    >
      <div className={Style.header}>
        <span>
          <i className="fa-solid fa-keyboard"></i> Virtual Keyboard
        </span>
        <button
          type="button"
          className={Style.closeBtn}
          onClick={onClose}
          onMouseEnter={onBtnEnter}
          onMouseLeave={onBtnLeave}
          aria-label="Close virtual keyboard"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div className={Style.body}>
        {ROWS.map((row, i) => (
          <div className={Style.row} key={i}>
            {row.map((key) => (
              <button
                type="button"
                key={key}
                className={Style.key}
                onMouseEnter={onBtnEnter}
                onMouseLeave={onBtnLeave}
                onClick={() => insert(shift ? key.toUpperCase() : key)}
              >
                {shift ? key.toUpperCase() : key}
              </button>
            ))}
          </div>
        ))}

        <div className={Style.row}>
          <button
            type="button"
            className={`${Style.key} ${Style.wide} ${
              shift ? Style.active : ""
            }`}
            onMouseEnter={onBtnEnter}
            onMouseLeave={onBtnLeave}
            onClick={() => setShift((v) => !v)}
          >
            <i className="fa-solid fa-arrow-up"></i> Shift
          </button>
          <button
            type="button"
            className={`${Style.key} ${Style.space}`}
            onMouseEnter={onBtnEnter}
            onMouseLeave={onBtnLeave}
            onClick={() => insert(" ")}
          >
            Space
          </button>
          <button
            type="button"
            className={`${Style.key} ${Style.wide}`}
            onMouseEnter={onBtnEnter}
            onMouseLeave={onBtnLeave}
            onClick={handleBackspace}
          >
            <i className="fa-solid fa-delete-left"></i> Backspace
          </button>
          <button
            type="button"
            className={`${Style.key} ${Style.wide}`}
            onMouseEnter={onBtnEnter}
            onMouseLeave={onBtnLeave}
            onClick={() => insert("\n")}
          >
            <i className="fa-solid fa-turn-down"></i> Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
