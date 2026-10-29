import type { WritingTask, WritingTest } from "@/lib/types";
import { MORE_WRITING_TASKS } from "./writing-more";

const T1_TIPS = [
  "Cover all three bullet points fully — missing one caps your Task Achievement score.",
  "Match your tone to the reader: formal (Dear Sir or Madam / Yours faithfully), semi-formal (Dear Mr Lee / Yours sincerely), informal (Hi Sam / Best wishes).",
  "State the purpose of the letter in the first one or two sentences.",
  "Aim for 160–190 words. Spend about 20 minutes, including 2–3 minutes checking.",
];

const T2_TIPS = [
  "Answer every part of the question and make your position clear from the introduction to the conclusion.",
  "Use four paragraphs: introduction, two body paragraphs (one main idea each, explained and supported with an example), conclusion.",
  "Use a range of linking words naturally — avoid starting every sentence with 'Moreover' or 'Furthermore'.",
  "Aim for 260–300 words. Spend about 40 minutes: 5 planning, 30 writing, 5 checking.",
];

export const WRITING_TASKS: WritingTask[] = [
  {
    id: "t1-complaint",
    task: 1,
    title: "Lost luggage complaint",
    kind: "Formal letter",
    prompt:
      "You recently travelled by plane and your suitcase did not arrive at your destination. Write a letter to the airline. In your letter",
    bullets: [
      "give details of your flight",
      "describe the suitcase and its contents",
      "say what you would like the airline to do",
    ],
    minWords: 150,
    minutes: 20,
    tips: T1_TIPS,
    modelAnswer: `Dear Sir or Madam,

I am writing to report that my suitcase failed to arrive when I travelled with your airline last week, and to request your urgent assistance.

I was a passenger on flight SK204 from Manchester to Toronto on 3 March, which landed at 4.15 pm. After waiting at the baggage carousel for over an hour, I completed a missing luggage form at your desk, but I have received no update since then.

The suitcase is a large, dark blue hard-shell case with four wheels and a red luggage strap. My name and address are on a label attached to the handle. It contains most of my clothing for the trip, as well as a laptop charger and a folder of documents that I need for a job interview next Thursday.

I would therefore be grateful if you could trace the suitcase as a matter of urgency and deliver it to my hotel address, which is given below. In addition, I would like to be reimbursed for the essential items I have had to buy, for which I have kept all the receipts.

I look forward to hearing from you at your earliest convenience.

Yours faithfully,
Anita Kaur`,
  },
  {
    id: "t1-neighbour",
    task: 1,
    title: "Noise from a neighbour",
    kind: "Semi-formal letter",
    prompt:
      "Your neighbour has been doing building work on their house, and the noise is causing you problems. Write a letter to your neighbour. In your letter",
    bullets: [
      "explain why you are writing",
      "describe how the noise is affecting you",
      "suggest a solution",
    ],
    minWords: 150,
    minutes: 20,
    tips: T1_TIPS,
    modelAnswer: `Dear Mr Thompson,

I hope you are well. I am writing about the renovation work at your house, which I know you have been planning for a long time and which I am sure will look wonderful when it is finished.

However, I wanted to let you know that the noise has been causing me some difficulty. As you may know, I work night shifts at the hospital, so I need to sleep between 9 am and 3 pm. For the past two weeks, the drilling has started at around 7.30 each morning, and I have been finding it almost impossible to rest. As a result, I have been very tired at work, which is a concern in a job like mine.

I wonder whether it might be possible for the noisiest jobs, such as drilling and cutting, to be done in the afternoon, after 3 pm. Alternatively, if you could let me know in advance which days will be particularly loud, I could arrange to sleep at my sister's house.

Thank you for understanding, and please feel free to knock on my door if you would like to discuss this.

Yours sincerely,
Maria Lopez`,
  },
  {
    id: "t1-friend",
    task: 1,
    title: "Thanking a friend",
    kind: "Informal letter",
    prompt:
      "A friend helped you when you moved to a new home last month. Write a letter to your friend. In your letter",
    bullets: [
      "thank your friend for their help",
      "describe your new home",
      "invite your friend to visit",
    ],
    minWords: 150,
    minutes: 20,
    tips: T1_TIPS,
    modelAnswer: `Hi Daniel,

I just wanted to say a huge thank you for all your help with the move last month. I honestly don't know how I would have managed without you. Carrying that sofa up three flights of stairs was no joke, and you kept me laughing the whole time, even when we got stuck in the doorway!

I'm finally settled in now, and I absolutely love the new place. It's a bright two-bedroom flat on the top floor, so I get amazing views over the park, especially at sunset. The kitchen is much bigger than my old one, which means I've actually started cooking properly instead of living on takeaways. The best part is that it's only a ten-minute walk to the station, so my journey to work is so much easier.

Anyway, I'd love you to come and see it now that it's looking a bit less like a storage room. How about coming over for dinner next Saturday? I'll make that Thai curry you like, and if the weather's good, we could go for a walk in the park first.

Let me know if you're free!

Best wishes,
Priya`,
  },
  {
    id: "t1-request",
    task: 1,
    title: "Requesting time off for a course",
    kind: "Formal letter",
    prompt:
      "You would like to attend a training course that takes place during working hours. Write a letter to your manager. In your letter",
    bullets: [
      "describe the course",
      "explain how it would benefit your work",
      "say how you will make sure your work is covered",
    ],
    minWords: 150,
    minutes: 20,
    tips: T1_TIPS,
    modelAnswer: `Dear Ms Chen,

I am writing to request permission to attend a professional training course which takes place during working hours next month.

The course, Advanced Project Management, is run by the Ontario Business Institute and consists of four full-day sessions on consecutive Fridays, starting on 6 May. It covers planning tools, risk assessment and leading remote teams, and successful participants receive a recognised certificate.

I believe the course would be of real benefit to the team. As you know, I have recently taken on responsibility for coordinating the warehouse upgrade, and I would like to manage this project more efficiently. In particular, the sessions on budgeting and scheduling would help me to keep the upgrade on time and within cost. I would also be happy to share what I learn with colleagues at a team meeting afterwards.

To ensure that my work is covered, I have spoken to James Wong, who has agreed to handle my urgent tasks on those Fridays. In addition, I will complete my weekly reports on Thursdays, and I will be available by email during breaks.

I would be grateful if you could consider my request.

Yours sincerely,
Ravi Sharma`,
  },
  {
    id: "t2-remote",
    task: 2,
    title: "Working from home",
    kind: "Opinion essay",
    prompt:
      "Some people believe that working from home benefits both employees and employers. To what extent do you agree or disagree?",
    minWords: 250,
    minutes: 40,
    tips: T2_TIPS,
    modelAnswer: `Since the pandemic, millions of office workers have continued to work from home for at least part of the week. While I accept that this arrangement suits many people, I believe it benefits employees far more clearly than it benefits employers.

For employees, the advantages are substantial. The most obvious is the time and money saved by not commuting; a worker who previously spent an hour travelling each way gains ten hours a week, which can be used for family, exercise or rest. Working from home also gives people greater control over their schedule, which is particularly valuable for parents and carers. Many employees report that they are less stressed and more satisfied with their jobs as a result.

For employers, however, the picture is more mixed. It is true that companies can save money by renting smaller offices, and that offering remote work helps them attract staff from a wider area. Yet there are significant costs. Teamwork and creativity often depend on informal conversations that rarely happen over video calls, and managers may find it harder to train junior staff or to notice when someone is struggling. Some firms have also found that a sense of shared purpose weakens when colleagues seldom meet in person.

In conclusion, working from home is clearly beneficial for employees, but for employers the gains in cost and recruitment are balanced by real losses in collaboration and training. For this reason, I believe a hybrid model, in which staff spend two or three days a week in the office, offers the best balance for both sides.`,
  },
  {
    id: "t2-languages",
    task: 2,
    title: "When to learn a foreign language",
    kind: "Discussion essay",
    prompt:
      "Some people think children should start learning a foreign language at primary school. Others believe it is better to begin at secondary school. Discuss both views and give your own opinion.",
    minWords: 250,
    minutes: 40,
    tips: T2_TIPS,
    modelAnswer: `The question of when children should begin learning a foreign language is widely debated. Although there are reasonable arguments for waiting until secondary school, I believe that starting at primary school is more beneficial.

Those who favour a later start argue that young children should first master their own language. They point out that primary school timetables are already full, and that teaching time spent on a foreign language could instead be used to strengthen reading and mathematics. Furthermore, older students are more disciplined and better able to understand grammar rules, so they may make faster progress in a shorter time. From this perspective, an early start is an inefficient use of limited resources.

On the other hand, there are strong reasons to introduce languages early. Young children are naturally good at imitating sounds, so they are more likely to develop accurate pronunciation. They are also less self-conscious than teenagers and are therefore more willing to speak, make mistakes and learn through songs and games. Perhaps most importantly, an early start gives learners many more years of exposure, and long-term exposure is one of the main factors in reaching a high level.

In my view, the advantages of starting at primary school outweigh the drawbacks. Rather than replacing core subjects, language lessons can be short and playful, focusing on listening and speaking. Students can then build on this foundation with more formal study of grammar and writing at secondary school. In this way, children gain both the natural ability of young learners and the analytical skills of older ones.`,
  },
  {
    id: "t2-traffic",
    task: 2,
    title: "Traffic congestion",
    kind: "Problem / solution essay",
    prompt:
      "Traffic congestion is becoming a serious problem in many cities around the world. What are the causes of this problem, and what measures could be taken to reduce it?",
    minWords: 250,
    minutes: 40,
    tips: T2_TIPS,
    modelAnswer: `Traffic jams have become a daily reality in cities from Toronto to Delhi, wasting time and polluting the air. This essay will examine the main causes of congestion and suggest some practical solutions.

The primary cause is the rapid growth in car ownership. As incomes rise, more families are able to buy cars, and in many cities the number of vehicles has grown far faster than the road network. A second cause is the way cities have been planned. When homes are built in distant suburbs and jobs are concentrated in the city centre, large numbers of people must travel the same routes at the same time each day, and if public transport is slow or unreliable, most of them will drive.

There are, however, several measures that could ease the problem. The most effective long-term solution is to invest in fast, frequent and affordable public transport, such as metro lines and dedicated bus lanes, so that leaving the car at home becomes the more convenient option. In the shorter term, governments could introduce congestion charges, as London and Stockholm have done, which make drivers pay to enter the busiest areas at peak times and use the money to fund transport improvements. Employers can also contribute by allowing flexible working hours, which spreads traffic more evenly across the day.

In conclusion, congestion results mainly from rising car ownership and poor urban planning. Although no single measure will solve it, a combination of better public transport, road pricing and flexible working could significantly reduce traffic in our cities.`,
  },
  {
    id: "t2-migration",
    task: 2,
    title: "Moving abroad for work",
    kind: "Advantages / disadvantages essay",
    prompt:
      "Increasing numbers of people are moving to other countries to live and work. Do the advantages of this trend outweigh the disadvantages?",
    minWords: 250,
    minutes: 40,
    tips: T2_TIPS,
    modelAnswer: `In recent decades, more and more people have chosen to move abroad in search of work. Although this trend creates some challenges, I believe its advantages, both for migrants and for the countries involved, are greater.

The main disadvantages tend to affect individuals and their home countries. Migrants often have to leave behind family and friends, and many struggle with loneliness, language barriers and having their qualifications recognised, which can force a trained engineer or nurse to accept less skilled work at first. Meanwhile, the countries they leave may suffer from a "brain drain", losing doctors, teachers and other professionals whose education they paid for.

Nevertheless, the benefits are considerable. For migrants themselves, moving abroad can mean higher wages, safer living conditions and better opportunities for their children. Host countries gain workers who fill important gaps, particularly in healthcare, construction and technology, and whose taxes help to support ageing populations. Even sending countries can benefit, since migrants often send money home to their families, and some later return with new skills, savings and international connections that help their home economies grow.

Overall, while the personal and economic costs of migration should not be ignored, I believe that the advantages outweigh the disadvantages. Governments can reduce the drawbacks further by speeding up the recognition of foreign qualifications and offering language support, so that migrants can contribute fully to their new communities as quickly as possible.`,
  },
];

