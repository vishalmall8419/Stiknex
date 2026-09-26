import { useNavigate } from "react-router-dom";
import Button from "./Button";

import {
  BarChart3,
  LayoutDashboard,
  MessageSquare,
  Package,
  Store,
  UserRound,
  Users,
  TrendingUp,
  FileText,
  LogOut
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, onClose }) => {
  const navigate = useNavigate();

  // =====================================
  // LOGOUT HANDLER
  // =====================================
  const handleLogout = () => {
    console.log("logout triggering");
    sessionStorage.removeItem("Role");
    sessionStorage.removeItem("DummyToken");
    onClose?.();
    navigate("/", { replace: true });
  };

  // =====================================
  // MENU ITEMS (Customized for Stiknex)
  // =====================================
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "SEO Trends",
      path: "/dashboard/orders",
      icon: TrendingUp,
    },
    {
      name: "Content",
      path: "/dashboard/products",
      icon: FileText,
    },
    {
      name: "Users",
      path: "/dashboard/customers",
      icon: Users,
    },
    {
      name: "Analytics",
      path: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/dashboard/store-settings",
      icon: Store,
    }
  ];

  return (
    <aside
      aria-label="Admin sidebar"
      className={`
        sidebarBg
        fixed inset-y-0 left-0 z-50
        flex h-dvh w-[min(82vw,280px)] flex-col
        overflow-hidden
        border-r border-slate-200 dark:border-slate-800
        shadow-[8px_0_30px_rgba(40,70,80,0.08)]
        backdrop-blur-2xl
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:w-60
        lg:translate-x-0
        lg:backdrop-blur-none
        lg:shadow-[8px_0_32px_rgba(78,108,125,0.12)]
      `}
    >
      {/* =====================================
          LOGO
      ===================================== */}
      <div className="shrink-0 px-3 sm:px-4">
        <div
          className="
            flex min-h-[88px] items-center
            border-b border-slate-200 dark:border-slate-800
            lg:min-h-[96px]
          "
        >
          <h1
            className="
              w-full text-2xl font-bold tracking-tight
              text-indigo-600 dark:text-indigo-400 sm:text-3xl lg:text-left
            "
          >
            <span>STIK</span>
            <span
              className="
                bg-[radial-gradient(circle,rgba(34,193,195,1)_0%,rgba(99,102,241,1)_100%)]
                bg-clip-text text-transparent
              "
            >
              NEX
            </span>
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
          border-slate-200 dark:border-slate-800
          logout-button
          p-3
          backdrop-blur-2xl
          sm:p-4
          lg:backdrop-blur-none
        "
      >
         <button 
           type="button" 
           onClick={handleLogout} 
           style={{fontWeight: "800"}} 
           className="text-white sidebar-link w-full text-left flex items-center gap-2"
         >
          <LogOut size={19} /> LogOut
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

