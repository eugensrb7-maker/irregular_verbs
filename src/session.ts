import type { IrregularVerb, QuizMode } from "./verbs.js";
import type { VerbForm } from "./verb-contexts.js";

type SessionState = {
  current: IrregularVerb;
  awaitingReview: boolean;
  questionMessageId?: number;
};

export type ContextSession = SessionState & {
  mode: "verbs-in-context";
  contextForm: VerbForm;
};

type StandardQuizMode = Exclude<QuizMode, "verbs-in-context">;

export type StandardSession = SessionState & {
  mode: StandardQuizMode;
  contextForm?: never;
};

export type Session = ContextSession | StandardSession;

const sessions = new Map<number, Session>();

export function getSession(chatId: number): Session | undefined {
  return sessions.get(chatId);
}

export function setSession(chatId: number, session: Session): void {
  sessions.set(chatId, session);
}

export function clearSession(chatId: number): void {
  sessions.delete(chatId);
}
