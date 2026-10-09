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

## 2026-10-06 — Bắt đầu nội dung chính thức, hoàn thiện phần viết N5 01

Đã đọc lại các hướng dẫn bắt buộc phiên bản 5 và cấu trúc N5–N1. Tiếp tục master độc lập hiện có thay vì lấy nội dung đề gốc. Bổ sung ngữ cảnh hiển thị cho 20 câu đọc/viết chữ (đặc biệt 何人 cần ngữ cảnh đếm người); sửa phương án nhiễu ở 7 câu để bỏ dạng từ tùy tiện hoặc kết hợp phi lý. Giữ nguyên ID, số câu và vị trí đáp án. Toàn bộ 24 câu nghe, scripts và thứ tự lựa chọn không đổi; master provenance hash trong manifest được cập nhật cho thay đổi phần viết, không giả nhận đã tạo audio mới.

Đã chuẩn bị `src/data/jlpt-original/n5/01/formal-trial.ts`: ánh xạ 91 câu vào kiểu runner hiện có, đủ ngữ cảnh chữ, đoạn đọc, dấu sao, 5 ảnh thật, ẩn nội dung lựa chọn chỉ nghe và transcript. Adapter chưa đăng ký vào catalog; không nạp audio 13m16s như đề hoàn chỉnh. Registry và UI khóa giữ nguyên. Validator cấu trúc và thực thi adapter PASS; UI lock 10/10 PASS. TypeScript đầy đủ chưa chạy thành công do workspace thiếu dependency TypeScript; không nhận đã typecheck hoặc test thiết bị.

Nhà phát hành chọn **xác minh cấu trúc mẫu trước**, chưa chọn phương án thiết kế một ví dụ mỗi dạng hay lịch pause đề xuất. Bộ trích mới chỉ xuất nhãn/số lượng từ hồ sơ nguồn, lưu `reference-structure.metadata.json`. Các nhãn OCR chưa kiểm chứng không đủ chứng minh số ví dụ/số lượt phát hoặc vai trò khoảng nghỉ; các trường này vẫn null. Phân tích tín hiệu được phép trước đó cũng không chứng minh ngữ nghĩa. Không đổi pause, speed, thêm ví dụ/lặp audio hoặc bù phút bằng im lặng. Mục tiêu 30 phút, nghỉ nhạc đúng 60s và bốn giọng đã chốt giữ nguyên.

Sự cố đã báo nhà phát hành: một lệnh kiểm tra đã in toàn bộ source packet, vô tình đưa một phần nội dung cũ vào ngữ cảnh. Sau đó không soạn tình huống/kịch bản/câu mới trong ngữ cảnh này; chỉ kiểm tra/chỉnh phần dữ liệu đã soạn độc lập và chuẩn bị adapter. Bộ trích sau chỉ xuất metadata theo whitelist. Phiên soạn mới tiếp theo phải có ngữ cảnh chỉ chứa hướng dẫn, master độc lập và metadata; không mang nội dung cũ bị in nhầm vào đầu vào.

Phần chưa xong: xác minh riêng tổ chức ví dụ/nhịp chuẩn bị–trả lời để hoàn thiện audio N5, dựng/đo/nghe bản đầy đủ rồi tích hợp và test app. Không chuyển sang đề 02 khi đề 01 chưa đạt gate đầy đủ; không chờ duyệt nháp của nhà phát hành. Không có cờ human/native/perceptual/release nào được bật. Quy mô vẫn 30 đề.

## 2026-10-06 — Sửa nội dung nghe theo ngân sách từng câu

Người dùng yêu cầu thực hiện sửa nội dung để bám thời lượng câu theo dạng của mẫu. Đã chỉnh trực tiếp 24 kịch bản độc lập đã có trong master; giữ nguyên tình huống Japan App, ID, đáp án và vị trí lựa chọn. Mở rộng 問題１–２ bằng diễn biến/dữ kiện liên quan, hoàn thiện mô tả tình huống 問題３ và lời phát ngôn 問題４. Tạo lại toàn bộ 24 MP3 và bản nghe liên tục bằng engine local và bốn giọng đã chốt, speedScale 0.9. Sau đo lần đầu đã rút gọn ba câu 問題２ và chỉnh lời phát ngôn 問題４, rồi tạo lại để sát ngân sách. Không đọc dữ liệu câu hỏi/lời thoại/đáp án nguồn trong lượt sửa này; chỉ dùng master độc lập và metadata tổng hợp đã có.

Ngân sách 24 câu: 1200000 ms. Đo thực tế: **1190850 ms = 19 phút 50.850 giây**. Theo dạng: 問題１ 452496 ms / 問題２ 371744 ms / 問題３ 181477 ms / 問題４ 185133 ms. Trung vị câu lần lượt 63.947 / 61.852 / 35.355 / 30.446 giây; tham chiếu metadata trung vị 63.90 / 63.05 / 36.46 / 30.31 giây, không dùng ánh xạ từng câu nguồn. Mục tiêu từng câu và biên ±15% chỉ là công cụ chỉnh nội dung nội bộ, không phải tolerance nghiệm thu nhà phát hành.

Bản nghe liên tục mới: **1307467 ms ≈ 21 phút 47 giây**, trước đó 796387 ms. Còn thiếu **492533 ms ≈ 8 phút 13 giây** so với 1800000 ms. Các câu chấm điểm đã gần ngân sách 20 phút; khối hướng dẫn/ví dụ/chuyển dạng chưa xác minh đủ là phần còn thiếu. Không tự thêm một ví dụ mỗi dạng, phát lại thoại, kéo tốc độ hoặc bù khoảng thiếu bằng im lặng. Pause thử vẫn 1.2/.5/5 giây, chưa coi là nhịp thi cuối. Đoạn nghỉ nhạc 60 giây và hai thông báo giữ nguyên. Các thông số tổ chức chưa xác minh vẫn null/unverified.

Báo cáo: `original/n5-01/LISTENING_DURATION_REVISION.md`, `listening-duration-audit.json`. Kiểm tra: `scripts/check-jlpt-original-n5-01-timing.mjs` xác minh toàn bộ PCM decoded duration, script/option order, music 1440000 frame; validator cấu trúc và UI lock 10/10 PASS. Master/QA/manifest/audit hash đồng bộ. Chưa có kiểm duyệt nghe thực tế/người bản ngữ/phát hành hoặc runtime integration; chưa chuyển đề 02, chưa xóa đề cũ. Bước tiếp theo cần xác minh tổ chức hướng dẫn/ví dụ và nhịp làm bài trong luồng phân tích tách khỏi tác giả, chỉ trả metadata; không hỏi lại quyền phân tích tín hiệu N5 đã cấp.

## 2026-10-06 — Kiểm tra cấu trúc bằng AI phân tích riêng

Người dùng đã cho phép AI phân tích riêng, chỉ trả metadata cấu trúc/thời gian. Báo cáo `original/n5-01/reference-semantic-verification.metadata.json` ghi rõ chưa xác minh: môi trường không có công cụ nghe/ASR cục bộ; thử truy cập cấu hình model cục bộ từ Hugging Face bị timeout sau 10 giây (không gửi audio). OCR nội bộ chỉ cho metadata tổ chức candidate, không chứng minh số ví dụ/lượt phát hoặc vai trò/thời lượng pause. Các trường ngữ nghĩa vẫn null; không đưa lời thoại/câu hỏi/đáp án nguồn về ngữ cảnh tác giả. Không sửa đề/audio, không thêm ví dụ hoặc pause. Bản mới vẫn 1307467 ms, chưa đạt 30 phút. Cần khả năng nghe/phân tích cục bộ hoặc bảng chú thích cấu trúc do người nghe xác nhận; không tự coi dữ liệu chưa xác minh là chuẩn.

## 2026-10-06 — Đã cài công cụ ASR cục bộ được nhà phát hành cho phép

Người dùng cho phép cài công cụ miễn phí. Đã cài faster-whisper 1.2.1 trong môi trường xử lý Linux của AI, tải model Systran/faster-whisper-small (bốn file) và khởi động CPU int8 thành công, effective compute type int8_float32. Không cài lên MacBook người dùng, không đưa dependency/model vào app, không dùng API trả phí hoặc gửi audio nguồn tới dịch vụ ngoài. Các file model/tool là môi trường tạm; chỉ lưu hướng dẫn tái tạo, hash và kết quả metadata vào Git.

AI phân tích riêng đã chạy ASR cục bộ trên các cửa sổ hướng dẫn và câu đại diện. Kết quả là ASR candidate, không phải human/perceptual approval; nguồn chữ/lời thoại không được xuất về ngữ cảnh tác giả hoặc lưu vào repo. Bản nghe mới và nhịp nghỉ thử chưa thay đổi. Trước khi sửa 1.2/.5/5 giây thành lịch cuối, phải trình bảng nhịp và xác nhận theo quy tắc đã chốt. Không tự suy ra toàn bộ 492533 ms còn thiếu là hướng dẫn/ví dụ.

Kết quả luồng riêng: mỗi 問題１–４ có một ví dụ trong cửa sổ hướng dẫn đã nhận dạng; phần mở đầu có một khối kiểm tra âm thanh riêng. Đây là ASR candidate có bằng chứng câu báo luyện/ví dụ và phần hướng dẫn đánh dấu, không phải kiểm duyệt nghe con người. Câu đại diện mỗi dạng có khoảng tín hiệu thấp sau phần trả lời lần lượt 12174/12184/10190/8190 ms; lead-in 2045/2055/2020/2040 ms. Đề xuất thiết kế độc lập làm tròn 2000 ms lead-in, 12000/12000/10000/8000 ms trả lời, **chưa được nhà phát hành chốt**, chưa sửa cấu hình 1.2/.5/5 giây. Số lượt phát lại toàn bộ câu chấm điểm của cả nguồn vẫn null vì chưa nhận dạng hết nguồn; ví dụ/câu đại diện không có phát lại toàn thoại, việc nhắc câu hỏi không phải phát lại thoại.

Cửa sổ cuối 問題２ chứa chuyển nghỉ/tiếp tục (candidate), không được lấy 123620 ms làm độ dài câu. Biên candidate câu 5 問題４ lệch 11100 ms so với nhãn ASR; ghi anomaly, không sửa nguồn. Không suy ra nhạc nghỉ nguồn là nhạc chuẩn hoặc đúng một phút. Quy định app về nhạc 60000 ms giữ nguyên. Hướng dẫn tái tạo: `original/n5-01/LOCAL_ASR_SETUP.md`; script phân tích riêng: `scripts/analyze-jlpt-n5-reference-structure-local-asr.py`. Dữ liệu nhận dạng riêng đã xóa sau khi phân loại, không lưu transcript trong repo. Kiểm tra JSON/script syntax/UI lock đạt; đề/audio hiện tại không thay đổi, chưa tích hợp hoặc đạt 30 phút. Bước tiếp theo: nhà phát hành xác nhận bảng nhịp đề xuất rồi soạn hướng dẫn/ví dụ độc lập, hiệu chỉnh/đo audio đầy đủ.

## 2026-10-06 — Nhà phát hành chốt nhịp N5; hoàn thiện tổ chức và đăng ký đề 01

Người dùng chốt bảng nhịp đề xuất: sau giới thiệu 2 giây, giữa lượt thoại 0.5 giây; trả lời 問題１/２/３/４ lần lượt 12/12/10/8 giây. Lưu override N5 vào voice-casting và blueprint, đồng bộ hai hướng dẫn. Không áp dụng tự động cho N4–N1; giữ speedScale 0.9 và bốn giọng đã chốt. ASR metadata vẫn là candidate; quyết định này là thiết kế nhà phát hành, không chứng nhận nguồn hoặc kiểm duyệt bản ngữ.

Đã soạn độc lập phần kiểm tra âm thanh, hướng dẫn, bốn ví dụ không tính điểm, lời giải ví dụ, chuyển dạng và kết thúc; không đưa nội dung nguồn vào đầu vào soạn. Giữ nguyên 24 kịch bản chấm điểm và lựa chọn đã soạn độc lập. Tạo ảnh bằng imagegen: bảng hai khung thư viện cho ví dụ và thử giày cho câu 1 問題３; chỉ tham chiếu ảnh độc lập của Japan App. Ví dụ không yêu cầu bấm đáp án của câu chấm điểm.

Audio liên tục đo PCM: **1809729 ms = 30 phút 09.729 giây**, 24 câu chấm điểm 1344050 ms, bốn ví dụ ngoài số câu chấm điểm. Sau 問題２ có báo nghỉ, nhạc gốc đúng 60000 ms/1440000 frame, báo tiếp tục rồi hướng dẫn 問題３. Đánh dấu gần mục tiêu khoảng 30 phút theo đánh giá biên tập; không suy ra tolerance cố định hoặc đủ đúng 1800000 ms. Không kéo dài bằng im lặng ngoài nhịp được chốt, không phát lại toàn thoại.

