import React, { useMemo, useState } from "react";

import {
  BarChart3,
  ClipboardList,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  UserPlus,
  Users,
} from "lucide-react";

// Cards
import StatCard from "./Component/cards/StatCard";
import SalesChart from "./Component/cards/SalesChart";
import OrderStatusChart from "./Component/cards/OrderStatusChart";
import ListCard from "./Component/cards/ListCard";
import ActionCard from "./Component/cards/ActionCard";

// =========================================
// RANGE OPTIONS
// =========================================

const rangeOptions = [
  {
    label: "Last 1 Day",
    value: 1,
  },
  {
    label: "Last 7 Days",
    value: 7,
  },
  {
    label: "Last 30 Days",
    value: 30,
  },
  {
    label: "Last 3 Months",
    value: 90,
  },
  {
    label: "Last 6 Months",
    value: 180,
  },
  {
    label: "Last 1 Year",
    value: 365,
  },
  {
    label: "Last 2 Years",
    value: 730,
  },
  {
    label: "Last 5 Years",
    value: 1825,
  },
  {
    label: "Last 10 Years",
    value: 3650,
  },
];

// =========================================
// SALES DATA
// =========================================

const salesData = [
  {
    date: "2026-09-18",
    sales: 15000,
  },
  {
    date: "2026-09-19",
    sales: 24000,
  },
  {
    date: "2026-09-20",
    sales: 16000,
  },
  {
    date: "2026-09-21",
    sales: 20000,
  },
  {
    date: "2026-09-22",
    sales: 30000,
  },
  {
    date: "2026-09-23",
    sales: 31000,
  },
  {
    date: "2026-09-24",
    sales: 43000,
  },
];

// =========================================
// ORDER RECORDS
// =========================================

const orderRecords = [
  {
    date: "2026-09-18",
    status: "Delivered",
    value: 120,
  },
  {
    date: "2026-09-18",
    status: "Processing",
    value: 35,
  },
  {
    date: "2026-09-18",
    status: "Shipped",
    value: 20,
  },
  {
    date: "2026-09-18",
    status: "Cancelled",
    value: 10,
  },
  {
    date: "2026-09-19",
    status: "Delivered",
    value: 140,
  },
  {
    date: "2026-09-19",
    status: "Processing",
    value: 30,
  },
  {
    date: "2026-09-19",
    status: "Shipped",
    value: 25,
  },
  {
    date: "2026-09-19",
    status: "Cancelled",
    value: 12,
  },
  {
    date: "2026-09-20",
    status: "Delivered",
    value: 110,
  },
  {
    date: "2026-09-20",
    status: "Processing",
    value: 28,
  },
  {
    date: "2026-09-20",
    status: "Shipped",
    value: 18,
  },
  {
    date: "2026-09-20",
    status: "Cancelled",
    value: 8,
  },
  {
    date: "2026-09-21",
    status: "Delivered",
    value: 150,
  },
  {
    date: "2026-09-21",
    status: "Processing",
    value: 32,
  },
  {
    date: "2026-09-21",
    status: "Shipped",
    value: 22,
  },
  {
    date: "2026-09-21",
    status: "Cancelled",
    value: 15,
  },
  {
    date: "2026-09-22",
    status: "Delivered",
    value: 130,
  },
  {
    date: "2026-09-22",
    status: "Processing",
    value: 25,
  },
  {
    date: "2026-09-22",
    status: "Shipped",
    value: 20,
  },
  {
    date: "2026-09-22",
    status: "Cancelled",
    value: 10,
  },
  {
    date: "2026-09-23",
    status: "Delivered",
    value: 170,
  },
  {
    date: "2026-09-23",
    status: "Processing",
    value: 30,
  },
  {
    date: "2026-09-23",
    status: "Shipped",
    value: 25,
  },
  {
    date: "2026-09-23",
    status: "Cancelled",
    value: 18,
  },
  {
    date: "2026-09-24",
    status: "Delivered",
    value: 180,
  },
  {
    date: "2026-09-24",
    status: "Processing",
    value: 35,
  },
  {
    date: "2026-09-24",
    status: "Shipped",
    value: 30,
  },
  {
    date: "2026-09-24",
    status: "Cancelled",
    value: 20,
  },
];

