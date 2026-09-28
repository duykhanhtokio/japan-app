# JLPT exam card layout checkpoint V10

```text
STATUS: USER AUTHORIZED
DATE: 2026-09-28 (Asia/Tokyo)
SCOPE: readable exam card layout on iPhone
```

The user reported that the V9 catalog placed question count, attempt count, and correct percentage in one cramped line on an iPhone 16 Plus. Each card now displays the exam name, question count, and two separate statistics. The statistics wrap onto another line as needed. Card height grows with content and text is not truncated.

This extends V9. No exam identity, scoring, saved attempt history, or answering flow changed.

```text
96fcfbf8fb495ff0beaee347b2f2bad93583dc27e047cd016ed53e6d83f21537  src/components/jlpt/ApprovedJlptExamCatalog.tsx
```

All other approved UI hashes remain unchanged. Visual review on the user's simulator is still required.
