import React, { useState, useMemo } from "react";
import { Copy, Check, Trash2, Clock, AlignLeft, Type, FileText, Volume2 } from "lucide-react";

const WordCounter = ({ initialMode = "word" }) => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+(?:\s+|$)/g) || []).length || (trimmed.length > 0 ? 1 : 0) : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter(p => p.trim().length > 0).length : 0;

    // Reading time: average 200 words per minute
    const readingMinutes = Math.ceil(words / 200);
    const readingSeconds = Math.round((words / 200) * 60);
    const readingTimeStr = words === 0 ? "0 sec" : readingSeconds < 60 ? `${readingSeconds} sec` : `${readingMinutes} min`;

    // Speaking time: average 130 words per minute
    const speakingMinutes = Math.ceil(words / 130);
    const speakingSeconds = Math.round((words / 130) * 60);
    const speakingTimeStr = words === 0 ? "0 sec" : speakingSeconds < 60 ? `${speakingSeconds} sec` : `${speakingMinutes} min`;

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime: readingTimeStr,
      speakingTime: speakingTimeStr,
    };
  }, [text]);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText("");
  };

  const transformCase = (type) => {
    if (type === "upper") setText(text.toUpperCase());
    if (type === "lower") setText(text.toLowerCase());
    if (type === "title") {
      setText(
        text
          .toLowerCase()
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Key Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <FileText size={14} /> Words
          </div>
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {stats.words.toLocaleString()}
          </span>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
            <Type size={14} /> Characters
          </div>
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {stats.characters.toLocaleString()}
          </span>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Clock size={14} /> Reading Time
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.readingTime}
          </span>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Volume2 size={14} /> Speaking Time
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.speakingTime}
          </span>
        </div>
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to count words, characters, sentences and estimate reading time..."
          rows={9}
          className="w-full p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-base resize-y transition shadow-inner leading-relaxed"
        />
        {text && (
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700 transition"
              title="Copy Text"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
            <button
              onClick={handleClear}
              className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 shadow-sm border border-slate-200 dark:border-slate-700 transition"
              title="Clear Text"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Secondary Detailed Breakdown & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>
            No spaces: <strong className="text-slate-800 dark:text-slate-200 font-bold">{stats.charactersNoSpaces}</strong>
          </span>
          <span>•</span>
          <span>
            Sentences: <strong className="text-slate-800 dark:text-slate-200 font-bold">{stats.sentences}</strong>
          </span>
          <span>•</span>
          <span>
            Paragraphs: <strong className="text-slate-800 dark:text-slate-200 font-bold">{stats.paragraphs}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => transformCase("upper")}
            disabled={!text}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition disabled:opacity-40"
          >
            UPPERCASE
          </button>
          <button
            onClick={() => transformCase("lower")}
            disabled={!text}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition disabled:opacity-40"
          >
            lowercase
          </button>
          <button
            onClick={() => transformCase("title")}
            disabled={!text}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition disabled:opacity-40"
          >
            Title Case
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordCounter;

