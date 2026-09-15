import type {
    GameLanguageContent,
} from '../core/game-types';

export type FarmToolType =
    | 'watering_can'
    | 'sickle'
    | 'hoe';

export type FarmToolDefinition = {
    id:
    string;

    type:
    FarmToolType;

    level:
    number;

    name:
    GameLanguageContent;

    /*
     * Số plot tối đa xử lý trong một thao tác.
     */
    maxTargets:
    number;

    unlockFarmLevel:
    number;
};

/*
 * =========================================================
 * TOOL DEFINITIONS V1
 * =========================================================
 *
 * V1:
 *
 * Watering Can
 * Lv1 → 1 plot
 * Lv2 → 3 plots
 * Lv3 → 5 plots
 *
 * Sickle
 * Lv1 → 1 plot
 * Lv2 → 3 plots
 * Lv3 → 5 plots
 *
 * Hoe
 * Định nghĩa progression trước.
 * Logic dọn plot sẽ triển khai sau khi có
 * crop removal / dead crop system.
 * =========================================================
 */

export const FARM_TOOLS:
    readonly FarmToolDefinition[] = [
        {
            id:
                'watering_can_1',

            type:
                'watering_can',

            level:
                1,

            name: {
                textJa:
                    'じょうろ',

                readingJa:
                    'じょうろ',

                translationKey:
                    'game.tools.wateringCan',

                vocabularyIds:
                    [],
            },

            maxTargets:
                1,

            unlockFarmLevel:
                1,
        },

        {
            id:
                'watering_can_2',

            type:
                'watering_can',

            level:
                2,

            name: {
                textJa:
                    '大きいじょうろ',

                readingJa:
                    'おおきいじょうろ',

                translationKey:
                    'game.tools.wateringCanLarge',

                vocabularyIds:
                    [],
            },

            maxTargets:
                3,

            unlockFarmLevel:
                10,
        },

        {
            id:
                'watering_can_3',

            type:
                'watering_can',

            level:
                3,

            name: {
                textJa:
                    '高性能じょうろ',

                readingJa:
                    'こうせいのうじょうろ',

                translationKey:
                    'game.tools.wateringCanAdvanced',

                vocabularyIds:
                    [],
            },

            maxTargets:
                5,

            unlockFarmLevel:
                20,
        },

        {
            id:
                'sickle_1',

            type:
                'sickle',

            level:
                1,

            name: {
                textJa:
                    '鎌',

                readingJa:
                    'かま',

                translationKey:
                    'game.tools.sickle',

                vocabularyIds:
                    [],
            },

            maxTargets:
                1,

            unlockFarmLevel:
                1,
        },

        {
            id:
                'sickle_2',

            type:
                'sickle',

            level:
                2,

            name: {
                textJa:
                    '丈夫な鎌',

                readingJa:
                    'じょうぶなかま',

                translationKey:
                    'game.tools.sickleStrong',

                vocabularyIds:
                    [],
            },

            maxTargets:
                3,

            unlockFarmLevel:
                10,
        },

        {
            id:
                'sickle_3',

            type:
                'sickle',

            level:
                3,

            name: {
                textJa:
                    '高性能な鎌',

                readingJa:
                    'こうせいのうなかま',

                translationKey:
                    'game.tools.sickleAdvanced',

                vocabularyIds:
                    [],
            },

            maxTargets:
                5,

            unlockFarmLevel:
                20,
        },

        {
            id:
                'hoe_1',

            type:
                'hoe',

            level:
                1,

            name: {
                textJa:
                    'くわ',

                readingJa:
                    'くわ',

                translationKey:
                    'game.tools.hoe',

                vocabularyIds:
                    [],
            },

            maxTargets:
                1,

            unlockFarmLevel:
                1,
        },

        {
            id:
                'hoe_2',

            type:
                'hoe',

            level:
                2,

            name: {
                textJa:
                    '丈夫なくわ',

                readingJa:
                    'じょうぶなくわ',

                translationKey:
                    'game.tools.hoeStrong',

                vocabularyIds:
                    [],
            },

            maxTargets:
                3,

            unlockFarmLevel:
                10,
        },

        {
            id:
                'hoe_3',

            type:
                'hoe',

            level:
                3,

            name: {
                textJa:
                    '高性能なくわ',

                readingJa:
                    'こうせいのうなくわ',

                translationKey:
                    'game.tools.hoeAdvanced',

                vocabularyIds:
                    [],
            },

            maxTargets:
                5,

            unlockFarmLevel:
                20,
        },
    ];

export function getFarmTool(
    toolId:
        string
): FarmToolDefinition | undefined {
    return FARM_TOOLS.find(
        tool =>
            tool.id ===
            toolId
    );
}

export function getHighestUnlockedFarmTool(
    type:
        FarmToolType,

    farmLevel:
        number
): FarmToolDefinition | undefined {
    return FARM_TOOLS
        .filter(
            tool =>
                tool.type ===
                type &&
                farmLevel >=
                tool.unlockFarmLevel
        )
        .sort(
            (
                a,
                b
            ) =>
                b.level -
                a.level
        )[0];
}