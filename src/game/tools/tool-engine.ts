import type {
    FarmGameState,
} from '../core/game-types';

import {
    getFarmTool,
} from '../data/tools';

import {
    harvestCrop,
} from '../farming/plot-engine';

import {
    waterPlot,
} from '../farming/watering-engine';

/*
 * =========================================================
 * COMMON RESULT
 * =========================================================
 */

export type ToolBatchResult = {
    state:
    FarmGameState;

    attemptedPlotIds:
    string[];

    successfulPlotIds:
    string[];

    failedPlotIds:
    string[];
};

export type UseFarmToolFailureReason =
    | 'TOOL_NOT_FOUND'
    | 'WRONG_TOOL_TYPE'
    | 'TOOL_LOCKED'
    | 'NO_TARGETS';

export type UseFarmToolResult =
    | {
        success:
        true;

        result:
        ToolBatchResult;
    }
    | {
        success:
        false;

        state:
        FarmGameState;

        reason:
        UseFarmToolFailureReason;
    };

/*
 * =========================================================
 * NORMALIZE TARGETS
 *
 * - bỏ duplicate
 * - giữ nguyên thứ tự người chơi chọn
 * - giới hạn theo maxTargets
 * =========================================================
 */

function normalizeTargets(
    plotIds:
        readonly string[],

    maxTargets:
        number
): string[] {
    const unique =
        Array.from(
            new Set(
                plotIds
            )
        );

    return unique.slice(
        0,
        maxTargets
    );
}

/*
 * =========================================================
 * WATER WITH TOOL
 *
 * Không viết lại watering logic.
 * Mỗi plot vẫn đi qua waterPlot().
 * =========================================================
 */

export function waterPlotsWithTool(
    state:
        FarmGameState,

    toolId:
        string,

    plotIds:
        readonly string[],

    now:
        number = Date.now()
): UseFarmToolResult {
    const tool =
        getFarmTool(
            toolId
        );

    if (!tool) {
        return {
            success:
                false,

            state,

            reason:
                'TOOL_NOT_FOUND',
        };
    }

    if (
        tool.type !==
        'watering_can'
    ) {
        return {
            success:
                false,

            state,

            reason:
                'WRONG_TOOL_TYPE',
        };
    }

    if (
        state.farmLevel <
        tool.unlockFarmLevel
    ) {
        return {
            success:
                false,

            state,

            reason:
                'TOOL_LOCKED',
        };
    }

    const targets =
        normalizeTargets(
            plotIds,
            tool.maxTargets
        );

    if (
        targets.length ===
        0
    ) {
        return {
            success:
                false,

            state,

            reason:
                'NO_TARGETS',
        };
    }

    let nextState =
        state;

    const successfulPlotIds:
        string[] = [];

    const failedPlotIds:
        string[] = [];

    for (
        const plotId
        of targets
    ) {
        const result =
            waterPlot(
                nextState,
                plotId,
                now
            );

        if (
            result.success
        ) {
            nextState =
                result.state;

            successfulPlotIds.push(
                plotId
            );
        } else {
            failedPlotIds.push(
                plotId
            );
        }
    }

    return {
        success:
            true,

        result: {
            state:
                nextState,

            attemptedPlotIds:
                targets,

            successfulPlotIds,

            failedPlotIds,
        },
    };
}

/*
 * =========================================================
 * HARVEST WITH TOOL
 *
 * Mỗi plot vẫn gọi harvestCrop().
 *
 * Điều này rất quan trọng:
 * warehouse capacity / XP / ready state
 * vẫn chỉ có một nguồn logic.
 * =========================================================
 */

export function harvestPlotsWithTool(
    state:
        FarmGameState,

    toolId:
        string,

    plotIds:
        readonly string[],

    now:
        number = Date.now()
): UseFarmToolResult {
    const tool =
        getFarmTool(
            toolId
        );

    if (!tool) {
        return {
            success:
                false,

            state,

            reason:
                'TOOL_NOT_FOUND',
        };
    }

    if (
        tool.type !==
        'sickle'
    ) {
        return {
            success:
                false,

            state,

            reason:
                'WRONG_TOOL_TYPE',
        };
    }

    if (
        state.farmLevel <
        tool.unlockFarmLevel
    ) {
        return {
            success:
                false,

            state,

            reason:
                'TOOL_LOCKED',
        };
    }

    const targets =
        normalizeTargets(
            plotIds,
            tool.maxTargets
        );

    if (
        targets.length ===
        0
    ) {
        return {
            success:
                false,

            state,

            reason:
                'NO_TARGETS',
        };
    }

    let nextState =
        state;

    const successfulPlotIds:
        string[] = [];

    const failedPlotIds:
        string[] = [];

    for (
        const plotId
        of targets
    ) {
        const result =
            harvestCrop(
                nextState,
                plotId,
                now
            );

        if (
            result.success
        ) {
            nextState =
                result.state;

            successfulPlotIds.push(
                plotId
            );
        } else {
            failedPlotIds.push(
                plotId
            );
        }
    }

    return {
        success:
            true,

        result: {
            state:
                nextState,

            attemptedPlotIds:
                targets,

            successfulPlotIds,

            failedPlotIds,
        },
    };
}