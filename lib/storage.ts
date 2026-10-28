"use client";

import { useCallback, useSyncExternalStore } from "react";
import { CLB9_TARGET } from "./scoring";
import type { Attempt, Store } from "./types";

const KEY = "ielts-coach:v1";
const EVENT = "ielts-coach:change";

const EMPTY: Store = {
  version: 1,
  name: "",
  examDate: "",
  target: { ...CLB9_TARGET },
  attempts: [],
  drafts: {},
};

let cache: Store | null = null;
let cacheRaw: string | null = null;

function read(): Store {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // Storage blocked (private mode etc.) – fall back to in-memory state.
  }
  if (cache && raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    cache = raw ? { ...EMPTY, ...(JSON.parse(raw) as Store) } : cache ?? { ...EMPTY };
  } catch {
    cache = { ...EMPTY };
  }
  return cache;
}

function write(next: Store) {
  cache = next;
  const raw = JSON.stringify(next);
  cacheRaw = raw;
  try {
    localStorage.setItem(KEY, raw);
  } catch {
    // Ignore quota / privacy errors; state still lives in memory this session.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useStore() {
  const store = useSyncExternalStore(subscribe, read, () => EMPTY);

  const update = useCallback((fn: (s: Store) => Store) => write(fn(read())), []);

  const addAttempt = useCallback(
    (a: Omit<Attempt, "id" | "date">) =>
      update((s) => ({
        ...s,
        attempts: [
          ...s.attempts,
          { ...a, id: crypto.randomUUID(), date: new Date().toISOString() },
        ],
      })),
    [update],
  );

  const setDraft = useCallback(
    (key: string, value: string) =>
      update((s) => ({ ...s, drafts: { ...s.drafts, [key]: value } })),
    [update],
  );

  return { store, update, addAttempt, setDraft };
}

export function exportBackup(): string {
  return JSON.stringify(read(), null, 2);
}

export function importBackup(json: string): void {
  const data = JSON.parse(json) as Store;
  if (data?.version !== 1 || !Array.isArray(data.attempts)) {
    throw new Error("This file is not an IELTS Coach backup.");
  }
  write({ ...EMPTY, ...data });
}

export function resetAll(): void {
  write({ ...EMPTY, target: { ...CLB9_TARGET } });
}
