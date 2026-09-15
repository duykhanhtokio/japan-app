import type {
    BuildingDefinition,
    BuildingType,
} from '../core/building-types';

/*
 * =========================================================
 * BUILDING CATALOG
 * =========================================================
 *
 * V1 chỉ triển khai Feed Mill.
 *
 * Các building khác sẽ thêm bằng data sau khi
 * Building Engine được khóa bằng regression tests.
 * =========================================================
 */

export const BUILDINGS:
    readonly BuildingDefinition[] = [
        {
            type:
                'feed_mill',

            unlockFarmLevel:
                13,

            /*
             * Người chơi Lv13 đã có nền kinh tế lớn hơn
             * initial 500 Gold rất nhiều.
             *
             * Balance cuối cùng sẽ được chỉnh sau khi
             * economy simulation hoàn thiện.
             */
            purchaseGold:
                2500,

            levels: [
                {
                    level:
                        1,

                    productionSlotCount:
                        1,

                    upgradeGold:
                        0,
                },

                {
                    level:
                        2,

                    productionSlotCount:
                        2,

                    upgradeGold:
                        5000,
                },

                {
                    level:
                        3,

                    productionSlotCount:
                        3,

                    upgradeGold:
                        10000,
                },
            ],
        },
    ];

/*
 * =========================================================
 * LOOKUP
 * =========================================================
 */

export const BUILDING_BY_TYPE =
    new Map<
        BuildingType,
        BuildingDefinition
    >(
        BUILDINGS.map(
            building => [
                building.type,
                building,
            ]
        )
    );

export function getBuildingDefinition(
    type:
        BuildingType
): BuildingDefinition | undefined {
    return BUILDING_BY_TYPE.get(
        type
    );
}

export function getBuildingLevelDefinition(
    type:
        BuildingType,

    level:
        number
) {
    return getBuildingDefinition(
        type
    )?.levels.find(
        definition =>
            definition.level ===
            level
    );
}
