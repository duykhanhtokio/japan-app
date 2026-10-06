# Native-language player prompt and one-tap Japanese ruby — 2026-10-06

User requested removing waiting dots, showing the speaking task immediately in the selected language, and revealing the full Japanese answer with hiragana above kanji when the lantern is pressed.

The shared dialogue route no longer imports or mounts WaitingSpeechDots. Native task is the initial player-panel state; one red-lantern press reveals the Japanese answer, a second restores the task. Microphone/transcript behavior and NPC gold-lantern translation behavior are preserved. Player panels have more vertical room and a minimum base font size of 14. JapaneseRuby displays aligned authored readings above their kanji at minimum size 9, with normal kana broken into characters for wrapping. Existing aligned text validation still prevents unrelated readings being shown.

Added Vietnamese/English task prompts and explicit hiragana segments for the five Sapporo station player turns, without changing Japanese answers or scenario IDs.

Production browser checks at 430×932 and 390×844 verified: native task shown before clicking, no Japanese answer exposed initially, one click reveals aligned ruby, ruby is not clipped by any hidden-overflow ancestor, second click restores native task, and no page errors. Screenshots inspected. ESLint has zero errors and the one existing turns dependency warning. Route contract, UI lock and diff whitespace pass. TypeScript retains the known life-content-repository.ts:41 TS2352. Native simulator acceptance remains pending.

Content coverage is incomplete: the shared/N5 audit finds 37,805 player turns, 10 with aligned authored ruby and 10 with Vietnamese/English hint translations; other languages have no authored hints in this audit. The older finite Vietnamese answer dictionary provides some additional legacy fallbacks. Missing native text remains a localized missing-content message, never a Japanese fallback. This is a UI behavior change and a testable Sapporo sample, not completion of multilingual/ruby authoring for the full corpus.
