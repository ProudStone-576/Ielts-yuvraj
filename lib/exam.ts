import { marks } from "./scoring";
import type { Question, QuestionGroup, SkillScore } from "./types";

export type Answers = Record<string, string>;

export interface Block {
  label: string;
  groups: QuestionGroup[];
}

export interface Numbered {
  /** question id -> its (first) question number (1..40) */
  numberOf: Map<string, number>;
  /** blocks (parts/sections) with the question numbers they contain */
  parts: { label: string; numbers: number[] }[];
  total: number;
}

/** How many question numbers (and marks) a question has: 2 for "Choose TWO letters", otherwise 1. */
export function sizeOf(q: Question): number {
  return q.type === "multi" ? q.answer.length : 1;
}

export function numberQuestions(blocks: Block[]): Numbered {
  const numberOf = new Map<string, number>();
  let n = 0;
  const parts = blocks.map((b) => {
    const numbers: number[] = [];
    for (const g of b.groups)
      for (const q of g.questions) {
        numberOf.set(q.id, n + 1);
        for (let i = 0; i < sizeOf(q); i++) numbers.push(++n);
      }
    return { label: b.label, numbers };
  });
  return { numberOf, parts, total: n };
}

export function skillOf(group: QuestionGroup, q: Question): string {
  if (group.skill) return group.skill;
  switch (q.type) {
    case "tfng":
      return "True / False / Not Given";
    case "ynng":
      return "Yes / No / Not Given";
    case "mcq":
    case "multi":
      return "Multiple choice";
    case "select":
      return group.options?.[0]?.value === "i" ? "Matching headings" : "Matching";
    default:
      return "Completion & short answer";
  }
}

export function scoreBlocks(blocks: Block[], answers: Answers) {
  let raw = 0;
  const mistakes: { id: string; given: string }[] = [];
  const breakdown: Record<string, SkillScore> = {};
  for (const b of blocks)
    for (const g of b.groups)
      for (const q of g.questions) {
        const got = marks(q, answers[q.id]);
        raw += got;
        if (got < sizeOf(q)) mistakes.push({ id: q.id, given: answers[q.id] ?? "" });
        const s = (breakdown[skillOf(g, q)] ??= { c: 0, t: 0 });
        s.t += sizeOf(q);
        s.c += got;
      }
  return { raw, breakdown, mistakes };
}
