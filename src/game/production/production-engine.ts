import {
    getOwnedBuilding,
} from '../buildings/building-engine';

import type {
    FarmGameState,
    RecipeId,
} from '../core/game-types';

import type {
    ProductionSlotState,
} from '../core/production-types';

import {
    getProductionRecipe,
} from '../data/recipes';

import {
    getFarmLevelFromXp,
} from '../data/farm-levels';

import {
    addInventoryItem,
    getInventoryQuantity,
    removeInventoryItem,
} from '../inventory/inventory-engine';

import {
    canStoreInWarehouse,
} from '../inventory/warehouse-engine';

/*
 * =========================================================
 * START RESULT
 * =========================================================
 */

export type StartProductionFailureReason =
    | 'SLOT_NOT_FOUND'
    | 'SLOT_NOT_IDLE'
    | 'RECIPE_NOT_FOUND'
    | 'RECIPE_LOCKED'
    | 'WRONG_PRODUCTION_TYPE'
    | 'BUILDING_NOT_OWNED'
    | 'NOT_ENOUGH_INGREDIENTS';

export type StartProductionResult =
    | {
        success:
        true;

        state:
        FarmGameState;

        readyAt:
        number;
    }
    | {
        success:
        false;

        state:
        FarmGameState;

        reason:
        StartProductionFailureReason;
    };

/*
 * =========================================================
 * COLLECT RESULT
 * =========================================================
 */

export type CollectProductionFailureReason =
    | 'SLOT_NOT_FOUND'
    | 'RECIPE_NOT_FOUND'
    | 'PRODUCT_NOT_READY'
    | 'WAREHOUSE_FULL';

export type CollectProductionResult =
    | {
        success:
        true;

        state:
        FarmGameState;

        outputItemId:
        string;

        outputQuantity:
        number;

        xpGained:
        number;
    }
    | {
        success:
        false;

        state:
        FarmGameState;

        reason:
        CollectProductionFailureReason;
    };

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function replaceProductionSlot(
    slots:
        readonly ProductionSlotState[],

    replacement:
        ProductionSlotState
): ProductionSlotState[] {
    return slots.map(
        slot =>
            slot.id ===
                replacement.id
                ? replacement
                : slot
    );
}

/*
 * =========================================================
 * RESOLVE TIME
 * =========================================================
 */

export function resolveProductionTime(
    state:
        FarmGameState,

    now:
        number = Date.now()
): FarmGameState {
    return {
        ...state,

        productionSlots:
            state.productionSlots.map(
                slot => {
                    if (
                        slot.status !==
                        'producing' ||
                        slot.readyAt ===
                        undefined ||
                        now <
                        slot.readyAt
                    ) {
                        return slot;
                    }

                    return {
                        ...slot,

                        status:
                            'ready' as const,
                    };
                }
            ),
    };
}

/*
 * =========================================================
 * START PRODUCTION
 * =========================================================
 */

