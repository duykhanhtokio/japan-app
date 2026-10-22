# Offline reading build

`../build-dialogue-furigana.py` uses build-only Janome0.5.0 (IPADIC dictionary). Pin that version in the build environment; no package is added to the app. Source text and turns come only from the active Japanese corpus. `reading-overrides.json` contains explicit repairs for missing dictionary words and corpus-specific homographs. Numeric counters and contextual date fixes live in the builder.

The output is source-bound dictionary data, not native-reviewed pronunciation. Existing authored bundles retain precedence. To fix a context-dependent reading, change the relevant builder rule or author a narrow source-bound scenario bundle; do not apply a global homograph override without checking its contexts. All output must pass full source reconstruction and coverage checks.

The continuation adds reading_rules.py, context-reading-corrections.json and exact-source source-occurrence-readings.json. Cross-dictionary candidates are reviewed, not automatically substituted. pronunciation-controls.json preserves correct alternate meanings (方 and十分), and pronunciation-regressions.json binds golden readings to canonical turns. Run `python scripts/check-dialogue-reading-rules.py` plus the real-loader coverage check after rebuilding.

Optional build acceleration: DIALOGUE_FURIGANA_TOKEN_CACHE may point to a local JSON map of exact Japanese source strings to Janome token arrays. Every cached token surface must reconstruct the current source. The cache is build-only and never shipped to the app; omit it for a fresh Janome build. The committed lexicon uses only referenced entries and is regenerated atomically with all32 shards.
