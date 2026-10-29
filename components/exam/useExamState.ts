"use client";

import { useCallback, useMemo, useState } from "react";
import { numberQuestions, type Answers, type Block } from "@/lib/exam";

/** Shared state for Listening and Reading exams: answers, review flags and navigation. */
export function useExamState(blocks: Block[]) {
  const numbered = useMemo(() => numberQuestions(blocks), [blocks]);
  const [answers, setAnswers] = useState<Answers>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [current, setCurrent] = useState(1);
  const [part, setPart] = useState(0);

  const idOf = useMemo(() => {
    const m = new Map<number, string>();
    numbered.numberOf.forEach((n, id) => m.set(n, id));
    return m;
  }, [numbered]);

  const answered = useMemo(() => {
    const s = new Set<number>();
    for (const [id, v] of Object.entries(answers)) if (v.trim()) s.add(numbered.numberOf.get(id)!);
    return s;
  }, [answers, numbered]);

  const setAnswer = useCallback((id: string, v: string) => setAnswers((a) => ({ ...a, [id]: v })), []);

  const toggleFlag = useCallback(
    () =>
      setFlagged((f) => {
        const next = new Set(f);
        if (next.has(current)) next.delete(current);
        else next.add(current);
        return next;
      }),
    [current],
  );

  /** Jumps to a question: opens its part and scrolls it into view. */
  const go = useCallback(
    (n: number) => {
      const p = numbered.parts.findIndex((x) => x.numbers.includes(n));
      if (p >= 0) setPart(p);
      setCurrent(n);
      requestAnimationFrame(() => {
        const el = document.getElementById(`q-${n}`);
        el?.scrollIntoView({ block: "center", behavior: "smooth" });
        el?.querySelector<HTMLElement>("input:not([type=radio]), select")?.focus({ preventScroll: true });
      });
    },
    [numbered],
  );

  const openPart = useCallback(
    (i: number) => {
      setPart(i);
      setCurrent(numbered.parts[i].numbers[0]);
    },
    [numbered],
  );

  return { numbered, answers, setAnswer, flagged, toggleFlag, current, setCurrent, part, openPart, go, answered, idOf };
}
