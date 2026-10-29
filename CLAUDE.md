# IELTS Coach

Read `PROJECT_NOTES.md` first — it holds the full history, the owner's requirements, current status, architecture,
deployment steps and next steps. Update it at the end of every session.

Key rules:
- The owner is not a developer: explain simply and give click-by-click steps.
- Commit after every step; until the code is on GitHub, also send the owner a zip after every major step.
- Never touch the friend's repo `proudstone-576/c9orf72-als-proteostasis-study`.
- Content must stay original (no copying from official IELTS papers). Validate answer keys after adding tests.
- Never commit tokens or secrets.
- Before finishing a change: `npx tsc --noEmit` and `npx next build`.
