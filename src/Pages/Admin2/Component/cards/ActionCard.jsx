import React from "react";

const ActionCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  href,
  actionLabel,
  children,
  className = "",
}) => {
  const content = (
    <div className="flex h-full min-h-0 flex-col justify-between gap-1.5">
      {/* Top Content */}
      <div className="flex min-w-0 items-start gap-2.5">
        {/* Icon */}
        {Icon && (
          <div
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-xl
              bg-white/45
              text-(--primary)
            "
          >
            <Icon size={18} strokeWidth={1.8} />
          </div>
        )}

        {/* Title and Description */}
        <div className="min-w-0 flex-1">
          <h3
            className="
              truncate
              text-xs
              font-semibold
              leading-4
              text-(--primary)
            "
          >
            {title}
          </h3>

          {description && (
            <p
              className="
                mt-0.5
                line-clamp-2
                text-[11px]
                leading-[14px]
                text-(--secondary)
              "
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Action */}
      {actionLabel && (
        <span
          className="
            inline-flex
            items-center
            gap-1
            text-[11px]
            font-semibold
            leading-4
            text-(--primary)
            transition-opacity
            group-hover:opacity-70
          "
        >
          {actionLabel}
          <span className="text-xs">↗</span>
        </span>
      )}

      {/* Custom Children */}
      {children && <div className="text-xs">{children}</div>}
    </div>
  );

  const commonClasses = `
    group
    relative
    block
    h-[116px]
    min-w-0
    overflow-hidden
    rounded-2xl
    border
    border-white/60
    bg-white/20
    p-3
    text-left
    shadow-[0_5px_18px_rgba(80,120,140,0.05)]
    backdrop-blur-3xl shadow-[0_8px_32px_rgba(31,38,135,0.15)] border border-white/40
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:shadow-[0_8px_22px_rgba(80,120,140,0.10)]
    ${className}
  `;

  // Link Card
  if (href) {
    return (
      <a href={href} className={commonClasses}>
        {content}
      </a>
    );
  }

  // Button Card
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${commonClasses} w-full`}
    >
      {content}
    </button>
  );
};

export default React.memo(ActionCard);

