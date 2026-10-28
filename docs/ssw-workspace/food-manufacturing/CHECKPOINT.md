# Batch18 — 2026-10-28

Base `00cb2ec727b85116fe398d3638e1c023f62532b4`; branch `feature/food-manufacturing-batch18-20261028`.

- Added 219 question–locale pairs for 2号 mock05: BN 35, HI 36, NE 36, TH 32, MY 40 and KM 40. Preserved 21 existing form entries and four existing titles; added two titles. Mock01–05 of both levels are now complete in all 12 locales. Total: 5,896/10,068; 4,172 remain. See `batch-18-form-coverage.json` for exact IDs.
- All 5,677 prior question/title objects, 839 Japanese questions, 78 lessons, 33 assessment revisions and runtime/UI files preserved. Exact missing membership, source hashes, four ordered choices/reasons and correct-reason/main-explanation equality checked.
- Independent AI semantic review covers all 219 new pairs. Six peer reports retain exact reviewed IDs, corrections and integrated-part hashes. AI review is not native/domain certification. Numeric-format differences and the explicit q346 arithmetic reference are recorded in `batch-18-review.json`; source PDFs were not revalidated in this translation batch.
- PASS: content structure; actual Node adapter with 5,896 valid and stale-source rejection checks, plus 4,172 missing pairs without fallback; state resume/scoring/revision/storage isolation; approved JLPT UI lock 10/10.
- Historical browser evidence remains at 3,460 pairs; 2,436 current pairs await browser QA. React, react-dom, react-native-web and esbuild are unavailable here. No new browser/full Expo/native/device evidence. Full-body furigana, complete source competency/visual verification, illustrations and native/domain review remain open. `scopeComplete=false`; `productionRelease=false`.

Next: continue exact missing mock06–10 IDs from `batch-18-form-coverage.json`. Keep food work separate from unrelated sectors and JLPT.

---

# Batch17 — 2026-10-28

Base `7bf77e6d7fdd7e178db0d38b9eae0d0a78eb1b12`; branch `feature/food-manufacturing-batch17-20261028`.

- Added200question-locale pairs and5titles: EN/VI1号mock09; TL/ZH-CN/ZH-TW1号mock06. Total5677/10068;4391remain. Exact IDs in batch-17-form-coverage.json.
- All5477prior questions/titles preserved exactly; Japanese839questions,78lessons,33assessment revisions and runtime/UI unchanged. Canonical sourcehashes, four ordered choices/reasons and correct-reason alignment checked.
- Independent AI semantic review covers all200newpairs. Corrections remove added qualifiers, clarify hot-environment work and preserve generic management criteria/deviations and responsible-worker scope. Five peer reports retained. No native/domain certification.
- PASS:content structure; actual Node adapter5677valid and5677stale-hash rejections,4391missing withoutfallback; state resume/scoring/revision/storage isolation; approvedJLPT UI lock10/10. Numeric differences in newfields reviewed separately in batch-17-review.json.
- Browser evidence unchanged3460pairs;2217current pairs await browserQA. No newbrowser/Expo/native/device evidence. Fullbodyfurigana,sourcecompetency/visual review andillustrations remainopen. scopeComplete=false; productionRelease=false.
- One of six authoring workers failed at modelcapacity; its Indonesian task remainsunmodified. Only five completed40-question files are counted.

Next:finish remaining2号mock05 locales and missing mock06–10 entries from exactmatrix. Continue independentfood work without changing agriculture/restaurant/JLPT.

---

# Batch16 — 2026-10-27

Based on sharedsector commit `48c11c2869e177040e45d6a63fdb8b0972966699`; candidate branch `feature/food-manufacturing-batch16-20261027`.

