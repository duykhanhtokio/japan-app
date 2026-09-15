# Royal A+F Design System — approved master specification

Status: APPROVED by the product owner on 2026-09-06.

This document is the permanent source of truth for the Japan App visual language.

## Core character

- Dignified, modern, adult, premium and ceremonial Japanese 2.5D design.
- Glossy midnight-navy enamel, dimensional antique gold rails, champagne-gold
  highlights, warm ivory information surfaces, restrained deep shadows.
- Never use flat CSS-looking cards, gray native pickers, cyan panels, plain thin
  borders, or generic unstyled controls in player-facing UI.

## Approved nested field standard

All information-entry and explanation fields use this structure:

1. The body is full-width warm ivory with a sculpted layered gold frame.
2. There is no dark-blue left column.
3. A compact glossy navy label plaque is attached directly to and overlaps the
   upper-left gold border. There must be no visual gap.
4. The plaque is only wide enough for its label.
5. Field values are dark navy. Select chevrons and selected checks are gold/navy.
6. Use the same component for registration fields, work-selection fields,
   missions and explanatory panels.

Production components: `RoyalField`, `RoyalInfoPanel`.

## Selectors and dropdowns

- Dropdown container: ornate gold frame with warm ivory interior.
- Rows: spacious ivory rows separated by fine gold rules.
- Selected row: pale-gold highlight with a small navy circular check bordered in
  gold.
- Never expose the gray default iOS/Android picker UI.
- Level, language, occupation, work category and operation selectors all follow
  the same treatment.
- Their modal shell is the straight-sided raster `selection-panel-rect-v1.png`;
  every option row is image-backed. Never simulate the shell or rows with CSS,
  and never stretch the horizontal dialogue frame into a bottle-like panel.

## Buttons and titles

- Primary actions and page-title panels use the wide navy-and-gold image-backed
  control (`button-wide-v2.png`). This is the single approved wide-button asset.
- Buttons have rounded dimensional edges, surface gloss, shadows and a pressed
  downward translation.
- `学習者登録` and equivalent step titles use the same family as the NEXT button.
- Official back icon: option A, curved left-return arrow. Use
  `button-back-curved-a-v1.png`; do not render `<`, `‹` or a font arrow.
- Visible back artwork is 36×36 inside a 44×44 touch target across the app.

## Typography — approved option A

- This choice is permanent: do not ask the product owner to select the font again.
- Headings, page titles, prominent Japanese dialogue and primary button labels use
  locally bundled `Noto Serif JP SemiBold` (`RoyalSerifJP-SemiBold`).
- Field values, labels, descriptions, dropdown rows, readings and helper copy use
  locally bundled `Noto Sans JP Medium` (`RoyalSansJP-Medium`).
- Load both fonts at the application root before rendering routes. Never depend on
  a network font request or a device-installed font.
- Font assets live in `assets/app/fonts/`; their OFL license files must remain next
  to the font files in every full-source release.

## Registration

- The final action on Step 1 and Step 2 uses the same 114 px minimum height and bottom
  inset. Step 2 bilingual completion copy uses a 33 px line height with safe
  vertical padding; Step 1 text remains vertically centered in the same asset.
- Compact input fields on both registration steps use the same 82 px minimum
  height and a 55 px minimum vertically centered content region. Long content
  wraps completely and expands the raster-backed surface; it is never clipped
  or shrunk merely to keep the step on one phone screen.
  Work selectors use 1.5× line spacing and center all lines vertically and
  horizontally within their own ivory surface. Selected localized/Japanese
  values, counts and empty prompts share the same center axis.
  The Step 1 title group has an enlarged upper inset. The bilingual
  `ご案内` plaque supports two centered lines at 58% panel width, with an
  expanded ivory explanation body beneath it.

Step 1 fields in order: name, Japanese level, nationality, email, app language.
Step 2 uses the exact same field construction, typography, spacing and dropdown
language. Email is passed to Step 2 and persisted in the user profile.

- Step 1 is displayed in Japanese. Starting at Step 2, every instruction,
  field label, selector and action is displayed in Japanese plus the language
  selected on Step 1. The choice is persisted and becomes the app language
  after Step 2 completes.
- Email entry uses an English email keyboard and an in-field `@` control as a
  reliable fallback for Japanese keyboards and iOS Simulator keyboard layouts.
- The Step 1 title description stays inside its title panel safe area. The
  language selector includes a Japanese note directly below `言語を選択` telling
  players to swipe upward to reveal the remaining languages.
