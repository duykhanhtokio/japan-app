# JLPT exam naming checkpoint V7

```text
STATUS: USER AUTHORIZED
DATE: 2026-09-27 (Asia/Tokyo)
SCOPE: app-visible JLPT exam names and runnable catalog entries
```

The user requested that app-visible JLPT exams omit source years and source-type labels and use only sequential names (`Đề số 1`, `Đề số 2`, ...). The catalog now lists only runnable structured exams and original mock exams. Incomplete commercial/source candidates remain in the audit registry but are not presented as runnable exam cards.

Internal IDs, storage keys, file paths, and provenance retain source periods so datasets cannot be confused. This display change does not assert copyright ownership or change source provenance.

No exam layout, answering behavior, navigation, scoring, review behavior, or protected question data changed. This checkpoint extends V6 and updates only these explicitly authorized byte locks:

```text
5facd78c6d592fa249eea0b0690bb247d018a747a98022ac61c238f868e760bc  src/components/jlpt/ApprovedJlptExamCatalog.tsx
56ff95e19597865e480b650eae5e0077c3c8cf3c26566f3ead0cf31c69feef2a  src/components/jlpt/ApprovedMockExam.tsx
```

All other approved UI hashes remain unchanged. Do not revise these hashes without a new explicit user instruction.
