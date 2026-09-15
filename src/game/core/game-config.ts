/*
 * =========================================================
 * GAME CONFIG
 * =========================================================
 *
 * Các giá trị khởi đầu dùng chung cho Farm Game.
 *
 * Không hard-code các con số này trong UI.
 * =========================================================
 */

export const FARM_GAME_CONFIG = {
    /*
     * Economy
     */
    initialGold:
        500,

    initialKeys:
        0,

    /*
     * Progression
     */
    initialFarmLevel:
        1,

    initialFarmXp:
        0,

    /*
     * Inventory
     */
    initialWarehouseCapacity:
        30,

    initialMarketSlots:
        2,

    /*
     * Farming
     */
    initialUnlockedPlotCount:
        6,

    initialWheatSeedCount:
        10,

    /*
     * Future balancing.
     */
    maxFarmLevelV1:
        30,
} as const;