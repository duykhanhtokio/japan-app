# JLPT runnable catalog checkpoint V8

```text
STATUS: USER AUTHORIZED
DATE: 2026-09-27 (Asia/Tokyo)
SCOPE: remove non-standard mock exams from the app catalog
```

The user requested removal of N5 `Đề số 7` because it is not a standard exam and asked for the same rule at every level. The app catalog now exposes only structured source-backed exams. Repository-authored mock datasets remain in the repository and audit registry, but no longer have a catalog entry or a route from the approved exam list.

Sequential display names are recalculated from the remaining structured exams. Internal source IDs and provenance remain unchanged.

No exam layout, question data, answering behavior, navigation, scoring, review behavior, or protected source asset changed. This checkpoint extends V7 and updates only this explicitly authorized byte lock:

```text
525b7269cb232a86b9b6fe1d7cd2d8e4b111b9d33b437f12b470537f1772148d  src/components/jlpt/ApprovedJlptExamCatalog.tsx
```

All other approved UI hashes remain unchanged. Do not revise this hash without a new explicit user instruction.

The structured-exam and navigation validators now enforce this authorized runtime rule: mock and pending entries must be absent from the runnable catalog while their audit metadata remains preserved.
