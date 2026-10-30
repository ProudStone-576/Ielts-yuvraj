import { NextResponse } from "next/server";
import { createUser, newRecoveryCode, normaliseEmail, startSession } from "@/lib/server/auth";
import { cloudEnabled } from "@/lib/server/db";

export async function POST(req: Request) {
  if (!cloudEnabled()) return NextResponse.json({ error: "Cloud save is not set up yet." }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as { email?: string; name?: string; password?: string };
  const email = normaliseEmail(body.email ?? "");
  const name = (body.name ?? "").trim().slice(0, 40);
  const password = body.password ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }
  if (!(await createUser(email, name, password))) {
    return NextResponse.json({ error: "An account with this email already exists. Try signing in." }, { status: 409 });
  }
  await startSession(email);
  return NextResponse.json({ email, name, recoveryCode: await newRecoveryCode(email) });
}
