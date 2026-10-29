"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { countQuestions, QuestionGroups, score, type Answers } from "@/components/Questions";
import { bandToClb, formatBand, rawToBand } from "@/lib/scoring";
import { playScript, speechSupported, type Playback } from "@/lib/speech";
import { useStore } from "@/lib/storage";
import type { ListeningTest } from "@/lib/types";

type Mode = "exam" | "practice";

export function ListeningRunner({ test }: { test: ListeningTest }) {
  const { store, addAttempt } = useStore();
  const parts = useMemo(() => {
    let start = 1;
    return test.parts.map((p) => {
      const entry = { part: p, start };
      start += countQuestions(p.groups);
      return entry;
    });
  }, [test]);
  const total = parts.reduce((n, p) => n + countQuestions(p.part.groups), 0);

  const [mode, setMode] = useState<Mode | null>(null);
  const [tab, setTab] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [played, setPlayed] = useState<Set<number>>(new Set());
  const [playing, setPlaying] = useState(false);
  const [line, setLine] = useState(-1);
  const [speed, setSpeed] = useState(1);
  const [supported, setSupported] = useState(true);
  const playback = useRef<Playback | null>(null);

  useEffect(() => setSupported(speechSupported()), []);
  useEffect(() => () => playback.current?.stop(), []);

  const stop = () => {
    playback.current?.stop();
    playback.current = null;
    setPlaying(false);
    setLine(-1);
  };

  const play = (from = 0) => {
    stop();
    const p = parts[tab].part;
    setPlaying(true);
    setPlayed((s) => new Set(s).add(tab));
    const pb = playScript(p.script.slice(from), p.voices, speed, (i) => setLine(i < 0 ? -1 : i + from));
    playback.current = pb;
    pb.done.then(() => {
      if (playback.current === pb) {
        playback.current = null;
        setPlaying(false);
      }
    });
  };

  const submit = () => {
    stop();
    setSubmitted(true);
    const raw = parts.reduce((n, p) => n + score(p.part.groups, answers), 0);
    addAttempt({
      module: "listening",
      testId: test.id,
      title: `${test.title} (${mode === "exam" ? "exam" : "practice"} mode)`,
      band: rawToBand("listening", raw, total),
      raw,
      total,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (mode === null) {
    return (
      <div className="card stack" style={{ maxWidth: 680 }}>
        <h2>{test.title}</h2>
        <p>
          {total} questions in 4 parts. The recordings are read aloud by your device&apos;s voices, so turn the
          sound up and use headphones if you can. Chrome and Edge have the best voices.
        </p>
        {!supported && (
          <div className="notice">
            This browser can&apos;t read text aloud. Try Chrome, Edge or Safari, or use practice mode and read the
            transcripts instead.
          </div>
        )}
        <div className="grid grid-2">
          <button className="card" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => setMode("exam")}>
            <h3>Exam mode</h3>
            <p className="small muted" style={{ margin: 0 }}>
              Each recording plays once, at normal speed, with no transcript — just like the real test.
            </p>
          </button>
          <button className="card" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => setMode("practice")}>
            <h3>Practice mode</h3>
            <p className="small muted" style={{ margin: 0 }}>
              Replay, pause and slow down the audio. Good for training your ear on difficult parts.
            </p>
          </button>
        </div>
      </div>
    );
  }

  const current = parts[tab];
  const canPlay = !playing && (mode === "practice" || submitted || !played.has(tab));
  const answered = Object.values(answers).filter((v) => v.trim() !== "").length;
  const raw = submitted ? parts.reduce((n, p) => n + score(p.part.groups, answers), 0) : 0;
  const band = rawToBand("listening", raw, total);

  return (
    <div>
      <div className="runner-bar row">
        <div className="tabs" style={{ margin: 0 }}>
          {parts.map((p, i) => (
            <button
              key={p.part.title}
              className={i === tab ? "active" : ""}
              disabled={playing && i !== tab}
              onClick={() => setTab(i)}
            >
              {p.part.title}
            </button>
          ))}
        </div>
        <div className="spacer" />
        <span className="small muted">
          {answered}/{total} answered
        </span>
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
            <div className="band-big">{bandToClb("listening", band) || "<4"}</div>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            {band >= store.target.listening ? (
              <p>🎉 At or above your target of {formatBand(store.target.listening)}.</p>
            ) : (
              <p>
                Target is {formatBand(store.target.listening)} (about 35/40). Read the transcript for each part and
                find where you lost the answer.
              </p>
            )}
            <Link href="/listening" className="btn">
              Back to Listening
            </Link>
          </div>
        </div>
      )}

      <div className="split">
        <div className="card passage stack">
          <div>
            <h3>{current.part.title}</h3>
            <p className="muted">{current.part.context}</p>
          </div>
          <div className="row">
            {!playing ? (
              <button className="btn primary" disabled={!canPlay || !supported} onClick={() => play()}>
                ▶ {played.has(tab) ? "Play again" : "Play recording"}
              </button>
            ) : (
              <>
                <span className="small">
                  <span className="rec-dot" /> Playing…
                </span>
                {(mode === "practice" || submitted) && (
                  <button className="btn" onClick={stop}>
                    ■ Stop
                  </button>
                )}
              </>
            )}
            {(mode === "practice" || submitted) && (
              <label className="row small">
                Speed
                <select value={speed} disabled={playing} onChange={(e) => setSpeed(Number(e.target.value))}>
                  <option value={0.8}>0.8×</option>
                  <option value={0.9}>0.9×</option>
                  <option value={1}>1×</option>
                  <option value={1.1}>1.1×</option>
                </select>
              </label>
            )}
          </div>
          {mode === "exam" && !submitted && (
            <p className="small muted">
              {played.has(tab) && !playing
                ? "This recording has been played. Check your answers, then move to the next part."
                : "Read the questions first — you only hear the recording once."}
            </p>
          )}

          {(submitted || (mode === "practice" && !supported)) && (
            <div>
              <h4>Transcript</h4>
              {current.part.script.map((l, i) => (
                <div
                  key={i}
                  className={`script-line ${i === line ? "current" : ""}`}
                  onClick={() => supported && !playing && play(i)}
                  style={{ cursor: supported && !playing ? "pointer" : undefined }}
                  title={supported ? "Play from here" : undefined}
                >
                  <b>{l.speaker}:</b> {l.text}
                </div>
              ))}
              {supported && <p className="small muted">Tip: click any line to replay from there.</p>}
            </div>
          )}
        </div>
        <div className="card">
          <QuestionGroups
            groups={current.part.groups}
            start={current.start}
            answers={answers}
            onChange={(id, v) => setAnswers((a) => ({ ...a, [id]: v }))}
            submitted={submitted}
          />
          {tab < parts.length - 1 && !playing && (
            <button
              className="btn"
              style={{ marginTop: "1rem" }}
              onClick={() => {
                setTab(tab + 1);
                window.scrollTo({ top: 0 });
              }}
            >
              Next: {parts[tab + 1].part.title} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
