import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  StickyNote,
  BookOpen,
  PenTool,
  Wrench,
  BookMarked,
  Plus,
  X,
  Search,
  Sparkles,
  Share2,
  Moon,
  Sun,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";

/**
 * UniversalMobileBottomNav
 * 
 * Dynamic, context-aware mobile floating bottom navigation dock.
 * Active exclusively on mobile screens (< 768px).
 * Replaces clunky sidebars and overcrowded top navbars on mobile.
 * Adapts items and quick actions dynamically based on the current page route.
 */
export default function UniversalMobileBottomNav() {
  const { pathname } = useLocation();
  const { darkMode, toggleDarkMode } = useAppContext();
  const [sheetOpen, setSheetOpen] = useState(false);

  // If on notebook route, Notebook.jsx already has its own dedicated NotebookBottomDock
  if (pathname === "/notebook" || pathname === "/online-notebook") {
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

  // If user is actively inside Excalidraw whiteboard editor, let Excalidraw have full screen
  if (pathname === "/whiteboard" && typeof document !== "undefined" && document.querySelector(".excalidraw")) {
    return null;
  }

  // Determine current page context
  const isStickyNotes = pathname === "/sticky-notes" || pathname === "/notes";
  const isWhiteboard = pathname === "/whiteboard";
  const isBlog = pathname.startsWith("/blog");
  const isTools =
    pathname === "/tools" ||
    pathname.startsWith("/tools/") ||
    pathname.includes("-calculator") ||
    pathname.includes("-converter") ||
    pathname.includes("-generator");
  const isLanding = pathname === "/";

  // Context-aware navigation tabs
  const getNavTabs = () => {
    if (isBlog) {
      return [
        { label: "Home", path: "/", icon: Home },
        { label: "Notes", path: "/sticky-notes", icon: StickyNote },
        { label: "Notepad", path: "/online-notebook", icon: BookOpen },
        { label: "Tools", path: "/tools", icon: Wrench },
        { label: "Blog", path: "/blog", icon: BookMarked, isActive: true },
      ];
    }

    if (isTools) {
      return [
        { label: "Home", path: "/", icon: Home },
        { label: "Notes", path: "/sticky-notes", icon: StickyNote },
        { label: "Notepad", path: "/online-notebook", icon: BookOpen },
        { label: "Tools", path: "/tools", icon: Wrench, isActive: true },
        { label: "Blog", path: "/blog", icon: BookMarked },
      ];
    }

    if (isWhiteboard) {
      return [
        { label: "Home", path: "/", icon: Home },
        { label: "Notes", path: "/sticky-notes", icon: StickyNote },
        { label: "Board", path: "/whiteboard", icon: PenTool, isActive: true },
        { label: "Notepad", path: "/online-notebook", icon: BookOpen },
        { label: "Tools", path: "/tools", icon: Wrench },
      ];
    }

    if (isStickyNotes) {
      return [
        { label: "Home", path: "/", icon: Home },
        { label: "Notes", path: "/sticky-notes", icon: StickyNote, isActive: true },
        { label: "Board", path: "/whiteboard", icon: PenTool },
        { label: "Notepad", path: "/online-notebook", icon: BookOpen },
        { label: "Tools", path: "/tools", icon: Wrench },
      ];
    }

    // Default / Landing page
    return [
      { label: "Home", path: "/", icon: Home, isActive: isLanding },
      { label: "Notes", path: "/sticky-notes", icon: StickyNote },
      { label: "Board", path: "/whiteboard", icon: PenTool },
      { label: "Notepad", path: "/online-notebook", icon: BookOpen },
      { label: "Tools", path: "/tools", icon: Wrench },
    ];
  };

  const navTabs = getNavTabs();

  // Page-specific FAB action or drawer
  const handleFabClick = () => {
    if (isStickyNotes) {
      // Create sticky note via global custom event or focus note creator
      window.dispatchEvent(new Event("stiknex_quick_create_note"));
      setSheetOpen(!sheetOpen);
    } else {
      setSheetOpen(!sheetOpen);
    }
  };

  return (
    <>
      {/* Backdrop overlay when quick sheet is open */}
      {sheetOpen && (
        <div
          onClick={() => setSheetOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs md:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* Contextual Quick Actions Bottom Sheet */}
      {sheetOpen && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-20px)] max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xl shadow-indigo-500/20 md:hidden animate-slide-up">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isStickyNotes
                  ? "Sticky Notes Actions"
                  : isWhiteboard
                  ? "Whiteboard Actions"
                  : isBlog
                  ? "Blog Tools"
                  : isTools
                  ? "Quick Tools"
                  : "Quick Navigator"}
              </span>
            </div>
            <button
              onClick={() => setSheetOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            {isStickyNotes && (
              <>
                <button
                  onClick={() => {
                    window.dispatchEvent(new Event("stiknex_quick_create_note"));
                    setSheetOpen(false);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50"
                >
                  <Plus size={15} /> New Note
                </button>
                <Link
                  to="/online-notebook"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <BookOpen size={15} className="text-purple-500" /> Open Notepad
                </Link>
              </>
            )}

            {isWhiteboard && (
              <>
                <Link
                  to="/sticky-notes"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <StickyNote size={15} className="text-amber-500" /> Sticky Notes
                </Link>
                <button
                  onClick={() => {
                    window.dispatchEvent(new Event("stiknex_open_feedback"));
                    setSheetOpen(false);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                >
                  <Share2 size={15} /> Feedback
                </button>
              </>
            )}

            {isBlog && (
              <>
                <Link
                  to="/blog"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                >
                  <BookMarked size={15} /> All Articles
                </Link>
                <Link
                  to="/tools"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <Wrench size={15} className="text-emerald-500" /> Utilities
                </Link>
              </>
            )}

            {isTools && (
              <>
                <Link
                  to="/basic-calculator"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <span>🧮</span> Calculator
                </Link>
                <Link
                  to="/qr-code-generator"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <span>📱</span> QR Generator
                </Link>
                <Link
                  to="/word-counter"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <span>✍️</span> Word Counter
                </Link>
                <Link
                  to="/password-generator"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <span>🔐</span> Password
                </Link>
              </>
            )}

            {isLanding && (
              <>
                <Link
                  to="/sticky-notes"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/50"
                >
                  <StickyNote size={15} /> Sticky Notes
                </Link>
                <Link
                  to="/tools"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-900/50"
                >
                  <Wrench size={15} /> 200+ Tools
                </Link>
              </>
            )}

            {/* Universal Theme Toggle */}
            <button
              onClick={() => {
                toggleDarkMode();
                setSheetOpen(false);
              }}
              className="col-span-2 mt-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              {darkMode ? (
                <>
                  <Sun size={15} className="text-amber-400" /> Switch to Light Mode
                </>
              ) : (
                <>
                  <Moon size={15} className="text-indigo-500" /> Switch to Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Bottom Dock Wrapper */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-40 flex items-center justify-between gap-2.5 w-[calc(100%-20px)] max-w-[440px] pointer-events-none md:hidden"
        style={{ bottom: "max(10px, env(safe-area-inset-bottom, 10px))" }}
      >
        {/* Floating Capsule Bar */}
        <nav
          className="pointer-events-auto flex-1 h-14 rounded-full bg-white/92 dark:bg-slate-900/92 backdrop-blur-2xl border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex items-center justify-around px-2 py-1 transition-all"
          role="navigation"
          aria-label="Universal Mobile Navigation"
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.isActive || pathname === tab.path;

            return (
              <Link
                key={tab.label}
                to={tab.path}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all select-none active:scale-90 ${
                  active
                    ? "text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {/* Active Pill Glow */}
                {active && (
                  <span className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/15 rounded-2xl -z-10 scale-95" />
                )}

                <Icon size={19} className="stroke-[2.2]" />
                <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                  {tab.label}
                </span>

                {/* Micro Dot for Active Tab */}
                {active && (
                  <span className="w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-0.5" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Floating Action Button (FAB '+') */}
        <button
          type="button"
          onClick={handleFabClick}
          aria-label="Quick Actions Menu"
          aria-expanded={sheetOpen}
          className={`pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/35 active:scale-90 transition-all border border-indigo-400/40 shrink-0 ${
            sheetOpen ? "rotate-45 bg-indigo-700" : ""
          }`}
        >
          <Plus size={24} className="stroke-[2.5]" />
        </button>
      </div>
    </>
  );
}
