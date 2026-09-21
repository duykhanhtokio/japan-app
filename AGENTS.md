# Project rules for automated contributors

## Mandatory session startup

Before planning, editing, restoring, integrating, or reporting project work, read `docs/AI_SESSION_START_HERE.md` completely, then follow its mandatory reading order and verify the real working tree.

Exception: a child session launched by `scripts/run-jlpt-simple-loop.sh` must use the compact reading list embedded in that script. It must not reread the full startup document on every exam iteration.

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

Before changing JLPT data or integration, read:

- `docs/checkpoints/JLPT_APPROVED_EXAM_UI_LOCKED.md`
- `docs/jlpt-workspace/JLPT_UI_LOCK_RULES.md`

Run `node scripts/check-jlpt-approved-ui-lock.mjs` after JLPT work. Do not change approved hashes, snapshots, layout, styles, interaction behavior, session behavior, or routes without explicit user permission. Never reintroduce Royal A+F components into the JLPT exam screen.

New exams must integrate through data/adapters compatible with the approved shared UI. Preserve independent exam IDs, question IDs, answer state, session keys, audio mappings, navigation, results, and post-submission review behavior. Never expose answers, transcripts, or explanations before submission.

Do not overwrite the protected N1 12/2012 explanation or audio assets without explicit user instruction.
