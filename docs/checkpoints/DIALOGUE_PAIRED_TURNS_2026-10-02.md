# Dialogue paired turns and mission safe area — 2026-10-02

User requests task text inside the readable frame and automatic NPC-to-player transition, retaining the NPC line above the current player prompt.

The task panel now uses the measured aspect-preserving RoyalReadingFrame with a separately positioned label. Its text stays in the inset scroll region rather than using the old RoyalField minimum-height padding. Dialogue panels are a bounded scrolling column between header and bottom navigation; long text scrolls inside each frame. The lantern stays on each dialogue frame lower right edge; only the microphone sits in the separate centered row.

Successful NPC audio completion reveals its text, advances to the adjacent player turn, and retains the NPC context. A heard-ID set suppresses forced replay on Previous. Abandoned speech callbacks cannot advance the current turn. Stopped/error speech does not automatically advance; the existing Next control remains available. The last NPC retains the Finish/reward flow. Content and economy are unchanged.

Validation: mocked screen regression (scripts/check-dialogue-paired-flow.cjs) verifies five pairs, retained context, final turn, no forced replay and stale-callback guard. Scoped ESLint and 10/10 JLPT lock pass. TypeScript has only the existing generated life-content index TS2352. Native layout, recording and platform screenshots remain pending; mocked tests are not native visual approval.
