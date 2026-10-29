"use client";

import Link from "next/link";
import { PosterCard } from "@/components/TestList";
import { COACH_NAME, YuvrajAvatar } from "@/components/Yuvraj";
import {
  coachHeadline,
  coachMessage,
  daysUntil,
  gaps,
  greeting,
  recentAverage,
  ruleOfTheDay,
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
  const first = plan[0];
  const firstTest = first && nextTest(store, first.module, catalog[first.module]);

  return (
    <div className="home">
      <section className={`hero ${first ? `tint-${first.module}` : ""}`}>
        <div className="hero-copy">
          <div className="hero-coach">
            <YuvrajAvatar size={56} />
            <div>
              <div className="eyebrow">Your coach</div>
              <div className="hero-coach-name">{COACH_NAME}</div>
            </div>
          </div>
          <div className="eyebrow muted">{greeting(store.name)}</div>
          <h1 className="hero-title">{coachHeadline(store)}</h1>
          <p className="hero-quote">“{coachMessage(store)}”</p>
          <div className="row">
            {first && firstTest ? (
              <Link className="btn primary lg" href={`/${first.module}/${firstTest.id}`}>
                ▶&nbsp; Start {firstTest.title}
              </Link>
            ) : (
              <Link className="btn primary lg" href="/listening">
                ▶&nbsp; Take another test
              </Link>
            )}
            <Link className="btn ghost lg" href="/plan">
              View study plan
            </Link>
          </div>
        </div>
      </section>

      <section className="stat-strip">
        <div className="stat-item">
          <div className="eyebrow muted">Exam day</div>
          {days === null ? (
            <input type="date" aria-label="Exam date" onChange={(e) => update((s) => ({ ...s, examDate: e.target.value }))} />
          ) : (
            <>
              <div className="stat-num">{days > 0 ? days : days === 0 ? "Today" : "—"}</div>
              <div className="small muted">
                {days > 0
                  ? `days to go · ${new Date(store.examDate + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "long" })}`
                  : days === 0
                    ? "You're ready. Go and show them."
                    : "Date passed — update it in Study plan"}
              </div>
            </>
          )}
        </div>
        <div className="stat-item">
          <div className="eyebrow muted">At CLB 9</div>
          <div className="stat-num">
            {atTarget}
            <span className="stat-of"> / 4</span>
          </div>
          <div className="small muted">modules at target</div>
        </div>
        <div className="stat-item">
          <div className="eyebrow muted">Streak</div>
          <div className="stat-num">
            {run}
            <span className="stat-of"> day{run === 1 ? "" : "s"}</span>
          </div>
          <div className="small muted">{run ? "Don't break the chain." : "One test today starts it."}</div>
        </div>
        <div className="stat-item rule">
          <div className="eyebrow">{COACH_NAME}&apos;s rule of the day</div>
          <p>{ruleOfTheDay()}</p>
        </div>
      </section>

      <section>
        <h2 className="shelf-title">Your scorecard</h2>
        <div className="scorecard">
          {MODULES.map((m) => {
            const avg = recentAverage(store.attempts, m);
            const target = store.target[m];
            const pct = avg === undefined ? 0 : Math.min(100, (avg / target) * 100);
            const met = avg !== undefined && avg >= target;
            return (
              <Link key={m} href={`/${m}`} className={`score-tile tint-${m}`}>
                <div className="eyebrow">{MODULE_LABEL[m]}</div>
                <div className="score-row">
                  <span className="score-num">{avg !== undefined ? formatBand(avg) : "—"}</span>
                  <span className="muted small">target {formatBand(target)}</span>
                </div>
                <div className={`progress ${met ? "good" : ""}`}>
                  <div style={{ width: `${pct}%` }} />
                </div>
                <div className="small muted">
                  {avg === undefined ? "Not tested yet" : `CLB ${bandToClb(m, avg) || "<4"} · ${countLabel(store.attempts.filter((a) => a.module === m).length)}`}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {plan.length === 0 && (
        <section className="card done-today">
          <b>Today&apos;s work is done.</b> Rest properly — or take one more test if you still feel sharp.
        </section>
      )}

      {MODULES.map((m) => (
        <section key={m}>
          <div className="shelf-head">
            <h2 className="shelf-title">{MODULE_LABEL[m]}</h2>
            <Link href={`/${m}`} className="small">
              See all →
            </Link>
          </div>
          <div className="shelf">
            {catalog[m].map((t, i) => (
              <PosterCard key={t.id} module={m} index={i} {...t} />
            ))}
          </div>
        </section>
      ))}

      <div className="grid grid-2">
        <section className="card">
          <h3>Where you&apos;re losing marks</h3>
          {weak.length === 0 ? (
            <p className="muted small" style={{ margin: 0 }}>
              After a few Listening and Reading tests I&apos;ll show you exactly which question types are costing you, and
              how to fix them.
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
              Nothing yet. Your first result will appear here.
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
