# Manufacturing SSW1 — batch04 translation continuation

Date:2026-10-26 (Asia/Tokyo). Baseline:b9bbe0a4. Only SSW1; SSW2 excluded.

Added14 Indonesian lesson drafts (mechanical022–035) and24 weekly-question drafts (mechanical04–05). All35 currently authored mechanical lessons and60 mechanical weekly questions now have Indonesian drafts. Electrical/surface remain21lessons and36questions each in Indonesian. TotalID:77/105lessons and132/180questions; remaining28lessons/48questions in those tracks. EN/VI unchanged at105lessons/180questions each. Totals287lesson–locale pairs and492question–locale pairs. The Japanese curriculum remains105lessons,15weeklychecks,180questions,8diagrams; no official-format mocks authored (0/30).

DirectJapanese-to-Indonesian author review is recorded with per-entry canonical hashes and translation digests in batch04-indonesian-qa.json. Prior63IDlesson entries and108IDquestion entries are unchanged. SourceJapanese, IDs, source mappings, question order, answer indices, revisions and progress keys are unchanged. New content remains AI drafts: no independent/native/domain certification. Existing30minute practice allocation is preserved, not measured learning time.

Validation: data/state/source checker PASS at105JP/180questions/287lessonpairs/492questionpairs; final focused browser PASS30checks (28reader visits,24questions,96rationales,6screenshots,0pageerrors), including no rationales before submission. One phone screenshot visually inspected. JLPT byte-lock10/10PASS. See batch04-session-evidence.json for exact scope, earlier stale-bundle timeout and environment limits.

Full source coverage, remaining curriculum, other9languages,30official-format mocks and fullExpo/native/device validation remain unfinished. Resume with Indonesian electrical/surfaceweeks4–5 and progress.json. Previous batch03 source/diagram/UI evidence below remains historical scoped evidence, not proof of this batch's new translations.

---

# Manufacturing SSW1 — batch03 integrated checkpoint

Date:2026-10-26 (Asia/Tokyo). Branch:recovery/jlpt-n3-n1. Baseline:8fdd3fe3.
Only the three uploaded SSW1 textbooks are used. SSW2 remains excluded.

## Current authored and preview scope

- 105 original Japanese lessons:35per specialty;42new and63retained. Five full preview weeks per specialty, not the full curriculum duration. Approximately30minutes with written practice is an unmeasured learning target.
- 15 formative weekly checks,12questions each:180total,72new. All7lessons of eachweek have a check item. Balanced3answers/position percheck, no triples,6distinct newanswersequences. Seven newquestion/reasoning/alignment revisions addressed crossbatch overlap or lesson coverage. These are NOT official mocks; completed official-format mock count remains0/30.
- English/Vietnamese cover all105authored lessons and180questions as AI drafts. Indonesian covers first21lessons/specialty andweeks1–3:63/105lessons and108/180questions;39lessons/72questions added in thisbatch. IDstill lacks the new42lessons/72questions; other9targetlocales have UIlabels only.
- Totals273lesson–locale pairs,468question–locale pairs.35UIlabels available in all12targetlocales.24diagramcaption pairs (8figures×EN/VI/ID) are revision-bound to exactcanonical Japanese captions andshown by the learner's translationtoggle. Image lettering remains canonicalJapanese; targetcaptions explain it.
- Eight original controlled2D-color diagrams are used; newrolling/extrusion, idealACtransformer ratio, andcharge/currentefficiency. Sourceconfirmed by relevantlesson authors, PNGs rendered and visuallychecked. Min960px expansion, horizontal/vertical pan andfixedclose control retained. No source-page image is redistributed.
- Japanese-first dailyreader, separateweeklychecks, weekcalendar, ivory/day-night surfaces, completionreturn, namespaced learner/specialty progress andrevision-bound answerresume retained. Existing63lessons/108questions andtheirrevisions unchanged, see batch03-baseline-compatibility.json. Devpreview gate preserved; no production-ready claim.

## Source semantic work