WRITING_TASKS.push(...MORE_WRITING_TASKS);

export function getWritingTask(id: string) {
  return WRITING_TASKS.find((t) => t.id === id);
}

/** Each full test pairs one Task 1 letter with one Task 2 essay, like the real exam. */
export const WRITING_TESTS: WritingTest[] = [
  { id: "w-1", title: "Writing — Test 1", task1: "t1-complaint", task2: "t2-remote" },
  { id: "w-2", title: "Writing — Test 2", task1: "t1-neighbour", task2: "t2-languages" },
  { id: "w-3", title: "Writing — Test 3", task1: "t1-friend", task2: "t2-traffic" },
  { id: "w-4", title: "Writing — Test 4", task1: "t1-request", task2: "t2-migration" },
  { id: "w-5", title: "Writing — Test 5", task1: "t1-course", task2: "t2-screens" },
  { id: "w-6", title: "Writing — Test 6", task1: "t1-visit", task2: "t2-university" },
  { id: "w-7", title: "Writing — Test 7", task1: "t1-landlord", task2: "t2-shopping" },
  { id: "w-8", title: "Writing — Test 8", task1: "t1-job", task2: "t2-neighbours" },
];

export function getWritingTest(id: string) {
  const test = WRITING_TESTS.find((t) => t.id === id);
  if (!test) return undefined;
  const t1 = getWritingTask(test.task1);
  const t2 = getWritingTask(test.task2);
  return t1 && t2 ? { test, tasks: [t1, t2] as [WritingTask, WritingTask] } : undefined;
}

