"use client";

import { useCallback, useSyncExternalStore } from "react";
import { emptyStore, mergeStores, normalise, sameData } from "./merge";
import type { Attempt, Store } from "./types";

/*
 * Progress lives in the browser (so the app is instant and works offline) and,
 * when the user is signed in, is synced to the cloud automatically after every
 * change. Signing in on another device pulls the same progress down.
 */

const KEY = "ielts-coach:v1";
const EVENT = "ielts-coach:change";

/* ---------- Local store ---------- */

let cache: Store | null = null;
let cacheRaw: string | null = null;
const SERVER_EMPTY = emptyStore();

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
    cache = raw ? normalise(JSON.parse(raw) as Store) : cache ?? emptyStore();
  } catch {
    cache = emptyStore();
  }
  return cache;
}

function write(next: Store, { sync = true } = {}) {
  cache = next;
  const raw = JSON.stringify(next);
  cacheRaw = raw;
  try {
    localStorage.setItem(KEY, raw);
  } catch {
    // Ignore quota / privacy errors; state still lives in memory this session.
  }
  window.dispatchEvent(new Event(EVENT));
  if (sync) scheduleSync();
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/* ---------- Account & cloud sync ---------- */

export type SyncStatus = "idle" | "saving" | "saved" | "offline";

export interface AuthState {
  /** "checking" until the server answers; "local" when cloud save isn't set up. */
  mode: "checking" | "local" | "signed-out" | "signed-in";
  email: string;
  name: string;
  sync: SyncStatus;
}

let auth: AuthState = { mode: "checking", email: "", name: "", sync: "idle" };
const SERVER_AUTH: AuthState = auth;
const AUTH_EVENT = "ielts-coach:auth";

function setAuth(patch: Partial<AuthState>) {
  auth = { ...auth, ...patch };
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function subscribeAuth(cb: () => void) {
  window.addEventListener(AUTH_EVENT, cb);
  return () => window.removeEventListener(AUTH_EVENT, cb);
}

let timer: ReturnType<typeof setTimeout> | undefined;
let inFlight = false;
let again = false;

function scheduleSync() {
  if (auth.mode !== "signed-in") return;
  setAuth({ sync: "saving" });
  clearTimeout(timer);
  timer = setTimeout(pushNow, 800);
}

async function pushNow() {
  if (auth.mode !== "signed-in") return;
  if (inFlight) {
    again = true;
    return;
  }
  inFlight = true;
  try {
    const res = await fetch("/api/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(read()),
    });
    if (res.status === 401) {
      setAuth({ mode: "signed-out", sync: "idle" });
      return;
    }
    if (!res.ok) throw new Error(String(res.status));
    const merged = normalise((await res.json()) as Store);
    // Keep anything changed locally while the request was in flight.
    const combined = mergeStores(merged, read());
    if (!sameData(combined, read())) write(combined, { sync: false });
    setAuth({ sync: "saved" });
  } catch {
    setAuth({ sync: "offline" });
    clearTimeout(timer);
    timer = setTimeout(pushNow, 15_000);
  } finally {
    inFlight = false;
    if (again) {
      again = false;
      pushNow();
    }
  }
}

/** Loads the cloud copy after signing in and combines it with this device's data. */
async function pullAndMerge(email: string) {
  const local = read();
  const res = await fetch("/api/progress", { cache: "no-store" });
  if (!res.ok) throw new Error(String(res.status));
  const cloud = normalise((await res.json()) as Store);
  // Data on this device that belongs to someone else (shared computer) is not merged.
  const mine = !local.owner || local.owner === email ? local : emptyStore(email);
  write({ ...mergeStores(cloud, mine), owner: email }, { sync: false });
  await pushNow();
}

let started = false;

/** Checks the session once when the app opens. */
export async function initAuth() {
  if (started) return;
  started = true;
  try {
    const res = await fetch("/api/me", { cache: "no-store" });
    const data = (await res.json()) as { cloud: boolean; user?: { email: string; name: string } | null };
    if (!data.cloud) return setAuth({ mode: "local" });
    if (!data.user) return setAuth({ mode: "signed-out" });
    setAuth({ mode: "signed-in", email: data.user.email, name: data.user.name, sync: "saving" });
    await pullAndMerge(data.user.email);
  } catch {
    // Offline: keep using this device's copy; sync resumes on the next change.
    const local = read();
    setAuth(local.owner ? { mode: "signed-in", email: local.owner, sync: "offline" } : { mode: "local" });
  }
  window.addEventListener("online", () => scheduleSync());
}

/**
 * Signs in, creates an account, or resets a forgotten password with a recovery code.
 * Returns the account's new recovery code when the server issued one (sign-up and reset).
 */
export async function signIn(
  kind: "login" | "signup" | "reset",
  fields: { email: string; password: string; name?: string; code?: string },
): Promise<string | undefined> {
  const res = await fetch(`/api/auth/${kind}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  const data = (await res.json()) as { email?: string; name?: string; error?: string; recoveryCode?: string };
  if (!res.ok || !data.email) throw new Error(data.error ?? "Something went wrong. Please try again.");
  setAuth({ mode: "signed-in", email: data.email, name: data.name ?? "", sync: "saving" });
  if (kind === "signup" && fields.name && !read().name) write({ ...read(), name: fields.name, updatedAt: Date.now() }, { sync: false });
  await pullAndMerge(data.email);
  return data.recoveryCode;
}

export async function signOut() {
  await pushNow().catch(() => {});
  await fetch("/api/auth/logout", { method: "POST" });
  write(emptyStore(), { sync: false });
  setAuth({ mode: "signed-out", email: "", name: "", sync: "idle" });
}

export function useAuth(): AuthState {
  return useSyncExternalStore(subscribeAuth, () => auth, () => SERVER_AUTH);
}

/* ---------- Hook used by every page ---------- */

export function useStore() {
  const store = useSyncExternalStore(subscribe, read, () => SERVER_EMPTY);

  const update = useCallback((fn: (s: Store) => Store) => write({ ...fn(read()), updatedAt: Date.now() }), []);

  const addAttempt = useCallback(
    (a: Omit<Attempt, "id" | "date">) => {
      const attempt: Attempt = { ...a, id: crypto.randomUUID(), date: new Date().toISOString() };
      update((s) => ({ ...s, attempts: [...s.attempts, attempt] }));
      return attempt;
    },
    [update],
  );

  const deleteAttempt = useCallback(
    (id: string) =>
      update((s) => ({ ...s, attempts: s.attempts.filter((x) => x.id !== id), deleted: [...s.deleted, id] })),
    [update],
  );

  const setDraft = useCallback(
    (key: string, value: string) => update((s) => ({ ...s, drafts: { ...s.drafts, [key]: value } })),
    [update],
  );

  return { store, update, addAttempt, deleteAttempt, setDraft };
}

/* ---------- Backup (only offered when cloud save isn't available) ---------- */

export function exportBackup(): string {
  return JSON.stringify(read(), null, 2);
}

export function importBackup(json: string): void {
  const data = JSON.parse(json) as Store;
  if (data?.version !== 1 || !Array.isArray(data.attempts)) {
    throw new Error("This file is not an IELTS Coach backup.");
  }
  write(mergeStores(read(), { ...normalise(data), updatedAt: Date.now() }));
}

export function resetAll(): void {
  const s = read();
  write({ ...emptyStore(s.owner), deleted: [...s.deleted, ...s.attempts.map((a) => a.id)], updatedAt: Date.now() });
}
