const fs = require('fs');
const path = require('path');

const base = path.resolve(__dirname);

// ============================================
// TASK 1 & 6 & 7: Delete unused e-commerce files
// ============================================
const filesToDelete = [
  'src/Pages/Admin2/AdminCart.jsx',
  'src/Pages/Admin2/AdminCategories.jsx',
  'src/Pages/Admin2/AdminCostumes.jsx',
  'src/Pages/Admin2/AdminOrders.jsx',
  'src/Pages/Admin2/AdminProducts.jsx',
  'src/Pages/Admin2/AdminStoreSettings.jsx',
  'src/Pages/Admin2/Component/AddProductModal.jsx',
  'src/Pages/Admin2/Component/EditProductModal.jsx',
  'src/Pages/Admin2/Component/cards/OrderCard.jsx',
  'src/Pages/Admin2/Component/cards/ProductCard.jsx',
  'src/Pages/Admin2/Component/cards/OrderStatusChart.jsx',
  'src/Pages/Admin2/AdminMessage.jsx',
];

filesToDelete.forEach(f => {
  const full = path.join(base, f);
  if (fs.existsSync(full)) {
    fs.unlinkSync(full);
    console.log('DELETED:', f);
  } else {
    console.log('NOT FOUND (skip):', f);
  }
});

// ============================================
// TASK 2: Rewrite Sidebar.jsx
// ============================================
const sidebarPath = path.join(base, 'src/Pages/Admin2/Component/Sidebar.jsx');
const sidebarContent = `import { useNavigate, useLocation } from "react-router-dom";
import Button from "./Button";

import {
  BarChart3,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  TrendingUp,
  UserRound,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================
  // LOGOUT HANDLER
  // =====================================
  const handleLogout = () => {
    sessionStorage.removeItem("Role");
    localStorage.removeItem("stkx_admin_token");
    onClose?.();
    navigate("/stiknex-secure-login-portal", { replace: true });
  };

  // =====================================
  // MENU ITEMS
  // =====================================
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Analytics",
      path: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      name: "Trends",
      path: "/dashboard/trends",
      icon: TrendingUp,
    },
    {
      name: "Blog Manager",
      path: "/dashboard/blog",
      icon: FileText,
    },
    {
      name: "Messages",
      path: "/dashboard/messages",
      icon: MessageSquare,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: Settings,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: UserRound,
    },
  ];

  return (
    <aside
      aria-label="Admin sidebar"
      className={\`

    fixed inset-y-0 left-0 z-50
    flex h-dvh w-[min(82vw,280px)] flex-col
    overflow-hidden

    border-r border-white/50

    shadow-[8px_0_30px_rgba(40,70,80,0.08)]
    backdrop-blur-2xl

    transition-transform duration-300 ease-in-out

    \${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}

    lg:w-60
    lg:backdrop-blur-none
    lg:shadow-[8px_0_32px_rgba(78,108,125,0.12)]
  \`}
    >
      {/* =====================================
          LOGO
      ===================================== */}
      <div className="shrink-0 px-3 sm:px-4">
        <div
          className="
            flex min-h-[88px] items-center
            border-b border-white/40
            lg:min-h-[96px]
          "
        >
          <h1
            className="
              w-full text-2xl font-bold tracking-tight
              sm:text-3xl lg:text-left
            "
          >
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              STIKNEX
            </span>
            <span className="ml-2 text-xs font-medium text-slate-400 align-middle">Admin</span>
          </h1>
        </div>
      </div>

      {/* =====================================
          SCROLLABLE MENU
      ===================================== */}
      <nav
        aria-label="Admin navigation"
        className="
          min-h-0
          flex-1
          overflow-y-auto
          px-3
          pt-5
          pb-24
          sm:px-4
        "
      >
        <div className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Button
                key={item.path}
                logo={<Icon size={19} strokeWidth={1.8} />}
                data={item.name}
                path={item.path}
                onClick={onClose}
              />
            );
          })}
        </div>
      </nav>

      {/* =====================================
          FIXED LOGOUT BUTTON
      ===================================== */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          border-t
          border-white/40
          logout-button
          p-3
          backdrop-blur-2xl
          sm:p-4
          lg:backdrop-blur-none
        "
      >
        <button type="button" onClick={handleLogout} className="flex items-center gap-2 text-white sidebar-link font-bold">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
`;
fs.writeFileSync(sidebarPath, sidebarContent, 'utf8');
console.log('WROTE Sidebar.jsx:', fs.statSync(sidebarPath).size, 'bytes');

