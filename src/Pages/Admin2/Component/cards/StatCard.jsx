import React from "react";

import {
  Line,
  LineChart,
  ResponsiveContainer,
} from "recharts";


const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = "from last month",
  trendType = "positive",
  variant = "teal",
  sparklineData = [],
  className = "",
}) => {
  const variants = {
    teal: {
      card: "rgba(207, 244, 232, 0.72)",
      icon: "#A6E8D5",
      iconColor: "#087F8D",
      line: "#35CDB0",
    },

    blue: {
      card: "rgba(207, 232, 250, 0.78)",
      icon: "#B3DDF8",
      iconColor: "#2184D5",
      line: "#369BFF",
    },

    orange: {
      card: "rgba(255, 232, 213, 0.78)",
      icon: "#FFD7B8",
      iconColor: "#F28D43",
      line: "#FF9D54",
    },

    purple: {
      card: "rgba(226, 224, 252, 0.80)",
      icon: "#D0CDFB",
      iconColor: "#7770E8",
      line: "#9992FF",
    },
  };

  const selectedVariant =
    variants[variant] || variants.teal;

  const trendColor =
    trendType === "negative"
      ? "text-red-500"
      : trendType === "neutral"
        ? "text-slate-500"
        : "text-emerald-600";

  return (
    <article
      className={`
        relative min-w-0 overflow-hidden
        rounded-xl
        px-3 py-3
        shadow-[0_4px_18px_rgba(80,120,140,0.06)]
        backdrop-blur-3xl shadow-[0_8px_32px_rgba(31,38,135,0.15)] border border-white/40
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_8px_24px_rgba(80,120,140,0.12)]
        ${className}
      `}
      style={{
        background: selectedVariant.card,
      }}
    >
      <div className="flex items-center gap-2.5">

        {/* Icon */}
        <div
          className="
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-lg
          "
          style={{
            backgroundColor: selectedVariant.icon,
            color: selectedVariant.iconColor,
          }}
        >
          {Icon && (
            <Icon
              size={19}
              strokeWidth={1.8}
            />
          )}
        </div>


        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[9px] font-medium text-(--secondary)">
            {title}
          </p>

          <h3 className="mt-0.5 truncate text-[17px] font-bold leading-tight text-(--primary)">
            {value}
          </h3>

          {trend && (
            <p
              className={`
                mt-1 truncate text-[8px] font-medium
                ${trendColor}
              `}
            >
              <span className="font-bold">
                {trendType === "negative" ? "↓" : "↑"}{" "}
                {trend}
              </span>{" "}

              <span className="text-(--secondary)">
                {trendLabel}
              </span>
            </p>
          )}
        </div>


        {/* Dynamic Mini Line Chart */}
        <div className="hidden h-7 w-10 shrink-0 sm:block">
          {sparklineData.length > 1 && (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={sparklineData}
                margin={{
                  top: 2,
                  right: 0,
                  bottom: 2,
                  left: 0,
                }}
              >
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={selectedVariant.line}
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                  isAnimationActive={true}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </article>
  );
};


export default React.memo(StatCard);

