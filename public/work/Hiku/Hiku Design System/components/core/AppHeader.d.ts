import React from "react";

export interface AppHeaderProps {
  /** Mountain mark URL. Default "assets/logo-mark.png". */
  logoSrc?: string;
  /** Band height in px. Default 96. */
  height?: number;
  /** Logo alignment. Default "left". */
  align?: "left" | "center";
  /** Optional custom content (overrides the default logo). */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * AppHeader — the soft-green (--green-300) brand band capping every app
 * screen, carrying the Hiku mark.
 */
export function AppHeader(props: AppHeaderProps): JSX.Element;
