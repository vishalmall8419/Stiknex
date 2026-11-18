// Central map of route loaders matching all main paths
const routeLoaders = {
  '/': () => import('../Pages/Landing/LandingPage'),
  '/whiteboard': () => import('../Pages/Whiteboard/Whiteboard'),
  '/notes': () => import('../Pages/Home/Home'),
  '/sticky-notes': () => import('../Pages/Home/Home'),
  '/notebook': () => import('../Pages/Notebook/Notebook'),
  '/online-notebook': () => import('../Pages/Notebook/Notebook'),
  '/tools': () => import('../Pages/Tools/Tools'),
  '/about': () => import('../Pages/About/About'),
  '/buy-me-a-coffee': () => import('../Pages/BuyMeACoffee/BuyMeACoffee'),
  '/blog': () => import('../Pages/Blog/Blog'),
  '/dashboard': () => import('../Pages/Dashboard/UserDashboard'),
  '/profile': () => import('../Pages/Dashboard/UserDashboard'),
  '/url-shortener': () => import('../Pages/Tools/UrlShortener/UrlShortener'),
  '/stiknex-typing': () => import('../Pages/Tools/Tools'),
};

const preloadedRoutes = new Set();

/**
 * Preload a route component bundle into browser memory
 */
export function preloadRoute(path) {
  if (!path || typeof path !== 'string') return;
  const cleanPath = path.split('?')[0].split('#')[0].toLowerCase().trim();

  // Direct match
  if (routeLoaders[cleanPath] && !preloadedRoutes.has(cleanPath)) {
    preloadedRoutes.add(cleanPath);
    try {
      routeLoaders[cleanPath]();
    } catch {}
    return;
  }

  // Handle /tools/* or other tool slugs
  if (cleanPath.startsWith('/tools') || cleanPath.startsWith('/')) {
    if (!preloadedRoutes.has('/tools')) {
      preloadedRoutes.add('/tools');
      try {
        routeLoaders['/tools']();
      } catch {}
    }
  }
}

/**
 * Initialize universal hover, touch, pointer and idle preloading
 */
export function initRoutePreloader() {
  if (typeof window === 'undefined') return;

  const handleInteraction = (e) => {
    const link = e.target.closest('a[href], [data-preload], [to]');
    if (!link) return;

    let targetPath = link.getAttribute('to') || link.getAttribute('data-preload') || link.getAttribute('href');
    if (!targetPath) return;

    // Only preload internal relative routes
    if (targetPath.startsWith('/') && !targetPath.startsWith('//')) {
      preloadRoute(targetPath);
    }
  };

  // Hover on desktop (mouse enters link)
  document.addEventListener('mouseover', handleInteraction, { passive: true });
  // Touch on mobile / Android / PWA (fires 100-300ms before click event!)
  document.addEventListener('touchstart', handleInteraction, { passive: true });
  document.addEventListener('pointerdown', handleInteraction, { passive: true });

  // Idle background preloading: load core app pages when the browser is idle
  const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
  idleCallback(() => {
    // Preload top core routes so they are already warm in memory
    preloadRoute('/sticky-notes');
    preloadRoute('/whiteboard');
    preloadRoute('/online-notebook');
    preloadRoute('/tools');
    preloadRoute('/dashboard');
  });
}
