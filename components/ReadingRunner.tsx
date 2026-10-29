"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { countQuestions, QuestionGroups, score, type Answers } from "@/components/Questions";
import { bandToClb, formatBand, rawToBand } from "@/lib/scoring";
import { useStore } from "@/lib/storage";
import type { ReadingTest } from "@/lib/types";
import { formatClock, useCountdown } from "@/lib/useTimer";

export function ReadingRunner({ test, only }: { test: ReadingTest; only?: number }) {
  const { store, addAttempt } = useStore();
  // Keep the original numbering by remembering where each section starts.
  const sections = useMemo(() => {
    let start = 1;
    return test.sections.map((s, i) => {
      const entry = { section: s, index: i, start };
      start += countQuestions(s.groups);
      return entry;
    });
  }, [test]);
  const active = only === undefined ? sections : sections.filter((s) => s.index === only);
  const total = active.reduce((n, s) => n + countQuestions(s.section.groups), 0);
  // 60 minutes for the full test, 20 for a single section.
  const minutes = only === undefined ? 60 : 20;

  const [tab, setTab] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (submitted) return;
    setSubmitted(true);
    const raw = active.reduce((n, s) => n + score(s.section.groups, answers), 0);
    addAttempt({
      module: "reading",
      testId: test.id + (only !== undefined ? `-s${only + 1}` : ""),
      title: test.title + (only !== undefined ? ` · ${test.sections[only].title}` : ""),
      band: rawToBand("reading", raw, total),
      raw,
      total,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [left] = useCountdown(minutes * 60, started && !submitted, submit);

  const raw = submitted ? active.reduce((n, s) => n + score(s.section.groups, answers), 0) : 0;
  const band = rawToBand("reading", raw, total);
  const answered = Object.values(answers).filter((v) => v.trim() !== "").length;

  if (!started) {
    return (
      <div className="card stack" style={{ maxWidth: 640 }}>
        <h2>{test.title}{only !== undefined ? ` · ${test.sections[only].title}` : ""}</h2>
        <p>
          {total} questions · {minutes} minutes. The timer starts when you press Start and the test is
          submitted automatically when time runs out.
        </p>
        <p className="small muted">
          In the real exam there is no extra time to transfer answers, so write them straight in. Spelling
          counts for written answers.
        </p>
        <div>
          <button className="btn primary" onClick={() => setStarted(true)}>
            Start
          </button>
        </div>
      </div>
    );
  }

  const current = active[tab];

  return (
    <div>
      <div className="runner-bar row">
        <div className="tabs" style={{ margin: 0 }}>
          {active.map((s, i) => (
            <button key={s.index} className={i === tab ? "active" : ""} onClick={() => setTab(i)}>
              {s.section.title}
            </button>
          ))}
        </div>
        <div className="spacer" />
        <span className="small muted">
          {answered}/{total} answered
        </span>
        {!submitted && <span className={`timer ${left < 300 ? "low" : ""}`}>{formatClock(left)}</span>}
        {!submitted && (
          <button
            className="btn primary"
            onClick={() => {
              if (answered < total && !confirm(`You have ${total - answered} unanswered questions. Submit anyway?`)) return;
              submit();
            }}
          >
            Submit
          </button>
        )}
      </div>

      {submitted && (
        <div className="card result-banner" style={{ marginBottom: "1rem" }}>
          <div>
            <div className="muted small">Score</div>
            <div className="band-big">
              {raw}/{total}
            </div>
          </div>
          <div>
            <div className="muted small">Estimated band</div>
            <div className="band-big">{formatBand(band)}</div>
          </div>
          <div>
            <div className="muted small">CLB</div>
            <div className="band-big">{bandToClb("reading", band) || "<4"}</div>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            {band >= store.target.reading ? (
              <p>🎉 At or above your target of {formatBand(store.target.reading)}.</p>
            ) : (
              <p>
                Target is {formatBand(store.target.reading)}. Review each wrong answer below and find the exact
                words in the passage that give the answer.
              </p>
            )}
            <Link href="/reading" className="btn">
              Back to Reading
            </Link>
          </div>
        </div>
      )}

      <div className="split">
        <div className="card passage">
          {current.section.passages.map((p) => (
            <div key={p.title} style={{ marginBottom: "1.5rem" }}>
              <h3>{p.title}</h3>
              <div className="passage-text">{p.body}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <QuestionGroups
            groups={current.section.groups}
            start={current.start}
            answers={answers}
            onChange={(id, v) => setAnswers((a) => ({ ...a, [id]: v }))}
            submitted={submitted}
          />
          {tab < active.length - 1 && (
            <button
              className="btn"
              style={{ marginTop: "1rem" }}
              onClick={() => {
                setTab(tab + 1);
                window.scrollTo({ top: 0 });
              }}
            >
              Next: {active[tab + 1].section.title} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
