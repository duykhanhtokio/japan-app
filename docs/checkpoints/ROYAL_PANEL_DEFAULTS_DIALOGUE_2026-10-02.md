# Royal panel defaults and dialogue corrections — 2026-10-02

User authorization: full-frame Home artwork, restored crimson Credit, vocabulary and JLPT exam-list frames, reusable panel defaults, larger farm avatar, reduced navigation flash, place-name romanization and non-scrolling dialogue with attached hint lanterns.

Common defaults live in RoyalPanels.tsx and AGENTS.md: content uses paper/gold, explanation uses navy leaf artwork. Home images use explicit full dimensions, while the raster border leaves the center open. Short Credit frames have thin border slices, so the crimson underlay remains visible instead of being covered by opaque paper. Farm avatar uses the Home 72px size. Hokkaido labels use Dōō/Dōnan/Dōhoku/Dōtō; region romanization replaces the English directional descriptions.

Dialogue has no outer or inner ScrollView. The visible NPC and player panels share the available viewport height according to text length, reduce type size when necessary, preserve the full strings, measure the remaining text block and scale any overflow to its available height, and use compact controls in landscape. Gold/red hints attach inside the right frame edge. Longer multilingual content may become small; native readability and precise text measurement still need device review.

Navigation mitigations: disable native stack transition animation, avoid reselecting the active tab, preload shared artwork, remove the location-card entering fade, disable common image fade duration, provide immediate frame/background colors, and reuse last loaded game-progress data while refreshing. These changes are not proof of zero latency/flicker on every device.

Only the authorized catalog file was relocked: ApprovedJlptExamCatalog.tsx old SHA256 eeb3bda08045e682ba9ef86d70a382eec7092805d222d7e751dbf4638dd1cd4f; new 597593050e507442e8b29836f89afb66b412142b3e905e23dc8d9e0baf849c78. Its exam-selection callbacks, data/counts/history and active-exam runner are unchanged. Other exam files remain locked.

Validation: web bundle HTTP200 (137078157 bytes); UI lock PASS 10/10; farm artwork PASS 5 scenes × 7 viewports; Credit center geometry at 8 widths × 2 heights; no-scroll/full-image/attached-lantern/romanization contracts; git diff --check. TypeScript only reports the existing generated dialogue-data TS2352 in life-content-repository.ts(41,9). Simulator/device visual and transition timing validation remains pending.
