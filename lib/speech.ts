"use client";

import type { ScriptLine } from "./types";

export interface VoiceStyle {
  lang: string;
  pitch: number;
  rate?: number;
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
  const exact = english.filter((v) => v.lang.toLowerCase() === style.lang.toLowerCase());
  const pool = exact.length ? exact : english;
  return pool.length ? pool[index % pool.length] : undefined;
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
      onLine(i);
      await new Promise<void>((resolve) => {
        const u = new SpeechSynthesisUtterance(line.text);
        const voice = pickVoice(voices, style, Math.max(0, speakers.indexOf(line.speaker)));
        if (voice) u.voice = voice;
        u.lang = voice?.lang ?? style.lang;
        u.pitch = style.pitch;
        u.rate = (style.rate ?? 1) * speed;
        u.onend = () => resolve();
        u.onerror = () => resolve();
        speechSynthesis.speak(u);
      });
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

export function speak(text: string, lang = "en-GB"): Promise<void> {
  return new Promise((resolve) => {
    if (!speechSupported()) return resolve();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.95;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    speechSynthesis.speak(u);
  });
}
