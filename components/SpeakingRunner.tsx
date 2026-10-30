"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExamFrame } from "@/components/exam/ExamFrame";
import { Results } from "@/components/exam/Results";
import { Rubric, rubricBand } from "@/components/Rubric";
import { FILLERS, SPEAKING_CRITERIA } from "@/content/speaking";
import { startSession, transcriptionSupported, type Session } from "@/lib/recorder";
import { countWords, formatBand } from "@/lib/scoring";
import { SPEAKING_AUDIO } from "@/content/speaking-audio";
import { playClip, unlockAudio } from "@/lib/audio";
import { speak, type Playback } from "@/lib/speech";
import { useStore } from "@/lib/storage";
import type { SpeakingSet } from "@/lib/types";
import { fluencyNote, fluencyReport } from "@/lib/speaking-feedback";
import { buildSteps, examinerFor, EXAMINER_LINES, type Step } from "@/lib/speaking-script";
import { formatClock, useCountdown } from "@/lib/useTimer";
import { YuvrajSays } from "@/components/Yuvraj";

/*
 * A mock interview that follows the real examiner script: introduction and ID
 * check, Part 1 (familiar topics), Part 2 (cue card with 1 minute to prepare and
 * up to 2 minutes to talk) and Part 3 (discussion). Like a real examiner, the
 * app moves on if an answer runs too long.
 */

interface PartResult {
  url?: string;
  transcript: string;
  seconds: number;
}

/** Recordings are grouped by part; the introduction counts as Part 1 and Part 2 preparation isn't recorded. */
function recordingKey(step: Step | undefined): number | null {
  if (!step || step.kind === "prep") return null;
  return step.part === 0 ? 1 : step.part;
}

