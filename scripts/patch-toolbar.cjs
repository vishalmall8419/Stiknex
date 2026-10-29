const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/Pages/Home/Home.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const OLD = `            {/* Single compact bar — always visible */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800/60">
              {/* Sync status dot */}
              <button type="button" onClick={() => setSyncModalOpen(true)} title="Cloud sync" aria-label="Open device sync" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-indigo-600 dark:hover:bg-slate-700">
                <i className={\`fa-solid \${syncStatus === "synced" ? "fa-cloud-check text-emerald-500" : syncStatus === "error" ? "fa-triangle-exclamation text-amber-500" : "fa-hard-drive text-indigo-500"} text-xs\`}></i>
              </button>

              {/* "More" label — shown when sidebar is expanded or mobile drawer is open */}
              <span className={\`flex-1 truncate text-[10px] font-semibold text-slate-400 transition-[max-width,opacity] duration-200 \${sidebarExpanded || mobileSidebarOpen ? "max-w-[7rem] opacity-100" : "max-w-0 opacity-0 overflow-hidden"}\`}>
                {syncLabel}
              </span>

              {/* Drop-up toggle */}
              <button
                type="button"
                onClick={() => setWorkspaceOpen((v) => !v)}
                onFocus={() => setWorkspaceOpen(true)}
                title="More options"
                aria-label="More options"
                aria-expanded={workspaceOpen}
                className={\`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-indigo-600 dark:hover:bg-slate-700 \${workspaceOpen ? "bg-white text-indigo-600 dark:bg-slate-700" : ""}\`}
              >
                <i className={\`fa-solid fa-chevron-\${workspaceOpen ? "down" : "up"} text-xs\`}></i>
              </button>
            </div>`;

const NEW = `            {/* Single compact bar — always visible */}
            <button
              type="button"
              onClick={() => setWorkspaceOpen((v) => !v)}
              title="Settings & More"
              aria-label="Settings & More"
              aria-expanded={workspaceOpen}
              className={\`flex h-8 w-full items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition
                \${workspaceOpen
                  ? "border-indigo-300 bg-indigo-50 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-indigo-500/10"
                }\`}
            >
              <i className="fa-solid fa-sliders w-3.5 shrink-0 text-center text-[11px]"></i>
              <span className="flex-1 text-left">Settings &amp; More</span>
              <i className={\`fa-solid fa-chevron-\${workspaceOpen ? "down" : "up"} text-[10px]\`}></i>
            </button>`;

if (!content.includes(OLD)) {
  console.error('❌ OLD block not found — check exact whitespace/quotes');
  process.exit(1);
}

content = content.replace(OLD, NEW);
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Compact bar updated with "Settings & More" text.');