Đăng ký có điều kiện đề mới N5 ở đầu danh sách qua adapter hiện có: 91 câu, 5 hình, lựa chọn chỉ nghe và transcript được ẩn. Giữ UI khóa và toàn bộ đề cũ tới khi hoàn thành bộ thay thế. Cấu trúc/đáp án, adapter chạy Node, PCM timing/music và UI lock đạt kiểm tra. Chưa chạy TypeScript đầy đủ hoặc app trên thiết bị; chưa nghe kiểm duyệt toàn bài, chưa có human/native/perceptual/rights/release approval. Đây là hoàn thành tổ chức/audio và đăng ký dữ liệu, không phải hoàn thành cả bộ 30 đề hoặc chứng nhận chất lượng phát hành. Bước kế tiếp là kiểm tra kỹ thuật runtime N5 01 và tiếp tục các đề theo hướng dẫn đã chốt, không tạo thêm cổng duyệt nháp.

## 2026-10-06 — Kiểm tra tiếp N5 01 và sửa mốc phát đầu bài

Đã khôi phục clone nhánh bắt buộc từ GitHub và xác minh HEAD trước sửa bằng WORK PERSISTENCE PASS. Đọc đầy đủ hướng dẫn chính phiên bản 5, blueprint, cấu hình giọng và checkpoint; không mở nội dung đề gốc. Kiểm tra lại cấu trúc/đáp án, adapter, hash ảnh/audio, PCM: 91 câu, 5 ảnh, audio 1809729ms, nhạc đúng 60000ms đều PASS.

Phát hiện runner dùng getJlptListeningStart(exam.id), nhưng đề mới chưa có override nên rơi vào default 6500ms, cắt lời mở đầu. Thêm duy nhất jpapp-n5-original-01-v1: 0 vào bảng mốc phát; không đổi service/runner hay 49 mốc đã chốt. Thực thi service trong validator để xác minh 0ms và fallback 6500ms. Bỏ câu hướng dẫn luyện tập bị lặp ở 問題４ và cập nhật chú thích adapter. Không đổi câu chấm điểm, thứ tự đáp án, hình, kịch bản hay audio. Khóa UI 10/10, adapter và guard 49 mốc đều PASS sau sửa.

Cài dependency theo package-lock trong môi trường AI rồi chạy TypeScript dự án thật: một lỗi TS2352 có sẵn tại src/services/life-content-repository.ts:47, do record SC-HKD-HAKODATE-001 thiếu type bắt buộc. Không có diagnostic JLPT nhưng không nhận toàn dự án PASS; không tự sửa dữ liệu hội thoại trong công việc đề thi.

Chuẩn bị scripts/check-jlpt-original-n5-01-browser-audio.cjs để kiểm tra Chromium phát từ đầu, pause/resume, chạy qua cuối đoạn nhạc và decode năm ảnh. Script chỉ được kiểm tra cú pháp: browser hiện có là file rỗng, launch thất bại; tải browser trả ZIP rỗng/hỏng. Chưa có browser/native/full-app/perceptual approval. Dependency vừa cài đã được dọn riêng sau typecheck để giải phóng khoảng 510MiB; không xóa dữ liệu người dùng hoặc công việc phiên khác.

Bước tiếp theo vẫn là xác minh runner trên môi trường có browser/Expo hoạt động: chọn N5 mới, bắt đầu, trả lời, Back/resume, phát từ 0, pause/resume, nộp và kiểm tra kết quả. Chưa bắt đầu N5 02 vì gate runtime N5 01 chưa hoàn thành; không yêu cầu duyệt nháp và không tự bật cờ con người. Trở ngại là browser/runtime của môi trường, không phải thiếu quyền soạn. Tất cả 30 đề chưa hoàn thành.

## 2026-10-06 — Gỡ trở ngại Chromium, kiểm tra runner web N5 01

Đã dùng Chromium từ gói npm @sparticuz/chromium trong môi trường QA riêng; không cài lên MacBook người dùng hoặc đưa công cụ này vào app. Cần vô hiệu hóa chown của bộ giải nén trong môi trường sandbox. Kiểm tra browser audio thật PASS: MP3 decode 1809729ms, bắt đầu từ 0, pause/resume, chạy liên tục qua cuối đoạn nhạc và decode đủ năm ảnh. Không đồng nghĩa nghe duyệt bằng tai.

Đã dựng harness web tách riêng từ nguyên vẹn N1OfficialTrial.tsx, JlptExamUI và adapter N5 hiện hành, cùng React 19.1.0, react-native-web 0.21.2, Expo audio/asset/image và AsyncStorage thật. Harness cung cấp focus=true và context backdrop; không thay logic làm bài, chấm điểm, lưu bài, audio hoặc file UI khóa. Entry chỉ đưa đề mới vào runner, không dựng toàn bộ Expo Router/catalog của app. PASS: mở/bắt đầu, chọn đáp án và lưu session độc lập, phát audio đầu bài, Back/reopen/khôi phục lựa chọn và màu chọn, xác nhận nộp bài thiếu, kết quả 0 đúng/1 sai/90 chưa trả lời trên 91 câu, mở review; không có pageerror.

Ảnh chụp web 430x932 của màn làm bài và kết quả đã kiểm tra trực quan, dùng font NotoSansJP có SHA trùng LFS trong repo. Bằng chứng tại original/n5-01/runtime-2026-10-06/. Không nhận native/iPhone/full-router approval; full TypeScript vẫn có lỗi hội thoại đã ghi trước. Human/native/perceptual/rights/release flags giữ false. Trở ngại kiểm tra kỹ thuật runner đã được xử lý ở phạm vi web này; sau lưu bền vững, tiếp tục soạn N5 02, không tạo cổng duyệt nháp.

## 2026-10-06 — N5 02 tiếp tục biên tập và tổ chức nghe

Tiếp tục từ bộ 91 câu và 5 hình độc lập chưa commit của phiên trước; giữ bản làm việc cũ nguyên vẹn, dùng checkout riêng từ HEAD remote đã xác minh. Soạn mới mở đầu, kiểm tra âm thanh, hướng dẫn bốn dạng, bốn ví dụ ngoài điểm, giải ví dụ, chuyển dạng và kết thúc. Ví dụ 問題３ đặt trong khung cafe bên trái của hình mới hiện có, câu chấm điểm dùng khung tàu bên phải; không tạo yêu cầu hình chưa tồn tại. Sửa lỗi thể động từ ở vocabulary 3-04, thay câu sắp xếp grammar 2-05 để bỏ nhiều cách gắn の, sửa nhiễu nghe 4-01 và 4-06. ID, đáp án và quota giữ nguyên.

Còn thiếu audio/tích hợp N5 02. Môi trường chỉ còn khoảng 50 MiB và engine VOICEVOX từng dùng không còn tìm thấy trong /opt, /root, /workspace. Không dùng audio N5 01 hoặc nguồn cũ thay thế, không ghi audio đủ thời lượng hoặc đã tích hợp. Phần tiếp theo: dọn tài nguyên tạm tái tạo được, khôi phục engine miễn phí đã được cho phép, thu và đo audio rồi tích hợp. Chi tiết và hash: original/n5-02/EDITORIAL_PROGRESS.json.

## 2026-10-06 — Hoàn thiện N5 02, đo audio và kiểm tra runner web

Tiếp tục 91 câu đã soạn, không dùng nội dung đề gốc. AI rà soát phần viết/đọc, sửa câu giờ mở cửa và diễn đạt chưa hoàn tất; sửa lời cảm ơn thời gian mới và cách nói tắt điện thoại. Dựng năm hình câu hỏi và một hình luyện tập bằng imagegen, gồm bảng PRACTICE / QUESTION 1 dùng hai cảnh độc lập. Bốn ví dụ không tính điểm, hướng dẫn, đáp án ví dụ và nhạc được tổ chức riêng; giữ bốn giọng, speedScale 0.9, nhịp 2/.5 giây và trả lời 12/12/10/8 giây.

Bản đầu đo 33:10.013; rút thông tin lặp trong 13 câu dạng 1–2, giữ tình huống/dữ kiện cần để chọn đáp án. Bản cuối generation PCM 1824001ms; sau decode MP3 là **1824002ms = 30:24.002**, cập nhật manifest theo decode. Chênh 1ms đã xử lý, không nới kiểm tra. Nhạc decode đúng 1440000 frame ở 24000Hz = 60000ms, sau 問題２ và trước hướng dẫn 問題３; phát tự tiếp tục. Đánh giá biên tập khoảng 30 phút; không đặt tolerance nghiệm thu cố định. Không kéo tốc độ, không thêm im lặng bù phút hoặc lặp thoại. Phân bố đáp án 20/20/20/20 cho 80 câu bốn lựa chọn, 4/3/4 cho 11 câu ba lựa chọn; không có ba vị trí liên tiếp hay chu kỳ ngắn lặp ba lần.

Đăng ký jpapp-n5-original-02-v1 bằng adapter tương thích UI khóa; session độc lập và mốc phát 0ms. Cấu trúc, hash, PCM/scripts/thứ tự lựa chọn, adapter và khóa UI được kiểm tra. Chromium phát từ đầu, pause/resume, qua cuối nhạc, decode năm hình PASS. Harness dùng nguyên vẹn production runner/shared UI, RN-web, Expo audio/asset/image và AsyncStorage: chọn/lưu một đáp án; phát audio mở đầu; Back/mở lại/resume; xác nhận nộp thiếu; kết quả 0 đúng/1 sai/90 chưa trả lời trên 91; review PASS, không pageerror. Bằng chứng ở original/n5-02/runtime-2026-10-06/. Ảnh 430x932 đã xem. Font QA dùng NotoSansJP của Google Fonts, không thay font nguồn trong commit. Harness không dựng toàn bộ Expo Router/catalog; không nhận native/iPhone hoặc full TypeScript approval.

Phát hiện clone phiên khác đang có thay đổi cùng đề 02, nên kiểm tra và hoàn thiện trong checkout riêng, không ghi đè dữ liệu chưa lưu của phiên kia. Chỉ commit bộ N5 02, adapter/đăng ký/mốc phát, công cụ audio tổng quát và checkpoint; giữ UI, đề cũ và công việc game/hội thoại. Các cờ human/native/perceptual/rights/release giữ false. Lưu bền vững phải push/fetch và WORK PERSISTENCE PASS; không dùng commit local làm chứng cứ. Sau gate lưu bền vững, điểm soạn kế tiếp N5 03. Không có cổng duyệt nháp; còn 28 đề trong phạm vi 30 đề đã chốt.

### Xuất âm thanh để lưu qua kết nối GitHub

Kết nối GitHub giới hạn request 16MiB; audio liên tục được xuất lại trực tiếp từ PCM gốc bằng MP3 mono 24kHz/48kbps (không chuyển mã từ MP3 cũ). Thời gian decode vẫn 1824002ms; 24 tệp câu hỏi và nhạc giữ 96kbps. Kiểm tra lại hash, PCM và phát audio Chromium trước lưu; không bật perceptual approval. Checkout mới dùng Git thông thường và kiểm tra connectivity, không sử dụng commit tạm được tạo bằng --missing-ok.

Bản cập nhật từ phiên khác là một bộ 91 câu độc lập khác dùng cùng ID, không chỉ vài sửa câu. Đã bảo toàn snapshot đầy đủ tại original/n5-02/previous-draft-ac47373/ và trong lịch sử Git; bản tích hợp dùng nhất quán master/audio/hình đã kiểm tra trong phiên này, không ghép các kịch bản khác nhau.

## 2026-10-06 — Hoàn thiện N5 02, tích hợp và kiểm tra runner web

Sau WORK PERSISTENCE PASS của N5 01, soạn độc lập N5 02: 35 câu từ vựng, 32 câu ngữ pháp/đọc hiểu, 24 câu nghe (91 tổng); bảy bài đọc, đáp án và giải thích nội bộ. Không dùng nội dung câu hỏi/kịch bản/ảnh/audio đề nguồn làm đầu vào. Kiểm tra biên tập AI và sửa câu giờ mở cửa, lời mời, diễn đạt bài tập chưa xong, chuỗi sắp xếp; đơn giản hóa vài cấu trúc phần đọc và sửa cách nói tắt nguồn điện thoại. Hoán vị theo quota: bốn lựa chọn 20/20/20/20, ba lựa chọn 4/3/4 (đổi vị trí thiếu so với đề 01), không ba đáp án giống liên tiếp hoặc chu kỳ ngắn lặp ba lần.

Tạo mới năm hình bằng imagegen cho tình huống: găng tay rơi, trả tiền ở tiệm bánh, mở cửa giúp người mang hộp, tóc mới và xin chỗ ngồi. Bảng đầu có hình luyện tập ở nhà bạn bên trái; lời dẫn luyện tập hỏi vị trí nhà vệ sinh đã đồng bộ với cảnh và không có biển chỉ đáp án. Bốn ví dụ không tính điểm, lời hướng dẫn/kiểm tra âm thanh và kết thúc được soạn mới. Bốn giọng đã chốt, speedScale 0.9, nhịp N5 2/.5 giây và 12/12/10/8 giây trả lời.

Bản thu đầy đủ đầu tiên 1880072ms (31:20.072). Bỏ các lượt xác nhận lặp/thông tin sau nhiệm vụ, giữ dữ kiện quyết định đáp án và các khoảng nghỉ đã duyệt; thu lại. Bản cuối đo PCM và MP3 decode **1811532ms = 30 phút 11.532 giây**, lệch mốc danh nghĩa +11532ms. Đây là đánh giá biên tập gần 30 phút, không phải tolerance cố định được nhà phát hành duyệt. Nhạc không lời mới dùng dãy hợp âm riêng, hash khác đề 01; đúng 60000ms/1440000 frame, hai thông báo nghỉ/tiếp tục đúng vị trí trước 問題３. Không tăng tốc/đổi pause/thêm im lặng bù giờ hoặc phát lại hội thoại. Ngân sách và sửa thời lượng tại original/n5-02/TIMING_PLAN.md và duration-revision.json.

