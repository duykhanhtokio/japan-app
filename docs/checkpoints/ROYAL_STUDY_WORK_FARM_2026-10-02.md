# Royal study, work mission and farm repair — 2026-10-02

## User references

15.36: N2 learning sections; 15.27: work mission agricultural conversation; 15.37: farm map and crowded cartoon HUD.

## Implementation

- N5–N1 section cards use actual royal paper frame imagery and four new navy/gold 2.5D learning icons, replacing emoji and faint native borders. Cards scroll on smaller screens. Routes remain unchanged; official exam-taking UI is untouched.
- RoyalPaperPanel assembles nine raster regions, preserving corner proportions and extending straight edges; text lays out independently from the artwork. It supports ivory and navy artwork without generating CSS borders.
- Work conversation uses an agricultural NPC sprite for operation codes beginning 1-, the existing construction sprite otherwise, scene artwork, royal dialogue and mission panels, raster microphone/lantern, and royal action buttons. Header Back uses the common screen gutter and safe-top tokens. Evaluation, branching, recording callbacks, rewards and authored dialogue are preserved. Main content can scroll on small screens; completion/error backgrounds remain navy.
- Farm backgrounds now explicitly set Image width and height to 100% of their viewport, avoiding intrinsic-image dimensions that can diverge from cover/hotspot calculations. Change applies to map, vegetables, orchard, chicken and cow scenes.
- Farm HUD replaces the old cartoon composite with navy/gold 2.5D plaques in two rows. Level, farm XP, gold, diamonds and keys are live values. Existing add-resource callbacks remain. The map return control is positioned below the measured HUD rather than at a fixed offset.

## Validation and limits

Approved JLPT UI lock 10/10 PASS; five scenes × seven viewport geometry checks PASS; paired-dialogue regression PASS; whitespace PASS. TypeScript reports the existing life-content-repository.ts:41 TS2352 (missing type in SC-HKD-HAKODATE-001); no new UI type errors in the last validation. Native simulator/recording and actual device visual checks remain pending. Browser preview attempted on localhost:8085/N2 and blocked with ERR_BLOCKED_BY_CLIENT; local curl returned HTTP 000. No device or screenshot approval is claimed.

## Generated assets and prompts

Built-in image generation was used, with real alpha preserved and original output bytes copied into assets/app/ui/royal-af. These PNGs are ordinary Git blobs so the assets and references are persisted together.

Shared icon prompt: polished sculpted 2.5D royal midnight navy lacquer #0b1830 and antique gold beveled trim, ivory details, dimensional highlights; one centered isolated object filling about 80% of a square transparent canvas; no flat emoji, no scene, no label.

- learning-vocabulary-v1.png: ivory vocabulary notebook, navy leather cover and gold page edges, diagonal gold fountain pen.
- learning-grammar-v1.png: open ivory grammar book, navy leather cover, gold corner guards and subtle page lines.
- learning-exam-v1.png: ivory examination parchment, navy/gold award seal and gold quill, no readable writing.
- learning-characters-v1.png: three thick ivory tiles with navy bevels and gold rims, glyphs あ, ア, 漢.
- farm-hud-plaque-v1.png: horizontal navy enamel plaque with antique gold bevel and modest grape-leaf corners; empty center for live data, no baked numbers/icons/avatar, transparent outside.
- work-farm-supervisor-v1.png: friendly Japanese male farm supervisor in navy work jacket, beige trousers, boots and pale brimmed work cap, gloves in hand; natural proportions and conversational pose, full body, semi-realistic dimensional game art, transparent outside; no helmet, backpack or unrelated tools.
