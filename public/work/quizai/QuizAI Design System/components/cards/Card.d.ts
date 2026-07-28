import * as React from "react";

/**
 * Base card surface with a hairline border and a whisper-soft shadow — neutral by default; brand tints are accent-only.
 */
export interface CardProps {
  tint?: "neutral" | "maroon" | "gold" | "white";
  interactive?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
