import { useState, useRef, useEffect, useId } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, CheckCircle2, WifiOff, Zap, ShieldCheck, Cloud, Info, X } from "lucide-react";

const FEATURE_ICONS = [WifiOff, Zap, ShieldCheck, Cloud];
const HIDE_STORAGE_KEY = "stiknex_hide_about_fab";
const FAB_EVENT = "stiknex_about_fab_changed";
const EXCLUDED_PREFIXES = ["/admin", "/dashboard", "/login", "/register", "/auth", "/setup-2fa"];

function readHiddenPref() {
  try {
    return localStorage.getItem(HIDE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function restoreAboutToolFab() {
  try {
    localStorage.removeItem(HIDE_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(FAB_EVENT));
  }
}

export function isAboutFabExcluded(pathname) {
  if (!pathname) return false;
  return EXCLUDED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/**
 * Shared "About this tool" floating circular action button + native <dialog> modal.
 * Content remains mounted in the DOM at all times (CSS hidden when closed).
 */
const WorkspaceSeoSection = ({ content }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(() => readHiddenPref());
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const headingId = useId();
  const { pathname } = useLocation();

  useEffect(() => {
    const syncPref = () => setIsHidden(readHiddenPref());
    window.addEventListener(FAB_EVENT, syncPref);
    return () => window.removeEventListener(FAB_EVENT, syncPref);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!content || isAboutFabExcluded(pathname)) return null;

  const openDialog = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) {
      dialog.showModal();
      setIsOpen(true);
    }
  };

  const closeDialog = () => {
    const dialog = dialogRef.current;
    if (dialog && dialog.open) {
      dialog.close();
    }
  };

  const hideFabForever = (e) => {
    e?.stopPropagation?.();
    try {
      localStorage.setItem(HIDE_STORAGE_KEY, "true");
    } catch {
      // ignore storage errors
    }
    setIsHidden(true);
    window.dispatchEvent(new Event(FAB_EVENT));
    closeDialog();
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      if (!isHidden) triggerRef.current?.focus();
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      closeDialog();
    }
  };

  const faqs = Array.isArray(content.faqs) ? content.faqs : [];
  const relatedTools = Array.isArray(content.relatedTools) ? content.relatedTools : [];
  const howTo = Array.isArray(content.howTo) ? content.howTo : [];
  const features = Array.isArray(content.features) ? content.features : [];

  return (
    <>
      {!isHidden && (
        <div
          className="stiknex-about-fab-wrap fixed top-[40%] -translate-y-1/2 right-[max(0.75rem,env(safe-area-inset-right))] z-40 inline-flex items-center rounded-full border border-slate-200/90 bg-white/95 p-0.5 shadow-lg shadow-slate-900/10 backdrop-blur-md dark:border-slate-700/90 dark:bg-slate-900/95"
        >
          <button
            ref={triggerRef}
            type="button"
            aria-label="About this tool"
            onClick={openDialog}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-full px-1.5 text-xs font-semibold text-slate-700 transition hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 dark:hover:text-indigo-300 cursor-pointer"
          >
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="stiknex-about-fab-label">About this tool</span>
          </button>
          <button
            type="button"
            aria-label="Hide tool info button"
            title="Hide tool info button"
            onClick={hideFabForever}
            className="stiknex-about-fab-hide-desktop h-6 w-6 mr-1 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby={headingId}
        onClose={handleDialogClose}
        onClick={handleBackdropClick}
        className="w-screen h-dvh max-w-none max-h-none m-0 p-0 rounded-none border-0 bg-white text-slate-800 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-xs dark:bg-slate-950 dark:text-slate-200 sm:m-auto sm:h-auto sm:w-[min(92vw,56rem)] sm:max-h-[85vh] sm:rounded-3xl sm:border sm:border-slate-200/80 sm:dark:border-slate-800 open:flex open:flex-col"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200/80 bg-slate-50/90 px-4 py-4 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/90 sm:px-6">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-500/20">
              <CheckCircle2 className="w-3 h-3" />
              Free Browser Tool
            </span>
            <h1
              id={headingId}
              className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              {content.heading}
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={hideFabForever}
              className="stiknex-about-fab-hide-touch rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
            >
              Hide button
            </button>
            <button
              type="button"
              aria-label="Close"
              onClick={closeDialog}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 space-y-10">
          {content.subheading && (
            <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {content.subheading}
            </p>
          )}

          {content.answerFirst && (
            <div className="max-w-3xl space-y-4">
              {content.answerHeading && (
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {content.answerHeading}
                </h2>
              )}
              {content.answerFirst.split(/\n\n+/).map((para, i) => (
                <p key={i} className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {para}
                </p>
              ))}
            </div>
          )}

          {content.conversionTable && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {content.conversionTable.caption}
              </h2>
              <div className="overflow-x-auto rounded-2xl bg-slate-50/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold">
                    <tr>
                      {content.conversionTable.columns.map((col) => (
                        <th key={col} className="px-4 py-3">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                    {content.conversionTable.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-2.5">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {howTo.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                How to Use
              </h2>
              <ol className="space-y-2.5 list-decimal list-inside text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {howTo.map((stepText, idx) => (
                  <li key={idx}>{stepText}</li>
                ))}
              </ol>
            </div>
          )}

          {features.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">
                Key Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feat, idx) => {
                  const Icon = FEATURE_ICONS[idx % FEATURE_ICONS.length];
                  const isObj = typeof feat === "object" && feat !== null;
                  return (
                    <article
                      key={isObj ? feat.title : idx}
                      className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          {isObj ? (
                            <>
                              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{feat.title}</h3>
                              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{feat.description}</p>
                            </>
                          ) : (
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{feat}</p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {content.steps && content.steps.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {content.steps.map((item) => (
                  <div
                    key={item.step}
                    className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800"
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-slate-900 text-white dark:bg-indigo-500 dark:text-white mb-3">
                      {item.step}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {faqs.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">
                Frequently Asked Questions
              </h2>
              <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-2xl bg-slate-50/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                {faqs.map((faq, idx) => {
                  const isFaqOpen = openFaqIndex === idx;
                  return (
                    <div key={faq.q}>
                      <button
                        type="button"
                        aria-expanded={isFaqOpen}
                        onClick={() => setOpenFaqIndex(isFaqOpen ? -1 : idx)}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      >
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                            isFaqOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isFaqOpen && (
                        <div className="px-5 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {relatedTools.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Related Tools
              </h2>
              <div className="flex flex-wrap gap-3">
                {relatedTools.map((rt) => (
                  <Link
                    key={rt.path}
                    to={rt.path}
                    onClick={closeDialog}
                    className="px-4 py-2 rounded-xl bg-slate-50/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {rt.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};

export default WorkspaceSeoSection;
