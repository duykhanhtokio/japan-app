export type WorkDialogueRouteId =
    | 'AGRI_CROP'
    | 'AGRI_LIVESTOCK'
    | 'FORESTRY'
    | 'FISHERY'
    | 'CONSTRUCTION_REBAR'
    | 'CONSTRUCTION_FORMWORK'
    | 'CONSTRUCTION_SCAFFOLD'
    | 'CONSTRUCTION_GENERAL'
    | 'FOOD_PROCESSING'
    | 'TEXTILE'
    | 'MACHINERY'
    | 'CARE'
    | 'HOTEL'
    | 'CLEANING'
    | 'AUTO'
    | 'RAILWAY'
    | 'AIRPORT'
    | 'GENERAL_WORK';

export type WorkDialogueRoute = {
    id:
    WorkDialogueRouteId;

    poolId: string;

    icon: string;

    tags: string[];
};

/*
 * Ta route theo occupation code.
 *
 * Không cần tạo 174 màn hình.
 *
 * Một occupation có thể có nhiều
 * operation nhưng dùng chung pool,
 * rồi mission/scenario lọc sâu hơn
 * bằng operationCode.
 */

const occupationRoutes:
    Record<
        string,
        WorkDialogueRoute
    > = {
    /*
     * AGRICULTURE
     */

    '1-1': {
        id:
            'AGRI_CROP',

        poolId:
            'WORK_AGRI_CROP',

        icon:
            '🌱',

        tags: [
            'farm',
            'crop',
            'harvest',
            'tools',
            'weather',
        ],
    },

    '1-2': {
        id:
            'AGRI_LIVESTOCK',

        poolId:
            'WORK_AGRI_LIVESTOCK',

        icon:
            '🐄',

        tags: [
            'livestock',
            'feeding',
            'cleaning',
            'health',
        ],
    },

    '1-3': {
        id:
            'FORESTRY',

        poolId:
            'WORK_FORESTRY',

        icon:
            '🌲',

        tags: [
            'forest',
            'wood',
            'safety',
        ],
    },

    /*
     * FISHERY
     */

    '2-1': {
        id:
            'FISHERY',

        poolId:
            'WORK_FISHING',

        icon:
            '🎣',

        tags: [
            'boat',
            'fishing',
            'weather',
            'equipment',
        ],
    },

    '2-2': {
        id:
            'FISHERY',

        poolId:
            'WORK_AQUACULTURE',

        icon:
            '🐟',

        tags: [
            'aquaculture',
            'feeding',
            'water',
        ],
    },

    /*
     * CONSTRUCTION
     */

    '3-6': {
        id:
            'CONSTRUCTION_FORMWORK',

        poolId:
            'WORK_CONSTRUCTION_FORMWORK',

        icon:
            '🪚',

        tags: [
            'construction',
            'formwork',
            'safety',
        ],
    },

    '3-7': {
        id:
            'CONSTRUCTION_REBAR',

        poolId:
            'WORK_CONSTRUCTION_REBAR',

        icon:
            '🏗️',

        tags: [
            'construction',
            'rebar',
            'safety',
            'measurement',
        ],
    },

    '3-8': {
        id:
            'CONSTRUCTION_SCAFFOLD',

        poolId:
            'WORK_CONSTRUCTION_SCAFFOLD',

        icon:
            '🪜',

        tags: [
            'construction',
            'scaffold',
            'safety',
            'height',
        ],
    },

    /*
     * CARE
     */

    '7-13': {
        id:
            'CARE',

        poolId:
            'WORK_CARE',

        icon:
            '🧑‍⚕️',

        tags: [
            'care',
            'elderly',
            'health',
            'support',
        ],
    },

    /*
     * HOTEL
     */

    '7-16': {
        id:
            'HOTEL',

        poolId:
            'WORK_HOTEL',

        icon:
            '🏨',

        tags: [
            'hotel',
            'guest',
            'cleaning',
            'service',
        ],
    },

    /*
     * CLEANING
     */

    '7-12': {
        id:
            'CLEANING',

        poolId:
            'WORK_BUILDING_CLEANING',

        icon:
            '🧹',

        tags: [
            'cleaning',
            'building',
            'tools',
        ],
    },

    /*
     * AUTO
     */

    '7-11': {
        id:
            'AUTO',

        poolId:
            'WORK_AUTO_MAINTENANCE',

        icon:
            '🚗',

        tags: [
            'car',
            'maintenance',
            'inspection',
        ],
    },

    /*
     * RAILWAY
     */

    '7-18': {
        id:
            'RAILWAY',

        poolId:
            'WORK_RAILWAY_TRACK',

        icon:
            '🚆',

        tags: [
            'railway',
            'track',
            'maintenance',
        ],
    },

    '7-20': {
        id:
            'RAILWAY',

        poolId:
            'WORK_RAILWAY_VEHICLE',

        icon:
            '🚆',

        tags: [
            'railway',
            'vehicle',
            'maintenance',
        ],
    },

    /*
     * AIRPORT
     */

    '99-1': {
        id:
            'AIRPORT',

        poolId:
            'WORK_AIRPORT',

        icon:
            '✈️',

        tags: [
            'airport',
            'aircraft',
            'cargo',
            'safety',
        ],
    },
};

function getOccupationCode(
    operationCode: string
) {
    const parts =
        operationCode.split(
            '-'
        );

    if (
        parts.length < 2
    ) {
        return '';
    }

    return `${parts[0]}-${parts[1]}`;
}

export function getWorkDialogueRoute(
    operationCode:
        string
): WorkDialogueRoute {
    const occupationCode =
        getOccupationCode(
            operationCode
        );

    const direct =
        occupationRoutes[
        occupationCode
        ];

    if (direct) {
        return direct;
    }

    /*
     * FOOD
     */

    if (
        occupationCode.startsWith(
            '4-'
        )
    ) {
        return {
            id:
                'FOOD_PROCESSING',

            poolId:
                'WORK_FOOD_PROCESSING',

            icon:
                '🍱',

            tags: [
                'food',
                'factory',
                'hygiene',
                'production',
            ],
        };
    }

    /*
     * TEXTILE
     */

    if (
        occupationCode.startsWith(
            '5-'
        )
    ) {
        return {
            id:
                'TEXTILE',

            poolId:
                'WORK_TEXTILE',

            icon:
                '🧵',

            tags: [
                'textile',
                'factory',
                'machine',
            ],
        };
    }

    /*
     * MACHINERY / METAL
     */

    if (
        occupationCode.startsWith(
            '6-'
        )
    ) {
        return {
            id:
                'MACHINERY',

            poolId:
                'WORK_MACHINERY',

            icon:
                '⚙️',

            tags: [
                'machine',
                'factory',
                'inspection',
                'safety',
            ],
        };
    }

    /*
     * OTHER CONSTRUCTION
     */

    if (
        occupationCode.startsWith(
            '3-'
        )
    ) {
        return {
            id:
                'CONSTRUCTION_GENERAL',

            poolId:
                'WORK_CONSTRUCTION_GENERAL',

            icon:
                '🏗️',

            tags: [
                'construction',
                'site',
                'safety',
            ],
        };
    }

    return {
        id:
            'GENERAL_WORK',

        poolId:
            'WORK_GENERAL',

        icon:
            '💼',

        tags: [
            'work',
            'communication',
            'safety',
        ],
    };
}