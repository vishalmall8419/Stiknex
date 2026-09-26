import { useNavigate } from "react-router-dom";
import Button from "./Button";

import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  ShoppingBag,
  ShoppingCart,
  Store,
  Tag,
  UserRound,
  Users,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, onClose }) => {
  const navigate = useNavigate();

  // =====================================
  // LOGOUT HANDLER
  // =====================================
  const handleLogout = () => {
    debugger
    console.log("logout triggering");
    sessionStorage.removeItem("Role");`n    localStorage.removeItem("stkx_admin_token");
    sessionStorage.removeItem("DummyToken");

    onClose?.();

    navigate("/login", { replace: true });
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
      name: "Products",
      path: "/dashboard/products",
      icon: Package,
    },
    {
      name: "Categories",
      path: "/dashboard/categories",
      icon: Tag,
    },
    {
      name: "Orders",
      path: "/dashboard/orders",
      icon: ShoppingBag,
    },
    {
      name: "Customers",
      path: "/dashboard/customers",
      icon: Users,
    },
    {
      name: "Cart Overview",
      path: "/dashboard/cart",
      icon: ShoppingCart,
    },
    {
      name: "Analytics",
      path: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      name: "Messages",
      path: "/dashboard/messages",
      icon: MessageSquare,
    },
    {
      name: "Admin Profile",
      path: "/dashboard/profile",
      icon: UserRound,
    },
    {
      name: "Store Settings",
      path: "/dashboard/store-settings",
      icon: Store,
    },
  ];

  return (
    <aside
      aria-label="Admin sidebar"
      className={`
  

    fixed inset-y-0 left-0 z-50
    flex h-dvh w-[min(82vw,280px)] flex-col
    overflow-hidden

    border-r border-white/50

    shadow-[8px_0_30px_rgba(40,70,80,0.08)]
    backdrop-blur-2xl

    transition-transform duration-300 ease-in-out

    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}

    lg:w-60
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
            border-b border-white/40
            lg:min-h-[96px]
          "
        >
          <h1
            className="
              w-full text-2xl font-bold tracking-tight
              text-orange-400 sm:text-3xl lg:text-left
            "
          >
            <span>E</span>

            <span
              className="
                bg-[radial-gradient(circle,rgba(34,193,195,1)_0%,rgba(253,187,45,1)_100%)]
                bg-clip-text text-transparent
              "
            >
              COM
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
          border-white/40
         logout-button
          p-3
          backdrop-blur-2xl
          sm:p-4
          lg:backdrop-blur-none
          
        
        "
      >
       
         <button type="button" onClick={handleLogout}  style={{fontWeight:"800 !important" }} className="text-white sidebar-link ">
          
          LogOut
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

