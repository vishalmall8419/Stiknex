const fs = require('fs');
let content = fs.readFileSync('api/analytics.js', 'utf8');

// Replace the parsing to fix \n issues
content = content.replace(
  'creds = JSON.parse(raw);',
  creds = JSON.parse(raw);
    if (creds.private_key) {
      creds.private_key = creds.private_key.replace(/\\\\n/g, '\\n');
    }
);

fs.writeFileSync('api/analytics.js', content);
console.log('Fixed analytics.js private_key parsing');
