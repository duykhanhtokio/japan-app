# N5 2017-07 conversion checkpoint

- Source: `japan-app-n5-source/N5 7-2017/N5-2017年-7月.pdf`, 49 pages, PDF SHA-256 recorded in `source-packet.json`.
- Runtime audio already tracked: `assets/jlpt/n5/2017-07/audio/n5-2017-07.mp3`; full-track playback is required.
- `written.partial.json` contains 59 uniquely mapped, source-page-reviewed written responses (including vocabulary and grammar questions through source page 17). These are not a playable exam yet.
- The source packet has 65 written and 24 listening positions and a printed answer key. Six visually similar spelling/kanji written prompts/options and all 24 listening question presentations remain to be transcribed.
- Pages 4–5 have visually similar kanji/kana distractors; inspect them at high resolution before transcription. Questions 27–28 on page 7 require question-specific illustrations. Reading passages and listening illustrations cannot be replaced by full PDF pages.
- Candidate listening timing remains unverified. The source audio must be played as one continuous file.
- Do not register this exam in `approved-n1-exams.ts` or remove it from `PENDING_JLPT_EXAMS` before all 89 response positions are usable and validated.

- Audit correction: 20 earlier rows had wrong question IDs and source page mappings. Removed them and validated unique IDs, page numbers, and keyed answers against the source packet.

- `scripts/check-n5-2017-07-conversion.mjs` enforces unique question ID, source page, keyed answer, four nonempty options, and remaining counts.
- Two vocabulary diagrams are currently described as text candidates, and one reading room-layout question still needs image options before runtime approval.
