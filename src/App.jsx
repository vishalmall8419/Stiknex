import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

const LandingPage = lazy(() => import("./Pages/Landing/LandingPage"));
const Home = lazy(() => import("./Pages/Home/Home"));
const About = lazy(() => import("./Pages/About/About"));
const Tools = lazy(() => import("./Pages/Tools/Tools"));
const Notebook = lazy(() => import("./Pages/Notebook/Notebook"));
const Whiteboard = lazy(() => import("./Pages/Whiteboard/Whiteboard"));
const BuyMeACoffee = lazy(() => import("./Pages/BuyMeACoffee/BuyMeACoffee"));

// A simple modern loader for Suspense fallback
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-500"></div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">Loading workspace...</p>
    </div>
  </div>
);

const RouteTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Save valid app routes, skip landing page or missing routes
    const validAppRoutes = ["/notes", "/notebook", "/whiteboard", "/tools", "/about", "/buy-me-a-coffee"];
    if (validAppRoutes.includes(location.pathname)) {
      localStorage.setItem("lastVisitedRoute", location.pathname);
    }
  }, [location]);

  return null;
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only attempt restoration if landing on the root path exactly
    if (location.pathname === "/") {
      const lastVisited = localStorage.getItem("lastVisitedRoute");
      // Don't auto-redirect if there's no history, or if they purposely want the landing page.
      // Wait, the prompt asked to "restore the appropriate last page...". 
      // We will redirect to their last active workspace to save them a click.
      if (lastVisited && lastVisited !== "/") {
        navigate(lastVisited, { replace: true });
      }
    }
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/notes" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/notebook" element={<Notebook />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
        <Route path="/buy-me-a-coffee" element={<BuyMeACoffee />} />
      </Routes>
    </Suspense>
  );
};

export default App;