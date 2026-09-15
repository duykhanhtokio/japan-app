# JLPT approved exam UI checkpoint

```text
STATUS: USER APPROVED
UI POLICY: LOCKED
REDESIGN: FORBIDDEN WITHOUT EXPLICIT USER PERMISSION
APPROVED: 2026-09-15 (Japan time)
```

This checkpoint records the exact non-Royal JLPT N1 exam interface approved by the user after restoration. The canonical rendering chain is:

```text
src/app/[level]/[section].tsx
  -> src/components/jlpt/N1OfficialTrial.tsx
  -> src/components/jlpt/ui/JlptExamUI.tsx
  -> src/theme/jlpt-exam-design-system.ts
  -> src/services/jlpt-trial-session-storage.ts
```

Immutable SHA-256 values:

```text
6f6660125c86f791c118ee740e722c875f9553ee0e33fe6cb044b8e42cf19fdf  src/app/[level]/[section].tsx
86a328470eebdea0b21e15b20f9b535a524cd5598d00559dd9aad8a5fdd00fd3  src/components/jlpt/N1OfficialTrial.tsx
0ecea5a9f733d8d076bde7b7c1ea75be692255aae55e4447da3121ae06aec6cc  src/components/jlpt/ui/JlptExamUI.tsx
667fe51cb4887e497e2de2e4b6dc6ea58e01a1db4ccfb23026f7292a0c574f1b  src/services/jlpt-trial-session-storage.ts
9d8276e32e5b1b25485d84cbe961acd5cbca5b106ee2dd95e6fbaadd9d2b9bb7  src/theme/jlpt-exam-design-system.ts
```

Byte-for-byte copies are stored under `docs/checkpoints/jlpt-approved-ui/`, preserving their project-relative paths. These hashes may only be updated after explicit user approval of a new visual version. A failing lock check is a stop condition, not permission to regenerate hashes.

Direct data/runtime dependencies identified at approval time:

- `src/data/jlpt-official/n1-2012-07-trial.ts`
- `src/data/jlpt-official/n1-2012-07-exam-01.verified.json`
- `src/data/jlpt-mock/n1-2012-07-official.ts`
- `assets/jlpt/n1/2012-07/audio/n1-2012-07.mp3`
- `assets/jlpt/n1/2012-07/visual-options/problem1-item1.jpg`
- `assets/jlpt/n1/2012-07/visual-options/problem1-item6.jpg`
- `@react-native-async-storage/async-storage`
- `expo-audio`

The data files are dependencies, not permission to modify locked UI files. New exams must use separate data and session identities and must preserve the approved presentation and interaction contract.
