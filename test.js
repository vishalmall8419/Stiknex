const fs = require("fs");
let content = fs.readFileSync("api/analytics.js", "utf8");
const replacement = `        if (creds.private_key) {
            creds.private_key = creds.private_key.replace(/\\\\n/g, "\\n");
            const match = creds.private_key.match(/-----BEGIN PRIVATE KEY-----\\s*([\\s\\S]*?)\\s*-----END PRIVATE KEY-----/);
            if (match) {
                const base64 = match[1].replace(/\\s+/g, "");
                let formatted = "";
                for (let i = 0; i < base64.length; i += 64) {
                    formatted += base64.slice(i, i + 64) + "\\n";
                }
                creds.private_key = "-----BEGIN PRIVATE KEY-----\\n" + formatted + "-----END PRIVATE KEY-----\\n";
            }
        }`;
content = content.replace(/        if \\(creds\\.private_key\\) \\{[\\s\\S]*?\\}/, replacement);
fs.writeFileSync("api/analytics.js", content);
console.log("Fixed PK");
