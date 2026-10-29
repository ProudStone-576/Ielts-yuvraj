import "server-only";

import { neon } from "@neondatabase/serverless";

/**
 * Tiny key-value store for accounts and progress. It works with whichever
 * database is connected to the project in Vercel (Storage tab):
 *  - Upstash for Redis  (KV_REST_API_URL / KV_REST_API_TOKEN)
 *  - Neon Postgres      (DATABASE_URL / POSTGRES_URL)
 * During local development without either, it falls back to memory.
 */

const REDIS_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const PG_URL = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

type Backend = "redis" | "postgres" | "memory" | "none";

const backend: Backend =
  REDIS_URL && REDIS_TOKEN
    ? "redis"
    : PG_URL
      ? "postgres"
      : process.env.NODE_ENV !== "production"
        ? "memory"
        : "none";

export function cloudEnabled(): boolean {
  return backend !== "none";
}

/** Secret for signing sessions; derived from the database credentials unless AUTH_SECRET is set. */
export function secret(): string {
  return process.env.AUTH_SECRET ?? REDIS_TOKEN ?? PG_URL ?? "local-development-secret";
}

/* ---------- Memory (local development) ---------- */

const memory: Map<string, string> =
  ((globalThis as Record<string, unknown>).__ieltsMemoryDb as Map<string, string>) ??
  ((globalThis as Record<string, unknown>).__ieltsMemoryDb = new Map<string, string>());

/* ---------- Upstash Redis (REST API) ---------- */

async function redis<T>(args: (string | number)[]): Promise<T> {
  const res = await fetch(REDIS_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  const data = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || data.error) throw new Error(data.error ?? `Database error ${res.status}`);
  return data.result as T;
}

/* ---------- Neon Postgres ---------- */

const sql = backend === "postgres" ? neon(PG_URL!) : null;
let tableReady: Promise<unknown> | null = null;

function pg() {
  tableReady ??= sql!.query(
    "CREATE TABLE IF NOT EXISTS ielts_kv (key text PRIMARY KEY, value text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())",
  );
  return tableReady.then(() => sql!);
}

/* ---------- Public API ---------- */

export async function get(key: string): Promise<string | null> {
  switch (backend) {
    case "redis":
      return redis<string | null>(["GET", key]);
    case "postgres": {
      const rows = (await (await pg()).query("SELECT value FROM ielts_kv WHERE key = $1", [key])) as { value: string }[];
      return rows[0]?.value ?? null;
    }
    default:
      return memory.get(key) ?? null;
  }
}

export async function set(key: string, value: string): Promise<void> {
  switch (backend) {
    case "redis":
      await redis(["SET", key, value]);
      return;
    case "postgres":
      await (await pg()).query(
        "INSERT INTO ielts_kv (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()",
        [key, value],
      );
      return;
    default:
      memory.set(key, value);
  }
}

/** Sets the key only if it doesn't exist. Returns false if it already existed. */
export async function setIfAbsent(key: string, value: string): Promise<boolean> {
  switch (backend) {
    case "redis":
      return (await redis<string | null>(["SET", key, value, "NX"])) === "OK";
    case "postgres": {
      const rows = (await (await pg()).query(
        "INSERT INTO ielts_kv (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING RETURNING key",
        [key, value],
      )) as unknown[];
      return rows.length === 1;
    }
    default:
      if (memory.has(key)) return false;
      memory.set(key, value);
      return true;
  }
}
