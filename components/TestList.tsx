"use client";

import Link from "next/link";
import type { CatalogItem } from "@/lib/catalog";
import { formatBand } from "@/lib/scoring";
import { useStore } from "@/lib/storage";
import { MODULE_LABEL, type Module } from "@/lib/types";

/** "Listening — Test 2" → "Test 2" (the module is already on the poster). */
function shortTitle(title: string): string {
  return title.split(" — ").at(-1) ?? title;
}

/** A test as a poster tile: big number, title, what's inside and the best band so far. */
export function PosterCard({ module, id, index, title, subtitle }: { module: Module; index: number } & CatalogItem) {
  const { store } = useStore();
  const tries = store.attempts.filter((a) => a.module === module && a.testId === id);
  const best = tries.length ? Math.max(...tries.map((a) => a.band)) : undefined;
  return (
    <Link href={`/${module}/${id}`} className={`poster tint-${module}`}>
      <div className="poster-art">
        <span className="poster-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="poster-mod">{MODULE_LABEL[module]}</span>
        {best === undefined ? (
          <span className="poster-badge new">New</span>
        ) : (
          <span className={`poster-badge ${best >= store.target[module] ? "good" : ""}`}>Best {formatBand(best)}</span>
        )}
        <span className="poster-play" aria-hidden>
          ▶
        </span>
      </div>
      <div className="poster-meta">
        <b>{shortTitle(title)}</b>
        {subtitle && <span className="poster-sub">{subtitle}</span>}
        <span className="poster-sub">{tries.length ? `Taken ${tries.length}×` : "Not taken yet"}</span>
      </div>
    </Link>
  );
}

/** Every test in a module as a grid of posters. */
export function TestList({ module, tests }: { module: Module; tests: CatalogItem[] }) {
  return (
    <div className="poster-grid">
      {tests.map((t, i) => (
        <PosterCard key={t.id} module={module} index={i} {...t} />
      ))}
    </div>
  );
}
