import React, { useMemo, useState } from "react";
import {
  CheckCircle,
  ChevronDown,
  Eye,
  Filter,
  Package,
  Search,
  ShoppingBag,
  Truck,
  X,
  XCircle,
  Clock,
  Download,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import StatCard from "./Component/cards/StatCard";

const initialOrders = [
  {
    id: "ORD-1001",
    customer: { name: "Rahul Kumar", email: "rahul@example.com", phone: "+91 9876543210" },
    items: [
      { name: "Oversized Cotton T-Shirt", quantity: 2, price: 799 },
      { name: "Casual Shirt", quantity: 1, price: 1199 },
    ],
    total: 2797,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "Delivered",
    date: "2026-09-24T10:30:00",
    address: "Main Road, Ranchi, Jharkhand",
  },
  {
    id: "ORD-1002",
    customer: { name: "Aman Singh", email: "aman@example.com", phone: "+91 9876501234" },
    items: [{ name: "Regular Fit Jeans", quantity: 1, price: 1499 }],
    total: 1499,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    status: "Processing",
    date: "2026-09-23T15:15:00",
    address: "Station Road, Patna, Bihar",
  },
  {
    id: "ORD-1003",
    customer: { name: "Priya Sharma", email: "priya@example.com", phone: "+91 9123456780" },
    items: [{ name: "Women Cotton Kurti", quantity: 2, price: 899 }],
    total: 1798,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    status: "Shipped",
    date: "2026-09-22T12:00:00",
    address: "MG Road, Delhi",
  },
  {
    id: "ORD-1004",
    customer: { name: "Neha Verma", email: "neha@example.com", phone: "+91 9000000000" },
    items: [{ name: "Classic Hoodie", quantity: 1, price: 1299 }],
    total: 1299,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "Cancelled",
    date: "2026-09-21T09:45:00",
    address: "Sector 5, Noida, Uttar Pradesh",
  },
];

const statusOptions = ["All Status", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const paymentOptions = ["All Payments", "Paid", "Pending", "Failed", "Refunded"];

const statusClasses = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-violet-100 text-violet-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

const paymentClasses = {
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed: "bg-red-100 text-red-700",
  Refunded: "bg-slate-100 text-slate-700",
};

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const AdminOrders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [paymentFilter, setPaymentFilter] = useState("All Payments");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  const statistics = useMemo(() => {
    const totalRevenue = orders
      .filter((order) => order.paymentStatus === "Paid")
      .reduce((sum, order) => sum + order.total, 0);

    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter((order) => order.status === "Pending").length,
      processingOrders: orders.filter((order) => order.status === "Processing").length,
      deliveredOrders: orders.filter((order) => order.status === "Delivered").length,
      totalRevenue,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    const result = orders.filter((order) => {
      const matchesSearch =
        !search ||
        order.id.toLowerCase().includes(search) ||
        order.customer.name.toLowerCase().includes(search) ||
        order.customer.email.toLowerCase().includes(search) ||
        order.customer.phone.toLowerCase().includes(search);

      const matchesStatus = statusFilter === "All Status" || order.status === statusFilter;
      const matchesPayment = paymentFilter === "All Payments" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });

    result.sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortBy === "amount-low") return a.total - b.total;
      if (sortBy === "amount-high") return b.total - a.total;
      return new Date(b.date) - new Date(a.date);
    });

    return result;
  }, [orders, searchTerm, statusFilter, paymentFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ordersPerPage));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Status");
    setPaymentFilter("All Payments");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const handleStatusChange = async (order, nextStatus) => {
    if (nextStatus === order.status) return;

    setOrders((previousOrders) =>
      previousOrders.map((item) =>
        item.id === order.id ? { ...item, status: nextStatus } : item,
      ),
    );

    await Swal.fire({
      title: "Order Updated",
      text: `${order.id} status changed to ${nextStatus}.`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: "rounded-2xl" },
    });
  };

  const handleDeleteOrder = async (order) => {
    const result = await Swal.fire({
      title: "Delete Order?",
      text: `Are you sure you want to delete ${order.id}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      buttonsStyling: false,
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600",
        cancelButton: "mr-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100",
      },
    });

    if (!result.isConfirmed) return;

    setOrders((previousOrders) => previousOrders.filter((item) => item.id !== order.id));
    setSelectedOrder(null);
    setCurrentPage(1);

    await Swal.fire({
      title: "Deleted!",
      text: `${order.id} has been removed.`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: "rounded-2xl" },
    });
  };

  const handleExportCSV = () => {
    const headers = ["Order ID", "Customer", "Email", "Total", "Payment", "Order Status", "Date"];
    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer.name,
      order.customer.email,
      order.total,
      order.paymentStatus,
      order.status,
      formatDate(order.date),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="min-w-0 px-3 pb-8 sm:px-5 lg:px-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--primary) sm:text-3xl">Orders</h1>
          <p className="mt-1 text-sm text-(--secondary)">
            Manage customer orders, payments and delivery status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/30 px-3 py-2 text-sm font-semibold text-(--primary) backdrop-blur-xl transition hover:bg-white/50"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 min-[1100px]:grid-cols-4">
        <StatCard title="Total Orders" value={statistics.totalOrders} icon={ShoppingBag} trendLabel="All orders" variant="blue" />
        <StatCard title="Pending Orders" value={statistics.pendingOrders} icon={Clock} trendLabel="Awaiting action" variant="orange" />
        <StatCard title="Processing" value={statistics.processingOrders} icon={Truck} trendLabel="Being prepared" variant="purple" />
        <StatCard title="Delivered" value={statistics.deliveredOrders} icon={CheckCircle} trendLabel={formatPrice(statistics.totalRevenue)} variant="teal" />
      </div>

      <div className="mb-5 rounded-2xl border border-white/60 bg-white/30 p-4 shadow-[0_4px_18px_rgba(80,120,140,0.05)] backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-(--primary)" />
            <h2 className="text-sm font-semibold text-(--primary)">Filter Orders</h2>
          </div>
          <button type="button" onClick={handleResetFilters} className="inline-flex items-center gap-1 text-xs font-semibold text-(--primary) transition hover:opacity-70">
            <X size={14} /> Reset
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => { setSearchTerm(event.target.value); setCurrentPage(1); }}
              placeholder="Search order or customer..."
              className="h-10 w-full rounded-xl border border-white/70 bg-white/45 pl-9 pr-3 text-sm text-(--primary) outline-none placeholder:text-(--muted) focus:border-(--primary)"
            />
          </div>

          <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1); }} className="h-10 w-full rounded-xl border border-white/70 bg-white/45 px-3 text-sm text-(--primary) outline-none focus:border-(--primary)">
            {statusOptions.map((option) => <option key={option}>{option}</option>)}
          </select>

          <select value={paymentFilter} onChange={(event) => { setPaymentFilter(event.target.value); setCurrentPage(1); }} className="h-10 w-full rounded-xl border border-white/70 bg-white/45 px-3 text-sm text-(--primary) outline-none focus:border-(--primary)">
            {paymentOptions.map((option) => <option key={option}>{option}</option>)}
          </select>

          <select value={sortBy} onChange={(event) => { setSortBy(event.target.value); setCurrentPage(1); }} className="h-10 w-full rounded-xl border border-white/70 bg-white/45 px-3 text-sm text-(--primary) outline-none focus:border-(--primary)">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="amount-low">Amount: Low to High</option>
            <option value="amount-high">Amount: High to Low</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/30 shadow-[0_4px_18px_rgba(80,120,140,0.05)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/60 px-4 py-4">
          <div>
            <h2 className="text-base font-bold text-(--primary)">Order Management</h2>
            <p className="mt-1 text-xs text-(--secondary)">{filteredOrders.length} orders found</p>
          </div>
        </div>

        {paginatedOrders.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-4 text-center">
            <Package size={38} className="mb-3 text-(--muted)" />
            <h3 className="text-base font-semibold text-(--primary)">No Orders Found</h3>
            <p className="mt-1 text-sm text-(--secondary)">Try changing your search or filters.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/60 text-xs text-(--secondary)">
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/40 text-sm transition hover:bg-white/25">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-(--primary)">{order.id}</p>
                      <p className="mt-1 text-xs text-(--secondary)">{order.items.length} item(s)</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-(--primary)">{order.customer.name}</p>
                      <p className="mt-1 text-xs text-(--secondary)">{order.customer.email}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-(--primary)">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${paymentClasses[order.paymentStatus] || "bg-slate-100 text-slate-700"}`}>
                        {order.paymentStatus}
                      </span>
                      <p className="mt-1 text-xs text-(--secondary)">{order.paymentMethod}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(event) => handleStatusChange(order, event.target.value)}
                        className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold outline-none ${statusClasses[order.status] || "bg-slate-100 text-slate-700"}`}
                      >
                        {statusOptions.slice(1).map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-(--secondary)">{formatDate(order.date)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button type="button" title="View Order" onClick={() => setSelectedOrder(order)} className="rounded-lg bg-white/50 p-2 text-(--primary) transition hover:bg-white/80">
                          <Eye size={15} />
                        </button>
                        <button type="button" title="Delete Order" onClick={() => handleDeleteOrder(order)} className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-white/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-(--secondary)">Showing {filteredOrders.length === 0 ? 0 : (currentPage - 1) * ordersPerPage + 1} to {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders</p>
          <div className="flex items-center gap-2">
            <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="rounded-lg border border-white/70 bg-white/40 px-3 py-1.5 text-xs font-semibold text-(--primary) disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            <span className="rounded-lg bg-(--primary) px-3 py-1.5 text-xs font-semibold text-white">{currentPage}</span>
            <button type="button" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="rounded-lg border border-white/70 bg-white/40 px-3 py-1.5 text-xs font-semibold text-(--primary) disabled:cursor-not-allowed disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/60 bg-white/95 p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-(--primary)">Order Details</h2>
                <p className="mt-1 text-xs text-(--secondary)">{selectedOrder.id}</p>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)} className="rounded-lg bg-gray-100 p-2 text-gray-600"><X size={17} /></button>
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 text-sm sm:grid-cols-2">
              <div><p className="text-xs text-gray-500">Customer</p><p className="font-semibold text-gray-800">{selectedOrder.customer.name}</p></div>
              <div><p className="text-xs text-gray-500">Phone</p><p className="font-semibold text-gray-800">{selectedOrder.customer.phone}</p></div>
              <div><p className="text-xs text-gray-500">Payment</p><p className="font-semibold text-gray-800">{selectedOrder.paymentMethod} - {selectedOrder.paymentStatus}</p></div>
              <div><p className="text-xs text-gray-500">Order Date</p><p className="font-semibold text-gray-800">{formatDate(selectedOrder.date)}</p></div>
              <div className="sm:col-span-2"><p className="text-xs text-gray-500">Delivery Address</p><p className="font-semibold text-gray-800">{selectedOrder.address}</p></div>
            </div>

            <h3 className="mt-5 text-sm font-bold text-(--primary)">Items</h3>
            <div className="mt-2 space-y-2">
              {selectedOrder.items.map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 text-sm">
                  <div><p className="font-semibold text-gray-800">{item.name}</p><p className="text-xs text-gray-500">Qty: {item.quantity}</p></div>
                  <p className="font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-4 text-base font-bold text-gray-800"><span>Total</span><span>{formatPrice(selectedOrder.total)}</span></div>
            <button type="button" onClick={() => setSelectedOrder(null)} className="mt-5 w-full rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white">Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminOrders;
