import type {
    FarmGameState,
} from '../core/game-types';

import type {
    BuildingState,
    BuildingType,
} from '../core/building-types';

import {
    getBuildingDefinition,
    getBuildingLevelDefinition,
} from '../data/buildings';

/*
 * =========================================================
 * PURCHASE
 * =========================================================
 */

export type PurchaseBuildingFailureReason =
    | 'BUILDING_NOT_FOUND'
    | 'BUILDING_LOCKED'
    | 'BUILDING_ALREADY_OWNED'
    | 'NOT_ENOUGH_GOLD'
    | 'INVALID_BUILDING_DATA';

export type PurchaseBuildingResult =
    | {
        success:
            true;

        state:
            FarmGameState;

        building:
            BuildingState;

        goldSpent:
            number;
    }
    | {
        success:
            false;

        state:
            FarmGameState;

        reason:
            PurchaseBuildingFailureReason;
    };

/*
 * =========================================================
 * UPGRADE
 * =========================================================
 */

export type UpgradeBuildingFailureReason =
    | 'BUILDING_NOT_OWNED'
    | 'MAX_BUILDING_LEVEL'
    | 'INVALID_BUILDING_DATA'
    | 'NOT_ENOUGH_GOLD';

export type UpgradeBuildingResult =
    | {
        success:
            true;

        state:
            FarmGameState;

        building:
            BuildingState;

        goldSpent:
            number;

        slotsAdded:
            number;
    }
    | {
        success:
            false;

        state:
            FarmGameState;

        reason:
            UpgradeBuildingFailureReason;
    };

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

export function getOwnedBuilding(
    state:
        FarmGameState,

    type:
        BuildingType
): BuildingState | undefined {
    return state.buildings.find(
        building =>
            building.type ===
            type
    );
}

function createProductionSlotId(
    buildingType:
        BuildingType,

    slotNumber:
        number
): string {
    return `${buildingType}_slot_${slotNumber}`;
}

/*
 * =========================================================
 * PURCHASE BUILDING
 * =========================================================
 */

export function purchaseBuilding(
    state:
        FarmGameState,

    type:
        BuildingType
): PurchaseBuildingResult {
    const definition =
        getBuildingDefinition(
            type
        );

    if (!definition) {
        return {
            success:
                false,

            state,

            reason:
                'BUILDING_NOT_FOUND',
        };
    }

    if (
        state.farmLevel <
        definition.unlockFarmLevel
    ) {
        return {
            success:
                false,

            state,

            reason:
                'BUILDING_LOCKED',
        };
    }

    if (
        getOwnedBuilding(
            state,
            type
        )
    ) {
        return {
            success:
                false,

            state,

            reason:
                'BUILDING_ALREADY_OWNED',
        };
    }

    const levelOne =
        getBuildingLevelDefinition(
            type,
            1
        );

    if (!levelOne) {
        return {
            success:
                false,

            state,

            reason:
                'INVALID_BUILDING_DATA',
        };
    }

    if (
        state.gold <
        definition.purchaseGold
    ) {
        return {
            success:
                false,

            state,

            reason:
                'NOT_ENOUGH_GOLD',
        };
    }

    const building:
        BuildingState = {
        id:
            `building_${type}`,

        type,

        level:
            1,
    };

    const newSlots =
        Array.from(
            {
                length:
                    levelOne
                        .productionSlotCount,
            },

            (
                _,
                index
            ) => ({
                id:
                    createProductionSlotId(
                        type,
                        index + 1
                    ),

                productionType:
                    type,

                status:
                    'idle' as const,
            })
        );

    return {
        success:
            true,

        state: {
            ...state,

            gold:
                state.gold -
                definition.purchaseGold,

            buildings: [
                ...state.buildings,
                building,
            ],

            productionSlots: [
                ...state.productionSlots,
                ...newSlots,
            ],
        },

        building,

        goldSpent:
            definition.purchaseGold,
    };
}

/*
 * =========================================================
 * UPGRADE BUILDING
 * =========================================================
 */

export function upgradeBuilding(
    state:
        FarmGameState,

    type:
        BuildingType
): UpgradeBuildingResult {
    const owned =
        getOwnedBuilding(
            state,
            type
        );

    if (!owned) {
        return {
            success:
                false,

            state,

            reason:
                'BUILDING_NOT_OWNED',
        };
    }

    const definition =
        getBuildingDefinition(
            type
        );

    if (!definition) {
        return {
            success:
                false,

            state,

            reason:
                'INVALID_BUILDING_DATA',
        };
    }

    const currentLevel =
        getBuildingLevelDefinition(
            type,
            owned.level
        );

    const nextLevel =
        getBuildingLevelDefinition(
            type,
            owned.level + 1
        );

    if (!currentLevel) {
        return {
            success:
                false,

            state,

            reason:
                'INVALID_BUILDING_DATA',
        };
    }

    if (!nextLevel) {
        return {
            success:
                false,

            state,

            reason:
                'MAX_BUILDING_LEVEL',
        };
    }

    if (
        state.gold <
        nextLevel.upgradeGold
    ) {
        return {
            success:
                false,

            state,

            reason:
                'NOT_ENOUGH_GOLD',
        };
    }

    const upgradedBuilding:
        BuildingState = {
        ...owned,

        level:
            nextLevel.level,
    };

    const slotsAdded =
        Math.max(
            0,
            nextLevel.productionSlotCount -
            currentLevel.productionSlotCount
        );

    /*
     * Slot mới bắt đầu từ số lượng slot
     * của level hiện tại + 1.
     */
    const newSlots =
        Array.from(
            {
                length:
                    slotsAdded,
            },

            (
                _,
                index
            ) => ({
                id:
                    createProductionSlotId(
                        type,
                        currentLevel
                            .productionSlotCount +
                        index +
                        1
                    ),

                productionType:
                    type,

                status:
                    'idle' as const,
            })
        );

    return {
        success:
            true,

        state: {
            ...state,

            gold:
                state.gold -
                nextLevel.upgradeGold,

            buildings:
                state.buildings.map(
                    building =>
                        building.id ===
                        owned.id
                            ? upgradedBuilding
                            : building
                ),

            productionSlots: [
                ...state.productionSlots,
                ...newSlots,
            ],
        },

        building:
            upgradedBuilding,

        goldSpent:
            nextLevel.upgradeGold,

        slotsAdded,
    };
}
