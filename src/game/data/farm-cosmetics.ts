import type {
    FarmCosmeticAvailability,
    FarmCosmeticCurrency,
    FarmCosmeticRarity,
    FarmCosmeticSlot,
    FarmCosmeticTarget,
    FarmMapId,
} from '../core/farm-progression-types';

export type FarmCosmeticCategory =
    | 'chicken_avatar'
    | 'cow_avatar'
    | 'face'
    | 'head'
    | 'barn_set'
    | 'barn_roof'
    | 'barn_light'
    | 'centerpiece';

export type FarmCosmeticDefinition = {
    id: string;
    nameJa: string;
    category: FarmCosmeticCategory;
    target: FarmCosmeticTarget;
    slot: FarmCosmeticSlot;
    rarity: FarmCosmeticRarity;
    currency: FarmCosmeticCurrency;
    price: number;
    availability: FarmCosmeticAvailability;
    requiredMapId?: FarmMapId;
    collectionId?: string;
    assetKey: string;
};

const CHICKEN_AVATAR_KEYS = [
    "chicken_avatar_alien_chick",
    "chicken_avatar_baby_dragon",
    "chicken_avatar_baby_eagle",
    "chicken_avatar_baby_phoenix",
    "chicken_avatar_balloon",
    "chicken_avatar_capsule_toy",
    "chicken_avatar_chick",
    "chicken_avatar_clockwork",
    "chicken_avatar_cloud_dragon",
    "chicken_avatar_crystal_dragon",
    "chicken_avatar_cyber_chicken",
    "chicken_avatar_daruma",
    "chicken_avatar_duck",
    "chicken_avatar_fire_dragon",
    "chicken_avatar_flamingo",
    "chicken_avatar_golden_dragon",
    "chicken_avatar_hologram",
    "chicken_avatar_ice_dragon",
    "chicken_avatar_jelly",
    "chicken_avatar_kiwi_bird",
    "chicken_avatar_kokeshi",
    "chicken_avatar_maneki_neko",
    "chicken_avatar_mecha_dragon",
    "chicken_avatar_mochi",
    "chicken_avatar_neon_robot",
    "chicken_avatar_ninja",
    "chicken_avatar_onigiri",
    "chicken_avatar_owl",
    "chicken_avatar_parrot",
    "chicken_avatar_penguin",
    "chicken_avatar_pigeon",
    "chicken_avatar_pudding",
    "chicken_avatar_retro_robot",
    "chicken_avatar_robot_chicken",
    "chicken_avatar_sakura_dragon",
    "chicken_avatar_samurai",
    "chicken_avatar_shadow_dragon",
    "chicken_avatar_slime_dragon",
    "chicken_avatar_space_chicken",
    "chicken_avatar_sparrow",
    "chicken_avatar_takoyaki",
    "chicken_avatar_toast_chicken",
    "chicken_avatar_ufo_chicken",
    "chicken_avatar_walking_egg",
    "chicken_avatar_wooden_toy"
] as const;
const COW_AVATAR_KEYS = [
    "cow_avatar_ankylosaurus",
    "cow_avatar_balloon_rhino",
    "cow_avatar_brontosaurus",
    "cow_avatar_buffalo",
    "cow_avatar_celestial_unicorn",
    "cow_avatar_clockwork_rhino",
    "cow_avatar_cloud_beast",
    "cow_avatar_crystal_golem",
    "cow_avatar_crystal_unicorn",
    "cow_avatar_cyber_horse",
    "cow_avatar_deer",
    "cow_avatar_giant_daruma",
    "cow_avatar_giant_mochi",
    "cow_avatar_giant_piggy_bank",
    "cow_avatar_giant_slime",
    "cow_avatar_giraffe",
    "cow_avatar_griffin",
    "cow_avatar_hippo",
    "cow_avatar_hologram_giraffe",
    "cow_avatar_horse",
    "cow_avatar_inflatable_cow",
    "cow_avatar_kirin",
    "cow_avatar_mammoth",
    "cow_avatar_mecha_cow",
    "cow_avatar_mecha_dino",
    "cow_avatar_milk_carton",
    "cow_avatar_moose",
    "cow_avatar_pig",
    "cow_avatar_rainbow_unicorn",
    "cow_avatar_rhino",
    "cow_avatar_robot_cow",
    "cow_avatar_rock_golem",
    "cow_avatar_rocking_horse",
    "cow_avatar_saber_tooth",
    "cow_avatar_space_rover",
    "cow_avatar_stegosaurus",
    "cow_avatar_t_rex",
    "cow_avatar_tank_cow",
    "cow_avatar_triceratops",
    "cow_avatar_unicorn",
    "cow_avatar_wooden_horse",
    "cow_avatar_yak",
    "cow_avatar_zebra"
] as const;
const FACE_KEYS = [
    "face_aviator",
    "face_black",
    "face_blue",
    "face_cyberpunk",
    "face_green",
    "face_heart",
    "face_monocle",
    "face_neon",
    "face_ninja_mask",
    "face_pink",
    "face_pixel",
    "face_purple",
    "face_red",
    "face_round",
    "face_samurai_mask",
    "face_scientist",
    "face_ski",
    "face_square",
    "face_star",
    "face_steampunk",
    "face_superhero",
    "face_swimming",
    "face_three_d",
    "face_white",
    "face_yellow"
] as const;
const HEAD_KEYS = [
    "head_astronaut",
    "head_baseball",
    "head_beanie",
    "head_beret",
    "head_bucket",
    "head_chef",
    "head_construction",
    "head_cowboy",
    "head_crown",
    "head_firefighter",
    "head_magician",
    "head_ninja",
    "head_pirate",
    "head_police",
    "head_sailor",
    "head_samurai",
    "head_shogun",
    "head_straw_hat",
    "head_tiara",
    "head_top_hat",
    "head_viking",
    "head_witch"
] as const;
const BARN_SET_KEYS = [
    "cow_barn_japanese"
] as const;
const BARN_ROOF_KEYS = [
    "barn_roof_christmas_star",
    "barn_roof_disco_ball",
    "barn_roof_dragon_statue",
    "barn_roof_giant_egg",
    "barn_roof_golden_bell",
    "barn_roof_neon_sign",
    "barn_roof_pumpkin",
    "barn_roof_rooster_sign",
    "barn_roof_satellite_dish",
    "barn_roof_unicorn_statue",
    "barn_roof_weather_vane",
    "barn_roof_wind_spinner"
] as const;
const BARN_LIGHT_KEYS = [
    "barn_lights_cyber_pulse_lights",
    "barn_lights_icicle_lights",
    "barn_lights_japanese_lanterns",
    "barn_lights_lantern_string",
    "barn_lights_moon_lights",
    "barn_lights_neon_strip",
    "barn_lights_pumpkin_lights",
    "barn_lights_rainbow_strip",
    "barn_lights_sakura_lanterns",
    "barn_lights_star_lights",
    "barn_lights_warm_bulbs",
    "barn_lights_xmas_lights"
] as const;
const CENTERPIECE_KEYS = [
    "cow_centerpiece_water_trough",
    "cow_centerpiece_crystal",
    "cow_centerpiece_dragon",
    "cow_centerpiece_mecha",
    "cow_centerpiece_buddha_statue",
    "cow_centerpiece_cow_bell",
    "cow_centerpiece_crystal_fountain",
    "cow_centerpiece_dragon_fountain",
    "cow_centerpiece_globe_fountain",
    "cow_centerpiece_greek_column",
    "cow_centerpiece_greek_goddess",
    "cow_centerpiece_greek_warrior",
    "cow_centerpiece_hologram_monument",
    "cow_centerpiece_japanese_fountain",
    "cow_centerpiece_liberty",
    "cow_centerpiece_lion_fountain",
    "cow_centerpiece_milk_bottle",
    "cow_centerpiece_moai",
    "cow_centerpiece_moon_fountain",
    "cow_centerpiece_pagoda",
    "cow_centerpiece_roman_emperor",
    "cow_centerpiece_samurai_statue",
    "cow_centerpiece_sphinx",
    "cow_centerpiece_stone_well",
    "cow_centerpiece_tokyo_tower",
    "cow_centerpiece_torii_basin",
    "cow_centerpiece_ufo_fountain",
    "cow_centerpiece_unicorn_fountain",
    "cow_centerpiece_water_fountain",
    "cow_centerpiece_wooden_well",
    "cow_centerpiece_zen_fountain"
] as const;

