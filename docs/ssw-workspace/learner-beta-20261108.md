# First learner beta — publisher scope 2026-11-08

Publisher temporarily disabled all three institution areas: Japanese language schools, supervising/registered support organizations, and accepting companies. Preserve their implementation for a later release.

- organizationPortalsEnabled=false in every build, including development acceptance.
- All 11 /portal routes redirect before mounting institutional content. /portal redirects to learner registration; institution deep links redirect to /home.
- Welcome Start now opens /register directly. The acceptance menu excludes every institutional destination and is labeled for learners. Existing learner registration/work profile, NPC onboarding, learning, Tokutei and progress remain intact.
- Fixed the shown NativeSharedObjectNotFoundException: the installed expo-audio useAudioPlayer hook auto-releases its native player on unmount, while OnboardingMusic and PressSound also called pause during cleanup. Each effect now creates and owns its own player, unregisters callbacks, cancels pending playback, then pauses/releases safely. Cleanup tolerates an already released native object. No registration data or UI redesign.

Validation: scripts/tokutei/check-learner-beta.cjs exercises all 11 route guards, learner path availability, pending music setup during exit, registration re-entry, native cleanup after external release, and pending press-sound seek during navigation to a quiet route. JLPT byte-lock check and git diff --check pass. Tests use mocked native players and router; the actual iOS registration flow still needs the publisher simulator check. This is not native device certification.
