const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');
content = content.replace(/import DynamicSEO from '\.\/Component\/DynamicSEO';\n/, '');
content = content.replace(/<DynamicSEO \/>\n/, '');
fs.writeFileSync('src/App.jsx', content);
console.log('Removed DynamicSEO');
