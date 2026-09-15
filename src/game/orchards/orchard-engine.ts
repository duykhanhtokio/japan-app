import type {
    FarmGameState,
} from '../core/game-types';

import type {
    OrchardPlotState,
    OrchardTreeId,
} from '../core/orchard-types';

import {
    getOrchardTree,
} from '../data/orchards';

import {
    getGameItem,
} from '../data/items';


import {
    getFarmLevelFromXp,
} from '../data/farm-levels';

/*
 * =========================================================
 * PLANT RESULT
 * =========================================================
 */

export type PlantOrchardTreeFailureReason =
    | 'PLOT_NOT_FOUND'
    | 'PLOT_LOCKED'
    | 'PLOT_NOT_EMPTY'
    | 'TREE_NOT_FOUND'
    | 'TREE_LOCKED'
    | 'NOT_ENOUGH_GOLD'
    | 'NOT_ENOUGH_SAPLINGS';

export type PlantOrchardTreeResult =
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
        PlantOrchardTreeFailureReason;
    };

/*
 * =========================================================
 * HARVEST RESULT
 * =========================================================
 */

export type HarvestOrchardFailureReason =
    | 'PLOT_NOT_FOUND'
    | 'TREE_NOT_FOUND'
    | 'FRUIT_NOT_READY'
    | 'FRUIT_ITEM_NOT_FOUND';

export type HarvestOrchardResult =
    | {
        success:
        true;

        state:
        FarmGameState;

        fruitItemId:
        string;

        quantity:
        number;

        goldEarned:
        number;

        xpGained:
        number;

        nextReadyAt:
        number;
    }
    | {
        success:
        false;

        state:
        FarmGameState;

        reason:
        HarvestOrchardFailureReason;
    };

/*
 * =========================================================
 * UNLOCK RESULT
 * =========================================================
 */

export type UnlockOrchardPlotFailureReason =
    | 'PLOT_NOT_FOUND'
    | 'PLOT_ALREADY_UNLOCKED';

export type UnlockOrchardPlotResult =
    | {
        success:
        true;

        state:
        FarmGameState;
    }
    | {
        success:
        false;

        state:
        FarmGameState;

        reason:
        UnlockOrchardPlotFailureReason;
    };

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function replaceOrchardPlot(
    plots:
        readonly OrchardPlotState[],

    replacement:
        OrchardPlotState
): OrchardPlotState[] {
    return plots.map(
        plot =>
            plot.id ===
                replacement.id
                ? replacement
                : plot
    );
}

/*
 * =========================================================
 * RESOLVE TIME
 * =========================================================
 *
 * growing:
 * cây non -> cây trưởng thành
 *
 * producing:
 * cây trưởng thành -> tạo quả
 *
 * ready:
 * quả đã sẵn sàng thu hoạch
 * =========================================================
 */

export function resolveOrchardTime(
    state:
        FarmGameState,

    now:
        number = Date.now()
): FarmGameState {
    let changed =
        false;

    const nextPlots =
        state.orchardPlots.map(
            plot => {
                if (
                    plot.readyAt ===
                    undefined
                ) {
                    return plot;
                }

                if (
                    now <
                    plot.readyAt
                ) {
                    return plot;
                }

                /*
                 * =============================================
                 * GROWING
                 * =============================================
                 */

                if (
                    plot.status ===
                    'growing' &&
                    plot.treeId
                ) {
                    const tree =
                        getOrchardTree(
                            plot.treeId
                        );

                    if (!tree) {
                        return plot;
                    }

                    /*
                     * Dùng readyAt cũ làm mốc.
                     *
                     * Nhờ vậy DEV time / offline time
                     * không làm mất phần thời gian đã trôi qua.
                     */

                    const fruitReadyAt =
                        plot.readyAt +
                        tree
                            .fruitCycleTimeSeconds *
                        1000;

                    changed =
                        true;

                    /*
                     * Nếu thời gian đã vượt qua cả:
                     *
                     * growth
                     * +
                     * fruit cycle
                     *
                     * thì chuyển thẳng sang ready.
                     */

                    if (
                        now >=
                        fruitReadyAt
                    ) {
                        return {
                            ...plot,

                            status:
                                'ready' as const,

                            mature:
                                true,

                            readyAt:
                                fruitReadyAt,
                        };
                    }

                    /*
                     * Cây đã trưởng thành.
                     * Quả đang phát triển.
                     */

                    return {
                        ...plot,

                        status:
                            'producing' as const,

                        mature:
                            true,

                        readyAt:
                            fruitReadyAt,
                    };
                }

                /*
                 * =============================================
                 * PRODUCING
                 * =============================================
                 */

                if (
                    plot.status ===
                    'producing'
                ) {
                    changed =
                        true;

                    return {
                        ...plot,

                        status:
                            'ready' as const,
                    };
                }

                /*
                 * ready / empty / locked
                 */

                return plot;
            }
        );

    if (!changed) {
        return state;
    }

    return {
        ...state,

        orchardPlots:
            nextPlots,
    };
}