export function startProduction(
    state:
        FarmGameState,

    slotId:
        string,

    recipeId:
        RecipeId,

    now:
        number = Date.now()
): StartProductionResult {
    /*
     * =====================================================
     * SLOT
     * =====================================================
     */

    const slot =
        state.productionSlots.find(
            current =>
                current.id ===
                slotId
        );

    if (
        !slot
    ) {
        return {
            success:
                false,

            state,

            reason:
                'SLOT_NOT_FOUND',
        };
    }

    if (
        slot.status !==
        'idle'
    ) {
        return {
            success:
                false,

            state,

            reason:
                'SLOT_NOT_IDLE',
        };
    }

    /*
     * =====================================================
     * RECIPE
     * =====================================================
     */

    const recipe =
        getProductionRecipe(
            recipeId
        );

    if (
        !recipe
    ) {
        return {
            success:
                false,

            state,

            reason:
                'RECIPE_NOT_FOUND',
        };
    }

    if (
        state.farmLevel <
        recipe.unlockFarmLevel
    ) {
        return {
            success:
                false,

            state,

            reason:
                'RECIPE_LOCKED',
        };
    }

    /*
     * =====================================================
     * PRODUCTION TYPE
     *
     * Recipe chỉ được chạy trong đúng loại building.
     *
     * Ví dụ:
     *
     * feed_chicken_basic
     * → feed_mill
     *
     * Không được chạy trong dairy / pizza_shop.
     * =====================================================
     */

    if (
        slot.productionType !==
        recipe.productionType
    ) {
        return {
            success:
                false,

            state,

            reason:
                'WRONG_PRODUCTION_TYPE',
        };
    }

    /*
     * =====================================================
     * BUILDING OWNERSHIP
     *
     * Có slot thôi chưa đủ.
     *
     * Guard này chống corrupted / legacy state,
     * nơi production slot tồn tại nhưng player
     * không thực sự sở hữu building.
     * =====================================================
     */

    const building =
        getOwnedBuilding(
            state,
            recipe.productionType
        );

    if (
        !building
    ) {
        return {
            success:
                false,

            state,

            reason:
                'BUILDING_NOT_OWNED',
        };
    }

    /*
     * =====================================================
     * INGREDIENT CHECK
     *
     * Kiểm tra tất cả trước khi trừ.
     *
     * Không có trường hợp:
     *
     * - trừ wheat
     * - sau đó phát hiện thiếu corn
     * =====================================================
     */

    const hasAllIngredients =
        recipe.inputs.every(
            input =>
                getInventoryQuantity(
                    state.inventory,
                    input.itemId
                ) >=
                input.quantity
        );

    if (
        !hasAllIngredients
    ) {
        return {
            success:
                false,

            state,

            reason:
                'NOT_ENOUGH_INGREDIENTS',
        };
    }

    /*
     * =====================================================
     * CONSUME INGREDIENTS
     * =====================================================
     */

    let nextInventory =
        [
            ...state.inventory,
        ];

    for (
        const input
        of recipe.inputs
    ) {
        const removed =
            removeInventoryItem(
                nextInventory,
                input.itemId,
                input.quantity
            );

        /*
         * Về logic không thể null
         * vì phía trên đã pre-check.
         */
        if (
            !removed
        ) {
            return {
                success:
                    false,

                state,

                reason:
                    'NOT_ENOUGH_INGREDIENTS',
            };
        }

        nextInventory =
            removed;
    }

    /*
     * =====================================================
     * START TIMER
     * =====================================================
     */

    const readyAt =
        now +
        recipe.productionTimeSeconds *
        1000;

    const nextSlot:
        ProductionSlotState = {
        ...slot,

        status:
            'producing',

        recipeId:
            recipe.id,

        productionStartedAt:
            now,

        readyAt,
    };

    return {
        success:
            true,

        state: {
            ...state,

            inventory:
                nextInventory,

            productionSlots:
                replaceProductionSlot(
                    state.productionSlots,
                    nextSlot
                ),
        },

        readyAt,
    };
}

/*
 * =========================================================
 * COLLECT
 * =========================================================
 */

export function collectProduction(
    state:
        FarmGameState,

    slotId:
        string,

    now:
        number = Date.now()
): CollectProductionResult {
    /*
     * Resolve thời gian ngay lúc collect.
     *
     * UI không bắt buộc phải gọi
     * resolveProductionTime() trước.
     */

    const resolvedState =
        resolveProductionTime(
            state,
            now
        );

    /*
     * =====================================================
     * SLOT
     * =====================================================
     */

    const slot =
        resolvedState
            .productionSlots
            .find(
                current =>
                    current.id ===
                    slotId
            );

    if (
        !slot
    ) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'SLOT_NOT_FOUND',
        };
    }

    if (
        slot.status !==
        'ready' ||
        !slot.recipeId
    ) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'PRODUCT_NOT_READY',
        };
    }

    /*
     * =====================================================
     * RECIPE
     * =====================================================
     */

    const recipe =
        getProductionRecipe(
            slot.recipeId
        );

    if (
        !recipe
    ) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'RECIPE_NOT_FOUND',
        };
    }

    /*
     * =====================================================
     * WAREHOUSE
     *
     * Không collect một phần.
     *
     * Nếu không đủ chỗ:
     *
     * - output vẫn nằm ở production slot
     * - slot vẫn ready
     * - không cộng XP
     * =====================================================
     */

    if (
        !canStoreInWarehouse(
            resolvedState,
            recipe.outputQuantity
        )
    ) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'WAREHOUSE_FULL',
        };
    }

    /*
     * =====================================================
     * ADD OUTPUT
     * =====================================================
     */

    const nextInventory =
        addInventoryItem(
            resolvedState.inventory,
            recipe.outputItemId,
            recipe.outputQuantity
        );

    /*
     * =====================================================
     * XP
     * =====================================================
     */

    const nextFarmXp =
        resolvedState.farmXp +
        recipe.collectXp;

    /*
     * =====================================================
     * RESET SLOT
     * =====================================================
     */

    const nextSlot:
        ProductionSlotState = {
        id:
            slot.id,

        productionType:
            slot.productionType,

        status:
            'idle',
    };

    /*
     * =====================================================
     * NEXT STATE
     * =====================================================
     */

    const nextState:
        FarmGameState = {
        ...resolvedState,

        inventory:
            nextInventory,

        farmXp:
            nextFarmXp,

        farmLevel:
            getFarmLevelFromXp(
                nextFarmXp
            ),

        productionSlots:
            replaceProductionSlot(
                resolvedState.productionSlots,
                nextSlot
            ),
    };

    return {
        success:
            true,

        state:
            nextState,

        outputItemId:
            recipe.outputItemId,

        outputQuantity:
            recipe.outputQuantity,

        xpGained:
            recipe.collectXp,
    };
}