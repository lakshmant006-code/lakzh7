import * as React from "react";

/**
 * Top navigation bar: brand lockup, nav links, active-state, and the signed-in user chip.
 */
export interface NavBarProps {
  active?: "Dashboard" | "Summaries" | "Quizzes";
  userName?: string;
  userInitials?: string;
  onNavClick?: (label: string) => void;
}
