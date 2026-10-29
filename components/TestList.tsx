"use client";

import Link from "next/link";
import { formatBand } from "@/lib/scoring";
import { useStore } from "@/lib/storage";
import type { Module } from "@/lib/types";

export interface TestCard {
  id: string;
  title: string;
  description: string;
}

/** Test cards showing whether each test has been taken and the best band. */
export function TestList({ module, tests }: { module: Module; tests: TestCard[] }) {
  const { store } = useStore();
  return (
    <div className="grid grid-2">
      {tests.map((t) => {
        const tries = store.attempts.filter((a) => a.module === module && a.testId === t.id);
        const best = tries.length ? Math.max(...tries.map((a) => a.band)) : undefined;
        return (
          <Link key={t.id} href={`/${module}/${t.id}`} className="card test-card">
            <div className="row">
              <h3 style={{ margin: 0 }}>{t.title}</h3>
              <div className="spacer" />
              {best === undefined ? (
                <span className="badge accent">New</span>
              ) : (
                <span className={`badge ${best >= store.target[module] ? "good" : "warn"}`}>Best {formatBand(best)}</span>
              )}
            </div>
            <p className="small muted" style={{ margin: "0.4rem 0 0" }}>
              {t.description}
            </p>
            <div className="small" style={{ marginTop: "0.6rem", color: "var(--accent)" }}>
              {tries.length ? `Taken ${tries.length}× · Retake →` : "Start test →"}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
