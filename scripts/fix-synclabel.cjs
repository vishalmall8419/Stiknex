const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/Pages/Home/Home.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix: syncLabel is already a resolved string, not an object
content = content.replace(/syncLabel\[syncStatus\] \?\? syncLabel\.local/g, 'syncLabel');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ syncLabel references fixed.');
