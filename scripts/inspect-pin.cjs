const https = require('https');

async function check() {
  const res = await fetch('https://www.pinterest.com/pin/955748352150359326/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  const getMatch = (re) => {
    const m = html.match(re);
    return m ? m[1] : null;
  };
  console.log('Title:', getMatch(/<title>([^<]+)<\/title>/));
  console.log('og:title:', getMatch(/property="og:title"\s+content="([^"]+)"/));
  console.log('og:description:', getMatch(/property="og:description"\s+content="([^"]+)"/));
  console.log('og:image:', getMatch(/property="og:image"\s+content="([^"]+)"/));
  
  // Look for video or canonical links
  const videoMatches = [...html.matchAll(/https:\/\/[^"'\s]+\.(?:mp4|m3u8)/g)].map(m => m[0]);
  console.log('Videos found:', videoMatches.slice(0, 5));

  // Look for pin data in script tags
  const jsonLd = getMatch(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLd) {
    try {
      console.log('JSON-LD:', JSON.parse(jsonLd));
    } catch(e) {
      console.log('Raw JSON-LD:', jsonLd.slice(0, 300));
    }
  }
}

check().catch(console.error);
