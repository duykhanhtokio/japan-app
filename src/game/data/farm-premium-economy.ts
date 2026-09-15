export const FARM_PREMIUM_ECONOMY = {
    goldenKeyPriceYen: 2000,

    goldPerYen: 10,

    diamondYenPerUnit: 10,

    minimumGoldPack: {
        yen: 300,
        amount: 3000,
    },

    minimumDiamondPack: {
        yen: 500,
        amount: 50,
    },
} as const;

export const FARM_GOLD_PACKS = [
    { yen: 300, amount: 3000 },
    { yen: 500, amount: 5000 },
    { yen: 1000, amount: 10000 },
    { yen: 3000, amount: 30000 },
    { yen: 5000, amount: 50000 },
    { yen: 10000, amount: 100000 },
] as const;

export const FARM_DIAMOND_PACKS = [
    { yen: 500, amount: 50 },
    { yen: 1000, amount: 100 },
    { yen: 3000, amount: 300 },
    { yen: 5000, amount: 500 },
    { yen: 10000, amount: 1000 },
] as const;
