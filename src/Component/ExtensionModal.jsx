import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, CheckCircle2, Sparkles, Layers, ShieldCheck, ExternalLink } from "lucide-react";

const ChromeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" fill="#4285F4"/>
    <path d="M12 2a10 10 0 0 1 8.66 5H12" stroke="#EA4335" strokeWidth="2"/>
    <path d="M20.66 7a10 10 0 0 1-5 13.66L12 12" stroke="#FBBC05" strokeWidth="2"/>
    <path d="M15.66 20.66A10 10 0 0 1 3.34 12H12" stroke="#34A853" strokeWidth="2"/>
  </svg>
);

export default function ExtensionModal({ isOpen, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Gradient Accent */}
            <div className="h-2 w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center shrink-0 shadow-sm">
                  <img src="/logo.png" alt="Stiknex" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] mb-1">
                    <ChromeIcon className="w-3.5 h-3.5" /> Chrome Extension v1.0.0
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Stiknex for Google Chrome
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Access 19 offline tools, sticky notes, and a persistent side panel companion anywhere you browse without switching tabs.
              </p>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs text-slate-700 dark:text-slate-200">
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <Sparkles size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                  <span><strong>19 Offline Tools</strong> (Calculators, Converters, Word Counter)</span>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <Layers size={16} className="text-purple-500 shrink-0 mt-0.5" />
                  <span><strong>Chrome Side Panel</strong> companion alongside any page</span>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Right-Click Menu</strong> to save notes & count words</span>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <ShieldCheck size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>100% Private</strong> with Manifest V3 & zero tracking</span>
                </div>
              </div>

              {/* Direct Download Button */}
              <div className="mb-6">
                <a
                  href="/stiknex-chrome-extension.zip"
                  download="stiknex-chrome-extension.zip"
                  className="w-full group flex items-center justify-center gap-2.5 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all text-sm sm:text-base"
                >
                  <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                  <span>Download Extension (.ZIP package)</span>
                </a>
              </div>

              {/* 3-Step Setup Guide */}
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  Quick 10-Second Setup in Chrome
                </h4>
                <ol className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0 text-[11px]">
                      1
                    </span>
                    <span>Download and unzip <strong>stiknex-chrome-extension.zip</strong> onto your computer.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0 text-[11px]">
                      2
                    </span>
                    <span>Open <strong>chrome://extensions</strong> in Chrome and toggle on <strong>Developer mode</strong> (top-right).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0 text-[11px]">
                      3
                    </span>
                    <span>Click <strong>Load unpacked</strong> and select the unzipped <code>extension</code> folder.</span>
                  </li>
                </ol>
              </div>

              {/* Note / Chrome Web Store */}
              <div className="mt-4 text-center">
                <span className="text-[11px] text-slate-400">
                  Free and open source. Web Store listing submission in progress.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
