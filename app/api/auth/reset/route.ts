import { NextResponse } from "next/server";
import { newRecoveryCode, normaliseEmail, resetPassword, startSession } from "@/lib/server/auth";
import { cloudEnabled } from "@/lib/server/db";

/** Forgotten password: email + recovery code + new password. Signs in and issues a fresh recovery code. */
export async function POST(req: Request) {
  if (!cloudEnabled()) return NextResponse.json({ error: "Cloud save is not set up yet." }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as { email?: string; code?: string; password?: string };
  const email = normaliseEmail(body.email ?? "");
  const password = body.password ?? "";
  if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  const user = await resetPassword(email, body.code ?? "", password);
  if (!user) return NextResponse.json({ error: "That email and recovery code don't match." }, { status: 401 });
  await startSession(email);
  return NextResponse.json({ email, name: user.name, recoveryCode: await newRecoveryCode(email) });
}
