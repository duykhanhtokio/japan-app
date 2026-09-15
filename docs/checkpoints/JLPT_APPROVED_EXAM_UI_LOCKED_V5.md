# JLPT approved exam catalog checkpoint V5

```text
STATUS: USER-AUTHORIZED CORRECTION
UI POLICY: LOCKED
REDESIGN: FORBIDDEN WITHOUT EXPLICIT USER PERMISSION
DATE: 2026-09-14 UTC
```

The user explicitly required restoration of all 50 catalog entries after V4 incorrectly hid 43 scanned-source exams. This checkpoint authorizes only catalog visibility, pending-status messaging, and the already-approved Back correction.

- 45 official entries remain visible: N1 15, N2 13, N3 17.
- Five mock entries remain visible: N1 through N5.
- Two official exams and five mocks are ready in the approved question-by-question UI.
- Forty-three source packages remain visible as `scanned_only`; they do not open a full-page image renderer.
- Pending status is catalog metadata only and does not import the scanned asset registry at runtime.
- `N1OfficialTrial`, `JlptExamUI`, the design system, and session service remain byte-for-byte unchanged from the approved checkpoint.

```text
76e954d668904a85c06ae76f47ac5e7e1cc7d89c1564388fba0fc71e9da3acb7  src/components/jlpt/ApprovedJlptExamCatalog.tsx
e7c1cac83e3bf2c4e894d140aff97792489c7b31ec4545f71345ba97eebaf731  src/data/jlpt-official/jlpt-exam-catalog.ts
36389c36539c7d942275264c4329e8f90183e865b61faee7fe9cd2d4081c6509  src/components/jlpt/N1OfficialTrial.tsx
0ecea5a9f733d8d076bde7b7c1ea75be692255aae55e4447da3121ae06aec6cc  src/components/jlpt/ui/JlptExamUI.tsx
117ee15c311453c01c230e6c46290388474874d4384284c9f2ac43f4ed67a51d  src/services/jlpt-trial-session-storage.ts
9d8276e32e5b1b25485d84cbe961acd5cbca5b106ee2dd95e6fbaadd9d2b9bb7  src/theme/jlpt-exam-design-system.ts
```
