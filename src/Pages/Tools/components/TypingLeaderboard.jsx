import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Crown,
  Medal,
  ChevronLeft,
  ChevronRight,
  Globe,
  Calendar,
  Flame,
  Clock,
  Zap,
  User,
  Shield,
  ArrowRight,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Target
} from "lucide-react";
import { useAppContext } from "../../../context/AppContext";

export default function TypingLeaderboard({ theme }) {
  const { user, openAuthModal, darkMode } = useAppContext();
  const isDark = theme === "dark" || Boolean(darkMode);

  // Filter States
  const [category, setCategory] = useState("all-time"); // 'all-time' | 'weekly' | 'daily'
  const [timeLimit, setTimeLimit] = useState(0); // 0 (all) | 15 | 30 | 60
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchLeaderboard = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(
        `/api/auth?action=typing-leaderboard&category=${category}&timeLimit=${timeLimit}&page=${page}`
      );
      const data = await res.json();
      if (data?.success && Array.isArray(data.leaderboard)) {
        setLeaderboard(data.leaderboard);
      } else {
        setLeaderboard([]);
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      if (!silent) setLeaderboard([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(false);
  }, [category, timeLimit, page]);

  // Internal silent background auto-refresh every 20 seconds (no visible timer text)
  useEffect(() => {
    const timer = setInterval(() => {
      fetchLeaderboard(true);
    }, 20000);
    return () => clearInterval(timer);
  }, [category, timeLimit, page]);

  // Avatar renderer with distinct Stiknex themes
  const renderAvatar = (avatarType, rank) => {
    if (rank === 1) {
      return (
        <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/40 flex items-center justify-center text-sm shadow-xs shrink-0">
          👑
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-7 h-7 rounded-xl bg-slate-300/20 text-slate-300 border border-slate-400/40 flex items-center justify-center text-sm shrink-0">
          🥈
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-7 h-7 rounded-xl bg-amber-700/20 text-amber-600 border border-amber-700/40 flex items-center justify-center text-sm shrink-0">
          🥉
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-xs shrink-0">
        <User size={13} />
      </span>
    );
  };

  // Distinct Tier Pills
  const getTierBadge = (tier) => {
    const tierStyles = {
      Mythical: "bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30",
      Master: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
      Diamond: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
      Pro: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
      Standard: "bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700"
    };

    return (
      <span
        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${
          tierStyles[tier] || tierStyles.Standard
        }`}
      >
        {tier || "Standard"}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recent";
    const d = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year} ${hours}:${mins}`;
  };

  // Top 3 Spotlight Contenders
  const topThree = leaderboard.slice(0, 3);
  const remainingRows = leaderboard.slice(3);

  return (
    <div className="w-full space-y-6 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. STIKNEX SPEED ARENA HEADER (ORIGINAL IDENTITY)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Stiknex Speed Arena • Hall of Fame
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Trophy className="w-7 h-7 text-amber-500 shrink-0" />
            <span>Global Typing Champions</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Real biometric typing speeds verified and benchmarked across our global user base.
          </p>
        </div>

        {/* Live Indicator & Manual Refresh */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center font-mono">
          <div className="px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Live DB</span>
          </div>
          <button
            onClick={() => fetchLeaderboard(false)}
            title="Refresh Leaderboard"
            className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-amber-500 hover:border-amber-500/40 transition cursor-pointer shadow-2xs"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-amber-500" : ""} />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HORIZONTAL SEGMENTED CONTROLS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-bold">
        {/* Division Tabs */}
        <div className="flex items-center gap-1 bg-white/70 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
          <button
            onClick={() => {
              setCategory("all-time");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              category === "all-time"
                ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            <Globe size={13} />
            <span>All-Time</span>
          </button>

          <button
            onClick={() => {
              setCategory("weekly");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              category === "weekly"
                ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            <Calendar size={13} />
            <span>Weekly</span>
          </button>

          <button
            onClick={() => {
              setCategory("daily");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              category === "daily"
                ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            <Flame size={13} />
            <span>Daily</span>
          </button>
        </div>

        {/* Duration / Mode Selectors */}
        <div className="flex items-center gap-1 bg-white/70 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-2xs font-mono">
          <button
            onClick={() => {
              setTimeLimit(0);
              setPage(1);
            }}
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer text-xs ${
              timeLimit === 0
                ? "bg-slate-900 dark:bg-amber-500 text-amber-400 dark:text-slate-950 font-black shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            🏆 All
          </button>
          <button
            onClick={() => {
              setTimeLimit(15);
              setPage(1);
            }}
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer text-xs ${
              timeLimit === 15
                ? "bg-slate-900 dark:bg-amber-500 text-amber-400 dark:text-slate-950 font-black shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            ⚡ 15s
          </button>
          <button
            onClick={() => {
              setTimeLimit(30);
              setPage(1);
            }}
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer text-xs ${
              timeLimit === 30
                ? "bg-slate-900 dark:bg-amber-500 text-amber-400 dark:text-slate-950 font-black shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            🔥 30s
          </button>
          <button
            onClick={() => {
              setTimeLimit(60);
              setPage(1);
            }}
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer text-xs ${
              timeLimit === 60
                ? "bg-slate-900 dark:bg-amber-500 text-amber-400 dark:text-slate-950 font-black shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            ⏱️ 60s
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TOP 3 PODIUM SPOTLIGHT (UNIQUE STIKNEX FEATURE)
      ───────────────────────────────────────────────────────────── */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* #2 Runner Up */}
          {topThree[1] && (
            <div className="order-2 sm:order-1 p-5 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3">
                <span className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-black">
                  🥈 Rank #2
                </span>
                {getTierBadge(topThree[1].tier)}
              </div>
              <div className="space-y-1.5 my-2">
                <div className="flex items-center gap-2">
                  {renderAvatar(topThree[1].avatar, 2)}
                  <span className="font-bold text-slate-900 dark:text-white text-sm truncate">
                    @{topThree[1].username}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-3xl font-black text-slate-800 dark:text-slate-100 font-mono">
                    {topThree[1].wpm}
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">WPM</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{topThree[1].accuracy}% acc</span>
                  <span>•</span>
                  <span>{topThree[1].consistency}% consistency</span>
                </div>
              </div>
            </div>
          )}

          {/* #1 Champion (Center Podium) */}
          {topThree[0] && (
            <div className="order-1 sm:order-2 p-6 rounded-3xl bg-gradient-to-b from-amber-500/15 via-white dark:via-[#151a24] to-white dark:to-[#12161f] border-2 border-amber-500/50 shadow-xl shadow-amber-500/10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1 bg-amber-500 text-slate-950 font-mono font-black text-[10px] rounded-bl-2xl uppercase tracking-wider">
                👑 Arena Champion
              </div>
              <div className="flex items-center justify-between pb-3">
                <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-mono text-xs font-black shadow-xs">
                  🥇 Rank #1
                </span>
                {getTierBadge(topThree[0].tier)}
              </div>
              <div className="space-y-2 my-2">
                <div className="flex items-center gap-2.5">
                  {renderAvatar(topThree[0].avatar, 1)}
                  <span className="font-black text-slate-900 dark:text-white text-base truncate">
                    @{topThree[0].username}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-4xl sm:text-5xl font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight">
                    {topThree[0].wpm}
                  </span>
                  <span className="text-sm font-black text-amber-600/80 dark:text-amber-400/80 font-mono">WPM</span>
                </div>
                <div className="text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{topThree[0].accuracy}% acc</span>
                  <span>•</span>
                  <span>{topThree[0].rawWpm} raw</span>
                  <span>•</span>
                  <span>{topThree[0].consistency}% rhythm</span>
                </div>
              </div>
            </div>
          )}

          {/* #3 Bronze Contender */}
          {topThree[2] && (
            <div className="order-3 p-5 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3">
                <span className="px-2.5 py-1 rounded-xl bg-amber-800/20 text-amber-700 dark:text-amber-400 font-mono text-xs font-black">
                  🥉 Rank #3
                </span>
                {getTierBadge(topThree[2].tier)}
              </div>
              <div className="space-y-1.5 my-2">
                <div className="flex items-center gap-2">
                  {renderAvatar(topThree[2].avatar, 3)}
                  <span className="font-bold text-slate-900 dark:text-white text-sm truncate">
                    @{topThree[2].username}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-3xl font-black text-slate-800 dark:text-slate-100 font-mono">
                    {topThree[2].wpm}
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">WPM</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{topThree[2].accuracy}% acc</span>
                  <span>•</span>
                  <span>{topThree[2].consistency}% consistency</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. LEADERBOARD DATA TABLE (HIGH CONTRAST LIGHT & DARK)
      ───────────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#12161f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            {category === "all-time" ? "All-Time" : category === "weekly" ? "Weekly" : "Daily"} • {timeLimit ? `${timeLimit}s Drill` : "All Tests"} Standings
          </span>
          <span className="text-xs font-mono text-slate-500">
            {leaderboard.length} verified typers
          </span>
        </div>

        {leaderboard.length === 0 ? (
          <div className="py-16 text-center space-y-3 font-mono">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto text-2xl shadow-xs">
              ⚡
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No real benchmark scores recorded yet for this division
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-sans leading-relaxed">
              Be the first champion! Sign in and complete a 15s or 60s test in Speed Arena to claim Rank #1 on the live leaderboard.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <th className="py-3 w-12 text-center font-bold">#</th>
                <th className="py-3 font-bold">Typer Handle</th>
                <th className="py-3 text-right font-bold">
                  <div>Speed</div>
                  <div className="text-[10px] text-slate-400 font-normal">Accuracy</div>
                </th>
                <th className="py-3 text-right font-bold pr-4">
                  <div>Raw Speed</div>
                  <div className="text-[10px] text-slate-400 font-normal">Rhythm</div>
                </th>
                <th className="py-3 text-right font-bold hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {leaderboard.map((item, idx) => {
                const isUser = user && user.username === item.username;
                const isTopThree = item.rank <= 3;

                return (
                  <tr
                    key={item.rank || idx}
                    className={`transition-colors ${
                      isUser
                        ? "bg-amber-500/15 hover:bg-amber-500/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 text-center font-bold">
                      {item.rank === 1 ? (
                        <span className="text-base">👑</span>
                      ) : item.rank === 2 ? (
                        <span className="text-base">🥈</span>
                      ) : item.rank === 3 ? (
                        <span className="text-base">🥉</span>
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400 font-black">
                          {item.rank}
                        </span>
                      )}
                    </td>

                    {/* Typer Handle + Avatar + Tier */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        {renderAvatar(item.avatar, item.rank)}
                        <span
                          className={`font-bold ${
                            isUser
                              ? "text-amber-600 dark:text-amber-400 font-black text-sm"
                              : isTopThree
                              ? "text-slate-900 dark:text-white font-bold"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          @{item.username}
                        </span>
                        {getTierBadge(item.tier)}
                        {isUser && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>

                    {/* WPM & Accuracy */}
                    <td className="py-3.5 text-right">
                      <div className="text-slate-900 dark:text-white font-black text-sm">
                        {item.wpm}
                        <span className="text-[10px] text-slate-400 font-normal ml-0.5">WPM</span>
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        {item.accuracy}%
                      </div>
                    </td>

                    {/* Raw & Consistency */}
                    <td className="py-3.5 text-right pr-4">
                      <div className="text-slate-700 dark:text-slate-300 font-bold">
                        {item.rawWpm || item.wpm}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.consistency || 90}%
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 text-right text-slate-500 text-[11px] hidden sm:table-cell">
                      {formatDate(item.date)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}

        {/* Join Leaderboard CTA for Guests */}
        {!user && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                <span>Want to join the Speed Arena Leaderboard?</span>
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-sans">
                Create a free account in 10 seconds. Every typing test you take automatically saves to the database and ranks your personal peak WPM!
              </p>
            </div>
            <button
              onClick={() => openAuthModal("register")}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-sm shrink-0 flex items-center gap-1.5"
            >
              <span>Sign Up &amp; Save Scores</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
