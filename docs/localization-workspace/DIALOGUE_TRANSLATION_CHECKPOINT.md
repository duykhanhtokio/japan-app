# Full local dialogue translation continuation — 2026-10-18

Publisher instruction: finish all dialogue translations with six independent AI workers; no overlapping file ownership and no semantic cross-review. A validated/persisted batch is a checkpoint, not a stopping point.

## Scope and source

- Canonical active corpus:7,128 scenarios,11 turns each,6 NPC sentences and5 player answers. Translate all Japanese NPC/player text and the five Japanese player task hints into all12 supporting languages.
- Durable baseline before this run:15d4e5f6. Baseline sentence coverage is11 scenarios, while full source-bound sentence+task coverage is10. The original first scenario needs the remaining task-hint bindings.
- `DIALOGUE_TRANSLATION_QUEUE.json` records all712 remaining ten-scenario batches (002–713; the final batch has7). Sources are extracted on demand from the canonical Japanese data, using the stored start/count; preserve Japanese and stable turn/scenario IDs.
- Special batch000 preserves the first scenario's already translated sentences byte-for-byte and supplies all five exact-source task hints per locale. Existing batch001 is preserved.

## Independent ownership through batch029

| Worker | Exclusive languages |
|---|---|
| dialogue_en_vi | en,vi |
| dialogue_id_tl | id,tl |
| dialogue_zh | zh-CN,zh-TW |
| dialogue_hi_bn | hi,bn |
| dialogue_ne_my | ne,my |
| dialogue_th_km | th,km |

From batch030 onward, each worker owns all12 locale files for disjoint scenario batches. The owner slot is `(integer(batch)-30)%6`: en_vi=0, id_tl=1, zh=2, hi_bn=3, ne_my=4, th_km=5. Each group advances by six batches through its final assigned batch (708–713). Finish the original language-pair assignments through029 before starting the new assigned queue. `DIALOGUE_TRANSLATION_OWNERSHIP.json` is the machine-readable authority. This balances differing translation lengths while preserving exclusive files and no semantic cross-review.

Readiness requires full natural target utterances retaining every Japanese clause, condition and detail. Structural nonempty/source checks alone do not establish this. Workers author and self-compare one or two scenarios at a time in scratch, then publish the completed locale file; never shorten content to fit a batch or context. All future markers include `fullUtteranceFidelityChecked:true`. `DIALOGUE_TRANSLATION_AUTHOR_HOLDS.json` records author-withdrawn files and own corrections; held batches are excluded from completion counts until their authors re-confirm full fidelity with matching final hashes. Source-bound technical coverage remains reported separately. AI-unreviewed means no native/domain certification, never permission for summaries or fragments.

Workers read canonical Japanese and their own translations only. Coordinator integration/coverage/source-binding checks are technical, not semantic cross-review. All new material remains AI-unreviewed; no native/domain approval is implied.

## Integration and durability

1. Each worker completes editorial and source QA in its own scratch files, publishes one complete `locale-batches/LOCALE/NNN.json` atomically, then writes an explicit final SHA256 ready marker at `dialogue-ready/LOCALE/NNN.json` in the coordinator scratch directory. Marker fields are owner, language, batch, relative repository path and sha256. A complete JSON file appearing on disk is not a readiness signal. The file and marker are immutable after this handshake. Never commit placeholders or partial JSON.
2. Coordinator selects only files with hash-matching final owner-ready markers, then checks exact scenario/turn IDs, Japanese sentence, speaker, task source and all nonempty values. Existing committed clean files are trusted; modified tracked files are preserved and reported for explicit recovery. New batch000 additionally verifies existing sentence translations were preserved.
3. Persist completed locale files in narrow commits, with GitHub branch leases and exact tree/blob verification. Keep other workers' unrelated unfinished files untouched.
4. `node scripts/check-work-persistence.mjs --paths FILE ...` verifies completed files exist in HEAD, are clean, and HEAD exactly matches the fetched and advertised remote. It explicitly reports unrelated unfinished work as preserved. The no-argument gate still requires the entire working tree clean. This scoped gate supports the publisher's parallel-worker instruction; it does not count unfinished files as saved.
5. All six workers continue their exclusive language queues without waiting at arbitrary batch boundaries. Each completed locale file is immutable; the coordinator persists completed files while workers translate later batches. A worker never stages or commits. Unpersisted files remain explicitly unfinished until the scoped remote gate passes. Only add a batch to `locale-batch-index.json` after all12 locale files pass `check-dialogue-translation-batches.cjs --batches NNN --integrate`.
6. `DIALOGUE_TRANSLATION_PROGRESS.json` is derived from validated integrated batches. Sentence-only coverage is separate from full sentence+task coverage. `check-dialogue-localization.cjs` checks all indexed batches through the real loader.
7. Continue until every canonical scenario has every sentence and task in every supported locale, then perform the full corpus audit and the global clean-tree persistence gate. Do not mark the corpus complete based on an English/Vietnamese fallback, placeholder, partial batch or count alone.

