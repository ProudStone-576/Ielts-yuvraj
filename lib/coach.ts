import { formatBand } from "./scoring";
import type { Attempt, Module, SkillScore, Store } from "./types";
import { MODULE_LABEL, MODULES } from "./types";

/* ---------- Advice per question type ---------- */

export const SKILL_TIPS: Record<string, string> = {
  "True / False / Not Given":
    "FALSE means the text says the opposite; NOT GIVEN means the text doesn't say. If you're searching hard and can't find it, it's usually NOT GIVEN. Never use your own knowledge.",
  "Yes / No / Not Given":
    "These test the writer's opinion, not facts. Look for opinion words (should, unfortunately, it is clear that…). NOT GIVEN means the writer doesn't express a view on it.",
  "Multiple choice":
    "Read the question stem first, find the place in the text, then eliminate options one by one. The correct option usually paraphrases the text; options that repeat exact words are often traps.",
  "Matching headings":
    "Read each paragraph's first and last sentences and decide its main idea before looking at the headings. A heading summarises the WHOLE paragraph, not one detail in it.",
  Matching:
    "Underline the key word in each item and scan for synonyms. Options can be used more than once unless the instructions say otherwise, so don't eliminate them too early.",
  "Matching information":
    "You're looking for a specific detail (a reason, an example, a date) — not the main idea. Answers are NOT in text order, so scan the whole passage for each one.",
  "Completion & short answer":
    "Check the word limit every time — 'NO MORE THAN TWO WORDS' means three words scores zero. Copy spelling exactly from the text and make sure your answer fits the sentence grammatically.",
  "Form completion":
    "Predict the type of answer (number, name, date) before you listen. Names and postcodes are spelled out letter by letter — practise writing letters fast. Watch for corrections: the final answer is the one that counts.",
  "Note completion":
    "Notes follow the order of the talk. Listen for signposts ('Moving on to…', 'Another reason…') so you never lose your place, and check that singular/plural matches the notes.",
  "Sentence completion":
    "The sentence paraphrases the text, so look for synonyms rather than the same words. Your answer must make the completed sentence grammatical.",
  "Summary completion":
    "Find which part of the text the summary covers (usually one or two paragraphs), then read that part carefully. Decide whether each gap needs a noun, verb or adjective.",
  "Table completion":
    "Read across the rows and down the columns to understand the structure before you start. Gaps in the same column usually need the same type of word.",
};

/* ---------- Analysis ---------- */

export interface WeakArea {
  module: Module;
  skill: string;
  accuracy: number;
  total: number;
}

/** Question types with the lowest accuracy (needs at least 3 questions answered). */
export function weakAreas(attempts: Attempt[], limit = 3): WeakArea[] {
  const totals = new Map<string, { module: Module; skill: string } & SkillScore>();
  for (const a of attempts) {
    if (!a.breakdown) continue;
    for (const [skill, s] of Object.entries(a.breakdown)) {
      const key = `${a.module}:${skill}`;
      const cur = totals.get(key) ?? { module: a.module, skill, c: 0, t: 0 };
      cur.c += s.c;
      cur.t += s.t;
      totals.set(key, cur);
    }
  }
  return [...totals.values()]
    .filter((x) => x.t >= 3)
    .map((x) => ({ module: x.module, skill: x.skill, accuracy: x.c / x.t, total: x.t }))
    .filter((x) => x.accuracy < 0.85)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}

export function recentAverage(attempts: Attempt[], module: Module): number | undefined {
  const bands = attempts.filter((a) => a.module === module).map((a) => a.band).slice(-3);
  if (!bands.length) return undefined;
  return Math.round((bands.reduce((a, b) => a + b, 0) / bands.length) * 2) / 2;
}

/** Consecutive days (ending today or yesterday) with at least one finished test. */
export function streak(attempts: Attempt[]): number {
  const days = new Set(attempts.map((a) => new Date(a.date).toDateString()));
  const d = new Date();
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(d.toDateString())) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function daysUntil(date: string): number | null {
  if (!date) return null;
  const diff = new Date(date + "T00:00:00").getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.round(diff / 86_400_000);
}

/** Gap to target per module; untried modules count as the biggest gap. */
export function gaps(store: Store): Record<Module, number> {
  return Object.fromEntries(
    MODULES.map((m) => {
      const avg = recentAverage(store.attempts, m);
      return [m, avg === undefined ? 3 : store.target[m] - avg];
    }),
  ) as Record<Module, number>;
}

/* ---------- Coach messages ---------- */

export function greeting(name: string): string {
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return name ? `${part}, ${name}` : part;
}

export function coachMessage(store: Store): string {
  const g = gaps(store);
  const tried = MODULES.filter((m) => store.attempts.some((a) => a.module === m));
  const days = daysUntil(store.examDate);
  if (tried.length === 0) {
    return "Let's find out where you are. Start with one full Listening test today — it has the highest bar for CLB 9 (band 8.0), so it's the most important one to measure first.";
  }
  if (tried.length < 4) {
    const next = MODULES.find((m) => !tried.includes(m))!;
    return `Good start. Before we plan properly, I need a baseline in every module — let's do a ${MODULE_LABEL[next]} test next.`;
  }
  const atTarget = MODULES.filter((m) => g[m] <= 0);
  const worst = [...MODULES].sort((a, b) => g[b] - g[a])[0];
  if (atTarget.length === 4) {
    return "You're at CLB 9 level in all four modules on your recent tests. Now it's about consistency — keep doing full mock tests under exam conditions so this level holds on the day.";
  }
  const timing = days !== null && days > 0 ? ` With ${days} day${days === 1 ? "" : "s"} to go, ` : " ";
  return `You're at target in ${atTarget.length} of 4 modules.${timing}${MODULE_LABEL[worst]} needs the most work — it's ${formatBand(g[worst])} band${g[worst] === 1 ? "" : "s"} below your target, so it gets the biggest share of today's plan.`;
}

