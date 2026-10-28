import type { SpeakingSet } from "@/lib/types";

export const SPEAKING_SETS: SpeakingSet[] = [
  {
    id: "set-1",
    title: "Set 1 — Home, work & a helpful person",
    part1: [
      {
        topic: "Your home",
        questions: [
          "Do you live in a house or an apartment?",
          "What do you like most about the place where you live?",
          "Is there anything you would like to change about your home?",
          "Do you plan to live there for a long time?",
        ],
      },
      {
        topic: "Mornings",
        questions: [
          "Are you a morning person?",
          "What do you usually do in the morning?",
          "Has your morning routine changed since you were a child?",
        ],
      },
    ],
    part2: {
      cue: "Describe a person who has helped you a lot.",
      bullets: ["who this person is", "how you know them", "what they did to help you", "and explain how you felt about their help."],
      followUp: "Do you still keep in touch with this person?",
    },
    part3: {
      topic: "Helping others",
      questions: [
        "Why do some people enjoy helping others more than others do?",
        "Do you think people help their neighbours less than they used to? Why?",
        "Should schools teach children to volunteer in the community?",
        "What role should governments play in helping people who are in difficulty?",
      ],
    },
  },
  {
    id: "set-2",
    title: "Set 2 — Weather, shopping & a journey",
    part1: [
      {
        topic: "Weather",
        questions: [
          "What's the weather usually like where you live?",
          "What kind of weather do you like best?",
          "Does the weather ever affect your mood?",
        ],
      },
      {
        topic: "Shopping",
        questions: [
          "Do you enjoy shopping?",
          "Do you prefer shopping online or in stores? Why?",
          "Is there anything you bought recently that you're really pleased with?",
        ],
      },
    ],
    part2: {
      cue: "Describe a memorable journey you have made.",
      bullets: ["where you went", "how you travelled", "who you went with", "and explain why this journey was memorable."],
      followUp: "Would you like to make the same journey again?",
    },
    part3: {
      topic: "Travel and transport",
      questions: [
        "Why do you think people enjoy travelling to other countries?",
        "How has the way people travel changed in the last thirty years?",
        "Some people say tourism damages the places people visit. Do you agree?",
        "What will transport be like in cities in the future?",
      ],
    },
  },
  {
    id: "set-3",
    title: "Set 3 — Free time, technology & a skill",
    part1: [
      {
        topic: "Free time",
        questions: [
          "What do you like to do in your free time?",
          "Do you prefer spending free time alone or with others?",
          "Do you think you have enough free time?",
        ],
      },
      {
        topic: "Mobile phones",
        questions: [
          "How often do you use your phone?",
          "What do you mainly use it for?",
          "Could you live without your phone for a week?",
        ],
      },
    ],
    part2: {
      cue: "Describe a skill you would like to learn.",
      bullets: ["what the skill is", "how you would learn it", "how long it would take", "and explain why you want to learn this skill."],
      followUp: "Do you know anyone who has this skill?",
    },
    part3: {
      topic: "Learning and skills",
      questions: [
        "Which skills are most important for young people to learn today?",
        "Is it better to learn a skill from a teacher or by yourself online?",
        "Do you think older people find it harder to learn new skills? Why?",
        "How might the skills employers want change in the next twenty years?",
      ],
    },
  },
];

export function getSpeakingSet(id: string) {
  return SPEAKING_SETS.find((s) => s.id === id);
}

export const SPEAKING_CRITERIA = [
  {
    key: "fc",
    name: "Fluency & Coherence",
    levels: {
      5: "Usually keeps going, but relies on repetition, self-correction or slow speech.",
      6: "Willing to speak at length, though may lose coherence at times through hesitation.",
      7: "Speaks at length without noticeable effort; some hesitation is language-related.",
      8: "Speaks fluently with only occasional repetition; develops topics coherently.",
      9: "Speaks fluently with rare hesitation; fully coherent and well-developed.",
    },
  },
  {
    key: "lr",
    name: "Lexical Resource",
    levels: {
      5: "Manages familiar topics but uses vocabulary with limited flexibility.",
      6: "Wide enough vocabulary to discuss topics at length; generally paraphrases successfully.",
      7: "Uses vocabulary flexibly; some less common and idiomatic words; some inappropriate choices.",
      8: "Wide, flexible vocabulary; uses idiomatic language skilfully with occasional errors.",
      9: "Full flexibility and precision on all topics; idiomatic language used naturally.",
    },
  },
  {
    key: "gra",
    name: "Grammatical Range & Accuracy",
    levels: {
      5: "Basic sentence forms are fairly accurate; complex structures are limited and contain errors.",
      6: "Mix of simple and complex structures, with limited flexibility; errors rarely impede.",
      7: "Range of complex structures with some flexibility; frequent error-free sentences.",
      8: "Wide range of structures used flexibly; majority of sentences error-free.",
      9: "Full range used naturally and accurately, apart from native-speaker-type slips.",
    },
  },
  {
    key: "p",
    name: "Pronunciation",
    levels: {
      5: "Some features of pronunciation are effective, but mispronunciation causes some difficulty.",
      6: "Generally understood, though some words or sounds are mispronounced.",
      7: "Easy to understand; accent has little effect; uses stress and intonation well most of the time.",
      8: "Wide range of features; easy to understand throughout with only occasional lapses.",
      9: "Precise and subtle use of pronunciation features; effortless to understand.",
    },
  },
] as const;

/** Common filler words counted in the speech transcript. */
export const FILLERS = ["um", "uh", "er", "erm", "like", "you know", "basically", "actually", "i mean"];