Tích hợp qua adapter tương thích, session key jlpt:jpapp:n5:original:02:v1, registry có điều kiện và override audio từ 0ms. PASS: cấu trúc/đáp án, adapter chạy Node, toàn bộ script/option/audio/image hash, giải mã thời lượng, guard 49 mốc và UI lock 10/10. Browser audio thật PASS. Runner production không sửa được chạy trong harness RN-web tách riêng với Expo audio/asset/image và AsyncStorage thật: mở/bắt đầu, chọn/lưu, phát từ đầu, Back/reopen/resume, nộp thiếu, kết quả 0 đúng/1 sai/90 chưa trả lời trên 91 câu, mở review; không pageerror. Hai screenshot 430x932 đã kiểm tra trực quan. Bằng chứng original/n5-02/runtime-2026-10-06/. Không nhận full-router/native/iPhone approval. Không chạy lại full TypeScript của dự án cho đề 02; lần trước lỗi TS2352 dữ liệu hội thoại vẫn được ghi riêng.

Tiến độ: **2/30 đề đã tích hợp và kiểm tra kỹ thuật web trong phạm vi trên (N5 01–02)**. Human/native/perceptual/rights/release flags giữ false; chưa xóa đề/tài nguyên cũ khi bộ thay thế chưa đủ. Sau commit/push/fetch và WORK PERSISTENCE PASS của đơn vị này, tiếp tục N5 03, không chờ duyệt nháp.

Ghi chú vận chuyển N5 02: connector GitHub có giới hạn body 16 MiB; MP3 liên tục 96 kbps không gửi được. Xuất lại trực tiếp từ PCM ghép ở 48 kbps mono 24000 Hz, không đổi nội dung/giọng/speed/pause/thời lượng; 24 bản từng câu vẫn 96 kbps. Entry point N5 02 ghi tham số này để tái tạo. Giải mã và playback bản mã hóa mới được kiểm tra lại; không nhận duyệt chất lượng âm thanh bằng tai.

Hợp nhất đồng thời: nhánh từ xa có commit ac473732 lưu một bản nháp độc lập khác dùng ID N5 02 trong khi hoàn thiện kỹ thuật ở phiên này. Giữ nguyên toàn bộ 12 file của bản đó tại original/n5-02/concurrent-draft-ac473732/ cùng manifest snapshot; giữ ghi chú tiến độ trước đó. EDITORIAL_PROGRESS.json/validation.json ở thư mục gốc được đánh dấu là snapshot lịch sử và trỏ trạng thái hiện hành sang qa.json. Bản đang tích hợp là bộ 91 câu/hình/audio đã kiểm tra ở trên. Bản nháp độc lập chưa dùng trong app được giữ để có thể phân bổ cho N5 03 sau WORK PERSISTENCE PASS và kiểm tra biên tập, thay vì bỏ nội dung đã soạn. Commit hoàn thiện là fast-forward từ nhánh hiện hành, không sửa lịch sử.

Trong lúc hợp nhất, nhánh tiếp tục có b27fc9d1 hoàn thiện một biến thể cùng nội dung N5 02 (1824002ms). Giữ đúng file của biến thể đó tại original/n5-02/concurrent-complete-b27fc9d1/; source TypeScript lưu đuôi .txt để không trở thành mã app. Không đếm/tái dùng biến thể trùng nội dung thành đề mới. Giữ toàn bộ bổ sung trên nhánh; bản hiện hành dùng các chỉnh sửa tiếng Nhật/phần đọc và nhịp kết thúc đã kiểm tra của phiên này, 1811532ms. Audit thời lượng/timing plan/handoff đồng bộ lại với QA hiện hành. Bản nháp khác ac473732 chưa dùng mới là ứng viên có thể phân bổ đề kế tiếp sau kiểm tra.

## 2026-10-07 — Hoàn thiện và tích hợp N5 03

Đọc lại các hướng dẫn bắt buộc, blueprint, checkpoint và cấu hình giọng; fetch nhánh bắt buộc và xác minh WORK PERSISTENCE PASS trước làm việc. Tiếp tục bộ nháp độc lập chưa dùng tại concurrent-draft-ac473732, giữ nguyên snapshot. Không đọc nội dung câu hỏi/kịch bản/hình/audio đề JLPT gốc. Gán ID và session riêng cho jpapp-n5-original-03-v1; sửa câu sắp xếp nhiều nghiệm, nhiễu ngữ pháp, ngữ cảnh quá khứ phủ định, cách diễn đạt khoảng cách và vai người nói. Đủ 67 câu viết + 24 câu nghe, bốn ví dụ không tính điểm và năm hình imagegen độc lập đã kiểm tra. Quota bốn lựa chọn 20/20/20/20; ba lựa chọn 3/4/4, luân chuyển vị trí thiếu; không ba đáp án giống liên tiếp hoặc chu kỳ ngắn lặp ba lần.

Thu mới bằng VOICEVOX 0.25.2 và bốn giọng đã chốt, speedScale 0.9, nhịp N5 2/.5 giây và trả lời 12/12/10/8 giây. Thêm optionVoiceRole để lựa chọn phát thoại dùng đúng giọng nhân vật, kể cả thầy giáo; giữ fallback cho các đề trước. Bản đầu 1805795ms; sau chỉnh vai, bản cuối PCM và MP3 decode **1808152ms = 30 phút 08.152 giây**. Không đổi tốc độ/pause hoặc thêm im lặng bù phút. Đây là đánh giá biên tập gần mốc danh nghĩa, không chốt tolerance cố định. Nhạc thủ tục riêng đề 03 đúng 1440000 frame/24000Hz = 60000ms; báo nghỉ → nhạc → báo tiếp tục sau 問題２ và trước hướng dẫn 問題３.

Đăng ký qua adapter tương thích UI, storage key jlpt:jpapp:n5:original:03:v1 và mốc phát 0ms. PASS: cấu trúc/đáp án, nghiệm sắp xếp, phân bố, hash ảnh/audio, giải mã thời lượng, script/thứ tự lựa chọn/giọng phương án và adapter. Khóa UI 10/10 giữ nguyên. Chromium phát từ đầu, pause/resume, qua cuối nhạc và decode đủ năm ảnh PASS. Runner/shared UI nguyên vẹn trong harness RN-web với Expo audio/asset/image và AsyncStorage thật: chọn/lưu đáp án, phát audio, Back/reopen/resume và giữ màu chọn, nộp thiếu, kết quả 0 đúng/1 sai/90 chưa trả lời trên 91, mở review PASS, không pageerror. Bằng chứng ở original/n5-03/runtime-2026-10-07/; ảnh 430x932 đã kiểm tra. Harness cung cấp focus/backdrop và không dựng toàn bộ Expo Router; không nhận native/iPhone/full-router/perceptual approval. Lỗi cấu hình QA process/kiểm tra audio DOM và thuộc tính checked đã được sửa ở harness, không sửa runner hoặc khóa UI. Asset Back QA khôi phục đúng hash LFS; font Google NotoSansJP chỉ dùng trong QA.

Full TypeScript vẫn báo lỗi TS2352 có sẵn tại life-content-repository.ts:47 do SC-HKD-HAKODATE-001 thiếu type; không có diagnostic JLPT, không sửa hội thoại trong phạm vi đề thi. Human/native/perceptual/rights/release flags giữ false. Chưa xóa đề/tài nguyên cũ. Bộ đề tích hợp hiện có **N5 01–03, 3/30 đề** trong phạm vi kiểm tra kỹ thuật trên. Đơn vị này chỉ được coi lưu bền vững sau publish/fetch và WORK PERSISTENCE PASS; sau đó tiếp tục **N5 04**, không có cổng duyệt nháp. Chi tiết trạng thái/hashes: original/n5-03/qa.json và HANDOFF.md.

## 2026-10-07 — Hoàn thiện và tích hợp N5 04

Đọc lại hướng dẫn biên soạn và blueprint, checkpoint/cấu hình giọng; branch recovery/jlpt-n3-n1 và HEAD trước làm việc được xác minh bằng WORK PERSISTENCE PASS. Soạn độc lập mới 91 câu (67 viết +24 nghe), bảy bài đọc, bốn ví dụ không tính điểm; không mở nội dung câu hỏi/kịch bản/hình/audio đề gốc. Tạo mới năm hình bằng imagegen và kiểm tra trực quan, bảng đầu có hai cảnh luyện tập/chấm điểm với nhãn chính xác dựng bằng mã. AI rà soát và sửa mảnh sắp xếp, lý do ô sao, diễn đạt đi bộ và phản hồi hỏi giá để tránh nhiều đáp án. Quota bốn lựa chọn 20/20/20/20; ba lựa chọn 4/4/3, luân chuyển vị trí thiếu. Không ba đáp án giống liên tiếp hoặc chu kỳ ngắn lặp ba lần.

Bản thu đầu PCM 1798652ms; sau sửa nội dung/vai luyện tập, PCM và MP3 decode cuối **1798375ms = 29 phút 58.375 giây**, −1625ms so với mốc danh nghĩa. Không đặt tolerance cố định, không đổi tốc độ/pause, không thêm im lặng bù hoặc phát lại thoại. VOICEVOX 0.25.2, bốn giọng đã chốt, speedScale .9, nhịp N5 2/.5 giây và trả lời 12/12/10/8 giây. Nhạc thủ tục riêng đề 04 đúng 60000ms/1440000 frame, báo nghỉ → nhạc → báo tiếp tục sau 問題２ và trước mọi hướng dẫn 問題３. Bổ sung optionVoiceRole cho ví dụ và lưu turns để kiểm tra vai/thứ tự lời; giữ defaults tương thích đề trước.

Tích hợp có điều kiện qua adapter/registry, storage key jlpt:jpapp:n5:original:04:v1, audio từ 0ms; giữ UI khóa và đề cũ. PASS: cấu trúc/đáp án/phân bố/nghiệm sắp xếp, hash ảnh/audio, decode và script/lựa chọn/giọng, adapter, UI lock 10/10. Browser playback thật kiểm tra đầu bài/pause/resume/qua nhạc/decode năm ảnh PASS. Runner/shared UI nguyên vẹn trong harness RN-web với Expo/AsyncStorage thật: chọn/lưu, Back/reopen/resume và màu chọn, nộp thiếu, kết quả 0 đúng/1 sai/90 chưa trả lời trên 91, review PASS, không pageerror. Ba ảnh cuối 430×932 đã kiểm tra; QA có context focus/backdrop và resolver metadata kích thước ảnh, không sửa production UI. Không nhận full-router/native/iPhone/perceptual approval. Bằng chứng original/n5-04/runtime-2026-10-07/.

TypeScript sau sửa key hình trùng chỉ còn lỗi có sẵn TS2352 life-content-repository.ts:47; không có diagnostic JLPT, không sửa hội thoại ngoài phạm vi. Human/native/perceptual/rights/release flags giữ false. Tiến độ tích hợp **N5 01–04, 4/30 đề**, theo phạm vi kiểm tra kỹ thuật web đã ghi. Đơn vị này chỉ được coi lưu bền vững sau publish/fetch và WORK PERSISTENCE PASS; kế tiếp **N5 05**, không chờ duyệt nháp.

## 2026-10-07 — Hoàn thiện và tích hợp N5 05

Đọc lại hợp đồng biên soạn/blueprint/checkpoint/giọng trước soạn; WORK PERSISTENCE PASS xác minh HEAD 070bdb98 trên nhánh bắt buộc trước bắt đầu. Soạn mới độc lập 91 câu (67 viết +24 nghe), bảy bài đọc, bốn ví dụ không tính điểm, năm hình imagegen. Không lấy nội dung câu hỏi/kịch bản/đáp án/hình/audio JLPT gốc làm đầu vào. AI sửa nghiệm sắp xếp, ngữ cảnh công viên, câu ngữ pháp đoạn văn nhiều đáp án, diễn đạt mượn đồ, nhiễu phương tiện, và mô tả túi đúng hình; lý do nhiễu nghe riêng từng lựa chọn. Quota 20/20/20/20 và 4/3/4; cân bằng theo phần, không ba đáp án liên tiếp/chu kỳ ngắn lặp ba lần hoặc trùng toàn chuỗi với đề mới trước.

Bản đầu 1806747ms; cuối PCM/MP3 decode **1806117ms = 30 phút 06.117 giây**, +6117ms so với mốc danh nghĩa. Đánh giá biên tập khoảng 30 phút, không đặt tolerance cố định; giữ tốc độ .9, nhịp 2/.5s và 12/12/10/8s, không im lặng bù hoặc lặp thoại. VOICEVOX 0.25.2, bốn giọng đã chốt. Nhạc thủ tục riêng đúng 60000ms/1440000frame, báo nghỉ → nhạc → báo tiếp tục sau 問題２ và trước mọi hướng dẫn 問題３.

