# Unattended full JLPT recovery

Run from the real clone on a clean, remote-tracking recovery branch:

```bash
bash scripts/run-jlpt-unattended.sh
```

Use `--dry-run` for the complete startup/fetch/persistence validation without invoking a child, and `--max-turns N` to lower the default 100-turn safety limit.

## Ownership boundary

Each `codex exec --sandbox workspace-write` child reads sources, changes one JLPT data/checkpoint unit, and runs local content plus UI-lock validation. It returns strict JSON through `--output-schema scripts/jlpt-unattended-result.schema.json` and `--output-last-message`. It never stages, commits, pushes, fetches, or runs the persistence checker; the sandbox cannot write `.git`, so Git durability is exclusively the outer supervisor's responsibility.

For `LOCAL_CHANGES_READY`, the supervisor obtains the actual changed paths from Git and requires an exact match with `changedFiles`. It rejects locked UI, routes, credentials, `.env`, Git metadata, supervisor files, and anything outside the JLPT data/checkpoint/validator allowlist. Unexpected files are preserved and cause a safe stop—there is no reset, checkout, clean, stash, deletion, or overwrite recovery.

After manifest and allowlist checks, the supervisor reruns `git diff --check`, the UI lock, mandatory JLPT regression checks, and exam-specific validators. It stages each exact verified path, checks the staged set, creates one narrow commit, pushes, fetches, and requires `WORK PERSISTENCE PASS`. It then records that exact unit SHA in the authoritative checkpoint using a second narrow supervisor commit and repeats push/fetch/persistence. Only then can another child start.

## Startup and recovery

The supervisor verifies the repository shape, branch, upstream, live remote HEAD, clean tree, mandatory startup validations, and initial persistence before invoking a child. Local and remote HEAD must match exactly. It records the baseline HEAD before every child. A rerun therefore resumes from the newest remote-verified checkpoint and never silently publishes an unexplained local-ahead commit.

Logs, result JSON, and the PID lock live outside the repository at `${TMPDIR:-/tmp}/japan-app-jlpt-unattended-logs/<repo-key>/` by default. Override the parent with `JLPT_UNATTENDED_LOG_DIR`. A second supervisor cannot acquire the lock.

Ctrl+C/SIGTERM, child failure after edits, malformed JSON, manifest mismatch, validation failure, commit failure, push failure, and persistence failure all stop without deleting or resetting work. The message gives the exact external result/log path. Inspect and resolve the preserved state before rerunning; startup refuses a dirty tree.

`RATE_LIMITED` retries after bounded 60/180/300-second backoffs. `NO_CHANGE_CONTINUE` automatically advances but stops after three consecutive no-progress turns. A source-unreadable question, image, or audio segment is always a recorded local blocker and cannot become `BLOCKED_GLOBAL` while any other repository-backed unit exists. `COMPLETE_ALL_AVAILABLE` reruns the aggregate validation and persistence gate before exiting.

Listening candidate separation and integration do not wait for per-segment user approval. AI-generated timings must remain candidate/unverified and must never claim human review, perceptual approval, or verified audio status.

The deterministic fixture test is:

```bash
bash scripts/test-run-jlpt-unattended.sh
```

It uses temporary repositories and covers startup dry-run, the PID lock, child success, strict JSON failure, manifest mismatch, allowlist rejection, validation/commit/push/persistence failures, structured/CLI rate-limit retries, Ctrl+C preservation, and the no-progress cutoff.
