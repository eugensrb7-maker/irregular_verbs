import "dotenv/config";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Bot, InlineKeyboard } from "grammy";
import {
  buildQuestion,
  checkAnswer,
  formatAnswer,
  pickRandomVerb,
} from "./quiz.js";
import { clearSession, getSession, setSession } from "./session.js";
import {
  excludeLearned,
  getLearnedBases,
  markLearned,
  toggleLearned,
} from "./learned.js";
import {
  buildPickerKeyboard,
  buildPickerMessage,
  splitFullListMessages,
  VERBS_PAGE_SIZE,
} from "./verb-list.js";
import {
  QUIZ_MODE_LABELS,
  type IrregularVerb,
  type QuizMode,
} from "./verbs.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const verbsPath = join(__dirname, "..", "data", "verbs.json");
const verbs: IrregularVerb[] = JSON.parse(readFileSync(verbsPath, "utf-8"));

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN is missing. Add it to your .env file.");
}

const bot = new Bot(token);

function modeKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text(QUIZ_MODE_LABELS["base-to-forms"], "mode:base-to-forms")
    .row()
    .text(QUIZ_MODE_LABELS["past-to-base"], "mode:past-to-base")
    .row()
    .text(QUIZ_MODE_LABELS["participle-to-base"], "mode:participle-to-base");
}

function startQuiz(chatId: number, mode: QuizMode = "base-to-forms") {
  const pool = getStudyPool(chatId);
  const verb = pickRandomVerb(pool);
  setSession(chatId, {
    mode,
    current: verb,
    awaitingReview: false,
  });
  return buildQuestion(verb, mode);
}

function getStudyPool(chatId: number): IrregularVerb[] {
  return excludeLearned(chatId, verbs);
}

function advanceSession(
  chatId: number,
  session: NonNullable<ReturnType<typeof getSession>>
) {
  const pool = getStudyPool(chatId);
  if (pool.length === 0) {
    return undefined;
  }
  const next = pickRandomVerb(pool, session.current);
  session.current = next;
  return next;
}

function reviewKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("Show again", "review:again")
    .text("I'm done with it", "review:learned");
}

function resolveChatId(ctx: {
  chat?: { id: number };
  callbackQuery: { message?: { chat: { id: number } } | null };
}): number | undefined {
  return ctx.chat?.id ?? ctx.callbackQuery.message?.chat.id;
}

async function sendPicker(
  ctx: { reply: (text: string, extra?: object) => Promise<unknown> },
  chatId: number,
  page = 0
) {
  await ctx.reply(...pickerContent(chatId, page));
}

function pickerContent(chatId: number, page: number) {
  const learned = getLearnedBases(chatId);
  return [
    buildPickerMessage(verbs, learned, page),
    {
      parse_mode: "Markdown" as const,
      reply_markup: buildPickerKeyboard(verbs, learned, page),
    },
  ] as const;
}

async function editPicker(
  ctx: {
    editMessageText: (text: string, extra?: object) => Promise<unknown>;
    answerCallbackQuery: (extra?: object) => Promise<unknown>;
  },
  chatId: number,
  page: number,
  toast?: string
) {
  await ctx.editMessageText(...pickerContent(chatId, page));
  await ctx.answerCallbackQuery(toast ? { text: toast } : undefined);
}

bot.command("start", async (ctx) => {
  await ctx.reply(
    "Irregular Verbs Study Bot\n\n" +
      "Commands:\n" +
      "/study — start a quiz\n" +
      "/verbs — view all verbs and choose which to study\n" +
      `/list — show the full verb list (${verbs.length} verbs)\n` +
      "/mode — choose quiz mode\n" +
      "/stop — end the session\n\n" +
      "Default mode: base form → past simple / past participle\n",
    { parse_mode: "Markdown" }
  );
});

bot.command("list", async (ctx) => {
  const learned = getLearnedBases(ctx.chat.id);
  const messages = splitFullListMessages(verbs, learned);
  for (const message of messages) {
    await ctx.reply(message, { parse_mode: "Markdown" });
  }
});

bot.command("verbs", async (ctx) => {
  await sendPicker(ctx, ctx.chat.id);
});

bot.command("study", async (ctx) => {
  const pool = getStudyPool(ctx.chat.id);
  if (pool.length === 0) {
    await ctx.reply(
      "No active verbs remain. Use /verbs to restore a learned verb."
    );
    return;
  }
  const question = startQuiz(ctx.chat.id);
  await ctx.reply(question, { parse_mode: "Markdown" });
});

bot.command("mode", async (ctx) => {
  await ctx.reply("Choose a quiz mode:", { reply_markup: modeKeyboard() });
});

bot.command("stop", async (ctx) => {
  const session = getSession(ctx.chat.id);
  if (!session) {
    await ctx.reply("No active session.");
    return;
  }
  clearSession(ctx.chat.id);
  await ctx.reply("Session ended.");
});

