# IELTS Coach — Project Notes & Session History

> **For the next session:** read this file first. It records everything decided, built and learned so far,
> so the owner does not have to explain the project again. Keep it updated at the end of each session
> (add to the history and update "Current status" and "Next steps").

---

## 1. What this project is

A web app that works as a personal **IELTS coach/tutor** for the owner's friend, who is preparing for the
**IELTS General Training** exam and needs **CLB 9** (Canadian immigration language benchmark).

CLB 9 minimums for IELTS General Training (IRCC table) — **each module must reach its own minimum**:

| Listening | Reading | Writing | Speaking |
|---|---|---|---|
| **8.0** | **7.0** | **7.0** | **7.0** |

The owner is not a developer. They want things explained simply, step by step, and never want to lose work.

## 2. The owner's requirements (in their words, summarised)

1. "Make it old style" — **build the app and deploy to Vercel**.
2. Practise **all four modules** (Listening, Reading, Writing, Speaking) before the exam.
3. **Practice must be just like the real exam** (the app copies the computer-delivered IELTS).
4. **Lots of content** — at least 4 full tests per module (look at real exam formats online, but content must be
   original, never copied from official papers).
5. It should feel like a **realistic coach / tutor**.
6. Progress must **save automatically and update everywhere** — no manual backup/restore button.
7. **No AI tutor for now** (the owner chose the free built-in coach; writing/speaking are self-assessed against
   official criteria). An AI tutor (Claude API marking essays/speaking) was offered and can be added later if
   they change their mind — it needs an Anthropic API key and costs a few cents per essay.
8. **Never lose anything**: commit after every step and send a downloadable zip of the whole app after every big step.
9. **Must not touch the friend's other repository** (see section 6).

## 3. Current status (end of session 1, 29 Oct 2026)

- **Live app:** https://ielts-coach-pi.vercel.app (Vercel project `ielts-coach`, account scope `urbanthug`).
- **Deployment protection:** turned OFF by the owner so the link is public (no Vercel login needed).
- **Database:** **Neon Postgres** connected to the Vercel project (env vars `DATABASE_URL`, `POSTGRES_URL`, …
  present for production/preview/development). The app creates its own table `ielts_kv` on first use.
- **Confirmed in session 2:** sign-up / cloud save works against the real Neon database. (Old note: It builds and was tested end-to-end
  locally with an in-memory database, but the cloud session could not reach `*.vercel.app` to test the live site.
  The owner was asked to: sign up → take a test → sign in on another device → check Progress.
  If it fails, read the Vercel runtime logs for `/api/auth/signup` and `/api/progress`.)
- **Code lives in:** the zip `ielts-coach.zip` the owner downloaded (includes full git history), and the latest
  deployment on Vercel. Now on GitHub: `ProudStone-576/Ielts-coach` (branch `main`).
- **Old Vercel tokens** were pasted in chat and the owner was told to delete them. Always ask for a fresh,
  short-expiry token for each deploy session; never store tokens in the repo.

## 4. Next steps (when GitHub login works again)

1. Owner creates an **empty private repo** on GitHub (e.g. `ielts-coach`) — no README, so the push is clean.
2. Start a Claude Code session with that repo, attach/upload `ielts-coach.zip`, unzip it, and push the existing
   history (`git remote add origin … && git push -u origin main`). The zip contains `.git`, so history is kept.
3. In Vercel: project `ielts-coach` → Settings → **Git** → connect the GitHub repo. From then on every push to
   `main` deploys automatically — no tokens or zips needed.
4. Confirm Neon cloud save works on the live site (see section 3).
5. Possible improvements discussed or worth considering:
   - More tests (currently 4 Listening, 4 Reading, 8 Writing, 10 Speaking). Validate every answer key with
     `npm run check:content` (section 9).
   - Map/plan labelling questions in Listening (not yet supported — would need an SVG map question type).
   - "Choose TWO letters" multi-answer questions (not yet supported).
   - Password reset (currently impossible — there is no email sending; a forgotten password means a new account).
   - Optional AI tutor for Writing/Speaking (owner declined for now).

