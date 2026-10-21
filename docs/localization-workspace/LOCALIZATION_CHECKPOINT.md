# App localization checkpoint — 2026-10-18

User scope: correct Vietnamese defaults across the app and inventory translations for learning content and conversations in all 13 supported languages. Japanese remains canonical learning/assessment text. Publisher update 2026-10-19: construction review tests do not require translations and are excluded from translation backlog reports and audits. Their Japanese questions, choices, grading and lesson references remain unchanged.


## Việc chưa hoàn tất — phiên âm hội thoại (2026-10-19)

- **DIALOGUE-FURIGANA-001 — OPEN / dữ liệu đã bổ sung một phần, giao diện NPC chưa áp dụng.** Người dùng báo còn nhiều câu hội thoại thiếu phiên âmひらがな. Bổ sung furigana cho nội dung tiếng Nhật trong **cả ô NPC và ô người chơi**, đồng bộ cách trình bày và kích cỡ chữ với ảnh mẫu: chữ đọcひらがな nhỏ phía trên đúng từ/kanji, căn theo chữ chính, không chồng chữ hay cắt mất phiên âm. Ảnh có ô người chơi làm mẫu; ô NPC trong ảnh chưa có phiên âm. Không tự suy ra cỡ px từ ảnh chụp.
- Cập nhật2026-10-20: đã kiểm kê toàn bộ7.128 hội thoại; dữ liệu hiện có36 lượt NPC và30 lượt người chơi có phiên âm khớp nguồn, đủ11 lượt cho6 hội thoại đầu. Lượt tiếp tục này bổ sung50 dòng cách đọc mới. Dữ liệu người chơi được bộ nạp ứng dụng sử dụng; bản sửa hiển thị NPC vẫn lưu riêng, chưa áp dụng. Thử nghiệm phông chữ với Chromium153 và133 đều lỗi nên chưa xác nhận hiển thị trên trình duyệt/thiết bị. Tiến trình dịch đã được người dùng yêu cầu tiếp tục.
- **Bắt buộc nêu lại mục OPEN này trong lần báo cáo/kiểm tra tiến độ app tiếp theo**, kèm tiến độ dữ liệu và phần hiển thị còn chờ; không coi số hội thoại đã dịch là bằng chứng đã đủ furigana. Khi được tiếp tục xử lý: kiểm kê toàn bộ câu đang dùng ở hai ô, bổ sung cách đọc đúng ngữ cảnh, kiểm tra hiển thị theo ảnh trên iPhone và các kích thước màn hình hỗ trợ, rồi mới đánh dấu hoàn tất.
- Ảnh tham chiếu người dùng: `2026-10-19 20.37の画像.jpeg`, ChatGPT Library `libfile_c163d3aec1f0819194635ce78409114a` (iPhone16 Plus Simulator; ảnh được xem khi ghi nhận).


## Parallel content update — 2026-10-18

The user explicitly requested six independent AI workers. Language ownership: en/id; zh-CN/zh-TW; hi/bn; ne/my; th/km; tl. Workers wrote only their assigned locale files and checked their own outputs. The coordinator integrated runtime adapters and performed technical source/ID/coverage/browser checks; no semantic cross-review was performed. Vietnamese dialogue batch001 belongs to the coordinator.

- Foreman: 28 lessons,250 total units now have all12 supporting translations; Japanese remains canonical. Locale overlays are merged only after independent exact-source validation, so a stale pack cannot erase a valid other locale.
- Occupation catalog:278 names ×11 newly supplied languages now resolve in the active runtime adapter with exact Japanese-source guards.
- Legacy lessons:71 fields ×11 newly supplied languages; profile occupations/communication titles:16 ×11. Category/tag and Profile pass whole source records to the adapter.
- Construction review: only representative links to identical full lesson bodies are rendered. Original question references, stable question IDs, grading and lesson content are preserved.
- Local dialogue batch001:10 scenarios,110 total turns in each of12 languages, plus50 player task hints per language. Locale/turn/speaker/Japanese sentence/Japanese hint are bound independently. Authored task hints take precedence over answer-meaning fallback.
- New translations remain `translated_ai_unreviewed`, with native/domain approval unchanged. These are presence/source-binding checks, not native-language certification.

## Verified fixes

- Replaced broad Unicode language guessing with exact authored UI-source matching. Thai, Myanmar, Khmer, Devanagari, Bengali, names and English dictionary text are preserved. Unknown content is not claimed to be translated.
- Added 89 explicit interface/legacy quiz strings in 13 languages. Joined adjacent text/number children before resolving templates so counts and dates no longer break translation matching.
- Home, Learn, Profile, sector list, dictionary part-of-speech labels, kana labels, audio preview, listening editor and question loading messages now use selected-language copy where repaired.
- Old industry/module/lesson/player/mission renderers use exact locale fields (including existing *Translations and *En) rather than always rendering *Vi. Category/tag headers no longer expose a Vietnamese support field to other locales. Missing support text uses a localized pending notice; Japanese source remains visible separately.
- LanguageProvider rejects invalid saved codes, updates the selected language immediately even if storage fails, serializes saves and protects a newer selection against an older startup read.
- Generic city dialogue loading now applies the same exact-source/speaker translation bundles as directly named scenarios. Saved IDs are unchanged.
- Only kana labels in the shared section route changed; exam branch bytes are identical. See CHARACTER_LOCALE_AUTHORIZATION.md; approved UI lock passes 10/10.

