# Royal HUD, Profile and Mission — 2026-10-01

Status: implementation and browser viewport QA checkpoint. Native/device QA and Mission approval pending. Not full release acceptance.
Initial verified input: 3a570a99af842c47f0aeda8dd0eedb6a3afe3eb7, recovery/jlpt-n3-n1. Reconcile with the latest branch before persistence; preserve ongoing dialogue work.

## Final changes
- Approved Credit/qualification bars: 64 → 32 each. Existing top-row and avatar sizes preserved. Only released bar space removed.
- Royal bars: actual baseline (170 - 78 - 2) / 2 = 45; now 22.5 each. Frame crop, fill and safe text derive from the same measured bar height.
- Name/coin plaques use existing navy Royal artwork. Preserve gold coin; responsive interior padding keeps it away from ornaments.
- RoyalNavyFrame crops transparent source margins (1800x480 source, visible y=84..396) inside its measured parent. No intrinsic 1800px web image overflow.
- Bottom composite visible source y=195..531 is anchored to nav height independently from screen width. Local tab containers occupy x=5%..95%; icon/text groups centered.
- Profile keeps section order. ProfilePanel measures content independently of padding, with vertical padding max(24, contentHeight * .28) and horizontal padding max(24, panelWidth * .12). This keeps text in the decorative interior without a measurement feedback loop. Narrow identity cards stack avatar, information, Edit in original order. Other rows wrap as needed.
- Shared APP_TYPOGRAPHY supplies ROYAL_TYPE and appTheme type roles. Home headings, Profile/Mission text and Royal shared components use these rules. Profile/Mission explicitly use bundled Japanese fonts; old overlapping 13/14 line heights replaced by 22.
- Mission HUD reads the same Credit/qualification ledger as Home/Profile. No change to economy rules.
- Legacy Mission hardcoded daily/weekly/monthly counts and completed ticks removed; sections show localized Coming soon. Existing legacy task/reward descriptions are not real tracked Mission implementation.
- Locked JLPT layouts, session/scoring and typography untouched.

## Mission evidence and concrete proposal — NOT IMPLEMENTED
Work history stores id, scenarioId, completedAt and completedPlayerTurns/totalPlayerTurns. Count only full completed conversations, distinct scenario IDs, with dates in the target period. JLPT stores latestSubmittedAt and saved submitted/result state including unanswered; require submitted, total > 0 and unanswered == 0 for the proposal below. Aggregate word/dialogue counts alone cannot prove activity today.

| Mission | Condition | Period, Asia/Tokyo | Proposed Credit |
|---|---|---|---:|
| 今日の仕事会話 | Complete all player turns of one work conversation | Daily | 5 |
| 仕事会話を広げよう | Complete five different work scenario IDs | Weekly, Monday start | 10 |
| JLPTに挑戦 | Submit one exam with all answers completed; no abandoned sessions | Weekly | 10 |

Proposal: activities may contribute to both daily and weekly goals. Each mission can be claimed only once per missionId + periodKey; deduplicate event IDs within a mission. Store claim and Credit update together in serialized state, with Credit capped at 100. Existing earnCredits alone does not atomically record a claim, so that joint transaction must be implemented before rewards are enabled. No EXP or promotion changes. User approval is required before coding tracking/rewards.

## Verification
- Actual Chromium screenshots: Home/Profile/Mission at 320x568, 390x844, 412x915, 768x1024, 1024x768, 1440x900. 18/18 had document scrollWidth == clientWidth.
- Long Japanese–Vietnamese name at 320; Profile middle/end scroll captures.
- Approved Credit and EXP frame heights measured at 32 on widths 320/390/768/1440.
- All four tab routes checked: /home, /tasks, /profile, /game. Back from Mission returned /home.
- Before/after screenshots at 390x844. Final source restored byte for byte after baseline capture.
- Expo web export PASS (11476 modules); scoped ESLint PASS (0 errors, 0 warnings).
- JLPT approved UI lock PASS 10/10; git diff --check PASS.
- TypeScript remains blocked by existing TS2352 in src/services/life-content-repository.ts: scenario override missing type. No changed UI file diagnostics. This service was not modified.

Evidence: ROYAL_UI_REVIEW_20261001.html embeds real screenshots; ROYAL_UI_BROWSER_QA_20261001.json contains viewport and navigation measurements.

## Practical limits / next work
Native iOS/Android/iPad device or simulator behavior, safe areas and font scaling have NOT been verified; browser viewport checks do not substitute for native QA. Some legacy Profile emoji have missing glyphs in the Chromium environment. Other screens with literal font sizes need a separate role-by-role inventory/migration; shared token changes do not automatically rewrite literals. Do not claim full-app typography migration or native acceptance.

## Resume follow-up — 2026-10-01
- Preserved the finalized UI commit aa37d49c and merged the supplemental fixes on recovery/jlpt-n3-n1.
- Home and Profile GameHeader moved outside their ScrollView; Back remains visible and stationary while content scrolls. Mission already kept the header outside scrolling content.
- Compact approved name text uses a smaller type size and fixed artwork-safe padding; the default Japanese player label fits at 320px. Percentage padding was avoided because it resolved against parent width.
- Chromium recheck: 18 Home/Profile/Mission screenshots at six viewport sizes, no document overflow, approved Credit frame 32px; all four tabs route correctly; Back y remains unchanged on scroll in all three screens; fresh Profile Back falls back to Home; long Japanese–Vietnamese name checked. Runtime page errors: 0.
- Scoped ESLint: 0 errors/warnings. git diff --check PASS. JLPT UI lock PASS 10/10. Existing TS2352 remains outside the changed UI. Native/device/font-scale acceptance and full-app typography audit remain pending.
- Supplemental evidence: ROYAL_UI_RESUME_QA_20261001.json and ROYAL_UI_RESUME_REVIEW_20261001.html.