const JAPANESE_TOKENS: Readonly<Record<string, string>> = {
    alien: 'エイリアン', astronaut: '宇宙飛行士', aviator: 'アビエーター',
    baby: 'ベビー', balloon: 'バルーン', baseball: '野球', basin: '水盤',
    beanie: 'ニット帽', bell: 'ベル', beret: 'ベレー帽', bird: 'バード',
    black: '黒', blue: '青', bottle: 'ボトル', bucket: 'バケット帽',
    buddha: '仏像', bulbs: '電球', capsule: 'カプセル', chef: 'シェフ',
    chick: 'ひよこ', christmas: 'クリスマス', classic: 'クラシック',
    clockwork: '時計仕掛け', cloud: '雲', column: '柱', construction: '工事',
    cowboy: 'カウボーイ', crown: '王冠', crystal: 'クリスタル',
    cyber: 'サイバー', cyberpunk: 'サイバーパンク', daruma: 'だるま',
    disco: 'ディスコ', dish: 'アンテナ', dragon: 'ドラゴン', duck: 'アヒル',
    eagle: 'ワシ', egg: 'たまご', emperor: '皇帝', fire: 'ファイア',
    firefighter: '消防士', flamingo: 'フラミンゴ', fountain: '噴水',
    giant: '巨大', globe: '地球儀', goddess: '女神', golden: 'ゴールド',
    great: '万里', greek: 'ギリシャ', green: '緑', hat: '帽子',
    heart: 'ハート', hologram: 'ホログラム', ice: 'アイス',
    icicle: 'つらら', japanese: '和風', jelly: 'ゼリー', kiwi: 'キウイ',
    kokeshi: 'こけし', lantern: '提灯', lanterns: '提灯', liberty: '自由の女神',
    lights: 'ライト', lion: 'ライオン', magician: '魔法使い',
    maneki: '招き', mask: 'マスク', mecha: 'メカ', medieval: '中世',
    milk: 'ミルク', moai: 'モアイ', mochi: 'もち', monocle: '片眼鏡',
    monument: 'モニュメント', moon: '月', neko: '猫', neon: 'ネオン',
    ninja: '忍者', onigiri: 'おにぎり', owl: 'フクロウ', pagoda: '五重塔',
    parrot: 'オウム', penguin: 'ペンギン', phoenix: 'フェニックス',
    pigeon: 'ハト', pink: 'ピンク', pirate: '海賊', pixel: 'ピクセル',
    police: '警察', pudding: 'プリン', pulse: 'パルス', pumpkin: 'かぼちゃ',
    purple: '紫', rainbow: '虹', red: '赤', retro: 'レトロ', robot: 'ロボット',
    roman: 'ローマ', rooster: '雄鶏', round: '丸型', sailor: '水兵',
    sakura: '桜', samurai: '侍', satellite: '衛星', scientist: '科学者',
    shadow: 'シャドウ', shogun: '将軍', sign: 'サイン', ski: 'スキー',
    slime: 'スライム', space: '宇宙', sparrow: 'スズメ', sphinx: 'スフィンクス',
    spinner: 'スピナー', square: '角型', star: '星', statue: '像',
    steampunk: 'スチームパンク', stone: '石', straw: '麦わら',
    string: 'ストリング', strip: 'ストリップ', superhero: 'ヒーロー',
    swimming: '水泳', takoyaki: 'たこ焼き', three: '3', tiara: 'ティアラ',
    toast: 'トースト', tokyo: '東京', top: 'シルクハット', torii: '鳥居',
    tower: 'タワー', toy: 'おもちゃ', ufo: 'UFO', unicorn: 'ユニコーン',
    vane: '風見鶏', viking: 'バイキング', walking: '歩く', wall: '長城',
    warm: '暖色', warrior: '戦士', water: '水', weather: 'ウェザー',
    well: '井戸', white: '白', wind: '風', witch: '魔女', wooden: '木製',
    xmas: 'クリスマス', yellow: '黄', zen: '禅', d: 'D',
};

