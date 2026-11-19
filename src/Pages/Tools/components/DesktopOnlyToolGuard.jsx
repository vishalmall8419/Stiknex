import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Laptop, Keyboard, ArrowRight, Wrench, FileText, Sparkles, ExternalLink } from "lucide-react";

/**
 * DesktopOnlyToolGuard Component
 * 
 * Displayed on mobile viewports (< 768px) for tools that physically require
 * a full desktop screen or a physical mechanical keyboard (such as touch typing tutors).
 */
export default function DesktopOnlyToolGuard({ toolTitle = "This Tool", children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [bypassed, setBypassed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobileWidth = window.innerWidth < 768;
      setIsMobile(mobileWidth);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // If user is on desktop or explicitly chose to bypass (e.g. tablet with physical keyboard)
  if (!isMobile || bypassed) {
    return <>{children}</>;
  }

  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center p-4 sm:p-6 my-auto">
      <div className="w-full max-w-lg mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-xs"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Device Icon Avatar */}
        <div className="relative mx-auto w-20 h-20 mb-5 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-indigo-500/20 border border-indigo-200/60 dark:border-indigo-800/60 shadow-inner">
          <Laptop className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
            <Keyboard className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-3 border border-amber-200/60 dark:border-amber-700/40">
          <Sparkles className="w-3 h-3 text-amber-500" /> Best Experienced on Desktop
        </div>

        {/* Heading */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          Physical Keyboard Required
        </h2>

        {/* Explanation */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
          <strong className="font-semibold text-slate-800 dark:text-slate-100">{toolTitle}</strong> is built specifically for physical computer keyboards to practice 10-finger touch typing and measure accurate mechanical WPM speed. On-screen mobile touch keyboards are not suitable for touch typing lessons.
        </p>

        {/* Quick Actions */}
        <div className="flex flex-col gap-2.5 mb-5">
          <Link
            to="/tools"
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all"
          >
            <Wrench className="w-4 h-4" /> Browse 200+ Mobile Tools <ArrowRight className="w-4 h-4 ml-0.5" />
          </Link>

          <Link
            to="/online-notebook"
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-98 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
          >
            <FileText className="w-4 h-4 text-indigo-500" /> Open Mobile Notepad
          </Link>
        </div>

        {/* External Keyboard Bypass */}
        <button
          type="button"
          onClick={() => setBypassed(true)}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium inline-flex items-center gap-1.5 transition-colors underline underline-offset-4 decoration-slate-300 dark:decoration-slate-700 hover:decoration-indigo-500"
        >
          <span>Using an external Bluetooth / USB keyboard? Continue anyway</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
