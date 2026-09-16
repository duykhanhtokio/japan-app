# Project rules for automated contributors

## Mandatory session startup

Before planning, editing, restoring, integrating, or reporting any work in this project, read the following file completely:

- `docs/AI_SESSION_START_HERE.md`

Then read every checkpoint or rule file listed by its "Mandatory reading order" section. Do not rely on chat history alone. Verify the actual working tree and run the startup checks before claiming the current state.

## Mandatory durable-work gate

This repository may be opened inside an ephemeral AI workspace. Files, `.git` objects, and local backup folders in that workspace can disappear between turns. Therefore a local edit, local commit, checkpoint file, validation pass, ZIP, or assistant progress report is **not** proof that work is preserved.

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

The AI must not begin the next page, section, exam, or large batch while the previous unit exists only in an ephemeral workspace. If commit or push is unavailable, fails, lacks credentials, or cannot be verified remotely, stop immediately and ask the user to perform the exact persistence action. Do not bypass this gate because of a continuous-work instruction.

Never tell the user that work is “saved,” “recorded,” “completed,” “safe,” or “available for the next session” unless the remote verification step passes. A `.jlpt-backups` directory is only a short-term rollback aid and never satisfies the durable-work gate.

## JLPT approved exam UI lock

The current JLPT N1 exam UI is user-approved and locked. Before changing JLPT code, read:

- `docs/checkpoints/JLPT_APPROVED_EXAM_UI_LOCKED.md`
- `docs/jlpt-workspace/JLPT_UI_LOCK_RULES.md`

Run `node scripts/check-jlpt-approved-ui-lock.mjs` before and after JLPT work. Do not change the approved hashes, snapshots, layout, styles, interaction behavior, or route without explicit user permission. Never reintroduce Royal A+F components into the JLPT exam screen.
