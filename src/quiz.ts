import type { IrregularVerb, QuizMode } from "./verbs.js";
import {
  contextAnswer,
  contextFormLabel,
  getVerbContext,
  type VerbForm,
} from "./verb-contexts.js";

const CONTEXT_PLACEHOLDER = "____";
const VISIBLE_CONTEXT_BLANK = "\\_\\_\\_\\_";

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

export function buildQuestion(
  verb: IrregularVerb,
  mode: QuizMode,
  contextForm?: VerbForm
): string {
  switch (mode) {
    case "base-to-forms":
      return (
        `What are the past and participle forms of *${escapeMarkdown(verb.base)}* ?\n\n` +
        "Reply like: `went gone`"
      );
    case "past-to-base":
      return `What is the base form of *${escapeMarkdown(verb.pastSimple)}*?`;
    case "participle-to-base":
      return `What is the base form of *${escapeMarkdown(verb.pastParticiple)}*?`;
    case "verbs-in-context": {
      const form = requireContextForm(contextForm);
      const context = getVerbContext(verb, form);
      return contextQuestionHeader(verb, form) +
        context.sentence.replace(CONTEXT_PLACEHOLDER, VISIBLE_CONTEXT_BLANK);
    }
  }
}

export function buildWrongQuestion(
  verb: IrregularVerb,
  mode: QuizMode,
  contextForm?: VerbForm
): string {
  return (
    `${buildQuestion(verb, mode, contextForm)}\n\n` +
    `Wrong. Answer: *${escapeMarkdown(formatAnswer(verb, mode, contextForm))}*`
  );
}

export function buildAnsweredContextQuestion(
  verb: IrregularVerb,
  form: VerbForm
): string {
  const context = getVerbContext(verb, form);
  const answer = escapeMarkdown(splitVariants(contextAnswer(verb, context.form))[0]);
  const sentence = context.sentence.replace(CONTEXT_PLACEHOLDER, `*${answer}*`);

  return `${contextQuestionHeader(verb, form)}🥳 ${sentence} 🥳`;
}

export function formatAnswer(
  verb: IrregularVerb,
  mode: QuizMode,
  contextForm?: VerbForm
): string {
  switch (mode) {
    case "base-to-forms":
      return `${verb.pastSimple} ${verb.pastParticiple}`;
    case "past-to-base":
    case "participle-to-base":
      return verb.base;
    case "verbs-in-context": {
      return contextAnswer(verb, requireContextForm(contextForm));
    }
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
  userInput: string,
  contextForm?: VerbForm
): boolean {
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

  return matchesAny(userInput, formatAnswer(verb, mode, contextForm));
}

function contextQuestionHeader(verb: IrregularVerb, form: VerbForm): string {
  return `*${escapeMarkdown(verb.base.toUpperCase())}* (${contextFormLabel(form)})\n\n`;
}

function requireContextForm(form?: VerbForm): VerbForm {
  if (!form) {
    throw new Error("Context form is required in verbs-in-context mode.");
  }
  return form;
}

function escapeMarkdown(text: string): string {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}
