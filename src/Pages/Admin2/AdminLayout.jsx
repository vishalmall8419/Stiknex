import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Components
import AnimatedBackground from "./Component/AnimatedBackground";
import Sidebar from "./Component/Sidebar";
import Navbar from "./Component/Navbar";

// Admin Pages
import DashBoard from "./DashBoard";
import AnalyticsPage from "./AnalyticsPage";
import Trends from "./Trends";
import SEOOpportunities from "./SEOOpportunities";
import BlogManager from "./BlogManager";
import Messages from "./Messages";
import SiteSettings from "./SiteSettings";
import ExternalProjects from "./ExternalProjects";
import ReviewManager from "./ReviewManager";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  // Check authentication across both sessionStorage and localStorage
  const token = localStorage.getItem("stkx_admin_token") || sessionStorage.getItem("stkx_admin_token");
  const role = sessionStorage.getItem("Role") || localStorage.getItem("Role") || (token ? "admin" : null);

  // Auto-sync session across tabs
  useEffect(() => {
    if (token) {
      if (!sessionStorage.getItem("Role")) sessionStorage.setItem("Role", "admin");
      if (!localStorage.getItem("Role")) localStorage.setItem("Role", "admin");
    }
  }, [token]);

  // Auto-logout after 30 minutes of inactivity
  useEffect(() => {
    if (role !== "admin") return;

    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        sessionStorage.removeItem("Role");
        localStorage.removeItem("Role");
        localStorage.removeItem("stkx_admin_token");
        sessionStorage.removeItem("stkx_admin_token");
        sessionStorage.removeItem("DummyToken");
        navigate("/stiknex-secure-login-portal", { replace: true });
      }, 30 * 60 * 1000); // 30 minutes
    };
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(e => document.addEventListener(e, resetTimer));
    
    resetTimer(); // initialize
    
    return () => {
      clearTimeout(timeout);
      events.forEach(e => document.removeEventListener(e, resetTimer));
    };
  }, [role, navigate]);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/stiknex-secure-login-portal", { replace: true });
    }
  }, [role, navigate]);

  if (role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-xs text-slate-400 font-medium">Verifying administrator session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page min-h-screen relative text-slate-800 dark:text-slate-200">
      <AnimatedBackground />

      {/* =====================================
          MOBILE AND TABLET OVERLAY
      ===================================== */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={handleCloseSidebar}
          className="
            fixed inset-0 z-40 cursor-default bg-black/40
            backdrop-blur-[2px] lg:hidden
          "
        />
      )}

      {/* =====================================
          ADMIN SIDEBAR
      ===================================== */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />

      {/* =====================================
          ADMIN MAIN CONTENT
      ===================================== */}
      <main
        className={`
          min-h-screen min-w-0 transition-[margin]
          duration-300 ease-in-out
          ${isSidebarOpen ? "lg:ml-60" : "lg:ml-0"}
        `}
      >
        {/* =====================================
            ADMIN NAVBAR
        ===================================== */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* =====================================
            ADMIN ROUTES
        ===================================== */}
        <div className="min-w-0 pt-20 px-4 pb-8">
          <Suspense fallback={
            <div className="flex h-[80vh] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<DashBoard />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="trends" element={<Trends />} />
              <Route path="seo" element={<SEOOpportunities />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="messages" element={<Messages />} />
              <Route path="notifications" element={<Messages />} />
              <Route path="reviews" element={<ReviewManager />} />
              <Route path="orders" element={<ReviewManager />} />
              <Route path="settings" element={<SiteSettings />} />
              <Route path="external" element={<ExternalProjects />} />
              <Route path="*" element={<DashBoard />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
