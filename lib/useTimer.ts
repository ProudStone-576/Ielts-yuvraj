"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Countdown timer in seconds. Calls onExpire once when it reaches zero while running.
 * Changing `resetKey` (e.g. the current question) restarts it from `seconds`.
 */
export function useCountdown(
  seconds: number,
  running: boolean,
  onExpire?: () => void,
  resetKey: string | number = seconds,
) {
  const [state, setState] = useState({ left: seconds, key: resetKey });
  let current = state;
  if (state.key !== resetKey) {
    // Restart for the new key during render so no stale "0" is ever seen.
    current = { left: seconds, key: resetKey };
    setState(current);
  }

  const expire = useRef(onExpire);
  expire.current = onExpire;
  const fired = useRef<string | number | null>(null);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setState((s) => ({ ...s, left: Math.max(0, s.left - 1) })), 1000);
    return () => clearInterval(t);
  }, [running, resetKey]);

  useEffect(() => {
    if (running && current.left === 0 && fired.current !== current.key) {
      fired.current = current.key;
      expire.current?.();
    }
  }, [running, current.left, current.key]);

  const setLeft = (n: number) => setState((s) => ({ ...s, left: n }));
  return [current.left, setLeft] as const;
}

export function formatClock(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
