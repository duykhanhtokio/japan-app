# JLPT N4 catalog expansion checkpoint

```text
STATUS: APPLIED AND VALIDATED LOCALLY; REMOTE PERSISTENCE PENDING
BASE HEAD: a5ca75274f848f56ab9222c218a0989569e0672f
BRANCH: recovery/jlpt-n3-n1
DATE: 2026-09-22 (Asia/Tokyo)
```

The user authorized expanding the exact JLPT catalog invariant from 50 to 59 entries while preserving all ten byte-locked JLPT UI files.

The nine new official N4 periods, initially pending and not `structured_ready`, are exactly:

- `n4-2011-12`
- `n4-2012-12`
- `n4-2013-07`
- `n4-2013-12`
- `n4-2014-07`
- `n4-2017-07`
- `n4-2018-07`
- `n4-2021-07`
- `n4-2021-12`

The resulting exact invariant is 54 official entries plus five mock entries. An N4 period may move from pending to structured only after its written questions, listening responses, answers, explanations, translations, transcripts, audio, and timing have all been integrated and verified. The pending entry must be replaced, never duplicated.

Catalog-expansion files allowed to change in this unit:

- `src/data/jlpt-official/jlpt-exam-catalog.ts`
- `scripts/check-jlpt-approved-ui-lock.mjs`
- `scripts/check-jlpt-catalog-completeness.mjs`
- `scripts/check-jlpt-50-exams-integration.mjs` (historical filename retained for compatibility)
- `scripts/generate-jlpt-50-inventory.mjs` (historical filename retained for compatibility)
- `docs/jlpt-workspace/JLPT_50_EXAMS_TRUTHFUL_INVENTORY.json` (historical filename retained for compatibility)
- `docs/AI_SESSION_START_HERE.md`
- this checkpoint

No locked UI, route, navigation, session, layout, style, or interaction file is authorized to change.

## Validation evidence

- Catalog: PASS, exactly 59 entries = N1 15 + N2 13 + N3 17 + N4 9 + mocks 5.
- Inventory integration: PASS, 45 structured official + 9 pending N4 + 5 mocks.
- Exact N4 period set: PASS; all nine periods are pending and none was automatically marked `structured_ready`.
- Approved UI Lock: PASS, 10/10 byte-locked files unchanged.
- TypeScript was executed and reported only pre-existing errors in unchanged N2/N3 trial adapters: the missing `./n1-2012-12-trial` module and the non-exported `TrialQuestion` type from `n1-2013-07-trial.ts`. No catalog-expansion file produced a TypeScript error. These out-of-scope baseline errors were not modified under this authorization.
