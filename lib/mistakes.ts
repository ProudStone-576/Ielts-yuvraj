import { LISTENING_TESTS } from "@/content/listening";
import { READING_TESTS } from "@/content/reading";
import type { Attempt, Question, QuestionGroup } from "./types";

/* The mistake notebook: wrong Listening and Reading answers, with the sentence that proves the right answer. */

export interface QuestionInfo {
  module: "listening" | "reading";
  testId: string;
  testTitle: string;
  /** "Part 2" or "Section 3 — The Disappearing Night Sky" */
  where: string;
  group: QuestionGroup;
  question: Question;
  /** The transcript or passage text the question is about, split into sentences. */
  sentences: string[];
}

function sentencesOf(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);
}

let index: Map<string, QuestionInfo> | null = null;

/** question id -> where it comes from (built once, on first use). */
export function questionIndex(): Map<string, QuestionInfo> {
  if (index) return index;
  index = new Map();
  for (const t of LISTENING_TESTS)
    for (const p of t.parts) {
      const sentences = p.script.flatMap((l) => sentencesOf(l.text).map((s) => `${l.speaker}: ${s}`));
      for (const g of p.groups)
        for (const q of g.questions) index.set(q.id, { module: "listening", testId: t.id, testTitle: t.title, where: p.title, group: g, question: q, sentences });
    }
  for (const t of READING_TESTS)
    for (const s of t.sections) {
      const sentences = s.passages.flatMap((p) => sentencesOf(p.body));
      const where = s.passages.length === 1 ? `${s.title} — ${s.passages[0].title}` : s.title;
      for (const g of s.groups)
        for (const q of g.questions) index.set(q.id, { module: "reading", testId: t.id, testTitle: t.title, where, group: g, question: q, sentences });
    }
  return index;
}

const STOP = new Set(
  "the a an and or but of to in on for with at by from as is are was were be been it its this that these those you he she we they their there what which who when where why how not no do does did have has had will would can could should may might than then so very also more most about into over after before only one each other some any all such".split(" "),
);
const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** What the correct answer says, in words (for matching it against the text). */
function answerText(info: QuestionInfo): string[] {
  const q = info.question;
  const label = (v: string) => info.group.options?.find((o) => o.value === v)?.label ?? "";
  switch (q.type) {
    case "text":
      return q.answer;
    case "mcq":
      return [q.options[q.answer.charCodeAt(0) - 65] ?? ""];
    case "multi":
      return q.answer.map((l) => q.options[l.charCodeAt(0) - 65] ?? "");
    case "select":
      return [label(q.answer)];
    default:
      return [];
  }
}

/**
 * The sentence(s) that most likely prove the answer: for written answers, where the answer appears;
 * otherwise, the sentences sharing the most words with the question and the correct option.
 */
export function evidence(info: QuestionInfo): string[] {
  const q = info.question;
  if (q.type === "text") {
    const hit = info.sentences.find((s) => q.answer.some((a) => squash(s).includes(squash(a))));
    return hit ? [hit] : [];
  }
  if (q.type === "multi") {
    // One sentence for each correct option: the one sharing the most words with that option.
    return answerText(info)
      .map((opt) => best(info.sentences, new Set(words(opt)), 1))
      .filter((x): x is string => !!x);
  }
  const target = new Set(words([q.prompt, ...answerText(info)].join(" ")));
  const hit = best(info.sentences, target, 2);
  return hit ? [hit] : [];
}

/** The sentence sharing the most words with `target` (at least `min` of them). */
function best(sentences: string[], target: Set<string>, min: number): string | undefined {
  let top: { s: string; n: number } | undefined;
  for (const s of sentences) {
    const n = new Set(words(s).filter((w) => target.has(w))).size;
    if (n >= min && (!top || n > top.n)) top = { s, n };
  }
  return top?.s;
}

export interface Mistake {
  info: QuestionInfo;
  given: string;
  date: string;
}

/** Each question's latest wrong answer, newest first, leaving out questions since answered correctly. */
export function openMistakes(attempts: Attempt[], mastered: string[]): Mistake[] {
  const done = new Set(mastered);
  const seen = new Set<string>();
  const out: Mistake[] = [];
  const idx = questionIndex();
  for (const a of [...attempts].sort((x, y) => y.date.localeCompare(x.date)))
    for (const m of a.mistakes ?? []) {
      if (seen.has(m.id) || done.has(m.id)) continue;
      seen.add(m.id);
      const info = idx.get(m.id);
      if (info) out.push({ info, given: m.given, date: a.date });
    }
  return out;
}
