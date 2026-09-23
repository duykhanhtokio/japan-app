# JAPAN APP — AI SESSION START HERE

```text
DOCUMENT ROLE: AUTHORITATIVE SESSION ENTRY POINT
READ: AT THE START OF EVERY AI/CODEX SESSION
PROJECT: Japan App
LAST UPDATED: 2026-09-21
```

This file exists so a new AI session can continue work without asking the user to reconstruct prior decisions. Chat history is supporting context only. The current project files, checksums, checkpoints, and validation scripts are authoritative.

## Current cross-exam scope — 2026-09-21

The user has authorized automated end-to-end recovery of all available JLPT exams, including listening candidate segmentation and integration. Human per-segment review is deferred until after broad catalog integration. Automatically derived timing must be explicitly candidate/unverified, must not claim human/perceptual/audio approval, and may carry `needs_later_review` without blocking other work. A source-unreadable written question or unresolved listening segment is a local blocker only; record it and continue all other available units.

The default unattended entry point is `bash scripts/run-jlpt-simple-loop.sh`. It is one foreground shell loop. Each complete exam gets one `gpt-5.6-terra` call; only an incomplete or final-validation-failed Terra attempt permits one `gpt-5.6-sol` continuation. Sol preserves valid Terra work and never restarts the exam. Rate limits, network loss, and service failures stop immediately without model switching or retries. The loop advances through N1, N2, and N3, oldest exam first within each level. Historical multi-process automation is not part of the default process.

`docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json`, the current checkpoint, and Git are authoritative durable state. N1 12/2015 is complete and remote-verified at `1846d8c13ac11988cda08b5e6267686933d60b28`. The next exam is N1 07/2016 (`n1-2016-07-exam-09`). Its checkpoint/manifest may be absent before the first attempt and must then be created narrowly by that attempt. Do not repeat remote-verified work.

## 1. Mandatory startup procedure

Before changing anything:

1. Confirm the project root contains `package.json`, `src/`, `assets/`, `scripts/`, and this file.
2. Read this file completely.
3. Read, in order:
   - `AGENTS.md`
   - `docs/jlpt-workspace/JLPT_UI_LOCK_RULES.md`
   - newest `docs/checkpoints/JLPT_APPROVED_EXAM_UI_LOCKED*.md`
   - checkpoint for the exam named under **Current JLPT resume point** below.
4. Inspect the actual working tree. Never infer that an installer, patch, or previous response was applied.
5. Run the startup checks in section 9.
6. Record the exact files that may change, back them up with a timestamp, and record SHA-256 before editing.
7. Continue from the first unfinished item. Do not restart completed OCR, translation, or verification work.
8. Before relying on any claimed completed work, run `node scripts/check-work-persistence.mjs` and confirm the exact local commit exists on the configured remote branch.

Child sessions launched by `scripts/run-jlpt-simple-loop.sh` must not reread this document or `AGENTS.md`. They use only the compact contract embedded in the script: active progress, the current checkpoint and manifest when present, UI-lock rules, and exact same-exam sources. They do not create per-iteration backups; Git history and the one-exam durability gate are the rollback and persistence mechanisms.

### Choose the durable execution mode before doing work

For any substantial multi-page or multi-stage recovery, use these modes in priority order:

1. **Default — Codex CLI in the user's real clone:** create or reuse a dedicated remote-tracking branch (for example `recovery/n1-2013-12`); let the AI commit completed units and push them directly with the user's configured Git credentials. The user reviews and merges at the end rather than applying intermediate patches.
2. **Fallback — write-enabled remote development checkout:** use the same dedicated-branch, automatic commit/push workflow.
3. **Last resort — ephemeral workspace without push access:** explain the limitation before beginning and recommend switching to mode 1. Continue with downloadable patches only if the user chooses this mode; batch several reviewable units per cumulative patch when safe instead of imposing one manual patch per page.

Never silently adopt the last-resort workflow as the project's normal process. The absence of push credentials is an environment limitation to surface and solve at startup, not a reason to transfer repetitive Git work to the user.

If a reported state conflicts with actual files or checks, trust the files and checks. Record the discrepancy before proceeding.

