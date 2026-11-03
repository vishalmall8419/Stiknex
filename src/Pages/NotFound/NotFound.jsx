import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileQuestion, 
  Search, 
  Home, 
  StickyNote, 
  BookOpen, 
  PenTool, 
  Wrench, 
  ArrowRight,
  Sparkles,
  Link2
} from 'lucide-react';
import AppShell from '../../Component/Layout/AppShell';

export default function NotFound({ requestedSlug }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/tools?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/tools');
    }
  };

  const coreApps = [
    {
      title: 'Sticky Notes',
      desc: 'Smart, draggable scratchpad with auto-save & rich Markdown formatting',
      href: '/stickynotes',
      icon: StickyNote,
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Digital Notebook',
      desc: 'Distraction-free lined paper & grid editor with cloud sync',
      href: '/notebook',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Interactive Whiteboard',
      desc: 'Infinite canvas with vector shapes, drawing tools & cloud export',
      href: '/whiteboard',
      icon: PenTool,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Free Web Tools (200+)',
      desc: 'Calculators, converters, formatters & developer utilities',
      href: '/tools',
      icon: Wrench,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'URL Shortener',
      desc: 'Instant, secure link shortening with click analytics & QR codes',
      href: '/url-shortener',
      icon: Link2,
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Tech & Productivity Blog',
      desc: 'In-depth engineering guides, utility tutorials & best practices',
      href: '/blog',
      icon: Sparkles,
      color: 'from-violet-500 to-fuchsia-500'
    }
  ];

  return (
    <AppShell activePage="404">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <FileQuestion className="w-4 h-4" />
            <span>HTTP 404 — Page Not Found</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Oops! That page doesn't exist.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            {requestedSlug ? (
              <>
                The requested URL path <code className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-rose-600 dark:text-rose-400 font-mono text-sm">/{requestedSlug}</code> could not be found or has been moved.
              </>
            ) : (
              'The link you followed may be broken, or the page may have been removed or renamed.'
            )}
          </p>

          {/* Quick Search */}
          <div className="max-w-md mx-auto mb-10">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search 200+ tools (e.g. data converter, json, diff)..."
                className="w-full pl-10 pr-24 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Core Apps Grid */}
          <div className="text-left mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center mb-6">
              Explore Popular Stiknex Apps & Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {coreApps.map((app) => {
                const Icon = app.icon;
                return (
                  <Link
                    key={app.title}
                    to={app.href}
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${app.color} text-white flex items-center justify-center mb-3 shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-1.5 mb-1">
                        {app.title}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-600 dark:text-indigo-400" />
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {app.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white text-sm font-semibold transition-all shadow-sm"
            >
              <Home className="w-4 h-4" />
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

