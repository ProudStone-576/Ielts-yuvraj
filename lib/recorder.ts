"use client";

/* Minimal typings for the Web Speech recognition API (Chrome/Edge/Safari). */
interface RecognitionResult {
  isFinal: boolean;
  0: { transcript: string };
}
interface RecognitionEvent {
  resultIndex: number;
  results: ArrayLike<RecognitionResult>;
}
interface Recognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: RecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function recognitionCtor(): (new () => Recognition) | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition) as (new () => Recognition) | undefined;
}

export function transcriptionSupported(): boolean {
  return recognitionCtor() !== undefined;
}

export interface Session {
  /** Stops recording and resolves with an audio URL (if recording worked) and the transcript. */
  stop: () => Promise<{ url?: string; transcript: string }>;
}

/**
 * Records the microphone and, where supported, transcribes speech at the same time.
 * Either part can fail independently (e.g. no transcription in Firefox).
 */
export function startSession(stream: MediaStream | null, onTranscript: (t: string) => void): Session {
  let transcript = "";
  let active = true;

  const chunks: Blob[] = [];
  let recorder: MediaRecorder | null = null;
  if (stream && typeof MediaRecorder !== "undefined") {
    try {
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      recorder.start();
    } catch {
      recorder = null;
    }
  }

  const Ctor = recognitionCtor();
  let rec: Recognition | null = null;
  if (Ctor) {
    rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-GB";
    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          transcript = `${transcript} ${e.results[i][0].transcript}`.trim();
          onTranscript(transcript);
        }
      }
    };
    // Browsers stop recognition after a pause; restart while the session is active.
    rec.onend = () => {
      if (active) {
        try {
          rec?.start();
        } catch {
          /* already started */
        }
      }
    };
    rec.onerror = () => {};
    try {
      rec.start();
    } catch {
      rec = null;
    }
  }

  return {
    stop: () =>
      new Promise((resolve) => {
        active = false;
        rec?.stop();
        if (!recorder || recorder.state === "inactive") return resolve({ transcript });
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: recorder?.mimeType || "audio/webm" });
          resolve({ url: URL.createObjectURL(blob), transcript });
        };
        recorder.stop();
      }),
  };
}
