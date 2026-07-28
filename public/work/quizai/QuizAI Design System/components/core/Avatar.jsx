import React from "react";

export function Avatar({ initials = "LT", size = 32 }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "var(--radius-round)",
        background: "var(--surface-maroon-tint)",
        color: "var(--brand-primary)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        font: "var(--text-label)",
        fontSize: size * 0.4,
        flexShrink: 0,
      }}
    >
      {initials}
    </span>
  );
}
