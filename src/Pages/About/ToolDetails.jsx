import React, { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "../../Component/Layout/AppShell";
import PageSEO from "../../Component/SEO/PageSEO";
import { ALL_TOOLS, TOOL_HUBS } from "../../data/toolsRegistry";
import {
  Search,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  Layers,
  ChevronRight,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle2,
  SlidersHorizontal,
  Info
} from "lucide-react";

/**
 * ToolDetails
 * 
 * Comprehensive Technical & Functional Directory for all 206 Stiknex Tools.
 * Provides deep specifications, technical execution engine details,
 * privacy guarantees, inputs/outputs, and direct launch links.
 */
export default function ToolDetails() {
  const [searchParams] = useSearchParams();
  const { slug: pathSlug } = useParams();
  const activeToolSlug = pathSlug || searchParams.get("tool");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHub, setSelectedHub] = useState("all");
  const [expandedToolId, setExpandedToolId] = useState(activeToolSlug || null);

  // If a tool slug is passed via URL query or param, auto-select it and scroll into view
  useEffect(() => {
    if (activeToolSlug) {
      setExpandedToolId(activeToolSlug);
      const element = document.getElementById(`tool-spec-${activeToolSlug}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeToolSlug]);

  // Filter tools based on search query and category hub
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.keywords && tool.keywords.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedHub === "all") return true;

      const hub = TOOL_HUBS.find((h) => h.id === selectedHub);
      if (!hub) return true;

      return hub.subcategories.includes(tool.category);
    });
  }, [searchQuery, selectedHub]);

  return (
    <AppShell fullWidth={true}>
      <PageSEO
        title="Stiknex Tools Directory & Technical Specifications — 206 Browser Utilities"
        description="Comprehensive functional dictionary and technical specifications for all 206 client-side tools on Stiknex. Learn how each tool operates 100% locally with zero server uploads."
        path="/about/tool-details"
        type="website"
      />

      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 transition-colors duration-200">
        
        {/* ========================================================
            HERO HEADER
            ======================================================== */}
        <header className="relative pt-24 pb-16 px-6 border-b border-[#EADFD5] dark:border-slate-800/80 bg-gradient-to-b from-white/60 to-transparent dark:from-slate-900/40">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#134E5E]/10 dark:bg-teal-500/20 text-[#134E5E] dark:text-teal-300 text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} className="text-[#FFA07A]" />
              Complete Functional Specifications
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#0F3944] dark:text-white tracking-tight">
              Stiknex 206 Utility Directory
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Every single tool on Stiknex executes directly in your browser's V8 engine with <strong>zero server uploads</strong>, <strong>zero tracking</strong>, and <strong>100% local confidentiality</strong>. Explore the technical mechanism and features of each utility below.
            </p>

            {/* Quick Stats Grid */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm text-center">
                <span className="block text-2xl font-black text-[#134E5E] dark:text-teal-400">206</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Browser Utilities</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm text-center">
                <span className="block text-2xl font-black text-[#134E5E] dark:text-teal-400">0 ms</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Server Latency</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm text-center">
                <span className="block text-2xl font-black text-[#134E5E] dark:text-teal-400">100%</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client-Side Private</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 shadow-sm text-center">
                <span className="block text-2xl font-black text-[#134E5E] dark:text-teal-400">$0</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Forever</span>
              </div>
            </div>

          </div>
        </header>

        {/* ========================================================
            CONTROLS: SEARCH & CATEGORY HUBS
            ======================================================== */}
        <section className="sticky top-0 z-40 bg-[#FAF7F2]/95 dark:bg-[#0B0F17]/95 backdrop-blur-md border-b border-[#EADFD5] dark:border-slate-800 py-4 px-6 shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by tool name, slug, or keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm outline-none border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#134E5E] dark:focus:border-teal-400 transition-colors shadow-inner"
              />
            </div>

            {/* Results Counter & Breadcrumb */}
            <div className="text-xs font-bold text-slate-500 flex items-center gap-2 self-start md:self-auto">
              <span>Showing {filteredTools.length} of {ALL_TOOLS.length} tools</span>
              <span>•</span>
              <Link to="/about" className="hover:text-[#134E5E] dark:hover:text-teal-300 underline">
                ← Back to About Stiknex
              </Link>
            </div>

          </div>

          {/* Category Filter Pills (Horizontal Scrollable) */}
          <div className="max-w-6xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedHub("all")}
              className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedHub === "all"
                  ? "bg-[#134E5E] text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-[#EADFD5] dark:border-slate-800 hover:border-[#134E5E]"
              }`}
            >
              All Hubs ({ALL_TOOLS.length})
            </button>
            {TOOL_HUBS.map((hub) => (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(hub.id)}
                className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedHub === hub.id
                    ? "bg-[#134E5E] text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-[#EADFD5] dark:border-slate-800 hover:border-[#134E5E]"
                }`}
              >
                <i className={`${hub.icon} text-[10px]`}></i>
                <span>{hub.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ========================================================
            TOOL SPECIFICATION CARDS LIST
            ======================================================== */}
        <main className="max-w-6xl mx-auto px-6 py-12 space-y-6">
          {filteredTools.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800">
              <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">No matching tools found</h3>
              <p className="text-sm text-slate-500 mt-1">Try searching for different keywords or clear your filter.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedHub("all"); }}
                className="mt-4 px-5 py-2 rounded-full text-xs font-bold bg-[#134E5E] text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredTools.map((tool, idx) => {
              const isExpanded = expandedToolId === tool.slug || expandedToolId === tool.id;

              return (
                <article
                  id={`tool-spec-${tool.slug}`}
                  key={tool.id}
                  className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? "bg-white dark:bg-slate-900 border-[#134E5E] dark:border-teal-400/60 shadow-lg ring-2 ring-[#134E5E]/10"
                      : "bg-[#FBF8F3] dark:bg-[#131B26] border-[#EADFD5] dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
                  }`}
                >
                  {/* Card Header Row */}
                  <div
                    onClick={() => setExpandedToolId(isExpanded ? null : tool.slug)}
                    className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#134E5E]/10 dark:bg-teal-500/20 text-[#134E5E] dark:text-teal-300 flex items-center justify-center shrink-0">
                        <i className={`${tool.icon || "fa-solid fa-wrench"} text-lg`}></i>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {tool.category.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">/{tool.slug}</span>
                        </div>
                        <h2 className="text-xl font-bold text-[#0F3944] dark:text-white">
                          {tool.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                          {tool.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <Link
                        to={`/${tool.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 rounded-full text-xs font-bold bg-[#134E5E] hover:bg-[#0F3944] dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-900 transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Launch Tool</span>
                        <ArrowRight size={13} />
                      </Link>

                      <button
                        type="button"
                        className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        aria-label="Toggle details"
                      >
                        <ChevronRight
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isExpanded ? "rotate-90 text-[#134E5E] dark:text-teal-400" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Technical Specifications Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="border-t border-[#EADFD5] dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Column 1: Functional Overview */}
                          <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                              <BookOpen size={13} className="text-[#134E5E] dark:text-teal-400" />
                              Purpose &amp; Use Cases
                            </h3>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {tool.description || tool.tagline}
                            </p>
                            <p className="text-xs text-slate-500">
                              Ideal for students, developers, content creators, and professionals needing instant offline computation.
                            </p>
                          </div>

                          {/* Column 2: Technical Architecture & Execution Engine */}
                          <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                              <Cpu size={13} className="text-[#134E5E] dark:text-teal-400" />
                              Engine &amp; Mechanism
                            </h3>
                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
                              <div>
                                <span className="font-bold text-slate-700 dark:text-slate-200">Execution: </span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% In-Memory (V8)</span>
                              </div>
                              <div>
                                <span className="font-bold text-slate-700 dark:text-slate-200">Engine ID: </span>
                                <span className="font-mono text-slate-500">{tool.engine || "client-native-v1"}</span>
                              </div>
                              <div>
                                <span className="font-bold text-slate-700 dark:text-slate-200">Network Traffic: </span>
                                <span className="text-slate-500">Zero bytes sent to server</span>
                              </div>
                              <div>
                                <span className="font-bold text-slate-700 dark:text-slate-200">Persistence: </span>
                                <span className="text-slate-500">Local browser state only</span>
                              </div>
                            </div>
                          </div>

                          {/* Column 3: Privacy & Security Guarantee */}
                          <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                              <ShieldCheck size={13} className="text-[#134E5E] dark:text-teal-400" />
                              Data Sovereignty
                            </h3>
                            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                              <li className="flex items-center gap-2">
                                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                                <span>No telemetry tracking of personal inputs.</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                                <span>Fully functional offline inside PWA mode.</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                                <span>Zero cookies or third-party ad profiling.</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                                <span>Instant reset upon page refresh or closing.</span>
                              </li>
                            </ul>
                          </div>

                        </div>

                        {/* Direct Action Link & Deep-Link Share */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                          <div className="text-xs text-slate-500">
                            Permanent Link:{" "}
                            <span className="font-mono text-slate-700 dark:text-slate-300 select-all">
                              https://stiknex.site/{tool.slug}
                            </span>
                          </div>
                          <Link
                            to={`/${tool.slug}`}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#134E5E] to-[#1D6A7D] hover:shadow-lg hover:shadow-[#134E5E]/20 transition-all"
                          >
                            <span>Open {tool.title} Now</span>
                            <ExternalLink size={13} />
                          </Link>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>

                </article>
              );
            })
          )}
        </main>

        {/* Footer Navigation Back to About */}
        <footer className="py-16 text-center border-t border-[#EADFD5] dark:border-slate-800">
          <p className="text-sm text-slate-500 mb-4">
            Looking for platform background, creator bio, and architectural principles?
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider bg-white dark:bg-slate-900 border border-[#EADFD5] dark:border-slate-800 text-[#0F3944] dark:text-teal-300 hover:border-[#134E5E] shadow-sm transition-all"
          >
            ← Return to Comprehensive About Page
          </Link>
        </footer>

      </div>
    </AppShell>
  );
}
