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
