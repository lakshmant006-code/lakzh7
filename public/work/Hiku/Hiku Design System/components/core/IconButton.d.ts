import React from "react";

export interface IconButtonProps {
  /** Icon glyph name. */
  icon: string;
  /** "square" (rounded rect) or "round" (pill/circle). Default "square". */
  shape?: "square" | "round";
  /** "outline" | "float" (FAB shadow) | "plain" | "brand". Default "outline". */
  variant?: "outline" | "float" | "plain" | "brand";
  /** Box size in px. Default 44. */
  size?: number;
  iconSize?: number;
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

/**
 * IconButton — icon-only control: header filter button, map layer/locate
 * FABs, back arrow. Square-outline by default; round-float for map FABs.
 */
export function IconButton(props: IconButtonProps): JSX.Element;