## 2026-10-19 explicit handover

For batch094 only, dialogue_zh exclusively authors the previously absent my/th/km locale files after completing batch098. dialogue_ne_my retains hi/bn/ne and its already published id/tl/Chinese files. The exact three transferred paths are recorded in DIALOGUE_TRANSLATION_OWNERSHIP.json. No file ownership overlaps, and no semantic cross-review is introduced. Construction assessment translations are outside the publisher's required translation scope and excluded from backlog reporting.


## 2026-10-19 checked continuation and pending remote approval

- Rechecked all1,104 previously integrated locale files against the stored final SHA256 hashes: no mismatch. Baseline remote-verified HEAD was525c0de1625f4002a1423a04835eae6c2266990b, with911 complete scenarios.
- Seven existing author-ready locale files were preserved in local commit99da3a70 after exact-source/ID/speaker/task and owner-marker hash checks. GitHub push was rejected by automatic approval review. This commit and subsequent local work must not be reported as remote-saved until explicit approval, push, fetch and scoped persistence verification succeed.
- Six independent assignments filled missing km089, my091, my094, my096, km096. All five published complete files have immutable matching owner-ready markers and full own-language fidelity checks. Batches089/091/096 are integrated after all12-locale checks; the actual app loader validates941 scenarios,124,212 translated turn bindings and56,460 task-hint bindings. Complete scenarios941/7,128; remaining6,187. Native/domain review remains unconfirmed; no semantic cross-review was performed.
- km094 did not publish: its author encountered model capacity errors. Preserve the unfinished author script at /workspace/scratch/3014ed9128c9/km094-author/author.py (six scenarios drafted according to the author). It has no final owner-ready marker, is not runtime-integrated and is not included in completion counts. Do not replace or certify this unfinished translation. Source and completed eleven locale files remain intact.
- Next: obtain approval for the concrete pending dialogue commits to duykhanhtokio/japan-app, recovery/jlpt-n3-n1; push/fetch and pass the scoped work-persistence gate. Then resume the same km094 author, finish own fidelity QA and all12-locale integration; continue093 (ne/my/th/km), then unstarted095/097 and subsequent exclusive queues. Construction assessment translations remain excluded.


## 2026-10-19 approved publication and resumed ownership

The publisher explicitly authorized both pending commits and continuation. Direct Git HTTPS lacked credentials, so the authenticated GitHub connector published equivalent exact content trees: local99da3a70 -> remote687e8c416f132cf7ee4edebf1757933bd67c8056 (tree efbafe25bfb4713269ee5927067cc797760f72d4), local775f6808 -> remoteb1e6526120d917e7c60e4e721361b410374ca1ea (tree7ddaf847ae5968ebf330965ad441fe715324ede2). The branch ref and each commit tree/parent were independently read back from GitHub. Exact GitHub commit objects were reconstructed and SHA-verified locally; local branch alignment preserved all work. This authenticated connector verification is the evidence; no claim is made that the CLI persistence validator passed without HTTPS credentials.

The same km094 author resumed and completed full own fidelity QA, publishing its final immutable marker. Batch094 now has all12 locales and passes source/ID/speaker/task coverage; local integrated total is951/7,128, remaining6,177. Completed content is persisted independently while integrated reports are finalized.

