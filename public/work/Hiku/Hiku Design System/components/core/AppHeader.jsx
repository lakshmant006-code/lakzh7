import React from "react";
import { Logo } from "./Logo.jsx";

/**
 * AppHeader — the soft-green brand band at the top of app screens.
 * Holds the Hiku mark; content can be layered below it.
 */
export function AppHeader({
  logoSrc = "assets/logo-mark.png",
  height = 96,
  align = "left",
  children,
  style,
  ...rest
}) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: align === "center" ? "center" : "flex-start",
        height,
        padding: "0 20px 12px",
        background: "var(--surface-header)",
        ...style,
      }}
      {...rest}
    >
      {children || <Logo src={logoSrc} height={34} />}
    </header>
  );
}
