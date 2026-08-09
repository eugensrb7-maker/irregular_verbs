import type { IrregularVerb, QuizMode } from "./verbs.js";

export type Session = {
  mode: QuizMode;
  current: IrregularVerb;
  awaitingReview: boolean;
};

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
