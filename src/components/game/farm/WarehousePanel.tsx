import FarmAreaIcon from './FarmAreaIcon';
import { ROYAL_FONT } from '@/components/ui/RoyalSurface';
import { RoyalContentPanel } from '@/components/ui/RoyalPanels';
import {
    Image,
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
            animationType="none"
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
                <RoyalContentPanel
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
                        ><View pointerEvents="none" style={StyleSheet.absoluteFillObject}><RoyalContentPanel style={{...StyleSheet.absoluteFillObject,padding:0,minHeight:0}}/></View>
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
                </RoyalContentPanel>
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
        ><View pointerEvents="none" style={StyleSheet.absoluteFillObject}><RoyalContentPanel style={{...StyleSheet.absoluteFillObject,padding:0,minHeight:0}}/></View>
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
                        <RoyalContentPanel
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
                        </RoyalContentPanel>
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
                    <RoyalContentPanel
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
                            {icon === "🌾" ? <FarmAreaIcon name="rice" size={42}/> : icon === "🐔" ? <FarmAreaIcon name="chicken" size={42}/> : icon === "🐄" ? <FarmAreaIcon name="cow" size={42}/> : icon}
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

                        <RoyalContentPanel
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
                        </RoyalContentPanel>

                        <RoyalContentPanel
                            style={
                                styles.price
                            }
                        >
                            <Image fadeDuration={0} source={require('../../../../assets/app/ui/royal-af/hud-coin-v1.png')} resizeMode="contain" style={{width:20,height:20}} />
                            <Text
                                style={
                                    styles.priceText
                                }
                            >
                                {price}
                            </Text>
                        </RoyalContentPanel>
                    </RoyalContentPanel>
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
                'transparent',
        },

        window: {
            flex:
                1,

            maxHeight:
                '94%',



            overflow:
                'hidden',






        },

        titleBar: {
            minHeight:
                68,



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
            fontFamily: ROYAL_FONT.body,
            color:
                '#142847',

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
            fontFamily: ROYAL_FONT.body,
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



            alignItems:
                'center',

            justifyContent:
                'center',




        },

        closeText: {
            fontFamily: ROYAL_FONT.body,
            color:'#142847',

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


        },

        activeTab: {
            backgroundColor:
                FARM_COLORS.gold,
        },

        tabText: {
            fontFamily: ROYAL_FONT.body,
            color:'#142847',

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







            alignItems:
                'center',

            justifyContent:
                'center',
        },

        inventoryIcon: {
            fontFamily: ROYAL_FONT.body,
            fontSize:
                29,
        },

        inventoryName: {
            fontFamily: ROYAL_FONT.body,
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
            fontFamily: ROYAL_FONT.body,
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
            fontFamily: ROYAL_FONT.body,
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
            fontFamily: ROYAL_FONT.body,
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








        },

        shopIcon: {
            fontFamily: ROYAL_FONT.body,
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
            fontFamily: ROYAL_FONT.body,
            color:
                FARM_COLORS.text,

            fontSize:
                13,

            fontWeight:
                '900',
        },

        shopDescription: {
            fontFamily: ROYAL_FONT.body,
            color:
                FARM_COLORS
                    .textMuted,

            fontSize:
                8,

            marginTop:
                2,
        },

        quantity: {
            width: 76, minHeight: 34, paddingHorizontal: 8, paddingVertical: 6,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
        },

        quantityValue: {
            fontFamily: ROYAL_FONT.body,
            fontWeight:
                '900',
        },

        plus: {
            fontFamily: ROYAL_FONT.body, color: '#142847', fontWeight: '900',
        },

        price: {
            minWidth: 73, minHeight: 34, marginLeft: 7,
            paddingHorizontal: 8, paddingVertical: 6,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3,
        },

        priceText: {
            fontFamily: ROYAL_FONT.body,
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
