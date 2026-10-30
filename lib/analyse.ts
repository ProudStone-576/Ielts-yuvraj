import { countWords } from "./scoring";

const LINKERS = [
  "however", "therefore", "moreover", "furthermore", "in addition", "as a result", "consequently",
  "for example", "for instance", "such as", "on the other hand", "in contrast", "although", "even though",
  "while", "whereas", "nevertheless", "in conclusion", "overall", "firstly", "secondly", "finally",
  "meanwhile", "similarly", "in particular", "as well as", "instead", "otherwise", "because", "since",
];

const COMPLEX_MARKERS = [
  "although", "even though", "which", "who", "whose", "whereas", "while", "if", "unless", "because",
  "since", "so that", "in order to", "having", "would", "could have", "not only",
];

const STOP = new Set(
  "the a an and or but of to in on for with at by from as is are was were be been it its this that these those i you he she we they my your our their me him her them not no do does did have has had will would can could should may might there here so very also more most than then just about into over after before up out what which who when where why how all any some such each other own same too only one two".split(
    " ",
  ),
);

export interface Analysis {
  words: number;
  paragraphs: number;
  sentences: number;
  avgSentence: number;
  linkers: string[];
  complex: number;
  overused: { word: string; count: number }[];
}

function lower(text: string): string {
  return ` ${text.toLowerCase().replace(/[^a-z'\s-]/g, " ").replace(/\s+/g, " ")} `;
}

export function analyse(text: string): Analysis {
  const lower = ` ${text.toLowerCase().replace(/[^a-z'\s-]/g, " ").replace(/\s+/g, " ")} `;
  const words = countWords(text);
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const sentences = text.split(/[.!?]+(?:\s|$)/).filter((s) => s.trim().length > 1).length;
  const linkers = LINKERS.filter((l) => lower.includes(` ${l} `));
  const complex = COMPLEX_MARKERS.reduce(
    (n, m) => n + (lower.match(new RegExp(` ${m} `, "g"))?.length ?? 0),
    0,
  );

  const freq = new Map<string, number>();
  for (const w of lower.split(" ")) {
    if (w.length < 4 || STOP.has(w)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  const limit = Math.max(4, Math.round(words / 60));
  const overused = [...freq.entries()]
    .filter(([, c]) => c > limit)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word, count]) => ({ word, count }));

  return {
    words,
    paragraphs,
    sentences,
    avgSentence: sentences ? Math.round(words / sentences) : 0,
    linkers,
    complex,
    overused,
  };
}

export interface Check {
  ok: boolean;
  text: string;
}

/** Words IELTS candidates most often misspell -> correct spelling. */
const SPELLING: Record<string, string> = {
  accomodation: "accommodation", acommodation: "accommodation", enviroment: "environment", goverment: "government",
  definately: "definitely", definatly: "definitely", seperate: "separate", neccessary: "necessary", necesary: "necessary",
  recieve: "receive", beleive: "believe", belive: "believe", untill: "until", tommorow: "tomorrow", tomorow: "tomorrow",
  wich: "which", thier: "their", alot: "a lot", occured: "occurred", occurence: "occurrence", begining: "beginning",
  buisness: "business", bussiness: "business", comittee: "committee", commitee: "committee", adress: "address",
  embarassed: "embarrassed", existance: "existence", independant: "independent", knowlege: "knowledge",
  responsability: "responsibility", sucess: "success", succesful: "successful", successfull: "successful",
  wierd: "weird", writting: "writing", becuase: "because", beacuse: "because", truely: "truly",
  arguement: "argument", developement: "development", disapear: "disappear", dissapear: "disappear",
  oppurtunity: "opportunity", oportunity: "opportunity", recomend: "recommend", reccomend: "recommend",
  priviledge: "privilege", tecnology: "technology", technolgy: "technology", familys: "families", childs: "children",
};

/** Typical learner errors (pattern, explanation). */
const ERRORS: [RegExp, string][] = [
  [/\binformations\b/i, "'information' has no plural — say 'information' or 'pieces of information'"],
  [/\badvices\b/i, "'advice' has no plural — say 'advice' or 'pieces of advice'"],
  [/\bfurnitures\b/i, "'furniture' has no plural"],
  [/\bequipments\b/i, "'equipment' has no plural"],
  [/\bknowledges\b/i, "'knowledge' has no plural"],
  [/\bpeoples\b/i, "'people' is already plural (only 'peoples' for nations)"],
  [/\bin nowadays\b/i, "say 'nowadays', not 'in nowadays'"],
  [/\bdiscuss about\b/i, "say 'discuss something', not 'discuss about'"],
  [/\bexplain (me|him|her|us|them)\b/i, "say 'explain to me', not 'explain me'"],
  [/\baccording to me\b/i, "say 'in my opinion' or 'I believe', not 'according to me'"],
  [/\bmore (better|worse|easier|cheaper|bigger)\b/i, "don't use 'more' with comparatives ('better', not 'more better')"],
  [/\bdespite of\b/i, "say 'despite' or 'in spite of', not 'despite of'"],
  [/\b(could|would|should) of\b/i, "write 'could have', not 'could of'"],
  [/\bwhom (is|are|was|were)\b/i, "use 'who' as the subject: 'who is…'"],
  [/\bthe most of\b/i, "say 'most of', not 'the most of'"],
  [/\bvery very\b/i, "avoid 'very very' — choose a stronger word (extremely, enormous)"],
  [/(^|[.!?]\s+)i\b/m, "write 'I' with a capital letter"],
  [/\b(a|an) (\w+) (people|children|students)\b/i, "'a/an' cannot go with a plural noun"],
];

