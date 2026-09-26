import React, { useMemo, useState } from "react";
import {
  CheckCircle,
  Clock3,
  Eye,
  Filter,
  Package,
  Search,
  ShoppingCart,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

const initialCartItems = [
  {
    id: 1,
    cartId: "CRT-1001",
    customer: "Rahul Kumar",
    email: "rahul@example.com",
    phone: "+91 9876543210",
    product: "Classic Cotton Shirt",
    category: "Garments",
    quantity: 2,
    price: 799,
    status: "Active",
    updatedAt: "Sep 24, 2026",
  },
  {
    id: 2,
    cartId: "CRT-1002",
    customer: "Priya Singh",
    email: "priya@example.com",
    phone: "+91 9876543211",
    product: "Premium Face Serum",
    category: "Cosmetics",
    quantity: 1,
    price: 1299,
    status: "Pending",
    updatedAt: "Sep 23, 2026",
  },
  {
    id: 3,
    cartId: "CRT-1003",
    customer: "Amit Verma",
    email: "amit@example.com",
    phone: "+91 9876543212",
    product: "Slim Fit Denim",
    category: "Garments",
    quantity: 1,
    price: 1499,
    status: "Converted",
    updatedAt: "Sep 22, 2026",
  },
  {
    id: 4,
    cartId: "CRT-1004",
    customer: "Neha Sharma",
    email: "neha@example.com",
    phone: "+91 9876543213",
    product: "Hydrating Moisturizer",
    category: "Cosmetics",
    quantity: 3,
    price: 599,
    status: "Abandoned",
    updatedAt: "Sep 21, 2026",
  },
];

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Converted: "bg-sky-100 text-sky-700",
  Abandoned: "bg-rose-100 text-rose-700",
};

const StatCard = ({ title, value, subtitle, icon: Icon }) => (
  <div className="rounded-2xl border border-white/70 bg-white/35 p-4 shadow-[0_8px_25px_rgba(80,120,140,0.07)] backdrop-blur-xl">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-(--secondary)">{title}</p>
        <h3 className="mt-1 text-xl font-bold text-(--primary)">{value}</h3>
        <p className="mt-1 text-[11px] text-(--muted)">{subtitle}</p>
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/60 text-(--primary)">
        <Icon size={19} />
      </div>
    </div>
  </div>
);

