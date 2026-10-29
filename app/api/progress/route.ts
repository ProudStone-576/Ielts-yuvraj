import { NextResponse } from "next/server";
import { mergeStores, normalise } from "@/lib/merge";
import { currentUser } from "@/lib/server/auth";
import { get, set } from "@/lib/server/db";
import type { Store } from "@/lib/types";

export const dynamic = "force-dynamic";

const MAX_BYTES = 500_000;

async function load(email: string): Promise<Store> {
  const raw = await get(`progress:${email}`);
  return { ...normalise(raw ? (JSON.parse(raw) as Store) : null), owner: email };
}

export async function GET() {
  const email = await currentUser();
  if (!email) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  return NextResponse.json(await load(email));
}

/** Merges the device's copy into the cloud copy and returns the combined result. */
export async function PUT(req: Request) {
  const email = await currentUser();
  if (!email) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const text = await req.text();
  if (text.length > MAX_BYTES) return NextResponse.json({ error: "Too large" }, { status: 413 });

  let incoming: Store;
  try {
    incoming = { ...normalise(JSON.parse(text) as Store), owner: email };
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const merged = mergeStores(await load(email), incoming);
  await set(`progress:${email}`, JSON.stringify(merged));
  return NextResponse.json(merged);
}