Six independent subtasks continue under each batch's logical owner (no transfer or file overlap): missing km/my/ne/th093 under dialogue_hi_bn; then095 en/vi, id/tl, zh-CN/zh-TW, hi/bn, ne/my, th/km under dialogue_th_km. The canonical095 source is newly extracted using queued start941,count10. No semantic cross-review; each author checks only their own Japanese-source-aligned locale files. Do not infer a completed095 batch from partial published locale files.


## 2026-10-19 complete093 and persisted095 locale files

All12 locales of093 passed owner-ready/hash and exact source/ID/speaker/task checks; integrated count961/7,128, remaining6,167. The real loader verifies126,852 turn bindings and57,660 task bindings. Completed095 locale files are separately persisted;095 must remain unindexed until all12 final author-ready markers pass. Native/domain review remains false and semantic cross-review is not performed. The Chinese095 author retains its unfinished strings at /workspace/scratch/3014ed9128c9/zh095-author/strings.json; finish own final QA and exact-locale publication before integrating095. After095, the next queued unstarted source is097(start961,count10).

Authenticated GitHub connector readbacks have verified each publication's branch ref, commit parent and exact content tree, including remote checkpoints565d2042,6938d671,d52e15f0. The CLI has no HTTPS credentials; do not claim a CLI persistence-gate pass. Author-ready files and reports are committed narrowly while the pre-existing unrelated temporary evidence file is preserved.


## 2026-10-19 all assigned work completed and095 integrated

All six independent assignments finished. Both095 Chinese locale files are now final, own-fidelity-checked and immutable author-ready; the earlier unfinished Chinese note is superseded. Batch095 passes all12 exact-source/ID/speaker/task checks and is integrated. Current total971/7,128 complete scenarios; remaining6,157. Real-loader validation passes128,172 turn-language bindings and58,260 task-language bindings; native/domain review is false and no semantic cross-review was introduced. Entire indexed corpus file hashes are rechecked against the final manifest.

This continuation completed30 additional scenarios beyond the publisher-approved941 checkpoint:094,093,095. Every newly authored ready locale file is preserved in narrow commits and published through the authenticated GitHub connector with branch-ref leases and exact commit/tree/blob readbacks. Intermediate durable checkpoints includea4fb2e4c,565d2042,6938d671,d52e15f0,3169818f. No worker remains authoring a partially assigned file. Preserve the unrelated pre-existing temporary evidence file.

Next unfinished queued source:097(start961,count10), then099(start981,count10);098 was already complete and must not be rewritten. Existing093/094/095/096 are complete and must not be restarted. Continue disjoint ownership and complete utterance+task fidelity rules, then technical integration and authenticated persistence. No pending release/native-review certification is implied.


## 2026-10-19 continuation from remote03b3c324

The user requested continued work. Authenticated GitHub branch-ref readback confirms03b3c324ad9cc0fb8080ab20dfcaef225a0c1c7a; local HEAD and remote-tracking HEAD match, with the unrelated pre-existing temporary evidence file preserved. Baseline971 complete scenarios;6,157 remain.

Sources097(start961,count10) and099(start981,count10) were extracted from current canonical Japanese;098 is complete and preserved. Six exclusive language-pair subtasks process097 then099: en/vi, id/tl, zh-CN/zh-TW, hi/bn, ne/my, th/km. Batch097 retains logical owner dialogue_id_tl and099 retains dialogue_hi_bn; these are delegated file-disjoint subtasks under those owners, with no semantic cross-review. Each file is published and persisted independently only after full own-language fidelity QA and a matching immutable final owner-ready marker. Each batch is integrated only after all12 locales pass source/ID/speaker/task checks. No draft/placeholder is counted complete.


## 2026-10-19 batch097 complete

All12 independent author-ready locale packs for097 pass canonical source/ID/speaker/task and exact marker/file-hash checks. Batch097 is integrated, total981/7,128, remaining6,147. The actual app loader passes129,492 turn-language bindings and58,860 task-language bindings, including stale-source and wrong-speaker guards. Source099 is in progress with independent completed locales persisted; do not count it complete until all12 locales are author-ready and integrated. Native/domain review remains false. Six assigned language-pair queues remain nonoverlapping, with each author self-checking only its own full natural translations. Broad coverage reports are refreshed at the next complete-batch checkpoint; DIALOGUE_TRANSLATION_PROGRESS.json is authoritative for integrated counts.