bot.callbackQuery(/^mode:(.+)$/, async (ctx) => {
  const chatId = resolveChatId(ctx);
  if (!chatId) {
    await ctx.answerCallbackQuery({ text: "Could not start quiz." });
    return;
  }

  const pool = getStudyPool(chatId);
  if (pool.length === 0) {
    await ctx.answerCallbackQuery({
      text: "Restore at least one verb with /verbs",
    });
    return;
  }

  const mode = ctx.match[1];
  if (!isQuizMode(mode)) {
    await ctx.answerCallbackQuery({ text: "Unknown quiz mode." });
    return;
  }
  const question = startQuiz(chatId, mode);
  await ctx.answerCallbackQuery({ text: QUIZ_MODE_LABELS[mode] });
  await ctx.editMessageText(
    `Mode set to: ${QUIZ_MODE_LABELS[mode]}\n\n${question}`,
    { parse_mode: "Markdown" }
  );
});

bot.callbackQuery(/^verbs:page:(\d+)$/, async (ctx) => {
  const chatId = resolveChatId(ctx);
  if (!chatId) {
    await ctx.answerCallbackQuery({ text: "Something went wrong." });
    return;
  }
  await editPicker(ctx, chatId, Number(ctx.match[1]));
});

bot.callbackQuery(/^verbs:toggle:(\d+)$/, async (ctx) => {
  const chatId = resolveChatId(ctx);
  if (!chatId) {
    await ctx.answerCallbackQuery({ text: "Something went wrong." });
    return;
  }

  const index = Number(ctx.match[1]);
  const verb = verbs[index];
  if (!verb) {
    await ctx.answerCallbackQuery({ text: "Unknown verb." });
    return;
  }

  const page = Math.floor(index / VERBS_PAGE_SIZE);
  const learned = toggleLearned(chatId, verb.base);
  const toast = learned
    ? `${verb.base} marked as learned`
    : `${verb.base} restored to active`;
  await editPicker(ctx, chatId, page, toast);
});

bot.callbackQuery("verbs:fulllist", async (ctx) => {
  const chatId = resolveChatId(ctx);
  if (!chatId) {
    await ctx.answerCallbackQuery({ text: "Something went wrong." });
    return;
  }

  const learned = getLearnedBases(chatId);
  await ctx.answerCallbackQuery();
  const messages = splitFullListMessages(verbs, learned);
  for (const message of messages) {
    await ctx.reply(message, { parse_mode: "Markdown" });
  }
});

bot.callbackQuery(/^review:(again|learned)$/, async (ctx) => {
  const chatId = resolveChatId(ctx);
  if (!chatId) {
    await ctx.answerCallbackQuery({ text: "Something went wrong." });
    return;
  }

  const session = getSession(chatId);
  if (!session || !session.awaitingReview) {
    await ctx.answerCallbackQuery({ text: "This choice has expired." });
    return;
  }

  if (ctx.match[1] === "learned") {
    markLearned(chatId, session.current.base);
  }
  session.awaitingReview = false;

  await ctx.answerCallbackQuery({
    text: ctx.match[1] === "learned" ? "Marked as learned" : "Kept for review",
  });
  await ctx.editMessageReplyMarkup({ reply_markup: undefined });

  const next = advanceSession(chatId, session);
  if (!next) {
    clearSession(chatId);
    await ctx.reply("You've learned all verbs!");
    return;
  }

  await ctx.reply(buildQuestion(next, session.mode), { parse_mode: "Markdown" });
});

bot.on("message:text", async (ctx) => {
  if (ctx.message.text.startsWith("/")) {
    return;
  }

  const session = getSession(ctx.chat.id);
  if (!session) {
    return;
  }

  if (session.awaitingReview) {
    await ctx.reply("Please choose one of the buttons first.");
    return;
  }

  const pool = getStudyPool(ctx.chat.id);
  if (pool.length === 0) {
    await ctx.reply(
      "No active verbs remain. Use /verbs to restore a learned verb."
    );
    clearSession(ctx.chat.id);
    return;
  }

  const ok = checkAnswer(session.current, session.mode, ctx.message.text);
  if (ok) {
    session.awaitingReview = true;
    await ctx.reply(
      "Correct!\n\nDo you want to see this verb again, or have you learned it?",
      { reply_markup: reviewKeyboard() }
    );
    return;
  }

  const answer = formatAnswer(session.current, session.mode);
  const next = advanceSession(ctx.chat.id, session)!;
  await ctx.reply(
    `Wrong. Answer: ${answer}\n\n${buildQuestion(next, session.mode)}`,
    { parse_mode: "Markdown" }
  );
});

bot.catch((err) => {
  console.error("Bot error:", err);
});

console.log("Irregular verbs bot is running...");
bot.start();

function isQuizMode(value: string): value is QuizMode {
  return Object.hasOwn(QUIZ_MODE_LABELS, value);
}
