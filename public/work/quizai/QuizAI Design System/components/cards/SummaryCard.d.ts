import * as React from "react";

/**
 * AI-generated document summary card with edit/regenerate/delete affordances and an expandable "Read More" abstract.
 */
export interface SummaryCardProps {
  title: string;
  date: string;
  pages: string;
  excerpt: string;
  abstract: string;
}
