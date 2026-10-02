# Waist-bounded dialogue and staged hints — 2026-10-02

User authorizes UI changes and requests native-language hints and aligned ruby for the whole dialogue corpus. This supersedes deferred translation only for these player hint/readings; original Japanese dialogue remains unchanged.

Dialogue top is computed from NPC contain-image geometry and a 0.43 source-height waist anchor (station artwork inspected), clamped below the measured header. Both panels stay in the bounded area below that anchor; on small screens the outer area and inner text remain scrollable. Frame width is limited by available height to preserve artwork ratio. Dialogue text line height is 21 instead of 26.

Player initial state is six dots brightening left to right. Lantern first press shows the authored task in the selected app language (existing native hints/answer meanings may be reused); second press shows the Japanese model answer, with aligned authored hiragana above kanji when available. Missing readings are not guessed. Native-language gaps display an explicit unavailable message only after the learner requests a hint. Default narration and audio-confirmation/development-build notices removed. Existing recording logic and automatic NPC-to-player transitions preserved.

HUD approved name has more space: coin allocation 25% instead of 36%; Back-to-avatar gap 2 instead of 8. Credit/EXP heights unchanged. Writing and specified-skills backgrounds use approved study/engine artwork with blurRadius 40, cover and translucent tint.

Data completion: NOT COMPLETE. Selected shared/N5 packages contain 37,805 player turns. Initial Aomori station batch has 5 aligned ruby answers and 5 authored Vietnamese + 5 English task hints. Other native languages and remaining ruby are pending. Existing finite Vietnamese meanings remain available through getPlayerNativeHint. scripts/check-dialogue-hint-coverage.mjs checks sidecar identity, ruby concatenation/readings and reports gaps. Sidecar authored content is AI generated and not native-speaker reviewed. Whole-corpus authoring remains required, with no content PASS claimed.

Validation: scoped ESLint pass; paired-flow mock tests include zero/first/second hint stages, automatic pairs, retained context, final turn, replay suppression and stale callbacks; JLPT UI lock pass 10/10. Geometry inspected at six portrait/landscape sizes. TypeScript retains only the pre-existing generated life-content index TS2352. Native visual/ruby wrapping and actual microphone tests remain pending; no simulator screenshots claimed.
