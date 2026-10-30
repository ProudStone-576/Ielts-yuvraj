import { CLB9_TARGET } from "./scoring";
import type { Store } from "./types";

export function emptyStore(owner = ""): Store {
  return {
    version: 1,
    owner,
    updatedAt: 0,
    name: "",
    examDate: "",
    target: { ...CLB9_TARGET },
    attempts: [],
    deleted: [],
    drafts: {},
    drills: {},
    mastered: [],
  };
}

/** Fills in fields missing from data saved by older versions of the app. */
export function normalise(data: Partial<Store> | null | undefined): Store {
  const base = emptyStore();
  if (!data || typeof data !== "object") return base;
  return {
    ...base,
    ...data,
    target: { ...base.target, ...(data.target ?? {}) },
    attempts: Array.isArray(data.attempts) ? data.attempts : [],
    deleted: Array.isArray(data.deleted) ? data.deleted : [],
    drafts: data.drafts && typeof data.drafts === "object" ? data.drafts : {},
    drills: data.drills && typeof data.drills === "object" ? data.drills : {},
    mastered: Array.isArray(data.mastered) ? data.mastered : [],
  };
}

/**
 * Combines two copies of the progress (e.g. phone and laptop).
 * Test attempts are never lost: both sides' attempts are kept unless one side
 * deleted them. Settings and drafts come from whichever copy changed last.
 */
export function mergeStores(a: Store, b: Store): Store {
  const newer = b.updatedAt >= a.updatedAt ? b : a;
  const older = newer === b ? a : b;
  const deleted = [...new Set([...a.deleted, ...b.deleted])];
  const gone = new Set(deleted);
  const byId = new Map<string, Store["attempts"][number]>();
  for (const at of [...a.attempts, ...b.attempts]) if (!gone.has(at.id)) byId.set(at.id, at);
  const attempts = [...byId.values()].sort((x, y) => x.date.localeCompare(y.date));

  return {
    ...newer,
    owner: a.owner || b.owner,
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
    attempts,
    deleted,
    drafts: { ...older.drafts, ...newer.drafts },
    drills: mergeDrills(older.drills, newer.drills),
    mastered: [...new Set([...a.mastered, ...b.mastered])],
  };
}

/** Keeps the best score from either copy, and the most recent attempt. */
function mergeDrills(older: Store["drills"], newer: Store["drills"]): Store["drills"] {
  const out = { ...older };
  for (const [id, r] of Object.entries(newer)) {
    const o = out[id];
    out[id] = o ? { ...(r.date >= o.date ? r : o), best: Math.max(o.best, r.best) } : r;
  }
  return out;
}

export function sameData(a: Store, b: Store): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