/** Feedback shown after finishing a test. */
export function testFeedback(module: Module, band: number, target: number, breakdown?: Record<string, SkillScore>): string[] {
  const out: string[] = [];
  const diff = band - target;
  if (diff >= 0.5) out.push(`Excellent — band ${formatBand(band)} is above your target of ${formatBand(target)}. Keep this up under timed conditions.`);
  else if (diff === 0) out.push(`Band ${formatBand(band)} — exactly on target. Now we make it reliable so a harder paper doesn't push you below.`);
  else if (diff >= -1) out.push(`Band ${formatBand(band)} — close. You're ${formatBand(-diff)} below your target of ${formatBand(target)}, which is usually just 2–4 more correct answers.`);
  else out.push(`Band ${formatBand(band)} — your target is ${formatBand(target)}. Don't worry: we'll work on the question types that cost you the most marks first.`);

  if (breakdown) {
    const weak = Object.entries(breakdown)
      .filter(([, s]) => s.t >= 2 && s.c / s.t < 0.8)
      .sort((a, b) => a[1].c / a[1].t - b[1].c / b[1].t)
      .slice(0, 2);
    for (const [skill, s] of weak) {
      out.push(`${skill}: ${s.c}/${s.t}. ${SKILL_TIPS[skill] ?? ""}`);
    }
    if (weak.length === 0) out.push("No single question type stood out as weak — your mistakes are spread out, so careful checking will help most.");
  }
  if (module === "listening" && diff < 0) out.push("Next step: go through the transcript below for every wrong answer and find the exact moment you missed it.");
  if (module === "reading" && diff < 0) out.push("Next step: for each wrong answer, find the sentence in the passage that proves the correct answer. This trains you to locate evidence faster.");
  return out;
}

/* ---------- Study plan ---------- */

export interface PlanTask {
  module: Module;
  title: string;
  detail: string;
  minutes: number;
  href: string;
}

const TASKS: Record<Module, { title: string; detail: string; minutes: number; href: string }[]> = {
  listening: [
    { title: "Full Listening test", detail: "All 4 parts under exam conditions — recordings play once.", minutes: 35, href: "/listening" },
  ],
  reading: [
    { title: "Full Reading test", detail: "60 minutes, 40 questions. Aim for about 15 minutes each on Sections 1 and 2, and 30 on Section 3.", minutes: 60, href: "/reading" },
  ],
  writing: [
    { title: "Full Writing test", detail: "Task 1 letter + Task 2 essay in 60 minutes. Start with Task 2 if you tend to run out of time.", minutes: 60, href: "/writing" },
  ],
  speaking: [
    { title: "Mock Speaking interview", detail: "All 3 parts, recorded. Listen back and count your fillers.", minutes: 15, href: "/speaking" },
  ],
};

/** Today's suggested work: the module furthest from target first, then rotation. */
export function todaysPlan(store: Store): PlanTask[] {
  const g = gaps(store);
  const doneToday = new Set(
    store.attempts.filter((a) => new Date(a.date).toDateString() === new Date().toDateString()).map((a) => a.module),
  );
  const order = [...MODULES].sort((a, b) => g[b] - g[a]);
  const picks = order.filter((m) => !doneToday.has(m)).slice(0, 2);
  return picks.map((m) => ({ module: m, ...TASKS[m][0] }));
}

export interface PlanWeek {
  label: string;
  focus: string;
  sessions: string[];
}

/** A week-by-week plan up to the exam date (or a 4-week default). */
export function studyPlan(store: Store): PlanWeek[] {
  const days = daysUntil(store.examDate);
  const weeks = Math.max(1, Math.min(12, days !== null && days > 0 ? Math.ceil(days / 7) : 4));
  const g = gaps(store);
  const ranked = [...MODULES].sort((a, b) => g[b] - g[a]);
  const plan: PlanWeek[] = [];
  for (let w = 1; w <= weeks; w++) {
    const last = w === weeks;
    const secondLast = w === weeks - 1 && weeks > 2;
    if (last && weeks > 1) {
      plan.push({
        label: `Week ${w} — exam week`,
        focus: "Stay sharp, don't cram",
        sessions: [
          "1 full mock exam (all four modules) early in the week",
          "Light Speaking practice daily — 2–3 Part 1 topics aloud",
          "Re-read your Writing feedback and model answers",
          "Rest the day before the exam",
        ],
      });
    } else if (secondLast) {
      plan.push({
        label: `Week ${w} — full mocks`,
        focus: "Exam stamina",
        sessions: [
          "2 full mock exams in one sitting (Listening → Reading → Writing)",
          "1 Speaking interview",
          `Extra ${MODULE_LABEL[ranked[0]]} test`,
        ],
      });
    } else {
      const main = ranked[(w - 1) % 2];
      const other = ranked[2 + ((w - 1) % 2)];
      plan.push({
        label: `Week ${w}`,
        focus: `${MODULE_LABEL[main]} + ${MODULE_LABEL[ranked[1 - ((w - 1) % 2)]]}`,
        sessions: [
          `2 × ${MODULE_LABEL[main]} tests — review every mistake`,
          `1 × ${MODULE_LABEL[ranked[1 - ((w - 1) % 2)]]} test`,
          `1 × ${MODULE_LABEL[other]} test to keep it fresh`,
          "1 Speaking interview (record and listen back)",
        ],
      });
    }
  }
  return plan;
}

