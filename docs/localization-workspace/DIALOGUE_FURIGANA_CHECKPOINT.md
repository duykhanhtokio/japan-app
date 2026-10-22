# Dialogue hiragana — 2026-10-22

User scope: leave dialogue translation to the other session; repair hiragana in both NPC and player panels using the supplied October19 screenshot as the presentation reference.

Implemented coverage: all7,128 active scenarios,42,768 NPC lines and35,640 player lines. The real loader checks full source reconstruction; no kanji segment lacks a hiragana reading. Existing manually authored source-bound bundles and player hint readings retain precedence. Shared indexed tokens keep the added offline data around12MB rather than duplicating source sentences in thousands of bundles. Data is lazily loaded by scenario shard. There is no runtime tokenizer, network request or new app dependency.

Readings were built with Janome0.5.0/IPADIC, explicit missing-word and homograph corrections, numeric-counter rules and date contexts. This is dictionary-generated, unreviewed pronunciation, not native certification. Proper names, homographs and other contextual readings remain subject to editorial/native review. Exact-source coverage must not be reported as proof of perfect pronunciation.

NPC now uses the same JapaneseRuby renderer as player, including small readings above base characters, theme colors, aligned-source validation and partial-word animation guards. The existing player font ratio is preserved. Panel geometry reserves the maximum reading/native-hint state, keeping lantern transitions stable. When two complete long panels cannot fit at readable sizes, the existing current-turn-only phone mode applies; 前へ still returns to the preceding turn. No scroll is added and the JLPT locked UI is unchanged.

Validation: check-dialogue-furigana-coverage.cjs exercises all78,408 real loaded turns and stale-source/role/turn guards; check-dialogue-furigana.cjs preserves56 authored entries and partial-word guards. Browser layout passes18 cases across360×800,390×844,430×932,768×1024,1366×768,932×430 and vi/my/km, including the longest Japanese answer fixture, NPC readings, hint toggles and navigation. Captures and report are in furigana-qa/. Browser adapters isolate speech/navigation and omit unavailable scene artwork; these are typography/geometry checks, not iPhone Simulator or native artwork approval.

Rebuild: in a build environment with Janome==0.5.0, run `python scripts/build-dialogue-furigana.py`. The generated data is committed; app users need no Python package. Run `TOKUTEI_QA_MODULES=/path/to/esbuild/node_modules node scripts/check-dialogue-furigana-coverage.cjs` and `node scripts/audit-dialogue-furigana.cjs` after source or reading changes.

Implementation complete within the accessible environment: full source-bound data, renderer and AI editorial corrections are tested. Native iPhone/device visual confirmation against the reference is unavailable here. No independent native-speaker certification is claimed. Dialogue translations and their coordinator reports/queues are outside this change.

## Completed editorial continuation — 2026-10-22

Compared77,701 unique source sentences with a second offline dictionary and reviewed722 initial disagreement groups rather than accepting its alternatives wholesale. Inspected225 proper-name candidate groups and checked disputed real place names against official municipality pages. Defined readings for fictional labels use the canonical dialogue's explicit pronunciation wherever provided.

Added445 lexical/conjugation corrections and274 exact-source occurrence rules:199 person/option/direction disambiguations for方 and75 ten-minute readings for十分. Preserved238 control occurrences to ensure that correct readings are not replaced by broad rules. Numeric rules cover Arabic/full-width and kanji counters, voiced hundreds/thousands, person/date/year/month counters, and protection of千歳 as a place name. Noun-stem corrections cannot leak into申込む/引越す/読取り conjugations; superseded unused lexicon pairs are removed.

The new indexed data changes the phonetic reading of5,596 turn rows (3,058 player and2,538 NPC;5,595 unique source sentences); every Japanese source string is unchanged. Existing source-bound authored bundles remain untouched and retain runtime precedence. See dialogue-furigana-editorial-qa.json for limits and official-name references.

Final checks: all78,408 actual loaded turns retain complete aligned hiragana;64 source-bound pronunciation goldens,274 occurrence fixtures,238 preserved controls (577 runtime checks including repeated source occurrences),47 numeric unit regressions,18 browser-layout cases and the10-file JLPT UI lock pass. Native simulator/device and independent human review remain unperformed, not silently certified. Dialogue translation work is owned by the other session.
