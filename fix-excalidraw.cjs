const fs = require('fs');
let content = fs.readFileSync('src/Pages/Whiteboard/Whiteboard.jsx', 'utf8');

const regex = /appState:\s*\(typeof\s*whiteboard\.appState\s*===\s*["']object["']\s*&&\s*whiteboard\.appState\s*!==\s*null\)\s*\?\s*whiteboard\.appState\s*:\s*\{\},/g;
const replacement = "appState: (typeof whiteboard.appState === 'object' && whiteboard.appState !== null) ? { ...whiteboard.appState, collaborators: new Map() } : {},";

content = content.replace(regex, replacement);
fs.writeFileSync('src/Pages/Whiteboard/Whiteboard.jsx', content);
console.log('Fixed Excalidraw crash');
