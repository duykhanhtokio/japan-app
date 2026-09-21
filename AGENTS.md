# Project rules for automated contributors

## Mandatory session startup

Before planning, editing, restoring, integrating, or reporting any work in this project, read the following file completely:

- `docs/AI_SESSION_START_HERE.md`

Then read every checkpoint or rule file listed by its "Mandatory reading order" section. Do not rely on chat history alone. Verify the actual working tree and run the startup checks before claiming the current state.

## Mandatory durable-work gate

This repository may be opened inside an ephemeral AI workspace. Files, `.git` objects, and local backup folders in that workspace can disappear between turns. Therefore a local edit, local commit, checkpoint file, validation pass, ZIP, or assistant progress report is **not** proof that work is preserved.

### Preferred execution environment

For multi-page JLPT restoration, conversion, translation, or integration work, the default is **Codex CLI running inside the user's real local clone on the remote-tracking branch `recovery/jlpt-n3-n1`**. Never infer progress from this branch name. The central progress pointer, active manifest, checkpoint, and Git evidence are authoritative.

At the beginning of a new session, determine whether the AI can commit and push from the current checkout. If it cannot, say so before beginning expensive work and recommend moving the task to Codex CLI in the real clone. Do not make per-page downloadable patches the default workflow.

Patch transfer is a fallback only when the user explicitly chooses to continue in a workspace without remote write access. In fallback mode, group several safely reviewable units into one cumulative patch when practical, while never allowing irreplaceable work to exist only in an ephemeral workspace. Do not repeatedly require the user to apply one patch per page unless there is no safer workable alternative.

Before editing, the AI must verify all of the following:

1. `git rev-parse --show-toplevel` succeeds.
2. The checked-out repository is the intended Japan App repository.
3. The current branch and configured remote are recorded.
4. Local and remote HEAD are compared before relying on the checkout as current.
5. Existing uncommitted user changes are identified and preserved.

Durability checkpoints are mandatory after every validated large batch (normally a source page or 10–20 written questions, one listening problem/group, at least 20 translations when possible, or full-exam integration). At each durability checkpoint the unattended supervisor must:

1. Update the authoritative checkpoint file.
2. Run the relevant content and regression checks.
3. Commit every file belonging to that completed unit to Git with a narrowly scoped message.
4. Mark the commit pending in the external runtime journal without creating a second SHA-only commit.
5. Normally push/fetch/verify at complete-exam boundaries; immediately push/fetch/verify on controlled exit, error, signal, context handoff, or a global retry wait.
6. Require `WORK PERSISTENCE PASS` before advancing to a new exam or ending a session cleanly.

The AI must not begin the next large batch until the previous batch has passed validation and exists in a narrow local commit recorded by the external journal. It must not begin the next exam until all commits for the previous exam are pushed and remotely verified. If a push required by an exit, error, handoff, retry wait, or exam boundary cannot be verified, stop content work and retain `pushPending: true` under the six-hour retry policy.

Never tell the user that work is “saved,” “recorded,” “completed,” “safe,” or “available for the next session” unless the remote verification step passes. A `.jlpt-backups` directory is only a short-term rollback aid and never satisfies the durable-work gate.

## Execution-evidence discipline

- Do not claim a process is running or work is in progress after returning to an input prompt unless a live tool/process check supplies current evidence.
- Every completion claim must cite evidence from the immediately preceding command or tool result.
- For file-changing work, perform the actual write, relevant validation, narrow commit, and the policy-required push/fetch/persistence gate at exam or session boundaries; analysis or a proposed next step is not completion.
- Do not stop after analysis while an authorized, safe execution step remains. Continue autonomously within scope.
- Validate every seconds-to-milliseconds conversion explicitly; never substitute seconds for millisecond fields.

## Long unattended JLPT recovery

For unattended multi-unit JLPT recovery, use `bash scripts/run-jlpt-unattended.sh` from a clean remote-tracking recovery branch. Fixed decisions are in `docs/jlpt-workspace/JLPT_AUTOMATION_DECISIONS.json`; the resume pointer is `docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json`; each active exam has `WORK_MANIFEST.json`. Read `docs/jlpt-workspace/JLPT_UNATTENDED_RUNBOOK.md` first. The old written runner is only a compatibility wrapper.

One non-interactive Codex worker session spans one complete exam and returns at large validation boundaries; the supervisor resumes that same session rather than creating per-question workers. The worker never owns Git. The deterministic outer supervisor selects work from the manifest, validates, creates one commit per batch, and owns all push/fetch/persistence, retry, cache, heartbeat, and journal operations. Automatically derived listening timing must remain candidate/unverified; never fabricate human/perceptual/audio approval. A blocked question or segment is not a global blocker while any other repository-backed unit remains available. In fully unattended mode, neither worker nor supervisor may ask the user or read stdin.

## JLPT approved exam UI lock

The current JLPT N1 exam UI is user-approved and locked. Before changing JLPT code, read:

- `docs/checkpoints/JLPT_APPROVED_EXAM_UI_LOCKED.md`
- `docs/jlpt-workspace/JLPT_UI_LOCK_RULES.md`

Run `node scripts/check-jlpt-approved-ui-lock.mjs` before and after JLPT work. Do not change the approved hashes, snapshots, layout, styles, interaction behavior, or route without explicit user permission. Never reintroduce Royal A+F components into the JLPT exam screen.
