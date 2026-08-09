import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { IrregularVerb } from "./verbs.js";

type ProgressFile = Record<string, { learned: string[] }>;

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

function saveProgress(): void {
  writeFileSync(temporaryProgressPath, `${JSON.stringify(progress, null, 2)}\n`);
  renameSync(temporaryProgressPath, progressPath);
}

function updateLearned(
  chatId: number,
  base: string,
  learnedStatus: boolean
): void {
  const learned = getLearnedBases(chatId);
  if (learnedStatus) {
    learned.add(base);
  } else {
    learned.delete(base);
  }
  progress[String(chatId)] = { learned: [...learned].sort() };
  saveProgress();
}

export function markLearned(chatId: number, base: string): void {
  updateLearned(chatId, base, true);
}

export function toggleLearned(chatId: number, base: string): boolean {
  const learnedStatus = !getLearnedBases(chatId).has(base);
  updateLearned(chatId, base, learnedStatus);
  return learnedStatus;
}

export function excludeLearned(
  chatId: number,
  verbs: IrregularVerb[]
): IrregularVerb[] {
  const learned = getLearnedBases(chatId);
  return verbs.filter((verb) => !learned.has(verb.base));
}
