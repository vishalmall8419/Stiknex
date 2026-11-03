import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Binary, 
  ExternalLink,
  ShieldCheck,
  Info
} from "lucide-react";

/**
 * ToolHelpAccordion
 * Collapsed by default to keep the tool as the 100% primary hero focus.
 * Expandable on user click for detailed step-by-step instructions, features, formulas, and FAQs.
 */
export default function ToolHelpAccordion({ tool, seoData, siblingTools = [] }) {
  const [activeTab, setActiveTab] = useState(null); // null = collapsed by default

  const hasHowTo = tool?.howTo && tool.howTo.length > 0;
  const hasFeatures = tool?.features && tool.features.length > 0;
  const hasGuide = Boolean(tool?.guide);
  const hasFaqs = seoData?.faqs && seoData.faqs.length > 0;
  const hasRelated = tool?.related && tool.related.length > 0;

  const toggleTab = (tabName) => {
    setActiveTab((prev) => (prev === tabName ? null : tabName));
  };

  return (
    <div className="w-full mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-800">
      
      {/* Compact Contextual Help Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-50/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800">
        
        {/* Navigation Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {hasHowTo && (
            <button
              type="button"
              onClick={() => toggleTab("howto")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "howto"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <BookOpen size={14} className={activeTab === "howto" ? "text-white" : "text-indigo-500"} />
              <span>How to Use</span>
            </button>
          )}

          {hasFeatures && (
            <button
              type="button"
              onClick={() => toggleTab("features")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "features"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sparkles size={14} className={activeTab === "features" ? "text-white" : "text-amber-500"} />
              <span>Features & Privacy</span>
            </button>
          )}

          {hasGuide && (
            <button
              type="button"
              onClick={() => toggleTab("guide")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "guide"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Info size={14} className={activeTab === "guide" ? "text-white" : "text-blue-500"} />
              <span>About & Logic</span>
            </button>
          )}

          {hasFaqs && (
            <button
              type="button"
              onClick={() => toggleTab("faqs")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "faqs"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <HelpCircle size={14} className={activeTab === "faqs" ? "text-white" : "text-purple-500"} />
              <span>FAQs ({seoData.faqs.length})</span>
            </button>
          )}

          {hasRelated && (
            <button
              type="button"
              onClick={() => toggleTab("related")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "related"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Layers size={14} className={activeTab === "related" ? "text-white" : "text-emerald-500"} />
              <span>Related Tools</span>
            </button>
          )}
        </div>

        {/* Global Expand / Collapse Control */}
        <button
          type="button"
          onClick={() => setActiveTab((prev) => (prev ? null : "howto"))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <span>{activeTab ? "Hide Details" : "Help & Documentation"}</span>
          {activeTab ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Expandable Content Container (Animated, clean, non-intrusive) */}
      <AnimatePresence>
        {activeTab && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden mt-4"
          >
            <div className="p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-900/5">
              
              {/* TAB 1: HOW TO USE */}
              {activeTab === "howto" && hasHowTo && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen size={18} className="text-indigo-600" />
                      Step-by-Step Guide: How to Use {tool.title}
                    </h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                      Quick Tutorial
                    </span>
                  </div>
                  <ol className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {tool.howTo.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3.5 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* TAB 2: FEATURES & PRIVACY */}
              {activeTab === "features" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-500" />
                      Key Features & Security Guarantees
                    </h2>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck size={13} /> 100% Client-Side
                    </span>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {hasFeatures && tool.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/60">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{feat}</span>
                      </li>
                    ))}
                    <li className="flex items-start gap-3 p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                      <ShieldCheck size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-indigo-950 dark:text-indigo-200 font-medium">Zero Server Logging: All computations run entirely inside your browser's V8 engine.</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* TAB 3: ABOUT & LOGIC */}
              {activeTab === "guide" && hasGuide && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Info size={18} className="text-blue-500" />
                      About {tool.title} & Formulas
                    </h2>
                  </div>
                  <div className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
                    <p>{tool.guide}</p>
                    {tool.formula && (
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold block mb-1">Mathematical Formula:</span>
                        <code>{tool.formula}</code>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: FAQS */}
              {activeTab === "faqs" && hasFaqs && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <HelpCircle size={18} className="text-purple-500" />
                      Frequently Asked Questions
                    </h2>
                    <span className="text-xs text-slate-400">Schema-grounded verified answers</span>
                  </div>
                  <div className="space-y-3">
                    {seoData.faqs.map((faq, idx) => (
                      <div key={idx} className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1.5">
                          {faq.q}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: RELATED TOOLS */}
              {activeTab === "related" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Layers size={18} className="text-emerald-500" />
                      Related {tool.categoryName || "Productivity"} Tools
                    </h2>
                    <Link to="/tools" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                      View all 200+ &rarr;
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {tool.related.map((relPath) => {
                      const slug = relPath.replace(/^\//, "");
                      const sibling = siblingTools.find(t => t.slug === slug);
                      return (
                        <Link
                          key={relPath}
                          to={relPath}
                          className="p-3.5 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-800 hover:border-indigo-500 transition group"
                        >
                          <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 block truncate">
                            {sibling ? sibling.title : slug.replace(/-/g, " ")}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {sibling ? sibling.tagline : "Online browser utility"}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

