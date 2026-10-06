# Restore approved waist anchor and city blur

User requested restoring two unintended regressions observed on iOS; mic position is approved and untouched.

Dialogue: ed4d74be introduced a player-turn override placing the conversation below the header rather than at the NPC waist. Both speaker states now use the original max(header bottom, source-space NPC waist) anchor. Two panels again share the remaining space equally and use the original slot-based offset; this prevents the formerly enlarged player panel overflowing the smaller waist-anchored area. Immediate selected-language prompts, lantern Japanese/ruby behavior and mic code remain intact.

City blur: 1c704169 migrated city backgrounds from RN Image to the shared expo-image renderer. expo-image's installed iOS ImageModule.swift divides blurRadius by two. AppBackdrop now compensates by a factor of two only for city backgrounds on iOS (12 portrait / 20 landscape, internally 6 / 10). Android/web remain 6 / 10. Clear location/dialogue backgrounds and other blur values remain unchanged. This retains processed-image handoff and does not add a background layer.

Validation: route transition contract PASS; JLPT UI lock PASS 10/10; scoped ESLint has no errors (existing turns dependency warning). Targeted execution of actual AppBackdrop verifies iOS portrait/landscape and unchanged Android/web radii. Actual conversation anchor expression verifies both speaker states at multiple waist heights. Legacy check-dialogue-paired-flow.cjs cannot execute because its old scenario fixture lacks fields read by the current screen (undefined.trim); no pass claimed. Native visual acceptance remains pending; radius compensation is implementation-verified, not a claim of pixel-identical blur across different native algorithms.
