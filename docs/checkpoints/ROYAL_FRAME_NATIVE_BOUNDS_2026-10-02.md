# Royal native image bounds repair — 2026-10-02

Base: c9904a0d3c6a61d71128fd1c4c44f44976dc1f42. User simulator screenshots show navy plaques narrower than their backing and an oversized dialogue image overflowing its frame.

RoyalNavyFrame now sizes its image using measured outer width and height instead of a percentage width resolved inside padded containers. RoyalReadingFrame explicitly constrains the native Image to measured frame dimensions and clips artwork to its container. Reading content remains in a bounded ScrollView, and the microphone remains in its separate action row. No content, economy, navigation callbacks, bar heights, or locked JLPT files changed.

Validation: scoped ESLint passed; UI lock passed 10/10; bounded-frame geometry checked at widths 320, 360, 430, 768, 1024, 1440. TypeScript retains the known life-content-repository.ts TS2352 generated-index error. Native visual approval and microphone interaction verification remain pending; no device screenshots claimed.
