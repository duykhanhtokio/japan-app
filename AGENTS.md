# Project rules for automated contributors

## Mandatory session startup

Before planning, editing, restoring, integrating, or reporting project work, read `docs/AI_SESSION_START_HERE.md` completely, then follow its mandatory reading order and verify the real working tree.

Exception: a child session launched by `scripts/run-jlpt-simple-loop.sh` must use the compact reading list embedded in that script. It must not reread the full startup document on every exam iteration.

## Mandatory original JLPT authoring contract

At the beginning of EVERY new JLPT authoring session, reread both full authoring documents (`docs/jlpt-workspace/JLPT_ORIGINAL_AUTHORING_RULES.md` and `docs/jlpt-workspace/JLPT_LEVEL_BLUEPRINTS.md`); prior-session memory or an earlier read does not satisfy this requirement. Before creating or editing any new JLPT content, read `docs/jlpt-workspace/JLPT_ORIGINAL_AUTHORING_RULES.md` in full and read `docs/jlpt-workspace/JLPT_LEVEL_BLUEPRINTS.md` in full, then the current original-authoring checkpoint and approved voice configuration. This applies to prompts, options, answers, passages, scripts, images and audio. Original authoring uses structural/timing-only reference metadata, never legacy question content. Follow the answer-position balancing/anti-pattern requirements and measured listening timing/break blueprint. Do not invoke the historical recovery loop for this task. The main authoring rules are `JLPT_ORIGINAL_AUTHORING_RULES.md` version 5, including all five level tables and the metadata-only source restrictions. Check machine metadata in `src/data/jlpt-original/authoring-blueprints.json` against that contract. Current scope is six complete integrated exams per level (30 total); complete and integrate all 30 before publisher-wide testing, with no pilot/draft-review gate. Listening acceptance tolerance is unconfirmed, not a fixed ±60 seconds. Present pacing tables and confirm unresolved points before changing audition pause settings. Every listening recording includes a 60000ms instrumental break after problem 2, with announcements before and after, before problem 3. Only genuinely unresolved consequential ambiguities need publisher confirmation.

## Default JLPT recovery process

The default unattended process is now the single foreground loop:

```bash
bash scripts/run-jlpt-simple-loop.sh
```

It runs directly on `recovery/jlpt-n3-n1` and advances sequentially through N1, N2, and N3, oldest exam first within each level. Each exam gets one `gpt-5.6-terra` call. Only when Terra fails to leave a complete validated commit may one `gpt-5.6-sol` fallback continue Terra's valid work; it must not restart the exam. A rate limit, network loss, or service failure stops safely without switching models or retrying. The older unattended supervisor, worker wrapper, result-schema, fixture, heartbeat, journal, and PID machinery remains historical compatibility material only and must not be used by the default process.

The authoritative durable state is `docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json`, the active exam checkpoint, and Git. Never infer progress from a branch name. N1 12/2015 is complete and remote-verified at `1846d8c13ac11988cda08b5e6267686933d60b28`. The next exam is N1 07/2016 (`n1-2016-07-exam-09`). Its checkpoint/manifest may not exist until that first exam attempt creates them narrowly. Do not revisit remote-verified work.

Each loop iteration must:

1. Do not reread this file or the full startup document. Read only active progress, the current checkpoint and manifest when present, UI-lock rules, and necessary same-exam sources.
2. Finish all remaining repository-backed work for exactly one exam.
3. Produce complete written data and integrated listening marked `candidate_unverified`.
4. Keep AI timing fields at `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review`.
5. Defer multilingual explanations and translations.
6. Read required source pages once in a batch, reuse the extracted content, and use local scripts for sorting, counts, timing conversion, IDs, hashes, and ranges.
7. Run active-exam validation once at the end, then `git diff --check` once and the UI-lock check once. Do not run repository-wide validation or repeat unchanged checks.
8. Mark only the current exam complete in active progress, create exactly one narrow exam commit, then let the shell push once, fetch, and require `WORK PERSISTENCE PASS`.
9. Do not point active progress at the next exam before persistence. After persistence, the shell derives the next exam from the canonical ordered exam list; no SHA-only follow-up commit is allowed.

A source-unreadable item is a LOCAL blocker. Record it precisely and continue every other available unit. At the end of each level, revisit that level’s LOCAL blockers before moving to the next level. Stop the whole loop only for a genuine global technical blocker, rate limit, loss of network, or lack of progress.

Never reset, checkout, clean, stash, delete, or overwrite existing work. Preserve legitimate unfinished working-tree data and continue it. If a local commit could not be pushed, the next loop run must push and verify it before processing new data.

Keep output bounded. Never run or print a full `git diff`, full JSON, transcript, source file, or generated dataset. Git inspection is limited to `git diff --stat`, `git diff --name-only`, `git status --short`, and `git diff --check`. The simple loop must remain one foreground shell loop and must not depend on `rg` or use `--approve-for-me`.

## Mandatory durable-work gate

Before editing, verify:

1. `git rev-parse --show-toplevel` succeeds and points to the intended Japan App repository.
2. The current branch is `recovery/jlpt-n3-n1` and its configured remote is recorded.
3. Local and remote-tracking HEAD are compared.
4. Existing uncommitted changes are identified and preserved.

A local edit, backup, validation, or commit is not durable proof. An exam is durable only after its narrow commit is pushed, fetched, and `node scripts/check-work-persistence.mjs` reports `WORK PERSISTENCE PASS`. If the network is unavailable, retain the local commit or valid unfinished data and stop safely without starting another exam.

