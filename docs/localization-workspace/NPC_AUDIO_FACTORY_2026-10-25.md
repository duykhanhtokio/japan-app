# Complete NPC voice factory — 2026-10-25

Status: GENERATION IN PROGRESS, not a complete audio release.

- GitHub Actions run: https://github.com/duykhanhtokio/japan-app/actions/runs/40181116462
- Source trigger: 82a913ce149353d4b769f7e8a6524c7bb1f7e967; runtime follow-up f7e82afb65e07244d6e9f8a2b946aa963eecf2dd.
- Corpus: 7,128 scenarios / 42,768 NPC bindings / 42,158 unique source-and-voice recordings. Existing 24 clips cover 33 turns; preserve verified clips.
- Approved VOICEVOX 0.25.2: 春日部つむぎ/8, 夜語トバリ/118, 玄野武宏/11, 剣崎雌雄/21; speedScale 0.9, 24kHz mono, MP3 48kbps.
- Factory has 48 bounded workers, maximum 20 concurrent. Workers validate exact sources, engine version, MP3 decoding and checksums, then upload bounded packs to the run release. Integration only runs after all workers succeed and current-source coverage matches exactly.
- Local four-voice test: four MP3s generated and decoded, one pack assembled. These are test outputs, not the completed corpus.
- Runtime pack seek/boundary, cancellation, interruption, source binding and no engine calls for packed playback pass the mock lifecycle test. Native/web playback of the complete release remains unverified. Human listening/pronunciation review is pending.
- Complete release manifest stays false until finalization; do not report all recordings available based on factory launch. The old development live-server fallback remains while the release is incomplete. Once complete, no learner-side engine request is made.
- Next: inspect run jobs/logs, repair actual failures, verify all uploaded packs and final manifest, then test native/web playback and measured distribution size. Do not regenerate successful units blindly. No local background synthesis process was started by this continuation.

Commands: node scripts/dialogue-voice/factory/check-playback.cjs; node scripts/check-jlpt-approved-ui-lock.mjs. Full TypeScript checks must use an adequate Node heap; a 2GB run exhausted memory.