Adapter/registry riêng, session jlpt:jpapp:n5:original:05:v1, mốc 0ms. PASS cấu trúc/đáp án/hash/script/voice/decoded music và thời lượng, adapter, khóa UI10/10. Browser audio thật và runner/shared UI nguyên vẹn với Expo/AsyncStorage thật PASS chọn/lưu, Back/reopen/resume, phát từ đầu/pause, nộp thiếu, kết quả 0 đúng/1 sai/90 chưa trả lời, review; không pageerror. Ba ảnh 430×932 đã kiểm tra. Không nhận full-router/native/iPhone/perceptual approval; TypeScript chỉ có lỗi TS2352 có sẵn life-content-repository.ts:47. Metadata master cập nhật sau QA không đổi câu hỏi hoặc audio text; hash đồng bộ. Cờ human/native/perceptual/rights/release giữ false.

Tiến độ tích hợp **N5 01–05, 5/30** theo phạm vi kỹ thuật đã ghi. Đơn vị chỉ lưu bền vững sau publish/fetch và WORK PERSISTENCE PASS; kế tiếp **N5 06**, không chờ duyệt nháp. Chi tiết original/n5-05/qa.json và HANDOFF.md.

## 2026-10-07 — N5 06 resumed and integrated

Resumed existing draft after remote-verified N5 05 b6af56bb. Preserved IDs and created no legacy-source derivative. AI editorial correction resolves an ambiguous ordering item; rationale and starred answer updated together. Complete91 questions, seven passages, four unscored examples and five independent imagegen images. Pools20/20/20/20 and3/4/4, no triples or repeated short cycles.

Measured PCM/decoded MP3 1803780ms, delta+3780ms from nominal; no fixed tolerance invented. Approved voices/speed/pause unchanged; music exactly60000ms/1440000frames after problem2 before all problem3 instructions, announcements present.

Structure, audio/script/options/casting/hash, adapter, UI-lock10/10 and actual Chromium asset/production-runner harness checks PASS: choose/save, opening/pause, Back/reopen/resume, incomplete-submit, score0/1/90 and review, no pageerror. Evidence and inspected430x932 screenshots original/n5-06/runtime-2026-10-07. Not full-router/native/iPhone/perceptual approval; publisher/native/perceptual/rights/release flags false.

After publish/fetch and WORK PERSISTENCE PASS, N5 01–06=6/30; next N4 01. N4 final pacing requires its own confirmation; no automatic N5 timing inheritance.

## 2026-10-07 — Hoàn thiện và tích hợp N5 06, đủ nhóm N5

Sau WORK PERSISTENCE PASS của N5 05 tại b6af56bb, tiếp tục soạn mới độc lập91câu (67viết+24nghe), bảy bài đọc, bốn ví dụ không tính điểm, năm hình imagegen. Quota20/20/20/20 và3/4/4; cân bằng theo phần, không ba đáp án liên tiếp, chu kỳ ngắn lặp ba lần hoặc trùng chuỗi toàn đề trước. AI sửa câu sắp xếp nhiều nghiệm, định nghĩa chị gái, lựa chọn ngữ pháp đoạn văn, câu nhường dùng máy hút bụi và đề nghị giải thích lại; hình khay ăn sửa để đặt đúng trên quầy.

Một chỉnh sửa sắp xếp đồng thời đã đổi master trong lúc thu, generator dừng đúng tại snapshot assertion. Giữ sửa hợp lệ 旅行の前に買った靴はとても軽いです。, chuyển sang clone riêng **/workspace/scratch/61ecab301466/japan-app**, vẫn nhánh recovery/jlpt-n3-n1, giữ thư mục chia sẻ cũ. Bản đầy đủ ổn định đầu1849572ms; rút ý lặp trong mở đầu/hướng dẫn/giải thích ví dụ. Cuối PCM/MP3 decode **1802127ms=30phút02.127giây**, +2127ms, không tự đặt tolerance. Giữ .9 và nhịp2/.5s,12/12/10/8s; không im lặng bù, kéo pause hoặc lặp thoại. Nhạc riêng đúng60000ms/1440000frame sau問題２ trước mọi hướng dẫn問題３; đủ báo nghỉ/tiếp tục. VOICEVOX0.25.2, bốn giọng đã chốt.

Adapter/registry riêng, key jlpt:jpapp:n5:original:06:v1 và audio0ms. PASS cấu trúc, đáp án/phân bố/nghiệm, script/voice/hash/decode, adapter, UI10/10. Browser/runner thật với Expo/AsyncStorage PASS chọn/lưu, phát đầu/pause, Back/reopen/resume, nộp thiếu, kết quả0đúng1sai90chưa trả lời, review; không pageerror; ba ảnh430×932 đã kiểm tra. Không nhận full-router/native/iPhone/perceptual approval. Full TS chỉ lỗi có sẵn TS2352 life-content-repository.ts:47. Cập nhật audioStatus từng câu và metadata sau QA, lời thoại/lựa chọn/role/thứ tự không đổi; hash master đồng bộ. Cờhuman/native/perceptual/rights/release giữfalse.

Tiến độ sau publish/fetch và WORK PERSISTENCE PASS: **N5 01–06, 6/30**, tổng546câu chấm điểm,30hình và24ví dụ luyện tập. Kế tiếp **N4 01**; xác minh thời gian và metadata N4 trước soạn, không áp mốc30phút N5 cho cấp khác, không chờ duyệt nháp. Chi tiết original/n5-06/qa.json và HANDOFF.md.

Nhánh đồng thời đã lưu biến thể N5 06 tại 4a0f06bf (1803780ms). Giữ đúng các file khác biệt trong original/n5-06/concurrent-complete-4a0f06bf/ với manifest; file giống nhau có tại commit gốc. Bản hiện hành hợp nhất dùng các sửa phát thoại/sibling đã kiểm tra và 1802127ms; không đếm biến thể trùng thành đề mới. Giữ lịch sử fast-forward từ commit đồng thời; active clone riêng đã ghi ở trên.

## 2026-10-07 — N4 01 content draft checkpoint

Continued after durable N5 06 4a0f06bf. Authored independent N4 01 master with 70 written responses and 28 listening-script responses, eight passages, per-option rationales, ordering solutions and five new illustration briefs. No legacy content read/reused. Draft structural validator PASS: N4 type counts, IDs, keys, rationales, passage links, ordering reconstruction/star alignment, pools 21/21/21/22 and 5/4/4, per-section balance, no triples or short cycles. UI lock remains 10/10. AI corrected ability-form ambiguity and ordering chain before validation; automated ordering checks do not certify unique grammatical solutions.

This is a full scored-content draft, not a finished/integrated exam. Listening organization/examples, independent timing-budget expansion, actual imagegen assets, audio generation/measurement and runner QA remain pending. N4 pacing awaits its own confirmation; N5 approval is not inherited. All human/native/perceptual/rights/release flags remain false. Completed count remains N5 01–06 = 6/30. Resume details: original/n4-01/HANDOFF.md and draft-validation.json. Do not regenerate this master from the initial scratch script, which predates editorial corrections.

## 2026-10-07 — N4 01: hợp nhất checkpoint đồng thời, lưu đề xuất nhịp

Trong khi phiên này soạn70câu viết và rà biên tập, nhánh có7199c587 lưu bản nháp mới98câu (70viết+28kịch bản nghe). Giữ master98câu đó làm điểm tiếp tục; không ghi đè hoặc đếm thêm đề. Bản viết khác của phiên này lưu nguyên tại original/n4-01/alternative-written-draft/, cùng handoff và validator riêng. Không trộn hai bản khi chưa rà cấu trúc/đáp án. Validator master98câu PASS cấu trúc nháp/quota; validator bản viết thay thế PASS cấu trúc70câu. Không kiểm audio/runtime hoặc nhận duyệt ngôn ngữ con người.

N4_PACING_PROPOSAL.md trình riêng2/.5s và12/12/10/8s để xác nhận N4 theo mục10rules; nhạc60s đã chốt toàn cấp, tốc độ.9 giữ nguyên, mốc nghe35phút. Chưa thay casting/generator. Đợi chốt thông số nghe mới, không yêu cầu duyệt nháp nội dung. Tiến độ vẫn6/30N5; N4 01 có nháp98câu nhưng chưa ảnh/audio/tích hợp.

## 2026-10-07 — N4 01 completed and technically integrated

Resumed98-item draft from remote7199c587. Publisher explicitly selected N4 pacing2/.5s and12/12/10/8s answer windows, then independent app organization: one unscored example per type, before/after dialogue questions in1–2, printed alternatives not spoken, three spoken choices in3–4, no full dialogue replay. Persisted decisions in voice-casting, blueprint and both authoring guides. N4 source semantic organization remains unverified; no legacy content was read or used.

Expanded fifteen original dialogues, authored opening/instructions/four unscored examples/closing, generated and inspected five imagegen scenes, corrected ambiguous written/ordering items without changing keyed positions. First recording process ended at20/28; preserved cache/files and resumed on a separate port. First full2192679ms; content revision removes repeated confirmations/instructions. Final PCM/MP3 decode2113752ms =35:13.752, delta+13752ms, approximate35-minute editorial judgment without invented fixed tolerance. Four voices/.9 and approved pauses unchanged; fresh music exactly60000ms/1440000frames, announcements after problem2 before all problem3 orientation.

Registered compatible adapter, independent session jlpt:jpapp:n4:original:01:v1, audio from0ms. PASS type counts/keys/rationales/passages/ordering reconstruction, pools21/21/21/22 and5/4/4, no triples/cycles, audio script/choice/role/hash/decode, adapter, UI10/10, actual Chromium audio and unmodified production runner harness: choose/save, Back/reopen/resume with selected color, pause, incomplete submit,0/1/97 of98, review, no pageerror. Three430x932 screenshots inspected. Existing TS2352 life-content-repository.ts:47 persists; no JLPT diagnostic. No full-router/native/iPhone/perceptual/human/rights/release approval.

After publish/fetch and WORK PERSISTENCE PASS, N5 01–06+N4 01 =7/30; next N4 02. Details original/n4-01/qa.json, HANDOFF.md and runtime evidence. Do not rerun initial scratch authoring scripts; they precede editorial revisions. No legacy removal before full replacement gate.

N4 01 transport: direct PCM continuous encode at40kbps mono24kHz fits connector body limit; individual questions96kbps. Re-decoded duration2113752ms unchanged and playback rechecked. Remote updates214107f7 (other app work and an alternative N4 written draft) preserved via fast-forward; canonical N4 master/audio remain coherent. Alternative draft is not counted as a completed exam.


## 2026-10-07 — N4 02 new independent draft and image assets

Resumed after remote-verified N4 01. Independently authored98responses (70written+28listening),8passages,4unscored examples,5new imagegen illustrations visually inspected. Corrected ordering ambiguity and dialogue/option role mapping. Structural/answer/ordering reconstruction validator PASS; pools21/22/21/21 and4/5/4, no triples/short cycles. Human/native/perceptual/rights/release flagsfalse.

N4-approved .9speed,2/.5s and12/12/10/8s unchanged;35minute budget planned,60s music fixed afterproblem2. Recording is underway locally with reusable turn cache; no complete audio/duration/runtime approval yet. Unregistered adapter prepared only. Completed integrated remains7/30; continue N4 02 from original/n4-02/HANDOFF.md, never regenerate from initial scratch authoring scripts. A checkpoint does not certify a running process in later sessions.


## 2026-10-07 — N4 02 technically completed and integrated

Continued independent98-item draft,5imagegen illustrations and4unscored examples. Corrected after-meal grammar and ordering ambiguity, role/gender casting and usage distractors, without changing keyed answer positions. Pools21/22/21/21 and4/5/4; no triples/short cycles; differs from previous7original exam patterns.

First full2242505ms. Removed18trailing confirmation/secondary-topic turns in9dialogues, retaining explicit solution evidence. Final PCM/MP3 decode2100225ms =35:00.225, +225ms; no fixed acceptance tolerance invented. VOICEVOX0.25.2, four approved voices, .9speed, N4 2/.5s and12/12/10/8s unchanged. Original music exactly60000ms/1440000frames afterproblem2, announcements beforeproblem3.

PASS structure, audio scripts/options/roles/hash/decode, adapter, UI10/10, actual Chromium assets and unmodified production-runner/shared-UI harness: select/save, opening/pause, Back/reopen/resume, incomplete submit,0correct/1wrong/97unanswered of98 and review; no pageerror. Three430x932 screenshots inspected. Full TS still has pre-existing TS2352 life-content-repository.ts:47 only; no JLPT diagnostic. No full-router/native/iPhone/perceptual/human/rights/release approval.

Independent session jlpt:jpapp:n4:original:02:v1, audio0ms; spoken alternatives/transcripts hidden. Metadata/rationale/written refinements after recording keep script/choice/role input unchanged, with original/current snapshot hashes recorded. After publish/fetch and WORK PERSISTENCE PASS, N5 01–06+N4 01–02 =8/30; next N4 03. Resume original/n4-02/HANDOFF.md; do not rerun initial scratch authoring scripts. Old exams not removed before replacement gate.


## 2026-10-07 — N4 03 independent draft checkpoint

