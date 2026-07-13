import React from "react";
import { Icon } from "./Icon.jsx";
import { Button } from "./Button.jsx";

/**
 * CommunityCard — a group/club card in the Community feed: banner image,
 * title, a short description and a Join action with a "Know more" link.
 */
export function CommunityCard({
  image,
  title,
  description,
  members,
  compact = false,
  joined = false,
  onJoin,
  onKnowMore,
  style,
  ...rest
}) {
  const [isJoined, setJoined] = React.useState(joined);
  return (
    <article
      style={{
        display: "flex", flexDirection: "column",
        background: "var(--surface-card)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
        fontFamily: "var(--font-sans)",
        ...style,
      }}
      {...rest}
    >
      <div style={{
        width: "100%", height: compact ? 64 : 96,
        background: image ? `center/cover no-repeat url(${image})` : "var(--green-100)",
      }} />
      <div style={{ padding: compact ? "10px 12px" : "12px 14px 14px" }}>
        <h3 style={{
          margin: 0, fontSize: "var(--fs-h3)", fontWeight: "var(--fw-bold)",
          color: "var(--text-primary)", lineHeight: 1.25,
        }}>{title}</h3>
        {!compact && description && (
          <p style={{
            margin: "6px 0 0", fontSize: "var(--fs-sm)", lineHeight: 1.45,
            color: "var(--text-secondary)",
          }}>{description}</p>
        )}
        {members && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8,
            fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", color: "var(--text-secondary)",
          }}>
            <Icon name="user" size={13} color="var(--ink-500)" />{members} members
          </span>
        )}
        {!compact && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <Button
              variant={isJoined ? "secondary" : "primary"}
              size="sm"
              onClick={() => { setJoined(!isJoined); onJoin && onJoin(!isJoined); }}
            >{isJoined ? "Joined" : "Join"}</Button>
            <button
              type="button"
              onClick={onKnowMore}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "var(--font-sans)", fontSize: "var(--fs-sm)",
                fontWeight: "var(--fw-medium)", color: "var(--text-link)",
              }}
            >Know more</button>
          </div>
        )}
      </div>
    </article>
  );
}
