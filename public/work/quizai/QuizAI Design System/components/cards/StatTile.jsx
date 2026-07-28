import React from "react";
import { Card } from "./Card.jsx";

export function StatTile({ icon, value, label, sublabel, tint = "neutral" }) {
  return (
    <Card tint={tint} style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <i className={icon} style={{ color: "var(--gray-3)", fontSize: "15px" }} aria-hidden="true"></i>
        <span style={{ font: "var(--text-h1)", letterSpacing: "var(--ls-tight)", color: "var(--gray-1)" }}>{value}</span>
      </div>
      <div style={{ font: "var(--text-body)", fontWeight: "var(--fw-semibold)", letterSpacing: "var(--ls-snug)", color: "var(--gray-1)" }}>{label}</div>
      {sublabel ? <div style={{ font: "var(--text-small)", color: "var(--gray-3)" }}>{sublabel}</div> : null}
    </Card>
  );
}
