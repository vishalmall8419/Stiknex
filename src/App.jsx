import { Suspense, lazy } from "react";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { Analytics } from "@vercel/analytics/react"

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

const UrlShortener = lazy(() => import("./Pages/Tools/UrlShortener/UrlShortener"));
const UrlShortenerAnalytics = lazy(() => import("./Pages/Tools/UrlShortener/UrlShortenerAnalytics"));
const Setup2FA = lazy(() => import('./Pages/Admin2/Setup2FA'));
const AdminLogin = lazy(() => import('./Pages/Admin2/AdminLogin'));
const AdminLayout = lazy(() => import('./Pages/Admin2/AdminLayout'));
const BlogDetail = lazy(
  () => import("./Pages/Blog/BlogDetail")
);
const TypingLab = lazy(
  () => import("./Pages/TypingLab/TypingLab")
);
const FeedbackWidget = lazy(
  () => import("./Component/FeedbackWidget")
);
const CommandPalette = lazy(
  () => import("./Component/CommandPalette")
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
  const location = useLocation();

  // Check if current route is an admin or login route
  const isAdminRoute = 
    location.pathname.startsWith('/dashboard') || 
    location.pathname.startsWith('/stiknex-secure-login-portal') ||
    location.pathname.startsWith('/setup-2fa-admin');

  const isNotebookRoute =
    location.pathname === '/notebook' ||
    location.pathname === '/online-notebook';
  const isStickyNotesRoute = location.pathname === '/sticky-notes';
  const isWhiteboardRoute = location.pathname === '/whiteboard';

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
            {/* Vercel Analytics */}
      <Analytics debug={false} />

      {/* Lazy Loading */}
      <Suspense fallback={<PageLoader />}>
        {/* Render Modals and Widgets ONLY on public pages */}
        {!isAdminRoute && (
          <FeedbackWidget showButton={!isNotebookRoute && !isStickyNotesRoute && !isWhiteboardRoute} />
        )}
        {!isAdminRoute && (
          <CommandPalette />
        )}

        {/* Application Routes */}
        <Routes>
          <Route path="/setup-2fa-admin" element={<Setup2FA />} />
          <Route path="/stiknex-secure-login-portal" element={<AdminLogin />} />
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

          {/* URL Shortener & Click Tracking Analytics */}
          <Route path="/url-shortener" element={<UrlShortener />} />
          <Route path="/url-shortener/analytics/:code" element={<UrlShortenerAnalytics />} />

          {/* Direct Clean Tool Routes */}
          <Route path="/sticky-notes" element={<Home />} />
          <Route path="/online-notebook" element={<Notebook />} />
          <Route path="/word-counter" element={<Tools directSlug="word-counter" />} />
          <Route path="/character-counter" element={<Tools directSlug="character-counter" />} />
          <Route path="/reading-time-calculator" element={<Tools directSlug="reading-time-calculator" />} />
          <Route path="/simple-calculator" element={<Tools directSlug="simple-calculator" />} />
          <Route path="/scientific-calculator" element={<Tools directSlug="scientific-calculator" />} />
          <Route path="/date-calculator" element={<Tools directSlug="date-calculator" />} />
          <Route path="/currency-converter" element={<Tools directSlug="currency-converter" />} />
          <Route path="/unit-converter" element={<Tools directSlug="length-converter" />} />
          <Route path="/length-converter" element={<Tools directSlug="length-converter" />} />
          <Route path="/area-converter" element={<Tools directSlug="area-converter" />} />
          <Route path="/volume-converter" element={<Tools directSlug="volume-converter" />} />
          <Route path="/weight-converter" element={<Tools directSlug="weight-converter" />} />
          <Route path="/temperature-converter" element={<Tools directSlug="temperature-converter" />} />
          <Route path="/speed-converter" element={<Tools directSlug="speed-converter" />} />
          <Route path="/pressure-converter" element={<Tools directSlug="pressure-converter" />} />
          <Route path="/power-converter" element={<Tools directSlug="power-converter" />} />
          <Route path="/qr-code-generator" element={<Tools directSlug="qr-code-generator" />} />
          <Route path="/password-generator" element={<Tools directSlug="password-generator" />} />
          <Route path="/color-picker" element={<Tools directSlug="color-picker" />} />

          {/* Tools Catalog & Subroutes */}
          <Route
            path="/tools"
            element={<Tools />}
          />
          <Route
            path="/tools/:toolId"
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

          {/* Typing Lab */}
          <Route
            path="/typing-lab"
            element={<TypingLab />}
          />

          {/* Blog Details */}
          <Route
            path="/blog/:id"
            element={<BlogDetail />}
          />

          {/* All 200 Clean Tool Slug Routes */}
          <Route
            path="/:toolSlug"
            element={<Tools />}
          />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