function getJapaneseName(assetKey: string): string {
    const stem = assetKey
        .replace(/^chicken_avatar_/, '')
        .replace(/^cow_avatar_/, '')
        .replace(/^face_/, '')
        .replace(/^head_/, '')
        .replace(/^cow_barn_/, '')
        .replace(/^barn_roof_/, '')
        .replace(/^barn_lights_/, '')
        .replace(/^cow_centerpiece_/, '');
    return stem.split('_').map(token => JAPANESE_TOKENS[token] ?? token).join('');
}

function rarityAt(index: number): FarmCosmeticRarity {
    if (index % 17 === 0) return 'legendary';
    if (index % 7 === 0) return 'epic';
    if (index % 3 === 0) return 'rare';
    return index % 2 === 0 ? 'uncommon' : 'common';
}

function makeCatalog(
    keys: readonly string[],
    category: FarmCosmeticCategory,
    target: FarmCosmeticTarget,
    slot: FarmCosmeticSlot,
    requiredMapId: FarmMapId,
    basePrice: number,
): FarmCosmeticDefinition[] {
    return keys.map((assetKey, index) => {
        const rarity = rarityAt(index);
        const premium = rarity === 'epic' || rarity === 'legendary';
        return {
            id: assetKey,
            nameJa: getJapaneseName(assetKey),
            category,
            target,
            slot,
            rarity,
            currency: premium ? 'diamond' : 'gold',
            price: premium ? 18 + index : basePrice + index * 75,
            availability: 'standard',
            requiredMapId,
            assetKey,
        };
    });
}

