# JLPT UI lock V13 — catalog safe area and pre-exam resume presentation

Date: 2026-10-03. Explicit user authorization in this session: restore vocabulary Royal cards, remove staggered grammar frame rendering, extend the brown JLPT background through the top, replace the square saved-session prompt with background/text and frame its two choices plus キャンセル.

Only catalog/header background, learning-route loading/presentation and saved-session prompt presentation change. The optional transparent header defaults to false, preserving every actual exam header. Resume callbacks and persistence remain identical. N1OfficialTrial, answer options, submission/review, audio/scoring/session storage and exam design tokens are unchanged. The shared UI module includes RoyalContentPanel ONLY for the explicitly authorized pre-exam resume prompt. Do not expand that permission to exam questions or results.

src/app/[level]/[section].tsx
Old: a4b1820a39e9e7ecc51dbb3c8848d10bfdd0ac864b13392c2df2ce7817efb6b4
New: 133c36b5c993151d80249f37659a220a88ed18c2738fe8a7a3d11acbf007dc87

src/components/jlpt/ApprovedJlptExamCatalog.tsx
Old: 597593050e507442e8b29836f89afb66b412142b3e905e23dc8d9e0baf849c78
New: 02041d560d2a9b197c2e7fc6b3027cc5e6f08490172e901c697b98daaf043e9a

src/components/jlpt/ui/JlptExamUI.tsx
Old: 03cfb15b58da93360f277b5bf6b0b3c63bb63adcd644a4b9a184dbdfce03f90d
New: adba4ca1690e6241073f49552eea71296d1a823b98698d237e28dfb37529f127

All other protected hashes remain unchanged. Native visual acceptance remains pending; source and web validation are recorded in ROYAL_FOLLOWUP_1119_2026-10-03.md.
