import React, { useState } from "react";
import { Card } from "./Card.jsx";
import { Button } from "../core/Button.jsx";

export function SummaryCard({ title, date, pages, excerpt, abstract }) {
  const [open, setOpen] = useState(false);
  return (
    <Card tint="neutral">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <i className="fa-regular fa-file-lines" style={{ color: "var(--gray-3)" }} aria-hidden="true"></i>
          <i className="fa-solid fa-pen" style={{ color: "var(--gray-3)", fontSize: "12px" }} aria-hidden="true"></i>
          <i className="fa-solid fa-rotate" style={{ color: "var(--gray-3)", fontSize: "12px" }} aria-hidden="true"></i>
          <i className="fa-regular fa-trash-can" style={{ color: "var(--gray-3)", fontSize: "12px" }} aria-hidden="true"></i>
          <span style={{ font: "var(--text-h3)", letterSpacing: "var(--ls-snug)", color: "var(--gray-1)" }}>{title}</span>
        </div>
        <div style={{ textAlign: "right", font: "var(--text-small)", color: "var(--gray-3)" }}>
          <div>{date}</div>
          <div>Pages {pages}</div>
        </div>
      </div>
      <p style={{ font: "var(--text-body)", color: "var(--text-body)", marginTop: "12px" }}>{excerpt}</p>
      {open ? (
        <div style={{ marginTop: "8px" }}>
          <div style={{ font: "var(--text-label)", letterSpacing: "var(--ls-caps)", textTransform: "uppercase", fontSize: "var(--fs-xs)", color: "var(--gray-3)", marginBottom: "6px" }}>Abstract</div>
          <p style={{ font: "var(--text-small)", color: "var(--gray-1)", lineHeight: "var(--lh-loose)" }}>{abstract}</p>
        </div>
      ) : null}
      <div style={{ marginTop: "10px", width: "fit-content" }}>
        <Button variant="ghost" size="sm" fullWidth={false} icon={open ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"} onClick={() => setOpen(!open)}>
          Read More
        </Button>
      </div>
    </Card>
  );
}