- Added341 question-locale pairs; total5477/10068, remaining4591. Completed newforms: EN/VI1号mock07and08, ID2号mock06, TL/ZH-CN/ZH-TW2号mock05. BN5,HI4,NE4andTH8 are explicit partial2号mock05 contributions, never whole-form completion.
- Exact source membership, revision hashes, four choices/reasons, main/correct-option explanation equality and existing5136question/title objects checked. Actualadapter PASS5477 valid and stale-hash rejection checks. Missing4591withoutfallback. Japanesecontent andruntimeunchanged.
- IndependentAI semantic review covers81newunits:60root-authored Chineseunits,16TH/HI/NEunits and5BNunits. Othernewunits remain awaiting independentAI peer review; all content remains native/domain-unreviewed. TW regional conversion artifacts and general preparation-versus-changeover wording corrected; BNfrequencywording andTHphrasing corrected.
- Numeric audit:TLq147 adds :00 to source hour notation;9:00/10:00/11:00 represent source9/10/11hours, not altered values. Remaining numeric candidates0.
- Browser evidence unchanged3460pairs.2017currentpairs still await browserQA. This workspace lacks React,react-dom,react-native-web,esbuild andTypeScript packages, so fullExpo/browser build cannot be run here; Nodeactualadapter uses built-in TypeScript stripping. No browser/native/productioncertification.
- Source inventory839questions,20mockforms,13weeklychecks; historical199question source-review snapshot remains historical, not current coverage proof. Fullsource competency/visual verification,furigana,illustrations anddevicevalidation remainopen. scopeComplete=false; productionRelease=false.

Exact next IDs: `batch-16-form-coverage.json`. Parallel workers may have newer completed files beyond this frozen snapshot; revalidate and persist before counting.

---

# Batch15 — 2026-10-27

Candidate branch `feature/food-manufacturing-batch15-20261027`, based on shared sector commit `9efc1ae3f522ddc7291f1a8458a5dd43caed8f64`. The separately published batch07 is stale for continuation; no overlapping variants were imported from it.

- Added196 question-locale pairs:36TH and40each NE/MY/KM for `food-1-mock-05`, plus40VI for `food-2-mock-06`, with five revision-bound titles.1号 mock05 is now complete in all12locales;2号 mock06 has EN/VI. Total5,136 of10,068;4,932 remain.
- All4,940 prior question entries and titles preserved exactly. All33 Japanese assessment objects, options, answers and revisions unchanged. Corrected only stale top-level authored-scope metadata from2/160/640 to10/800/0.
- Every new pair has independent full-form AI semantic review (196units), including all options and reasons. Corrections include NE inclusive220ppm threshold/rounding, MY rotating-screw terminology and KM hot-liquid/clothing wording. Native/domain certification remains false.
- PASS:actual adapter evaluated with Node's TypeScript stripping and JSON import injection;5,136valid plus5,136stale-hash rejection checks;4,932missing without fallback;272valid titles. State resume/revision/scoring/storage checks PASS. No esbuild was available in this workspace; `check-adapter-without-bundler.cjs` runs the actual adapter rather than duplicating lookup logic.
- Browser QA's natural missing-translation fixture no longer falsely fails once all translations exist. When none exists it explicitly records not_exercised; a three-case VM regression checks both fixture branches and failure on absent notice. This does not launch a browser.
- Historical browser evidence is unchanged:3,460net pairs,13,840viewport cases.1,480historical plus196new=1,676current pairs still need browser validation. No new browser/fullExpo/native evidence is claimed. Approved JLPT/runtime source files are unchanged.

Resume from `batch-15-form-coverage.json`: remaining2号mock05 locales, then missing mock06–10. Full-body furigana, detailed source competency/visual verification, original illustrations, expert/native review and fullExpo/device validation remain pending. `scopeComplete=false`, `productionRelease=false`; the existing internal-preview gate is preserved.

---

# Batch14 — final verified continuation checkpoint

Base1b5869f on feature/food-manufacturing-20261026. Added512question-locale pairs afterbatch13; combinedthissession992newpairs. Current4940/10068,remaining5128. Allprior4428questions/titlespreserved. See batch-14-form-coverage.json for exactperlocale/formresume. Japanese78lessons,800mocks,39weeklyquestions andruntime/UI unchanged.

