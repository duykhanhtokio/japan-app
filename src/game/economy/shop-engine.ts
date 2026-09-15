import type {
    FarmGameState,
    GameItemId,
} from '../core/game-types';

import {
    getGameItem,
} from '../data/items';

import {
    addInventoryItem,
} from '../inventory/inventory-engine';

export type BuyItemFailureReason =
    | 'ITEM_NOT_FOUND'
    | 'ITEM_NOT_FOR_SALE'
    | 'ITEM_LOCKED'
    | 'INVALID_QUANTITY'
    | 'NOT_ENOUGH_GOLD';

export type BuyItemResult =
    | {
        success: true;
        state: FarmGameState;
        itemId: GameItemId;
        quantity: number;
        goldSpent: number;
    }
    | {
        success: false;
        state: FarmGameState;
        reason: BuyItemFailureReason;
    };

/*
 * =========================================================
 * BUY ITEM
 * =========================================================
 */

export function buyShopItem(
    state: FarmGameState,
    itemId: GameItemId,
    quantity: number = 1
): BuyItemResult {
    if (
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {
        return {
            success: false,
            state,
            reason: 'INVALID_QUANTITY',
        };
    }

    const item =
        getGameItem(
            itemId
        );

    if (!item) {
        return {
            success: false,
            state,
            reason: 'ITEM_NOT_FOUND',
        };
    }

    if (
        item.shopPrice ===
        undefined
    ) {
        return {
            success: false,
            state,
            reason: 'ITEM_NOT_FOR_SALE',
        };
    }

    if (
        state.farmLevel <
        item.unlockFarmLevel
    ) {
        return {
            success: false,
            state,
            reason: 'ITEM_LOCKED',
        };
    }

    const totalPrice =
        item.shopPrice *
        quantity;

    if (
        state.gold <
        totalPrice
    ) {
        return {
            success: false,
            state,
            reason: 'NOT_ENOUGH_GOLD',
        };
    }

    return {
        success: true,

        state: {
            ...state,

            gold:
                state.gold -
                totalPrice,

            inventory:
                addInventoryItem(
                    state.inventory,
                    itemId,
                    quantity
                ),
        },

        itemId,
        quantity,

        goldSpent:
            totalPrice,
    };
}