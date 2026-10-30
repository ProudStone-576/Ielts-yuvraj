"use client";

import { useEffect, useState } from "react";
import { COACH_NAME, YuvrajAvatar } from "@/components/Yuvraj";
import { initAuth, signIn, useAuth } from "@/lib/storage";

/** Shows the sign-in screen until the user is signed in (when cloud save is available). */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  // A recovery code to show once, straight after signing up or resetting a password.
  const [code, setCode] = useState<string | null>(null);
  useEffect(() => {
    initAuth();
  }, []);

  if (auth.mode === "checking") {
    return <div className="center-screen muted">Yuvraj is getting ready…</div>;
  }
  if (code) return <RecoveryCode code={code} onDone={() => setCode(null)} />;
  if (auth.mode === "signed-out") return <SignIn onCode={setCode} />;
  return <>{children}</>;
}

/** Shows a recovery code full-screen until the user confirms they have saved it. */
export function RecoveryCode({ code, onDone }: { code: string; onDone: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="auth-wrap">
      <div className="auth-glow" aria-hidden />
      <div className="card auth-card stack">
        <YuvrajAvatar size={56} />
        <h1 className="auth-title">Save your recovery code</h1>
        <p className="muted" style={{ margin: 0 }}>
          If you ever forget your password, this code lets you set a new one — there&apos;s no email reset. Take a
          screenshot or write it down somewhere safe. Each code works once.
        </p>
        <div className="recovery-code">{code}</div>
        <button
          className="btn ghost"
          style={{ justifyContent: "center" }}
          onClick={() => navigator.clipboard?.writeText(code).then(() => setCopied(true), () => {})}
        >
          {copied ? "Copied ✓" : "Copy code"}
        </button>
        <button className="btn primary" style={{ justifyContent: "center" }} onClick={onDone}>
          I&apos;ve saved it — continue
        </button>
      </div>
    </div>
  );
}

function SignIn({ onCode }: { onCode: (code: string) => void }) {
  const [kind, setKind] = useState<"signup" | "login" | "reset">("signup");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const fresh = await signIn(kind, { email, password, name, code });
      if (fresh) onCode(fresh);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-glow" aria-hidden />
      <div className="card auth-card stack">
        <div>
          <YuvrajAvatar size={72} />
          <div className="eyebrow" style={{ marginTop: "1rem" }}>
            IELTS General Training · CLB 9
          </div>
          <h1 className="auth-title">
            {kind === "signup" ? `Meet ${COACH_NAME}, your coach.` : kind === "reset" ? "Set a new password." : "Welcome back."}
          </h1>
          <p className="muted">
            {kind === "signup"
              ? "Real exam practice in all four modules, a plan to exam day, and a coach who keeps you honest. Your progress saves automatically on every device."
              : kind === "reset"
                ? "Enter your email, the recovery code you saved when you signed up, and a new password."
                : "Sign in and pick up exactly where you left off."}
          </p>
        </div>
        <form className="stack" onSubmit={submit}>
          {kind === "signup" && (
            <label className="field">
              <span>First name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="given-name" />
            </label>
          )}
          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          {kind === "reset" && (
            <label className="field">
              <span>Recovery code</span>
              <input value={code} onChange={(e) => setCode(e.target.value)} required placeholder="XXXX-XXXX-XXXX-XXXX" autoComplete="off" autoCapitalize="characters" />
            </label>
          )}
          <label className="field">
            <span>{kind === "reset" ? "New password" : "Password"}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={kind === "login" ? "current-password" : "new-password"}
            />
            {kind === "signup" && <small className="muted">At least 6 characters. Write it down somewhere safe.</small>}
          </label>
          {error && <div className="notice">{error}</div>}
          <button className="btn primary" disabled={busy} style={{ justifyContent: "center" }}>
            {busy ? "Please wait…" : kind === "signup" ? "Create account" : kind === "reset" ? "Set new password" : "Sign in"}
          </button>
        </form>
        {kind === "login" && (
          <p className="small" style={{ margin: 0, textAlign: "center" }}>
            <button
              className="linkish"
              onClick={() => {
                setKind("reset");
                setError("");
              }}
            >
              Forgot your password?
            </button>
          </p>
        )}
        <p className="small" style={{ margin: 0, textAlign: "center" }}>
          {kind === "signup" ? "Already have an account? " : kind === "reset" ? "Remembered it? " : "New here? "}
          <button
            className="linkish"
            onClick={() => {
              setKind(kind === "login" ? "signup" : "login");
              setError("");
            }}
          >
            {kind === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
