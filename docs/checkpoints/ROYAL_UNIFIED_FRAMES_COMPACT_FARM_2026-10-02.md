# Shared royal frames, rank badges and compact farm HUD

User request: use the new paper frame on Credit and qualification EXP, Home cards and Tokutei sectors; improve N5–N1 badges; put artwork and raster icons in Profile details; reduce Farm HUD to one row.

Implementation:
- Credit and qualification metrics use the same nine-slice paper image. Their ratios, values and qualification semantics remain. Rank colors tint the progress area lightly beneath dark labels.
- Home retains the three existing learning destinations and illustrations inside paper cards; Tokutei retains its six sectors, now in matching paper frames.
- Five distinct transparent 2.5D enamel medals replace monochrome N5–N1 CSS blocks. Labels remain live text for exact spelling.
- Profile detail modal now has full-cover cafe artwork with a dark translucent shade. Detail frames and achievement/stat cards use royal raster frames; emoji icons become existing book/map/trophy/work/key/lock PNGs. The edit and close controls use royal raster buttons.
- Farm HUD has Back plus one navy rail containing level, EXP, gold, diamonds and keys. Resource callbacks remain. Its initial return-control offset now matches the compact HUD; measured layout still drives subsequent positioning.
- Nine-slice corner size scales uniformly for short bars so corners are not distorted or silently omitted.

Built-in image generation was used for each rank badge. Prompt: polished sculpted 2.5D royal circular medal, antique gold bevels, midnight navy empty face for code-rendered level label, ornament around rim, transparent outside, straight-on, readable at 60px; no lettering or scene. Variants: N5 emerald budding leaf; N4 sapphire wave; N3 amber maple; N2 amethyst sakura; N1 ruby crown/laurel. Final PNGs: assets/app/ui/royal-af/rank-n1-v1.png through rank-n5-v1.png, 256px with alpha and an optimized 256-color palette. Original generated outputs remain intact.

Validation: TypeScript has only the previously recorded life-content-repository.ts:41 missing-type error. UI lock 10/10; five farm scenes x seven viewport geometry checks; compact HUD and panel geometry across widths 320–1440; whitespace checks pass. Full web bundle compiled successfully (11,567 modules; HTTP 200). Actual browser preview remains blocked by ERR_BLOCKED_BY_CLIENT and iPhone runtime visual approval remains pending. No microphone or native-device claim is made.
