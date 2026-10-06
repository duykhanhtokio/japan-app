# JLPT independent original authoring — 2026-10-06

This is the active checkpoint for the new authoring task. The historical recovery loop and JLPT_ACTIVE_PROGRESS.json do not authorize further transcription or recovery of original exams for this task.

## User decisions

- Current phase: create six complete original exams per level N5–N1 (30 total), superseding the previous 20-per-level phase scope.
- Complete and integrate N5 exam 01 first, then continue the six-per-level sequence without a draft-review gate. Publisher tests each completed exam directly in the app.
- Publisher/user is the final reviewer; no completed human/native review may be inferred from that designation.
- Retain approved UI and agreed N5 timing: vocabulary 20 minutes, grammar/reading 40 minutes, listening approximately 30 minutes.
- Use the current N5 catalog 第3回 as the count-per-type reference. UI indexing and registry identify it as n5-2013-07-exam-03.
- Keep promotion rule: six different new exams at a level scoring at least 80%.
- Old JLPT attempt/progress records need not be preserved. Remove old exams/resources from the app when the replacement collection is complete. Do not reset unrelated learning/game data or rewrite Git history under this authorization.
- Audio engine and four role voices selected on 2026-10-06; see src/data/jlpt-original/voice-casting.json. Image tooling and final release checks remain pending. No old recording or illustration may fill a missing new asset.

## Structural extraction only

Read metadata from written.candidate.json and listening.candidate.json with a script that outputs grouping/counts only. No old prompts, options, answers, passages, scripts, recordings, or illustrations are authoring inputs.

| Section | Problem | Count | Skill |
|---|---:|---:|---|
| vocabulary | 1 | 12 | kanji reading |
| vocabulary | 2 | 8 | orthography |
| vocabulary | 3 | 10 | contextual vocabulary |
| vocabulary | 4 | 5 | paraphrase |
| grammar_reading | 1 | 16 | grammar selection |
| grammar_reading | 2 | 5 | sentence ordering |
| grammar_reading | 3 | 5 | text grammar |
| grammar_reading | 4 | 3 | short reading |
| grammar_reading | 5 | 2 | medium reading |
| grammar_reading | 6 | 1 | information retrieval |
| listening | 1 | 7 | task comprehension |
| listening | 2 | 6 | key-point comprehension |
| listening | 3 | 5 | situational utterance |
| listening | 4 | 6 | quick response |

Totals: 35 vocabulary + 32 grammar/reading + 24 listening = 91 responses. All 67 written reference items have four choices. Do not infer listening choice counts from written metadata. Reference-count approval is not proof of current official item counts.

## Authoring contract and next action

Author from learning objectives and independently conceived situations/data/solution logic. Reject superficial edits to old items (names, locations, amounts, word order, synonym substitutions). Create fresh correct options, plausible distractors, and internal QA rationales. Detailed rationales/transcripts remain hidden in the approved V1 UI.

Use independent IDs (proposed jpapp-n5-original-01-v1) and independent session keys. Drafts must be labelled AI-created/unreviewed. Actual publisher review and actual listening playback checks must be recorded before release claims.

N5 pilot text master now contains 67 written items and 24 newly authored listening scripts, with objectives and option rationales. See src/data/jlpt-original/n5/01/master.ja.json and docs/jlpt-workspace/original/n5-01/PUBLISHER_REVIEW.md. Status: existing AI-authored draft, publisher has not reviewed it; complete integration before publisher testing under the updated workflow. Five new illustration briefs are present; actual images do not exist yet. Draft audio generation is complete (see the audio checkpoint below); illustration generation, runtime integration, legacy removal, and progress migration have not been performed. Next: AI editorial checks, rights-appropriate asset generation, complete audio/images and runtime integration with technical playback QA; publisher tests the completed exam afterward. After completing, integrating and durably saving exam 01, continue the next exam without waiting for draft review. Keep old content available only in the development state until the approved replacement gate; exclude it from the eventual production bundle/API/cache/fallback.

Do not initiate comparisons against old question content without separately confirming their purpose, scope, and separation with the user. Any ambiguity affecting counts, scoring, audio rights, or locked UI must be clarified rather than guessed.

## Approved audio casting — 2026-10-06

User explicitly restored the earlier student voice in place of audition 7 and requested all four roles be committed to source. Canonical configuration: `src/data/jlpt-original/voice-casting.json`; TypeScript exports: `src/data/jlpt-original/voice-casting.ts`. Audition numbers are positions in the 39-voice comparison, not engine speaker IDs.

| Role | Voice | Engine speaker ID | Audition number |
|---|---|---:|---:|
| Female student | 春日部つむぎ / ノーマル | 8 | Previously selected student voice |
| Adult female | 夜語トバリ / ノーマル | 118 | 37 |
| Young male | 玄野武宏 / ノーマル | 11 | 4 |
| Adult male | 剣崎雌雄 / ノーマル | 21 | 8 |

