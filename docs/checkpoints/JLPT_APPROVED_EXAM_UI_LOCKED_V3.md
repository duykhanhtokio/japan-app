# JLPT approved exam UI checkpoint V3

```text
STATUS: USER APPROVED
UI POLICY: LOCKED
REDESIGN: FORBIDDEN WITHOUT EXPLICIT USER PERMISSION
AUTHORIZED CHANGE: integrate all 50 recovered exams and remove Royal from N2-N5 exam routes
DATE: 2026-09-14 UTC
```

V1 and V2 remain immutable historical evidence. V3 changes only exam routing/catalog and adds data adapters/runners that use the existing approved `JlptExamUI` design system. The canonical N1 rendering files `N1OfficialTrial.tsx`, `JlptExamUI.tsx`, `jlpt-exam-design-system.ts`, and the approved N1 data adapter were not changed.

Active V3 SHA-256 values:

```text
4a4e0e1da02cb5b08d8e2309a441a9746c22dab280c97e0097ca32898b0d74c1  src/app/[level]/[section].tsx
5cd6fe78d29bcb4f0a25edfa64f7a272e47b7b116ecb47fa781f091826f20040  src/components/jlpt/ApprovedJlptExamCatalog.tsx
efa9b3abdcd3097b96415ecf731fe1400433dbdd53e38b606d3a6324aba728a9  src/components/jlpt/ApprovedScannedExam.tsx
101daaf3d0867f773e5eaef560d13d7e0532a4e62bc5f0036cd59c0b12175fdb  src/components/jlpt/ApprovedMockExam.tsx
1e7baa59e6939929a46487fd9d91915217f1c7c2ba322f94c2ba72d93ecac0aa  src/data/jlpt-official/approved-scanned-exams.generated.ts
36389c36539c7d942275264c4329e8f90183e865b61faee7fe9cd2d4081c6509  src/components/jlpt/N1OfficialTrial.tsx
0ecea5a9f733d8d076bde7b7c1ea75be692255aae55e4447da3121ae06aec6cc  src/components/jlpt/ui/JlptExamUI.tsx
9d8276e32e5b1b25485d84cbe961acd5cbca5b106ee2dd95e6fbaadd9d2b9bb7  src/theme/jlpt-exam-design-system.ts
```

Do not import `RoyalButton`, `RoyalInfoPanel`, `RoyalOptionRow`, or any `N*Official*Test` wrapper into the JLPT exam route. New exams must be added as data entries to the approved registry.
