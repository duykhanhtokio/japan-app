/*
 * =========================================================
 * LAND EXPANSIONS
 * =========================================================
 *
 * Mở rộng đất không chỉ dựa vào Farm Level.
 *
 * Đây là một trong các bridge chính:
 *
 * Learning
 * + Farm Level
 * + Gold
 * + Key
 * → mở rộng Farm
 *
 * Ads không được bypass learning requirement.
 * =========================================================
 */

export type LandExpansionId =
    | 'land_start'
    | 'land_zone_a'
    | 'land_zone_b'
    | 'land_zone_c'
    | 'land_zone_d'
    | 'land_zone_e'
    | 'land_zone_f'
    | 'land_zone_g';

export type LandLearningRequirement = {
    /*
     * Tổng thời gian học tối thiểu.
     */
    minimumStudyMinutes:
    number;

    /*
     * Learning Level tối thiểu.
     *
     * 0 = chưa yêu cầu.
     */
    minimumLearningLevel:
    number;
};

export type LandExpansionDefinition = {
    id:
    LandExpansionId;

    /*
     * Zone trước phải được mở.
     *
     * Start không có prerequisite.
     */
    prerequisiteLandId?:
    LandExpansionId;

    requiredFarmLevel:
    number;

    learningRequirement:
    LandLearningRequirement;

    goldCost:
    number;

    keyCost:
    number;

    /*
     * Số plot mới nhận được.
     */
    additionalPlotCount:
    number;
};

/*
 * =========================================================
 * LAND DATA
 * =========================================================
 */

export const LAND_EXPANSIONS:
    LandExpansionDefinition[] = [
        {
            id:
                'land_start',

            requiredFarmLevel:
                1,

            learningRequirement: {
                minimumStudyMinutes:
                    0,

                minimumLearningLevel:
                    0,
            },

            goldCost:
                0,

            keyCost:
                0,

            additionalPlotCount:
                6,
        },

        {
            id:
                'land_zone_a',

            prerequisiteLandId:
                'land_start',

            requiredFarmLevel:
                3,

            learningRequirement: {
                minimumStudyMinutes:
                    30,

                minimumLearningLevel:
                    0,
            },

            goldCost:
                500,

            keyCost:
                0,

            additionalPlotCount:
                3,
        },

        {
            id:
                'land_zone_b',

            prerequisiteLandId:
                'land_zone_a',

            requiredFarmLevel:
                6,

            learningRequirement: {
                minimumStudyMinutes:
                    60,

                minimumLearningLevel:
                    0,
            },

            goldCost:
                1500,

            keyCost:
                1,

            additionalPlotCount:
                3,
        },

        {
            id:
                'land_zone_c',

            prerequisiteLandId:
                'land_zone_b',

            requiredFarmLevel:
                10,

            learningRequirement: {
                minimumStudyMinutes:
                    120,

                minimumLearningLevel:
                    3,
            },

            goldCost:
                4000,

            keyCost:
                1,

            additionalPlotCount:
                4,
        },

        {
            id:
                'land_zone_d',

            prerequisiteLandId:
                'land_zone_c',

            requiredFarmLevel:
                15,

            learningRequirement: {
                minimumStudyMinutes:
                    300,

                minimumLearningLevel:
                    5,
            },

            goldCost:
                10000,

            keyCost:
                2,

            additionalPlotCount:
                4,
        },

        {
            id:
                'land_zone_e',

            prerequisiteLandId:
                'land_zone_d',

            requiredFarmLevel:
                20,

            learningRequirement: {
                minimumStudyMinutes:
                    600,

                minimumLearningLevel:
                    8,
            },

            goldCost:
                25000,

            keyCost:
                3,

            additionalPlotCount:
                5,
        },

        {
            id:
                'land_zone_f',

            prerequisiteLandId:
                'land_zone_e',

            requiredFarmLevel:
                25,

            learningRequirement: {
                minimumStudyMinutes:
                    900,

                minimumLearningLevel:
                    10,
            },

            goldCost:
                60000,

            keyCost:
                4,

            additionalPlotCount:
                5,
        },

        {
            id:
                'land_zone_g',

            prerequisiteLandId:
                'land_zone_f',

            requiredFarmLevel:
                30,

            learningRequirement: {
                minimumStudyMinutes:
                    1200,

                minimumLearningLevel:
                    12,
            },

            goldCost:
                120000,

            keyCost:
                5,

            additionalPlotCount:
                6,
        },
    ];

/*
 * =========================================================
 * LOOKUP
 * =========================================================
 */

export const LAND_EXPANSION_BY_ID =
    new Map<
        LandExpansionId,
        LandExpansionDefinition
    >(
        LAND_EXPANSIONS.map(
            land => [
                land.id,
                land,
            ]
        )
    );

export function getLandExpansion(
    id:
        LandExpansionId
) {
    return LAND_EXPANSION_BY_ID.get(
        id
    );
}

/*
 * =========================================================
 * TOTAL PLOTS
 * =========================================================
 */

export function getTotalPlotCountForLands(
    unlockedLandIds:
        readonly string[]
) {
    return unlockedLandIds.reduce(
        (
            total,
            landId
        ) => {
            const land =
                LAND_EXPANSION_BY_ID.get(
                    landId as
                    LandExpansionId
                );

            return total +
                (
                    land
                        ?.additionalPlotCount ??
                    0
                );
        },
        0
    );
}