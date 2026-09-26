import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Components
import AnimatedBackground from "./Component/AnimatedBackground";
import Sidebar from "./Component/Sidebar";
import Navbar from "./Component/Navbar";

// Admin Pages
import DashBoard from "./DashBoard";

// Placeholder for other admin pages
const AdminOrders = () => <div className="p-4">Trending Keywords List (Coming Soon)</div>;
const AdminProducts = () => <div className="p-4">Tools Manager (Coming Soon)</div>;
const AdminCostumers = () => <div className="p-4">Users List (Coming Soon)</div>;
const Categories = () => <div className="p-4">Categories (Coming Soon)</div>;
const AdminCartOverview = () => <div className="p-4">Overview (Coming Soon)</div>;
const AdminAnalytics = () => <div className="p-4">Analytics (Coming Soon)</div>;
const AdminStoreSettings = () => <div className="p-4">Settings (Coming Soon)</div>;
const Messages = () => <div className="p-4">Messages (Coming Soon)</div>;
const AdminProfile = () => <div className="p-4">Profile (Coming Soon)</div>;

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  // MOCK ROLE CHECK - Replace with actual authentication
  const role = "admin";

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
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
            fixed
            inset-0
            z-40
            cursor-default
            bg-black/40
            backdrop-blur-[2px]
            lg:hidden
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
          min-h-screen
          min-w-0
          transition-[margin]
          duration-300
          ease-in-out

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
              {/* /dashboard */}
              <Route path="/" element={<DashBoard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="customers" element={<AdminCostumers />} />
              <Route path="categories" element={<Categories />} />
              <Route path="cart" element={<AdminCartOverview />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="store-settings" element={<AdminStoreSettings />} />
              <Route path="messages" element={<Messages />} />
              <Route path="profile" element={<AdminProfile />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
