# Royal home and dialogue layout repair — 2026-10-02

Base: a010d79e1eac64b77c9a7dc3adf1d8614245dd18, recovery/jlpt-n3-n1.
Status: implementation checkpoint; visual/native acceptance PENDING.

User authorized HUD proportions, blurred home artwork, royal heading, readable Credit, contained guide text, stable player frame and separate microphone. User selected an explicit help button for dialogue rules; no automatic guide display.

Changed only home, shared GameHeader, location guide presentation, dialogue presentation, and new RoyalReadingFrame. Economy, content, speech callbacks, route actions and JLPT exam UI remain unchanged.

HUD: separate balanced top-row widths; 72px base avatar; keep the reduced meter heights. Credit uses pale text on navy, without white glow. Home uses existing welcome landscape art with cover and strong blur, plus existing royal navy plaque.

Guide: optional help button opens bounded scrollable modal. Dialogue: constant frame position for both speakers; source frame retains 1600:550 ratio; copy scrolls inside its ivory safe area; hint and microphone sit in a separate fixed-height action row.

Validation: scoped ESLint clean; JLPT lock PASS 10/10; diff whitespace check clean. TypeScript still reports existing TS2352 in src/services/life-content-repository.ts: generated SC-HKD-HAKODATE-001 index lacks required type. No unrelated data was modified.

Runtime screenshots and native checks are unavailable in this environment: Playwright Chromium download returned an invalid/truncated archive; CUA rejects localhost with ERR_BLOCKED_BY_CLIENT. No screenshot, iPhone, iPad, Android or desktop visual PASS is claimed. Check /home, /world/location/LOC-001-01 (help open/close), /world/dialogue/SC-LOC-001-01-001 (NPC/player, long text, mic, hint, previous/next) on native and web before release.

## HUD follow-up after user's native check

User reported missing royal-blue fill in name/coin plaques and coin touching ornament. RoyalNavyFrame now supplies an explicit inset navy backing and positions the plaque Image directly in its measured container. Coin safe padding is 22% on each side; name padding 19%; coin icon reduced; approved coin allocation increased to 36%. Thin Credit/EXP heights and all economy behavior preserved. Scoped ESLint and UI-lock checks pass; native visual confirmation remains pending.
