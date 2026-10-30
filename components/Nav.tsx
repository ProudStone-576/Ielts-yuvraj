"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut, useAuth } from "@/lib/storage";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/plan", label: "Study plan" },
  { href: "/listening", label: "Listening" },
  { href: "/drills", label: "Drills" },
  { href: "/reading", label: "Reading" },
  { href: "/writing", label: "Writing" },
  { href: "/speaking", label: "Speaking" },
  { href: "/mistakes", label: "Mistakes" },
  { href: "/progress", label: "Progress" },
];

const SYNC_LABEL = {
  idle: "",
  saving: "Saving…",
  saved: "Saved ✓",
  offline: "Offline — will sync later",
} as const;

export function Nav() {
  const path = usePathname();
  const auth = useAuth();
  const [menu, setMenu] = useState(false);

  // The exam screens use their own full-screen header, like the real test.
  if (path.split("/").length > 2 && /^\/(listening|reading|writing|speaking)\//.test(path)) return null;

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand">
          IELTS<span>COACH</span>
        </Link>
        <nav className="nav">
          {LINKS.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={active ? "active" : undefined}>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="spacer" />
        {auth.mode === "signed-in" && (
          <div className="account">
            <span className={`sync ${auth.sync}`}>{SYNC_LABEL[auth.sync]}</span>
            <button className="avatar-btn" onClick={() => setMenu(!menu)} aria-label="Account">
              {(auth.name || auth.email).slice(0, 1).toUpperCase()}
            </button>
            {menu && (
              <div className="menu card" onMouseLeave={() => setMenu(false)}>
                <div className="small muted">Signed in as</div>
                <div className="small" style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                  {auth.email}
                </div>
                <button className="btn" style={{ width: "100%" }} onClick={() => signOut()}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