// =========================================
// STATUS COLORS
// =========================================

const statusColors = {
  Delivered: "#35CDB0",
  Processing: "#83DCC9",
  Shipped: "#FFC58F",
  Cancelled: "#B8B5F7",
};

// =========================================
// RECENT ORDERS DATA
// =========================================

const recentOrders = [
  {
    id: "#1001",
    customer: "Rahul Sharma",
    products: "2 Items",
    amount: "₹1,299",
    status: "Delivered",
    date: "Sep 24, 2026",
  },
  {
    id: "#1002",
    customer: "Priya Verma",
    products: "1 Item",
    amount: "₹799",
    status: "Processing",
    date: "Sep 24, 2026",
  },
  {
    id: "#1003",
    customer: "Amit Singh",
    products: "3 Items",
    amount: "₹2,499",
    status: "Shipped",
    date: "Sep 23, 2026",
  },
];

// =========================================
// TOP PRODUCTS DATA
// =========================================

const topProducts = [
  {
    id: 1,
    product: "Wireless Headphones",
    sold: 320,
    revenue: "₹95,680",
    image: "🎧",
  },
  {
    id: 2,
    product: "Smart Watch",
    sold: 250,
    revenue: "₹1,24,750",
    image: "⌚",
  },
  {
    id: 3,
    product: "Bluetooth Speaker",
    sold: 180,
    revenue: "₹53,820",
    image: "🔊",
  },
];

// =========================================
// HELPERS
// =========================================

const filterByDateRange = (data, selectedRange) => {
  if (!data.length) {
    return [];
  }

  const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));

  const latestDateString = sortedData[sortedData.length - 1].date;

  const latestDate = new Date(`${latestDateString}T00:00:00`);

  const startDate = new Date(latestDate);

  startDate.setDate(startDate.getDate() - (selectedRange - 1));

  return sortedData.filter((item) => {
    const itemDate = new Date(`${item.date}T00:00:00`);

    return itemDate >= startDate && itemDate <= latestDate;
  });
};

const getOrderStatusData = (records) => {
  const statusMap = {};

  records.forEach((record) => {
    const status = record.status;

    if (!statusMap[status]) {
      statusMap[status] = {
        name: status,
        value: 0,
        color: statusColors[status] || "#087F8D",
      };
    }

    statusMap[status].value += Number(record.value || 0);
  });

  return Object.values(statusMap);
};

// =========================================
// STATUS BADGE
// =========================================