## 2026-10-19 batches097 and099 fully complete

All six independent language-pair assignments for097/099 are finished. Every locale file contains110 full utterances and50 Japanese-source-bound task hints, has its author's full-fidelity confirmation and immutable matching final SHA256 marker, and passes exact canonical source/ID/speaker/task validation. No semantic cross-review was performed; native/domain approval remains false.

Both batches are integrated. Current total991/7,128; remaining6,137. This continuation added20 complete scenarios,2,640 turn translations and1,200 task-hint translations beyond remote03b3c324's971 baseline. Actual loader validation passes130,812 turn-language bindings and59,460 task-language bindings across991 scenarios, including stable IDs, generic/direct loading and stale-source/wrong-speaker rejection. All1,200 indexed locale files are checked against the derived manifest hashes. Broad coverage reports are refreshed to the same integrated snapshot.

Completed content was published incrementally through the authenticated GitHub connector, with leased branch updates and independent branch/commit/tree readbacks. Intermediate verified checkpoints include02af27ef,d41104a2,605ba3e7,5a870085,6513ca5d,11a21922. Local exact commit objects were reconstructed/hash-verified and branches aligned without overwriting work. CLI HTTPS credentials remain unavailable; these connector readbacks, rather than an invented CLI persistence-gate pass, establish remote persistence. The unrelated pre-existing temporary evidence file remains untouched.

Next unfinished source:100(start991,count10), logical owner dialogue_ne_my under the existing stride6 rule. Source098 remains complete and was not rewritten. Continue six file-disjoint translation subtasks, full utterance+hint fidelity, per-file author readiness, all12-locale integration and authenticated persistence. No currently assigned locale file is unfinished.


## 2026-10-19 performance workflow applied

The publisher requested higher speed and efficiency. The tested dialogue-translation-worker.cjs now supplies compact source views and assembles exact-source/ID-bound packs and immutable ready markers from authored160-string arrays. Batch100 measured40% smaller source input bytes, with all160 Japanese utterance/task bindings preserved. See DIALOGUE_TRANSLATION_PERFORMANCE.md for the full protocol and measured limitations.

Six existing independent language-pair authors have disjoint queues100–105,60 scenarios across12 locales, and continue through each pack without waiting for all twelve languages or a coordinator checkpoint. Correct logical ownership is resolved by the helper from the existing machine policy. Content is saved in groups of completed ready files with a maximum five-minute persistence interval; full whole-app coverage/loader scans are deferred to the larger cohort checkpoint rather than repeated after every ten scenarios. Every new file still receives full own-language fidelity QA and exact technical/hash validation. Baseline remote checkpointcce6d9dc has991 complete scenarios; current draft work is not counted until all12 locales are final and integrated. Native/domain review remains false, with no semantic cross-review.


## 2026-10-19 resumed optimized cohort after user continuation

The live worker registry was empty at resume; existing ready markers, completed files and private drafts were preserved. Six replacement exclusive author roles now finish the exact30 remaining paths in DIALOGUE_TRANSLATION_ACTIVE_QUEUE.json; the roster supersedes previous future-file assignments. Completed Chinese100–105 and other ready files remain immutable. New assignments balance unfinished script-heavy work across workers while preserving each path's helper-derived logical owner. Prior acknowledgements confirmed105 th/km andne/my had not been authored; unfinished own-role102/103 drafts are resumed without semantic cross-review or duplicate authoring. The roster records assignments, not a claim of live processes.

All new source/ID/speaker/task and marker/hash checks still apply. Completed packs are saved in groups while the cohort continues. The full integrated progress/audit refresh remains at the larger complete-cohort checkpoint. The connector publisher helper is retained in coordinator scratch to avoid recreating it at each user continuation; credentials are never stored in that helper.


## 2026-10-19 optimized100–105 cohort fully complete

All72 locale packs across100–105 are final author-ready, with full own-language Japanese-clause fidelity confirmation and immutable matching markers. Both acknowledged load-balancing handovers (bn105 andmy105) are complete. No file was authored concurrently or semantically cross-reviewed. The active cohort roster is marked COHORT_COMPLETE_AI_TRANSLATIONS; no assigned file remains unfinished. Native/domain review remains false.

