"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExamFrame, Navigator } from "@/components/exam/ExamFrame";
import { Results } from "@/components/exam/Results";
import { useExamState } from "@/components/exam/useExamState";
import { QuestionGroups } from "@/components/Questions";
import { scoreBlocks } from "@/lib/exam";
import { rawToBand } from "@/lib/scoring";
import { getVolume, playScript, setVolume, speak, speechSupported, type Playback } from "@/lib/speech";
import { useStore } from "@/lib/storage";
import type { ListeningTest } from "@/lib/types";
import { formatClock } from "@/lib/useTimer";

type Phase = "intro" | "test" | "results" | "review";

type Stage =
  | { kind: "announce"; part: number }
  | { kind: "reading"; part: number; until: number }
  | { kind: "playing"; part: number }
  | { kind: "check"; part: number; until: number }
  | { kind: "final"; until: number };

/** Exam timings in seconds, like the computer-delivered test. */
const READING_TIME = 30;
const CHECK_TIME = 30;
const FINAL_CHECK = 120;

/** Testing hook: localStorage "ielts-dev-fast" = "1" shortens all waits. */
function scale(): number {
  try {
    return localStorage.getItem("ielts-dev-fast") === "1" ? 0.02 : 1;
  } catch {
    return 1;
  }
}

