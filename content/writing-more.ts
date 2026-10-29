import type { WritingTask } from "@/lib/types";

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

export const MORE_WRITING_TASKS: WritingTask[] = [
  {
    id: "t1-course",
    task: 1,
    title: "Cancelled evening course",
    kind: "Formal letter",
    prompt: "You enrolled on an evening course at a local college, but the college cancelled it after two weeks. Write a letter to the college. In your letter",
    bullets: ["give details of the course", "explain how the cancellation has affected you", "say what you would like the college to do"],
    minWords: 150,
    minutes: 20,
    tips: T1_TIPS,
    modelAnswer: `Dear Sir or Madam,

I am writing to express my disappointment at the cancellation of the evening course I enrolled on this term, and to request a full refund.

The course was Introduction to Bookkeeping, which ran on Tuesday evenings from 6.30 to 8.30 pm and was due to last ten weeks. I paid the full fee of $320 in August. However, after only two sessions, I received a short email informing me that the course had been cancelled because the tutor was no longer available, with no further explanation.

This has caused me considerable inconvenience. I chose the course specifically because I am applying for an accounts assistant position next month, and the employer has asked for evidence of basic bookkeeping training. I also arranged with my manager to leave work early every Tuesday, which was not easy to organise.

I would therefore be grateful if you could refund the full course fee, as I have received only a fifth of the teaching I paid for. Alternatively, if a similar course is starting within the next few weeks, I would be willing to transfer to it, provided that it leads to the same certificate.

I look forward to your prompt reply.

Yours faithfully,
Leena Joshi`,
  },
  {
    id: "t1-visit",
    task: 1,
    title: "A friend's visit",
    kind: "Informal letter",
    prompt: "A friend from another country is planning to visit your city for a week. Write a letter to your friend. In your letter",
    bullets: ["suggest the best time of year to visit", "recommend some places to go", "offer to help with their visit"],
    minWords: 150,
    minutes: 20,
    tips: T1_TIPS,
    modelAnswer: `Hi Marco,

It was so exciting to hear that you're finally coming to visit! I've been telling everyone here about you for years, so they're all looking forward to meeting you.

If you can choose when to come, I'd definitely recommend late September or early October. The summer crowds have gone by then, and the weather is usually warm and dry without being too hot. Whatever you do, avoid January — it's freezing, and half the attractions are closed.

There's plenty to keep you busy for a week. You absolutely have to walk along the waterfront at sunset; the views of the old harbour are amazing. The Saturday market is great for local food, and if you like history, the castle museum is fascinating. On a clear day, we could also take the train up to the lakes, which takes about an hour and is well worth it.

Of course, you're very welcome to stay with me — the spare room is all yours. I'll also try to take a couple of days off work so that I can show you around properly, and I'll pick you up from the airport.

Let me know your dates as soon as you've booked!

Best wishes,
Sofia`,
  },
  {
    id: "t1-landlord",
    task: 1,
    title: "Broken heating",
    kind: "Semi-formal letter",
    prompt: "The heating in the apartment you rent has stopped working. Write a letter to your landlord. In your letter",
    bullets: ["describe the problem", "explain how it is affecting you", "say what you would like your landlord to do"],
    minWords: 150,
    minutes: 20,
    tips: T1_TIPS,
    modelAnswer: `Dear Mr Patterson,

I am writing to let you know about a problem with the heating in my apartment at 14B Elm Court, which I hope can be repaired as soon as possible.

Last Monday, the boiler suddenly stopped working. The display shows an error code, E119, and although I have tried resetting it several times, following the instructions in the manual, the radiators remain completely cold. The hot water is also only lukewarm.

As you can imagine, this is causing real difficulties, especially now that temperatures are dropping below zero at night. I work from home three days a week, and it has become too cold to sit at my desk for long periods. I have bought a small electric heater, but it only heats one room and is increasing my electricity bill considerably.

I would be very grateful if you could arrange for an engineer to inspect the boiler this week. I am at home on Tuesdays, Wednesdays and Fridays, so any of those days would be convenient. Alternatively, I could give the engineer access on another day if you let me know in advance.

Thank you for your help. I look forward to hearing from you.

Yours sincerely,
Ahmed Hassan`,
  },
  {
    id: "t1-job",
    task: 1,
    title: "Applying for a part-time job",
    kind: "Formal letter",
    prompt: "You have seen an advertisement for a part-time job at a hotel. Write a letter to the hotel manager. In your letter",
    bullets: ["explain which job you are applying for", "describe your relevant experience", "say when you are available to work"],
    minWords: 150,
    minutes: 20,
    tips: T1_TIPS,
    modelAnswer: `Dear Sir or Madam,

I am writing to apply for the position of part-time receptionist, which was advertised on your website last week.

I believe I have the experience and personal qualities needed for this role. For the past two years, I have worked as a sales assistant in a busy department store, where I have dealt with customers' questions and complaints every day. This has taught me to stay calm and polite under pressure. In addition, before moving to Canada, I spent a summer working at a family-run guest house in Portugal, where I checked guests in and out, handled bookings and recommended local attractions. I speak English, Portuguese and Spanish fluently, which I imagine would be useful in a hotel with many international guests.

I am currently studying hospitality management at college on weekday mornings, so I would be available to work on weekday afternoons and evenings, as well as all day at weekends. I would also be happy to cover extra shifts during the holiday season.

I have attached my CV and would welcome the opportunity to discuss my application at an interview.

Yours faithfully,
Mariana Costa`,
  },
  {
    id: "t2-screens",
    task: 2,
    title: "Children and screens",
    kind: "Problem / solution essay",
    prompt:
      "Many children today spend several hours a day using electronic devices such as phones and tablets. What problems does this cause? What can be done to solve these problems?",
    minWords: 250,
    minutes: 40,
    tips: T2_TIPS,
    modelAnswer: `It is now common to see young children absorbed in a phone or tablet for much of the day. While these devices have educational value, excessive use creates significant problems for children's health and development. This essay will discuss these problems and suggest how parents and schools can address them.

The most obvious problem is the effect on physical health. Children who spend hours in front of a screen are less active, which contributes to rising rates of childhood obesity. Using devices late in the evening also disrupts sleep, leaving children tired and less able to concentrate at school. A second, less visible problem concerns social development. Face-to-face play teaches children to share, negotiate and read other people's emotions, but a child who spends most of their free time watching videos misses many of these opportunities.

There are, however, practical ways to reduce these risks. Parents play the most important role. Setting clear limits, such as no devices during meals or in the hour before bed, and keeping phones out of bedrooms at night, can quickly improve sleep. Parents can also set a good example by limiting their own screen time. Schools can contribute by teaching children about the effects of screens and by offering attractive alternatives, such as after-school sports and clubs, so that children have something more appealing to do than stay at home on their devices.

In conclusion, heavy use of electronic devices can harm children's physical health and social skills. Although technology is unlikely to disappear from children's lives, sensible rules at home and active alternatives at school can ensure it is used in moderation.`,
  },
  {
    id: "t2-university",
    task: 2,
    title: "Free university education",
    kind: "Opinion essay",
    prompt: "Some people believe that university education should be free for all students. To what extent do you agree or disagree?",
    minWords: 250,
    minutes: 40,
    tips: T2_TIPS,
    modelAnswer: `In many countries, students graduate with debts that take decades to repay. Some argue that the solution is to make university completely free. While I agree that cost should never prevent talented students from studying, I do not believe that free tuition for everyone is the fairest way to achieve this.

There are strong arguments in favour of free university education. Most importantly, it gives young people from low-income families the same opportunities as wealthier students, which can reduce inequality over time. Society as a whole also benefits, since graduates such as doctors, engineers and teachers provide essential services and usually pay higher taxes throughout their careers. Countries such as Germany and Norway, which offer free tuition, demonstrate that such a system can work.

Nevertheless, making university free for all has serious drawbacks. Free tuition must be funded by taxpayers, including the many people who never attend university and often earn less than graduates. In effect, lower-paid workers would be subsidising the future high earnings of others. Moreover, when governments pay all costs, they often limit the number of places available, which can make admission more competitive and may disadvantage the very students the policy is meant to help.

In my view, a better approach is a combination of means-tested grants and income-based loans. Students from poorer backgrounds would receive grants to cover their fees and living costs, while others would repay their loans only once they earned above a certain salary. This would protect access to higher education without placing an unfair burden on those who do not benefit from it directly.`,
  },
  {
    id: "t2-shopping",
    task: 2,
    title: "Online shopping",
    kind: "Positive / negative essay",
    prompt:
      "In many countries, online shopping is replacing shopping in traditional stores. Is this a positive or a negative development?",
    minWords: 250,
    minutes: 40,
    tips: T2_TIPS,
    modelAnswer: `Over the past decade, buying goods online has become a normal part of daily life, and many high-street shops have closed as a result. Although online shopping offers clear benefits to consumers, I believe that its overall impact on society is largely negative.

Admittedly, the advantages for individual shoppers are considerable. Online stores are open twenty-four hours a day, offer a far wider range of products than any physical shop, and allow customers to compare prices in seconds. For people with disabilities, those living in remote areas, or parents with young children, being able to order almost anything from home is a genuine improvement in quality of life.

However, the wider consequences are more worrying. As people shop online, town centres lose the shops that once attracted visitors, and the cafés, restaurants and other businesses around them also suffer. Empty streets are not only less pleasant but can also become less safe. Furthermore, many jobs in retail are being replaced by warehouse and delivery work, which is often poorly paid and insecure. There is also an environmental cost: individual deliveries, frequent returns and excessive packaging all add to traffic and waste.

In conclusion, while online shopping is convenient for consumers, I believe its negative effects on local communities, employment and the environment outweigh this convenience. Governments could reduce the damage by lowering taxes for small high-street businesses and encouraging more sustainable delivery methods, so that physical shops and online retailers can exist side by side.`,
  },
  {
    id: "t2-neighbours",
    task: 2,
    title: "Not knowing your neighbours",
    kind: "Two-part question essay",
    prompt: "In many places, people no longer know their neighbours. Why is this the case? What can be done to create stronger local communities?",
    minWords: 250,
    minutes: 40,
    tips: T2_TIPS,
    modelAnswer: `A generation ago, most people knew the names of the families living on their street. Today, it is common for neighbours to live side by side for years without ever speaking. This essay will examine the reasons for this change and suggest ways to strengthen local communities.

One major reason is the way we now live and work. Many people commute long distances and spend most of their waking hours away from home, leaving little time to meet the people who live nearby. In addition, people move house far more frequently than in the past, especially in cities where renting is common, so there is less incentive to build lasting relationships with neighbours. Technology has also played a part: with social media, people can easily stay in touch with friends and family elsewhere, so they rely less on those living around them.

Nevertheless, there are practical steps that can help. Local councils can provide shared spaces, such as community gardens, parks and libraries, where people naturally meet. Regular events, for instance street parties, markets or sports days, give residents a reason to talk to one another. Individuals can make a difference too: something as simple as introducing yourself to new neighbours or joining a local group can gradually build trust. Some neighbourhoods have also successfully used online groups to share news, lend tools and organise help for elderly residents.

In conclusion, busy lifestyles, frequent moves and technology have weakened ties between neighbours. However, with shared spaces, community events and a little personal effort, it is possible to rebuild the sense of belonging that many people miss.`,
  },
];
