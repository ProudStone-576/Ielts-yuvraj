/**
 * Listening dictation drills: short items that train the exact things that cost marks at band 7–8
 * (spelled names, postcodes, phone numbers, prices, dates, tricky spellings and corrections).
 * Each item is spoken once (one replay allowed) and the learner types what they hear.
 */

export interface DrillItem {
  /** What the speaker says. */
  say: string;
  /** What to write, shown on screen. */
  ask: string;
  /** Accepted answers (compared ignoring case, spaces and punctuation). */
  answer: string[];
  /** Why people get it wrong. */
  why?: string;
}

export interface DrillSet {
  id: string;
  title: string;
  intro: string;
  voice: string;
  items: DrillItem[];
}

export const DRILL_SETS: DrillSet[] = [
  {
    id: "names",
    title: "Spelled names",
    intro: "Names are spelled letter by letter in Part 1. Listen for double letters and letters that sound alike (B/P/D/T, M/N, A/E/I).",
    voice: "en-GB-SoniaNeural",
    items: [
      { say: "My surname is Fitzgerald. That's F, I, T, Z, G, E, R, A, L, D.", ask: "Surname", answer: ["Fitzgerald"] },
      { say: "It's Horvath. H, O, R, V, A, T, H.", ask: "Surname", answer: ["Horvath"] },
      { say: "The street is Abbotsbury Road. That's A, double B, O, T, S, B, U, R, Y.", ask: "Street name", answer: ["Abbotsbury", "Abbotsbury Road"], why: "'Double B' means write the letter twice." },
      { say: "My name is Mbeki. M, B, E, K, I.", ask: "Surname", answer: ["Mbeki"] },
      { say: "The hotel is called the Pemberton. P, E, M, B, E, R, T, O, N.", ask: "Hotel name", answer: ["Pemberton"], why: "P and B sound alike — listen carefully to each." },
      { say: "It's Gallagher. G, A, double L, A, G, H, E, R.", ask: "Surname", answer: ["Gallagher"] },
      { say: "The town is Whitstable. W, H, I, T, S, T, A, B, L, E.", ask: "Town", answer: ["Whitstable"] },
      { say: "My first name is Yusuf. Y, U, S, U, F.", ask: "First name", answer: ["Yusuf"] },
      { say: "The company is Kenwright. K, E, N, W, R, I, G, H, T.", ask: "Company name", answer: ["Kenwright"] },
      { say: "Her name's Annabel. A, double N, A, B, E, L. With one L at the end.", ask: "First name", answer: ["Annabel"] },
    ],
  },
  {
    id: "codes",
    title: "Postcodes and reference numbers",
    intro: "Letters and numbers mixed together. Write exactly what you hear — a single wrong character loses the mark.",
    voice: "en-AU-NatashaNeural",
    items: [
      { say: "The postcode is S, W, 1, A, 2, A, A.", ask: "Postcode", answer: ["SW1A 2AA"] },
      { say: "My booking reference is H, T, 4, 7, 9, K.", ask: "Booking reference", answer: ["HT479K"] },
      { say: "The postcode is B, D, 7, 3, Q, R.", ask: "Postcode", answer: ["BD7 3QR"] },
      { say: "Your membership number is 3, 0, 0, 8, 1, 5.", ask: "Membership number", answer: ["300815"], why: "'Oh' and 'zero' both mean 0." },
      { say: "It's V, 6, B, 4, Y, 8. That's a Vancouver postcode.", ask: "Postcode", answer: ["V6B 4Y8"] },
      { say: "The order number is double 4, 9, 2, 7, X.", ask: "Order number", answer: ["44927X"], why: "'Double four' means 44." },
      { say: "The flight is E, K, 0, 1, 5, 8.", ask: "Flight number", answer: ["EK0158"] },
      { say: "My student ID is M, 2, 0, 2, 4, 3, 1, 6.", ask: "Student ID", answer: ["M2024316"] },
      { say: "The postcode is L, 1, 8, 9, J, F.", ask: "Postcode", answer: ["L18 9JF"] },
      { say: "The reference is G, R, triple 7, 2.", ask: "Reference", answer: ["GR7772"], why: "'Triple seven' means 777." },
    ],
  },
  {
    id: "phones",
    title: "Phone numbers",
    intro: "Numbers are usually read in groups. 'Oh' means zero, and 'double' means two of the same digit.",
    voice: "en-US-JennyNeural",
    items: [
      { say: "My mobile is 0 7 9 1 2, 4 4 6, 3 0 8.", ask: "Phone number", answer: ["07912446308"] },
      { say: "You can call the office on 6 0 4, 5 5 5, 0 1 9 2.", ask: "Phone number", answer: ["6045550192"] },
      { say: "It's 0 4 1 3, double 8, 2, 7 5 0.", ask: "Phone number", answer: ["0413882750"] },
      { say: "The number is 9 0 5, 3 3 1, 4 4 7 6.", ask: "Phone number", answer: ["9053314476"] },
      { say: "Ring us on oh two oh, seven nine four six, one two three four.", ask: "Phone number", answer: ["02079461234"] },
      { say: "My work number is 0 1 6 1, 4 9 6, double 0, 5 7.", ask: "Phone number", answer: ["01614960057"] },
      { say: "It's 4 1 6, 5 5 5, 8 2 1 3. Sorry, 8 2 3 1.", ask: "Phone number", answer: ["4165558231"], why: "The speaker corrects themselves — always write the final version." },
      { say: "The emergency number for the club is 0 2, 9 3 7 4, 6 6 1 0.", ask: "Phone number", answer: ["0293746610"] },
      { say: "Call me on 0 7 7 0 0, 9 0 0, 1 2 3.", ask: "Phone number", answer: ["07700900123"] },
      { say: "It's 6 1 3, 5 5 5, 0 1, triple 4.", ask: "Phone number", answer: ["61355501444"], why: "'Triple four' means 444." },
    ],
  },
  {
    id: "prices",
    title: "Prices and numbers",
    intro: "Watch out for -teen and -ty (fifteen / fifty), decimals and large numbers.",
    voice: "en-GB-RyanNeural",
    items: [
      { say: "The ticket costs fifteen dollars fifty.", ask: "Price ($)", answer: ["15.50", "$15.50"] },
      { say: "The room holds up to thirty people.", ask: "Number of people", answer: ["30", "thirty"], why: "Thirty has the stress at the start: THIR-ty. Thirteen is thir-TEEN." },
      { say: "Membership is thirteen pounds a month.", ask: "Price (£)", answer: ["13", "£13", "thirteen"] },
      { say: "The car park has two hundred and forty spaces.", ask: "Number of spaces", answer: ["240"] },
      { say: "The deposit is one thousand, two hundred dollars.", ask: "Deposit ($)", answer: ["1200", "1,200", "$1200", "$1,200"] },
      { say: "It's nine ninety-nine for the basic version.", ask: "Price ($)", answer: ["9.99", "$9.99"] },
      { say: "The trip is seventeen kilometres long.", ask: "Distance (km)", answer: ["17", "seventeen"] },
      { say: "Around sixty per cent of visitors are from overseas.", ask: "Percentage", answer: ["60", "60%", "sixty"] },
      { say: "The full price was eighty dollars, but members pay sixty-eight.", ask: "Members' price ($)", answer: ["68", "$68"], why: "The first number is a distractor." },
      { say: "The bridge was built in eighteen sixty-four.", ask: "Year", answer: ["1864"] },
    ],
  },
  {
    id: "dates",
    title: "Dates and times",
    intro: "Write dates as '21 March' or 'March 21'. Times can be written 7.45 or 7:45.",
    voice: "en-CA-ClaraNeural",
    items: [
      { say: "The course starts on the twenty-first of March.", ask: "Start date", answer: ["21 March", "March 21", "21st March", "March 21st"] },
      { say: "The meeting is at a quarter to eight.", ask: "Time", answer: ["7.45", "7:45", "quarter to eight"] },
      { say: "We'll arrive on Friday the third of October.", ask: "Date", answer: ["3 October", "October 3", "3rd October", "October 3rd", "Friday 3 October"] },
      { say: "The shop closes at half past five on Saturdays.", ask: "Closing time", answer: ["5.30", "5:30", "half past five"] },
      { say: "The deadline is the twelfth of February.", ask: "Deadline", answer: ["12 February", "February 12", "12th February", "February 12th"], why: "February has an R after the B: Feb-RU-ary." },
      { say: "The train leaves at twenty past nine.", ask: "Time", answer: ["9.20", "9:20"] },
      { say: "The party was planned for the fifth of June, but it's moved to the seventh.", ask: "Party date", answer: ["7 June", "June 7", "7th June", "June 7th"], why: "Changes are common — the second date is the answer." },
      { say: "Doors open at six forty-five.", ask: "Time", answer: ["6.45", "6:45"] },
      { say: "The festival ends on the thirtieth of August.", ask: "End date", answer: ["30 August", "August 30", "30th August", "August 30th"] },
      { say: "Check-out is by ten fifteen.", ask: "Time", answer: ["10.15", "10:15"] },
    ],
  },
  {
    id: "spelling",
    title: "Words people misspell",
    intro: "These words appear again and again in IELTS Listening answers. Spelling must be perfect.",
    voice: "en-GB-ThomasNeural",
    items: [
      { say: "You'll need to find your own accommodation.", ask: "What will they need to find?", answer: ["accommodation"], why: "Double C and double M." },
      { say: "The class is on Wednesday afternoons.", ask: "Day", answer: ["Wednesday"], why: "Silent D: WED-nes-day." },
      { say: "The talk is about protecting the environment.", ask: "Topic", answer: ["environment"], why: "Don't forget the N before the M: enviro-N-ment." },
      { say: "Please bring your receipt when you return the item.", ask: "What should you bring?", answer: ["receipt"], why: "Silent P: re-CEIPT." },
      { say: "The library is next to the town hall.", ask: "Building", answer: ["library"], why: "Two Rs: li-BR-a-RY." },
      { say: "Check the temperature before you go swimming.", ask: "What should you check?", answer: ["temperature"] },
      { say: "We booked a table at a small restaurant.", ask: "Place", answer: ["restaurant"] },
      { say: "The government has announced new rules.", ask: "Who announced the rules?", answer: ["government"], why: "Silent N: gover-N-ment." },
      { say: "A good dictionary is necessary for this course.", ask: "Adjective", answer: ["necessary"], why: "One C, double S." },
      { say: "Bring some equipment for the experiment.", ask: "What should they bring?", answer: ["equipment"], why: "No S — 'equipment' is uncountable." },
    ],
  },
  {
    id: "changes",
    title: "Corrections and distractors",
    intro: "Speakers often change their minds or correct themselves. The answer is always the final version.",
    voice: "en-US-AndrewNeural",
    items: [
      { say: "The meeting is on Tuesday. Sorry, I mean Thursday.", ask: "Day", answer: ["Thursday"] },
      { say: "We were going to take the bus, but in the end we decided to walk.", ask: "How will they travel?", answer: ["walk", "walking", "on foot"] },
      { say: "I live at number fourteen — no, forty. I always get that wrong.", ask: "House number", answer: ["40", "forty"] },
      { say: "Most people choose the blue room, but we've gone for the green one.", ask: "Room colour", answer: ["green"] },
      { say: "It used to start at nine, but these days we begin at half past eight.", ask: "Start time", answer: ["8.30", "8:30", "half past eight"] },
      { say: "I thought my flight was on the tenth, but actually it's the eleventh.", ask: "Date", answer: ["11th", "11", "eleventh"] },
      { say: "You don't need to bring a towel, but you must bring a padlock for the locker.", ask: "What must you bring?", answer: ["padlock", "a padlock"] },
      { say: "The fee was twenty dollars last year, but it's gone up to twenty-five.", ask: "Fee ($)", answer: ["25", "$25", "twenty-five"] },
      { say: "We'll meet at the station. Actually, let's make it the library, it's warmer.", ask: "Meeting place", answer: ["library", "the library"] },
      { say: "Coffee is free, but tea costs a dollar.", ask: "Which drink costs money?", answer: ["tea"] },
    ],
  },
  {
    id: "plurals",
    title: "Plurals and word limits",
    intro: "A missing S makes an answer wrong. Check whether the speaker says one thing or several.",
    voice: "en-AU-WilliamNeural",
    items: [
      { say: "Make sure you bring your walking boots.", ask: "What to bring (ONE WORD)", answer: ["boots"], why: "Plural: boots, not boot." },
      { say: "The main problem was the lack of volunteers.", ask: "Problem: a lack of ______ (ONE WORD)", answer: ["volunteers"] },
      { say: "Children under five get in free.", ask: "Who gets in free? (ONE WORD)", answer: ["children"] },
      { say: "Visitors should keep away from the cliffs.", ask: "Keep away from the ______", answer: ["cliffs"] },
      { say: "The museum has a collection of old maps.", ask: "A collection of old ______", answer: ["maps"] },
      { say: "Every room has its own balcony.", ask: "Each room has a ______", answer: ["balcony"], why: "Singular here: 'its own balcony'." },
      { say: "We sell second-hand furniture.", ask: "Second-hand ______", answer: ["furniture"], why: "'Furniture' never takes an S." },
      { say: "Please leave your bags at reception.", ask: "Leave your ______ at reception", answer: ["bags"] },
      { say: "The best thing about the hotel is the views of the lake.", ask: "Best thing: the ______ of the lake", answer: ["views"] },
      { say: "The research found three main causes.", ask: "Number of causes", answer: ["3", "three"] },
    ],
  },
];

export function getDrillSet(id: string) {
  return DRILL_SETS.find((d) => d.id === id);
}
