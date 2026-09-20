# Unattended full JLPT recovery

Run from the real clone on the current remote-tracking recovery branch:

```bash
bash scripts/run-jlpt-unattended.sh
```

Use `--dry-run` to validate startup without calling a model, and `--max-turns N` to override the default safety limit of 100 turns.

The supervisor uses one `codex exec --sandbox workspace-write` child for one local unit at a time. The child may read sources, edit data, validate, update a checkpoint, and create one narrow local commit. It must not fetch or push. After the child exits, the outer shell checks for uncommitted files and commit consistency, runs the UI lock, pushes at most three times with 30 seconds between attempts, fetches, and requires `WORK PERSISTENCE PASS`. It then appends the exact unit SHA to the uniquely matching exam checkpoint in a separate narrow commit, pushes and verifies that checkpoint commit, and only then starts another child.

Logs and the PID lock live outside the repository by default at `${TMPDIR:-/tmp}/japan-app-jlpt-unattended-logs/<repo-key>/`; logs are never committed. Override the parent directory with `JLPT_UNATTENDED_LOG_DIR` when needed.

Safety behavior:

- A dirty tree stops immediately and lists every preserved uncommitted path.
- A valid local commit survives a child context-limit exit and is still pushed and verified.
- A pre-existing local-ahead commit is pushed and verified before any model is called.
- Push failure preserves the local commit and stops after three attempts.
- Rate/capacity failures retry after 60, 180, and 300 seconds, then stop cleanly.
- The script never runs `git reset`, `git checkout`, `git clean`, or deletes work products.
- One blocked question/segment is recorded and skipped while other available work continues. Only absence of all available work permits `BLOCKED_GLOBAL`.

Each remotely durable unit prints only:

```text
TURN n | examId | unit | local SHA | remote PASS
```
