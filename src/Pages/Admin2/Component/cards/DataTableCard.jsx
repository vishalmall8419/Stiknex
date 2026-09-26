import React from "react";

const DataTableCard = ({
  title,
  subtitle,
  columns = [],
  data = [],
  action,
  emptyMessage = "No data available",
  className = "",
}) => {
  return (
    <section
      className={`
        relative overflow-hidden rounded-3xl
        border border-white/60
        bg-white/30
        p-4 sm:p-5
        shadow-[0_8px_30px_rgba(80,120,140,0.08)]
        backdrop-blur-xl
        ${className}
      `}
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
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

      <div className="relative w-full overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/60 text-sm text-(--secondary)">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-3 py-3 font-semibold"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id ?? row._id ?? rowIndex}
                  className="border-b border-white/40 text-sm text-(--primary) transition-colors hover:bg-white/20"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-3 py-3"
                    >
                      {column.render
                        ? column.render(row, rowIndex)
                        : row[column.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="px-3 py-8 text-center text-sm text-(--muted)"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DataTableCard;