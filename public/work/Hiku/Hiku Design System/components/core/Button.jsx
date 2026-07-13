import React from "react";
import { Icon } from "./Icon.jsx";

/**
 * Button — Hiku's primary action. Fully-rounded pill, Satoshi Medium,
 * deep-green fill for primary. Matches "show 250 places" and "Register".
 */
export function Button({
  children,
  variant = "primary",
  size = "lg",
  icon,
  iconRight,
  fullWidth = false,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const heights = { sm: 34, md: 40, lg: 48 };
  const pads = { sm: "0 16px", md: "0 20px", lg: "0 26px" };
  const fonts = { sm: "var(--fs-caption)", md: "var(--fs-label)", lg: "var(--fs-label)" };

  const variants = {
    primary: {
      background: "var(--action-primary)",
      color: "var(--text-on-brand)",
      border: "1px solid transparent",
    },
    secondary: {
      background: "var(--white)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-default)",
    },
    ghost: {
      background: "transparent",
      color: "var(--brand)",
      border: "1px solid transparent",
    },
    vibrant: {
      background: "var(--brand-vibrant)",
      color: "var(--white)",
      border: "1px solid transparent",
    },
  };

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: heights[size],
        padding: pads[size],
        width: fullWidth ? "100%" : "auto",
        fontFamily: "var(--font-sans)",
        fontWeight: "var(--fw-medium)",
        fontSize: fonts[size],
        lineHeight: 1,
        borderRadius: "var(--radius-pill)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)",
        WebkitTapHighlightColor: "transparent",
        ...variants[variant],
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(var(--press-scale))"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 16 : 18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 16 : 18} />}
    </button>
  );
}
