import React from "react";
import { Icon } from "./Icon.jsx";

/**
 * SearchBar — the Explore/Trails search field. Rounded container,
 * leading search icon, a bold primary line and a muted secondary line.
 * Matches "Nearby / Add dates  Add guests".
 */
export function SearchBar({
  title = "Nearby",
  subtitle = "Add dates · Add guests",
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
        gap: 12,
        width: "100%",
        height: 60,
        padding: "0 18px",
        background: "var(--white)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-sm)",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "var(--font-sans)",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      {...rest}
    >
      <Icon name="search" size={22} color="var(--ink-900)" strokeWidth={2.4} />
      <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span style={{
          fontSize: "var(--fs-label)",
          fontWeight: "var(--fw-bold)",
          color: "var(--text-primary)",
          lineHeight: 1.1,
        }}>{title}</span>
        <span style={{
          fontSize: "var(--fs-sm)",
          fontWeight: "var(--fw-regular)",
          color: "var(--text-secondary)",
          lineHeight: 1.1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>{subtitle}</span>
      </span>
    </button>
  );
}
