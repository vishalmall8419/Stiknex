import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Layers,
  Wrench,
  Search,
  Filter,
  Zap,
  LoaderCircle
} from "lucide-react";
import AppShell from "../../Component/Layout/AppShell";
import PageSEO from "../../Component/SEO/PageSEO";
import { getSeoForPath, seoConfig } from "../../utils/seoConfig";
import { ALL_TOOLS, TOOL_CATEGORIES } from "../../data/toolsRegistry";

// 20 Specialized Category Engines
import CalculatorsEngine from "./engines/CalculatorsEngine";
import MeasurementEngine from "./engines/MeasurementEngine";
import WritingEngine from "./engines/WritingEngine";
import TextAnalysisEngine from "./engines/TextAnalysisEngine";
import ImageEngine from "./engines/ImageEngine";
import PdfEngine from "./engines/PdfEngine";
import DeveloperEngine from "./engines/DeveloperEngine";
import EncodingEngine from "./engines/EncodingEngine";
import SecurityEngine from "./engines/SecurityEngine";
import DesignEngine from "./engines/DesignEngine";
import TimeEngine from "./engines/TimeEngine";
import MathEngine from "./engines/MathEngine";
import FinanceEngine from "./engines/FinanceEngine";
import TypingEngine from "./engines/TypingEngine";
import ProductivityEngine from "./engines/ProductivityEngine";
import SeoEngine from "./engines/SeoEngine";
import DataEngine from "./engines/DataEngine";
import MediaEngine from "./engines/MediaEngine";
import GeneratorsEngine from "./engines/GeneratorsEngine";
import HelpersEngine from "./engines/HelpersEngine";

// Map ALL_TOOLS to rich catalog entities
export const toolsData = ALL_TOOLS.map(t => {
  const catObj = TOOL_CATEGORIES.find(c => c.id === t.category);
  const categoryName = catObj ? catObj.name : t.category;

  return {
    id: t.slug,
    slug: t.slug,
    icon: t.icon || "fa-solid fa-wrench",
    category: t.category,
    categoryName: categoryName,
    title: t.title,
    h1: t.h1 || `Free Online ${t.title}`,
    tagline: t.tagline,
    keywords: t.keywords,
    engine: t.engine,
    howTo: [
      `Open the interactive ${t.title} workspace above.`,
      "Enter your input data, adjust setting parameters, or upload source files.",
      "Review the live, accurate calculation results rendered instantly in your browser.",
      "Copy the result to your clipboard or download the formatted output file."
    ],
    features: [
      "100% Client-Side Privacy — zero server uploads, completely private and secure",
      "Instant real-time computation and conversion without latency or reloads",
      "Works fully offline and on mobile, tablet, and desktop viewports",
      "One-click copy to clipboard and file export support",
      "Free forever with no subscriptions, ads, or artificial limits"
    ],
    guide: `The Stiknex ${t.title} is an engineered in-browser utility designed for students, developers, writers, and digital professionals. Unlike ad-heavy converter sites that send your data to external servers, Stiknex processes your calculations client-side in memory using native browser APIs for maximum speed and security.`,
    related: ALL_TOOLS.filter(ot => ot.category === t.category && ot.slug !== t.slug).slice(0, 4).map(ot => `/${ot.slug}`)
  };
});

export const slugMap = Object.fromEntries(toolsData.map(t => [t.slug, t.id]));
export const idMap = Object.fromEntries(toolsData.map(t => [t.id, t.slug]));

