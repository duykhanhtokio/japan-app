# Tokutei — automatic persistence and Mac sync

Publisher instruction, 2026-11-03: “cập nhật lên Mac rồi tiếp tục tiến trình hoàn thiện tokutei các ngành như đã yêu cầu. Tự đẩy lên tự động.”

Continue validated Tokutei work on `duykhanhtokio/japan-app`, branch `recovery/jlpt-n3-n1`, and save reviewable batches automatically. The six-stream sequential-group policy remains active. Preserve existing learner data and source-review boundaries.

## Authenticated save route

When Git CLI has usable credentials, push normally and verify persistence. When CLI authentication is unavailable but the authenticated GitHub tools work, use their Git data operations instead of repeatedly asking the publisher to import bundles:

1. Freeze the completed batch and validate its exact files. Keep unrelated unfinished work outside the batch.
2. Read the actual remote branch SHA. Retain it as the parent and expected branch head.
3. Upload each changed file as a blob; compare the returned Git SHA with the local `blob <length>\0<bytes>` SHA-1.
4. Stage only those files. Compare every staged mode/blob SHA with the validated manifest, and obtain `git write-tree`.
5. Create the remote tree from the verified base tree plus exact file entries. Require its SHA to equal the staged tree SHA.
6. Create the remote commit with the verified parent. Update the branch with `expected_sha` and `force: false`. If the branch changed, preserve local work and inspect the new head before integrating.
7. Fetch the published commit and fast-forward the local branch. An index/worktree already matching the target tree can fast-forward without reset, stash, or replacing unfinished files.
8. Run `node scripts/check-work-persistence.mjs`. Report remote persistence only after it passes. The enclosing Git commit identifies the snapshot; do not add a SHA-only bookkeeping commit.

GitHub API authentication does not provide a CLI token. Do not extract connector credentials. Use the authenticated tools directly.

## Actual Mac checkout

The cloud checkout and the publisher's Mac are separate. A successful remote save does not update the Mac's files. The publisher can synchronize from the actual clone with:

```bash
cd ~/Desktop/japan-app99/japan-app
git fetch origin recovery/jlpt-n3-n1 &&
git show FETCH_HEAD:scripts/sync-tokutei-mac.sh | bash
```

The helper checks the repository/branch, refuses tracked local changes or divergent history, and performs a fast-forward only. Do not claim Mac synchronization or a device test without evidence from that machine.

## Verified initial automatic save

`4832f53f8407298126fa43c104a266972f2a3831` saved the first seven-sector batch by this route. All 106 blob hashes and its complete tree matched the local snapshot, followed by a fast-forward and `WORK PERSISTENCE PASS`. See `source-coverage-v2/integrated-batch-20261103.json` and `integrated-status-20261103.json` for its bounded results and remaining work.
