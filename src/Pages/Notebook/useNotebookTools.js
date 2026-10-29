import { useState, useEffect, useRef, useCallback } from "react";
import swal from "sweetalert";

export const UNICODE_CATEGORIES = [
  {
    id: "popular",
    label: "Popular",
    chars: ["😊", "😂", "🔥", "✨", "❤️", "👍", "🎉", "💡", "📌", "⭐", "🚀", "☕", "📝", "✅", "👏", "🙌", "💯", "🎯"],
  },
  {
    id: "symbols",
    label: "Symbols",
    chars: ["✓", "✗", "★", "☆", "♠", "♣", "♥", "♦", "♪", "♫", "⚡", "🔔", "🏷️", "💬", "☀️", "🌙", "☁️", "❄️"],
  },
  {
    id: "math",
    label: "Math",
    chars: ["∞", "∑", "π", "Ω", "µ", "Δ", "√", "≈", "≠", "±", "÷", "×", "≤", "≥", "∫", "∂", "∝", "∈"],
  },
  {
    id: "currency",
    label: "Currency",
    chars: ["₹", "$", "€", "£", "¥", "¢", "©", "®", "™", "°", "%", "‰", "§", "¶", "•", "†"],
  },
  {
    id: "arrows",
    label: "Arrows",
    chars: ["←", "↑", "→", "↓", "↔", "↕", "➔", "➜", "⇒", "⇐", "⬆️", "⬇️", "⬅️", "➡️", "▲", "▼"],
  },
];

export const formatElapsed = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

export const useNotebookTools = ({ text, setText, editorRef, title }) => {
  // 1. Focus Sound (Brown Noise Generator)
  const [musicOn, setMusicOn] = useState(false);
  const focusSoundRef = useRef(null);

  const toggleMusic = useCallback(() => {
    if (!musicOn && !(window.AudioContext || window.webkitAudioContext)) {
      swal({
        title: "Not supported",
        text: "Your browser doesn't support Focus Sound.",
        icon: "warning",
      });
      return;
    }
    setMusicOn((prev) => !prev);
  }, [musicOn]);

  useEffect(() => {
    if (!musicOn) {
      if (focusSoundRef.current) {
        focusSoundRef.current.stop();
        focusSoundRef.current = null;
      }
      return undefined;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 900;

      const gain = ctx.createGain();
      gain.gain.value = 0.06;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();

      focusSoundRef.current = {
        stop: () => {
          try {
            source.stop();
          } catch {
            /* already stopped */
          }
          ctx.close();
        },
      };
    } catch (e) {
      console.error("Focus sound error", e);
    }

    return () => {
      if (focusSoundRef.current) {
        focusSoundRef.current.stop();
        focusSoundRef.current = null;
      }
    };
  }, [musicOn]);

  // 2. Read Aloud (TTS)
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const handleReadAloud = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      swal({
        title: "Not supported",
        text: "Your browser doesn't support Read Aloud.",
        icon: "warning",
      });
      return;
    }
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }
    const currentText = (editorRef?.current?.innerText || text || "").trim();
    if (!currentText) {
      swal({
        title: "Nothing to read",
        text: "Your notebook is empty.",
        icon: "info",
      });
      return;
    }
    const utterance = new SpeechSynthesisUtterance(currentText);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  }, [isReading, editorRef, text]);

  // 3. Stopwatch Timer
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerStartRef = useRef(null);

  useEffect(() => {
    if (!timerRunning) return undefined;
    timerStartRef.current = Date.now() - elapsedMs;
    const id = setInterval(() => {
      setElapsedMs(Date.now() - timerStartRef.current);
    }, 250);
    return () => clearInterval(id);
  }, [timerRunning, elapsedMs]);

  const toggleTimer = useCallback(() => setTimerRunning((v) => !v), []);
  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setElapsedMs(0);
  }, []);

  // 4. Snapshots
  const [snapshots, setSnapshots] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("stiknexSnapshots") || "[]");
    } catch {
      return [];
    }
  });

  const takeSnapshot = useCallback(() => {
    const noteText =
      (editorRef?.current?.innerText || editorRef?.current?.value || text || "").trim();
    const newSnapshot = {
      id: Date.now().toString(),
      text: noteText,
      title: title || "Stiknex Notebook",
      timestamp: Date.now(),
    };
    const nextList = [newSnapshot, ...snapshots];
    setSnapshots(nextList);
    try {
      localStorage.setItem("stiknexSnapshots", JSON.stringify(nextList));
    } catch (e) {
      console.warn("Could not save snapshot", e);
    }
    swal("Snapshot Taken", "Current note state saved to history.", "success");
    return newSnapshot;
  }, [editorRef, text, title, snapshots]);

  const restoreSnapshot = useCallback(
    (snapText) => {
      if (editorRef?.current) {
        if (editorRef.current.tagName === "TEXTAREA") {
          editorRef.current.value = snapText;
        } else {
          editorRef.current.innerText = snapText;
        }
      }
      setText(snapText);
      swal("Restored", "Snapshot has been restored to your editor.", "success");
    },
    [editorRef, setText]
  );

  const deleteSnapshot = useCallback(
    (snapId) => {
      const nextList = snapshots.filter((s) => s.id !== snapId);
      setSnapshots(nextList);
      try {
        localStorage.setItem("stiknexSnapshots", JSON.stringify(nextList));
      } catch (e) {
        console.warn("Could not update snapshots", e);
      }
    },
    [snapshots]
  );

  const deleteAllSnapshots = useCallback(() => {
    setSnapshots([]);
    try {
      localStorage.setItem("stiknexSnapshots", "[]");
    } catch (e) {
      console.warn("Could not clear snapshots", e);
    }
  }, []);

  // 5. Unicode / Symbol Insert
  const handleInsertUnicode = useCallback(
    (char) => {
      const editor = editorRef?.current;
      if (!editor) {
        setText((prev) => (prev || "") + char);
        return;
      }

      // If it's a textarea
      if (editor.tagName === "TEXTAREA") {
        const start = typeof editor.selectionStart === "number" ? editor.selectionStart : (text || "").length;
        const end = typeof editor.selectionEnd === "number" ? editor.selectionEnd : start;
        const currentText = typeof text === "string" ? text : "";
        const newText = currentText.substring(0, start) + char + currentText.substring(end);
        setText(newText);
        setTimeout(() => {
          try {
            editor.focus();
            editor.setSelectionRange(start + char.length, start + char.length);
          } catch {}
        }, 0);
        return;
      }

      // ContentEditable editor
      editor.focus();
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(char);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        editor.appendChild(document.createTextNode(char));
      }
      setText(editor.innerText || editor.textContent || "");
    },
    [editorRef, text, setText]
  );

  return {
    musicOn,
    setMusicOn,
    toggleMusic,
    isReading,
    handleReadAloud,
    timerRunning,
    elapsedMs,
    toggleTimer,
    resetTimer,
    snapshots,
    setSnapshots,
    takeSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    deleteAllSnapshots,
    handleInsertUnicode,
  };
};