New:EN/VI/ID2号mock05 and1号mock06;EN2号mock06;ZH-CN/ZH-TW/BN/HI/TL1号mock05;TH32additional canonicalpoolquestions acrosslaterforms(noextra fullformcompletionclaimed). Allcanonicalhashes/order/correctreason checksPASS.

ActualChromiumPASS512netpairs/2048responsivecases,includingcorrectedHI/TL80 andfinalEN40. Executed592pairsincluding80supersededchecks;donotdoublecount. Finalselectedentriesdeepequalcurrentpacks.112independentAIreviewpairsyieldedHIhandrinseterminology,HInegation,andTLsortingcorrections;fixedbeforefinalQA. Reportsand12WebPevidenceimagesinsectordocs. FinalENscreenshotvisuallyinspected.

Totaluniquebrowserassessmentcoverage3460pairs;historical1480pairsremainuntested. Fullbodyfurigana,92remainingrangecandidatereviews/fullsourcevisual/competencyverification,originalillustrations,andExpo/native/devicechecksremainpending. No native/domaincertification;scopeComplete=false.

Resume:finish1号mock05TH/NE/MY/KM(THpartial),thenremaining2号mock05locales;useexactmatrix. Someworkershitmodelcapacity;environmentbrieflydisconnectedthenrecovered. No claimofcontinuedbackgroundwork. Allcompleteworkercontentusedhereisnowintegrated;olderbatch13notesaboutisolatednextbatchesaresuperseded.

---

# Batch13 — actual six-worker continuation

Base3881d18a on feature/food-manufacturing-20261026. Added480question-locale pairs and12titles:2号mock04 into nine remaining locales and1号mock05 into EN/VI/ID. Both levels mock01–04 are now complete in all12locales. Current4428/10068pairs,5640missing. Every prior3948entry/title preserved.

PASS:structure,sourcehash/adapter/stale rejection,480actualChromium question/review/leakchecks,1920responsivecases across fourviewports,production study-state checks. TwelveWebP evidence images; VI/KM images visually inspected. See batch-13-review.json and browser-assessments-batch13-qa.json. Historical1480pairs afterbatch06 remain without browserQA; do not count them as tested.

Peer review64unique pairs found3Bengali spacing issues and Khmerq187 upper-only narrowing; corrected beforefinalQA. Directchecks on10sourcePDFpages support4of96range candidates;92still unreviewed. Full-body furigana,complete sourcevisual/competency verification,illustrations,native/domain review and fullExpo/device checks remain pending. OverallscopeComplete=false.

Next:remaining1号mock05 locales,then2号mock05. Two further isolated120pair batches are authored but not part of this checkpoint:locale-a/next and locale-b/mock05 under current session workspace. Revalidate and persist them before counting. Some reviewer turns failed with model-at-capacity; preserve their complete files/reports. Approved JLPT and food runtime unchanged.

---

# Food manufacturing implementation checkpoint

Internal development preview on `feature/food-manufacturing-20261026`. Read IMPLEMENTATION_REQUEST.md, progress.json, source-review.md, source-map.json and batch-12-review.json. AI checks do not certify native, expert or release quality.

## Batch12 — six parallel translation assignments

- Added240 question-locale pairs and six titles: food-1-mock-04 in zh-CN,zh-TW,bn and food-2-mock-04 in en,vi,id.1号 mock01-04 and2号 mock01-03 are now complete in all12 locales;2号 mock04 has three complete locales.
- Current total3,948 pairs: en/vi/id each359; the other nine locales each319. Remaining6,120 pairs. All3,708 prior question/title entries preserved; Japanese questions/revisions, runtime, UI, lessons and diagram data unchanged.
- PASS:240 hashes, exact form membership, four choices/reasons, correct-reason/main-explanation alignment, nonempty/script checks, existing adapter valid/stale/missing-locale behavior. Report: batch-12-review.json.
- Independent AI critical reviews covered72 locale-question units. BN q223 integer-rounding qualifier removed to match source. Four arithmetic references verify45°C difference,315min runtime,20standard person-hours/5over, and1.25 to1.20kg/kg raw-material input.25 numeric-format candidates reviewed equivalent,0pending.
- Browser baseline remains2,468 pairs/9,872 viewport cases. All1,480 subsequent additions await browser QA; no new browser/native/fullExpo or native/expert certification claimed.
- Next action: translate all40 food-2-mock-04 questions/title into tl,th,my,km,hi,ne,zh-CN,zh-TW,bn (360pairs). Keep sector work independent and approved JLPT UI unchanged.

