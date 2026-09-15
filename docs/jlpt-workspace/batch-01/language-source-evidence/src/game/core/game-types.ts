import type {
    EquippedFarmCosmetics,
} from './farm-progression-types';

import type {
    ProductionCycleState,
} from '../care/care-types';

import type {
    BuildingState,
} from './building-types';

import type {
    ProductionSlotState,
} from './production-types';

import type {
    OrchardPlotState,
} from './orchard-types';

/*
 * =========================================================
 * GAME CORE TYPES
 * =========================================================
 *
 * Đây là schema nền của toàn bộ game ecosystem:
 *
 * Farm
 * → Market
 * → Processing
 * → Pizza
 * → Burger
 * → Cafe
 * → ...
 *
 * Không chứa React / UI.
 * =========================================================
 */

export type GameEntityId =
    string;

export type GameItemId =
    string;

export type CropId =
    string;

export type AnimalId =
    string;

export type BuildingId =
    string;

export type RecipeId =
    string;

/*
 * =========================================================
 * LANGUAGE CONTENT
 * =========================================================
 *
 * Mọi text quan trọng trong game đều có metadata
 * để Language Assistance Engine xử lý sau này.
 * =========================================================
 */

export type GameLanguageContent = {
    /*
     * Japanese hiển thị chính.
     *
     * Ví dụ:
     * 収穫する
     */
    textJa:
    string;

    /*
     * Cách đọc.
     *
     * Ví dụ:
     * しゅうかくする
     */
    readingJa?:
    string;

    /*
     * Key dùng cho hệ thống dịch.
     *
     * Không hard-code tiếng Việt vào game data.
     *
     * Ví dụ:
     * game.actions.harvest
     */
    translationKey:
    string;

    /*
     * Liên kết với vocabulary database.
     *
     * Có thể rỗng trong giai đoạn đầu.
     */
    vocabularyIds:
    string[];
};

/*
 * =========================================================
 * ITEM
 * =========================================================
 */

export type GameItemCategory =
    | 'seed'
    | 'crop'
    | 'animal_product'
    | 'feed'
    | 'fertilizer'
    | 'tool'
    | 'material'
    | 'processed_food'
    | 'booster'
    | 'special';

export type GameItemDefinition = {
    id:
    GameItemId;

    category:
    GameItemCategory;

    name:
    GameLanguageContent;

    /*
     * Giá bán cơ bản.
     *
     * 0 nghĩa là item không được bán trực tiếp.
     */
    baseSellPrice:
    number;

    /*
     * Giá mua từ shop.
     *
     * undefined = không mua trực tiếp được.
     */
    shopPrice?:
    number;

    /*
     * Level Farm cần để item xuất hiện.
     */
    unlockFarmLevel:
    number;

    /*
     * Có thể stack trong inventory.
     */
    stackable:
    boolean;

    /*
     * Giới hạn một stack.
     *
     * undefined = dùng default inventory limit.
     */
    maxStack?:
    number;
};

/*
 * =========================================================
 * CROP
 * =========================================================
 */

export type CropDefinition = {
    id:
    CropId;

    /*
     * Hạt giống dùng để trồng.
     */
    seedItemId:
    GameItemId;

    /*
     * Vật phẩm nhận được khi thu hoạch.
     */
    harvestItemId:
    GameItemId;

    name:
    GameLanguageContent;

    unlockFarmLevel:
    number;

    /*
     * Thời gian sinh trưởng thực tế.
     *
     * Engine dùng timestamp,
     * không chạy timer liên tục background.
     */
    growTimeSeconds:
    number;

    /*
     * Sản lượng cơ bản / plot.
     */
    yieldAmount:
    number;

    /*
     * XP nhận được khi thu hoạch.
     */
    harvestXp:
    number;

    /*
     * Số stage hình ảnh.
     *
     * Ví dụ:
     * planted
     * sprout
     * growing
     * mature
     * ready
     */
    growthStages:
    number;
};

/*
 * =========================================================
 * ANIMAL
 * =========================================================
 */

export type AnimalDefinition = {
    id:
    AnimalId;

    name:
    GameLanguageContent;

    /*
     * =====================================================
     * FEED
     * =====================================================
     *
     * V1:
     * feedItemId + feedAmount được lấy từ inventory.
     *
     * Animal Care V2:
     * Hai field này vẫn là metadata để xác định
     * loại thức ăn và chi phí tương ứng.
     *
     * Engine V2 sau này sẽ có thể mua/consume
     * trực tiếp bằng Gold thay vì bắt buộc lưu feed
     * trong warehouse.
     * =====================================================
     */

    feedItemId:
    GameItemId;

    feedAmount:
    number;

    /*
     * =====================================================
     * PRODUCT
     * =====================================================
     *
     * Chicken → Egg
     * Cow → Milk
     * Sheep → Wool
     *
     * Animal V2:
     * collect sẽ auto-sell:
     *
     * productItem.baseSellPrice
     * × productAmount
     * → Gold
     *
     * Không cần đưa animal product vào warehouse.
     * =====================================================
     */

    productItemId:
    GameItemId;

    productAmount:
    number;

    /*
     * Tổng thời gian của một production cycle.
     */
    productionTimeSeconds:
    number;

    /*
     * Farm Level mở khóa animal.
     */
    unlockFarmLevel:
    number;

    /*
     * XP khi collect sản phẩm.
     */
    collectXp:
    number;
};

