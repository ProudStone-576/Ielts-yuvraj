import "server-only";

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { get, secret, setIfAbsent } from "./db";

const COOKIE = "ielts_session";
const ONE_YEAR = 60 * 60 * 24 * 365;

interface UserRecord {
  email: string;
  name: string;
  salt: string;
  hash: string;
  createdAt: string;
}

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export async function createUser(email: string, name: string, password: string): Promise<boolean> {
  const salt = randomBytes(16).toString("hex");
  const record: UserRecord = {
    email,
    name,
    salt,
    hash: hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };
  return setIfAbsent(`user:${email}`, JSON.stringify(record));
}

export async function checkPassword(email: string, password: string): Promise<UserRecord | null> {
  const raw = await get(`user:${email}`);
  if (!raw) return null;
  const user = JSON.parse(raw) as UserRecord;
  const a = Buffer.from(hashPassword(password, user.salt), "hex");
  const b = Buffer.from(user.hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b) ? user : null;
}

export async function startSession(email: string): Promise<void> {
  const expires = Math.floor(Date.now() / 1000) + ONE_YEAR;
  const payload = `${Buffer.from(email).toString("base64url")}.${expires}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/** Returns the signed-in user's email, or null. */
export async function currentUser(): Promise<string | null> {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return null;
  const [emailPart, expires, sig] = value.split(".");
  if (!emailPart || !expires || !sig) return null;
  const expected = sign(`${emailPart}.${expires}`);
  if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  if (Number(expires) < Date.now() / 1000) return null;
  return Buffer.from(emailPart, "base64url").toString();
}

export async function userName(email: string): Promise<string> {
  const raw = await get(`user:${email}`);
  return raw ? (JSON.parse(raw) as UserRecord).name : "";
}