- Source identities remain169+198+207=574physicalpages and487TOC entries. Existingstructuralinventory complete; fullknowledge/objectatomization remainsincomplete.203TOC entries have one ormore draftlesson links, not203certified-completeknowledge units.
- Batch03 actuallyrendered/read30newbodypages (10/specialty), including allvisibletext,diagrams,tables,formulae,labels/footers.106meaningful technicalobjects have paraphrasedscope, approximatepageboxes,matrixIDs andsourcehashes. This is notsentence-by-sentence atomization or574pagecertification.
- Three additionalcolophons read, unnumbered: secondeditionJuly2026, firsteditionDecember2025, editedAOTS/publishedJAIM. Verifiededition evidence added toall3inventories andsourceQAmetadata. Canonicalsurface title followscover/overview despiteinternalcolophontitlevariant.
- 65scopequalifications/ambiguitynotes are NOT65confirmederrors. Report flags motor synchronous/rotorspeed wording, resistremoval/electron-arrow/paint-polarity andAASSpH issues; authors avoided unsupportedabsolutes. PriorOctober1errata andnormality-sourcecontradiction remain applicable. Do notteach uncertainstandardrecipes as currentrequirements.
- All42newlesson source/matrix references audited:0unknownIDs,0badpageoffsets,0out-of-bodyrefs,0duplicatepages. Full35chapter remaining-summary retained in source-review. Source-page renders stay scratch-only; commitonly descriptiveledger/review.

## QA and validation

- IndependentAI primaryreview:42newJapanese lessons and72newJapanese questions;84EN/VIlessonpairs+144EN/VIquestionpairs=228pairs/2668fields. SeparateIDreview:39lessonpairs+72questionpairs=111pairs/1285fields. Separate24diagramcaptionreview. Allidentifiedissues corrected; currentnormalizedhashes andscope are in batch03QA reports. Native/domain/release certification remainsfalse.
- `scripts/manufacturing/check.cjs` PASS:105lessons,180weeklyquestions,273lessonpairs,468questionpairs,24captionpairs;574structuralpages,30newsemanticreadings/106objects,global IDs/stems/sourceoffsets/links/revisions, PNGdimensions,progress/sessionbehavior andperweeklytaughtcoverage.
- Actualmanufacturing ReactNativeWeb browser test PASS48checks,21screenshots generated across320x568,390x844,768x1024,1440x900,932x430. Includes273translatedreader visits,24caption visits, weeks2–5checks, answerresume/submission/noearlyrationales, storagefail/retry/return, actualimage-load verification andnewdiagrams. Selectedscreenshots stored in browser/; see batch03-result.json.
- Focusedimage test PASS6enlarge/load/horizontal-pan/close checks on320and932widths;12screenshots generated,selectedexpandedphoneevidence retained. See batch03-zoom-result.json.
- Browser uses storage/safe-area/Royalbackdrop adapters. It does NOTcertify fullExpo navigation/backdrop, native devices orwhole-appstartupperformance. TwochangedTScomponents syntax-transpile PASS; JLPTbyte-lock10/10PASS. FullsemanticTypeScript, Expo build andrepositorylint remainunrun because the sparsecheckout lacks projectExpo/TypeScript dependencies andordinaryfull-appassets. Esbuild's missingexpo/tsconfig.base warning is recorded, nottreated as fullbuildsuccess.

## Remaining work

1. Finish remaining sourceknowledge/objectatomization andfullcurriculumallocation, with preciseprerequisites/common-foundation identity. Machineinventory andselectedfullvisualreadings do notmean completecurriculumcoverage.
2. Author remainingunits, mappedimages andweeklychecks; resolve sourceambiguities before affectedmaterial is taught.
3. Finish Indonesian missing42lessons/72questions andtheother9targetlanguages, then remainingnewcontent/UI/captions. No runtime translationAPI orsilentEnglishfallback.
4. Create10original official-format forms/specialty,30total; implement30true/false theory/40minutes +10practicalMCQ/40minutes, independentsectiontimers/thresholds. Four-choiceweeklychecks are not thisrunner.
5. RunfullExpo/type/lint/build andwhole-app/devicechecks in acompletecheckout. Preserve approvedJLPTUI, othersectors andexistingprogress.

Resume from progress.json, knowledge-matrix.json, page-object-inventory.json, batch03semantic/source/QA reports, course-manifest.json andvalidators. Wholecurriculum/release flags remainfalse. No backgroundworker is implied by thischeckpoint.
