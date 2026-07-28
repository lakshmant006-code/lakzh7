import React from "react";

export function Button({ variant = "primary", size = "md", disabled = false, icon, children, onClick, type = "button", fullWidth }) {
  const base = {
    fontFamily: "var(--font-sans)",
    fontWeight: "var(--fw-semibold)",
    fontSize: size === "sm" ? "var(--fs-sm)" : "var(--fs-base)",
    padding: size === "sm" ? "8px 16px" : "12px 20px",
    borderRadius: "var(--radius-md)",
    border: "var(--border-width) solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    whiteSpace: "nowrap",
    width: fullWidth === false ? "auto" : "100%",
    transition: "background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)",
  };
  const variants = {
    primary: { background: "var(--brand-primary)", color: "var(--white)", borderColor: "var(--brand-primary)" },
    secondary: { background: "var(--white)", color: "var(--brand-primary)", borderColor: "var(--brand-primary)" },
    ghost: { background: "transparent", color: "var(--brand-primary)", borderColor: "transparent" },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={(e) => { if (!disabled && variant === "primary") e.currentTarget.style.background = "var(--brand-primary-hover)"; }}
      onMouseLeave={(e) => { if (!disabled && variant === "primary") e.currentTarget.style.background = "var(--brand-primary)"; }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.98)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {icon ? <i className={icon} aria-hidden="true"></i> : null}
      {children}
    </button>
  );
}
