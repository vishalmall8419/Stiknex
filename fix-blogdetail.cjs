const fs = require('fs');
let content = fs.readFileSync('src/Pages/Blog/BlogDetail.jsx', 'utf8');

const regex = /Promise\.all\(\[\s*fetch\("\/data\/blogs\.json"\)\.then\(res => res\.json\(\)\),\s*fetch\("\/data\/blogs-2\.json"\)\.then\(res => res\.json\(\)\)\s*\]\)\.then\(\(\[data1, data2\]\) => \{\s*const combined = \[\.\.\.data1, \.\.\.data2\];\s*const found = combined\.find\(b => b\.id\.toString\(\) === id\);\s*setPost\(found\);\s*setLoading\(false\);\s*\}\)\.catch\(err => \{\s*console\.error\("Error loading blog details:", err\);\s*setLoading\(false\);\s*\}\);/;

const replacement = `fetch("/api/blogs?slug=" + id)
      .then(res => res.ok ? res.json() : null)
      .then(found => {
        if(found) {
          // Format it to match expected UI structure
          setPost({
            id: found.slug,
            title: found.title,
            briefDescription: found.excerpt,
            fullContent: found.content,
            image: found.imageUrl,
            date: new Date(found.publishedAt).toLocaleDateString(),
            category: "Trending"
          });
        } else {
          setPost(null);
        }
        setLoading(false);
      }).catch(err => {
        console.error("Error loading blog details:", err);
        setLoading(false);
      });`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/Pages/Blog/BlogDetail.jsx', content);
  console.log('Fixed BlogDetail');
} else {
  console.log('Regex failed for BlogDetail');
}
