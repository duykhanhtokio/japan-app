import type {
    OrchardTreeDefinition,
    OrchardTreeId,
} from '../core/orchard-types';

/*
 * =========================================================
 * ORCHARD TREES
 * =========================================================
 *
 * Cây ăn quả lâu năm:
 *
 * sapling
 * → initial growth
 * → fruit production
 * → harvest
 * → fruit production
 * → harvest...
 *
 * Cây không biến mất sau thu hoạch.
 * =========================================================
 */

export const ORCHARD_TREES:
    readonly OrchardTreeDefinition[] = [
        {
            id:
                'apple',

            saplingItemId:
                'seed_apple',

            fruitItemId:
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

            initialGrowTimeSeconds:
                16 * 60 * 60,

            fruitCycleTimeSeconds:
                8 * 60 * 60,

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

            saplingItemId:
                'seed_grape',

            fruitItemId:
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

            initialGrowTimeSeconds:
                20 * 60 * 60,

            fruitCycleTimeSeconds:
                10 * 60 * 60,

            yieldAmount:
                6,

            harvestXp:
                42,

            growthStages:
                5,
        },

        {
            id:
                'mikan',

            saplingItemId:
                'seed_mikan',

            fruitItemId:
                'crop_mikan',

            name: {
                textJa:
                    'みかん',

                readingJa:
                    'みかん',

                translationKey:
                    'game.items.mikan',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                22,

            initialGrowTimeSeconds:
                22 * 60 * 60,

            fruitCycleTimeSeconds:
                10 * 60 * 60,

            yieldAmount:
                7,

            harvestXp:
                46,

            growthStages:
                5,
        },

        {
            id:
                'peach',

            saplingItemId:
                'seed_peach',

            fruitItemId:
                'crop_peach',

            name: {
                textJa:
                    'もも',

                readingJa:
                    'もも',

                translationKey:
                    'game.items.peach',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                24,

            initialGrowTimeSeconds:
                24 * 60 * 60,

            fruitCycleTimeSeconds:
                12 * 60 * 60,

            yieldAmount:
                6,

            harvestXp:
                50,

            growthStages:
                5,
        },

        {
            id:
                'pear',

            saplingItemId:
                'seed_pear',

            fruitItemId:
                'crop_pear',

            name: {
                textJa:
                    'なし',

                readingJa:
                    'なし',

                translationKey:
                    'game.items.pear',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                26,

            initialGrowTimeSeconds:
                26 * 60 * 60,

            fruitCycleTimeSeconds:
                12 * 60 * 60,

            yieldAmount:
                7,

            harvestXp:
                54,

            growthStages:
                5,
        },

        {
            id:
                'cherry',

            saplingItemId:
                'seed_cherry',

            fruitItemId:
                'crop_cherry',

            name: {
                textJa:
                    'さくらんぼ',

                readingJa:
                    'さくらんぼ',

                translationKey:
                    'game.items.cherry',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                28,

            initialGrowTimeSeconds:
                28 * 60 * 60,

            fruitCycleTimeSeconds:
                13 * 60 * 60,

            yieldAmount:
                8,

            harvestXp:
                58,

            growthStages:
                5,
        },

        {
            id:
                'persimmon',

            saplingItemId:
                'seed_persimmon',

            fruitItemId:
                'crop_persimmon',

            name: {
                textJa:
                    '柿',

                readingJa:
                    'かき',

                translationKey:
                    'game.items.persimmon',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                30,

            initialGrowTimeSeconds:
                30 * 60 * 60,

            fruitCycleTimeSeconds:
                14 * 60 * 60,

            yieldAmount:
                7,

            harvestXp:
                62,

            growthStages:
                5,
        },

        {
            id:
                'lemon',

            saplingItemId:
                'seed_lemon',

            fruitItemId:
                'crop_lemon',

            name: {
                textJa:
                    'レモン',

                readingJa:
                    'レモン',

                translationKey:
                    'game.items.lemon',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                32,

            initialGrowTimeSeconds:
                32 * 60 * 60,

            fruitCycleTimeSeconds:
                14 * 60 * 60,

            yieldAmount:
                8,

            harvestXp:
                66,

            growthStages:
                5,
        },

        {
            id:
                'kiwi',

            saplingItemId:
                'seed_kiwi',

            fruitItemId:
                'crop_kiwi',

            name: {
                textJa:
                    'キウイ',

                readingJa:
                    'キウイ',

                translationKey:
                    'game.items.kiwi',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                34,

            initialGrowTimeSeconds:
                34 * 60 * 60,

            fruitCycleTimeSeconds:
                15 * 60 * 60,

            yieldAmount:
                8,

            harvestXp:
                70,

            growthStages:
                5,
        },

        {
            id:
                'blueberry',

            saplingItemId:
                'seed_blueberry',

            fruitItemId:
                'crop_blueberry',

            name: {
                textJa:
                    'ブルーベリー',

                readingJa:
                    'ブルーベリー',

                translationKey:
                    'game.items.blueberry',

                vocabularyIds:
                    [],
            },

            unlockFarmLevel:
                36,

            initialGrowTimeSeconds:
                36 * 60 * 60,

            fruitCycleTimeSeconds:
                16 * 60 * 60,

            yieldAmount:
                10,

            harvestXp:
                76,

            growthStages:
                5,
        },
    ];

/*
 * =========================================================
 * LOOKUP
 * =========================================================
 */

export const ORCHARD_TREE_BY_ID =
    new Map<
        OrchardTreeId,
        OrchardTreeDefinition
    >(
        ORCHARD_TREES.map(
            tree => [
                tree.id,
                tree,
            ]
        )
    );

export function getOrchardTree(
    treeId:
        OrchardTreeId
): OrchardTreeDefinition | undefined {
    return ORCHARD_TREE_BY_ID.get(
        treeId
    );
}

export function getUnlockedOrchardTrees(
    farmLevel:
        number
): readonly OrchardTreeDefinition[] {
    return ORCHARD_TREES.filter(
        tree =>
            tree.unlockFarmLevel <=
            farmLevel
    );
}
