import type {
    CropDefinition,
    CropId,
} from '../core/game-types';

/*
 * =========================================================
 * CROP DEFINITIONS
 *
 * Economy baseline V1.
 *
 * Có thể cân lại bằng simulation sau.
 * =========================================================
 */

export const CROPS:
    CropDefinition[] = [
        {
            id:
                'wheat',

            seedItemId:
                'seed_wheat',

            harvestItemId:
                'crop_wheat',

            name: {
                textJa:
                    '小麦',

                readingJa:
                    'こむぎ',

                translationKey:
                    'game.items.wheat',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                1,

            growTimeSeconds:
                5 * 60,

            yieldAmount:
                2,

            harvestXp:
                2,

            growthStages:
                5,
        },

        {
            id:
                'carrot',

            seedItemId:
                'seed_carrot',

            harvestItemId:
                'crop_carrot',

            name: {
                textJa:
                    'にんじん',

                readingJa:
                    'にんじん',

                translationKey:
                    'game.items.carrot',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                2,

            growTimeSeconds:
                15 * 60,

            yieldAmount:
                3,

            harvestXp:
                4,

            growthStages:
                5,
        },

        {
            id:
                'potato',

            seedItemId:
                'seed_potato',

            harvestItemId:
                'crop_potato',

            name: {
                textJa:
                    'じゃがいも',

                readingJa:
                    'じゃがいも',

                translationKey:
                    'game.items.potato',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                3,

            growTimeSeconds:
                30 * 60,

            yieldAmount:
                3,

            harvestXp:
                6,

            growthStages:
                5,
        },

        {
            id:
                'corn',

            seedItemId:
                'seed_corn',

            harvestItemId:
                'crop_corn',

            name: {
                textJa:
                    'とうもろこし',

                readingJa:
                    'とうもろこし',

                translationKey:
                    'game.items.corn',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                4,

            growTimeSeconds:
                60 * 60,

            yieldAmount:
                4,

            harvestXp:
                8,

            growthStages:
                5,
        },

        {
            id:
                'tomato',

            seedItemId:
                'seed_tomato',

            harvestItemId:
                'crop_tomato',

            name: {
                textJa:
                    'トマト',

                readingJa:
                    'トマト',

                translationKey:
                    'game.items.tomato',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                5,

            growTimeSeconds:
                2 * 60 * 60,

            yieldAmount:
                4,

            harvestXp:
                10,

            growthStages:
                5,
        },

        {
            id:
                'onion',

            seedItemId:
                'seed_onion',

            harvestItemId:
                'crop_onion',

            name: {
                textJa:
                    '玉ねぎ',

                readingJa:
                    'たまねぎ',

                translationKey:
                    'game.items.onion',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                6,

            growTimeSeconds:
                3 * 60 * 60,

            yieldAmount:
                4,

            harvestXp:
                12,

            growthStages:
                5,
        },

        {
            id:
                'cabbage',

            seedItemId:
                'seed_cabbage',

            harvestItemId:
                'crop_cabbage',

            name: {
                textJa:
                    'キャベツ',

                readingJa:
                    'キャベツ',

                translationKey:
                    'game.items.cabbage',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                7,

            growTimeSeconds:
                4 * 60 * 60,

            yieldAmount:
                5,

            harvestXp:
                14,

            growthStages:
                5,
        },

        {
            id:
                'cucumber',

            seedItemId:
                'seed_cucumber',

            harvestItemId:
                'crop_cucumber',

            name: {
                textJa:
                    'きゅうり',

                readingJa:
                    'きゅうり',

                translationKey:
                    'game.items.cucumber',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                8,

            growTimeSeconds:
                5 * 60 * 60,

            yieldAmount:
                5,

            harvestXp:
                16,

            growthStages:
                5,
        },

        {
            id:
                'lettuce',

            seedItemId:
                'seed_lettuce',

            harvestItemId:
                'crop_lettuce',

            name: {
                textJa:
                    'レタス',

                readingJa:
                    'レタス',

                translationKey:
                    'game.items.lettuce',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                9,

            growTimeSeconds:
                6 * 60 * 60,

            yieldAmount:
                5,

            harvestXp:
                18,

            growthStages:
                5,
        },

        {
            id:
                'strawberry',

            seedItemId:
                'seed_strawberry',

            harvestItemId:
                'crop_strawberry',

            name: {
                textJa:
                    'いちご',

                readingJa:
                    'いちご',

                translationKey:
                    'game.items.strawberry',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                10,

            growTimeSeconds:
                8 * 60 * 60,

            yieldAmount:
                5,

            harvestXp:
                22,

            growthStages:
                5,
        },

        {
            id:
                'pumpkin',

            seedItemId:
                'seed_pumpkin',

            harvestItemId:
                'crop_pumpkin',

            name: {
                textJa:
                    'かぼちゃ',

                readingJa:
                    'かぼちゃ',

                translationKey:
                    'game.items.pumpkin',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                12,

            growTimeSeconds:
                10 * 60 * 60,

            yieldAmount:
                5,

            harvestXp:
                26,

            growthStages:
                5,
        },

        {
            id:
                'vegetable',

            seedItemId:
                'seed_rice',

            harvestItemId:
                'crop_rice',

            name: {
                textJa:
                    '米',

                readingJa:
                    'こめ',

                translationKey:
                    'game.items.rice',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                14,

            growTimeSeconds:
                12 * 60 * 60,

            yieldAmount:
                6,

            harvestXp:
                30,

            growthStages:
                5,
        },

        {
            id:
                'apple',

            seedItemId:
                'seed_apple',

            harvestItemId:
                'crop_apple',

            name: {
                textJa:
                    'りんご',

                readingJa:
                    'りんご',

                translationKey:
                    'game.items.apple',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                17,

            growTimeSeconds:
                16 * 60 * 60,

            yieldAmount:
                6,

            harvestXp:
                36,

            growthStages:
                5,
        },

        {
            id:
                'grape',

            seedItemId:
                'seed_grape',

            harvestItemId:
                'crop_grape',

            name: {
                textJa:
                    'ぶどう',

                readingJa:
                    'ぶどう',

                translationKey:
                    'game.items.grape',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                20,

            growTimeSeconds:
                20 * 60 * 60,

            yieldAmount:
                6,

            harvestXp:
                42,

            growthStages:
                5,
        },

        {
            id:
                'melon',

            seedItemId:
                'seed_melon',

            harvestItemId:
                'crop_melon',

            name: {
                textJa:
                    'メロン',

                readingJa:
                    'メロン',

                translationKey:
                    'game.items.melon',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                24,

            growTimeSeconds:
                24 * 60 * 60,

            yieldAmount:
                5,

            harvestXp:
                50,

            growthStages:
                5,
        },
    ];

/*
 * =========================================================
 * LOOKUP
 * =========================================================
 */

export const CROP_BY_ID =
    new Map<
        CropId,
        CropDefinition
    >(
        CROPS.map(
            crop => [
                crop.id,
                crop,
            ]
        )
    );

export function getCrop(
    id:
        CropId
) {
    return CROP_BY_ID.get(
        id
    );
}

export function getUnlockedCrops(
    farmLevel:
        number
) {
    return CROPS.filter(
        crop =>
            crop.unlockFarmLevel <=
            farmLevel
    );
}