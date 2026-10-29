"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Countdown timer in seconds. Calls onExpire once when it reaches zero while running.
 * It restarts from `seconds` whenever `seconds` or `resetKey` (e.g. the current question) changes.
 */
export function useCountdown(
  seconds: number,
  running: boolean,
  onExpire?: () => void,
  resetKey: string | number = 0,
) {
  const [state, setState] = useState({ left: seconds, secs: seconds, key: resetKey, gen: 0 });
  let current = state;
  if (state.key !== resetKey || state.secs !== seconds) {
    // Restart during render so a stale "0" from the previous countdown is never seen.
    current = { left: seconds, secs: seconds, key: resetKey, gen: state.gen + 1 };
    setState(current);
  }

  const expire = useRef(onExpire);
  expire.current = onExpire;
  const fired = useRef(-1);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setState((s) => ({ ...s, left: Math.max(0, s.left - 1) })), 1000);
    return () => clearInterval(t);
  }, [running, current.gen]);

  useEffect(() => {
    if (running && current.left === 0 && fired.current !== current.gen) {
      fired.current = current.gen;
      expire.current?.();
    }
  }, [running, current.left, current.gen]);

  const setLeft = (n: number) => setState((s) => ({ ...s, left: n }));
  return [current.left, setLeft] as const;
}

export function formatClock(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
