import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, AlertTriangle, ShieldCheck, Scale, Globe } from 'lucide-react';
import AppShell from '../../Component/Layout/AppShell';
import PageSEO from '../../Component/SEO/PageSEO';
import { SITE_URL } from '../../utils/seoConfig';

const TermsOfService = () => {
  return (
    <AppShell fullWidth={true}>
      <PageSEO
        title="Terms of Service – Usage Guidelines & Acceptable Use Policy | Stiknex"
        description="Read the Stiknex Terms of Service. Understand our fair use policies, acceptable use guidelines for the URL shortener and online utilities, and terms of use."
        path="/terms-of-service"
        type="website"
        keywords={["terms of service", "terms of use", "user agreement", "stiknex terms", "acceptable use policy"]}
      />

      <div className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider border border-indigo-100 dark:border-indigo-900/50">
              <Scale size={14} /> User Agreement & Guidelines
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Effective Date: November 3, 2026. By accessing or using Stiknex, you agree to comply with these terms.
            </p>
          </div>

          {/* Core Tenets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <CheckCircle size={20} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Free for Everyone</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Stiknex tools, calculators, and workspaces are free to use for personal, academic, and commercial workflows.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Acceptable Use</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Links, notes, or activities involving malware, phishing, harassment, or illegal content are strictly prohibited.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Globe size={20} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">No Warranty</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tools are provided "as is". Always keep independent backups of critical data before clearing your browser.
              </p>
            </div>
          </div>

          {/* Detailed Terms */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed">
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                1. Acceptance of Terms
              </h2>
              <p className="text-sm">
                By visiting, browsing, or using any web utility, application, or service available at <a href="https://stiknex.site" className="text-indigo-600 dark:text-indigo-400 font-medium underline">https://stiknex.site</a> ("Stiknex"), you confirm that you have read, understood, and agreed to be legally bound by these Terms of Service. If you do not agree to these terms, please discontinue using the website.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                2. Acceptable Use Policy
              </h2>
              <p className="text-sm">
                You agree to use Stiknex only for lawful purposes. You agree not to:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>Use the URL Shortener to link to malware, ransomware, phishing schemes, illegal substances, child exploitation, or copyright-infringing downloads.</li>
                <li>Attempt to bypass rate limits, probe private APIs, inject malicious scripts, or disrupt the operation of Stiknex services.</li>
                <li>Scrape, flood, or abuse serverless endpoints with automated denial-of-service traffic.</li>
                <li>Impersonate any individual, organization, or developer associated with Stiknex.</li>
              </ul>
              <p className="text-sm">
                We reserve the right to immediately deactivate, redirect, or permanently remove any shortened URL or sync group found in violation of this Acceptable Use Policy without prior notice.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                3. Intellectual Property Rights
              </h2>
              <p className="text-sm">
                All source code, user interface designs, logos, graphics, and written guides created by Stiknex are protected by intellectual property laws. You retain full, exclusive ownership of all notes, drawings, and texts you create or calculate using our tools.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                4. Disclaimer of Warranties
              </h2>
              <p className="text-sm">
                Stiknex is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. While we strive for extreme mathematical accuracy in all calculators and converters, we cannot guarantee that every calculation or conversion will be free from error or suitable for mission-critical engineering, medical, or financial reliance.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                5. Limitation of Liability
              </h2>
              <p className="text-sm">
                To the maximum extent permitted by applicable law, in no event shall Stiknex or its developers be held liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data resulting from browser cache clearance, device loss, or unexpected browser termination.
              </p>
            </section>

            <section className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                6. Contact & Legal Notices
              </h2>
              <p className="text-sm">
                For questions regarding these Terms of Service, contact:
              </p>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm space-y-1">
                <p><strong>Service:</strong> Stiknex</p>
                <p><strong>Maintainer:</strong> Vishal Mall</p>
                <p><strong>Email:</strong> <a href="mailto:support@stiknex.site" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">support@stiknex.site</a></p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default TermsOfService;

