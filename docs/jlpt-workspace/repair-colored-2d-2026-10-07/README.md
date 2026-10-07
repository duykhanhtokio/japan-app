# Colored 2D and content uniqueness repair — 2026-10-07

All 68 runtime question illustrations across 14 independent originals (N5 01–06, N4 01–06, N3 01–02) use colored 2D line art, flat natural colors and light cel shading. Each runtime asset was generated separately with the built-in image generation tool and visually inspected by AI against its current scenario, speaking role, required props and absence of readable answer hints. Two-panel N5 practice/scored sheets retain their instructional layout. No legacy source questions, scripts, audio or imagery were used.

116 revision records cover 113 distinct scored/practice IDs: 89 semantic duplicate/context revisions, two answer-quality corrections and 23 speaker alignment corrections (one ID has both semantic and speaker revisions). The full before/after record is in content-revisions.json. Repeated borrowing, thanking, lateness, lost-object, carrying and permission templates were replaced with distinct communicative tasks; repeated reading premises and immediate-response templates were also rewritten. A late visual review additionally replaced the office boxes/door task with asking where to contact for a failed ceiling light, and separated similar classroom compositions. Three explicit option-role metadata fields were added to agree with already recorded voices. Question IDs, correct option IDs and option ordering stay identical to the baseline; question/option text changes are intentional.

The current lexical audit covers 1,338 scored questions, 109 passages and 58 non-scored examples. Exact duplicates: zero within the detector’s normalized, instruction-stripped scope. All 22 remaining near lexical candidates have individual AI editorial verdicts: distinct target words, grammar operations or required response actions. Shared syllabus knowledge is permitted. This is candidate detection plus AI editorial review, not exhaustive human/native semantic certification.

Audio was rebuilt from current independent scripts using approved VOICEVOX roles/settings. No pacing changes, silence padding or fixed duration acceptance tolerance were introduced. N5 tracks measure about29.64–30.26minutes, N4 about35.22–36.13minutes and N3 about40.10–40.64minutes. Every instrumental break is exactly60,000ms after problem2 and before problem3, with both announcements and section orientation preserved. Item scripts/options/roles, recorded hashes, decoded frame counts and continuous-track hashes passed checks. A truncated sidecar was restored from cached approved synthesis to its recorded hash rather than accepted by refreshing its hash.

Validation evidence:
- 42 checks:14 content validators,14 adapters and14 audio validators, all PASS.
- Asset consistency PASS:68 unique PNG hashes, full mappings, color pixel checks, current audio/master provenance, voice/actor alignment and baseline answer fingerprints. Pixel color checks alone do not certify style.
- UI lock PASS:10/10 approved files unchanged.
- Real production runner/shared UI in isolated React Native web harness,430×932:14/14 PASS,68/68 images loaded,96 screenshots. Start/select/save, audio opening, pause, back/reopen/resume, incomplete submit, score, review and actual playback crossing the music-end boundary verified. Harness supplies focus/backdrop contexts; this is not full-router or native-device approval.

Workspace files unexpectedly disappeared during connector upload. Current independent data were restored from the turn-start snapshot and revision log; images and audio were regenerated and the checks/runtime evidence above rerun. The newer remote Kaigo commits were preserved. No claim is based on lost screenshots or inaccessible generation files. Protected working snapshots were kept for persistence recovery.

Publisher, native-speaker, perceptual audio, rights-release and release-ready approvals remain false. Next authoring checkpoint remains14/30 technical integrations; next new original is N3 03. Session versions were advanced for revised content so old saved answers cannot be silently applied to changed questions. See JLPT_IMAGE_AND_UNIQUENESS_STANDARD.md for the mandatory future image/context policy.

Full-project TypeScript check reports an existing TS2352 in `src/services/life-content-repository.ts:47`, outside the JLPT repair. The42 focused checks and real runner harness pass; no full-project TypeScript pass is claimed.

Runtime screenshots in this repair directory are stored as ordinary Git blobs via a scoped attribute exception so their evidence is directly retrievable without unpublished LFS objects.
