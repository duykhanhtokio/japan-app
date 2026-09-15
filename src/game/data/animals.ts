import type {
    AnimalDefinition,
    AnimalId,
} from '../core/game-types';

/*
 * =========================================================
 * ANIMAL DEFINITIONS
 * =========================================================
 *
 * Production progression V2:
 *
 * Chicken
 * Lv2
 * 5 min → Egg
 *
 * Cow
 * Lv10
 * 20 min → Milk
 *
 *

 * Animal Engine dùng chung cho tất cả species.
 * =========================================================
 */

export const ANIMALS:
    readonly AnimalDefinition[] = [
        {
            id:
                'chicken',

            name: {
                textJa:
                    '鶏',

                readingJa:
                    'にわとり',

                translationKey:
                    'game.animals.chicken',

                vocabularyIds:
                    [],
            },

            feedItemId:
                'feed_chicken',

            feedAmount:
                1,

            productItemId:
                'product_egg',

            productAmount:
                1,

            productionTimeSeconds:
                5 * 60,

            unlockFarmLevel:
                2,

            collectXp:
                3,
        },

        {
            id:
                'cow',

            name: {
                textJa:
                    '牛',

                readingJa:
                    'うし',

                translationKey:
                    'game.animals.cow',

                vocabularyIds:
                    [],
            },

            feedItemId:
                'feed_cow',

            feedAmount:
                1,

            productItemId:
                'product_milk',

            productAmount:
                1,

            productionTimeSeconds:
                20 * 60,

            unlockFarmLevel:
                10,

            collectXp:
                12,
        },

    ];

/*
 * =========================================================
 * LOOKUP
 * =========================================================
 */

export function getAnimal(
    animalId:
        AnimalId
): AnimalDefinition | undefined {
    return ANIMALS.find(
        animal =>
            animal.id ===
            animalId
    );
}