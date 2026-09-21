# Fully unattended JLPT N1 → N2 → N3 recovery

Run a real data batch outside an interactive Codex maintenance session, from the clean remote-tracking recovery branch:

```bash
bash scripts/run-jlpt-unattended.sh start
bash scripts/run-jlpt-unattended.sh resume
```

The no-argument command remains an alias for `start`. Add `--background` to either command for a detached supervisor. `resume --offline` skips fetch/push while retaining `pushPending` for later remote verification; it also supports `--background`. `status` verifies both PID liveness and the actual process command without calling a model. `stop` sends a controlled termination signal and waits for the persistence exit path. `--dry-run` performs Git/upstream, schema/state, UI-lock, regression, persistence, rule-digest, and installed Codex CLI compatibility checks without starting a worker. `--max-batches N` is a controlled test/session boundary.

```bash
bash scripts/run-jlpt-unattended.sh start --background
bash scripts/run-jlpt-unattended.sh status
bash scripts/run-jlpt-unattended.sh stop
bash scripts/run-jlpt-unattended.sh resume --background
bash scripts/run-jlpt-unattended.sh resume --offline
bash scripts/run-jlpt-unattended.sh resume --offline --background
```

## Architecture

The shell entry point starts `scripts/jlpt-unattended-supervisor.mjs`. Deterministic code—not the model—reads the central progress pointer and active exam manifest, selects `nextUnit`, checks branch/PID/cache/time, validates, commits, retries Git, pushes, fetches, journals, and runs persistence checks.

One Codex session is retained for the entire active exam. It returns control at large validated durability batches; the supervisor resumes the same session ID. A fresh Codex session is created only after an exam completes or after a compact context handoff. There is no per-question or per-page initialization.

The worker is launched as `codex exec --sandbox workspace-write -c approval_policy="never" ...` with the prompt passed as an argument and no user stdin. A private pseudo-terminal prevents the CLI from treating `/dev/null` as piped context; nothing writes to that pseudo-terminal's input. It never uses the incompatible `--sandbox workspace-write --approve-for-me` combination. `--json` stdout is stored as an event stream in `worker-*.jsonl`; stderr has its own `worker-*.stderr.log`. `--output-last-message` writes to `worker-*.result.json.partial`. Only a non-empty final message that passes `scripts/validate-jlpt-unattended-result.mjs` is atomically renamed to the matching `worker-*.result.json`. The event, stderr, partial, and result paths share one generated stem. A nonzero CLI exit is classified from JSONL/stderr as rate-limit, capacity, schema, network, CLI, or worker failure instead of being reduced to “result missing.”

## Persistence and shutdown

Validated large batches receive exactly one local commit. Normal remote push occurs when the exam completes. `EXIT`, `INT`, `TERM`, `HUP`, errors, rate-limit waits, context handoff, and controlled batch limits trigger the persistence exit path: no new unit starts, unvalidated dirty output is preserved but never committed, all valid local commits are pushed, the branch is fetched, and `WORK PERSISTENCE PASS` is required when the remote is available.

Global transient failures use exponential backoff with jitter for at most six hours. No model is invoked during waits. Local content blockers are recorded and skipped. The runtime state, checksum/tool-version cache, logs, and append-only journal live outside Git under:

```text
${TMPDIR:-/tmp}/japan-app-jlpt-runtime/<repo-hash>/
```

The journal records timestamp, exam/unit, source checksum, output paths, validation, local commit, push state, remote SHA, and next action. Heartbeats are printed by the supervisor once per minute and do not fetch, validate, inspect sources, mutate the repository, or call a model.

## Maintenance validation

Inside an interactive Codex maintenance session, run the complete non-destructive production test through exactly one shell entry point (and therefore one host-security approval boundary):

```bash
bash scripts/test-jlpt-unattended-production.sh
```

That script stops on the first failure, labels every step, runs syntax checks, the production lifecycle fixture, a real read-only Codex CLI smoke worker, result/event evidence checks, start/status/stop/resume coverage, and repository regressions. It never starts a real JLPT data batch, resets or cleans Git, changes credentials or Git configuration, or reads worker input from stdin. The fixture owns and cleans up only the isolated background processes and runtime directory it creates. Codex host-security prompts belong to the interactive environment; unattended worker decisions remain non-interactive through `approval_policy="never"`, ignored stdin, and schema rejection of user-directed questions.

After that single test passes, persist only the maintenance allowlist with one controlled command:

```bash
bash scripts/persist-jlpt-unattended-maintenance.sh "test(jlpt): consolidate unattended maintenance checks"
```

The persistence script refuses unrelated or pre-staged changes, checks the diff, commits, pushes the configured upstream branch, fetches it, and requires `WORK PERSISTENCE PASS`. It does not reset, clean, reconfigure Git, or modify credentials.

## Resume

On resume, deterministic startup reads `JLPT_ACTIVE_PROGRESS.json`, the active `WORK_MANIFEST.json`, local/upstream HEAD, `pushPending`, and `JLPT_RULE_DIGEST.json`. If the digest matches, full rules/inventory/OCR are not reloaded. If runtime state disappeared, Git plus the progress/manifest/checkpoint reconstructs the run. A pending local commit is pushed before content work begins.

Validation tiers are PER_UNIT/PER_BATCH during ordinary work, PER_EXAM at exam completion, and GLOBAL only at startup, shared-file changes, exam completion, and final N1–N3 completion.

For fixture-only development, the deterministic acceptance fixture remains available with:

```bash
bash scripts/test-run-jlpt-unattended.sh
```
