# V15 — measured shared Back alignment

2026-10-03, explicit user request at12:53JST. Only shared header positioning is authorized here; no exam question/result/session behavior changes.

Approved constants already in RoyalPositioning.ts: screenGutter12, backSafeTop8, backTouch44, backArtwork36. Touch-box origin is (safeArea.left+12,safeArea.top+8). Centered36px artwork origin is (safeArea.left+16,safeArea.top+12). Existing hitSlop8 is preserved. The old48px header slot centered a44px control and introduced2px extra vertical offset. Replace it with44px and align the slot to the content top; use the shared constants instead of literals. Header text/inks, callbacks and surrounding safe-area branches remain unchanged.

Old SHA-256: adba4ca1690e6241073f49552eea71296d1a823b98698d237e28dfb37529f127
New SHA-256: d845d4b61153d8706bd88617e734f07297f27afa7f0af45080213164138d6ebc

Production-web checks atfive sizes confirm (12,8,44,44) on catalog,start,running andresult. Active N1第2回 runner: select an answer, open/close navigator and Back returns tocatalog. N5result uses an isolated saved-session fixture. N1OfficialTrial and session/data/token files remain byte-identical; allother lock hashes remain unchanged. Native safe-area insets need device acceptance. Evidence: STABLE_WAIST_BACK_1253_2026-10-03.md.
