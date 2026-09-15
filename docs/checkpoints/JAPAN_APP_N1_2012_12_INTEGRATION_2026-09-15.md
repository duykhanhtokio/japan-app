# JAPAN APP - N1 12/2012 INTEGRATION CHECKPOINT

- Exam: `n1-2012-12-exam-02`
- Catalog destination: `N1 模擬試験 第2回`
- Existing `第1回`: preserved
- Written questions: `70/70 verified`
- Listening answer units: `36/36 verified`
- Listening transcripts: `36/36 verified`
- Original audio SHA-256: verified
- Source explanations: `70/70 zh-CN verified`
- Offline AI translations: `840/840`
- Runtime translation API: disabled
- Resolver: current locale -> `en` -> `zh-CN`
- Review behavior: detailed explanation/transcript remains hidden until submission and selection of `詳しい解説を見る`
- AI label: visible for every `translated_ai_unreviewed` explanation

## Validation

- `node scripts/check-n1-2012-12-integration.mjs`: PASS
- `npx tsc --noEmit`: PASS
- `npm run lint`: PASS with pre-existing warnings only; zero errors
- Full Expo export requires the complete app asset tree. The user-provided source package intentionally omitted unrelated large image folders, and `src/app/home.tsx` references one of those omitted folders.
