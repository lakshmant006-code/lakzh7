import React from "react";
import { Icon } from "./Icon.jsx";

/**
 * Avatar — circular user image with initials/icon fallback and an
 * optional green active ring (used on the Account tab and Community).
 */
export function Avatar({
  src,
  name,
  size = 40,
  ring = false,
  style,
  ...rest
}) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : null;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size, height: size, flexShrink: 0,
        borderRadius: "var(--radius-pill)",
        overflow: "hidden",
        background: src ? `center/cover no-repeat url(${src})` : "var(--green-200)",
        border: ring ? "2px solid var(--brand)" : "none",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
        fontFamily: "var(--font-sans)",
        fontWeight: "var(--fw-bold)",
        fontSize: size * 0.4,
        color: "var(--green-700)",
        ...style,
      }}
      {...rest}
    >
      {!src && (initials || <Icon name="user" size={size * 0.5} color="var(--green-700)" />)}
    </span>
  );
}
