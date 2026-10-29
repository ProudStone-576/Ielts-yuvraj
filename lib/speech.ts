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

function say(text: string, voice: SpeechSynthesisVoice | undefined, style: VoiceStyle, speed: number): Promise<void> {
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? style.lang;
    u.pitch = style.pitch;
    u.rate = (style.rate ?? 1) * speed;
    u.volume = volume;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    speechSynthesis.speak(u);
  });
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
