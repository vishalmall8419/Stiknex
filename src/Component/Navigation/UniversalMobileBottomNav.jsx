import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  StickyNote,
  BookOpen,
  PenTool,
  Wrench,
  BookMarked,
  Sparkles,
  Search,
  Info,
  Coffee,
  X,
  Menu as MenuIcon
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import ExtensionModal from "../ExtensionModal";

const ChromeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" fill="#4285F4"/>
    <path d="M12 2a10 10 0 0 1 8.66 5H12" stroke="#EA4335" strokeWidth="2"/>
    <path d="M20.66 7a10 10 0 0 1-5 13.66L12 12" stroke="#FBBC05" strokeWidth="2"/>
    <path d="M15.66 20.66A10 10 0 0 1 3.34 12H12" stroke="#34A853" strokeWidth="2"/>
  </svg>
);

/**
 * UniversalMobileBottomNav
 * 
 * Fluid Morphing Capsule Bottom Dock (Inspired by Reference media_1795076702617_a5a584fa.png)
 * - The active tab expands into a dark rounded pill with icon + label.
 * - Inactive tabs display clean outline icons without clutter.
 * - Clicking "Menu" pops up an elevated action sheet above the dock (Reference: media_1795076702616_dfecb02e.png)
 *   providing Quick Search, Theme Toggle, Extension Modal, Blog, and Support.
 * - Fully responsive across mobile, tablet, and desktop.
 */
