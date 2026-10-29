# IELTS Coach

A practice app for **IELTS General Training**, built to help reach **CLB 9**
(Listening 8.0 · Reading 7.0 · Writing 7.0 · Speaking 7.0).

## What's inside

| Area | What it does |
|---|---|
| **Real-exam screens** | Modelled on the computer-delivered test: timer header, bottom question navigator with **Review** flags, passage on the left and questions on the right, text highlighting, auto-submit when time runs out. |
| **Listening** (4 full tests) | Runs like the real thing: instructions, reading time before each part, recording played **once** (text-to-speech, different voice per speaker), check time after each part and a 2-minute final check. Transcripts and replay only after submitting. |
| **Reading** (4 full tests) | 3 parts, 40 questions, 60 minutes, every GT question type (TFNG, YNNG, headings, matching information/features, note/sentence/summary completion, MCQ, short answer). |
| **Writing** (8 full tests) | Task 1 letter + Task 2 essay in one 60-minute session with live word counts; afterwards automatic checks, band 8–9 model answers and self-assessment against the official criteria. |
| **Speaking** (10 interviews) | Examiner-led: ID check, Part 1, Part 2 cue card (1 min prep, 2 min talk), Part 3; timed answers, recording, transcript, words-per-minute and filler count. |
| **Coach** | Daily plan, week-by-week study plan to exam day, streak, weak question types with targeted advice, and feedback after every test. CLB 9 targets built in. |
| **Cloud save** | Accounts (email + password). Progress saves automatically and syncs across devices; works offline and syncs later. |

## Cloud save setup (Vercel)

In the Vercel dashboard: project → **Storage** → **Create Database** → **Upstash for Redis** or **Neon** (both have
free plans) → connect it to this project. The app detects either one automatically (`KV_REST_API_URL`/`KV_REST_API_TOKEN`
for Upstash, `DATABASE_URL` for Neon) and creates its own table on Neon. Redeploy after connecting.
Without a database the app still works, saving progress in the browser only.

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

- `content/reading.ts`, `content/reading-more.ts` – reading tests (passages + questions)
- `content/listening.ts`, `content/listening-more.ts` – listening scripts + questions
- `content/writing.ts`, `content/writing-more.ts` – writing prompts, model answers and test pairs
- `content/speaking.ts` – speaking interview sets

Add a new object to the array and it appears in the app automatically.

## Notes

- Band conversions follow the published IELTS raw-score tables; CLB equivalency follows IRCC's table
  for IELTS General Training. Always confirm current requirements on the official IRCC website.
- Practice content is original and is not taken from official IELTS papers.