## 5. History of the session (what happened, in order)

1. **"Make me a new repository."** Creating a GitHub repo failed: the Claude GitHub App is not allowed to create
   repos (403 "Resource not accessible by integration"). The owner also **could not sign in to GitHub**.
2. Owner said: "I don't want to work in the current one" (the session was attached to the friend's repo,
   `proudstone-576/c9orf72-als-proteostasis-study`). So the app was built in a **separate folder**
   (`/home/user/new-project`) with its own git history. Pushing a backup to GitHub also failed (403 — GitHub
   access for the session was broken), so **zips** became the safety net.
3. Owner explained the idea: an **IELTS coach app for a friend** to practise all modules and reach a target score.
   Asked whether work is lost when the session goes inactive (yes — unless pushed or downloaded) and whether
   it can be deployed to Vercel "old style" (yes). Owner's friend had said Claude "messed up his repository" —
   reassured that nothing would be committed to the friend's repo.
4. Owner chose **General Training, target CLB 9**. **v1 built** (Next.js): dashboard, 1 Listening test (TTS audio),
   1 Reading test, 4 letters + 4 essays with model answers, 3 speaking sets, progress tracking in the browser,
   backup/restore. Tested in a headless browser; zip sent.
   - Gotcha: `npm init` copied the friend's repo URL into package.json and git — removed immediately.
5. **Deploy to Vercel:** the session's network blocked `vercel.com`; owner added `vercel.com` and `api.vercel.com`
   to the environment's **Allowed domains** and gave a Vercel token. First deploy failed (old CLI version), worked
   with Vercel CLI 65.5.0. Live at https://ielts-coach-pi.vercel.app. New projects have **Vercel Authentication**
   on — Claude's attempt to switch it off was blocked by a safety check, so the owner switched it off in
   Settings → Deployment Protection.
6. Owner asked if it keeps working after the session ends (yes — it's hosted on Vercel; only the session's copy
   of the code disappears, and the zip holds it).
