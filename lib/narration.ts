import { numberQuestions } from "./exam";
import type { ListeningPart, ListeningTest } from "./types";

/** The narrator's words for each step of a Listening test, shared by the test screen and the audio generator. */
export const CHECK_TIME = 30;

export const NARRATION = {
  soundCheck: "This is a sound check. You should hear this sentence clearly. Adjust the volume if necessary.",
  intro:
    "You will hear a number of different recordings, and you will have to answer questions on what you hear. You will hear each recording once only. Now turn to Part 1.",
  announce: (part: number, context: string, from: number, to: number) =>
    `Part ${part}. ${context} First, you have some time to look at questions ${from} to ${to}.`,
  listen: (from: number, to: number) => `Now listen carefully and answer questions ${from} to ${to}.`,
  pause: (kind: string, from: number, to: number) =>
    `Before you hear the rest of the ${kind}, you have some time to look at questions ${from} to ${to}.`,
  resume: (from: number, to: number) => `Now listen and answer questions ${from} to ${to}.`,
  end: (part: number) => `That is the end of Part ${part}. You now have ${CHECK_TIME} seconds to check your answers.`,
  final: "That is the end of the listening test. You now have two minutes to check your answers.",
};

/** "conversation" when several people speak, otherwise "talk" — as the real narrator says. */
export function recordingKind(part: ListeningPart): string {
  return Object.keys(part.voices).length > 1 ? "conversation" : "talk";
}

/** The question numbers heard in each half of a part: one range, or two when the part has a mid-part break. */
export function partRanges(numbers: number[], part: ListeningPart): [number, number][] {
  const last = numbers.length - 1;
  if (!part.pause) return [[numbers[0], numbers[last]]];
  const k = part.pause.fromQuestion;
  return [
    [numbers[0], numbers[k - 1]],
    [numbers[k], numbers[last]],
  ];
}

/** The script lines of each half of a part (one or two segments). */
export function scriptSegments(part: ListeningPart) {
  return part.pause ? [part.script.slice(0, part.pause.beforeLine), part.script.slice(part.pause.beforeLine)] : [part.script];
}

/** Audio file name of a part's script segment: "p1-script", then "p1-script2" after a break. */
export function segmentClip(part: number, segment: number): string {
  return `p${part}-script${segment ? segment + 1 : ""}`;
}

export interface NarrationClip {
  id: string;
  text: string;
}

/** Every narrator line of a test, with the clip id its audio file uses. */
export function narrationClips(test: ListeningTest): NarrationClip[] {
  const numbered = numberQuestions(test.parts.map((p) => ({ label: p.title, groups: p.groups })));
  const clips: NarrationClip[] = [
    { id: "soundcheck", text: NARRATION.soundCheck },
    { id: "intro", text: NARRATION.intro },
  ];
  test.parts.forEach((p, i) => {
    const ranges = partRanges(numbered.parts[i].numbers, p);
    const [from, to] = ranges[0];
    clips.push(
      { id: `p${i + 1}-announce`, text: NARRATION.announce(i + 1, p.context, from, to) },
      { id: `p${i + 1}-listen`, text: NARRATION.listen(from, to) },
    );
    if (ranges[1]) {
      clips.push(
        { id: `p${i + 1}-pause`, text: NARRATION.pause(recordingKind(p), ...ranges[1]) },
        { id: `p${i + 1}-resume`, text: NARRATION.resume(...ranges[1]) },
      );
    }
    clips.push({ id: `p${i + 1}-end`, text: NARRATION.end(i + 1) });
  });
  clips.push({ id: "final", text: NARRATION.final });
  return clips;
}
