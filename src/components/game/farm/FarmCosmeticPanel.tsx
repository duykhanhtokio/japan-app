import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    useMemo,
    useState,
} from 'react';

import FarmCosmeticPreview from './FarmCosmeticPreview';

import type {
    FarmGameState,
} from '@/game/core/game-types';

import type {
    FarmCosmeticTarget,
    FarmMapId,
} from '@/game/core/farm-progression-types';

import {
    FARM_COSMETICS,
    type FarmCosmeticDefinition,
} from '@/game/data/farm-cosmetics';

import {
    getFarmAreaUnlockLevel,
    isFarmAreaUnlocked,
    type FarmAreaUnlockId,
} from '@/game/data/farm-area-unlocks';

type CosmeticFilter =
    | 'all'
    | 'chicken'
    | 'cow'
    | 'building'
    | 'farm';

type Props = {
    visible:
        boolean;

    state:
        FarmGameState;

    onClose:
        () => void;

    onBuy:
        (
            cosmeticId:
                string
        ) => void;

    onEquip:
        (
            cosmeticId:
                string
        ) => void;

    onUnequip:
        (
            cosmeticId:
                string
        ) => void;
};

type FilterDefinition = {
    id:
        CosmeticFilter;

    label:
        string;
};

const FILTERS:
    readonly FilterDefinition[] = [
        {
            id:
                'all',
            label:
                'すべて',
        },
        {
            id:
                'chicken',
            label:
                'ニワトリ',
        },
        {
            id:
                'cow',
            label:
                'ウシ',
        },
        {
            id:
                'building',
            label:
                '建物',
        },
        {
            id:
                'farm',
            label:
                'ファーム',
        },
    ];

const TARGET_LABELS:
    Record<FarmCosmeticTarget, string> = {
        chicken:
            'ニワトリ',

        cow:
            'ウシ',

        chicken_barn:
            '鶏小屋',

        cow_barn:
            '牛小屋',

        farm:
            'ファーム',
    };

const SLOT_LABELS:
    Record<
        FarmCosmeticDefinition['slot'],
        string
    > = {
        avatar:
            'アバター',

        color:
            'カラー',

        face:
            '顔',

        head:
            '頭',

        effect:
            'エフェクト',

        barn_set:
            '小屋セット',

        barn_roof:
            '屋根',

        barn_light:
            'ライト',

        centerpiece:
            '中央装飾',

        environment:
            '環境',
    };

const RARITY_LABELS:
    Record<
        FarmCosmeticDefinition['rarity'],
        string
    > = {
        common:
            'COMMON',

        uncommon:
            'UNCOMMON',

        rare:
            'RARE',

        epic:
            'EPIC',

        legendary:
            'LEGENDARY',

        mythic:
            'MYTHIC',
    };

const RARITY_COLORS:
    Record<
        FarmCosmeticDefinition['rarity'],
        string
    > = {
        common:
            '#78909C',

        uncommon:
            '#43A047',

        rare:
            '#1E88E5',

        epic:
            '#8E24AA',

        legendary:
            '#F39C12',

        mythic:
            '#E53935',
    };

const MAP_LABELS:
    Record<FarmMapId, string> = {
        vegetable:
            '畑',

        orchard:
            '果樹園',

        chicken:
            '鶏小屋',

        cow:
            '牛小屋',

        restaurant:
            'レストラン',
    };

function toUnlockArea(
    mapId:
        FarmMapId
): FarmAreaUnlockId {
    if (
        mapId ===
        'vegetable'
    ) {
        return 'vegetable';
    }

    return mapId;
}

function isMatchingFilter(
    target:
        FarmCosmeticTarget,
    filter:
        CosmeticFilter
) {
    if (
        filter ===
        'all'
    ) {
        return true;
    }

    if (
        filter ===
        'chicken'
    ) {
        return (
            target ===
                'chicken' ||
            target ===
                'chicken_barn'
        );
    }

    if (
        filter ===
        'cow'
    ) {
        return (
            target ===
                'cow' ||
            target ===
                'cow_barn'
        );
    }

    if (
        filter ===
        'building'
    ) {
        return (
            target ===
                'chicken_barn' ||
            target ===
                'cow_barn'
        );
    }

    return (
        target ===
        'farm'
    );
}

function getCosmeticIcon(
    item:
        FarmCosmeticDefinition
) {
    if (
        item.target ===
        'chicken'
    ) {
        return '🐔';
    }

    if (
        item.target ===
        'cow'
    ) {
        return '🐮';
    }

    if (
        item.target ===
            'chicken_barn' ||
        item.target ===
            'cow_barn'
    ) {
        return '🏠';
    }

    return '🌳';
}

