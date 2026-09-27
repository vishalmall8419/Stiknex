const fs = require('fs');
let content = fs.readFileSync('api/fetch-trends.js', 'utf8');

// Change the logic: Instead of requiring score >= 40 for relevant, 
// make it automatically relevant if traffic is high, otherwise keep original logic.
content = content.replace(
  /let status = 'pending';\s*if \(relevanceScore >= 40\) status = 'relevant';/g,
  let status = 'pending';
    if (relevanceScore >= 40) {
        status = 'relevant';
    } else if (trafficStr && trafficStr.includes('K')) {
        // If traffic is more than 50K+, mark it relevant automatically
        let num = parseInt(trafficStr.replace(/[^0-9]/g, ''));
        if (num >= 50) status = 'relevant';
    } else if (trafficStr && trafficStr.includes('M')) {
        status = 'relevant'; // Millions is always relevant
    }
);

// We need to fix the condition because it might just say '20000+'
content = content.replace(
  /let num = parseInt\(trafficStr.replace\(\/\[\^0-9\]\/g, ''\)\);/g,
  let num = parseInt(trafficStr.replace(/[^0-9]/g, ''));
        if (trafficStr.includes('+') && !trafficStr.includes('K') && !trafficStr.includes('M')) {
            // raw numbers like 20000+
            if (num >= 20000) status = 'relevant';
        }
);

fs.writeFileSync('api/fetch-trends.js', content);
console.log('Fixed fetch-trends.js');
