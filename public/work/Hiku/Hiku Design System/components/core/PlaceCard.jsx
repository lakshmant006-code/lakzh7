import React from "react";
import { Icon } from "./Icon.jsx";

/**
 * PlaceCard — a listing card for camps / trails / shop items. Rounded
 * image with a heart save button, then title, meta and an optional
 * star rating. Composes the imagery-forward Explore feed.
 */
export function PlaceCard({
  image,
  title,
  meta,
  rating,
  price,
  priceUnit = "night",
  saved = false,
  onSave,
  onClick,
  style,
  ...rest
}) {
  const [isSaved, setSaved] = React.useState(saved);
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", gap: 10,
        width: "100%", cursor: onClick ? "pointer" : "default",
        fontFamily: "var(--font-sans)",
        ...style,
      }}
      {...rest}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 0.82" }}>
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "var(--radius-md)",
          background: image ? `center/cover no-repeat url(${image})` : "var(--green-100)",
          border: "1px solid var(--border-hairline)",
        }} />
        <button
          type="button"
          aria-label={isSaved ? "Unsave" : "Save"}
          onClick={(e) => { e.stopPropagation(); setSaved(!isSaved); onSave && onSave(!isSaved); }}
          style={{
            position: "absolute", top: 12, right: 12,
            width: 34, height: 34, borderRadius: "var(--radius-pill)",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.9)", border: "none",
            cursor: "pointer", boxShadow: "var(--shadow-sm)",
          }}
        >
          <Icon name="heart" size={18}
            color={isSaved ? "var(--brand)" : "var(--ink-700)"}
            style={{ fill: isSaved ? "var(--brand)" : "none" }} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: "var(--fs-body)", fontWeight: "var(--fw-bold)", color: "var(--text-primary)", lineHeight: 1.25 }}>{title}</span>
          {rating != null && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--fs-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-primary)", flexShrink: 0 }}>
              <Icon name="star" size={14} color="var(--ink-900)" style={{ fill: "var(--ink-900)" }} />
              {rating}
            </span>
          )}
        </div>
        {meta && <span style={{ fontSize: "var(--fs-sm)", color: "var(--text-secondary)" }}>{meta}</span>}
        {price != null && (
          <span style={{ marginTop: 2, fontSize: "var(--fs-sm)", color: "var(--text-primary)" }}>
            <strong style={{ fontWeight: "var(--fw-bold)" }}>{price}</strong> / {priceUnit}
          </span>
        )}
      </div>
    </div>
  );
}
