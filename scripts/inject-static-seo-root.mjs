import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_TOOLS, TOOL_HUBS } from '../src/data/toolsRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const primaryDomain = 'https://stiknex.site';

// Build categorized tools HTML for crawler indexing
const categorizedToolsHtml = TOOL_HUBS.map(hub => {
  const tools = ALL_TOOLS.filter(t => hub.subcategories.includes(t.category));
  if (!tools.length) return '';
  return `
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 15px; font-weight: 700; color: #134E5E; margin-bottom: 8px; border-bottom: 1px solid #EADFD5; padding-bottom: 4px;">${hub.name} (${tools.length} Utilities)</h3>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 10px;">${hub.description}</p>
          <ul style="display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 8px; list-style: none; padding: 0; margin: 0;">
            ${tools.map(t => `<li><a href="${primaryDomain}/${t.slug}" style="color: #134E5E; text-decoration: none; font-size: 13px; font-weight: 500;">${t.title}</a></li>`).join('')}
          </ul>
        </div>`;
}).join('\n');

const signatureLoaderHtml = `
    <!-- =========================================================
         INITIAL SIGNATURE SVG HANDWRITING LOADER
         Displays immediately, hiding raw SEO content until React hydrates.
    ========================================================== -->
    <div id="initial-signature-loader" style="position: fixed; inset: 0; z-index: 999999; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #FAF7F2; transition: opacity 0.25s ease-out;">
      <style>
        @media (prefers-color-scheme: dark) {
          #initial-signature-loader { background: #0B0F17 !important; }
          #initial-signature-loader .sig-text { color: #94a3b8 !important; }
        }
        .init-sig-stroke {
          stroke-dasharray: 180;
          stroke-dashoffset: 180;
          animation: initSigDraw 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .init-sig-s { animation-delay: 0s; }
        .init-sig-t { animation-delay: 0.15s; }
        .init-sig-t-bar { animation-delay: 0.28s; }
        .init-sig-i { animation-delay: 0.38s; }
        .init-sig-k { animation-delay: 0.5s; }
        .init-sig-n { animation-delay: 0.68s; }
        .init-sig-e { animation-delay: 0.82s; }
        .init-sig-x { animation-delay: 0.96s; }
        .init-sig-flourish {
          stroke-dasharray: 240;
          stroke-dashoffset: 240;
          animation: initSigDraw 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: 1.1s;
        }
        .init-sig-dot {
          animation: initSigDot 1.8s ease-out infinite;
          animation-delay: 0.45s;
          transform-origin: 45px 14px;
        }
        .init-sig-end-dot {
          animation: initSigDot 1.8s ease-out infinite;
          animation-delay: 1.35s;
          transform-origin: 132px 33px;
        }
        @keyframes initSigDraw {
          0% { stroke-dashoffset: 180; opacity: 0.2; }
          15% { opacity: 1; }
          65% { stroke-dashoffset: 0; opacity: 1; }
          88% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes initSigDot {
          0%, 30% { transform: scale(0); opacity: 0; }
          35% { transform: scale(1.3); opacity: 1; }
          45% { transform: scale(1); opacity: 1; }
          88% { opacity: 1; }
          100% { opacity: 0; }
        }
      </style>
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <svg viewBox="0 0 210 56" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 210px; height: auto;">
          <defs>
            <linearGradient id="initSigGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#134E5E" />
              <stop offset="55%" stop-color="#1D6A7D" />
              <stop offset="100%" stop-color="#FFA07A" />
            </linearGradient>
            <linearGradient id="initFlourishGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#134E5E" stop-opacity="0.2" />
              <stop offset="65%" stop-color="#FFA07A" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#FFA07A" stop-opacity="0" />
            </linearGradient>
          </defs>
          <g stroke="url(#initSigGrad)" stroke-linecap="round" stroke-linejoin="round">
            <path d="M 18 34 C 13 36, 6 34, 6 27 C 6 18, 19 15, 23 9 C 26 4, 21 2, 17 3 C 12 4, 9 8, 9 12" stroke-width="3.2" class="init-sig-stroke init-sig-s" />
            <path d="M 17 34 C 23 34, 30 25, 33 16 L 33 34" stroke-width="3" class="init-sig-stroke init-sig-t" />
            <path d="M 27 22 Q 35 21, 41 20" stroke-width="2.6" class="init-sig-stroke init-sig-t-bar" />
            <path d="M 43 23 L 45 34 C 46 35, 48 35, 51 33" stroke-width="3" class="init-sig-stroke init-sig-i" />
            <circle cx="45" cy="14" r="2.2" fill="#FFA07A" class="init-sig-dot" />
            <path d="M 57 11 L 56 34 M 68 22 L 59 28 L 68 35" stroke-width="3" class="init-sig-stroke init-sig-k" />
            <path d="M 76 24 L 75 34 M 76 26 C 79 22, 85 22, 88 26 L 87 34" stroke-width="2.8" class="init-sig-stroke init-sig-n" />
            <path d="M 94 29 C 94 24, 103 23, 103 27 C 103 33, 95 35, 105 34" stroke-width="2.8" class="init-sig-stroke init-sig-e" />
            <path d="M 112 24 L 124 34 M 123 24 L 112 34" stroke-width="3" class="init-sig-stroke init-sig-x" />
          </g>
          <path d="M 14 44 C 45 42, 95 40, 150 37 C 175 35, 195 34, 205 31" stroke="url(#initFlourishGrad)" stroke-width="3" stroke-linecap="round" class="init-sig-flourish" />
          <circle cx="132" cy="33" r="2" fill="#FFA07A" class="init-sig-end-dot" />
        </svg>
        <p class="sig-text" style="margin-top: 14px; font-family: system-ui, -apple-system, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; animation: initSigDot 1.8s ease-in-out infinite;">Loading Stiknex...</p>
      </div>
    </div>`;

