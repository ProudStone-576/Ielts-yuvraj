"use client";

import { useEffect, useRef, useState } from "react";

/** Countdown timer in seconds. Calls onExpire once when it reaches zero while running. */
export function useCountdown(seconds: number, running: boolean, onExpire?: () => void) {
  const [left, setLeft] = useState(seconds);
  const expire = useRef(onExpire);
  expire.current = onExpire;

  useEffect(() => setLeft(seconds), [seconds]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (running && left === 0) expire.current?.();
  }, [running, left]);

  return [left, setLeft] as const;
}

export function formatClock(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
