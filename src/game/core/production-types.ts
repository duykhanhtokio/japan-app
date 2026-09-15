import type {
    BuildingType,
} from './building-types';

import type {
    GameItemId,
    RecipeId,
} from './game-types';

/*
 * =========================================================
 * PRODUCTION RECIPE
 * =========================================================
 */

export type ProductionRecipeIngredient = {
    itemId:
    GameItemId;

    quantity:
    number;
};

export type ProductionRecipeDefinition = {
    id:
    RecipeId;

    /*
     * Recipe này phải chạy trong building nào.
     *
     * Ví dụ:
     * feed_mill
     * dairy
     * pizza_shop
     */
    productionType:
    BuildingType;

    /*
     * Nguyên liệu bị tiêu thụ khi bắt đầu production.
     */
    inputs:
    readonly ProductionRecipeIngredient[];

    /*
     * V1 hỗ trợ một output chính.
     *
     * Sau này có thể mở rộng thành outputs[]
     * nếu cần by-product.
     */
    outputItemId:
    GameItemId;

    outputQuantity:
    number;

    productionTimeSeconds:
    number;

    unlockFarmLevel:
    number;

    /*
     * XP nhận khi collect thành phẩm.
     */
    collectXp:
    number;
};

/*
 * =========================================================
 * PRODUCTION SLOT
 * =========================================================
 */

export type ProductionSlotStatus =
    | 'idle'
    | 'producing'
    | 'ready';

export type ProductionSlotState = {
    id:
    string;

    /*
     * Building/type mà slot thuộc về.
     *
     * Ví dụ:
     * feed_mill
     * dairy
     * pizza_shop
     */
    productionType:
    BuildingType;

    status:
    ProductionSlotStatus;

    recipeId?:
    RecipeId;

    productionStartedAt?:
    number;

    readyAt?:
    number;
};