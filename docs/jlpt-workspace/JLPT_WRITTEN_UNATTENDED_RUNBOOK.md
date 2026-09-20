# Unattended JLPT written recovery

Run only from the repository root on `recovery/n1-2013-12` with a clean working tree:

```bash
bash scripts/run-jlpt-written-unattended.sh
```

The supervisor runs up to 50 one-unit `codex exec` turns with `workspace-write` and approval review; it never uses `--full-auto` or `danger-full-access`. It checks remote persistence and clean state after every turn. Logs and the single-instance PID lock are under `.jlpt-unattended-logs/`. Use `bash scripts/run-jlpt-written-unattended.sh --dry-run` to validate startup without calling Codex.
