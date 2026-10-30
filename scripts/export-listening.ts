/**
 * Writes every Listening test's narrator lines and scripts to JSON for scripts/make-audio.py.
 * Run: npx -y tsx@4.19.2 --tsconfig tsconfig.json scripts/export-listening.ts > /tmp/listening.json
 */
import { LISTENING_TESTS } from "@/content/listening";
import { narrationClips, scriptSegments, segmentClip } from "@/lib/narration";

const out = LISTENING_TESTS.map((t) => ({
  id: t.id,
  narration: narrationClips(t),
  parts: t.parts.map((p, i) => ({
    voices: p.voices,
    segments: scriptSegments(p).map((script, s) => ({ id: segmentClip(i + 1, s), script })),
  })),
}));
console.log(JSON.stringify(out, null, 1));
