# JLPT approved exam UI checkpoint V4

```text
STATUS: USER-AUTHORIZED CORRECTION
UI POLICY: LOCKED
REDESIGN: FORBIDDEN WITHOUT EXPLICIT USER PERMISSION
DATE: 2026-09-14 UTC
```

The user explicitly ordered removal of full-page scanned-paper runtime and correction of Back behavior. V4 does not modify `N1OfficialTrial`, `JlptExamUI`, the design system, or the session service.

Authorized catalog-only changes:

- scanned-only official exams are no longer published as completed exams;
- the catalog truthfully exposes 2 structured official exams and 5 structured mock exams;
- Android hardware Back and iPhone route/swipe Back return a selected exam to the catalog once;
- only the catalog boundary delegates to the route-level `router.back()`.

```text
924e44847a9f89797a212070225dfda6cff2fe30f811c9d599907c87300c3953  src/components/jlpt/ApprovedJlptExamCatalog.tsx
36389c36539c7d942275264c4329e8f90183e865b61faee7fe9cd2d4081c6509  src/components/jlpt/N1OfficialTrial.tsx
0ecea5a9f733d8d076bde7b7c1ea75be692255aae55e4447da3121ae06aec6cc  src/components/jlpt/ui/JlptExamUI.tsx
117ee15c311453c01c230e6c46290388474874d4384284c9f2ac43f4ed67a51d  src/services/jlpt-trial-session-storage.ts
9d8276e32e5b1b25485d84cbe961acd5cbca5b106ee2dd95e6fbaadd9d2b9bb7  src/theme/jlpt-exam-design-system.ts
```

The 43 scanned-only source packages remain preserved for OCR and verification, but they must not re-enter the runtime catalog until converted to verified per-question structured data.
