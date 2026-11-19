import React from "react";
import { Link } from "react-router-dom";
import PageSEO from "../../Component/SEO/PageSEO";
import { ArrowLeft, ShieldCheck, Lock, Database, EyeOff, Server, Cookie, HelpCircle, CheckCircle2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function PrivacyPolicy() {
  const { darkMode } = useAppContext();

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-[#F8A88C]/35 selection:text-[#0F3944] transition-colors duration-200 ${
      darkMode ? "bg-[#0B0F17] text-[#F1F5F9]" : "bg-[#FAF7F2] text-[#1E293B]"
    }`}>
      <PageSEO
        title="Privacy Policy – Transparent Local-First & Zero-Knowledge Architecture | Stiknex"
        description="Read Stiknex's privacy policy. Learn how our local-first browser storage, client-side execution, and zero data-tracking architecture protects your personal thoughts and files."
        path="/privacy-policy"
        type="website"
      />

      {/* Header Bar (Matching Sitemap.jsx Structure) */}
      <header className={`border-b py-6 px-6 ${
        darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-[#EADFD5]"
      } backdrop-blur-md sticky top-0 z-40`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-[#134E5E] dark:text-teal-400 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stiknex Home</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Status:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              100% Local-First
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        
        {/* Title & Introduction */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FFA07A] bg-[#134E5E] px-3.5 py-1 rounded-full">
            Data Protection Manifesto
          </span>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-[#0F3944]"
          }`}>
            Stiknex Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Effective Date: November 2026. Engineered on an uncompromising principle: your thoughts, notes, drawings, and calculations belong solely to you.
          </p>
        </div>

        {/* 3 Core Summary Cards (Matching Sitemap & Circle Aesthetic) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-[28px] border shadow-sm space-y-3 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <div className="w-11 h-11 rounded-2xl bg-[#134E5E]/10 dark:bg-teal-500/20 text-[#134E5E] dark:text-teal-300 flex items-center justify-center">
              <Database size={22} />
            </div>
            <h2 className="font-bold text-[#0F3944] dark:text-white text-base">Local-First Storage</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Notes, drawings, checklists, and inputs are stored directly in your browser's local IndexedDB and localStorage.
            </p>
          </div>

          <div className={`p-6 rounded-[28px] border shadow-sm space-y-3 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Lock size={22} />
            </div>
            <h2 className="font-bold text-[#0F3944] dark:text-white text-base">In-Memory Engine</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              All 206 converters, formatters, and calculators execute in client-side V8 memory with zero network uploads.
            </p>
          </div>

          <div className={`p-6 rounded-[28px] border shadow-sm space-y-3 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <EyeOff size={22} />
            </div>
            <h2 className="font-bold text-[#0F3944] dark:text-white text-base">Zero Tracking Pixels</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No invasive advertising trackers or profiling cookies. We do not sell, rent, or monetize your inputs.
            </p>
          </div>
        </div>

        {/* Detailed Policy Sections (Structured Cards) */}
        <div className="space-y-6">

          {/* Section 1 */}
          <section className={`p-8 sm:p-10 rounded-[32px] border shadow-sm space-y-4 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F3944] dark:text-white flex items-center gap-2.5">
              <ShieldCheck className="text-[#134E5E] dark:text-teal-400" size={24} />
              <span>1. Information We Do NOT Collect</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Stiknex minimizes data collection by design. We deliberately avoid requiring accounts, passwords, or identity verification to use our workspaces:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Sticky Notes &amp; Notepad Content:</strong> Content you write, pin, sketch, or edit stays in your local browser IndexedDB. It is never transmitted to any central database.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Tool Inputs:</strong> Passwords generated, images compressed, JSON files formatted, or calculations performed exist solely in ephemeral RAM. When you close the browser tab, the memory is instantly reclaimed.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Biometric &amp; Device Identity:</strong> We never record device fingerprinting, clipboard history, or GPS locations.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className={`p-8 sm:p-10 rounded-[32px] border shadow-sm space-y-4 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F3944] dark:text-white flex items-center gap-2.5">
              <Database className="text-[#134E5E] dark:text-teal-400" size={24} />
              <span>2. Local Storage &amp; IndexedDB Mechanism</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Stiknex uses standard HTML5 web storage APIs (<code>IndexedDB</code> powered by Dexie.js and <code>localStorage</code>) to enable offline continuity without a backend.
            </p>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
              <strong>User Responsibility Notice:</strong> Because your data resides in your local browser sandbox, clearing your browser cache, history, or site data will delete your locally saved sticky notes and drafts. We strongly recommend using the <strong>Download JSON Backup</strong> feature in the sidebar to keep offline backups of vital projects.
            </div>
          </section>

          {/* Section 3 */}
          <section className={`p-8 sm:p-10 rounded-[32px] border shadow-sm space-y-4 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F3944] dark:text-white flex items-center gap-2.5">
              <Server className="text-[#134E5E] dark:text-teal-400" size={24} />
              <span>3. Aggregate Performance Telemetry</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To monitor uptime and prevent denial-of-service abuse, we collect minimal, anonymized infrastructure telemetry:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li>Aggregate page view counters and HTTP response codes.</li>
              <li>Core Web Vitals metrics (FCP, LCP, CLS) to guarantee 0.05s page speed.</li>
              <li>Cryptographic salted hashes for unique visit counters in the URL shortener (raw IP addresses are discarded immediately after hashing).</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className={`p-8 sm:p-10 rounded-[32px] border shadow-sm space-y-4 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F3944] dark:text-white flex items-center gap-2.5">
              <HelpCircle className="text-[#134E5E] dark:text-teal-400" size={24} />
              <span>4. Contact &amp; Data Rights</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Because we do not store your personal identity or account profiles, you already possess 100% data sovereignty. You can delete all your notes at any time by clicking "Empty Trash" or resetting your browser storage.
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              For security disclosures or privacy inquiries, contact software engineer Vishal Mall at:{" "}
              <a href="mailto:vishal.mall02@outlook.com" className="text-[#134E5E] dark:text-teal-300 font-bold underline">
                vishal.mall02@outlook.com
              </a>
            </p>
          </section>

        </div>

        {/* Global Footer Navigation */}
        <footer className="pt-8 border-t border-[#EADFD5] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-[#134E5E] dark:hover:text-teal-300">Home</Link>
            <Link to="/about" className="hover:text-[#134E5E] dark:hover:text-teal-300">About Stiknex</Link>
            <Link to="/sitemap" className="hover:text-[#134E5E] dark:hover:text-teal-300">HTML Sitemap</Link>
            <Link to="/terms-of-service" className="hover:text-[#134E5E] dark:hover:text-teal-300">Terms of Service</Link>
          </div>
          <div>&copy; 2026 Stiknex. All rights reserved. Created by Vishal Mall.</div>
        </footer>

      </main>
    </div>
  );
}
