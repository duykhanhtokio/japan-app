import type {
    FarmGameState,
    GameItemId,
    InventoryEntry,
} from '../core/game-types';

/*
 * =========================================================
 * INVENTORY ENGINE
 * =========================================================
 *
 * Engine thuần TypeScript.
 * Không phụ thuộc React / UI.
 *
 * Các hàm đều tránh mutate inventory cũ.
 * =========================================================
 */

export function getInventoryQuantity(
    inventory:
        readonly InventoryEntry[],
    itemId:
        GameItemId
): number {
    return (
        inventory.find(
            entry =>
                entry.itemId ===
                itemId
        )?.quantity ??
        0
    );
}

export function hasInventoryItem(
    inventory:
        readonly InventoryEntry[],
    itemId:
        GameItemId,
    quantity:
        number = 1
): boolean {
    /*
     * Yêu cầu <= 0 luôn được xem là đủ.
     */
    if (
        quantity <=
        0
    ) {
        return true;
    }

    return (
        getInventoryQuantity(
            inventory,
            itemId
        ) >=
        quantity
    );
}

/*
 * =========================================================
 * ADD
 * =========================================================
 */

export function addInventoryItem(
    inventory:
        readonly InventoryEntry[],
    itemId:
        GameItemId,
    quantity:
        number
): InventoryEntry[] {
    if (
        quantity <=
        0
    ) {
        return [
            ...inventory,
        ];
    }

    const existingIndex =
        inventory.findIndex(
            entry =>
                entry.itemId ===
                itemId
        );

    /*
     * Item chưa tồn tại.
     */
    if (
        existingIndex ===
        -1
    ) {
        return [
            ...inventory,

            {
                itemId,
                quantity,
            },
        ];
    }

    /*
     * Item đã tồn tại.
     */
    return inventory.map(
        (
            entry,
            index
        ) => {
            if (
                index !==
                existingIndex
            ) {
                return entry;
            }

            return {
                ...entry,

                quantity:
                    entry.quantity +
                    quantity,
            };
        }
    );
}

/*
 * =========================================================
 * REMOVE
 * =========================================================
 *
 * null =
 * inventory không đủ số lượng để trừ.
 * =========================================================
 */

export function removeInventoryItem(
    inventory:
        readonly InventoryEntry[],
    itemId:
        GameItemId,
    quantity:
        number
): InventoryEntry[] | null {
    if (
        quantity <=
        0
    ) {
        return [
            ...inventory,
        ];
    }

    const currentQuantity =
        getInventoryQuantity(
            inventory,
            itemId
        );

    if (
        currentQuantity <
        quantity
    ) {
        return null;
    }

    const remaining =
        currentQuantity -
        quantity;

    /*
     * Nếu còn 0 thì xóa entry
     * để inventory không chứa item rỗng.
     */
    if (
        remaining ===
        0
    ) {
        return inventory.filter(
            entry =>
                entry.itemId !==
                itemId
        );
    }

    return inventory.map(
        entry => {
            if (
                entry.itemId !==
                itemId
            ) {
                return entry;
            }

            return {
                ...entry,

                quantity:
                    remaining,
            };
        }
    );
}

/*
 * =========================================================
 * FARM STATE HELPERS
 * =========================================================
 */

export function addItemToFarmState(
    state:
        FarmGameState,
    itemId:
        GameItemId,
    quantity:
        number
): FarmGameState {
    return {
        ...state,

        inventory:
            addInventoryItem(
                state.inventory,
                itemId,
                quantity
            ),
    };
}

export function removeItemFromFarmState(
    state:
        FarmGameState,
    itemId:
        GameItemId,
    quantity:
        number
): FarmGameState | null {
    const nextInventory =
        removeInventoryItem(
            state.inventory,
            itemId,
            quantity
        );

    if (
        !nextInventory
    ) {
        return null;
    }

    return {
        ...state,

        inventory:
            nextInventory,
    };
}