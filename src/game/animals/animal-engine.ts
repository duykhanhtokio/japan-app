
import type {
    CareActionLevel,
    CareType,
    ProductionCycleState,
} from '../care/care-types';

import {
    createProductionCycle,
    getDueCareRequirement,
    performCareAction,
    resolveProductionCycle,
} from '../care/care-engine';

import {
    CHICKEN_CARE_TEMPLATE,
    COW_CARE_TEMPLATE,
} from '../care/care-schedules';

import type {
    AnimalId,
    AnimalSlotState,
    FarmGameState,
} from '../core/game-types';

import {
    getAnimal,
} from '../data/animals';

import {
    getFarmLevelFromXp,
} from '../data/farm-levels';

import {
    getGameItem,
} from '../data/items';

/*
 * =========================================================
 * ANIMAL CARE V2
 * =========================================================
 *
 * Gameplay:
 *
 * idle
 *   ↓
 * feedAnimal()
 *   ↓
 * Gold - feed cost
 *   ↓
 * producing
 *   ↓
 * feed / drink care checkpoints
 *   ↓
 * normal / boost / ad
 *   ↓
 * ready
 *   ↓
 * collectAnimalProduct()
 *   ↓
 * auto-sell
 *   ↓
 * Gold + XP
 *   ↓
 * idle
 *
 * Không sử dụng warehouse cho animal product.
 * =========================================================
 */

/*
 * =========================================================
 * START / FEED RESULT
 * =========================================================
 */

export type FeedAnimalFailureReason =
    | 'SLOT_NOT_FOUND'
    | 'ANIMAL_NOT_FOUND'
    | 'ANIMAL_LOCKED'
    | 'ANIMAL_NOT_IDLE'
    | 'FEED_NOT_FOUND'
    | 'FEED_NOT_FOR_SALE'
    | 'NOT_ENOUGH_GOLD';

export type FeedAnimalResult =
    | {
        success:
        true;

        state:
        FarmGameState;

        readyAt:
        number;

        goldSpent:
        number;
    }
    | {
        success:
        false;

        state:
        FarmGameState;

        reason:
        FeedAnimalFailureReason;
    };

/*
 * =========================================================
 * CARE RESULT
 * =========================================================
 */

export type CareAnimalFailureReason =
    | 'SLOT_NOT_FOUND'
    | 'ANIMAL_NOT_FOUND'
    | 'ANIMAL_NOT_PRODUCING'
    | 'PRODUCTION_NOT_FOUND'
    | 'CARE_NOT_REQUIRED'
    | 'CARE_NOT_FOUND'
    | 'CARE_ALREADY_COMPLETED'
    | 'CARE_NOT_DUE'
    | 'INVALID_ACTION';

export type CareAnimalResult =
    | {
        success:
        true;

        state:
        FarmGameState;

        careType:
        CareType;

        level:
        CareActionLevel;

        timeReducedSeconds:
        number;
    }
    | {
        success:
        false;

        state:
        FarmGameState;

        reason:
        CareAnimalFailureReason;
    };

/*
 * =========================================================
 * COLLECT RESULT
 * =========================================================
 */

export type CollectAnimalProductFailureReason =
    | 'SLOT_NOT_FOUND'
    | 'ANIMAL_NOT_FOUND'
    | 'PRODUCT_NOT_FOUND'
    | 'PRODUCT_NOT_READY';

