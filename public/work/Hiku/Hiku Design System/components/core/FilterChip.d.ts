import React from "react";

export interface FilterChipProps {
  children?: React.ReactNode;
  /** Show a trailing chevron (dropdown chip). Default false. */
  dropdown?: boolean;
  /** Selected/active — fills soft green with green border. */
  selected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/**
 * FilterChip — pill filter under the search bar. Dropdown form
 * ("Camping style ▾") or plain toggle ("Pets allowed").
 */
export function FilterChip(props: FilterChipProps): JSX.Element;
