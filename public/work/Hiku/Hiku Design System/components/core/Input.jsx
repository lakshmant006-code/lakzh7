import React from "react";

/**
 * Input — Hiku text field. Rounded rect, hairline border, Satoshi 500
 * value text. Matches the "Jaden Smith" / email fields on Community.
 */
export function Input({
  value,
  defaultValue,
  placeholder,
  type = "text",
  label,
  disabled = false,
  onChange,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: "block", width: "100%", ...style }}>
      {label && (
        <span style={{
          display: "block",
          marginBottom: 6,
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-sm)",
          fontWeight: "var(--fw-medium)",
          color: "var(--text-secondary)",
        }}>{label}</span>
      )}
      <input
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%",
          height: "var(--control-md)",
          padding: "0 16px",
          boxSizing: "border-box",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-body)",
          fontWeight: "var(--fw-medium)",
          color: "var(--text-primary)",
          background: disabled ? "var(--surface-sunken)" : "var(--white)",
          border: `1px solid ${focus ? "var(--border-focus)" : "var(--border-default)"}`,
          borderRadius: "var(--radius-md)",
          outline: "none",
          transition: "border-color var(--dur-fast) var(--ease-standard)",
        }}
        {...rest}
      />
    </label>
  );
}
