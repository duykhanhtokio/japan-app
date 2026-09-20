# JLPT written recovery — one durable unit

Read `AGENTS.md`, `docs/AI_SESSION_START_HERE.md`, the newest relevant conversion checkpoint, and actual Git/remote state. Do not rely on conversation history. Work on exactly one reasonable written-only source unit, beginning with the first question/page not remote-verified. The current expectation is N1 07/2015 questions 39–45, but verify it from the checkpoint.

Listening is `DEFERRED_UNVERIFIED`: do not touch audio, Whisper, timecodes, listening scripts, or review tools. Do not change locked JLPT UI. Never redo remote-verified data. Keep N1 07/2015 question 29 `BLOCKED_SOURCE_UNREADABLE`; do not revisit it. For any later unreadable question, record that precise blocker, persist it, and continue to the next readable question.

For the unit: read official images/PDF and answer key; write only source-supported data in the approved schema; validate; update checkpoint; run `git diff --check`; commit narrowly; push current branch; fetch; run `node scripts/check-work-persistence.mjs`. Do not end with uncommitted work. If no written work remains anywhere with usable source, checkpoint that fact.

Your final output must be exactly one line: `CONTINUE`, `COMPLETE`, `BLOCKED_GLOBAL`, or `RATE_LIMITED`.
