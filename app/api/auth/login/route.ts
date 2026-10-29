import { NextResponse } from "next/server";
import { checkPassword, normaliseEmail, startSession } from "@/lib/server/auth";
import { cloudEnabled } from "@/lib/server/db";

export async function POST(req: Request) {
  if (!cloudEnabled()) return NextResponse.json({ error: "Cloud save is not set up yet." }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  const user = await checkPassword(normaliseEmail(body.email ?? ""), body.password ?? "");
  if (!user) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  await startSession(user.email);
  return NextResponse.json({ email: user.email, name: user.name });
}
