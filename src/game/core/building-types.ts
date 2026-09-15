import type {
    BuildingId,
} from './game-types';

/*
 * =========================================================
 * BUILDING TYPE
 * =========================================================
 */

export type BuildingType =
    | 'feed_mill'
    | 'flour_mill'
    | 'dairy'
    | 'pizza_shop'
    | 'burger_shop';

/*
 * =========================================================
 * BUILDING LEVEL
 * =========================================================
 */

export type BuildingLevelDefinition = {
    level:
        number;

    /*
     * Tổng production slots ở level này.
     */
    productionSlotCount:
        number;

    /*
     * Gold cần để nâng từ level trước lên level này.
     *
     * Level 1 = 0 vì purchaseCost xử lý riêng.
     */
    upgradeGold:
        number;
};

/*
 * =========================================================
 * BUILDING DEFINITION
 * =========================================================
 */

export type BuildingDefinition = {
    type:
        BuildingType;

    unlockFarmLevel:
        number;

    purchaseGold:
        number;

    levels:
        readonly BuildingLevelDefinition[];
};

/*
 * =========================================================
 * PLAYER BUILDING STATE
 * =========================================================
 */

export type BuildingState = {
    id:
        BuildingId;

    type:
        BuildingType;

    level:
        number;
};
