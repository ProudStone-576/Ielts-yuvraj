/**
 * Writes every dictation drill sentence to JSON for scripts/make-audio.py --drills.
 * Run: npx -y tsx@4.19.2 --tsconfig tsconfig.json scripts/export-drills.ts > /tmp/drills.json
 */
import { DRILL_SETS } from "@/content/drills";

console.log(JSON.stringify(DRILL_SETS.map((d) => ({ id: d.id, voice: d.voice, lines: d.items.map((i) => i.say) })), null, 1));
