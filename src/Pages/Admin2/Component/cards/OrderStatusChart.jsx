import React, { useMemo } from "react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-IN").format(value);
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="rounded-lg border border-white/70 bg-white/90 px-3 py-2 text-xs shadow-lg backdrop-blur-md">
      <p className="font-semibold text-slate-700">
        {item?.name}
      </p>

      <p className="mt-1 text-teal-600">
        Orders: {formatNumber(item?.value || 0)}
      </p>
    </div>
  );
};

const OrderStatusChart = ({
  data = [],
  range = 7,
  onRangeChange,
  rangeOptions = [],
}) => {
  const totalOrders = useMemo(() => {
    return data.reduce(
      (total, item) => total + Number(item.value || 0),
      0
    );
  }, [data]);

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
      <div className="mb-1 flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold text-(--primary)">
          Order Status
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

      {/* Donut and Legend */}
      <div className="flex items-center gap-1">
        {/* Donut Chart */}
        <div className="relative h-24 min-w-0 flex-1">
          {data.length > 0 && totalOrders > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="78%"
                  paddingAngle={0}
                  stroke="none"
                  isAnimationActive
                  animationDuration={500}
                >
                  {data.map((item, index) => (
                    <Cell
                      key={item.name ?? index}
                      fill={item.color || "#087F8D"}
                    />
                  ))}
                </Pie>

                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-[10px] text-(--muted)">
                No Data
              </span>
            </div>
          )}

          {/* Center Content */}
          {totalOrders > 0 && (
            <div
              className="
                pointer-events-none
                absolute inset-0
                flex flex-col
                items-center
                justify-center
              "
            >
              <span className="text-sm font-bold text-slate-700">
                {formatNumber(totalOrders)}
              </span>

              <span className="text-[8px] text-slate-500">
                Orders
              </span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {data.length > 0 ? (
            data.map((item, index) => {
              const percentage =
                totalOrders > 0
                  ? Math.round(
                      (Number(item.value || 0) / totalOrders) * 100
                    )
                  : 0;

              return (
                <div
                  key={item.name ?? index}
                  className="flex items-center justify-between gap-1"
                >
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          item.color || "#087F8D",
                      }}
                    />

                    <span className="truncate text-[9px] text-slate-500">
                      {item.name}
                    </span>
                  </div>

                  <span className="shrink-0 text-[9px] text-slate-500">
                    {formatNumber(item.value)} ({percentage}%)
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-[10px] text-(--muted)">
              No data available
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(OrderStatusChart);