### Ephemeral-workspace warning

AI workspaces are temporary and may be replaced without notice. Local files, uncommitted changes, local commits, `.jlpt-backups`, `/tmp` outputs, and generated artifacts can all disappear. GitHub (or another verified remote explicitly chosen by the user) is the durable source of truth.

No AI may interpret “continue continuously” as permission to postpone persistence. The durability gate in section 10 takes precedence over the continuous-work rule.

### Execution evidence and unit safety

- Never report a process as running after control returns without a current process/tool check.
- Completion reports require immediately preceding tool evidence; file work requires write, validation, commit, push, fetch, and `WORK PERSISTENCE PASS`.
- Do not finish at analysis or a plan when a safe authorized implementation step remains.
- Validate seconds ↔ milliseconds conversions explicitly before writing audio timing values.

## 2. Project architecture relevant to JLPT

| Responsibility | Location |
|---|---|
| JLPT route | `src/app/[level]/[section].tsx` |
| Exam catalog screen | `src/components/jlpt/ApprovedJlptExamCatalog.tsx` |
| Approved exam-taking controller | `src/components/jlpt/N1OfficialTrial.tsx` |
| Approved shared exam UI | `src/components/jlpt/ui/JlptExamUI.tsx` |
| Approved design tokens | `src/theme/jlpt-exam-design-system.ts` |
| Session persistence | `src/services/jlpt-trial-session-storage.ts` |
| Structured N1 registry | `src/data/jlpt-official/approved-n1-exams.ts` |
| Pending/catalog metadata | `src/data/jlpt-official/jlpt-exam-catalog.ts` |
| Official structured data | `src/data/jlpt-official/` |
| Source declarations/answer keys | `src/data/jlpt-mock/` |
| Question, script, and audio assets | `assets/jlpt/<level>/<year-month>/` |
| Conversion checkpoints | `docs/jlpt-workspace/conversion/` |
| Backups | `.jlpt-backups/` |
| Validation scripts | `scripts/check-jlpt-*.mjs`, `scripts/check-n1-*.mjs` |

All new exams must use data/adapters compatible with the approved shared UI. Do not create a separate visual exam implementation for each exam.

## 3. Non-negotiable approved UI policy

The current JLPT exam UI is user-approved. It is not Royal A+F and must not be redesigned, modernized, approximated, or replaced without explicit user permission.

The following four files are absolutely byte-locked:

```text
src/components/jlpt/N1OfficialTrial.tsx
src/components/jlpt/ui/JlptExamUI.tsx
src/theme/jlpt-exam-design-system.ts
src/services/jlpt-trial-session-storage.ts
```

Approved hashes at this checkpoint:

```text
36389c36539c7d942275264c4329e8f90183e865b61faee7fe9cd2d4081c6509  src/components/jlpt/N1OfficialTrial.tsx
0ecea5a9f733d8d076bde7b7c1ea75be692255aae55e4447da3121ae06aec6cc  src/components/jlpt/ui/JlptExamUI.tsx
9d8276e32e5b1b25485d84cbe961acd5cbca5b106ee2dd95e6fbaadd9d2b9bb7  src/theme/jlpt-exam-design-system.ts
117ee15c311453c01c230e6c46290388474874d4384284c9f2ac43f4ed67a51d  src/services/jlpt-trial-session-storage.ts
```

Registry-only permission previously granted by the user:

```text
src/data/jlpt-official/approved-n1-exams.ts
src/data/jlpt-official/jlpt-exam-catalog.ts
```

These two registry files may be extended only to register verified structured exams. They are governed by structural checks rather than frozen hashes. This permission does not extend to any UI/session file.

Never introduce these components into the exam-taking route:

```text
RoyalInfoPanel
RoyalButton
RoyalOptionRow
RoyalTitlePanel
RoyalDialogueFrame
ApprovedScannedExam
ScannedN1OfficialTest
N1ExamCatalog
N1Official201207Test
N1Official201212Test
```

Never use complete PDF page images as runtime questions. Images may be used only for question-specific illustrations that genuinely belong to an item.

## 4. Required behavior for every structured exam

