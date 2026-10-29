"use client";

import { daysUntil, studyPlan } from "@/lib/coach";
import { CLB9_TARGET, formatBand } from "@/lib/scoring";
import { useStore } from "@/lib/storage";
import { MODULE_LABEL, MODULES } from "@/lib/types";

const BANDS = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

export default function PlanPage() {
  const { store, update } = useStore();
  const plan = studyPlan(store);
  const days = daysUntil(store.examDate);

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Your study plan</h1>
        <p>
          {days !== null && days > 0
            ? `${days} days until your exam. This plan updates automatically as your scores change — the modules furthest from your target get the most time.`
            : "Set your exam date and I'll build a week-by-week plan. Until then, here's a 4-week plan."}
        </p>
      </div>

      <div className="card row">
        <label className="row">
          <b>Exam date</b>
          <input type="date" value={store.examDate} onChange={(e) => update((s) => ({ ...s, examDate: e.target.value }))} />
        </label>
        <label className="row">
          <b>Name</b>
          <input value={store.name} onChange={(e) => update((s) => ({ ...s, name: e.target.value }))} style={{ width: 140 }} />
        </label>
      </div>

      <div className="timeline">
        {plan.map((w) => (
          <div key={w.label} className="card week">
            <div className="row">
              <h3 style={{ margin: 0 }}>{w.label}</h3>
              <div className="spacer" />
              <span className="badge accent">{w.focus}</span>
            </div>
            <ul style={{ margin: "0.6rem 0 0", paddingLeft: "1.2rem" }}>
              {w.sessions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card stack">
        <div className="row">
          <h3 style={{ margin: 0 }}>Target bands</h3>
          <div className="spacer" />
          <button className="btn small" onClick={() => update((s) => ({ ...s, target: { ...CLB9_TARGET } }))}>
            Reset to CLB 9
          </button>
        </div>
        <div className="grid grid-4" style={{ gap: "0.5rem" }}>
          {MODULES.map((m) => (
            <label key={m} className="row">
              <span style={{ minWidth: 80 }}>{MODULE_LABEL[m]}</span>
              <select value={store.target[m]} onChange={(e) => update((s) => ({ ...s, target: { ...s.target, [m]: Number(e.target.value) } }))}>
                {BANDS.map((b) => (
                  <option key={b} value={b}>
                    {formatBand(b)}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <p className="small muted" style={{ margin: 0 }}>
          CLB 9 for IELTS General Training: Listening 8.0, Reading 7.0, Writing 7.0, Speaking 7.0. Each module must meet
          its own minimum. Confirm current requirements on the official IRCC website.
        </p>
      </div>
    </div>
  );
}
