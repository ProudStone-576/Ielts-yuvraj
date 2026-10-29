"use client";

import { useMemo, useState } from "react";
import { ExamFrame, Navigator } from "@/components/exam/ExamFrame";
import { Highlightable } from "@/components/exam/Highlightable";
import { Results } from "@/components/exam/Results";
import { useExamState } from "@/components/exam/useExamState";
import { QuestionGroups } from "@/components/Questions";
import { scoreBlocks } from "@/lib/exam";
import { rawToBand } from "@/lib/scoring";
import { useStore } from "@/lib/storage";
import type { ReadingTest } from "@/lib/types";
import { useCountdown } from "@/lib/useTimer";

type Phase = "intro" | "test" | "results" | "review";

export function ReadingRunner({ test }: { test: ReadingTest }) {
  const { store, addAttempt } = useStore();
  const blocks = useMemo(() => test.sections.map((s) => ({ label: s.title.replace("Section", "Part"), groups: s.groups })), [test]);
  const exam = useExamState(blocks);
  const [phase, setPhase] = useState<Phase>("intro");
  const [result, setResult] = useState<ReturnType<typeof scoreBlocks> | null>(null);

  const submit = () => {
    if (phase !== "test") return;
    const r = scoreBlocks(blocks, exam.answers);
    setResult(r);
    addAttempt({
      module: "reading",
      testId: test.id,
      title: test.title,
      band: rawToBand("reading", r.raw, exam.numbered.total),
      raw: r.raw,
      total: exam.numbered.total,
      breakdown: r.breakdown,
    });
    setPhase("results");
  };

  const [left] = useCountdown(60 * 60, phase === "test", submit);
  const section = test.sections[exam.part];
  const submitted = phase === "results" || phase === "review";

  if (phase === "intro") {
    return (
      <ExamFrame module="General Training Reading" candidate={store.name}>
        <div className="exam-intro card stack">
          <h2>{test.title}</h2>
          <p>
            <b>Time: 1 hour</b>
          </p>
          <h4>Instructions to candidates</h4>
          <ul>
            <li>Answer all the questions.</li>
            <li>You can change your answers at any time during the test.</li>
          </ul>
          <h4>Information for candidates</h4>
          <ul>
            <li>There are 40 questions in this test. Each question carries one mark.</li>
            <li>There are three parts to the test.</li>
            <li>The test ends automatically when the time runs out.</li>
            <li>
              Use the navigation bar at the bottom to move between questions. Tick <b>Review</b> to mark a question you
              want to come back to.
            </li>
            <li>Select words in the text to highlight them.</li>
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

  if (phase === "results" && result) {
    const band = rawToBand("reading", result.raw, exam.numbered.total);
    return (
      <ExamFrame module="General Training Reading — Results" candidate={store.name}>
        <div className="exam-scroll">
          <Results
            module="reading"
            band={band}
            target={store.target.reading}
            raw={result.raw}
            total={exam.numbered.total}
            breakdown={result.breakdown}
          >
            <div>
              <button className="btn primary" onClick={() => setPhase("review")}>
                Review answers with the passages
              </button>
            </div>
          </Results>
        </div>
      </ExamFrame>
    );
  }

  return (
    <ExamFrame
      module={phase === "review" ? "Reading — Answer review" : "General Training Reading"}
      candidate={store.name}
      timeLeft={phase === "test" ? left : null}
      right={
        phase === "test" ? (
          <button
            className="btn exam-btn"
            onClick={() => {
              const missing = exam.numbered.total - exam.answered.size;
              if (confirm(missing ? `You have ${missing} unanswered questions. Finish the test now?` : "Finish the test now?")) submit();
            }}
          >
            Finish test
          </button>
        ) : (
          <button className="btn exam-btn" onClick={() => setPhase("results")}>
            Back to results
          </button>
        )
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
          onPart={exam.openPart}
        />
      }
    >
      <div className="part-banner">
        <b>{blocks[exam.part].label}</b>
        <span>
          Read the text and answer questions {exam.numbered.parts[exam.part].numbers[0]}–
          {exam.numbered.parts[exam.part].numbers.at(-1)}.
        </span>
      </div>
      <div className="exam-split">
        <div className="pane passage-pane">
          <Highlightable>
            {/* All parts stay mounted (only the current one is shown) so highlights survive switching parts. */}
            {test.sections.map((s, i) => (
              <div key={s.title} hidden={i !== exam.part}>
                {s.passages.map((p) => (
                  <article key={p.title} className="passage-article">
                    <h3>{p.title}</h3>
                    <div className="passage-text">{p.body}</div>
                  </article>
                ))}
              </div>
            ))}
          </Highlightable>
        </div>
        <div className="pane questions-pane">
          <QuestionGroups
            groups={section.groups}
            numberOf={exam.numbered.numberOf}
            answers={exam.answers}
            onChange={exam.setAnswer}
            submitted={submitted}
            current={exam.current}
            flagged={exam.flagged}
            onFocusQuestion={exam.setCurrent}
          />
        </div>
      </div>
    </ExamFrame>
  );
}