const staticSsrHtml = `
${signatureLoaderHtml}
    <div id="root">
      <!-- Semantic High-Performance Pre-Rendered HTML for Crawlers & Instant FCP/LCP -->
      <header style="padding: 16px 24px; border-bottom: 1px solid #EADFD5; background: #FAF7F2; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <a href="${primaryDomain}/" style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
            <img src="/logo.png" alt="Stiknex Logo" width="36" height="36" style="width: 36px; height: 36px; object-contain;" />
            <span style="font-size: 22px; font-weight: 900; color: #134E5E; letter-spacing: -0.02em;">Stiknex</span>
          </a>
          <nav style="display: flex; gap: 20px; font-size: 13px; font-weight: 600;">
            <a href="${primaryDomain}/sticky-notes" style="color: #1E293B; text-decoration: none;">Sticky Notes</a>
            <a href="${primaryDomain}/online-notebook" style="color: #1E293B; text-decoration: none;">Notepad</a>
            <a href="${primaryDomain}/whiteboard" style="color: #1E293B; text-decoration: none;">Whiteboard</a>
            <a href="${primaryDomain}/tools" style="color: #1E293B; text-decoration: none;">200+ Tools</a>
            <a href="${primaryDomain}/blog" style="color: #1E293B; text-decoration: none;">Blog</a>
            <a href="${primaryDomain}/about" style="color: #1E293B; text-decoration: none;">About</a>
          </nav>
        </div>
      </header>

      <main style="max-width: 1100px; margin: 0 auto; padding: 48px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAF7F2; color: #1E293B;">
        <div style="text-align: center; margin-bottom: 40px;">
          <span style="display: inline-block; padding: 6px 16px; border-radius: 9999px; background: rgba(19, 78, 94, 0.1); color: #134E5E; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px;">
            100% Free &amp; Local-First Workspace
          </span>
          <h1 style="font-size: clamp(2.2rem, 4.5vw, 3.6rem); font-weight: 900; color: #0F3944; line-height: 1.15; margin-bottom: 20px; letter-spacing: -0.02em;">
            All-in-one canvas for thinking, writing &amp; 200+ browser tools.
          </h1>
          <p style="font-size: 17px; color: #475569; max-width: 780px; margin: 0 auto 32px; line-height: 1.6;">
            <strong>Stiknex</strong> (founded by software developer <strong>Vishal Mall</strong>) is a fast, 100% free, local-first productivity workspace. Featuring infinite zoomable sticky notes, distraction-free markdown notebook, interactive Excalidraw whiteboard, and 200+ client-side utility calculators, converters, and formatters — private in your browser with zero logins.
          </p>
          <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; margin-bottom: 36px;">
            <a href="${primaryDomain}/sticky-notes" style="padding: 14px 32px; background: #134E5E; color: #ffffff; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(19, 78, 94, 0.25);">Launch Sticky Notes &rarr;</a>
            <a href="${primaryDomain}/online-notebook" style="padding: 14px 28px; background: #ffffff; color: #0F3944; border: 1.5px solid #EADFD5; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 14px;">Open Notepad</a>
            <a href="${primaryDomain}/tools" style="padding: 14px 28px; background: #0F3944; color: #ffffff; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 14px;">Explore 200+ Tools</a>
          </div>
        </div>

        <!-- 200+ Categorized Browser Utilities Directory for Search Engine Crawlers -->
        <section style="margin-top: 48px; border-top: 1px solid #EADFD5; padding-top: 36px;">
          <h2 style="font-size: 22px; font-weight: 800; color: #0F3944; margin-bottom: 16px;">Explore Stiknex 200+ Free Online Tools Directory</h2>
          ${categorizedToolsHtml}
        </section>

        <!-- Brand Entity & Disambiguation Section -->
        <section style="margin-top: 40px; padding: 28px; background: #ffffff; border-radius: 20px; border: 1px solid #EADFD5;">
          <h2 style="font-size: 20px; font-weight: 800; color: #0F3944; margin-bottom: 12px;">About Stiknex &amp; Entity Information</h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.7; margin-bottom: 14px;">
            <strong>What is Stiknex?</strong> Stiknex is an independent, non-commercial productivity and web utility suite created by <strong>Vishal Mall</strong>. The name <em>Stiknex</em> fuses "Sticky Notes" with "Next-generation ideation canvas". It is an independent digital tool platform and has no connection or affiliation with commercial financial entities such as StoneX Group.
          </p>
        </section>

        <!-- Global Site Footer -->
        <footer style="margin-top: 56px; padding-top: 24px; border-top: 1px solid #EADFD5; text-align: center; font-size: 13px; color: #64748b;">
          <p style="margin-bottom: 12px;">&copy; 2026 Stiknex. All rights reserved. Created by Vishal Mall.</p>
          <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
            <a href="${primaryDomain}/" style="color: #64748b; text-decoration: none;">Home</a>
            <a href="${primaryDomain}/about" style="color: #64748b; text-decoration: none;">About Stiknex</a>
            <a href="${primaryDomain}/blog" style="color: #64748b; text-decoration: none;">Blog</a>
            <a href="${primaryDomain}/tools" style="color: #64748b; text-decoration: none;">Tools Directory</a>
            <a href="${primaryDomain}/privacy-policy" style="color: #64748b; text-decoration: none;">Privacy Policy</a>
            <a href="${primaryDomain}/terms-of-service" style="color: #64748b; text-decoration: none;">Terms of Service</a>
            <a href="${primaryDomain}/buy-me-a-coffee" style="color: #64748b; text-decoration: none;">Support Creator</a>
          </div>
        </footer>
      </main>
    </div>`;

