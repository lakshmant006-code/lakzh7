import React from "react";
import { Icon } from "./Icon.jsx";

const DEFAULT_TABS = [
  { id: "explore",   label: "Explore",   icon: "search" },
  { id: "trails",    label: "Trails",    icon: "map" },
  { id: "community", label: "Community", icon: "globe" },
  { id: "shop",      label: "Shop",      icon: "shopping-bag" },
  { id: "account",   label: "Account",   icon: "user", avatar: true },
];

/**
 * BottomNav — the 5-tab app tab bar. Active tab turns deep green.
 * The Account tab renders a small avatar instead of a line glyph.
 */
export function BottomNav({
  items = DEFAULT_TABS,
  active = "explore",
  avatarSrc,
  onChange,
  style,
  ...rest
}) {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "stretch",
        justifyContent: "space-around",
        width: "100%",
        padding: "8px 6px 10px",
        background: "var(--white)",
        borderTop: "1px solid var(--border-hairline)",
        fontFamily: "var(--font-sans)",
        ...style,
      }}
      {...rest}
    >
      {items.map((t) => {
        const on = t.id === active;
        const color = on ? "var(--action-nav-active)" : "var(--action-nav-idle)";
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange && onChange(t.id)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              flex: 1, minWidth: 0, padding: "2px 0",
              background: "none", border: "none", cursor: "pointer",
              color, WebkitTapHighlightColor: "transparent",
            }}
          >
            {t.avatar ? (
              <span style={{
                width: 26, height: 26, borderRadius: "var(--radius-pill)",
                border: `2px solid ${on ? "var(--action-nav-active)" : "transparent"}`,
                overflow: "hidden", display: "block",
                background: avatarSrc ? `center/cover no-repeat url(${avatarSrc})` : "var(--green-200)",
              }}>
                {!avatarSrc && (
                  <Icon name="user" size={16} color="var(--green-700)" style={{ margin: "5px auto" }} />
                )}
              </span>
            ) : (
              <Icon name={t.icon} size={24} color={color} strokeWidth={on ? 2.3 : 2} />
            )}
            <span style={{
              fontSize: "var(--fs-nav)",
              fontWeight: on ? "var(--fw-medium)" : "var(--fw-regular)",
              color,
              lineHeight: 1,
            }}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
