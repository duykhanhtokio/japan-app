# Learning and grammar card frame — 2026-10-02

User explicitly requested the gold paper frame in screenshot 1 (16:37) for the N5–N1 list in screenshot 2 (13:57) and grammar cards in screenshot 3 (16:38).

Use the same RoyalPaperPanel raster artwork and nine-slice geometry as the approved learning section cards. Level cards and qualification summary now have the paper frame. Grammar cards use it with content-driven height. Existing learning data, navigation, progress, and mark-learned callbacks remain.

The section route contains both grammar and the locked exam catalog. Only the grammar card wrapper, its style and import changed. The test branch and character rendering were compared byte-for-byte with the previous source and are unchanged. No exam UI component changed.

Authorized section-route relock:
- Old SHA-256: `926da0e6d33db42cca47182a4144c54dbc72e3a238ad1cf0e00d657fec2acef2`
- New SHA-256: `a4b1820a39e9e7ecc51dbb3c8848d10bfdd0ac864b13392c2df2ce7817efb6b4`

Validation: TypeScript and lock checks are recorded in the session output. Native visual validation remains pending; the cloud browser cannot open the local preview.
