import type { IrregularVerb, QuizMode } from "./verbs.js";

export function pickRandomVerb(
  verbs: IrregularVerb[],
  exclude?: IrregularVerb
): IrregularVerb {
  const pool =
    exclude && verbs.length > 1
      ? verbs.filter((v) => v.base !== exclude.base)
      : verbs;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function buildQuestion(verb: IrregularVerb, mode: QuizMode): string {
  switch (mode) {
    case "base-to-forms":
      return (
        `What are the past and participle of *${escapeMarkdown(verb.base)}* ?\n\n` +
        "Reply like: `went gone`"
      );
    case "past-to-base":
      return `What is the base form of *${escapeMarkdown(verb.pastSimple)}*?`;
    case "participle-to-base":
      return `What is the base form of *${escapeMarkdown(verb.pastParticiple)}*?`;
  }
}

export function formatAnswer(verb: IrregularVerb, mode: QuizMode): string {
  switch (mode) {
    case "base-to-forms":
      return `${verb.pastSimple} ${verb.pastParticiple}`;
    case "past-to-base":
    case "participle-to-base":
      return verb.base;
  }
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function splitVariants(value: string): string[] {
  return value.split("/").map(normalize).filter(Boolean);
}

function matchesAny(input: string, expected: string): boolean {
  const normalizedInput = normalize(input);
  return splitVariants(expected).includes(normalizedInput);
}

export function checkAnswer(
  verb: IrregularVerb,
  mode: QuizMode,
  userInput: string
): boolean {
  const input = normalize(userInput);

  if (mode === "base-to-forms") {
    const parts = userInput.trim().split(/\s+/).map(normalize).filter(Boolean);
    if (parts.length < 2) {
      return false;
    }
    const [past, participle] = parts;
    return (
      matchesAny(past, verb.pastSimple) &&
      matchesAny(participle, verb.pastParticiple)
    );
  }

  return matchesAny(input, verb.base);
}

function escapeMarkdown(text: string): string {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}
