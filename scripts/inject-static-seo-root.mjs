import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_TOOLS, TOOL_HUBS } from '../src/data/toolsRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const primaryDomain = 'https://stiknex.site';

// Build categorized tools HTML
const categorizedToolsHtml = TOOL_HUBS.map(hub => {
  const tools = ALL_TOOLS.filter(t => hub.subcategories.includes(t.category));
  if (!tools.length) return '';
  return `
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">${hub.name} (${tools.length} Utilities)</h3>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 10px;">${hub.description}</p>
          <ul style="display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 8px; list-style: none; padding: 0; margin: 0;">
            ${tools.map(t => `<li><a href="${primaryDomain}/${t.slug}" style="color: #4f46e5; text-decoration: none; font-size: 13px; font-weight: 500;">${t.title}</a></li>`).join('')}
          </ul>
        </div>`;
}).join('\n');

const staticSsrHtml = `
    <div id="root">
      <!-- Semantic Pre-Rendered HTML for Googlebot, Bingbot & Search Crawlers (Replaced on React hydration) -->
      <header style="padding: 20px 16px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <a href="${primaryDomain}/" style="font-size: 26px; font-weight: 900; color: #4f46e5; text-decoration: none; letter-spacing: -0.02em;">Stiknex</a>
        <p style="margin-top: 6px; color: #64748b; font-size: 14px;">The Freeform Canvas for Thinking, Writing &amp; 200+ Browser Utilities</p>
        <nav style="margin-top: 12px; font-size: 14px; display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
          <a href="${primaryDomain}/" style="color: #4f46e5; font-weight: 700; text-decoration: none;">Home</a>
          <a href="${primaryDomain}/sticky-notes" style="color: #475569; text-decoration: none;">Sticky Notes</a>
          <a href="${primaryDomain}/online-notebook" style="color: #475569; text-decoration: none;">Notepad</a>
          <a href="${primaryDomain}/whiteboard" style="color: #475569; text-decoration: none;">Whiteboard</a>
          <a href="${primaryDomain}/tools" style="color: #475569; text-decoration: none;">Tools Directory</a>
          <a href="${primaryDomain}/blog" style="color: #475569; text-decoration: none;">Blog</a>
          <a href="${primaryDomain}/about" style="color: #475569; text-decoration: none;">About</a>
        </nav>
      </header>

      <main style="max-width: 1100px; margin: 0 auto; padding: 48px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 900; color: #0f172a; line-height: 1.2; margin-bottom: 16px; letter-spacing: -0.02em;">
            Stiknex — Free Online Sticky Notes, Digital Notebook &amp; 200+ Browser Utility Tools
          </h1>
          <p style="font-size: 17px; color: #475569; max-width: 800px; margin: 0 auto 28px; line-height: 1.6;">
            <strong>Stiknex</strong> (pronounced <em>Stick-Nex</em>, founded by software engineer <strong>Vishal Mall</strong>) is a fast, 100% free, local-first productivity workspace. Featuring infinite zoomable sticky notes, distraction-free markdown notebook, interactive Excalidraw whiteboard, and 200+ client-side utility calculators, converters, and formatters — private in your browser with zero logins.
          </p>
          <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 40px;">
            <a href="${primaryDomain}/sticky-notes" style="padding: 12px 28px; background: #4f46e5; color: #ffffff; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 15px;">Launch Sticky Notes &rarr;</a>
            <a href="${primaryDomain}/online-notebook" style="padding: 12px 28px; background: #ffffff; color: #0f172a; border: 1.5px solid #cbd5e1; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 15px;">Open Notepad &rarr;</a>
            <a href="${primaryDomain}/tools" style="padding: 12px 28px; background: #18202f; color: #ffffff; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 15px;">Explore 200+ Tools &rarr;</a>
          </div>
        </div>

        <!-- 200+ Categorized Browser Utilities Directory for Search Engine Crawlers -->
        <section style="margin-top: 48px; border-top: 1px solid #e2e8f0; padding-top: 36px;">
          <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Explore Stiknex 200+ Free Online Tools Directory</h2>
          <p style="font-size: 14px; color: #64748b; margin-bottom: 24px;">All utilities execute 100% client-side in browser memory with zero tracking and zero server uploads.</p>
          ${categorizedToolsHtml}
        </section>

        <!-- Brand Entity & Disambiguation Section (AIO / GEO / Google Search) -->
        <section style="margin-top: 48px; padding: 28px; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
          <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 12px;">About Stiknex &amp; Entity Information</h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.7; margin-bottom: 14px;">
            <strong>What is Stiknex?</strong> Stiknex is an independent, non-commercial productivity and web utility suite created by <strong>Vishal Mall</strong>. The name <em>Stiknex</em> fuses "Sticky Notes" with "Next-generation ideation canvas". It is an independent digital tool platform and has no connection or affiliation with commercial financial entities such as StoneX Group.
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 16px;">
            <div>
              <strong style="font-size: 13px; color: #0f172a; display: block; margin-bottom: 4px;">⚡ Instant Client-Side Engine</strong>
              <span style="font-size: 13px; color: #64748b;">All converters, calculators, and formatters execute in V8 browser memory with 0ms server latency.</span>
            </div>
            <div>
              <strong style="font-size: 13px; color: #0f172a; display: block; margin-bottom: 4px;">🔒 100% Privacy &amp; Local Storage</strong>
              <span style="font-size: 13px; color: #64748b;">No account required. Notes and personal inputs never leave your device without explicit permission.</span>
            </div>
            <div>
              <strong style="font-size: 13px; color: #0f172a; display: block; margin-bottom: 4px;">📱 Offline-Ready PWA</strong>
              <span style="font-size: 13px; color: #64748b;">Installable on iOS, Android, macOS, and Windows with offline caching support.</span>
            </div>
          </div>
        </section>

        <!-- Structured FAQs for Search Engine Rich Snippets -->
        <section style="margin-top: 48px; border-top: 1px solid #e2e8f0; padding-top: 36px;">
          <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 20px;">Frequently Asked Questions (FAQ)</h2>
          
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Q: Are all 200+ tools on Stiknex really free?</h3>
            <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0;">Yes. Every calculator, unit converter, developer utility, and text tool on Stiknex is 100% free with no hidden fees, subscriptions, or login requirements.</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Q: How does Stiknex keep my notes and data private?</h3>
            <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0;">Stiknex uses browser-local IndexedDB and localStorage APIs. Your notes, drawings, and calculations reside exclusively on your local device unless you explicitly use cloud backup.</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Q: Who created Stiknex?</h3>
            <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0;">Stiknex was engineered and founded by Vishal Mall as a lightweight, ad-light alternative to bloated, slow online tool websites.</p>
          </div>
        </section>

        <!-- Global Site Footer -->
        <footer style="margin-top: 56px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 13px; color: #64748b;">
          <p style="margin-bottom: 12px;">&copy; ${new Date().getFullYear()} Stiknex. All rights reserved. Created by Vishal Mall.</p>
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
const rootDivRegex = /<div id="root">[\s\S]*?<\/div>\s*(?=\s*<script)/;

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
