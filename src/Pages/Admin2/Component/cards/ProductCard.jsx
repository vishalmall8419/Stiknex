import React from "react";

const ProductCard = ({
  image,
  name,
  category,
  price,
  oldPrice,
  stock,
  status,
  rating,
  actions,
  onClick,
  className = "",
}) => {
  const stockStatus =
    status ||
    (stock === 0
      ? "Out of Stock"
      : stock < 10
        ? "Low Stock"
        : "In Stock");

  const stockStyles = {
    "In Stock": "text-emerald-600",
    "Low Stock": "text-orange-500",
    "Out of Stock": "text-red-500",
  };

  return (
    <article
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-3xl
        border border-white/60
        bg-white/30
        p-4
        shadow-[0_8px_30px_rgba(80,120,140,0.08)]
        backdrop-blur-xl
        transition-all duration-300
        ${onClick ? "cursor-pointer hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      {/* Product Image */}
      <div className="flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-white/25">
        {image ? (
          <img
            src={image}
            alt={name || "Product"}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-sm text-(--muted)">
            No Image
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="mt-4">
        {category && (
          <p className="text-xs text-(--muted)">
            {category}
          </p>
        )}

        <h3 className="mt-1 line-clamp-2 font-semibold text-(--primary)">
          {name || "Unnamed Product"}
        </h3>

        {rating !== undefined && (
          <p className="mt-2 text-xs text-(--secondary)">
            ★ {rating}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold text-(--primary)">
            {price || "₹0"}
          </span>

          {oldPrice && (
            <span className="text-sm text-(--muted) line-through">
              {oldPrice}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span
            className={`text-xs font-semibold ${
              stockStyles[stockStatus] || "text-(--secondary)"
            }`}
          >
            {stockStatus}
          </span>

          {stock !== undefined && (
            <span className="text-xs text-(--muted)">
              {stock} left
            </span>
          )}
        </div>

        {actions && <div className="mt-4">{actions}</div>}
      </div>
    </article>
  );
};

export default ProductCard;