const getStatusBadge = (status) => {
  const statusStyles = {
    Delivered: "bg-emerald-200/70 text-emerald-700",
    Processing: "bg-sky-200/70 text-sky-700",
    Shipped: "bg-orange-200/80 text-orange-700",
    Cancelled: "bg-red-200/70 text-red-700",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-2.5
        py-1
        text-[9px]
        font-medium
        whitespace-nowrap
        sm:text-[10px]
        ${statusStyles[status] || "bg-white/40 text-(--primary)"}
      `}
    >
      {status}
    </span>
  );
};

// =========================================
// DASHBOARD
// =========================================

const orderChartData = [
  { value: 20 }, { value: 28 }, { value: 22 }, { value: 35 },
  { value: 29 }, { value: 42 }, { value: 38 }, { value: 50 },
];
const productChartData = [
  { value: 15 }, { value: 25 }, { value: 20 }, { value: 35 },
  { value: 30 }, { value: 45 }, { value: 40 }, { value: 55 },
];
const customerChartData = [
  { value: 18 }, { value: 30 }, { value: 25 }, { value: 40 },
  { value: 32 }, { value: 48 }, { value: 43 }, { value: 60 },
];
const revenueChartData = [
  { value: 20 }, { value: 15 }, { value: 30 }, { value: 25 },
  { value: 40 }, { value: 35 }, { value: 50 }, { value: 45 },
];

const DashBoard2 = () => {
  // Independent sales filter
  const [salesRange, setSalesRange] = useState(7);

  // Independent order filter
  const [orderRange, setOrderRange] = useState(7);


  // =========================================
  // FILTERED SALES DATA
  // =========================================

  const filteredSalesData = useMemo(() => {
    return filterByDateRange(salesData, salesRange);
  }, [salesRange]);

  // =========================================
  // FILTERED ORDER DATA
  // =========================================

  const filteredOrderRecords = useMemo(() => {
    return filterByDateRange(orderRecords, orderRange);
  }, [orderRange]);

  // =========================================
  // DYNAMIC ORDER STATUS
  // =========================================

  const orderStatusData = useMemo(() => {
    return getOrderStatusData(filteredOrderRecords);
  }, [filteredOrderRecords]);

  const todayDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <>
      <main className="relative z-10 min-w-0 px-2.5 py-2.5 sm:px-3 lg:px-4">
      {/* ========================================= */}
      {/* DASHBOARD HEADER */}
      {/* ========================================= */}

      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold leading-tight text-(--primary) sm:text-2xl">
            Dashboard
          </h1>

          <p className="mt-0.5 text-[11px] text-(--secondary) sm:text-[10px]">
            Here's what's happening with your store today.
          </p>
        </div>

        <div
          className="
            rounded-xl
            border
            border-white/60
            bg-white/20
            px-2.5
            py-1.5
            text-[11px]
            text-(--primary)
            shadow-sm
            backdrop-blur-3xl shadow-[0_8px_32px_rgba(31,38,135,0.15)] border border-white/40
          "
        >
          {todayDate}
        </div>
      </div>

      {/* ========================================= */}
      {/* STATISTICS CARDS */}
      {/* ========================================= */}

      <section
        className="
           grid
    grid-cols-1
    gap-2
    min-[480px]:grid-cols-2
    min-[1100px]:grid-cols-4
        "
      >
        <StatCard
          title="Total Orders"
          value="1,248"
          icon={ShoppingBag}
          trend="+12%"
          trendLabel="from last month"
          variant="teal"
          sparklineData={orderChartData}
        />

        <StatCard
          title="Total Products"
          value="856"
          icon={Package}
          trend="+8%"
          trendLabel="from last month"
          variant="blue"
          sparklineData={productChartData}
        />

        <StatCard
          title="Total Customers"
          value="432"
          icon={Users}
          trend="+15%"
          trendLabel="from last month"
          variant="orange"
          sparklineData={customerChartData}
        />

        <StatCard
          title="Total Revenue"
          value="₹1,25,430"
          icon={BarChart3}
          trend="+18%"
          trendLabel="from last month"
          variant="purple"
          sparklineData={revenueChartData}
        />
      </section>

      {/* ========================================= */}
      {/* MANAGEMENT ACTION CARDS */}
      {/* ========================================= */}

      <section
        className="
        mt-2
          grid
    grid-cols-1
    gap-2
    min-[480px]:grid-cols-2
    min-[1100px]:grid-cols-4
        "
      >
        <ActionCard
          title="Add Product"
          description="Create a new product and add it to your inventory."
          icon={Plus}
          actionLabel="Add Product"
          href="/dashboard/products"
        />

        <ActionCard
          title="Manage Orders"
          description="Review pending orders and update order statuses."
          icon={ClipboardList}
          actionLabel="View Orders"
          href="/dashboard/orders"
        />

        <ActionCard
          title="Add Customer"
          description="Register a new customer and manage customer details."
          icon={UserPlus}
          actionLabel="Add Customer"
          href="/dashboard/customers/add"
        />

        <ActionCard
          title="Store Settings"
          description="Update store preferences and settings."
          icon={Settings}
          actionLabel="Settings"
          href="/dashboard/settings"
        />
      </section>

      {/* ========================================= */}
      {/* OVERVIEW CHARTS */}
      {/* ========================================= */}

      <section
        className="
          mt-2
    grid
    grid-cols-1
    gap-2
    min-[1100px]:grid-cols-[1.45fr_1fr]
        "
      >
        {/* Sales Chart */}
        <SalesChart
          data={filteredSalesData}
          range={salesRange}
          onRangeChange={setSalesRange}
          rangeOptions={rangeOptions}
        />

        {/* Order Status Chart */}
        <OrderStatusChart
          data={orderStatusData}
          range={orderRange}
          onRangeChange={setOrderRange}
          rangeOptions={rangeOptions}
        />
      </section>

      {/* ========================================= */}
      {/* RECENT ORDERS + TOP PRODUCTS */}
      {/* ========================================= */}

      <section
        className="
           mt-2
    grid
    grid-cols-1
    gap-2
    min-[1100px]:grid-cols-[1.45fr_1fr]
        "
      >
        {/* ========================================= */}
        {/* RECENT ORDERS */}
        {/* ========================================= */}

        <ListCard
          title="Recent Orders"
          action={
            <a
              href="/dashboard/orders"
              className="
                text-xs
                font-semibold
                text-(--primary)
                transition-opacity
                hover:opacity-70
              "
            >
              View All
            </a>
          }
          items={recentOrders}
          emptyMessage="No recent orders available"
          renderItem={(order) => (
            <div
              className="
                grid
                grid-cols-[45px_minmax(80px,1fr)_65px_80px]
                items-center
                gap-2
                border-b
                border-white/40
                px-1.5
                py-1.5
                last:border-b-0
                sm:grid-cols-[55px_minmax(100px,1fr)_75px_85px_95px]
              "
            >
              {/* Order ID */}
              <span className="truncate text-[9px] text-(--secondary) sm:text-[10px]">
                {order.id}
              </span>

              {/* Customer */}
              <span className="truncate text-[9px] font-medium text-(--primary) sm:text-[10px]">
                {order.customer}
              </span>

              {/* Products */}
              <span className="truncate text-[9px] text-(--secondary) sm:text-[10px]">
                {order.products}
              </span>

              {/* Amount */}
              <span className="truncate text-[9px] text-(--primary) sm:text-[10px]">
                {order.amount}
              </span>

              {/* Status */}
              <div className="hidden sm:block">
                {getStatusBadge(order.status)}
              </div>

              {/* Date */}
              <span className="hidden truncate text-[9px] text-(--secondary) sm:block sm:text-[10px]">
                {order.date}
              </span>
            </div>
          )}
        />

        {/* ========================================= */}
        {/* TOP PRODUCTS */}
        {/* ========================================= */}

        <ListCard
          title="Top Products"
          action={
            <a
              href="/dashboard/products"
              className="
                text-xs
                font-semibold
                text-(--primary)
                transition-opacity
                hover:opacity-70
              "
            >
              View All
            </a>
          }
          items={topProducts}
          emptyMessage="No products available"
          renderItem={(product) => (
            <div
              className="
                grid
                grid-cols-[22px_minmax(0,1fr)_45px_75px]
                items-center
                gap-2
                border-b
                border-white/40
                px-1.5
                py-1.5
                last:border-b-0
                sm:grid-cols-[25px_minmax(0,1fr)_50px_85px]
              "
            >
              {/* Rank */}
              <span className="text-[9px] text-(--secondary) sm:text-[10px]">
                {product.id}
              </span>

              {/* Product */}
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/40 text-xs">
                  {product.image}
                </span>

                <span className="truncate text-[9px] font-medium text-(--primary) sm:text-[10px]">
                  {product.product}
                </span>
              </div>

              {/* Sold */}
              <span className="text-[9px] text-(--secondary) sm:text-[10px]">
                {product.sold}
              </span>

              {/* Revenue */}
              <span className="truncate text-[9px] text-(--primary) sm:text-[10px]">
                {product.revenue}
              </span>
            </div>
          )}
        />
      </section>
    </main>
    </>
  );
};

export default DashBoard2;








