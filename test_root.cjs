
const https = require('https');
https.get('https://stiknex.vercel.app/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const kw = data.match(/<meta[^>]*name=[\"']keywords[\"'][^>]*content=[\"']([\s\S]*?)[\"'][^>]*\/?>/is);
    console.log('STATUS:', res.statusCode);
    console.log('KEYWORDS:', kw ? kw[1].trim() : 'NOT FOUND');
  });
});

