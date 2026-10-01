const fs = require('fs');
let content = fs.readFileSync('src/Pages/Landing/HomeBlogSection.jsx', 'utf8');

const regex = /Promise\.all\(\[\s*fetch\("\/data\/blogs\.json"\)\.then\(res => res\.json\(\)\),\s*fetch\("\/data\/blogs-2\.json"\)\.then\(res => res\.json\(\)\)\s*\]\)\.then\(\(\[data1, data2\]\) => \{\s*const combined = \[\.\.\.data1, \.\.\.data2\];/;

const replacement = `fetch("/api/blogs").then(res => res.ok ? res.json() : []).then(dynamicBlogs => {
      const combined = dynamicBlogs.map(b => ({
        id: b.slug,
        title: b.title,
        briefDescription: b.excerpt,
        image: b.imageUrl,
        images: [b.imageUrl],
        date: new Date(b.publishedAt).toLocaleDateString(),
        category: "Trending"
      }));`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/Pages/Landing/HomeBlogSection.jsx', content);
  console.log('Fixed HomeBlogSection');
} else {
  console.log('Regex failed for HomeBlogSection');
}
