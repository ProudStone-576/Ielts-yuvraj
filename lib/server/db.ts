import "server-only";

/**
 * Tiny key-value store. In production it uses Upstash Redis (added from the
 * Vercel dashboard: Storage → Upstash for Redis), talking to its REST API.
 * During local development without Redis it falls back to memory.
 */

const URL_ = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const memory: Map<string, string> =
  ((globalThis as Record<string, unknown>).__ieltsMemoryDb as Map<string, string>) ??
  ((globalThis as Record<string, unknown>).__ieltsMemoryDb = new Map<string, string>());

const useMemory = !URL_ && process.env.NODE_ENV !== "production";

export function cloudEnabled(): boolean {
  return Boolean(URL_ && TOKEN) || useMemory;
}

/** Secret for signing sessions; derived from the DB token unless AUTH_SECRET is set. */
export function secret(): string {
  return process.env.AUTH_SECRET ?? TOKEN ?? "local-development-secret";
}

async function command<T>(args: (string | number)[]): Promise<T> {
  const res = await fetch(URL_!, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  const data = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || data.error) throw new Error(data.error ?? `Database error ${res.status}`);
  return data.result as T;
}

export async function get(key: string): Promise<string | null> {
  if (useMemory) return memory.get(key) ?? null;
  return command<string | null>(["GET", key]);
}

export async function set(key: string, value: string): Promise<void> {
  if (useMemory) {
    memory.set(key, value);
    return;
  }
  await command(["SET", key, value]);
}

/** Sets the key only if it doesn't exist. Returns false if it already existed. */
export async function setIfAbsent(key: string, value: string): Promise<boolean> {
  if (useMemory) {
    if (memory.has(key)) return false;
    memory.set(key, value);
    return true;
  }
  return (await command<string | null>(["SET", key, value, "NX"])) === "OK";
}
