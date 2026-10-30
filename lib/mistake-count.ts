import type { Attempt } from "./types";

/** How many different questions are waiting in the mistake notebook (without loading any test content). */
export function countOpenMistakes(attempts: Attempt[], mastered: string[]): number {
  const done = new Set(mastered);
  const ids = new Set<string>();
  for (const a of attempts) for (const m of a.mistakes ?? []) if (!done.has(m.id)) ids.add(m.id);
  return ids.size;
}