## Historical batch11 — six parallel translation assignments

- Added240 question-locale pairs and six titles: all40 food-1-mock-04 questions in tl,th,my,km,hi,ne. This form is complete in nine locales (en,vi,id plus these six); zh-CN,zh-TW,bn remain.
- Current total3,708 pairs: en,vi,id,tl,th,my,km,hi,ne each319; zh-CN,zh-TW,bn each279. Remaining6,360 pairs. All3,468 prior question/title entries preserved; Japanese questions/revisions, runtime, UI, lessons and diagram data unchanged.
- PASS:240 hashes, exact form membership, four choices/reasons, correct-reason/main-explanation alignment, nonempty/script checks, existing adapter valid/stale/missing-locale behavior. Report: batch-11-review.json.
- Six independent AI critical reviews covered72 locale-question units; no material issues found.68-23=45°C training-only temperature difference verified. Numeric audit found0 formatting-mismatch candidates. Negative q206, best-before storage, last-normal detector product period, emergency judgment limits and jam/isolation safety preserved.
- Browser baseline remains2,468 pairs/9,872 viewport cases. All1,240 subsequent additions await browser QA. No new browser/native/fullExpo or native/expert certification claimed.
- Next action: translate all40 food-1-mock-04 questions/title into zh-CN,zh-TW,bn (120pairs), then start food-2-mock-04 EN/VI/ID. Keep sector work independent and approved JLPT UI unchanged.

## Historical batch10 — six parallel translation assignments

- Added240 question-locale pairs and six titles: food-2-mock-03 in zh-CN,zh-TW,bn, and food-1-mock-04 in en,vi,id. Mock01-03 of BOTH levels are now complete in all12 locales; food-1-mock-04 has three complete locales.
- Current total3,468 pairs: en/vi/id each319; the other nine locales each279. Remaining6,600 pairs. All3,228 prior pairs/titles preserved; Japanese items/revisions, runtime, UI, lessons and diagram data unchanged.
- PASS:240 hashes and exact form memberships, four choices/reasons, correct-reason/main-explanation alignment, nonempty/script checks, and existing adapter valid/stale/missing-locale behavior. Report: batch-10-review.json.
- Independent AI critical reviews covered72 locale-question units; no material issues found. Six exact arithmetic cases plus one hypothetical CL/OL classification PASS.16 worded-number audit candidates reviewed equivalent;0pending. Negative avoid-action wording, expiry/storage scope, last-normal-detector product period, emergency authority and jam/isolation safety are preserved.
- Browser baseline remains2,468 pairs/9,872 viewport cases. All1,000 additions after batch06 await browser QA; no new browser/native/fullExpo or native/expert certification claimed. The original960-pair target is complete, with40 additional ID pairs for food-1-mock-04.
- Next action: translate all40 food-1-mock-04 questions/title into tl,th,my,km,hi,ne,zh-CN,zh-TW,bn (360pairs), then continue remaining mock forms. Keep sector work independent and approved JLPT UI unchanged.

## Historical batch09 — six parallel translation assignments

