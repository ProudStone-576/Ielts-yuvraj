"use client";

import Link from "next/link";
import { DRILL_SETS } from "@/content/drills";
import { useStore } from "@/lib/storage";

/** The drill sets as cards, with each one's best score so far. */
export function DrillList() {
  const { store } = useStore();
  return (
    <div className="poster-grid">
      {DRILL_SETS.map((d, i) => {
        const r = store.drills[d.id];
        return (
          <Link key={d.id} href={`/drills/${d.id}`} className="poster tint-listening">
            <div className="poster-art">
              <span className="poster-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="poster-mod">Drill · 5 min</span>
              {r ? (
                <span className={`poster-badge ${r.best === r.total ? "good" : ""}`}>
                  Best {r.best}/{r.total}
                </span>
              ) : (
                <span className="poster-badge new">New</span>
              )}
              <span className="poster-play" aria-hidden>
                ▶
              </span>
            </div>
            <div className="poster-meta">
              <b>{d.title}</b>
              <span className="poster-sub">{d.intro}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
