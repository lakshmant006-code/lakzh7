import React from "react";
import { Icon } from "./Icon.jsx";

/**
 * OptionRow — a selectable list row with a leading icon, bold title and
 * muted subtitle inside a bordered rounded card. Matches the RV / Tent /
 * Lodging chooser on the Camping-style sheet.
 */
export function OptionRow({
  icon,
  title,
  subtitle,
  selected = false,
  onClick,
  style,
  ...rest
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        width: "100%",
        padding: "16px 18px",
        textAlign: "left",
        background: "var(--white)",
        border: `1px solid ${selected ? "var(--brand-vibrant)" : "var(--border-default)"}`,
        boxShadow: selected ? "0 0 0 1px var(--brand-vibrant)" : "none",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      {...rest}
    >
      <span style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 44, height: 44, flexShrink: 0,
      }}>
        <Icon name={icon} size={30} strokeWidth={1.8} color="var(--ink-900)" />
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
        <span style={{
          fontSize: "var(--fs-body)",
          fontWeight: "var(--fw-bold)",
          color: "var(--text-primary)",
          lineHeight: 1.2,
        }}>{title}</span>
        {subtitle && (
          <span style={{
            fontSize: "var(--fs-sm)",
            fontWeight: "var(--fw-regular)",
            color: "var(--text-secondary)",
            lineHeight: 1.2,
          }}>{subtitle}</span>
        )}
      </span>
    </button>
  );
}
