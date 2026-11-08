# Publisher acceptance corrections — 2026-11-08

Scope: current publisher request; no new curriculum or exam authoring.

- Shared previous/next rows now use equal flexible columns, no row wrapping, and the same outer margins. Week range text is above the two navigation buttons. Navigation labels use the existing Royal typography with one-line fit.
- Manufacturing specialty selection now follows construction: individual Royal paper panels with heading and an existing navy/gold action. Existing calendars, readers, saved learner IDs and content are preserved.
- Manufacturing sector-list cover is one continuous factory scene, matched to the checked-in construction cover. It is not displayed inside a course. The complete WebP is stored in ordinary Git, with a narrow LFS exclusion.
- Audio prefetch prepares only the currently opened conversation, serially. Playback and prefetch share an in-flight pack download and cached local source; stopped turns never start when a download finishes. First uncached native playback still requires the pack download; there is no measured device latency claim.
- JLPT bundle mitigation: extend the existing lossless authored-JSON transformer to JLPT JSON without touching source files, cap Metro transformer workers at two, and provide scripts/start-acceptance.cjs with an 8192 MiB Node heap. The screenshot shows a stopped Node/bundle-load error, but does not establish the exact root exception. No claim of a reproduced native crash or full native build.
- Development onboarding no longer skips registration. Development farm routes are enabled. The home review entry opens /acceptance with existing feature entry points including registration, all sectors, all JLPT levels, portals, game, tasks and wallet. It is dev-only; production farm scope is retained. Secure account/server requirements are not replaced with fabricated financial state or paid entitlements.

Validation: shared calendar/figure interaction tests; real manufacturing selector → week 1 → day 1 for all three specialties with mocked native hosts; audio download sharing/cache/cancellation test; lossless JSON round trip; 10/10 locked JLPT files and registry checks; common component isolated TypeScript; syntax checks and git diff --check. iOS visual layout, actual first/next-line timing and full JLPT bundle must still be confirmed on the publisher's simulator.

Run after updating: node scripts/start-acceptance.cjs. Stop the previous Expo process first.

Image prompt: single square modern Japanese factory environment, navy/gold CNC and electrical assembly, warm light, Royal A+F 2.5D materials and depth matching assets/app/industries/construction-v1.png; no split panels, collage, labels or text.
