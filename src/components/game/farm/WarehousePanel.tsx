import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    useState,
} from 'react';

import type {
    InventoryEntry,
} from '@/game/core/game-types';

import {
    FARM_COLORS,
} from './farm-theme';

type WarehouseTab =
    | 'inventory'
    | 'shop';

type Props = {
    visible:
        boolean;

    inventory:
        readonly InventoryEntry[];

    used:
        number;

    capacity:
        number;

    onClose:
        () => void;
};

export default function WarehousePanel({
    visible,
    inventory,
    used,
    capacity,
    onClose,
}: Props) {
    const [
        activeTab,
        setActiveTab,
    ] =
        useState<WarehouseTab>(
            'shop'
        );

    return (
        <Modal
            visible={
                visible
            }
            animationType="fade"
            transparent
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
                        styles.window
                    }
                >
                    <View
                        style={
                            styles.titleBar
                        }
                    >
                        <Text
                            style={
                                styles.title
                            }
                        >
                            倉庫
                        </Text>

                        <View
                            style={
                                styles.capacityBadge
                            }
                        >
                            <Text
                                style={
                                    styles.capacityText
                                }
                            >
                                📦 {used}/{capacity}
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

                    <View
                        style={
                            styles.tabs
                        }
                    >
                        <WarehouseTabButton
                            title="インベントリ"
                            active={
                                activeTab ===
                                'inventory'
                            }
                            onPress={() =>
                                setActiveTab(
                                    'inventory'
                                )
                            }
                        />

                        <WarehouseTabButton
                            title="ショップ"
                            active={
                                activeTab ===
                                'shop'
                            }
                            onPress={() =>
                                setActiveTab(
                                    'shop'
                                )
                            }
                        />
                    </View>

                    {activeTab ===
                    'inventory' ? (
                        <InventoryView
                            inventory={
                                inventory
                            }
                        />
                    ) : (
                        <ShopPreview />
                    )}
                </View>
            </View>
        </Modal>
    );
}

function WarehouseTabButton({
    title,
    active,
    onPress,
}: {
    title:
        string;

    active:
        boolean;

    onPress:
        () => void;
}) {
    return (
        <Pressable
            onPress={
                onPress
            }
            style={[
                styles.tab,

                active &&
                    styles.activeTab,
            ]}
        >
            <Text
                style={
                    styles.tabText
                }
            >
                {title}
            </Text>
        </Pressable>
    );
}

function InventoryView({
    inventory,
}: {
    inventory:
        readonly InventoryEntry[];
}) {
    return (
        <ScrollView
            style={
                styles.scroll
            }
            contentContainerStyle={
                styles.inventoryGrid
            }
        >
            {inventory.length ===
            0 ? (
                <Text
                    style={
                        styles.emptyText
                    }
                >
                    倉庫は空です
                </Text>
            ) : (
                inventory.map(
                    entry => (
                        <View
                            key={
                                entry.itemId
                            }
                            style={
                                styles.inventoryItem
                            }
                        >
                            <Text
                                style={
                                    styles.inventoryIcon
                                }
                            >
                                📦
                            </Text>

                            <Text
                                numberOfLines={
                                    1
                                }
                                style={
                                    styles.inventoryName
                                }
                            >
                                {
                                    entry.itemId
                                }
                            </Text>

                            <Text
                                style={
                                    styles.inventoryQuantity
                                }
                            >
                                ×{
                                    entry.quantity
                                }
                            </Text>
                        </View>
                    )
                )
            )}
        </ScrollView>
    );
}

/*
 * Shop ở checkpoint này mới dựng visual structure.
 *
 * Bước kế tiếp sẽ lấy trực tiếp GAME_ITEMS
 * + Shop Engine để:
 *
 * - lọc item mua được
 * - quantity selector
 * - kiểm tra level
 * - kiểm tra Gold
 * - purchase thật
 */
function ShopPreview() {
    const rows = [
        [
            '🌾',
            'お米（種）',
            20,
        ],

        [
            '🌽',
            'とうもろこし（種）',
            30,
        ],

        [
            '🍎',
            'りんごの苗',
            60,
        ],

        [
            '🍊',
            'みかんの苗',
            60,
        ],

        [
            '🍇',
            'ぶどうの苗',
            70,
        ],

        [
            '🍓',
            'いちごの苗',
            40,
        ],

        [
            '🐔',
            '鶏',
            100,
        ],

        [
            '🐄',
            '牛',
            200,
        ],

        [
            '🌱',
            '肥料',
            10,
        ],

        [
            '💧',
            '水',
            10,
        ],
    ] as const;

    return (
        <ScrollView
            style={
                styles.scroll
            }
            contentContainerStyle={
                styles.shopList
            }
        >
            <View
                style={
                    styles.shopHeading
                }
            >
                <Text
                    style={
                        styles.shopHeadingText
                    }
                >
                    商品ラインナップ
                </Text>
            </View>

            {rows.map(
                (
                    [
                        icon,
                        title,
                        price,
                    ]
                ) => (
                    <View
                        key={
                            title
                        }
                        style={
                            styles.shopRow
                        }
                    >
                        <Text
                            style={
                                styles.shopIcon
                            }
                        >
                            {icon}
                        </Text>

                        <View
                            style={
                                styles.shopInfo
                            }
                        >
                            <Text
                                style={
                                    styles.shopTitle
                                }
                            >
                                {title}
                            </Text>

                            <Text
                                style={
                                    styles.shopDescription
                                }
                            >
                                農場で使用するアイテムです。
                            </Text>
                        </View>

                        <View
                            style={
                                styles.quantity
                            }
                        >
                            <Text>
                                −
                            </Text>

                            <Text
                                style={
                                    styles.quantityValue
                                }
                            >
                                1
                            </Text>

                            <Text
                                style={
                                    styles.plus
                                }
                            >
                                ＋
                            </Text>
                        </View>

                        <View
                            style={
                                styles.price
                            }
                        >
                            <Text
                                style={
                                    styles.priceText
                                }
                            >
                                🪙 {price}
                            </Text>
                        </View>
                    </View>
                )
            )}
        </ScrollView>
    );
}

