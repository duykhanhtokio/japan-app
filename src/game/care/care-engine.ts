import type {
    CareActionLevel,
    CareActionResult,
    CareRequirement,
    CareScheduleDefinition,
    ProductionCycleState,
} from './care-types';

/*
 * =========================================================
 * CREATE
 * =========================================================
 */

export function createProductionCycle(
    schedule:
        CareScheduleDefinition,

    now:
        number = Date.now()
): ProductionCycleState {
    const durationMs =
        schedule.durationSeconds *
        1000;

    const requirements:
        CareRequirement[] =
        schedule.checkpoints
            .filter(
                checkpoint =>
                    checkpoint.atFraction >
                    0 &&
                    checkpoint.atFraction <
                    1
            )
            .map(
                (
                    checkpoint,
                    index
                ) => ({
                    id:
                        `${checkpoint.type}_${index}`,

                    type:
                        checkpoint.type,

                    dueAt:
                        now +
                        durationMs *
                        checkpoint.atFraction,

                    completed:
                        false,
                })
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    a.dueAt -
                    b.dueAt
            );

    return {
        startedAt:
            now,

        readyAt:
            now +
            durationMs,

        status:
            'active',

        careRequirements:
            requirements,
    };
}

/*
 * =========================================================
 * REQUIREMENTS
 * =========================================================
 */

export function getNextCareRequirement(
    cycle:
        ProductionCycleState
): CareRequirement | undefined {
    return cycle
        .careRequirements
        .filter(
            requirement =>
                !requirement.completed
        )
        .sort(
            (
                a,
                b
            ) =>
                a.dueAt -
                b.dueAt
        )[0];
}

export function getDueCareRequirement(
    cycle:
        ProductionCycleState,

    now:
        number = Date.now()
): CareRequirement | undefined {
    return cycle
        .careRequirements
        .filter(
            requirement =>
                !requirement.completed &&
                requirement.dueAt <=
                now
        )
        .sort(
            (
                a,
                b
            ) =>
                a.dueAt -
                b.dueAt
        )[0];
}

/*
 * =========================================================
 * RESOLVE
 * =========================================================
 *
 * Khi checkpoint tới:
 *
 * active
 * ↓
 * care_required
 *
 * Growth đóng băng tại đúng dueAt.
 * =========================================================
 */

export function resolveProductionCycle(
    cycle:
        ProductionCycleState,

    now:
        number = Date.now()
): ProductionCycleState {
    if (
        cycle.status ===
        'ready'
    ) {
        return cycle;
    }

    if (
        cycle.status ===
        'care_required' &&
        cycle.pausedAt !==
        undefined
    ) {
        return cycle;
    }

    const dueCare =
        getDueCareRequirement(
            cycle,
            now
        );

    if (dueCare) {
        return {
            ...cycle,

            status:
                'care_required',

            pausedAt:
                dueCare.dueAt,
        };
    }

    if (
        now >=
        cycle.readyAt
    ) {
        return {
            ...cycle,

            status:
                'ready',

            pausedAt:
                undefined,
        };
    }

    return {
        ...cycle,

        status:
            'active',

        pausedAt:
            undefined,
    };
}

/*
 * =========================================================
 * CARE
 * =========================================================
 */

