export type FarmMapId =
    | 'vegetable'
    | 'orchard'
    | 'chicken'
    | 'cow'
    | 'restaurant';

export type FarmCosmeticTarget =
    | 'chicken'
    | 'cow'
    | 'chicken_barn'
    | 'cow_barn'
    | 'farm';

export type FarmCosmeticSlot =
    | 'avatar'
    | 'color'
    | 'face'
    | 'head'
    | 'effect'
    | 'barn_set'
    | 'barn_roof'
    | 'barn_light'
    | 'centerpiece'
    | 'environment';

export type FarmCosmeticRarity =
    | 'common'
    | 'uncommon'
    | 'rare'
    | 'epic'
    | 'legendary'
    | 'mythic';

export type FarmCosmeticCurrency =
    | 'gold'
    | 'diamond';

export type FarmCosmeticAvailability =
    | 'standard'
    | 'seasonal'
    | 'collection';

export type EquippedFarmCosmetics =
    Partial<
        Record<
            FarmCosmeticTarget,
            Partial<
                Record<
                    FarmCosmeticSlot,
                    string
                >
            >
        >
    >;