/*
 * =========================================================
 * ANIMAL SLOT — CARE V2
 * =========================================================
 *
 * Mỗi con vật / slot có production cycle riêng.
 *
 * Ví dụ:
 *
 * chicken_1
 *
 * idle
 *   ↓
 * producing
 *   ↓
 * feed / drink checkpoints
 *   ↓
 * care_required
 *   ↓
 * ready
 *   ↓
 * collect
 *   ↓
 * Gold + XP
 *
 * ProductionCycleState được dùng chung với FarmPlotState.
 *
 * Điều này cho phép:
 *
 * - mỗi animal có timer riêng
 * - feed checkpoint riêng
 * - drink checkpoint riêng
 * - pause khi bỏ quên chăm sóc
 * - normal care
 * - boost care
 * - ad care
 * =========================================================
 */

export type AnimalSlotStatus =
    | 'idle'
    | 'producing'
    | 'ready';

export type AnimalSlotState = {
    id:
    string;

    animalId:
    AnimalId;

    status:
    AnimalSlotStatus;

    /*
     * =====================================================
     * CARE V2 PRODUCTION
     * =====================================================
     *
     * Đây sẽ là nguồn dữ liệu production chính
     * của Animal Care V2.
     *
     * Cùng schema với crop:
     *
     * startedAt
     * readyAt
     * status
     * careRequirements[]
     * pausedAt
     * =====================================================
     */

    production?:
    ProductionCycleState;

    /*
     * =====================================================
     * LEGACY V1 COMPATIBILITY
     * =====================================================
     *
     * Tạm thời giữ lại hai field này.
     *
     * Lý do:
     *
     * - animal-engine V1 hiện vẫn sử dụng
     * - các test cũ vẫn sử dụng
     * - save cũ có thể vẫn chứa dữ liệu này
     *
     * Khi migration Animal Care V2 hoàn tất
     * và toàn bộ test cũ đã chuyển xong,
     * có thể xóa chúng.
     * =====================================================
     */

    productionStartedAt?:
    number;

    readyAt?:
    number;
};

/*
 * =========================================================
 * INVENTORY
 * =========================================================
 *
 * Inventory vẫn tồn tại vì các hệ thống khác như:
 *
 * - Processing
 * - Recipe
 * - Building
 * - Material
 *
 * vẫn có thể cần item thật.
 *
 * Nhưng crop/animal harvest V2 không bắt buộc
 * phải đưa sản phẩm vào inventory.
 * =========================================================
 */

export type InventoryEntry = {
    itemId:
    GameItemId;

    quantity:
    number;
};

/*
 * =========================================================
 * FARM PLOT — CARE V2
 * =========================================================
 */

export type FarmPlotStatus =
    | 'locked'
    | 'empty'
    | 'growing'
    | 'ready'
    | 'cleanup_required'
    | 'fertilizer_required';

export type FarmPlotState = {
    id:
    string;

    status:
    FarmPlotStatus;

    cropId?:
    CropId;

    /*
     * Production cycle riêng của từng plot.
     */
    production?:
    ProductionCycleState;

    /*
     * =====================================================
     * LEGACY / DEBUG TIMESTAMPS
     * =====================================================
     *
     * ProductionCycleState là nguồn dữ liệu chính.
     *
     * Hai field dưới vẫn được giữ để:
     *
     * - debug
     * - migration save
     * - compatibility
     * =====================================================
     */

    plantedAt?:
    number;

    readyAt?:
    number;
};

/*
 * =========================================================
 * PLAYER FARM STATE
 * =========================================================
 */

export type FarmGameState = {
    /*
     * =====================================================
     * PLAYER ECONOMY
     * =====================================================
     */

    gold:
    number;

    diamonds:
    number;

    ownedFarmCosmeticIds:
    string[];

    equippedFarmCosmetics:
    EquippedFarmCosmetics;

    farmXp:
    number;

    farmLevel:
    number;

    keys:
    number;

    /*
     * =====================================================
     * WAREHOUSE
     * =====================================================
     *
     * Warehouse vẫn được giữ trong core vì Processing,
     * Building và các hệ thống item khác vẫn có thể cần.
     *
     * Crop/Animal harvest V2 không còn phụ thuộc
     * warehouse capacity.
     * =====================================================
     */

    warehouseLevel:
    number;

    inventory:
    InventoryEntry[];

    /*
     * =====================================================
     * FARM / SHORT CROPS
     * =====================================================
     */

    plots:
    FarmPlotState[];

    unlockedLandIds:
    string[];

    /*
     * =====================================================
     * ORCHARD
     * =====================================================
     *
     * Vườn cây ăn quả dùng state riêng.
     *
     * Không dùng FarmPlotState vì cây ăn quả
     * tồn tại sau mỗi lần thu hoạch.
     * =====================================================
     */

    orchardPlots:
    OrchardPlotState[];

    /*
     * =====================================================
     * ANIMAL FARM
     * =====================================================
     *
     * Chicken / Cow / Sheep...
     *
     * Mỗi animal slot có production cycle riêng.
     * =====================================================
     */

    animalSlots:
    AnimalSlotState[];

    /*
     * =====================================================
     * BUILDINGS
     * =====================================================
     */

    buildings:
    BuildingState[];

    /*
     * =====================================================
     * PRODUCTION
     * =====================================================
     *
     * Feed Mill / Dairy / Bakery / Pizza...
     * đều sử dụng chung production slots.
     * =====================================================
     */

    productionSlots:
    ProductionSlotState[];
};