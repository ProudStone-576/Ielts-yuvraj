"use client";

import { useCallback, useMemo, useState } from "react";
import { numberQuestions, sizeOf, type Answers, type Block } from "@/lib/exam";
import { chosen } from "@/lib/scoring";
import type { Question } from "@/lib/types";

/** Shared state for Listening and Reading exams: answers, review flags and navigation. */
export function useExamState(blocks: Block[]) {
  const numbered = useMemo(() => numberQuestions(blocks), [blocks]);
  const [answers, setAnswers] = useState<Answers>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [current, setCurrent] = useState(1);
  const [part, setPart] = useState(0);

  const questions = useMemo(() => {
    const m = new Map<string, Question>();
    for (const b of blocks) for (const g of b.groups) for (const q of g.questions) m.set(q.id, q);
    return m;
  }, [blocks]);

  /** question number -> question id ("Choose TWO letters" questions own two numbers). */
  const idOf = useMemo(() => {
    const m = new Map<number, string>();
    numbered.numberOf.forEach((n, id) => {
      for (let i = 0; i < sizeOf(questions.get(id)!); i++) m.set(n + i, id);
    });
    return m;
  }, [numbered, questions]);

  const answered = useMemo(() => {
    const s = new Set<number>();
    for (const [id, v] of Object.entries(answers)) {
      if (!v.trim()) continue;
      const first = numbered.numberOf.get(id)!;
      // For "Choose TWO letters", each letter chosen fills one of its question numbers.
      const filled = questions.get(id)?.type === "multi" ? chosen(v).length : 1;
      for (let i = 0; i < filled; i++) s.add(first + i);
    }
    return s;
  }, [answers, numbered, questions]);

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
