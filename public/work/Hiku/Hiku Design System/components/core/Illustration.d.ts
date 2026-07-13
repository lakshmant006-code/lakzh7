import React from "react";

export interface IllustrationProps {
  /** Which hiking scene to render. */
  scene?: "mountains" | "tent" | "forest" | "trail" | "campfire" | "lake";
  /** Tonal ramp within the green family. Default "green". */
  tone?: "green" | "deep" | "soft";
  /** Pixel height (width scales to the 400×260 ratio). Default 160. */
  height?: number;
  style?: React.CSSProperties;
}

/**
 * Illustration — flat, monochrome hiking scenes drawn entirely from the
 * Hiku green palette. Use for empty states, headers, onboarding and
 * imagery fallbacks. Vector and fully scalable.
 *
 * @startingPoint section="Brand" subtitle="Monochrome green hiking scenes" viewport="400x260"
 */
export function Illustration(props: IllustrationProps): JSX.Element;

export const ILLUSTRATION_SCENES: string[];