const scoreTool = (tool, query) => {
  const normalizedQuery = query.toLowerCase();
  const tokens = normalizedQuery.split(/[^\p{L}\p{N}]+/u).filter((token) => token.length > 1);
  if (!tokens.length) return 0;

  const title = tool.title.toLowerCase();
  const description = `${tool.tagline || ""} ${tool.h1 || ""}`.toLowerCase();
  const keywords = Array.isArray(tool.keywords)
    ? tool.keywords.join(" ").toLowerCase()
    : String(tool.keywords || "").toLowerCase();
  const category = `${tool.categoryName || ""} ${tool.category || ""}`.toLowerCase();

  let score = title.includes(normalizedQuery) ? 18 : 0;
  for (const token of tokens) {
    if (title.includes(token)) score += 8;
    if (keywords.includes(token)) score += 5;
    if (description.includes(token)) score += 3;
    if (category.includes(token)) score += 2;
  }
  return score;
};

const Tools = ({ directSlug = null }) => {
  const { toolId: paramSlug, toolSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  // Search & Filter state for catalog view
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [aiSearch, setAiSearch] = useState({ query: "", ids: [], loading: false, error: "" });

  // Determine current active tool slug
  const activeSlug = useMemo(() => {
    if (directSlug) return directSlug;
    if (paramSlug) return paramSlug;
    if (toolSlug) return toolSlug;
    
    // Check if pathname matches any tool slug directly (e.g. /percentage-calculator)
    const currentPath = location.pathname.replace(/^\//, "");
    if (slugMap[currentPath]) return currentPath;
    
    return null;
  }, [directSlug, paramSlug, toolSlug, location.pathname]);

  const activeToolData = useMemo(() => {
    if (!activeSlug) return null;
    return toolsData.find(t => t.slug === activeSlug || t.id === activeSlug) || null;
  }, [activeSlug]);

  const seoData = useMemo(() => {
    if (activeToolData) {
      return getSeoForPath(`/${activeToolData.slug}`);
    }
    return getSeoForPath("/tools");
  }, [activeToolData]);

  const categoryTools = useMemo(
    () => selectedCategory === "all"
      ? toolsData
      : toolsData.filter((tool) => tool.category === selectedCategory),
    [selectedCategory],
  );

  useEffect(() => {
    const normalizedQuery = searchQuery.trim();
    const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);
    if (normalizedQuery.length < 18 || queryTerms.length < 3) return undefined;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setAiSearch({ query: normalizedQuery, ids: [], loading: true, error: "" });
      const candidates = categoryTools.map((tool) => ({
        id: tool.slug,
        title: tool.title,
        description: [
          tool.tagline,
          tool.h1,
          tool.keywords,
          tool.categoryName,
        ].filter(Boolean).join(" "),
      }));

      try {
        const response = await fetch("/api/blogs?action=quick-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ query: normalizedQuery, items: candidates }),
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "AI tool search is unavailable.");
        const allowedIds = new Set(candidates.map((tool) => tool.id));
        const ids = Array.isArray(payload.ids)
          ? [...new Set(payload.ids.filter((id) => typeof id === "string" && allowedIds.has(id)))]
          : [];
        setAiSearch({ query: normalizedQuery, ids, loading: false, error: "" });
      } catch (error) {
        if (error.name !== "AbortError") {
          setAiSearch({
            query: normalizedQuery,
            ids: [],
            loading: false,
            error: error.message || "AI tool search is unavailable; showing keyword matches.",
          });
        }
      }
    }, 650);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [categoryTools, searchQuery]);

  const filteredTools = useMemo(() => {
    const normalizedQuery = searchQuery.trim();
    if (!normalizedQuery) return categoryTools;

    const localResults = categoryTools
      .map((tool) => ({ tool, score: scoreTool(tool, normalizedQuery) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ tool }) => tool);
    const toolsById = new Map(categoryTools.map((tool) => [tool.slug, tool]));
    const aiResults = aiSearch.query === normalizedQuery
      ? aiSearch.ids.map((id) => toolsById.get(id)).filter(Boolean)
      : [];
    return [...new Map([...aiResults, ...localResults].map((tool) => [tool.slug, tool])).values()];
  }, [aiSearch, categoryTools, searchQuery]);

  // Engine dispatcher for the active tool
  const renderToolEngine = (tool) => {
    const { category, slug, id } = tool;
    switch (category) {
      case "calculators": return <CalculatorsEngine slug={slug} toolId={id} />;
      case "measurement": return <MeasurementEngine slug={slug} toolId={id} />;
      case "writing": return <WritingEngine slug={slug} toolId={id} />;
      case "text-analysis": return <TextAnalysisEngine slug={slug} toolId={id} />;
      case "image": return <ImageEngine slug={slug} toolId={id} />;
      case "pdf": return <PdfEngine slug={slug} toolId={id} />;
      case "developer": return <DeveloperEngine slug={slug} toolId={id} />;
      case "encoding": return <EncodingEngine slug={slug} toolId={id} />;
      case "security": return <SecurityEngine slug={slug} toolId={id} />;
      case "design": return <DesignEngine slug={slug} toolId={id} />;
      case "time": return <TimeEngine slug={slug} toolId={id} />;
      case "math": return <MathEngine slug={slug} toolId={id} />;
      case "finance": return <FinanceEngine slug={slug} toolId={id} />;
      case "typing": return <TypingEngine slug={slug} toolId={id} />;
      case "productivity": return <ProductivityEngine slug={slug} toolId={id} />;
      case "seo": return <SeoEngine slug={slug} toolId={id} />;
      case "data": return <DataEngine slug={slug} toolId={id} />;
      case "media": return <MediaEngine slug={slug} toolId={id} />;
      case "generators": return <GeneratorsEngine slug={slug} toolId={id} />;
      case "helpers": return <HelpersEngine slug={slug} toolId={id} />;
      default: return <CalculatorsEngine slug={slug} toolId={id} />;
    }
  };

  return (
    <AppShell fullWidth={true}>
      <PageSEO
        title={seoData.title || (activeToolData ? `${activeToolData.title} | Free Online Utility – Stiknex` : "Free Online Tools Directory (200+ Utilities) – Stiknex")}
        description={seoData.description || (activeToolData ? activeToolData.tagline : "Explore 200+ free online utility tools across 20 categories. Calculators, converters, developer tools, formatters, and typing lab.")}
        path={seoData.path || (activeToolData ? `/${activeToolData.slug}` : "/tools")}
        type="webapp"
        keywords={seoData.keywords || (activeToolData ? activeToolData.keywords : ["online tools", "free utilities"])}
        faqs={seoData.faqs || null}
      />

      <div className="relative min-h-screen pb-32 overflow-x-hidden font-sans">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-25 -z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-80 h-80 md:w-[600px] md:h-[600px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute top-[30%] left-0 w-80 h-80 md:w-[600px] md:h-[600px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28">

          {/* =========================================================
              ACTIVE TOOL VIEW: DEDICATED TOOL WORKSPACE
          ========================================================== */}
          {activeToolData ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {/* Breadcrumb Navigation */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Home</Link>
                <ChevronRight size={14} />
                <Link to="/tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Tools</Link>
                <ChevronRight size={14} />
                <span className="capitalize">{activeToolData.categoryName}</span>
                <ChevronRight size={14} />
                <span className="text-slate-900 dark:text-white font-bold">{activeToolData.title}</span>
              </nav>

              {/* Tool Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/25 shrink-0">
                    <i className={activeToolData.icon}></i>
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                      {seoData.h1 || activeToolData.h1}
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium mt-1">
                      {activeToolData.tagline}
                    </p>
                  </div>
                </div>

                <Link
                  to="/tools"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition self-start sm:self-center shrink-0"
                >
                  <ArrowLeft size={16} /> All 200 Tools
                </Link>
              </div>

              {/* Interactive Tool Card Workspace */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-200/40 dark:shadow-black/50">
                {renderToolEngine(activeToolData)}
              </div>

              {/* Instructions & Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
                    How to Use {activeToolData.title}
                  </h2>
                  <ol className="space-y-3">
                    {activeToolData.howTo.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />
                    Key Features & Privacy Standards
                  </h2>
                  <ul className="space-y-3">
                    {activeToolData.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contextual Deep Dive */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Why Choose Stiknex for {activeToolData.title}?
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                  {activeToolData.guide}
                </p>
              </div>

              {/* Related Tools Cluster */}
              <div className="pt-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers size={18} className="text-indigo-600" /> Related {activeToolData.categoryName} Tools
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {activeToolData.related.map((relPath) => {
                    const slug = relPath.replace(/^\//, "");
                    const sibling = toolsData.find(t => t.slug === slug);
                    return (
                      <Link
                        key={relPath}
                        to={relPath}
                        className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm transition group"
                      >
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition block truncate">
                          {sibling ? sibling.title : slug.replace(/-/g, " ")}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {sibling ? sibling.tagline : "Fast online browser utility"}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Frequently Asked Questions */}
              {seoData.faqs && seoData.faqs.length > 0 && (
                <div className="pt-6 space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle size={20} className="text-indigo-600" /> Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    {seoData.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                        <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">{faq.q}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (

            /* =========================================================
                CATALOG VIEW: 200-TOOL DIRECTORY WITH SEARCH & FILTERS
            ========================================================== */
            <div>
              {/* Hero Section */}
              <div className="text-center mb-10 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 100 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/25"
                >
                  <Wrench size={32} className="text-white" />
                </motion.div>

                <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                  200+ Free Online Utility Tools
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
                  Fast, private, and 100% free productivity tools running locally inside your browser. No sign-ups, no tracking, zero lag.
                </p>

                {/* Instant Search Bar */}
                <div className="w-full max-w-xl mt-8 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Find a tool by name or describe what you need..."
                    aria-label="Search tools by name or description"
                    className="w-full pl-12 pr-16 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white text-sm"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                  <div className="mt-2 min-h-4 text-left text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
                    {aiSearch.query === searchQuery.trim() && aiSearch.loading ? (
                      <span className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                        <LoaderCircle size={13} className="animate-spin" />
                        Understanding your request and matching tools
                      </span>
                    ) : aiSearch.query === searchQuery.trim() && aiSearch.error ? (
                      <span>{aiSearch.error} Showing local tool matches.</span>
                    ) : aiSearch.query === searchQuery.trim() && aiSearch.ids.length > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                        <Sparkles size={13} />
                        AI matched tools only
                      </span>
                    ) : (
                      <span>Search is limited to tools. For long descriptions, AI helps find the right tool.</span>
                    )}
                  </div>
                </div>

                {/* 20 Categories Horizontal Scroll / Wrap */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-8 max-w-4xl">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === "all"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    All Tools ({toolsData.length})
                  </button>
                  {TOOL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        selectedCategory === cat.id
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {cat.name} ({toolsData.filter(t => t.category === cat.id).length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredTools.map((t) => (
                  <Link
                    key={t.slug}
                    to={`/${t.slug}`}
                    className="group flex flex-col text-left p-5 sm:p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <i className={t.icon}></i>
                    </div>

                    <div className="text-[10px] font-black uppercase tracking-wider text-indigo-500 mb-1">
                      {t.categoryName}
                    </div>

                    <h2 className="font-bold text-lg mb-1.5 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {t.title}
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 font-medium text-xs leading-relaxed mb-4 line-clamp-2">
                      {t.tagline}
                    </p>

                    <div className="mt-auto flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                      Open Tool <ChevronRight size={14} />
                    </div>
                  </Link>
                ))}
              </div>

              {filteredTools.length === 0 && (
                <div className="text-center py-16 space-y-3">
                  <p className="text-slate-400 text-sm">No tools found matching "{searchQuery}".</p>
                  <button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }} className="text-indigo-500 text-xs font-bold underline">
                    Reset search filters
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
};

export default Tools;
