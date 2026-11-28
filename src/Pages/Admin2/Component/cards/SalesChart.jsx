import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const formatNumber = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-white/70 bg-white/90 px-3 py-2 text-xs shadow-lg backdrop-blur-md dark:bg-slate-800 dark:border-slate-700 dark:text-white">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {formatNumber(entry.value)}
        </p>
      ))}
    </div>
  );
};

const AnalyticsChart = ({
  title = "Analytics Overview",
  data = [],
}) => {
  return (
    <section
      className="
        w-full
        min-w-0
        overflow-hidden
        rounded-2xl
        bg-white/60 dark:bg-white/5
        p-4
        backdrop-blur-xl border border-white/40 dark:border-white/10
        shadow-lg
      "
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <div className="h-[250px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#94a3b8"
                strokeOpacity={0.2}
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />

              <YAxis
                tickFormatter={formatNumber}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="pageViews"
                name="Page Views"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorViews)"
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="users"
                name="Users"
                stroke="#4f46e5"
                strokeWidth={2}
                fill="url(#colorUsers)"
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No chart data available
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(AnalyticsChart);