Every integrated exam must preserve the approved behavior:

- Select one answer and show the approved selected color.
- Persist answer state independently for each question and exam.
- Preserve state when navigating away and returning.
- Do not expose answers, correctness, explanations, or transcripts before submission.
- Confirm before submitting incomplete work.
- Show results after submission.
- Show detailed explanations/transcripts only inside post-submission review.
- Preserve previous/next navigation, question navigator, progress, timing, Back behavior, and audio controls.
- Shared audio segments may serve multiple response units, but those responses must have distinct question IDs and answer state.
- Every exam must have a unique stable exam ID and session storage key.

## 5. Catalog invariant

The catalog must always contain exactly 66 entries:

| Group | Count |
|---|---:|
| N1 official | 15 |
| N2 official | 13 |
| N3 official | 17 |
| N4 official | 9 |
| N5 official candidates | 7 |
| Mock N1–N5 | 5 |
| Total | 66 |

The N4 periods are exactly 12/2011, 12/2012, 07/2013, 12/2013, 07/2014, 07/2017, 07/2018, 07/2021, and 12/2021. Converting an exam from pending to structured means replacing its pending entry with one structured entry. Never exceed the exact catalog invariant. Never hide, delete, or filter pending exams merely because structured conversion is incomplete.

The N5 source-candidate periods are exactly 12/2011, 12/2012, 07/2013, 07/2017, 12/2018, 12/2020, and 12/2021. A catalog period is not proof of source identity: ambiguous or practice-workbook packages remain `incomplete` until their identity and content are independently verified. Converting any pending exam to structured replaces its pending entry and never adds a duplicate.

Current expected registry totals with N1 07/2014 installed:

```text
structured official: 45
pending official: 16
mock ready: 5
total: 66
```

At session start, verify rather than assume these totals. If the project still reports `structured official: 2` and `pending: 43`, the N1 07/2013 runtime package has not been installed in that working tree.

## 6. Protected verified N1 12/2012 data

Do not overwrite, regenerate, normalize, or translate these files without a new explicit request:

```text
src/data/jlpt-official/n1-2012-12/explanations.13-locales.json
assets/jlpt/n1/2012-12/audio/n1-2012-12.mp3
```

Expected SHA-256:

```text
15d0292b9f8e4ed4a740d657cbad11d3375ef831d0669951c2ad70d372759fb1  explanations.13-locales.json
848356bbfd00e0c4e91b5a20c55bae9a44b4d440fbdad76f912c4974b94b1919  n1-2012-12.mp3
```

Expected verified state:

- 70 written questions.
- 36 listening response units.
- 70 source explanations in `zh-CN`.
- 840/840 translations.
- AI translations retain `translated_ai_unreviewed` unless human-reviewed.
- Explanation fallback order: current app language, English, then `zh-CN`.

## 7. Current JLPT resume point

The machine-readable state `docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json` supersedes all historical prose below. As of 2026-09-21, N1 12/2015 is complete and remote-verified at `1846d8c13ac11988cda08b5e6267686933d60b28`. Continue with N1 07/2016 and do not redo earlier work.

The default loop completes one active exam per Terra call, with at most one Sol continuation. The current-exam commit marks only that exam complete; it must not point active progress at the next exam before push verification. After `WORK PERSISTENCE PASS`, the shell derives the next exam from the canonical ordered list, avoiding a second SHA-only commit. Multilingual explanations and translations are deferred. A source-unreadable item is LOCAL: record it, continue other work, and revisit level-local blockers before moving to the next level.

The historical text below preserves earlier exam checkpoints. When it conflicts with active progress, the active checkpoint, or current Git evidence, follow the current machine-readable state and Git.

Preserved completed exam: **N1 07/2014** has 70 written and **37** listening responses; do not inherit previous-exam counts. The user accepted its integrated candidate and 36 audio ranges on 2026-09-17. Preserve this remote-verified work and do not restart it. Never use a public translation service, runtime translation API, or translation dependency.

