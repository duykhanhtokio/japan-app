import type {
    RecipeId,
} from '../core/game-types';

import type {
    ProductionRecipeDefinition,
} from '../core/production-types';

/*
 * =========================================================
 * PRODUCTION RECIPES
 * =========================================================
 *
 * Feed Mill V1.
 *
 * Sau này cùng engine này sẽ dùng cho:
 *
 * → Cow Feed
 * → Sheep Feed
 * → Flour
 * → Cheese
 * → Tomato Sauce
 * → Pizza
 * =========================================================
 */

export const PRODUCTION_RECIPES:
    readonly ProductionRecipeDefinition[] = [
        {
            id:
                'feed_chicken_basic',

            /*
             * Recipe này chỉ được chạy
             * trong Feed Mill.
             */
            productionType:
                'feed_mill',

            inputs: [
                {
                    itemId:
                        'crop_wheat',

                    quantity:
                        2,
                },

                {
                    itemId:
                        'crop_corn',

                    quantity:
                        1,
                },
            ],

            outputItemId:
                'feed_chicken',

            outputQuantity:
                2,

            productionTimeSeconds:
                5 * 60,

            /*
             * Feed Mill mở ở Farm Lv13.
             *
             * Trước Lv13 người chơi vẫn có thể
             * mua Chicken Feed từ shop.
             */
            unlockFarmLevel:
                13,

            collectXp:
                4,
        },
    ];

/*
 * =========================================================
 * LOOKUP
 * =========================================================
 */

export const PRODUCTION_RECIPE_BY_ID =
    new Map<
        RecipeId,
        ProductionRecipeDefinition
    >(
        PRODUCTION_RECIPES.map(
            recipe => [
                recipe.id,
                recipe,
            ]
        )
    );

export function getProductionRecipe(
    recipeId:
        RecipeId
): ProductionRecipeDefinition | undefined {
    return PRODUCTION_RECIPE_BY_ID.get(
        recipeId
    );
}
