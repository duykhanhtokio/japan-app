import type {
    FarmGameState,
} from '../core/game-types';

import {
    getWarehouseLevelDefinition,
    WAREHOUSE_LEVELS,
} from '../data/warehouse-levels';

export type WarehouseUpgradeFailureReason =
    | 'MAX_LEVEL'
    | 'LEVEL_DEFINITION_NOT_FOUND'
    | 'FARM_LEVEL_TOO_LOW'
    | 'NOT_ENOUGH_GOLD';

export type WarehouseUpgradeResult =
    | {
        success: true;

        state:
        FarmGameState;

        previousLevel:
        number;

        newLevel:
        number;

        goldSpent:
        number;

        newCapacity:
        number;
    }
    | {
        success: false;

        state:
        FarmGameState;

        reason:
        WarehouseUpgradeFailureReason;
    };

/*
 * =========================================================
 * NEXT LEVEL
 * =========================================================
 */

export function getNextWarehouseLevelDefinition(
    state:
        FarmGameState
) {
    return getWarehouseLevelDefinition(
        state.warehouseLevel +
        1
    );
}

/*
 * =========================================================
 * CAN UPGRADE
 * =========================================================
 */

export function canUpgradeWarehouse(
    state:
        FarmGameState
): boolean {
    const next =
        getNextWarehouseLevelDefinition(
            state
        );

    if (!next) {
        return false;
    }

    return (
        state.farmLevel >=
        next.requiredFarmLevel &&
        state.gold >=
        next.upgradeGoldCost
    );
}

/*
 * =========================================================
 * UPGRADE
 * =========================================================
 */

export function upgradeWarehouse(
    state:
        FarmGameState
): WarehouseUpgradeResult {
    const maximumLevel =
        WAREHOUSE_LEVELS[
            WAREHOUSE_LEVELS.length -
            1
        ]?.level ?? 1;

    if (
        state.warehouseLevel >=
        maximumLevel
    ) {
        return {
            success:
                false,

            state,

            reason:
                'MAX_LEVEL',
        };
    }

    const next =
        getNextWarehouseLevelDefinition(
            state
        );

    if (!next) {
        return {
            success:
                false,

            state,

            reason:
                'LEVEL_DEFINITION_NOT_FOUND',
        };
    }

    if (
        state.farmLevel <
        next.requiredFarmLevel
    ) {
        return {
            success:
                false,

            state,

            reason:
                'FARM_LEVEL_TOO_LOW',
        };
    }

    if (
        state.gold <
        next.upgradeGoldCost
    ) {
        return {
            success:
                false,

            state,

            reason:
                'NOT_ENOUGH_GOLD',
        };
    }

    return {
        success:
            true,

        state: {
            ...state,

            gold:
                state.gold -
                next.upgradeGoldCost,

            warehouseLevel:
                next.level,
        },

        previousLevel:
            state.warehouseLevel,

        newLevel:
            next.level,

        goldSpent:
            next.upgradeGoldCost,

        newCapacity:
            next.capacity,
    };
}
