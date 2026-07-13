import React from "react";

export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual style. Default "primary" (deep green). */
  variant?: "primary" | "secondary" | "ghost" | "vibrant";
  /** Height. Default "lg" (48px). */
  size?: "sm" | "md" | "lg";
  /** Leading Icon name. */
  icon?: string;
  /** Trailing Icon name. */
  iconRight?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/**
 * Button — Hiku's pill action button. Deep-green primary fill,
 * white secondary with hairline border. As seen on "show 250 places".
 *
 * @startingPoint section="Core" subtitle="Pill action buttons" viewport="700x150"
 */
export function Button(props: ButtonProps): JSX.Element;
