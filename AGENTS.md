# Project rules for automated contributors

## Mandatory session startup

Before planning, editing, restoring, integrating, or reporting any work in this project, read the following file completely:

- `docs/AI_SESSION_START_HERE.md`

Then read every checkpoint or rule file listed by its "Mandatory reading order" section. Do not rely on chat history alone. Verify the actual working tree and run the startup checks before claiming the current state.

## Mandatory durable-work gate

This repository may be opened inside an ephemeral AI workspace. Files, `.git` objects, and local backup folders in that workspace can disappear between turns. Therefore a local edit, local commit, checkpoint file, validation pass, ZIP, or assistant progress report is **not** proof that work is preserved.

### Preferred execution environment

For multi-page JLPT restoration, conversion, translation, or integration work, the default recommendation is **Codex CLI running inside the user's real local clone on a dedicated remote-tracking branch**. The AI should work on a branch such as `recovery/n1-2013-12`, commit each completed unit, and push checkpoints itself using the user's existing Git credentials. The user should normally need to review and merge only after the exam is complete.

At the beginning of a new session, determine whether the AI can commit and push from the current checkout. If it cannot, say so before beginning expensive work and recommend moving the task to Codex CLI in the real clone. Do not make per-page downloadable patches the default workflow.

Patch transfer is a fallback only when the user explicitly chooses to continue in a workspace without remote write access. In fallback mode, group several safely reviewable units into one cumulative patch when practical, while never allowing irreplaceable work to exist only in an ephemeral workspace. Do not repeatedly require the user to apply one patch per page unless there is no safer workable alternative.

Before editing, the AI must verify all of the following:

1. `git rev-parse --show-toplevel` succeeds.
2. The checked-out repository is the intended Japan App repository.
3. The current branch and configured remote are recorded.
4. Local and remote HEAD are compared before relying on the checkout as current.
5. Existing uncommitted user changes are identified and preserved.

Durability checkpoints are mandatory after every completed source page, listening problem, translation batch, integrated exam, or other unit that would take meaningful time to recreate. At each durability checkpoint the AI must:

1. Update the authoritative checkpoint file.
2. Run the relevant content and regression checks.
3. Commit every file belonging to that completed unit to Git with a narrowly scoped message.
4. Push that commit to the configured remote branch.
5. Fetch/inspect the remote and prove that the remote branch contains the exact local commit by running `node scripts/check-work-persistence.mjs`.
6. Record the durable commit SHA in the checkpoint before starting the next unit.

The AI must not begin the next page, section, exam, or large batch while the previous unit exists only in an ephemeral workspace. If commit or push is unavailable, fails, lacks credentials, or cannot be verified remotely, stop immediately. First recommend switching to Codex CLI in the user's real clone so the AI can perform commit/push itself. Offer exact manual persistence commands or a patch only as fallback choices. Do not bypass this gate because of a continuous-work instruction.

Never tell the user that work is “saved,” “recorded,” “completed,” “safe,” or “available for the next session” unless the remote verification step passes. A `.jlpt-backups` directory is only a short-term rollback aid and never satisfies the durable-work gate.

## Execution-evidence discipline

- Do not claim a process is running or work is in progress after returning to an input prompt unless a live tool/process check supplies current evidence.
- Every completion claim must cite evidence from the immediately preceding command or tool result.
- For file-changing work, perform the actual write, relevant validation, narrow commit, push, fetch, and work-persistence verification; analysis or a proposed next step is not completion.
- Do not stop after analysis while an authorized, safe execution step remains. Continue autonomously within scope.
- Validate every seconds-to-milliseconds conversion explicitly; never substitute seconds for millisecond fields.

## Long unattended JLPT recovery

For unattended multi-unit JLPT recovery, use `bash scripts/run-jlpt-unattended.sh` from a clean remote-tracking recovery branch. It covers written recovery, listening candidate timing/data, explanations/translations, and approved data/adapter integration. Read `docs/jlpt-workspace/JLPT_UNATTENDED_RUNBOOK.md` first. The old written runner is only a compatibility wrapper.

The sandboxed child may only edit one JLPT data/checkpoint unit, run local validations, and return strict schema-validated JSON. It must not stage, commit, fetch, push, or run persistence verification. The outer supervisor exclusively verifies the actual changed-file manifest, reruns validations, stages exact paths, commits, pushes, fetches, and requires `WORK PERSISTENCE PASS` before another child starts. Automatically derived listening timing must remain candidate/unverified; never fabricate human/perceptual/audio approval. A blocked question or segment is not a global blocker while any other repository-backed unit remains available.

## JLPT approved exam UI lock

The current JLPT N1 exam UI is user-approved and locked. Before changing JLPT code, read:

- `docs/checkpoints/JLPT_APPROVED_EXAM_UI_LOCKED.md`
- `docs/jlpt-workspace/JLPT_UI_LOCK_RULES.md`

Run `node scripts/check-jlpt-approved-ui-lock.mjs` before and after JLPT work. Do not change the approved hashes, snapshots, layout, styles, interaction behavior, or route without explicit user permission. Never reintroduce Royal A+F components into the JLPT exam screen.
