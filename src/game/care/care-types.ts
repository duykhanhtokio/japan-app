/*
 * =========================================================
 * SHARED CARE SYSTEM V2
 * =========================================================
 */

export type CareType =
    | 'water'
    | 'fertilizer'
    | 'feed'
    | 'drink'
    | 'cleanup';

export type CareActionLevel =
    | 'normal'
    | 'boost'
    | 'ad';

export type CareRequirement = {
    id:
    string;

    type:
    CareType;

    dueAt:
    number;

    completed:
    boolean;

    completedAt?:
    number;

    completedWith?:
    CareActionLevel;
};

export type ProductionStatus =
    | 'active'
    | 'care_required'
    | 'ready'
    | 'paused';

export type ProductionCycleState = {
    startedAt:
    number;

    readyAt:
    number;

    status:
    ProductionStatus;

    careRequirements:
    CareRequirement[];

    /*
     * Khi care tới hạn mà chưa thực hiện,
     * growth bị đóng băng từ timestamp này.
     */
    pausedAt?:
    number;
};

export type CareCheckpointDefinition = {
    type:
    CareType;

    atFraction:
    number;
};

export type CareScheduleDefinition = {
    durationSeconds:
    number;

    checkpoints:
    readonly CareCheckpointDefinition[];

    cleanupAfterHarvest:
    boolean;

    fertilizerAfterHarvest:
    boolean;
};

export type CareActionFailureReason =
    | 'CARE_NOT_FOUND'
    | 'CARE_ALREADY_COMPLETED'
    | 'CARE_NOT_DUE'
    | 'INVALID_ACTION';

export type CareActionSuccess = {
    success:
    true;

    cycle:
    ProductionCycleState;

    timeReducedSeconds:
    number;
};

export type CareActionFailure = {
    success:
    false;

    cycle:
    ProductionCycleState;

    reason:
    CareActionFailureReason;
};

export type CareActionResult =
    | CareActionSuccess
    | CareActionFailure;