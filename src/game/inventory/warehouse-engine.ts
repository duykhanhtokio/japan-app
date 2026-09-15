import type {
    FarmGameState,
    InventoryEntry,
} from '../core/game-types';

import {
    getWarehouseLevelDefinition,
} from '../data/warehouse-levels';

/*
 * =========================================================
 * USED CAPACITY
 * =========================================================
 *
 * Capacity tính theo tổng quantity.
 *
 * Ví dụ:
 *
 * seed_wheat × 10
 * crop_wheat × 8
 * egg × 5
 *
 * used = 23
 * =========================================================
 */

export function getWarehouseUsedCapacity(
    inventory:
        readonly InventoryEntry[]
): number {
    return inventory.reduce(
        (
            total,
            entry
        ) =>
            total +
            Math.max(
                0,
                entry.quantity
            ),
        0
    );
}

/*
 * =========================================================
 * MAX CAPACITY
 * =========================================================
 */

export function getWarehouseCapacity(
    state:
        FarmGameState
): number {
    return (
        getWarehouseLevelDefinition(
            state.warehouseLevel
        )?.capacity ??
        0
    );
}

/*
 * =========================================================
 * REMAINING
 * =========================================================
 */

export function getWarehouseRemainingCapacity(
    state:
        FarmGameState
): number {
    return Math.max(
        0,

        getWarehouseCapacity(
            state
        ) -
        getWarehouseUsedCapacity(
            state.inventory
        )
    );
}

/*
 * =========================================================
 * CAN STORE
 * =========================================================
 */

export function canStoreInWarehouse(
    state:
        FarmGameState,
    quantity:
        number
): boolean {
    if (
        !Number.isInteger(
            quantity
        ) ||
        quantity < 0
    ) {
        return false;
    }

    return (
        getWarehouseRemainingCapacity(
            state
        ) >=
        quantity
    );
}

/*
 * =========================================================
 * WAREHOUSE INFO
 *
 * Sau này UI có thể dùng:
 *
 * 18 / 30
 * =========================================================
 */

export function getWarehouseStatus(
    state:
        FarmGameState
) {
    const capacity =
        getWarehouseCapacity(
            state
        );

    const used =
        getWarehouseUsedCapacity(
            state.inventory
        );

    return {
        level:
            state.warehouseLevel,

        used,

        capacity,

        remaining:
            Math.max(
                0,
                capacity - used
            ),

        isFull:
            used >= capacity,
    };
}