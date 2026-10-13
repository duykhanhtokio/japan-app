# Study background scope — 2026-10-13

User authorized applying #F3F0E8 to lesson contents and restoring blurred image backdrops to external list screens. This supersedes the all-screen #FAF9F5 treatment from 9716c64.

`STUDY_IVORY` is #f3f0e8, matching the pre-change legacy N1 content background. Construction reader backdrop includes the header and safe-area edges. Construction field/week/day selectors use RoyalPageBackground, whose image cover and blur are unchanged. JLPT level and vocabulary selectors and the exam catalog use the blurred backdrop; vocabulary detail, grammar/characters contents and active exams use solid ivory.

The only change to the locked exam catalog is the outer wrapper's enabled={!!selected}. Its answering flow, data, session state, cards and callbacks remain byte-for-byte unchanged. Specifically authorized background-only relock:

- Old SHA-256: 5d937daad922ea391203d17d727cccfcf876d33e65a3258914407ca3f207b3bf
- New SHA-256: e57fd7e4d981f9adfe706558c01d9bfe4381098cfcc91a70445dfe5b362bb8dc

Other nine locked files are unchanged. Syntax bundle and UI-lock checks are recorded after implementation. Runtime evidence and limitations are appended below.

Validation: changed TS/TSX syntax compiled (7 files), actual Construction/Background bundle built, UI lock PASS10/10. Isolated React Native Web navigation passed field → week → day → reader → day at390×844,844×390,768×1024. Reader and shared JLPT content corners all RGB243,240,232; list backdrop corners use image pixels. AI inspected reader/week phone and landscape screenshots. Runtime evidence lives in `docs/ssw-workspace/kensetsu/runtime-tests/2026-10-13-background-scope`. This is bounded fixture/adapter verification: first real session, mocked persistence/insets, some control assets substituted. Native Expo, real-device insets and complete exam flow were not tested.
