import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    FarmGameState,
    GameItemId,
} from '@/game/core/game-types';

import {
    GAME_ITEMS,
} from '@/game/data/items';

import {
    getInventoryQuantity,
} from '@/game/inventory/inventory-engine';

export type FarmEconomyMode =
    | 'shop'
    | 'produce';

type Props = {
    visible:
        boolean;

    mode:
        FarmEconomyMode;

    state:
        FarmGameState;

    onClose:
        () => void;

    onBuy:
        (
            itemId:
                GameItemId
        ) => void;

    onSell:
        (
            itemId:
                GameItemId
        ) => void;
};

export default function FarmEconomyPanel({
    visible,
    mode,
    state,
    onClose,
    onBuy,
    onSell,
}: Props) {
    const isShop =
        mode ===
        'shop';

    const items =
        isShop
            ? GAME_ITEMS.filter(
                  item =>
                      item.shopPrice !==
                      undefined
              )
            : GAME_ITEMS.filter(
                  item =>
                      (
                          item.category ===
                              'crop' ||
                          item.category ===
                              'animal_product'
                      ) &&
                      item.baseSellPrice >
                          0
              );

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
                                {isShop
                                    ? 'ファームショップ'
                                    : 'やさい直売所'}
                            </Text>

                            <Text
                                style={
                                    styles.subtitle
                                }
                            >
                                {isShop
                                    ? '農場で使うものを買えます'
                                    : '収穫した農産物を販売できます'}
                            </Text>
                        </View>

                        <Pressable
                            onPress={
                                onClose
                            }
                            style={
                                styles.close
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
                            styles.goldBar
                        }
                    >
                        <Text
                            style={
                                styles.goldText
                            }
                        >
                            🪙 {state.gold}
                        </Text>
                    </View>

                    <ScrollView
                        style={
                            styles.scroll
                        }
                        contentContainerStyle={
                            styles.list
                        }
                    >
                        {items.map(
                            item => {
                                const locked =
                                    state.farmLevel <
                                    item.unlockFarmLevel;

                                const owned =
                                    getInventoryQuantity(
                                        state.inventory,
                                        item.id
                                    );

                                const disabled =
                                    locked ||
                                    (
                                        !isShop &&
                                        owned <=
                                            0
                                    );

                                return (
                                    <View
                                        key={
                                            item.id
                                        }
                                        style={
                                            styles.item
                                        }
                                    >
                                        <View
                                            style={
                                                styles.itemInfo
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.itemName
                                                }
                                            >
                                                {
                                                    item.name
                                                        .textJa
                                                }
                                            </Text>

                                            <Text
                                                style={
                                                    styles.reading
                                                }
                                            >
                                                {
                                                    item.name
                                                        .readingJa
                                                }
                                            </Text>

                                            <Text
                                                style={
                                                    styles.owned
                                                }
                                            >
                                                所持 ×{owned}
                                            </Text>
                                        </View>

                                        <View
                                            style={
                                                styles.actionArea
                                            }
                                        >
                                            {locked ? (
                                                <Text
                                                    style={
                                                        styles.locked
                                                    }
                                                >
                                                    🔒 Lv.
                                                    {
                                                        item.unlockFarmLevel
                                                    }
                                                </Text>
                                            ) : (
                                                <>
                                                    <Text
                                                        style={
                                                            styles.price
                                                        }
                                                    >
                                                        🪙{' '}
                                                        {isShop
                                                            ? item.shopPrice
                                                            : item.baseSellPrice}
                                                    </Text>

                                                    <Pressable
                                                        disabled={
                                                            disabled
                                                        }
                                                        onPress={() =>
                                                            isShop
                                                                ? onBuy(
                                                                      item.id
                                                                  )
                                                                : onSell(
                                                                      item.id
                                                                  )
                                                        }
                                                        style={[
                                                            styles.actionButton,

                                                            disabled &&
                                                                styles.disabledButton,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={
                                                                styles.actionText
                                                            }
                                                        >
                                                            {isShop
                                                                ? '買う'
                                                                : '売る'}
                                                        </Text>
                                                    </Pressable>
                                                </>
                                            )}
                                        </View>
                                    </View>
                                );
                            }
                        )}
                    </ScrollView>
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

            alignItems:
                'center',

            backgroundColor:
                'rgba(20, 35, 24, 0.48)',

            padding:
                18,
        },

        panel: {
            width:
                '100%',

            maxWidth:
                520,

            maxHeight:
                '78%',

            overflow:
                'hidden',

            borderRadius:
                24,

            backgroundColor:
                '#FFF9E8',

            borderWidth:
                3,

            borderColor:
                '#704A25',
        },

        header: {
            flexDirection:
                'row',

            justifyContent:
                'space-between',

            alignItems:
                'center',

            paddingHorizontal:
                18,

            paddingVertical:
                14,

            backgroundColor:
                '#F2D58A',
        },

        title: {
            fontSize:
                21,

            fontWeight:
                '900',

            color:
                '#49321D',
        },

        subtitle: {
            marginTop:
                2,

            fontSize:
                12,

            color:
                '#725D43',
        },

        close: {
            width:
                38,

            height:
                38,

            borderRadius:
                19,

            alignItems:
                'center',

            justifyContent:
                'center',

            backgroundColor:
                '#FFFFFF',
        },

        closeText: {
            fontSize:
                26,

            fontWeight:
                '800',

            color:
                '#49321D',
        },

        goldBar: {
            paddingHorizontal:
                18,

            paddingVertical:
                9,

            alignItems:
                'flex-end',

            backgroundColor:
                '#FFF1BF',
        },

        goldText: {
            fontSize:
                17,

            fontWeight:
                '900',

            color:
                '#6B4B16',
        },

        scroll: {
            flexGrow:
                0,
        },

        list: {
            padding:
                12,

            gap:
                9,
        },

        item: {
            minHeight:
                84,

            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'space-between',

            padding:
                12,

            borderRadius:
                16,

            backgroundColor:
                '#FFFFFF',

            borderWidth:
                1,

            borderColor:
                '#E6D7B5',
        },

        itemInfo: {
            flex:
                1,
        },

        itemName: {
            fontSize:
                17,

            fontWeight:
                '800',

            color:
                '#3F382F',
        },

        reading: {
            marginTop:
                2,

            fontSize:
                11,

            color:
                '#8B8175',
        },

        owned: {
            marginTop:
                5,

            fontSize:
                12,

            fontWeight:
                '700',

            color:
                '#6B7568',
        },

        actionArea: {
            minWidth:
                92,

            alignItems:
                'flex-end',
        },

        price: {
            marginBottom:
                6,

            fontSize:
                14,

            fontWeight:
                '900',

            color:
                '#7A5715',
        },

        actionButton: {
            minWidth:
                72,

            paddingHorizontal:
                15,

            paddingVertical:
                9,

            alignItems:
                'center',

            borderRadius:
                13,

            backgroundColor:
                '#5CA852',
        },

        disabledButton: {
            opacity:
                0.35,
        },

        actionText: {
            fontSize:
                14,

            fontWeight:
                '900',

            color:
                '#FFFFFF',
        },

        locked: {
            fontSize:
                13,

            fontWeight:
                '800',

            color:
                '#8C8173',
        },
    });
