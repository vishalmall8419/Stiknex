import React from "react";

const ChartCard = ({
  title,
  subtitle,
  action,
  children,
  className = "",
}) => {
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
          absolute -right-16 -top-16
          h-40 w-40
          rounded-full
          bg-cyan-200/20
          blur-3xl
        "
      />

      {/* Header */}
      <header
        className="
          relative mb-5
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

      {/* Chart Content */}
      <div className="relative min-w-0">
        {children}
      </div>
    </section>
  );
};

export default ChartCard;