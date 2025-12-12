import React from "react";

export default function Button({
  children,
  type = "button",
  variant = "primary",     // primary | secondary | ghost
  size = "md",             // sm | md | lg
  fullWidth = false,
  loading = false,
  disabled,
  className = "",
  bgColor,
  textColor,
  icon,
  ...props
}) {
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    ghost:
      "bg-transparent text-blue-700 hover:bg-blue-100 border border-blue-200",
  };

  // If custom background or text color is provided, override styling
  const customPalette =
    bgColor || textColor
      ? `${bgColor ? bgColor : ""} ${textColor ? textColor : ""}`.trim()
      : variants[variant] || variants.primary;

  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-[.97] disabled:opacity-50 disabled:cursor-not-allowed";

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${customPalette} ${widthClass} ${className}`}
      {...props}
    >
      {loading && (
        <span
          className={`mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 ${
            textColor?.includes("white") ? "border-white/70" : "border-black/30"
          } border-t-transparent`}
        />
      )}

      {/* If icon exists */}
      {icon && <span className="mr-2 flex items-center">{icon}</span>}

      {children}
    </button>
  );
}
