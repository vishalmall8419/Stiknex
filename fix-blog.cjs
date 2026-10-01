const fs = require('fs');
let content = fs.readFileSync('src/Pages/Blog/Blog.jsx', 'utf8');

const regex = /Promise\.all\(\[\s*fetch\("\/api\/blogs"\)\.then\(res => res\.ok \? res\.json\(\) : \[\]\)\.catch\(\(\) => \[\]\),\s*fetch\("\/data\/blogs\.json"\)\.then\(res => res\.json\(\)\)\.catch\(\(\) => \[\]\),\s*fetch\("\/data\/blogs-2\.json"\)\.then\(res => res\.json\(\)\)\.catch\(\(\) => \[\]\)\s*\]\)\.then\(\(\[dynamicBlogs, data1, data2\]\) => \{[\s\S]*?setBlogsData\(\[\.\.\.formattedDynamic, \.\.\.shuffledStatic\]\);/;

const replacement = `fetch("/api/blogs").then(res => res.ok ? res.json() : []).then(dynamicBlogs => {
        // Format dynamic blogs to match static structure
        const formattedDynamic = dynamicBlogs.map(b => ({
          id: b.slug,
          title: b.title,
          briefDescription: b.excerpt,
          image: b.imageUrl,
          date: new Date(b.publishedAt).toLocaleDateString(),
          category: "Trending",
          readTime: "5 min read",
          isDynamic: true
        }));
        
        setBlogsData(formattedDynamic);`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/Pages/Blog/Blog.jsx', content);
  console.log('Fixed Blog');
} else {
  console.log('Regex failed for Blog');
}
