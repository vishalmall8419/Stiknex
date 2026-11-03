import React, { useState, useMemo } from "react";
import { Copy, Check, Trash2, Clock, AlignLeft, Type, FileText, Volume2, Share2, BarChart2 } from "lucide-react";

export default function WordCounter({ initialMode = "word" }) {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const wordsArray = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const words = wordsArray.length;
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

    // Keyword density: top 4 frequent words of length >= 3
    const freqMap = {};
    wordsArray.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (clean.length >= 3) {
        freqMap[clean] = (freqMap[clean] || 0) + 1;
      }
    });
    const topKeywords = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([word, count]) => ({
        word,
        count,
        percent: ((count / Math.max(1, words)) * 100).toFixed(1),
      }));

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime: readingTimeStr,
      speakingTime: speakingTimeStr,
      topKeywords,
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

  const SOCIAL_LIMITS = [
    { name: "Twitter / X", max: 280, count: stats.characters },
    { name: "Instagram Caption", max: 2200, count: stats.characters },
    { name: "LinkedIn Post", max: 3000, count: stats.characters },
  ];

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
              className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              title="Copy Text"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
            <button
              onClick={handleClear}
              className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 shadow-sm border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              title="Clear Text"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Secondary Detailed Breakdown & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
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
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition disabled:opacity-40 cursor-pointer"
          >
            UPPERCASE
          </button>
          <button
            onClick={() => transformCase("lower")}
            disabled={!text}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition disabled:opacity-40 cursor-pointer"
          >
            lowercase
          </button>
          <button
            onClick={() => transformCase("title")}
            disabled={!text}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition disabled:opacity-40 cursor-pointer"
          >
            Title Case
          </button>
        </div>
      </div>

      {/* Social Media Character Limits Counter */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Social Media Character Limits
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SOCIAL_LIMITS.map((soc) => {
            const pct = Math.min(100, Math.round((soc.count / soc.max) * 100));
            const isExceeded = soc.count > soc.max;
            return (
              <div key={soc.name} className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-200">{soc.name}</span>
                  <span className={`font-mono text-[11px] font-bold ${isExceeded ? "text-rose-500" : "text-slate-400"}`}>
                    {soc.count} / {soc.max}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isExceeded ? "bg-rose-500" : pct > 80 ? "bg-amber-500" : "bg-indigo-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Keywords Density */}
      {stats.topKeywords.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 text-slate-400">
            <BarChart2 className="w-3.5 h-3.5" /> Top Keywords:
          </span>
          {stats.topKeywords.map((k) => (
            <span
              key={k.word}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/40 font-medium"
            >
              <strong>{k.word}</strong>: {k.count}× ({k.percent}%)
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
