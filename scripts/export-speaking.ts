/**
 * Writes what the examiner says in every Speaking set to JSON for scripts/make-audio.py --speaking.
 * Run: npx -y tsx@4.19.2 --tsconfig tsconfig.json scripts/export-speaking.ts > /tmp/speaking.json
 */
import { SPEAKING_SETS } from "@/content/speaking";
import { examinerFor, examinerLines } from "@/lib/speaking-script";

console.log(JSON.stringify(SPEAKING_SETS.map((s) => ({ id: s.id, voice: examinerFor(s).voice, lines: examinerLines(s) })), null, 1));
