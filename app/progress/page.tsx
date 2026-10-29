"use client";

import { useRef, useState } from "react";
import { recentAverage, weakAreas } from "@/lib/coach";
import { bandToClb, formatBand, overallBand } from "@/lib/scoring";
import { exportBackup, importBackup, resetAll, useAuth, useStore } from "@/lib/storage";
import { MODULE_LABEL, MODULES, type Module } from "@/lib/types";

/** Simple line of band scores over time for one module. */
function Trend({ points, target }: { points: number[]; target: number }) {
  if (points.length < 2) return <div className="small muted">Take 2+ tests to see your trend.</div>;
  const w = 220;
  const h = 60;
  const y = (b: number) => h - ((b - 3) / 6) * h;
  const x = (i: number) => (i / (points.length - 1)) * w;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="trend" role="img" aria-label="Band trend">
      <line x1={0} x2={w} y1={y(target)} y2={y(target)} className="trend-target" />
      <polyline points={points.map((b, i) => `${x(i)},${y(b)}`).join(" ")} className="trend-line" />
      {points.map((b, i) => (
        <circle key={i} cx={x(i)} cy={y(b)} r={3} className="trend-dot" />
      ))}
    </svg>
  );
}

export default function ProgressPage() {
  const { store, deleteAttempt } = useStore();
  const auth = useAuth();
  const [message, setMessage] = useState("");
  const file = useRef<HTMLInputElement>(null);

  const attempts = [...store.attempts].reverse();
  const averages = MODULES.map((m) => recentAverage(store.attempts, m));
  const allTried = averages.every((a) => a !== undefined);
  const weak = weakAreas(store.attempts, 6);

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Progress</h1>
        <p>
          {auth.mode === "signed-in"
            ? "Every test is saved to your account automatically — sign in on any device to see it."
            : "Every test you finish is saved here."}
        </p>
      </div>

      <div className="grid grid-4">
        {MODULES.map((m: Module, i) => {
          const avg = averages[i];
          const points = store.attempts.filter((a) => a.module === m).map((a) => a.band);
          return (
            <div key={m} className="card stack" style={{ gap: "0.4rem" }}>
              <div className="row">
                <span className={`mod-dot ${m}`} />
                <b>{MODULE_LABEL[m]}</b>
                <div className="spacer" />
                <span className="small muted">target {formatBand(store.target[m])}</span>
              </div>
              <div className="band-big">{avg !== undefined ? formatBand(avg) : "—"}</div>
              <div className="small">{avg !== undefined ? `CLB ${bandToClb(m, avg) || "<4"} · last 3 average` : "No tests yet"}</div>
              <Trend points={points} target={store.target[m]} />
            </div>
          );
        })}
      </div>

      {allTried && (
        <div className="card row">
          <span>Estimated overall band:</span>
          <b className="band-big" style={{ fontSize: "1.6rem" }}>
            {formatBand(overallBand(averages as number[]))}
          </b>
          <span className="small muted">For CLB, each module counts separately — the overall band is for reference only.</span>
        </div>
      )}

      {weak.length > 0 && (
        <div className="card">
          <h3>Accuracy by question type (weakest first)</h3>
          <table className="data">
            <tbody>
              {weak.map((w) => (
                <tr key={w.module + w.skill}>
                  <td>
                    <span className={`mod-dot ${w.module}`} /> {w.skill}
                  </td>
                  <td className="small muted">{w.total} questions</td>
                  <td>
                    <span className={`badge ${w.accuracy < 0.6 ? "bad" : "warn"}`}>{Math.round(w.accuracy * 100)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card">
        <h3>History</h3>
        {attempts.length === 0 ? (
          <p className="muted">No tests yet. Finish a test and it will appear here.</p>
        ) : (
          <div className="table-scroll">
            <table className="data">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Test</th>
                  <th>Score</th>
                  <th>Band</th>
                  <th>CLB</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => (
                  <tr key={a.id}>
                    <td className="small">{new Date(a.date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</td>
                    <td>
                      <span className={`mod-dot ${a.module}`} /> {a.title}
                    </td>
                    <td className="small">{a.raw !== undefined ? `${a.raw}/${a.total}` : <span className="muted">{a.notes}</span>}</td>
                    <td>
                      <span className={`badge ${a.band >= store.target[a.module] ? "good" : ""}`}>{formatBand(a.band)}</span>
                    </td>
                    <td>{bandToClb(a.module, a.band) || "<4"}</td>
                    <td>
                      <button
                        className="btn danger small"
                        style={{ padding: "0.2rem 0.5rem" }}
                        title="Delete this test result"
                        onClick={() => confirm("Delete this test result?") && deleteAttempt(a.id)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {auth.mode === "local" && (
        <div className="card stack">
          <h3>Backup</h3>
          <p className="small muted" style={{ margin: 0 }}>
            Cloud save isn&apos;t switched on for this app, so progress is stored in this browser only. Download a backup
            now and then to keep it safe.
          </p>
          <div className="row">
            <button
              className="btn primary"
              onClick={() => {
                const blob = new Blob([exportBackup()], { type: "application/json" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `ielts-coach-backup-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(a.href);
              }}
            >
              Download backup
            </button>
            <button className="btn" onClick={() => file.current?.click()}>
              Restore from file
            </button>
            <input
              ref={file}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (!f) return;
                try {
                  importBackup(await f.text());
                  setMessage("Backup restored.");
                } catch (err) {
                  setMessage(err instanceof Error ? err.message : "Could not read that file.");
                }
              }}
            />
          </div>
          {message && <div className="notice">{message}</div>}
        </div>
      )}

      <div>
        <button
          className="btn danger"
          onClick={() => confirm("Delete ALL test results and settings? This cannot be undone.") && resetAll()}
        >
          Delete all my results
        </button>
      </div>
    </div>
  );
}