Authored98responses (70written+28listening),8passages,4new unscored examples and5imagegen illustrations inspected. Draft validator PASS IDs/counts/keys/ordering reconstruction, pools21/21/22/21 and4/4/5, no triples/short cycles. N4 .9speed/2/.5s and12/12/10/8s unchanged. Audio synthesis underway locally; no complete duration or integration/runtime claim. Further editorial review and target35minute measurement remain. No legacy content used. Human/native/perceptual/rights/release flagsfalse. Completed integrated remains8/30; continue N4 03 from original/n4-03/HANDOFF.md.


## 2026-10-07 — N4 03 technically completed and integrated

Completed independent98responses,8passages,5imagegen illustrations,4new unscored examples. AI revised ordering1/4/5 to constrain clause dependencies and benefactive grammar viewpoint, improved usage distractors and internal listening evidence. Pools21/21/22/21 and4/4/5; no triples/short cycles, differs from previous8original exams. No legacy content read/reused.

PCM/decoded MP3 **2090321ms=34:50.321**, nominal delta−9679ms; approximate35minute editorial assessment without fixed tolerance. Initial content already near target; no dialogue expansion/trimming or silence padding. Written-only revisions do not change speech. New procedural music forN4 03 differs fromN4 01/02; exactly60000ms/1440000frames afterproblem2 before allproblem3orientation. Four approved voices,.9speed,N4 2/.5s,12/12/10/8s unchanged.

PASS structure, audio script/options/roles/hash/decode, adapter, UI10/10, real Chromium playback from0/pause/resume/automaticmusicboundary/5images and unmodified production runner/sharedUI RN-web harness: select/save, Back/reopen/resume with selectedcolor, incomplete submit97, score0/1/97of98, review, no pageerror. Three430x932screenshots inspected. Existing unrelated TS2352 life-content-repository.ts:47 persists; no JLPTdiagnostic. No native/iPhone/full-router/perceptual/human/rights/release approval.

Independent key jlpt:jpapp:n4:original:03:v1, audio0ms, spoken choices/transcripts hidden. After publish/fetch and WORK PERSISTENCE PASS, N5 01–06+N4 01–03=9/30; nextN4 04. Resume original/n4-03/HANDOFF.md; do not regenerate from initial scratch scripts. No legacy removal before full replacement gate.


## 2026-10-07 — N4 04 independent draft checkpoint

Authored98responses (70written+28listening),8passages,4new unscored examples,5imagegen illustrations inspected. Corrected vocabulary infinitive chain and ordering2/3/5 to constrain dependencies. Draft validator PASS counts/keys/reconstruction, pools22/21/21/21 and5/4/4, no triples/short cycles; differs from previous9original patterns. No legacy content used. N4 four approved voices,.9,2/.5s,12/12/10/8s unchanged; independent35minute content budget and new exact60s musical score. Audio synthesis started locally, duration/runtime still pending; no human/native/perceptual/rights/release approval. Completed integrated9/30. Resume original/n4-04/HANDOFF.md; never rerun initial scratch scripts.


## 2026-10-07 — N4 04 technically completed and integrated

Completed independent98responses,8passages,4new unscored examples,5imagegen illustrations inspected. Corrected 待ってから, continuation/weight contexts, ordering2/3/5 dependencies, grammar distractors and per-option Japanese internal evidence. Pools22/21/21/21 and5/4/4; no triples/short cycles; differs from previous9original patterns. No legacy content read/reused.

First full2173319ms; removed six redundant trailing turns from task1items1/4/8, retaining explicit instructions and all keyed choices. Final PCM/MP3 decode **2111001ms=35:11.001**, nominal delta+11001ms, approximate35minute judgment without fixed tolerance. New procedural music differs fromN4 01–03; exactly60000ms/1440000frames afterproblem2 before allproblem3orientation, both announcements included. Four approved voices,.9speed,N4 2/.5s,12/12/10/8s unchanged. Written/rationale/generation metadata refinements preserve speech inputs; recording/current snapshot hashes retained.

PASS content/audio script/choices/roles/hash/decode, adapter, UI10/10, actual Chromium audio0/pause/resume/music boundary/fiveimages and unmodified production runner/sharedUI RN-web harness: select/save, Back/reopen/resume selectedcolor, incomplete submit97, score0/1/97of98, review, no pageerror. Three430x932screenshots inspected. FullTS still only existing unrelated TS2352 life-content-repository.ts:47; no JLPTdiagnostic. No native/iPhone/full-router/perceptual/human/rights/release approval.

Independent session jlpt:jpapp:n4:original:04:v1, audio0ms, spoken choices/transcripts/detailedexplanations hidden. After publish/fetch and WORK PERSISTENCE PASS, N5 01–06+N4 01–04=10/30; nextN4 05. Resume original/n4-04/HANDOFF.md; do not rerun scratch scripts. No legacy removal before full replacement gate.


## 2026-10-07 — N4 05 technically completed and integrated

Completed independent98responses,8passages,4new unscored examples,5actual imagegen illustrations inspected. AI corrected ordering dependencies, numeric distractor typo, express-train/conditional contexts, usage distraction and short-notice wording; furniture reading avoids unnecessary からこそ. Pools21/22/21/21 and4/5/4; no triples/short cycles, differs from previous10original answer patterns. No legacy content read/reused.

First full2266055ms; removed16redundant trailing confirmation/secondary-topic turns from eight task1dialogues, retaining explicit instructions/keys. Final PCM/MP3decode **2094215ms=34:54.215**, nominal delta−5785ms, approximately35minute editorial judgment without invented fixed tolerance. New procedural music differs from priorN4scores, exactly60000ms/1440000frames afterproblem2 before allproblem3orientation, announcements before/after. Four approved voices,.9speed,N4 2/.5s,12/12/10/8s unchanged; no silence padding. Recording/current snapshot hashes retained.

PASS content/audio scripts/options/roles/hash/decode, adapter, UI10/10, actual Chromium assets and unchanged production-runner/sharedUI RN-web harness: select/save, audio0/pause, Back/reopen/resume selectedcolor, incomplete submit97, score0/1/97of98, review, no pageerror. Three430x932screenshots inspected. FullTS retains existing unrelated TS2352 life-content-repository.ts:47 only; no JLPTdiagnostic. No native/iPhone/full-router/perceptual/human/rights/release approval.

Independent session jlpt:jpapp:n4:original:05:v1, audio0ms, spoken choices/transcripts/internalexplanations hidden. After final publish/fetch and WORK PERSISTENCE PASS, N5 01–06+N4 01–05=11/30; nextN4 06. Resume original/n4-05/HANDOFF.md; never rerun initial scratch scripts. No legacy removal before full replacement gate.


## 2026-10-07 — N4 06 independent content draft

Resumed remote N4 05 commit88b39996. Independently authored98responses (70written+28listening),8passages,4unscored examples and5actual imagegen illustrations inspected. AI revised movable ordering fragments, comparison distractor and explicit appointment agreement. Draft structural validator PASS; pools21/21/22/21 and4/4/5, no triples/short cycles. No legacy content used. Four approved voices,.9speed,N4 2/.5s and12/12/10/8s unchanged. Full recording/duration/integration/browser checks pending. Human/native/perceptual/rights/release flagsfalse. Completed integrated remains11/30; resume original/n4-06/HANDOFF.md.


## 2026-10-07 — N4 06 technically completed and integrated

Completed98independent responses,8passages,4unscored examples,5imagegen illustrations inspected. AI clarified three written prompts, four usage groups, five constrained ordering solutions and explicit appointment agreement; keys remain pools21/21/22/21 and4/4/5, no triples/short cycles. No legacy content read/reused.

First full1961536ms; added10task-relevant turns in task1items1–5. Final PCM/MP3decode2086312ms=34:46.312, nominal−13688ms, approximately35minute judgment without fixed tolerance. New procedural instrumental60000ms/1440000frames afterproblem2 beforeproblem3, both announcements. Four approved voices,.9speed,N4 2/.5s,12/12/10/8s unchanged. No silence padding.

PASS content/audio scripts/options/roles/hash/decode, adapter, UI10/10, actual Chromium audio0/pause/resume/music-end boundary/fiveimages and unchanged production-runner/sharedUI harness: select/save, Back/reopen/resume selectedcolor, incomplete submit97, score0/1/97of98, review, no pageerror. Three430x932screenshots inspected. Existing unrelated TS2352 life-content-repository.ts:47 only. No full-router/native/iPhone/perceptual/human/rights/release approval. Fixed initial fifth-image reference and re-encoded optional question1-03 sidecar from cached snapshot, waveform matched against continuous track.

Session jlpt:jpapp:n4:original:06:v1,audio0ms; spoken alternatives/transcripts/internal explanations hidden. After final publish/fetch and WORK PERSISTENCE PASS, N5 01–06+N4 01–06=12/30; nextN3 01. N3 pacing requires its own publisher decision, not silent inheritance of N4. Resume original/n4-06/HANDOFF.md. No legacy removal before full replacement gate.


## 2026-10-07 — N4 06 local completion; N3 pacing decision

N4 06 complete-content and adapter validators PASS, UI lock10/10. Completion commit remains local: automatic approval review rejected GitHub push for lack of explicit payload/destination sharing confirmation. No WORK PERSISTENCE PASS and no durable12/30 claim. Preserve the complete N4 work; obtain requested push confirmation before progressing to N3 content. Publisher directly selected N3 2/.5s and answer12/12/12/10/8s; synchronized both mandatory guides, casting and machine blueprint. N3 content/audio not authored by this checkpoint session.


## 2026-10-07 — authorized publication verified; N3 01 authored

User explicitly authorized the two outstanding payloads to duykhanhtokio/japan-app, recovery/jlpt-n3-n1. N4 completion tree exactly matches remote6807d7f3; pacing payload published edbd9069. Concurrent Kaigo commit6212ce09 preserved. Full checkout fetched remote6212ce09; WORK PERSISTENCE PASS. Integrated12/30 is durable. Historical push blocker above is resolved.

N3 01 independently authored102responses (74written+28listening),10passages,5new unscored examples and4imagegen illustrations inspected. Content structure PASS, pools23/22/22/22 and5/4/4, no triples/short cycles. Publisher selected five-skill independent listening organization; source semantic verificationfalse. AI corrected ordering dependencies, benefactive viewpoint, ambiguous usage distractor and practice-image speaker casting. Approved .9speed,2/.5s,12/12/12/10/8s; new60second instrumental afterproblem2 before allproblem3orientation. Audio generation underway; duration/adapter/runtime not yet complete. No human/native/perceptual/rights/release claim. Integrated remains12/30 until completed N3 technical integration and durable publication. Resume original/n3-01/HANDOFF.md; do not rerun scratch authoring scripts.


## 2026-10-07 — N3 01 technical integration complete

Independent102responses (74written+28listening),10passages,5new unscored examples and4imagegen illustrations inspected. Publisher-selected five-skill organization recorded in both mandatory guides, blueprint and organization. AI editorial fixes documented. Keys23/22/22/22 and5/4/4, section-balanced, no triples/short cycles, independent of previous12patterns. No legacy content inputs.

First audio2691208ms; trimmed31repeated/ancillary turns and aligned internal evidence without changing keys/choices/approvedvoices/.9speed/2/.5s/12/12/12/10/8s. Final PCM2400241ms=40:00.241, decodedMP32400241.958ms. Approximately40minutes, no fixed target tolerance and no silence padding. New procedural music exact60000ms/1440000frames after2 before all3orientation with bothannouncements. Codec/sample rounding below1ms recorded separately.

PASS content/audio28sidecars+fulltrack/scripts/choices/roles/hash/examples/music/adapter/UI10of10, actual Chromium opening/pause/resume/music boundary/fourimages and unchanged production runner RN-web select/save/back/reopen/resume/incomplete submit101/score0of102/review, no pageerror. Three430x932screenshots inspected. FullTS only pre-existing unrelated TS2352 life-content-repository.ts:47; no JLPTdiagnostics. Native/iPhone/full-router/human/perceptual/native-speaker/publisher/rights/release flagsfalse.

Independent session jlpt:jpapp:n3:original:01:v1,audio0ms; spoken choices/transcripts/internal rationales and group3advance question hidden. After final publish/fetch and WORK PERSISTENCE PASS, integrated N5 01–06+N4 01–06+N3 01=13/30. NextN3 02. Resume original/n3-01/HANDOFF.md. No legacy removal before full replacement gate.


## 2026-10-07 — N3 02 independent content checkpoint

Startup verified durable24e5be9b and UI10/10;N3 01integrated13/30. Both full authoring guides reread;N3 pacing/organization already approved and unchanged. Independently authored102responses,10passages,5new practice examples,4actual imagegen assets inspected. Editorial corrections address lexeme/polysemy,ておくandruleviewpoint,ordering dependencies; controlledstablekeys22/23/22/22and4/5/4,no triples/shortcycles, differsfrom13earlierpatterns. No legacy content input.

New music60seconds after2beforeall3orientation. Planned40minute budget;audio synthesis underway locally, actualduration/runtimepending. No native/perceptual/publisher/rights/release claim. Integrated remains13/30 until completeN3 02and durablepublication. Resumeoriginal/n3-02/HANDOFF.md;never reruninitialscratchscripts.


## 2026-10-07 — N3 02 technical integration complete

102 independently authored scored responses: 74 written + 28 listening, 10 passages, five new unscored examples and four generated illustrations visually inspected. Keys 22/23/22/22 and 4/5/4; no triples or short cycles, distinct from 13 earlier independent patterns. No legacy question/passages/scripts used.