export default function FarmCosmeticPanel({
    visible,
    state,
    onClose,
    onBuy,
    onEquip,
    onUnequip,
}: Props) {
    const [
        selectedFilter,
        setSelectedFilter,
    ] =
        useState<CosmeticFilter>(
            'all'
        );

    const [
        previewTarget,
        setPreviewTarget,
    ] =
        useState<FarmCosmeticTarget>(
            'chicken'
        );

    const filteredItems =
        useMemo(
            () =>
                FARM_COSMETICS.filter(
                    item =>
                        isMatchingFilter(
                            item.target,
                            selectedFilter
                        )
                ),
            [
                selectedFilter,
            ]
        );

    function renderItem({
        item,
    }: {
        item:
            FarmCosmeticDefinition;
    }) {
        const unlockArea =
            item.requiredMapId
                ? toUnlockArea(
                      item.requiredMapId
                  )
                : null;

        const locked =
            unlockArea !==
                null &&
            !isFarmAreaUnlocked(
                unlockArea,
                state.farmLevel
            );

        const unlockLevel =
            unlockArea
                ? getFarmAreaUnlockLevel(
                      unlockArea
                  )
                : null;

        const owned =
            state.ownedFarmCosmeticIds
                .includes(
                    item.id
                );

        const equipped =
            state.equippedFarmCosmetics[
                item.target
            ]?.[
                item.slot
            ] ===
            item.id;

        const canAfford =
            item.currency ===
            'gold'
                ? state.gold >=
                  item.price
                : state.diamonds >=
                  item.price;

        return (
            <View
                style={[
                    styles.card,

                    equipped &&
                        styles.cardEquipped,

                    locked &&
                        styles.cardLocked,
                ]}
            >
                <View
                    style={
                        styles.preview
                    }
                >
                    <Text
                        style={
                            styles.previewIcon
                        }
                    >
                        {locked
                            ? '🔒'
                            : getCosmeticIcon(
                                  item
                              )}
                    </Text>
                </View>

                <View
                    style={
                        styles.itemContent
                    }
                >
                    <Text
                        numberOfLines={
                            1
                        }
                        style={
                            styles.itemName
                        }
                    >
                        {item.nameJa}
                    </Text>

                    <Text
                        style={
                            styles.itemMeta
                        }
                    >
                        {
                            TARGET_LABELS[
                                item.target
                            ]
                        }
                        {' · '}
                        {
                            SLOT_LABELS[
                                item.slot
                            ]
                        }
                    </Text>

                    <View
                        style={
                            styles.itemBottom
                        }
                    >
                        <View
                            style={[
                                styles.rarityBadge,
                                {
                                    backgroundColor:
                                        RARITY_COLORS[
                                            item.rarity
                                        ],
                                },
                            ]}
                        >
                            <Text
                                style={
                                    styles.rarityText
                                }
                            >
                                {
                                    RARITY_LABELS[
                                        item.rarity
                                    ]
                                }
                            </Text>
                        </View>

                        <View
                            style={
                                styles.purchaseArea
                            }
                        >
                            <Text
                                style={
                                    styles.price
                                }
                            >
                                {item.currency ===
                                'gold'
                                    ? '🪙'
                                    : '💎'}{' '}
                                {item.price}
                            </Text>

                            {owned ? (
                                <Pressable
                                    onPress={() => {
                                        setPreviewTarget(
                                            item.target
                                        );

                                        if (
                                            equipped
                                        ) {
                                            onUnequip(
                                                item.id
                                            );

                                            return;
                                        }

                                        onEquip(
                                            item.id
                                        );
                                    }}
                                    style={[
                                        styles.buyButton,

                                        equipped &&
                                            styles.equippedButton,
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.buyButtonText
                                        }
                                    >
                                        {equipped
                                            ? '装備中・外す'
                                            : '装備する'}
                                    </Text>
                                </Pressable>
                            ) : (
                                <Pressable
                                    disabled={
                                        locked ||
                                        !canAfford
                                    }
                                    onPress={() =>
                                        onBuy(
                                            item.id
                                        )
                                    }
                                    style={[
                                        styles.buyButton,

                                        (
                                            locked ||
                                            !canAfford
                                        ) &&
                                            styles.buyButtonDisabled,
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.buyButtonText
                                        }
                                    >
                                        {!canAfford
                                            ? '残高不足'
                                            : '購入する'}
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    </View>

                    {locked &&
                        item.requiredMapId &&
                        unlockLevel !==
                            null && (
                            <Text
                                style={
                                    styles.lockReason
                                }
                            >
                                {
                                    MAP_LABELS[
                                        item
                                            .requiredMapId
                                    ]
                                }{' '}
                                · Lv.
                                {
                                    unlockLevel
                                }で解放
                            </Text>
                        )}
                </View>
            </View>
        );
    }

    return (
        <Modal
            visible={
                visible
            }
            transparent
            animationType="fade"
            onRequestClose={
                onClose
            }
        >
            <View
                style={
                    styles.overlay
                }
            >
                <View
                    style={
                        styles.panel
                    }
                >
                    <View
                        style={
                            styles.header
                        }
                    >
                        <View>
                            <Text
                                style={
                                    styles.title
                                }
                            >
                                ファームコスメ
                            </Text>

                            <Text
                                style={
                                    styles.subtitle
                                }
                            >
                                全{
                                    FARM_COSMETICS.length
                                }種類
                            </Text>
                        </View>

                        <Pressable
                            onPress={
                                onClose
                            }
                            style={
                                styles.closeButton
                            }
                        >
                            <Text
                                style={
                                    styles.closeText
                                }
                            >
                                ×
                            </Text>
                        </Pressable>
                    </View>

                    <FarmCosmeticPreview
                        target={
                            previewTarget
                        }
                        equipped={
                            state
                                .equippedFarmCosmetics
                        }
                    />

                    <View
                        style={
                            styles.filterRow
                        }
                    >
                        {FILTERS.map(
                            filter => {
                                const selected =
                                    filter.id ===
                                    selectedFilter;

                                return (
                                    <Pressable
                                        key={
                                            filter.id
                                        }
                                        onPress={() => {
                                            setSelectedFilter(
                                                filter.id
                                            );

                                            if (
                                                filter.id ===
                                                'cow'
                                            ) {
                                                setPreviewTarget(
                                                    'cow'
                                                );

                                                return;
                                            }

                                            if (
                                                filter.id ===
                                                'building'
                                            ) {
                                                setPreviewTarget(
                                                    'chicken_barn'
                                                );

                                                return;
                                            }

                                            if (
                                                filter.id ===
                                                'farm'
                                            ) {
                                                setPreviewTarget(
                                                    'farm'
                                                );

                                                return;
                                            }

                                            setPreviewTarget(
                                                'chicken'
                                            );
                                        }}
                                        style={[
                                            styles.filterButton,

                                            selected &&
                                                styles.filterButtonSelected,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.filterText,

                                                selected &&
                                                    styles.filterTextSelected,
                                            ]}
                                        >
                                            {
                                                filter.label
                                            }
                                        </Text>
                                    </Pressable>
                                );
                            }
                        )}
                    </View>

                    <View
                        style={
                            styles.balanceBar
                        }
                    >
                        <Text
                            style={
                                styles.balanceText
                            }
                        >
                            🪙 {state.gold}
                        </Text>

                        <Text
                            style={
                                styles.balanceText
                            }
                        >
                            💎 {state.diamonds}
                        </Text>
                    </View>

                    <Text
                        style={
                            styles.resultCount
                        }
                    >
                        {
                            filteredItems.length
                        }
                        件
                    </Text>

                    <FlatList
                        data={
                            filteredItems
                        }
                        keyExtractor={
                            item =>
                                item.id
                        }
                        renderItem={
                            renderItem
                        }
                        contentContainerStyle={
                            styles.list
                        }
                        showsVerticalScrollIndicator={
                            false
                        }
                    />

                    <Text
                        style={
                            styles.notice
                        }
                    >
                        同じスロットに装備すると自動で入れ替わります
                    </Text>
                </View>
            </View>
        </Modal>
    );
}

const styles =
    StyleSheet.create({
        overlay: {
            flex:
                1,

            justifyContent:
                'center',

            paddingHorizontal:
                14,

            paddingVertical:
                42,

            backgroundColor:
                'rgba(25, 17, 10, 0.68)',
        },

        panel: {
            flex:
                1,

            maxHeight:
                720,

            overflow:
                'hidden',

            borderRadius:
                24,

            borderWidth:
                3,

            borderColor:
                '#8B5A2B',

            backgroundColor:
                '#FFF8E8',
        },

        header: {
            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'space-between',

            paddingHorizontal:
                18,

            paddingVertical:
                14,

            backgroundColor:
                '#F1C96B',

            borderBottomWidth:
                2,

            borderBottomColor:
                '#C68A35',
        },

        title: {
            color:
                '#563619',

            fontSize:
                21,

            fontWeight:
                '900',
        },

        subtitle: {
            marginTop:
                2,

            color:
                '#7B5834',

            fontSize:
                12,

            fontWeight:
                '700',
        },

        closeButton: {
            width:
                38,

            height:
                38,

            alignItems:
                'center',

            justifyContent:
                'center',

            borderRadius:
                19,

            backgroundColor:
                '#8B5A2B',
        },

        closeText: {
            color:
                '#FFFFFF',

            fontSize:
                25,

            fontWeight:
                '900',

            lineHeight:
                28,
        },

        filterRow: {
            flexDirection:
                'row',

            gap:
                6,

            paddingHorizontal:
                10,

            paddingTop:
                10,
        },

        filterButton: {
            flex:
                1,

            minHeight:
                34,

            alignItems:
                'center',

            justifyContent:
                'center',

            paddingHorizontal:
                3,

            borderRadius:
                10,

            borderWidth:
                1,

            borderColor:
                '#D7B77B',

            backgroundColor:
                '#FFFDF7',
        },

        filterButtonSelected: {
            borderColor:
                '#7B4C21',

            backgroundColor:
                '#8B5A2B',
        },

        filterText: {
            color:
                '#745331',

            fontSize:
                10,

            fontWeight:
                '800',
        },

        filterTextSelected: {
            color:
                '#FFFFFF',
        },

        balanceBar: {
            flexDirection:
                'row',

            justifyContent:
                'flex-end',

            gap:
                14,

            paddingHorizontal:
                14,

            paddingTop:
                9,
        },

        balanceText: {
            color:
                '#5B421F',

            fontSize:
                13,

            fontWeight:
                '900',
        },

        purchaseArea: {
            flexDirection:
                'row',

            alignItems:
                'center',

            gap:
                7,
        },

        buyButton: {
            minWidth:
                68,

            alignItems:
                'center',

            paddingHorizontal:
                8,

            paddingVertical:
                6,

            borderRadius:
                9,

            backgroundColor:
                '#E8942E',
        },

        equippedButton: {
            backgroundColor:
                '#35A853',
        },

        buyButtonDisabled: {
            backgroundColor:
                '#A9A39A',
        },

        buyButtonText: {
            color:
                '#FFFFFF',

            fontSize:
                9,

            fontWeight:
                '900',
        },

        resultCount: {
            paddingHorizontal:
                14,

            paddingTop:
                9,

            paddingBottom:
                3,

            color:
                '#816342',

            fontSize:
                11,

            fontWeight:
                '700',
        },

        list: {
            gap:
                9,

            paddingHorizontal:
                10,

            paddingTop:
                5,

            paddingBottom:
                16,
        },

        card: {
            minHeight:
                96,

            flexDirection:
                'row',

            padding:
                10,

            borderRadius:
                16,

            borderWidth:
                2,

            borderColor:
                '#E2C38A',

            backgroundColor:
                '#FFFFFF',
        },

        cardEquipped: {
            borderColor:
                '#36A852',

            borderWidth:
                3,

            backgroundColor:
                '#F1FFF0',
        },

        cardLocked: {
            opacity:
                0.52,

            backgroundColor:
                '#E8E3D9',
        },

        preview: {
            width:
                70,

            height:
                70,

            alignItems:
                'center',

            justifyContent:
                'center',

            alignSelf:
                'center',

            borderRadius:
                14,

            backgroundColor:
                '#F6E9C9',
        },

        previewIcon: {
            fontSize:
                35,
        },

        itemContent: {
            flex:
                1,

            minWidth:
                0,

            justifyContent:
                'center',

            marginLeft:
                11,
        },

        itemName: {
            color:
                '#4E3824',

            fontSize:
                15,

            fontWeight:
                '900',
        },

        itemMeta: {
            marginTop:
                2,

            color:
                '#876A4C',

            fontSize:
                11,

            fontWeight:
                '700',
        },

        itemBottom: {
            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'space-between',

            marginTop:
                7,
        },

        rarityBadge: {
            paddingHorizontal:
                7,

            paddingVertical:
                3,

            borderRadius:
                7,
        },

        rarityText: {
            color:
                '#FFFFFF',

            fontSize:
                8,

            fontWeight:
                '900',
        },

        price: {
            color:
                '#5B421F',

            fontSize:
                13,

            fontWeight:
                '900',
        },

        lockReason: {
            marginTop:
                5,

            color:
                '#9A392F',

            fontSize:
                10,

            fontWeight:
                '800',
        },

        notice: {
            paddingHorizontal:
                12,

            paddingVertical:
                9,

            textAlign:
                'center',

            color:
                '#8A6A44',

            fontSize:
                11,

            fontWeight:
                '700',

            backgroundColor:
                '#F4E5C4',
        },
    });
