/**
 * Stiknex — Persistent Last Visited Page Restoration
 * 
 * Provides robust, cross-session route persistence across:
 * - Desktop and mobile browsers (Chrome, Safari, Firefox, Edge)
 * - Installed PWAs (Android, iOS, Desktop)
 * - Standalone webview environments
 * 
 * Storage Key: `stiknex_last_visited_route`
 */

import { isKnownRoute, seoAliases } from './seoConfig.js';

export const STORAGE_KEY = 'stiknex_last_visited_route';

// Routes that should NEVER be stored or restored as a user's working page
const EXCLUDED_PREFIXES = [
  '/dashboard',
  '/stiknex-secure-login-portal',
  '/setup-2fa-admin',
  '/setup-2fa',
  '/login'
];

/**
 * Validates whether a pathname is an eligible, legitimate public route for restoration
 * @param {string} pathname 
 * @returns {boolean}
 */
export const isValidRestorableRoute = (pathname) => {
  if (!pathname || typeof pathname !== 'string') return false;

  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;

  // 1. Exclude admin, login, auth, and dashboard routes
  for (const prefix of EXCLUDED_PREFIXES) {
    if (clean === prefix || clean.startsWith(`${prefix}/`)) {
      return false;
    }
  }

  // 2. Allow root
  if (clean === '/') return true;

  // 3. Dynamic blog articles (/blog/:slug)
  if (clean.startsWith('/blog/') && clean.length > 6) return true;

  // 4. URL shortener analytics
  if (clean.startsWith('/url-shortener/analytics/') && clean.length > 25) return true;

  // 5. Verify against known route registry (all 201 tools, core pages, and aliases)
  if (isKnownRoute(clean)) return true;

  return false;
};

/**
 * Normalizes legacy aliases or subroutes to canonical paths
 * (e.g. /notes -> /sticky-notes, /notebook -> /online-notebook, /tools/word-counter -> /word-counter)
 * @param {string} pathname 
 * @returns {string}
 */
export const normalizeRoutePath = (pathname) => {
  if (!pathname) return '/';
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;

  if (seoAliases && seoAliases[clean]) {
    return seoAliases[clean];
  }

  if (clean.startsWith('/tools/') && clean.length > 7) {
    const slug = clean.slice(7);
    if (isKnownRoute(`/${slug}`)) {
      return `/${slug}`;
    }
  }

  return clean;
};

/**
 * Reads and validates the persisted route from localStorage
 * @returns {{ pathname: string, search: string, hash: string, timestamp: number } | null}
 */
export const getLastVisitedRoute = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.pathname) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    const normalizedPath = normalizeRoutePath(parsed.pathname);

    if (!isValidRestorableRoute(normalizedPath)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      pathname: normalizedPath,
      search: typeof parsed.search === 'string' ? parsed.search : '',
      hash: typeof parsed.hash === 'string' ? parsed.hash : '',
      timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : Date.now()
    };
  } catch (err) {
    console.warn('[RouteRestoration] Failed to read saved route:', err);
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    return null;
  }
};

/**
 * Persists the current navigation route into localStorage
 * @param {{ pathname: string, search?: string, hash?: string }} location 
 * @param {boolean} isInitialMount - Guard against overwriting saved route with '/' on cold start
 */
export const saveLastVisitedRoute = (location, isInitialMount = false) => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }

  try {
    if (!location || !location.pathname) return;

    const normalizedPath = normalizeRoutePath(location.pathname);

    // Safeguard: Never store invalid or excluded routes
    if (!isValidRestorableRoute(normalizedPath)) {
      return;
    }

    // Safeguard: If on cold start the router briefly reports '/', do not overwrite a valid non-root saved route
    if (normalizedPath === '/' && isInitialMount) {
      const existing = getLastVisitedRoute();
      if (existing && existing.pathname && existing.pathname !== '/') {
        return; // Preserve the existing saved route
      }
    }

    const payload = {
      pathname: normalizedPath,
      search: location.search || '',
      hash: location.hash || '',
      timestamp: Date.now()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[RouteRestoration] Failed to persist route:', err);
  }
};

/**
 * Synchronous pre-render startup restoration.
 * Executes BEFORE React Router and React DOM render.
 * If the user opens the root entry URL ('/'), replaces window.history state to the last working page.
 * This guarantees ZERO flash of the homepage on PWA and browser cold starts.
 * @returns {string | null} Restored URL or null
 */
export const resolveStartupRestoration = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }

  try {
    const currentPath = window.location.pathname;

    // Only restore when the user launched the app at the root entry point ('/' or empty)
    if (currentPath !== '/' && currentPath !== '') {
      return null;
    }

    // Check for explicit query parameters that require landing on home (e.g. oauth, reset, logout)
    const currentSearch = window.location.search || '';
    if (currentSearch.includes('stay=home') || currentSearch.includes('action=logout') || currentSearch.includes('reset_route=true')) {
      return null;
    }

    const saved = getLastVisitedRoute();
    if (!saved || !saved.pathname || saved.pathname === '/') {
      return null;
    }

    const restoredUrl = `${saved.pathname}${saved.search || ''}${saved.hash || ''}`;

    // Perform seamless history state replacement prior to BrowserRouter initialization
    if (window.history && typeof window.history.replaceState === 'function') {
      window.history.replaceState(null, '', restoredUrl);
      return restoredUrl;
    }
  } catch (err) {
    console.warn('[RouteRestoration] Startup restoration notice:', err);
  }

  return null;
};

/**
 * Clears the stored route
 */
export const clearLastVisitedRoute = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
};
