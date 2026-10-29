"use client";

import Link from "next/link";
import { testFeedback } from "@/lib/coach";
import { bandToClb, formatBand } from "@/lib/scoring";
import type { Module, SkillScore } from "@/lib/types";
import { YuvrajSays } from "@/components/Yuvraj";

/** Score summary with the coach's comments, shown after an exam. */
export function Results({
  module,
  band,
  target,
  raw,
  total,
  breakdown,
  children,
}: {
  module: Module;
  band: number;
  target: number;
  raw?: number;
  total?: number;
  breakdown?: Record<string, SkillScore>;
  children?: React.ReactNode;
}) {
  const feedback = testFeedback(module, band, target, breakdown);
  return (
    <div className="results stack">
      <div className="card result-banner">
        {raw !== undefined && (
          <div>
            <div className="muted small">Score</div>
            <div className="band-big">
              {raw}/{total}
            </div>
          </div>
        )}
        <div>
          <div className="muted small">Band</div>
          <div className="band-big">{formatBand(band)}</div>
        </div>
        <div>
          <div className="muted small">CLB</div>
          <div className="band-big">{bandToClb(module, band) || "<4"}</div>
        </div>
        <div>
          <div className="muted small">Target</div>
          <div className="band-big" style={{ color: band >= target ? "var(--good)" : "var(--muted)" }}>
            {formatBand(target)}
          </div>
        </div>
      </div>

      <YuvrajSays title="my verdict">
        {feedback.map((f) => (
          <p key={f} style={{ margin: 0 }}>
            {f}
          </p>
        ))}
      </YuvrajSays>

      {breakdown && Object.keys(breakdown).length > 0 && (
        <div className="card">
          <h3>By question type</h3>
          <table className="data">
            <tbody>
              {Object.entries(breakdown).map(([skill, s]) => {
                const pct = Math.round((s.c / s.t) * 100);
                return (
                  <tr key={skill}>
                    <td>{skill}</td>
                    <td style={{ width: "40%" }}>
                      <div className={`progress ${pct >= 85 ? "good" : ""}`}>
                        <div style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {s.c}/{s.t}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {children}

      <div className="row">
        <Link href={`/${module}`} className="btn">
          Back to {module[0].toUpperCase() + module.slice(1)}
        </Link>
        <Link href="/" className="btn primary">
          Back to your coach
        </Link>
      </div>
    </div>
  );
}
