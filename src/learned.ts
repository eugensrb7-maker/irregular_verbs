import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { IrregularVerb } from "./verbs.js";
import type { VerbForm } from "./verb-contexts.js";

type ChatProgress = {
  learned: string[];
  learnedForms?: string[];
};

type ProgressFile = Record<string, ChatProgress>;

const __dirname = dirname(fileURLToPath(import.meta.url));
const progressPath = join(__dirname, "..", "data", "progress.json");
const temporaryProgressPath = `${progressPath}.tmp`;

function loadProgress(): ProgressFile {
  try {
    return JSON.parse(readFileSync(progressPath, "utf-8")) as ProgressFile;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {};
    }
    throw new Error(`Could not read ${progressPath}`, { cause: error });
  }
}

const progress = loadProgress();

export function getLearnedBases(chatId: number): Set<string> {
  return new Set(progress[String(chatId)]?.learned ?? []);
}

function formProgressKey(base: string, form: VerbForm): string {
  return `${base}:${form}`;
}

export function isVerbFormLearned(
  chatId: number,
  base: string,
  form: VerbForm
): boolean {
  const learnedForms = progress[String(chatId)]?.learnedForms ?? [];
  return learnedForms.includes(formProgressKey(base, form));
}

function saveProgress(): void {
  writeFileSync(temporaryProgressPath, `${JSON.stringify(progress, null, 2)}\n`);
  renameSync(temporaryProgressPath, progressPath);
}

function updateChatProgress(
  chatId: number,
  update: (current: ChatProgress) => ChatProgress
): void {
  const chatKey = String(chatId);
  const current = progress[chatKey] ?? { learned: [] };
  progress[chatKey] = update(current);
  saveProgress();
}

export function markVerbFormLearned(
  chatId: number,
  base: string,
  form: VerbForm
): void {
  updateChatProgress(chatId, (current) => {
    const learnedForms = new Set(current.learnedForms ?? []);
    learnedForms.add(formProgressKey(base, form));
    return {
      ...current,
      learnedForms: [...learnedForms].sort(),
    };
  });
}

export function markLearned(chatId: number, base: string): void {
  updateChatProgress(chatId, (current) => {
    const learned = new Set(current.learned);
    learned.add(base);
    return { ...current, learned: [...learned].sort() };
  });
}

export function toggleLearned(chatId: number, base: string): boolean {
  const learnedStatus = !getLearnedBases(chatId).has(base);
  updateChatProgress(chatId, (current) => {
    const learned = new Set(current.learned);
    if (learnedStatus) {
      learned.add(base);
      return { ...current, learned: [...learned].sort() };
    }

    learned.delete(base);
    return {
      ...current,
      learned: [...learned].sort(),
      learnedForms: current.learnedForms?.filter(
        (key) => !key.startsWith(`${base}:`)
      ),
    };
  });

  return learnedStatus;
}

export function excludeLearned(
  chatId: number,
  verbs: IrregularVerb[]
): IrregularVerb[] {
  const learned = getLearnedBases(chatId);
  return verbs.filter((verb) => !learned.has(verb.base));
}
