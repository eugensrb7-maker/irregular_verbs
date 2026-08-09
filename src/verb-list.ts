import { InlineKeyboard } from "grammy";
import type { IrregularVerb } from "./verbs.js";

export const VERBS_PAGE_SIZE = 8;

function totalPages(verbCount: number): number {
  return Math.max(1, Math.ceil(verbCount / VERBS_PAGE_SIZE));
}

export function formatVerbLine(
  verb: IrregularVerb,
  learned: boolean
): string {
  const mark = learned ? "🎓" : "✓";
  return `${mark} ${verb.base} — ${verb.pastSimple} — ${verb.pastParticiple}`;
}

const TELEGRAM_MESSAGE_LIMIT = 4096;

export function splitFullListMessages(
  verbs: IrregularVerb[],
  learned: Set<string>
): string[] {
  const lines = verbs.map((v) => formatVerbLine(v, learned.has(v.base)));
  const header = "Full list (✓ = active, 🎓 = learned)\n\n";
  const footer = (activeCount: number, learnedCount: number) =>
    `\n\n${activeCount} active · ${learnedCount} learned · ${verbs.length} total.`;

  const messages: string[] = [];
  let chunk = header;
  let chunkLines = 0;

  for (const line of lines) {
    const next = chunkLines === 0 ? `${chunk}${line}` : `${chunk}\n${line}`;
    if (next.length > TELEGRAM_MESSAGE_LIMIT - 80 && chunkLines > 0) {
      messages.push(chunk);
      chunk = line;
      chunkLines = 1;
      continue;
    }
    chunk = next;
    chunkLines += 1;
  }

  if (chunk.length > 0) {
    messages.push(chunk);
  }

  const activeCount = verbs.filter((v) => !learned.has(v.base)).length;
  const learnedCount = verbs.filter((v) => learned.has(v.base)).length;
  const lastIndex = messages.length - 1;
  messages[lastIndex] += footer(activeCount, learnedCount);

  return messages;
}

export function buildPickerMessage(
  verbs: IrregularVerb[],
  learned: Set<string>,
  page: number
): string {
  const activeCount = verbs.filter((v) => !learned.has(v.base)).length;
  const learnedCount = verbs.filter((v) => learned.has(v.base)).length;
  const pages = totalPages(verbs.length);
  const safePage = Math.min(page, pages - 1);

  return (
    `*Verb selection* (${activeCount} active · ${learnedCount} learned)\n\n` +
    "✓ active · 🎓 learned\n" +
    "Tap a verb to switch between active and learned.\n" +
    `Page ${safePage + 1}/${pages}`
  );
}

export function buildPickerKeyboard(
  verbs: IrregularVerb[],
  learned: Set<string>,
  page: number
): InlineKeyboard {
  const kb = new InlineKeyboard();
  const pages = totalPages(verbs.length);
  const safePage = Math.min(Math.max(page, 0), pages - 1);
  const start = safePage * VERBS_PAGE_SIZE;
  const slice = verbs.slice(start, start + VERBS_PAGE_SIZE);

  for (let i = 0; i < slice.length; i++) {
    const verb = slice[i];
    const globalIndex = start + i;
    const icon = learned.has(verb.base) ? "🎓" : "✓";
    kb.text(`${icon} ${verb.base}`, `verbs:toggle:${globalIndex}`);
    if (i % 2 === 1) {
      kb.row();
    }
  }
  if (slice.length % 2 === 1) {
    kb.row();
  }

  if (safePage > 0) {
    kb.text("◀ Prev", `verbs:page:${safePage - 1}`);
  }
  kb.text("📋 Full list", "verbs:fulllist");
  if (safePage < pages - 1) {
    kb.text("Next ▶", `verbs:page:${safePage + 1}`);
  }
  return kb;
}
