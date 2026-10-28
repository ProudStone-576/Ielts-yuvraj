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
  | { id: string; type: "select"; prompt: string; answer: string }
  | { id: string; type: "text"; prompt: string; answer: string[] };

export interface QuestionGroup {
  instructions: string;
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

/* ---------- Speaking ---------- */

export interface SpeakingSet {
  id: string;
  title: string;
  part1: { topic: string; questions: string[] }[];
  part2: { cue: string; bullets: string[]; followUp: string };
  part3: { topic: string; questions: string[] };
}

/* ---------- Progress ---------- */

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
}

export interface Store {
  version: 1;
  name: string;
  examDate: string;
  target: Record<Module, number>;
  attempts: Attempt[];
  drafts: Record<string, string>;
}
