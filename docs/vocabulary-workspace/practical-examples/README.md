# One practical example per vocabulary item

The publisher requires one usable Japanese sentence for each of the 8,350 vocabulary IDs, with explicit translations in en, vi, id, zh-CN, zh-TW, hi, bn, ne, my, th, km and tl. Translating only the original 298 examples does not meet this requirement. See coverage.json for current effective coverage and all remaining IDs.

The batch TSV files contain ID, Japanese, English and Vietnamese, separated by a vertical bar. Japanese, English and Vietnamese are directly authored. New examples should describe concrete life/work situations and demonstrate the intended sense of the vocabulary word. Existing examples, vocabulary IDs, source bytes and learned-state keys are preserved.

Other locale drafts are generated offline with the pinned model in authoring-policy.json. This adds no translation service or model dependency to the running app. Machine translation and structural checks do not certify naturalness or meaning accuracy. Source-bound editorial-corrections.json retains reviewed corrections when translations are regenerated. The current files are AI-authored/translated and are not native-reviewed.

Use the following environment variables with the offline authoring helper: VOCABULARY_OFFLINE_MODEL is the local pinned CTranslate2 model directory; VOCABULARY_EXAMPLE_TRANSLATIONS is the local translation-cache directory. The helper requires developer-installed ctranslate2 and sentencepiece. It resumes missing IDs without overwriting completed translations.

1. `python scripts/translate-vocabulary-examples-offline.py`
2. `node scripts/build-vocabulary-practical-examples.cjs`
3. `node scripts/build-vocabulary-localization-manifest.cjs`
4. `node scripts/check-vocabulary-practical-examples.cjs --allow-incomplete`
5. `node scripts/check-vocabulary-localization.cjs`

Set TOKUTEI_QA_MODULES to the available esbuild dependency directory for validators when the app dependencies are not installed. For actual-screen checks, use check-vocabulary-localization-browser.cjs with VOCABULARY_QA_PRACTICAL_ID set to a completed new ID, alongside its documented browser environment variables.

Only records with all 12 nonempty translations are integrated. The app binds additions to the exact vocabulary ID, corrected headword/reading and Japanese example. A changed source must not inherit old example translations. Each integrated record stores its actual surface form so the validator can verify the example demonstrates the target word.

The strict completion command is `node scripts/check-vocabulary-practical-examples.cjs` without --allow-incomplete. It fails until every language reaches 8,350 examples. Never treat the progress-mode validator, meanings-only completeness or a partial batch as completion of the publisher's full request.
