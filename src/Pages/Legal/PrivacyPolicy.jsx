import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Database, EyeOff, Server, Cookie, HelpCircle } from 'lucide-react';
import AppShell from '../../Component/Layout/AppShell';
import PageSEO from '../../Component/SEO/PageSEO';
import { SITE_URL } from '../../utils/seoConfig';

const PrivacyPolicy = () => {
  return (
    <AppShell fullWidth={true}>
      <PageSEO
        title="Privacy Policy – Transparent Local-First & Zero-Knowledge Architecture | Stiknex"
        description="Read Stiknex's privacy policy. Learn how our local-first browser storage, end-to-end encrypted cloud sync, and anonymous click analytics protect your personal data."
        path="/privacy-policy"
        type="website"
        keywords={["privacy policy", "data privacy", "local storage", "zero knowledge encryption", "stiknex privacy"]}
      />

      <div className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider border border-indigo-100 dark:border-indigo-900/50">
              <ShieldCheck size={14} /> Data Protection & Privacy Architecture
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Effective Date: November 3, 2026. Stiknex is engineered on a fundamental principle: your thoughts, notes, and calculations belong solely to you.
            </p>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Database size={20} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Local-First Storage</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Sticky notes, notebooks, and drawings are stored directly in your browser's local IndexedDB and localStorage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Lock size={20} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Zero-Knowledge E2EE</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Cloud Sync uses AES-256-GCM client-side encryption. Stiknex servers only receive ciphertext and cannot read your data.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <EyeOff size={20} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">No Raw IP Retention</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                URL shortener analytics estimates unique visitors using cryptographic salted hashes. Raw IP addresses are never saved.
              </p>
            </div>
          </div>

          {/* Detailed Policy Content */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed">
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                1. Information We Collect and Process
              </h2>
              <p className="text-sm">
                Stiknex minimizes data collection by design. We do not require accounts, passwords, or personal profiles to access our core productivity tools:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>
                  <strong className="text-slate-900 dark:text-white">Workspace Data:</strong> Text inside your sticky notes, digital notebooks, and whiteboard diagrams resides in your device's browser memory (localStorage and IndexedDB). This data is never automatically transmitted to Stiknex servers.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Optional Cloud Sync Data:</strong> If you explicitly enable Multi-Device Cloud Sync, your notes are encrypted locally in your browser using standard AES-256-GCM cryptography. The decryption key is generated on your device and never sent to our servers. We only store the encrypted blob (ciphertext) associated with a pseudonymized sync group ID.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">URL Shortener Analytics:</strong> When you shorten a URL, we store the destination link and an optional vanity alias. When visitors click a short link, we record timestamp, referrer header, user agent category, and geographic country. Raw IP addresses are discarded immediately after computing a salted one-way hash for unique visitor estimation.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">In-App Feedback & Messages:</strong> When you voluntarily submit a message or rating through our feedback modal, we collect your message text and selected category to improve the service.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                2. Third-Party Services & Infrastructure
              </h2>
              <p className="text-sm">
                We partner with reputable infrastructure providers to deliver reliable, high-performance web utilities:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>
                  <strong className="text-slate-900 dark:text-white">Hosting & Edge Network:</strong> Hosted on Vercel Inc. Serverless functions execute in secured, transient runtime environments.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Database Storage:</strong> Encrypted sync payloads, short URLs, and published articles are stored securely in MongoDB Atlas with TLS in transit and encryption at rest.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Analytics:</strong> We use Google Analytics 4 (Property ID: 556064917) and Vercel Analytics to understand anonymous aggregate traffic patterns, Core Web Vitals, and browser compatibility.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Payments:</strong> Voluntary contributions through "Buy Me a Coffee" are processed via Razorpay. Stiknex does not collect, process, or store credit card or banking details.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                3. Cookies & Browser Storage
              </h2>
              <p className="text-sm">
                Stiknex does not use third-party behavioral advertising cookies. We use essential browser storage for:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>Persisting dark/light theme preferences (`theme`).</li>
                <li>Saving your offline sticky notes, active notebooks, and board layouts (`notes`, `stiknex_notebooks`).</li>
                <li>Caching ephemeral sync group pairing tokens (`stiknex_notebook_sync_identity`).</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                4. Data Retention & Deletion Rights
              </h2>
              <p className="text-sm">
                Because your data is stored locally in your browser, you maintain complete sovereignty over your information:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>
                  <strong className="text-slate-900 dark:text-white">Clearing Local Notes:</strong> You can clear all local notes at any time using your browser's "Clear Site Data" or "Clear Cookies & Cache" settings.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Unlinking Cloud Sync:</strong> Clicking "Disconnect" in the Multi-Device Cloud Sync modal purges your sync credentials from local storage.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Data Deletion Inquiries:</strong> If you wish to request deletion of any telemetry or short link, email us at <a href="mailto:support@stiknex.site" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">support@stiknex.site</a>.
                </li>
              </ul>
            </section>

            <section className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                5. Contact Us
              </h2>
              <p className="text-sm">
                If you have questions, feedback, or concerns regarding our privacy practices, please contact our engineering team:
              </p>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm space-y-1">
                <p><strong>Service:</strong> Stiknex Online Productivity Suite</p>
                <p><strong>Developer:</strong> Vishal Mall (<a href="https://vishalmall.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">vishalmall.vercel.app</a>)</p>
                <p><strong>Email:</strong> <a href="mailto:support@stiknex.site" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">support@stiknex.site</a></p>
                <p><strong>Website:</strong> <a href="https://stiknex.site/" className="text-indigo-600 dark:text-indigo-400 underline">https://stiknex.site</a></p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default PrivacyPolicy;

