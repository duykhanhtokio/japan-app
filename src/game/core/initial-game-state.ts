import type {
    FarmGameState,
    FarmPlotState,
} from './game-types';

import type {
    OrchardPlotState,
} from './orchard-types';

import {
    FARM_GAME_CONFIG,
} from './game-config';

import {
    FARM_COSMETICS,
} from '../data/farm-cosmetics';

/*
 * =========================================================
 * INITIAL FARM PLOTS
 * =========================================================
 *
 * Farm V1 bắt đầu với 6 plot.
 *
 * Chưa đưa tọa độ UI vào đây.
 * Layout/rendering sẽ thuộc Farm World sau này.
 * =========================================================
 */

function createInitialPlots():
    FarmPlotState[] {
    return Array.from(
        {
            length:
                6,
        },

        (
            _,
            index
        ) => ({
            id:
                `plot_${index + 1}`,

            /*
             * Plot 1 mở sẵn.
             *
             * Plot 2–6 khóa.
             * Sau này mở bằng Diamond.
             */
            status:
                'empty',
        })
    );
}

/*
 * =========================================================
 * INITIAL ORCHARD
 * =========================================================
 *
 * Vườn bắt đầu với 4 vị trí.
 *
 * Plot 1 mở.
 * Plot 2-4 khóa và có thể mở rộng sau.
 * =========================================================
 */

function createInitialOrchardPlots():
    OrchardPlotState[] {
    return Array.from(
        {
            length:
                4,
        },

        (
            _,
            index
        ) => ({
            id:
                `orchard_${index + 1}`,

            status:
                'empty',

            mature:
                false,

            harvestCount:
                0,
        })
    );
}

/*
 * =========================================================
 * CREATE NEW GAME
 * =========================================================
 *
 * Dùng function thay vì export một object cố định.
 *
 * Quan trọng:
 * mỗi new game phải nhận state hoàn toàn mới,
 * tránh chia sẻ reference của inventory / plots.
 * =========================================================
 */

export function createInitialFarmGameState():
    FarmGameState {
    return {
        gold:
            9_999_999,

        diamonds:
            99_999,

        ownedFarmCosmeticIds:
            FARM_COSMETICS.map(
                item => item.id
            ),

        equippedFarmCosmetics:
            {
                chicken: {
                    avatar:
                        'chicken_avatar_golden_dragon',

                },

                cow: {
                    avatar:
                        'cow_avatar_celestial_unicorn',
                },

                cow_barn: {
                    barn_set:
                        'cow_barn_japanese',

                    barn_roof:
                        'barn_roof_dragon_statue',

                    barn_light:
                        'barn_lights_warm_bulbs',

                    centerpiece:
                        'cow_centerpiece_dragon',
                },
            },

        farmXp:
            9_999_999,

        farmLevel:
            FARM_GAME_CONFIG
                .maxFarmLevelV1,

        keys:
            999,
        warehouseLevel:
            10,

        inventory: [
            {
                itemId:
                    'seed_wheat',

                quantity:
                    FARM_GAME_CONFIG
                        .initialWheatSeedCount,
            },
        ],

        plots:
            createInitialPlots(),

        /*
         * Animal area chưa mở ở đầu game.
         *
         * Khi người chơi mở Chicken Coop,
         * slot sẽ được thêm bởi Animal/Building Engine.
         */
        animalSlots:
            [
                { id: 'chicken_slot_1', animalId: 'chicken', status: 'idle' },
                { id: 'chicken_slot_2', animalId: 'chicken', status: 'idle' },
                { id: 'chicken_slot_3', animalId: 'chicken', status: 'idle' },
                { id: 'cow_slot_1', animalId: 'cow', status: 'idle' },
                { id: 'cow_slot_2', animalId: 'cow', status: 'idle' },
                { id: 'cow_slot_3', animalId: 'cow', status: 'idle' },
            ],
        buildings:
            [],
        productionSlots:
            [],

        unlockedLandIds:
            [],

        orchardPlots:
            createInitialOrchardPlots(),
    };
} 
