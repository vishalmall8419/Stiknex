const fs = require('fs');
let content = fs.readFileSync('api/analytics.js', 'utf8');

const suppressor = // Suppress Node's url.parse deprecation warning caused by Google Analytics SDK
const originalEmitWarning = process.emitWarning;
process.emitWarning = function(warning, ...args) {
    if (args[0] === 'DeprecationWarning' && warning && warning.includes('url.parse()')) return;
    return originalEmitWarning.call(process, warning, ...args);
};
;

if (!content.includes('originalEmitWarning')) {
    content = suppressor + '\n' + content;
    fs.writeFileSync('api/analytics.js', content, 'utf8');
}
console.log('Added url.parse suppressor');
