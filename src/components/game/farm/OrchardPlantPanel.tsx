import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    OrchardTreeDefinition,
    OrchardTreeId,
} from '@/game/core/orchard-types';

import {
    ORCHARD_TREES,
} from '@/game/data/orchards';

import {
    getGameItem,
} from '@/game/data/items';

import {
    FARM_COLORS,
} from './farm-theme';

type Props = {
    visible:
    boolean;

    farmLevel:
    number;

    gold:
    number;

    onClose:
    () => void;

    onPlant:
    (
        treeId:
            OrchardTreeId
    ) => void;
};

const TREE_ICONS:
    Record<string, string> = {
    apple:
        '🍎',

    grape:
        '🍇',

    mikan:
        '🍊',

    peach:
        '🍑',

    pear:
        '🍐',

    cherry:
        '🍒',

    persimmon:
        '🟠',

    lemon:
        '🍋',

    kiwi:
        '🥝',

    blueberry:
        '🫐',
};

export default function OrchardPlantPanel({
    visible,
    farmLevel,
    gold,
    onClose,
    onPlant,
}: Props) {
    return (
        <Modal
            visible={
                visible
            }
            transparent
            animationType="slide"
            onRequestClose={
                onClose
            }
        >
            <View
                style={
                    styles.overlay
                }
            >
                <Pressable
                    style={
                        styles.dismissArea
                    }
                    onPress={
                        onClose
                    }
                />

                <View
                    style={
                        styles.sheet
                    }
                >
                    <View
                        style={
                            styles.handle
                        }
                    />

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
                                🌳 植える木を選ぶ
                            </Text>

                            <Text
                                style={
                                    styles.subtitle
                                }
                            >
                                果樹園
                            </Text>
                        </View>

                        <View
                            style={
                                styles.headerRight
                            }
                        >
                            <View
                                style={
                                    styles.goldBadge
                                }
                            >
                                <Text
                                    style={
                                        styles.goldText
                                    }
                                >
                                    🪙 {gold}
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
                    </View>

                    <View
                        style={
                            styles.infoBar
                        }
                    >
                        <Text
                            style={
                                styles.infoText
                            }
                        >
                            苗木を購入して、そのまま植えます
                        </Text>

                        <View
                            style={
                                styles.levelBadge
                            }
                        >
                            <Text
                                style={
                                    styles.levelText
                                }
                            >
                                Lv.{farmLevel}
                            </Text>
                        </View>
                    </View>

                    <ScrollView
                        style={
                            styles.scroll
                        }
                        contentContainerStyle={
                            styles.list
                        }
                        showsVerticalScrollIndicator
                    >
                        {ORCHARD_TREES.map(
                            tree => (
                                <TreeCard
                                    key={
                                        tree.id
                                    }
                                    tree={
                                        tree
                                    }
                                    farmLevel={
                                        farmLevel
                                    }
                                    gold={
                                        gold
                                    }
                                    onPlant={
                                        onPlant
                                    }
                                />
                            )
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

function TreeCard({
    tree,
    farmLevel,
    gold,
    onPlant,
}: {
    tree:
    OrchardTreeDefinition;

    farmLevel:
    number;

    gold:
    number;

    onPlant:
    (
        treeId:
            OrchardTreeId
    ) => void;
}) {
    const saplingItem =
        getGameItem(
            tree.saplingItemId
        );

    const price =
        saplingItem
            ?.shopPrice;

    const levelLocked =
        farmLevel <
        tree.unlockFarmLevel;

    const invalidPrice =
        price ===
        undefined;

    const notEnoughGold =
        price !==
        undefined &&
        gold <
        price;

    const disabled =
        levelLocked ||
        invalidPrice ||
        notEnoughGold;

    let buttonText =
        '植える';

    if (levelLocked) {
        buttonText =
            '未開放';
    } else if (
        invalidPrice
    ) {
        buttonText =
            '販売不可';
    } else if (
        notEnoughGold
    ) {
        buttonText =
            'ゴールド不足';
    }

    return (
        <View
            style={[
                styles.card,

                levelLocked &&
                styles.cardLocked,
            ]}
        >
            <View
                style={
                    styles.iconBox
                }
            >
                <Text
                    style={
                        styles.treeIcon
                    }
                >
                    {
                        TREE_ICONS[
                        tree.id
                        ] ??
                        '🌳'
                    }
                </Text>
            </View>

            <View
                style={
                    styles.cardBody
                }
            >
                <View
                    style={
                        styles.nameRow
                    }
                >
                    <Text
                        style={
                            styles.treeName
                        }
                    >
                        {
                            tree.name
                                .textJa
                        }
                    </Text>

                    {levelLocked && (
                        <View
                            style={
                                styles.lockBadge
                            }
                        >
                            <Text
                                style={
                                    styles.lockText
                                }
                            >
                                🔒 Lv.
                                {
                                    tree.unlockFarmLevel
                                }
                            </Text>
                        </View>
                    )}
                </View>

                <View
                    style={
                        styles.statsRow
                    }
                >
                    <Stat
                        label="成長"
                        value={
                            formatHours(
                                tree.initialGrowTimeSeconds
                            )
                        }
                    />

                    <Stat
                        label="収穫周期"
                        value={
                            formatHours(
                                tree.fruitCycleTimeSeconds
                            )
                        }
                    />

                    <Stat
                        label="収穫"
                        value={
                            `×${tree.yieldAmount}`
                        }
                    />
                </View>

                <View
                    style={
                        styles.bottomRow
                    }
                >
                    <View
                        style={[
                            styles.priceBadge,

                            notEnoughGold &&
                            styles.priceBadgeInsufficient,
                        ]}
                    >
                        <Text
                            style={[
                                styles.priceText,

                                notEnoughGold &&
                                styles.priceTextInsufficient,
                            ]}
                        >
                            🪙 {
                                price ??
                                '---'
                            }
                        </Text>
                    </View>

                    <Pressable
                        disabled={
                            disabled
                        }
                        onPress={() =>
                            onPlant(
                                tree.id
                            )
                        }
                        style={({
                            pressed,
                        }) => [
                                styles.plantButton,

                                disabled &&
                                styles.plantButtonDisabled,

                                pressed &&
                                !disabled &&
                                styles.plantButtonPressed,
                            ]}
                    >
                        <Text
                            style={[
                                styles.plantButtonText,

                                disabled &&
                                styles.plantButtonTextDisabled,
                            ]}
                        >
                            {
                                buttonText
                            }
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

function Stat({
    label,
    value,
}: {
    label:
    string;

    value:
    string;
}) {
    return (
        <View
            style={
                styles.stat
            }
        >
            <Text
                style={
                    styles.statLabel
                }
            >
                {label}
            </Text>

            <Text
                style={
                    styles.statValue
                }
            >
                {value}
            </Text>
        </View>
    );
}

function formatHours(
    seconds:
        number
): string {
    const hours =
        seconds /
        3600;

    if (
        Number.isInteger(
            hours
        )
    ) {
        return `${hours}時間`;
    }

    return `${hours.toFixed(1)}時間`;
}

const styles =
    StyleSheet.create({
        overlay: {
            flex:
                1,

            justifyContent:
                'flex-end',

            backgroundColor:
                'rgba(42, 28, 14, 0.38)',
        },

        dismissArea: {
            flex:
                1,
        },

        sheet: {
            height:
                '72%',

            backgroundColor:
                '#FFF4D4',

            borderTopLeftRadius:
                28,

            borderTopRightRadius:
                28,

            borderWidth:
                3,

            borderBottomWidth:
                0,

            borderColor:
                '#9A6329',

            paddingHorizontal:
                14,

            paddingBottom:
                14,

            shadowColor:
                '#000',

            shadowOffset: {
                width:
                    0,

                height:
                    -4,
            },

            shadowOpacity:
                0.2,

            shadowRadius:
                8,

            elevation:
                12,
        },

        handle: {
            alignSelf:
                'center',

            width:
                48,

            height:
                5,

            borderRadius:
                3,

            marginTop:
                8,

            marginBottom:
                8,

            backgroundColor:
                '#C79A5B',
        },

        header: {
            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'space-between',

            paddingHorizontal:
                4,

            paddingBottom:
                8,
        },

        headerRight: {
            flexDirection:
                'row',

            alignItems:
                'center',

            gap:
                8,
        },

        title: {
            color:
                FARM_COLORS.text,

            fontSize:
                19,

            fontWeight:
                '900',
        },

        subtitle: {
            marginTop:
                1,

            color:
                '#8C6638',

            fontSize:
                11,

            fontWeight:
                '800',
        },

        goldBadge: {
            minWidth:
                82,

            paddingHorizontal:
                10,

            paddingVertical:
                7,

            borderRadius:
                12,

            alignItems:
                'center',

            backgroundColor:
                '#FFE09A',

            borderWidth:
                2,

            borderColor:
                '#D29A32',
        },

        goldText: {
            color:
                '#694417',

            fontSize:
                12,

            fontWeight:
                '900',
        },

        closeButton: {
            width:
                36,

            height:
                36,

            borderRadius:
                18,

            alignItems:
                'center',

            justifyContent:
                'center',

            backgroundColor:
                '#E7C88F',

            borderWidth:
                2,

            borderColor:
                '#A56D31',
        },

        closeText: {
            color:
                '#6E431D',

            fontSize:
                23,

            lineHeight:
                25,

            fontWeight:
                '900',
        },

        infoBar: {
            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'space-between',

            marginBottom:
                9,

            paddingVertical:
                7,

            paddingHorizontal:
                10,

            borderRadius:
                12,

            backgroundColor:
                '#F0D79E',

            borderWidth:
                1,

            borderColor:
                '#C89854',
        },

        infoText: {
            flex:
                1,

            marginRight:
                8,

            color:
                '#73502B',

            fontSize:
                11,

            fontWeight:
                '800',
        },

        levelBadge: {
            paddingHorizontal:
                9,

            paddingVertical:
                4,

            borderRadius:
                10,

            backgroundColor:
                '#7FB44C',
        },

        levelText: {
            color:
                '#FFFFFF',

            fontSize:
                10,

            fontWeight:
                '900',
        },

        scroll: {
            flex:
                1,
        },

        list: {
            gap:
                9,

            paddingBottom:
                24,
        },

        card: {
            minHeight:
                118,

            flexDirection:
                'row',

            borderRadius:
                17,

            padding:
                9,

            backgroundColor:
                '#FFFDF3',

            borderWidth:
                2,

            borderColor:
                '#D3A35F',
        },

        cardLocked: {
            opacity:
                0.58,

            backgroundColor:
                '#D9D2C2',
        },

        iconBox: {
            width:
                76,

            minHeight:
                96,

            borderRadius:
                14,

            alignItems:
                'center',

            justifyContent:
                'center',

            backgroundColor:
                '#DCEEB8',

            borderWidth:
                2,

            borderColor:
                '#A2C06E',
        },

        treeIcon: {
            fontSize:
                44,
        },

        cardBody: {
            flex:
                1,

            marginLeft:
                10,

            justifyContent:
                'space-between',
        },

        nameRow: {
            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'space-between',

            gap:
                6,
        },

        treeName: {
            flex:
                1,

            color:
                '#56381D',

            fontSize:
                16,

            fontWeight:
                '900',
        },

        lockBadge: {
            paddingHorizontal:
                6,

            paddingVertical:
                3,

            borderRadius:
                7,

            backgroundColor:
                '#746E63',
        },

        lockText: {
            color:
                '#FFFFFF',

            fontSize:
                9,

            fontWeight:
                '900',
        },

        statsRow: {
            flexDirection:
                'row',

            gap:
                5,

            marginVertical:
                6,
        },

        stat: {
            flex:
                1,

            alignItems:
                'center',

            paddingVertical:
                4,

            borderRadius:
                8,

            backgroundColor:
                '#F3E6C4',
        },

        statLabel: {
            color:
                '#8B6A40',

            fontSize:
                8,

            fontWeight:
                '800',
        },

        statValue: {
            marginTop:
                1,

            color:
                '#5E401F',

            fontSize:
                9,

            fontWeight:
                '900',
        },

        bottomRow: {
            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'space-between',

            gap:
                8,
        },

        priceBadge: {
            flex:
                1,

            paddingVertical:
                7,

            paddingHorizontal:
                10,

            borderRadius:
                9,

            backgroundColor:
                '#FFE5A6',

            borderWidth:
                1,

            borderColor:
                '#D9AA4D',
        },

        priceBadgeInsufficient: {
            backgroundColor:
                '#F3D7CF',

            borderColor:
                '#D29B8B',
        },

        priceText: {
            color:
                '#765019',

            fontSize:
                11,

            fontWeight:
                '900',
        },

        priceTextInsufficient: {
            color:
                '#A15A45',
        },

        plantButton: {
            minWidth:
                92,

            paddingHorizontal:
                13,

            paddingVertical:
                9,

            alignItems:
                'center',

            borderRadius:
                11,

            backgroundColor:
                '#6DAF45',

            borderWidth:
                2,

            borderColor:
                '#4C8730',
        },

        plantButtonDisabled: {
            backgroundColor:
                '#C8C1B4',

            borderColor:
                '#AAA297',
        },

        plantButtonPressed: {
            transform: [
                {
                    scale:
                        0.96,
                },
            ],
        },

        plantButtonText: {
            color:
                '#FFFFFF',

            fontSize:
                11,

            fontWeight:
                '900',
        },

        plantButtonTextDisabled: {
            color:
                '#756F66',
        },
    });