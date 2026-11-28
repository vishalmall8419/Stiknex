/**
 * Test Suite: Persistent Last Visited Page Restoration
 * Tests all 12 scenarios specified in the requirements
 */

const assert = require('assert');

// Mock localStorage and window environment
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

// Setup global mock environment
const mockStorage = new MockLocalStorage();
global.localStorage = mockStorage;
global.window = {
  location: {
    pathname: '/',
    search: '',
    hash: ''
  },
  history: {
    replaceState(state, title, url) {
      const parsed = new URL(url, 'https://stiknex.site');
      global.window.location.pathname = parsed.pathname;
      global.window.location.search = parsed.search;
      global.window.location.hash = parsed.hash;
      this.lastReplacedUrl = url;
    },
    lastReplacedUrl: null
  }
};

// Import module under test
const {
  STORAGE_KEY,
  isValidRestorableRoute,
  normalizeRoutePath,
  getLastVisitedRoute,
  saveLastVisitedRoute,
  resolveStartupRestoration,
  clearLastVisitedRoute
} = require('../src/utils/routeRestoration');

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    mockStorage.clear();
    global.window.location.pathname = '/';
    global.window.location.search = '';
    global.window.location.hash = '';
    global.window.history.lastReplacedUrl = null;

    fn();
    console.log(`✅ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}`);
    console.error(`   Error: ${err.message}`);
  }
}

console.log('========================================================');
console.log('Stiknex Route Restoration Test Suite');
console.log('========================================================\n');

// 1. First-time user
test('Scenario 1: First-time user with empty localStorage boots on /', () => {
  const restored = resolveStartupRestoration();
  assert.strictEqual(restored, null, 'Should return null for first-time user');
  assert.strictEqual(global.window.location.pathname, '/', 'Should remain on /');
});

// 2. User last visited Online Notebook
test('Scenario 2: User last visited /online-notebook -> restores /online-notebook', () => {
  saveLastVisitedRoute({ pathname: '/online-notebook', search: '', hash: '' });
  
  const saved = getLastVisitedRoute();
  assert.ok(saved, 'Saved route should exist');
  assert.strictEqual(saved.pathname, '/online-notebook');

  const restored = resolveStartupRestoration();
  assert.strictEqual(restored, '/online-notebook');
  assert.strictEqual(global.window.location.pathname, '/online-notebook');
});

// 3. User last visited Word Counter
test('Scenario 3: User last visited /word-counter -> restores /word-counter', () => {
  saveLastVisitedRoute({ pathname: '/word-counter', search: '', hash: '' });

  const restored = resolveStartupRestoration();
  assert.strictEqual(restored, '/word-counter');
  assert.strictEqual(global.window.location.pathname, '/word-counter');
});

// 4. User last visited Sticky Notes
test('Scenario 4: User last visited /sticky-notes -> restores /sticky-notes', () => {
  saveLastVisitedRoute({ pathname: '/sticky-notes', search: '', hash: '' });

  const restored = resolveStartupRestoration();
  assert.strictEqual(restored, '/sticky-notes');
  assert.strictEqual(global.window.location.pathname, '/sticky-notes');
});

// 5. Query parameters preservation
test('Scenario 5: Preserves query parameters across sessions', () => {
  saveLastVisitedRoute({ pathname: '/percentage-calculator', search: '?mode=difference&val1=50&val2=100', hash: '' });

  const restored = resolveStartupRestoration();
  assert.strictEqual(restored, '/percentage-calculator?mode=difference&val1=50&val2=100');
  assert.strictEqual(global.window.location.pathname, '/percentage-calculator');
  assert.strictEqual(global.window.location.search, '?mode=difference&val1=50&val2=100');
});

// 6. Hash fragment preservation
test('Scenario 6: Preserves hash fragment across sessions', () => {
  saveLastVisitedRoute({ pathname: '/online-notebook', search: '?folder=work', hash: '#note-123' });

  const restored = resolveStartupRestoration();
  assert.strictEqual(restored, '/online-notebook?folder=work#note-123');
  assert.strictEqual(global.window.location.hash, '#note-123');
});