export function ListeningRunner({ test }: { test: ListeningTest }) {
  const { store, addAttempt } = useStore();
  const blocks = useMemo(() => test.parts.map((p) => ({ label: p.title, groups: p.groups })), [test]);
  const exam = useExamState(blocks);
  const [phase, setPhase] = useState<Phase>("intro");
  const [stage, setStage] = useState<Stage | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [vol, setVol] = useState(1);
  const [supported, setSupported] = useState(true);
  const [result, setResult] = useState<ReturnType<typeof scoreBlocks> | null>(null);
  const [reviewLine, setReviewLine] = useState(-1);
  const [reviewPlaying, setReviewPlaying] = useState(false);
  const run = useRef(0);
  const playback = useRef<Playback | null>(null);
  const answersRef = useRef(exam.answers);
  answersRef.current = exam.answers;

  useEffect(() => {
    setSupported(speechSupported());
    setVol(getVolume());
  }, []);

  // Stop everything when leaving the page.
  useEffect(
    () => () => {
      run.current++;
      playback.current?.stop();
      if (speechSupported()) speechSynthesis.cancel();
    },
    [],
  );

  useEffect(() => {
    if (phase !== "test") return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [phase]);

  const submit = () => {
    run.current++;
    playback.current?.stop();
    speechSynthesis.cancel();
    const r = scoreBlocks(blocks, answersRef.current);
    setResult(r);
    addAttempt({
      module: "listening",
      testId: test.id,
      title: test.title,
      band: rawToBand("listening", r.raw, exam.numbered.total),
      raw: r.raw,
      total: exam.numbered.total,
      breakdown: r.breakdown,
    });
    setPhase("results");
  };

  /** Runs the whole test automatically, part by part. */
  const start = async () => {
    setPhase("test");
    const id = ++run.current;
    const alive = () => run.current === id;
    const k = scale();
    const wait = (s: number) => new Promise((r) => setTimeout(r, s * 1000 * k));

    await speak("You will hear a number of different recordings, and you will have to answer questions on what you hear. You will hear each recording once only. Now turn to Part 1.");
    for (let i = 0; i < test.parts.length; i++) {
      if (!alive()) return;
      const p = test.parts[i];
      const nums = exam.numbered.parts[i].numbers;
      exam.openPart(i);
      setStage({ kind: "announce", part: i });
      await speak(`Part ${i + 1}. ${p.context} First, you have some time to look at questions ${nums[0]} to ${nums.at(-1)}.`);
      if (!alive()) return;
      setStage({ kind: "reading", part: i, until: Date.now() + READING_TIME * 1000 * k });
      await wait(READING_TIME);
      if (!alive()) return;
      setStage({ kind: "playing", part: i });
      await speak(`Now listen carefully and answer questions ${nums[0]} to ${nums.at(-1)}.`);
      if (!alive()) return;
      playback.current = playScript(p.script, p.voices, 1, () => {});
      await playback.current.done;
      playback.current = null;
      if (!alive()) return;
      await speak(`That is the end of Part ${i + 1}. You now have ${CHECK_TIME} seconds to check your answers.`);
      if (!alive()) return;
      setStage({ kind: "check", part: i, until: Date.now() + CHECK_TIME * 1000 * k });
      await wait(CHECK_TIME);
    }
    if (!alive()) return;
    await speak("That is the end of the listening test. You now have two minutes to check your answers.");
    if (!alive()) return;
    setStage({ kind: "final", until: Date.now() + FINAL_CHECK * 1000 * k });
    await wait(FINAL_CHECK);
    if (alive()) submit();
  };

  const remaining = stage && "until" in stage ? Math.max(0, Math.ceil((stage.until - now) / 1000)) : null;
  const status =
    !stage
      ? "Starting…"
      : stage.kind === "announce"
        ? `Part ${stage.part + 1} — instructions`
        : stage.kind === "reading"
          ? `Part ${stage.part + 1} — time to read the questions`
          : stage.kind === "playing"
            ? `Part ${stage.part + 1} — recording playing`
            : stage.kind === "check"
              ? `Part ${stage.part + 1} — check your answers`
              : "Final check — 2 minutes";

  const volumeControl = (
    <label className="volume" title="Volume">
      🔊
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={vol}
        onChange={(e) => {
          setVol(Number(e.target.value));
          setVolume(Number(e.target.value));
        }}
      />
    </label>
  );

  if (phase === "intro") {
    return (
      <ExamFrame module="Listening" candidate={store.name} right={volumeControl}>
        <div className="exam-intro card stack">
          <h2>{test.title}</h2>
          <p>
            <b>Time: approximately 30 minutes</b>
          </p>
          <h4>Instructions to candidates</h4>
          <ul>
            <li>Answer all the questions. You can change your answers at any time during the test.</li>
            <li>You will hear each recording ONCE only. There is no pause or replay.</li>
            <li>Before each part you have time to read the questions, and after each part time to check your answers.</li>
            <li>At the end of the test you have 2 minutes to check all your answers. The test then ends automatically.</li>
          </ul>
          <h4>Sound check</h4>
          <p className="small">Put on your headphones, press Play and adjust the volume at the top right until you can hear clearly.</p>
          <div className="row">
            <button className="btn" onClick={() => speak("This is a sound check. You should hear this sentence clearly. Adjust the volume if necessary.")}>
              ▶ Play sound check
            </button>
          </div>
          {!supported && (
            <div className="notice">
              This browser can&apos;t play the recordings. Please open the app in Chrome, Edge or Safari for Listening.
            </div>
          )}
          <p className="small muted">Chrome and Edge have the most natural voices.</p>
          <div>
            <button className="btn primary" disabled={!supported} onClick={start}>
              Start test
            </button>
          </div>
        </div>
      </ExamFrame>
    );
  }

  if (phase === "results" && result) {
    return (
      <ExamFrame module="Listening — Results" candidate={store.name}>
        <div className="exam-scroll">
          <Results
            module="listening"
            band={rawToBand("listening", result.raw, exam.numbered.total)}
            target={store.target.listening}
            raw={result.raw}
            total={exam.numbered.total}
            breakdown={result.breakdown}
          >
            <div>
              <button
                className="btn primary"
                onClick={() => {
                  exam.openPart(0);
                  setPhase("review");
                }}
              >
                Review answers with transcripts
              </button>
            </div>
          </Results>
        </div>
      </ExamFrame>
    );
  }

  const part = test.parts[exam.part];
  const review = phase === "review";

  const playFrom = (from: number) => {
    playback.current?.stop();
    setReviewPlaying(true);
    const pb = playScript(part.script.slice(from), part.voices, 1, (i) => setReviewLine(i < 0 ? -1 : i + from));
    playback.current = pb;
    pb.done.then(() => {
      if (playback.current === pb) {
        playback.current = null;
        setReviewPlaying(false);
      }
    });
  };

  return (
    <ExamFrame
      module={review ? "Listening — Answer review" : "Listening"}
      candidate={store.name}
      timeLeft={!review ? remaining : null}
      timeLabel={stage?.kind === "reading" ? "reading time" : "to check"}
      right={
        <>
          {volumeControl}
          {review && (
            <button
              className="btn exam-btn"
              onClick={() => {
                playback.current?.stop();
                setPhase("results");
              }}
            >
              Back to results
            </button>
          )}
        </>
      }
      footer={
        <Navigator
          parts={exam.numbered.parts}
          answered={exam.answered}
          flagged={exam.flagged}
          current={exam.current}
          onGo={exam.go}
          onFlag={exam.toggleFlag}
          activePart={exam.part}
          onPart={(i) => {
            if (review) playback.current?.stop();
            exam.openPart(i);
          }}
          extra={
            stage?.kind === "final" && !review ? (
              <button className="btn exam-btn" onClick={() => confirm("Submit your answers now?") && submit()}>
                Submit
              </button>
            ) : undefined
          }
        />
      }
    >
      {!review && (
        <div className={`part-banner ${stage?.kind === "playing" ? "live" : ""}`}>
          {stage?.kind === "playing" && <span className="rec-dot" />}
          <b>{status}</b>
          {remaining !== null && <span className="exam-mini-timer">{formatClock(remaining)}</span>}
        </div>
      )}
      <div className={review ? "exam-split" : "exam-single"}>
        {review && (
          <div className="pane passage-pane">
            <h3>{part.title} — transcript</h3>
            <p className="muted small">{part.context} Click any line to hear it again.</p>
            {part.script.map((l, i) => (
              <div
                key={i}
                className={`script-line ${i === reviewLine ? "current" : ""}`}
                onClick={() => !reviewPlaying && playFrom(i)}
                style={{ cursor: reviewPlaying ? undefined : "pointer" }}
              >
                <b>{l.speaker}:</b> {l.text}
              </div>
            ))}
            {reviewPlaying && (
              <button className="btn" onClick={() => playback.current?.stop()}>
                ■ Stop
              </button>
            )}
          </div>
        )}
        <div className="pane questions-pane">
          <div className="part-intro">
            <b>{part.title}</b> · Questions {exam.numbered.parts[exam.part].numbers[0]}–{exam.numbered.parts[exam.part].numbers.at(-1)}
          </div>
          <QuestionGroups
            groups={part.groups}
            numberOf={exam.numbered.numberOf}
            answers={exam.answers}
            onChange={exam.setAnswer}
            submitted={review}
            current={exam.current}
            flagged={exam.flagged}
            onFocusQuestion={exam.setCurrent}
          />
        </div>
      </div>
    </ExamFrame>
  );
}
