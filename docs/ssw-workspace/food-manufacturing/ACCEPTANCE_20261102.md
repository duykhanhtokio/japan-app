# Food candidate acceptance — 2 November 2026

Tested source snapshot: `57ac69194729ad30dee192f740763951578c01bb`, branch `recovery/jlpt-n3-n1`. Results below are newly executed checks, not historical report counts. No lesson, question, translation, answer, progress key or runtime UI was edited in this acceptance pass.

## Resolved execution blockers

Restored omitted tracked food/shared source files and food assets from Git. Installed isolated QA dependencies (esbuild 0.25.9, React/ReactDOM 19.1.0, react-native-web 0.21.1) outside the repository; package manifests and lockfiles unchanged. Node checks used `NODE_PATH=/workspace/scratch/81b054bda079/food-qa-deps/node_modules`. These packages are test tooling, not a full Expo installation.

The daily-learning validator incorrectly required all files to remain identical to its pre-source-correction baseline `3a09e225d95dca6975a81152fb1a6ecf9469e04d`. Later integrated source-reference/wording corrections and adapter changes made that condition stale. Fixed the validator without rewriting learner content: retain the old baseline for unchanged files, require exact pinned current SHA-256 plus original Git-blob identity for 18 explicitly recorded snapshots, and independently verify all 848 question correction receipts. No source-reference field is ignored. The validator rejects a changed-byte probe on each of 76 protected files. Snapshot provenance is recorded per file in `daily-fix-20261031/preservation-snapshots-20261102.json`.

## Commands actually executed

| Command (under repository root) | Result |
|---|---|
| `python3 scripts/food-manufacturing/check-content.py` | PASS: 96 lessons, 848 questions, all 12 target locales; structural only |
| `python3 scripts/food-manufacturing/check-question-review.py` | PASS: 848 current hash-bound AI receipts; 0 remaining receipts |
| `python3 scripts/food-manufacturing/check-source-coverage34.py` | PASS evidence integrity: 292 historical decisions, 36 sections, 112 scoped atomic rows |
| `python3 scripts/food-manufacturing/check-source-runtime34.py` | PASS: 36 sections/432 locale pairs, 20 checks/240 locale pairs, 202 aligned ruby fields |
| `node scripts/food-manufacturing/check-adapter-without-bundler.cjs` | PASS: 10,176 valid pairs, 10,176 stale pairs rejected, 432 titles |
| `node scripts/food-manufacturing/check-lesson-ruby.cjs` | PASS: 96 lessons, 996 fields, 27,609 segments, 996 stale/misaligned cases rejected |
| `node scripts/food-manufacturing/check-question-ruby.cjs` | PASS: 848 questions, 8,480 fields, 16,960 stale/misaligned and 33,833 malformed cases rejected; actual TSX compile |
| `node scripts/food-manufacturing/check-question-ruby-render.cjs` | PASS actual-component SSR: 8,480 fields, 1,696 submitted/unsubmitted cases; explanation visibility enforced |
| `node scripts/food-manufacturing/check-state.mjs` | PASS: resume, revision invalidation, scoring, malformed storage, namespace isolation |
| `python3 scripts/food-manufacturing/check37-visual-figures.py` | PASS: 3 new figures and 15 existing signs; 36 new caption-locale pairs, 180 sign-label pairs |
| `node scripts/food-manufacturing/check-daily-learning.cjs` | PASS: 96 source-bound day diagrams, 35 original drawings, 94 enriched days; 1,128 companion and 1,152 caption locale pairs; 76 preservation-negative probes |
| `git diff --check -- scripts/food-manufacturing docs/ssw-workspace/food-manufacturing` | PASS |

The final daily validator checks image bytes against manifest hashes and verifies dimensions, current/stale lesson bindings, translated captions and companion bindings. Japanese unique body-character distributions after companions are: 1号 min/median/max 474/565/785; 2号 530/642/1,055. Character counts do not establish learner time or equal cognitive workload.

## Remaining acceptance

esbuild warned that `expo/tsconfig.base` is absent; scoped compilation completed, but this is not a full Expo build. SSR uses the existing explicit app adapters and test-only initial attempt injection; it provides no browser geometry or actual-device evidence. No new browser, iPhone/Android, audio, native-speaker, domain-expert or measured learner-duration acceptance was performed. Full atomic source decomposition and whole-source certification remain false. Source PDFs were not available for new page-level certification in this pass.

This report is not remote-persistence proof. Root must commit, push/fetch and verify the exact resulting commit before claiming durable completion.
