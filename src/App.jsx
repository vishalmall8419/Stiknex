import { Suspense, lazy, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { Analytics } from "@vercel/analytics/react"

import DownloadAppModal from "./Component/DownloadAppModal";

// ============================================================
// LAZY LOADED PAGES
// ============================================================

const LandingPage = lazy(
  () => import("./Pages/Landing/LandingPage")
);

const Home = lazy(
  () => import("./Pages/Home/Home")
);

const About = lazy(
  () => import("./Pages/About/About")
);

const Tools = lazy(
  () => import("./Pages/Tools/Tools")
);

const Notebook = lazy(
  () => import("./Pages/Notebook/Notebook")
);

const Whiteboard = lazy(
  () => import("./Pages/Whiteboard/Whiteboard")
);

const BuyMeACoffee = lazy(
  () => import("./Pages/BuyMeACoffee/BuyMeACoffee")
);

const Blog = lazy(
  () => import("./Pages/Blog/Blog")
);

const AdminLayout = lazy(() => import('./Pages/Admin2/AdminLayout'));
const BlogDetail = lazy(
  () => import("./Pages/Blog/BlogDetail")
);

// ============================================================
// PAGE LOADER
// ============================================================

const PageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 transition-colors duration-300 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-500"></div>

        <p className="animate-pulse text-sm font-medium text-gray-500 dark:text-gray-400">
          Loading workspace...
        </p>
      </div>
    </div>
  );
};

// ============================================================
// APP COMPONENT
// ============================================================

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      {/* Vercel Analytics */}
      <Analytics />

      {/* Lazy Loading */}
      <Suspense fallback={<PageLoader />}>
        {/* Download App Modal */}
        <DownloadAppModal />

        {/* Application Routes */}
        <Routes>
          <Route path="/dashboard/*" element={<AdminLayout />} />
          {/* Landing Page */}
          <Route
            path="/"
            element={<LandingPage />}
          />

          {/* Notes */}
          <Route
            path="/notes"
            element={<Home />}
          />

          {/* About */}
          <Route
            path="/about"
            element={<About />}
          />

          {/* Tools */}
          <Route
            path="/tools"
            element={<Tools />}
          />

          {/* Notebook */}
          <Route
            path="/notebook"
            element={<Notebook />}
          />

          {/* Whiteboard */}
          <Route
            path="/whiteboard"
            element={<Whiteboard />}
          />

          {/* Buy Me A Coffee */}
          <Route
            path="/buy-me-a-coffee"
            element={<BuyMeACoffee />}
          />

          {/* Blog */}
          <Route
            path="/blog"
            element={<Blog />}
          />

          {/* Blog Details */}
          <Route
            path="/blog/:id"
            element={<BlogDetail />}
          />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
