import React from "react";

export function Card({ tint = "neutral", interactive = false, children, style }) {
  const tints = {
    neutral: { background: "var(--white)", borderColor: "var(--hairline)" },
    maroon: { background: "var(--surface-maroon-tint)", borderColor: "var(--border-maroon-tint)" },
    gold: { background: "var(--surface-gold-tint)", borderColor: "var(--border-gold-tint)" },
    white: { background: "var(--white)", borderColor: "var(--hairline)" },
  };
  return (
    <div
      style={{
        border: "var(--border-width) solid",
        ...tints[tint],
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-5)",
        boxShadow: "var(--shadow-card)",
        transition: "transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base) var(--ease-standard)",
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
      onMouseEnter={(e) => { if (interactive) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-raised)"; } }}
      onMouseLeave={(e) => { if (interactive) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-card)"; } }}
    >
      {children}
    </div>
  );
}
