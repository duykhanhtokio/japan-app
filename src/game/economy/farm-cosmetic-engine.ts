import type {
    FarmGameState,
} from '../core/game-types';

import type {
    FarmMapId,
} from '../core/farm-progression-types';

import {
    FARM_COSMETICS,
} from '../data/farm-cosmetics';

import {
    isFarmAreaUnlocked,
    type FarmAreaUnlockId,
} from '../data/farm-area-unlocks';

export type BuyFarmCosmeticFailureReason =
    | 'COSMETIC_NOT_FOUND'
    | 'COSMETIC_LOCKED'
    | 'ALREADY_OWNED'
    | 'NOT_ENOUGH_GOLD'
    | 'NOT_ENOUGH_DIAMONDS';

export type BuyFarmCosmeticResult =
    | {
        success: true;
        state: FarmGameState;
        cosmeticId: string;
    }
    | {
        success: false;
        state: FarmGameState;
        reason:
            BuyFarmCosmeticFailureReason;
    };

function toUnlockArea(
    mapId:
        FarmMapId
): FarmAreaUnlockId {
    if (
        mapId ===
        'vegetable'
    ) {
        return 'vegetable';
    }

    return mapId;
}

export function buyFarmCosmetic(
    state:
        FarmGameState,
    cosmeticId:
        string
): BuyFarmCosmeticResult {
    const item =
        FARM_COSMETICS.find(
            cosmetic =>
                cosmetic.id ===
                cosmeticId
        );

    if (!item) {
        return {
            success:
                false,

            state,

            reason:
                'COSMETIC_NOT_FOUND',
        };
    }

    if (
        state.ownedFarmCosmeticIds.includes(
            cosmeticId
        )
    ) {
        return {
            success:
                false,

            state,

            reason:
                'ALREADY_OWNED',
        };
    }

    if (
        item.requiredMapId &&
        !isFarmAreaUnlocked(
            toUnlockArea(
                item.requiredMapId
            ),
            state.farmLevel
        )
    ) {
        return {
            success:
                false,

            state,

            reason:
                'COSMETIC_LOCKED',
        };
    }

    if (
        item.currency ===
            'gold' &&
        state.gold <
            item.price
    ) {
        return {
            success:
                false,

            state,

            reason:
                'NOT_ENOUGH_GOLD',
        };
    }

    if (
        item.currency ===
            'diamond' &&
        state.diamonds <
            item.price
    ) {
        return {
            success:
                false,

            state,

            reason:
                'NOT_ENOUGH_DIAMONDS',
        };
    }

    return {
        success:
            true,

        state: {
            ...state,

            gold:
                item.currency ===
                'gold'
                    ? state.gold -
                      item.price
                    : state.gold,

            diamonds:
                item.currency ===
                'diamond'
                    ? state.diamonds -
                      item.price
                    : state.diamonds,

            ownedFarmCosmeticIds: [
                ...state
                    .ownedFarmCosmeticIds,

                cosmeticId,
            ],
        },

        cosmeticId,
    };
}

export type EquipFarmCosmeticFailureReason =
    | 'COSMETIC_NOT_FOUND'
    | 'COSMETIC_NOT_OWNED'
    | 'COSMETIC_NOT_EQUIPPED';

export type EquipFarmCosmeticResult =
    | {
        success: true;
        state: FarmGameState;
        cosmeticId: string;
    }
    | {
        success: false;
        state: FarmGameState;
        reason:
            EquipFarmCosmeticFailureReason;
    };

/*
 * =========================================================
 * EQUIP COSMETIC
 * =========================================================
 *
 * Mỗi target + slot chỉ được trang bị một cosmetic.
 * Trang bị item mới tự động thay item cũ cùng slot.
 * =========================================================
 */

export function equipFarmCosmetic(
    state:
        FarmGameState,
    cosmeticId:
        string
): EquipFarmCosmeticResult {
    const item =
        FARM_COSMETICS.find(
            cosmetic =>
                cosmetic.id ===
                cosmeticId
        );

    if (!item) {
        return {
            success:
                false,

            state,

            reason:
                'COSMETIC_NOT_FOUND',
        };
    }

    if (
        !state.ownedFarmCosmeticIds.includes(
            cosmeticId
        )
    ) {
        return {
            success:
                false,

            state,

            reason:
                'COSMETIC_NOT_OWNED',
        };
    }

    return {
        success:
            true,

        state: {
            ...state,

            equippedFarmCosmetics: {
                ...state
                    .equippedFarmCosmetics,

                [item.target]: {
                    ...state
                        .equippedFarmCosmetics[
                            item.target
                        ],

                    [item.slot]:
                        item.id,
                },
            },
        },

        cosmeticId,
    };
}

/*
 * =========================================================
 * UNEQUIP COSMETIC
 * =========================================================
 */

export function unequipFarmCosmetic(
    state:
        FarmGameState,
    cosmeticId:
        string
): EquipFarmCosmeticResult {
    const item =
        FARM_COSMETICS.find(
            cosmetic =>
                cosmetic.id ===
                cosmeticId
        );

    if (!item) {
        return {
            success:
                false,

            state,

            reason:
                'COSMETIC_NOT_FOUND',
        };
    }

    const targetEquipment =
        state.equippedFarmCosmetics[
            item.target
        ];

    if (
        targetEquipment?.[
            item.slot
        ] !==
        cosmeticId
    ) {
        return {
            success:
                false,

            state,

            reason:
                'COSMETIC_NOT_EQUIPPED',
        };
    }

    const nextTargetEquipment = {
        ...targetEquipment,
    };

    delete nextTargetEquipment[
        item.slot
    ];

    return {
        success:
            true,

        state: {
            ...state,

            equippedFarmCosmetics: {
                ...state
                    .equippedFarmCosmetics,

                [item.target]:
                    nextTargetEquipment,
            },
        },

        cosmeticId,
    };
}
