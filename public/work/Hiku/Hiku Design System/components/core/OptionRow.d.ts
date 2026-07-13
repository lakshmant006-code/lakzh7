import React from "react";

export interface OptionRowProps {
  /** Leading Icon glyph name (e.g. "caravan", "tent", "house"). */
  icon: string;
  /** Bold title line. */
  title: string;
  /** Muted subtitle line. */
  subtitle?: string;
  /** Selected — green border + ring. */
  selected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/**
 * OptionRow — bordered selectable row (icon + title + subtitle). Used for
 * the RV / Tent / Lodging chooser and similar list pickers.
 */
export function OptionRow(props: OptionRowProps): JSX.Element;
