import type {
    CropDefinition,
    CropId,
    FarmPlotState,
} from '../core/game-types';

import {
    getCrop,
} from '../data/crops';

export function getCropDefinition(
    cropId: CropId
): CropDefinition | undefined {
    return getCrop(
        cropId
    );
}

export function calculateCropReadyAt(
    crop: CropDefinition,
    plantedAt: number
): number {
    return (
        plantedAt +
        crop.growTimeSeconds *
        1000
    );
}

export function isCropReady(
    plot: FarmPlotState,
    now: number
): boolean {
    if (
        plot.status !== 'growing' &&
        plot.status !== 'ready'
    ) {
        return false;
    }

    if (
        plot.readyAt ===
        undefined
    ) {
        return false;
    }

    return (
        now >=
        plot.readyAt
    );
}

export function getCropRemainingTimeMs(
    plot: FarmPlotState,
    now: number
): number {
    if (
        plot.readyAt ===
        undefined
    ) {
        return 0;
    }

    return Math.max(
        0,
        plot.readyAt - now
    );
}

export function getCropGrowthProgress(
    plot: FarmPlotState,
    now: number
): number {
    if (
        plot.plantedAt === undefined ||
        plot.readyAt === undefined
    ) {
        return 0;
    }

    const duration =
        plot.readyAt -
        plot.plantedAt;

    if (duration <= 0) {
        return 1;
    }

    const elapsed =
        now -
        plot.plantedAt;

    return Math.min(
        1,
        Math.max(
            0,
            elapsed / duration
        )
    );
}

export function resolvePlotTimeState(
    plot: FarmPlotState,
    now: number
): FarmPlotState {
    if (
        plot.status !==
        'growing'
    ) {
        return plot;
    }

    if (
        !isCropReady(
            plot,
            now
        )
    ) {
        return plot;
    }

    return {
        ...plot,

        status:
            'ready',
    };
}