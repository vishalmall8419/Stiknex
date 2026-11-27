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
  LoaderCircle,
  Calculator,
  Scale,
  Table,
  Binary,
  Code2,
  Terminal,
  FileText,
  Type,
  Shield,
  KeyRound,
  Palette,
  QrCode
} from "lucide-react";
import AppShell from "../../Component/Layout/AppShell";
import PageSEO from "../../Component/SEO/PageSEO";
import NotFound from "../NotFound/NotFound";
import { getSeoForPath, seoConfig } from "../../utils/seoConfig";
import { ALL_TOOLS, TOOL_CATEGORIES, TOOL_HUBS, getHubForCategory } from "../../data/toolsRegistry";

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
import ToolHelpAccordion from "./components/ToolHelpAccordion";
import DesktopOnlyToolGuard from "./components/DesktopOnlyToolGuard";
import { TIER_1_BESPOKE } from "../../data/bespokeToolsData";


// Bespoke editorial data & formulas for Tier 1 tools (Research Phase 1 Standards)
// Map ALL_TOOLS to rich catalog entities
export const toolsData = ALL_TOOLS.map(t => {
  const catObj = TOOL_CATEGORIES.find(c => c.id === t.category);
  const categoryName = catObj ? catObj.name : t.category;

  return {
    id: t.id || t.slug,
    slug: t.slug,
    aliases: t.aliases || [],
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

export const slugMap = Object.fromEntries([
  ...ALL_TOOLS.map(t => [t.slug, t.slug]),
  ...ALL_TOOLS.filter(t => t.id).map(t => [t.id, t.slug]),
  ...ALL_TOOLS.flatMap(t => (t.aliases || []).map(a => [a, t.slug]))
]);
export const idMap = Object.fromEntries([
  ...ALL_TOOLS.map(t => [t.id || t.slug, t.slug]),
  ...ALL_TOOLS.flatMap(t => (t.aliases || []).map(a => [a, t.slug]))
]);

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

const BrushUnderline = ({ className = "text-indigo-500" }) => (
  <svg className={`absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 pointer-events-none ${className}`} viewBox="0 0 300 20" fill="none" preserveAspectRatio="none">
    <path d="M 5 14 Q 75 4, 150 11 Q 225 18, 295 8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.85"/>
  </svg>
);

// 6 Frosted Pastel Bento Category Hubs (Reference: media_1795075890232_cbc3188f.jpg)
const BENTO_HUBS = [
  {
    id: "hub-calculators",
    title: "Calculators & Converters",
    subtitle: "Precision financial math, scientific computation, age calculators, and multi-unit converters.",
    subcategories: ["calculators", "math", "finance", "time", "measurement"],
    cardBg: "bg-emerald-50/75 dark:bg-emerald-950/25",
    borderClass: "border-emerald-200/80 dark:border-emerald-800/40 hover:border-emerald-400",
    activeClass: "ring-2 ring-emerald-500 bg-emerald-100/85 dark:bg-emerald-950/50",
    activeDot: "bg-emerald-500",
    activeBorder: "border-emerald-500",
    icon1: Calculator,
    icon1Color: "text-emerald-600 dark:text-emerald-400",
    icon2: Scale,
    icon2Color: "text-teal-600 dark:text-teal-400",
  },
  {
    id: "hub-data",
    title: "Data & Spreadsheets",
    subtitle: "CSV to JSON, column extractors, text delimiters, table generators, and dataset transformers.",
    subcategories: ["data"],
    cardBg: "bg-sky-50/75 dark:bg-sky-950/25",
    borderClass: "border-sky-200/80 dark:border-sky-800/40 hover:border-sky-400",
    activeClass: "ring-2 ring-sky-500 bg-sky-100/85 dark:bg-sky-950/50",
    activeDot: "bg-sky-500",
    activeBorder: "border-sky-500",
    icon1: Table,
    icon1Color: "text-sky-600 dark:text-sky-400",
    icon2: Binary,
    icon2Color: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "hub-developer",
    title: "Developer & Code",
    subtitle: "JSON formatters, regex analyzers, HTML/CSS encoders, minifiers, and sandbox playgrounds.",
    subcategories: ["developer", "encoding"],
    cardBg: "bg-purple-50/75 dark:bg-purple-950/25",
    borderClass: "border-purple-200/80 dark:border-purple-800/40 hover:border-purple-400",
    activeClass: "ring-2 ring-purple-500 bg-purple-100/85 dark:bg-purple-950/50",
    activeDot: "bg-purple-500",
    activeBorder: "border-purple-500",
    icon1: Code2,
    icon1Color: "text-purple-600 dark:text-purple-400",
    icon2: Terminal,
    icon2Color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "hub-writing",
    title: "Text & Writing",
    subtitle: "Real-time word & character counters, text diff comparators, case transformers, and markdown.",
    subcategories: ["writing", "text-analysis"],
    cardBg: "bg-indigo-50/75 dark:bg-indigo-950/25",
    borderClass: "border-indigo-200/80 dark:border-indigo-800/40 hover:border-indigo-400",
    activeClass: "ring-2 ring-indigo-500 bg-indigo-100/85 dark:bg-indigo-950/50",
    activeDot: "bg-indigo-500",
    activeBorder: "border-indigo-500",
    icon1: FileText,
    icon1Color: "text-indigo-600 dark:text-indigo-400",
    icon2: Type,
    icon2Color: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "hub-security",
    title: "Security & Passwords",
    subtitle: "Cryptographic password generators, hash checkers, token decoders, and privacy test utilities.",
    subcategories: ["security", "generators"],
    cardBg: "bg-amber-50/75 dark:bg-amber-950/25",
    borderClass: "border-amber-200/80 dark:border-amber-800/40 hover:border-amber-400",
    activeClass: "ring-2 ring-amber-500 bg-amber-100/85 dark:bg-amber-950/50",
    activeDot: "bg-amber-500",
    activeBorder: "border-amber-500",
    icon1: Shield,
    icon1Color: "text-amber-600 dark:text-amber-400",
    icon2: KeyRound,
    icon2Color: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "hub-design",
    title: "Design & Utilities",
    subtitle: "Color palette pickers, contrast checkers, QR code generators, SVG tools, and system clocks.",
    subcategories: ["design", "media", "helpers", "seo", "productivity", "typing"],
    cardBg: "bg-teal-50/75 dark:bg-teal-950/25",
    borderClass: "border-teal-200/80 dark:border-teal-800/40 hover:border-teal-400",
    activeClass: "ring-2 ring-teal-500 bg-teal-100/85 dark:bg-teal-950/50",
    activeDot: "bg-teal-500",
    activeBorder: "border-teal-500",
    icon1: QrCode,
    icon1Color: "text-teal-600 dark:text-teal-400",
    icon2: Palette,
    icon2Color: "text-emerald-600 dark:text-emerald-400",
  },
];

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
    if (directSlug) return slugMap[directSlug] || directSlug;
    if (paramSlug) return slugMap[paramSlug] || null;
    if (toolSlug) return slugMap[toolSlug] || null;
    
    // Check if pathname matches any tool slug directly (e.g. /percentage-calculator)
    const currentPath = location.pathname.replace(/^\/+|\/+$/g, "");
    if (slugMap[currentPath]) return slugMap[currentPath];
    
    return null;
  }, [directSlug, paramSlug, toolSlug, location.pathname]);

  const isCatalogRoute = location.pathname === "/tools" || location.pathname === "/tools/";

  // If a slug came from URL (/:toolSlug or /tools/:toolId) but it's not a known tool → show 404
  const isUnknownSlug = useMemo(() => {
    if (isCatalogRoute) return false;
    if (directSlug) return false; // explicitly mapped routes are always valid

    // If on /tools/:toolId, verify paramSlug is valid
    if (paramSlug) {
      return !slugMap[paramSlug];
    }

    // If on /:toolSlug, verify toolSlug or path is valid
    if (toolSlug) {
      return !slugMap[toolSlug];
    }

    const currentPath = location.pathname.replace(/^\/+|\/+$/g, "");
    if (!currentPath) return false;
    return !slugMap[currentPath];
  }, [isCatalogRoute, directSlug, paramSlug, toolSlug, location.pathname]);

  const activeToolData = useMemo(() => {
    if (!activeSlug) return null;
    return (
      toolsData.find(
        (t) =>
          t.slug === activeSlug ||
          t.id === activeSlug ||
          (Array.isArray(t.aliases) && t.aliases.includes(activeSlug))
      ) || null
    );
  }, [activeSlug]);

  const seoData = useMemo(() => {
    if (activeToolData) {
      return getSeoForPath(`/${activeToolData.slug}`);
    }
    return getSeoForPath("/tools");
  }, [activeToolData]);

  const categoryTools = useMemo(() => {
    if (selectedCategory === "all") return toolsData;
    
    // Check if selectedCategory matches a Bento Hub
    const bentoHub = BENTO_HUBS.find((h) => h.id === selectedCategory);
    if (bentoHub) {
      return toolsData.filter((tool) => bentoHub.subcategories.includes(tool.category));
    }
    
    // Fallback: match specific category ID
    return toolsData.filter((tool) => tool.category === selectedCategory);
  }, [selectedCategory]);

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
    if (slug === "fraction-calculator") {
      return <MathEngine slug={slug} toolId={id} />;
    }
    switch (category) {
      case "calculators": return <CalculatorsEngine slug={slug} toolId={id} tool={tool} seoData={seoData} />;
      case "measurement": return <MeasurementEngine slug={slug} toolId={id} tool={tool} seoData={seoData} />;
      case "writing": return <WritingEngine slug={slug} toolId={id} tool={tool} seoData={seoData} />;
      case "text-analysis": return <TextAnalysisEngine slug={slug} toolId={id} tool={tool} seoData={seoData} />;
      case "image": return <ImageEngine slug={slug} toolId={id} />;
      case "pdf": return <PdfEngine slug={slug} toolId={id} />;
      case "developer": return <DeveloperEngine slug={slug} toolId={id} />;
      case "encoding": return <EncodingEngine slug={slug} toolId={id} />;
      case "security": return <SecurityEngine slug={slug} toolId={id} />;
      case "design": return <DesignEngine slug={slug} toolId={id} />;
      case "time": return <TimeEngine slug={slug} toolId={id} />;
      case "math": return <MathEngine slug={slug} toolId={id} />;
      case "finance": return <FinanceEngine slug={slug} toolId={id} tool={tool} seoData={seoData} />;
      case "typing": return (
        <DesktopOnlyToolGuard toolTitle={tool.title || "Typing Master"}>
          <TypingEngine slug={slug} toolId={id} />
        </DesktopOnlyToolGuard>
      );
      case "productivity": return <ProductivityEngine slug={slug} toolId={id} />;
      case "seo": return <SeoEngine slug={slug} toolId={id} />;
      case "data": return <DataEngine slug={slug} toolId={id} />;
      case "media": return <MediaEngine slug={slug} toolId={id} />;
      case "generators": return <GeneratorsEngine slug={slug} toolId={id} />;
      case "helpers": return <HelpersEngine slug={slug} toolId={id} tool={tool} seoData={seoData} />;
      default: return <CalculatorsEngine slug={slug} toolId={id} tool={tool} seoData={seoData} />;
    }
  };

  // All individual tools are rendered as full-screen standalone workstations (like basic-calculator)
  const isToolFullscreen = Boolean(activeToolData);

  // Unknown slug → render 404 immediately (before any AppShell/SEO boilerplate)
  if (isUnknownSlug) {
    const requestedSlug = (paramSlug || toolSlug || location.pathname).replace(/^\/+|\/+$/g, "");
    return <NotFound requestedSlug={requestedSlug} />;
  }

  return (
    <AppShell fullWidth={true} hideNav={isToolFullscreen} hideFooter={isToolFullscreen}>
      <PageSEO
        title={seoData.title || (activeToolData ? `${activeToolData.title} | Free Online Utility – Stiknex` : "Free Online Tools Directory (200+ Utilities) – Stiknex")}
        description={seoData.description || (activeToolData ? activeToolData.tagline : "Explore 200+ free online utility tools across 20 categories. Calculators, converters, developer tools, formatters, and typing master.")}
        path={seoData.path || (activeToolData ? `/${activeToolData.slug}` : "/tools")}
        type="webapp"
        keywords={seoData.keywords || (activeToolData ? activeToolData.keywords : ["online tools", "free utilities"])}
        faqs={seoData.faqs || null}
      />

      {isToolFullscreen ? (
        <div className="w-full min-h-screen">
          {renderToolEngine(activeToolData)}
        </div>
      ) : (
        <div className="relative min-h-screen pb-32 overflow-x-clip font-sans">
        {/* Soft ambient background with Advapay floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#f8fafc] dark:bg-[#080b14] transition-colors duration-300">
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#1e293b_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-40"></div>
          <div className="absolute -top-24 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-600/20 via-blue-600/15 to-transparent blur-[90px] transform-gpu pointer-events-none"></div>
          <div className="absolute top-1/3 -right-24 w-[420px] h-[420px] rounded-full bg-gradient-to-tl from-purple-500/15 via-indigo-500/10 to-transparent blur-[85px] transform-gpu pointer-events-none"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">

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
                <span className="capitalize">{activeToolData.hubName || activeToolData.categoryName}</span>
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

              {/* Subtle Internal Link CTA to Core Productivity Workspaces */}
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-5 py-3.5 text-sm">
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  Need to jot down results or organize ideas offline?
                </p>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <Link
                    to="/online-notepad"
                    className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 underline underline-offset-4"
                  >
                    Save your calculations in our Free Online Notepad
                  </Link>
                  <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
                  <Link
                    to="/sticky-notes"
                    className="font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 underline underline-offset-4"
                  >
                    Pin quick notes on Sticky Notes
                  </Link>
                </div>
              </div>

              {/* Contextual Expandable Help, Features, Formulas & FAQs (Collapsed by default so Tool has 100% hero focus) */}
              <ToolHelpAccordion
                tool={activeToolData}
                seoData={seoData}
                siblingTools={toolsData}
              />
            </motion.div>
          ) : (

            /* =========================================================
                CATALOG VIEW: 200-TOOL DIRECTORY WITH SEARCH & FILTERS
            ========================================================== */
            <div>
              {/* =========================================================
                  HERO SECTION: REPLICATED EXACTLY FROM REFERENCE (media_1795078740182_eaa74192.jpg)
                  "Cabin In The Woods But In A Good Way!" Concept for Tools
              ========================================================== */}
              <div className="mb-10 pt-2 pb-2">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Left Column: Typography, Playful Doodle & Obsidian Pill CTA */}
                  <div className="lg:col-span-7 space-y-6 text-left">
                    {/* Playful Doodles / Squiggle */}
                    <div className="flex items-center gap-2">
                      <svg className="w-12 h-8 text-sky-500 dark:text-sky-400" viewBox="0 0 50 32" fill="none">
                        <path d="M 5 22 Q 15 5, 25 18 T 45 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 22 4 L 24 10 L 30 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="44" cy="7" r="1.5" fill="currentColor" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/60">
                        206 Browser Utilities
                      </span>
                    </div>

                    {/* Bold Organic Display Headline with Coral Brush Underline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                      200+ Smart Tools <br />
                      <span className="relative inline-block mt-1">
                        But In A Good Way!
                        <svg className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-[#FF7A50] pointer-events-none" viewBox="0 0 300 18" fill="none" preserveAspectRatio="none">
                          <path d="M 4 12 Q 80 4, 155 10 Q 230 16, 296 6" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                        </svg>
                      </span>
                    </h1>

                    {/* Subtitle Description */}
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl">
                      Now you can calculate, convert, design, format, and secure your files anywhere and anytime — and of course it's 100% safe & private with zero logins.
                    </p>

                    {/* Action Area: Obsidian Pill Button */}
                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <a
                        href="#tools-catalog"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#18202F] hover:bg-black text-white text-sm sm:text-base font-bold rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <span>Get Started</span>
                      </a>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>100% Free & Local-First in Memory</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Hand Holding Smartphone Mockup with Stiknex Tools UI */}
                  <div className="lg:col-span-5 flex justify-center relative">
                    {/* Whimsical Background Doodles & Clouds */}
                    <div className="absolute -top-8 -right-4 pointer-events-none opacity-60">
                      <svg className="w-20 h-14 text-slate-300 dark:text-slate-700" viewBox="0 0 64 44" fill="none">
                        <path d="M 12 34 Q 4 34, 4 26 Q 4 18, 14 18 Q 18 8, 30 8 Q 42 8, 46 18 Q 56 18, 56 26 Q 56 34, 48 34 Z" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                      </svg>
                    </div>
                    <div className="absolute top-1/2 -left-6 pointer-events-none opacity-50">
                      <svg className="w-10 h-10 text-sky-400" viewBox="0 0 40 40" fill="none">
                        <path d="M 8 30 C 12 18, 24 14, 32 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
                        <path d="M 28 8 L 32 8 L 32 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    {/* Hand & Smartphone Composite Frame */}
                    <div className="relative">
                      {/* Stylized Minimalist Hand Graphic Silhouette behind phone */}
                      <svg
                        className="absolute -bottom-6 -left-12 sm:-left-16 w-[340px] sm:w-[380px] h-[480px] sm:h-[520px] pointer-events-none text-slate-200/90 dark:text-slate-800/80 drop-shadow-xl z-0"
                        viewBox="0 0 300 400"
                        fill="currentColor"
                      >
                        {/* Palm and wrist support holding phone */}
                        <path d="M 60 220 C 50 160, 90 90, 110 70 C 125 55, 140 65, 135 95 C 130 120, 120 180, 130 220 C 135 240, 120 280, 110 320 C 95 365, 130 400, 160 400 L 40 400 C 30 350, 45 280, 60 220 Z" opacity="0.9" />
                        {/* Finger wraps holding left bezel */}
                        <rect x="105" y="115" width="22" height="18" rx="8" fill="#CBD5E1" className="dark:fill-slate-700" />
                        <rect x="102" y="150" width="24" height="20" rx="9" fill="#CBD5E1" className="dark:fill-slate-700" />
                        <rect x="100" y="188" width="24" height="20" rx="9" fill="#CBD5E1" className="dark:fill-slate-700" />
                        <rect x="98" y="226" width="24" height="20" rx="9" fill="#CBD5E1" className="dark:fill-slate-700" />
                      </svg>

                      {/* Smartphone Device Frame */}
                      <div className="relative z-10 w-[275px] sm:w-[295px] h-[525px] sm:h-[555px] bg-[#111622] rounded-[42px] p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.35)] border-4 border-slate-700/60 dark:border-slate-800 overflow-hidden flex flex-col">
                        
                        {/* Screen Container */}
                        <div className="w-full h-full bg-[#f8fafc] dark:bg-[#0b101b] rounded-[32px] overflow-hidden flex flex-col p-3.5 relative text-slate-800 dark:text-slate-100 select-none">
                          
                          {/* Dynamic Island / Speaker */}
                          <div className="w-20 h-3.5 bg-black rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800"></span>
                          </div>

                          {/* App Topbar (Logo + Brand) */}
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-800">
                            <div className="flex items-center gap-1.5">
                              <img
                                src="/logo.png"
                                alt="Stiknex Logo"
                                width="24"
                                height="24"
                                className="w-5 h-5 object-contain"
                              />
                              <span className="text-xs font-black tracking-tight">Stiknex.</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-semibold text-slate-500">Chellyn</span>
                              <div className="w-5 h-5 rounded-full bg-amber-200 border border-amber-300 overflow-hidden flex items-center justify-center text-[9px]">
                                👤
                              </div>
                            </div>
                          </div>

                          {/* Title in App Screen */}
                          <div className="mb-2.5">
                            <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                              Create Your <br />
                              <span className="text-indigo-600 dark:text-indigo-400">Own Tool Story.</span>
                            </h2>
                          </div>

                          {/* "Recommended" Header */}
                          <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                            <span>Recommended</span>
                            <span className="text-[9px] text-slate-400 font-normal">See all &gt;</span>
                          </div>

                          {/* 2 Carousel Cards */}
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {/* Card 1: Mountain / Mint Theme */}
                            <div className="p-2 rounded-2xl bg-gradient-to-b from-emerald-100 to-emerald-50 dark:from-emerald-950/40 dark:to-emerald-900/20 border border-emerald-200/80 dark:border-emerald-800/40 flex flex-col justify-between h-28 shadow-xs">
                              <div className="h-12 w-full rounded-xl bg-emerald-200/60 dark:bg-emerald-800/30 flex items-center justify-center text-lg">
                                ⛰️
                              </div>
                              <div>
                                <span className="block text-[10px] font-bold leading-tight text-slate-900 dark:text-white">Mount Calc</span>
                                <span className="text-[8px] text-emerald-700 dark:text-emerald-400 font-medium">Instant Math</span>
                              </div>
                            </div>

                            {/* Card 2: Lake / Peach Theme */}
                            <div className="p-2 rounded-2xl bg-gradient-to-b from-amber-100 to-amber-50 dark:from-amber-950/40 dark:to-amber-900/20 border border-amber-200/80 dark:border-amber-800/40 flex flex-col justify-between h-28 shadow-xs">
                              <div className="h-12 w-full rounded-xl bg-amber-200/60 dark:bg-amber-800/30 flex items-center justify-center text-lg">
                                🌅
                              </div>
                              <div>
                                <span className="block text-[10px] font-bold leading-tight text-slate-900 dark:text-white">Mount Lake</span>
                                <span className="text-[8px] text-amber-700 dark:text-amber-400 font-medium">JSON Convert</span>
                              </div>
                            </div>
                          </div>

                          {/* "My Schedule / Tools" Section */}
                          <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                            <span>Active Utilities</span>
                            <span className="text-[9px] text-slate-400 font-normal">Fast</span>
                          </div>

                          {/* Schedule List Item */}
                          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between mb-auto shadow-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">
                                ⚡
                              </div>
                              <div>
                                <span className="block text-[10px] font-bold leading-tight">Age & Time Calc</span>
                                <span className="text-[8px] text-slate-400">100% Client-Side</span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[8px] font-bold">
                              Open
                            </span>
                          </div>

                          {/* Phone Mockup Bottom Dock with Orange Circular Center Button */}
                          <div className="mt-2 pt-2 px-3 pb-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-xs">
                            <span className="text-slate-400 text-xs">⌂</span>
                            {/* Orange Highlighted Center Pill (Campty Style) */}
                            <span className="w-7 h-7 rounded-full bg-[#FF7A50] text-white flex items-center justify-center shadow-md shadow-orange-500/30 text-xs">
                              ●
                            </span>
                            <span className="text-slate-400 text-xs">⚙</span>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bento Masthead: 6 Frosted Pastel Category Cards (Reference: media_1795075890232_cbc3188f.jpg) */}
              <div id="tools-catalog" className="mb-8 space-y-6">

                {/* 6 Frosted Pastel Bento Category Cards (Exact match for media_1795075890232_cbc3188f.jpg) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {BENTO_HUBS.map((hub) => {
                    const isSelected = selectedCategory === hub.id;
                    const count = toolsData.filter((t) => hub.subcategories.includes(t.category)).length;

                    return (
                      <button
                        key={hub.id}
                        type="button"
                        onClick={() => setSelectedCategory((prev) => (prev === hub.id ? "all" : hub.id))}
                        className={`relative flex flex-col justify-between p-6 sm:p-7 rounded-[28px] border backdrop-blur-xl transition-all duration-200 text-left cursor-pointer group ${
                          hub.cardBg
                        } ${
                          isSelected
                            ? `${hub.activeClass} shadow-lg`
                            : `${hub.borderClass} shadow-xs hover:shadow-md`
                        }`}
                      >
                        {/* Top Row: Dual Icon Badges (left) and Radio Dot (right) */}
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2.5">
                            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-black/5 dark:border-white/5 flex items-center justify-center">
                              <hub.icon1 className={`w-5 h-5 ${hub.icon1Color}`} />
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-black/5 dark:border-white/5 flex items-center justify-center">
                              <hub.icon2 className={`w-5 h-5 ${hub.icon2Color}`} />
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? `${hub.activeBorder}`
                                : "border-slate-300 dark:border-slate-600 group-hover:border-slate-400"
                            }`}
                          >
                            {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${hub.activeDot}`} />}
                          </div>
                        </div>

                        {/* Middle: Title & 2-line Description */}
                        <div className="my-5">
                          <h2 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight mb-2">
                            {hub.title}
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {hub.subtitle}
                          </p>
                        </div>

                        {/* Bottom Right: Count Badge Pill */}
                        <div className="mt-auto flex items-center justify-end">
                          <span className="px-3 py-1 rounded-full bg-slate-900/85 dark:bg-slate-800 text-white text-[11px] font-semibold tracking-wide shadow-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>{count} tools</span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* =========================================================
                    COMPACT UNIFIED SEARCH & CATEGORY RIBBON
                    Addresses media_1795077881322_1ebbdb55.png: Compact, Sleek, Zero-Clutter
                ========================================================== */}
                <div className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-sm space-y-2.5">
                  {/* Compact Search Row */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search 200+ utilities (e.g. 'json to csv', 'age calc', 'typing')..."
                        aria-label="Search tools by name or description"
                        className="w-full pl-9 pr-14 py-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-semibold shrink-0">
                      <Zap size={13} className="text-amber-500" />
                      <span>{filteredTools.length} Tools</span>
                    </span>
                  </div>

                  {/* AI Search Status Strip (Compact, only visible when query active) */}
                  {searchQuery.trim().length >= 10 && (
                    <div className="text-left text-[11px] text-slate-500 dark:text-slate-400 px-1" aria-live="polite">
                      {aiSearch.query === searchQuery.trim() && aiSearch.loading ? (
                        <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                          <LoaderCircle size={12} className="animate-spin" />
                          Matching tools with AI...
                        </span>
                      ) : aiSearch.query === searchQuery.trim() && aiSearch.ids.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
                          <Sparkles size={12} />
                          AI matched tools
                        </span>
                      ) : null}
                    </div>
                  )}

                  {/* Single-Row Horizontally Scrollable Category Ribbon */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        selectedCategory === "all"
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      All ({toolsData.length})
                    </button>
                    {TOOL_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      const count = toolsData.filter((t) => t.category === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-indigo-600 text-white shadow-xs font-bold"
                              : "bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <span>{cat.name}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-black/5 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
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
      )}
    </AppShell>
  );
};

export default Tools;
