export type IrregularVerb = {
  base: string;
  pastSimple: string;
  pastParticiple: string;
};

export type QuizMode =
  | "base-to-forms"
  | "past-to-base"
  | "participle-to-base";

export const QUIZ_MODE_LABELS: Record<QuizMode, string> = {
  "base-to-forms": "Base → past / participle",
  "past-to-base": "Past simple → base",
  "participle-to-base": "Participle → base",
};
