import React, { useEffect, useState } from "react";
import {
  BarChart3,
  ClipboardList,
  Package,
  Plus,
  Settings,
  UserPlus,
  Users,
  TrendingUp
} from "lucide-react";

// Cards
import StatCard from "./Component/cards/StatCard";
import ListCard from "./Component/cards/ListCard";
import ActionCard from "./Component/cards/ActionCard";

const DashBoard = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch trends from our API!
  useEffect(() => {
    fetch('/api/get-trends')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setTrends(data.data.slice(0, 10)); // Top 10
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch trends", err);
        setLoading(false);
      });
  }, []);

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Dummy Chart Data
  const orderChartData = [12, 18, 15, 22, 19, 28, 25];
  const customerChartData = [5, 8, 12, 15, 20, 25, 30];

  return (
    <main className="mx-auto w-full max-w-7xl">
      {/* ========================================= */}
      {/* PAGE HEADER */}
      {/* ========================================= */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {todayDate}
        </div>
      </div>

      {/* ========================================= */}
      {/* STATISTICS CARDS */}
      {/* ========================================= */}
      <section className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 min-[1100px]:grid-cols-4">
        <StatCard
          title="Total Users"
          value="1,248"
          icon={Users}
          trend="+12%"
          trendLabel="from last month"
          variant="teal"
          sparklineData={orderChartData}
        />
        <StatCard
          title="Trending Keywords"
          value={trends.length > 0 ? trends.length + "+" : "Loading..."}
          icon={TrendingUp}
          trend="Live"
          trendLabel="Google RSS"
          variant="blue"
          sparklineData={customerChartData}
        />
        <StatCard
          title="Published Content"
          value="15"
          icon={Package}
          trend="+3"
          trendLabel="from last month"
          variant="orange"
          sparklineData={customerChartData}
        />
        <StatCard
          title="Page Views"
          value="45K"
          icon={BarChart3}
          trend="+18%"
          trendLabel="from last month"
          variant="purple"
          sparklineData={orderChartData}
        />
      </section>

      {/* ========================================= */}
      {/* MANAGEMENT ACTION CARDS */}
      {/* ========================================= */}
      <section className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 min-[1100px]:grid-cols-4">
        <ActionCard
          title="Sync Trends"
          description="Manually fetch latest SEO keywords from Google Trends."
          icon={TrendingUp}
          actionLabel="Fetch Now"
          href="/api/fetch-trends"
          target="_blank"
        />
        <ActionCard
          title="Write Content"
          description="Draft new blogs or articles based on trends."
          icon={ClipboardList}
          actionLabel="Create Post"
          href="/dashboard/products"
        />
        <ActionCard
          title="Manage Users"
          description="View registered users and active sessions."
          icon={UserPlus}
          actionLabel="View Users"
          href="/dashboard/customers"
        />
        <ActionCard
          title="Store Settings"
          description="Update global preferences and configuration."
          icon={Settings}
          actionLabel="Settings"
          href="/dashboard/store-settings"
        />
      </section>

      {/* ========================================= */}
      {/* RECENT TRENDS LIST */}
      {/* ========================================= */}
      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ListCard
          title="Top SEO Opportunities"
          action={
            <a href="/dashboard/orders" className="text-xs font-semibold text-indigo-600 transition-opacity hover:opacity-70 dark:text-indigo-400">
              View All
            </a>
          }
          items={loading ? [] : trends}
          emptyMessage={loading ? "Loading trends..." : "No recent trends available"}
          renderItem={(trend, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[30px_minmax(100px,1fr)_100px_80px] items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-3 py-3 last:border-b-0"
            >
              <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
              <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100 capitalize">
                {trend.keyword}
              </span>
              <span className="truncate text-xs font-medium text-green-600 dark:text-green-400">
                Traffic: {trend.traffic}
              </span>
              <span className="text-xs text-slate-500">
                {new Date(trend.date).toLocaleDateString()}
              </span>
            </div>
          )}
        />
        
        {/* Placeholder for Content Drafts */}
        <ListCard
          title="Recent Content Drafts"
          action={
            <a href="/dashboard/products" className="text-xs font-semibold text-indigo-600 transition-opacity hover:opacity-70 dark:text-indigo-400">
              Manage
            </a>
          }
          items={[
            { title: "Best AI Study Tools", status: "Published" },
            { title: "How to use sticky notes", status: "Draft" }
          ]}
          emptyMessage="No drafts available"
          renderItem={(post, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 px-3 py-3 last:border-b-0"
            >
              <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {post.title}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {post.status}
              </span>
            </div>
          )}
        />
      </section>
    </main>
  );
};

export default DashBoard;
