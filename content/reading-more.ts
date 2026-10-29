import type { ReadingTest } from "@/lib/types";

const PARAS = (letters: string) => letters.split("").map((l) => ({ value: l, label: `Paragraph ${l}` }));

export const MORE_READING_TESTS: ReadingTest[] = [
  /* ======================================================================
     TEST 2
     ====================================================================== */
  {
    id: "gt-2",
    title: "General Training Reading — Test 2",
    description: "Swimming pools, library rules, a graduate scheme, home-working rules and the four-day week.",
    sections: [
      {
        title: "Section 1",
        passages: [
          {
            title: "Swimming in Westford: Five Local Pools",
            body: `A  Riverside Leisure Pool
Our 25-metre pool features a wave machine and two giant flumes, making it the most popular choice for families. Open 7 am–9 pm daily. Adults $6.50, children $3.50, under-fives free. Café on site. Please note that the pool is very busy at weekends.

B  Grange Park Lido
This outdoor 50-metre pool is heated to 24°C and is open from May to September only. Adults $5.00. Lockers require a $1 coin, which is returned. A large lawn is available for sunbathing.

C  Kingsmead Sports Centre
A 25-metre competition pool used for lane swimming only, with a separate diving pool and boards. Opens at 6 am on weekdays — ideal for swimmers who want to fit in their lengths before work. Adults $4.80.

D  St Anne's Hydrotherapy Pool
Water heated to 34°C, designed for people recovering from injury or living with arthritis. Sessions must be booked at least 24 hours in advance. A doctor's referral is not needed. $8.00 per session, including towel hire.

E  Hilltop Community Pool
A small 18-metre teaching pool offering lessons for children and adult beginners. Free parking. Closed on Mondays. Adults $3.50.`,
          },
          {
            title: "Northfield Library — Borrowing Rules",
            body: `Membership
Membership is free for anyone who lives, works or studies in Northfield. To join, bring a document showing your current address, such as a utility bill or bank statement. Children under 16 need a parent or guardian to sign their application form.

Borrowing
Members may borrow up to 12 items at a time. Books and audiobooks may be borrowed for three weeks, and DVDs for one week. Items can be renewed up to three times online, by phone or in person, unless another member has reserved them.

Late returns
There is no charge for overdue children's books. For all other items, a fee of 25 cents per day is charged, up to a maximum of $5 per item. Members with unpaid fees of over $10 cannot borrow until they have paid. Lost or damaged items must be paid for at the replacement cost.

Computers
The library offers free Wi-Fi and computer use for up to one hour per day. Computers can be booked in advance. Printing costs 15 cents per page in black and white.`,
          },
        ],
        groups: [
          {
            instructions:
              "Look at the information about five swimming pools, A–E. For which pool are the following statements true? You may use any letter more than once.",
            skill: "Matching information",
            options: [
              { value: "A", label: "Riverside Leisure Pool" },
              { value: "B", label: "Grange Park Lido" },
              { value: "C", label: "Kingsmead Sports Centre" },
              { value: "D", label: "St Anne's Hydrotherapy Pool" },
              { value: "E", label: "Hilltop Community Pool" },
            ],
            questions: [
              { id: "r2-1", type: "select", prompt: "It is only open for part of the year.", answer: "B" },
              { id: "r2-2", type: "select", prompt: "It has the cheapest adult entry.", answer: "E" },
              { id: "r2-3", type: "select", prompt: "Visitors must book before they go.", answer: "D" },
              { id: "r2-4", type: "select", prompt: "It has facilities for diving.", answer: "C" },
              { id: "r2-5", type: "select", prompt: "The price includes the use of a towel.", answer: "D" },
              { id: "r2-6", type: "select", prompt: "It suits people who want to swim lengths early in the morning.", answer: "C" },
              { id: "r2-7", type: "select", prompt: "It has attractions such as water slides.", answer: "A" },
            ],
          },
          {
            instructions:
              "Look at the library rules. Do the following statements agree with the information? Choose TRUE, FALSE or NOT GIVEN.",
            questions: [
              { id: "r2-8", type: "tfng", prompt: "People who work in Northfield but live elsewhere can join the library.", answer: "TRUE" },
              { id: "r2-9", type: "tfng", prompt: "A passport is required to join the library.", answer: "NOT GIVEN" },
              { id: "r2-10", type: "tfng", prompt: "DVDs can be borrowed for the same length of time as books.", answer: "FALSE" },
              { id: "r2-11", type: "tfng", prompt: "An item cannot be renewed if someone else has reserved it.", answer: "TRUE" },
              { id: "r2-12", type: "tfng", prompt: "Children are charged for returning books late.", answer: "FALSE" },
              { id: "r2-13", type: "tfng", prompt: "The maximum late fee for a single item is $10.", answer: "FALSE" },
              { id: "r2-14", type: "tfng", prompt: "Members can reserve a computer before they arrive.", answer: "TRUE" },
            ],
          },
        ],
      },
      {
        title: "Section 2",
        passages: [
          {
            title: "Coastline Energy — Graduate Trainee Programme",
            body: `Applications open on 1 February and close on 15 March. Applicants must hold, or expect to receive this year, a degree in engineering, science or business.

Stage 1: Online application
Complete the online form and upload your CV together with a covering letter of no more than one page.

Stage 2: Online tests
Shortlisted applicants complete two timed tests: numerical reasoning and situational judgement. Test results remain valid for 12 months.

Stage 3: Video interview
You will record answers to five questions. You will have 30 seconds to prepare each answer and up to two minutes to respond.

Stage 4: Assessment centre
Successful candidates spend a day at our head office in Aberdeen, taking part in a group exercise, a presentation and a final interview. Travel expenses are reimbursed.

The programme
Trainees rotate through three departments over two years, and each trainee is assigned a mentor from senior management. The starting salary is $52,000.`,
          },
          {
            title: "Halden Insurance — Guidelines for Working from Home",
            body: `Eligibility
Staff who have completed their six-month probation period may apply to work from home for up to two days per week. Requests should be discussed with your team leader and confirmed in writing.

Equipment
The company will provide a laptop, headset and second monitor. Staff are responsible for providing a suitable desk and chair, and must complete an online workstation assessment before they start working from home. A one-off allowance of $300 is available towards furniture.

Working hours
Home workers must be available during the core hours of 10 am to 3 pm. Outside these hours, staff may arrange their time flexibly, provided they complete their contracted hours.

Security
Confidential documents must not be printed at home. Always lock your screen when you are away from your computer, and use the company's VPN (secure network connection) at all times.

Expenses
The company does not contribute to home heating or electricity costs.`,
          },
        ],
        groups: [
          {
            instructions: "Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER from the text for each answer.",
            skill: "Note completion",
            questions: [
              { id: "r2-15", type: "text", prompt: "Closing date for applications: ______", answer: ["15 March", "March 15", "15th March"] },
              { id: "r2-16", type: "text", prompt: "Stage 1: upload CV and a one-page ______", answer: ["covering letter", "cover letter"] },
              { id: "r2-17", type: "text", prompt: "Stage 2: tests of ______ reasoning and situational judgement", answer: ["numerical"] },
              { id: "r2-18", type: "text", prompt: "Stage 3: ______ to prepare each answer", answer: ["30 seconds", "thirty seconds"] },
              { id: "r2-19", type: "text", prompt: "Stage 4: a day at the company's ______", answer: ["head office"] },
              { id: "r2-20", type: "text", prompt: "Every trainee has a ______ from senior management", answer: ["mentor"] },
            ],
          },
          {
            instructions: "Look at the home-working guidelines. Do the following statements agree with the information? Choose TRUE, FALSE or NOT GIVEN.",
            questions: [
              { id: "r2-21", type: "tfng", prompt: "New employees can work from home from their first day.", answer: "FALSE" },
              { id: "r2-22", type: "tfng", prompt: "Home-working arrangements must be confirmed in writing.", answer: "TRUE" },
              { id: "r2-23", type: "tfng", prompt: "The company supplies a desk and chair for home workers.", answer: "FALSE" },
              { id: "r2-24", type: "tfng", prompt: "Most staff choose to work from home for two days a week.", answer: "NOT GIVEN" },
            ],
          },
          {
            instructions: "Answer the questions below. Write NO MORE THAN THREE WORDS from the text for each answer.",
            questions: [
              { id: "r2-25", type: "text", prompt: "What must staff complete before they begin working from home?", answer: ["online workstation assessment", "workstation assessment", "an online workstation assessment"] },
              { id: "r2-26", type: "text", prompt: "What is the period from 10 am to 3 pm called?", answer: ["core hours", "the core hours"] },
              { id: "r2-27", type: "text", prompt: "What must staff use at all times to connect to the network?", answer: ["VPN", "the VPN", "the company's VPN", "secure network connection"] },
            ],
          },
        ],
      },
      {
        title: "Section 3",
        passages: [
          {
            title: "Is the Four-Day Week the Future of Work?",
            body: `A  For most of the twentieth century, the five-day, forty-hour week was treated as a fixed feature of working life. Yet it is a relatively recent invention. In the early 1800s, factory employees in Britain commonly worked six days a week, often for more than twelve hours a day. It was only in 1926 that the American industrialist Henry Ford introduced a five-day week in his factories, reasoning that workers with more leisure time would buy more consumer goods — including his cars.

B  Today, a growing number of organisations are asking whether the next step should be a four-day week. The most common model, sometimes called "100-80-100", gives employees 100 per cent of their pay for 80 per cent of their time, in return for a commitment to maintain 100 per cent of their productivity. This is different from compressed hours, in which staff work the same total number of hours over four longer days.

C  The largest trial so far took place in the UK in 2022, when 61 companies employing around 2,900 people reduced working time for six months. Researchers found that revenue stayed broadly the same, while the number of staff leaving fell by more than half. Employees reported lower levels of stress and fatigue, and the number of sick days dropped by around two-thirds. At the end of the trial, 56 of the 61 companies chose to continue, and 18 made the change permanent.

D  Supporters argue that these results reflect a simple truth: much of the traditional working week is not productive. Long meetings, constant email and unnecessary interruptions take up a large share of the day. When time is limited, teams are forced to cut out these activities. Several participating firms reduced the length of meetings to thirty minutes and introduced periods of "focus time", during which colleagues were not allowed to disturb one another.

E  Critics, however, point out that the trial was voluntary, and that the companies which chose to take part were likely to be those best suited to the change — mostly small firms in marketing, technology and professional services. In sectors such as healthcare, education and retail, where work depends on people being physically present for fixed hours, reducing working time without reducing output is far more difficult. A hospital cannot simply close its wards on Fridays; it would need to employ more staff, which would increase its costs.

F  There are also concerns about the effect on employees themselves. Some workers in the trial reported that fitting five days of work into four made their days more intense, and a minority found it harder to switch off. Others worried that the arrangement could be withdrawn if the company's performance declined, leaving them with an uncertain future.

G  In my view, the evidence so far is encouraging but not conclusive. The four-day week clearly works for some organisations, and the benefits for wellbeing are hard to ignore. But it is unlikely to become universal in the near future. A more realistic outcome is that it becomes one option among several, alongside flexible hours and remote work, that employers use to attract and keep the best staff.`,
          },
        ],
        groups: [
          {
            instructions: "The passage has seven paragraphs, A–G. Which paragraph contains the following information? You may use any letter more than once.",
            skill: "Matching information",
            options: PARAS("ABCDEFG"),
            questions: [
              { id: "r2-28", type: "select", prompt: "a description of a working pattern that is not the same as the 100-80-100 model", answer: "B" },
              { id: "r2-29", type: "select", prompt: "the original reason for introducing a shorter working week", answer: "A" },
              { id: "r2-30", type: "select", prompt: "examples of changes companies made to save time", answer: "D" },
              { id: "r2-31", type: "select", prompt: "figures showing improvements in staff health", answer: "C" },
              { id: "r2-32", type: "select", prompt: "a reason why some employees felt anxious about the future", answer: "F" },
            ],
          },
          {
            instructions: "Do the following statements agree with the views of the writer? Choose YES, NO or NOT GIVEN.",
            questions: [
              { id: "r2-33", type: "ynng", prompt: "The five-day week has existed for a relatively short time.", answer: "YES" },
              { id: "r2-34", type: "ynng", prompt: "The benefits of the four-day week for employees' wellbeing are significant.", answer: "YES" },
              { id: "r2-35", type: "ynng", prompt: "Most employers will soon adopt the four-day week.", answer: "NO" },
              { id: "r2-36", type: "ynng", prompt: "Governments should pay companies to try a four-day week.", answer: "NOT GIVEN" },
            ],
          },
          {
            instructions: "Complete the summary below. Write ONE WORD ONLY from the passage for each answer.",
            skill: "Summary completion",
            questions: [
              { id: "r2-37", type: "text", prompt: "In the UK trial, company ______ remained roughly the same, and fewer staff left.", answer: ["revenue"] },
              { id: "r2-38", type: "text", prompt: "The model may be hard to introduce where staff must be physically ______ for fixed hours.", answer: ["present"] },
              { id: "r2-39", type: "text", prompt: "A hospital would need more staff, which would raise its ______.", answer: ["costs"] },
              { id: "r2-40", type: "text", prompt: "Some employees found that their working days became more ______.", answer: ["intense"] },
            ],
          },
        ],
      },
    ],
  },

  /* ======================================================================
     TEST 3
     ====================================================================== */
  {
    id: "gt-3",
    title: "General Training Reading — Test 3",
    description: "Car hire, local restaurants, uniform rules, accident reporting and the science of forgetting.",
    sections: [
      {
        title: "Section 1",
        passages: [
          {
            title: "City Car Hire — Important Information for Customers",
            body: `Drivers must be at least 21 years old and have held a full driving licence for a minimum of two years. Drivers aged 21–24 pay a young driver surcharge of $15 per day.

When collecting the vehicle, you will need your driving licence and a credit card in the main driver's name. Debit cards are not accepted for the security deposit.

All vehicles are supplied with a full tank of fuel and must be returned full. If not, we will charge for the fuel needed plus a $20 refuelling fee.

Basic insurance is included in the price. You can reduce the amount you would have to pay in the event of damage by purchasing our Excess Protection for $12 per day.

Additional drivers can be added at a cost of $8 per driver per day. They must also show their licence when the car is collected.

Vehicles may be returned to any of our city branches; returning a vehicle to the airport branch incurs a $30 charge. Late returns are charged at the full daily rate.`,
          },
          {
            title: "Where to Eat in Marsden",
            body: `A  The Olive Tree
Mediterranean dishes served on an outdoor terrace overlooking the harbour. Open for lunch and dinner. Booking is essential at weekends. Set lunch $18.

B  Spice Route
Indian cuisine, including a vegetarian menu of more than 20 dishes. Takeaway available, with free home delivery within 5 km. Closed on Tuesdays.

C  Harbour Fish Bar
Classic fish and chips from a restaurant run by the Moretti family since 1962. No reservations. Children's portions are half price.

D  Café Lumière
A French bakery and café, open from 7 am for breakfast. Free Wi-Fi. Closes at 4 pm.

E  The Granary
Modern European cooking in a converted 18th-century barn. Live jazz every Friday night. A private dining room seats up to 20 guests.`,
          },
        ],
        groups: [
          {
            instructions: "Look at the information about car hire. Do the following statements agree with the information? Choose TRUE, FALSE or NOT GIVEN.",
            questions: [
              { id: "r3-1", type: "tfng", prompt: "A 20-year-old with a full licence can hire a car.", answer: "FALSE" },
              { id: "r3-2", type: "tfng", prompt: "Customers can pay the security deposit with a debit card.", answer: "FALSE" },
              { id: "r3-3", type: "tfng", prompt: "Cars are given to customers with a full tank of fuel.", answer: "TRUE" },
              { id: "r3-4", type: "tfng", prompt: "Excess Protection is included in the basic price.", answer: "FALSE" },
              { id: "r3-5", type: "tfng", prompt: "Additional drivers need to show their licence.", answer: "TRUE" },
              { id: "r3-6", type: "tfng", prompt: "Most customers choose to buy Excess Protection.", answer: "NOT GIVEN" },
              { id: "r3-7", type: "tfng", prompt: "Returning a car to the airport costs extra.", answer: "TRUE" },
            ],
          },
          {
            instructions: "Look at the information about restaurants, A–E. Which restaurant mentions the following? You may use any letter more than once.",
            skill: "Matching information",
            options: [
              { value: "A", label: "The Olive Tree" },
              { value: "B", label: "Spice Route" },
              { value: "C", label: "Harbour Fish Bar" },
              { value: "D", label: "Café Lumière" },
              { value: "E", label: "The Granary" },
            ],
            questions: [
              { id: "r3-8", type: "select", prompt: "It has been owned by the same family for decades.", answer: "C" },
              { id: "r3-9", type: "select", prompt: "It offers a delivery service.", answer: "B" },
              { id: "r3-10", type: "select", prompt: "It would suit a group wanting a private celebration.", answer: "E" },
              { id: "r3-11", type: "select", prompt: "It serves food early in the morning.", answer: "D" },
              { id: "r3-12", type: "select", prompt: "It has a view of the water.", answer: "A" },
              { id: "r3-13", type: "select", prompt: "It offers reduced prices for children.", answer: "C" },
              { id: "r3-14", type: "select", prompt: "It has live music.", answer: "E" },
            ],
          },
        ],
      },
      {
        title: "Section 2",
        passages: [
          {
            title: "Greenway Supermarkets — Uniform and Appearance",
            body: `All store staff are provided with three shirts and two fleeces free of charge. Replacement items can be ordered through your store manager; the cost will be deducted from your wages unless the item was damaged at work.

Staff must provide their own black trousers or skirt and black, closed-toe shoes with non-slip soles.

Name badges must be worn at all times on the shop floor.

Long hair must be tied back in food preparation areas, and staff working on the deli or bakery counters must also wear a hat.

Jewellery should be kept to a minimum: a wedding ring and small stud earrings are acceptable.

Uniform must not be worn outside work, except when travelling directly to or from the store.`,
          },
          {
            title: "Reporting an Accident at Work",
            body: `If an accident happens at work, first make sure the area is safe and get help from a qualified first aider. A list of first aiders is displayed next to every fire exit. If the injury is serious, call an ambulance immediately — do not wait for a manager.

Once the injured person has been looked after, the accident must be recorded in the accident book, which is kept at the main reception desk. The record should include the date, time and location of the accident, a description of what happened, and the names of any witnesses.

Your supervisor will then carry out an investigation within five working days to find out the cause and prevent it from happening again.

Accidents which result in an employee being off work for more than seven days must be reported to the Health and Safety Executive.`,
          },
        ],
        groups: [
          {
            instructions: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the text for each answer.",
            skill: "Sentence completion",
            questions: [
              { id: "r3-15", type: "text", prompt: "New staff receive three shirts and two ______.", answer: ["fleeces"] },
              { id: "r3-16", type: "text", prompt: "Replacement uniform is ordered from the ______.", answer: ["store manager"] },
              { id: "r3-17", type: "text", prompt: "Shoes must have ______ soles.", answer: ["non-slip", "non slip"] },
              { id: "r3-18", type: "text", prompt: "Staff must wear ______ whenever they are on the shop floor.", answer: ["name badges", "a name badge", "name badge"] },
              { id: "r3-19", type: "text", prompt: "Staff on the bakery counter must wear a ______.", answer: ["hat"] },
              { id: "r3-20", type: "text", prompt: "A wedding ring and small ______ are allowed.", answer: ["stud earrings", "earrings"] },
              { id: "r3-21", type: "text", prompt: "Uniform may be worn when ______ directly to or from work.", answer: ["travelling", "traveling"] },
            ],
          },
          {
            instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER from the text for each answer.",
            skill: "Note completion",
            questions: [
              { id: "r3-22", type: "text", prompt: "List of first aiders: displayed next to each fire ______", answer: ["exit"] },
              { id: "r3-23", type: "text", prompt: "Serious injury: call an ______ at once", answer: ["ambulance"] },
              { id: "r3-24", type: "text", prompt: "Accident book: kept at the main ______ desk", answer: ["reception"] },
              { id: "r3-25", type: "text", prompt: "Record must include the names of any ______", answer: ["witnesses"] },
              { id: "r3-26", type: "text", prompt: "Supervisor investigates within ______ working days", answer: ["five", "5"] },
              { id: "r3-27", type: "text", prompt: "Absences of more than ______ days are reported to the HSE", answer: ["seven", "7"] },
            ],
          },
        ],
      },
      {
        title: "Section 3",
        passages: [
          {
            title: "Why Do We Forget?",
            body: `A  Most of us have walked into a room and immediately forgotten why we went there. Forgetting is usually seen as a failure — a sign that our memories are unreliable. But a growing body of research suggests that forgetting is not simply a weakness of the brain; it may be an essential part of how memory works.

B  The scientific study of forgetting began in the 1880s with the German psychologist Hermann Ebbinghaus. Using himself as the only subject, he memorised lists of meaningless syllables, such as "DAX" and "BOK", and tested how many he could recall after different periods of time. He found that memory declines rapidly at first: within an hour, he had forgotten more than half of what he had learned. After that, the rate of forgetting slowed considerably. This pattern became known as the "forgetting curve".

C  Ebbinghaus also discovered that reviewing material at intervals greatly reduced the amount forgotten. Each time he relearned a list, it took less effort, and the memory lasted longer. Today this principle, known as spaced repetition, is the basis of many language-learning apps, which schedule reviews of vocabulary just before a learner is likely to forget it.

D  For much of the twentieth century, psychologists believed that forgetting happened because memories simply faded over time. However, experiments in the 1950s by the American researcher Benton Underwood challenged this idea. He showed that much forgetting is caused by interference: new information makes it harder to retrieve older information, and old information can block the learning of new. A person who has moved house several times, for example, may struggle to remember which address belongs to which period of their life.

E  More recently, neuroscientists have argued that forgetting is an active process. The Canadian researcher Paul Frankland has suggested that the brain deliberately weakens connections between neurons to remove unnecessary detail. In his view, the purpose of memory is not to store everything accurately, but to help us make good decisions. Forgetting irrelevant details allows us to generalise from experience — to remember that dogs can bite, for instance, without recalling every dog we have ever met.

F  Sleep also appears to play an important role. Studies by the American scientist Matthew Walker indicate that during deep sleep the brain replays the day's experiences, strengthening important memories while allowing others to fade. People who are deprived of sleep after learning something new remember significantly less of it, even after they have caught up on rest.

G  None of this means that forgetting is always harmless. Conditions such as dementia cause severe memory loss that has a devastating effect on people's lives. But for healthy people, an occasional lapse — a forgotten name or a missed appointment — may be a sign that the brain is doing exactly what it was designed to do.`,
          },
        ],
        groups: [
          {
            instructions: "The passage has seven paragraphs, A–G. Choose the correct heading for paragraphs B–G from the list of headings below.",
            options: [
              { value: "i", label: "The limits of a long-held explanation" },
              { value: "ii", label: "An experiment that measured memory loss" },
              { value: "iii", label: "How rest helps the brain sort information" },
              { value: "iv", label: "A method that slows the loss of memories" },
              { value: "v", label: "Forgetting as a useful process" },
              { value: "vi", label: "The reasons people remember faces" },
              { value: "vii", label: "A reminder that memory loss can be serious" },
              { value: "viii", label: "Why some people have better memories than others" },
              { value: "ix", label: "The cost of memory training" },
            ],
            questions: [
              { id: "r3-28", type: "select", prompt: "Paragraph B", answer: "ii" },
              { id: "r3-29", type: "select", prompt: "Paragraph C", answer: "iv" },
              { id: "r3-30", type: "select", prompt: "Paragraph D", answer: "i" },
              { id: "r3-31", type: "select", prompt: "Paragraph E", answer: "v" },
              { id: "r3-32", type: "select", prompt: "Paragraph F", answer: "iii" },
              { id: "r3-33", type: "select", prompt: "Paragraph G", answer: "vii" },
            ],
          },
          {
            instructions: "Match each finding with the correct researcher, A–D. You may use any letter more than once.",
            skill: "Matching features",
            options: [
              { value: "A", label: "Hermann Ebbinghaus" },
              { value: "B", label: "Benton Underwood" },
              { value: "C", label: "Paul Frankland" },
              { value: "D", label: "Matthew Walker" },
            ],
            questions: [
              { id: "r3-34", type: "select", prompt: "Learning new information can make older memories harder to access.", answer: "B" },
              { id: "r3-35", type: "select", prompt: "Most forgetting happens soon after learning.", answer: "A" },
              { id: "r3-36", type: "select", prompt: "Losing detail helps people apply lessons from experience.", answer: "C" },
              { id: "r3-37", type: "select", prompt: "A lack of sleep after studying reduces what is remembered.", answer: "D" },
            ],
          },
          {
            instructions: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            skill: "Sentence completion",
            questions: [
              { id: "r3-38", type: "text", prompt: "Ebbinghaus tested himself using lists of ______.", answer: ["meaningless syllables", "syllables"] },
              { id: "r3-39", type: "text", prompt: "Many language-learning apps are based on ______.", answer: ["spaced repetition"] },
              { id: "r3-40", type: "text", prompt: "During ______, the brain replays the experiences of the day.", answer: ["deep sleep"] },
            ],
          },
        ],
      },
    ],
  },

  /* ======================================================================
     TEST 4
     ====================================================================== */
  {
    id: "gt-4",
    title: "General Training Reading — Test 4",
    description: "Summer programmes, waste collection, a complaints procedure, parental leave and Europe's night trains.",
    sections: [
      {
        title: "Section 1",
        passages: [
          {
            title: "Fairview Council — Summer Programmes for Teenagers",
            body: `A  Junior Lifeguard Course
Ages 13–16. Participants must be able to swim 200 metres. Two weeks of morning sessions at Fairview Aquatic Centre. $90, including an official certificate on completion.

B  Film-Making Workshop
Ages 14–17. Work in a small team to make a short film in five days. Cameras and editing software are provided. Films are shown to families at a screening on the final evening. $120.

C  Outdoor Adventure Week
Ages 12–15. Kayaking, rock climbing and camping, including two nights away. Transport from the town hall is included. $250. A form signed by a doctor must be returned before the start date.

D  Coding Club
Ages 11–14. Learn to build a simple computer game. Laptops are provided. Tuesday and Thursday afternoons for four weeks. Free of charge, thanks to funding from a local technology company.

E  Volunteer Ranger Programme
Ages 15–18. Help to maintain walking trails in Fairview National Park. Hours count towards the volunteering requirement for the school leaving certificate. Lunch provided. No charge.`,
          },
          {
            title: "Changes to Household Waste Collection — from 1 July",
            body: `From 1 July, Fairview Council is introducing a new collection system.

General waste (the green bin) will be collected every two weeks instead of every week. Recycling (the blue bin) will continue to be collected every two weeks, on alternate weeks to general waste.

A new weekly food waste collection will begin, using the small brown caddy which will be delivered to every household during June. Food waste should be placed in the compostable liners provided; plastic bags must not be used. Extra liners can be collected free of charge from any library.

Garden waste collection is an optional service costing $45 per year. To register, visit the council website before 30 June.

Bins should be placed at the edge of your property by 7 am on collection day. Collections missed because a bin was put out late will not be returned for.`,
          },
        ],
        groups: [
          {
            instructions: "Look at the summer programmes, A–E. Which programme mentions the following? You may use any letter more than once.",
            skill: "Matching information",
            options: [
              { value: "A", label: "Junior Lifeguard Course" },
              { value: "B", label: "Film-Making Workshop" },
              { value: "C", label: "Outdoor Adventure Week" },
              { value: "D", label: "Coding Club" },
              { value: "E", label: "Volunteer Ranger Programme" },
            ],
            questions: [
              { id: "r4-1", type: "select", prompt: "Participants spend nights away from home.", answer: "C" },
              { id: "r4-2", type: "select", prompt: "It is paid for by a business.", answer: "D" },
              { id: "r4-3", type: "select", prompt: "Participants need a particular physical ability before they join.", answer: "A" },
              { id: "r4-4", type: "select", prompt: "Participants receive a qualification.", answer: "A" },
              { id: "r4-5", type: "select", prompt: "Relatives are invited to see what participants have made.", answer: "B" },
              { id: "r4-6", type: "select", prompt: "It can help participants meet a school requirement.", answer: "E" },
              { id: "r4-7", type: "select", prompt: "Participants need medical approval.", answer: "C" },
            ],
          },
          {
            instructions: "Answer the questions below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER from the text for each answer.",
            questions: [
              { id: "r4-8", type: "text", prompt: "What colour is the bin for general waste?", answer: ["green", "the green bin", "green bin"] },
              { id: "r4-9", type: "text", prompt: "Which colour bin's collection frequency is not changing?", answer: ["blue", "blue bin", "the blue bin"] },
              { id: "r4-10", type: "text", prompt: "In which month will food caddies be delivered?", answer: ["June"] },
              { id: "r4-11", type: "text", prompt: "What should food waste be put in?", answer: ["compostable liners", "liners"] },
              { id: "r4-12", type: "text", prompt: "Where can extra liners be collected?", answer: ["any library", "library", "a library"] },
              { id: "r4-13", type: "text", prompt: "How much does the garden waste service cost per year?", answer: ["$45", "45", "45 dollars"] },
              { id: "r4-14", type: "text", prompt: "By what time must bins be put out on collection day?", answer: ["7 am", "7am", "7 a.m.", "7"] },
            ],
          },
        ],
      },
      {
        title: "Section 2",
        passages: [
          {
            title: "Brightline Telecom — Handling Customer Complaints",
            body: `Step 1: Listen to the customer without interrupting and apologise for the inconvenience. An apology is not the same as admitting fault.

Step 2: Record the complaint on the customer system, including the customer's account number and a summary of the problem.

Step 3: If you can resolve the issue immediately, do so, and confirm the solution with the customer by email.

Step 4: If not, give the customer a reference number and tell them they will receive a response within three working days. Pass the complaint to the Customer Resolution Team.

Step 5: If the customer is still unhappy after receiving the response, they may ask for the complaint to be reviewed by a senior manager.

Compensation
Front-line staff may offer a credit of up to $20 to the customer's account. Larger amounts must be approved by a team leader.`,
          },
          {
            title: "Parental Leave — A Guide for Employees",
            body: `Employees who have worked for the company for at least 26 weeks by the 15th week before the baby is due are entitled to up to 52 weeks of parental leave. The first 6 weeks are paid at 90 per cent of your normal salary, followed by 33 weeks at the statutory rate. The remaining weeks are unpaid.

You must tell your manager in writing at least 15 weeks before the expected week of birth, stating the date you intend to start your leave. You can change your start date, provided you give 28 days' notice.

Partners are entitled to two weeks of paid leave, which must be taken within 8 weeks of the birth.

During leave, you will continue to build up annual leave, and you may work up to 10 "keeping in touch" days without affecting your pay. Employees adopting a child have the same rights as birth parents.`,
          },
        ],
        groups: [
          {
            instructions: "Complete the flow chart notes below. Write ONE WORD AND/OR A NUMBER from the text for each answer.",
            skill: "Note completion",
            questions: [
              { id: "r4-15", type: "text", prompt: "Apologise — this does not mean admitting ______", answer: ["fault"] },
              { id: "r4-16", type: "text", prompt: "Record the customer's account ______ and a summary", answer: ["number"] },
              { id: "r4-17", type: "text", prompt: "If solved at once, confirm by ______", answer: ["email", "e-mail"] },
              { id: "r4-18", type: "text", prompt: "If not, give the customer a ______ number", answer: ["reference"] },
              { id: "r4-19", type: "text", prompt: "Customer receives a response within ______ working days", answer: ["three", "3"] },
              { id: "r4-20", type: "text", prompt: "Credits over $20 must be approved by a team ______", answer: ["leader"] },
            ],
          },
          {
            instructions: "Look at the guide to parental leave. Do the following statements agree with the information? Choose TRUE, FALSE or NOT GIVEN.",
            questions: [
              { id: "r4-21", type: "tfng", prompt: "All new employees are entitled to parental leave.", answer: "FALSE" },
              { id: "r4-22", type: "tfng", prompt: "The whole period of parental leave is paid.", answer: "FALSE" },
              { id: "r4-23", type: "tfng", prompt: "Employees must inform their manager in writing.", answer: "TRUE" },
              { id: "r4-24", type: "tfng", prompt: "Once chosen, the start date of leave cannot be changed.", answer: "FALSE" },
              { id: "r4-25", type: "tfng", prompt: "Most partners take the full two weeks of leave.", answer: "NOT GIVEN" },
              { id: "r4-26", type: "tfng", prompt: "Employees on parental leave continue to earn annual leave.", answer: "TRUE" },
              { id: "r4-27", type: "tfng", prompt: "Adoptive parents receive less leave than birth parents.", answer: "FALSE" },
            ],
          },
        ],
      },
      {
        title: "Section 3",
        passages: [
          {
            title: "The Return of the Night Train",
            body: `A  Twenty years ago, the overnight sleeper train seemed to be heading for extinction in Europe. Budget airlines were offering flights between major cities for less than the price of a meal, and high-speed rail lines were cutting daytime journey times. One by one, national rail operators withdrew their night services, arguing that they were expensive to run and attracted too few passengers. In 2016, Germany's national operator, Deutsche Bahn, ended its last remaining sleeper routes.

B  Yet in the past decade, night trains have made a remarkable comeback. The Austrian operator ÖBB, which took over many of the routes abandoned by Deutsche Bahn, now runs services connecting Vienna with cities including Paris, Amsterdam, Hamburg, Rome and Brussels. New private companies have also entered the market, and in 2023 a service between Brussels and Berlin was launched by a start-up.

C  The main driving force behind this revival has been concern about climate change. A journey by night train produces a fraction of the carbon emissions of the equivalent flight — in some cases less than a tenth. A growing number of travellers, particularly younger ones, say they are willing to spend more time travelling in order to reduce their environmental impact. In Sweden, the word "flygskam", or "flight shame", became widely used to describe the guilt some people feel about flying.

D  Night trains also offer practical advantages. Because passengers sleep during the journey, travel time is not wasted, and they arrive in the city centre in the morning, ready for a meeting or a day of sightseeing, without paying for a hotel. Airports, by contrast, are usually located outside cities, and the time needed for security checks can make a short flight surprisingly long.

E  However, the night train faces serious challenges. Sleeper carriages are expensive to build, and because each passenger needs a bed, a night train carries far fewer people than a day train of the same length. Operators must also pay fees for every kilometre of track they use, and these charges vary widely between countries. Crossing several borders can therefore make tickets costly: a sleeper compartment is often more expensive than a flight.

F  Reliability is another concern. Many night services share tracks with freight trains and are delayed by engineering work, which is usually carried out at night. In 2023, a significant proportion of ÖBB's international night trains arrived more than an hour late, leading to complaints from passengers.

G  Whether night trains can become a mainstream alternative to flying may depend on government support. The European Union has committed to doubling cross-border rail traffic by 2030, and some governments have begun to subsidise new routes. In my opinion, such support is justified: if governments are serious about reducing emissions from transport, they cannot rely on travellers' good intentions alone. Night trains must become cheaper and more reliable before most people will choose them over a plane.`,
          },
        ],
        groups: [
          {
            instructions: "Choose the correct letter, A, B, C or D.",
            questions: [
              {
                id: "r4-28",
                type: "mcq",
                prompt: "Why did rail operators stop running night trains?",
                options: ["competition from new motorways", "low passenger numbers and high costs", "concerns about passenger safety", "a shortage of sleeper carriages"],
                answer: "B",
              },
              {
                id: "r4-29",
                type: "mcq",
                prompt: "What does the writer say about ÖBB?",
                options: ["It was founded in 2016.", "It took over routes that another operator had given up.", "It only runs services within Austria.", "It is a private start-up company."],
                answer: "B",
              },
              {
                id: "r4-30",
                type: "mcq",
                prompt: 'In paragraph C, "flygskam" refers to',
                options: ["a Swedish airline.", "a feeling of guilt about flying.", "a type of rail ticket.", "a tax on air travel."],
                answer: "B",
              },
              {
                id: "r4-31",
                type: "mcq",
                prompt: "Which advantage of night trains is mentioned in paragraph D?",
                options: ["cheaper food on board", "more comfortable seats", "arriving in the city centre", "faster security checks"],
                answer: "C",
              },
            ],
          },
          {
            instructions: "Do the following statements agree with the views of the writer? Choose YES, NO or NOT GIVEN.",
            questions: [
              { id: "r4-32", type: "ynng", prompt: "Night trains were close to disappearing in Europe twenty years ago.", answer: "YES" },
              { id: "r4-33", type: "ynng", prompt: "Only young travellers are interested in night trains.", answer: "NO" },
              { id: "r4-34", type: "ynng", prompt: "Night trains are more comfortable than aeroplanes.", answer: "NOT GIVEN" },
              { id: "r4-35", type: "ynng", prompt: "Government funding for night trains is justified.", answer: "YES" },
              { id: "r4-36", type: "ynng", prompt: "Travellers' good intentions will be enough to make night trains popular.", answer: "NO" },
            ],
          },
          {
            instructions: "Complete the summary using the list of words, A–H, below.",
            skill: "Summary completion",
            options: [
              { value: "A", label: "build" },
              { value: "B", label: "fees" },
              { value: "C", label: "reliable" },
              { value: "D", label: "engineering work" },
              { value: "E", label: "repair" },
              { value: "F", label: "taxes" },
              { value: "G", label: "comfortable" },
              { value: "H", label: "bad weather" },
            ],
            questions: [
              { id: "r4-37", type: "select", prompt: "Sleeper carriages cost a lot to ______, and carry fewer passengers than day trains.", answer: "A" },
              { id: "r4-38", type: "select", prompt: "Operators pay ______ for using the track, which differ between countries.", answer: "B" },
              { id: "r4-39", type: "select", prompt: "Services are often delayed because of ______ carried out at night.", answer: "D" },
              { id: "r4-40", type: "select", prompt: "Unless trains become cheaper and more ______, most people will continue to fly.", answer: "C" },
            ],
          },
        ],
      },
    ],
  },
];
