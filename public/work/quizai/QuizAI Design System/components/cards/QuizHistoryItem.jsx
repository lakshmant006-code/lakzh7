import React from "react";
import { Card } from "./Card.jsx";
import { Badge } from "../core/Badge.jsx";
import { Button } from "../core/Button.jsx";

export function QuizHistoryItem({ title, date, questions, correct, incorrect, score }) {
  return (
    <Card tint="neutral" interactive>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ font: "var(--text-h3)", letterSpacing: "var(--ls-snug)", color: "var(--gray-1)" }}>{title}</div>
          <div style={{ font: "var(--text-small)", color: "var(--gray-3)", marginTop: "4px" }}>{date}</div>
        </div>
        <Badge tone="neutral">{score}%</Badge>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "14px" }}>
        <span style={{ font: "var(--text-small)", color: "var(--gray-3)", display: "flex", alignItems: "center", gap: "6px" }}>
          <i className="fa-solid fa-circle-question" aria-hidden="true"></i>{questions} Questions
        </span>
        <span style={{ font: "var(--text-small)", color: "var(--success)", display: "flex", alignItems: "center", gap: "6px" }}>
          <i className="fa-solid fa-check" aria-hidden="true"></i>{correct} Correct
        </span>
        <span style={{ font: "var(--text-small)", color: "var(--danger)", display: "flex", alignItems: "center", gap: "6px" }}>
          <i className="fa-solid fa-xmark" aria-hidden="true"></i>{incorrect} Incorrect
        </span>
        <span style={{ marginLeft: "auto" }}>
          <Button variant="ghost" size="sm" fullWidth={false}>View Details →</Button>
        </span>
      </div>
    </Card>
  );
}
