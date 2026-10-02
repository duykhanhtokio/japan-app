# Corrected HUD reference — 2026-10-02

User replaces wrong 08:52 reference with 2026-10-01 20:22 image (1)(1). Its identity row uses hud-top-composite-v1: elongated name plaque overlapped by avatar at left, short coin plaque with grapes/leaves at right. The button-wide substitution in 06309500 is superseded only for HUD identity.

Built-in imagegen precise-object-edit recoloured original composite ivory interiors to royal navy (#142847), preserving original overall outline and gold ornaments. Original retained; sibling assets/app/ui/royal-af/hud-top-composite-navy-v2.png integrated. Prompt: change only ivory interiors to royal navy, preserve long left name, short right coin, gold border/grapes/leaves, exact proportions/spacing, transparency, no text/avatar/coin/new ornament. Output visually inspected against original. Generated file 2078x757, significant alpha bounds x51..2017 y178..528. Low-alpha noise outside artwork clipped at runtime.

GameHeader approved and royal variants render this one composite at uniform scale, cap height62 within78 top row, avatar overlaps left, name/coin click areas in interior safe zones. Name longer than coin; coin flower clear of icon/text. Typography measured against art height; enlarged hitSlop preserves touch targets. Credit/EXP height and logic unchanged. Study variant unchanged.

Validation: scoped ESLint PASS; TypeScript only pre-existing life-content-repository TS2352. JLPT lock10/10 PASS. Geometry320/360/390/430/768/1024/1440 checks aspect preservation, top-row fit, safe text width, longer name. Actual native screenshots and visual approval remain pending. Prior JLPT backgrounds and dialogue fixes preserved.