export default function UniversalMobileBottomNav() {
  const { pathname } = useLocation();
  const { darkMode, toggleDarkMode } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);

  // Press-and-hold (Long-press) tooltip state for mobile
  const [activeTooltip, setActiveTooltip] = useState(null);
  const pressTimerRef = useRef(null);
  const isLongPressRef = useRef(false);

  const handleTouchStart = useCallback((key) => {
    isLongPressRef.current = false;
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    pressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setActiveTooltip(key);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(25);
        } catch (_) {}
      }
    }, 280);
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    if (isLongPressRef.current) {
      if (e && e.cancelable) e.preventDefault();
      setTimeout(() => {
        setActiveTooltip(null);
        isLongPressRef.current = false;
      }, 1000);
    } else {
      setActiveTooltip(null);
    }
  }, []);

  const handleTouchCancel = useCallback(() => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    setActiveTooltip(null);
    isLongPressRef.current = false;
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setActiveTooltip(null);
  }, [pathname]);

  // If on notebook or sticky-notes route, do not show universal bottom nav
  if (
    pathname === "/notebook" ||
    pathname === "/online-notebook" ||
    pathname === "/online-notepad" ||
    pathname === "/sticky-notes" ||
    pathname === "/notes"
  ) {
    return null;
  }

  // If on admin or login routes, don't show public bottom nav
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/stiknex-secure-login-portal") ||
    pathname.startsWith("/setup-2fa-admin")
  ) {
    return null;
  }

  // Determine current page context
  const isLanding = pathname === "/";
  const isStickyNotes = pathname === "/sticky-notes" || pathname === "/notes";
  const isNotebook = pathname === "/notebook" || pathname === "/online-notebook";
  const isWhiteboard = pathname === "/whiteboard";
  const isBlog = pathname.startsWith("/blog");
  const isTools =
    pathname === "/tools" ||
    pathname.startsWith("/tools/") ||
    pathname.includes("-calculator") ||
    pathname.includes("-converter") ||
    pathname.includes("-generator");

  // Context-aware navigation tabs
  const getNavTabs = () => {
    if (isBlog) {
      return [
        { key: "home", label: "Home", path: "/", icon: Home, isActive: false },
        { key: "notes", label: "Notes", path: "/sticky-notes", icon: StickyNote, isActive: false },
        { key: "notepad", label: "Notepad", path: "/online-notebook", icon: BookOpen, isActive: false },
        { key: "tools", label: "Tools", path: "/tools", icon: Wrench, isActive: false },
        { key: "blog", label: "Blog", path: "/blog", icon: BookMarked, isActive: true },
      ];
    }

    if (isTools) {
      return [
        { key: "home", label: "Home", path: "/", icon: Home, isActive: false },
        { key: "notes", label: "Notes", path: "/sticky-notes", icon: StickyNote, isActive: false },
        { key: "notepad", label: "Notepad", path: "/online-notebook", icon: BookOpen, isActive: false },
        { key: "board", label: "Board", path: "/whiteboard", icon: PenTool, isActive: false },
        { key: "tools", label: "Tools", path: "/tools", icon: Wrench, isActive: true },
      ];
    }

    if (isWhiteboard) {
      return [
        { key: "home", label: "Home", path: "/", icon: Home, isActive: false },
        { key: "notes", label: "Notes", path: "/sticky-notes", icon: StickyNote, isActive: false },
        { key: "notepad", label: "Notepad", path: "/online-notebook", icon: BookOpen, isActive: false },
        { key: "board", label: "Board", path: "/whiteboard", icon: PenTool, isActive: true },
        { key: "tools", label: "Tools", path: "/tools", icon: Wrench, isActive: false },
      ];
    }

    if (isNotebook) {
      return [
        { key: "home", label: "Home", path: "/", icon: Home, isActive: false },
        { key: "notes", label: "Notes", path: "/sticky-notes", icon: StickyNote, isActive: false },
        { key: "notepad", label: "Notepad", path: "/online-notebook", icon: BookOpen, isActive: true },
        { key: "board", label: "Board", path: "/whiteboard", icon: PenTool, isActive: false },
        { key: "tools", label: "Tools", path: "/tools", icon: Wrench, isActive: false },
      ];
    }

    if (isStickyNotes) {
      return [
        { key: "home", label: "Home", path: "/", icon: Home, isActive: false },
        { key: "notes", label: "Notes", path: "/sticky-notes", icon: StickyNote, isActive: true },
        { key: "notepad", label: "Notepad", path: "/online-notebook", icon: BookOpen, isActive: false },
        { key: "board", label: "Board", path: "/whiteboard", icon: PenTool, isActive: false },
        { key: "tools", label: "Tools", path: "/tools", icon: Wrench, isActive: false },
      ];
    }

    // Default / Landing page
    return [
      { key: "home", label: "Home", path: "/", icon: Home, isActive: isLanding },
      { key: "notes", label: "Notes", path: "/sticky-notes", icon: StickyNote, isActive: false },
      { key: "notepad", label: "Notepad", path: "/online-notebook", icon: BookOpen, isActive: false },
      { key: "board", label: "Board", path: "/whiteboard", icon: PenTool, isActive: false },
      { key: "tools", label: "Tools", path: "/tools", icon: Wrench, isActive: false },
    ];
  };

  const navTabs = getNavTabs();

  return (
    <>
      {/* Backdrop overlay when Quick Menu is open */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/35 dark:bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Floating Bottom Dock Container (Phone only: md:hidden) */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none md:hidden"
        style={{ bottom: "max(8px, env(safe-area-inset-bottom, 8px))" }}
      >
        {/* Floating Quick Action Sheet Above Bottom Bar */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
              className="mb-3 p-2 sm:p-2.5 rounded-3xl bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-2xl border border-[#EADFD5] dark:border-slate-800 shadow-[0_20px_50px_rgba(19,78,94,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center gap-2 sm:gap-3 pointer-events-auto"
            >
              {/* 1. Quick Search */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  window.dispatchEvent(new Event("stiknex_open_quick_search"));
                }}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl hover:bg-[#FAF7F2] dark:hover:bg-slate-800/80 transition-all cursor-pointer group"
                title="Quick Search (Ctrl+K)"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-slate-800/80 border border-[#EADFD5] dark:border-slate-700/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search size={18} className="text-[#134E5E] dark:text-teal-400" />
                </div>
                <span className="text-[10px] font-bold text-[#0F3944] dark:text-slate-200">Search</span>
              </button>

              {/* 2. About Stiknex */}
              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl hover:bg-[#FAF7F2] dark:hover:bg-slate-800/80 transition-all cursor-pointer group"
                title="About Stiknex"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-slate-800/80 border border-[#EADFD5] dark:border-slate-700/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Info size={18} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-[10px] font-bold text-[#0F3944] dark:text-slate-200">About</span>
              </Link>

              {/* 3. Chrome Extension */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setShowExtensionModal(true);
                }}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl hover:bg-[#FAF7F2] dark:hover:bg-slate-800/80 transition-all cursor-pointer group"
                title="Add Chrome Extension"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-slate-800/80 border border-[#EADFD5] dark:border-slate-700/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChromeIcon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-[#0F3944] dark:text-slate-200">Extension</span>
              </button>

              {/* 4. Blog */}
              <Link
                to="/blog"
                onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl hover:bg-[#FAF7F2] dark:hover:bg-slate-800/80 transition-all cursor-pointer group"
                title="Blog & Articles"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-slate-800/80 border border-[#EADFD5] dark:border-slate-700/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookMarked size={18} className="text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-[10px] font-bold text-[#0F3944] dark:text-slate-200">Blog</span>
              </Link>

              {/* 5. Support */}
              <Link
                to="/buy-me-a-coffee"
                onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl hover:bg-[#FAF7F2] dark:hover:bg-slate-800/80 transition-all cursor-pointer group"
                title="Support Development"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-slate-800/80 border border-[#EADFD5] dark:border-slate-700/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Coffee size={18} className="text-amber-500 dark:text-amber-400" />
                </div>
                <span className="text-[10px] font-bold text-[#0F3944] dark:text-slate-200">Support</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fluid Morphing Capsule Dock (Reference: media_1795076702617_a5a584fa.png) */}
        <nav
          className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_12px_45px_rgba(15,23,42,0.15)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.6)]"
          role="navigation"
          aria-label="Universal Site Navigation"
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.isActive && !menuOpen;
            const isTooltipVisible = activeTooltip === tab.key;

            return (
              <div key={tab.key} className="relative flex items-center justify-center">
                {/* Mobile Press-and-Hold Tooltip Badge */}
                <AnimatePresence>
                  {isTooltipVisible && !active && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.85 }}
                      animate={{ opacity: 1, y: -10, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.85 }}
                      transition={{ duration: 0.15 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[#0F3944] dark:bg-slate-800 text-white text-[11px] font-bold tracking-tight shadow-xl whitespace-nowrap pointer-events-none z-50 flex items-center justify-center border border-white/20"
                    >
                      <span>{tab.label}</span>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0F3944] dark:bg-slate-800 rotate-45 border-r border-b border-white/20" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link
                  to={tab.path}
                  onClick={(e) => {
                    if (isLongPressRef.current) {
                      e.preventDefault();
                      e.stopPropagation();
                      return;
                    }
                  }}
                  onTouchStart={() => handleTouchStart(tab.key)}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchCancel}
                  onTouchMove={handleTouchCancel}
                  onContextMenu={(e) => {
                    if (isLongPressRef.current) e.preventDefault();
                  }}
                  className={`relative flex items-center select-none transition-all cursor-pointer ${
                    active
                      ? "px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-white dark:text-slate-900 font-bold text-xs sm:text-sm gap-2"
                      : "p-2.5 sm:p-3 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                  title={tab.label}
                  aria-label={tab.label}
                >
                  {/* Fluid Morphing Dark Pill Background */}
                  {active && (
                    <motion.div
                      layoutId="activeBottomBarPill"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute inset-0 bg-[#134E5E] dark:bg-white rounded-full -z-10 shadow-md"
                    />
                  )}

                  <Icon size={18} className="shrink-0 stroke-[2.2]" />
                  
                  {/* Active Tab Text Label (Expands on active state) */}
                  {active && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="whitespace-nowrap tracking-tight"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </Link>
              </div>
            );
          })}

          {/* Context Menu / Sidebar Button */}
          <div className="relative flex items-center justify-center">
            {/* Mobile Press-and-Hold Tooltip Badge for Menu */}
            <AnimatePresence>
              {activeTooltip === "menu" && (!menuOpen || isStickyNotes) && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.85 }}
                  animate={{ opacity: 1, y: -10, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.85 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[#0F3944] dark:bg-slate-800 text-white text-[11px] font-bold tracking-tight shadow-xl whitespace-nowrap pointer-events-none z-50 flex items-center justify-center border border-white/20"
                >
                  <span>{isStickyNotes ? "Sidebar" : "Menu"}</span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0F3944] dark:bg-slate-800 rotate-45 border-r border-b border-white/20" />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={(e) => {
                if (isLongPressRef.current) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                if (isStickyNotes) {
                  window.dispatchEvent(new Event("stiknex_toggle_sidebar"));
                } else {
                  setMenuOpen((prev) => !prev);
                }
              }}
              onTouchStart={() => handleTouchStart("menu")}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchCancel}
              onTouchMove={handleTouchCancel}
              onContextMenu={(e) => {
                if (isLongPressRef.current) e.preventDefault();
              }}
              aria-label={isStickyNotes ? "Toggle Sidebar" : "Toggle Quick Menu"}
              aria-expanded={menuOpen}
              className={`relative flex items-center select-none transition-all cursor-pointer ${
                menuOpen && !isStickyNotes
                  ? "px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-white dark:text-slate-900 font-bold text-xs sm:text-sm gap-2"
                  : "p-2.5 sm:p-3 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
              title={isStickyNotes ? "Open Workspace Sidebar" : "Menu & Quick Tools"}
            >
              {menuOpen && !isStickyNotes && (
                <motion.div
                  layoutId="activeBottomBarPill"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  className="absolute inset-0 bg-[#134E5E] dark:bg-white rounded-full -z-10 shadow-md"
                />
              )}

              {menuOpen && !isStickyNotes ? (
                <X size={18} className="shrink-0 stroke-[2.2]" />
              ) : (
                <MenuIcon size={18} className="shrink-0 stroke-[2.2]" />
              )}

              {menuOpen && !isStickyNotes && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="whitespace-nowrap tracking-tight"
                >
                  Menu
                </motion.span>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Chrome Extension Modal */}
      <ExtensionModal isOpen={showExtensionModal} onClose={() => setShowExtensionModal(false)} />
    </>
  );
}
