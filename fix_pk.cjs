const fs = require('fs');
let content = fs.readFileSync('api/analytics.js', 'utf8');

const replacement =         if (creds.private_key) {
            creds.private_key = creds.private_key.replace(/\\\\n/g, '\\n');
            const match = creds.private_key.match(/-----BEGIN PRIVATE KEY-----\\\\s*(.*?)\\\\s*-----END PRIVATE KEY-----/s);
            if (match) {
                const base64 = match[1].replace(/\\\\s+/g, '');
                creds.private_key = '-----BEGIN PRIVATE KEY-----\\n' + base64 + '\\n-----END PRIVATE KEY-----\\n';
            }
        };

content = content.replace(/        if \(creds\.private_key\) \{[\s\S]*?\}/, replacement);
fs.writeFileSync('api/analytics.js', content);
console.log('Fixed private key parser');
