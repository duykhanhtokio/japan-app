# Dialogue controls and JLPT card contrast — 2026-10-02

The upcoming player panel and red lantern are rendered with the NPC/player pair. The microphone is in a fixed dock outside the ScrollView, above navigation and character layers; disabled microphone remains visible. On player content measurement, the scroll reveals the player panel including its attached lantern. Lantern stage zero retains waiting dots; first press shows native guidance, second shows the Japanese model answer.

Five Vietnamese task hints were authored for SC-LOC-001-01-001 (Sapporo station). The loader only applies hints when their Japanese answer matches the current answer. Ruby remains optional and existing readings are preserved. Other rewritten scenarios still need authored translations; no generic or Japanese fallback is presented as native guidance.

JLPT learning tab N5–N1 cards now have darker borders and a restrained shadow; locked cards retain opaque surfaces instead of fading the entire card into the photograph. Official exam UI and lock hashes are unchanged.

Validation: paired-flow regression PASS, including upcoming red lantern and microphone outside scroll; 5/5 Sapporo hints match; approved UI lock 10/10 PASS; whitespace PASS. TypeScript reports only the pre-existing TS2352 life-content-repository.ts:41. Native recording and actual device/browser screenshots remain pending.
