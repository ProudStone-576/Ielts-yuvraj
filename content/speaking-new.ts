import type { SpeakingSet } from "@/lib/types";

/* Speaking sets 11–16. */
export const NEW_SPEAKING_SETS: SpeakingSet[] = [
  {
    id: "set-11",
    title: "Set 11 — Photos, cooking & a memorable meal",
    part1: [
      {
        topic: "Photographs",
        questions: [
          "Do you like taking photographs?",
          "What do you usually take photos of?",
          "Do you prefer to keep photos on your phone or print them?",
          "Is there a photo in your home that is special to you?",
        ],
      },
      {
        topic: "Cooking",
        questions: ["How often do you cook?", "Who taught you to cook?", "Is there a dish you would like to learn to make?"],
      },
    ],
    part2: {
      cue: "Describe a meal that you remember well.",
      bullets: ["where you had this meal", "who you were with", "what you ate", "and explain why you remember this meal so well."],
      followUp: "Do you often eat out with friends or family?",
    },
    part3: {
      topic: "Eating habits",
      questions: [
        "How have people's eating habits changed in your country in recent years?",
        "Why do some families no longer eat meals together?",
        "Should schools teach children how to cook?",
        "Do you think fast food will become more or less popular in the future?",
      ],
    },
  },
  {
    id: "set-12",
    title: "Set 12 — Languages, parks & a goal",
    part1: [
      {
        topic: "Languages",
        questions: [
          "How many languages can you speak?",
          "Which language would you most like to learn? Why?",
          "Do you think it's difficult to learn a new language as an adult?",
        ],
      },
      {
        topic: "Parks",
        questions: ["Is there a park near where you live?", "What do people usually do there?", "Did you go to parks often when you were a child?"],
      },
    ],
    part2: {
      cue: "Describe a goal that you would like to achieve in the future.",
      bullets: ["what the goal is", "when you decided on this goal", "what you need to do to achieve it", "and explain why this goal is important to you."],
      followUp: "Have you told other people about this goal?",
    },
    part3: {
      topic: "Goals and motivation",
      questions: [
        "Why do some people find it hard to achieve their goals?",
        "Is it better to have one big goal or several small ones?",
        "Should parents set goals for their children, or let children choose their own?",
        "How important is luck in achieving success?",
      ],
    },
  },
  {
    id: "set-13",
    title: "Set 13 — Sleep, gifts & a difficult decision",
    part1: [
      {
        topic: "Sleep",
        questions: [
          "How many hours do you usually sleep?",
          "Do you ever take a nap during the day?",
          "What do you do if you can't sleep?",
        ],
      },
      {
        topic: "Gifts",
        questions: [
          "Do you enjoy choosing gifts for other people?",
          "What's the best gift you have ever received?",
          "Is it better to give money or a present?",
        ],
      },
    ],
    part2: {
      cue: "Describe a difficult decision that you made.",
      bullets: ["what the decision was", "when you made it", "what choices you had", "and explain why it was difficult to make."],
      followUp: "Are you happy with the decision now?",
    },
    part3: {
      topic: "Making decisions",
      questions: [
        "What kinds of decisions do young people have to make today?",
        "Should people ask for advice before making important decisions?",
        "Why do some people find it hard to make decisions quickly?",
        "Do you think older people make better decisions than younger people?",
      ],
    },
  },
  {
    id: "set-14",
    title: "Set 14 — Rain, museums & a building you like",
    part1: [
      {
        topic: "Rainy days",
        questions: [
          "Does it rain a lot where you live?",
          "What do you like to do on rainy days?",
          "Did you enjoy rainy days when you were a child?",
        ],
      },
      {
        topic: "Museums",
        questions: [
          "Do you often visit museums?",
          "What kind of museums do you find most interesting?",
          "Should museums be free to enter?",
        ],
      },
    ],
    part2: {
      cue: "Describe a building that you like.",
      bullets: ["where the building is", "what it looks like", "what it is used for", "and explain why you like it."],
      followUp: "Do you think many people agree with you about this building?",
    },
    part3: {
      topic: "Architecture and cities",
      questions: [
        "Should old buildings be protected, or replaced with modern ones?",
        "What makes a city an attractive place to live?",
        "How do you think homes will change in the next fifty years?",
        "Who should decide what new buildings look like: architects, governments or local people?",
      ],
    },
  },
  {
    id: "set-15",
    title: "Set 15 — Volunteering, colours & a family member",
    part1: [
      {
        topic: "Colours",
        questions: [
          "What's your favourite colour?",
          "Are there any colours you don't like wearing?",
          "Do colours affect your mood?",
        ],
      },
      {
        topic: "Volunteering",
        questions: [
          "Have you ever done any volunteer work?",
          "Why do you think people volunteer?",
          "Would you like to volunteer in the future?",
        ],
      },
    ],
    part2: {
      cue: "Describe a family member you spend a lot of time with.",
      bullets: ["who this person is", "what you usually do together", "how often you see them", "and explain why you enjoy spending time with this person."],
      followUp: "Are you similar to this person?",
    },
    part3: {
      topic: "Families",
      questions: [
        "How are families today different from families in the past?",
        "Who should be responsible for looking after elderly people: families or the government?",
        "Why do some young adults continue living with their parents?",
        "Do you think grandparents play an important role in children's lives?",
      ],
    },
  },
  {
    id: "set-16",
    title: "Set 16 — Apps, the sea & an interesting conversation",
    part1: [
      {
        topic: "Apps",
        questions: [
          "Which apps do you use most often?",
          "Is there an app you couldn't live without?",
          "Do you ever pay for apps?",
        ],
      },
      {
        topic: "The sea",
        questions: [
          "Do you live near the sea?",
          "Do you enjoy going to the beach?",
          "Would you like to live by the sea one day?",
        ],
      },
    ],
    part2: {
      cue: "Describe an interesting conversation you had with someone.",
      bullets: ["who you talked to", "when and where it happened", "what you talked about", "and explain why the conversation was interesting."],
      followUp: "Do you often talk to people you don't know?",
    },
    part3: {
      topic: "Communication",
      questions: [
        "Has technology made people better or worse at communicating face to face?",
        "Why do some people find it difficult to start conversations with strangers?",
        "Is it important for children to learn how to listen well?",
        "Will people still write letters in the future?",
      ],
    },
  },
];
