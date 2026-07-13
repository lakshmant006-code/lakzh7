import React from "react";
import { Icon } from "./Icon.jsx";

/**
 * IconButton — square or round icon-only control. Covers the header
 * filter button (square, bordered), map FABs (round, floating) and
 * the back arrow (round, plain).
 */
export function IconButton({
  icon,
  shape = "square",
  variant = "outline",
  size = 44,
  iconSize,
  active = false,
  disabled = false,
  onClick,
  ariaLabel,
  style,
  ...rest
}) {
  const variants = {
    outline: { background: "var(--white)", border: "1px solid var(--border-default)", color: "var(--ink-900)" },
    float:   { background: "var(--white)", border: "1px solid var(--border-hairline)", color: "var(--ink-900)", boxShadow: "var(--shadow-float)" },
    plain:   { background: "transparent", border: "1px solid transparent", color: "var(--ink-900)" },
    brand:   { background: "var(--action-primary)", border: "1px solid transparent", color: "var(--white)" },
  };
  const activeStyle = active ? { borderColor: "var(--brand)", color: "var(--brand)" } : null;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: shape === "round" ? "var(--radius-pill)" : "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "transform var(--dur-fast) var(--ease-standard), background var(--dur-fast)",
        WebkitTapHighlightColor: "transparent",
        ...variants[variant],
        ...activeStyle,
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(var(--press-scale))"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      {...rest}
    >
      <Icon name={icon} size={iconSize || Math.round(size * 0.45)} />
    </button>
  );
}
