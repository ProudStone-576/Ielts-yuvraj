"use client";

import { formatClock } from "@/lib/useTimer";

/** Full-screen layout modelled on the computer-delivered test: header, body, navigator. */
export function ExamFrame({
  module,
  candidate,
  timeLeft,
  timeLabel = "remaining",
  right,
  footer,
  children,
}: {
  module: string;
  candidate: string;
  timeLeft?: number | null;
  timeLabel?: string;
  right?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const minutes = timeLeft != null ? Math.ceil(timeLeft / 60) : null;
  return (
    <div className="exam">
      <header className="exam-head">
        <div className="exam-candidate">
          <span className="exam-logo">IC</span>
          <div>
            <div className="exam-module">{module}</div>
            <div className="exam-name">Candidate: {candidate || "—"}</div>
          </div>
        </div>
        {timeLeft != null && (
          <div className={`exam-time ${timeLeft <= 300 ? "low" : ""}`} title={formatClock(timeLeft)}>
            {timeLeft > 120 ? `${minutes} minutes ${timeLabel}` : `${formatClock(timeLeft)} ${timeLabel}`}
          </div>
        )}
        <div className="exam-right">{right}</div>
      </header>
      <div className="exam-body">{children}</div>
      {footer && <footer className="exam-foot">{footer}</footer>}
    </div>
  );
}

/** Bottom bar listing every question, like the real test's navigation bar. */
export function Navigator({
  parts,
  answered,
  flagged,
  current,
  onGo,
  onFlag,
  activePart,
  onPart,
  extra,
}: {
  parts: { label: string; numbers: number[] }[];
  answered: Set<number>;
  flagged: Set<number>;
  current: number;
  onGo: (n: number) => void;
  onFlag: () => void;
  activePart: number;
  onPart: (i: number) => void;
  extra?: React.ReactNode;
}) {
  const all = parts.flatMap((p) => p.numbers);
  const idx = all.indexOf(current);
  return (
    <div className="nav-bar">
      <label className="review-toggle">
        <input type="checkbox" checked={flagged.has(current)} onChange={onFlag} /> Review
      </label>
      <div className="nav-parts">
        {parts.map((p, i) => (
          <div key={p.label} className={`nav-part ${i === activePart ? "open" : ""}`}>
            <button className="nav-part-label" onClick={() => onPart(i)}>
              {p.label}
              {i !== activePart && (
                <span className="nav-count">
                  {p.numbers.filter((n) => answered.has(n)).length} of {p.numbers.length}
                </span>
              )}
            </button>
            {i === activePart &&
              p.numbers.map((n) => (
                <button
                  key={n}
                  className={`qnum ${answered.has(n) ? "done" : ""} ${flagged.has(n) ? "flag" : ""} ${n === current ? "cur" : ""}`}
                  onClick={() => onGo(n)}
                  aria-label={`Question ${n}`}
                >
                  {n}
                </button>
              ))}
          </div>
        ))}
      </div>
      <div className="nav-arrows">
        {extra}
        <button className="arrow" disabled={idx <= 0} onClick={() => onGo(all[idx - 1])} aria-label="Previous">
          ←
        </button>
        <button className="arrow" disabled={idx >= all.length - 1} onClick={() => onGo(all[idx + 1])} aria-label="Next">
          →
        </button>
      </div>
    </div>
  );
}
