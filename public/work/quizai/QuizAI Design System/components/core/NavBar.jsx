import React from "react";
import { Logo } from "../brand/BrainMark.jsx";
import { Avatar } from "./Avatar.jsx";

export function NavBar({ active = "Dashboard", userName = "Lakshman Thota", userInitials = "LT", onNavClick }) {
  const links = ["Dashboard", "Summaries", "Quizzes"];
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 32px",
        borderBottom: "var(--border-width) solid var(--border-subtle)",
        background: "var(--white)",
      }}
    >
      <Logo />
      <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
        {links.map((l) => (
          <a
            key={l}
            href="#"
            onClick={(e) => { e.preventDefault(); if (onNavClick) onNavClick(l); }}
            style={{
              font: "var(--text-label)",
              color: l === active ? "var(--brand-primary)" : "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            {l}
          </a>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar initials={userInitials} />
          <span style={{ font: "var(--text-small)", color: "var(--text-body)" }}>{userName}</span>
        </div>
      </div>
    </nav>
  );
}
