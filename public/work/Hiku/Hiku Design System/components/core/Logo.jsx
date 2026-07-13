import React from "react";

/**
 * Logo — the Hiku brand lockup. Renders the green mountain mark (image)
 * plus an optional Satoshi-Black wordmark. If no mark image is available,
 * falls back to the wordmark alone (there is no SVG source mark).
 */
export function Logo({
  src = "assets/logo-mark.png",
  wordmark = false,
  height = 28,
  color = "var(--green-500)",
  style,
  ...rest
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, ...style }} {...rest}>
      {src && (
        <img src={src} alt="Hiku" style={{ height, width: "auto", display: "block" }} />
      )}
      {(wordmark || !src) && (
        <span style={{
          fontFamily: "var(--font-sans)",
          fontWeight: "var(--fw-black)",
          fontSize: height * 0.9,
          letterSpacing: "var(--ls-tight)",
          color,
          lineHeight: 1,
        }}>Hiku</span>
      )}
    </span>
  );
}
