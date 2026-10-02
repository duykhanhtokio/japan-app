# JLPT UI lock V12 — pre-exam backgrounds only

Date: 2026-10-02 (Asia/Tokyo). User explicitly requested bright blurred backgrounds across JLPT learning and N5–N1, retaining ivory only inside official exams.

Authorized changes: learning branch wrapper in [level]/[section].tsx and catalog-only wrapper/transparency in ApprovedJlptExamCatalog.tsx. The selected-exam early return, exam-taking components, answers, navigation, audio, sessions and review remain unchanged.

src/app/[level]/[section].tsx
Old: 8b6d55723b9c5960a5252d2b958c27fe591265847beb83c7da441fe1a7d61c3a
New: 926da0e6d33db42cca47182a4144c54dbc72e3a238ad1cf0e00d657fec2acef2

src/components/jlpt/ApprovedJlptExamCatalog.tsx
Old: 50d5afcf378b34efcee1ac1fae8221dee841111e033da9aec6c9cee05555c2a9
New: eeb3bda08045e682ba9ef86d70a382eec7092805d222d7e751dbf4638dd1cd4f

Runtime device visual approval pending. Scoped checks recorded in ROYAL_REFERENCE_DIALOGUE_2026-10-02.md. No other UI-lock hash changed.
