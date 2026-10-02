# HUD midnight palette correction — 2026-10-02

User rejected the bright blue of navy-v2 as inconsistent with approved royal. Authoritative docs/ROYAL_AF_DESIGN_SYSTEM.md specifies glossy midnight navy, ROYAL.lacquer #0b1830 and lacquerLight #142847. Approved raster colour reference: nav-composite-navy-v1.png.

Built-in imagegen precise recolour of navy-v2, with approved navigation supplied as colour reference only. Prompt: change only blue interiors to dark muted midnight navy as approved nav; almost black lower half, restrained #142847 upper highlight, preserve silhouette, gold ornaments, transparent background, no text/new ornaments. Output inspected: cobalt wash removed, dark navy matched visually with approved nav.

New asset assets/app/ui/royal-af/hud-top-composite-midnight-v3.png, old version preserved. Cropping geometry adjusted to new significant alpha bounds x48..2017 y168..516, source2078x757; uniform scale and62dp maximum preserved. No changes to Credit/EXP, portrait/name/coin positioning rules, backgrounds or dialogue. Narrow direct-Git asset exception follows existing royal assets.

Colour sample mean RGB: approved nav(3.1,28.8,53.1); rejected v2(1.4,35.4,90.9); v3(3.7,21.6,42.1). Different art gradients mean these are representative samples, not a claim of identical pixels. Visual native approval remains pending. Scoped ESLint and UI lock checked.
