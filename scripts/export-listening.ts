/**
 * Writes every Listening test's narrator lines and scripts to JSON for scripts/make-audio.py.
 * Run: npx -y tsx@4.19.2 --tsconfig tsconfig.json scripts/export-listening.ts > /tmp/listening.json
 */
import { LISTENING_TESTS } from "@/content/listening";
import { narrationClips } from "@/lib/narration";

const out = LISTENING_TESTS.map((t) => ({
  id: t.id,
  narration: narrationClips(t),
  parts: t.parts.map((p, i) => ({ id: `p${i + 1}-script`, voices: p.voices, script: p.script })),
}));
console.log(JSON.stringify(out, null, 1));
