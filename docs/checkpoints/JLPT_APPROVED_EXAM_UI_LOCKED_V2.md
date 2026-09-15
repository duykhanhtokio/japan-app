# JLPT approved exam UI checkpoint V2

```text
STATUS: USER-AUTHORIZED MULTI-EXAM INTEGRATION
UI POLICY: LOCKED
REDESIGN: FORBIDDEN WITHOUT EXPLICIT USER PERMISSION
DATE: 2026-09-15 (Japan time)
```

V2 was created after the user selected the exam-list-first flow. It parameterizes the existing approved runner without changing `JlptExamUI.tsx`, the JLPT design system, or their hashes. It adds a non-Royal exam picker and connects N1 12/2012 through the same runner.

```text
f5e0f44c86448e76a0ae3a8e169ff6ccef21502e486503d2d0aff4ec0a41525a  src/app/[level]/[section].tsx
36389c36539c7d942275264c4329e8f90183e865b61faee7fe9cd2d4081c6509  src/components/jlpt/N1OfficialTrial.tsx
6c8676b97d12d3da6fe36f5fde28adb1833bcb7208628c00dc61f1b9c5c55098  src/components/jlpt/N1ExamPicker.tsx
0ecea5a9f733d8d076bde7b7c1ea75be692255aae55e4447da3121ae06aec6cc  src/components/jlpt/ui/JlptExamUI.tsx
117ee15c311453c01c230e6c46290388474874d4384284c9f2ac43f4ed67a51d  src/services/jlpt-trial-session-storage.ts
9d8276e32e5b1b25485d84cbe961acd5cbca5b106ee2dd95e6fbaadd9d2b9bb7  src/theme/jlpt-exam-design-system.ts
223e03109265c698bf0145c01e2f9b4d3ddc8c70b0e8cbf3b4f5f186062265de  src/data/jlpt-official/approved-n1-exams.ts
```

The original user-approved V1 snapshots remain preserved under `docs/checkpoints/jlpt-approved-ui/`. V2 snapshots are under `docs/checkpoints/jlpt-approved-ui-v2/`. Do not delete or overwrite either set.
