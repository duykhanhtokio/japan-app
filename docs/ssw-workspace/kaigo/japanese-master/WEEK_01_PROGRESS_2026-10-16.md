# Kaigo Japanese-master migration — week 1 progress

Status: **partial; week 1 is not complete**. Internal test integration only.

Japanese is the canonical lesson language. The existing approved source is the Vietnamese second-revision textbook (March 2025); its byte hash was verified. Japanese explanations were independently authored from its concepts, with the existing Vietnamese lessons used for reconciliation. This does not claim a Japanese edition was inspected or that a reverse translation was certified.

| Item | Verified result |
|---|---|
| Whole course inventory | 176 study days; 866 sections; 52,880 language-bearing field records |
| Week 1 Japanese master | 73 stable section IDs; 246 paragraphs, including reused Japanese dialogue/readings and new contextual explanations |
| Previously complete fields in week 1 | 14; reused/enriched rather than treated as newly authored from zero |
| Previously missing week 1 representations | 59 now have a master representation; several already had partial Japanese readings/dialogue |
| Current whole-course representations | 225 present; 641 still missing; presence is not a professional or language review |
| Japanese terminology | 25 definitions linked to existing vocabulary records |
| Translations | 1 of 73 sections has 12 direct-from-Japanese AI translation drafts; 72 still pending in every target language |
| Questions | 59 Japanese drafts outside runtime: 35 existing Japanese questions retained, 24 previously Vietnamese-only converted items drafted in Japanese |
| Images | 7 existing daily contextual images visually checked; Japanese captions added; no new images |
| Existing data and progress | Original course JSON, weekly questions, mock exams, IDs and storage keys remain byte-identical |

The source ledger maps 246 Japanese paragraphs to supporting concept scopes. Practice cases, names, events and model responses are project-authored; the textbook is not asserted to contain them. MHLW sources are recorded for lifting precautions, standard infection precautions and short-stay services. This ledger is not an exhaustive inventory of all book knowledge. Source-book coverage percentage remains null.

Validation performed:

- Japanese-master TypeScript data modules: pass (focused check, not whole-app TypeScript).
- Master content/preservation checks: pass, including rejected stale translation and missing-language fallback cases.
- Selected-language reader checks: pass for all 12 translation targets after explicit translation action. No Vietnamese fallback. Japanese edits invalidate translation bindings.
- Actual curriculum in isolated native-host fixtures: 176 days / 866 sections; no leaked Vietnamese before translation; original Vietnamese references preserved and labelled as unaligned for migrated sections; completion/save-failure behavior preserved.
- JLPT approved UI lock: 10/10 pass; diff whitespace check: pass.

These are isolated logic/render-tree tests. No iPhone/iPad/Android native-device visual validation, full Expo navigation validation, independent specialist review or native-speaker approval was performed. Human/domain/native/release flags remain false. No translations are claimed human-reviewed.

Next, within week 1: improve and verify each question's option-level explanations; settle a versioned assessment migration that retains prior attempts; finish direct translations for the remaining 72 sections; complete point-level reconciliation and device/layout QA. Only then mark week 1 complete and move to week 2. Saving this draft checkpoint does not waive that gate.