All six batches are integrated, adding60 complete scenarios,7,920 translated utterances and3,600 task hints (11,520 target-language values) beyond the991 baseline. Current full source-bound sentence+task total1051/7,128; remaining6,077. The actual app loader passes138,732 turn-language bindings and63,060 task-language bindings, with stable IDs, direct/generic loading and stale-source/wrong-speaker guards. All1,272 indexed locale-file hashes match the derived progress manifest. Full whole-app coverage reports are refreshed once for this larger completed cohort; interim source/ID/speaker/task/hash checks and content persistence were maintained for every new pack.

The optimization is implemented and tested in dialogue-translation-worker.cjs/check-dialogue-translation-worker.cjs: compact Japanese input is40% smaller on batch100; authors generate160 ordered values while IDs/source/owner/marker assembly are mechanical and immutable. Scratch drafts are checkpointed every1–2 scenarios. Six file-disjoint queues continue across packs; completed authors take acknowledged unstarted files to reduce idle time. Input-size reduction is not a claim of a fixed overall speed multiplier. Complete ready files were published in groups with leased GitHub ref updates and exact blob/tree/commit/ref readbacks (includingf11d9b0b,ee1d5c4c,866ddb5e,75bf40a2,5b7f3173,a84ca176,928c12b8). The CLI still lacks HTTPS credentials, so no CLI persistence-gate result is invented. The unrelated pre-existing temporary evidence file is preserved.

Next unfinished source:106(start1051,count10), logical owner dialogue_ne_my. Preserve all completed100–105 packs and continue the optimized disjoint-author/fidelity/persistence protocol rather than restarting them. The remaining6,077 scenarios are still unfinished and are not closed by fallback text or placeholders.


## 2026-10-19 continuation106–111

Authenticated GitHub ref, local HEAD and remote-tracking HEAD match58e6428c9e8e4e457823d59b7e0c318eb58d7e35. Baseline1051 complete scenarios;6,077 remain. Six new prepared canonical sources106–111 cover60 scenarios from queued start1051 through1101, ten each. Completed100–105 packs are preserved.

The active roster assigns six disjoint language pairs across all six new batches: en/my, vi/km, id/ne, tl/hi, zh-CN/bn, zh-TW/th. Pairing a Latin/Chinese locale with a longer-script locale distributes writing load without overlapping files. Authors checkpoint scratch every16–32 units, self-check every complete utterance/condition/hint and publish each160-value pack through the tested helper. Full corpus audits are deferred to the complete cohort checkpoint; every new file retains technical source/ID/speaker/task/hash checks and incremental authenticated persistence. Do not count draft or fallback content as complete. Native/domain review remains false and no semantic cross-review is authorized.


## 2026-10-19 optimized106–111 cohort fully complete

All72 locale packs across106–111 are final author-ready, including acknowledged exclusive km110/km111 handovers. Each160-value pack has complete own-language Japanese-source fidelity confirmation and an immutable matching SHA256 marker. No semantic cross-review was performed; native/domain review remains false. No assigned file remains unfinished.

All six batches are integrated, adding60 complete scenarios,7,920 translated utterances and3,600 translated task hints. Current complete source-bound sentence+task total1111/7,128; remaining6,017. Exact canonical source/ID/speaker/task validation passes. The actual application loader passes146,652 turn-language bindings and66,660 task-language bindings across1111 scenarios, including stable IDs, generic/direct loading and stale-source/wrong-speaker guards. All1,344 indexed locale-file SHA256 values match the derived progress manifest. Whole-app coverage reports were refreshed once for the complete cohort.

Completed packs were persisted incrementally through authenticated GitHub connector updates with exact blob/tree verification, expected-parent ref updates and independent commit/ref readback. Verified checkpoints include90e5faec,a670d445,8b90f5a8,370d3e0c. Local commit objects were reconstructed and hash-verified from authenticated receipts without overwriting working files. CLI HTTPS credentials remain unavailable, so no CLI persistence-gate pass is claimed. Final integration uses the same authenticated publication protocol.

