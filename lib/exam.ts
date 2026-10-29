import { isCorrect } from "./scoring";
import type { Question, QuestionGroup, SkillScore } from "./types";

export type Answers = Record<string, string>;

export interface Block {
  label: string;
  groups: QuestionGroup[];
}

export interface Numbered {
  /** question id -> question number (1..40) */
  numberOf: Map<string, number>;
  /** blocks (parts/sections) with the question numbers they contain */
  parts: { label: string; numbers: number[] }[];
  total: number;
}

export function numberQuestions(blocks: Block[]): Numbered {
  const numberOf = new Map<string, number>();
  let n = 0;
  const parts = blocks.map((b) => {
    const numbers: number[] = [];
    for (const g of b.groups)
      for (const q of g.questions) {
        numberOf.set(q.id, ++n);
        numbers.push(n);
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
      return "Multiple choice";
    case "select":
      return group.options?.[0]?.value === "i" ? "Matching headings" : "Matching";
    default:
      return "Completion & short answer";
  }
}

export function scoreBlocks(blocks: Block[], answers: Answers) {
  let raw = 0;
  const breakdown: Record<string, SkillScore> = {};
  for (const b of blocks)
    for (const g of b.groups)
      for (const q of g.questions) {
        const ok = isCorrect(q, answers[q.id]);
        if (ok) raw++;
        const s = (breakdown[skillOf(g, q)] ??= { c: 0, t: 0 });
        s.t++;
        if (ok) s.c++;
      }
  return { raw, breakdown };
}
