# Offline reading build

`../build-dialogue-furigana.py` uses build-only Janome0.5.0 (IPADIC dictionary). Pin that version in the build environment; no package is added to the app. Source text and turns come only from the active Japanese corpus. `reading-overrides.json` contains explicit repairs for missing dictionary words and corpus-specific homographs. Numeric counters and contextual date fixes live in the builder.

The output is source-bound dictionary data, not native-reviewed pronunciation. Existing authored bundles retain precedence. To fix a context-dependent reading, change the relevant builder rule or author a narrow source-bound scenario bundle; do not apply a global homograph override without checking its contexts. All output must pass full source reconstruction and coverage checks.
