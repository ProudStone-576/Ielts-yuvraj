import { numberQuestions } from "./exam";
import type { ListeningTest } from "./types";

/** The narrator's words for each step of a Listening test, shared by the test screen and the audio generator. */
export const CHECK_TIME = 30;

export const NARRATION = {
  soundCheck: "This is a sound check. You should hear this sentence clearly. Adjust the volume if necessary.",
  intro:
    "You will hear a number of different recordings, and you will have to answer questions on what you hear. You will hear each recording once only. Now turn to Part 1.",
  announce: (part: number, context: string, from: number, to: number) =>
    `Part ${part}. ${context} First, you have some time to look at questions ${from} to ${to}.`,
  listen: (from: number, to: number) => `Now listen carefully and answer questions ${from} to ${to}.`,
  end: (part: number) => `That is the end of Part ${part}. You now have ${CHECK_TIME} seconds to check your answers.`,
  final: "That is the end of the listening test. You now have two minutes to check your answers.",
};

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
    const nums = numbered.parts[i].numbers;
    const [from, to] = [nums[0], nums.at(-1)!];
    clips.push(
      { id: `p${i + 1}-announce`, text: NARRATION.announce(i + 1, p.context, from, to) },
      { id: `p${i + 1}-listen`, text: NARRATION.listen(from, to) },
      { id: `p${i + 1}-end`, text: NARRATION.end(i + 1) },
    );
  });
  clips.push({ id: "final", text: NARRATION.final });
  return clips;
}
