import type { SpeakingSet } from "./types";

/*
 * The examiner's script for a mock Speaking interview, shared by the test screen and the voice generator
 * (scripts/export-speaking.ts), so the recorded audio always matches what the app expects to say.
 */

/** Like the real test, each interview has its own examiner. She is sitting the test in Canada, so some are Canadian. */
const EXAMINERS = [
  { name: "Sarah", voice: "en-GB-SoniaNeural" },
  { name: "James", voice: "en-CA-LiamNeural" },
  { name: "Claire", voice: "en-CA-ClaraNeural" },
  { name: "Thomas", voice: "en-GB-ThomasNeural" },
  { name: "Olivia", voice: "en-GB-OliviaNeural" },
] as const;

export function examinerFor(set: SpeakingSet) {
  const n = parseInt(set.id.replace(/\D/g, ""), 10) || 1;
  return EXAMINERS[(n - 1) % EXAMINERS.length];
}

/** Fixed things the examiner says at the cue card, when time is up, and at the end. */
export const EXAMINER_LINES = {
  prep: "Now, I'm going to give you a topic, and I'd like you to talk about it for one to two minutes. Before you talk, you'll have one minute to think about what you're going to say. You can make some notes if you wish. Here is your topic.",
  talk: "All right? Remember, you have one to two minutes for this, so don't worry if I stop you. I'll tell you when the time is up. Can you start speaking now, please?",
  timeUp: "Thank you.",
  end: "Thank you. That is the end of the speaking test.",
};

export type Step =
  | { part: 0 | 1 | 3; kind: "ask"; say: string; question: string; limit: number }
  | { part: 2; kind: "prep" }
  | { part: 2; kind: "talk" }
  | { part: 2; kind: "ask"; say: string; question: string; limit: number };

export function buildSteps(set: SpeakingSet): Step[] {
  const examiner = examinerFor(set);
  const steps: Step[] = [
    {
      part: 0,
      kind: "ask",
      say: `Good afternoon. My name is ${examiner.name} and I will be your examiner today. Can you tell me your full name, please?`,
      question: "Can you tell me your full name, please?",
      limit: 20,
    },
    { part: 0, kind: "ask", say: "Thank you. And what shall I call you?", question: "What shall I call you?", limit: 15 },
    {
      part: 0,
      kind: "ask",
      say: "Thank you. Can you tell me where you're from?",
      question: "Can you tell me where you're from?",
      limit: 20,
    },
  ];
  set.part1.forEach((topic, ti) => {
    topic.questions.forEach((q, qi) => {
      const lead =
        ti === 0 && qi === 0
          ? `Thank you. Now, in this first part, I'd like to ask you some questions about yourself. Let's talk about ${topic.topic.toLowerCase()}. `
          : qi === 0
            ? `Now let's talk about ${topic.topic.toLowerCase()}. `
            : "";
      steps.push({ part: 1, kind: "ask", say: lead + q, question: q, limit: 40 });
    });
  });
  steps.push({ part: 2, kind: "prep" }, { part: 2, kind: "talk" });
  steps.push({ part: 2, kind: "ask", say: `Thank you. ${set.part2.followUp}`, question: set.part2.followUp, limit: 20 });
  set.part3.questions.forEach((q, i) =>
    steps.push({
      part: 3,
      kind: "ask",
      say:
        i === 0
          ? `Thank you. We've been talking about ${set.part2.cue.replace(/^Describe /, "").replace(/\.$/, "")}, and I'd like to discuss with you one or two more general questions related to this. Let's consider ${set.part3.topic.toLowerCase()}. ${q}`
          : q,
      question: q,
      limit: 75,
    }),
  );
  return steps;
}

/** Every sentence the examiner says in an interview, for recording. */
export function examinerLines(set: SpeakingSet): string[] {
  // Everything said at each step, plus each Part 1 and 3 question on its own (for "Could you repeat the question?").
  const said = buildSteps(set).flatMap((s) => (s.kind !== "ask" ? [] : s.part === 1 || s.part === 3 ? [s.say, s.question] : [s.say]));
  return [...new Set([...said, ...Object.values(EXAMINER_LINES)])];
}
