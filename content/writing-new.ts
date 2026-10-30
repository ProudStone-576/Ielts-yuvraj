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

/* Tasks for Writing tests 9–12. */
export const NEW_WRITING_TASKS: WritingTask[] = [
  {
    id: "t1-crossing",
    task: 1,
    title: "A dangerous road",
    kind: "Formal letter",
    prompt: "The road outside your home has become dangerous for pedestrians. Write a letter to your local council. In your letter",
    bullets: ["describe the road and the problem", "explain why it is dangerous", "suggest what the council should do"],
    minWords: 150,
    minutes: 20,
    tips: T1_TIPS,
    modelAnswer: `Dear Sir or Madam,

I am writing to draw your attention to a serious safety problem on Elm Avenue, where I have lived for the past six years, and to ask the council to take action before someone is seriously injured.

Elm Avenue is a residential street, but since the new shopping centre opened last spring, it has become a popular shortcut for drivers trying to avoid the traffic lights on the main road. As a result, the volume of traffic has more than doubled, and many vehicles travel well above the speed limit.

The situation is particularly dangerous because there is no pedestrian crossing anywhere along the street, even though there is a primary school at one end of it. Every morning, I see young children and their parents waiting for a gap in the traffic, and last month a neighbour's son was almost hit by a delivery van.

I would therefore urge the council to install a pedestrian crossing near the school, as well as speed bumps to discourage drivers from using the street as a shortcut. I am confident that these measures would make a real difference.

I look forward to hearing from you.

Yours faithfully,
Daniel Hughes`,
  },
  {
    id: "t1-schedule",
    task: 1,
    title: "Changing your working hours",
    kind: "Semi-formal letter",
    prompt: "You would like to change your working hours. Write a letter to your manager. In your letter",
    bullets: ["explain why you want to change your hours", "describe the new working hours you would like", "say how your work will still be done"],
    minWords: 150,
    minutes: 20,
    tips: T1_TIPS,
    modelAnswer: `Dear Ms Walker,

I am writing to ask whether it would be possible to change my working hours from the beginning of next month, for a reason that I hope will also benefit the team.

As you may know, I have recently enrolled on an evening course in project management at Westside College, which I hope will help me to take on more responsibility in the team. The classes take place on Tuesday and Thursday evenings from 5.30 pm. However, I would not be able to arrive on time if I finished work at 5 pm as I do now.

I would therefore like to start at 7.30 am instead of 9 am on those two days, and leave at 3.30 pm. On the other days of the week, my hours would remain the same. As a result, my total weekly hours would not change.

I am confident that this arrangement would not affect my work. Most of my client calls take place in the morning, and I would be available for all our weekly team meetings, which are held on Mondays. In addition, I would make sure that any urgent matters were handed over to a colleague before I left.

Please let me know if you would like to discuss this further.

Yours sincerely,
Priya Sharma`,
  },
  {
    id: "t1-advice",
    task: 1,
    title: "Advice for a friend moving to your city",
    kind: "Informal letter",
    prompt: "A friend is planning to move to the city where you live. Write a letter to your friend. In your letter",
    bullets: ["give advice about finding somewhere to live", "describe the job opportunities in the city", "offer to help with the move"],
    minWords: 150,
    minutes: 20,
    tips: T1_TIPS,
    modelAnswer: `Hi Sam,

I'm so pleased you've finally decided to move here! It'll be brilliant to have you living nearby again, and I'm happy to share everything I've learned since I arrived.

Finding a flat is the hardest part, so start looking as soon as you can. Rents in the city centre are really high. However, the neighbourhoods along the new train line, like Riverside and Northgate, are much cheaper and only twenty minutes from downtown. Whatever you do, never pay a deposit before you've seen the place in person, because there are a lot of scams online.

As for work, you shouldn't have any trouble. Since you're in IT, you'll be glad to hear that several tech companies have opened offices here recently, and they're always advertising. For example, there are regular job fairs at the conference centre, which are a great way to meet employers.

If it helps, you're welcome to stay with us for the first couple of weeks while you look for somewhere. I could also borrow my brother's van to help you move your things on the day.

Let me know your dates as soon as you have them!

Best wishes,
Alex`,
  },
  {
    id: "t1-hotel",
    task: 1,
    title: "Something left at a hotel",
    kind: "Formal letter",
    prompt: "You recently stayed at a hotel and left something behind. Write a letter to the hotel manager. In your letter",
    bullets: ["give details of your stay", "describe the item you left behind", "explain how you would like it returned"],
    minWords: 150,
    minutes: 20,
    tips: T1_TIPS,
    modelAnswer: `Dear Sir or Madam,

I am writing because I believe I left an item of personal value in my room when I stayed at your hotel last week, and I would be very grateful for your help in finding it.

I stayed at the Harbour View Hotel from 12 to 15 March in room 214, a double room on the second floor. The booking was made under my name, Maria Lopez. Unfortunately, I checked out early on the morning of 15 March in order to catch a flight.

The item is a small silver watch with a brown leather strap. Although it is not particularly expensive, it was a gift from my late grandmother. Therefore, it is extremely important to me. In particular, I think I left it on the shelf in the bathroom, which is where I put it when I took a shower that morning.

If the watch has been found, I would appreciate it if you could send it to my home address by registered post, so that it can be tracked. I will, of course, pay the postage costs. In addition, I would be happy to provide my card details by phone.

Thank you in advance for your assistance.

Yours faithfully,
Maria Lopez`,
  },
  {
    id: "t2-customs",
    task: 2,
    title: "Newcomers and local customs",
    kind: "Discussion essay",
    prompt:
      "Some people believe that people who move to a new country should adopt the customs and way of life of that country. Others think they should keep their own traditions. Discuss both these views and give your own opinion.",
    minWords: 250,
    minutes: 40,
    tips: T2_TIPS,
    modelAnswer: `Every year, millions of people settle in a new country, bringing their own languages, food and customs with them. While some argue that newcomers should adopt the way of life of their new home, others believe they should preserve their own traditions. In my view, the most successful approach combines both.

Those who favour adopting local customs argue that it helps newcomers to integrate. Someone who learns the language, follows local social conventions and takes part in community events is more likely to make friends, find work and feel at home. For example, in Canada, immigrants who join local sports clubs or volunteer organisations often build professional networks that help them find jobs in their field. From this perspective, holding on too tightly to old ways may lead to isolation.

On the other hand, many people believe that giving up one's traditions means losing an important part of one's identity. Cultural practices such as festivals, religious beliefs and family customs give people a sense of belonging, especially when they are far from home. Moreover, these traditions often enrich the host country; much of the food, music and celebrations that cities like Toronto or London are proud of today were introduced by immigrants.

In my opinion, newcomers do not have to choose between the two. They should certainly learn the language and respect the laws and basic values of their new country, because this is essential for living together. However, there is no reason why they cannot continue to celebrate their own festivals, cook traditional food and pass their language on to their children.

In conclusion, although adapting to local customs is important for integration, keeping one's own traditions brings benefits both to individuals and to society. A balance between the two is the best outcome for everyone.`,
  },
  {
    id: "t2-transport",
    task: 2,
    title: "Public transport or new roads",
    kind: "Opinion essay",
    prompt:
      "Governments should spend more money on improving public transport than on building new roads. To what extent do you agree or disagree?",
    minWords: 250,
    minutes: 40,
    tips: T2_TIPS,
    modelAnswer: `As cities grow, governments face difficult choices about how to spend limited transport budgets. I strongly agree that investing in public transport should take priority over building new roads, although some road investment will always be necessary.

The main argument for this view is that new roads rarely solve congestion for long. Transport experts have observed that when a road is widened, more people choose to drive, and within a few years the traffic is as heavy as before. By contrast, a fast and reliable train or bus service can move far more passengers using much less space. A single train, for instance, can carry over a thousand passengers, which would require hundreds of cars.

In addition, trains and buses bring environmental and social benefits. Vehicles are one of the largest sources of greenhouse gases, and encouraging people to leave their cars at home is one of the most effective ways to reduce emissions. A good network of buses and trains also helps those who cannot drive or afford a car, such as students, the elderly and those on low incomes, giving them access to jobs and services.

Nevertheless, the road network cannot be ignored completely. Rural areas, where buses are often impractical, depend on safe routes, and goods are still mainly delivered by lorry. Existing highways also need to be maintained, because potholes and damaged bridges are dangerous. Therefore, governments should continue to repair them while avoiding expensive new road-building projects in cities.

In conclusion, I believe that public transport deserves the larger share of investment, because it is more efficient, cleaner and fairer than building new motorways. Spending on roads should focus on maintenance and on rural areas where there is no realistic alternative.`,
  },
  {
    id: "t2-selfemployed",
    task: 2,
    title: "Working for yourself",
    kind: "Advantages / disadvantages essay",
    prompt:
      "More and more people are choosing to work for themselves rather than for a company. Do the advantages of this outweigh the disadvantages?",
    minWords: 250,
    minutes: 40,
    tips: T2_TIPS,
    modelAnswer: `In recent years, the number of self-employed workers has risen steadily, helped by the internet and changing attitudes to work. Although working for yourself has some significant drawbacks, I believe that the advantages outweigh them for most of those who choose this path.

The most obvious advantage is freedom. Self-employed people can decide when and where they work, which allows them to balance their job with family life or other interests. A graphic designer, for example, might work in the evenings so that she can look after her children during the day. Furthermore, freelancers can choose projects they find meaningful, and they keep all the profit from their success, rather than seeing it go to an employer.

However, self-employment also brings real risks. Income can be unpredictable, especially at the beginning, and there is no guaranteed salary at the end of the month. Self-employed workers do not usually receive paid holidays or sick pay, and they must arrange their own pension. In addition, working alone can be isolating, and the pressure of managing every part of a business, from accounts to marketing, can lead to long working hours.

On balance, these disadvantages can be reduced with careful planning. Many individuals start their own business part-time while keeping a regular job, and build up savings before making the change. Co-working spaces and online communities also help self-employed people to stay connected with others in their field.

In conclusion, while working for yourself involves financial uncertainty and fewer benefits, the independence and satisfaction it offers make it a worthwhile choice for those who prepare carefully. For this reason, I believe the advantages outweigh the disadvantages.`,
  },
  {
    id: "t2-retirement",
    task: 2,
    title: "Retiring later",
    kind: "Two-part question essay",
    prompt:
      "In many countries, people are working until a later age before they retire. Why is this happening? Is this a positive or negative development?",
    minWords: 250,
    minutes: 40,
    tips: T2_TIPS,
    modelAnswer: `In many parts of the world, it is becoming common for people to continue working into their late sixties or even seventies. This essay will examine the main reasons for this trend and argue that, on the whole, it is a positive development.

There are two main reasons why retirement is coming later. Firstly, people are living much longer and healthier lives than previous generations, which means that a pension must now last for twenty or thirty years. As a result, many governments have raised the official retirement age, and many individuals, who may have little savings, simply cannot afford to stop working at sixty. Secondly, the nature of work has changed. Fewer jobs involve heavy physical labour, so it is possible for employees to continue working comfortably in offices, schools and hospitals well into later life.

I believe this trend is largely positive. Older workers, who have valuable experience and skills, can pass this knowledge on to younger colleagues, which benefits employers. Working longer can also be good for the individual: research suggests that those who stay mentally and socially active tend to remain healthier, and many older adults enjoy the sense of purpose and routine that a job provides. If more citizens remain in work, there is also more tax revenue to pay for health care and pensions.

Although this is true for many, it is not true for everyone. Those in physically demanding jobs, such as construction workers or nurses, may find it very difficult to continue, and they should have the option to retire earlier or move into less demanding roles.

In conclusion, retirement is coming later mainly because we live longer and need their income to last. Provided that there is flexibility for those in physically demanding work, this is a positive change for individuals, employers and society as a whole.`,
  },
];