export type CollectAnimalProductResult =
    | {
        success:
        true;

        state:
        FarmGameState;

        productItemId:
        string;

        productQuantity:
        number;

        goldEarned:
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
        CollectAnimalProductFailureReason;
    };

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function replaceAnimalSlot(
    slots:
        readonly AnimalSlotState[],

    replacement:
        AnimalSlotState
): AnimalSlotState[] {
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
 * CARE SCHEDULE
 * =========================================================
 *
 * Hiện game có:
 *
 * chicken
 * cow
 *
 * care-schedules.ts hiện đã có template
 * riêng cho chicken và cow.
 *
 * tạo SHEEP_CARE_TEMPLATE riêng.
 * =========================================================
 */

function getAnimalCareSchedule(
    animalId:
        AnimalId
) {
    switch (animalId) {
        case 'chicken':
            return CHICKEN_CARE_TEMPLATE;

        case 'cow':
            return COW_CARE_TEMPLATE;


        default:
            return undefined;
    }
}

/*
 * =========================================================
 * CREATE ANIMAL PRODUCTION
 * =========================================================
 */

function createAnimalProduction(
    animalId:
        AnimalId,

    now:
        number
): ProductionCycleState | undefined {
    const template =
        getAnimalCareSchedule(
            animalId
        );

    const animal =
        getAnimal(
            animalId
        );

    if (
        !template ||
        !animal
    ) {
        return undefined;
    }

    /*
     * AnimalDefinition là nguồn duy nhất
     * cho tổng thời gian production.
     *
     * Care template chỉ định checkpoint
     * và các rule chăm sóc.
     */
    const schedule = {
        ...template,

        durationSeconds:
            animal
                .productionTimeSeconds,
    };

    return createProductionCycle(
        schedule,
        now
    );
}

/*
 * =========================================================
 * RESOLVE TIME
 * =========================================================
 */

export function resolveAnimalTime(
    state:
        FarmGameState,

    now:
        number = Date.now()
): FarmGameState {
    let changed =
        false;

    const nextSlots =
        state.animalSlots.map(
            slot => {
                if (
                    slot.status !==
                    'producing'
                ) {
                    return slot;
                }

                /*
                 * =========================================
                 * CARE V2
                 * =========================================
                 */

                if (
                    slot.production
                ) {
                    const nextProduction =
                        resolveProductionCycle(
                            slot.production,
                            now
                        );

                    const nextStatus:
                        AnimalSlotState['status'] =
                        nextProduction.status ===
                            'ready'
                            ? 'ready'
                            : 'producing';

                    if (
                        nextProduction ===
                        slot.production &&
                        nextStatus ===
                        slot.status
                    ) {
                        return slot;
                    }

                    changed =
                        true;

                    return {
                        ...slot,

                        status:
                            nextStatus,

                        production:
                            nextProduction,

                        /*
                         * Legacy mirror.
                         */
                        productionStartedAt:
                            nextProduction
                                .startedAt,

                        readyAt:
                            nextProduction
                                .readyAt,
                    };
                }

                /*
                 * =========================================
                 * LEGACY FALLBACK
                 * =========================================
                 *
                 * Save cũ chưa có production.
                 * =================================================
                 */

                if (
                    slot.readyAt ===
                    undefined ||
                    now <
                    slot.readyAt
                ) {
                    return slot;
                }

                changed =
                    true;

                return {
                    ...slot,

                    status:
                        'ready' as const,
                };
            }
        );

    if (!changed) {
        return state;
    }

    return {
        ...state,

        animalSlots:
            nextSlots,
    };
}

/*
 * =========================================================
 * START ANIMAL PRODUCTION
 * =========================================================
 *
 * Tên API feedAnimal được giữ để compatibility.
 *
 * Nhưng V2:
 *
 * KHÔNG remove feed từ inventory.
 *
 * Thay vào đó:
 *
 * feedItem.shopPrice
 * × animal.feedAmount
 * → trừ trực tiếp Gold.
 * =========================================================
 */

export function feedAnimal(
    state:
        FarmGameState,

    slotId:
        string,

    now:
        number = Date.now()
): FeedAnimalResult {
    const slot =
        state.animalSlots.find(
            current =>
                current.id ===
                slotId
        );

    if (!slot) {
        return {
            success:
                false,

            state,

            reason:
                'SLOT_NOT_FOUND',
        };
    }

    const animal =
        getAnimal(
            slot.animalId
        );

    if (!animal) {
        return {
            success:
                false,

            state,

            reason:
                'ANIMAL_NOT_FOUND',
        };
    }

    if (
        state.farmLevel <
        animal.unlockFarmLevel
    ) {
        return {
            success:
                false,

            state,

            reason:
                'ANIMAL_LOCKED',
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
                'ANIMAL_NOT_IDLE',
        };
    }

    /*
     * =====================================================
     * FEED PRICE
     * =====================================================
     */

    const feedItem =
        getGameItem(
            animal.feedItemId
        );

    if (!feedItem) {
        return {
            success:
                false,

            state,

            reason:
                'FEED_NOT_FOUND',
        };
    }

    if (
        feedItem.shopPrice ===
        undefined
    ) {
        return {
            success:
                false,

            state,

            reason:
                'FEED_NOT_FOR_SALE',
        };
    }

    const goldSpent =
        feedItem.shopPrice *
        animal.feedAmount;

    if (
        state.gold <
        goldSpent
    ) {
        return {
            success:
                false,

            state,

            reason:
                'NOT_ENOUGH_GOLD',
        };
    }

    /*
     * =====================================================
     * CREATE CARE V2 PRODUCTION
     * =====================================================
     */

    const production =
        createAnimalProduction(
            slot.animalId,
            now
        );

    /*
     * Nếu animal chưa có Care V2 schedule,
     * vẫn cho chạy bằng legacy timer.
     */

    const readyAt =
        production
            ?.readyAt ??
        (
            now +
            animal
                .productionTimeSeconds *
            1000
        );

    const nextSlot:
        AnimalSlotState = {
        ...slot,

        status:
            'producing',

        production,

        /*
         * Legacy mirrors.
         */
        productionStartedAt:
            production
                ?.startedAt ??
            now,

        readyAt,
    };

    const nextState:
        FarmGameState = {
        ...state,

        gold:
            state.gold -
            goldSpent,

        animalSlots:
            replaceAnimalSlot(
                state.animalSlots,
                nextSlot
            ),
    };

    return {
        success:
            true,

        state:
            nextState,

        readyAt,

        goldSpent,
    };
}

/*
 * =========================================================
 * ANIMAL CARE
 * =========================================================
 */

export function careForAnimal(
    state:
        FarmGameState,

    slotId:
        string,

    level:
        CareActionLevel,

    now:
        number = Date.now()
): CareAnimalResult {
    /*
     * Resolve trước để checkpoint tới hạn
     * chuyển production sang care_required.
     */

    const resolvedState =
        resolveAnimalTime(
            state,
            now
        );

    const slot =
        resolvedState
            .animalSlots
            .find(
                current =>
                    current.id ===
                    slotId
            );

    if (!slot) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'SLOT_NOT_FOUND',
        };
    }

    const animal =
        getAnimal(
            slot.animalId
        );

    if (!animal) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'ANIMAL_NOT_FOUND',
        };
    }

    if (
        slot.status !==
        'producing'
    ) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'ANIMAL_NOT_PRODUCING',
        };
    }

    if (
        !slot.production
    ) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'PRODUCTION_NOT_FOUND',
        };
    }

    const requirement =
        getDueCareRequirement(
            slot.production,
            now
        );

    if (!requirement) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'CARE_NOT_REQUIRED',
        };
    }

    const careResult =
        performCareAction(
            slot.production,
            requirement.id,
            level,
            now
        );

    if (
        !careResult.success
    ) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                careResult.reason,
        };
    }

    const nextProduction =
        resolveProductionCycle(
            careResult.cycle,
            now
        );

    const nextStatus:
        AnimalSlotState['status'] =
        nextProduction.status ===
            'ready'
            ? 'ready'
            : 'producing';

    const nextSlot:
        AnimalSlotState = {
        ...slot,

        status:
            nextStatus,

        production:
            nextProduction,

        productionStartedAt:
            nextProduction
                .startedAt,

        readyAt:
            nextProduction
                .readyAt,
    };

    return {
        success:
            true,

        state: {
            ...resolvedState,

            animalSlots:
                replaceAnimalSlot(
                    resolvedState
                        .animalSlots,
                    nextSlot
                ),
        },

        careType:
            requirement.type,

        level,

        timeReducedSeconds:
            careResult
                .timeReducedSeconds,
    };
}

