import type { ReadingTest } from "@/lib/types";

const PARAS = (letters: string) => letters.split("").map((l) => ({ value: l, label: `Paragraph ${l}` }));

export const NEW_READING_TESTS: ReadingTest[] = [
  /* ======================================================================
     TEST 5
     ====================================================================== */
  {
    id: "gt-5",
    title: "General Training Reading — Test 5",
    description: "Five local gyms, a bulky waste collection service, flexible working, a staff travel scheme and an article on light pollution.",
    sections: [
      {
        title: "Section 1",
        passages: [
          {
            title: "Five Gyms in Eastfield",
            body: `A  Fitness First Eastfield
Open 24 hours a day, every day of the year. Monthly membership is $49, with no joining fee. The gym has more than 120 machines, but there are no group classes. Members can bring a friend free of charge once a month.

B  The Boxing Club
A small, friendly gym above the hardware shop on Mill Street. Membership is $35 a month, and boxing classes for all levels are included. The gym is closed on Sundays. Gloves can be borrowed, but members must buy their own hand wraps.

C  Eastfield Leisure Centre
Run by the city council. The gym is part of a larger centre with a 25-metre swimming pool. Membership costs $55 a month and includes the pool. There are reduced prices for students and people over 65. New members must attend a free induction session before using the equipment.

D  Studio Balance
A women-only gym offering yoga, pilates and strength classes. Membership is $65 a month. A crèche is available on weekday mornings, so parents of young children can exercise while their children are looked after.

E  Peak Performance
Specialises in personal training. There is no monthly membership: clients pay $60 per one-hour session with a trainer. Every new client receives a free fitness test, and the gym is popular with people recovering from injuries.`,
          },
          {
            title: "Greenhill Council — Bulky Waste Collection",
            body: `Large household items that do not fit in your normal bin, such as furniture, mattresses and fridges, can be collected from your home by our bulky waste service.

How to book
Bookings can be made online or by phoning the council on 555 0140. You will need to list every item you want collected; our crew will only take the items on your booking. Collections take place on Tuesdays and Fridays.

Cost
The charge is $30 for up to three items, and $8 for each additional item. Fridges and freezers cost $20 each, because they contain gases that must be removed safely. Residents who receive a pension pay half price.

On the day of collection
Items must be left outside your property, next to the road, by 7 am. Our crew cannot enter homes or gardens. Please do not put items out more than one day before your collection, as they can block pavements.

What we cannot take
We cannot collect building materials, such as bricks or tiles, or garden waste. Building materials can be taken to the Recycling Centre on Dock Road, which is open seven days a week.`,
          },
        ],
        groups: [
          {
            instructions: "Look at the information about five gyms, A–E. For which gym are the following statements true? You may use any letter more than once.",
            skill: "Matching information",
            options: [
              { value: "A", label: "Fitness First Eastfield" },
              { value: "B", label: "The Boxing Club" },
              { value: "C", label: "Eastfield Leisure Centre" },
              { value: "D", label: "Studio Balance" },
              { value: "E", label: "Peak Performance" },
            ],
            questions: [
              { id: "r5-1", type: "select", prompt: "Members can use it at any time of the day or night.", answer: "A" },
              { id: "r5-2", type: "select", prompt: "Childcare is provided at certain times.", answer: "D" },
              { id: "r5-3", type: "select", prompt: "Customers pay for each visit rather than every month.", answer: "E" },
              { id: "r5-4", type: "select", prompt: "Older people can pay less.", answer: "C" },
              { id: "r5-5", type: "select", prompt: "Some equipment can be borrowed.", answer: "B" },
              { id: "r5-6", type: "select", prompt: "Members are occasionally allowed to bring a guest.", answer: "A" },
              { id: "r5-7", type: "select", prompt: "New members must be shown how to use the equipment.", answer: "C" },
            ],
          },
          {
            instructions: "Look at the information about bulky waste collection. Complete the sentences below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
            skill: "Sentence completion",
            questions: [
              { id: "r5-8", type: "text", prompt: "When you book, you must give a list of all the ______.", answer: ["items"] },
              { id: "r5-9", type: "text", prompt: "Collections are made on Tuesdays and ______.", answer: ["Fridays", "Friday"] },
              { id: "r5-10", type: "text", prompt: "Each item after the first three costs ______.", answer: ["$8", "8 dollars", "8"] },
              { id: "r5-11", type: "text", prompt: "Fridges cost more because of the ______ inside them.", answer: ["gases", "gas"] },
              { id: "r5-12", type: "text", prompt: "People who get a ______ pay only half the charge.", answer: ["pension"] },
              { id: "r5-13", type: "text", prompt: "Items should be placed next to the road by ______ on the collection day.", answer: ["7 am", "7am", "7"] },
              { id: "r5-14", type: "text", prompt: "Bricks and tiles can be taken to the ______ on Dock Road.", answer: ["Recycling Centre"] },
            ],
          },
        ],
      },
      {
        title: "Section 2",
        passages: [
          {
            title: "Corran Insurance — Flexible Working Policy",
            body: `Corran Insurance supports flexible working wherever the needs of the business allow. This policy explains the options available and how to apply.

Types of flexible working
Flexitime allows staff to choose their start and finish times, provided they are at work during the core hours of 10 am to 3 pm. Hybrid working allows staff to work from home for up to two days a week. Compressed hours allow staff to work their full weekly hours over four longer days instead of five.

Who can apply
All employees may apply once they have completed their probation period, which normally lasts six months. Staff in customer-facing roles, such as branch advisers, are not eligible for hybrid working, but may apply for the other options.

How to apply
Applications should be made in writing to your line manager, using form FW1, which can be downloaded from the intranet. Your manager will arrange a meeting with you within two weeks of receiving your application, and will give you a decision in writing within one month.

If your application is approved, the new arrangement will normally begin with a trial period of three months. If it is refused, you may appeal to the Human Resources department within fourteen days of the decision. Employees may make one application in any twelve-month period.`,
          },
          {
            title: "Getting to Work: Staff Car Park and Travel Scheme",
            body: `Parking
The staff car park behind the main building has 80 spaces, which is not enough for everyone. Spaces are therefore allocated by permit. Priority is given to staff with a disability, and then to those who live more than 15 kilometres from the office. Permits are renewed every January, and the application form is available from the facilities team.

Cars without a permit found in the car park will be reported to the facilities manager. Visitors should use the public car park on Bridge Street; the company will refund the cost if you give your visitor a parking voucher from reception.

Cycling
Secure bicycle storage is available in the basement, and showers and lockers are provided on the ground floor. Under the Cycle to Work scheme, staff can buy a bicycle and safety equipment through their salary, and save up to 30 per cent of the cost.

Public transport
The company offers an interest-free loan for an annual bus or train pass. The loan is repaid in equal monthly amounts from your salary over the following year. If you leave the company before the loan is repaid, the remaining amount will be taken from your final pay.`,
          },
        ],
        groups: [
          {
            instructions: "Look at the flexible working policy. Do the following statements agree with the information? Choose TRUE, FALSE or NOT GIVEN.",
            questions: [
              { id: "r5-15", type: "tfng", prompt: "Staff on flexitime must be at work between 10 am and 3 pm.", answer: "TRUE" },
              { id: "r5-16", type: "tfng", prompt: "Hybrid workers can work from home for three days a week.", answer: "FALSE" },
              { id: "r5-17", type: "tfng", prompt: "Most staff at Corran Insurance already work flexibly.", answer: "NOT GIVEN" },
              { id: "r5-18", type: "tfng", prompt: "Branch advisers cannot apply for compressed hours.", answer: "FALSE" },
              { id: "r5-19", type: "tfng", prompt: "Employees receive a decision on their application in writing.", answer: "TRUE" },
              { id: "r5-20", type: "tfng", prompt: "Staff can make a new application every six months.", answer: "FALSE" },
            ],
          },
          {
            instructions: "Look at the information about getting to work. Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER from the text for each answer.",
            skill: "Note completion",
            questions: [
              { id: "r5-21", type: "text", prompt: "Parking spaces are given out by ______.", answer: ["permit"] },
              { id: "r5-22", type: "text", prompt: "After disabled staff, priority goes to those living over ______ away.", answer: ["15 kilometres", "15 km", "fifteen kilometres"] },
              { id: "r5-23", type: "text", prompt: "Visitors need a ______ from reception to get their parking cost refunded.", answer: ["parking voucher", "voucher"] },
              { id: "r5-24", type: "text", prompt: "Bicycles can be stored in the ______.", answer: ["basement"] },
              { id: "r5-25", type: "text", prompt: "The Cycle to Work scheme can save staff up to ______ of the cost.", answer: ["30 per cent", "30%", "30 percent"] },
              { id: "r5-26", type: "text", prompt: "The travel pass loan is ______, so staff pay back only what they borrowed.", answer: ["interest-free", "interest free"] },
              { id: "r5-27", type: "text", prompt: "Staff who leave early repay the rest of the loan from their ______.", answer: ["final pay"] },
            ],
          },
        ],
      },
      {
        title: "Section 3",
        passages: [
          {
            title: "The Disappearing Night Sky",
            body: `A  For most of human history, people looked up at a night sky filled with stars. Today, around 80 per cent of the world's population, and almost everyone in Europe and North America, lives under skies affected by artificial light. A third of humanity can no longer see the Milky Way, the band of stars that our ancestors used to tell stories and find their way. Astronomers have a name for the glow that hangs over towns and cities at night: light pollution.

B  The problem has grown quickly. A study using photographs taken by members of the public found that the sky in many places became brighter by almost ten per cent a year between 2011 and 2022, much faster than satellite measurements had suggested. One reason is the switch to LED street lighting. LEDs use far less electricity than older lamps, but because they are cheap to run, many councils have installed more of them, and they produce more of the blue light that scatters easily in the atmosphere.

C  The effects are not only a loss for stargazers. Many animals depend on darkness. Newly hatched sea turtles find their way to the ocean by moving towards the brightest horizon, which should be the moonlit sea; near brightly lit beaches, thousands crawl inland instead. Migrating birds, which use the stars to navigate, are drawn towards lit buildings, and millions die each year in collisions. Even insects are affected: a single street lamp can attract and exhaust moths from a wide area, reducing the number available to pollinate plants at night.

D  Humans may pay a price too. Our bodies follow a daily rhythm controlled partly by light, and exposure to bright light at night reduces the production of melatonin, a hormone that helps us sleep. Some researchers have linked long-term exposure to outdoor light at night with sleep disorders and other health problems, although they stress that more research is needed before firm conclusions can be drawn.

E  Unlike many environmental problems, however, light pollution is easy to reverse. Switch off a light, and the pollution it caused disappears immediately. Simple measures can make a big difference: shielding lamps so that light shines downwards rather than into the sky, using warmer-coloured bulbs, and dimming or switching off lights late at night when streets are empty.

F  Some places have gone further. Several towns and national parks have been recognised as 'dark sky places' after meeting strict standards for outdoor lighting. These areas have found that darkness can be good for business: visitors travel long distances to see the stars, often staying overnight in hotels and eating in local restaurants during the quieter winter months. One small town reported that stargazing tourism had become its most important source of income outside the summer season.

G  Critics argue that reducing street lighting may make people feel less safe and could increase crime. The evidence, however, is mixed. A large study in England and Wales found no increase in crime or traffic accidents in areas where street lights were dimmed or switched off for part of the night. Supporters of dark skies argue that the aim is not darkness everywhere, but the right amount of light, in the right place, at the right time.`,
          },
        ],
        groups: [
          {
            instructions: "The passage has seven paragraphs, A–G. Choose the correct heading for paragraphs B–G from the list of headings below.",
            options: [
              { value: "i", label: "Why one change made the problem worse" },
              { value: "ii", label: "A problem with a simple solution" },
              { value: "iii", label: "The history of street lighting" },
              { value: "iv", label: "Possible risks to our health" },
              { value: "v", label: "An economic benefit of darkness" },
              { value: "vi", label: "Wildlife thrown off course" },
              { value: "vii", label: "Weighing up a common objection" },
              { value: "viii", label: "Measuring the sky from space" },
            ],
            questions: [
              { id: "r5-28", type: "select", prompt: "Paragraph B", answer: "i" },
              { id: "r5-29", type: "select", prompt: "Paragraph C", answer: "vi" },
              { id: "r5-30", type: "select", prompt: "Paragraph D", answer: "iv" },
              { id: "r5-31", type: "select", prompt: "Paragraph E", answer: "ii" },
              { id: "r5-32", type: "select", prompt: "Paragraph F", answer: "v" },
              { id: "r5-33", type: "select", prompt: "Paragraph G", answer: "vii" },
            ],
          },
          {
            instructions: "Choose the correct letter, A, B, C or D.",
            questions: [
              {
                id: "r5-34",
                type: "mcq",
                prompt: "According to paragraph B, the study using photographs from the public showed that",
                options: ["satellites had overestimated light pollution.", "the sky was getting brighter more quickly than thought.", "LED lights produce less blue light than older lamps.", "most councils had reduced street lighting."],
                answer: "B",
              },
              {
                id: "r5-35",
                type: "mcq",
                prompt: "Why do young sea turtles move inland near lit beaches?",
                options: ["They are attracted by warmth from buildings.", "They follow other turtles.", "They mistake the lights for the sea horizon.", "They are trying to avoid predators."],
                answer: "C",
              },
              {
                id: "r5-36",
                type: "mcq",
                prompt: "What does the writer say about the research on health in paragraph D?",
                options: ["It proves that outdoor light causes illness.", "It is not yet conclusive.", "It has only been carried out on animals.", "It contradicts earlier studies."],
                answer: "B",
              },
            ],
          },
          {
            instructions: "Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
            skill: "Summary completion",
            questions: [
              { id: "r5-37", type: "text", prompt: "______ lamps makes their light shine downwards.", answer: ["shielding"] },
              { id: "r5-38", type: "text", prompt: "Towns that meet strict lighting standards can become '______'.", answer: ["dark sky places", "dark sky"] },
              { id: "r5-39", type: "text", prompt: "Stargazers often visit during the quieter ______.", answer: ["winter months", "winter"] },
              { id: "r5-40", type: "text", prompt: "A study in England and Wales found no rise in crime or ______ where lights were dimmed.", answer: ["traffic accidents"] },
            ],
          },
        ],
      },
    ],
  },

  /* ======================================================================
     TEST 6
     ====================================================================== */
  {
    id: "gt-6",
    title: "General Training Reading — Test 6",
    description: "Lakeside holiday cottages, a medical centre's patient information, a food handler's certificate, hiring a work van and an article on how habits form.",
    sections: [
      {
        title: "Section 1",
        passages: [
          {
            title: "Holiday Cottages at Loch Arran",
            body: `A  Heron Cottage
Sleeps 2. A cosy stone cottage right on the water's edge, with its own small rowing boat. No pets, and not suitable for children. Minimum stay three nights.

B  The Old Mill
Sleeps 8. A converted mill with four bedrooms, ideal for large families or groups of friends. There is a games room with a table-tennis table. Dogs are welcome (maximum two). Weekly bookings only in July and August.

C  Pine Lodge
Sleeps 4. A modern wooden lodge in the forest, 2 km from the lake. Hot tub on the private deck. The lodge is fully accessible for wheelchair users, with a level entrance and a wet room.

D  Ferry House
Sleeps 6. Next to the ferry pier, a short walk from the village shop and two restaurants. The house has no parking; guests should use the public car park 300 metres away.

E  Shepherd's Hut
Sleeps 2. A traditional hut in a meadow with wonderful views of the mountains. It has a wood-burning stove, but no electricity or Wi-Fi. Bedding is provided, but guests must bring their own towels.`,
          },
          {
            title: "Riverside Medical Centre — Information for Patients",
            body: `Opening hours
The centre is open from 8 am to 6.30 pm, Monday to Friday. On Saturday mornings, a nurse is available from 9 am to 12 noon for blood tests and vaccinations only. When the centre is closed, call the national health line on 811 for advice.

Appointments
Routine appointments can be booked up to four weeks ahead, online or by phone. For urgent problems, call at 8 am, when a number of same-day appointments are released. Most appointments are by phone first: a doctor will call you back and decide whether you need to come in.

If you cannot attend, please cancel at least 24 hours in advance. Patients who miss three appointments without cancelling in a year may be asked to register with another practice.

Repeat prescriptions
Requests for repeat prescriptions can be made online or by putting the form in the box at reception. We do not accept requests by phone, for safety reasons. Please allow two working days for your prescription to be ready.

Test results
Results are usually available within a week. Patients can see their results online once a doctor has reviewed them. If a result needs action, we will contact you.`,
          },
        ],
        groups: [
          {
            instructions: "Look at the information about five holiday cottages, A–E. For which cottage are the following statements true? You may use any letter more than once.",
            skill: "Matching information",
            options: [
              { value: "A", label: "Heron Cottage" },
              { value: "B", label: "The Old Mill" },
              { value: "C", label: "Pine Lodge" },
              { value: "D", label: "Ferry House" },
              { value: "E", label: "Shepherd's Hut" },
            ],
            questions: [
              { id: "r6-1", type: "select", prompt: "It would suit a visitor who uses a wheelchair.", answer: "C" },
              { id: "r6-2", type: "select", prompt: "Guests can go out on the lake.", answer: "A" },
              { id: "r6-3", type: "select", prompt: "It is convenient for eating out.", answer: "D" },
              { id: "r6-4", type: "select", prompt: "It is not possible to charge a phone there.", answer: "E" },
              { id: "r6-5", type: "select", prompt: "Guests can bring their dog.", answer: "B" },
              { id: "r6-6", type: "select", prompt: "Guests cannot park beside the building.", answer: "D" },
            ],
          },
          {
            instructions: "Look at the information from Riverside Medical Centre. Do the following statements agree with the information? Choose TRUE, FALSE or NOT GIVEN.",
            questions: [
              { id: "r6-7", type: "tfng", prompt: "Patients can see a doctor at the centre on Saturday mornings.", answer: "FALSE" },
              { id: "r6-8", type: "tfng", prompt: "Same-day appointments become available early in the morning.", answer: "TRUE" },
              { id: "r6-9", type: "tfng", prompt: "Most patients are first contacted by phone.", answer: "TRUE" },
              { id: "r6-10", type: "tfng", prompt: "Patients who miss an appointment must pay a fee.", answer: "NOT GIVEN" },
              { id: "r6-11", type: "tfng", prompt: "Repeat prescriptions can be ordered by telephone.", answer: "FALSE" },
              { id: "r6-12", type: "tfng", prompt: "Prescriptions are ready on the same day as the request.", answer: "FALSE" },
              { id: "r6-13", type: "tfng", prompt: "Test results can be viewed online after a doctor has checked them.", answer: "TRUE" },
              { id: "r6-14", type: "tfng", prompt: "The centre has recently started offering online appointments.", answer: "NOT GIVEN" },
            ],
          },
        ],
      },
      {
        title: "Section 2",
        passages: [
          {
            title: "How to Get Your Food Handler's Certificate",
            body: `Anyone who prepares, serves or stores food in a restaurant, café, school kitchen or food shop must hold a valid Food Handler's Certificate. Employers must keep a copy of each worker's certificate on the premises, and inspectors may ask to see it at any time.

The course
The approved course covers food safety, personal hygiene, cleaning, pest control and allergies. It takes about seven hours and can be completed in a classroom over one day, or online at your own pace. The online course must be finished within 30 days of registration.

The exam
At the end of the course, candidates take a multiple-choice exam of 40 questions. The pass mark is 70 per cent. Candidates who fail may take the exam again once without paying a further fee. Those who fail a second time must repeat the whole course.

Cost and validity
The course and exam cost $85. Many employers pay this fee for their staff, so check with your manager before you register. Certificates are valid for five years. Holders are reminded by email three months before their certificate expires.

Certificates from other provinces
Certificates issued in other provinces are accepted, as long as they are still valid. Workers with certificates from other countries must take the exam, but do not need to complete the course.`,
          },
          {
            title: "Using the Company Van",
            body: `Booking
The company has two vans for staff who need to transport equipment or materials. Vans must be booked through the online calendar at least 48 hours in advance. Bookings for a full day take priority over shorter bookings.

Before you drive
Only staff who have held a full driving licence for at least two years may drive a company van. Before your first booking, you must send a copy of your licence to the fleet officer and complete a short online driving assessment.

Collect the keys from reception and check the van for damage before you set off. Any damage should be photographed and reported to the fleet officer immediately, otherwise you may be held responsible for it.

During your journey
The vans must not be used for personal journeys. Fuel can be paid for with the fuel card kept in the glove box; keep the receipt and attach it to your expense form. Parking fines are the responsibility of the driver.

Returning the van
Return the van with at least a quarter of a tank of fuel, and remove all rubbish. Write the mileage in the logbook before returning the keys.`,
          },
        ],
        groups: [
          {
            instructions: "Look at the information about the Food Handler's Certificate. Complete the sentences below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER from the text for each answer.",
            skill: "Sentence completion",
            questions: [
              { id: "r6-15", type: "text", prompt: "Employers must keep a ______ of every worker's certificate at work.", answer: ["copy"] },
              { id: "r6-16", type: "text", prompt: "The course includes topics such as hygiene, cleaning and ______.", answer: ["pest control", "allergies"] },
              { id: "r6-17", type: "text", prompt: "People studying online have ______ to complete the course.", answer: ["30 days", "thirty days"] },
              { id: "r6-18", type: "text", prompt: "To pass, candidates need a score of at least ______.", answer: ["70 per cent", "70%", "70 percent"] },
              { id: "r6-19", type: "text", prompt: "After failing twice, a candidate has to ______ the whole course.", answer: ["repeat"] },
              { id: "r6-20", type: "text", prompt: "A certificate lasts for ______.", answer: ["five years", "5 years"] },
              { id: "r6-21", type: "text", prompt: "People with certificates from abroad only need to take the ______.", answer: ["exam"] },
            ],
          },
          {
            instructions: "Look at the information about the company van. Complete the summary below. Write ONE WORD ONLY from the text for each answer.",
            skill: "Summary completion",
            questions: [
              { id: "r6-22", type: "text", prompt: "Staff book a van using the online ______.", answer: ["calendar"] },
              { id: "r6-23", type: "text", prompt: "Before the first booking, drivers send their licence to the fleet ______.", answer: ["officer"] },
              { id: "r6-24", type: "text", prompt: "Any damage should be ______ and reported straight away.", answer: ["photographed"] },
              { id: "r6-25", type: "text", prompt: "Fuel is paid for with a card kept in the ______ box.", answer: ["glove"] },
              { id: "r6-26", type: "text", prompt: "The ______ must pay any parking fines.", answer: ["driver"] },
              { id: "r6-27", type: "text", prompt: "Before returning the keys, drivers record the ______ in the logbook.", answer: ["mileage"] },
            ],
          },
        ],
      },
      {
        title: "Section 3",
        passages: [
          {
            title: "How Habits Are Made — and Broken",
            body: `A  Every New Year, millions of people promise themselves that they will exercise more, eat better or spend less time on their phones. By February, most of these promises have been forgotten. Psychologists who study habits believe that this is not because people lack willpower, but because they misunderstand how habits work.

B  A habit is a behaviour that has become automatic: we do it without thinking, in response to a particular situation. Brushing our teeth after breakfast, checking our phone when we wake up or reaching for a snack while watching television are all habits. Researchers estimate that around 40 per cent of what we do each day is habitual, which frees our minds to focus on other things.

C  Habits form through repetition in a stable context. Each time we perform an action in the same situation, the link between the situation and the action becomes stronger, until the situation alone is enough to trigger the behaviour. A well-known study at University College London asked volunteers to adopt a new daily behaviour, such as eating a piece of fruit with lunch. On average, it took 66 days for the behaviour to become automatic, far longer than the 21 days often claimed in self-help books, and the time varied enormously, from 18 to over 250 days.

D  The same study found that missing a single day did not seriously affect the process. This is encouraging for anyone who gives up after one failure. What mattered was consistency over time, not perfection.

E  If habits depend on context, then changing the context is one of the most effective ways to change behaviour. People who move house or start a new job are more likely to succeed in changing their habits, because the old triggers have disappeared. Researchers call this a 'window of opportunity'. Small changes to our surroundings can have a similar effect: people eat less when sweets are kept in a cupboard rather than on the kitchen table, simply because they no longer see them.

F  Willpower, by contrast, is surprisingly unreliable. Studies have found that people who are good at self-control do not resist temptation more often than others; instead, they arrange their lives so that they face fewer temptations in the first place. In other words, they rely on good habits rather than on constant effort.

G  Breaking a bad habit is harder than forming a new one, because the old link between situation and behaviour does not disappear completely. It can return quickly under stress. For this reason, experts recommend replacing a bad habit with a different behaviour in the same situation, rather than simply trying to stop. Someone who always smokes during their coffee break, for example, might take a short walk instead.`,
          },
        ],
        groups: [
          {
            instructions: "The passage has seven paragraphs, A–G. Which paragraph contains the following information? You may use any letter more than once.",
            skill: "Matching information",
            options: PARAS("ABCDEFG"),
            questions: [
              { id: "r6-28", type: "select", prompt: "an example of how hiding something can change behaviour", answer: "E" },
              { id: "r6-29", type: "select", prompt: "a figure showing how much of our daily behaviour is automatic", answer: "B" },
              { id: "r6-30", type: "select", prompt: "a reason why people should not give up after a mistake", answer: "D" },
              { id: "r6-31", type: "select", prompt: "a common belief about habit formation that research does not support", answer: "C" },
              { id: "r6-32", type: "select", prompt: "a suggestion for dealing with an unwanted habit", answer: "G" },
            ],
          },
          {
            instructions: "Do the following statements agree with the views of the writer? Choose YES, NO or NOT GIVEN.",
            questions: [
              { id: "r6-33", type: "ynng", prompt: "Most people fail to keep New Year promises because they have weak willpower.", answer: "NO" },
              { id: "r6-34", type: "ynng", prompt: "Habits allow us to concentrate on other matters.", answer: "YES" },
              { id: "r6-35", type: "ynng", prompt: "Men form new habits more quickly than women.", answer: "NOT GIVEN" },
              { id: "r6-36", type: "ynng", prompt: "Starting a new job can make it easier to change a habit.", answer: "YES" },
            ],
          },
          {
            instructions: "Choose TWO letters, A–E.",
            questions: [
              {
                id: "r6-37",
                type: "multi",
                prompt: "Which TWO statements about the University College London study are true?",
                options: [
                  "Participants took an average of 66 days to form a habit.",
                  "Most participants formed a habit within 21 days.",
                  "Missing one day did not prevent a habit forming.",
                  "Participants who ate fruit lost weight.",
                  "Every participant formed the habit at a similar speed.",
                ],
                answer: ["A", "C"],
              },
            ],
          },
          {
            instructions: "Choose TWO letters, A–E.",
            questions: [
              {
                id: "r6-39",
                type: "multi",
                prompt: "Which TWO things does the writer say about people with good self-control?",
                options: [
                  "They resist temptation more often than other people.",
                  "They avoid situations where they will be tempted.",
                  "They find it easier to stop smoking.",
                  "They depend on good habits.",
                  "They are usually less affected by stress.",
                ],
                answer: ["B", "D"],
              },
            ],
          },
        ],
      },
    ],
  },
];
