/**
 * Read-only audit script: lists all published blogs and flags off-topic posts
 * whose title/category is not about notes, productivity, typing, writing,
 * calculators/converters, or related digital workspace tools.
 */
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectToDatabase from '../api/_utils/db.js';
import Blog from '../api/_models/Blog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const ON_TOPIC_RE = /\b(note|notes|notebook|notepad|sticky|whiteboard|productiv|typing|wpm|keyboard|writ(e|ing)|word\s*count|character\s*count|calculat|convert|converter|unit|math|percent|age|emi|sip|pomodoro|timer|to-?do|task|planner|habit|journal|markdown|json|regex|qr|password|hash|base64|pdf|seo|html|css|developer|workspace|study|focus|second\s*brain|cognitive\s*load|time\s*block|minimalist|drawing\s*app|ai\s*tools)\b/i;

function isOffTopic(blog) {
  const haystack = `${blog.title || ''} ${blog.category || ''} ${blog.slug || ''}`;
  return !ON_TOPIC_RE.test(haystack);
}

async function main() {
  await connectToDatabase();
  const blogs = await Blog.find({ published: true })
    .select('slug title category')
    .sort({ publishedAt: -1 })
    .lean();

  console.log('| slug | title | category | off-topic |');
  console.log('|---|---|---|---|');
  for (const b of blogs) {
    const cleanTitle = String(b.title || '').replace(/\|/g, '\\|');
    const cleanCat = String(b.category || '').replace(/\|/g, '\\|');
    console.log(`| ${b.slug} | ${cleanTitle} | ${cleanCat} | ${isOffTopic(b) ? 'YES' : 'NO'} |`);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to list blogs:', err.message);
  process.exit(1);
});
