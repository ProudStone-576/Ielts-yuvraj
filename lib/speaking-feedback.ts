import { FILLERS } from "@/content/speaking";
import { countWords } from "./scoring";
import type { SpeakingSet } from "./types";
import { formatClock } from "./useTimer";

export interface PartRecording {
  transcript: string;
  seconds: number;
}

export interface FluencyCheck {
  ok: boolean;
  text: string;
}

function fillerCount(text: string): number {
  const lower = ` ${text.toLowerCase()} `;
  return FILLERS.reduce((n, f) => n + lower.split(new RegExp(`\\b${f}\\b`)).length - 1, 0);
}

/**
 * Fluency checks from the transcripts: Part 2 length, answer length in Parts 1 and 3, speaking speed and
 * fillers. Transcripts are approximate, so the checks are guides, not scores.
 */
export function fluencyReport(set: SpeakingSet, parts: Record<number, PartRecording | undefined>): { checks: FluencyCheck[]; summary: string } {
  const checks: FluencyCheck[] = [];
  const p1 = parts[1];
  const p2 = parts[2];
  const p3 = parts[3];
  const all = [p1, p2, p3].filter((p): p is PartRecording => !!p && countWords(p.transcript) > 0);
  if (all.length === 0) return { checks, summary: "" };

  if (p2) {
    const s = p2.seconds;
    checks.push({
      ok: s >= 100,
      text:
        s >= 100
          ? `Part 2: you spoke for ${formatClock(s)} — good, you used the time.`
          : `Part 2: you spoke for ${formatClock(s)}. Aim for 1:45–2:00. Use every bullet point, then add an example or a feeling to keep going.`,
    });
  }
  // The introduction's three questions count as Part 1.
  const p1Questions = 3 + set.part1.reduce((n, t) => n + t.questions.length, 0);
  if (p1 && countWords(p1.transcript) > 0) {
    const avg = Math.round(countWords(p1.transcript) / p1Questions);
    checks.push({
      ok: avg >= 20,
      text:
        avg >= 20
          ? `Part 1: about ${avg} words per answer — a good length.`
          : `Part 1: about ${avg} words per answer. Aim for 2–3 sentences: answer, give a reason, add a detail.`,
    });
  }
  if (p3 && countWords(p3.transcript) > 0) {
    const avg = Math.round(countWords(p3.transcript) / set.part3.questions.length);
    checks.push({
      ok: avg >= 45,
      text:
        avg >= 45
          ? `Part 3: about ${avg} words per answer — you developed your ideas.`
          : `Part 3: about ${avg} words per answer. Band 7 needs longer, developed answers: give your view, explain why, and compare or give an example.`,
    });
  }

  const words = all.reduce((n, p) => n + countWords(p.transcript), 0);
  const seconds = all.reduce((n, p) => n + p.seconds, 0);
  const wpm = seconds ? Math.round((words / seconds) * 60) : 0;
  if (wpm)
    checks.push({
      ok: wpm >= 110 && wpm <= 170,
      text:
        wpm < 110
          ? `Speed: ${wpm} words per minute — a little slow. Long pauses lower Fluency; practise answering familiar topics without stopping.`
          : wpm > 170
            ? `Speed: ${wpm} words per minute — quite fast. Slow down slightly so your pronunciation stays clear.`
            : `Speed: ${wpm} words per minute — a natural pace.`,
    });

  const fillers = all.reduce((n, p) => n + fillerCount(p.transcript), 0);
  const per100 = words ? Math.round((fillers / words) * 1000) / 10 : 0;
  checks.push({
    ok: per100 <= 3,
    text:
      per100 <= 3
        ? `Fillers: ${fillers} (${per100} per 100 words) — well controlled.`
        : `Fillers: ${fillers} (${per100} per 100 words). Replace "um" and "like" with a short silent pause, or a phrase such as "That's an interesting question…".`,
  });

  const good = checks.filter((c) => c.ok).length;
  const summary =
    good === checks.length
      ? "Your fluency numbers all look like band 7 or above. Now focus on range: use a few less common words and some complex sentences."
      : `${good} of ${checks.length} fluency checks look like band 7. Work on the ones marked below first — they're the quickest way to raise your Fluency score.`;
  return { checks, summary };
}

/** A one-line note saved with the attempt, so progress can be compared over time. */
export function fluencyNote(set: SpeakingSet, parts: Record<number, PartRecording | undefined>): string {
  const all = [parts[1], parts[2], parts[3]].filter((p): p is PartRecording => !!p && countWords(p.transcript) > 0);
  if (!all.length) return "self-assessed";
  const words = all.reduce((n, p) => n + countWords(p.transcript), 0);
  const seconds = all.reduce((n, p) => n + p.seconds, 0);
  const fillers = all.reduce((n, p) => n + fillerCount(p.transcript), 0);
  const p2 = parts[2] ? ` · Part 2 ${formatClock(parts[2].seconds)}` : "";
  return `self-assessed · ${Math.round((words / seconds) * 60)} wpm · ${fillers} fillers${p2}`;
}
