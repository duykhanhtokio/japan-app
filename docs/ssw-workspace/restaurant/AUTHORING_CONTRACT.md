# Restaurant / 外食業 authoring contract — 2026-10-26

User-authorized independent sector, 1号 and 2号, seven attached PDFs. Preserve agriculture, food manufacturing, JLPT and approved Tokutei appearance. Dedicated worktree/branch feature/restaurant-20261026 is authorized to isolate concurrent work; base a1c25940a7167cbdf2db2a4df4f317c4ff6dadbe matches origin/recovery/jlpt-n3-n1 at startup. No user-original PDF text/image redistribution. Source extraction stays outside Git. Native/domain/human review must never be claimed without evidence.

## Shared schema (all content authored in Japanese first)
- Data root `src/data/restaurant/`.
- `lessons.1.ja.json`, `lessons.2.ja.json`: `{schemaVersion:1,level:'1'|'2',lessons:[...]}`.
- Lesson `{id:'rst-1-hyg-01',level:'1',week:1,day:1,topic:'hygiene'|'cooking'|'service'|'operations',titleJa,objectiveJa,minutes:30,paragraphs:[{id:'knowledge'|'procedure'|'mistakes'|'scenario',titleJa,textJa}],terms:[{ja,reading}],summaryJa,activityJa,sourceRefs:[{documentId:'rst-1-hygiene',pdfPages:[5,6],section:'...'}],knowledgeIds:[]}`. Additional paragraphs allowed. No fabricated pages. 2号 IDs rst-2-*.
- Document IDs: rst-{1|2}-{hygiene|cooking|service|operations}. Source pages 1-based PDF pages, printed page separate in inventory.
- `exams.1.ja.json`, `exams.2.ja.json`: `{schemaVersion:1,level,exams:[{id:'rst-1-practice-01',level,kind:'practice'|'weekly',week?:1,titleJa,questions:[{id:'rst-1-q001',topic,objectiveJa,stemJa,optionsJa:[four strings],correctIndex:0,explanationJa,sourceRefs:[...],knowledgeIds:[]}]}]}`. No official exam claims; all questions original; correctIndex 0-based. 10 practice sets x40 per level, weekly separately. No template duplication through cosmetic substitutions. Keep native/expert review false.
- Root normalizes semantic content SHA256 into `sourceHash` per lesson/exam, builds manifest and links after integration. Do not invent hashes.
- `translations/<locale>.json`: `{schemaVersion:1,locale,lessons:{[lessonId]:{title,objective,paragraphTitles:{[paragraphId]:text},paragraphs:{[paragraphId]:text},terms:{[JapaneseTerm]:translation},summary,activity}},questions:{[questionId]:{stem,options:[...],explanation,objective}},ui:{[JapaneseString]:translation}}`. Root adds revision hashes. Locales from src/i18n/languages.ts: en vi id zh-CN zh-TW hi bn ne my th km tl. Missing translation must be reported, never Japanese placeholder/fabricated completion.
- UI/data/service exported TS types explicit, avoid inferred JSON tuple types. May use existing Tokutei chrome, StudyAppearance, FuriganaText after inspect. No shared renderer changes.
- `diagrams.json`: concept diagrams with precise declarative nodes/labels, 2D color, localized text rendered as UI not burned in.

## Ownership
AI1 docs/ssw-workspace/restaurant source inventory/knowledge matrix only; extracted raw text in /workspace/scratch/f88f367d2ad0/restaurant-source-text only. AI2 lessons.1.ja.json. AI3 lessons.2.ja.json. AI4 exams.*.ja.json. AI5 translations/ and diagrams.json + illustration register only. AI6 restaurant UI, data index/types, services, route and one restaurant entry in specified-skills/index.tsx. Root validator, hash normalization, manifest, checkpoint, integration and review. No agent commits/pushes. No changes to other sectors or locked JLPT.
