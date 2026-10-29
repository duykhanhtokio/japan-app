# Surface source review — AI 3/6

Source: JAIM/AOTS metal surface treatment SSW1 reference, second edition July 2026. Local PDF has **207 physical pages**, SHA256 `08d7e9d6ae5fc5a442af227bbc690ed54cde06681ee8806eb7aadf87748b2eae`. Printed body pages 1–196 correspond to physical 11–206; physical207 is colophon. Compared baseline `b5f9bb2ee49a09c14c8dfbb8f39e589e6d50a11b`.

**Actually performed:** read text and rendered overview of every physical page1–207; compared196 body/admin/exercise pages against actual core prose; read all73 surface core lessons and6 guides. In the historical first round, separately enlarged and inspected87 selected technical pages at2.3× (about1335×1888 pixels per page), including source-table cells, formula superscripts, instrument scales, electrode/current arrows, film sections, process-flow labels and defect photographs. Viewed and semantically compared all6 surface-related app diagram PNGs. The ledger provides physical-page facets, lesson/guide IDs and source hashes, structural weekly/mock references, qualifications and exact enlarged-page list.

**Round 2 update:** Personally read99 additional fullpage2.3× renders, bringing this reviewer’s unique detailed total to186. All body pages141–206 are now personally inspected at that scale. Exact99-page evidence and app bindings are in `high-resolution-round2.json`. Ten remaining body pages53–62 are assigned to AI1 for separate evidence; this report does not claim that reviewer’s work. Eleven cover/TOC/colophon pages have text and overview inspection. The87-page first-round count remains historical.

**Limits:** 21 pages were not separately enlarged by this reviewer (10 delegated body pages and11 noninstructional pages); overview inspection alone does not certify every graphical object or label. No exhaustive graphical-object inventory was established. Linked132 weekly/400 mock references were not individually semantically reviewed in this lane. No physical-device testing or measured learning-time study performed. AI technical/japanese reading is not an independent human, native-speaker or domain-expert signoff. All such certifications, whole-source facet closure and release approval remain false. No claim that every source detail is reproduced in the app.

## Concrete app correction

- `mfg1-surface-lesson-062`, term `端面ハゲ`: definition currently restricts the defect to coating peeling. Source205 includes both excessive removal at uncoated material edges and peeling at plated edges; lesson paragraph already mentions rounding. Suggested original definition: `端面や角部が削れすぎたり、めっき皮膜がはがれたりする不良。` This is a bounded completeness correction; existing paragraph is substantially correct. Parent owns implementation and hash regeneration.

## Confirmed source inconsistency — app calculation is correct

Physical130 exercise item9-3④ states a millivolt/milliampere ratio as milliohms; physical131 calculates the same ratio correctly in ohms but still marks the original statement true. Enlarged render confirms the unit and answer mismatch. Correct dimensional conversion gives30Ω, not30mΩ. This is an inconsistency in this supplied PDF, **not a newly verified live official erratum**. Current lesson041 uses an independently authored different example,120mV/30mA=4Ω, correctly. Do not reproduce or repair the source exercise into the app bank.

## Source qualifications retained

| Physical pages | Observation | Current app implication |
|---|---|---|
| 11–13 | July2026 reference explicitly says30 theory true/false,10 practical MCQ;40minutes each,65%/60%; ruby Japanese | Exam guide matches; reference fact does not certify current live exam rules. |
| 46,74 | JIS-mark discussion overstates instrument/result/product assurance |046 appropriately requires fit, calibration/checks and specified criteria. |
| 48,110–111 | Intro pH0–14/neutral7, electrode internal solution and slope simplified |002/051 and pH guide preserve temperature/solution/model limits. |
| 62 | REACH exercise oversimplifies registration versus restrictions |056 is more complete; retain qualification. |
| 64,67 | Hydrometer upper meniscus versus burette lower meniscus are instrument-specific |020/051 correctly require instrument method; original scale-reading assessment remains incomplete. |
| 71 | Eddy-current description associates conductive nonmagnetic coatings with magnetic substrate; method applicability is more specific than this general statement |021 requires coating/substrate suitability; SME verification required before adding a detailed applicability table. |
| 86,93 | Alloy process generalizations and absolute hotdip protection claims |015/040/054 avoid universal casting/welding or permanent protection claims. |
| 106 | Acidic/basic oxide reaction partners reversed; phosphorus name/formula mismatch |012 teaches correct partners and carries earlier qualified erratum reference. No new live erratum claim. |
| 108 | Normality divide rule contradicts its own equivalent calculation |050 correctly derives reaction-dependent equivalents. |
| 118 | Enlarged original correctly labels cathodic reduction as `カソード` |Earlier overview suspicion of wrong electrode label **withdrawn**;005 is correct. |
| 124,127,135–136 | DC/frequency simplification, viewpoint omitted for clockwise magnetic field, generator thumb called force |052/053 correctly qualify pulsating DC/cycle/viewpoint/motion. App right-grip actual PNG checked coherent. |
| 141,153,167,173 | Film thickness, temperatures and performance relations are representative, conditional ranges |057/059/019 avoid recipes and universal thick-is-better/no-alloy/no-emission claims. |
| 154 | Simplified electrode figure places an electron arrow within liquid near cathode |Electrode-reaction guide correctly separates external electrons from liquid ions. Do not copy this arrow convention. |
| 175–184 | Blanket acid resistance, hydrogen/mist toxicity conflation, universal sealing or100°C limits, hard-anodize conditions and dielectric values |007/033/069 correctly preserve specification-dependent behavior; no operation or personal-insulation guarantee. |
| 190–197 | Compound colors, grit, Ra and tool-stage table are generic examples |034/061/070 correctly require product identification; no universal color/composition or grit-to-Ra guarantee. |
| 198–199 | Source buff/grinder drawings show gloves close to rotating tooling; robot text implies safety improvement |008/035 retain equipment-specific entanglement, isolation, guarding and inspection requirements. Source drawings are not PPE instructions. |

