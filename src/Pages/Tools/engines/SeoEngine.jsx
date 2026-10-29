import { useState, useMemo } from "react";
import { Copy, Check, Search, Globe, Share2, Code, Link2, BookOpen, Download, AlertCircle, Sparkles } from "lucide-react";

export default function SeoEngine({ slug, toolId }) {
  const [copied, setCopied] = useState(false);
  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (slug === "meta-description-counter") return <MetaDescriptionCounter copyText={copyText} copied={copied} />;
  if (slug === "keyword-density-checker") return <KeywordDensityChecker copyText={copyText} copied={copied} />;
  if (slug === "robots-txt-generator") return <RobotsTxtGenerator copyText={copyText} copied={copied} />;
  if (slug === "sitemap-xml-generator") return <SitemapGenerator copyText={copyText} copied={copied} />;
  if (slug === "open-graph-preview") return <OpenGraphPreview copyText={copyText} copied={copied} />;
  if (slug === "schema-markup-generator") return <SchemaGenerator copyText={copyText} copied={copied} />;
  if (slug === "utm-link-builder") return <UtmLinkBuilder copyText={copyText} copied={copied} />;
  if (slug === "url-slug-checker") return <UrlSlugChecker copyText={copyText} copied={copied} />;
  if (slug === "readability-checker") return <ReadabilityChecker copyText={copyText} copied={copied} />;

  // Default: SERP Snippet Preview
  return <SerpSnippetPreview copyText={copyText} copied={copied} />;
}