- Added240 question-locale pairs and six titles: all40 canonical food-2-mock-03 questions in tl,th,my,km,hi,ne. This form is now complete in nine locales (en,vi,id plus these six); zh-CN,zh-TW,bn remain.
- Current total3,228 pairs; en,vi,id,tl,th,my,km,hi,ne each279 and zh-CN,zh-TW,bn each239. Remaining6,840 pairs. All2,988 prior pairs/titles preserved; Japanese questions/revisions, runtime, UI, lessons and diagram data unchanged.
- PASS:240 hashes, form membership, four choices/reasons, exact correct-reason/main-explanation alignment, nonempty/script checks, existing adapter valid/stale/missing-locale behavior. See batch-09-review.json.
- Six independent AI critical reviews covered72 locale-question units. Corrected MY q099 staffing decision distractor and TH q191 recurrence-prevention wording. Five exact rational arithmetic references and one CL/OL classification PASS;10 worded-number audit candidates reviewed equivalent,0pending.
- Browser baseline remains2,468 pairs/9,872 viewport cases. All760 subsequent additions await browser QA; no browser/native/fullExpo or native/expert certification claimed for this batch.
- Next action: translate all40 food-2-mock-03 questions/title into zh-CN,zh-TW,bn (120 pairs), then food-1-mock-04 into EN/VI (80pairs). Original960-pair target now has200 pairs remaining. Keep sector work independent and approved JLPT UI unchanged.

## Historical batch08 — six parallel translation assignments

- Added 240 question-locale pairs and six titles: food-1-mock-03 in zh-CN, zh-TW and bn; food-2-mock-03 in en, vi and id. The first-level third mock is now complete in all12 locales; the second-level third mock has three complete locales.
- Current total: 2,988 pairs. EN/VI/ID each279; all other nine locales each239. Remaining: 7,080 pairs. Preserve original78 Japanese lessons,839 assessment items,33 revisions and approved UI.
- PASS:240 canonical source hashes, exact form membership, four choices/reasons each, correct-answer explanation alignment, nonempty/script checks, exact existing translation-lookup function and stale/missing-locale rejection. All2,748 prior pairs and titles preserved.
- Six independent AI critical reviews covered72 locale-question units. Corrected TW chemical-contamination specificity, EN CL-deviation wording, ID recurrence-prevention wording and VI both-OL-conditions clarity. Six arithmetic/limit reference cases pass;52 numeric-format candidates reviewed equivalent,0 pending. See batch-08-review.json.
- Browser baseline remains2,468 pairs/9,872 viewport cases. All520 additions since batch06 await browser validation. No browser, native-device, fullExpo or native/expert certification is claimed for this batch.
- Next action: translate all40 canonical food-2-mock-03 questions/title into tl,th,my,km,hi,ne,zh-CN,zh-TW,bn (360 pairs), then food-1-mock-04 in EN/VI (80 pairs). Original960-pair target has440 pairs remaining.

## Historical batch07 — six parallel translation assignments

- Completed all 40 canonical questions and the title of `food-1-mock-03` in tl, th, my, km, hi and ne: 240 new question-locale pairs, 960 choices and 960 option explanations.
- Current total: 2,748 question-locale pairs. EN, VI, ID and the six new locales each have 239; zh-CN, zh-TW and bn each have 199. Remaining: 7,320 pairs.
- All prior 2,508 pairs and titles preserved; Japanese source questions, answer positions, assessment revisions, runtime and approved UI remain unchanged.
- Validation: canonical hashes, form membership, four choices/reasons, correct-answer explanation alignment, nonempty fields, script contamination checks, and exact existing adapter valid/stale/missing-locale behavior. See `batch-07-review.json`. AI review is not native/domain certification.
- AI cross-review corrected ambiguous Burmese thawing wording in q179, made q185's <=15°C boundary explicit, clarified Khmer conveyor terminology in q308/q338 and refrigeration wording in q288. Numerical/training scope and worker authority reviewed. Browser/native/Expo testing for these additions remains pending.
- Historical browser evidence below covers 2,468 baseline pairs only. A total of 280 additions since batch06 (40 ID + this 240) await browser QA; do not inherit unrun evidence. `progress.json` now reflects current translation counts while retaining historical browser results.
- Next action: translate `food-1-mock-03` into zh-CN, zh-TW and bn (120 pairs), then `food-2-mock-03` into all 12 and `food-1-mock-04` into EN/VI. Remaining from original 960-pair target: 680.

## Historical continuation after batch06

