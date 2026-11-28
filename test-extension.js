// Test script to verify Stiknex Chrome Extension files
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const extensionDir = path.join(__dirname, 'extension');

console.log('--- AUDITING STIKNEX CHROME EXTENSION ---');

// 1. Verify manifest.json
const manifestPath = path.join(extensionDir, 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('FAIL: manifest.json missing!');
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
console.log('✓ manifest.json is valid JSON');
console.log(`  Name: ${manifest.name}`);
console.log(`  Version: ${manifest.version}`);
console.log(`  Manifest Version: ${manifest.manifest_version}`);

if (manifest.manifest_version !== 3) {
  console.error('FAIL: manifest_version must be 3');
  process.exit(1);
}

// 2. Verify all icon files exist and are readable
console.log('\nChecking Icon assets:');
for (const [size, iconRelPath] of Object.entries(manifest.icons)) {
  const iconFullPath = path.join(extensionDir, iconRelPath);
  if (!fs.existsSync(iconFullPath)) {
    console.error(`FAIL: Icon ${size}px missing at ${iconRelPath}`);
    process.exit(1);
  }
  const stats = fs.statSync(iconFullPath);
  console.log(`✓ Icon ${size}x${size} exists (${stats.size} bytes): ${iconRelPath}`);
}

// 3. Verify Background Service Worker
const bgPath = path.join(extensionDir, manifest.background.service_worker);
if (!fs.existsSync(bgPath)) {
  console.error('FAIL: background service worker file missing!');
  process.exit(1);
}
console.log(`✓ Background service worker exists: ${manifest.background.service_worker}`);

// 4. Verify Popup HTML, CSS, JS
const popupHtml = path.join(extensionDir, manifest.action.default_popup);
if (!fs.existsSync(popupHtml)) {
  console.error('FAIL: popup HTML missing!');
  process.exit(1);
}
console.log(`✓ Popup HTML exists: ${manifest.action.default_popup}`);

// 5. Verify Sidepanel
const sidepanelHtml = path.join(extensionDir, manifest.side_panel.default_path);
if (!fs.existsSync(sidepanelHtml)) {
  console.error('FAIL: Side panel HTML missing!');
  process.exit(1);
}
console.log(`✓ Side panel HTML exists: ${manifest.side_panel.default_path}`);

// 6. Test Math Parser with test cases
console.log('\nTesting safe zero-eval mathParser.js:');
import { evaluateExpression } from './extension/utils/mathParser.js';

const testCases = [
  { expr: '2 + 2', expected: 4 },
  { expr: '10 - 3 * 2', expected: 4 },
  { expr: '(10 - 3) * 2', expected: 14 },
  { expr: '2^3 + 1', expected: 9 },
  { expr: '2**3 + 1', expected: 9 },
  { expr: '5!', expected: 120 },
  { expr: 'sqrt(16)', expected: 4 },
  { expr: 'sin(90)', expected: 1 },
  { expr: 'sin(pi / 2)', isRadian: true, expected: 1 },
  { expr: 'cos(0)', expected: 1 },
  { expr: 'ln(e)', expected: 1 },
  { expr: 'log(100)', expected: 2 },
  { expr: 'abs(-42)', expected: 42 },
  { expr: '15 % 4', expected: 3 },
  { expr: '50%', expected: 0.5 },
  { expr: '200 * 10%', expected: 20 },
  { expr: '2.5 * 4', expected: 10 }
];

let mathSuccess = true;
for (const tc of testCases) {
  try {
    const res = evaluateExpression(tc.expr, !!tc.isRadian);
    const diff = Math.abs(res - tc.expected);
    if (diff > 1e-6) {
      console.error(`FAIL: ${tc.expr} => got ${res}, expected ${tc.expected}`);
      mathSuccess = false;
    } else {
      console.log(`✓ mathParser: "${tc.expr}" = ${res}`);
    }
  } catch (err) {
    console.error(`ERROR evaluating ${tc.expr}:`, err.message);
    mathSuccess = false;
  }
}

if (!mathSuccess) {
  console.error('FAIL: Math parser tests failed!');
  process.exit(1);
}

// 7. Verify unit data
console.log('\nTesting unitData.js categories:');
import { UNIT_CATEGORIES } from './extension/utils/unitData.js';
console.log(`✓ Available Unit Categories: ${Object.keys(UNIT_CATEGORIES).join(', ')}`);
for (const [catName, catData] of Object.entries(UNIT_CATEGORIES)) {
  const unitsCount = Object.keys(catData.units).length;
  console.log(`  - ${catData.label}: ${unitsCount} units`);
}

// 8. Verify QR Code bundle
const qrBundlePath = path.join(extensionDir, 'utils', 'qrcode.bundle.js');
if (!fs.existsSync(qrBundlePath)) {
  console.error('FAIL: qrcode.bundle.js missing!');
  process.exit(1);
}
console.log(`✓ Standalone offline QR code bundle exists (${fs.statSync(qrBundlePath).size} bytes)`);

// 9. Verify zero eval or Function constructor in all extension JS files
console.log('\nChecking CSP compliance (zero eval/Function in extension JS):');
function checkDirForEval(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDirForEval(full);
    } else if (entry.name.endsWith('.js')) {
      const code = fs.readFileSync(full, 'utf8');
      // Look for eval( or new Function(
      const hasEval = /\beval\s*\(/.test(code);
      const hasNewFunction = /new\s+Function\s*\(/.test(code);
      if (hasEval || hasNewFunction) {
        console.error(`FAIL: Potential CSP violation in ${path.relative(__dirname, full)}: eval=${hasEval}, new Function=${hasNewFunction}`);
        process.exit(1);
      } else {
        console.log(`✓ CSP safe (no eval / new Function): ${path.relative(__dirname, full)}`);
      }
    }
  }
}
checkDirForEval(extensionDir);

console.log('\n=========================================');
console.log('ALL EXTENSION CHECKS & TESTS PASSED 100%!');
console.log('=========================================');
