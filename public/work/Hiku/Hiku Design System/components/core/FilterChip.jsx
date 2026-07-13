import React from "react";
import { Icon } from "./Icon.jsx";

/**
 * FilterChip — the small pill filters under the search bar. Two forms:
 * a dropdown chip (label + chevron, e.g. "Camping style") and a plain
 * toggle chip (e.g. "Pets allowed"). Selected state fills soft green.
 */
export function FilterChip({
  children,
  dropdown = false,
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
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: "var(--control-sm)",
        padding: "0 14px",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-caption)",
        fontWeight: "var(--fw-medium)",
        color: selected ? "var(--green-700)" : "var(--text-primary)",
        background: selected ? "var(--brand-wash)" : "var(--white)",
        border: `1px solid ${selected ? "var(--brand-vibrant)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-pill)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background var(--dur-fast), border-color var(--dur-fast)",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      {...rest}
    >
      {children}
      {dropdown && <Icon name="chevron-down" size={15} strokeWidth={2.2} />}
    </button>
  );
}
