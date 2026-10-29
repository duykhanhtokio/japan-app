# Mechanical source review — AI 1 of 6

Date: 2026-10-29. Baseline: `b5f9bb2ee49a09c14c8dfbb8f39e589e6d50a11b`.
Source: canonical mechanical SSW1 textbook, second edition July 2026, 169 physical pages. Verified SHA256: `35096524ce12c830ce7765311f536b5d1d0a8bde7268e5385f90588abba04622`.

## Work actually completed

Read the source prose on all 169 pages, including exercises and answers. Viewed all pages as overview renders, then every instructional body page 9–168 at 1000 px per page, with readable diagram/table/formula labels. Cover, contents and colophon (1–8, 169) received overview and text inspection. This was direct model inspection of rendered pages; rendering/extraction was preparation, not the evidence of semantic review.

Compared the source concepts with the complete Japanese paragraph prose of all 91 current mechanical lessons, all four mechanical source guides, selected technical term arrays, and all eight registered mechanical diagram assets. Read a subset of mock stems and correct choices; did not finish the complete 400-mock/156-weekly distractor and rationale bank. The candidate question IDs in the ledger are therefore navigation links and expressly **not** certification of those items. All 12 translations, all lesson fields and physical-device tests remain outside this review's completed claims.

`page-ledger.json` contains exactly one row for every physical page, with a paraphrased knowledge facet, actual lesson/guide navigation, visual review level, specific findings and pending work. `findings.json` groups 31 pages with detail/visual gaps and 37 pages where app qualifications should be preserved. Reading and concept comparison are complete; full atomization and full question-bank closure are not.

## Wording defect to fix

Physical page 137 explicitly identifies leakage magnetic flux as the principle used by magnetic-particle testing. Lesson `mfg1-mechanical-lesson-076`, Japanese paragraph 3, currently contrasts 磁粉 / 渦電流 / 磁束漏れ in a way that can suggest three independently named test methods. Replace that span with independently phrased clarification:

> 資料の後半は、磁粉探傷で欠陥周辺の漏洩磁束を利用すると説明しています。磁粉探傷と、渦電流に関係した電気的変化を調べる渦電流探傷を、同じ原理・手順として扱わず、指定方法を確認します。

Update corresponding translations and revision metadata through the established guarded content workflow. This agent has not modified runtime content.

## Visual and source-detail work still needed

These are coverage gaps, not evidence that current prose is wrong. Use independently authored art and examples; do not trace or reproduce source figures.

- Pages 27–30: sign shapes/colours and pictogram recognition. Lessons 008/071/072 cover the meanings, but the eight mechanical assets do not provide a comparable recognition set.
- Pages 42–43: seven-QC-tool chart interpretation. Lesson 012 teaches purposes; the control-plan asset attached to 011 is a different five-field diagram.
- Pages 75–76, 80, 82, 85: micrometer, dial/comparator and GO/NOGO instrument recognition/readout art. Current prose covers principles and instrument-dependent limits. The 1 mm-pitch micrometer variant is not explicit in 019.
- Pages 88–89: complete recommended-scale list and pen-width examples are not all explicit; nine visible drawing-line patterns need an original swatch legend.
- Pages 91–96: third-angle object-to-view construction, actual cone/circle projection symbol, section hatching, dimension lines and fit drawings need additional original visual examples. The current third-angle asset correctly teaches top/front/right placement but intentionally has no object shape.
- Pages 98–99, 104–107: feature-to-leader, surface-texture/material-removal and weld/joint/leader examples need visual practice. Source page 104 really says Ra 3.1; do not silently substitute 3.2 when discussing that source example.
- Page 70: source's 90° V-block example is not explicit in 077; it must be scoped as an example, not every V-block.
- Page 126: source-specific SS330 / 330 N/mm² example was not found in core/guides/mocks. Any addition needs grade/standard/condition qualification and technical checking.
- Pages 130–132: machine component recognition art is absent; apron / control panel / spindle handwheel are not all explicitly named in 085/086.

Important verified coverage: the app's dimension-symbol asset **does contain all 13 symbols** on source page 97; its geometric-symbol asset **does contain all 15** on page 101. The geometric attachment asset addresses surface/axis and datum attachment on 102–103. The caliper contact asset distinguishes outer/inner/depth contacts, and the original vernier model correctly shows 18 + 4×0.05 = 18.20 mm. Do not open generic missing-symbol or missing-caliper-diagram issues for these already present assets.

## Preserve existing technical qualifications

The source contains simplified or overly broad statements. Existing app wording appropriately limits these; reverting it to source wording would reduce quality. The per-page ledger records the relevant lesson references. Examples include calibration versus adjustment; JIS mark versus confirmed accuracy; pH range/neutrality conditions; equipment ratings; GO/NOGO entry criteria; fit limits; stainless corrosion; melting point versus service temperature; grain-flow loading; welding heat/pressure; full inspection limitations; surface roughness requirements; authorized electrical isolation and residual energy; particles versus gases/oxygen deficiency; safe fire response; insulation/diode operating limits; and rolling heat/work hardening.

Physical page 9 of this canonical textbook **does** explicitly give 40 minutes theory + 40 minutes practical, 30 true/false + 10 multiple-choice, and 65% / 60% thresholds. Lesson 069 agrees. These are source-date-bound facts (July 2026), not verification of later exam policy. Earlier sample-cover caveats about unconfirmed split thresholds must not override this canonical-page evidence.

## Review limits and release state

This is an AI technical and Japanese source-expression comparison, not a certified specialist or native-speaker sign-off. `nativeReviewed`, `domainReviewed`, `humanReviewed`, `releaseReady`, `fullKnowledgeAtomizationComplete` and `wholeCurriculumComplete` remain false. No real device was used by this agent. Root should integrate this evidence with the other five reviews and their own device evidence without promoting these flags.

Input hashes are in `page-ledger.json`. If another agent changes content after this baseline review, the new bytes need an explicit delta review. No source PDF, extracted text or source renders were added to the repository.
