"use client";

import { useState } from "react";
import { ExamFrame } from "@/components/exam/ExamFrame";
import { Results } from "@/components/exam/Results";
import { Rubric, rubricBand } from "@/components/Rubric";
import { WRITING_CRITERIA } from "@/content/writing";
import { checksFor } from "@/lib/analyse";
import { countWords, formatBand, writingBand } from "@/lib/scoring";
import { useStore } from "@/lib/storage";
import type { WritingTask, WritingTest } from "@/lib/types";
import { useCountdown } from "@/lib/useTimer";

type Phase = "intro" | "test" | "assess" | "results";

export function WritingRunner({ test, tasks }: { test: WritingTest; tasks: [WritingTask, WritingTask] }) {
  const { store, addAttempt, update } = useStore();
  const keys = tasks.map((t) => `writing:${test.id}:${t.task}`);
  const texts = keys.map((k) => store.drafts[k] ?? "");
  const [phase, setPhase] = useState<Phase>("intro");
  const [tab, setTab] = useState(0);
  const [rubrics, setRubrics] = useState<[Record<string, number>, Record<string, number>]>([{}, {}]);
  const [finalBand, setFinalBand] = useState<number | null>(null);

  const setText = (i: number, v: string) => update((s) => ({ ...s, drafts: { ...s.drafts, [keys[i]]: v } }));
  const [left] = useCountdown(60 * 60, phase === "test", () => setPhase("assess"));

  const bands = rubrics.map((r) => rubricBand(r, WRITING_CRITERIA.length));

  const save = () => {
    if (bands[0] === null || bands[1] === null) return;
    const band = writingBand(bands[0], bands[1]);
    addAttempt({
      module: "writing",
      testId: test.id,
      title: test.title,
      band,
      notes: `Task 1: ${formatBand(bands[0])} (${countWords(texts[0])} words) · Task 2: ${formatBand(bands[1])} (${countWords(texts[1])} words)`,
    });
    // Clear the drafts so the next attempt at this test starts fresh.
    update((s) => {
      const drafts = { ...s.drafts };
      keys.forEach((k) => delete drafts[k]);
      drafts[`writing-last:${test.id}`] = JSON.stringify({ t1: texts[0], t2: texts[1] });
      return { ...s, drafts };
    });
    setFinalBand(band);
    setPhase("results");
  };

  if (phase === "intro") {
    return (
      <ExamFrame module="General Training Writing" candidate={store.name}>
        <div className="exam-intro card stack">
          <h2>{test.title}</h2>
          <p>
            <b>Time: 1 hour</b>
          </p>
          <h4>Instructions to candidates</h4>
          <ul>
            <li>Answer both parts.</li>
            <li>You can change your answers at any time during the test.</li>
          </ul>
          <h4>Information for candidates</h4>
          <ul>
            <li>There are two parts in this test. Part 2 contributes twice as much as Part 1 to the writing score.</li>
            <li>Spend about 20 minutes on Part 1 and 40 minutes on Part 2.</li>
            <li>The word count is shown under each answer. Under-length answers lose marks.</li>
            <li>Your work saves automatically. The test ends when the hour is up.</li>
          </ul>
          <div>
            <button className="btn primary" onClick={() => setPhase("test")}>
              Start test
            </button>
          </div>
        </div>
      </ExamFrame>
    );
  }

  if (phase === "results" && finalBand !== null) {
    return (
      <ExamFrame module="Writing — Results" candidate={store.name}>
        <div className="exam-scroll">
          <Results module="writing" band={finalBand} target={store.target.writing}>
            <div className="card small">
              Task 1: band {formatBand(bands[0]!)} · Task 2: band {formatBand(bands[1]!)} — Task 2 counts double, so the
              writing band is (Task 1 + 2 × Task 2) ÷ 3, rounded to the nearest half band.
            </div>
          </Results>
        </div>
      </ExamFrame>
    );
  }

  if (phase === "assess") {
    return (
      <ExamFrame module="Writing — Check your work" candidate={store.name}>
        <div className="exam-scroll">
          <div className="results stack">
            <div className="card coach-note">
              <div className="coach-avatar">IC</div>
              <div>
                <b>Time to mark your work like an examiner.</b>
                <p style={{ margin: "0.4rem 0 0" }}>
                  For each task, compare your answer with the model, read the automatic checks, then click the
                  description that matches your writing in each row. Be strict — that&apos;s how you improve.
                </p>
              </div>
            </div>
            {tasks.map((t, i) => {
              const checks = checksFor(t.task, t.kind, texts[i], t.minWords);
              return (
                <div key={t.id} className="card stack">
                  <div className="row">
                    <h2 style={{ margin: 0 }}>Part {t.task}</h2>
                    <span className="badge">{t.kind}</span>
                    <span className={`badge ${countWords(texts[i]) >= t.minWords ? "good" : "bad"}`}>{countWords(texts[i])} words</span>
                  </div>
                  <div className="grid grid-2">
                    <div>
                      <h4>Your answer</h4>
                      <div className="model-answer">{texts[i] || <i className="muted">No answer written.</i>}</div>
                    </div>
                    <div>
                      <h4>Model answer (band 8–9)</h4>
                      <div className="model-answer">{t.modelAnswer}</div>
                    </div>
                  </div>
                  <div>
                    <h4>Automatic checks</h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }} className="stack small">
                      {checks.map((c) => (
                        <li key={c.text}>
                          {c.ok ? "✅" : "⚠️"} {c.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Rubric
                    criteria={WRITING_CRITERIA}
                    value={rubrics[i]}
                    onChange={(k, b) =>
                      setRubrics((r) => {
                        const next = [...r] as typeof r;
                        next[i] = { ...next[i], [k]: b };
                        return next;
                      })
                    }
                  />
                  <div className="small">
                    {bands[i] !== null ? (
                      <>
                        Part {t.task} band: <b>{formatBand(bands[i]!)}</b>
                      </>
                    ) : (
                      <span className="muted">Pick one box in each row.</span>
                    )}
                  </div>
                  <details className="small">
                    <summary>Tips for this type of task</summary>
                    <ul>
                      {t.tips.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              );
            })}
            <div className="row">
              <button className="btn primary" disabled={bands[0] === null || bands[1] === null} onClick={save}>
                Save and see my writing band
              </button>
              {(bands[0] === null || bands[1] === null) && <span className="small muted">Mark both parts first.</span>}
            </div>
          </div>
        </div>
      </ExamFrame>
    );
  }

  const t = tasks[tab];
  return (
    <ExamFrame
      module="General Training Writing"
      candidate={store.name}
      timeLeft={left}
      right={
        <button className="btn exam-btn" onClick={() => confirm("Finish the writing test now?") && setPhase("assess")}>
          Finish test
        </button>
      }
      footer={
        <div className="nav-bar">
          <div className="nav-parts">
            {tasks.map((task, i) => (
              <div key={task.id} className={`nav-part ${i === tab ? "open" : ""}`}>
                <button className="nav-part-label" onClick={() => setTab(i)}>
                  Part {task.task}
                  <span className="nav-count">{countWords(texts[i])} words</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="part-banner">
        <b>Part {t.task}</b>
        <span>
          You should spend about {t.minutes} minutes on this task. Write at least {t.minWords} words.
        </span>
      </div>
      <div className="exam-split">
        <div className="pane passage-pane">
          <p style={{ fontWeight: 500 }}>{t.prompt}</p>
          {t.bullets && (
            <ul>
              {t.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          {t.task === 1 ? (
            <p>
              Write at least 150 words.
              <br />
              You do NOT need to write any addresses.
              <br />
              Begin your letter as follows:
              <br />
              <b>{t.kind.startsWith("Formal") ? "Dear Sir or Madam," : "Dear ……………,"}</b>
            </p>
          ) : (
            <p>
              Give reasons for your answer and include any relevant examples from your own knowledge or experience.
              <br />
              Write at least 250 words.
            </p>
          )}
        </div>
        <div className="pane writing-pane">
          <textarea
            className="essay"
            value={texts[tab]}
            onChange={(e) => setText(tab, e.target.value)}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="sentences"
            aria-label={`Part ${t.task} answer`}
          />
          <div className="word-count">Word count: {countWords(texts[tab])}</div>
        </div>
      </div>
    </ExamFrame>
  );
}
