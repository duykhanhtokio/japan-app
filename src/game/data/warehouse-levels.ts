export type WarehouseLevelDefinition = {
    level:
    number;

    capacity:
    number;

    /*
     * Gold cần để nâng từ level trước
     * lên level này.
     *
     * Lv1 là warehouse mặc định.
     */
    upgradeGoldCost:
    number;

    requiredFarmLevel:
    number;
};

export const WAREHOUSE_LEVELS:
    WarehouseLevelDefinition[] = [
        {
            level: 1,
            capacity: 30,
            upgradeGoldCost: 0,
            requiredFarmLevel: 1,
        },

        {
            level: 2,
            capacity: 50,
            upgradeGoldCost: 1000,
            requiredFarmLevel: 11,
        },

        {
            level: 3,
            capacity: 80,
            upgradeGoldCost: 3000,
            requiredFarmLevel: 15,
        },

        {
            level: 4,
            capacity: 120,
            upgradeGoldCost: 8000,
            requiredFarmLevel: 20,
        },

        {
            level: 5,
            capacity: 180,
            upgradeGoldCost: 20000,
            requiredFarmLevel: 25,
        },

        {
            level: 6,
            capacity: 250,
            upgradeGoldCost: 50000,
            requiredFarmLevel: 30,
        },
    ];

export function getWarehouseLevelDefinition(
    level:
        number
) {
    return WAREHOUSE_LEVELS.find(
        definition =>
            definition.level ===
            level
    );
}