"use client";

import type { ScriptLine } from "./types";

export interface VoiceStyle {
  lang: string;
  pitch: number;
  rate?: number;
}

let volume = 1;

export function setVolume(v: number) {
  volume = Math.max(0, Math.min(1, v));
}

export function getVolume() {
  return volume;
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const v = speechSynthesis.getVoices();
    if (v.length) return resolve(v);
    const done = () => resolve(speechSynthesis.getVoices());
    speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    setTimeout(done, 1500);
  });
}

/** Picks a different English voice per speaker where the device has several. */
function pickVoice(voices: SpeechSynthesisVoice[], style: VoiceStyle, index: number) {
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const exact = english.filter((v) => v.lang.toLowerCase().replace("_", "-") === style.lang.toLowerCase());
  const pool = exact.length ? exact : english;
  return pool.length ? pool[index % pool.length] : undefined;
}

/** Some browsers stop long utterances after ~15 seconds, so speak sentence by sentence. */
function chunks(text: string): string[] {
  const parts = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts : [text];
}

/**
 * Utterances being spoken. Chrome can garbage-collect an utterance that nothing refers to,
 * and then its `end` event never fires — which froze the Listening test mid-way.
 */
const live = new Set<SpeechSynthesisUtterance>();

/** Rough speaking time, used as a safety limit in case the browser never reports the end. */
function estimateMs(text: string, rate: number): number {
  const words = text.split(/\s+/).length;
  return (words / (2.6 * rate)) * 1000 * 2 + 4000;
}

function say(text: string, voice: SpeechSynthesisVoice | undefined, style: VoiceStyle, speed: number): Promise<void> {
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? style.lang;
    u.pitch = style.pitch;
    u.rate = (style.rate ?? 1) * speed;
    u.volume = volume;
    live.add(u);
    // Some browsers pause speech on their own (e.g. after the screen dims); nudge them on.
    const nudge = setInterval(() => {
      if (speechSynthesis.paused) speechSynthesis.resume();
    }, 1000);
    const watchdog = setTimeout(() => {
      speechSynthesis.cancel();
      finish();
    }, estimateMs(text, u.rate));
    function finish() {
      clearInterval(nudge);
      clearTimeout(watchdog);
      live.delete(u);
      resolve();
    }
    u.onend = finish;
    u.onerror = finish;
    speechSynthesis.speak(u);
  });
}

/**
 * Call straight from a button click: iPhones and iPads only allow speech that starts from a tap,
 * so this unlocks it for the rest of the test.
 */
export function unlockSpeech() {
  if (!speechSupported()) return;
  const u = new SpeechSynthesisUtterance(" ");
  u.volume = 0;
  speechSynthesis.speak(u);
}

/** Keeps the phone screen on while a test is running; a locked screen stops the audio. */
export function keepScreenOn(): () => void {
  type WakeLock = { release: () => Promise<void> };
  const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<WakeLock> } };
  if (!nav.wakeLock) return () => {};
  let lock: WakeLock | null = null;
  let active = true;
  const acquire = () => {
    if (active && document.visibilityState === "visible")
      nav.wakeLock!.request("screen").then((l) => (lock = l), () => {});
  };
  acquire();
  document.addEventListener("visibilitychange", acquire);
  return () => {
    active = false;
    document.removeEventListener("visibilitychange", acquire);
    lock?.release().catch(() => {});
  };
}

export interface Playback {
  stop: () => void;
  done: Promise<void>;
}

/**
 * Reads a script aloud line by line, giving each speaker a consistent voice.
 * `onLine` reports which line is being spoken (or -1 when finished).
 */
export function playScript(
  lines: ScriptLine[],
  styles: Record<string, VoiceStyle>,
  speed: number,
  onLine: (i: number) => void,
): Playback {
  let stopped = false;
  const speakers = Object.keys(styles);

  const done = (async () => {
    speechSynthesis.cancel();
    const voices = await loadVoices();
    for (let i = 0; i < lines.length && !stopped; i++) {
      const line = lines[i];
      const style = styles[line.speaker] ?? { lang: "en-GB", pitch: 1 };
      const voice = pickVoice(voices, style, Math.max(0, speakers.indexOf(line.speaker)));
      onLine(i);
      for (const part of chunks(line.text)) {
        if (stopped) break;
        await say(part, voice, style, speed);
      }
      if (!stopped) await new Promise((r) => setTimeout(r, 350));
    }
    onLine(-1);
  })();

  return {
    stop: () => {
      stopped = true;
      speechSynthesis.cancel();
    },
    done,
  };
}

/** The narrator / examiner voice. */
export async function speak(text: string, lang = "en-GB"): Promise<void> {
  if (!speechSupported()) return;
  speechSynthesis.cancel();
  const voices = await loadVoices();
  const voice = pickVoice(voices, { lang, pitch: 1 }, 0);
  for (const part of chunks(text)) await say(part, voice, { lang, pitch: 1, rate: 0.95 }, 1);
}
