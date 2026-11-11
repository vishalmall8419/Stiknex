import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLastVisitedRoute, saveLastVisitedRoute } from "../utils/routeRestoration";

/**
 * RouteRestorationTracker
 * 
 * 1. Startup Fallback: On initial application mount, if the app booted on root ('/'),
 *    verifies whether a valid non-root route was stored and navigates with replace: true.
 * 2. Continuous Tracking: Listens to all React Router location changes and persists
 *    valid public routes (path, query parameters, hash) to localStorage.
 * 3. Startup Overwrite Protection: Never allows an initial root mount to overwrite a valid
 *    persisted working route.
 */
const RouteRestorationTracker = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // 1. Startup Fallback Check
    if (isInitialMount.current) {
      if (location.pathname === "/") {
        const saved = getLastVisitedRoute();
        if (saved && saved.pathname && saved.pathname !== "/") {
          const fullUrl = `${saved.pathname}${saved.search || ""}${saved.hash || ""}`;
          isInitialMount.current = false;
          navigate(fullUrl, { replace: true });
          return;
        }
      }
    }

    // 2. Persist route change
    saveLastVisitedRoute(location, isInitialMount.current);
    isInitialMount.current = false;
  }, [location, navigate]);

  return null;
};

export default RouteRestorationTracker;

