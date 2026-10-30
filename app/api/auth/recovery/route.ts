import { NextResponse } from "next/server";
import { currentUser, newRecoveryCode } from "@/lib/server/auth";

/** A new recovery code for the signed-in account (for accounts made before codes existed, or a lost code). */
export async function POST() {
  const email = await currentUser();
  if (!email) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  return NextResponse.json({ recoveryCode: await newRecoveryCode(email) });
}