## Coverage still partial despite page-reading completion

The ledger's63 `reviewed_partial` pages describe actual missing or limited facets;67 `reviewed_source_qualification` pages preserve conditional or problematic source statements.35 `reviewed_concept_coverage` labels mean the listed concepts are covered, not all atoms on those pages.30 exercise pages were read for concepts and answer consistency but not reused.11 noninstructional pages and1 administrative page are separate.

Priorities for original extensions to existing lessons, followed by source/SME/native review:

1. Visual recognition for prohibition/warning/GHS/emergency signs (28–31), with appropriately sourced standard symbols and accessible Japanese labels. Prose terms do not establish image recognition.
2. Original work-standard/QC-process-sheet and QC graph-reading activities (41–44). Fullpage enlargements expose actual columns, dual axes, frequency/cumulative distinctions and control-limit versus specification distinctions; these are richer than general prose.
3. Original thermometer/hydrometer/meniscus/burette/pipette/analogmeter reading visuals (63–70), preserving instrument-specific reference rules and avoiding live chemical/electrical instructions.
4. Original local-cell/pinhole corrosion and anodic porous/barrier structures (89–90,175–181), contrasting ionic/electronic paths and conditional geometry. Current coating-defects image correctly covers source164–165 through-hole/recess/blister concepts; it does not cover every real defect photograph or cause.
5. Material/application and named-family specificity: phosphate variants147, particular alloy compositions86, full ionization sequence114, film-method table141, buff subtypes192–193 and named compounds195–196. Add only where exam-learning value justifies detail; neither unsafe recipes nor blanket rules should be imported.
6. Separate evaluation examples for corrosion/light/wear/dielectric tests; precise current JIS conditions require authoritative/current verification and qualified expert review. Source ranges are not current-standard certification.

## Editorial originality follow-up

Lessons072/073 contain complete21-metal and15-conductivity reference tables, matching source83/85 sequence and many short feature/use expressions. Numeric facts and material identities may be teachable, but the complete selection/order and near-source wording deserve independent expression/compilation review and potentially reorganization into genuinely original comparison activities. **This is not a legal infringement finding.** The ledger does not certify rights clearance. No source raster, OCR dump or long source passage was added to repo.

## Evidence integrity

`page-ledger.json` records exactly207 rows, all source reads complete,186 personally performed unique detailed visual inspections (87 first round +99 second round), all6 guide hashes and6 actual app figure hashes. Rendered source pages remain scratch-only. `visualAllObjectsVerified`, `wholePageKnowledgeCoverageCertified`, `wholeSourceCoverageCertified`, `allSourceTechnicalObjectsIdentifiedAndVerified`, `allWeeklyMockQuestionsSemanticallyReviewed`, human/domain/native/device/release flags are false. No runtime edits, commits or pushes were made by this lane.

## Round 2 observations and qualifications

- Physical109: NaOH molecular-mass arithmetic totals40 correctly, but the explanatory label assigns17 to H rather than to the OH group. The actual enlarged source confirms the label. Preserve correct atomic/group masses in lessons011/050; this is a source-label qualification, not a request to import the label.
- Physical95 exercise7-2⑧ has an ambiguous quantifier about conversion treatment as a corrosion-prevention method; the answer’s exclusion of some metals does not clearly refute the generic statement. Do not reuse this source item as an unqualified true/false question. No whole bank semantic closure is claimed.
- Physical66 pH-paper unchanged⇒neutral wording requires the product-specific color reference and valid measuring range. Physical86’s duralumin/casting generalization is not adopted as a universal material rule.
- Remaining enlarged141–206 pages confirm the earlier bounded film-method, testing, polishing and safety comparisons. Their source parameters remain examples; enlarged reading does not certify every source fact is taught or every app question is sound.

`high-resolution-round2.json` retains99 personally viewed pages and10 explicitly pending-own-read pages. Parent may merge AI1/AI2 assistance with reviewer provenance; those views must not be attributed to AI3. No new runtime edits were made.
