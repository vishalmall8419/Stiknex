import React from "react";

const OrderCard = ({
  orderId,
  customerName,
  customerImage,
  productCount,
  amount,
  status = "Pending",
  date,
  onClick,
  actions,
  className = "",
}) => {
  const statusStyles = {
    Delivered: "bg-emerald-100/70 text-emerald-700",
    Processing: "bg-sky-100/70 text-sky-700",
    Shipped: "bg-orange-100/70 text-orange-700",
    Pending: "bg-yellow-100/70 text-yellow-700",
    Cancelled: "bg-red-100/70 text-red-600",
  };

  const currentStatus =
    statusStyles[status] || "bg-white/50 text-(--primary)";

  return (
    <article
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-3xl
        border border-white/60
        bg-white/30
        p-4 sm:p-5
        shadow-[0_8px_30px_rgba(80,120,140,0.08)]
        backdrop-blur-xl
        transition-all duration-300
        ${onClick ? "cursor-pointer hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-(--muted)">Order ID</p>

          <h3 className="mt-1 font-semibold text-(--primary)">
            {orderId || "—"}
          </h3>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${currentStatus}`}
        >
          {status}
        </span>
      </div>

      <div className="my-4 h-px bg-white/50" />

      <div className="flex items-center gap-3">
        {customerImage ? (
          <img
            src={customerImage}
            alt={customerName || "Customer"}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-sm font-semibold text-(--primary)">
            {customerName?.charAt(0)?.toUpperCase() || "C"}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-(--primary)">
            {customerName || "Unknown Customer"}
          </p>

          <p className="text-xs text-(--muted)">
            {productCount ?? 0} Items
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-(--muted)">Total Amount</p>

          <p className="mt-1 text-lg font-bold text-(--primary)">
            {amount || "₹0"}
          </p>
        </div>

        {date && (
          <p className="text-xs text-(--muted)">
            {date}
          </p>
        )}
      </div>

      {actions && <div className="mt-4">{actions}</div>}
    </article>
  );
};

export default OrderCard;