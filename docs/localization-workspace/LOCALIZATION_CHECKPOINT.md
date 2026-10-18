# App localization checkpoint — 2026-10-18

User scope: correct Vietnamese defaults across the app and inventory translations for learning content, tests and conversations in all 13 supported languages. Japanese remains canonical learning/assessment text.

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
| Foreman 職長 | 28 sessions; 250 units have Vietnamese only, missing the other 11 supporting languages. |
| Construction review tests | 1,134 unique runtime questions; 11,340 displayed question/choice/explanation/rationale units currently have no supporting translations. |
| Kaigo active Japanese masters | 6,242 heading/paragraph/caption units and 176 lesson metadata records pass all 12 locales and current source revisions. |
| Kaigo tests | 687 weekly questions plus 360 mock questions across 12 forms pass their full-question validation in all 12 locales. |
| Local conversations | All 7,128 effective scenarios exist, with 42,768 NPC turns and 35,640 player turns. Only ONE scenario has complete NPC + player sentence translations in all 12 supporting languages. Per locale, only 6 NPC sentences and 5 player answers have explicit translations. |
| Authored conversation tasks | Authored native-language task hints are distinct from model-answer translations. The runtime may use answer meanings when hints are missing; see the separate lifeDialogue.authoredTask and lifeDialogue.playerHint coverage rows. |
| Older work conversations | Some English/Vietnamese and a few other translations exist, but the 2-scenario / 16-turn bank is not complete across languages. |
| Registered occupation/operation names | The ACTIVE imported language pack has Vietnamese for 278 identifiers and no entries for the other 11 supporting languages. A separate partial language pack exists but is not used by that runtime adapter and is not counted. |
| Older lessons/modules/categories/tags | Many remain bilingual Japanese–Vietnamese. New selectors prevent Vietnamese defaults; missing translations are still missing content. See the precise group totals. |
| JMdict | The dictionary service selects English glosses, not locale-specific glosses. It is separate from the fully localized 8,350-word study bank. |
| Historical JLPT catalog | 58 structured official + 2 pending official + 5 older mock entries. Existing explanation packs are inventoried separately; they are hidden by approved review behavior and not counted as selected-language question support. |
| JLPT authored exams | 30 integrated Japanese forms / 3,018 questions. Questions remain Japanese by assessment design; this does not mean native-language question translations exist. Locked exam UI, answers, listening and saved sessions were preserved. |

## Checks and limits

- check-app-localization.cjs: 173 UI source files passed syntax transformation; 9 actual screens × 13 locales = 117 route checks. Includes selected-language UI, dynamic counts, preserved native scripts and dictionary text, no Vietnamese leakage in the exercised routes, invalid storage, rapid writes and storage-write failure.
- check-dialogue-localization.cjs: actual loader with direct and generic fixtures; exact source/speaker guards and stable IDs pass.
- Existing grammar catalog and calendar data validators pass; approved exam UI lock passes 10/10; git diff whitespace check passes.
- Runtime browser tests use explicit artwork, native-service and dictionary backend adapters. No native-device, production Expo, full-image OCR or native-speaker certification is claimed.
- Full static scan is an inventory, not a claim that every app label is translated. Japanese-only portal preview UI and limited-locale calendar/task copy still need authored locale coverage. Legacy Kaigo reference/practice data is not counted as the active translated weekly course.
- No bulk content translations were invented to close missing counts. This unit fixes identified locale routing/display faults and records the remaining content work.

## Resumable evidence

- coverage.json: exact group-by-language presence, scenario counts and audit limitations.
- coverage.csv: compact comparison matrix (translated units per locale).
- missing.ndjson.gz: every missing unit ID with its missing locale list, losslessly compressed. Decompress with standard gzip tools.
- ui-candidates.json: static Vietnamese source candidates, including legitimate locale tables and review metadata; these are leads, not automatically classified runtime defects.
- runtime-qa.json and dialogue-routing-qa.json: observed regression results.
- Run audit-app-localization.cjs with TOKUTEI_QA_MODULES pointing to esbuild dependencies; a full checkout must include docs/ssw-workspace because construction runtime lessons import those source files.

Next content work: fill local NPC/player/task translations, then foreman and construction test support, then legacy lesson/job metadata and the remaining UI copy. Preserve Japanese sources, source bindings, IDs and progress.
