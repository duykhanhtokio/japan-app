# NPC VOICEVOX integration — 2026-10-22

Publisher request: replace rough device TTS in local conversations with the four already approved voices, matching NPC visual gender/age presentation. Translation is owned by another session.

Status: PARTIAL, not whole-corpus completion. The former route directly called expo-speech with no selected voice. It now uses dialogue-npc-audio, preferring exact-source recorded VOICEVOX audio. Existing device speech remains the explicit fallback for unrecorded lines, stale source/voice bindings or decode failures. Do not describe this as all NPCs already speaking VOICEVOX.

Approved casting is reused without modifying the JLPT configuration: young female 春日部つむぎ/8, adult female 夜語トバリ/118, young male 玄野武宏/11, adult male 剣崎雌雄/21. Visual mapping is in src/data/dialogue-content/npc-voice-casting.json; 25 characters were inspected in the existing source contact sheet and the laundry original PNG was inspected separately. Unknown categories follow the same landmark-character fallback as the real artwork resolver. This is a character-design age group, not an inferred exact age or casting based on occupation stereotypes.

The offline planner exercises the actual loader and corrected location repository for all 7,128 scenarios / 42,768 NPC turns. Full exact-source ruby is retained for future pronunciation QA. VOICEVOX receives original Japanese to preserve dictionary pitch accents; the existing hiragana corrections are not automatically guaranteed to be reflected in VOICEVOX's separate accent dictionary. Per-script listening/accent review remains pending.

Current assets: 24 distinct 48kbps MP3 clips, decoder-validated, 24kHz mono synthesis at approved speedScale0.9. They resolve to 33 active NPC turns because identical source/voice pairs can share a recording. Remaining: 42,735 turns have no approved-voice recording. Four complete representative scenario IDs: SC-019-001, SC-032-001, SC-AIC-ICHINOMIYA-001, SC-AKT-SEMBOKU-001; some matching turns in other scenarios also resolve. No runtime engine/network dependency is introduced. Tap the NPC name plate for all four voice credits and terms URLs.

Implementation validation: focused TypeScript check against expo-audio1.1.1/expo-speech14.0.8 declarations; actual recording selection and 33 source bindings; wrong source/turn/scenario rejection; cancelled callbacks do not advance a later turn; real decoder completion drives turn advance; decode error falls back; all 24 MP3s decode. The JLPT10-file UI lock passes. Text reveal is estimated from playback position, not forced word alignment. No native-device playback, independent listening, native-speaker or complete-source pronunciation certification.

Continuation (do not regenerate valid existing clips):

```bash
TOKUTEI_QA_MODULES=/path/to/node_modules node scripts/dialogue-voice/prepare.cjs /tmp/npc-voice-plan.json
python scripts/dialogue-voice/generate.py --plan /tmp/npc-voice-plan.json --engine /path/to/voicevox_engine/run --limit 120
TOKUTEI_QA_MODULES=/path/to/node_modules node scripts/dialogue-voice/check.cjs /tmp/npc-voice-plan.json
```

The generator defaults to all missing lines if --limit is omitted. Every clip is atomic and resumable, keyed by engine/version, voice ID, source Japanese, source-bound kana and synthesis settings; MP3 hashes are verified on reuse. Registry updates are atomic. Engine subprocess is always stopped at exit. On this host the temporary restored official0.25.2 engine is /tmp/dialogue-voicevox/linux-cpu-x64/run. It was downloaded from https://github.com/VOICEVOX/voicevox_engine/releases/download/0.25.2/voicevox_engine-linux-cpu-x64-0.25.2.7z.001 and extracted using py7zr. Host engine/cache paths are temporary, not durable deliverables.

Next: generate and persist remaining audio in bounded complete units; audit pronunciation (especially previously corrected homographs and proper names); native-device playback and interruptions. Full-corpus asset download/installation size must be measured and a distribution strategy implemented before declaring a production-ready whole-corpus audio release. This initial static asset registry demonstrates correct playback/casting, not a claim that bundling tens of thousands of MP3s is a release-ready distribution strategy. No generator or other background worker is left running by this checkpoint.
