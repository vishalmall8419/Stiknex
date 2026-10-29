const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/Pages/Home/Home.jsx');
let content = fs.readFileFile(filePath, 'utf8');

console.log('read ok:', content.length);
