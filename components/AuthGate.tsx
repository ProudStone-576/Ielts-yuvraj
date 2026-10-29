"use client";

import { useEffect, useState } from "react";
import { initAuth, signIn, useAuth } from "@/lib/storage";

/** Shows the sign-in screen until the user is signed in (when cloud save is available). */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  useEffect(() => {
    initAuth();
  }, []);

  if (auth.mode === "checking") {
    return <div className="center-screen muted">Loading your coach…</div>;
  }
  if (auth.mode === "signed-out") return <SignIn />;
  return <>{children}</>;
}

function SignIn() {
  const [kind, setKind] = useState<"signup" | "login">("signup");
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
      await signIn(kind, { email, password, name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card stack">
        <div>
          <div className="coach-avatar lg">IC</div>
          <h1 style={{ marginTop: "0.75rem" }}>{kind === "signup" ? "Meet your IELTS coach" : "Welcome back"}</h1>
          <p className="muted">
            {kind === "signup"
              ? "Create an account so your progress is saved automatically and follows you to any device."
              : "Sign in to continue where you left off."}
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
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={kind === "signup" ? "new-password" : "current-password"}
            />
            {kind === "signup" && <small className="muted">At least 6 characters. Write it down somewhere safe.</small>}
          </label>
          {error && <div className="notice">{error}</div>}
          <button className="btn primary" disabled={busy} style={{ justifyContent: "center" }}>
            {busy ? "Please wait…" : kind === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>
        <p className="small" style={{ margin: 0, textAlign: "center" }}>
          {kind === "signup" ? "Already have an account? " : "New here? "}
          <button
            className="linkish"
            onClick={() => {
              setKind(kind === "signup" ? "login" : "signup");
              setError("");
            }}
          >
            {kind === "signup" ? "Sign in" : "Create an account"}
          </button>
        </p>
      </div>
    </div>
  );
}
