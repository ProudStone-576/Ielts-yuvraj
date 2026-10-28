import type { ReadingTest } from "@/lib/types";

const HEADINGS = [
  { value: "i", label: "The economic value of honey production" },
  { value: "ii", label: "A response to a crisis in the countryside" },
  { value: "iii", label: "Why urban environments can suit bees" },
  { value: "iv", label: "The forgotten majority" },
  { value: "v", label: "Evidence of harmful competition" },
  { value: "vi", label: "How beekeepers train new members" },
  { value: "vii", label: "Changing official advice" },
  { value: "viii", label: "Practical steps for individuals" },
  { value: "ix", label: "The history of beekeeping in Europe" },
];

export const READING_TESTS: ReadingTest[] = [
  {
    id: "gt-1",
    title: "General Training Reading — Test 1",
    description: "Full test: 3 sections, 40 questions, 60 minutes.",
    sections: [
      {
        title: "Section 1",
        passages: [
          {
            title: "Westbrook Community Centre — Spring Programme",
            body: `A  Beginners' Pottery
Tuesdays, 7–9 pm, 8 weeks. $140, including all clay and glazes. Aprons are provided. To make sure everyone gets individual attention, the class is limited to 10 participants.

B  Conversational Spanish
Mondays, 6.30–8 pm, 10 weeks. $95. Suitable for complete beginners. The course book ($25) must be purchased separately from reception.

C  Family Cookery
Saturday mornings, 10 am–12 noon, 4 sessions. $60 per family. Children aged 8–14 must be accompanied by an adult. Please bring a container so that you can take home the dishes you prepare.

D  Digital Photography
Wednesdays, 7–9 pm, 6 weeks. $120. You will need your own camera; mobile phones are not suitable for this course. In the final week, students' best photographs will be displayed in an exhibition in the centre's café.

E  Yoga for Everyone
Thursdays 6–7 pm and Sundays 9–10 am. $12 per class, or $100 for a ten-class card, valid for three months. Mats are available to borrow, but please bring your own if possible.

Enrolment
You can enrol in person at reception or online. Centre members receive a 15% discount on all courses except yoga. Refunds are available up to seven days before a course begins.`,
          },
          {
            title: "Lost Property — Harbour City Transit",
            body: `Items found on our buses and trains are sent to the Central Lost Property Office at Kingsway Station within 48 hours. Items are kept for 30 days, after which they are donated to charity or recycled. Perishable items, such as food, are disposed of at the end of each day.

To make an enquiry, complete the online form, giving the route number and the approximate time you travelled. Alternatively, call 555 0192 between 9 am and 5 pm on weekdays.

When collecting an item, you must bring photo identification. A handling fee of $5 applies to all items except wallets, keys and travel cards, which are returned free of charge. If you are unable to collect an item in person, you may nominate a representative, who must bring a signed letter of authority from you. Items can also be posted to you for the cost of postage plus the handling fee.`,
          },
        ],
        groups: [
          {
            instructions:
              "Look at the information about the Westbrook Community Centre. Do the following statements agree with the information? Choose TRUE, FALSE or NOT GIVEN.",
            questions: [
              { id: "r1-1", type: "tfng", prompt: "There is a limit on the number of people who can join the pottery course.", answer: "TRUE" },
              { id: "r1-2", type: "tfng", prompt: "The fee for the Spanish course includes the course book.", answer: "FALSE" },
              { id: "r1-3", type: "tfng", prompt: "Participants in Family Cookery can take home the food they make.", answer: "TRUE" },
              { id: "r1-4", type: "tfng", prompt: "The photography course is suitable for people who only have a phone camera.", answer: "FALSE" },
              { id: "r1-5", type: "tfng", prompt: "Some students' photographs will be shown publicly at the end of the course.", answer: "TRUE" },
              { id: "r1-6", type: "tfng", prompt: "The yoga classes are taught by a qualified instructor.", answer: "NOT GIVEN" },
              { id: "r1-7", type: "tfng", prompt: "Centre members get a discount on the ten-class yoga card.", answer: "FALSE" },
            ],
          },
          {
            instructions:
              "Look at the notice about lost property. Answer the questions below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
            questions: [
              { id: "r1-8", type: "text", prompt: "At which station is the Lost Property Office?", answer: ["Kingsway", "Kingsway Station"] },
              { id: "r1-9", type: "text", prompt: "For how long are items kept before they are given away or recycled?", answer: ["30 days", "thirty days"] },
              { id: "r1-10", type: "text", prompt: "What kind of items are thrown away at the end of each day?", answer: ["perishable items", "perishable", "perishables"] },
              { id: "r1-11", type: "text", prompt: "Apart from the time of travel, what detail must be given on the online form?", answer: ["route number", "the route number"] },
              { id: "r1-12", type: "text", prompt: "What must you show when you collect an item?", answer: ["photo identification", "photo ID"] },
              { id: "r1-13", type: "text", prompt: "Name ONE type of item that is returned without a fee.", answer: ["wallets", "wallet", "keys", "key", "travel cards", "travel card"] },
              { id: "r1-14", type: "text", prompt: "What must a representative bring when collecting an item for someone else?", answer: ["signed letter", "a signed letter", "letter of authority"] },
            ],
          },
        ],
      },
      {
        title: "Section 2",
        passages: [
          {
            title: "Starting at Brightway Logistics: Leave and Absence",
            body: `Annual leave
Full-time employees are entitled to 20 days of paid annual leave per year, increasing to 25 days after five years of continuous service. Part-time staff receive leave on a pro-rata basis. Leave requests must be submitted through the staff portal at least four weeks in advance and are approved by your line manager.

During the peak period, from mid-November to early January, no more than two members of each team may be on leave at the same time. Up to five unused days can be carried over to the following year; any remaining days will be lost.

Sick leave
If you are unable to work because of illness, you must telephone your supervisor before your shift begins. Text messages and emails are not accepted. For absences of more than three consecutive days, a medical certificate is required. Employees receive ten days of paid sick leave per year.

Other leave
Staff may take up to three days of compassionate leave following the death of a close family member. Employees who are called for jury service will continue to receive their normal salary.`,
          },
          {
            title: "Safe Lifting in the Warehouse",
            body: `Back injuries are the most common cause of lost working time in our warehouses, and most of them can be prevented.

Before lifting, assess the load. Check its weight, which is printed on the label of most cartons, and look for sharp edges or loose straps. Loads over 25 kg must never be lifted by one person: use a trolley or forklift, or ask a colleague for help. Plan your route and clear any obstacles before you start.

When lifting, stand close to the load with your feet shoulder-width apart. Bend your knees rather than your back, and keep the load close to your waist. Avoid twisting your body; turn by moving your feet instead.

All new staff must attend a two-hour manual handling course in their first week, and refresher training is held every 12 months. Report any injury, however minor, to the first aid officer and record it in the incident book, which is kept in the staff room.`,
          },
        ],
        groups: [
          {
            instructions:
              "Complete the sentences below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER from the text for each answer.",
            questions: [
              { id: "r1-15", type: "text", prompt: "After five years, full-time staff are entitled to ______ of annual leave.", answer: ["25 days", "twenty-five days", "twenty five days"] },
              { id: "r1-16", type: "text", prompt: "Requests for leave are made using the ______.", answer: ["staff portal"] },
              { id: "r1-17", type: "text", prompt: "Leave must be approved by the employee's ______.", answer: ["line manager"] },
              { id: "r1-18", type: "text", prompt: "During the ______, only two people per team may be away.", answer: ["peak period"] },
              { id: "r1-19", type: "text", prompt: "A maximum of ______ unused days may be carried over.", answer: ["five", "5"] },
              { id: "r1-20", type: "text", prompt: "Employees who are ill must ______ their supervisor before their shift.", answer: ["telephone", "phone", "call"] },
              { id: "r1-21", type: "text", prompt: "A ______ is needed for absences of more than three days.", answer: ["medical certificate"] },
            ],
          },
          {
            instructions: "Choose the correct letter, A, B, C or D.",
            questions: [
              {
                id: "r1-22",
                type: "mcq",
                prompt: "What is the most common cause of lost working time?",
                options: ["slips and falls", "back injuries", "vehicle accidents", "cuts from sharp edges"],
                answer: "B",
              },
              {
                id: "r1-23",
                type: "mcq",
                prompt: "Where can staff usually find the weight of a load?",
                options: ["on the delivery note", "on the label", "in the warehouse system", "by asking a supervisor"],
                answer: "B",
              },
              {
                id: "r1-24",
                type: "mcq",
                prompt: "Loads over 25 kg",
                options: [
                  "should only be lifted by two people.",
                  "may be lifted alone if care is taken.",
                  "must not be lifted by one person.",
                  "must always be moved by forklift.",
                ],
                answer: "C",
              },
            ],
          },
          {
            instructions: "Answer the questions below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
            questions: [
              { id: "r1-25", type: "text", prompt: "What should workers bend when lifting, instead of their back?", answer: ["knees", "their knees"] },
              { id: "r1-26", type: "text", prompt: "How long is the manual handling course?", answer: ["two hours", "2 hours", "two-hour", "2-hour"] },
              { id: "r1-27", type: "text", prompt: "Where is the incident book kept?", answer: ["staff room", "the staff room", "staffroom"] },
            ],
          },
        ],
      },
      {
        title: "Section 3",
        passages: [
          {
            title: "Bees in the City",
            body: `A  In the past decade, rooftops in cities from London to Toronto have become home to an unlikely group of residents: honeybees. Hotels, office towers and even railway stations now keep hives, and amateur beekeeping associations report waiting lists for their training courses. What was once seen as a rural hobby has become a symbol of urban environmental awareness.

B  The trend began partly in response to alarming reports about the decline of bee populations. From the mid-2000s, beekeepers in North America and Europe recorded unexplained losses of entire colonies, a phenomenon that became known as colony collapse disorder. Pesticides, parasites such as the varroa mite, and the loss of wild flowers from farmland were all identified as contributing factors. Many city dwellers, wishing to help, concluded that adding more hives was the obvious answer.

C  Surprisingly, cities can be good places for bees. Urban gardens, parks and roadside verges often contain a wider variety of flowering plants than farmland, where a single crop may stretch for kilometres. Because many urban plants are ornamental species from around the world, they flower at different times, providing food from early spring until late autumn. Cities are also slightly warmer than the surrounding countryside, which allows bees to forage for longer each year. Some studies have even found that urban hives produce more honey than rural ones.

D  However, ecologists have begun to question whether the boom in honeybee keeping is actually helping. The honeybee is just one of more than 20,000 bee species worldwide, and most of these are wild, solitary bees that do not live in hives or produce honey. In Britain alone, there are over 250 species of wild bee. These species are often more effective pollinators of certain plants, and many are genuinely endangered — unlike the honeybee, which is managed and protected by beekeepers.

E  The concern is competition. A single honeybee colony can contain up to 50,000 workers in summer, and together they collect large quantities of nectar and pollen. Researchers in London found that in areas where hive density was highest, the amount of food available to wild bees had fallen significantly. A study in Paris reached a similar conclusion: as the number of hives in the city rose from about 300 to more than 700 over five years, the number of wild pollinators visiting flowers fell. Honeybees may also spread diseases to wild species.

F  Some cities have responded. In London, several local councils now advise residents against setting up new hives and instead encourage them to plant flowers. Beekeeping associations increasingly stress that the number of hives in an area should be matched to the food available. Meanwhile, companies that installed rooftop hives as part of their environmental programmes are being asked to fund wildflower meadows instead.

G  For those who want to help bees, experts suggest a range of simpler actions. Planting a variety of native flowers, leaving areas of lawn uncut, avoiding pesticides and providing nesting sites — such as "bee hotels" made from hollow stems — all benefit wild bees. As one ecologist put it, "If you want to save the bees, plant a garden, not a hive."`,
          },
        ],
        groups: [
          {
            instructions:
              "The passage has seven paragraphs, A–G. Choose the correct heading for paragraphs B–G from the list of headings below.",
            options: HEADINGS,
            questions: [
              { id: "r1-28", type: "select", prompt: "Paragraph B", answer: "ii" },
              { id: "r1-29", type: "select", prompt: "Paragraph C", answer: "iii" },
              { id: "r1-30", type: "select", prompt: "Paragraph D", answer: "iv" },
              { id: "r1-31", type: "select", prompt: "Paragraph E", answer: "v" },
              { id: "r1-32", type: "select", prompt: "Paragraph F", answer: "vii" },
              { id: "r1-33", type: "select", prompt: "Paragraph G", answer: "viii" },
            ],
          },
          {
            instructions: "Choose the correct letter, A, B, C or D.",
            questions: [
              {
                id: "r1-34",
                type: "mcq",
                prompt: "According to paragraph C, urban areas provide food for bees over a long period because",
                options: [
                  "there are more parks than farms.",
                  "plants from different places flower at different times.",
                  "city air is cleaner than country air.",
                  "gardeners often feed bees directly.",
                ],
                answer: "B",
              },
              {
                id: "r1-35",
                type: "mcq",
                prompt: "What does the writer say about the honeybee in paragraph D?",
                options: [
                  "It is the most effective pollinator of most plants.",
                  "It is not at risk in the way many wild bees are.",
                  "It is one of 250 species native to Britain.",
                  "It usually lives alone rather than in colonies.",
                ],
                answer: "B",
              },
              {
                id: "r1-36",
                type: "mcq",
                prompt: "The study in Paris found that",
                options: [
                  "honey production fell over five years.",
                  "most hives were affected by disease.",
                  "wild pollinators declined as hive numbers grew.",
                  "the number of hives in the city fell.",
                ],
                answer: "C",
              },
              {
                id: "r1-37",
                type: "mcq",
                prompt: "Companies with rooftop hives are now being encouraged to",
                options: [
                  "move their hives to the countryside.",
                  "pay for wildflower meadows.",
                  "stop using pesticides on their land.",
                  "give their honey to charity.",
                ],
                answer: "B",
              },
            ],
          },
          {
            instructions: "Complete the sentences below. Write NO MORE THAN THREE WORDS from the passage for each answer.",
            questions: [
              { id: "r1-38", type: "text", prompt: "The unexplained loss of colonies from the mid-2000s was named ______.", answer: ["colony collapse disorder"] },
              { id: "r1-39", type: "text", prompt: "One parasite that harms bees is the ______.", answer: ["varroa mite", "the varroa mite"] },
              { id: "r1-40", type: "text", prompt: "Nesting sites called bee hotels can be made from ______.", answer: ["hollow stems"] },
            ],
          },
        ],
      },
    ],
  },
];

export function getReadingTest(id: string) {
  return READING_TESTS.find((t) => t.id === id);
}
