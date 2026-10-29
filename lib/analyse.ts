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
