import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seoConfig, BASE_URL } from '../src/utils/seoConfig.js';
import { ALL_TOOLS } from '../src/data/toolsRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const publicDir = path.join(__dirname, '..', 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const baseUrl = BASE_URL || 'https://stiknex.site';

// Helper to get git commit date
function getGitDate(relPath, fallback = '2026-10-28') {
  try {
    const fullPath = path.resolve(__dirname, '..', relPath);
    if (!fs.existsSync(fullPath)) return fallback;
    const stdout = execSync(`git log -1 --format="%as" -- "${relPath}"`, {
      cwd: path.resolve(__dirname, '..'),
      encoding: 'utf8'
    }).trim();
    return stdout || fallback;
  } catch (_) {
    return fallback;
  }
}

// Map core pages to component files
const coreFileMap = {
  '/': 'src/Pages/Landing/LandingPage.jsx',
  '/sticky-notes': 'src/Pages/Home/Home.jsx',
  '/online-notebook': 'src/Pages/Notebook/Notebook.jsx',
  '/whiteboard': 'src/Pages/Whiteboard/Whiteboard.jsx',
  '/about': 'src/Pages/About/About.jsx',
  '/blog': 'src/Pages/Blog/Blog.jsx',
  '/buy-me-a-coffee': 'src/Pages/BuyMeACoffee/BuyMeACoffee.jsx',
  '/typing-lab': 'src/Pages/TypingLab/TypingLab.jsx',
  '/url-shortener': 'src/Pages/Tools/UrlShortener/UrlShortener.jsx',
  '/tools': 'src/Pages/Tools/Tools.jsx',
  '/privacy-policy': 'src/Pages/Legal/PrivacyPolicy.jsx',
  '/terms-of-service': 'src/Pages/Legal/TermsOfService.jsx',
  '/contact': 'src/Pages/Legal/ContactUs.jsx'
};

// Cache engine dates
const engineDateCache = {};
function getEngineDate(category) {
  if (engineDateCache[category]) return engineDateCache[category];
  const catToEngine = {
    'calculators': 'CalculatorsEngine.jsx',
    'measurement': 'MeasurementEngine.jsx',
    'writing': 'WritingEngine.jsx',
    'text-analysis': 'TextAnalysisEngine.jsx',
    'image': 'ImageEngine.jsx',
    'pdf': 'PdfEngine.jsx',
    'developer': 'DeveloperEngine.jsx',
    'encoding': 'EncodingEngine.jsx',
    'security': 'SecurityEngine.jsx',
    'design': 'DesignEngine.jsx',
    'time': 'TimeEngine.jsx',
    'math': 'MathEngine.jsx',
    'finance': 'FinanceEngine.jsx',
    'typing': 'TypingEngine.jsx',
    'productivity': 'ProductivityEngine.jsx',
    'seo': 'SeoEngine.jsx',
    'data': 'DataEngine.jsx',
    'media': 'MediaEngine.jsx',
    'generators': 'GeneratorsEngine.jsx',
    'helpers': 'HelpersEngine.jsx'
  };
  const engineFileName = catToEngine[category];
  const relPath = engineFileName ? `src/Pages/Tools/engines/${engineFileName}` : 'src/data/toolsRegistry.js';
  const date = getGitDate(relPath, '2026-10-30');
  engineDateCache[category] = date;
  return date;
}

// Build map of tools to categories
const toolCategoryMap = {};
ALL_TOOLS.forEach(t => {
  toolCategoryMap[`/${t.slug}`] = t.category;
});

async function run() {
  console.log('Generating production sitemap with genuine lastmod dates...');

  // 1. Fetch blogs from MongoDB if connected
  let blogs = [];
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      const blogSchema = new mongoose.Schema({
        slug: String,
        published: Boolean,
        publishedAt: Date,
        updatedAt: Date,
        validationStatus: String
      }, { collection: 'blogs' });
      const BlogModel = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
      blogs = await BlogModel.find({ published: true, validationStatus: { $ne: 'failed' } })
        .select('slug publishedAt updatedAt')
        .sort({ publishedAt: -1 })
        .lean();
      console.log(`Fetched ${blogs.length} published blog posts from MongoDB.`);
    } catch (err) {
      console.warn('MongoDB connection notice in sitemap generation:', err.message);
    } finally {
      await mongoose.disconnect();
    }
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  let staticCount = 0;
  const routeDates = {};

  for (const [routePath, config] of Object.entries(seoConfig)) {
    // Determine genuine lastmod
    let lastmod = '2026-10-28';
    if (coreFileMap[routePath]) {
      lastmod = getGitDate(coreFileMap[routePath], '2026-10-28');
    } else if (toolCategoryMap[routePath]) {
      lastmod = getEngineDate(toolCategoryMap[routePath]);
    } else {
      lastmod = getGitDate('src/data/toolsRegistry.js', '2026-10-28');
    }

    routeDates[routePath] = lastmod;
    const fullUrl = routePath === '/' ? `${baseUrl}/` : `${baseUrl}${routePath}`;

    xml += `  <url>\n`;
    xml += `    <loc>${fullUrl}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `  </url>\n`;
    staticCount++;
  }

  // 2. Add published blogs
  let blogCount = 0;
  if (blogs && blogs.length > 0) {
    const seen = new Set();
    for (const b of blogs) {
      if (!b.slug || seen.has(b.slug)) continue;
      seen.add(b.slug);
      let blogDate = '2026-10-28';
      const d = b.updatedAt || b.publishedAt;
      if (d) {
        try {
          blogDate = new Date(d).toISOString().split('T')[0];
        } catch (_) {}
      }
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${encodeURIComponent(b.slug)}</loc>\n`;
      xml += `    <lastmod>${blogDate}</lastmod>\n`;
      xml += `  </url>\n`;
      blogCount++;
    }
  }

  xml += `</urlset>`;

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(sitemapPath, xml, 'utf-8');
  console.log(`✅ Successfully generated sitemap.xml at ${sitemapPath}:`);
  console.log(`   - Static & Tool Pages: ${staticCount}`);
  console.log(`   - Published Blog Posts: ${blogCount}`);
  console.log(`   - Total URLs in Sitemap: ${staticCount + blogCount}`);

  // Save route dates map for api/sitemap.xml.js runtime use
  const mapPath = path.join(__dirname, '..', 'api', '_utils', 'routeDates.json');
  fs.writeFileSync(mapPath, JSON.stringify(routeDates, null, 2), 'utf-8');
  console.log(`✅ Saved route lastmod mapping to ${mapPath}`);
}

run();
