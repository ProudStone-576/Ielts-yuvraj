"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Rubric, rubricBand } from "@/components/Rubric";
import { FILLERS, SPEAKING_CRITERIA } from "@/content/speaking";
import { startSession, transcriptionSupported, type Session } from "@/lib/recorder";
import { bandToClb, countWords, formatBand } from "@/lib/scoring";
import { speak } from "@/lib/speech";
import { useStore } from "@/lib/storage";
import type { SpeakingSet } from "@/lib/types";
import { formatClock, useCountdown } from "@/lib/useTimer";

type Step =
  | { part: 1 | 3; kind: "question"; topic: string; text: string }
  | { part: 2; kind: "prep" }
  | { part: 2; kind: "talk" }
  | { part: 2; kind: "followup"; text: string };

interface PartResult {
  url?: string;
  transcript: string;
  seconds: number;
}

function buildSteps(set: SpeakingSet): Step[] {
  return [
    ...set.part1.flatMap((t) =>
      t.questions.map((q): Step => ({ part: 1, kind: "question", topic: t.topic, text: q })),
    ),
    { part: 2, kind: "prep" },
    { part: 2, kind: "talk" },
    { part: 2, kind: "followup", text: set.part2.followUp },
    ...set.part3.questions.map((q): Step => ({ part: 3, kind: "question", topic: set.part3.topic, text: q })),
  ];
}

/** Which recording a step belongs to (Part 2 preparation is not recorded). */
function recordingKey(step: Step | undefined): number | null {
  if (!step || (step.part === 2 && step.kind === "prep")) return null;
  return step.part;
}