- Step 2 separates the Japanese title and localized title into independently
  wrapped lines. Guidance, field plaques, selected values, counts and every
  expanded option row use natural wrapping and content-driven height. The bilingual
  completion action uses a compact 21 px line height.
- The `業種` closed selector and expanded rows contain only the industry name
  and optional Japanese name; they never show a secondary `…職種` count or
  translation. The `職種` closed selector and expanded rows contain only the
  occupation name and optional Japanese name; they never show a secondary
  `…作業` count or translation.

## World, location and dialogue

- Category/location imagery must match its actual context.
- Mission copy must state the real task for the current scenario.
- NPC is centered. The visible shoe tip aligns with the bottom edge of the
  `次へ` navigation button row.
- Dialogue begins around the NPC waist and grows downward.
- Each turn is a separate ivory/gold dialogue card with an attached navy speaker
  plaque. NPC plaque shows the NPC name; player plaque shows the player's name.
- When space is exhausted, remove/scroll one complete old dialogue card. Never
  clip a card through its text.
- The icon-only red lantern hint is attached inside the active dialogue card's
  lower-right rounded corner.
- Previous/Next and reward actions use the wide Royal A+F button family.
- World map explanation markers show the Japanese place name plus its English
  reading/name on an ivory image-backed surface. Other world, region,
  prefecture, city, location and conversation navigation remains Japanese-led.
  Emoji/glyph arrows are not used in these screens.
- Map markers and location-category headings use the navy/gold Royal capsule.
- City and prefecture rows use a tall, spacious 40/60 split: 40% context image
  and 60% ivory text area. Text is centered inside that 60% region and must
  shrink or wrap within its own frame instead of overflowing.
- Locked location cards use the golden-grape lock crest, a dark veil, and retain their
  original context background and gold frame.
- No numeric turn counter is shown. During a player turn, the card first shows
  the intended answer meaning in the selected language. Tapping the icon-only
  red lantern reveals the exact Japanese answer. The lantern sits inside the
  dialogue frame at its lower-right rounded corner.
- Dialogue cards do not bob. Complete cards move as units and are never clipped
  through their text.
- The current NPC text is hidden until the player presses the red lantern.
- The microphone breathes slowly over a three-second cycle. When recognition
  starts, the icon is replaced by the recognized transcript.

## NPC cards and rewards

- Locked cards preserve the full card frame and background.
- Only the chest-up NPC silhouette is blacked out; apply a subtle locked veil and
  centered question mark.
- Reward reveal rotates around the vertical axis. Its gold radiance is baked
  into the production card artwork, never drawn with CSS/native rectangles.
- The reward card may appear only after the final NPC voice playback completes.
- Star progress is a clean fixed five-slot rail; never place loose star icons over
  unrelated card areas.
- Closing a reward returns to the city's conversation overview.
- On locked starter-NPC cards, the grape lock occupies the upper-right position
  used by the unlocked `利用可能` marker.

## Learning Mode HUD

- The complete HUD uses raster Royal A+F surfaces; CSS/native borders, fills,
  emoji avatar/currency icons and default controls are forbidden.
- The approved compact header contains the shared Back button, circular player
  portrait, player name without LV, compact coin counter, Japanese-ability
  current/next rail and a separate CREDIT rail.
- The approved compact footer contains four equal image-backed cells labeled
  ホーム, ゲーム, ミッション and プロフィール.
- Both HUDs use one physical-edge formula:
  `Math.max(top safe inset, bottom safe inset) + 8`.
- The three learning cards share one calculated height and equal gaps within
  the center space; the smaller 学習モード title must not steal card space.
- Approved Home metrics are: top HUD 170 px, top row 78 px, avatar 72 px, coin
  surface 112 px, bottom HUD 70 px, heading region 54 px, and card gap 8 px.
  The earlier 108 px top-HUD value is superseded.

## Registration header parity

- Step 1 and Step 2 title/explanation frames share a 132 px minimum height.
- Both use 18 px vertical frame padding, 40 px horizontal copy inset and the
  same title/localized-description scale.
- The portal English heading and every English portal row use 12 px. Never use
  `adjustsFontSizeToFit` on the heading, because it silently makes it smaller.

## V19.3 HUD and world corrections

- Home header order is Back, overlapping portrait/name frame, coin frame, then
  two vertically stacked full-width energy rails.
- Short Japanese work plaques share the compact 国籍 dimensions.
- Map-marker color, gold frame, copy and touch target use one identical outer
  rectangle. Outer padding is prohibited; copy padding stays inside.