// ============================================
// TASK 3: Rewrite Navbar.jsx
// ============================================
const navbarPath = path.join(base, 'src/Pages/Admin2/Component/Navbar.jsx');
const navbarContent = `import { Bell, Menu } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";
import profileImage from "../AdminAssets/profile.png";

const Navbar = ({ isSidebarOpen, onToggleSidebar }) => {
  const User = {
    name: "Vishal Mall",
    ProfileImage: profileImage,
  };

  const firstName =
    User?.name
      ?.trim()
      .split(/\\s+/)[0]
      ?.toLowerCase()
      .replace(/^./, (char) => char.toUpperCase()) || "";

  const fullName =
    User?.name
      ?.trim()
      .toLowerCase()
      .replace(/\\b\\w/g, (char) => char.toUpperCase()) || "";

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/20 backdrop-blur-3xl border-b border-white/40 py-3 px-4 text-(--primary) shadow-[0_8px_32px_rgba(31,38,135,0.05)]">
      <div className="flex items-center justify-between gap-3">
        {/* Left Section */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Sidebar Toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isSidebarOpen}
            className="
    flex
    h-10
    w-10
    shrink-0
    items-center
    justify-center
    rounded-lg
    transition-colors
    hover:bg-white/40
  "
          >
            <Menu size={22} />
          </button>

          {/* Welcome Text */}
          <p className="truncate text-sm sm:text-base">
            <span className="hidden sm:inline font-semibold">Welcome Back, </span>
            <span className="font-bold">{firstName} \u{1F44B}</span>
          </p>
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-3">
          <NavLink to="/dashboard/messages" aria-label="Messages">
            <Bell size={22} fill="var(--primary)" />
          </NavLink>

          <NavLink to="/dashboard/profile" className="flex items-center gap-2 font-semibold">
            <img
              src={User.ProfileImage}
              alt={\`\${fullName} profile\`}
              className="h-8 w-8 rounded-full border-2 border-cyan-300 p-1 object-cover"
            />
            <span className="hidden md:inline">{fullName}</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
`;
fs.writeFileSync(navbarPath, navbarContent, 'utf8');
console.log('WROTE Navbar.jsx:', fs.statSync(navbarPath).size, 'bytes');

// ============================================
// TASK 5: Rewrite AdminLayout.jsx
// ============================================
const layoutPath = path.join(base, 'src/Pages/Admin2/AdminLayout.jsx');
const layoutContent = `import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Components
import AnimatedBackground from "./Component/AnimatedBackground";
import Sidebar from "./Component/Sidebar";
import Navbar from "./Component/Navbar";

// Admin Pages
import DashBoard from "./DashBoard";
import AnalyticsPage from "./AnalyticsPage";
import Trends from "./Trends";
import BlogManager from "./BlogManager";
import Messages from "./Messages";
import SiteSettings from "./SiteSettings";
import AdminProfile from "./AdminProfile";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

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

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />

      <main
        className={\`
          min-h-screen
          min-w-0
          transition-[margin]
          duration-300
          ease-in-out

          \${isSidebarOpen ? "lg:ml-60" : "lg:ml-0"}
        \`}
      >
        <Navbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
        />

        <div className="min-w-0 pt-6 px-4 pb-8">
          <Suspense fallback={
            <div className="flex h-[80vh] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<DashBoard />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="trends" element={<Trends />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<SiteSettings />} />
              <Route path="profile" element={<AdminProfile />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
`;
fs.writeFileSync(layoutPath, layoutContent, 'utf8');
console.log('WROTE AdminLayout.jsx:', fs.statSync(layoutPath).size, 'bytes');

console.log('\\n=== ALL TASKS COMPLETE ===');
