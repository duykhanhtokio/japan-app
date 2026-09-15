import {
    fertilizeCropPlot,
} from './plot-engine';

type FarmGameState =
    Parameters<
        typeof fertilizeCropPlot
    >[0];

type GameItemId =
    string;

export type FertilizerDefinition = {
    itemId:
        GameItemId;

    timeReductionRatio:
        number;
};

export const FERTILIZERS:
    readonly FertilizerDefinition[] = [
        {
            itemId:
                'fertilizer_normal',

            timeReductionRatio:
                0.20,
        },

        {
            itemId:
                'fertilizer_advanced',

            timeReductionRatio:
                0.40,
        },

        {
            itemId:
                'fertilizer_special',

            timeReductionRatio:
                0.60,
        },
    ];

export function getFertilizerDefinition(
    itemId:
        GameItemId
):
    FertilizerDefinition |
    undefined {
    return FERTILIZERS.find(
        fertilizer =>
            fertilizer.itemId ===
            itemId
    );
}

export type ApplyFertilizerFailureReason =
    | 'PLOT_NOT_FOUND'
    | 'PLOT_NOT_READY_FOR_FERTILIZER'
    | 'FERTILIZER_NOT_FOUND';

export type ApplyFertilizerResult =
    | {
        success:
            true;

        state:
            FarmGameState;

        fertilizerItemId:
            GameItemId;

        previousReadyAt:
            number;

        newReadyAt:
            number;

        timeReducedMs:
            number;
    }
    | {
        success:
            false;

        state:
            FarmGameState;

        reason:
            ApplyFertilizerFailureReason;
    };

export function applyFertilizerToPlot(
    state:
        FarmGameState,

    plotId:
        string,

    fertilizerItemId:
        GameItemId,

    _now:
        number = Date.now()
): ApplyFertilizerResult {
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

            state,

            reason:
                'PLOT_NOT_FOUND',
        };
    }

    const fertilizer =
        getFertilizerDefinition(
            fertilizerItemId
        );

    if (!fertilizer) {
        return {
            success:
                false,

            state,

            reason:
                'FERTILIZER_NOT_FOUND',
        };
    }

    if (
        plot.status !==
        'fertilizer_required'
    ) {
        return {
            success:
                false,

            state,

            reason:
                'PLOT_NOT_READY_FOR_FERTILIZER',
        };
    }

    const nextState =
        fertilizeCropPlot(
            state,
            plotId
        );

    return {
        success:
            true,

        state:
            nextState,

        fertilizerItemId,

        previousReadyAt:
            0,

        newReadyAt:
            0,

        timeReducedMs:
            0,
    };
}
