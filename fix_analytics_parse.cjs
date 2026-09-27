const fs = require('fs');
let content = fs.readFileSync('api/analytics.js', 'utf8');

content = content.replace(
  'creds = JSON.parse(raw);\n    if (creds.private_key) {\n      creds.private_key = creds.private_key.replace(/\\\\n/g, \'\\n\');\n    }',
  	ry {
      let cleaned = raw.trim();
      if (cleaned.startsWith("'") && cleaned.endsWith("'")) cleaned = cleaned.slice(1, -1);
      creds = JSON.parse(cleaned);
      if (creds.private_key) {
        creds.private_key = creds.private_key.replace(/\\\\n/g, '\\n');
      }
    } catch (e) {
      console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:", e);
      throw new Error("Invalid GOOGLE_SERVICE_ACCOUNT_JSON format in Vercel.");
    }
);

fs.writeFileSync('api/analytics.js', content);
console.log('Fixed analytics parsing');
