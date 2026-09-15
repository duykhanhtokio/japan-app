# Project rules for automated contributors

## Mandatory session startup

Before planning, editing, restoring, integrating, or reporting any work in this project, read the following file completely:

- `docs/AI_SESSION_START_HERE.md`

Then read every checkpoint or rule file listed by its "Mandatory reading order" section. Do not rely on chat history alone. Verify the actual working tree and run the startup checks before claiming the current state.

## JLPT approved exam UI lock

The current JLPT N1 exam UI is user-approved and locked. Before changing JLPT code, read:

- `docs/checkpoints/JLPT_APPROVED_EXAM_UI_LOCKED.md`
- `docs/jlpt-workspace/JLPT_UI_LOCK_RULES.md`

Run `node scripts/check-jlpt-approved-ui-lock.mjs` before and after JLPT work. Do not change the approved hashes, snapshots, layout, styles, interaction behavior, or route without explicit user permission. Never reintroduce Royal A+F components into the JLPT exam screen.
