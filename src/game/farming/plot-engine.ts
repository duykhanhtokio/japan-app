import type {
    CareActionLevel,
} from '../care/care-types';

import {
    createProductionCycle,
    getDueCareRequirement,
    performCareAction,
    resolveProductionCycle,
} from '../care/care-engine';

import {
    createPlantCareSchedule,
} from '../care/care-schedules';

import type {
    CropId,
    FarmGameState,
    FarmPlotState,
} from '../core/game-types';

import {
    getCrop,
} from '../data/crops';

import {
    getFarmLevelFromXp,
} from '../data/farm-levels';

import {
    getGameItem,
} from '../data/items';

export const CROP_SET_SIZE = 9;

/*
 * =========================================================
 * RESULT TYPES
 * =========================================================
 */

export type PlantCropFailureReason =
    | 'PLOT_NOT_FOUND'
    | 'PLOT_NOT_EMPTY'
    | 'CROP_NOT_FOUND'
    | 'CROP_LOCKED'
    | 'SEED_NOT_FOR_SALE'
    | 'NOT_ENOUGH_GOLD';

export type PlantCropResult =
    | {
        success:
        true;

        state:
        FarmGameState;

        goldSpent:
        number;
    }
    | {
        success:
        false;

        reason:
        PlantCropFailureReason;

        state:
        FarmGameState;
    };

export type HarvestCropFailureReason =
    | 'PLOT_NOT_FOUND'
    | 'PLOT_NOT_READY'
    | 'CROP_NOT_FOUND'
    | 'HARVEST_ITEM_NOT_FOUND';

export type HarvestCropResult =
    | {
        success:
        true;

        state:
        FarmGameState;

        harvestedItemId:
        string;

        harvestedQuantity:
        number;

        goldEarned:
        number;

        xpGained:
        number;
    }
    | {
        success:
        false;

        reason:
        HarvestCropFailureReason;

        state:
        FarmGameState;
    };

export type CareCropFailureReason =
    | 'PLOT_NOT_FOUND'
    | 'PLOT_NOT_GROWING'
    | 'CARE_NOT_REQUIRED'
    | 'CARE_ACTION_FAILED';

