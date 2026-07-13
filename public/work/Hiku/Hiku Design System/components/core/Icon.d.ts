import React from "react";

export interface IconProps {
  /** Lucide glyph name. See ICON_NAMES for the bundled set. */
  name:
    | "search" | "sliders-horizontal" | "sliders-vertical" | "chevron-down"
    | "arrow-left" | "map" | "compass" | "globe" | "shopping-bag" | "user"
    | "layers" | "navigation" | "tent" | "caravan" | "house" | "heart"
    | "star" | "map-pin" | "plus" | "minus" | "check" | "x" | "mountain";
  /** Pixel size (square). Default 22. */
  size?: number;
  /** Stroke width. Default 2. */
  strokeWidth?: number;
  /** Stroke color. Default currentColor. */
  color?: string;
  style?: React.CSSProperties;
}

/**
 * Icon — renders a Lucide line glyph from the bundled set.
 * Hiku's only icon system: 2px stroke, round caps, currentColor.
 */
export function Icon(props: IconProps): JSX.Element;

export const ICON_NAMES: string[];
