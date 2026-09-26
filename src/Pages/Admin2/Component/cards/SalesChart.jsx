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

import { ChevronDown } from "lucide-react";

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-IN").format(value);
};

const formatYAxis = (value) => {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(1)}Cr`;
  }

  if (value >= 100000) {
    return `${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `${value / 1000}K`;
  }

  return value;
};

const formatDate = (date) => {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="rounded-lg border border-white/70 bg-white/90 px-3 py-2 text-xs shadow-lg backdrop-blur-md">
      <p className="font-semibold text-slate-700">
        {formatDate(item?.date)}
      </p>

      <p className="mt-1 text-teal-600">
        Sales: ₹{formatNumber(payload[0]?.value || 0)}
      </p>
    </div>
  );
};

const SalesChart = ({
  data = [],
  range = 7,
  onRangeChange,
  rangeOptions = [],
}) => {
  return (
    <section
      className="
        min-w-0
        overflow-hidden
        rounded-xl
        border border-white/60
        bg-white/20
        p-2.5
        shadow-[0_4px_18px_rgba(80,120,140,0.06)]
        backdrop-blur-3xl shadow-[0_8px_32px_rgba(31,38,135,0.15)] border border-white/40
      "
    >
      {/* Header */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold text-(--primary)">
          Sales Overview
        </h2>

        <select
          value={range}
          onChange={(event) =>
            onRangeChange?.(Number(event.target.value))
          }
          className="
            max-w-[105px]
            cursor-pointer
            rounded-lg
            border border-slate-200/70
            bg-white/40
            px-2 py-1
            text-[9px]
            text-slate-600
            outline-none
          "
        >
          {rangeOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="h-20 w-full sm:h-24">
        {data.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={data}
              margin={{
                top: 4,
                right: 4,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="salesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#35CDB0"
                    stopOpacity={0.38}
                  />

                  <stop
                    offset="100%"
                    stopColor="#35CDB0"
                    stopOpacity={0.04}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#B9D9D9"
                strokeOpacity={0.35}
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{
                  fontSize: 8,
                  fill: "#56818A",
                }}
                axisLine={false}
                tickLine={false}
                tickMargin={4}
              />

              <YAxis
                tickFormatter={formatYAxis}
                tick={{
                  fontSize: 8,
                  fill: "#56818A",
                }}
                axisLine={false}
                tickLine={false}
                width={28}
                domain={[0, "auto"]}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#35CDB0",
                  strokeDasharray: "3 3",
                }}
              />

              <Area
                type="monotone"
                dataKey="sales"
                stroke="#0BAEC1"
                strokeWidth={1.6}
                fill="url(#salesGradient)"
                dot={{
                  r: 1.8,
                  fill: "#0BAEC1",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 3,
                  fill: "#0BAEC1",
                }}
                isAnimationActive
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-(--muted)">
            No sales data
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(SalesChart);


