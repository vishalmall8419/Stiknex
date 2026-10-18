import { Bell, Menu, Package, X, Star } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
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
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("stkx_admin_token") || sessionStorage.getItem("stkx_admin_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`/api/reviews?t=${Date.now()}`, { headers });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.reviews || []);
          setNotifications(list);
          setMessageCount(list.length);
        }
      } catch (_) {}
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
    };
    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationOpen]);

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

          {/* Notification Bell with Dropdown Popover */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              aria-label="Toggle user notifications"
              title="User Messages & Feedback Notifications"
              className="relative p-1.5 rounded-lg hover:bg-white/40 transition flex items-center justify-center cursor-pointer"
            >
              <Bell size={22} fill="var(--primary)" />
              {messageCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white shadow-sm">
                  {messageCount > 9 ? '9+' : messageCount}
                </span>
              )}
            </button>

            {/* Notification Popover Modal */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-indigo-600" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h4>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      {messageCount}
                    </span>
                  </div>
                  <NavLink
                    to="/dashboard/messages"
                    onClick={() => setIsNotificationOpen(false)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View all
                  </NavLink>
                </div>

                <div className="py-2 max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No new feedback or messages.
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((item) => (
                      <NavLink
                        key={item._id}
                        to="/dashboard/messages"
                        onClick={() => setIsNotificationOpen(false)}
                        className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition border border-transparent hover:border-slate-100 dark:hover:border-slate-800 text-left"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {item.userName || "Anonymous"}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recent"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={11} fill={star <= (item.rating || 5) ? "currentColor" : "none"} />
                          ))}
                          <span className="text-[10px] font-medium text-slate-400 ml-1">
                            ({item.tool || "stiknex"})
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          "{item.message}"
                        </p>
                      </NavLink>
                    ))
                  )}
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-center">
                  <NavLink
                    to="/dashboard/messages"
                    onClick={() => setIsNotificationOpen(false)}
                    className="inline-flex items-center justify-center w-full py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition"
                  >
                    Open Messages & Feedback Center
                  </NavLink>
                </div>
              </div>
            )}
          </div>

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



