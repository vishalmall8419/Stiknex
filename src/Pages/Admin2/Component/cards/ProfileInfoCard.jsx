import React from "react";

const ProfileInfoCard = ({
  name,
  role,
  image,
  email,
  phone,
  location,
  fields = [],
  actions,
  className = "",
}) => {
  return (
    <section
      className={`
        relative overflow-hidden rounded-3xl
        border border-white/60
        bg-white/30
        p-5
        shadow-[0_8px_30px_rgba(80,120,140,0.08)]
        backdrop-blur-xl
        ${className}
      `}
    >
      {/* Profile Header */}
      <div className="flex flex-wrap items-center gap-4">
        {image ? (
          <img
            src={image}
            alt={name || "Profile"}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/50 text-xl font-semibold text-(--primary)">
            {name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-(--primary)">
            {name || "Unnamed User"}
          </h2>

          {role && (
            <p className="mt-1 text-sm text-(--secondary)">
              {role}
            </p>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="mt-5 space-y-3">
        {email && (
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            <span className="text-(--muted)">Email</span>
            <span className="break-all text-(--primary)">
              {email}
            </span>
          </div>
        )}

        {phone && (
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            <span className="text-(--muted)">Phone</span>
            <span className="text-(--primary)">
              {phone}
            </span>
          </div>
        )}

        {location && (
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            <span className="text-(--muted)">Location</span>
            <span className="text-(--primary)">
              {location}
            </span>
          </div>
        )}

        {fields.map((field, index) => (
          <div
            key={field.key ?? index}
            className="flex flex-wrap justify-between gap-2 text-sm"
          >
            <span className="text-(--muted)">
              {field.label}
            </span>

            <span className="text-(--primary)">
              {field.value ?? "—"}
            </span>
          </div>
        ))}
      </div>

      {actions && <div className="mt-5">{actions}</div>}
    </section>
  );
};

export default ProfileInfoCard;