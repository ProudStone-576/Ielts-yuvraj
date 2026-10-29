# IELTS Coach

A practice app for **IELTS General Training**, built to help reach **CLB 9**
(Listening 8.0 · Reading 7.0 · Writing 7.0 · Speaking 7.0).

## What's inside

| Module | What it does |
|---|---|
| **Listening** | Full 4-part, 40-question test read aloud with text-to-speech (a different voice per speaker). Exam mode plays each recording once; practice mode allows replay, pause and speed control. Transcripts after submitting. |
| **Reading** | Full 3-section, 40-question General Training test with a 60-minute timer, or single sections in 20 minutes. Automatic marking and band conversion. |
| **Writing** | 4 Task 1 letters and 4 Task 2 essays, each with a band 8–9 model answer. Timer, live word count, auto-saved drafts, automatic checks (paragraphs, linking words, repetition, tone), and self-assessment against the four official criteria. |
| **Speaking** | 3 full mock interviews. Questions are read aloud, Part 2 has the cue card with 1-minute prep and 2-minute talk timers, answers are recorded for playback, and (in Chrome/Edge/Safari) transcribed with words-per-minute and filler-word counts. |
| **Dashboard & Progress** | Band and CLB for every attempt, last-3 average vs target per module, exam countdown, "focus next" advice, and backup/restore of all progress to a file. |

All progress is stored in the browser (no account, no server). Use **Progress → Download backup** to keep a copy.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Deploy to Vercel

**From GitHub (recommended):** push this repo to GitHub, then in Vercel choose
*Add New → Project → Import* and pick the repo. Vercel detects Next.js automatically —
no settings needed. Every push to `main` redeploys.

**From your computer:**

```bash
npm i -g vercel
vercel           # first time: log in and accept the defaults
vercel --prod
```

## Adding more practice material

All content lives in `content/` as plain TypeScript data:

- `content/reading.ts` – reading tests (passages + questions)
- `content/listening.ts` – listening scripts + questions
- `content/writing.ts` – writing prompts + model answers
- `content/speaking.ts` – speaking question sets

Add a new object to the array and it appears in the app automatically.

## Notes

- Band conversions follow the published IELTS raw-score tables; CLB equivalency follows IRCC's table
  for IELTS General Training. Always confirm current requirements on the official IRCC website.
- Practice content is original and is not taken from official IELTS papers.