function makeCowAccessoryCatalog(
    keys: readonly string[],
    category: 'face' | 'head',
    slot: 'face' | 'head',
    basePrice: number,
): FarmCosmeticDefinition[] {
    return keys.map((assetKey, index) => {
        const rarity = rarityAt(index);
        const premium = rarity === 'epic' || rarity === 'legendary';
        return {
            id: `cow_${assetKey}`,
            nameJa: `牛用 ${getJapaneseName(assetKey)}`,
            category,
            target: 'cow',
            slot,
            rarity,
            currency: premium ? 'diamond' : 'gold',
            price: premium ? 18 + index : basePrice + index * 75,
            availability: 'standard',
            requiredMapId: 'cow',
            assetKey,
        };
    });
}

/**
 * Only the current 3D collection is shipped. Legacy 2D IDs are intentionally
 * absent from both this catalog and farm-cosmetic-assets.ts.
 */
export const FARM_COSMETICS: readonly FarmCosmeticDefinition[] = [
    ...makeCatalog(CHICKEN_AVATAR_KEYS, 'chicken_avatar', 'chicken', 'avatar', 'chicken', 1200),
    ...makeCatalog(COW_AVATAR_KEYS, 'cow_avatar', 'cow', 'avatar', 'cow', 1400),
    ...makeCatalog(BARN_SET_KEYS, 'barn_set', 'cow_barn', 'barn_set', 'cow', 2400),
    ...makeCatalog(BARN_ROOF_KEYS, 'barn_roof', 'cow_barn', 'barn_roof', 'cow', 1500),
    ...makeCatalog(BARN_LIGHT_KEYS, 'barn_light', 'cow_barn', 'barn_light', 'cow', 1100),
    ...makeCatalog(CENTERPIECE_KEYS, 'centerpiece', 'cow_barn', 'centerpiece', 'cow', 1800),
];

export function getFarmCosmetic(id: string) {
    return FARM_COSMETICS.find(item => item.id === id);
}

export function isCosmeticMapRequirementMet(
    item: FarmCosmeticDefinition,
    unlockedMapIds: readonly FarmMapId[],
) {
    return !item.requiredMapId || unlockedMapIds.includes(item.requiredMapId);
}