const styles =
    StyleSheet.create({
        overlay: {
            flex:
                1,

            padding:
                14,

            justifyContent:
                'center',

            backgroundColor:
                'rgba(38, 24, 10, 0.60)',
        },

        window: {
            flex:
                1,

            maxHeight:
                '94%',

            borderRadius:
                24,

            overflow:
                'hidden',

            borderWidth:
                4,

            borderColor:
                '#7B4219',

            backgroundColor:
                '#FFF3D5',
        },

        titleBar: {
            minHeight:
                68,

            backgroundColor:
                '#89501E',

            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'center',

            position:
                'relative',
        },

        title: {
            color:
                '#FFFFFF',

            fontSize:
                26,

            fontWeight:
                '900',
        },

        capacityBadge: {
            position:
                'absolute',

            left:
                14,

            backgroundColor:
                '#FFF3D5',

            paddingHorizontal:
                9,

            paddingVertical:
                5,

            borderRadius:
                10,
        },

        capacityText: {
            color:
                FARM_COLORS.text,

            fontSize:
                10,

            fontWeight:
                '900',
        },

        closeButton: {
            position:
                'absolute',

            right:
                10,

            width:
                43,

            height:
                43,

            borderRadius:
                22,

            backgroundColor:
                '#D94B2B',

            alignItems:
                'center',

            justifyContent:
                'center',

            borderWidth:
                3,

            borderColor:
                '#FFD88B',
        },

        closeText: {
            color:
                '#FFFFFF',

            fontSize:
                29,

            fontWeight:
                '900',
        },

        tabs: {
            flexDirection:
                'row',

            paddingHorizontal:
                15,

            paddingTop:
                10,

            backgroundColor:
                '#89501E',
        },

        tab: {
            flex:
                1,

            minHeight:
                50,

            alignItems:
                'center',

            justifyContent:
                'center',

            borderTopLeftRadius:
                15,

            borderTopRightRadius:
                15,

            backgroundColor:
                '#F3E4C5',
        },

        activeTab: {
            backgroundColor:
                FARM_COLORS.gold,
        },

        tabText: {
            color:
                FARM_COLORS.text,

            fontSize:
                17,

            fontWeight:
                '900',
        },

        scroll: {
            flex:
                1,
        },

        inventoryGrid: {
            flexDirection:
                'row',

            flexWrap:
                'wrap',

            gap:
                10,

            padding:
                14,
        },

        inventoryItem: {
            width:
                '30%',

            minHeight:
                105,

            padding:
                8,

            borderRadius:
                15,

            borderWidth:
                2,

            borderColor:
                '#E0BB70',

            backgroundColor:
                '#FFF9E9',

            alignItems:
                'center',

            justifyContent:
                'center',
        },

        inventoryIcon: {
            fontSize:
                29,
        },

        inventoryName: {
            color:
                FARM_COLORS.text,

            fontSize:
                8,

            fontWeight:
                '800',

            marginTop:
                5,
        },

        inventoryQuantity: {
            color:
                '#80501E',

            fontSize:
                13,

            fontWeight:
                '900',

            marginTop:
                3,
        },

        emptyText: {
            color:
                FARM_COLORS
                    .textMuted,

            margin:
                30,
        },

        shopList: {
            padding:
                12,

            gap:
                7,
        },

        shopHeading: {
            paddingVertical:
                6,
        },

        shopHeadingText: {
            color:
                FARM_COLORS.text,

            fontSize:
                16,

            fontWeight:
                '900',
        },

        shopRow: {
            minHeight:
                76,

            flexDirection:
                'row',

            alignItems:
                'center',

            paddingHorizontal:
                10,

            borderRadius:
                14,

            borderWidth:
                1,

            borderColor:
                '#E4C286',

            backgroundColor:
                '#FFF9EA',
        },

        shopIcon: {
            width:
                48,

            fontSize:
                31,

            textAlign:
                'center',
        },

        shopInfo: {
            flex:
                1,

            marginLeft:
                7,
        },

        shopTitle: {
            color:
                FARM_COLORS.text,

            fontSize:
                13,

            fontWeight:
                '900',
        },

        shopDescription: {
            color:
                FARM_COLORS
                    .textMuted,

            fontSize:
                8,

            marginTop:
                2,
        },

        quantity: {
            width:
                76,

            height:
                34,

            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'space-around',

            borderRadius:
                9,

            borderWidth:
                1,

            borderColor:
                '#C89C4E',

            backgroundColor:
                '#FFF4D6',
        },

        quantityValue: {
            fontWeight:
                '900',
        },

        plus: {
            color:
                '#FFFFFF',

            backgroundColor:
                '#459A26',

            padding:
                5,

            borderRadius:
                5,

            fontWeight:
                '900',
        },

        price: {
            minWidth:
                73,

            marginLeft:
                7,

            paddingHorizontal:
                7,

            paddingVertical:
                9,

            borderRadius:
                10,

            backgroundColor:
                '#FFB91F',

            borderWidth:
                2,

            borderColor:
                '#DD8A0D',
        },

        priceText: {
            color:
                '#56300D',

            fontSize:
                12,

            fontWeight:
                '900',

            textAlign:
                'center',
        },
    });
