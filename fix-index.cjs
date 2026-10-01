const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
// Use a regex to match the huge keywords meta tag
html = html.replace(/<meta\s+name=["']keywords["']\s+content=["'][\s\S]*?["']\s*\/>/, '');
fs.writeFileSync('index.html', html);
console.log('Removed hardcoded keywords from index.html');
