# JLPT recovery child — one local unit, no Git ownership

You are one sandboxed child turn. Repository files are authoritative; chat history is not. The outer supervisor alone owns Git and remote durability.

Mandatory startup and scope:

1. Read `AGENTS.md` and `docs/AI_SESSION_START_HERE.md` completely, then every file in its mandatory reading order: `docs/jlpt-workspace/JLPT_UI_LOCK_RULES.md`, the newest `docs/checkpoints/JLPT_APPROVED_EXAM_UI_LOCKED*.md`, and the current exam checkpoint. Read `docs/jlpt-workspace/JLPT_UNATTENDED_RUNBOOK.md` too.
2. Inspect the working tree and the baseline HEAD recorded by the supervisor. Do not run `git add`, `git commit`, `git push`, `git fetch`, `git pull`, `git reset`, `git checkout`, `git clean`, `git stash`, or `scripts/check-work-persistence.mjs`. Do not write anything under `.git`.
3. Run `node scripts/check-jlpt-approved-ui-lock.mjs` before editing. Select exactly one available, not-yet-remote-verified unit from repository checkpoints. Do not redo completed work.
4. Read sources, edit only JLPT data/checkpoint/appropriate validation files, update exactly one authoritative conversion checkpoint, and run content/schema/count/key/ID/audio-range/adapter validations plus `git diff --check` and the UI-lock check. Do not edit any locked UI, route, catalog presentation, session-storage, lock hash/snapshot, credential, `.env`, Git metadata, supervisor, prompt, or runbook file.
5. Return the fixed JSON object described below. Do not commit or stage. The supervisor will independently compare the declared paths with Git, rerun validations, stage exact paths, commit, push, fetch, and require `WORK PERSISTENCE PASS`.

Recovery rules:

- For N1 07/2015, questions 39–45 are already remote-verified. The next written source unit begins at question 46 on `assets/jlpt/n1/2015-07/question/page-06.jpg`. Question 29 remains `BLOCKED_SOURCE_UNREADABLE`; never infer it from an answer key and never turn that local blocker into `BLOCKED_GLOBAL`.
- Any unreadable question/image/audio/segment is a local blocker. Record precise source, attempted checks, known facts, and unresolved facts in the checkpoint, skip it, and continue another available unit. Use `BLOCKED_GLOBAL` only when technical evidence proves that no repository-backed written, listening candidate, explanation, translation, or integration unit remains available anywhere.
- Listening may be split and integrated fully as candidate/unverified without user timing approval at this stage. Validate every seconds-to-milliseconds conversion, range bounds/order/overlap, mapping, count, and closing-announcement exclusion.
- AI-derived timing must stay `candidate_unverified` (or the existing schema's exact equivalent), with truthful provenance, tool/version, source-audio SHA-256, candidate date, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review` where appropriate. Never set `verified`, `human_verified`, `humanReviewed: true`, perceptual/audio approval, or an equivalent claim.
- Preserve the locked JLPT interface and its pre/post-submission behavior exactly.

Return only one JSON object matching `scripts/jlpt-unattended-result.schema.json`:

- `status`: `LOCAL_CHANGES_READY`, `NO_CHANGE_CONTINUE`, `RATE_LIMITED`, `BLOCKED_GLOBAL`, or `COMPLETE_ALL_AVAILABLE`.
- `examId`, `unit`, `nextAction`: precise strings grounded in checkpoints.
- `commitMessage`: a narrow conventional message such as `feat(jlpt): ...` only for `LOCAL_CHANGES_READY`; otherwise `""`.
- `changedFiles`: every and only actual changed/untracked path for `LOCAL_CHANGES_READY`; otherwise `[]`.
- `validations`: `{name,status,evidence}` objects. `LOCAL_CHANGES_READY` requires at least one and all must be `PASS`.
- `blockers`: `{scope,code,details,evidence}` objects. Local blockers use `LOCAL` and do not stop the batch. `BLOCKED_GLOBAL` requires only evidenced `GLOBAL` blockers.

Do not wrap the JSON in Markdown and do not add free-form text.
