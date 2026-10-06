# JLPT independent original authoring — 2026-10-06

This is the active checkpoint for the new authoring task. The historical recovery loop and JLPT_ACTIVE_PROGRESS.json do not authorize further transcription or recovery of original exams for this task.

## User decisions

- Create 20 original exams per level N5–N1 (100 total).
- First deliver one complete N5 pilot for publisher review.
- Publisher/user is the final reviewer; no completed human/native review may be inferred from that designation.
- Retain approved UI and agreed N5 timing: vocabulary 20 minutes, grammar/reading 40 minutes, listening approximately 30 minutes.
- Use the current N5 catalog 第3回 as the count-per-type reference. UI indexing and registry identify it as n5-2013-07-exam-03.
- Keep promotion rule: six different new exams at a level scoring at least 80%.
- Old JLPT attempt/progress records need not be preserved. Remove old exams/resources from the app when the replacement collection is complete. Do not reset unrelated learning/game data or rewrite Git history under this authorization.
- Audio engine and four role voices selected on 2026-10-06; see src/data/jlpt-original/voice-casting.json. Image tooling and final release checks remain pending. No old recording or illustration may fill a missing new asset.

## Structural extraction only

Read metadata from written.candidate.json and listening.candidate.json with a script that outputs grouping/counts only. No old prompts, options, answers, passages, scripts, recordings, or illustrations are authoring inputs.

| Section | Problem | Count | Skill |
|---|---:|---:|---|
| vocabulary | 1 | 12 | kanji reading |
| vocabulary | 2 | 8 | orthography |
| vocabulary | 3 | 10 | contextual vocabulary |
| vocabulary | 4 | 5 | paraphrase |
| grammar_reading | 1 | 16 | grammar selection |
| grammar_reading | 2 | 5 | sentence ordering |
| grammar_reading | 3 | 5 | text grammar |
| grammar_reading | 4 | 3 | short reading |
| grammar_reading | 5 | 2 | medium reading |
| grammar_reading | 6 | 1 | information retrieval |
| listening | 1 | 7 | task comprehension |
| listening | 2 | 6 | key-point comprehension |
| listening | 3 | 5 | situational utterance |
| listening | 4 | 6 | quick response |

Totals: 35 vocabulary + 32 grammar/reading + 24 listening = 91 responses. All 67 written reference items have four choices. Do not infer listening choice counts from written metadata. Reference-count approval is not proof of current official item counts.

## Authoring contract and next action

Author from learning objectives and independently conceived situations/data/solution logic. Reject superficial edits to old items (names, locations, amounts, word order, synonym substitutions). Create fresh correct options, plausible distractors, and internal QA rationales. Detailed rationales/transcripts remain hidden in the approved V1 UI.

Use independent IDs (proposed jpapp-n5-original-01-v1) and independent session keys. Drafts must be labelled AI-created/unreviewed. Actual publisher review and actual listening playback checks must be recorded before release claims.

N5 pilot text master now contains 67 written items and 24 newly authored listening scripts, with objectives and option rationales. See src/data/jlpt-original/n5/01/master.ja.json and docs/jlpt-workspace/original/n5-01/PUBLISHER_REVIEW.md. Status: AI-authored draft, publisher review required. Five new illustration briefs are present; actual images and audio do not exist yet. Audio generation, illustration generation, runtime integration, legacy removal, and progress migration have not been performed. Next: publisher academic review, then select rights-appropriate audio/image tools, generate assets and perform real playback QA before integration. Do not begin the next exam before the pilot is reviewed. Keep old content available only in the development state until the approved replacement gate; exclude it from the eventual production bundle/API/cache/fallback.

Do not initiate comparisons against old question content without separately confirming their purpose, scope, and separation with the user. Any ambiguity affecting counts, scoring, audio rights, or locked UI must be clarified rather than guessed.

## Approved audio casting — 2026-10-06

User explicitly restored the earlier student voice in place of audition 7 and requested all four roles be committed to source. Canonical configuration: `src/data/jlpt-original/voice-casting.json`; TypeScript exports: `src/data/jlpt-original/voice-casting.ts`. Audition numbers are positions in the 39-voice comparison, not engine speaker IDs.

| Role | Voice | Engine speaker ID | Audition number |
|---|---|---:|---:|
| Female student | 春日部つむぎ / ノーマル | 8 | Previously selected student voice |
| Adult female | 夜語トバリ / ノーマル | 118 | 37 |
| Young male | 玄野武宏 / ノーマル | 11 | 4 |
| Adult male | 剣崎雌雄 / ノーマル | 21 | 8 |

Use VOICEVOX 0.25.2, speedScale 0.9, mono 24000 Hz. Existing pause settings remain 1.2 seconds after the introduction, 0.5 seconds between dialogue turns, and 5 seconds for the answer pause. This records publisher voice selection, not native pronunciation review, complete-exam audio approval, or runtime integration. もち子さん (audition 7, engine speaker ID 20) is excluded from production casting.

The configuration includes credits and per-voice terms links. Display required credits before release. Use only independently authored scripts; character artwork rights are separate. Check current terms and actual playback before release. Full pilot audio, illustrations, credits UI and exam runtime integration remain future work.
