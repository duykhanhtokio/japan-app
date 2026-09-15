type CenterpieceBounds = readonly [width: number, height: number];

/*
 * Alpha bounds trên canvas 853 x 1844. Kích thước chuẩn là ドラゴン
 * (353 x 381). Hàm này được dùng chung ở gameplay và khung thử đồ.
 */
const CENTERPIECE_BOUNDS: Readonly<Record<string, CenterpieceBounds>> = {
    cow_centerpiece_buddha_statue: [620, 665],
    cow_centerpiece_cow_bell: [620, 687],
    cow_centerpiece_crystal: [360, 385],
    cow_centerpiece_crystal_fountain: [620, 640],
    cow_centerpiece_dragon: [353, 381],
    cow_centerpiece_dragon_fountain: [620, 670],
    cow_centerpiece_globe_fountain: [620, 644],
    cow_centerpiece_greek_column: [517, 760],
    cow_centerpiece_greek_goddess: [620, 669],
    cow_centerpiece_greek_warrior: [464, 760],
    cow_centerpiece_hologram_monument: [620, 741],
    cow_centerpiece_japanese_fountain: [620, 646],
    cow_centerpiece_liberty: [620, 672],
    cow_centerpiece_lion_fountain: [620, 657],
    cow_centerpiece_mecha: [356, 380],
    cow_centerpiece_milk_bottle: [499, 760],
    cow_centerpiece_moai: [620, 739],
    cow_centerpiece_moon_fountain: [620, 661],
    cow_centerpiece_pagoda: [620, 676],
    cow_centerpiece_roman_emperor: [507, 760],
    cow_centerpiece_samurai_statue: [597, 760],
    cow_centerpiece_sphinx: [620, 620],
    cow_centerpiece_stone_well: [620, 709],
    cow_centerpiece_tokyo_tower: [499, 760],
    cow_centerpiece_torii_basin: [620, 668],
    cow_centerpiece_ufo_fountain: [620, 656],
    cow_centerpiece_unicorn_fountain: [620, 704],
    cow_centerpiece_water_fountain: [620, 652],
    cow_centerpiece_water_trough: [343, 364],
    cow_centerpiece_wooden_well: [620, 680],
    cow_centerpiece_zen_fountain: [620, 678],
};

export function getCowCenterpieceScale(id: string | undefined) {
    if (!id) return 1;
    const [width, height] = CENTERPIECE_BOUNDS[id] ?? [353, 381];
    return Math.min(1, 353 / width, 381 / height);
}
