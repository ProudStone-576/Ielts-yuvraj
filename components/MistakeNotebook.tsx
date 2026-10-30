"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { QuestionGroups } from "@/components/Questions";
import { YuvrajSays } from "@/components/Yuvraj";
import { evidence, openMistakes, type Mistake } from "@/lib/mistakes";
import { displayAnswer, isCorrect } from "@/lib/scoring";
import { useStore } from "@/lib/storage";

/** Wrong answers from past tests, to try again until they're right. */
export function MistakeNotebook() {
  const { store, update } = useStore();
  // The list is fixed when the page opens, so a question answered correctly stays visible with its feedback.
  const [list] = useState<Mistake[]>(() => openMistakes(store.attempts, store.mastered));
  const [filter, setFilter] = useState<"all" | "listening" | "reading">("all");
  const shown = useMemo(() => list.filter((m) => filter === "all" || m.info.module === filter), [list, filter]);

  return (
    <div className="stack">
      <div className="page-head module-hero">
        <div className="eyebrow">Review</div>
        <h1>Mistake notebook</h1>
        <p>
          Every Listening and Reading question you got wrong lands here. Try each one again. When you get it right, it
          leaves the notebook — that&apos;s how marks you lost once stop being lost twice.
        </p>
      </div>

      {list.length === 0 ? (
        <YuvrajSays title="nothing to review">
          <p style={{ margin: 0 }}>
            {store.attempts.some((a) => a.mistakes)
              ? "You've cleared every mistake. Excellent work — take another test and we'll see what comes up."
              : "Your mistakes from Listening and Reading tests will appear here after your next test."}
          </p>
        </YuvrajSays>
      ) : (
        <>
          <div className="tabs">
            {(["all", "listening", "reading"] as const).map((f) => (
              <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>
                {f === "all" ? `All (${list.length})` : `${f[0].toUpperCase()}${f.slice(1)} (${list.filter((m) => m.info.module === f).length})`}
              </button>
            ))}
          </div>
          {shown.map((m) => (
            <MistakeCard key={m.info.question.id} m={m} done={store.mastered.includes(m.info.question.id)} onRight={(id) => update((s) => ({ ...s, mastered: [...s.mastered, id] }))} />
          ))}
        </>
      )}
    </div>
  );
}

function MistakeCard({ m, done, onRight }: { m: Mistake; done: boolean; onRight: (id: string) => void }) {
  const q = m.info.question;
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const right = checked && isCorrect(q, answer);
  const proof = useMemo(() => evidence(m.info), [m]);
  const group = useMemo(() => ({ ...m.info.group, questions: [q] }), [m, q]);

  return (
    <div className={`card stack mistake ${right || done ? "fixed" : ""}`}>
      <div className="row small muted">
        <span className={`mod-dot ${m.info.module}`} />
        <span>
          {m.info.testTitle} · {m.info.where}
        </span>
        <div className="spacer" />
        <span>{new Date(m.date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span>
      </div>
      <div className="exam mistake-q">
        <QuestionGroups
          groups={[group]}
          numberOf={new Map([[q.id, 1]])}
          answers={{ [q.id]: answer }}
          onChange={(_, v) => setAnswer(v)}
          submitted={checked}
        />
      </div>
      {!checked ? (
        <div className="row">
          <button
            className="btn primary"
            disabled={!answer}
            onClick={() => {
              setChecked(true);
              if (isCorrect(q, answer)) onRight(q.id);
            }}
          >
            Check
          </button>
          <span className="small muted">Last time you answered: {m.given ? m.given.replace(",", " and ") : "nothing"}</span>
        </div>
      ) : (
        <div className={`drill-feedback ${right ? "ok" : "bad"}`}>
          <b>{right ? "Right this time ✓ — removed from your notebook" : `The answer is ${displayAnswer(q)}`}</b>
          {proof.length > 0 ? (
            <div className="small">
              {m.info.module === "listening" ? "In the recording" : "In the text"}: <i>“{proof.join(" … ")}”</i>
            </div>
          ) : (
            <div className="small">Read {m.info.where} again and find the part that matches the question.</div>
          )}
          {!right && (
            <Link className="small" href={`/${m.info.module}/${m.info.testId}`}>
              Open this test →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
