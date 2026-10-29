"use client";

import { useRef, useState } from "react";
import { statsFor } from "@/components/BandStats";
import { bandToClb, CLB9_TARGET, formatBand, overallBand } from "@/lib/scoring";
import { exportBackup, importBackup, resetAll, useStore } from "@/lib/storage";
import { MODULE_LABEL, MODULES } from "@/lib/types";

const BANDS = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

export default function ProgressPage() {
  const { store, update } = useStore();
  const [message, setMessage] = useState("");
  const file = useRef<HTMLInputElement>(null);

  const attempts = [...store.attempts].reverse();
  const averages = MODULES.map((m) => statsFor(store.attempts, m).average);
  const allTried = averages.every((a) => a !== undefined);

  const download = () => {
    const blob = new Blob([exportBackup()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ielts-coach-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMessage("Backup downloaded. Keep it somewhere safe, like Google Drive or email it to yourself.");
  };

  const restore = async (f: File) => {
    try {
      importBackup(await f.text());
      setMessage("Backup restored.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not read that file.");
    }
  };

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Progress</h1>
        <p>Every test you finish is saved here, on this device.</p>
      </div>

      <div className="grid grid-4">
        {MODULES.map((m, i) => {
          const s = statsFor(store.attempts, m);
          return (
            <div key={m} className="card">
              <div className="muted small">{MODULE_LABEL[m]} · last 3 average</div>
              <div className="band-big">{s.average !== undefined ? formatBand(s.average) : "—"}</div>
              <div className="small">
                {s.average !== undefined ? `CLB ${bandToClb(m, s.average) || "<4"}` : "No attempts"} · target{" "}
                {formatBand(store.target[m])}
              </div>
              {averages[i] !== undefined && (
                <div className={`progress ${averages[i]! >= store.target[m] ? "good" : ""}`} style={{ marginTop: "0.5rem" }}>
                  <div style={{ width: `${Math.min(100, (averages[i]! / store.target[m]) * 100)}%` }} />
                </div>
              )}
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
          <span className="small muted">For CLB, each module counts separately — the overall band is just for reference.</span>
        </div>
      )}

      <div className="card">
        <h3>History</h3>
        {attempts.length === 0 ? (
          <p className="muted">No attempts yet. Finish a test and it will appear here.</p>
        ) : (
          <div className="table-scroll">
            <table className="data">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Module</th>
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
                    <td>{new Date(a.date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</td>
                    <td>{MODULE_LABEL[a.module]}</td>
                    <td>{a.title}</td>
                    <td>{a.raw !== undefined ? `${a.raw}/${a.total}` : <span className="muted small">{a.notes}</span>}</td>
                    <td>
                      <span className={`badge ${a.band >= store.target[a.module] ? "good" : ""}`}>{formatBand(a.band)}</span>
                    </td>
                    <td>{bandToClb(a.module, a.band) || "<4"}</td>
                    <td>
                      <button
                        className="btn danger small"
                        style={{ padding: "0.2rem 0.5rem" }}
                        title="Delete this attempt"
                        onClick={() => {
                          if (confirm("Delete this attempt?"))
                            update((s) => ({ ...s, attempts: s.attempts.filter((x) => x.id !== a.id) }));
                        }}
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

      <div className="grid grid-2">
        <div className="card stack">
          <h3>Settings</h3>
          <label className="row">
            <span style={{ minWidth: 90 }}>Name</span>
            <input value={store.name} onChange={(e) => update((s) => ({ ...s, name: e.target.value }))} />
          </label>
          <label className="row">
            <span style={{ minWidth: 90 }}>Exam date</span>
            <input type="date" value={store.examDate} onChange={(e) => update((s) => ({ ...s, examDate: e.target.value }))} />
          </label>
          <div>
            <div className="row" style={{ marginBottom: "0.5rem" }}>
              <b>Target bands</b>
              <div className="spacer" />
              <button className="btn small" onClick={() => update((s) => ({ ...s, target: { ...CLB9_TARGET } }))}>
                Reset to CLB 9
              </button>
            </div>
            <div className="grid grid-2" style={{ gap: "0.5rem" }}>
              {MODULES.map((m) => (
                <label key={m} className="row">
                  <span style={{ minWidth: 90 }}>{MODULE_LABEL[m]}</span>
                  <select
                    value={store.target[m]}
                    onChange={(e) =>
                      update((s) => ({ ...s, target: { ...s.target, [m]: Number(e.target.value) } }))
                    }
                  >
                    {BANDS.map((b) => (
                      <option key={b} value={b}>
                        {formatBand(b)}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="card stack">
          <h3>Backup</h3>
          <p className="small muted" style={{ margin: 0 }}>
            Your progress is saved in this browser only. Download a backup now and then — and before changing phone
            or clearing your browser — so nothing is ever lost. You can restore it on any device.
          </p>
          <div className="row">
            <button className="btn primary" onClick={download}>
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
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) restore(f);
                e.target.value = "";
              }}
            />
          </div>
          {message && <div className="notice">{message}</div>}
          <hr style={{ border: 0, borderTop: "1px solid var(--border)", width: "100%" }} />
          <div>
            <button
              className="btn danger"
              onClick={() => {
                if (confirm("Delete ALL progress, drafts and settings? Download a backup first if unsure.")) resetAll();
              }}
            >
              Delete all data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