AI editorial revisions clarified grammar/ordering/usage contexts and seven spoken distractors. First recording 41:09.209; removed 12 repeated or ancillary turns while retaining key evidence. Final decoded track **39:42.249 (2382249ms)**, approximately 40 minutes; no invented fixed target tolerance or silence padding. Approved four voices, .9 speed, 2/.5-second pacing and 12/12/12/10/8-second response windows unchanged. Original instrumental music exactly 60000ms/1440000 frames after problem2 before all problem3 orientation, announcements on both sides. Recording and current master hashes retained separately.

PASS content, 28 audio sidecars plus continuous track/scripts/options/roles/hashes/examples/music, adapter and UI lock10/10. Actual Chromium decode/playback opening, pause/resume, automatic music-end boundary and four images PASS. Unmodified production runner/shared UI in isolated RN-web harness: select/save, back/reopen/resume, incomplete submit, score0 correct/1 wrong/101 unanswered of102, review, no pageerrors. Three430x932 screenshots inspected. Full TypeScript reports only existing unrelated TS2352 in life-content-repository.ts:47; no JLPT diagnostic. Not full-router/native/iPhone/perceptual/native-speaker/publisher/rights/release approval.

Independent session `jlpt:jpapp:n3:original:02:v1`, start0ms. Spoken alternatives, transcripts, internal explanations and group3 advance question hidden. Runtime integrated. After publication/fetch and WORK PERSISTENCE PASS, completed technical integrations N5 01–06 + N4 01–06 + N3 01–02 =14/30. Next N3 03. Do not rerun initial authoring/permutation scripts; no legacy removal before full replacement gate. This is technical completion, not human certification.


## Colored 2D and semantic repair — 2026-10-07

All14 authored independent originals received68 colored2D runtime assets under the mandatory image/uniqueness standard.116 revision records cover113 distinct IDs, including semantic/context replacements, speaker alignment and two answer-quality repairs; answer IDs/order are unchanged. Current scope audited:1,338 scored items,109 passages,58 examples; zero normalized exact duplicates and22 near candidates individually reviewed for distinct targets/actions.42 content/adapter/audio checks,68-asset consistency and10/10 UI lock PASS. Real runner web harness14/14 and68/68 images PASS; evidence: `repair-colored-2d-2026-10-07/README.md` and runtime reports. Human/native/perceptual/rights/release approvals remain pending. Technical completion14/30, next original N3 03. Revised sessions usev2 to isolate prior saved answers.


## 2026-10-08 — N3 03 technical integration complete

102 independently authored responses (74 written + 28 listening), 10 passages, five new unscored examples, four colored 2D imagegen assets visually inspected. Stable keys: four-choice 22/22/22/23, three-choice 4/4/5, separately section-balanced, no triples/short cycles, distinct from all 14 earlier original patterns. Independent content only; no legacy content inputs.

AI editorial review replaced five duplicate/near semantic motifs and clarified written ambiguity and option-specific rationales. Final candidate audit across 15 independent masters: 1440 scored responses, 119 passages, 63 examples, zero normalized exact duplicates. All 22 prior lexical near candidates have identical texts/scores and retain their recorded AI judgments; none involve N3 03. This does not certify exhaustive semantic uniqueness or native quality.

First track 44:37.688. Removed 24 repeated concluding turns from groups 1–2, retaining deciding evidence and contrasts, and recorded semantic replacements. Final PCM/decode **40:17.603 (2417603ms)**, approximately 40 minutes by AI editorial judgment; no fixed tolerance or padding. Approved VOICEVOX 0.25.2 four voices, .9 speed, 2/.5-second timing and 12/12/12/10/8-second windows unchanged. New original procedural score exactly 60000ms/1440000frames after problem2 before all problem3 orientation, with announcements. Recorded/current master hashes retained; post-recording edits written-only and metadata.

Content, audio 28 sidecars + continuous track/scripts/spoken choices/roles/hashes/examples/music, adapter and UI10/10 PASS. Real Chromium decoder opening/pause/resume/music boundary/four images PASS. Unmodified production runner/shared UI RN-web harness passes select/save, back/reopen/resume, incomplete submit101, score0 correct/1 wrong/101 unanswered of102, review, no pageerror. Three430x932 screenshots visually inspected. Full TypeScript only existing unrelated TS2352 life-content-repository.ts:47. Harness supplies focus/backdrop contexts; not full router, native/iPhone, human listening or release approval.

Session `jlpt:jpapp:n3:original:03:v1`, start0ms. Spoken choices/transcripts/internal explanations and group3 advance question hidden. Runtime integrated; human/native/perceptual/publisher/rights/release flags false. Completed count becomes15/30 only after narrow commit publication and WORK PERSISTENCE PASS. Next N3 04. Preserve all earlier work; no legacy deletion before full30 replacement gate. Do not rerun scratch initial authoring/permutation scripts.

## Publication blocked by automatic approval review

The completed N3 03 narrow commit is local only. Automatic approval review rejected GitHub push because the continuation request was not accepted as explicit authorization to export this content/media/report payload to duykhanhtokio/japan-app on recovery/jlpt-n3-n1. Remote observed at20bb09b3726a7ca0242c57f9c5b5776b66281d70, incorporating concurrent Kaigo work preserved by rebase. User confirmation for this exact payload/destination requested. Do not bypass rejection, claim durable15/30, or accumulate N3 04 before publication/fetch/WORK PERSISTENCE PASS. Durable integrated count remains14/30.

## 2026-10-08 — publisher authorized complete N3 03 publication

Publisher explicitly authorized all exam content, images, audio and reports to duykhanhtokio/japan-app, recovery/jlpt-n3-n1. Prior automatic approval blocker is resolved. Direct Git push has no HTTPS credentials in this runtime; using the connected GitHub API to publish the same validated narrow tree while preserving concurrent Kaigo work. Require exact tree verification, fetch and WORK PERSISTENCE PASS before advancing to N3 04; completed technical count becomes15/30 after verified publication. Human/native/perceptual/rights/release flags remainfalse.


## 2026-10-08 — N3 04 technical integration complete

102 new independent scored items: 74 written and 28 listening, 10 passages, 5 unscored examples and 4 original colored 2D imagegen assets. Stable four-choice keys 23/22/22/22; three-choice 5/4/4. Section balance, no triples or short repeated cycles, distinct prior sequences PASS. AI editorial revisions and individual grammar/text/reading rationale records retained. No legacy content or assets used as authoring inputs.

Measured first audio 40:32.205; final 40:43.907 (2443907ms) after improving nine immediate-response distractor sets. Approximately approved N3 40 minutes by editorial judgment, no fixed tolerance or padding. Approved VOICEVOX 0.25.2 voices, speed .9, pauses and response windows retained. New instrumental score exactly 60000ms/1440000frames after group2 and before all group3 orientation, announced before and after. Recorded/current master hashes preserved; post-recording changes only written rationales and metadata.

Content, audio (28 decoded sidecars, full track, scripts/options/roles/examples/hashes/music), adapter and UI lock10/10 PASS. Chromium decode/playback/pause/resume/music boundary/4images PASS. Actual unmodified runner/shared UI in isolated RN-web harness: select/save, back/reopen/resume, submit101 unanswered, score0/1/101 of102, review and no page errors. Three430x932 screenshots inspected. Full TypeScript only pre-existing unrelated TS2352 life-content-repository.ts:47; no JLPT diagnostics after adapter fix. Harness provides focus/backdrop contexts; not full router/native device/perceptual certification.

Candidate audit of16 independent masters:1542 questions,129 passages,68 examples, zero normalized exact duplicates,22 unchanged earlier lexical near candidates with recorded AI judgments and no N3 04 near candidates. AI semantic review repaired near weather context, repeated cancellation motif, two ordering ambiguities and weak distractors. No exhaustive human uniqueness or level calibration claim.

Runtime session jlpt:jpapp:n3:original:04:v1, opening0ms. Spoken choices/transcripts/internal explanations and group3 advance question hidden. Human/native/perceptual/publisher/rights/release flags remain false. User authorized complete exam/media/report publication to duykhanhtokio/japan-app recovery/jlpt-n3-n1. Scoped .gitattributes store only this new payload as ordinary Git blobs for connected GitHub API transport; older LFS media untouched. Count becomes16/30 after publication/fetch/WORK PERSISTENCE PASS. Next N3 05; no legacy deletion before full replacement gate.


## 2026-10-08 — N3 05 technical integration complete

102 independently authored responses (74 written,28 listening),10 passages,5 new unscored examples and4 colored2D imagegen assets visually inspected. Stable keys: four-choice22/23/22/22, three-choice4/5/4, section balance, no triples or short cycles, distinct earlier patterns. Source inputs only structural/pacing metadata; no legacy content.

AI editorial review repaired a near recipe-learning motif with schedule compatibility, echo context near earlier quiet-speaking grammar, two ordering dependencies, preparatory grammar and lexical difficulty. Individual correct/wrong internal reasons retained; runtime hides explanations and transcripts. Final lexical candidate audit:17 independent masters,1644 questions,139 passages,73 examples, zero normalized exact duplicates;22 unchanged prior near candidates retain AI judgments, no N3 05 near candidates. Not exhaustive human semantic or level certification.

Measured complete audio40:53.076 (2453076ms), approximately approved N3 40-minute target by editorial judgment, no fixed tolerance or padding. Approved VOICEVOX0.25.2 voices, speed.9,2/.5second pacing and12/12/12/10/8response windows retained. New original procedural music60000ms/1440000frames after group2 before all group3 orientation, with announcements. Recorded/current master hashes preserved; only written edits and metadata after synthesis.

Content/audio28sidecars+continuous/scripts/choices/roles/examples/hashes/music/adapter/UI10/10 PASS. Chromium actual decode/opening/pause/resume/music boundary/4images PASS. Unmodified runner/shared UI isolated RN-web harness: choose/save, Back/reopen/resume, incomplete submit101, score0correct/1wrong/101unansweredof102, review,no pageerrors. Three430x932 screenshots inspected. Full TypeScript only pre-existing unrelated TS2352 life-content-repository.ts:47. Harness supplies focus/backdrop context, not full-router/native-device or perceptual approval.

Session jlpt:jpapp:n3:original:05:v1, opening0ms; group3 advance question and spoken-only alternatives hidden. Human/native/perceptual/publisher/rights/release flags false. User authorized all content/media/reports to duykhanhtokio/japan-app recovery/jlpt-n3-n1. Scoped ordinary-blob attributes for new payload and screenshots preserve older LFS media. Completed count becomes17/30 after publication/fetch/WORK PERSISTENCE PASS. Next N3 06. No legacy deletion before full30 replacement gate. Do not rerun initial scratch authoring/permutation scripts.

## 2026-10-08 — N3 06 technical integration complete

102 independently authored scored responses (74 written,28 listening),10 passages,5 new unscored examples and4 colored2D imagegen illustrations. Stable four-choice keys22/22/23/22 and three-choice4/4/5, balanced sections, no triples or short cycles. No legacy question, passage, image or audio inputs.

AI editorial review replaced an overlapping guide-information passage with one-off help versus ongoing availability, repaired usage alternatives and tightly linked ordering chunks, aligned grandfather address with male voice, used natural 電気スタンド and explicit left/right response references. Individual correct/wrong rationales retained internally; runtime hides spoken alternatives, transcripts and explanations. Final candidate audit18 independent masters,1746 questions,149 passages,78 examples:0 normalized exact duplicates,22 prior near candidates retained only after exact text/score matching, no new N3 06 near candidate. No exhaustive native semantic or level certification.

First complete audio43:32.116; final41:07.039 (2467039ms), approximately N3 forty-minute target by editorial judgment, no fixed tolerance or padding. Repetitive dialogue confirmations shortened; approved VOICEVOX0.25.2 casting, speed.9, intro2s, between.5s and response12/12/12/10/8s unchanged. New procedural instrumental music60000ms/1440000frames after group2 before all group3 orientation, with announcements. Recorded/current hashes retained; only completion metadata changed after final synthesis.

Content,28 decoded recordings/full track/scripts/choices/roles/examples/hashes/music, adapter and UI10/10 PASS. Actual Chromium decode/opening/pause/resume/music boundary/four images PASS. Unmodified production runner/shared UI in isolated RN-web harness: select/save,Back/reopen/resume,submit101 unanswered,score0 correct/1 wrong/101 unansweredof102,review,no pageerrors. First correct key1; harness selects option2 as intentionally wrong, without altering keys. Three430x932 screenshots visually inspected. Full TypeScript only pre-existing unrelated TS2352 life-content-repository.ts:47. Focus/backdrop contexts supplied; no full-router/native/perceptual claim.

Session jlpt:jpapp:n3:original:06:v1, opening0ms. Human/native/perceptual/publisher/rights/release flags false. User authorized all content/media/reports to duykhanhtokio/japan-app recovery/jlpt-n3-n1. Scoped ordinary Git blob attributes preserve older LFS assets. Count becomes18/30 after publication/fetch/WORK PERSISTENCE PASS: all6 N5,all6 N4,all6 N3. Next N2 01; N2/N1 require their own confirmed pacing per authoring-blueprints policy. No legacy deletion before the full30 replacement gate. Do not rerun initial scratch authoring/shuffle scripts.


