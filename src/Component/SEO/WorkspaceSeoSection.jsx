import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, CheckCircle2, WifiOff, Zap, ShieldCheck, Cloud } from "lucide-react";

const FEATURE_ICONS = [WifiOff, Zap, ShieldCheck, Cloud];

/**
 * Clean, semantic below-the-fold SEO informational section for core workspaces
 * (/online-notepad, /online-notebook, /sticky-notes).
 */
const WorkspaceSeoSection = ({ content, onScrollTop }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  if (!content) return null;

  return (
    <section
      aria-label={content.heading}
      className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-14">
        {/* Heading & Intro */}
        <header className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Offline-First &amp; Free
            </span>
            {onScrollTop && (
              <button
                type="button"
                onClick={onScrollTop}
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 underline underline-offset-4 cursor-pointer"
              >
                Back to workspace ↑
              </button>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {content.heading}
          </h1>
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {content.subheading}
          </p>
        </header>

        {/* Answer-First AEO/GEO Section */}
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

        {/* Common Conversions Table (Converters Only) */}
        {content.conversionTable && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {content.conversionTable.caption}
            </h2>
            <div className="overflow-x-auto rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
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

        {/* Key Features Grid */}
        {content.features && content.features.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.features.map((feat, idx) => {
              const Icon = FEATURE_ICONS[idx % FEATURE_ICONS.length];
              return (
                <article
                  key={feat.title}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {feat.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        )}

        {/* How It Works */}
        {content.steps && content.steps.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.steps.map((item) => (
              <div
                key={item.step}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800"
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

        {/* FAQ Accordion */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            {content.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={faq.q}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Tools */}
        {content.relatedTools && content.relatedTools.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Related Tools
            </h2>
            <div className="flex flex-wrap gap-3">
              {content.relatedTools.map((rt) => (
                <Link
                  key={rt.path}
                  to={rt.path}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {rt.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkspaceSeoSection;
