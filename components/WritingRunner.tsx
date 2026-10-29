"use client";

import Link from "next/link";
import { useState } from "react";
import { Rubric, rubricBand } from "@/components/Rubric";
import { WRITING_CRITERIA } from "@/content/writing";
import { checksFor } from "@/lib/analyse";
import { bandToClb, countWords, formatBand } from "@/lib/scoring";
import { useStore } from "@/lib/storage";
import type { WritingTask } from "@/lib/types";
import { formatClock, useCountdown } from "@/lib/useTimer";

export function WritingRunner({ task }: { task: WritingTask }) {
  const { store, addAttempt, setDraft } = useStore();
  const draftKey = `writing:${task.id}`;
  const text = store.drafts[draftKey] ?? "";

  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [rubric, setRubric] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);

  const [left] = useCountdown(task.minutes * 60, started && !submitted, () => setTimeUp(true));
  const words = countWords(text);
  const checks = submitted ? checksFor(task.task, task.kind, text, task.minWords) : [];
  const band = rubricBand(rubric, WRITING_CRITERIA.length);

  const save = () => {
    if (band === null || saved) return;
    addAttempt({
      module: "writing",
      testId: task.id,
      title: `Task ${task.task}: ${task.title}`,
      band,
      notes: `${words} words · self-assessed`,
    });
    setSaved(true);
  };

  return (
    <div className="stack">
      <div className="card">
        <div className="row">
          <span className="badge accent">
            Task {task.task} · {task.kind}
          </span>
          <span className="muted small">
            {task.minutes} minutes · at least {task.minWords} words
          </span>
        </div>
        <p style={{ marginTop: "0.75rem", fontWeight: 500 }}>{task.prompt}</p>
        {task.bullets && (
          <ul style={{ margin: "0 0 0.75rem" }}>
            {task.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
        {task.task === 1 ? (
          <p className="small muted" style={{ margin: 0 }}>
            Write at least 150 words. You do NOT need to write any addresses. Begin your letter as follows:{" "}
            <i>{task.kind.startsWith("Formal") ? "Dear Sir or Madam," : "Dear ……,"}</i>
          </p>
        ) : (
          <p className="small muted" style={{ margin: 0 }}>
            Give reasons for your answer and include any relevant examples from your own knowledge or experience.
            Write at least 250 words.
          </p>
        )}
      </div>

      <div className="row">
        {!started && !submitted && (
          <button className="btn primary" onClick={() => setStarted(true)}>
            Start {task.minutes}-minute timer
          </button>
        )}
        {started && !submitted && (
          <span className={`timer ${left < 180 ? "low" : ""}`}>{timeUp ? "Time's up!" : formatClock(left)}</span>
        )}
        <span className={`badge ${words >= task.minWords ? "good" : ""}`}>{words} words</span>
        <span className="small muted">Your draft saves automatically.</span>
        <div className="spacer" />
        {!submitted && (
          <button
            className="btn primary"
            disabled={words < 20}
            onClick={() => {
              setSubmitted(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Finish &amp; review
          </button>
        )}
      </div>

      {timeUp && !submitted && (
        <div className="notice">
          Time is up. In the real exam you would have to stop now — finish your sentence and press Finish &amp;
          review.
        </div>
      )}

      {!submitted ? (
        <textarea
          className="essay"
          value={text}
          onChange={(e) => setDraft(draftKey, e.target.value)}
          placeholder={task.task === 1 ? "Dear …" : "Start your essay here…"}
          spellCheck={false}
        />
      ) : (
        <>
          <div className="grid grid-2">
            <div className="card">
              <h3>Your answer</h3>
              <div className="model-answer">{text}</div>
              <button className="btn" style={{ marginTop: "0.75rem" }} onClick={() => setSubmitted(false)}>
                Keep editing
              </button>
            </div>
            <div className="card">
              <h3>Model answer (band 8–9)</h3>
              <div className="model-answer">{task.modelAnswer}</div>
            </div>
          </div>

          <div className="card">
            <h3>Automatic checks</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }} className="stack">
              {checks.map((c) => (
                <li key={c.text}>
                  {c.ok ? "✅" : "⚠️"} {c.text}
                </li>
              ))}
            </ul>
            <p className="small muted" style={{ marginTop: "0.75rem", marginBottom: 0 }}>
              These checks look at the form of your writing, not its meaning. Use them together with the rubric
              below.
            </p>
          </div>

          <div className="card stack">
            <div>
              <h3>Score yourself</h3>
              <p className="small muted">
                Compare your answer with the model and click the description that best matches your writing for
                each criterion. Be strict — examiners are. Band 7 needs a 7 in most criteria.
              </p>
            </div>
            <Rubric criteria={WRITING_CRITERIA} value={rubric} onChange={(k, b) => setRubric((r) => ({ ...r, [k]: b }))} />
            <div className="row">
              {band !== null ? (
                <>
                  <span>
                    Estimated Task {task.task} band: <b className="band-big" style={{ fontSize: "1.5rem" }}>{formatBand(band)}</b>
                  </span>
                  <span className={`badge ${band >= store.target.writing ? "good" : "warn"}`}>
                    CLB {bandToClb("writing", band) || "<4"} · target {formatBand(store.target.writing)}
                  </span>
                  <div className="spacer" />
                  {saved ? (
                    <Link href="/writing" className="btn">
                      ✓ Saved — back to Writing
                    </Link>
                  ) : (
                    <button className="btn primary" onClick={save}>
                      Save to progress
                    </button>
                  )}
                </>
              ) : (
                <span className="muted small">Pick one box in each row to get your band.</span>
              )}
            </div>
          </div>

          <div className="card">
            <h3>Tips for this task</h3>
            <ul className="small" style={{ margin: 0, paddingLeft: "1.2rem" }}>
              {task.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
