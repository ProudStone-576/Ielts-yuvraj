/**
 * Validates every Listening and Reading test: 40 questions each, unique ids,
 * every written answer appears in its passage/script, MCQ and matching answers
 * exist, and every script speaker has a voice.  Run: npm run check:content
 */
import { LISTENING_TESTS } from "@/content/listening";
import { READING_TESTS } from "@/content/reading";
import type { QuestionGroup } from "@/lib/types";

let problems = 0;
const ids = new Set<string>();
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const squash = (s: string) => norm(s).replace(/ /g, "");

function fail(msg: string) {
  problems++;
  console.log("✗", msg);
}

function checkGroups(testId: string, groups: QuestionGroup[], source: string): number {
  let n = 0;
  for (const g of groups)
    for (const q of g.questions) {
      n++;
      if (ids.has(q.id)) fail(`${testId}: duplicate id ${q.id}`);
      ids.add(q.id);
      if (q.type === "text" && !q.answer.some((a) => norm(source).includes(norm(a)) || squash(source).includes(squash(a))))
        fail(`${testId}: answer for ${q.id} not found in text (${q.answer.join(" / ")})`);
      if (q.type === "mcq" && q.answer.charCodeAt(0) - 65 >= q.options.length) fail(`${testId}: ${q.id} answer out of range`);
      if (q.type === "select" && !g.options?.some((o) => o.value === q.answer)) fail(`${testId}: ${q.id} answer not in options`);
    }
  return n;
}

for (const t of READING_TESTS) {
  const total = t.sections.reduce((n, s) => n + checkGroups(t.id, s.groups, s.passages.map((p) => p.body).join(" ")), 0);
  if (total !== 40) fail(`${t.id}: ${total} questions (expected 40)`);
}
for (const t of LISTENING_TESTS) {
  let total = 0;
  for (const p of t.parts) {
    for (const l of p.script) if (!p.voices[l.speaker]) fail(`${t.id}: no voice for speaker "${l.speaker}"`);
    total += checkGroups(t.id, p.groups, p.script.map((l) => l.text).join(" "));
  }
  if (total !== 40) fail(`${t.id}: ${total} questions (expected 40)`);
}

console.log(`${READING_TESTS.length} reading + ${LISTENING_TESTS.length} listening tests, ${ids.size} questions, ${problems} problems`);
process.exit(problems ? 1 : 0);