## 2026-10-08 — N2 01 technical integration complete

Publisher confirmed N2 pacing on 2026-10-08: intro2s / turn.5s / answers12,12,12,8,15s; four approved voices at speed.9 retained. 75 written +31 listening =106 scored units,12 passages,5 new unscored examples. Independent text-only N2 task choices; no illustration is required by these authored situations. No legacy content/assets inputs; isolated source metadata matches75/31 and30 audio segments.

Three integrated dialogues serve four responses; last two share one recording with two separate15000ms answer windows and distinct saved-answer IDs. No whole-dialogue replay. Combined written section105minutes; listening approximately50minutes. Stable four-choice keys23/24/24/24 and three-choice3/4/4; section balance, no triples or repeated short cycles, distinct18 earlier patterns.

AI editorial revisions repair grammar/ordering/usage ambiguity,27 length-cue option sets and four later printed-only refinements. Sixteen repetitive closing turns/paragraphs shortened or removed, deciding evidence retained; integrated speaker targets clarified. First recording54:11.964; final decoded50:08.969 (3008969ms). No silence padding, speed change or invented fixed tolerance. New instrumental score60000ms/1440000frames aftergroup2 before allgroup3 orientation, announcements on both sides. Recorded/current master hashes retained; post-recording changes only printed-only alternatives and completion metadata.

Content, adapter,30 decoded dialogue files/31 mappings/continuous recording/scripts/roles/options/windows/hashes/examples/music PASS; UI10/10. Two initially truncated sidecars restored to exact expected full cached-speech hashes and decoded successfully. Chromium opening/pause/resume/automatic music-end boundary PASS. Production runner/shared UI harness: start,save three wrong selections (including both shared-dialogue responses),Back/reopen/resume,submit103 unanswered,score0correct/3wrong/103unansweredof106,review; no page errors. Three430x932 screenshots inspected. Japanese QA font is a scratch NotoSansJP; exact approved font/royal art not materialized here. Not native-device/full-router/exact approved-font or human listening approval. TypeScript only existing unrelated TS2352 life-content-repository.ts:47.

Final lexical candidate audit19 masters:1852 questions,161 passages,83 examples;0 normalized exact duplicates,22 unchanged earlier near candidates matched by exact texts/scores, no newN2 candidate. AI semantic review is not exhaustive native uniqueness/level calibration.

Session jlpt:jpapp:n2:original:01:v1, opening0ms. Spoken choices, transcripts, internal explanations and advance gist/integrated questions remain hidden. Publisher/native/perceptual/rights/release flagsfalse. After this narrow commit is published, fetched and WORK PERSISTENCE PASS, technical integrations19/30 (N5/N4/N3 allsix +N2 01); nextN2 02. Do not rerun initial authoring/shuffling scripts or remove legacy content before full30 replacement gate. Publisher authorized exam/media/report publication to duykhanhtokio/japan-app recovery/jlpt-n3-n1.

Transport recovery: GitHub connector rejects request bodies above16MiB. Continuous MP3 re-encoded directly from the unchanged original24kHz mono speech PCM cache at32kbps; no MP3-to-MP3 conversion or fresh synthesis. Same3008969ms timeline, original96kbps sidecars/music retained. Decoder and Chromium playback rechecked; perceptual approval remainsfalse.


## 2026-10-08 — N2 02 technical integration complete

75 written +31 listening =106 independent scored responses,12 passages,5 new unscored examples. N2-approved2/.5s and12/12/12/8/15s, four voices and speed.9 retained. Text-only independent N2 situations need no illustration. Combined written105minutes. Stable four-choice keys24/23/24/24, three-choice4/3/4, section balance, no triples/short cycles, distinct from19 earlier originals.

AI editorial corrections remove a near family-consultation grammar sentence, constrain ordering dependencies, repair natural intent/usage and length cues, align printed rationales. Repeated prior supplementation/ratio usage motifs replaced with quality damage「損なう」and dual-role「兼ねる」, not noun-only edits. Shared group5 dialogue played once for response3/4, two independent15000ms windows; first question clarified as room preparation, four distinct plans, second tests the female actor's duties. Answers/order stable after recording. Final candidate audit20masters/1958questions/173passages/88examples:0 normalized exact,22 prior lexical near candidates retain exact texts/scores,0 new. Not exhaustive native semantic/difficulty certification; no legacy content/assets input.

First decoded listening52:51.163.17 redundant confirmations/asides shortened, deciding evidence retained; final50:49.548(3049548ms), approximately50minutes by AI editorial judgment, no fixed tolerance, speed/pause change, silence padding or replay. New original procedural music exactly60000ms/1440000frames after2before all3orientation, with announcements. Continuous direct original PCM32kbps mono24kHz;30 sidecars/music96kbps. Recorded/current hashes retained; later edits only printed choices/rationales and completion metadata.

PASS content/adapter/30decoded recordings+31mappings/fulltrack/scripts/voices/spokenchoices/responsewindows/hash/exactmusic. Actual Chromium decoder/opening/pause/resume/music-end automatic continuation PASS. Unmodified production runner/sharedUI RN-web harness: choose/save three wrong answers, including both shared responses,Back/reopen/resume,submit103unanswered,score0correct/3wrong/103unansweredof106,review,no pageerrors. Three430x932 screenshots visually inspected. Supplied focus/backdrop contexts/scratch NotoSansJP; approved font/Back artwork remain LFS placeholders in this environment. Not full-router/native/exact approved-art-font/human hearing acceptance. TypeScript only existing unrelated TS2352 life-content-repository.ts:47.

Independent session jlpt:jpapp:n2:original:02:v1, audio0ms. Spoken alternatives, advance gist/integrated questions, transcripts and internal explanations hidden. Human/native/perceptual/publisher/rights/release flagsfalse. After narrow publication/fetch and WORK PERSISTENCE PASS, integrated20/30: all6 N5/N4/N3 plusN2 01–02. NextN2 03. Do not rerun initial authoring/permutation scripts or delete legacy assets before full replacement. User authorized all exam/media/report payloads to duykhanhtokio/japan-app recovery/jlpt-n3-n1.


## 2026-10-08 — N2 03 technical integration complete

75 written +31 listening =106 independent scored units,12 passages,5 new unscored examples. N2-approved intro2s/turn0.5s/answers12,12,12,8,15s and four approved voices at speed0.9 retained. Text-only independently authored tasks require no illustration. Written105minutes. Stable four-choice24/24/23/24 and three-choice4/4/3; balanced sections, no triples or repeated short cycles, distinct from20 earlier originals.

AI editorial review repairs an awkward compound, competing payment/grammar readings and all five ordering dependencies.47 listening option refinements remove strong length cues and replace implausible immediate-response distractors. Shared integrated dialogue3 recorded once for responses3/4, separate15000ms windows and answer IDs. Final independent-corpus audit21masters/2064questions/185passages/93examples:0 normalized exact,22 unchanged prior lexical near candidates,0 new. No exhaustive native semantic/difficulty certification or legacy question/assets input.

First decoded51:04.000; three non-decisive closing turns removed, final50:42.596(3042596ms). No speed/pause alteration, silence padding or dialogue replay. New procedural instrumental music exactly60000ms/1440000frames after2before all3orientation, announcements on both sides. Direct original PCM32kbps mono24kHz continuous track,96kbps sidecars. Recorded/current hashes retained; post-recording changes only completion metadata.

Content,adapter,30decoded recordings+31mappings/fulltrack/scripts/roles/spokenchoices/windows/hashes/exactmusic PASS; UI10/10. Actual headless Chromium decode/opening/pause/resume/music-end automatic continuation PASS. Production runner/sharedUI RN-web harness: one correct and two wrong answers including both shared responses; Back/reopen/resume; submit103unanswered; score1correct/2wrong/103unansweredof106; review; no page errors. Three430x932 screenshots inspected. Approved font and Back art materialized; focus/backdrop contexts supplied; headless single-process sandbox. Not full-router/native/perceptual acceptance. TypeScript only existing unrelated TS2352 life-content-repository.ts:47.

Session jlpt:jpapp:n2:original:03:v1, audio0ms. Spoken choices, advance gist/integrated questions, transcripts and explanations hidden. Human/native/perceptual/publisher/rights/release flagsfalse. After narrow publication/fetch and WORK PERSISTENCE PASS, technical integrations21/30: all6 N5/N4/N3 plusN2 01–03. NextN2 04. Do not rerun scratch authoring/shuffling scripts or remove legacy assets before full30replacement gate. User authorized all exam/media/report publication to duykhanhtokio/japan-app recovery/jlpt-n3-n1.


## 2026-10-09 — N2 04 partial written continuation

Verified existing remote branch at97d48b4cbe9f0f251dbe1cd3aa9174db80195bc4; checkout clean and WORK PERSISTENCE PASS before editing. N2 03 remains completed. N2 04 now has75 independently authored written responses with12 passages, exact groups1–14 and five checked ordering solutions. Stable vocabulary8/8/8/8 and grammar-reading11/11/11/10, no written triples/short cycles. AI editorial corrections and lexical candidate detection recorded in original/n2-04/HANDOFF.md and associated reports. No legacy question inputs.

N2 04 remains a PARTIAL draft, not runnable or registered. No listening scripts/examples/recordings, no adapter or app runtime verification yet. Integrated count remains21/30. Next work is31 listening responses and five unscored examples, approved N2 organization/pacing and complete approximately50min audio with exact60000ms music, then complete content/audio/uniqueness/runtime validation and registration. All human/native/perceptual/rights/release flags remain false. VOICEVOX0.25.2 CPU preflight successfully synthesized all4 approved voices at24kHz mono; temporary engine path and execution-context limitation are in handoff. Preserve written IDs and positions; do not start N2 05 or remove legacy resources.


## 2026-10-09 — N2 04 technical integration complete

75 written +31 listening =106 independent scored responses,12 passages and5 new unscored examples. Combined written105minutes. Four-choice keys24/24/24/23; three-choice3/4/4. Written IDs/answer positions preserved; section balance, no triples/repeated short cycles and distinct21 earlier patterns checked. Text-only independent N2 tasks require no illustrations.

Final audio PCM3026336ms (50:26.336), target approximately50minutes by AI editorial judgment, no invented fixed tolerance. First full take3165636ms; remove13 unique redundant closing turns (shared response4 mirrors response3), preserving deciding evidence. Approved four voices, speed.9, intro2s, between turns.5s and answer12/12/12/8/15s retained. Original instrumental exactly60000ms/1440000frames aftergroup2 before allgroup3 orientation, announcements on both sides. Shared integrated dialogue3 played once for response3/4 with independent IDs/15000ms windows. Continuous direct original24kHz mono PCM32kbps,30 sidecars and music96kbps. All final files decoded and hashes/timelines/scripts/roles/options/windows checked. Partial intermediate MP3s replaced by cache-only atomic full-file assembly; no change of speech to repair file integrity.

Content, written, adapter, audio and focused adapter TypeScript PASS. Production runner/sharedUI RN-web harness: save three answers including both shared responses, Back/reopen/resume, incomplete submit, scoring and review; no page errors. Approved font/Back artwork materialized; three430x932 screenshots inspected. Chromium decoder/opening/pause/resume and automatic music-end continuation PASS. Supplied focus/backdrop context; this is not full-router/native-device or human listening acceptance. All human/native/perceptual/publisher/rights/release flags remain false.

Fresh gist1 assesses reserving flexible public space for emergency use rather than historical-photo certainty. Window-permission example4 replaced by interruption/clarification permission. Printed task/point alternatives refined to reduce longest-answer cues. Final independent-corpus lexical audit22masters/2170questions/197passages/98examples:0 exact,22 unchanged prior near candidates,0 new. AI semantic/difficulty review is not exhaustive native certification. No legacy content/assets input to authoring.

Session jlpt:jpapp:n2:original:04:v1; listening starts0ms. Spoken alternatives, advance gist/integrated questions, transcripts and internal explanations remain hidden. Registry is gated by completed runtime/audio metadata. Do not rerun initial authorship/permutation scripts or remove legacy resources before all30 complete. Preserve other21 original forms and concurrent Kaigo work.

After this narrow commit is published, fetched and WORK PERSISTENCE PASS, technical integrations22/30: N5/N4/N3 allsix and N2 01–04. Next N2 05. The user authorized exam/media/report publication to duykhanhtokio/japan-app recovery/jlpt-n3-n1. Reread startup/AGENTS/both full authoring documents/checkpoint/approved casting before new N2 05 authorship.


## 2026-10-09 — N2 05 technical integration complete

75 written +31 listening =106 independently authored scored responses,12 passages and5 fresh unscored examples. Combined written105minutes. Four-choice keys23/24/24/24; three-choice4/3/4. Stable IDs/answer positions; section balance, no triples/repeated short cycles and distinct22 earlier patterns checked. Text-only N2 tasks require no illustration.

