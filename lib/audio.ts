"use client";

import { getVolume, type Playback } from "./speech";

/** One shared audio element: once a tap has started it, browsers (iPhone too) let it keep playing. */
let el: HTMLAudioElement | null = null;

function audio(): HTMLAudioElement {
  if (!el) {
    el = new Audio();
    el.preload = "auto";
  }
  return el;
}

/** A moment of silence (WAV) used to unlock audio from the Start tap. */
const SILENCE = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=";

export function unlockAudio() {
  const a = audio();
  a.src = SILENCE;
  a.play().catch(() => {});
}

export function setAudioVolume(v: number) {
  if (el) el.volume = v;
}

/**
 * Plays a recorded clip from `from` seconds. `onTime` reports the position while playing.
 * Resolves `done` with false if the clip could not be played (so the caller can fall back to speech).
 */
export function playClip(src: string, from = 0, onTime?: (t: number) => void): Playback & { ok: Promise<boolean> } {
  const a = audio();
  let finished = false;
  let resolveOk: (ok: boolean) => void = () => {};
  const ok = new Promise<boolean>((r) => (resolveOk = r));
  let watchdog: ReturnType<typeof setTimeout> | undefined;

  const finish = (success: boolean) => {
    if (finished) return;
    finished = true;
    clearTimeout(watchdog);
    a.onended = a.onerror = a.ontimeupdate = a.onloadedmetadata = null;
    resolveOk(success);
  };
  // If the browser never reports the end (a stalled download, a sleeping tab), move on anyway.
  const arm = () => {
    clearTimeout(watchdog);
    if (Number.isFinite(a.duration)) watchdog = setTimeout(() => finish(true), (a.duration - a.currentTime + 8) * 1000);
  };

  a.onended = () => finish(true);
  a.onerror = () => finish(false);
  a.onloadedmetadata = () => {
    if (from) a.currentTime = from;
    arm();
  };
  a.ontimeupdate = () => onTime?.(a.currentTime);
  a.volume = getVolume();
  a.src = src;
  a.play().then(arm, () => finish(false));

  return {
    ok,
    done: ok.then(() => {}),
    stop: () => {
      a.pause();
      finish(true);
    },
  };
}
