import * as React from "react";

/**
 * Big-number stat tile used in 3-up rows at the top of Dashboard/Summaries screens.
 */
export interface StatTileProps {
  /** Font Awesome class, e.g. "fa-solid fa-circle-question" */
  icon: string;
  value: string | number;
  label: string;
  sublabel?: string;
  tint?: "neutral" | "maroon" | "gold" | "white";
}