/*
 * =========================================================
 * PLANT TREE
 * =========================================================
 *
 * CHECKPOINT HIỆN TẠI:
 *
 * Planting vẫn dùng sapling trong inventory.
 *
 * Bước economy tiếp theo mới chuyển planting thành:
 *
 * Gold -> mua/trồng trực tiếp.
 *
 * Không thay hai hệ thống cùng một checkpoint.
 * =========================================================
 */

export function plantOrchardTree(
    state:
        FarmGameState,

    plotId:
        string,

    treeId:
        OrchardTreeId,

    now:
        number = Date.now()
): PlantOrchardTreeResult {
    const plot =
        state.orchardPlots.find(
            current =>
                current.id ===
                plotId
        );

    if (!plot) {
        return {
            success:
                false,
            state,
            reason:
                'PLOT_NOT_FOUND',
        };
    }

    if (
        plot.status ===
        'locked'
    ) {
        return {
            success:
                false,
            state,
            reason:
                'PLOT_LOCKED',
        };
    }

    if (
        plot.status !==
        'empty'
    ) {
        return {
            success:
                false,
            state,
            reason:
                'PLOT_NOT_EMPTY',
        };
    }

    const tree =
        getOrchardTree(
            treeId
        );

    if (!tree) {
        return {
            success:
                false,
            state,
            reason:
                'TREE_NOT_FOUND',
        };
    }

    if (
        state.farmLevel <
        tree.unlockFarmLevel
    ) {
        return {
            success:
                false,
            state,
            reason:
                'TREE_LOCKED',
        };
    }

    /*
     * =====================================================
     * DIRECT PURCHASE ECONOMY
     * =====================================================
     *
     * Không kiểm tra inventory.
     * Không tiêu thụ sapling trong warehouse.
     *
     * tree.saplingItemId
     *        ↓
     * getGameItem()
     *        ↓
     * shopPrice
     *        ↓
     * Gold
     */

    const saplingItem =
        getGameItem(
            tree.saplingItemId
        );

    if (
        !saplingItem ||
        saplingItem.shopPrice ===
        undefined
    ) {
        return {
            success:
                false,
            state,
            reason:
                'TREE_NOT_FOUND',
        };
    }

    const price =
        saplingItem.shopPrice;

    if (
        state.gold <
        price
    ) {
        return {
            success:
                false,
            state,
            reason:
                'NOT_ENOUGH_GOLD',
        };
    }

    const readyAt =
        now +
        tree.initialGrowTimeSeconds *
        1000;

    const nextPlot:
        OrchardPlotState = {
        id:
            plot.id,

        status:
            'growing',

        treeId:
            tree.id,

        plantedAt:
            now,

        readyAt,

        mature:
            false,

        harvestCount:
            0,
    };

    return {
        success:
            true,

        state: {
            ...state,

            gold:
                state.gold -
                price,

            orchardPlots:
                replaceOrchardPlot(
                    state.orchardPlots,
                    nextPlot
                ),
        },

        readyAt,
    };
}