export function performCareAction(
    inputCycle:
        ProductionCycleState,

    requirementId:
        string,

    action:
        CareActionLevel,

    now:
        number = Date.now()
): CareActionResult {
    const cycle =
        resolveProductionCycle(
            inputCycle,
            now
        );

    const requirement =
        cycle
            .careRequirements
            .find(
                current =>
                    current.id ===
                    requirementId
            );

    if (!requirement) {
        return {
            success:
                false,

            cycle,

            reason:
                'CARE_NOT_FOUND',
        };
    }

    if (
        requirement.completed
    ) {
        return {
            success:
                false,

            cycle,

            reason:
                'CARE_ALREADY_COMPLETED',
        };
    }

    if (
        requirement.dueAt >
        now
    ) {
        return {
            success:
                false,

            cycle,

            reason:
                'CARE_NOT_DUE',
        };
    }

    if (
        action !==
        'normal' &&
        action !==
        'boost' &&
        action !==
        'ad'
    ) {
        return {
            success:
                false,

            cycle,

            reason:
                'INVALID_ACTION',
        };
    }

    /*
     * =====================================================
     * AD
     * =====================================================
     *
     * Người chơi xem quảng cáo:
     * hoàn thành toàn bộ growth cycle.
     */

    if (
        action ===
        'ad'
    ) {
        const remainingSeconds =
            Math.max(
                0,
                Math.ceil(
                    (
                        cycle.readyAt -
                        (
                            cycle.pausedAt ??
                            now
                        )
                    ) /
                    1000
                )
            );

        return {
            success:
                true,

            cycle: {
                ...cycle,

                readyAt:
                    now,

                status:
                    'ready',

                pausedAt:
                    undefined,

                careRequirements:
                    cycle
                        .careRequirements
                        .map(
                            current => ({
                                ...current,

                                completed:
                                    true,

                                completedAt:
                                    current.completedAt ??
                                    now,

                                completedWith:
                                    current.completedWith ??
                                    'ad',
                            })
                        ),
            },

            timeReducedSeconds:
                remainingSeconds,
        };
    }

    /*
     * =====================================================
     * PAUSE COMPENSATION
     * =====================================================
     *
     * Ví dụ:
     *
     * water due = 12:00
     * player waters = 18:00
     *
     * => growth mất 6h.
     *
     * readyAt và checkpoint tương lai
     * đều dịch thêm 6h.
     */

    const pausedAt =
        cycle.pausedAt ??
        requirement.dueAt;

    const pauseDurationMs =
        Math.max(
            0,
            now -
            pausedAt
        );

    /*
     * BOOST:
     * tưới/bón nhiều hơn.
     *
     * Giảm 15% thời gian growth gốc.
     */

    const originalDurationMs =
        Math.max(
            0,
            cycle.readyAt -
            cycle.startedAt
        );

    const boostMs =
        action ===
            'boost'
            ? Math.floor(
                originalDurationMs *
                0.15
            )
            : 0;

    const nextRequirements =
        cycle
            .careRequirements
            .map(
                current => {
                    if (
                        current.id ===
                        requirement.id
                    ) {
                        return {
                            ...current,

                            completed:
                                true,

                            completedAt:
                                now,

                            completedWith:
                                action,
                        };
                    }

                    if (
                        !current.completed &&
                        current.dueAt >
                        pausedAt
                    ) {
                        return {
                            ...current,

                            dueAt:
                                Math.max(
                                    now,
                                    current.dueAt +
                                    pauseDurationMs -
                                    boostMs
                                ),
                        };
                    }

                    return current;
                }
            );

    const nextReadyAt =
        Math.max(
            now,
            cycle.readyAt +
            pauseDurationMs -
            boostMs
        );

    const nextCycle:
        ProductionCycleState = {
        ...cycle,

        readyAt:
            nextReadyAt,

        status:
            'active',

        pausedAt:
            undefined,

        careRequirements:
            nextRequirements,
    };

    return {
        success:
            true,

        cycle:
            resolveProductionCycle(
                nextCycle,
                now
            ),

        timeReducedSeconds:
            Math.floor(
                boostMs /
                1000
            ),
    };
}

/*
 * =========================================================
 * PROGRESS
 * =========================================================
 */

export function getProductionProgress(
    cycle:
        ProductionCycleState,

    now:
        number = Date.now()
): number {
    const effectiveNow =
        cycle.pausedAt !==
            undefined
            ? Math.min(
                now,
                cycle.pausedAt
            )
            : now;

    const total =
        cycle.readyAt -
        cycle.startedAt;

    if (
        total <=
        0
    ) {
        return 1;
    }

    return Math.min(
        1,
        Math.max(
            0,
            (
                effectiveNow -
                cycle.startedAt
            ) /
            total
        )
    );
}

/*
 * =========================================================
 * REMAINING
 * =========================================================
 */

export function getProductionRemainingSeconds(
    cycle:
        ProductionCycleState,

    now:
        number = Date.now()
): number {
    if (
        cycle.status ===
        'ready'
    ) {
        return 0;
    }

    const effectiveNow =
        cycle.pausedAt ??
        now;

    return Math.max(
        0,
        Math.ceil(
            (
                cycle.readyAt -
                effectiveNow
            ) /
            1000
        )
    );
}