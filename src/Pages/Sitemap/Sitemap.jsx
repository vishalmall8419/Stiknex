import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageSEO from "../../Component/SEO/PageSEO";
import { Search, ChevronRight, ArrowLeft, Compass, ExternalLink } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { ALL_TOOLS, TOOL_HUBS } from "../../data/toolsRegistry";

export default function Sitemap() {
  const { darkMode } = useAppContext();
  const [query, setQuery] = useState("");

  const staticPages = [
    { title: "Home Workspace", path: "/", desc: "Main landing page and spatial workspace overview" },
    { title: "Sticky Notes Canvas", path: "/sticky-notes", desc: "Infinite zoomable canvas for brainstorming, tasks, and mind mapping" },
    { title: "Online Digital Notebook", path: "/online-notebook", desc: "Distraction-free markdown editor and live HTML code runner" },
    { title: "Whiteboard Canvas", path: "/whiteboard", desc: "Interactive Excalidraw-powered freehand sketching board" },
    { title: "200+ Browser Utilities Directory", path: "/tools", desc: "Full searchable index of client-side online tools" },
    { title: "Flagship Typing Master", path: "/stiknex-typing", desc: "WPM typing test, accuracy drills, and developer lessons" },
    { title: "URL Shortener & Analytics", path: "/url-shortener", desc: "Fast link shortener with real-time click tracking" },
    { title: "Blog & Tutorials", path: "/blog", desc: "Articles on productivity, visual thinking, and web mastery" },
    { title: "About Stiknex & Vishal Mall", path: "/about", desc: "Story, mission, and architecture of the independent platform" },
    { title: "Support Creator (Buy Me A Coffee)", path: "/buy-me-a-coffee", desc: "Support independent, free, ad-light software engineering" },
    { title: "Privacy Policy", path: "/privacy-policy", desc: "Our 100% local-first zero data-tracking commitment" },
    { title: "Terms of Service", path: "/terms-of-service", desc: "Usage terms and licensing for free web tools" },
  ];

  const filteredTools = query.trim()
    ? ALL_TOOLS.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase()) ||
          t.slug.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-[#F8A88C]/35 selection:text-[#0F3944] transition-colors duration-200 ${
      darkMode ? "bg-[#0B0F17] text-[#F1F5F9]" : "bg-[#FAF7F2] text-[#1E293B]"
    }`}>
      <PageSEO
        title="Stiknex HTML Sitemap — All 206+ Tools & Pages Index"
        description="Comprehensive index of all 206+ client-side productivity tools, calculators, converters, and workspace pages on Stiknex. Local-first, private, and 100% free."
        path="/sitemap"
        type="website"
      />

      {/* Header Bar */}
      <header className={`border-b py-6 px-6 ${
        darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-[#EADFD5]"
      } backdrop-blur-md sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-[#134E5E] dark:text-teal-400 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stiknex Home</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Total URLs:</span>
            <span className="px-2 py-0.5 rounded-full bg-[#134E5E]/10 dark:bg-teal-500/20 text-[#134E5E] dark:text-teal-300 font-bold">
              {ALL_TOOLS.length + staticPages.length} Pages
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Title & Search */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FFA07A] bg-[#134E5E] px-3.5 py-1 rounded-full">
            Complete Web Index
          </span>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-[#0F3944]"
          }`}>
            Stiknex HTML Sitemap
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Browse our full catalog of 206+ client-side calculators, converters, text formatters, and workspace applications.
          </p>

          <div className="relative pt-2 max-w-lg">
            <Search className="w-4 h-4 absolute left-3.5 top-[22px] text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all 206 tools..."
              className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm outline-none border transition-all ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-white focus:border-teal-400"
                  : "bg-white border-[#EADFD5] text-slate-900 focus:border-[#134E5E] shadow-sm"
              }`}
            />
          </div>
        </div>

        {/* Search Results if user is searching */}
        {filteredTools && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#134E5E] dark:text-teal-400">
              Matching Tools ({filteredTools.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.slug}
                  to={`/${tool.slug}`}
                  className={`p-3.5 rounded-2xl border transition hover:-translate-y-0.5 hover:shadow-md ${
                    darkMode
                      ? "bg-slate-900 border-slate-800 hover:border-teal-400"
                      : "bg-white border-[#EADFD5] hover:border-[#134E5E]"
                  }`}
                >
                  <span className="block text-xs font-bold text-[#134E5E] dark:text-teal-300">
                    {tool.title}
                  </span>
                  <span className="block text-[11px] text-slate-400 font-mono mt-0.5">
                    /{tool.slug}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 1. Core Workspace Pages */}
        {!filteredTools && (
          <section className="space-y-4">
            <h2 className={`text-xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-[#0F3944]"}`}>
              Core Workspaces &amp; Platform Pages ({staticPages.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {staticPages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className={`p-4 rounded-2xl border transition hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between ${
                    darkMode
                      ? "bg-slate-900 border-slate-800 hover:border-teal-400"
                      : "bg-white border-[#EADFD5] hover:border-[#134E5E]"
                  }`}
                >
                  <div>
                    <h3 className="text-sm font-bold text-[#134E5E] dark:text-teal-300">
                      {page.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {page.desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-3 block">
                    {page.path}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 2. Categorized Hubs of All 206 Tools */}
        {!filteredTools && (
          <section className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-[#0F3944]"}`}>
                All 206+ Client-Side Browser Utilities
              </h2>
              <span className="text-xs font-bold text-[#FFA07A] bg-[#134E5E] px-3 py-1 rounded-full">
                9 Categories
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TOOL_HUBS.map((hub) => {
                const tools = ALL_TOOLS.filter((t) => hub.subcategories.includes(t.category));
                if (!tools.length) return null;

                return (
                  <div
                    key={hub.id}
                    className={`rounded-3xl p-6 border flex flex-col ${
                      darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
                    }`}
                  >
                    <div className="border-b pb-3 mb-4 border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <h3 className={`text-base font-bold ${darkMode ? "text-teal-300" : "text-[#134E5E]"}`}>
                          {hub.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">{hub.description}</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {tools.length}
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs flex-1">
                      {tools.map((tool) => (
                        <li key={tool.slug}>
                          <Link
                            to={`/${tool.slug}`}
                            className="text-slate-600 dark:text-slate-400 hover:text-[#134E5E] dark:hover:text-teal-300 transition-colors flex items-center justify-between py-0.5 group"
                          >
                            <span className="truncate pr-2 group-hover:underline">{tool.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">/{tool.slug}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-12 mt-20 text-center text-xs text-slate-400 ${
        darkMode ? "bg-slate-950 border-slate-800" : "bg-white border-[#EADFD5]"
      }`}>
        <p>© 2026 Stiknex. All rights reserved. Created by Vishal Mall.</p>
        <div className="flex items-center justify-center gap-4 mt-3 text-slate-500">
          <Link to="/" className="hover:text-[#134E5E]">Home</Link>
          <span>•</span>
          <Link to="/tools" className="hover:text-[#134E5E]">Tools Directory</Link>
          <span>•</span>
          <Link to="/about" className="hover:text-[#134E5E]">About</Link>
        </div>
      </footer>
    </div>
  );
}
