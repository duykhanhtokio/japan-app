# JLPT recovery — one local durable unit

This is one isolated child turn. Read repository state; conversation history is not authoritative.

Mandatory order:

1. Read `AGENTS.md`, `docs/AI_SESSION_START_HERE.md`, `docs/jlpt-workspace/JLPT_UI_LOCK_RULES.md`, the newest UI-lock checkpoint, and the current exam checkpoint completely.
2. Inspect local HEAD, upstream, and working tree. Do not fetch, pull, push, contact GitHub, reset, checkout, clean, or delete files. The outer supervisor owns all network persistence.
3. Run the JLPT UI-lock check before editing. Find the first available incomplete unit from the real checkpoints/catalog. Do not redo a remote-verified unit.
4. Make a narrow backup, then complete exactly one reasonable unit: written source recovery, listening candidate timing/data, explanation/translation batch, or approved data/adapter integration.
5. Run relevant local schema/content/count/key/ID/audio-range/adapter/runtime/TypeScript checks, the UI-lock check, and `git diff --check`.
6. Update the authoritative checkpoint truthfully and create exactly one narrow local commit. Do not try to record that commit's own SHA, claim remote persistence, or begin a second unit; after remote verification the outer supervisor creates and persists the exact-SHA checkpoint record.

Scope and truth rules:

- Continue N1 07/2015 from its first not-remote-verified unit (currently expected written questions 39–45, but verify the checkpoint). Keep question 29 `BLOCKED_SOURCE_UNREADABLE`; never infer it from the answer key.
- An unreadable written question or unresolved listening segment is a local blocker only. Record its source/reason and continue other readable questions, segments, or exams. `BLOCKED_GLOBAL` is allowed only when no written, listening candidate, explanation, translation, or integration unit remains available anywhere.
- Listening is authorized. Build candidate timings from repository audio, official scripts/keys/images, prior approved structures, local word timestamps/transcription, silence, JLPT cues, and duration. Explicitly validate seconds-to-milliseconds conversion, bounds, order, overlap, question mapping, segment count, and exclusion of closing announcements.
- Automatically generated timing must remain `candidate_unverified` (or the exact equivalent supported by the existing schema), with `perceptualApproval: false`, `humanReviewed: false`, provenance/tool version, source-audio SHA-256, candidate date, and `needs_later_review` plus a short reason when confidence is low. Never write `verified`, `human_verified`, perceptual/audio approval, or an equivalent human-review claim.
- Candidate listening may be integrated through approved data/adapters and the locked UI, but must retain an honest candidate exam/listening status. Do not add an audio-review tool and do not wait for per-segment user review.
- Never modify locked JLPT UI, interaction, navigation, storage, hashes, or pre-submit answer/transcript/explanation visibility.
- Finish available N1 exams in chronological checkpoint/catalog order, then N2, then N3, then remaining sourced levels. The catalog target is all 50 entries with truthful readiness states, not inflated verification.

End with exactly one machine-readable line:

- `LOCAL_UNIT_READY <full-sha> <exam-id> <unit>` after the one local commit;
- `NO_LOCAL_CHANGE_CONTINUE <exam-id> <next-unit>` when the current item is locally blocked but another repository-backed unit is available;
- `RATE_LIMITED` for an actual model capacity/rate limit before any changes;
- `BLOCKED_GLOBAL <reason>` only under the global rule above;
- `COMPLETE_ALL_AVAILABLE` only when repository evidence shows no available unit remains.
