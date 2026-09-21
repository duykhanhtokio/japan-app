# Fully unattended JLPT N1 → N2 → N3 recovery

From the clean remote-tracking recovery branch, run exactly:

```bash
bash scripts/run-jlpt-unattended.sh
```

The command is non-interactive and ignores stdin. `--dry-run` performs Git/upstream, schema/state, UI-lock, regression, persistence, rule-digest, and installed Codex CLI compatibility checks without starting a worker. `--max-batches N` is a controlled test/session boundary; the exit handler pushes valid local commits before stopping.

## Architecture

The shell entry point starts `scripts/jlpt-unattended-supervisor.mjs`. Deterministic code—not the model—reads the central progress pointer and active exam manifest, selects `nextUnit`, checks branch/PID/cache/time, validates, commits, retries Git, pushes, fetches, journals, and runs persistence checks.

One Codex session is retained for the entire active exam. It returns control at large validated durability batches; the supervisor resumes the same session ID. A fresh Codex session is created only after an exam completes or after a compact context handoff. There is no per-question or per-page initialization.

The worker is launched as `codex exec --sandbox workspace-write -c approval_policy="never" ...` with the prompt passed as an argument and stdin set to `ignore`. It never uses the incompatible `--sandbox workspace-write --approve-for-me` combination. The result must match `scripts/jlpt-unattended-result.schema.json`; results that ask the user, mention stdin, emit numbered choices, omit the checkpoint/manifest/progress atomic set, or declare unexpected paths are rejected.

## Persistence and shutdown

Validated large batches receive exactly one local commit. Normal remote push occurs when the exam completes. `EXIT`, `INT`, `TERM`, `HUP`, errors, rate-limit waits, context handoff, and controlled batch limits trigger the persistence exit path: no new unit starts, unvalidated dirty output is preserved but never committed, all valid local commits are pushed, the branch is fetched, and `WORK PERSISTENCE PASS` is required when the remote is available.

Global transient failures use exponential backoff with jitter for at most six hours. No model is invoked during waits. Local content blockers are recorded and skipped. The runtime state, checksum/tool-version cache, logs, and append-only journal live outside Git under:

```text
${TMPDIR:-/tmp}/japan-app-jlpt-runtime/<repo-hash>/
```

The journal records timestamp, exam/unit, source checksum, output paths, validation, local commit, push state, remote SHA, and next action. Heartbeats are printed by the supervisor once per minute and do not fetch, validate, inspect sources, mutate the repository, or call a model.

## Resume

On resume, deterministic startup reads `JLPT_ACTIVE_PROGRESS.json`, the active `WORK_MANIFEST.json`, local/upstream HEAD, `pushPending`, and `JLPT_RULE_DIGEST.json`. If the digest matches, full rules/inventory/OCR are not reloaded. If runtime state disappeared, Git plus the progress/manifest/checkpoint reconstructs the run. A pending local commit is pushed before content work begins.

Validation tiers are PER_UNIT/PER_BATCH during ordinary work, PER_EXAM at exam completion, and GLOBAL only at startup, shared-file changes, exam completion, and final N1–N3 completion.

Run the deterministic acceptance fixture with:

```bash
bash scripts/test-run-jlpt-unattended.sh
```
