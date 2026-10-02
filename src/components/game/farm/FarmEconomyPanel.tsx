import { Image } from 'react-native';
import { ROYAL_FONT } from '@/components/ui/RoyalSurface';
import { RoyalContentPanel } from '@/components/ui/RoyalPanels';
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
                            styles.goldBar
                        }
                    >
                        <Text
                            style={
                                styles.goldText
                            }
                        >
                            <Image source={require("../../../../assets/app/ui/royal-af/hud-coin-v1.png")} resizeMode="contain" style={{width:20,height:20}}/> {state.gold}
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
                                    <RoyalContentPanel
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
                                                        <Image source={require("../../../../assets/app/ui/royal-af/hud-coin-v1.png")} resizeMode="contain" style={{width:18,height:18}}/>{" "}
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
                                                    ><View pointerEvents="none" style={StyleSheet.absoluteFillObject}><RoyalContentPanel style={{...StyleSheet.absoluteFillObject,padding:0,minHeight:0}}/></View>
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
                                    </RoyalContentPanel>
                                );
                            }
                        )}
                    </ScrollView>
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


        },

        title: {
            fontFamily: ROYAL_FONT.body,
            fontSize:
                21,

            fontWeight:
                '900',

            color:
                '#49321D',
        },

        subtitle: {
            fontFamily: ROYAL_FONT.body,
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


        },

        closeText: {
            fontFamily: ROYAL_FONT.body,
            fontSize:
                26,

            fontWeight:
                '800',

            color:'#142847',
        },

        goldBar: {
            paddingHorizontal:
                18,

            paddingVertical:
                9,

            alignItems:
                'flex-end',


        },

        goldText: {
            fontFamily: ROYAL_FONT.body,
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






        },

        itemInfo: {
            flex:
                1,
        },

        itemName: {
            fontFamily: ROYAL_FONT.body,
            fontSize:
                17,

            fontWeight:
                '800',

            color:
                '#3F382F',
        },

        reading: {
            fontFamily: ROYAL_FONT.body,
            marginTop:
                2,

            fontSize:
                11,

            color:
                '#8B8175',
        },

        owned: {
            fontFamily: ROYAL_FONT.body,
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
            fontFamily: ROYAL_FONT.body,
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


        },

        disabledButton: {
            opacity:
                0.35,
        },

        actionText: {
            fontFamily: ROYAL_FONT.body,
            fontSize:
                14,

            fontWeight:
                '900',

            color:'#142847',
        },

        locked: {
            fontFamily: ROYAL_FONT.body,
            fontSize:
                13,

            fontWeight:
                '800',

            color:
                '#8C8173',
        },
    });
