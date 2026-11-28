import React from "react";

const ListCard = ({
  title,
  subtitle,
  items = [],
  renderItem,
  action,
  emptyMessage = "No items available",
  className = "",
}) => {
  return (
    <section
      className={`
        relative overflow-hidden rounded-3xl
        border border-white/60
        bg-white/20
        p-5
        shadow-[0_8px_30px_rgba(80,120,140,0.08)]
        backdrop-blur-3xl shadow-[0_8px_32px_rgba(31,38,135,0.15)] border border-white/40
        ${className}
      `}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
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

      <div className="flex flex-col gap-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={item.id ?? item._id ?? index}
              className="rounded-2xl transition-colors hover:bg-white/20"
            >
              {renderItem ? (
                renderItem(item, index)
              ) : (
                <div className="px-3 py-3 text-sm text-(--primary)">
                  {item.name ?? item.title ?? "Unnamed item"}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="py-6 text-center text-sm text-(--muted)">
            {emptyMessage}
          </p>
        )}
      </div>
    </section>
  );
};

export default React.memo(ListCard);

