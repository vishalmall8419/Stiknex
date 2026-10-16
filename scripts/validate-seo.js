import { seoConfig, BASE_URL } from "../src/utils/seoConfig.js";

console.log("🔍 Running Stiknex Comprehensive SEO & Indexing Validation...\n");

let errors = 0;
let warnings = 0;
const seenTitles = new Set();
const seenDescriptions = new Set();
const seenCanonicals = new Set();

const requiredRoutes = [
  "/",
  "/sticky-notes",
  "/online-notebook",
  "/word-counter",
  "/character-counter",
  "/reading-time-calculator",
  "/simple-calculator",
  "/scientific-calculator",
  "/date-calculator",
  "/currency-converter",
  "/unit-converter",
  "/length-converter",
  "/area-converter",
  "/volume-converter",
  "/weight-converter",
  "/temperature-converter",
  "/speed-converter",
  "/pressure-converter",
  "/power-converter",
  "/qr-code-generator",
  "/password-generator",
  "/color-picker",
  "/tools",
  "/blog",
  "/about",
  "/whiteboard"
];

console.log(`Checking ${requiredRoutes.length} core routes in seoConfig...`);

for (const route of requiredRoutes) {
  const config = seoConfig[route];
  if (!config) {
    console.error(`❌ Missing SEO configuration for required route: ${route}`);
    errors++;
    continue;
  }

  // 1. Title verification
  if (!config.title || config.title.length < 15) {
    console.error(`❌ [${route}] Missing or too short title: "${config.title}"`);
    errors++;
  } else if (seenTitles.has(config.title)) {
    console.warn(`⚠️ [${route}] Duplicate title detected: "${config.title}"`);
    warnings++;
  } else {
    seenTitles.add(config.title);
  }

  // 2. Meta description verification
  if (!config.description || config.description.length < 40) {
    console.error(`❌ [${route}] Missing or too short description: "${config.description}"`);
    errors++;
  } else if (seenDescriptions.has(config.description)) {
    console.warn(`⚠️ [${route}] Duplicate description detected.`);
    warnings++;
  } else {
    seenDescriptions.add(config.description);
  }

  // 3. Canonical verification
  const expectedCanonical = route === "/" ? `${BASE_URL}/` : `${BASE_URL}${route}`;
  if (!config.canonical || config.canonical !== expectedCanonical) {
    console.error(`❌ [${route}] Invalid canonical: expected "${expectedCanonical}", got "${config.canonical}"`);
    errors++;
  } else if (seenCanonicals.has(config.canonical)) {
    console.error(`❌ [${route}] Duplicate canonical detected: "${config.canonical}"`);
    errors++;
  } else {
    seenCanonicals.add(config.canonical);
  }

  // 4. H1 verification
  if (!config.h1) {
    console.error(`❌ [${route}] Missing H1 definition`);
    errors++;
  }

  // 5. Keywords verification
  if (!config.keywords || config.keywords.length < 5) {
    console.error(`❌ [${route}] Missing keywords`);
    errors++;
  }

  // 6. Breadcrumbs
  if (!config.breadcrumbs || config.breadcrumbs.length === 0) {
    console.warn(`⚠️ [${route}] Missing breadcrumbs`);
    warnings++;
  }
}

console.log("\n==========================================");
console.log(`Validation Complete: ${errors} Errors, ${warnings} Warnings`);
console.log("==========================================\n");

if (errors > 0) {
  console.error("❌ SEO Validation Failed!");
  process.exit(1);
} else {
  console.log("✅ All required routes passed SEO validation with 100% compliance!");
  process.exit(0);
}