export function SpeakingRunner({ set }: { set: SpeakingSet }) {
  const { store, addAttempt } = useStore();
  const steps = useMemo(() => buildSteps(set), [set]);

  const [phase, setPhase] = useState<"intro" | "test" | "review">("intro");
  const [index, setIndex] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micError, setMicError] = useState(false);
  const [live, setLive] = useState("");
  const [results, setResults] = useState<Record<number, PartResult>>({});
  const [notes, setNotes] = useState("");
  const [rubric, setRubric] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);
  const [canTranscribe, setCanTranscribe] = useState(false);

  const session = useRef<{ key: number; s: Session; startedAt: number } | null>(null);
  const step = phase === "test" ? steps[index] : undefined;

  useEffect(() => setCanTranscribe(transcriptionSupported()), []);

  // Start/stop a recording whenever we move into a different part.
  const key = recordingKey(step);
  useEffect(() => {
    if (phase !== "test") return;
    if (session.current?.key === key) return;
    const prev = session.current;
    session.current = null;
    if (prev) {
      const seconds = Math.round((Date.now() - prev.startedAt) / 1000);
      prev.s.stop().then((r) => setResults((all) => ({ ...all, [prev.key]: { ...r, seconds } })));
    }
    if (key !== null) {
      setLive("");
      session.current = { key, s: startSession(stream, setLive), startedAt: Date.now() };
    }
  }, [key, phase, stream]);

  // The examiner reads each question aloud.
  useEffect(() => {
    if (!step) return;
    if (step.kind === "question" || step.kind === "followup") speak(step.text);
    if (step.kind === "prep") speak("Here is your topic. You have one minute to prepare. You can make notes.");
    if (step.kind === "talk") speak("Please begin speaking now. You have up to two minutes.");
  }, [step]);

  // Release the microphone when leaving the page.
  const streamRef = useRef<MediaStream | null>(null);
  streamRef.current = stream;
  useEffect(
    () => () => {
      session.current?.s.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    },
    [],
  );

  const next = () => {
    if (index < steps.length - 1) setIndex(index + 1);
    else finish();
  };

  const finish = () => {
    const prev = session.current;
    session.current = null;
    if (prev) {
      const seconds = Math.round((Date.now() - prev.startedAt) / 1000);
      prev.s.stop().then((r) => setResults((all) => ({ ...all, [prev.key]: { ...r, seconds } })));
    }
    speechSynthesis.cancel();
    setPhase("review");
    window.scrollTo({ top: 0 });
  };

  const [prepLeft] = useCountdown(60, step?.kind === "prep", () => setIndex((i) => i + 1));
  const [talkLeft] = useCountdown(120, step?.kind === "talk", () => {
    speak("Thank you.");
    setIndex((i) => i + 1);
  });

  const begin = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(s);
    } catch {
      setMicError(true);
    }
    setPhase("test");
  };

  if (phase === "intro") {
    return (
      <div className="card stack" style={{ maxWidth: 700 }}>
        <h2>{set.title}</h2>
        <p>
          This is a full mock interview, about 11–14 minutes. The examiner&apos;s questions are read aloud and your
          answers are recorded so you can listen back and assess yourself afterwards.
        </p>
        <ul className="small" style={{ margin: 0, paddingLeft: "1.2rem" }}>
          <li>
            <b>Part 1</b> (4–5 min): short questions about familiar topics. Answer in 2–3 sentences.
          </li>
          <li>
            <b>Part 2</b> (3–4 min): 1 minute to prepare, then speak for up to 2 minutes on the cue card.
          </li>
          <li>
            <b>Part 3</b> (4–5 min): a deeper discussion. Give opinions, reasons and examples.
          </li>
        </ul>
        {!canTranscribe && (
          <div className="notice">
            Live transcripts work in Chrome, Edge and Safari. Recording still works in this browser.
          </div>
        )}
        <p className="small muted">
          Your browser will ask for microphone access. Recordings stay on this device and are never uploaded.
        </p>
        <div>
          <button className="btn primary" onClick={begin}>
            Start interview
          </button>
        </div>
      </div>
    );
  }

  if (phase === "test" && step) {
    return (
      <div className="stack" style={{ maxWidth: 760 }}>
        <div className="row">
          <span className="badge accent">Part {step.part}</span>
          <span className="small muted">
            Step {index + 1} of {steps.length}
          </span>
          <div className="spacer" />
          {key !== null && !micError && (
            <span className="small">
              <span className="rec-dot" /> Recording
            </span>
          )}
          <button className="btn danger" onClick={finish}>
            End interview
          </button>
        </div>
        <div className="progress">
          <div style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
        </div>
        {micError && (
          <div className="notice">
            Microphone not available, so nothing is being recorded. You can still practise answering aloud.
          </div>
        )}

        {step.kind === "question" || step.kind === "followup" ? (
          <div className="card stack">
            {"topic" in step && <div className="muted small">Topic: {step.topic}</div>}
            <h2>{step.text}</h2>
            <div className="row">
              <button className="btn" onClick={() => speak(step.text)}>
                🔊 Repeat question
              </button>
              <div className="spacer" />
              <button className="btn primary" onClick={next}>
                {index === steps.length - 1 ? "Finish" : "Next question →"}
              </button>
            </div>
            <p className="small muted" style={{ margin: 0 }}>
              {step.part === 1
                ? "Aim for 15–30 seconds: answer, give a reason, add a detail."
                : step.part === 3
                  ? "Aim for 40–60 seconds: opinion → reason → example → (other side)."
                  : "A short answer is fine here."}
            </p>
          </div>
        ) : (
          <div className="card stack">
            <div className="cue-card">
              <b>{set.part2.cue}</b>
              <div className="small">You should say:</div>
              <ul>
                {set.part2.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            {step.kind === "prep" ? (
              <>
                <div className="row">
                  <span>Preparation time</span>
                  <span className={`timer ${prepLeft < 10 ? "low" : ""}`}>{formatClock(prepLeft)}</span>
                  <div className="spacer" />
                  <button className="btn" onClick={next}>
                    I&apos;m ready →
                  </button>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Make quick notes — key words only, one line per bullet point."
                  rows={5}
                />
              </>
            ) : (
              <>
                <div className="row">
                  <span>Speak now</span>
                  <span className={`timer ${talkLeft < 20 ? "low" : ""}`}>{formatClock(talkLeft)}</span>
                  <div className="spacer" />
                  <button className="btn" onClick={next}>
                    Finish talk →
                  </button>
                </div>
                {notes && <div className="model-answer small">{notes}</div>}
                <p className="small muted" style={{ margin: 0 }}>
                  Try to keep going for the full 2 minutes — stopping early is one of the most common reasons for a
                  lower fluency score.
                </p>
              </>
            )}
          </div>
        )}

        {live && (
          <div className="card small">
            <div className="muted">Live transcript</div>
            {live}
          </div>
        )}
      </div>
    );
  }

  /* ---------- Review ---------- */
  const band = rubricBand(rubric, SPEAKING_CRITERIA.length);

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Review your interview</h1>
        <p>
          Listen to each part, read the transcript, and then score yourself honestly. Speaking answers longer and
          using fewer fillers are the quickest ways to raise your fluency score.
        </p>
      </div>

      {[1, 2, 3].map((p) => {
        const r = results[p];
        const words = r ? countWords(r.transcript) : 0;
        const wpm = r && r.seconds > 0 ? Math.round((words / r.seconds) * 60) : 0;
        const lower = ` ${r?.transcript.toLowerCase() ?? ""} `;
        const fillers = FILLERS.map((f) => ({
          f,
          n: lower.split(new RegExp(`\\b${f}\\b`)).length - 1,
        })).filter((x) => x.n > 0);
        return (
          <div key={p} className="card stack">
            <div className="row">
              <h3 style={{ margin: 0 }}>Part {p}</h3>
              {r && <span className="badge">{formatClock(r.seconds)}</span>}
              {r && words > 0 && <span className="badge">{words} words</span>}
              {wpm > 0 && (
                <span className={`badge ${wpm >= 110 && wpm <= 170 ? "good" : "warn"}`}>{wpm} words/min</span>
              )}
            </div>
            {!r ? (
              <p className="muted small">Not recorded.</p>
            ) : (
              <>
                {r.url ? <audio controls src={r.url} style={{ width: "100%" }} /> : <p className="muted small">No audio recorded.</p>}
                {r.transcript ? (
                  <div className="model-answer small">{r.transcript}</div>
                ) : (
                  canTranscribe && <p className="muted small">No speech was transcribed for this part.</p>
                )}
                {fillers.length > 0 && (
                  <p className="small">
                    Fillers: {fillers.map((x) => `"${x.f}" × ${x.n}`).join(", ")}
                  </p>
                )}
              </>
            )}
          </div>
        );
      })}

      <p className="small muted">
        A natural pace for band 7+ is roughly 120–160 words per minute. Transcripts are approximate and can miss
        words.
      </p>

      <div className="card stack">
        <div>
          <h3>Score yourself</h3>
          <p className="small muted">Click the description that best matches your speaking for each criterion.</p>
        </div>
        <Rubric criteria={SPEAKING_CRITERIA} value={rubric} onChange={(k, b) => setRubric((r) => ({ ...r, [k]: b }))} />
        <div className="row">
          {band !== null ? (
            <>
              <span>
                Estimated band: <b className="band-big" style={{ fontSize: "1.5rem" }}>{formatBand(band)}</b>
              </span>
              <span className={`badge ${band >= store.target.speaking ? "good" : "warn"}`}>
                CLB {bandToClb("speaking", band) || "<4"} · target {formatBand(store.target.speaking)}
              </span>
              <div className="spacer" />
              {saved ? (
                <Link href="/speaking" className="btn">
                  ✓ Saved — back to Speaking
                </Link>
              ) : (
                <button
                  className="btn primary"
                  onClick={() => {
                    addAttempt({ module: "speaking", testId: set.id, title: set.title, band, notes: "self-assessed" });
                    setSaved(true);
                  }}
                >
                  Save to progress
                </button>
              )}
            </>
          ) : (
            <span className="muted small">Pick one box in each row to get your band.</span>
          )}
        </div>
      </div>
      <p className="small muted">
        Recordings disappear when you leave this page. To keep one, use the ⋮ menu on the audio player and choose
        Download.
      </p>
    </div>
  );
}
