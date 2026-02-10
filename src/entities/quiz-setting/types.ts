export type QuizCategory = "db" | "ai";

export interface QuizListItem {
  id: string;
  label: string;
  category: QuizCategory;
}