// 7. Refreshing a page preserves current route
test('Scenario 7: Browser refresh on /whiteboard preserves /whiteboard, does NOT restore old route', () => {
  // Previously saved route was /online-notebook
  saveLastVisitedRoute({ pathname: '/online-notebook', search: '', hash: '' });

  // Browser refresh means window.location.pathname is currently /whiteboard
  global.window.location.pathname = '/whiteboard';

  const restored = resolveStartupRestoration();
  assert.strictEqual(restored, null, 'Should not redirect away when refreshing non-root page');
  assert.strictEqual(global.window.location.pathname, '/whiteboard', 'Should stay on /whiteboard');
});

// 8. Deep link / direct URL navigation
test('Scenario 8: Deep link /privacy-policy is not overridden by previous route', () => {
  // Previous route was /sticky-notes
  saveLastVisitedRoute({ pathname: '/sticky-notes', search: '', hash: '' });

  // Direct URL navigation to /privacy-policy
  global.window.location.pathname = '/privacy-policy';

  const restored = resolveStartupRestoration();
  assert.strictEqual(restored, null, 'Should not override direct deep link');
  assert.strictEqual(global.window.location.pathname, '/privacy-policy');
});

// 9. Invalid or corrupt saved route safe fallback
test('Scenario 9: Corrupt or invalid route in localStorage safely falls back to /', () => {
  // Corrupt string
  mockStorage.setItem(STORAGE_KEY, '{"pathname": "/non-existent-broken-route-404-xyz"}');

  const saved = getLastVisitedRoute();
  assert.strictEqual(saved, null, 'Invalid route must be discarded');

  const restored = resolveStartupRestoration();
  assert.strictEqual(restored, null, 'Corrupt route should not trigger restoration');
  assert.strictEqual(global.window.location.pathname, '/');
});

// 10. Excluded / Admin route protection
test('Scenario 10: Admin/login/auth routes are NEVER stored or restored', () => {
  saveLastVisitedRoute({ pathname: '/stiknex-secure-login-portal' });
  assert.strictEqual(mockStorage.getItem(STORAGE_KEY), null, 'Admin login route must not be saved');

  saveLastVisitedRoute({ pathname: '/dashboard/analytics' });
  assert.strictEqual(mockStorage.getItem(STORAGE_KEY), null, 'Dashboard route must not be saved');

  saveLastVisitedRoute({ pathname: '/setup-2fa-admin' });
  assert.strictEqual(mockStorage.getItem(STORAGE_KEY), null, '2FA setup route must not be saved');
});

// 11. Overwrite protection on cold start
test('Scenario 11: Cold start mount on / does NOT overwrite valid saved route', () => {
  // User had previously visited /online-notebook
  saveLastVisitedRoute({ pathname: '/online-notebook' });

  // On cold start, initial mount sees '/'
  saveLastVisitedRoute({ pathname: '/' }, true); // isInitialMount = true

  const saved = getLastVisitedRoute();
  assert.strictEqual(saved.pathname, '/online-notebook', 'Initial mount must not overwrite saved route');
});

// 12. User intentional navigation to /
test('Scenario 12: User intentional navigation to / updates route properly', () => {
  saveLastVisitedRoute({ pathname: '/online-notebook' });

  // User subsequently navigates to '/' inside the app (isInitialMount = false)
  saveLastVisitedRoute({ pathname: '/' }, false);

  const saved = getLastVisitedRoute();
  assert.strictEqual(saved.pathname, '/', 'Subsequent user navigation to / must be saved');
});

// 13. Dynamic blog article restoration
test('Scenario 13: Dynamic published blog /blog/my-guide is valid and restored', () => {
  saveLastVisitedRoute({ pathname: '/blog/ai-productivity-tools' });

  const restored = resolveStartupRestoration();
  assert.strictEqual(restored, '/blog/ai-productivity-tools');
});

// 14. Legacy aliases are normalized to canonical
test('Scenario 14: Legacy /notes is normalized to /sticky-notes', () => {
  saveLastVisitedRoute({ pathname: '/notes' });

  const saved = getLastVisitedRoute();
  assert.strictEqual(saved.pathname, '/sticky-notes');
});

console.log('\n========================================================');
console.log(`Test Summary: ${passed} / ${total} tests PASSED (${Math.round((passed / total) * 100)}%)`);
console.log('========================================================\n');

process.exit(passed === total ? 0 : 1);