/*
 * =========================================================
 * COLLECT + AUTO SELL
 * =========================================================
 *
 * Animal product không đi vào warehouse.
 *
 * Ví dụ:
 *
 * chicken:
 * egg baseSellPrice = 18
 *
 * quantity = 1
 *
 * collect
 * → Gold +18
 * → XP
 *
 * Cow:
 * milk baseSellPrice = 65
 *
 * collect
 * → Gold +65
 * → XP
 * =========================================================
 */

export function collectAnimalProduct(
    state:
        FarmGameState,

    slotId:
        string,

    now:
        number = Date.now()
): CollectAnimalProductResult {
    const resolvedState =
        resolveAnimalTime(
            state,
            now
        );

    const slot =
        resolvedState
            .animalSlots
            .find(
                current =>
                    current.id ===
                    slotId
            );

    if (!slot) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'SLOT_NOT_FOUND',
        };
    }

    const animal =
        getAnimal(
            slot.animalId
        );

    if (!animal) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'ANIMAL_NOT_FOUND',
        };
    }

    if (
        slot.status !==
        'ready'
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
     * PRODUCT ECONOMY
     * =====================================================
     */

    const productItem =
        getGameItem(
            animal.productItemId
        );

    if (!productItem) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'PRODUCT_NOT_FOUND',
        };
    }

    const goldEarned =
        productItem.baseSellPrice *
        animal.productAmount;

    const nextFarmXp =
        resolvedState.farmXp +
        animal.collectXp;

    /*
     * =====================================================
     * RESET SLOT
     * =====================================================
     *
     * Collect xong:
     *
     * ready
     * ↓
     * idle
     *
     * Người chơi bắt đầu cycle mới bằng feedAnimal().
     * =====================================================
     */

    const nextSlot:
        AnimalSlotState = {
        id:
            slot.id,

        animalId:
            slot.animalId,

        status:
            'idle',
    };

    const nextState:
        FarmGameState = {
        ...resolvedState,

        gold:
            resolvedState.gold +
            goldEarned,

        farmXp:
            nextFarmXp,

        farmLevel:
            Math.max(
                resolvedState.farmLevel,
                getFarmLevelFromXp(
                    nextFarmXp
                )
            ),

        animalSlots:
            replaceAnimalSlot(
                resolvedState
                    .animalSlots,
                nextSlot
            ),
    };

    return {
        success:
            true,

        state:
            nextState,

        productItemId:
            animal.productItemId,

        productQuantity:
            animal.productAmount,

        goldEarned,

        xpGained:
            animal.collectXp,
    };
}

