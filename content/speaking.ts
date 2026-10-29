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
  {
    id: "set-4",
    title: "Set 4 — Food, friends & a celebration",
    part1: [
      { topic: "Food and cooking", questions: ["Do you enjoy cooking?", "What is a typical meal in your country?", "Do you prefer eating at home or in restaurants?", "Is there any food you didn't like as a child but enjoy now?"] },
      { topic: "Friends", questions: ["Do you have a lot of friends?", "How do you usually spend time with your friends?", "Is it easy to make new friends as an adult?"] },
    ],
    part2: {
      cue: "Describe a celebration you enjoyed.",
      bullets: ["what the celebration was", "where it took place", "who was there", "and explain why you enjoyed it."],
      followUp: "Do you often go to celebrations like this?",
    },
    part3: {
      topic: "Celebrations and traditions",
      questions: [
        "Why do people think it is important to celebrate special occasions?",
        "How have celebrations in your country changed in recent years?",
        "Do you think traditional festivals will disappear in the future?",
        "Is it better to spend a lot of money on celebrations or to keep them simple?",
      ],
    },
  },
  {
    id: "set-5",
    title: "Set 5 — Work, transport & an achievement",
    part1: [
      { topic: "Your job or studies", questions: ["Do you work or are you a student?", "What do you like most about your job or studies?", "Is there anything you would like to change about it?"] },
      { topic: "Public transport", questions: ["How do you usually travel around your city?", "Is public transport good where you live?", "Did you use public transport more or less when you were a child?"] },
    ],
    part2: {
      cue: "Describe an achievement you are proud of.",
      bullets: ["what you achieved", "when it happened", "how you achieved it", "and explain why you are proud of it."],
      followUp: "Did anyone help you to achieve this?",
    },
    part3: {
      topic: "Success and ambition",
      questions: [
        "What kinds of achievements are most admired in your country?",
        "Do you think people are under more pressure to succeed today than in the past?",
        "Is it more important to be successful at work or to be happy?",
        "Should schools reward effort as much as results?",
      ],
    },
  },
  {
    id: "set-6",
    title: "Set 6 — Music, neighbourhood & a useful object",
    part1: [
      { topic: "Music", questions: ["What kind of music do you like?", "When do you usually listen to music?", "Have you ever learned to play an instrument?"] },
      { topic: "Your neighbourhood", questions: ["What is your neighbourhood like?", "Do you know your neighbours well?", "What would make your neighbourhood a better place to live?"] },
    ],
    part2: {
      cue: "Describe an object you use every day that is important to you.",
      bullets: ["what the object is", "how long you have had it", "how you use it", "and explain why it is important to you."],
      followUp: "Would it be difficult to replace?",
    },
    part3: {
      topic: "Possessions and consumerism",
      questions: [
        "Why do people today own so many more things than people in the past?",
        "Do you think advertising makes people buy things they don't need?",
        "Is it better to repair things or to replace them?",
        "How might people's shopping habits change in the future?",
      ],
    },
  },
  {
    id: "set-7",
    title: "Set 7 — Sport, holidays & a piece of advice",
    part1: [
      { topic: "Sport and exercise", questions: ["Do you play any sports?", "How do you keep fit?", "Did you do much sport at school?"] },
      { topic: "Holidays", questions: ["Where did you go on your last holiday?", "Do you prefer relaxing holidays or active ones?", "Do you like to plan your holidays carefully?"] },
    ],
    part2: {
      cue: "Describe a piece of good advice someone gave you.",
      bullets: ["who gave you the advice", "what the advice was", "when you received it", "and explain how it helped you."],
      followUp: "Do you often ask other people for advice?",
    },
    part3: {
      topic: "Advice and decision-making",
      questions: [
        "Who do young people usually ask for advice in your country?",
        "Is advice from older people always better than advice from friends?",
        "Do you think people rely too much on the internet for advice?",
        "Why do some people find it difficult to accept advice?",
      ],
    },
  },
  {
    id: "set-8",
    title: "Set 8 — Reading, the internet & a place you visited",
    part1: [
      { topic: "Reading", questions: ["Do you enjoy reading?", "What kind of things do you read?", "Do you prefer printed books or e-books?"] },
      { topic: "The internet", questions: ["How much time do you spend online each day?", "What do you mainly use the internet for?", "Could you live without the internet?"] },
    ],
    part2: {
      cue: "Describe a place you visited that you would like to go back to.",
      bullets: ["where it is", "when you went there", "what you did there", "and explain why you would like to go back."],
      followUp: "Have you recommended this place to anyone?",
    },
    part3: {
      topic: "Tourism",
      questions: [
        "What are the benefits of tourism for a country?",
        "Can tourism have negative effects on local people?",
        "Why do some people prefer to travel abroad rather than in their own country?",
        "Do you think virtual travel could ever replace real travel?",
      ],
    },
  },
  {
    id: "set-9",
    title: "Set 9 — Weekends, clothes & a teacher",
    part1: [
      { topic: "Weekends", questions: ["What do you usually do at the weekend?", "Do you prefer busy or quiet weekends?", "What did you do last weekend?"] },
      { topic: "Clothes", questions: ["What kind of clothes do you like to wear?", "Do you follow fashion?", "Do you wear different clothes at work and at home?"] },
    ],
    part2: {
      cue: "Describe a teacher who had an important influence on you.",
      bullets: ["who the teacher was", "what subject they taught", "what they were like", "and explain how they influenced you."],
      followUp: "Are you still in contact with this teacher?",
    },
    part3: {
      topic: "Education",
      questions: [
        "What makes a good teacher?",
        "How has the role of teachers changed with technology?",
        "Should teachers be paid more?",
        "Do you think children learn better in large or small classes?",
      ],
    },
  },
  {
    id: "set-10",
    title: "Set 10 — Hometown, plans & a change you made",
    part1: [
      { topic: "Your hometown", questions: ["Where is your hometown?", "What do you like about it?", "Has your hometown changed much in recent years?"] },
      { topic: "Plans", questions: ["Do you usually make plans for the weekend?", "Do you prefer to plan things or to be spontaneous?", "What are your plans for the next year?"] },
    ],
    part2: {
      cue: "Describe an important change you made in your life.",
      bullets: ["what the change was", "when you made it", "why you made it", "and explain how it affected your life."],
      followUp: "Was it difficult to make this change?",
    },
    part3: {
      topic: "Change and adapting",
      questions: [
        "Why do some people find change difficult?",
        "Is it easier for young people or older people to adapt to change?",
        "What are the biggest changes people face when they move to a new country?",
        "How can employers help staff cope with changes at work?",
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
