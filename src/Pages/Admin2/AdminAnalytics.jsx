import React, { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Download,
  Filter,
  IndianRupee,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import Swal from "sweetalert2";

const analyticsData = {
  daily: {
    label: "Today",
    revenue: 28450,
    orders: 38,
    customers: 26,
    products: 74,
    revenueChange: 12.8,
    orderChange: 8.4,
    sales: [4200, 5100, 3900, 6200, 4800, 7250, 7000],
    labels: ["10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"],
  },
  weekly: {
    label: "This Week",
    revenue: 186400,
    orders: 246,
    customers: 164,
    products: 438,
    revenueChange: 18.6,
    orderChange: 14.2,
    sales: [18400, 22600, 19800, 30200, 26400, 38200, 26800],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  monthly: {
    label: "This Month",
    revenue: 742800,
    orders: 986,
    customers: 628,
    products: 1284,
    revenueChange: 24.4,
    orderChange: 19.8,
    sales: [82000, 104000, 96000, 126000, 118000, 146000, 70800],
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"],
  },
};

const topProducts = [
  { name: "Classic Cotton Shirt", category: "Garments", sales: 184, revenue: 147016 },
  { name: "Premium Face Serum", category: "Cosmetics", sales: 142, revenue: 184158 },
  { name: "Slim Fit Denim", category: "Garments", sales: 118, revenue: 176882 },
  { name: "Hydrating Moisturizer", category: "Cosmetics", sales: 96, revenue: 57504 },
];

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const StatCard = ({ title, value, change, icon: Icon, positive = true }) => (
  <div className="rounded-2xl border border-white/70 bg-white/35 p-4 shadow-[0_8px_24px_rgba(80,120,140,0.08)] backdrop-blur-xl">
    <div className="flex items-center justify-between gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/55 text-(--primary)">
        <Icon size={19} strokeWidth={1.8} />
      </div>
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${positive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
        {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {change}%
      </span>
    </div>
    <p className="mt-4 text-xs font-medium text-(--secondary)">{title}</p>
    <h3 className="mt-1 text-xl font-bold text-(--primary)">{value}</h3>
  </div>
);

const AdminAnalytics = () => {
  const [range, setRange] = useState("weekly");
  const [category, setCategory] = useState("All");
  const data = analyticsData[range];

  const filteredProducts = useMemo(() => {
    if (category === "All") return topProducts;
    return topProducts.filter((product) => product.category === category);
  }, [category]);

  const maxSales = Math.max(...data.sales);

  const handleExport = () => {
    const report = [
      ["Metric", "Value"],
      ["Period", data.label],
      ["Revenue", data.revenue],
      ["Orders", data.orders],
      ["Customers", data.customers],
      ["Products Sold", data.products],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([report], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `analytics-${range}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);

    Swal.fire({
      icon: "success",
      title: "Report exported",
      text: "Your analytics CSV report has been downloaded.",
      timer: 1800,
      showConfirmButton: false,
    });
  };

  return (
    <section className="min-h-screen space-y-5 px-3 pb-8 text-(--primary) sm:px-5 lg:px-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--secondary)">Management</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Analytics Overview</h1>
          <p className="mt-1 text-sm text-(--secondary)">Track sales, customers, orders and product performance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/35 px-3 py-2 backdrop-blur-xl">
            <CalendarDays size={16} />
            <select value={range} onChange={(event) => setRange(event.target.value)} className="bg-transparent text-xs font-semibold outline-none">
              <option value="daily">Today</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
            </select>
          </div>
          <button type="button" onClick={handleExport} className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90">
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value={currency(data.revenue)} change={data.revenueChange} icon={IndianRupee} />
        <StatCard title="Total Orders" value={data.orders.toLocaleString("en-IN")} change={data.orderChange} icon={ShoppingCart} />
        <StatCard title="Customers" value={data.customers.toLocaleString("en-IN")} change={9.6} icon={Users} />
        <StatCard title="Products Sold" value={data.products.toLocaleString("en-IN")} change={11.4} icon={Package} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.45fr_1fr]">
        <div className="rounded-2xl border border-white/70 bg-white/35 p-4 shadow-[0_8px_24px_rgba(80,120,140,0.08)] backdrop-blur-xl sm:p-5">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-bold">Revenue Performance</h2>
              <p className="mt-1 text-xs text-(--secondary)">{data.label} revenue breakdown</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700"><TrendingUp size={14} /> Growing</div>
          </div>
          <div className="mt-7 flex h-64 items-end gap-2 sm:gap-4">
            {data.sales.map((sale, index) => (
              <div key={`${range}-${index}`} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
                <span className="hidden text-[10px] font-semibold text-(--secondary) sm:block">{currency(sale)}</span>
                <div className="group relative flex h-48 w-full items-end justify-center rounded-t-lg bg-white/35">
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-(--primary) to-cyan-300 transition-all duration-300 group-hover:opacity-75" style={{ height: `${(sale / maxSales) * 100}%` }} />
                </div>
                <span className="text-[10px] font-medium text-(--secondary)">{data.labels[index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white/35 p-4 shadow-[0_8px_24px_rgba(80,120,140,0.08)] backdrop-blur-xl sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <div><h2 className="text-base font-bold">Order Summary</h2><p className="mt-1 text-xs text-(--secondary)">Order status distribution</p></div>
            <BarChart3 size={19} />
          </div>
          <div className="mt-6 space-y-5">
            {[{ label: "Completed", value: 68, className: "bg-emerald-400" }, { label: "Processing", value: 18, className: "bg-sky-400" }, { label: "Pending", value: 9, className: "bg-amber-400" }, { label: "Cancelled", value: 5, className: "bg-rose-400" }].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-xs"><span className="font-semibold">{item.label}</span><span className="text-(--secondary)">{item.value}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-white/65"><div className={`h-full rounded-full ${item.className}`} style={{ width: `${item.value}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/35 p-4 shadow-[0_8px_24px_rgba(80,120,140,0.08)] backdrop-blur-xl sm:p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div><h2 className="text-base font-bold">Top Performing Products</h2><p className="mt-1 text-xs text-(--secondary)">Products with the highest sales performance</p></div>
          <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/40 px-3 py-2"><Filter size={14} /><select value={category} onChange={(event) => setCategory(event.target.value)} className="bg-transparent text-xs font-semibold outline-none"><option>All</option><option>Garments</option><option>Cosmetics</option></select></div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead><tr className="border-b border-white/60 text-(--secondary)"><th className="px-3 py-3 font-semibold">Product</th><th className="px-3 py-3 font-semibold">Category</th><th className="px-3 py-3 font-semibold">Units Sold</th><th className="px-3 py-3 font-semibold">Revenue</th></tr></thead>
            <tbody>{filteredProducts.map((product) => <tr key={product.name} className="border-b border-white/40 last:border-0"><td className="px-3 py-3 font-semibold">{product.name}</td><td className="px-3 py-3 text-(--secondary)">{product.category}</td><td className="px-3 py-3">{product.sales}</td><td className="px-3 py-3 font-semibold">{currency(product.revenue)}</td></tr>)}</tbody>
          </table>
          {!filteredProducts.length && <p className="py-8 text-center text-xs text-(--secondary)">No products found.</p>}
        </div>
      </div>
    </section>
  );
};

export default AdminAnalytics;
