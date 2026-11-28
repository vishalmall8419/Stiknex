import { seoConfig, BASE_URL } from "../src/utils/seoConfig.js";
import { TOOL_SLUGS } from "../src/data/toolSlugs.js";
import { ALL_TOOLS } from "../src/data/toolsRegistry.js";

console.log("🔍 Running Stiknex Comprehensive SEO & Indexing Validation...\n");

if (BASE_URL !== "https://stiknex.site") {
  console.error(`❌ Critical Error: BASE_URL must be "https://stiknex.site", got "${BASE_URL}"`);
  process.exit(1);
}

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
  "/whiteboard",
  "/buy-me-a-coffee"
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
  // /online-notepad is a duplicate view of /online-notebook and intentionally canonicalizes to it.
  const CANONICAL_EXCEPTIONS = { "/online-notepad": `${BASE_URL}/online-notebook` };
  const expectedCanonical = CANONICAL_EXCEPTIONS[route] || (route === "/" ? `${BASE_URL}/` : `${BASE_URL}${route}`);
  if (CANONICAL_EXCEPTIONS[route] && config.canonical === expectedCanonical) {
    // intentional canonical to another route: skip duplicate-canonical check
  } else if (!config.canonical || config.canonical !== expectedCanonical) {
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

// 7. TOOL_SLUGS <-> ALL_TOOLS <-> seoConfig parity check
const registrySlugs = new Set(ALL_TOOLS.map((t) => t.slug));
const inRegistryNotToolSlugs = [...registrySlugs].filter((s) => !TOOL_SLUGS.has(s));
const inToolSlugsNotRegistry = [...TOOL_SLUGS].filter((s) => !registrySlugs.has(s));
const inToolSlugsNotSeo = [...TOOL_SLUGS].filter((s) => !seoConfig[`/${s}`]);
const inRegistryNotSeo = [...registrySlugs].filter((s) => !seoConfig[`/${s}`]);

if (inRegistryNotToolSlugs.length > 0) {
  console.error(`❌ Slugs in toolsRegistry.js missing from toolSlugs.js: ${inRegistryNotToolSlugs.join(", ")}`);
  errors += inRegistryNotToolSlugs.length;
}
if (inToolSlugsNotRegistry.length > 0) {
  console.error(`❌ Slugs in toolSlugs.js missing from toolsRegistry.js: ${inToolSlugsNotRegistry.join(", ")}`);
  errors += inToolSlugsNotRegistry.length;
}
if (inToolSlugsNotSeo.length > 0) {
  console.error(`❌ Slugs in toolSlugs.js missing from seoConfig.js: ${inToolSlugsNotSeo.join(", ")}`);
  errors += inToolSlugsNotSeo.length;
}
if (inRegistryNotSeo.length > 0) {
  console.error(`❌ Slugs in toolsRegistry.js missing from seoConfig.js: ${inRegistryNotSeo.join(", ")}`);
  errors += inRegistryNotSeo.length;
}
console.log(`Checked TOOL_SLUGS (${TOOL_SLUGS.size}) <-> ALL_TOOLS (${registrySlugs.size}) <-> seoConfig (${Object.keys(seoConfig).length}) parity.`);

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

