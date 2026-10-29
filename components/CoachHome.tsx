"use client";

import Link from "next/link";
import {
  coachMessage,
  daysUntil,
  gaps,
  greeting,
  recentAverage,
  SKILL_TIPS,
  streak,
  todaysPlan,
  weakAreas,
} from "@/lib/coach";
import type { CatalogItem } from "@/lib/catalog";
import { bandToClb, formatBand } from "@/lib/scoring";
import { useStore } from "@/lib/storage";
import { MODULE_LABEL, MODULES, type Module, type Store } from "@/lib/types";

/** The next test to take in a module: the first one not done yet, else the one done longest ago. */
export function nextTest(store: Store, module: Module, items: CatalogItem[]): CatalogItem | undefined {
  const last = new Map<string, string>();
  for (const a of store.attempts) if (a.module === module) last.set(a.testId, a.date);
  return [...items].sort((a, b) => (last.get(a.id) ?? "").localeCompare(last.get(b.id) ?? ""))[0];
}

function countLabel(n: number): string {
  return n === 1 ? "from 1 test" : `average of last ${Math.min(3, n)} tests`;
}

export function CoachHome({ catalog }: { catalog: Record<Module, CatalogItem[]> }) {
  const { store, update } = useStore();
  const days = daysUntil(store.examDate);
  const plan = todaysPlan(store);
  const weak = weakAreas(store.attempts);
  const g = gaps(store);
  const atTarget = MODULES.filter((m) => g[m] <= 0).length;
  const run = streak(store.attempts);
  const recent = [...store.attempts].reverse().slice(0, 5);

  return (
    <div className="stack">
      <div className="card coach-hero">
        <div className="coach-avatar lg">IC</div>
        <div className="stack" style={{ gap: "0.4rem" }}>
          <h1 style={{ margin: 0 }}>{greeting(store.name)} 👋</h1>
          <p style={{ margin: 0 }}>{coachMessage(store)}</p>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card stat">
          <div className="muted small">Exam day</div>
          {days === null ? (
            <label className="stack" style={{ gap: "0.3rem" }}>
              <span className="small">When is the exam?</span>
              <input type="date" onChange={(e) => update((s) => ({ ...s, examDate: e.target.value }))} />
            </label>
          ) : (
            <>
              <div className="band-big">{days > 0 ? days : days === 0 ? "Today" : "—"}</div>
              <div className="small muted">
                {days > 0 ? `days to go · ${new Date(store.examDate + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "long" })}` : days === 0 ? "Good luck! You're ready." : "Exam date passed — update it in Study plan"}
              </div>
            </>
          )}
        </div>
        <div className="card stat">
          <div className="muted small">CLB 9 progress</div>
          <div className="band-big">
            {atTarget}
            <span className="muted" style={{ fontSize: "1.1rem" }}> / 4 modules</span>
          </div>
          <div className="progress good" style={{ marginTop: "0.4rem" }}>
            <div style={{ width: `${(atTarget / 4) * 100}%` }} />
          </div>
        </div>
        <div className="card stat">
          <div className="muted small">Practice streak</div>
          <div className="band-big">
            {run}
            <span className="muted" style={{ fontSize: "1.1rem" }}> day{run === 1 ? "" : "s"}</span>
          </div>
          <div className="small muted">{run ? "Keep it going — a test a day adds up." : "Finish a test today to start a streak."}</div>
        </div>
      </div>

      <section>
        <h2>Today&apos;s plan</h2>
        {plan.length === 0 ? (
          <div className="card">✅ You&apos;ve done today&apos;s work. Rest, or take another test if you feel fresh.</div>
        ) : (
          <div className="grid grid-2">
            {plan.map((t) => {
              const next = nextTest(store, t.module, catalog[t.module]);
              return (
                <div key={t.module} className="card stack task-card">
                  <div className="row">
                    <span className={`mod-dot ${t.module}`} />
                    <b>{t.title}</b>
                    <div className="spacer" />
                    <span className="badge">{t.minutes} min</span>
                  </div>
                  <p className="small muted" style={{ margin: 0 }}>
                    {t.detail}
                  </p>
                  {next && (
                    <div>
                      <Link className="btn primary" href={`/${t.module}/${next.id}`}>
                        Start {next.title}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2>Where you are</h2>
        <div className="grid grid-4">
          {MODULES.map((m) => {
            const avg = recentAverage(store.attempts, m);
            const target = store.target[m];
            const pct = avg === undefined ? 0 : Math.min(100, (avg / target) * 100);
            return (
              <Link key={m} href={`/${m}`} className="card">
                <div className="row">
                  <span className={`mod-dot ${m}`} />
                  <h3 style={{ margin: 0 }}>{MODULE_LABEL[m]}</h3>
                </div>
                <div className="row" style={{ margin: "0.6rem 0 0.4rem", alignItems: "baseline" }}>
                  <span className="band-big" style={{ fontSize: "1.8rem" }}>
                    {avg !== undefined ? formatBand(avg) : "—"}
                  </span>
                  <span className="muted small">/ target {formatBand(target)}</span>
                </div>
                <div className={`progress ${avg !== undefined && avg >= target ? "good" : ""}`}>
                  <div style={{ width: `${pct}%` }} />
                </div>
                <div className="small muted" style={{ marginTop: "0.4rem" }}>
                  {avg === undefined ? "Not tested yet" : `CLB ${bandToClb(m, avg) || "<4"} · ${countLabel(store.attempts.filter((a) => a.module === m).length)}`}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid grid-2">
        <section className="card">
          <h3>Your weak spots</h3>
          {weak.length === 0 ? (
            <p className="muted small" style={{ margin: 0 }}>
              After a few Listening and Reading tests I&apos;ll show the question types costing you the most marks here.
            </p>
          ) : (
            <div className="stack">
              {weak.map((w) => (
                <div key={w.module + w.skill}>
                  <div className="row">
                    <b>{w.skill}</b>
                    <span className="small muted">{MODULE_LABEL[w.module]}</span>
                    <div className="spacer" />
                    <span className={`badge ${w.accuracy < 0.6 ? "bad" : "warn"}`}>{Math.round(w.accuracy * 100)}% correct</span>
                  </div>
                  <p className="small" style={{ margin: "0.3rem 0 0" }}>
                    {SKILL_TIPS[w.skill]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="card">
          <h3>Recent tests</h3>
          {recent.length === 0 ? (
            <p className="muted small" style={{ margin: 0 }}>
              Nothing yet — your first test result will appear here.
            </p>
          ) : (
            <table className="data">
              <tbody>
                {recent.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <span className={`mod-dot ${a.module}`} /> {a.title}
                    </td>
                    <td className="small muted">{new Date(a.date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</td>
                    <td>
                      <span className={`badge ${a.band >= store.target[a.module] ? "good" : ""}`}>{formatBand(a.band)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
