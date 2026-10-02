# JLPT UI lock V11 — Royal Back

Date: 2026-09-29 (Asia/Tokyo). User expressly authorized unlocking the JLPT Back appearance, applying the common Royal design, then relocking it. Scope: the Back control of `JlptExamHeader` only. The existing `onBack` callback, exam state, answers, audio, and review behavior are unchanged.

Previous SHA-256: `e1b9298d38229bb8004051b2aee4cb66471ea49205fed7e5b22bbf8aba7ebca0`.
New SHA-256: `03cfb15b58da93360f277b5bf6b0b3c63bb63adcd644a4b9a184dbdfce03f90d`.

`node scripts/check-jlpt-approved-ui-lock.mjs` enforces the new hash. TypeScript and static lock checks pass. Visual acceptance on iPhone, iPad, Android and web remains pending; this checkpoint records code lock, not device approval. All other file hashes remain as before.
