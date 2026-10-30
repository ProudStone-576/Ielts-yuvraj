"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nextTest } from "@/components/CoachHome";
import { YuvrajSays } from "@/components/Yuvraj";
import type { CatalogItem } from "@/lib/catalog";
import { bandToClb, formatBand, overallBand } from "@/lib/scoring";
import { useStore } from "@/lib/storage";
import { MODULE_LABEL, type Attempt, type Module } from "@/lib/types";

/*
 * A full mock exam, like the real test morning: Listening, Reading and Writing back to back,
 * then Speaking (on the real day it can be the same day or up to a week later).
 * The plan lives on this device only: a mock is taken in one sitting.
 */

const KEY = "ielts-coach:mock";
const ORDER: Module[] = ["listening", "reading", "writing", "speaking"];
const MINUTES: Record<Module, string> = { listening: "about 30 min", reading: "60 min", writing: "60 min", speaking: "11–14 min" };

interface MockPlan {
  started: string;
  tests: Record<Module, CatalogItem>;
}

function load(): MockPlan | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "null");
  } catch {
    return null;
  }
}

function save(plan: MockPlan | null) {
  try {
    if (plan) localStorage.setItem(KEY, JSON.stringify(plan));
    else localStorage.removeItem(KEY);
  } catch {
    /* private browsing: the mock still works for this visit */
  }
}

export function MockDay({ catalog }: { catalog: Record<Module, CatalogItem[]> }) {
  const { store } = useStore();
  const [plan, setPlan] = useState<MockPlan | null>(null);
  useEffect(() => setPlan(load()), []);

  const start = () => {
    const tests = Object.fromEntries(ORDER.map((m) => [m, nextTest(store, m, catalog[m])!])) as MockPlan["tests"];
    const p = { started: new Date().toISOString(), tests };
    save(p);
    setPlan(p);
  };

  // A module is done once there is an attempt at its mock test, made after the mock started.
  const result = (m: Module): Attempt | undefined =>
    plan ? [...store.attempts].reverse().find((a) => a.module === m && a.testId === plan.tests[m].id && a.date >= plan.started) : undefined;
  const results = ORDER.map((m) => result(m));
  const next = ORDER.find((_, i) => !results[i]);
  const writtenDone = ORDER.slice(0, 3).every((_, i) => results[i]);
  const allDone = results.every(Boolean);
  const bands = results.filter((r): r is Attempt => !!r).map((r) => r.band);
  const atClb9 = ORDER.filter((m, i) => results[i] && results[i]!.band >= store.target[m]);

  return (
    <div className="stack">
      <div className="page-head module-hero">
        <div className="eyebrow">Exam rehearsal</div>
        <h1>Mock exam day</h1>
        <p>
          The real test morning, in one sitting: Listening, Reading and Writing back to back — about 2 hours 40 minutes
          with no breaks between them. Speaking comes after, on the same day or within the week. At the end you get a
          full set of CLB results.
        </p>
      </div>

      {!plan ? (
        <YuvrajSays title="before you start">
          <ul className="small" style={{ margin: 0, paddingLeft: "1.2rem" }}>
            <li>Block out three hours somewhere quiet. Use headphones for Listening.</li>
            <li>No phone, no dictionary, no pausing — treat it as the real thing.</li>
            <li>Have water nearby. On the day, there&apos;s no break between Listening, Reading and Writing either.</li>
          </ul>
          <div>
            <button className="btn primary lg" onClick={start}>
              ▶&nbsp; Start mock exam
            </button>
          </div>
        </YuvrajSays>
      ) : (
        <>
          <div className="mock-steps">
            {ORDER.map((m, i) => {
              const r = results[i];
              const isNext = m === next;
              return (
                <div key={m} className={`card mock-step tint-${m} ${r ? "done" : isNext ? "next" : ""}`}>
                  <div className="eyebrow">
                    {i + 1}. {MODULE_LABEL[m]} · {MINUTES[m]}
                  </div>
                  <b>{plan.tests[m].title}</b>
                  {r ? (
                    <div className="row small">
                      <span className="score-num" style={{ fontSize: "1.6rem" }}>
                        {formatBand(r.band)}
                      </span>
                      <span className="muted">CLB {bandToClb(m, r.band) || "<4"}</span>
                    </div>
                  ) : isNext ? (
                    <Link className="btn primary" href={`/${m}/${plan.tests[m].id}?mock=1`}>
                      Start {MODULE_LABEL[m]} →
                    </Link>
                  ) : (
                    <span className="small muted">Waiting</span>
                  )}
                </div>
              );
            })}
          </div>

          {writtenDone && (
            <YuvrajSays title={allDone ? "your mock exam result" : "written papers done"}>
              {allDone && (
                <p style={{ margin: 0, fontSize: "1.1rem" }}>
                  Overall band <b>{formatBand(overallBand(bands))}</b> · CLB 9 reached in <b>{atClb9.length} of 4</b> modules
                </p>
              )}
              <p style={{ margin: 0 }}>
                {allDone
                  ? atClb9.length === 4
                    ? "That's CLB 9 across the board, under real exam conditions. If you can do this twice more, you're ready to book."
                    : `Not yet in ${ORDER.filter((m) => !atClb9.includes(m)).map((m) => MODULE_LABEL[m]).join(" and ")}. That's where the next two weeks of practice should go — your study plan will reflect it.`
                  : "Well done — that's the hardest part of exam day. Take a break, then do the Speaking interview today or within the week, as on the real day."}
              </p>
              <div className="row">
                <Link className="btn ghost" href="/mistakes">
                  Review your mistakes
                </Link>
                {allDone && (
                  <button
                    className="btn ghost"
                    onClick={() => {
                      save(null);
                      setPlan(null);
                    }}
                  >
                    Start another mock
                  </button>
                )}
              </div>
            </YuvrajSays>
          )}
          {!allDone && (
            <button
              className="linkish small"
              onClick={() => {
                if (confirm("Abandon this mock exam? Tests you've finished stay in your progress.")) {
                  save(null);
                  setPlan(null);
                }
              }}
            >
              Abandon this mock
            </button>
          )}
        </>
      )}
    </div>
  );
}
