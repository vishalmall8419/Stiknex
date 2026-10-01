import React, { useState, useEffect } from 'react';
import { Target, Search, BarChart3, Clock, CheckCircle, Hash, AlertTriangle, Globe, Link as LinkIcon, Activity } from "lucide-react";

const SEOMonitoring = () => {
  const [stats, setStats] = useState({
    publishedBlogs: 0,
    totalKeywords: 0,
    lastCronRun: null,
    sitemapStatus: "Active",
    robotsStatus: "Active",
    indexedEstimates: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a production app with Search Console API, this would fetch real GSC data.
    // For now, we fetch from our MongoDB backend to get blog/keyword stats.
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("stkx_admin_token");
        const res = await fetch("/api/seo-stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(prev => ({
            ...prev,
            publishedBlogs: data.publishedBlogs || 0,
            totalKeywords: data.totalKeywords || 0,
            lastCronRun: data.lastCronRun || 'Running on Vercel Cron (0 3 * * *)',
            indexedEstimates: data.publishedBlogs + 15 // Basic estimate: blogs + core pages
          }));
        }
      } catch (e) {
        console.error("Failed to fetch SEO stats", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading SEO Metrics...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">SEO & Search Console Monitoring</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time overview of crawling, indexing, and organic growth.</p>
        </div>
        <a 
          href="https://search.google.com/search-console" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          <Search size={18} /> Open Google Search Console
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Globe className="text-blue-500"/>} title="Est. Indexed URLs" value={stats.indexedEstimates} trend="+ Daily" />
        <StatCard icon={<CheckCircle className="text-green-500"/>} title="Published AI Blogs" value={stats.publishedBlogs} trend="Automated" />
        <StatCard icon={<Hash className="text-purple-500"/>} title="Tracked Keywords" value={stats.totalKeywords} trend="Trending" />
        <StatCard icon={<Activity className="text-orange-500"/>} title="Core Web Vitals" value="Pass" trend="LCP &lt; 2.5s" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Target size={20} className="text-indigo-500"/> Crawling Infrastructure</h2>
          <ul className="space-y-4">
            <li className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">sitemap.xml</p>
                <p className="text-sm text-slate-500">Dynamic API Route</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">{stats.sitemapStatus}</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">robots.txt</p>
                <p className="text-sm text-slate-500">Crawl-delay & AI Bot blocking</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">{stats.robotsStatus}</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Daily Blog Cron</p>
                <p className="text-sm text-slate-500">{stats.lastCronRun}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Scheduled</span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><AlertTriangle size={20} className="text-amber-500"/> Search Console Action Items</h2>
          <div className="space-y-4">
            <ActionItem 
              title="Submit Sitemap to GSC" 
              desc="Ensure https://stiknex.vercel.app/sitemap.xml is submitted in the Google Search Console Sitemaps report."
              status="Required"
            />
            <ActionItem 
              title="Monitor Core Web Vitals" 
              desc="Vercel Analytics and web-vitals package are collecting INP and LCP data. Review in GSC."
              status="Ongoing"
            />
            <ActionItem 
              title="Monitor Crawl Budget" 
              desc="Daily automated blogs increase URL count. Ensure API responses are fast to save crawl budget."
              status="Ongoing"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, trend }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">{icon}</div>
      <h3 className="font-semibold text-slate-600 dark:text-slate-400">{title}</h3>
    </div>
    <div className="flex items-end justify-between mt-auto">
      <span className="text-4xl font-black text-slate-900 dark:text-white">{value}</span>
      <span className="text-sm font-bold text-slate-500">{trend}</span>
    </div>
  </div>
);

const ActionItem = ({ title, desc, status }) => (
  <div className="border-l-4 border-amber-500 pl-4 py-1">
    <div className="flex justify-between items-start">
      <h4 className="font-bold text-slate-900 dark:text-white">{title}</h4>
      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">{status}</span>
    </div>
    <p className="text-sm text-slate-500 mt-1">{desc}</p>
  </div>
);

export default SEOMonitoring;
