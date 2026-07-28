import * as React from "react";

/**
 * Primary/secondary/ghost action button matching the maroon fill-vs-outline pattern from the Sign In screen.
 */
export interface ButtonProps {
  /** Visual style: solid maroon, outlined maroon, or borderless text */
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  disabled?: boolean;
  /** Font Awesome class, e.g. "fa-solid fa-arrow-right" */
  icon?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  /** Defaults to true (fills its container). Set false for inline, content-width buttons. */
  fullWidth?: boolean;
  children?: React.ReactNode;
}