export function SpeakingRunner({ set }: { set: SpeakingSet }) {
  const { store, addAttempt } = useStore();
  const steps = useMemo(() => buildSteps(set), [set]);

  const [phase, setPhase] = useState<"intro" | "test" | "assess" | "results">("intro");
  const [index, setIndex] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micError, setMicError] = useState(false);
  const [results, setResults] = useState<Record<number, PartResult>>({});
  const [notes, setNotes] = useState("");
  const [rubric, setRubric] = useState<Record<string, number>>({});
  const [canTranscribe, setCanTranscribe] = useState(false);
  const [examinerSpeaking, setExaminerSpeaking] = useState(false);
  const [savedBand, setSavedBand] = useState<number | null>(null);

  const session = useRef<{ key: number; s: Session; startedAt: number } | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  streamRef.current = stream;
  const step = phase === "test" ? steps[index] : undefined;

  useEffect(() => setCanTranscribe(transcriptionSupported()), []);

  const closeSession = () => {
    const prev = session.current;
    session.current = null;
    if (prev) {
      const seconds = Math.round((Date.now() - prev.startedAt) / 1000);
      prev.s.stop().then((r) =>
        setResults((all) => {
          // The introduction and Part 1 share one recording slot; keep the longer one.
          const old = all[prev.key];
          return { ...all, [prev.key]: old ? { url: r.url ?? old.url, transcript: `${old.transcript} ${r.transcript}`.trim(), seconds: old.seconds + seconds } : { ...r, seconds } };
        }),
      );
    }
  };

  // Start/stop a recording whenever we move into a different part.
  const key = recordingKey(step);
  useEffect(() => {
    if (phase !== "test" || session.current?.key === key) return;
    closeSession();
    if (key !== null) session.current = { key, s: startSession(stream, () => {}), startedAt: Date.now() };
  }, [key, phase, stream]);

  /** The examiner says `text`: a recording of a natural voice when there is one, otherwise the browser voice. */
  const voice = useRef<Playback | null>(null);
  const say = async (text: string) => {
    voice.current?.stop();
    const file = SPEAKING_AUDIO[set.id]?.[text];
    if (file) {
      const pb = playClip(`/audio/speaking/${set.id}/${file}`);
      voice.current = pb;
      const ok = await pb.ok;
      if (voice.current === pb) voice.current = null;
      if (ok) return;
    }
    await speak(text);
  };

  // The examiner speaks at each step.
  useEffect(() => {
    if (!step) return;
    const text = step.kind === "ask" ? step.say : step.kind === "prep" ? EXAMINER_LINES.prep : EXAMINER_LINES.talk;
    setExaminerSpeaking(true);
    say(text).then(() => setExaminerSpeaking(false));
  }, [step]);

  // Release the microphone when leaving the page.
  useEffect(
    () => () => {
      session.current?.s.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      speechSynthesis.cancel();
      voice.current?.stop();
    },
    [],
  );

  const finish = async () => {
    closeSession();
    await say(EXAMINER_LINES.end);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setPhase("assess");
  };

  const next = () => {
    if (index < steps.length - 1) setIndex(index + 1);
    else finish();
  };

  // Answer time limits (the examiner interrupts politely, as in the real test).
  const answerLimit = step?.kind === "ask" ? step.limit : step?.kind === "prep" ? 60 : step?.kind === "talk" ? 120 : 0;
  const [left] = useCountdown(
    answerLimit,
    phase === "test" && !examinerSpeaking && answerLimit > 0,
    () => {
      if (step?.kind === "talk") say(EXAMINER_LINES.timeUp).then(next);
      else next();
    },
    index,
  );

  const begin = async () => {
    unlockAudio();
    try {
      setStream(await navigator.mediaDevices.getUserMedia({ audio: true }));
    } catch {
      setMicError(true);
    }
    setPhase("test");
  };

  if (phase === "intro") {
    return (
      <ExamFrame module="Speaking" candidate={store.name}>
        <div className="exam-intro card stack">
          <h2>{set.title}</h2>
          <p>
            <b>Time: 11–14 minutes</b>
          </p>
          <ul>
            <li>
              <b>Introduction:</b> the examiner checks your name and where you&apos;re from.
            </li>
            <li>
              <b>Part 1</b> (4–5 minutes): questions about familiar topics. Answer in 2–3 sentences.
            </li>
            <li>
              <b>Part 2</b> (3–4 minutes): 1 minute to prepare, then speak for up to 2 minutes on the topic card.
            </li>
            <li>
              <b>Part 3</b> (4–5 minutes): a discussion of more abstract questions.
            </li>
          </ul>
          <p className="small">
            Speak as you would to a real examiner. If an answer goes on too long, the examiner will move on — that&apos;s
            normal. Press <b>Finished answering</b> when you&apos;re done with a question.
          </p>
          {!canTranscribe && <div className="notice">For the transcript and speaking-speed analysis, use Chrome, Edge or Safari.</div>}
          <p className="small muted">Your browser will ask to use the microphone. Recordings stay on this device.</p>
          <div>
            <button className="btn primary" onClick={begin}>
              Start speaking test
            </button>
          </div>
        </div>
      </ExamFrame>
    );
  }

  if (phase === "test" && step) {
    const partLabel = step.part === 0 ? "Introduction" : `Part ${step.part}`;
    return (
      <ExamFrame
        module="Speaking"
        candidate={store.name}
        right={
          <button className="btn exam-btn" onClick={() => confirm("End the speaking test now?") && finish()}>
            End test
          </button>
        }
      >
        <div className="exam-scroll">
          <div className="speaking-stage stack">
            <div className="row">
              <span className="badge accent">{partLabel}</span>
              {key !== null && !micError && (
                <span className="small">
                  <span className="rec-dot" /> Recording
                </span>
              )}
              <div className="spacer" />
              {!examinerSpeaking && answerLimit > 0 && (
                <span className={`timer ${left <= 10 ? "low" : ""}`}>{formatClock(left)}</span>
              )}
            </div>
            {micError && <div className="notice">No microphone — nothing is being recorded, but you can still practise aloud.</div>}

            <div className="examiner">
              <div className={`examiner-avatar ${examinerSpeaking ? "talking" : ""}`}>S</div>
              <div className="bubble">
                {examinerSpeaking ? <span className="muted">Examiner is speaking…</span> : step.kind === "ask" ? step.question : step.kind === "prep" ? "Here is your topic. You have one minute to prepare." : "Please start speaking now."}
              </div>
            </div>

            {(step.kind === "prep" || step.kind === "talk") && (
              <div className="cue-card">
                <b>{set.part2.cue}</b>
                <div className="small">You should say:</div>
                <ul>
                  {set.part2.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
            {step.kind === "prep" && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes — key words only, one line per bullet point."
                rows={5}
              />
            )}
            {step.kind === "talk" && notes && <div className="model-answer small">{notes}</div>}

            <div className="row">
              {step.kind === "ask" && (step.part === 1 || step.part === 3) && (
                <button className="btn" disabled={examinerSpeaking} onClick={() => {
                  setExaminerSpeaking(true);
                  say(step.question).then(() => setExaminerSpeaking(false));
                }}>
                  &quot;Could you repeat the question?&quot;
                </button>
              )}
              <div className="spacer" />
              <button className="btn primary" disabled={examinerSpeaking} onClick={next}>
                {step.kind === "prep" ? "I'm ready to speak" : "Finished answering →"}
              </button>
            </div>
          </div>
        </div>
      </ExamFrame>
    );
  }

  if (phase === "results" && savedBand !== null) {
    return (
      <ExamFrame module="Speaking — Results" candidate={store.name}>
        <div className="exam-scroll">
          <Results module="speaking" band={savedBand} target={store.target.speaking} />
        </div>
      </ExamFrame>
    );
  }

  /* ---------- Assessment ---------- */
  const band = rubricBand(rubric, SPEAKING_CRITERIA.length);
  const report = fluencyReport(set, results);
  return (
    <ExamFrame module="Speaking — Review your interview" candidate={store.name}>
      <div className="exam-scroll">
        <div className="results stack">
          <YuvrajSays title="listen back like an examiner">
            <p style={{ margin: 0 }}>
              Play each part, read the transcript and notice where you hesitated or ran out of ideas. Then score
              yourself below. Longer answers with fewer fillers are the fastest way to raise your fluency score.
            </p>
            {report.checks.length > 0 && (
              <>
                <p style={{ margin: 0 }}>
                  <b>{report.summary}</b>
                </p>
                <ul className="small" style={{ margin: 0, paddingLeft: "1.2rem" }}>
                  {report.checks.map((c) => (
                    <li key={c.text}>
                      {c.ok ? "✅" : "⚠️"} {c.text}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </YuvrajSays>
          {[1, 2, 3].map((p) => {
            const r = results[p];
            const words = r ? countWords(r.transcript) : 0;
            const wpm = r && r.seconds > 0 ? Math.round((words / r.seconds) * 60) : 0;
            const lower = ` ${r?.transcript.toLowerCase() ?? ""} `;
            const fillers = FILLERS.map((f) => ({ f, n: lower.split(new RegExp(`\\b${f}\\b`)).length - 1 })).filter((x) => x.n > 0);
            return (
              <div key={p} className="card stack">
                <div className="row">
                  <h3 style={{ margin: 0 }}>Part {p}</h3>
                  {r && <span className="badge">{formatClock(r.seconds)}</span>}
                  {words > 0 && <span className="badge">{words} words</span>}
                  {wpm > 0 && <span className={`badge ${wpm >= 110 && wpm <= 170 ? "good" : "warn"}`}>{wpm} words/min</span>}
                </div>
                {!r ? (
                  <p className="muted small">Not recorded.</p>
                ) : (
                  <>
                    {r.url ? <audio controls src={r.url} style={{ width: "100%" }} /> : <p className="muted small">No audio recorded.</p>}
                    {r.transcript ? <div className="model-answer small">{r.transcript}</div> : canTranscribe && <p className="muted small">No speech was transcribed.</p>}
                    {fillers.length > 0 && <p className="small">Fillers: {fillers.map((x) => `"${x.f}" × ${x.n}`).join(", ")}</p>}
                  </>
                )}
              </div>
            );
          })}
          <p className="small muted">A natural pace for band 7+ is roughly 120–160 words per minute. Transcripts are approximate.</p>
          <div className="card stack">
            <h3>Score yourself</h3>
            <Rubric criteria={SPEAKING_CRITERIA} value={rubric} onChange={(k, b) => setRubric((r) => ({ ...r, [k]: b }))} />
            <div className="row">
              {band !== null ? (
                <>
                  <span>
                    Estimated band: <b>{formatBand(band)}</b>
                  </span>
                  <div className="spacer" />
                  <button
                    className="btn primary"
                    onClick={() => {
                      addAttempt({ module: "speaking", testId: set.id, title: set.title, band, notes: fluencyNote(set, results) });
                      setSavedBand(band);
                      setPhase("results");
                    }}
                  >
                    Save and see feedback
                  </button>
                </>
              ) : (
                <span className="muted small">Pick one box in each row to get your band.</span>
              )}
            </div>
          </div>
          <p className="small muted">Recordings are not saved. To keep one, use the ⋮ menu on the player and choose Download.</p>
        </div>
      </div>
    </ExamFrame>
  );
}
