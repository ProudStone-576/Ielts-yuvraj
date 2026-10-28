"use client";

import { displayAnswer, isCorrect } from "@/lib/scoring";
import type { Question, QuestionGroup } from "@/lib/types";

export type Answers = Record<string, string>;

interface Props {
  groups: QuestionGroup[];
  /** Number of the first question in this block (questions are numbered across the whole test). */
  start: number;
  answers: Answers;
  onChange: (id: string, value: string) => void;
  submitted: boolean;
}

export function QuestionGroups({ groups, start, answers, onChange, submitted }: Props) {
  let n = start;
  return (
    <div className="stack">
      {groups.map((g, gi) => {
        const first = n;
        n += g.questions.length;
        return (
          <section key={gi} className="qgroup">
            <h4>
              Questions {first}
              {g.questions.length > 1 ? `–${first + g.questions.length - 1}` : ""}
            </h4>
            <p className="instructions">{g.instructions}</p>
            {g.options && (
              <ul className="option-list">
                {g.options.map((o) => (
                  <li key={o.value}>
                    <b>{o.value}</b> {o.label}
                  </li>
                ))}
              </ul>
            )}
            <ol className="qlist" start={first}>
              {g.questions.map((q) => (
                <QuestionRow
                  key={q.id}
                  q={q}
                  options={g.options}
                  value={answers[q.id]}
                  onChange={(v) => onChange(q.id, v)}
                  submitted={submitted}
                />
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

function QuestionRow({
  q,
  options,
  value,
  onChange,
  submitted,
}: {
  q: Question;
  options?: { value: string; label: string }[];
  value: string | undefined;
  onChange: (v: string) => void;
  submitted: boolean;
}) {
  const correct = submitted && isCorrect(q, value);
  const cls = submitted ? (correct ? "q correct" : "q wrong") : "q";

  return (
    <li className={cls}>
      <div className="prompt">{q.prompt}</div>
      {q.type === "text" && (
        <input
          className="text-answer"
          value={value ?? ""}
          disabled={submitted}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      )}
      {q.type === "mcq" && (
        <div className="choices">
          {q.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            return (
              <label key={letter} className="choice">
                <input
                  type="radio"
                  name={q.id}
                  checked={value === letter}
                  disabled={submitted}
                  onChange={() => onChange(letter)}
                />
                <b>{letter}</b> {opt}
              </label>
            );
          })}
        </div>
      )}
      {q.type === "tfng" && (
        <div className="choices row">
          {(["TRUE", "FALSE", "NOT GIVEN"] as const).map((opt) => (
            <label key={opt} className="choice">
              <input
                type="radio"
                name={q.id}
                checked={value === opt}
                disabled={submitted}
                onChange={() => onChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
      {q.type === "select" && (
        <select value={value ?? ""} disabled={submitted} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.value}
            </option>
          ))}
        </select>
      )}
      {submitted && !correct && (
        <div className="feedback">
          Correct answer: <b>{displayAnswer(q)}</b>
        </div>
      )}
    </li>
  );
}

export function countQuestions(groups: QuestionGroup[]): number {
  return groups.reduce((n, g) => n + g.questions.length, 0);
}

export function score(groups: QuestionGroup[], answers: Answers): number {
  return groups.reduce(
    (n, g) => n + g.questions.filter((q) => isCorrect(q, answers[q.id])).length,
    0,
  );
}