export type CareCropResult =
    | {
        success:
        true;

        state:
        FarmGameState;

        timeReducedSeconds:
        number;
    }
    | {
        success:
        false;

        reason:
        CareCropFailureReason;

        state:
        FarmGameState;
    };

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function replacePlot(
    plots:
        readonly FarmPlotState[],

    replacement:
        FarmPlotState
): FarmPlotState[] {
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
 * PLANT
 * =========================================================
 *
 * Farm V2:
 *
 * Không lấy seed từ inventory.
 *
 * Tap crop
 * -> mua seed bằng Gold
 * -> trồng ngay.
 * =========================================================
 */

export function plantCrop(
    state:
        FarmGameState,

    plotId:
        string,

    cropId:
        CropId,

    now:
        number = Date.now()
): PlantCropResult {
    const plot =
        state.plots.find(
            current =>
                current.id ===
                plotId
        );

    if (!plot) {
        return {
            success:
                false,

            reason:
                'PLOT_NOT_FOUND',

            state,
        };
    }

    if (
        plot.status !==
        'empty'
    ) {
        return {
            success:
                false,

            reason:
                'PLOT_NOT_EMPTY',

            state,
        };
    }

    const crop =
        getCrop(
            cropId
        );

    if (!crop) {
        return {
            success:
                false,

            reason:
                'CROP_NOT_FOUND',

            state,
        };
    }

    if (
        state.farmLevel <
        crop.unlockFarmLevel
    ) {
        return {
            success:
                false,

            reason:
                'CROP_LOCKED',

            state,
        };
    }

    const seed =
        getGameItem(
            crop.seedItemId
        );

    if (
        !seed ||
        seed.shopPrice ===
        undefined
    ) {
        return {
            success:
                false,

            reason:
                'SEED_NOT_FOR_SALE',

            state,
        };
    }

    if (
        state.gold <
        seed.shopPrice * CROP_SET_SIZE
    ) {
        return {
            success:
                false,

            reason:
                'NOT_ENOUGH_GOLD',

            state,
        };
    }

    const schedule =
        createPlantCareSchedule(
            crop.growTimeSeconds,
            {
                rice:
                    crop.id ===
                    'vegetable',

                perennial:
                    false,
            }
        );

    const production =
        createProductionCycle(
            schedule,
            now
        );

    const nextPlot:
        FarmPlotState = {
        id:
            plot.id,

        status:
            'growing',

        cropId:
            crop.id,

        plantedAt:
            now,

        readyAt:
            production.readyAt,

        production,
    };

    return {
        success:
            true,

        goldSpent:
            seed.shopPrice * CROP_SET_SIZE,

        state: {
            ...state,

            gold:
                state.gold -
                seed.shopPrice * CROP_SET_SIZE,

            plots:
                replacePlot(
                    state.plots,
                    nextPlot
                ),
        },
    };
}

/*
 * =========================================================
 * RESOLVE TIME
 * =========================================================
 */

export function resolveFarmTime(
    state:
        FarmGameState,

    now:
        number = Date.now()
): FarmGameState {
    const nextPlots =
        state.plots.map(
            plot => {
                if (
                    plot.status !==
                    'growing' ||
                    !plot.production
                ) {
                    return plot;
                }

                const production =
                    resolveProductionCycle(
                        plot.production,
                        now
                    );

                return {
                    ...plot,

                    production,

                    readyAt:
                        production.readyAt,

                    status:
                        production.status ===
                            'ready'
                            ? 'ready'
                            : 'growing',
                } satisfies FarmPlotState;
            }
        );

    return {
        ...state,

        plots:
            nextPlots,
    };
}

/*
 * =========================================================
 * CARE
 * =========================================================
 */

export function careForCrop(
    state:
        FarmGameState,

    plotId:
        string,

    action:
        CareActionLevel,

    now:
        number = Date.now()
): CareCropResult {
    const resolvedState =
        resolveFarmTime(
            state,
            now
        );

    const plot =
        resolvedState
            .plots
            .find(
                current =>
                    current.id ===
                    plotId
            );

    if (!plot) {
        return {
            success:
                false,

            reason:
                'PLOT_NOT_FOUND',

            state:
                resolvedState,
        };
    }

    if (
        plot.status !==
        'growing' ||
        !plot.production
    ) {
        return {
            success:
                false,

            reason:
                'PLOT_NOT_GROWING',

            state:
                resolvedState,
        };
    }

    const requirement =
        getDueCareRequirement(
            plot.production,
            now
        );

    if (!requirement) {
        return {
            success:
                false,

            reason:
                'CARE_NOT_REQUIRED',

            state:
                resolvedState,
        };
    }

    const result =
        performCareAction(
            plot.production,
            requirement.id,
            action,
            now
        );

    if (!result.success) {
        return {
            success:
                false,

            reason:
                'CARE_ACTION_FAILED',

            state:
                resolvedState,
        };
    }

    const nextPlot:
        FarmPlotState = {
        ...plot,

        production:
            result.cycle,

        readyAt:
            result.cycle
                .readyAt,

        status:
            result.cycle
                .status ===
                'ready'
                ? 'ready'
                : 'growing',
    };

    return {
        success:
            true,

        timeReducedSeconds:
            result
                .timeReducedSeconds,

        state: {
            ...resolvedState,

            plots:
                replacePlot(
                    resolvedState
                        .plots,
                    nextPlot
                ),
        },
    };
}

/*
 * =========================================================
 * HARVEST + AUTO SELL
 * =========================================================
 */

export function harvestCrop(
    state:
        FarmGameState,

    plotId:
        string,

    now:
        number = Date.now()
): HarvestCropResult {
    const resolvedState =
        resolveFarmTime(
            state,
            now
        );

    const plot =
        resolvedState
            .plots
            .find(
                current =>
                    current.id ===
                    plotId
            );

    if (!plot) {
        return {
            success:
                false,

            reason:
                'PLOT_NOT_FOUND',

            state:
                resolvedState,
        };
    }

    if (
        plot.status !==
        'ready' ||
        !plot.cropId
    ) {
        return {
            success:
                false,

            reason:
                'PLOT_NOT_READY',

            state:
                resolvedState,
        };
    }

    const crop =
        getCrop(
            plot.cropId
        );

    if (!crop) {
        return {
            success:
                false,

            reason:
                'CROP_NOT_FOUND',

            state:
                resolvedState,
        };
    }

    const harvestItem =
        getGameItem(
            crop.harvestItemId
        );

    if (!harvestItem) {
        return {
            success:
                false,

            reason:
                'HARVEST_ITEM_NOT_FOUND',

            state:
                resolvedState,
        };
    }

    const goldEarned =
        harvestItem
            .baseSellPrice *
        crop.yieldAmount *
        CROP_SET_SIZE;

    const nextFarmXp =
        resolvedState.farmXp +
        crop.harvestXp *
        CROP_SET_SIZE;

    /*
     * Sau harvest KHÔNG empty ngay.
     *
     * Người chơi phải:
     *
     * 1. dọn cây cũ
     * 2. bón phân/làm đất
     */

    const nextPlot:
        FarmPlotState = {
        id:
            plot.id,

        status:
            'cleanup_required',

        cropId:
            crop.id,
    };

    return {
        success:
            true,

        harvestedItemId:
            crop.harvestItemId,

        harvestedQuantity:
            crop.yieldAmount * CROP_SET_SIZE,

        goldEarned,

        xpGained:
            crop.harvestXp * CROP_SET_SIZE,

        state: {
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

            plots:
                replacePlot(
                    resolvedState
                        .plots,
                    nextPlot
                ),
        },
    };
}

/*
 * =========================================================
 * CLEANUP
 * =========================================================
 */

export function cleanupCropPlot(
    state:
        FarmGameState,

    plotId:
        string
): FarmGameState {
    const plot =
        state.plots.find(
            current =>
                current.id ===
                plotId
        );

    if (
        !plot ||
        plot.status !==
        'cleanup_required'
    ) {
        return state;
    }

    const nextPlot:
        FarmPlotState = {
        id:
            plot.id,

        status:
            'fertilizer_required',
    };

    return {
        ...state,

        plots:
            replacePlot(
                state.plots,
                nextPlot
            ),
    };
}

/*
 * =========================================================
 * PREPARE SOIL
 * =========================================================
 */

export function fertilizeCropPlot(
    state:
        FarmGameState,

    plotId:
        string
): FarmGameState {
    const plot =
        state.plots.find(
            current =>
                current.id ===
                plotId
        );

    if (
        !plot ||
        plot.status !==
        'fertilizer_required'
    ) {
        return state;
    }

    const nextPlot:
        FarmPlotState = {
        id:
            plot.id,

        status:
            'empty',
    };

    return {
        ...state,

        plots:
            replacePlot(
                state.plots,
                nextPlot
            ),
    };
}