N1 12/2013 runtime/audio was accepted by the user on 2026-09-17. Its 106-response dataset is `structured_ready`. All 70 source explanations and 840 in-session translations are now assembled into 13 locales and integrated through the existing post-submission callback. Every target remains `generatedBy: AI`, `reviewedByNativeSpeaker: false`, `status: translated_ai_unreviewed`; source transcription verification does not certify printed errors. The user accepted the final explanation rendering in Simulator on 2026-09-17 (“đã kiểm tra ok”); N1 12/2013 is complete within the requested scope. Read the N1 07/2013 preservation checkpoint below, then `docs/jlpt-workspace/conversion/n1-2013-12/CONVERSION_CHECKPOINT.md`. Do not restart written/listening transcription or translation. No N1 12/2013 review gate remains. Preserve the completed exam while working from the newest N1 07/2015 checkpoint. Never send exam content to public translation services or add runtime translation APIs/dependencies.

First read:

```text
docs/jlpt-workspace/conversion/n1-2013-07/CONVERSION_CHECKPOINT.md
```

Expected N1 07/2013 candidate files:

```text
src/data/jlpt-official/n1-2013-07/exam.verified.json
src/data/jlpt-official/n1-2013-07-trial.ts
scripts/check-n1-2013-07-integration.mjs
```

Expected content:

- Exam ID: `n1-2013-07-exam-03`.
- 70 written responses.
- 36 listening responses.
- 106 total response units.
- 35 unique audio segments.
- 問題5 question 3 has two independent response units sharing one audio segment.
- Source duplication in written question 60 options 2 and 3 must remain unless a second authoritative source proves a correction.
- Status: `structured_ready`; the user confirmed successful N1 07/2013 runtime testing on 2026-09-15.

Required next action:

1. Verify the three N1 07/2013 structured files actually exist in the current working tree.
2. Verify `approved-n1-exams.ts` imports and registers `N1_2013_07_TRIAL` exactly once.
3. Verify `'n1-2013-07'` is no longer in the pending array.
4. Run all checks and preserve N1 07/2013 as completed.
5. Preserve completed N1 12/2013 and its user-approved runtime/explanation review records; the original continuous-work scope is fulfilled.

N1 12/2013 sources are expected under:

```text
assets/jlpt/n1/2013-12/question/
assets/jlpt/n1/2013-12/answer-script/
assets/jlpt/n1/2013-12/audio/n1-2013-12.mp3
```

Create/update its checkpoint under:

```text
docs/jlpt-workspace/conversion/n1-2013-12/CONVERSION_CHECKPOINT.md
```

## 8. OCR and source-verification rules

- OCR and Whisper are navigation aids, not authoritative sources.
- Compare every OCR result directly with the source page image/PDF.
- Correct Japanese characters, punctuation, question grouping, and choices against the source.
- Compare all answers with the answer key.
- Do not guess kanji, kana, questions, choices, answers, transcripts, or audio boundaries.
- A raw OCR result is never `structured_ready`.
- Preserve source hashes in each exam checkpoint.
- A missing/corrupt source, unreadable question, or unresolved candidate timing blocks only that item. Record it and continue other available units. Stop globally only when no written, listening candidate, explanation, translation, or integration unit remains available, or when all remaining work requires a locked UI change or unavailable runtime capability.
- When blocked, state the precise exam, page, question, file, verified facts, unresolved fact, checks attempted, and exact input/action needed.

## 9. Validation scope

Manual repository-wide maintenance may run the following full regression set:

```bash
node scripts/check-jlpt-approved-ui-lock.mjs
node scripts/check-jlpt-catalog-completeness.mjs
node scripts/check-jlpt-structured-exams.mjs
node scripts/check-jlpt-no-scanned-runtime.mjs
node scripts/check-jlpt-navigation-contract.mjs
node scripts/check-jlpt-50-exams-integration.mjs
node scripts/check-n1-2012-12-integration.mjs
```

When N1 07/2013 files exist, also run:

```bash
node scripts/check-n1-2013-07-integration.mjs
```

Manual release completion may also run:

```bash
npx tsc --noEmit
npm run lint
npx expo start -c
```

Lint warnings are not errors, but record their exact count. Do not claim iPhone visual verification unless the Simulator/device was actually used and screenshots were saved.

