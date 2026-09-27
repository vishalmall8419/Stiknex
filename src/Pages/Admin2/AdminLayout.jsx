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

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  // MOCK ROLE CHECK - Replace with actual authentication
  const role = sessionStorage.getItem("Role");

  useEffect(() => {
    if (role !== "admin") {
      navigate("/stiknex-secure-login-portal");
    }
  }, [role, navigate]);

  if (role !== "admin") {
    return null;
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
              <Route path="settings" element={<SiteSettings />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