/** Too informal for an essay or a formal letter. */
const INFORMAL = ["gonna", "wanna", "kids", "stuff", "awesome", "okay", "ok", "guys", "a lot of", "lots of", "really", "pretty much", "nowadays people"];

export function checksFor(task: 1 | 2, kind: string, text: string, minWords: number): Check[] {
  const a = analyse(text);
  const first = text.trim().split("\n")[0]?.toLowerCase() ?? "";
  const tail = text.trim().toLowerCase().slice(-120);
  const checks: Check[] = [
    {
      ok: a.words >= minWords,
      text: `Word count ${a.words} (minimum ${minWords})${a.words < minWords ? " — under-length answers lose marks" : ""}`,
    },
    {
      ok: a.paragraphs >= 4,
      text: `${a.paragraphs} paragraph${a.paragraphs === 1 ? "" : "s"} — leave a blank line between paragraphs; aim for 4–5`,
    },
    {
      ok: a.linkers.length >= 5,
      text: `${a.linkers.length} different linking expressions${a.linkers.length ? `: ${a.linkers.slice(0, 8).join(", ")}` : ""}`,
    },
    {
      ok: a.complex >= (task === 1 ? 4 : 6),
      text: `${a.complex} complex-sentence markers (although, which, if, because…) — band 7 needs a variety of complex structures`,
    },
    {
      ok: a.avgSentence >= 12 && a.avgSentence <= 28,
      text: `Average sentence length ${a.avgSentence} words${a.avgSentence > 28 ? " — some sentences may be too long" : a.avgSentence < 12 ? " — try combining short sentences" : ""}`,
    },
    {
      ok: a.overused.length === 0,
      text: a.overused.length
        ? `Repeated words: ${a.overused.map((o) => `${o.word} (${o.count})`).join(", ")} — use synonyms or pronouns`
        : "No heavily repeated words",
    },
  ];

  // Spelling and common grammar mistakes.
  const misspelled = [...new Set((text.toLowerCase().match(/[a-z]+/g) ?? []).filter((w) => SPELLING[w]))];
  checks.push({
    ok: misspelled.length === 0,
    text: misspelled.length
      ? `Spelling: ${misspelled.map((w) => `${w} → ${SPELLING[w]}`).join(", ")}`
      : "No common spelling mistakes found",
  });
  const errors = ERRORS.filter(([re]) => re.test(text)).map(([, why]) => why);
  checks.push({
    ok: errors.length === 0,
    text: errors.length ? `Grammar to check: ${errors.join("; ")}` : "None of the most common learner errors found",
  });

  const formalRegister = task === 2 || !kind.startsWith("Informal");
  if (formalRegister) {
    const casual = INFORMAL.filter((w) => lower(text).includes(` ${w} `));
    checks.push({
      ok: casual.length === 0,
      text: casual.length
        ? `Too informal here: ${casual.map((w) => `'${w}'`).join(", ")} — try 'many', 'children', 'things' → specific nouns, 'very' → 'extremely'`
        : "Vocabulary is suitably formal",
    });
  }

  if (task === 2) {
    const paras = text.split(/\n\s*\n/).filter((p) => p.trim());
    const opinion =
      /\b(i (strongly |firmly |would |do not |don't )?(believe|think|feel|agree|disagree|argue)|in my (opinion|view)|my view is|i am convinced|personally|this essay (will )?(argue|discuss|examine|explore|consider|outline|suggest))/i;
    checks.push(
      { ok: opinion.test(paras[0] ?? ""), text: "Introduction gives your position or says what the essay will do" },
      {
        ok: /^(in conclusion|to conclude|to sum up|to summarise|overall|in summary|in short|all in all|on balance|for these reasons|in my (view|opinion))/i.test(
          (paras.at(-1) ?? "").trim(),
        ),
        text: "Final paragraph is clearly a conclusion (In conclusion, Overall, To sum up…)",
      },
    );
  }

  if (task === 1) {
    const formal = kind.startsWith("Formal");
    const informal = kind.startsWith("Informal");
    const greetOk = formal
      ? first.startsWith("dear sir") || first.startsWith("dear madam") || first.startsWith("dear ")
      : informal
        ? first.startsWith("hi") || first.startsWith("dear") || first.startsWith("hello")
        : first.startsWith("dear");
    const signOk = formal
      ? tail.includes("yours faithfully") || tail.includes("yours sincerely")
      : informal
        ? /(best wishes|love|take care|cheers|all the best|see you)/.test(tail)
        : tail.includes("yours sincerely") || tail.includes("kind regards");
    checks.push(
      { ok: greetOk, text: `Opening greeting suits a ${kind.toLowerCase()}` },
      {
        ok: signOk,
        text: formal
          ? "Sign-off: 'Yours faithfully' (Dear Sir or Madam) or 'Yours sincerely' (named person)"
          : informal
            ? "Sign-off is friendly (Best wishes, Take care, Love…)"
            : "Sign-off: 'Yours sincerely' or 'Kind regards'",
      },
    );
    if (!informal) {
      const contractions = text.match(/\b\w+'(ll|re|ve|d|m|t)\b/gi)?.length ?? 0;
      checks.push({
        ok: contractions === 0,
        text: `${contractions} contractions (I'm, don't…)${contractions ? " — avoid these in formal and semi-formal letters" : ""}`,
      });
    }
  }
  return checks;
}
