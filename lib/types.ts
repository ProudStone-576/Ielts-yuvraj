export type Module = "listening" | "reading" | "writing" | "speaking";

export const MODULES: Module[] = ["listening", "reading", "writing", "speaking"];

export const MODULE_LABEL: Record<Module, string> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

/* ---------- Objective questions (Listening & Reading) ---------- */

export type Question =
  | { id: string; type: "mcq"; prompt: string; options: string[]; answer: string }
  | { id: string; type: "tfng"; prompt: string; answer: "TRUE" | "FALSE" | "NOT GIVEN" }
  | { id: string; type: "ynng"; prompt: string; answer: "YES" | "NO" | "NOT GIVEN" }
  | { id: string; type: "select"; prompt: string; answer: string }
  | { id: string; type: "text"; prompt: string; answer: string[] };

export interface QuestionGroup {
  instructions: string;
  /** Question-type label used for weak-area analysis, e.g. "Matching headings". */
  skill?: string;
  /** Shared options for "select" (matching) questions, e.g. [{value:"A", label:"..."}] */
  options?: { value: string; label: string }[];
  questions: Question[];
}

export interface ReadingSection {
  title: string;
  passages: { title: string; body: string }[];
  groups: QuestionGroup[];
}

export interface ReadingTest {
  id: string;
  title: string;
  description: string;
  sections: ReadingSection[];
}

export interface ScriptLine {
  speaker: string;
  text: string;
}

export interface ListeningPart {
  title: string;
  context: string;
  /** Speaker name -> voice style used by text-to-speech */
  voices: Record<string, { lang: string; pitch: number; rate?: number }>;
  script: ScriptLine[];
  groups: QuestionGroup[];
}

export interface ListeningTest {
  id: string;
  title: string;
  description: string;
  parts: ListeningPart[];
}

/* ---------- Writing ---------- */

export interface WritingTask {
  id: string;
  task: 1 | 2;
  title: string;
  /** Letter type for Task 1, essay type for Task 2 */
  kind: string;
  prompt: string;
  bullets?: string[];
  minWords: number;
  minutes: number;
  tips: string[];
  modelAnswer: string;
}

export interface WritingTest {
  id: string;
  title: string;
  task1: string;
  task2: string;
}

/* ---------- Speaking ---------- */

export interface SpeakingSet {
  id: string;
  title: string;
  part1: { topic: string; questions: string[] }[];
  part2: { cue: string; bullets: string[]; followUp: string };
  part3: { topic: string; questions: string[] };
}

/* ---------- Progress ---------- */

export interface SkillScore {
  c: number;
  t: number;
}

export interface Attempt {
  id: string;
  module: Module;
  testId: string;
  title: string;
  date: string;
  band: number;
  raw?: number;
  total?: number;
  notes?: string;
  /** Correct / total per question type, for weak-area analysis. */
  breakdown?: Record<string, SkillScore>;
}

export interface Store {
  version: 1;
  /** Account this data belongs to (cloud save). Empty when used without an account. */
  owner: string;
  /** Last local change, used to merge with the cloud copy. */
  updatedAt: number;
  name: string;
  examDate: string;
  target: Record<Module, number>;
  attempts: Attempt[];
  /** Ids of attempts deleted on any device, so they don't come back when merging. */
  deleted: string[];
  drafts: Record<string, string>;
}