Next unfinished source:112(start1111,count10), logical owner dialogue_ne_my under the existing stride6 queue. Preserve completed106–111 packs and continue compact-source, disjoint authoring, own-fidelity QA, immutable per-file readiness and incremental persistence. The remaining6,017 scenarios are unfinished.


## 2026-10-19 continuation112–117

Authenticated GitHub ref and local/tracking HEAD match5398b461f204d24eb7b286207bdf35eb8af6912d. Baseline1111 complete scenarios;6017 remain. Prepared sources112–117 cover60 scenarios from start1111 through1161. Six exclusive language-pair authors continue en/my,vi/km,id/ne,tl/hi,zh-CN/bn,zh-TW/th. Existing packs remain immutable. Drafts checkpoint every16–32 values; complete160-value locale packs receive full own-source fidelity QA and helper technical/hash validation before incremental authenticated persistence. Full audits run at complete cohort integration. Native/domain review remains false; semantic cross-review is not performed.


## 2026-10-19 optimized112–117 cohort fully complete

All72 locale packs across112–117 are final author-ready, including acknowledged exclusive km116/km117 handovers. Every160-value pack has full own-language Japanese-source fidelity confirmation and an immutable matching SHA256 marker. No semantic cross-review was performed; native/domain review remains false. No assigned file remains unfinished.

All six batches are integrated, adding60 complete scenarios,7,920 translated utterances and3,600 task hints beyond1111. Current full source-bound sentence+task total1171/7,128; remaining5,957. Exact source/ID/speaker/task validation passes. The actual application loader passes154,572 turn-language bindings and70,260 task-language bindings across1171 scenarios, with stable IDs, generic/direct loading and stale-source/wrong-speaker guards. All1,416 indexed locale-file SHA256 values match the derived progress manifest. Whole-app coverage reports were refreshed once for the full cohort.

Completed packs were incrementally persisted using authenticated GitHub exact blob/tree verification, expected-parent branch updates and independent commit/ref readbacks; verified checkpoints include6078a2fc,d5b95a8d,f97f55c9,ea27f470,ab63f747,612c8349,4da72ce2,e800346c. Local exact commit objects were reconstructed/hash-verified from authenticated receipts without overwriting files. CLI HTTPS credentials remain unavailable; no CLI persistence-gate pass is claimed. Final integration follows the same authenticated publication protocol.

Next unfinished source:118(start1171,count10), logical owner dialogue_ne_my. Preserve completed112–117 packs and continue compact sources, disjoint authoring, full own-fidelity QA, immutable markers and incremental persistence. The remaining5,957 scenarios remain unfinished.


## 2026-10-19 continuation118–123

Completed112–117 integration is authenticated remote-verified at22dcc234dd247e929cd9b88ba7d36783e3be8434. Baseline1171 complete;5957 remain. Continue without stopping at this checkpoint. Prepared118–123 sources cover60 scenarios starting1171 through1221. Six fresh exclusive language-pair authors use compact Japanese input, checkpointed16–32-value drafts,160-value full own-fidelity helper publication and incremental authenticated persistence. Existing completed packs are immutable; native/domain review false, no semantic cross-review. Whole-app audits are deferred to complete cohort integration.


## 2026-10-19 optimized118–123 cohort fully complete

All72 locale packs are final author-ready, including recorded acknowledged exclusive handovers. Every pack has full own-language Japanese-source fidelity confirmation and an immutable matching SHA256 marker. No semantic cross-review was performed; native/domain review remains false. No assigned file remains unfinished.

All batches are integrated, adding60 complete scenarios,7,920 translated utterances and3,600 task hints beyond1171. Current full source-bound sentence+task total1231/7,128; remaining5,897. Exact canonical source/ID/speaker/task validation and actual app loader pass162,492 turn-language bindings and73,860 task-language bindings with stable IDs, direct/generic loading and stale-source/wrong-speaker guards. All1,488 indexed locale-file hashes match the derived progress manifest. Whole-app coverage reports were refreshed once for this complete cohort.

Content was persisted incrementally through the authenticated GitHub connector with exact blob/tree verification, expected-parent branch updates and independent commit/ref readbacks. Final integration uses the same protocol. Local exact commit objects are reconstructed/hash-verified from authenticated receipts without overwriting work. CLI HTTPS credentials remain unavailable; no CLI persistence-gate pass is claimed.

