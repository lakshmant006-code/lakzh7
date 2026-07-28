import * as React from "react";

/**
 * A single row in the Quiz History list: title, date, question/correct/incorrect counts, score badge, and a "View Details" link.
 */
export interface QuizHistoryItemProps {
  title: string;
  date: string;
  questions: number;
  correct: number;
  incorrect: number;
  score: number;
}
