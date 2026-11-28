import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seoConfig, BASE_URL } from '../src/utils/seoConfig.js';
import { ALL_TOOLS } from '../src/data/toolsRegistry.js';
import { getAllowedStaticRoutes, buildSitemapXml, SITE_URL } from '../api/_utils/sitemapRules.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load .env
dotenv.config({ path: path.join(rootDir, '.env') });
dotenv.config({ path: path.join(rootDir, '.env.local') });

const publicDir = path.join(rootDir, 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const baseUrl = BASE_URL || SITE_URL;

// Check if repo is shallow (cannot trust git log -1 dates in shallow clones)
function isShallowRepo() {
  try {
    const out = execSync('git rev-parse --is-shallow-repository', {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    return out === 'true';
  } catch (_) {
    return true;
  }
}

// Helper to get genuine git commit date; returns null if unavailable (never a hard-coded fallback)
function getGitDate(relPath) {
  try {
    const fullPath = path.resolve(rootDir, relPath);
    if (!fs.existsSync(fullPath)) return null;
    const stdout = execSync(`git log -1 --format="%as" -- "${relPath}"`, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(stdout) ? stdout : null;
  } catch (_) {
    return null;
  }
}

// Map core pages to component files
const coreFileMap = {
  '/': 'src/Pages/Landing/LandingPage.jsx',
  '/sticky-notes': 'src/Pages/Home/Home.jsx',
  '/online-notebook': 'src/Pages/Notebook/Notebook.jsx',
  '/online-notepad': 'src/Pages/Notebook/Notebook.jsx',
  '/whiteboard': 'src/Pages/Whiteboard/Whiteboard.jsx',
  '/about': 'src/Pages/About/About.jsx',
  '/blog': 'src/Pages/Blog/Blog.jsx',
  '/buy-me-a-coffee': 'src/Pages/BuyMeACoffee/BuyMeACoffee.jsx',
  '/stiknex-typing': 'src/Pages/Tools/engines/TypingEngine.jsx',
  '/url-shortener': 'src/Pages/Tools/UrlShortener/UrlShortener.jsx',
  '/tools': 'src/Pages/Tools/Tools.jsx',
  '/privacy-policy': 'src/Pages/Legal/PrivacyPolicy.jsx',
  '/terms-of-service': 'src/Pages/Legal/TermsOfService.jsx',
  '/contact': 'src/Pages/Legal/ContactUs.jsx',
  '/sitemap': 'src/Pages/Sitemap/Sitemap.jsx'
};

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

const engineDateCache = {};
function getEngineDate(category) {
  if (category in engineDateCache) return engineDateCache[category];
  const engineFileName = catToEngine[category];
  const relPath = engineFileName ? `src/Pages/Tools/engines/${engineFileName}` : 'src/data/toolsRegistry.js';
  const date = getGitDate(relPath);
  engineDateCache[category] = date;
  return date;
}

const toolCategoryMap = {};
ALL_TOOLS.forEach(t => {
  toolCategoryMap[`/${t.slug}`] = t.category;
});

// Maximum number of static URLs allowed to share the same lastmod date
const MAX_SHARED_DATE_COUNT = 5;

async function run() {
  console.log('Generating production sitemap using shared sitemapRules...');

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

  // 2. Filter static routes via shared rules
  const staticRoutes = getAllowedStaticRoutes(seoConfig, baseUrl);

  // 3. Resolve genuine git lastmod dates (omit if shallow clone or shared across many URLs)
  const rawDates = {};
  const shallow = isShallowRepo();
  if (!shallow) {
    for (const { routePath } of staticRoutes) {
      let lastmod = null;
      if (coreFileMap[routePath]) {
        lastmod = getGitDate(coreFileMap[routePath]);
      } else if (toolCategoryMap[routePath]) {
        lastmod = getEngineDate(toolCategoryMap[routePath]);
      }
      if (lastmod) {
        rawDates[routePath] = lastmod;
      }
    }
  }

  // Enforce: no more than a few URLs may share the same date
  const dateCounts = {};
  for (const d of Object.values(rawDates)) {
    dateCounts[d] = (dateCounts[d] || 0) + 1;
  }

  const routeDates = {};
  for (const [routePath, d] of Object.entries(rawDates)) {
    if (dateCounts[d] <= MAX_SHARED_DATE_COUNT) {
      routeDates[routePath] = d;
    }
  }

  const xml = buildSitemapXml({ staticRoutes, routeDates, blogs, baseUrl });

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(sitemapPath, xml, 'utf-8');
  console.log(`✅ Successfully generated sitemap.xml at ${sitemapPath}:`);
  console.log(`   - Static & Tool Pages: ${staticRoutes.length}`);
  console.log(`   - Published Blog Posts: ${blogs.length}`);
  console.log(`   - Total URLs in Sitemap: ${staticRoutes.length + blogs.length}`);

  // Save route dates map for api/sitemap.xml.js runtime use
  const mapPath = path.join(rootDir, 'api', '_utils', 'routeDates.json');
  fs.writeFileSync(mapPath, JSON.stringify(routeDates, null, 2), 'utf-8');
  console.log(`✅ Saved route lastmod mapping to ${mapPath}`);
}

run();
