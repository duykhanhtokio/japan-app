import type {
    CareScheduleDefinition,
} from './care-types';

/*
 * =========================================================
 * CARE SCHEDULE FACTORIES
 * =========================================================
 *
 * Không hard-code schedule trong UI.
 *
 * Các engine chỉ lấy schedule từ đây.
 * =========================================================
 */

function hours(
    value:
        number
): number {
    return value *
        60 *
        60;
}

/*
 * =========================================================
 * ORCHARD
 * =========================================================
 */

export const APPLE_CARE_SCHEDULE:
    CareScheduleDefinition = {
    durationSeconds:
        hours(
            8
        ),

    checkpoints: [
        {
            type:
                'water',

            atFraction:
                0.5,
        },
    ],

    cleanupAfterHarvest:
        false,

    fertilizerAfterHarvest:
        true,
};

/*
 * =========================================================
 * SHORT CROPS
 * =========================================================
 *
 * Đây mới là baseline.
 *
 * Khi migrate crops.ts, duration thực tế của từng crop
 * sẽ được dùng thay cho con số cố định.
 * =========================================================
 */

export const SHORT_CROP_CARE_TEMPLATE:
    CareScheduleDefinition = {
    durationSeconds:
        hours(
            3
        ),

    checkpoints: [
        {
            type:
                'water',

            atFraction:
                0.5,
        },
    ],

    cleanupAfterHarvest:
        true,

    fertilizerAfterHarvest:
        true,
};

/*
 * =========================================================
 * RICE
 * =========================================================
 */

export const RICE_CARE_TEMPLATE:
    CareScheduleDefinition = {
    durationSeconds:
        hours(
            6
        ),

    checkpoints: [
        {
            type:
                'water',

            atFraction:
                0.4,
        },

        {
            type:
                'water',

            atFraction:
                0.75,
        },
    ],

    cleanupAfterHarvest:
        true,

    fertilizerAfterHarvest:
        true,
};

/*
 * =========================================================
 * CHICKEN
 * =========================================================
 */

export const CHICKEN_CARE_TEMPLATE:
    CareScheduleDefinition = {
    durationSeconds:
        hours(
            4
        ),

    checkpoints: [
        {
            type:
                'feed',

            atFraction:
                0.5,
        },

        {
            type:
                'drink',

            atFraction:
                0.5,
        },
    ],

    cleanupAfterHarvest:
        false,

    fertilizerAfterHarvest:
        false,
};

/*
 * =========================================================
 * COW
 * =========================================================
 */

export const COW_CARE_TEMPLATE:
    CareScheduleDefinition = {
    durationSeconds:
        hours(
            8
        ),

    checkpoints: [
        {
            type:
                'feed',

            atFraction:
                0.5,
        },

        {
            type:
                'drink',

            atFraction:
                0.5,
        },
    ],

    cleanupAfterHarvest:
        false,

    fertilizerAfterHarvest:
        false,
};

/*
 * =========================================================
 * DYNAMIC PLANT SCHEDULE
 * =========================================================
 *
 * Dùng growth time thật của crop/tree.
 *
 * Ví dụ:
 *
 * 2h crop  -> water tại 1h
 * 8h apple -> water tại 4h
 *
 * Crop dài hơn có thể nhận nhiều checkpoint.
 * =========================================================
 */

export function createPlantCareSchedule(
    durationSeconds:
        number,

    options?: {
        perennial?:
        boolean;

        rice?:
        boolean;
    }
): CareScheduleDefinition {
    const perennial =
        options
            ?.perennial ??
        false;

    const rice =
        options
            ?.rice ??
        false;

    /*
     * Cây rất ngắn:
     * 1 checkpoint.
     */

    if (
        durationSeconds <=
        hours(
            4
        )
    ) {
        return {
            durationSeconds,

            checkpoints: [
                {
                    type:
                        'water',

                    atFraction:
                        0.5,
                },
            ],

            cleanupAfterHarvest:
                !perennial,

            fertilizerAfterHarvest:
                true,
        };
    }

    /*
     * Rice cần nước nhiều hơn.
     */

    if (rice) {
        return {
            durationSeconds,

            checkpoints: [
                {
                    type:
                        'water',

                    atFraction:
                        0.4,
                },

                {
                    type:
                        'water',

                    atFraction:
                        0.75,
                },
            ],

            cleanupAfterHarvest:
                true,

            fertilizerAfterHarvest:
                true,
        };
    }

    /*
     * Cây trung/dài ngày.
     */

    return {
        durationSeconds,

        checkpoints: [
            {
                type:
                    'water',

                atFraction:
                    0.5,
            },
        ],

        cleanupAfterHarvest:
            !perennial,

        fertilizerAfterHarvest:
            true,
    };
}