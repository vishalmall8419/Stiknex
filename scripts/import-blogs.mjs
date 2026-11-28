/**
 * Imports the prepared blog posts (scripts/blogs.import.json) into MongoDB.
 *
 *   node scripts/import-blogs.mjs --dry-run            # validate + show plan, writes nothing
 *   node scripts/import-blogs.mjs --publish-count=5    # publish first 5, save the rest as drafts
 *   node scripts/import-blogs.mjs --update             # also overwrite posts whose slug already exists
 *
 * Posts are validated with the site's own validateBlogArticle(). Failing posts are skipped.
 * Drafts can be published later from the admin panel (publishing everything on one day is not recommended).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n, d) => (args.find(a => a.startsWith(`--${n}=`)) || '').split('=')[1] ?? d;
const DRY = flag('dry-run');
const UPDATE = flag('update');
const PUBLISH_COUNT = Number(opt('publish-count', 5));
const FILE = opt('file', path.join(__dirname, 'blogs.import.json'));

const { default: connectToDatabase } = await import('../api/_utils/db.js');
const { default: Blog } = await import('../api/_models/Blog.js');
const { validateBlogArticle, countArticleWords, extractTableOfContents, extractSources } =
  await import('../api/_utils/blogValidator.js');

const posts = JSON.parse(fs.readFileSync(FILE, 'utf8'));

async function wikiImage(title) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=original|thumbnail&pithumbsize=1200&titles=${encodeURIComponent(title)}&format=json&redirects=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'StiknexBlogImporter/1.0 (https://stiknex.site)' } });
    const json = await res.json();
    const page = Object.values(json?.query?.pages || {})[0];
    return page?.thumbnail?.source || page?.original?.source || null;
  } catch { return null; }
}

if (!DRY) await connectToDatabase();
let created = 0, updated = 0, skipped = 0, failed = 0;

for (let i = 0; i < posts.length; i++) {
  const p = posts[i];
  const v = validateBlogArticle(p);
  if (!v.valid) { failed++; console.log(`FAIL  ${p.slug}\n      ${v.errors.join('\n      ')}`); continue; }

  const publish = i < PUBLISH_COUNT;
  if (DRY) { console.log(`OK    ${p.slug} (${v.wordCount} words) -> ${publish ? 'PUBLISH' : 'draft'}`); continue; }

  const existing = await Blog.findOne({ slug: p.slug });
  if (existing && !UPDATE) { skipped++; console.log(`SKIP  ${p.slug} (already exists)`); continue; }

  let imageUrl = existing?.imageUrl;
  let imageSource = existing?.imageSource;
  if (!imageUrl) {
    imageUrl = await wikiImage(p._wikiTitle);
    imageSource = imageUrl ? 'Wikimedia Commons' : 'Pollinations AI (Flux)';
    if (!imageUrl) imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(p._imageQuery || p.title)}?width=1200&height=630&nologo=true&model=flux`;
  }

  const doc = {
    title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, category: p.category,
    metaTitle: p.metaTitle, metaDescription: p.metaDescription, keywords: p.keywords,
    trendKeyword: p.trendKeyword, trendScore: p.trendScore, sourceResearch: p.sourceResearch,
    imageUrl, imageAlt: p.imageAlt, imageSource,
    wordCount: countArticleWords(p.content),
    tableOfContents: extractTableOfContents(p.content),
    sources: extractSources(p.content),
    validationStatus: 'passed', validationError: '',
    published: publish, updatedAt: new Date(),
    ...(publish && !existing?.published ? { publishedAt: new Date() } : {}),
  };
  if (existing) { await Blog.updateOne({ slug: p.slug }, { $set: doc }); updated++; }
  else { await Blog.create(doc); created++; }
  console.log(`${existing ? 'UPDATE' : 'NEW   '} ${p.slug} -> ${publish ? 'published' : 'draft'}`);
}
console.log(`\nDone. created=${created} updated=${updated} skipped=${skipped} failed=${failed}${DRY ? ' (dry run)' : ''}`);
process.exit(0);
