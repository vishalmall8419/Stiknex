import { Bell, Menu, Package, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import profileImage from "../AdminAssets/profile.png"

const Navbar = ({ isSidebarOpen, onToggleSidebar }) => {
  const [customLogo, setCustomLogo] = useState(() => localStorage.getItem("stkx_dashboard_logo") || "");

  useEffect(() => {
    const updateLogo = () => {
      setCustomLogo(localStorage.getItem("stkx_dashboard_logo") || "");
    };
    window.addEventListener("storage", updateLogo);
    return () => window.removeEventListener("storage", updateLogo);
  }, []);

  const User = {
    name: "vishal Mall",
    ProfileImage: customLogo || profileImage,
  };

  const firstName =
    User?.name
      ?.trim()
      .split(/\s+/)[0]
      ?.toLowerCase()
      .replace(/^./, (char) => char.toUpperCase()) || "";

  const fullName =
    User?.name
      ?.trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase()) || "";

  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setMessageCount(data.length);
          }
        }
      } catch (_) {}
    };
    fetchCount();
  }, []);

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
            {isSidebarOpen ? <Menu size={22}/> : <Menu size={22} />}
          </button>

          {/* Welcome Text */}
          <p className="truncate text-sm sm:text-base">
            <span className="hidden sm:inline font-semibold">Welcome Back, </span>

            <span className="font-bold">{firstName} 👋</span>
          </p>
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-3">
          <NavLink to="/dashboard/reviews" aria-label="Reviews" title="Review Manager" className="p-1.5 rounded-lg hover:bg-white/40 transition">
            <Package size={22} />
          </NavLink>

          <NavLink to="/dashboard/messages" aria-label="Messages" title="User Messages & Feedback" className="relative p-1.5 rounded-lg hover:bg-white/40 transition">
            <Bell size={22} fill="var(--primary)" />
            {messageCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white shadow-sm">
                {messageCount > 9 ? '9+' : messageCount}
              </span>
            )}
          </NavLink>

          <div className="flex items-center gap-2 font-semibold">
            <img
              src={User.ProfileImage}
              alt={`${fullName} profile`}
              className="h-8 w-8 rounded-full border-2 border-cyan-300 p-1 object-cover"
            />

            <span className="hidden md:inline">{fullName}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