The simple loop never runs the whole-repository suite. Each model attempt builds in a batch and runs only its active-exam validator once at the end, then `git diff --check` once and `node scripts/check-jlpt-approved-ui-lock.mjs` once. A failed Terra final validation may be repaired by the single Sol continuation and validated once after the repair. Do not repeat a check when its inputs have not changed. The loop itself uses `bash -n` and `--smoke` for script validation; smoke must not call a model or modify exam data.

The loop must not print a full diff, JSON document, transcript, source file, or generated dataset. Git inspection is limited to `git diff --stat`, `git diff --name-only`, `git status --short`, and `git diff --check`. Source pages are opened once as a batch per attempt, and extracted content is reused. Mechanical sorting, counts, seconds-to-milliseconds conversion, IDs, hashes, and range checks belong in local scripts rather than record-by-record model reasoning.

## 10. Commit and remote-persistence protocol

### Normal low-effort workflow

Run the default process in the real local clone on the existing remote-tracking branch:

```bash
bash scripts/run-jlpt-simple-loop.sh
```

The script first pushes and verifies any existing local commit before allowing new data work. It preserves uncommitted work and never resets, checks out, cleans, stashes, or deletes it. The simple loop does not create repetitive backup directories; existing backups remain untouched, and Git provides the per-exam rollback record.

Each child Codex session owns one whole active exam and creates exactly one narrow commit. Terra is called once. Sol is called at most once, only to continue valid Terra changes when Terra did not leave a complete validated commit. If Terra already created an incomplete unpushed commit, Sol amends it instead of adding a second commit:

```bash
git status --short
git add -- <only files belonging to the active exam>
git commit -m "<narrow complete-exam description>"
```

The child does not push. Before advancing to another exam, the foreground shell performs exactly one push, then fetches and verifies:

```bash
git push origin "$(git branch --show-current)"
git fetch origin "$(git branch --show-current)"
node scripts/check-work-persistence.mjs
```

The persistence validator must report that:

- the working directory is a Git repository;
- the current branch has a configured remote branch;
- local HEAD equals the remote-tracking HEAD;
- the remote itself advertises that exact commit; and
- there are no uncommitted files belonging to the completed unit.

The exam commit keeps `activeExamId` on the exam it completes and records that exam in `completedUnits`; it never points to the next exam before the push is verified. After `WORK PERSISTENCE PASS`, the foreground shell derives the next exam from the canonical N1 → N2 → N3 ordered list without mutating progress or creating a SHA-only follow-up commit. No external runtime journal or result schema is required.

If the AI lacks push credentials or remote access, it must stop before accumulating expensive work and recommend continuing through Codex CLI in the user's real clone. If the user explicitly elects to stay in the restricted workspace, provide exact commit/push commands or cumulative patches at agreed checkpoints. It must not accumulate another page or exam only in the temporary workspace. Creating a ZIP in the same temporary workspace does not satisfy this rule.

Never delete existing backups. Never restore the whole project to solve a local problem. Never overwrite verified new data with an older backup. Never use a local backup as evidence that work will survive a new session.

## 11. Continuous-work rule

After completing a page, passage, section, exam, check, or checkpoint, continue immediately to the next unfinished item in the same session. A progress report is not a reason to stop. Do not ask whether to continue when the next action is already defined.

Exception: one child session must finish, validate, and commit its active exam; then the foreground shell must push, fetch, and verify it before starting the next exam. A network failure, rate limit, service failure, or failure after the single Sol fallback stops immediately without automatic retry.

Do not claim that a patch was installed on the user's Mac merely because it works in another workspace. For downloaded installers, verify the user's actual project with file-existence checks and validation output.

## 12. What a new AI should report

At startup, report only concise verified facts:

- Actual project path.
- UI-lock result.
- Catalog total and structured/pending counts.
- Presence and status of current candidate files.
- Current resume checkpoint and next concrete action.
- Any real blocker.
- Exact durable commit SHA and confirmation that it exists on the remote branch.

Never state “completed” solely because TypeScript passes, a ZIP was created, a local commit exists, or a checkpoint was written. Completion requires verified remote persistence.
