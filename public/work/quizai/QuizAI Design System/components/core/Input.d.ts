import * as React from "react";

/**
 * Bordered text input matching the Sign In form fields.
 */
export interface InputProps {
  label?: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
