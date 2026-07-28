import * as React from "react";

/**
 * Small pill used for quiz score percentages and status labels.
 */
export interface BadgeProps {
  tone?: "neutral" | "gold" | "success" | "danger";
  children?: React.ReactNode;
}
