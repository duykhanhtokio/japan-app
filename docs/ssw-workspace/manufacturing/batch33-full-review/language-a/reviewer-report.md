# Manufacturing translation review — AI lane 4/6

Date:2026-10-29. Locales:vi,en,id,zh-CN,zh-TW,th. Runtime untouched. Scope is independent AI comparison, not native-speaker or professional domain certification.

## Completed evidence

- Full structural scan: 94,278 Japanese/target field pairs across262lessons,12guides,456weeklyquestions,1200mockquestions,22captions,UI and8supplementquestions in sixlocales. Zero missing/empty fields or stale source hashes in this scan. All input bytes are bound by SHA-256 in structural-scan.json. This is NOT semantic approval of those94,278fields.
- Full question-level comparison:5electrical questions in all6locales,30question-locale pairs/270fields, including stems,ordered options and reasons. Exact IDs are in semantic-review-ledger.json.
- Field-level comparison: all838numeric-candidate field pairs were displayed and compared against complete paired Japanese strings; one extra Traditional Chinese valence-electron field was read. Counts overlap the full-question comparison; the combined unique field total is 1072. See numeric-review-ledger.json. This is not whole-entry certification.
- Proposed241field corrections (236questionfields +5lessonfields), machine-validated against exact raw before values; existing IDs,Japanese canonical,answer indices and option ordering are unchanged. Proposals restore explanatory content, units, formulae and natural wording, rather than changing answer semantics. No proposal has been applied to raw runtime by this lane.

## Main findings

1. High-priority Vietnamese safety ambiguity: electrical mock06 practical04 reason[3] said “lỗi ít nghiêm trọng an toàn”, obscuring/reversing Japanese “low-frequency categories with serious safety consequences”. The proposal explicitly preserves both low frequency and high safety severity.
2. Widespread overcompression in Vietnamese and Chinese explanations removed quantities,units or meaningful relations: e.g.“75是并”,“乘非分割”,“Nhỏ 1 mmkhông 10 triệu”. These are not native-quality learning explanations. Proposals restore complete sentences and numerical context for caliper/micrometer readings,unit conversion,circuit resistance,thermal classF,rotating-field synchronous speed and other reviewed fields.
3. Thai treatment-area/current-density prompts omitted the term average current density; the revised prompts identify the requested quantity. Thai once-per-lot control wording and nickel applications were clarified. Indonesian merged values/units such as“450 msatu” were separated to avoid ambiguous reading.
4. Many numeric candidates are valid equivalents: English/Chinese/Thai number words,decimal commas,ordinal words and equivalent simplified equations. They were not automatically declared errors.

## Additional lesson findings

Five lesson proposals separately fix a Chinese PPM denominator that changed shipped-item count into shipment-event count, English split-word/formula spacing, Indonesian fused fraction/formula text, and Chinese wording of five/three valence electrons per dopant atom. See lesson-correction-proposals.json.

## Still pending

Full semantic review of every field beyond the explicit ledger is unfinished, including most lesson/guideline content and noncandidate question fields.All838numeric candidate field pairs are now reviewed; no candidate remains unread in this triage queue. Most of the94,278structurally scanned field pairs are not covered by that field-level review. Finishing the numeric queue does not certify the whole curriculum. Full technical term harmonization against an authorized official target-language glossary still requires the corresponding original target sources; this lane has not claimed such a comparison.

All nativeReviewed/domainReviewed/humanReviewed/releaseReady flags stay false. No sourcePDF pages,rendered source images or third-party translations are redistributed. Parent owns integration,regressions,commit/push and persistence verification.

## Supplementary terminology batch

The full terminology inventory was structurally checked:1,018 term occurrences per locale,6,108 target meanings in the six assigned locales,none missing. A priority batch of92term occurrences/552target meanings was actually displayed and compared with complete Japanese definitions. It covers measuring instruments/scales,earthing/leakage/insulation,timers,synchronous/rotor speed,redox/electrodes,pretreatment,neutralization/equivalents and density/specific gravity. Fourteen proposed definition corrections are separate in supplementary-correction-proposals.json; all exact before values and lesson source hashes were validated. The first241proposals remain unchanged.

The corrections restore explicit reference-density denominators,aqueous-solution and thermal-expansion conditions,pole count/supply frequency and clearer instrument/process definitions. No oxidation/reduction,anode/cathode or on/off-delay reversal was identified in this92-term batch. This observation does not certify the other926term occurrences per locale.5,556target meanings remain semantically unreviewed in this terminology workflow. No official target glossary/native/professional certification is claimed. See supplementary-terminology-review.json for each reviewed ID/index/locale and definition hashes.
