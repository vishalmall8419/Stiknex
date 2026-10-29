import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, BookOpen, Gamepad2, Award, Terminal, Flame, Target, Volume2, VolumeX, Shield, ArrowLeft } from "lucide-react";
import { TypingSpeedTest } from "../Tools/engines/TypingEngine";
import TypingEngine from "../Tools/engines/TypingEngine";

export default function TypingLab() {
  const [activeTab, setActiveTab] = useState("speed-test"); // speed-test | lessons | games | diagnostics

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <Link to="/tools" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Tools Directory
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="p-2 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
                <Zap className="w-8 h-8" />
              </span>
              Stiknex Typing Lab
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Master professional touch typing, boost words-per-minute (WPM), test code syntax precision, and level up through interactive arcade typing games.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 p-3 rounded-2xl">
            <div className="text-center px-3 border-r border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Mode</span>
              <span className="text-sm font-black text-indigo-400 uppercase">{activeTab.replace("-", " ")}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Zero Cost</span>
              <span className="text-sm font-black text-emerald-400">100% Free</span>
            </div>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/60 border border-white/10 rounded-2xl">
          {[
            { id: "speed-test", label: "Speed Test", icon: Zap },
            { id: "lessons", label: "Typing Lessons", icon: BookOpen },
            { id: "games", label: "Arcade Games", icon: Gamepad2 },
            { id: "code", label: "Code Challenge", icon: Terminal },
            { id: "diagnostics", label: "Keyboard Diagnostics", icon: Target }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wider transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeTab === "speed-test" && <TypingSpeedTest standalone={true} />}
          {activeTab === "lessons" && <TypingEngine slug="typing-practice-lessons" />}
          {activeTab === "games" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 border border-indigo-500/30 rounded-2xl">
                  <span className="text-xs text-indigo-400 font-bold uppercase block mb-1">Game 1</span>
                  <h4 className="text-base font-bold text-white mb-4">Falling Words Typing Rush</h4>
                  <TypingEngine slug="falling-words-game" />
                </div>
                <div className="p-4 bg-slate-900 border border-amber-500/30 rounded-2xl">
                  <span className="text-xs text-amber-400 font-bold uppercase block mb-1">Game 2</span>
                  <h4 className="text-base font-bold text-white mb-4">Daily Typing Challenge</h4>
                  <TypingEngine slug="daily-typing-challenge" />
                </div>
              </div>
            </div>
          )}
          {activeTab === "code" && <TypingEngine slug="code-typing-challenge" />}
          {activeTab === "diagnostics" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <TypingEngine slug="keyboard-key-tester" />
              <TypingEngine slug="keyboard-shortcut-finder" />
            </div>
          )}
        </div>

        {/* Why Learn Typing with Stiknex */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-white/10 text-xs text-slate-400">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1.5">
            <h5 className="font-bold text-slate-200">🚀 Increase Productivity</h5>
            <p>Moving from 35 WPM to 70 WPM cuts your typing and email drafting time in half, saving hours every week.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1.5">
            <h5 className="font-bold text-slate-200">🔒 100% Client-Side Privacy</h5>
            <p>All typing tests, lessons, and games run locally in your browser. Nothing you type is ever sent to a server.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1.5">
            <h5 className="font-bold text-slate-200">💻 Programmer Syntax Ready</h5>
            <p>Specially curated code practice exercises for JavaScript, Python, HTML/CSS, and SQL syntax fluency.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

