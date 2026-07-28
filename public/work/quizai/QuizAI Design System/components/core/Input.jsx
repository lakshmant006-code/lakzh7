import React from "react";

export function Input({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      {label ? (
        <label style={{ font: "var(--text-label)", color: "var(--text-body)" }}>{label}</label>
      ) : null}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          font: "var(--text-body)",
          padding: "12px 16px",
          borderRadius: "var(--radius-md)",
          border: "var(--border-width) solid var(--border-default)",
          background: "var(--white)",
          color: "var(--text-body)",
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          transition: "border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--brand-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(140,29,64,0.15)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.boxShadow = "none"; }}
      />
    </div>
  );
}