// 1. SERP SNIPPET PREVIEW
function SerpSnippetPreview({ copyText, copied }) {
  const [title, setTitle] = useState("Best Online Utility Tools & Sticky Notes | Stiknex");
  const [desc, setDesc] = useState("Discover 200+ fast, secure browser tools for developers, designers, and students. Zero server uploads, privacy-focused, and 100% free.");
  const [url, setUrl] = useState("https://stiknex.site/tools");
  const [device, setDevice] = useState("desktop"); // desktop | mobile

  const titleLength = title.length;
  const descLength = desc.length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-400" /> Google SERP Snippet Simulator
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setDevice("desktop")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${device === "desktop" ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400"}`}
            >
              Desktop
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${device === "mobile" ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400"}`}
            >
              Mobile
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <label className="text-slate-400">Page Title</label>
              <span className={titleLength > 60 ? "text-amber-400" : "text-emerald-400"}>{titleLength} / 60 chars</span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <label className="text-slate-400">Meta Description</label>
              <span className={descLength > 160 ? "text-amber-400" : "text-emerald-400"}>{descLength} / 160 chars</span>
            </div>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Canonical URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
            />
          </div>
        </div>

        {/* Google SERP Card Preview */}
        <div className="bg-[#202124] p-5 rounded-2xl border border-white/10 space-y-1.5 font-sans max-w-2xl">
          <div className="text-xs text-[#bdc1c6] flex items-center gap-1.5 truncate">
            <span className="w-4 h-4 rounded-full bg-[#303134] flex items-center justify-center text-[10px]">🌐</span>
            <span>{url}</span>
          </div>
          <h4 className="text-[#8ab4f8] hover:underline text-lg font-medium cursor-pointer leading-snug line-clamp-1">
            {title || "Untitled Page"}
          </h4>
          <p className="text-[#bdc1c6] text-sm leading-relaxed line-clamp-2">
            {desc || "No meta description provided."}
          </p>
        </div>
      </div>
    </div>
  );
}

// 2. META DESCRIPTION COUNTER
function MetaDescriptionCounter({ copyText, copied }) {
  const [desc, setDesc] = useState("Explore 200+ free online utility tools at Stiknex. Privacy-first, zero server uploads, lightning fast in-browser experience.");
  const len = desc.length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Meta Description Length & Pixel Counter</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${len >= 120 && len <= 160 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-amber-500/20 text-amber-400 border border-amber-500/40"}`}>
            {len >= 120 && len <= 160 ? "Optimal Length (120-160 chars)" : len < 120 ? "Too Short (<120 chars)" : "May Truncate (>160 chars)"}
          </span>
        </div>

        <textarea
          rows={5}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Paste or type meta description here..."
          className="w-full bg-slate-800 border border-white/10 rounded-xl p-4 text-white text-base leading-relaxed"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10">
            <span className="text-xs text-slate-400 block">Character Count</span>
            <span className="text-2xl font-bold text-white mt-1 block">{len} / 160</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10">
            <span className="text-xs text-slate-400 block">Approx. Desktop Width</span>
            <span className="text-2xl font-bold text-indigo-400 mt-1 block">~{Math.round(len * 6.5)} px</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Word Count</span>
              <span className="text-2xl font-bold text-white mt-1 block">{desc.trim() ? desc.trim().split(/\s+/).length : 0} words</span>
            </div>
            <button onClick={() => copyText(desc)} className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. KEYWORD DENSITY CHECKER
function KeywordDensityChecker() {
  const [text, setText] = useState("Stiknex is a fast online utility platform. The platform features sticky notes, calculators, formatters, and developer utilities. Every tool in Stiknex runs client-side.");

  const analysis = useMemo(() => {
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const total = words.length;
    if (total === 0) return { total: 0, keywords: [] };

    const freq = {};
    words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });

    const sorted = Object.entries(freq)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return { total, keywords: sorted };
  }, [text]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Keyword Density & Frequency Checker</h3>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste article or content..."
          className="w-full bg-slate-800 border border-white/10 rounded-xl p-4 text-white text-sm"
        />

        <div className="space-y-2">
          <span className="text-xs text-slate-400 block font-semibold">Top Keywords (Total words: {analysis.total})</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analysis.keywords.map((k, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-white/5">
                <span className="text-sm font-medium text-white">{k.word}</span>
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>{k.count} times</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">{k.density}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. ROBOTS.TXT GENERATOR
function RobotsTxtGenerator({ copyText, copied }) {
  const [userAgent, setUserAgent] = useState("*");
  const [sitemap, setSitemap] = useState("https://stiknex.site/sitemap.xml");
  const [disallow, setDisallow] = useState("/api/\n/admin/\n/tmp/");

  const content = `User-agent: ${userAgent}\n${disallow.split("\n").filter(Boolean).map(p => `Disallow: ${p.trim()}`).join("\n")}\nAllow: /\n\nSitemap: ${sitemap}\n`;

  const downloadFile = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Robots.txt Generator</h3>
          <div className="flex gap-2">
            <button onClick={() => copyText(content)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy
            </button>
            <button onClick={downloadFile} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">User-Agent</label>
            <input type="text" value={userAgent} onChange={(e) => setUserAgent(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Sitemap URL</label>
            <input type="text" value={sitemap} onChange={(e) => setSitemap(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Disallowed Paths (one per line)</label>
          <textarea rows={3} value={disallow} onChange={(e) => setDisallow(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-white font-mono text-xs" />
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono">{content}</pre>
        </div>
      </div>
    </div>
  );
}

// 5. SITEMAP XML GENERATOR
function SitemapGenerator({ copyText, copied }) {
  const [urls, setUrls] = useState("https://stiknex.site/\nhttps://stiknex.site/tools\nhttps://stiknex.site/typing-lab\nhttps://stiknex.site/notes");
  const today = new Date().toISOString().split("T")[0];

  const xml = useMemo(() => {
    const list = urls.split("\n").map(s => s.trim()).filter(Boolean);
    let out = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    list.forEach((u) => {
      out += `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });
    out += `</urlset>`;
    return out;
  }, [urls, today]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">XML Sitemap Generator</h3>
          <button onClick={() => copyText(xml)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy XML
          </button>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">URLs to include (one per line)</label>
          <textarea rows={4} value={urls} onChange={(e) => setUrls(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-white font-mono text-xs" />
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 max-h-56 overflow-auto">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{xml}</pre>
        </div>
      </div>
    </div>
  );
}

// 6. OPEN GRAPH PREVIEW
function OpenGraphPreview() {
  const [title, setTitle] = useState("Stiknex: 200+ Free Online Utility Tools & Sticky Notes");
  const [desc, setDesc] = useState("Fast, privacy-first in-browser tools. No signup, no ads, 100% free.");
  const [site, setSite] = useState("stiknex.site");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Open Graph & Social Share Preview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">OG Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Domain</label>
            <input type="text" value={site} onChange={(e) => setSite(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>

        <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-950 max-w-lg mx-auto">
          <div className="h-44 bg-gradient-to-tr from-indigo-900 via-slate-900 to-indigo-950 flex items-center justify-center text-white/50 text-sm font-semibold">
            Social Card Preview Image (1200 × 630)
          </div>
          <div className="p-4 space-y-1 bg-slate-900">
            <span className="text-xs uppercase text-slate-400 block font-semibold">{site}</span>
            <h5 className="text-base font-bold text-white line-clamp-1">{title}</h5>
            <p className="text-xs text-slate-400 line-clamp-2">{desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. SCHEMA MARKUP GENERATOR
function SchemaGenerator({ copyText, copied }) {
  const [name, setName] = useState("Stiknex Tools");
  const [url, setUrl] = useState("https://stiknex.site");

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "url": url,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All modern browsers"
  }, null, 2);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">JSON-LD Schema Markup Generator</h3>
          <button onClick={() => copyText(schema)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Schema
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">App Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">App URL</label>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10">
          <pre className="text-xs text-emerald-400 font-mono whitespace-pre">{schema}</pre>
        </div>
      </div>
    </div>
  );
}

// 8. UTM LINK BUILDER
function UtmLinkBuilder({ copyText, copied }) {
  const [base, setBase] = useState("https://stiknex.site");
  const [source, setSource] = useState("newsletter");
  const [medium, setMedium] = useState("email");
  const [campaign, setCampaign] = useState("spring_launch");

  const fullUrl = useMemo(() => {
    try {
      const u = new URL(base.startsWith("http") ? base : `https://${base}`);
      if (source) u.searchParams.set("utm_source", source);
      if (medium) u.searchParams.set("utm_medium", medium);
      if (campaign) u.searchParams.set("utm_campaign", campaign);
      return u.toString();
    } catch (e) {
      return base;
    }
  }, [base, source, medium, campaign]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Google Analytics UTM Link Builder</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Website Base URL</label>
            <input type="text" value={base} onChange={(e) => setBase(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Campaign Source (utm_source)</label>
            <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. twitter, google, newsletter" className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Campaign Medium (utm_medium)</label>
            <input type="text" value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="e.g. cpc, banner, email" className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Campaign Name (utm_campaign)</label>
            <input type="text" value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="e.g. summer_promo" className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 flex items-center justify-between gap-3">
          <span className="text-xs font-mono text-emerald-400 truncate">{fullUrl}</span>
          <button onClick={() => copyText(fullUrl)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy URL
          </button>
        </div>
      </div>
    </div>
  );
}

// 9. URL SLUG CHECKER
function UrlSlugChecker({ copyText, copied }) {
  const [input, setInput] = useState("Best 10 Online Tools For Faster Productivity in 2026!");
  const slug = useMemo(() => {
    return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }, [input]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">SEO URL Slug Generator & Checker</h3>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 flex items-center justify-between">
          <span className="text-sm font-mono text-emerald-400 font-bold">{slug}</span>
          <button onClick={() => copyText(slug)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy
          </button>
        </div>
      </div>
    </div>
  );
}

// 10. READABILITY CHECKER
function ReadabilityChecker() {
  const [text, setText] = useState("Clear writing leads to clear thinking. When sentences are concise and direct, readers can easily grasp complex technical ideas.");

  const score = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = (text.match(/[.!?]+/g) || []).length || 1;
    const syllables = (text.match(/[aeiouy]{1,2}/gi) || []).length || 1;
    if (words === 0) return 0;
    const flesch = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Math.max(0, Math.min(100, Math.round(flesch)));
  }, [text]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Flesch-Kincaid Readability Score</h3>
        <textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-4 text-white text-sm" />
        <div className="bg-slate-800/80 p-5 rounded-xl border border-indigo-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-indigo-400 uppercase font-semibold">Reading Ease Score</span>
            <div className="text-3xl font-bold text-white mt-1">{score} / 100</div>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold">
            {score >= 70 ? "Easy & Conversational" : score >= 50 ? "Standard Readability" : "Technical / Academic"}
          </span>
        </div>
      </div>
    </div>
  );
}

