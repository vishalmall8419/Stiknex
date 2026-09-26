import React, { useMemo } from "react";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const DistributionCard = ({
  title,
  subtitle,
  data = [],
  total,
  centerLabel = "Total",
  action,
  className = "",
}) => {
  const chartData = useMemo(() => {
    return data
      .map((item) => ({
        ...item,
        value: Number(item.value || 0),
      }))
      .filter((item) => item.value > 0);
  }, [data]);

  const calculatedTotal = useMemo(() => {
    return chartData.reduce(
      (sum, item) => sum + item.value,
      0
    );
  }, [chartData]);

  const chartTotal = total ?? calculatedTotal;

  return (
    <section
      className={`
        relative min-w-0 overflow-hidden
        rounded-3xl
        border border-white/60
        bg-white/30
        p-5
        shadow-[0_8px_30px_rgba(80,120,140,0.08)]
        backdrop-blur-xl
        transition-all duration-300
        hover:shadow-[0_14px_35px_rgba(80,120,140,0.12)]
        ${className}
      `}
    >
      {/* Liquid Highlight */}
      <div
        className="
          pointer-events-none
          absolute -right-14 -top-14
          h-36 w-36
          rounded-full
          bg-white/30
          blur-3xl
        "
      />

      {/* Header */}
      <header
        className="
          relative
          flex flex-wrap
          items-start
          justify-between
          gap-3
        "
      >
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-(--primary)">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-(--secondary)">
              {subtitle}
            </p>
          )}
        </div>

        {action && <div>{action}</div>}
      </header>

      {/* Chart + Legend */}
      <div
        className="
          relative mt-6
          flex flex-col
          items-center gap-6
          sm:flex-row
          sm:items-center
        "
      >
        {/* Donut Chart */}
        <div className="relative h-44 w-44 shrink-0">
          {chartData.length > 0 && calculatedTotal > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius="62%"
                  outerRadius="88%"
                  paddingAngle={3}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                  isAnimationActive
                  animationDuration={700}
                >
                  {chartData.map((item, index) => (
                    <Cell
                      key={item.id ?? item.label ?? index}
                      fill={item.color || "#087F8D"}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    Number(value).toLocaleString("en-IN"),
                    name,
                  ]}
                  contentStyle={{
                    border: "1px solid rgba(255,255,255,0.65)",
                    borderRadius: "12px",
                    background: "rgba(235,247,244,0.94)",
                    backdropFilter: "blur(12px)",
                    boxShadow:
                      "0 8px 24px rgba(80,120,140,0.12)",
                    color: "#18372B",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div
              className="
                flex h-full w-full
                items-center justify-center
                rounded-full
                border-[22px]
                border-[#D5E4E3]
              "
            >
              <span className="text-xs text-(--muted)">
                No Data
              </span>
            </div>
          )}

          {/* Center Content */}
          {chartData.length > 0 && calculatedTotal > 0 && (
            <div
              className="
                pointer-events-none
                absolute inset-0
                flex flex-col
                items-center justify-center
              "
            >
              <span className="text-2xl font-bold text-(--primary)">
                {Number(chartTotal).toLocaleString("en-IN")}
              </span>

              <span className="mt-1 text-xs text-(--secondary)">
                {centerLabel}
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Legend */}
        <div className="flex w-full min-w-0 flex-1 flex-col gap-3">
          {chartData.length > 0 ? (
            chartData.map((item, index) => {
              const percentage =
                calculatedTotal > 0
                  ? ((item.value / calculatedTotal) * 100).toFixed(1)
                  : "0.0";

              return (
                <div
                  key={item.id ?? item.label ?? index}
                  className="
                    flex items-center
                    justify-between
                    gap-3
                  "
                >
                  {/* Label */}
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: item.color || "#087F8D",
                      }}
                    />

                    <span className="truncate text-sm text-(--secondary)">
                      {item.label}
                    </span>
                  </div>

                  {/* Value + Percentage */}
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-semibold text-(--primary)">
                      {item.value.toLocaleString("en-IN")}
                    </span>

                    <span className="text-xs text-(--muted)">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-(--muted)">
              No data available
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DistributionCard;