Final audio PCM3004252ms (50:04.252), approximately50minutes by AI editorial judgment, no invented fixed tolerance. First full take3107788ms; six two-turn closing asides removed, retaining deciding evidence and contrasts. Theatre shortened-dialogue timing corrected from early to late; that turn and two refined spoken options freshly synthesized before final assembly. Approved voices8/118/11/21, speed.9, intro2s, turn.5s and answers12/12/12/8/15s retained. New original instrumental exactly60000ms/1440000frames aftergroup2 before allgroup3 orientation, announcements on both sides. Integrated dialogue3 played once for responses3/4, independent IDs and15000ms windows. Direct original24kHz mono PCM32kbps continuous track;30 sidecars and music96kbps. All final files decoded and hashes/timelines/scripts/roles/options/windows checked. Atomic MP3 assembly; no silence padding, speed changes or replay.

Content, written, adapter, audio and focused TypeScript PASS. Production runner/sharedUI RN-web harness: one correct and two wrong answers including both shared responses; save, Back/reopen/resume, incomplete submit, score1/2/103of106, review, no page errors. Approved font/Back artwork materialized; three430x932 screenshots inspected. Chromium decoder/opening/pause/resume and automatic music-end continuation PASS. Focus/backdrop context supplied; this is not full-router/native-device or human listening acceptance. All human/native/perceptual/publisher/rights/release flags remain false.

AI editorial repairs disambiguate variance/material elasticity, fix 注意せざるを得ない, constrain ordering dependencies, refine usage distractors and reduce longest-answer cues. Near 余地 sentence replaced by independent 手際 efficiency objective. Final independent-corpus lexical audit23masters/2276questions/209passages/103examples:0 exact,22 unchanged prior near candidates,0 new. AI semantic/difficulty review is not exhaustive native certification. No legacy content/assets used as authoring inputs.

Session jlpt:jpapp:n2:original:05:v1, listening0ms. Spoken choices, advance gist/integrated questions, transcripts and internal explanations remain hidden. Registry gated by completed runtime/audio metadata. Do not rerun initial authorship/permutation scripts or remove legacy resources before all30 complete. Preserve other22 original forms and concurrent Kaigo work.

After narrow publication, fetch and WORK PERSISTENCE PASS, technical integrations23/30: N5/N4/N3 allsix and N2 01–05. Next N2 06. The user authorized all exam/media/report publication to duykhanhtokio/japan-app recovery/jlpt-n3-n1. Reread startup/AGENTS/both full authoring documents/checkpoint/approved casting before new authorship.


## 2026-10-09 — N2 06 technical integration complete

75 written +31 listening =106 independently authored scored responses,12 passages and5 fresh unscored examples. Combined written105minutes. Four-choice keys24/23/24/24; three-choice4/4/3. Balanced sections, no triples/repeated short cycles and distinct23 earlier patterns. IDs/positions stable before recording. Text-only independent N2 tasks require no illustration.

Final audio PCM3000619ms (50:00.619), approximately50minutes by AI editorial timing review, not a fixed acceptance tolerance. Approved voices8/118/11/21 at speed.9, intro2s, turn.5s and answer12/12/12/8/15s. Original procedural instrumental exactly60000ms/1440000frames afterproblem2before allproblem3orientation, announcements on both sides. Shared final integrated dialogue played once for responses3/4, independent IDs and15000ms answer windows. Direct original24kHz mono PCM32kbps continuous track;30sidecars/music96kbps. Atomic MP3 assembly. All files decoded; scripts/options/voices/roles/hashes/timeline/windows checked. Any non-deciding content removals are itemized in editorial-review.json. No speed changes, silence padding or replay.

Content, written, adapter, audio and focused TypeScript PASS; UI lock10/10. Production runner/sharedUI RN-web harness: select/save one correct andtwo wrong responses, including both shared responses; Back/reopen/resume, submit103unanswered, score1/2/103of106, review,no pageerrors. Approved font/Back art materialized;three430x932screenshots inspected. Real Chromium decode/opening/pause/resume and automatic music-end continuation PASS. Focus/backdrop contexts supplied. Not full-router/native-device/perceptual/human acceptance; all corresponding publisher/native/rights/release flagsfalse.

AI editorial review fixes grammar ambiguity, constrains five ordering dependencies, refines collocation/particle distractors and removes systematic longest-correct-option cues. All stored rationales remain internal. Independent integrated decisions use nonconsecutive-day pricing eligibility/totalcost, time-conflicting staff assignments/qualification and actual cloth-exhibition choice/material-record duties. Final corpus lexical audit24masters/2382questions/221passages/108examples:0exact,22unchanged prior near candidates,0new. Literal reading/orthography sentence fields ensure actual sentence content is audited. This is not exhaustive native semantic/difficulty certification. No legacy content/assets used as authoring inputs.

Session jlpt:jpapp:n2:original:06:v1; audio0ms. Spoken alternatives, advance gist/integrated questions, transcripts and detailed explanations hidden. Registry gated by completed runtime/audio metadata. Preserve all23other forms and concurrent Kaigo work. Do not rerun scratch authorship/permutation scripts or delete legacy resources before full30replacement gate.

After narrow publication/fetch and WORK PERSISTENCE PASS, technical integrations24/30: allsix N5/N4/N3/N2. Next N1 01. N1 blueprint is70written+36listening,110written/55listen minutes. N1 pacing remains unconfirmed in voice-casting.json; present/confirm N1 timing before changing audition defaults or generating its final audio. Do not silently apply N2 pacing. No native/publisher review gate blocks authorized independent written authoring.


## 2026-10-09 — N1 pacing approved and N1 01 technical integration complete

70 written +36 listening =106 independent scored responses,12 passages and5 fresh unscored examples. Combined written110minutes. Four-choice keys23/23/23/23; three-choice5/5/4. Section balance, no triples/repeated short cycles, distinct24 earlier patterns; IDs and positions fixed before full synthesis. Text-only independent N1 tasks need no illustration.

Publisher explicitly approved N1 pacing on2026-10-09: intro2s, turn0.5s, answers12/12/12/8/15s; approved four voices8/118/11/21 at speed0.9 retained. Recorded/final PCM3318587ms (55:18.587), approximately55minutes by AI editorial judgment, not a fixed acceptance tolerance. No speed/pause change, silence padding or replay. New N1-specific procedural instrumental exactly60000ms/1440000frames afterproblem2before allproblem3orientation, with announcements. Three integrated stories serve four responses; last story played once for response3/4, independent saved IDs and15000ms windows. Direct original24kHz mono PCM24kbps continuous recording to fit connector transport;35 sidecars/music96kbps. Atomic MP3 assembly. All files decoded and scripts/choices/roles/hashes/timing/windows checked. Recorded/current master hashes retained; later edits only printed text, internal rationale and completion metadata.

AI editorial review repairs natural collocation, five ordering dependencies, female reason-giver casting and systematic option-length cues. Preliminary emergency-capacity argument replaced with independently developed expertise/teaching/experience argument. Final corpus25masters/2488questions/233passages/113examples:0 normalized exact,22 unchanged prior lexical near candidates,0 newN1 lexical candidates. Not exhaustive native semantic/difficulty certification or rights clearance. No legacy content/assets input. Fresh official sample-index HTML confirms N1 five skills; timing HTML timed out, so retained previously verified project110/55 metadata and explicit publisher timing choice, without claiming fresh official timing verification.

Content/written/audio/adapter/focused TypeScript PASS; UI10/10 unchanged. Actual Chromium full decoder/opening/pause and automatic music-end continuation PASS. Production runner/shared UI RN-web harness: select/save one correct andtwo wrong responses including both shared responses, Back/reopen/resume, submit103unanswered, score1/2/103of106, review, no pageerrors. Approved font/Back artwork materialized. Three430x932 screenshots visually inspected. Focus/backdrop contexts supplied; not full-router/native-device/perceptual/human acceptance. Publisher/native/perceptual/rights/release flagsfalse.

Session jlpt:jpapp:n1:original:01:v1, audio0ms. Spoken alternatives, advance gist/integrated questions, transcripts and explanations hidden. Registry gated by completed runtime/audio metadata. Preserve other24 originals and concurrent Kaigo work. Do not rerun initial scratch authorship/permutation scripts or delete legacy assets before full30replacement gate.

After narrow publication/fetch and WORK PERSISTENCE PASS, integrations25/30: N5/N4/N3/N2 allsix, N1 01. Next N1 02. User authorized exam/media/report publication to duykhanhtokio/japan-app recovery/jlpt-n3-n1. Before new N1 02 authorship reread startup/AGENTS/both full authoring documents/current checkpoint/approved casting. VOICEVOX0.25.2CPU owns same-context subprocess and restarts every6new syntheses; caches/logs excluded. Generator now accepts --level n1 and --continuous-bitrate-kbps24. Runtime harness retains scratch Chrome145/esbuild paths; restore dependencies if absent. No SHA-only follow-up commit.


## 2026-10-09 — N1 02 technical integration complete

70 written +36 listening =106 independent scored responses,12 passages and5 new unscored examples. Written110minutes. Four-choice keys23/23/23/23; three-choice5/4/5. Section balance/no triples/no repeated short cycles/distinct25 earlier patterns. Text-only tasks need no illustration. IDs/positions stable before recording.

Approved N1 voices8/118/11/21, speed0.9, intro2s, between turns0.5s, answers12/12/12/8/15s. First full take3215963ms (53:35.963); three task dialogues enriched with relevant color-certainty/acoustic-diagnostic/attendance-definition reasoning. Final PCM3284648ms (54:44.648), approximately55minutes by AI editorial judgment, difference-15352ms, no fixed acceptance tolerance. No silence padding/speed change/replay. Original instrumental exactly60000ms/1440000frames afterproblem2before allproblem3orientation, with two announcements. Three integrated stories serve four scored units; last played once with two independent15000ms answer windows. Direct original24kHz mono PCM24kbps continuous track;35 sidecars and music96kbps. Atomic assembly and all actual files decoded/scripts/choices/roles/hashes/windows checked.

AI editorial fixes tighten three ordering dependencies, natural text-grammar wording, three contextual lexical-confusion alternatives and ten reading option sets to remove longest-answer cues. Final corpus26masters/2594questions/245passages/118examples:0 normalized exact,22 unchanged prior near candidates,0 newN1 02 candidates. No repeated normalized complete option set involving this exam. Targeted semantic comparisons distinguish integrated decisions from N2 06/N1 01. AI semantic/difficulty review is not exhaustive native certification. No legacy content/assets input. Official timing/type HTML tables freshly checked:110/55 and five N1 listening skills; no linked question/PDF/answer/script/audio resources opened.

Content/written/audio/adapter/focused TypeScript and UI lock checks recorded separately. Real Chromium decoder/opening/pause and automatic music-end continuation PASS. Production runner/sharedUI RN-web harness: one correct/two wrong including both shared responses, save/Back/reopen/resume, submit103unanswered, score1/2/103of106, review,no page errors. Three430x932 screenshots visually inspected. Approved font/Back artwork materialized; focus/backdrop contexts supplied. Not full-router/native-device/perceptual/human acceptance. Project-wide TypeScript retains the existing unrelated TS2352 at life-content-repository.ts:47. Publisher/native/perceptual/rights/release flags remain false.

Session jlpt:jpapp:n1:original:02:v1; listening0ms. Spoken alternatives, advance gist/integrated questions, transcripts and internal explanations hidden. Registry gated by complete audio/runtime metadata. Preserve all other25 originals and concurrent Kaigo updates. Do not rerun initial scratch authorship/permutation scripts or remove legacy resources before the full30replacement gate.

After narrow publication/fetch and WORK PERSISTENCE PASS, technical integrations26/30: N5/N4/N3/N2 allsix, N1 01–02. Next N1 03. User authorized exam/media/report publication to duykhanhtokio/japan-app recovery/jlpt-n3-n1. Read startup/AGENTS/both full authoring documents/current checkpoint/casting at every new authoring session. Engine /tmp/jlpt-voicevox-0.25.2/linux-cpu-x64/run owns same-context subprocess and restarts every6new syntheses. Temp speech cache/logs excluded; generator --level n1 --continuous-bitrate-kbps24. No SHA-only follow-up commit.


## 2026-10-09 — N1 03 partial original continuation

Startup remote96c95bdd verified clean with WORK PERSISTENCE PASS; UI10/10. N1 03 now contains70written+14 immediate-response listening drafts,12passages and5 checked ordering solutions. 84of106 drafted responses; remaining22listening and5new unscored examples. No audio/adapter/registration/runtime completion yet; technical integrations remain26/30. Written keys6/6/6/7 and12/11/11/11; three-choice4/5/5. Remaining four-choice listening quota5/6/6/5 yields final23/23/23/23. Stable IDs/positions; recheck all group seams after remaining authoring.

AI editorial corrections remove a grammar ambiguity, refine usage alternatives and replace three adjacent reading themes with independently developed evidence/solution structures. Partial written/content validation and original-corpus lexical audit:0exact,22unchanged prior near candidates,0newN1 03 candidates. Not native semantic/difficulty or rights certification. All human/native/perceptual/release flagsfalse. Full details and next group counts, casting/pacing/break/runtime gates in original/n1-03/HANDOFF.md. New N1 03 opening must say 第三回. A prior N1 02 opening metadata mismatch 第一回 versus 第2回 is recorded there for targeted audio verification/correction.

After narrow publication/fetch and WORK PERSISTENCE PASS, continue SAME N1 03 from remaining22listening+5examples, not N1 04. User publication permission remains active. Preserve prior originals/concurrent Kaigo/UI and legacy resources until full30replacement gate.