## Actual coverage

Values below mean usable exact-locale presence with source-revision guards where the runtime provides them. They do not certify translation semantics or native review. English or Japanese fallbacks are never counted as translations for another locale.

| Area | Finding |
|---|---|
| Vocabulary | 8,350 meanings and 8,350 Japanese practical examples have all 12 supporting translations. |
| Grammar | 540 catalog patterns have all 12 supporting translations. N5 calendar continuation retains its separately validated 398 progress keys / 103 distinct patterns. |
| Construction lessons | 10,250 translatable title/paragraph/prompt/activity/term/caption units across non-foreman runtime sessions have all 12 translations. |
| Foreman 職長 | 28 sessions;250 units have all12 supporting translations (11 languages added in this update). Original Japanese/Vietnamese lesson files remain byte-preserved. |
| Kaigo active Japanese masters | 6,242 heading/paragraph/caption units and 176 lesson metadata records pass all 12 locales and current source revisions. |
| Kaigo tests | 687 weekly questions plus 360 mock questions across 12 forms pass their full-question validation in all 12 locales. |
| Local conversations | 7,128 effective scenarios. 2671 have technical source-bound sentence/task coverage in all12 locales; 2671 are author-ready after excluding pending own editorial holds. See DIALOGUE_TRANSLATION_PROGRESS.json. |
| Authored conversation tasks | 2671 author-ready scenarios have all5 Japanese-source-bound tasks in all12 locales; 0 indexed scenarios remain under their authors’ editorial holds. Native/domain review is unconfirmed. |
| Older work conversations | Some English/Vietnamese and a few other translations exist, but the 2-scenario / 16-turn bank is not complete across languages. |
| Registered occupation/operation names | The ACTIVE runtime adapter now resolves all278 identifiers in all12 supporting languages. New locale entries are accepted only when their Japanese source matches the active occupation name. |
| Older lessons/modules/categories/tags | All71 source fields across the audited older lesson/module/industry/category/tag/mission/dialogue records now have all12 supporting translations.16 profile occupation/communication titles also have all12. Unknown or changed source text remains pending rather than silently using Vietnamese. |
| JMdict | The dictionary service selects English glosses, not locale-specific glosses. It is separate from the fully localized 8,350-word study bank. |
| Historical JLPT catalog | 58 structured official + 2 pending official + 5 older mock entries. Existing explanation packs are inventoried separately; they are hidden by approved review behavior and not counted as selected-language question support. |
| JLPT authored exams | 30 integrated Japanese forms / 3,018 questions. Questions remain Japanese by assessment design; this does not mean native-language question translations exist. Locked exam UI, answers, listening and saved sessions were preserved. |

## Checks and limits

- check-app-localization.cjs: 173 UI source files passed syntax transformation; 9 actual screens × 13 locales = 117 route checks. Includes selected-language UI, dynamic counts, preserved native scripts and dictionary text, no Vietnamese leakage in the exercised routes, invalid storage, rapid writes and storage-write failure.
- check-localization-content.cjs: full source-bound foreman/job/legacy/profile/batch001 checks, original foreman preservation, independent stale-locale handling and deduplication across all active construction questions.
- check-localization-content-browser.cjs:13 foreman reader locales,48 paragraph translation checks;40 actual submitted construction questions,45 duplicate visible links removed, source modal still opens.
- check-dialogue-localization.cjs: actual loader for direct/generic fixtures and10 real scenarios;1,320 turn translations and600 player task hints verified through the real loader; exact source/speaker guards and stable IDs pass.
- Existing grammar catalog and calendar data validators pass; approved exam UI lock passes 10/10; git diff whitespace check passes.
- Runtime browser tests use explicit artwork, native-service and dictionary backend adapters. No native-device, production Expo, full-image OCR or native-speaker certification is claimed.
- Full static scan is an inventory, not a claim that every app label is translated. Japanese-only portal preview UI and limited-locale calendar/task copy still need authored locale coverage. Legacy Kaigo reference/practice data is not counted as the active translated weekly course.
- Local dialogue translation is incomplete. No placeholders, sentence substitutions or machine-generated completion flags close the remaining corpus gaps recorded in DIALOGUE_TRANSLATION_PROGRESS.json.

## Resumable evidence

- coverage.json: exact group-by-language presence, scenario counts and audit limitations.
- coverage.csv: compact comparison matrix (translated units per locale).
- missing.ndjson.gz: every missing unit ID with its missing locale list, losslessly compressed. Decompress with standard gzip tools.
- ui-candidates.json: static Vietnamese source candidates, including legitimate locale tables and review metadata; these are leads, not automatically classified runtime defects.
- runtime-qa.json and dialogue-routing-qa.json: observed regression results.
- Run audit-app-localization.cjs with TOKUTEI_QA_MODULES pointing to esbuild dependencies; a full checkout must include docs/ssw-workspace because construction runtime lessons import those source files.

Current full-corpus continuation is governed by [DIALOGUE_TRANSLATION_CHECKPOINT.md](DIALOGUE_TRANSLATION_CHECKPOINT.md), the complete remaining queue, and derived DIALOGUE_TRANSLATION_PROGRESS.json. Six workers now own two languages each, including Vietnamese. Validated locale files may be saved independently while unrelated unfinished work is preserved; only complete twelve-locale batches become runtime-indexed. Preserve Japanese sources, stable IDs and review flags. Continue until all7,128 scenarios have every NPC/player sentence and task hint in every supporting language.