- Indonesian `food-1-mock-03` is now complete: 40/40 canonical questions and its title. First 10 were added in `b3f43f54be3feeb5866bfb9c5546f088a233560e`; the remaining 30 in `21a74f5ad3d0df07d07114305603c552787e354c`.
- Current totals: 2,508 question-locale pairs; Indonesian, EN and VI have 239 each; the other nine locales have 199 each. Remaining: 7,560 pairs. Lesson/diagram/Japanese assessment totals remain the batch06 baseline below.
- This continuation added exactly the last 30 questions in canonical form order, not a numeric ID range: food-1-q185, food-1-q131, food-1-q397, food-1-q140, food-1-q145, food-1-q088, food-1-q158, food-1-q228, food-1-q284, food-1-q220, food-1-q098, food-1-q338, food-1-q179, food-1-q308, food-1-q289, food-1-q357, food-1-q261, food-1-q392, food-1-q177, food-1-q109, food-1-q279, food-1-q230, food-1-q288, food-1-q253, food-1-q302, food-1-q316, food-1-q248, food-1-q344, food-1-q327, food-1-q100.
- Validation PASS: all 30 new sourceHash values match canonical Japanese and existing English revision anchors; all 40 form entries are present and revision-bound; each new entry has four choices and four reasons; correct-option reason matches the main explanation; no Japanese script leakage; all 209 prior Indonesian entries and all prior titles preserved exactly.
- Explicit calculation/scope review: q185 retains hypothetical training conditions, start 11:20/end 11:48, elapsed 28 minutes, 14°C <= 15°C and 28 <= 30 minutes. q109 preserves the table-reading exercise, liquid/solid distinction, <=10°C example and instruction to check actual specified storage conditions. AI semantic review also checked worker authority, no falsified records, no bypassing locked machinery, allergen/virus/toxin distinctions and verification versus monitoring.
- No Japanese questions, answer positions, runtime or UI files changed. Additions remain AI-authored, not native/domain certified. Browser evidence below covers only the original 2,468 pairs; the 40 Indonesian mock03 additions still require browser validation. `progress.json` and batch06 reports remain historical until the next full-batch audit.
- Next action: translate all 40 canonical questions and title of `food-1-mock-03` into Tagalog (tl), preserving existing entries. Then finish the other eight missing locales, 2号 mock03 in all 12 and 1号 mock04 in EN/VI. Remaining target from the original 960-pair batch: 920 pairs.

## Batch06 content baseline

- 78 canonical Japanese lessons: 42 for 1号 in 7 weeks; 36 for 2号 in 6 weeks. All 12 target lesson locales have 78 entries each (936 pairs).
- 20 mock forms: 10 per level, 40 questions each (800 total), plus 13 weekly checks of 3 questions (39 total). All 839 Japanese items and 33 assessment revisions are unchanged from batch02.
- Four exact color concept diagrams have all 12 caption locales (48 pairs).
- All 39 weekly questions are translated into all 12 locales (468 pairs). Mock01 and mock02 of BOTH levels are translated into all 12 (1,920 pairs); 1号 mock03 additionally into EN/VI (80 pairs). Total: 2,468 question-locale pairs, with 239 each in EN/VI and 199 each in the other ten locales. Titles: 18 each in EN/VI and 17 each in the others. Each question includes all four choices/reasons and an explanation, bound to canonical sourceHash.
- All AI-authored content remains unreviewed by native/domain specialists. Missing/stale translations have explicit notices and never count as completed fallback.

## Validation and review

Use check-content.py and check-question-translations.cjs under scripts/food-manufacturing; check-state.mjs covers persistence/scoring (runtime unchanged). Current structure/adapter checks PASS for 2,468 pairs; 7,600 pairs remain missing without fallback. Audit numbers with `python3 scripts/food-manufacturing/audit-question-numbers.py --output batch-06-numeric-audit.json`; use a new output name for a new batch, preserving prior reviews. Seven candidates are equivalent worded numbers or clock formats, AI-resolved. Five calculation references independently verify arithmetic and source-answer alignment. Mixed-script validation permits shared Indic punctuation while rejecting accidental foreign letters/marks/digits.

