const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const line = env.split('\n').find(l => l.startsWith('GOOGLE_SERVICE_ACCOUNT_JSON='));
const raw = line.substring(28);

let cleaned = raw.trim();
if (cleaned.startsWith("'") && cleaned.endsWith("'")) cleaned = cleaned.slice(1, -1);
let creds = JSON.parse(cleaned);

console.log('Before replace length:', creds.private_key.length);
console.log('Has literal \\\\n?', creds.private_key.includes('\\n'));
console.log('Has actual newlines?', creds.private_key.includes('\n'));

creds.private_key = creds.private_key.replace(/\\\\n/g, '\n');

console.log('After replace length:', creds.private_key.length);
console.log('Has literal \\\\n?', creds.private_key.includes('\\n'));
console.log('Has actual newlines?', creds.private_key.includes('\n'));