/** Simplified public band descriptors used for self-assessment. */
export const WRITING_CRITERIA = [
  {
    key: "ta",
    name: "Task Achievement / Response",
    levels: {
      5: "Covers the task only partly; position or purpose unclear; some ideas irrelevant.",
      6: "Addresses all parts, but some are covered more fully than others; ideas not always developed.",
      7: "Covers all parts; clear position or purpose throughout; main ideas extended and supported.",
      8: "Fully covers all parts; well-developed response with relevant, extended ideas.",
      9: "Fully and naturally addresses every part with fully developed, well-supported ideas.",
    },
  },
  {
    key: "cc",
    name: "Coherence & Cohesion",
    levels: {
      5: "Some organisation but lacks overall progression; linking is limited or repetitive.",
      6: "Arranges information coherently; uses linking devices, but sometimes mechanically.",
      7: "Logically organised with clear progression; range of linking devices with some over/under-use.",
      8: "Sequences information logically; manages all aspects of cohesion well; paragraphs used well.",
      9: "Cohesion attracts no attention; paragraphing is skilful.",
    },
  },
  {
    key: "lr",
    name: "Lexical Resource",
    levels: {
      5: "Limited range of vocabulary; noticeable spelling and word-formation errors.",
      6: "Adequate range; attempts less common words with some inaccuracy.",
      7: "Sufficient range for flexibility and precision; some less common words and collocations.",
      8: "Wide range used fluently; uncommon words used skilfully with only rare errors.",
      9: "Wide range with very natural, sophisticated control; errors extremely rare.",
    },
  },
  {
    key: "gra",
    name: "Grammatical Range & Accuracy",
    levels: {
      5: "Limited range of structures; frequent errors that may cause difficulty for the reader.",
      6: "Mix of simple and complex sentences; some errors that rarely reduce communication.",
      7: "Variety of complex structures; frequent error-free sentences; good control.",
      8: "Wide range of structures; the majority of sentences are error-free.",
      9: "Wide range used with full flexibility and accuracy; only very rare slips.",
    },
  },
] as const;
