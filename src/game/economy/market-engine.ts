import type {
    FarmGameState,
    GameItemId,
} from '../core/game-types';

import {
    getGameItem,
} from '../data/items';

import {
    getInventoryQuantity,
    removeInventoryItem,
} from '../inventory/inventory-engine';

export type SellItemFailureReason =
    | 'ITEM_NOT_FOUND'
    | 'ITEM_NOT_SELLABLE'
    | 'INVALID_QUANTITY'
    | 'NOT_ENOUGH_ITEMS';

export type SellItemResult =
    | {
        success: true;

        state:
        FarmGameState;

        itemId:
        GameItemId;

        quantity:
        number;

        goldEarned:
        number;
    }
    | {
        success: false;

        state:
        FarmGameState;

        reason:
        SellItemFailureReason;
    };

/*
 * =========================================================
 * SELL ITEM
 * =========================================================
 */

export function sellMarketItem(
    state:
        FarmGameState,

    itemId:
        GameItemId,

    quantity:
        number = 1
): SellItemResult {
    /*
     * Quantity phải là số nguyên dương.
     */

    if (
        !Number.isInteger(
            quantity
        ) ||
        quantity <=
        0
    ) {
        return {
            success:
                false,

            state,

            reason:
                'INVALID_QUANTITY',
        };
    }

    /*
     * Item phải tồn tại trong catalog.
     */

    const item =
        getGameItem(
            itemId
        );

    if (
        !item
    ) {
        return {
            success:
                false,

            state,

            reason:
                'ITEM_NOT_FOUND',
        };
    }

    /*
     * baseSellPrice <= 0
     * nghĩa là item không được bán trực tiếp.
     */

    if (
        item.baseSellPrice <=
        0
    ) {
        return {
            success:
                false,

            state,

            reason:
                'ITEM_NOT_SELLABLE',
        };
    }

    /*
     * Kiểm tra số lượng sở hữu.
     */

    const ownedQuantity =
        getInventoryQuantity(
            state.inventory,
            itemId
        );

    if (
        ownedQuantity <
        quantity
    ) {
        return {
            success:
                false,

            state,

            reason:
                'NOT_ENOUGH_ITEMS',
        };
    }

    /*
     * Trừ item khỏi inventory.
     */

    const nextInventory =
        removeInventoryItem(
            state.inventory,
            itemId,
            quantity
        );

    /*
     * Guard an toàn.
     *
     * Về logic không thể null vì phía trên
     * đã kiểm tra quantity.
     */

    if (
        !nextInventory
    ) {
        return {
            success:
                false,

            state,

            reason:
                'NOT_ENOUGH_ITEMS',
        };
    }

    /*
     * Tính Gold.
     */

    const goldEarned =
        item.baseSellPrice *
        quantity;

    return {
        success:
            true,

        state: {
            ...state,

            gold:
                state.gold +
                goldEarned,

            inventory:
                nextInventory,
        },

        itemId,

        quantity,

        goldEarned,
    };
}