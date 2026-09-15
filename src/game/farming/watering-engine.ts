import {
    careForCrop,
    resolveFarmTime,
} from './plot-engine';

type FarmGameState =
    Parameters<
        typeof careForCrop
    >[0];

export type WaterPlotFailureReason =
    | 'PLOT_NOT_FOUND'
    | 'PLOT_NOT_GROWING'
    | 'WATER_NOT_REQUIRED'
    | 'CARE_ACTION_FAILED';

export type WaterPlotResult =
    | {
        success:
            true;

        state:
            FarmGameState;

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
            WaterPlotFailureReason;
    };

export function waterPlot(
    state:
        FarmGameState,

    plotId:
        string,

    now:
        number = Date.now()
): WaterPlotResult {
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

            state:
                resolvedState,

            reason:
                'PLOT_NOT_FOUND',
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

            state:
                resolvedState,

            reason:
                'PLOT_NOT_GROWING',
        };
    }

    const dueRequirement =
        plot.production
            .careRequirements
            .filter(
                requirement =>
                    !requirement.completed &&
                    requirement.dueAt <=
                        now
            )
            .sort(
                (
                    left,
                    right
                ) =>
                    left.dueAt -
                    right.dueAt
            )[0];

    if (
        !dueRequirement ||
        dueRequirement.type !==
            'water'
    ) {
        return {
            success:
                false,

            state:
                resolvedState,

            reason:
                'WATER_NOT_REQUIRED',
        };
    }

    const previousReadyAt =
        plot.production
            .readyAt;

    const result =
        careForCrop(
            resolvedState,
            plotId,
            'normal',
            now
        );

    if (!result.success) {
        return {
            success:
                false,

            state:
                result.state,

            reason:
                'CARE_ACTION_FAILED',
        };
    }

    const nextPlot =
        result.state
            .plots
            .find(
                current =>
                    current.id ===
                    plotId
            );

    const newReadyAt =
        nextPlot
            ?.production
            ?.readyAt ??
        nextPlot
            ?.readyAt ??
        previousReadyAt;

    return {
        success:
            true,

        state:
            result.state,

        previousReadyAt,

        newReadyAt,

        timeReducedMs:
            result
                .timeReducedSeconds *
            1000,
    };
}
