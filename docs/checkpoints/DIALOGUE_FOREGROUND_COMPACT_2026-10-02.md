# Dialogue foreground and compact royal controls — 2026-10-02

Base e091d93a528b4f4fc636658a941edd611191a033. User screenshot shows the NPC drawing over dialogue text and microphone after the ScrollView refactor.

Set dialogue ScrollView zIndex 5 and Android elevation 12 above NPC zIndex 1. Compact attached mission and speaker plaques use 120×26 slots, placed at the frame top with 12px overlap and explicit foreground ordering. Speaker labels fit one line. Pair spacing reduced: 14px lower spacing plus 12px next overlap slot instead of 26px lower space plus a separate 40px speaker label. Reading insets and font sizes unchanged.

Lantern artwork is 30×38 and remains on the lower right edge, with 8px hitSlop. Player uses existing hint-red-lantern-v2.png; NPC keeps gold. RoyalHintButton's optional color defaults to gold for existing consumers. Microphone artwork is 28×28 inside a 44×44 touch target and separate 44px row. Audio/turn transitions, learning content, economy and navigation callbacks unchanged.

Checks in this session: replacement assertions, equality of audio/transition logic, and basic label/lantern containment at widths 320, 360, 430, 768, 1024, 1440. Execution environment is unavailable: ESLint, TypeScript, paired-flow regression, native screenshots and check-work-persistence.mjs were NOT run. GitHub commit/ref and final source readback are verified separately. Runtime/visual acceptance is pending.