- Map-marker Japanese and English text use dark ink over land colors.
- Prefecture titles are full-width and independent of Back. City-row wrapper
  height equals one third of its computed width.
- All HUD and Learning Mode text uses `RoyalSerifJP-SemiBold` or
  `RoyalSansJP-Medium` according to the approved typography roles.

## Canonical ivory

- The code-rendered ivory background sampled from `最初の仲間` is `#e8e2d6`.
- `ROYAL.ivory` and shared theme background tokens use this exact value. Solid
  and translucent code-rendered white backgrounds use the same `232,226,214`
  RGB base; ivory already baked into Royal raster artwork remains unchanged.

## Production assets

- `assets/app/ui/royal-af/button-wide-v2.png`
- `assets/app/ui/royal-af/start-frame-transparent-v1.png`
- `assets/app/ui/royal-af/dialogue-frame-v1.png`
- `assets/app/ui/royal-af/button-back-curved-a-v1.png`
- `assets/app/ui/royal-af/lock-grape-v2.png`
- `assets/app/ui/royal-af/hint-red-lantern-v2.png`
- `assets/app/ui/royal-af/location-card-frame-grape-ivory-v2.png`
- `assets/app/ui/royal-af/place-row-frame-grape-ivory-40-60-v3.png`
- `assets/app/ui/royal-af/reward-grape-stars-0-v2.png` through `reward-grape-stars-5-v2.png`
- `assets/app/life/rewards/npc-card-frame-royal.png`
- `assets/app/fonts/NotoSerifJP-SemiBold.ttf`
- `assets/app/fonts/NotoSansJP-Medium.ttf`

## Coordinate and semantic-size contract

Use only `ROYAL_LAYOUT` from `RoyalSurface.tsx` for these dimensions:

- screen gutter: 12 px;
- back touch target / visible artwork: 44 / 36 px;
- purpose, Step 1 and Step 2 top panel minimum: 112 px;
- compact registration field / content region minimum: 82 / 55 px;
- final action minimum: 114 px;
- selector header / option row minimum: 44 / 72 px;
- level and language selector: `min(screen width - 24, 520)` wide and
  `min(screen height - 24, 560)` high.

Selector headers have no X. Every framed text wrapper is exactly 100% of the
frame content area and uses both-axis centering plus `textAlignVertical` and
`includeFontPadding: false`. Never center framed text against the screen.

Content-driven Royal surfaces use `ROYAL_CONTENT_GROUP` from
`RoyalPositioning.ts`. A group is defined by semantic role, relative position
and page family—for example, registration header explanation, registration form
field, or world scenario explanation. Each member wraps to its natural height;
the shared runtime registry then applies the largest measured height to all
members at the same viewport width. Different positions remain separate groups.
Do not use fixed `height`, `maxHeight`, `overflow: hidden`, `numberOfLines` or
font shrinking as a substitute for this rule.

The group size is applied directly to the visible raster `ImageBackground`.
An outer wrapper alone is not a valid sizing target. Attached navy plaques are
measured independently in both axes because absolute children do not contribute
to parent layout. Plaque copy never uses `width: 100%` inside an intrinsically
sized absolute plaque. World-map ivory markers use a 104 px minimum height so
both Japanese and English remain inside the visible ivory surface. The Learning
Mode HUD uses a 118 px minimum height and 58 px minimum control-row height.

Every player-facing header anchors the Back touch target 12 px from the content
edge and 8 px below the safe-area top. `RoyalBackButton` remains top-aligned even
when adjacent title copy makes the header row taller.

## Verification gate

For every visual release:

1. Run `npx tsc --noEmit`.
2. Build/export the relevant Expo target.
3. Inspect an iPhone-size preview using the same production assets.
4. Obtain visual approval before creating the distributable ZIP.

## Asset-only visible surfaces

Game, world, registration, home and dialogue target Royal A+F 2.5D. JLPT exam
routes are explicitly excluded: their header, questions, passages, answers,
audio controls and review screens use the neutral print-like JLPT system. Royal
assets must not be imported into an exam component. Until a non-exam 2D asset
has an approved 2.5D replacement, it must be listed as pending and must not be
counted as normalized.

- React Native `style` remains only for responsive position, size, spacing,
  typography, opacity and touch geometry.
- Visible frames, borders, buttons, pills, selector chrome, locks, chevrons,
  lanterns and reward lighting must come from raster assets.
- Do not add `borderWidth`, `borderColor` or `backgroundColor` to simulate a
  player-facing control or card.
- The golden-grape cluster replaces every chrysanthemum/imperial-style crest in
  the Royal interface.