AI peer review covered 200 unique locale-question units: 16 critical IDs across all 12 locales, plus eight additional correction-context units. Corrected collective output wording in q031, Latin word-number spacing, worker/instructor action in TL q003, TW object/scope/consumer false friends, BN advice-seeker/frequency/resource-use/extraneous-matter wording, MY wear-part wording and KM general CL deviation. All reported corrections were rechecked. These remain AI reviews, not native/domain certification.

Browser baseline browser-qa.json verifies 839 Japanese items; browser-locales-qa.json completes evidence for 936 lesson-locale pairs. browser-assessments-qa.json at 854bfc43 verifies 548 old question-locale pairs. browser-assessments-batch05-qa.json at c94e38b422b15a3b2582d098bcedfca57b29f80f adds 960 pairs (1,508 cumulative). New browser-assessments-batch06-qa.json adds another 960 pairs, 960 pre-submission explanation checks and 3,840 viewport cases. Prior entries/titles, all other source data and food runtime bytes are checked exactly before inheriting evidence. Cumulative assessment evidence: 2,468 pairs and 9,872 viewport cases. Approved JLPT UI lock: 10/10 PASS.

## Browser QA invocation

Batch06 used FOOD_QA_ASSESSMENTS_ONLY=1, FOOD_QA_ASSESSMENT_DELTA_BASE=c94e38b422b15a3b2582d098bcedfca57b29f80f, FOOD_QA_ASSESSMENT_BASELINE_REPORT=browser-assessments-batch05-qa.json and FOOD_QA_DELTA_BATCH=batch06. Run groups with FOOD_QA_DELTA_GROUP=a, b or c and FOOD_QA_EXPECTED_NEW_QUESTION_PAIRS=320:

- Group a: en,vi,id,tl; FOOD_QA_EXPECTED_QUESTION_PAIRS=876.
- Group b: zh-CN,zh-TW,hi,ne; FOOD_QA_EXPECTED_QUESTION_PAIRS=796.
- Group c: bn,my,th,km; FOOD_QA_EXPECTED_QUESTION_PAIRS=796.

Set FOOD_QA_TEST_LOCALES per group and FOOD_QA_SCREENSHOT_EXAM=food-2-mock-02. All JSON freezes before bundling. For a future batch, pin its actual parent commit and cumulative baseline report (currently browser-assessments-batch06-qa.json), choose a fresh batch name, and derive exact selected pair totals from actual data. Do not infer question IDs from numeric ranges; use exact canonical form membership.

merge-assessment-browser-reports.cjs rejects overlapping/incomplete locale coverage, mismatched baseline reports or snapshots, and changed post-QA input. Cumulative baseline loading verifies the prior merged groups and pair counts before inheritance. Keep historical reports and screenshots.

The browser uses react-native-web with explicit Royal artwork, background, safe-area and storage adapters; it is not a full Expo or native-device check. FOOD_QA_SCRIPT_FONT_DIR supplies qa-hi/bn/my/th/km.woff2; Nepali uses the Devanagari face. Required output, Chromium and Japanese-font environment variables are enforced. Twelve batch06 phone WebP screenshots are under runtime-tests; glyph samples were inspected. Native/full Expo validation remains pending.

## Next work

Next 960 pairs: translate 1号 mock03 into the remaining ten locales, 2号 mock03 into all 12, and 1号 mock04 into EN/VI. Then continue the remaining mock forms (7,600 question-locale pairs pending overall). Preserve all existing Japanese/translation entries and 33 assessment revisions. Continue verified full-body furigana, detailed competency mapping and complete source visual review, original illustrative assets and optional prerecorded audio, then full Expo/native and expert/native review.

The 153/158 TOC candidate mappings and 96 range-review candidates remain explicit; they do not certify mastery or full source coverage. Source PDFs/images are not redistributed. Keep this worktree independent from agriculture, restaurant and other sectors; preserve unrelated changes and approved JLPT UI.