/*
 * =========================================================
 * HARVEST FRUIT
 * =========================================================
 *
 * ECONOMY MỚI:
 *
 * Không lưu trái cây vào warehouse.
 *
 * Harvest
 *   ↓
 * quantity × baseSellPrice
 *   ↓
 * Gold + XP trực tiếp
 *
 * Cây KHÔNG biến mất.
 *
 * Sau harvest:
 *
 * ready
 *   ↓
 * producing
 *   ↓
 * ready
 *   ↓
 * harvest tiếp
 *
 * harvestCount tăng sau mỗi lần harvest.
 * =========================================================
 */

export function harvestOrchardFruit(
    state:
        FarmGameState,

    plotId:
        string,

    now:
        number = Date.now()
): HarvestOrchardResult {
    const resolvedState =
        resolveOrchardTime(
            state,
            now
        );

    const plot =
        resolvedState
            .orchardPlots
            .find(
                current =>
                    current.id ===
                    plotId
            );

    if (!plot) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'PLOT_NOT_FOUND',
        };
    }

    if (
        plot.status !==
        'ready' ||
        !plot.treeId
    ) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'FRUIT_NOT_READY',
        };
    }

    const tree =
        getOrchardTree(
            plot.treeId
        );

    if (!tree) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'TREE_NOT_FOUND',
        };
    }

    /*
     * Fruit definition quyết định giá bán.
     */

    const fruitItem =
        getGameItem(
            tree.fruitItemId
        );

    if (!fruitItem) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'FRUIT_ITEM_NOT_FOUND',
        };
    }

    /*
     * =====================================================
     * GOLD
     * =====================================================
     *
     * Ví dụ:
     *
     * apple yield = 6
     * baseSellPrice = 12
     *
     * 6 × 12 = 72 Gold
     */

    const goldEarned =
        fruitItem.baseSellPrice *
        tree.yieldAmount;

    /*
     * =====================================================
     * XP
     * =====================================================
     */

    const nextFarmXp =
        resolvedState.farmXp +
        tree.harvestXp;

    /*
     * =====================================================
     * NEXT FRUIT CYCLE
     * =====================================================
     *
     * Sau harvest dùng NOW làm mốc cycle mới.
     */

    const nextReadyAt =
        now +
        tree.fruitCycleTimeSeconds *
        1000;

    /*
     * Cây vẫn tồn tại.
     */

    const nextPlot:
        OrchardPlotState = {
        ...plot,

        status:
            'producing',

        mature:
            true,

        readyAt:
            nextReadyAt,

        harvestCount:
            plot.harvestCount +
            1,
    };

    return {
        success:
            true,

        state: {
            ...resolvedState,

            /*
             * Không thay inventory.
             *
             * Fruit được coi là bán ngay.
             */

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

            orchardPlots:
                replaceOrchardPlot(
                    resolvedState
                        .orchardPlots,
                    nextPlot
                ),
        },

        fruitItemId:
            tree.fruitItemId,

        quantity:
            tree.yieldAmount,

        goldEarned,

        xpGained:
            tree.harvestXp,

        nextReadyAt,
    };
}

/*
 * =========================================================
 * UNLOCK ORCHARD PLOT
 * =========================================================
 *
 * Gold / Diamond price vẫn thuộc expansion economy riêng.
 *
 * Không hard-code giá mở đất ở engine này.
 * =========================================================
 */

export function unlockOrchardPlot(
    state:
        FarmGameState,

    plotId:
        string
): UnlockOrchardPlotResult {
    const plot =
        state.orchardPlots.find(
            current =>
                current.id ===
                plotId
        );

    if (!plot) {
        return {
            success:
                false,

            state,

            reason:
                'PLOT_NOT_FOUND',
        };
    }

    if (
        plot.status !==
        'locked'
    ) {
        return {
            success:
                false,

            state,

            reason:
                'PLOT_ALREADY_UNLOCKED',
        };
    }

    const nextPlot:
        OrchardPlotState = {
        id:
            plot.id,

        status:
            'empty',

        mature:
            false,

        harvestCount:
            0,
    };

    return {
        success:
            true,

        state: {
            ...state,

            orchardPlots:
                replaceOrchardPlot(
                    state.orchardPlots,
                    nextPlot
                ),
        },
    };
}