import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildAnsweredContextQuestion,
  buildQuestion,
  buildWrongQuestion,
  checkAnswer,
  formatAnswer,
} from "./quiz.js";
import type { IrregularVerb } from "./verbs.js";

const stick: IrregularVerb = {
  base: "stick",
  pastSimple: "stuck",
  pastParticiple: "stuck",
};

describe("quiz questions", () => {
  it("builds context questions with a visible blank and form label", () => {
    const question = buildQuestion(stick, "verbs-in-context");

    assert.match(question, /STICK/);
    assert.match(question, /second form/);
    assert.match(question, /\\_\\_\\_\\_/);
  });

  it("fills the context blank after a correct answer", () => {
    const question = buildAnsweredContextQuestion(stick);

    assert.match(question, /\*stuck\*/);
    assert.doesNotMatch(question, /____/);
  });

  it("appends wrong-answer feedback to the original question", () => {
    const question = buildWrongQuestion(stick, "verbs-in-context");

    assert.match(question, /\\_\\_\\_\\_/);
    assert.match(question, /Wrong\. Answer: \*stuck\*$/);
  });
});

describe("quiz answers", () => {
  it("checks both forms in base-to-forms mode", () => {
    assert.equal(checkAnswer(stick, "base-to-forms", "stuck stuck"), true);
    assert.equal(checkAnswer(stick, "base-to-forms", "stuck"), false);
  });

  it("checks the requested form in context mode", () => {
    assert.equal(checkAnswer(stick, "verbs-in-context", "STUCK"), true);
    assert.equal(checkAnswer(stick, "verbs-in-context", "stick"), false);
  });

  it("formats answers for every mode", () => {
    assert.equal(formatAnswer(stick, "base-to-forms"), "stuck stuck");
    assert.equal(formatAnswer(stick, "past-to-base"), "stick");
    assert.equal(formatAnswer(stick, "participle-to-base"), "stick");
    assert.equal(formatAnswer(stick, "verbs-in-context"), "stuck");
  });
});
