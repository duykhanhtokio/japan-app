# Royal reference HUD, bright JLPT backgrounds, speech reveal

User reference: 2026-10-02 8.52 image (1). Preserve earlier straight gold plaque shape using button-wide-v1 only for HUD name/coin, royal blue fill, longer name/shorter coin and tight Back/avatar spacing. Credit/EXP heights and economy unchanged.

JLPT study background uses approved clear-morning cafe artwork, actual blurRadius 40, cover, light translucent overlay .72 for dark text. Applies to learning home, level N5–N1, vocabulary/detail, grammar/characters and catalog. Selected official exam early return bypasses background wrapper. Official exam-taking components untouched. Only pre-exam wrappers/transparency in two locked files are relocked under V12.

Dialogue removes height-derived panelWidth entirely: both frames fill the same available width, below waist, with overflow scrolling. NPC Japanese reveals monotonically at expo-speech onBoundary charIndex/charLength and completes onDone. Stale events ignored by existing active guard. Gold lantern toggles existing native translation only on request; it does not reveal all Japanese prematurely. Player red first press shows available native guidance, second full Japanese model with aligned ruby when authored. Lantern position, mic placement, auto pairs, no forced replay preserved.

Validation: scoped ESLint zero errors/warnings; paired-flow mock regression passes boundary reveal, requested NPC translation, two player hint stages, pairs, stale completion, final turn, Back replay suppression. JLPT navigation contract PASS; lock PASS 10/10. tsc retains only pre-existing life-content-repository TS2352. No actual device/screenshots: cloud browser local URL failed ERR_BLOCKED_BY_CLIENT; local HTTP preview unavailable (000). Do not claim native speech boundary timing or visual device approval.

Data gaps: whole-corpus native hints and ruby remain pending as recorded in DIALOGUE_WAIST_HINT_STAGES_2026-10-02.md. Missing translations/readings are not fabricated and no content-completion claim made.
