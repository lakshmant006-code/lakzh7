import React, { forwardRef } from "react";
import "./CaseStudyStatement.css";

export const CaseStudyStatement = forwardRef(function CaseStudyStatement(
  { children, className = "", variant = "default", ...props },
  ref,
) {
  const variantClass =
    variant === "default" ? "" : ` case-study-statement--${variant}`;

  return (
    <div
      ref={ref}
      className={`case-study-statement${variantClass}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </div>
  );
});

export const CaseStudyStatementHeadline = forwardRef(
  function CaseStudyStatementHeadline(
    { children, className = "", as: Tag = "p", ...props },
    ref,
  ) {
    return (
      <Tag
        ref={ref}
        className={`case-study-statement__headline${className ? ` ${className}` : ""}`}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);

export const CaseStudyStatementBody = forwardRef(function CaseStudyStatementBody(
  { children, className = "", as: Tag = "p", ...props },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={`case-study-statement__body${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </Tag>
  );
});
