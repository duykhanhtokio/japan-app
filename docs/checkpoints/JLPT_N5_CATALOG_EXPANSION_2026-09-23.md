# JLPT N5 catalog expansion checkpoint

```text
STATUS: VALIDATED LOCALLY; REMOTE PERSISTENCE PENDING
BASE HEAD: c4dc2e0758a6da70b4761a266c014e1f5f629a21
BRANCH: recovery/jlpt-n3-n1
DATE: 2026-09-23 (Asia/Tokyo)
```

The user authorized integrating the supplied N5 source repository after all N4 work passed the durable-work gate. The exact catalog invariant expands from 59 to 66 entries while all ten approved UI-lock files remain byte-for-byte unchanged.

The seven supplied N5 catalog candidates are:

- `n5-2011-12`
- `n5-2012-12`
- `n5-2013-07`
- `n5-2017-07`
- `n5-2018-12`
- `n5-2020-12`
- `n5-2021-12`

All seven begin as `incomplete`; none is automatically `structured_ready`. The catalog labels are inventory targets, not identity claims. In particular, the first supplied PDF prints only `2010-2011年`, the 2018 PDF prints no month, and the 2020 package identifies itself as `ベスト模試 N5 第2回`. These discrepancies must remain explicit during per-package audits.

The resulting exact invariant is 61 official/candidate periods plus five mock entries. A pending period may become structured only after its question text, choices, answers, explanations/translations, transcript, audio, and timing have all been integrated and verified.

No UI, route, navigation, session, layout, style, or interaction file is authorized to change.

## Validation evidence

- Catalog completeness: PASS at exactly 66 entries.
- Inventory integration: PASS with 45 structured official exams, 16 visible incomplete N4/N5 candidates, and five ready mocks.
- Exact N4 and N5 period sets: PASS.
- Structured-exam, no-scanned-runtime, and navigation-contract checks: PASS.
- JLPT Approved UI Lock: PASS, 10/10 byte-locked files unchanged.
- TypeScript retains only the pre-existing N2/N3 adapter failures: missing `./n1-2012-12-trial` and non-exported `TrialQuestion` from `n1-2013-07-trial.ts`. No N5 catalog file produced a diagnostic.