Next unfinished source:124(start1231,count10), logical ownerdialogue_ne_my. Preserve completed packs; continue compact-source, disjoint authoring, full own-fidelity QA, immutable markers and incremental persistence. The remaining5,897 scenarios remain unfinished.


## Việc chưa hoàn tất — phiên âm hội thoại (2026-10-19)

- **DIALOGUE-FURIGANA-001 — OPEN / chưa thực hiện.** Người dùng báo còn nhiều câu hội thoại thiếu phiên âmひらがな. Bổ sung furigana cho nội dung tiếng Nhật trong **cả ô NPC và ô người chơi**, đồng bộ cách trình bày và kích cỡ chữ với ảnh mẫu: chữ đọcひらがな nhỏ phía trên đúng từ/kanji, căn theo chữ chính, không chồng chữ hay cắt mất phiên âm. Ảnh có ô người chơi làm mẫu; ô NPC trong ảnh chưa có phiên âm. Không tự suy ra cỡ px từ ảnh chụp.
- Phạm vi lượt này: **chỉ ghi nhận backlog, chưa sửa dữ liệu/giao diện, chưa kiểm đếm số câu thiếu**. Tiến trình dịch vẫn tạm dừng theo yêu cầu trước.
- **Bắt buộc nêu lại mục OPEN này trong lần báo cáo/kiểm tra tiến độ app tiếp theo**, kèm trạng thái chưa xử lý; không coi số hội thoại đã dịch là bằng chứng đã đủ furigana. Khi được tiếp tục xử lý: kiểm kê toàn bộ câu đang dùng ở hai ô, bổ sung cách đọc đúng ngữ cảnh, kiểm tra hiển thị theo ảnh trên iPhone và các kích thước màn hình hỗ trợ, rồi mới đánh dấu hoàn tất.
- Ảnh tham chiếu người dùng: `2026-10-19 20.37の画像.jpeg`, ChatGPT Library `libfile_c163d3aec1f0819194635ce78409114a` (iPhone16 Plus Simulator; ảnh được xem khi ghi nhận).

Điểm tiếp tục dịch giữ nguyên: lô124, start1231;1231/7128 hội thoại đủ bản dịch,5897 còn thiếu. Không khởi động lại tác vụ dịch hoặc sửa UI trong lượt ghi nhận này.


## 2026-10-20 resumed translation124–129

Publisher resumed dialogue translations. Authenticated remote ref matches local/tracking b96007750cd0338b87d5844785d23aadbbbce6d7. Baseline1231 complete;5897 remain. Sources124–129 cover60 scenarios starting1231 through1281. Six exclusive language-pair authors use compact canonical Japanese,16–32-value scratch checkpoints,160-value own-fidelity publication and immutable markers. Content is persisted incrementally through authenticated exact blob/tree/commit/ref checks; whole-app audits wait for full cohort integration. Native/domain review false; no semantic cross-review.

Pre-existing working changes (121 Kaigo PNG paths and unrelated temporary evidence files) are preserved and excluded from dialogue commits. DIALOGUE-FURIGANA-001 remains OPEN and must be included in the next app progress report; this translation resumption does not authorize or claim completion of that separate UI/reading backlog.


## 2026-10-20 resumed priorities and furigana inventory

Publisher authorized continuing the pending priorities. Restored six exclusive en/my, vi/km, id/ne, tl/hi, zh-CN/bn and zh-TW/th assignments for124–129; published files are immutable, existing drafts preserved. No semantic cross-review. Translation remains the first priority.

DIALOGUE-FURIGANA-001 remains OPEN. Full canonical structural inventory via scripts/audit-dialogue-furigana.cjs covers7,128 scenarios:42,768 NPC lines and35,640 player lines.42,725 NPC lines contain kanji and lack aligned ruby;35,630 player lines lack complete aligned ruby, with only10 existing complete player lines. NPC currently uses plain Text rather than JapaneseRuby; player rendering consumes only source-aligned recommendedAnswerRuby. No reading was guessed or changed. The audit is structural and does not certify pronunciation or device layout. Follow-up must author context-correct readings and support both panels, then validate the reference appearance on supported screens.