Use VOICEVOX 0.25.2, speedScale 0.9, mono 24000 Hz. Historical audition pauses were 1.2 seconds after the introduction, 0.5 seconds between dialogue turns, and 5 seconds for answering; they are not binding full-exam timing. This records publisher voice selection, not native pronunciation review, complete-exam audio approval, or runtime integration. もち子さん (audition 7, engine speaker ID 20) is excluded from production casting.

The configuration includes credits and per-voice terms links. Display required credits before release. Use only independently authored scripts; character artwork rights are separate. Check current terms and actual playback before release. Complete-exam audio acceptance, illustrations, credits UI and exam runtime integration remain future work.

## N5 pilot draft audio generation — 2026-10-06

Generated 24 per-item MP3s and one continuous draft under `assets/jlpt-original/n5/01/audio/`, using only original master scripts, new group instructions and the approved four-role casting. `src/data/jlpt-original/n5/01/audio.manifest.json` records role assignments, technical durations and SHA-256 for every output. `scripts/generate-jlpt-original-audio.py` reproduces the local VOICEVOX pipeline; its `--engine` path is explicitly supplied. Generated speech is local; no exam text is sent to a cloud TTS service.

Measured continuous duration: **726456 milliseconds = 726.456 seconds**, approximately 12m06s. Target: 1800000 milliseconds (30 minutes). **Target NOT met.** Do not pad silence or claim the pilot matches real-test pacing. Develop and review the independent listening content and reading/answer schedule before regenerating a final timed recording. The current 0.9 speed and brief audition pauses are draft settings, not a validated exam timing scheme.

All 11 items in groups 3–4 include three spoken options; groups 1–2 repeat the question after the dialogue. The five group-3 original illustration briefs still need newly created images. No legacy audio is used. Technical PCM/encoding/hash checks passed; actual hearing review, native pronunciation review, publisher review, final rights/credit review and runtime integration remain incomplete. `AUDIO_REVIEW.md` provides the review index.

Next: resolve the 12-minute-versus-30-minute listening shortfall, add the fixed one-minute musical intermission, create the five original illustrations, then complete playback QA and runtime integration; publisher tests afterward. Exam 02 follows completion/integration/persistence of exam 01; do not delete legacy content until the replacement gate.

## Mandatory authoring rules consolidated — 2026-10-06

Read `docs/jlpt-workspace/JLPT_ORIGINAL_AUTHORING_RULES.md` fully before all new JLPT content. User added strict anti-pattern answer positions, structure-aligned approximately 30-minute N5 listening and mid-listening rest. The 80 four-choice items balance 20 per answer position; the 11 three-choice items balance 4/4/3, without repeating cycles or three identical consecutive answers. Current data/validator need an answer-pattern audit; existing QA does not prove these new checks.

Mid-listening rest is now fixed on every level: after 問題２ and before 問題３, announce the rest, play exactly 60000 ms of soft instrumental music, announce resumption, then start 問題３. Use structural/timing-only reference analysis, never original scripts/answers/audio as authoring inputs. No new listening rewrite, pause value, answer shuffle, UI change or publisher approval is performed by this documentation-only checkpoint.

## Superseding publisher decisions — 2026-10-06 18:32 JST

The publisher explicitly updated the workflow: **six complete exams per level N5–N1, total 30**. Follow `JLPT_ORIGINAL_AUTHORING_RULES.md` version 2 and `JLPT_LEVEL_BLUEPRINTS.md`; machine-readable metadata is `src/data/jlpt-original/authoring-blueprints.json`. Earlier draft-review-before-integration/pilot-before-exam-02 gates and unknown-break instructions are superseded. Author complete usable Japan App exams, create needed images using imagegen, generate full audio, integrate and validate each exam, persist it, then continue. The publisher tests completed exams in the app and requests per-exam corrections. Human-review flags must remain truthful; no claim of official JLPT certification.

Every level has a publisher-defined intermission after the final response pause of listening problem 2 and before the instructions/examples of problem 3: spoken rest announcement, **exactly 60000ms soft instrumental music**, spoken resume announcement, then problem 3. Music must have suitable verified rights or be independently composed/synthesized. Count music and announcements inside that level's listening target by project implementation default; per-level targets remain 30/35/40/50/55 minutes for N5/N4/N3/N2/N1. This is app design, not a claim about an official JLPT intermission.

Detailed count-per-type metadata uses the existing 第3回 at each level; only grouping/cardinality was extracted. N5 totals 91; N4 98; N3 102; N2 106; N1 106 response units. Several legacy sources are candidate/unverified: these are project structural references, not certified fixed counts of current official exams. No legacy question/audio/image content was used as new authoring input.

This commit updates instructions and blueprint only. The existing 12m06s N5 audio has not been rebuilt, the music and five images have not yet been generated, and the new exam is not yet integrated. Next: complete N5 exam 01 against these rules, then advance after full per-exam integration and persistence.

## Consolidated single contract — 2026-10-06

