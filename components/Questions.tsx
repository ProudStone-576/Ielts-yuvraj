"use client";

import { displayAnswer, isCorrect } from "@/lib/scoring";
import type { Answers } from "@/lib/exam";
import type { Question, QuestionGroup } from "@/lib/types";

interface Props {
  groups: QuestionGroup[];
  numberOf: Map<string, number>;
  answers: Answers;
  onChange: (id: string, value: string) => void;
  submitted: boolean;
  current?: number;
  flagged?: Set<number>;
  onFocusQuestion?: (n: number) => void;
}

export function QuestionGroups({ groups, numberOf, answers, onChange, submitted, current, flagged, onFocusQuestion }: Props) {
  return (
    <div className="stack">
      {groups.map((g, gi) => {
        const first = numberOf.get(g.questions[0].id) ?? 1;
        const last = first + g.questions.length - 1;
        return (
          <section key={gi} className="qgroup">
            <h4>
              Questions {first}
              {last > first ? `–${last}` : ""}
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
            <div className="qlist">
              {g.questions.map((q) => {
                const n = numberOf.get(q.id) ?? 0;
                return (
                  <QuestionRow
                    key={q.id}
                    n={n}
                    q={q}
                    options={g.options}
                    value={answers[q.id]}
                    onChange={(v) => onChange(q.id, v)}
                    submitted={submitted}
                    current={current === n}
                    flagged={flagged?.has(n) ?? false}
                    onFocus={() => onFocusQuestion?.(n)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

const CHOICES = {
  tfng: ["TRUE", "FALSE", "NOT GIVEN"],
  ynng: ["YES", "NO", "NOT GIVEN"],
} as const;

function QuestionRow({
  n,
  q,
  options,
  value,
  onChange,
  submitted,
  current,
  flagged,
  onFocus,
}: {
  n: number;
  q: Question;
  options?: { value: string; label: string }[];
  value: string | undefined;
  onChange: (v: string) => void;
  submitted: boolean;
  current: boolean;
  flagged: boolean;
  onFocus: () => void;
}) {
  const correct = submitted && isCorrect(q, value);
  const cls = ["q", current ? "current" : "", submitted ? (correct ? "correct" : "wrong") : ""].join(" ");

  return (
    <div id={`q-${n}`} className={cls} onFocusCapture={onFocus} onClick={onFocus}>
      <div className="qnum-label">
        <b>{n}</b>
        {flagged && !submitted && <span className="flag-dot" title="Marked for review" />}
      </div>
      <div className="qbody">
        <div className="prompt">{q.prompt}</div>
        {q.type === "text" && (
          <input
            className="text-answer"
            value={value ?? ""}
            disabled={submitted}
            onChange={(e) => onChange(e.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label={`Answer ${n}`}
          />
        )}
        {q.type === "mcq" && (
          <div className="choices">
            {q.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              return (
                <label key={letter} className="choice">
                  <input type="radio" name={q.id} checked={value === letter} disabled={submitted} onChange={() => onChange(letter)} />
                  <b>{letter}</b> {opt}
                </label>
              );
            })}
          </div>
        )}
        {(q.type === "tfng" || q.type === "ynng") && (
          <div className="choices row">
            {CHOICES[q.type].map((opt) => (
              <label key={opt} className="choice">
                <input type="radio" name={q.id} checked={value === opt} disabled={submitted} onChange={() => onChange(opt)} />
                {opt}
              </label>
            ))}
          </div>
        )}
        {q.type === "select" && (
          <select value={value ?? ""} disabled={submitted} onChange={(e) => onChange(e.target.value)} aria-label={`Answer ${n}`}>
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
            {value ? (
              <>
                Your answer: <s>{value}</s> ·{" "}
              </>
            ) : (
              "Not answered · "
            )}
            Correct: <b>{displayAnswer(q)}</b>
          </div>
        )}
      </div>
    </div>
  );
}
