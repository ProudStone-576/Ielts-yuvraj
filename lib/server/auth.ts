import "server-only";

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { get, secret, set, setIfAbsent } from "./db";

const COOKIE = "ielts_session";
const ONE_YEAR = 60 * 60 * 24 * 365;

interface UserRecord {
  email: string;
  name: string;
  salt: string;
  hash: string;
  createdAt: string;
  /** Hash of the account's recovery code, which can be used once to set a new password. */
  recovery?: { salt: string; hash: string };
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

/* ---------- Recovery codes (password reset without email) ---------- */

/** No 0/O or 1/I/L, so the code is easy to copy by hand. */
const CODE_LETTERS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function cleanCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** Gives the account a new recovery code (replacing any old one) and returns it, e.g. "K7QF-3M9X-TBRW-24HP". */
export async function newRecoveryCode(email: string): Promise<string | null> {
  const raw = await get(`user:${email}`);
  if (!raw) return null;
  const user = JSON.parse(raw) as UserRecord;
  const bytes = randomBytes(16);
  const code = Array.from(bytes, (b) => CODE_LETTERS[b % CODE_LETTERS.length]).join("");
  const salt = randomBytes(16).toString("hex");
  user.recovery = { salt, hash: hashPassword(code, salt) };
  await set(`user:${email}`, JSON.stringify(user));
  return code.match(/.{4}/g)!.join("-");
}

/** Sets a new password if the recovery code is right. The code is then used up. */
export async function resetPassword(email: string, code: string, password: string): Promise<UserRecord | null> {
  const raw = await get(`user:${email}`);
  if (!raw) return null;
  const user = JSON.parse(raw) as UserRecord;
  if (!user.recovery) return null;
  const a = Buffer.from(hashPassword(cleanCode(code), user.recovery.salt), "hex");
  const b = Buffer.from(user.recovery.hash, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  user.salt = randomBytes(16).toString("hex");
  user.hash = hashPassword(password, user.salt);
  delete user.recovery;
  await set(`user:${email}`, JSON.stringify(user));
  return user;
}
