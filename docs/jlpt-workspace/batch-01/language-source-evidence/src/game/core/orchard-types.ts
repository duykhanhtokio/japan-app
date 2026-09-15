import type {
    CropId,
    GameItemId,
    GameLanguageContent,
} from './game-types';

/*
 * =========================================================
 * ORCHARD
 * =========================================================
 *
 * Orchard khác Farm Plot:
 *
 * Farm Plot:
 * seed -> grow -> harvest -> empty
 *
 * Orchard:
 * sapling -> grow tree -> fruit cycle -> harvest
 *         -> fruit cycle -> harvest
 *         -> ...
 *
 * Cây không biến mất sau khi thu hoạch.
 * =========================================================
 */

export type OrchardTreeId =
    CropId;

export type OrchardTreeDefinition = {
    id:
        OrchardTreeId;

    saplingItemId:
        GameItemId;

    fruitItemId:
        GameItemId;

    name:
        GameLanguageContent;

    unlockFarmLevel:
        number;

    /*
     * Thời gian từ cây non đến trưởng thành.
     */
    initialGrowTimeSeconds:
        number;

    /*
     * Thời gian ra quả cho mỗi cycle
     * sau khi cây đã trưởng thành.
     */
    fruitCycleTimeSeconds:
        number;

    /*
     * Sản lượng mỗi lần thu hoạch.
     */
    yieldAmount:
        number;

    harvestXp:
        number;

    growthStages:
        number;
};

export type OrchardPlotStatus =
    | 'locked'
    | 'empty'
    | 'growing'
    | 'producing'
    | 'ready';

export type OrchardPlotState = {
    id:
        string;

    status:
        OrchardPlotStatus;

    treeId?:
        OrchardTreeId;

    /*
     * Chỉ set khi cây được trồng lần đầu.
     */
    plantedAt?:
        number;

    /*
     * Timestamp hoàn thành phase hiện tại.
     *
     * growing:
     * cây trưởng thành tại readyAt.
     *
     * producing:
     * quả chín tại readyAt.
     */
    readyAt?:
        number;

    /*
     * Đánh dấu cây đã trưởng thành.
     *
     * Sau harvest cây vẫn tồn tại.
     */
    mature:
        boolean;

    /*
     * Tổng số lần đã thu hoạch cây này.
     */
    harvestCount:
        number;
};
