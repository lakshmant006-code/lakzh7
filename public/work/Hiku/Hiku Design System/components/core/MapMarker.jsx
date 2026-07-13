import React from "react";
import { Icon } from "./Icon.jsx";

/**
 * MapMarker — a circular pin on the Trails map. A white disc with a
 * green icon; the "active" marker fills deep green with a white icon.
 */
export function MapMarker({
  icon = "map-pin",
  active = false,
  size = 34,
  onClick,
  style,
  ...rest
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size, height: size,
        borderRadius: "var(--radius-pill)",
        background: active ? "var(--brand)" : "var(--white)",
        border: `1px solid ${active ? "var(--brand)" : "var(--border-hairline)"}`,
        boxShadow: "var(--shadow-float)",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={size * 0.5}
        color={active ? "var(--white)" : "var(--brand)"} strokeWidth={2.2} />
    </button>
  );
}
