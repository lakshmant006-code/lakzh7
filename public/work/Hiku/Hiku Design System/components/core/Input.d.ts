import React from "react";

export interface InputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  /** Optional field label above the input. */
  label?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

/**
 * Input — single-line text field with hairline border and 12px radius.
 * Value text is Satoshi Medium. Focus ring is deep green.
 */
export function Input(props: InputProps): JSX.Element;
