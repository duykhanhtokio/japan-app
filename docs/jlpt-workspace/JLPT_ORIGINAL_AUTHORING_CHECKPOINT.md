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
