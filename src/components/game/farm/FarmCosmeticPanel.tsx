import FarmCosmeticArtwork from './FarmCosmeticArtwork';
import { ROYAL_FONT } from '@/components/ui/RoyalSurface';
import { RoyalContentPanel, RoyalExplanationPanel } from '@/components/ui/RoyalPanels';
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from 'react-native';

import {
    useMemo,
    useState,
} from 'react';

import { getFarmCosmeticAsset } from '@/game/data/farm-cosmetic-assets';
import FarmCosmeticPreview from './FarmCosmeticPreview';
import FarmAreaIcon, { type FarmAreaIconName } from './FarmAreaIcon';

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

const LOCK_ICON = require('../../../../assets/app/ui/royal-af/lock-grape-v2.png');

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
): FarmAreaIconName {
    if (
        item.target ===
        'chicken'
    ) {
        return 'chicken';
    }

    if (
        item.target ===
        'cow'
    ) {
        return 'cow';
    }

    if (
        item.target ===
            'chicken_barn' ||
        item.target ===
            'cow_barn'
    ) {
        return 'restaurant';
    }

    return 'orchard';
}

export default function FarmCosmeticPanel({
    visible,
    state,
    onClose,
    onBuy,
    onEquip,
    onUnequip,
}: Props) {
    const windowSize=useWindowDimensions(),compactLandscape=windowSize.width>windowSize.height&&windowSize.height<600;
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
            <RoyalContentPanel
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
                    {locked
                        ? <Image source={LOCK_ICON} resizeMode="contain" style={styles.previewAsset} />
                        : getFarmCosmeticAsset(item.assetKey) ? <FarmCosmeticArtwork assetKey={item.assetKey} width={64} height={64} /> : <Text style={{color:"#142847"}}>画像未登録</Text>}
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
                                <Image source={item.currency === "gold" ? require("../../../../assets/app/ui/royal-af/hud-coin-v1.png") : require("../../../../assets/app/ui/royal-af/hud-diamond-v1.png")} resizeMode="contain" style={{width:18,height:18}}/>{' '}
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
                                ><View pointerEvents="none" style={StyleSheet.absoluteFillObject}><RoyalContentPanel style={{...StyleSheet.absoluteFillObject,padding:0,minHeight:0}}/></View>
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
            </RoyalContentPanel>
        );
    }

    return (
        <Modal
            visible={
                visible
            }
            transparent
            animationType="none"
            onRequestClose={
                onClose
            }
        >
            <View
                style={
                    styles.overlay
                }
            >
                <RoyalContentPanel
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

                    <View style={{flex:1,minHeight:0,flexDirection:compactLandscape?'row':'column',gap:compactLandscape?10:0}}>
                    <View style={compactLandscape?{width:'30%',maxWidth:300}:undefined}><FarmCosmeticPreview
                        compact
                        target={
                            previewTarget
                        }
                        equipped={
                            state
                                .equippedFarmCosmetics
                        }
                    /></View>
                    <View style={{flex:1,minHeight:0}}>
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
                            <Image source={require("../../../../assets/app/ui/royal-af/hud-coin-v1.png")} resizeMode="contain" style={{width:20,height:20}}/> {state.gold}
                        </Text>

                        <Text
                            style={
                                styles.balanceText
                            }
                        >
                            <Image source={require("../../../../assets/app/ui/royal-af/hud-diamond-v1.png")} resizeMode="contain" style={{width:20,height:20}}/> {state.diamonds}
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

                    <RoyalExplanationPanel style={styles.noticePanel}>
                        <Text style={styles.notice}>同じスロットに装備すると自動で入れ替わります</Text>
                    </RoyalExplanationPanel>
                    </View></View>
                </RoyalContentPanel>
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
                'transparent',
        },

        panel: {
            flex:
                1,

            maxHeight:
                720,

            overflow:
                'hidden',








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






        },

        title: {
            fontFamily: ROYAL_FONT.body,
            color:
                '#563619',

            fontSize:
                21,

            fontWeight:
                '900',
        },

        subtitle: {
            fontFamily: ROYAL_FONT.body,
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


        },

        closeText: {
            fontFamily: ROYAL_FONT.body,
            color:'#142847',

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






        },

        filterButtonSelected: {



        },

        filterText: {fontFamily: ROYAL_FONT.body,
            color:'#142847',

            fontSize:
                10,

            fontWeight:
                '800',
        },

        filterTextSelected: {
            textDecorationLine:'underline',
            color:'#142847',
        },

        balanceBar: {
            fontFamily: ROYAL_FONT.body,
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
            fontFamily: ROYAL_FONT.body,
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


        },

        equippedButton: {

        },

        buyButtonDisabled: {

        },

        buyButtonText: {
            fontFamily: ROYAL_FONT.body,
            color:'#142847',

            fontSize:
                9,

            fontWeight:
                '900',
        },

        resultCount: {
            fontFamily: ROYAL_FONT.body,
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








        },

        cardEquipped: {





        },

        cardLocked: {
            opacity:
                0.52,


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


        },

        previewAsset: { width: 42, height: 42 },

        itemContent: {
            fontFamily: ROYAL_FONT.body,
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
            fontFamily: ROYAL_FONT.body,
            color:
                '#4E3824',

            fontSize:
                15,

            fontWeight:
                '900',
        },

        itemMeta: {
            fontFamily: ROYAL_FONT.body,
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
            fontFamily: ROYAL_FONT.body,
            color:
                '#FFFFFF',

            fontSize:
                8,

            fontWeight:
                '900',
        },

        price: {
            fontFamily: ROYAL_FONT.body,
            color:
                '#5B421F',

            fontSize:
                13,

            fontWeight:
                '900',
        },

        lockReason: {
            fontFamily: ROYAL_FONT.body,
            marginTop:
                5,

            color:
                '#9A392F',

            fontSize:
                10,

            fontWeight:
                '800',
        },

        noticePanel: {
            minHeight: 0, paddingHorizontal: 12, paddingVertical: 9,
        },
        notice: {
            fontFamily: ROYAL_FONT.body,

            textAlign:
                'center',

            color:
                '#FFF4CF',

            fontSize:
                11,

            fontWeight:
                '700',

        },
    });