Version 3 of `JLPT_ORIGINAL_AUTHORING_RULES.md` is the sole complete content-authoring contract, including all N5–N1 tables. `JLPT_LEVEL_BLUEPRINTS.md` now redirects there. Source URLs are metadata-only; linked PDFs, scripts, answers, illustrations and recordings are excluded from authoring inputs. Historical checkpoint instructions never override the current contract. This update changes guidance only, not generated exam assets or runtime integration.

## Authoring resumed under version 3 — 2026-10-06

Every new JLPT authoring session must reread the entire current contract; AGENTS and session startup now say this explicitly. N5 exam 01 now has five independently generated imagegen assets (visually inspected, manifests mapped), balanced answer positions (four-choice 20/20/20/20; three-choice 4/4/3), no full-sequence triple repetition, and no period 2–4 repeated three times. Two weak listening distractors were corrected. All 24 recordings were regenerated to synchronize spoken option order. The original instrumental rest decodes to exactly 1440000 frames at 24000 Hz, correctly between problem 2 and problem 3 with announcements.

Current measured listening duration is 796387 ms, approximately 13m16s, NOT 30 minutes. Current assets are work in progress, not a finished exam. No registry integration, legacy deletion or human approval occurred. Continue developing natural N5 listening and verified preparation/answer timing; do not use silence to pad. The current metadata blueprint contains counts and total targets but lacks detailed reference timing/example metadata. Under contract section 3.1, any additional isolated analysis of legacy recordings requires confirmation of scope; no old audio/transcript content has been read into the authoring context. Preserve all valid authored content/assets.

## Authorized metadata-only reference analysis — 2026-10-06

Publisher confirmed isolated analysis of N5 第3回 audio, no content extraction/reuse. `scripts/analyze-jlpt-n5-reference-timing.py` uses ffprobe/FFmpeg locally, no ASR/transcription, playback, audio clip export or cloud upload. Report: `original/n5-01/reference-timing.metadata.json`; Vietnamese findings: `original/n5-01/REFERENCE_TIMING_ANALYSIS.md`. Whitelisted existing grouping/timing fields and numeric signal metrics only. Source hash remains unchanged. Container duration 1779435 ms; median candidate windows for problems 1–4 are 63900/63050/36460/30310 ms. Problem-2 final window (123620 ms) is an outlier; candidate boundaries are not semantic certification.

`original/n5-01/listening-timing.plan.json` gives an independent aggregate 1800000 ms budget including the 60000 ms music and announcements. It is not proof of actual duration. Signal-only analysis cannot certify instruction/example counts or the purpose of every quiet interval. Do not copy per-item source timing or insert long silence/repeated examples to consume budgets. Current authored audio remains 796387 ms, unchanged by this analysis; full-duration development and runtime integration remain unfinished. No need to ask again for the same authorized metadata-only N5 timing analysis.

## Superseding formal request, version 4 — 2026-10-06 19:28 JST

Publisher supplied a revised written request and instructed replacing the official source/GitHub contract. Version 4 of `JLPT_ORIGINAL_AUTHORING_RULES.md` is authoritative. Priority: finish and integrate all 30 complete exams (six each N5–N1), then publisher tests the whole collection and reports per-exam corrections. A contradictory pilot-review sentence in the supplied working text is resolved in favor of its explicit final section 14 and the earlier no-draft instruction; no pilot gate is restored. AI still checks/fixes known issues before integration.

Five 第3回 structure tables, metadata-only source restrictions, imagegen requirement, four voices, exact 60000ms musical break and truthful flags remain in the single contract. Fixed ±60s tolerance is removed: acceptance tolerance remains unconfirmed. Audition pauses are not final standards; present the timing table and confirm unresolved details before changing them. The authorized isolated N5 timing analysis remains valid. Historical per-exam publisher-review wording is superseded. This update changes the contract and matching machine policy only; exam content/audio/integration status is unchanged.

Supplied text SHA-256: 11d40fdeb9c83a33fdb8650416f215cd2a155bb219b9b29e17c1566c4e668b70

## 2026-10-06 — Bắt buộc đọc đồng thời quy tắc và cấu trúc

Đã lưu đầy đủ bản `JLPT_LEVEL_BLUEPRINTS.md` nhà phát hành gửi, thay bản chuyển hướng. Quy tắc chính phiên bản 5 và bản cấu trúc đều bắt buộc đọc toàn bộ ở đầu mỗi phiên, cùng `docs/AI_SESSION_START_HERE.md` và `AGENTS.md`; trí nhớ hoặc đọc một bản không đủ. Đồng bộ yêu cầu trong các điểm vào phiên và JSON. Giữ nguyên bảng cấu trúc, giới hạn metadata, 6 đề/cấp, giọng và nghỉ 60 giây; không bổ sung quyền lấy nội dung đề gốc. Mâu thuẫn có ảnh hưởng phải xác nhận, không tự đoán. Thay đổi này chỉ cập nhật tài liệu và metadata, không tạo đề hoặc audio mới.

SHA-256 tệp cấu trúc nhà phát hành gửi: `053a4c3093a716170bf1a11a01fcd8fcc4151571a43439b8b530628afe3462b0`.
