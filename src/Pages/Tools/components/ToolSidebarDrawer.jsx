import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  MessageSquare,
  Home,
  Wrench,
  StickyNote,
  BookOpen,
  ArrowRight,
  Coffee,
  Calculator
} from "lucide-react";

/**
 * Universal Stiknex Tool Sidebar Drawer
 * Matches the official Stiknex Drawer UI standard across all tools.
 * 
 * Includes:
 * - Brand header with Logo & Stiknex title + Close (X)
 * - Quick Search (Ctrl K) trigger
 * - Send Feedback / Direct Message trigger
 * - Workspace & Hub links (Home, All 200+ Tools, Sticky Notes, Online Notebook)
 * - Category-specific Related Tools / Calculators list with icon badges
 * - Fixed bottom "Support Stiknex" Buy Me a Coffee action
 */
export default function ToolSidebarDrawer({
  isOpen,
  onClose,
  relatedTools = [],
  categoryTitle = "Related Calculators",
  onQuickSearch,
  onFeedback
}) {
  const handleQuickSearch = () => {
    onClose?.();
    if (onQuickSearch) {
      onQuickSearch();
    } else {
      window.dispatchEvent(new Event("stiknex_open_quick_search"));
    }
  };

  const handleFeedback = () => {
    onClose?.();
    if (onFeedback) {
      onFeedback();
    } else {
      window.dispatchEvent(new Event("stiknex_open_feedback"));
    }
  };

  const renderToolIcon = (icon) => {
    if (!icon) return <Calculator size={16} />;
    if (typeof icon === "function" || (typeof icon === "object" && React.isValidElement(icon))) {
      return React.isValidElement(icon) ? icon : React.createElement(icon, { size: 16 });
    }
    if (typeof icon === "string") {
      if (icon.startsWith("fa-") || icon.includes("fa-")) {
        return <i className={icon} />;
      }
      return <span className="font-black text-xs">{icon}</span>;
    }
    return <Calculator size={16} />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Sliding Drawer Panel from Left */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            className="relative w-[85vw] max-w-sm h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Section: Brand Header & Quick Actions */}
            <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              {/* Brand Logo & Close Button */}
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  onClick={onClose}
                  className="flex items-center gap-2.5 group cursor-pointer"
                >
                  <img
                    src="/logo.png"
                    alt="Stiknex Logo"
                    className="w-8 h-8 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                  />
                  <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Stiknex
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Quick Universal Search Trigger */}
              <button
                type="button"
                onClick={handleQuickSearch}
                className="w-full mt-4 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-sm transition group cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Search size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Quick Search</span>
                </span>
                <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-500 dark:text-slate-400 font-mono">
                  Ctrl K
                </kbd>
              </button>

              {/* Send Feedback / Direct Message Trigger */}
              <button
                type="button"
                onClick={handleFeedback}
                className="w-full mt-2 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-sm transition cursor-pointer"
              >
                <MessageSquare size={16} className="text-indigo-600 dark:text-indigo-400" />
                <span>Send Feedback / Message</span>
              </button>
            </div>

            {/* Middle: Scrollable Workspace Links & Related Tools */}
            <div className="p-5 space-y-6 flex-1 overflow-y-auto no-scrollbar">
              {/* Workspace & Hub Links */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
                  Workspace &amp; Hub
                </h3>
                <div className="space-y-1">
                  <Link
                    to="/"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    <Home size={16} className="text-indigo-500" />
                    <span>Home</span>
                  </Link>

                  <Link
                    to="/tools"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    <Wrench size={16} className="text-emerald-500" />
                    <span>All 200+ Tools</span>
                  </Link>

                  <Link
                    to="/sticky-notes"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    <StickyNote size={16} className="text-amber-500" />
                    <span>Sticky Notes</span>
                  </Link>

                  <Link
                    to="/online-notebook"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    <BookOpen size={16} className="text-blue-500" />
                    <span>Online Notebook</span>
                  </Link>
                </div>
              </div>

              {/* Related Calculators / Tools List */}
              {relatedTools && relatedTools.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
                    {categoryTitle}
                  </h3>
                  <div className="space-y-1.5">
                    {relatedTools.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/${item.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            {renderToolIcon(item.icon)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-tight truncate">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                        <ArrowRight
                          size={14}
                          className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition shrink-0"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Drawer Footer: Support Stiknex Amber CTA */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
              <Link
                to="/buy-me-a-coffee"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs shadow-sm hover:shadow transition cursor-pointer"
              >
                <Coffee size={15} />
                <span>Support Stiknex</span>
              </Link>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