// Update index.html in project root
const rootDivRegex = /(?:<!-- Initial Splash Overlay[\s\S]*?-->\s*)?(?:<style id="initial-splash-style">[\s\S]*?<\/style>\s*)?(?:<div id="initial-app-splash"[\s\S]*?<\/div>\s*)?(?:<!-- =========================================================\s*INITIAL SIGNATURE SVG HANDWRITING LOADER[\s\S]*?-->\s*)?(?:<div id="initial-signature-loader"[\s\S]*?<\/div>\s*)?<div id="root">[\s\S]*?<\/div>\s*(?=\s*<script)/;

const indexPath = path.join(rootDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf-8');
  if (rootDivRegex.test(content)) {
    content = content.replace(rootDivRegex, staticSsrHtml.trim());
    fs.writeFileSync(indexPath, content, 'utf-8');
    console.log('✅ Successfully injected static pre-rendered SEO & 206 tool links into index.html');
  } else if (content.includes('<div id="root"></div>')) {
    content = content.replace('<div id="root"></div>', staticSsrHtml.trim());
    fs.writeFileSync(indexPath, content, 'utf-8');
    console.log('✅ Successfully injected static pre-rendered SEO & 206 tool links into index.html');
  }
}

// If dist/index.html already exists, update it as well
const distIndexPath = path.join(rootDir, 'dist', 'index.html');
if (fs.existsSync(distIndexPath)) {
  let distContent = fs.readFileSync(distIndexPath, 'utf-8');
  if (rootDivRegex.test(distContent)) {
    distContent = distContent.replace(rootDivRegex, staticSsrHtml.trim());
    fs.writeFileSync(distIndexPath, distContent, 'utf-8');
    console.log('✅ Successfully injected static pre-rendered SEO & 206 tool links into dist/index.html');
  } else if (distContent.includes('<div id="root"></div>')) {
    distContent = distContent.replace('<div id="root"></div>', staticSsrHtml.trim());
    fs.writeFileSync(distIndexPath, distContent, 'utf-8');
    console.log('✅ Successfully injected static pre-rendered SEO & 206 tool links into dist/index.html');
  }
}