const AdminCart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedCart, setSelectedCart] = useState(null);

  const categories = useMemo(
    () => ["All", ...new Set(cartItems.map((item) => item.category))],
    [cartItems],
  );

  const filteredItems = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return cartItems.filter((item) => {
      const matchesSearch = [
        item.cartId,
        item.customer,
        item.email,
        item.phone,
        item.product,
      ].some((value) => value.toLowerCase().includes(search));

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [cartItems, searchTerm, statusFilter, categoryFilter]);

  const statistics = useMemo(() => {
    const totalValue = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return {
      total: cartItems.length,
      active: cartItems.filter((item) => item.status === "Active").length,
      pending: cartItems.filter((item) => item.status === "Pending").length,
      converted: cartItems.filter((item) => item.status === "Converted").length,
      totalValue,
    };
  }, [cartItems]);

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Remove cart item?",
      text: `${item.product} will be removed from ${item.customer}'s cart record.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#087F8D",
    });

    if (!result.isConfirmed) return;

    setCartItems((current) => current.filter((cart) => cart.id !== item.id));
    Swal.fire({
      icon: "success",
      title: "Removed",
      text: "Cart item removed successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const updateStatus = async (item, status) => {
    setCartItems((current) =>
      current.map((cart) =>
        cart.id === item.id ? { ...cart, status } : cart,
      ),
    );

    Swal.fire({
      icon: "success",
      title: "Status updated",
      text: `${item.cartId} is now ${status}.`,
      timer: 1300,
      showConfirmButton: false,
    });
  };

  return (
    <main className="min-h-screen space-y-5 p-3 text-(--primary) sm:p-5 lg:p-6">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--secondary)">
            Admin Management
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Cart Overview</h1>
          <p className="mt-1 text-sm text-(--secondary)">
            Monitor customer carts, cart value and conversion status.
          </p>
        </div>
        <div className="rounded-xl border border-white/70 bg-white/35 px-4 py-3 text-sm font-semibold backdrop-blur-xl">
          Sep 24, 2026
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Carts" value={statistics.total} subtitle="All cart records" icon={ShoppingCart} />
        <StatCard title="Active Carts" value={statistics.active} subtitle="Currently active" icon={CheckCircle} />
        <StatCard title="Pending Carts" value={statistics.pending} subtitle="Needs attention" icon={Clock3} />
        <StatCard title="Cart Value" value={currency(statistics.totalValue)} subtitle="Combined cart value" icon={Package} />
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/30 p-3 shadow-[0_8px_25px_rgba(80,120,140,0.06)] backdrop-blur-xl sm:p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--secondary)" size={17} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search cart ID, customer, email or product..."
              className="h-11 w-full rounded-xl border border-white/70 bg-white/55 pl-10 pr-10 text-sm text-(--primary) outline-none transition focus:border-(--primary)"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--secondary)"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 min-[480px]:flex-row">
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--secondary)" size={15} />
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="h-11 w-full rounded-xl border border-white/70 bg-white/55 pl-9 pr-8 text-sm outline-none min-[480px]:w-40"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 w-full rounded-xl border border-white/70 bg-white/55 px-3 text-sm outline-none min-[480px]:w-36"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Converted">Converted</option>
              <option value="Abandoned">Abandoned</option>
            </select>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/70 bg-white/30 shadow-[0_8px_25px_rgba(80,120,140,0.06)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/60 px-4 py-4">
          <div>
            <h2 className="text-base font-bold">Cart Records</h2>
            <p className="mt-1 text-xs text-(--secondary)">{filteredItems.length} records found</p>
          </div>
          <Truck size={19} className="text-(--secondary)" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <thead className="bg-white/35 text-xs uppercase tracking-wide text-(--secondary)">
              <tr>
                <th className="px-4 py-3 font-semibold">Cart</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Qty</th>
                <th className="px-4 py-3 font-semibold">Value</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length ? filteredItems.map((item) => (
                <tr key={item.id} className="border-t border-white/60 transition hover:bg-white/25">
                  <td className="px-4 py-4 font-semibold">{item.cartId}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{item.customer}</p>
                    <p className="mt-1 text-xs text-(--secondary)">{item.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium">{item.product}</p>
                    <p className="mt-1 text-xs text-(--secondary)">{item.category}</p>
                  </td>
                  <td className="px-4 py-4">{item.quantity}</td>
                  <td className="px-4 py-4 font-semibold">{currency(item.price * item.quantity)}</td>
                  <td className="px-4 py-4">
                    <select
                      value={item.status}
                      onChange={(event) => updateStatus(item, event.target.value)}
                      className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${statusStyles[item.status] || "bg-white/60"}`}
                    >
                      <option>Active</option>
                      <option>Pending</option>
                      <option>Converted</option>
                      <option>Abandoned</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setSelectedCart(item)} className="rounded-lg bg-white/60 p-2 text-(--primary) transition hover:bg-white" aria-label="View cart">
                        <Eye size={16} />
                      </button>
                      <button type="button" onClick={() => handleDelete(item)} className="rounded-lg bg-rose-100 p-2 text-rose-600 transition hover:bg-rose-200" aria-label="Delete cart">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-sm text-(--secondary)">
                    No cart records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedCart && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/70 bg-[#e8f3ef] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-(--secondary)">Cart Details</p>
                <h2 className="mt-1 text-xl font-bold">{selectedCart.cartId}</h2>
              </div>
              <button type="button" onClick={() => setSelectedCart(null)} className="rounded-lg bg-white/60 p-2" aria-label="Close details">
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 text-sm min-[480px]:grid-cols-2">
              <div className="rounded-xl bg-white/45 p-3"><span className="text-xs text-(--secondary)">Customer</span><p className="mt-1 font-semibold">{selectedCart.customer}</p></div>
              <div className="rounded-xl bg-white/45 p-3"><span className="text-xs text-(--secondary)">Phone</span><p className="mt-1 font-semibold">{selectedCart.phone}</p></div>
              <div className="rounded-xl bg-white/45 p-3"><span className="text-xs text-(--secondary)">Product</span><p className="mt-1 font-semibold">{selectedCart.product}</p></div>
              <div className="rounded-xl bg-white/45 p-3"><span className="text-xs text-(--secondary)">Quantity</span><p className="mt-1 font-semibold">{selectedCart.quantity}</p></div>
              <div className="rounded-xl bg-white/45 p-3"><span className="text-xs text-(--secondary)">Total Value</span><p className="mt-1 font-semibold">{currency(selectedCart.price * selectedCart.quantity)}</p></div>
              <div className="rounded-xl bg-white/45 p-3"><span className="text-xs text-(--secondary)">Last Updated</span><p className="mt-1 font-semibold">{selectedCart.updatedAt}</p></div>
            </div>
            <button type="button" onClick={() => setSelectedCart(null)} className="mt-5 w-full rounded-xl bg-(--primary) px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">Close</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminCart;
