import React from "react";

export interface LogoProps {
  /** URL of the mountain mark PNG. Default "assets/logo-mark.png". Pass "" to hide. */
  src?: string;
  /** Also show the "Hiku" wordmark next to the mark. */
  wordmark?: boolean;
  /** Mark height in px. Default 28. */
  height?: number;
  /** Wordmark color. Default deep green. */
  color?: string;
  style?: React.CSSProperties;
}

/**
 * Logo — Hiku brand lockup: green mountain mark + optional Satoshi-Black
 * wordmark. The mark is the provided PNG (no vector source exists).
 */
export function Logo(props: LogoProps): JSX.Element;
