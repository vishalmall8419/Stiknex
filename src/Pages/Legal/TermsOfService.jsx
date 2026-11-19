import React from "react";
import { Link } from "react-router-dom";
import PageSEO from "../../Component/SEO/PageSEO";
import { ArrowLeft, Scale, CheckCircle2, AlertTriangle, ShieldCheck, Globe, HelpCircle } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function TermsOfService() {
  const { darkMode } = useAppContext();

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-[#F8A88C]/35 selection:text-[#0F3944] transition-colors duration-200 ${
      darkMode ? "bg-[#0B0F17] text-[#F1F5F9]" : "bg-[#FAF7F2] text-[#1E293B]"
    }`}>
      <PageSEO
        title="Terms of Service – Usage Guidelines & Fair Use Policy | Stiknex"
        description="Read the Stiknex Terms of Service. Understand our fair use policies, acceptable use guidelines for the workspaces and online utilities, and open licensing."
        path="/terms-of-service"
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
            <span>License:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold">
              Free &amp; Open Fair Use
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        
        {/* Title & Introduction */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FFA07A] bg-[#134E5E] px-3.5 py-1 rounded-full">
            User Agreement &amp; Terms
          </span>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-[#0F3944]"
          }`}>
            Stiknex Terms of Service
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Effective Date: November 2026. By accessing Stiknex (stiknex.site), you agree to these fair use terms and software guidelines.
          </p>
        </div>

        {/* 3 Core Summary Cards (Matching Sitemap & Circle Aesthetic) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-[28px] border shadow-sm space-y-3 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <div className="w-11 h-11 rounded-2xl bg-[#134E5E]/10 dark:bg-teal-500/20 text-[#134E5E] dark:text-teal-300 flex items-center justify-center">
              <CheckCircle2 size={22} />
            </div>
            <h2 className="font-bold text-[#0F3944] dark:text-white text-base">100% Free Forever</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every workspace and utility is free for personal, academic, professional, and commercial use.
            </p>
          </div>

          <div className={`p-6 rounded-[28px] border shadow-sm space-y-3 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle size={22} />
            </div>
            <h2 className="font-bold text-[#0F3944] dark:text-white text-base">Acceptable Use</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Automated crawling abuse, distributed denial-of-service, or transmitting malicious code is strictly prohibited.
            </p>
          </div>

          <div className={`p-6 rounded-[28px] border shadow-sm space-y-3 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#134E5E] dark:text-teal-300 flex items-center justify-center">
              <Globe size={22} />
            </div>
            <h2 className="font-bold text-[#0F3944] dark:text-white text-base">Your Content Ownership</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You retain 100% intellectual property ownership of all notes, code, writings, and diagrams you create.
            </p>
          </div>
        </div>

        {/* Detailed Terms Sections (Structured Cards) */}
        <div className="space-y-6">

          {/* Section 1 */}
          <section className={`p-8 sm:p-10 rounded-[32px] border shadow-sm space-y-4 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F3944] dark:text-white flex items-center gap-2.5">
              <Scale className="text-[#134E5E] dark:text-teal-400" size={24} />
              <span>1. Permitted Use &amp; Intellectual Property</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Stiknex grants you a personal, worldwide, non-exclusive, royalty-free license to use its digital sticky notes canvas, markdown notepad, Excalidraw whiteboard, and 206 client-side tools.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Your Content:</strong> Any text, code snippets, calculations, images, or drawings created inside Stiknex remain your exclusive property. Stiknex asserts no ownership or copyright claims over user-generated notes.
            </p>
          </section>

          {/* Section 2 */}
          <section className={`p-8 sm:p-10 rounded-[32px] border shadow-sm space-y-4 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F3944] dark:text-white flex items-center gap-2.5">
              <AlertTriangle className="text-amber-500" size={24} />
              <span>2. Acceptable Use Policy</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When utilizing our applications, tools, and URL shortener, you agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li>Use the URL shortener to redirect to phishing websites, malware distribution networks, or fraudulent campaigns.</li>
              <li>Launch bot-driven denial-of-service or volumetric strain against our serverless API endpoints.</li>
              <li>Attempt to decompile, exploit, or bypass authentication controls on our administrative dashboard.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className={`p-8 sm:p-10 rounded-[32px] border shadow-sm space-y-4 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F3944] dark:text-white flex items-center gap-2.5">
              <ShieldCheck className="text-[#134E5E] dark:text-teal-400" size={24} />
              <span>3. "As Is" Warranty Disclaimer</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Stiknex is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. While all mathematical, financial, and conversion calculations are rigorously tested for precision, users should independently verify critical calculations before executing binding legal or financial transactions.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Because Stiknex operates local-first, the creator is not liable for data loss caused by local device malfunctions, operating system crashes, or intentional browser cache purges.
            </p>
          </section>

          {/* Section 4 */}
          <section className={`p-8 sm:p-10 rounded-[32px] border shadow-sm space-y-4 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#EADFD5]"
          }`}>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F3944] dark:text-white flex items-center gap-2.5">
              <HelpCircle className="text-[#134E5E] dark:text-teal-400" size={24} />
              <span>4. Modifications &amp; Contact</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We reserve the right to add new tools, update algorithmic models, or refine these terms to keep pace with web standards. Continued use of Stiknex following any updates constitutes acceptance of the modified terms.
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              For questions regarding these terms, contact Vishal Mall at:{" "}
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
            <Link to="/privacy-policy" className="hover:text-[#134E5E] dark:hover:text-teal-300">Privacy Policy</Link>
          </div>
          <div>&copy; 2026 Stiknex. All rights reserved. Created by Vishal Mall.</div>
        </footer>

      </main>
    </div>
  );
}
