# JLPT exam Back checkpoint V11

```text
STATUS: USER AUTHORIZED
DATE: 2026-09-28 (Asia/Tokyo)
SCOPE: return from an opened exam to its catalog
```

The resume prompt is a native modal and covers the exam header. Its Cancel and
system Back actions now exit to the exam catalog, preserving the saved attempt.
The exam header Back closes the exam immediately while the final session write
continues; a storage failure keeps the previously saved periodic state. This
prevents a stalled storage write from trapping the user in the exam.

Only `N1OfficialTrial.tsx` changes among locked runtime files. Its approved SHA-256 is:

```text
4a3abbc76b089cfaaf6835e64e85e2eac0e1264d79dd7667eb685c4a1be3cb31  src/components/jlpt/N1OfficialTrial.tsx
```

All other V10 hashes remain unchanged. Simulator verification remains required.
