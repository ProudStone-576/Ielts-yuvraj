import type { Module, Question } from "./types";

/** Official-style raw score (out of 40) to band conversion for Listening. */
const LISTENING_TABLE: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6],
  [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [3, 2], [2, 1.5], [1, 1], [0, 0],
];

/** General Training Reading raw score (out of 40) to band conversion. */
const GT_READING_TABLE: [number, number][] = [
  [40, 9], [39, 8.5], [37, 8], [36, 7.5], [34, 7], [32, 6.5], [30, 6],
  [27, 5.5], [23, 5], [19, 4.5], [15, 4], [12, 3.5], [9, 3], [6, 2.5], [4, 2], [2, 1.5], [1, 1], [0, 0],
];

/**
 * Converts a raw score to a band. Shorter practice sets are scaled to 40
 * so a single section still gives an estimate.
 */
export function rawToBand(module: "listening" | "reading", raw: number, total = 40): number {
  const scaled = Math.round((raw / total) * 40);
  const table = module === "listening" ? LISTENING_TABLE : GT_READING_TABLE;
  for (const [min, band] of table) if (scaled >= min) return band;
  return 0;
}

/** Rounds to the nearest half band the way IELTS does (.25 -> .5, .75 -> next whole). */
export function roundBand(x: number): number {
  return Math.round(x * 2) / 2;
}

export function overallBand(bands: number[]): number {
  if (bands.length === 0) return 0;
  return roundBand(bands.reduce((a, b) => a + b, 0) / bands.length);
}

/**
 * IRCC equivalency for IELTS General Training -> CLB.
 * Each row: [CLB, listening, reading, writing, speaking] minimum bands.
 */
const CLB_TABLE: [number, number, number, number, number][] = [
  [10, 8.5, 8, 7.5, 7.5],
  [9, 8, 7, 7, 7],
  [8, 7.5, 6.5, 6.5, 6.5],
  [7, 6, 6, 6, 6],
  [6, 5.5, 5, 5.5, 5.5],
  [5, 5, 4, 5, 5],
  [4, 4.5, 3.5, 4, 4],
];

const CLB_COL: Record<Module, number> = { listening: 1, reading: 2, writing: 3, speaking: 4 };

export function bandToClb(module: Module, band: number): number {
  for (const row of CLB_TABLE) if (band >= row[CLB_COL[module]]) return row[0];
  return 0;
}

export function clbMinimum(module: Module, clb: number): number | undefined {
  const row = CLB_TABLE.find((r) => r[0] === clb);
  return row?.[CLB_COL[module]];
}

export const CLB9_TARGET: Record<Module, number> = {
  listening: 8,
  reading: 7,
  writing: 7,
  speaking: 7,
};

/* ---------- Answer checking ---------- */

function normalise(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[.,;:!?"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** The letters chosen for a "Choose TWO letters" question, stored as "A,C". */
export function chosen(given: string | undefined): string[] {
  return given ? given.split(",").filter(Boolean) : [];
}

/** Marks scored: one per correct letter for "Choose TWO letters" (in any order), otherwise 0 or 1. */
export function marks(q: Question, given: string | undefined): number {
  if (q.type === "multi") return chosen(given).filter((l) => q.answer.includes(l)).length;
  return isCorrect(q, given) ? 1 : 0;
}

export function isCorrect(q: Question, given: string | undefined): boolean {
  if (!given) return false;
  if (q.type === "multi") return marks(q, given) === q.answer.length;
  if (q.type === "text") {
    const g = normalise(given);
    return q.answer.some((a) => normalise(a) === g);
  }
  return given === q.answer;
}

export function displayAnswer(q: Question): string {
  if (q.type === "multi") return q.answer.join(" and ");
  return q.type === "text" ? q.answer.join(" / ") : q.answer;
}

/* ---------- Writing & speaking self-assessment ---------- */

export function writingBand(task1: number, task2: number): number {
  // Task 2 counts twice as much as Task 1.
  return roundBand((task1 + task2 * 2) / 3);
}

export function countWords(text: string): number {
  const m = text.trim().match(/\S+/g);
  return m ? m.length : 0;
}

export function formatBand(b: number): string {
  return b.toFixed(1);
}
