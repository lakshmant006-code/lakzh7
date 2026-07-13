import React from "react";

export interface SearchBarProps {
  /** Bold primary line. Default "Nearby". */
  title?: string;
  /** Muted secondary line. Default "Add dates · Add guests". */
  subtitle?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/**
 * SearchBar — tappable search field for Explore & Trails. Two-line label
 * (bold location + muted dates/guests) with a leading search glyph.
 *
 * @startingPoint section="Core" subtitle="Two-line search field" viewport="700x120"
 */
export function SearchBar(props: SearchBarProps): JSX.Element;