Do not claim that work is saved, complete, safe, or available for another session without remote verification. Do not create a second commit merely to record the first commit’s SHA.

## Execution-evidence discipline

- Never claim that a process is running after returning to a prompt without a current live-process check.
- Completion claims require immediately preceding command evidence.
- Do not stop at analysis while a safe authorized implementation step remains.
- Validate every seconds-to-milliseconds conversion explicitly.
- Do not retry rate limits, network failures, or zero-progress iterations indefinitely.

## JLPT approved exam UI lock

The user authorized V6 review behavior and V7 sequential naming on 2026-09-27, then V9 Japanese catalog and restart behavior and V10 readable exam cards on 2026-09-28. The current authorized hashes are in `scripts/check-jlpt-approved-ui-lock.mjs` and `docs/checkpoints/JLPT_APPROVED_EXAM_UI_LOCKED_V10.md`. The V6 review still shows only correct, incorrect, or unanswered status and the correct option. Detailed explanations, source-page references, and listening transcripts remain hidden; preserve source data for future use.

For N4/N5, the approved runner plays the recording continuously. Per-question audio timing is optional review metadata, not an integration gate. A candidate must still provide complete answerable questions, choices, answers, and its recording; do not substitute OCR placeholders for source text.

Before changing JLPT data or integration, read:

- `docs/checkpoints/JLPT_APPROVED_EXAM_UI_LOCKED.md`
- `docs/jlpt-workspace/JLPT_UI_LOCK_RULES.md`

Run `node scripts/check-jlpt-approved-ui-lock.mjs` after JLPT work. Do not change approved hashes, snapshots, layout, styles, interaction behavior, session behavior, or routes without explicit user permission. Never reintroduce Royal A+F components into the JLPT exam screen.

Exception explicitly approved by the user on 2026-09-29: the shared Royal Back control may replace the JLPT exam header Back only; relock that file after validation. Other Royal exam UI remains subject to the restriction above.

New exams must integrate through data/adapters compatible with the approved shared UI. Preserve independent exam IDs, question IDs, answer state, session keys, audio mappings, navigation, results, and post-submission review behavior. Never expose answers, transcripts, or explanations before submission.

Do not overwrite the protected N1 12/2012 explanation or audio assets without explicit user instruction.

## Image coverage across devices (user requirement, 2026-09-29)

Every scene or card background in the app must fully cover its allocated display frame on iPhone, iPad, Android, and desktop/web aspect ratios. Never leave blank bands, letterboxing, or a blurred duplicate around a smaller `contain` image. Use aspect-preserving `cover` geometry (`max(viewportWidth/sourceWidth, viewportHeight/sourceHeight)`) for the primary artwork and apply the exact same scale and centered offsets to hotspots and overlays. Cropping at the edges is acceptable only if essential subjects, controls, and tappable targets remain visible and usable; otherwise provide responsive framing or alternate artwork. Run geometry checks and inspect actual simulator/browser screenshots at representative portrait and landscape sizes before asking the user to test. Do not claim device validation from geometry checks alone.

## Royal panel defaults — user instruction 2026-10-02

Use `RoyalContentPanel` from `src/components/ui/RoyalPanels.tsx` for content-item cards (the new paper/gold frame). Use `RoyalExplanationPanel` for explanatory/instruction areas (the Royal navy leaf frame). Keep these source-code defaults when adding screens. Full-image Home cards must retain their artwork/overlay-text layout and use border-only framing without blank bands. Dialogue text must fit its allocated panels without scrolling; lantern hints attach to the frame edge. The user specifically authorized new framing of the JLPT exam catalog on this date; exam-taking behavior and the other locked exam files remain unchanged.

Mandatory joint reading: reread this session entry guide, AGENTS.md, both full JLPT authoring documents, then the current checkpoint and machine metadata before each new JLPT authoring session. Neither a summary nor reading only one document satisfies this requirement. If the two documents or machine metadata conflict materially, stop the affected work and ask the publisher; do not guess.

Source-content isolation for new JLPT authoring: never print or concatenate legacy source-packet JSON, OCR, transcripts, answer tables or source datasets into the authoring context. Inspect keys or use an isolated whitelist parser that emits only approved structural/timing fields. `scripts/inspect-jlpt-n5-reference-structure.py` emits labels/counts only and explicitly leaves uncertain example/pause metadata unverified. If content is accidentally exposed, disclose and record it, stop new creative authoring in that context, and resume new authorship in a context containing only the approved metadata.

## Mandatory Tokutei Gino 介護 authoring contract — approved 2026-10-07

Before EVERY new 介護 authoring session, read `docs/ssw-workspace/kaigo/KAIGO_AUTHORING_RULES.md` completely, then `KAIGO_AUTHORING_CHECKPOINT.md` and `approved-plan.json` in that directory, plus the source pages for the current unit. Memory or a prior-session read is insufficient. The publisher approved independent new expression/assets based on verified knowledge/terms, 30 minutes/day with no maximum weeks and complete source-knowledge coverage (publisher update 2026-10-09), Japanese dialogue with Vietnamese support, approximately 6–12 turns, reviewed bounded-response scenarios, and one initial skills mock plus one Japanese mock for review. Create enough stable-role NPCs for all required contexts; do not limit the system to one universal NPC. This sector-specific contract does not authorize UI redesign, deletion, source redistribution or release of unreviewed content.
