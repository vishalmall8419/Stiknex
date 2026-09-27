const fs = require('fs');
let c = fs.readFileSync('api/serve-html.js', 'utf8');

c = c.replace(
  '<meta name="keywords" content=" + keywordsStr + , " />',
  "'<meta name=\"keywords\" content=\"' + keywordsStr + ', \" />'"
);

c = c.replace(
  '<meta name="description" content=" Live Trends:  + top10 + ." />',
  "'<meta name=\"description\" content=\" Live Trends: ' + top10 + '.\" />'"
);

fs.writeFileSync('api/serve-html.js', c);
console.log('Fixed serve-html.js syntax!');
