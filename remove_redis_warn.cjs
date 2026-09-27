const fs = require('fs');
let content = fs.readFileSync('api/_utils/redis.js', 'utf8');
content = content.replace('console.warn("REDIS_URL not found in .env. Using fast in-memory Map fallback for caching.");', '');
fs.writeFileSync('api/_utils/redis.js', content);
console.log('Removed Redis warning');
