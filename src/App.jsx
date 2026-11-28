import { Suspense, lazy, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
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

const ToolDetails = lazy(
  () => import("./Pages/About/ToolDetails")
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
const PrivacyPolicy = lazy(() => import("./Pages/Legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./Pages/Legal/TermsOfService"));
const ContactUs = lazy(() => import("./Pages/Legal/ContactUs"));
const NotFound = lazy(() => import("./Pages/NotFound/NotFound"));

const CommandPalette = lazy(
  () => import("./Component/CommandPalette")
);
const UserDashboard = lazy(() => import("./Pages/Dashboard/UserDashboard"));
const AuthModal = lazy(() => import("./Component/AuthModal"));
const UniversalMobileBottomNav = lazy(() => import("./Component/Navigation/UniversalMobileBottomNav"));
const CircleLandingPage = lazy(() => import("./Pages/Showcase/CircleLandingPage"));
const Sitemap = lazy(() => import("./Pages/Sitemap/Sitemap"));
import SignatureLoader from "./Component/SignatureLoader";
import { initSyncEngine } from "./services/syncManager";
import RouteRestorationTracker from "./Component/RouteRestorationTracker";
import { TOOL_SLUGS } from "./data/toolSlugs";

// ============================================================
// PAGE LOADER (Signature SVG Handwriting Loader)
// ============================================================

const PageLoader = () => {
  return <SignatureLoader size="md" text="" fullScreen={true} />;
};

// ============================================================
// APP COMPONENT
// ============================================================

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      initSyncEngine();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Check if current route is an admin or login route
  const isAdminRoute = 
    location.pathname.startsWith('/dashboard') || 
    location.pathname.startsWith('/stiknex-secure-login-portal') ||
    location.pathname.startsWith('/setup-2fa-admin');
  const isCircleRoute = location.pathname === '/circle';

  const isNotebookRoute =
    location.pathname === '/notebook' ||
    location.pathname === '/online-notebook' ||
    location.pathname === '/online-notepad';
  const isStickyNotesRoute = location.pathname === '/sticky-notes' || location.pathname === '/notes';
  const isWhiteboardRoute = location.pathname === '/whiteboard';
  const isCalculatorRoute =
    location.pathname === '/basic-calculator' ||
    location.pathname === '/simple-calculator' ||
    location.pathname === '/scientific-calculator' ||
    location.pathname === '/percentage-calculator' ||
    location.pathname === '/age-calculator' ||
    location.pathname === '/date-calculator' ||
    location.pathname === '/date-difference-calculator' ||
    location.pathname === '/time-calculator' ||
    location.pathname === '/length-converter' ||
    location.pathname === '/weight-converter' ||
    location.pathname === '/temperature-converter' ||
    location.pathname === '/unit-converter' ||
    location.pathname === '/area-converter' ||
    location.pathname === '/volume-converter' ||
    location.pathname === '/speed-converter' ||
    location.pathname === '/pressure-converter' ||
    location.pathname === '/data-converter' ||
    location.pathname === '/dataconverter';

  const normalizedPathLower = location.pathname.toLowerCase();
  const normalizedToolSlug = normalizedPathLower.startsWith('/tools/')
    ? normalizedPathLower.slice(7)
    : normalizedPathLower.slice(1);

  const isToolRoute =
    location.pathname === '/tools' ||
    location.pathname.startsWith('/tools/') ||
    isCalculatorRoute ||
    TOOL_SLUGS.has(normalizedToolSlug);

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
          <FeedbackWidget showButton={!isNotebookRoute && !isStickyNotesRoute && !isWhiteboardRoute && !isToolRoute} />
        )}
        {!isAdminRoute && (
          <CommandPalette />
        )}

        {/* Persistent Last Visited Page Restoration */}
        <RouteRestorationTracker />

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

          {/* About & Deep-Dive Tool Details */}
          <Route path="/about" element={<About />} />
          <Route path="/about/tool-details" element={<ToolDetails />} />
          <Route path="/about/tool-details/:slug" element={<ToolDetails />} />

          {/* URL Shortener & Click Tracking Analytics */}
          <Route path="/url-shortener" element={<UrlShortener />} />
          <Route path="/url-shortener/analytics/:code" element={<UrlShortenerAnalytics />} />

          {/* Direct Clean Tool Routes */}
          <Route path="/sticky-notes" element={<Home />} />
          <Route path="/stickynotes" element={<Navigate to="/sticky-notes" replace />} />
          <Route path="/online-notebook" element={<Notebook />} />
          <Route path="/online-notepad" element={<Notebook />} />
          <Route path="/word-counter" element={<Tools directSlug="word-counter" />} />
          <Route path="/character-counter" element={<Tools directSlug="character-counter" />} />
          <Route path="/reading-time-calculator" element={<Tools directSlug="reading-time-calculator" />} />
          <Route path="/basic-calculator" element={<Tools directSlug="basic-calculator" />} />
          <Route path="/simple-calculator" element={<Tools directSlug="simple-calculator" />} />
          <Route path="/scientific-calculator" element={<Tools directSlug="scientific-calculator" />} />
          <Route path="/percentage-calculator" element={<Tools directSlug="percentage-calculator" />} />
          <Route path="/age-calculator" element={<Tools directSlug="age-calculator" />} />
          <Route path="/date-calculator" element={<Tools directSlug="date-calculator" />} />
          <Route path="/date-difference-calculator" element={<Tools directSlug="date-difference-calculator" />} />
          <Route path="/time-calculator" element={<Tools directSlug="time-calculator" />} />
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
          <Route path="/data-converter" element={<Tools directSlug="data-converter" />} />

          {/* Phase 3: Finance & Everyday Billing */}
          <Route path="/emi-calculator" element={<Tools directSlug="emi-calculator" />} />
          <Route path="/sip-calculator" element={<Tools directSlug="sip-calculator" />} />
          <Route path="/compound-interest-calculator" element={<Tools directSlug="compound-interest-calculator" />} />
          <Route path="/simple-interest-calculator" element={<Tools directSlug="simple-interest-calculator" />} />
          <Route path="/loan-payoff-calculator" element={<Tools directSlug="loan-payoff-calculator" />} />
          <Route path="/gst-calculator" element={<Tools directSlug="gst-calculator" />} />
          <Route path="/discount-calculator" element={<Tools directSlug="discount-calculator" />} />
          <Route path="/tip-calculator" element={<Tools directSlug="tip-calculator" />} />
          <Route path="/budget-planner" element={<Tools directSlug="budget-planner" />} />
          <Route path="/savings-goal-calculator" element={<Tools directSlug="savings-goal-calculator" />} />

          {/* Phase 3: Helpers & Daily Utilities */}
          <Route path="/invoice-generator" element={<Tools directSlug="invoice-generator" />} />
          <Route path="/receipt-generator" element={<Tools directSlug="receipt-generator" />} />
          <Route path="/stopwatch-with-laps" element={<Tools directSlug="stopwatch-with-laps" />} />
          <Route path="/stopwatch" element={<Navigate to="/stopwatch-with-laps" replace />} />
          <Route path="/countdown-timer" element={<Tools directSlug="countdown-timer" />} />
          <Route path="/pomodoro-timer" element={<Tools directSlug="pomodoro-timer" />} />
          <Route path="/birthday-countdown" element={<Tools directSlug="birthday-countdown" />} />
          <Route path="/live-clock" element={<Tools directSlug="live-clock" />} />
          <Route path="/online-clock" element={<Navigate to="/live-clock" replace />} />
          <Route path="/clock" element={<Navigate to="/live-clock" replace />} />
          <Route path="/screen-resolution-checker" element={<Tools directSlug="screen-resolution-checker" />} />
          <Route path="/aspect-ratio-calculator" element={<Tools directSlug="aspect-ratio-calculator" />} />
          <Route path="/typographic-scale-generator" element={<Tools directSlug="typographic-scale-generator" />} />
          <Route path="/name-generator" element={<Tools directSlug="name-generator" />} />
          <Route path="/flashcard-maker" element={<Tools directSlug="flashcard-maker" />} />
          <Route path="/random-quiz-generator" element={<Tools directSlug="random-quiz-generator" />} />
          <Route path="/decision-helper" element={<Tools directSlug="decision-helper" />} />

          {/* Phase 4: Date, Time & Calendars */}
          <Route path="/world-clock" element={<Tools directSlug="world-clock" />} />
          <Route path="/time-zone-converter" element={<Tools directSlug="time-zone-converter" />} />
          <Route path="/meeting-time-planner" element={<Tools directSlug="meeting-time-planner" />} />
          <Route path="/calendar-generator" element={<Tools directSlug="calendar-generator" />} />
          <Route path="/week-number-calculator" element={<Tools directSlug="week-number-calculator" />} />
          <Route path="/business-days-calculator" element={<Tools directSlug="business-days-calculator" />} />

          {/* Phase 4: Stiknex Typing Master */}
          <Route path="/stiknex-typing" element={<Tools directSlug="stiknex-typing" />} />
          <Route path="/typing-speed-test" element={<Tools directSlug="stiknex-typing" />} />
          <Route path="/typing" element={<Navigate to="/stiknex-typing" replace />} />
          <Route path="/typing-master" element={<Navigate to="/stiknex-typing" replace />} />
          <Route path="/typing-practice-lessons" element={<Tools directSlug="stiknex-typing" />} />
          <Route path="/typing-accuracy-test" element={<Tools directSlug="stiknex-typing" />} />
          <Route path="/falling-words-game" element={<Tools directSlug="stiknex-typing" />} />
          <Route path="/word-rush-game" element={<Tools directSlug="stiknex-typing" />} />
          <Route path="/code-typing-challenge" element={<Tools directSlug="stiknex-typing" />} />
          <Route path="/keyboard-shortcut-finder" element={<Tools directSlug="stiknex-typing" />} />
          <Route path="/keyboard-key-tester" element={<Tools directSlug="stiknex-typing" />} />
          <Route path="/typing-error-analyzer" element={<Tools directSlug="stiknex-typing" />} />
          <Route path="/daily-typing-challenge" element={<Tools directSlug="stiknex-typing" />} />

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

          {/* Typing Lab Legacy Route (Redirects to Flagship Typing Master) */}
          <Route
            path="/typing-lab"
            element={<Navigate to="/stiknex-typing" replace />}
          />

          {/* Blog Details */}
          <Route
            path="/blog/:id"
            element={<BlogDetail />}
          />

          {/* User Dashboard & Profile */}
          <Route
            path="/dashboard"
            element={<UserDashboard />}
          />
          <Route
            path="/profile"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* HTML Visual Sitemap (All 206 Tools & Pages Index) */}
          <Route
            path="/sitemap"
            element={<Sitemap />}
          />

          {/* Showcase: Circle Landing Page (Sandhill Studio / Halo Lab Pinterest Replica) */}
          <Route
            path="/circle"
            element={<CircleLandingPage />}
          />

          {/* Legal Pages (Privacy Policy & Terms of Service) */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* All 200 Clean Tool Slug Routes */}
          <Route
            path="/:toolSlug"
            element={<Tools />}
          />

          {/* 404 — Catch-all for any unknown route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AuthModal />
        {!isAdminRoute && !isCircleRoute && !isStickyNotesRoute && <UniversalMobileBottomNav />}
      </Suspense>
    </>
  );
};

export default App;
