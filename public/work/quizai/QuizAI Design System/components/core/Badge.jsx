import React from "react";

export function Badge({ tone = "neutral", children }) {
  const tones = {
    neutral: { background: "var(--surface-chip)", color: "var(--gray-2)", fontWeight: "var(--fw-regular)" },
    gold: { background: "var(--accent-badge-bg)", color: "var(--accent-badge-text)" },
    success: { background: "var(--success-bg)", color: "var(--success)" },
    danger: { background: "var(--danger-bg)", color: "var(--danger)" },
  };
  return (
    <span
      style={{
        ...tones[tone],
        font: "var(--text-label)",
        letterSpacing: "var(--ls-snug)",
        padding: "5px 12px",
        borderRadius: "var(--radius-sm)",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        whiteSpace: "nowrap",
        ...tones[tone],
      }}
    >
      {children}
    </span>
  );
}