7. **Big upgrade request:** update progress without backup/restore, make practice like the real exam, add more
   content from internet research, make it a realistic coach. Owner chose: **cloud save**, **no AI**,
   **4 full tests per module**.
   - Research (IDP / ielts.org pages): computer-delivered IELTS has a timer, a bottom navigation bar with all 40
     questions, a **Review** flag, highlighting, text on the left/questions on the right; Listening has reading
     time before each part, review time after each part, recordings played once and **2 minutes** at the end;
     GT Reading = 3 sections (everyday texts, workplace texts, one long article), 40 questions, 60 minutes.
   - Built: real-exam screens, automatic Listening flow, 60-minute two-task Writing, examiner-led Speaking,
     coach home (today's plan, streak, weak question types), study plan, accounts + cloud save, merge across
     devices. Added Reading tests 2–4, Listening tests 2–4, Writing tests 5–8, Speaking sets 4–10.
   - Bugs found by browser tests and fixed: Speaking skipped its first question (timer carried over from the
     intro), timers not resetting between questions, overlapping layout on phones, Next.js dev badge covering
     the Review checkbox in tests.
8. Owner saw **Neon** in Vercel Storage → the app was changed to support **Neon or Upstash** automatically.
   Owner connected Neon and gave a new token → **deployed** (build OK, 39 pages + 5 API routes).
9. Owner asked for this notes file so a future session can continue without re-explaining.

### Session 2 (29 Oct 2026, later)

1. Code is now on GitHub: `ProudStone-576/Ielts-coach` (pushed from the zip with full history, branch
   `ccr-ca1693ab-rwn0ez`; `main` still to be created and connected to Vercel).
2. Friend reported **Listening stopped part-way**. Causes fixed in `lib/speech.ts`: Chrome can garbage-collect an
   utterance so its `end` event never fires (now kept referenced + a watchdog per sentence); the phone screen
   locking during reading time stops speech (now a Screen Wake Lock during the test); iPhones need speech to start
   from a tap (`unlockSpeech()` on Start). Tested with a fake speech engine that drops sentence endings.
3. Owner felt the app was "missing some vibe" (generic dashboard look, robotic browser voices). The friend wants
   **premium / serious**, like Instagram, YouTube or Netflix, and a coach with personality named **Yuvraj**.
4. **v3 redesign:** always-dark premium theme (near-black + gold accent, Inter + Fraunces fonts via `next/font`),
   Netflix-style home (cinematic hero with Yuvraj's headline and a big Play button, stat strip with "Yuvraj's rule
   of the day", scorecard, a shelf of poster tiles per module), poster grids on library pages, new sign-in screen.
   Yuvraj = gold "Y" monogram (`components/Yuvraj.tsx`); his voice is in `lib/coach.ts` (`coachHeadline`,
   `coachMessage`, `ruleOfTheDay`, `testFeedback`). **Exam screens deliberately stay light/plain** like the real
   computer-delivered test (light tokens are re-declared on `.exam` in `globals.css`). The mock Speaking examiner
   is not Yuvraj (a real examiner is a stranger).
5. **Natural Listening voices:** recordings are generated once with the open-source **Kokoro** model (Apache 2.0)
   and stored in `public/audio/listening/<test>/<clip>.mp3` (narrator clips + one `pN-script.mp3` per part).
   `content/listening-audio.ts` (generated) lists the tests that have audio and when every script line starts (used
   to highlight the transcript in review). `ListeningRunner` plays the clips through `lib/audio.ts` and falls back
   to browser speech if a clip is missing or fails. Narrator wording lives in `lib/narration.ts` (shared).
   **After adding or editing a Listening test, regenerate:**
   `npx -y tsx@4.19.2 --tsconfig tsconfig.json scripts/export-listening.ts > /tmp/listening.json` then
   `python3 scripts/make-audio.py /tmp/listening.json` (needs `pip install kokoro-onnx soundfile`, ffmpeg, and
   `huggingface.co`, `cdn-lfs.huggingface.co`, `cas-bridge.xethub.hf.co` in Allowed domains). Existing clips are
   skipped; pass `--force` to redo all. Speaker casting (who gets which voice) is in `make-audio.py` (`SEX`,
   `FEMALE`, `MALE`). Kokoro has no Australian accent. Checked by transcribing the clips with faster-whisper.
6. **Environments:** the account has three cloud environments ("Sim" and two "Default"). This session ran in
   "Default"; domains added to the wrong one have no effect. Default now allows Hugging Face and Vercel.
7. **Vercel ↔ GitHub:** the live project (`ielts-coach`, team **urbanthug**, id `prj_pi124NyFWsXjlwHWyzLsd8UeG7P5`)
   has **no Git connection**. Linking via the API failed: "You need to add a Login Connection to your GitHub account
   first" — the urbanthug Vercel account has no GitHub login; Taran's GitHub connection is in a different Vercel
   account. **To do:** log into Vercel as urbanthug → Account Settings → Authentication → connect GitHub as
   ProudStone-576, then link the project to `ProudStone-576/Ielts-coach` with Production Branch `main`.
8. **Deployed** v3 (redesign + Listening fix + recorded voices) with the CLI and a token, after the owner said
   "yes, deploy to production" (the session's safety check blocks production deploys without that). Ready at
   https://ielts-coach-pi.vercel.app. **Cloud save confirmed on the live site:** signed up in one browser, set an
   exam date, signed in from a fresh browser and saw it. A throwaway account `claude-test-…@example.com` remains in
   the database.

### Session 3 (30 Oct 2026)

1. Friend's feedback: wants **real exam timing**, and the voices "look like AI" — Listening Part 2 sounded like a
   whisper and very slow. Cause: Kokoro's `af_nicole` is a whispering voice (116 wpm vs 165-185 elsewhere), and
   loudness varied by 5 dB. Fixed: only Kokoro's best-rated voices, loudness normalised to -16 LUFS.
2. **Listening rewritten to full length:** every script 2-3x longer (~8,700 words total, same questions and
   answers), and Parts 1-3 have the real exam's mid-part break ("Before you hear the rest of the conversation,
   you have some time to look at questions 7 to 10"), via `pause: { beforeLine, fromQuestion }` on the part.
   Each half is its own recording (`pN-script.mp3`, `pN-script2.mp3`); narrator clips `pN-pause`/`pN-resume`.
   `check:content` now also checks each written answer is heard in the right half. Whole test ≈ 22 min with
   Kokoro (real CD-IELTS ≈ 30). Reading/Writing/Speaking timings already matched the real exam.
3. Owner chose **Microsoft Azure** neural voices (free F0 tier). `make-audio.py` uses Azure when
   `AZURE_SPEECH_KEY` (+ `AZURE_SPEECH_REGION`) is set, otherwise Kokoro; every line is cached in
   `~/.cache/ielts-tts`. Network needs `<region>.tts.speech.microsoft.com` allowed. **Recorded with Azure**
   (region eastus, 24 voices incl. real Australian accents; narrator en-GB-RyanNeural): 130-165 wpm, whole test
   23-26 min, all 87 written answers verified audible, full run checked in the browser. The owner was asked to
   regenerate the Azure key afterwards; a new key is needed to re-record.
4. Not live yet: the last token was for one deploy only; production needs a new token or the urbanthug ↔ GitHub
   connection (see session 2, item 7).

## 6. Repositories — important

- **`proudstone-576/c9orf72-als-proteostasis-study`** is the **friend's ALS research repo**. The cloud session
  happened to start there. **Do not commit, push or change anything in it.** The IELTS app has nothing to do
  with it.
- The IELTS app is its own project (folder `new-project`, package name `ielts-coach`) and should get its own
  GitHub repo.

## 7. How the app works (architecture)

**Stack:** Next.js 15 (App Router) + React 19 + TypeScript. No CSS framework (plain CSS with light/dark tokens in
`app/globals.css`). One extra runtime dependency: `@neondatabase/serverless` (plus `server-only`).

**Content (all original, plain TypeScript data):**

| File | What |
|---|---|
| `content/reading.ts` + `content/reading-more.ts` | Reading tests `gt-1`…`gt-4` (3 sections, 40 Qs each) |
| `content/listening.ts` + `content/listening-more.ts` | Listening tests `test-1`…`test-4` (4 parts, scripts read by TTS, 40 Qs each) |
| `content/writing.ts` + `content/writing-more.ts` | 16 tasks (8 letters, 8 essays) with model answers; `WRITING_TESTS` pairs them into `w-1`…`w-8` |
| `content/speaking.ts` | Speaking sets `set-1`…`set-10`, band descriptors, filler words |

Question types: `mcq`, `tfng`, `ynng`, `select` (matching with shared options; roman numerals = headings),
`text` (accepts a list of correct answers; case/punctuation-insensitive). Optional `skill` label per group
drives the weak-area analysis.

**Exam screens** (`components/`): `exam/ExamFrame.tsx` (full-screen header/timer + bottom `Navigator`),
`exam/useExamState.ts` (answers, Review flags, navigation), `exam/Highlightable.tsx` (CSS Custom Highlight API),
`exam/Results.tsx` (score + coach feedback), and one runner per module: `ReadingRunner`, `ListeningRunner`
(automatic flow: narrator → 30 s reading → script once → 30 s check → … → 2 min final check → auto-submit),
`WritingRunner` (both tasks, 60 min, then self-assessment rubric; band = (T1 + 2×T2)/3),
`SpeakingRunner` (examiner script, answer time limits, MediaRecorder + Web Speech transcription).

**Coach** (`lib/coach.ts`, `components/CoachHome.tsx`, `app/plan/page.tsx`): today's plan (modules furthest from
target first), week-by-week plan to the exam date, streak, weak question types with tips, post-test feedback.

**Scoring** (`lib/scoring.ts`): official-style raw→band tables (Listening; GT Reading), IRCC CLB table, IELTS
rounding, answer checking.

**Accounts & cloud save:**
- `lib/server/db.ts` — key-value store: Upstash Redis (`KV_REST_API_URL`/`KV_REST_API_TOKEN`) **or** Neon
  (`DATABASE_URL`/`POSTGRES_URL`, table `ielts_kv`) **or** in-memory during local dev. No DB in production →
  app runs in "local" mode (browser-only, backup button shown).
- `lib/server/auth.ts` — email + password (scrypt), signed httpOnly session cookie (1 year). Secret =
  `AUTH_SECRET` env var if set, otherwise derived from the DB credentials.
- API routes: `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`, `/api/me`, `/api/progress` (GET/PUT).
- `lib/storage.ts` — progress is kept in localStorage (instant/offline) and pushed to the cloud ~0.8 s after each
  change; on sign-in the cloud copy is pulled and merged. `lib/merge.ts` keeps all test attempts from both
  copies (deletions tracked as tombstones) and takes settings/drafts from the newest copy.
- `components/AuthGate.tsx` shows the sign-in/sign-up screen when cloud save is available.

**Speech:** `lib/speech.ts` (browser text-to-speech, one voice per speaker, splits long lines into sentences
because some browsers stop long utterances; volume control). Best in Chrome/Edge.

## 8. Deploying

- **Preferred (after GitHub works):** connect the GitHub repo to the Vercel project; pushes deploy automatically.
- **From a Claude cloud session (current method):**
  1. The environment's network must allow `vercel.com` and `api.vercel.com` (environment menu → Edit →
     Network access → Allowed domains).
  2. The owner creates a token at https://vercel.com/account/tokens (1-day expiry) and pastes it.
  3. Install a recent CLI (`npm install --no-save vercel@latest` — v39 was too old) and run
     `VERCEL_TOKEN=… npx vercel deploy --prod --yes` in the project folder (it links to project `ielts-coach`).
  4. The session cannot open `*.vercel.app` (proxy 403), so verify via the build log
     (`/v3/deployments/<id>/events`) and ask the owner to check the live site.
  5. Remind the owner to delete the token afterwards.
- **From the owner's computer:** install Node.js LTS, unzip, run `npx vercel --prod` in the folder.

## 9. Development & testing tips (learned the hard way)

- Run checks: `npx tsc --noEmit` and `npx next build`.
- **Answer-key validator:** `npm run check:content` (`scripts/check-content.ts`) checks that every test has exactly
  40 questions, IDs are unique, every `text` answer appears in its passage/script, MCQ letters and matching options
  exist, and every script speaker has a voice. Run it after adding or editing tests.
- Browser tests used the pre-installed Playwright/Chromium. For Listening, set
  `localStorage["ielts-dev-fast"] = "1"` to shrink all waits (testing hook in `ListeningRunner`).
  For Speaking, launch Chromium with `--use-fake-ui-for-media-stream --use-fake-device-for-media-stream`.
- `next dev` uses the in-memory DB, so sign-up/sync can be tested locally; `next start` (production mode)
  without DB env vars runs in local/browser-only mode.
- `devIndicators: false` in `next.config.ts` — the dev badge covered the exam's Review checkbox.
- Don't use `pkill -f "next …"` in the same shell command — it kills its own shell. Stop servers by task ID.
- Don't build into `.next` while `next dev` is running from the same folder.

## 10. Owner preferences for future sessions

- Explain in plain language; give exact click-by-click steps for anything they must do (Vercel, GitHub).
- Commit after every step and send an up-to-date **zip** after every major step until the code is on GitHub.
- Ask before decisions that cost money or need accounts/keys; otherwise just get on with it.
- Keep the friend's ALS repository untouched.
