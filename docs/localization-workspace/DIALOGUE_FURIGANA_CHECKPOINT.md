# Dialogue hiragana — 2026-10-22

User scope: leave dialogue translation to the other session; repair hiragana in both NPC and player panels using the supplied October19 screenshot as the presentation reference.

Implemented coverage: all7,128 active scenarios,42,768 NPC lines and35,640 player lines. The real loader checks full source reconstruction; no kanji segment lacks a hiragana reading. Existing manually authored source-bound bundles and player hint readings retain precedence. Shared indexed tokens keep the added offline data around12MB rather than duplicating source sentences in thousands of bundles. Data is lazily loaded by scenario shard. There is no runtime tokenizer, network request or new app dependency.

Readings were built with Janome0.5.0/IPADIC, explicit missing-word and homograph corrections, numeric-counter rules and date contexts. This is dictionary-generated, unreviewed pronunciation, not native certification. Proper names, homographs and other contextual readings remain subject to editorial/native review. Exact-source coverage must not be reported as proof of perfect pronunciation.

NPC now uses the same JapaneseRuby renderer as player, including small readings above base characters, theme colors, aligned-source validation and partial-word animation guards. The existing player font ratio is preserved. Panel geometry reserves the maximum reading/native-hint state, keeping lantern transitions stable. When two complete long panels cannot fit at readable sizes, the existing current-turn-only phone mode applies; 前へ still returns to the preceding turn. No scroll is added and the JLPT locked UI is unchanged.

Validation: check-dialogue-furigana-coverage.cjs exercises all78,408 real loaded turns and stale-source/role/turn guards; check-dialogue-furigana.cjs preserves56 authored entries and partial-word guards. Browser layout passes18 cases across360×800,390×844,430×932,768×1024,1366×768,932×430 and vi/my/km, including the longest Japanese answer fixture, NPC readings, hint toggles and navigation. Captures and report are in furigana-qa/. Browser adapters isolate speech/navigation and omit unavailable scene artwork; these are typography/geometry checks, not iPhone Simulator or native artwork approval.

Rebuild: in a build environment with Janome==0.5.0, run `python scripts/build-dialogue-furigana.py`. The generated data is committed; app users need no Python package. Run `TOKUTEI_QA_MODULES=/path/to/esbuild/node_modules node scripts/check-dialogue-furigana-coverage.cjs` and `node scripts/audit-dialogue-furigana.cjs` after source or reading changes.

Remaining: iPhone/device visual confirmation against the reference and native/editorial review of dictionary pronunciation. Dialogue translations and their coordinator reports/queues are outside this change.
