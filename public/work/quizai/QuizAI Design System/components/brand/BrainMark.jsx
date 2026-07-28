import React from "react";

export function BrainMark({ size = 24 }) {
  return <i className="fa-solid fa-brain" aria-hidden="true" style={{ fontSize: size, color: "var(--brand-primary)" }}></i>;
}

export function Logo({ size = 20 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <BrainMark size={size} />
      <span style={{ font: "var(--text-h3)", color: "var(--brand-primary)" }}>QuizAI</span>
    </span>
  );
}
