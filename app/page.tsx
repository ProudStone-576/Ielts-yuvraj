"use client";

import Link from "next/link";
import { BandBadge, statsFor } from "@/components/BandStats";
import { bandToClb, formatBand } from "@/lib/scoring";
import { useStore } from "@/lib/storage";
import { MODULE_LABEL, MODULES, type Module } from "@/lib/types";

const MODULE_INFO: Record<Module, string> = {
  listening: "4 parts · 40 questions · ~30 min",
  reading: "3 sections · 40 questions · 60 min",
  writing: "Letter (150 words) + essay (250 words) · 60 min",
  speaking: "3 parts · 11–14 min · recorded",
};

const TIPS: Record<Module, string> = {
  listening:
    "For band 8 you need about 35/40. Read ahead before each part starts, and watch for speakers changing their mind — the first answer you hear is often a trap.",
  reading:
    "For band 7 in General Training you need about 34/40. Section 3 is the hardest — leave at least 20 minutes for it, and don't spend more than 90 seconds on any one question.",
  writing:
    "Band 7 needs every bullet point covered, a clear position in Task 2, and a range of complex sentences. Task 2 is worth twice as much as Task 1, so never run out of time on it.",
  speaking:
    "Band 7 means speaking at length without effort. In Part 2, use all 2 minutes; in Part 3, give a reason and an example for every opinion.",
};

function daysUntil(date: string): number | null {
  if (!date) return null;
  const diff = new Date(date + "T00:00:00").getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.round(diff / 86_400_000);
}

export default function Dashboard() {
  const { store, update } = useStore();
  const stats = Object.fromEntries(MODULES.map((m) => [m, statsFor(store.attempts, m)])) as Record<
    Module,
    ReturnType<typeof statsFor>
  >;

  const reached = MODULES.filter((m) => (stats[m].average ?? 0) >= store.target[m]).length;
  // Focus on the module furthest below target (untried modules count as furthest).
  const focus = [...MODULES].sort(
    (a, b) =>
      (stats[a].average ?? 0) - store.target[a] - ((stats[b].average ?? 0) - store.target[b]),
  )[0];
  const days = daysUntil(store.examDate);

  return (
    <div className="stack">
      <div className="page-head">
        <h1>{store.name ? `Hi ${store.name} 👋` : "Your IELTS Coach"}</h1>
        <p>
          General Training · Goal: <b>CLB 9</b> — Listening {formatBand(store.target.listening)}, Reading{" "}
          {formatBand(store.target.reading)}, Writing {formatBand(store.target.writing)}, Speaking{" "}
          {formatBand(store.target.speaking)}.
        </p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="row">
            <div>
              <div className="muted small">Modules at target</div>
              <div className="band-big">
                {reached}
                <span className="muted" style={{ fontSize: "1.2rem" }}>
                  {" "}
                  / 4
                </span>
              </div>
            </div>
            <div className="spacer" />
            <div style={{ textAlign: "right" }}>
              <div className="muted small">Exam day</div>
              {days === null ? (
                <Link href="/progress" className="small">
                  Set your exam date →
                </Link>
              ) : (
                <div className="band-big" style={{ fontSize: "1.6rem" }}>
                  {days > 0 ? `${days} days` : days === 0 ? "Today!" : "Done"}
                </div>
              )}
            </div>
          </div>
          <div className="progress good" style={{ marginTop: "0.9rem" }}>
            <div style={{ width: `${(reached / 4) * 100}%` }} />
          </div>
          <p className="small muted" style={{ marginTop: "0.6rem", marginBottom: 0 }}>
            Based on the average of your last three attempts in each module.
          </p>
        </div>

        <div className="card">
          <div className="muted small">Focus next on</div>
          <h2 style={{ marginTop: "0.2rem" }}>{MODULE_LABEL[focus]}</h2>
          <p className="small">{TIPS[focus]}</p>
          <Link className="btn primary" href={`/${focus}`}>
            Practise {MODULE_LABEL[focus]}
          </Link>
        </div>
      </div>

      {!store.name && (
        <div className="card row">
          <span>What&apos;s your name?</span>
          <input
            placeholder="First name"
            onKeyDown={(e) => {
              const v = (e.target as HTMLInputElement).value.trim();
              if (e.key === "Enter" && v) update((s) => ({ ...s, name: v }));
            }}
          />
          <span className="muted small">Press Enter to save</span>
        </div>
      )}

      <div className="grid grid-4">
        {MODULES.map((m) => {
          const s = stats[m];
          const target = store.target[m];
          const pct = Math.min(100, ((s.average ?? 0) / target) * 100);
          return (
            <Link key={m} href={`/${m}`} className="card">
              <div className="row">
                <h3 style={{ margin: 0 }}>{MODULE_LABEL[m]}</h3>
                <div className="spacer" />
                <span className="badge accent">Target {formatBand(target)}</span>
              </div>
              <p className="small muted" style={{ margin: "0.3rem 0 0.75rem" }}>
                {MODULE_INFO[m]}
              </p>
              <div className="row small" style={{ marginBottom: "0.5rem" }}>
                <span>Latest</span>
                <div className="spacer" />
                <BandBadge module={m} band={s.latest} target={target} />
              </div>
              <div className="row small" style={{ marginBottom: "0.75rem" }}>
                <span>Best</span>
                <div className="spacer" />
                <b>{s.best !== undefined ? `${formatBand(s.best)} (CLB ${bandToClb(m, s.best) || "<4"})` : "—"}</b>
              </div>
              <div className={`progress ${pct >= 100 ? "good" : ""}`}>
                <div style={{ width: `${pct}%` }} />
              </div>
              <div className="small muted" style={{ marginTop: "0.35rem" }}>
                {s.count} attempt{s.count === 1 ? "" : "s"}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="card">
        <h3>How CLB 9 maps to IELTS General Training</h3>
        <div className="table-scroll">
          <table className="data">
            <thead>
              <tr>
                <th>CLB</th>
                <th>Listening</th>
                <th>Reading</th>
                <th>Writing</th>
                <th>Speaking</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10</td><td>8.5</td><td>8.0</td><td>7.5</td><td>7.5</td>
              </tr>
              <tr style={{ fontWeight: 700 }}>
                <td>9 ← goal</td><td>8.0</td><td>7.0</td><td>7.0</td><td>7.0</td>
              </tr>
              <tr>
                <td>8</td><td>7.5</td><td>6.5</td><td>6.5</td><td>6.5</td>
              </tr>
              <tr>
                <td>7</td><td>6.0</td><td>6.0</td><td>6.0</td><td>6.0</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small muted" style={{ marginTop: "0.6rem", marginBottom: 0 }}>
          Each module must meet its own minimum — a high overall band is not enough. Always confirm the current
          equivalency on the official IRCC website.
        </p>
      </div>
    </div>
  );
}
