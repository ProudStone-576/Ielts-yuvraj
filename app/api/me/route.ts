import { NextResponse } from "next/server";
import { currentUser, userName } from "@/lib/server/auth";
import { cloudEnabled } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!cloudEnabled()) return NextResponse.json({ cloud: false });
  const email = await currentUser();
  if (!email) return NextResponse.json({ cloud: true, user: null });
  return NextResponse.json({ cloud: true, user: { email, name: await userName(email) } });
}
