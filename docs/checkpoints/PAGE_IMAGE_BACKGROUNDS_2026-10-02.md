# Page image backgrounds — 2026-10-02

User requests images replacing ivory page backgrounds. Existing full-art scenes and official exam-taking ivory remain unchanged.

RoyalPageBackground uses approved cafe clear-morning artwork, cover, blurRadius40, absolute non-interactive overlay. Light overlay pure white .45 (previous JLPT warm-ivory .72 masked almost all image colour); dark overlay royal lacquer .78 only for profile to preserve existing light typography. Background wraps the safe area and scroll, not individual cards. Reading/input cards retained.

Integrated routes/components:
- src/app/dictionary/[entryId].tsx
- src/app/dictionary/index.tsx
- src/app/industry/[industryId].tsx
- src/app/learn.tsx
- src/app/lesson/[lessonId].tsx
- src/app/lesson/play/[lessonId].tsx
- src/app/module/[moduleId].tsx
- src/app/npc-starter.tsx
- src/app/profile/index.tsx
- src/app/tasks/index.tsx
- src/components/filtered-vocabulary-list.tsx
- src/components/jlpt/JlptStudyBackground.tsx
- src/components/portal/EducationAccess.tsx
- src/components/portal/EducationDashboard.tsx
- src/components/portal/EducationPayment.tsx
- src/components/portal/EducationWelcome.tsx
- src/components/portal/N5Curriculum.tsx
- src/components/portal/NewEducationClass.tsx
- src/components/portal/OrganizationDashboard.tsx
- src/components/portal/WorkerProgressDashboard.tsx
- src/components/ui/RoyalPageBackground.tsx

JLPT shared study wrapper delegates to this background; learning home overlay lightened. Covers all N5–N1 learning and catalog routes already using that wrapper. Official exam early-return remains untouched; lock hash unchanged. Image file is existing approved art; no new asset required.

Validation: scoped ESLint0errors/0warnings; TypeScript only pre-existing life-content-repository TS2352; JLPT UI lock10/10 PASS; paired dialogue regression PASS; diff --check PASS. Actual iPhone/iPad/Android/web screenshot and visual approval pending. Cover uses native aspect-preserving geometry; do not claim device validation.
