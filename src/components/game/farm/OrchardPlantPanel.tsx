import { ROYAL_FONT } from '@/components/ui/RoyalSurface';
import { RoyalContentPanel, RoyalExplanationPanel } from '@/components/ui/RoyalPanels';
import {
    Image,
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

const COIN_ICON = require('../../../../assets/app/ui/royal-af/hud-coin-v1.png');
const LOCK_ICON = require('../../../../assets/app/ui/royal-af/lock-grape-v2.png');
const CLOSE_ICON = require('../../../../assets/app/ui/royal-af/close-x-v2.png');
const TREE_ARTWORK: Partial<Record<OrchardTreeId, number>> = {
    apple: require('../../../../assets/game/farm/orchard/apple_tree.png'),
    grape: require('../../../../assets/game/farm/orchard/grape_vine.png'),
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

                <RoyalContentPanel
                    style={
                        styles.sheet
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
                                植える木を選ぶ
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
                            <RoyalContentPanel
                                style={
                                    styles.goldBadge
                                }
                            >
                                <Image source={COIN_ICON} resizeMode="contain" style={styles.smallIcon} />
                                <Text
                                    style={
                                        styles.goldText
                                    }
                                >
                                    {gold}
                                </Text>
                            </RoyalContentPanel>

                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="閉じる"
                                onPress={
                                    onClose
                                }
                                style={
                                    styles.closeButton
                                }
                            ><View pointerEvents="none" style={StyleSheet.absoluteFillObject}><RoyalContentPanel style={{...StyleSheet.absoluteFillObject,padding:0,minHeight:0}}/></View>
                                <Image source={CLOSE_ICON} resizeMode="contain" style={{width:22,height:22}} />
                            </Pressable>
                        </View>
                    </View>

                    <RoyalExplanationPanel
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

                        <RoyalContentPanel
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
                        </RoyalContentPanel>
                    </RoyalExplanationPanel>

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
                </RoyalContentPanel>
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
        <RoyalContentPanel
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
                {TREE_ARTWORK[tree.id] && <Image source={TREE_ARTWORK[tree.id]} resizeMode="contain" style={styles.treeArtwork} />}
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
                        <RoyalContentPanel
                            style={
                                styles.lockBadge
                            }
                        >
                                <Image source={LOCK_ICON} resizeMode="contain" style={styles.smallIcon} />
                            <Text
                                style={
                                    styles.lockText
                                }
                            >
                                Lv.
                                {
                                    tree.unlockFarmLevel
                                }
                            </Text>
                        </RoyalContentPanel>
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
                    <RoyalContentPanel
                        style={[
                            styles.priceBadge,

                            notEnoughGold &&
                            styles.priceBadgeInsufficient,
                        ]}
                    >
                                <Image source={COIN_ICON} resizeMode="contain" style={styles.smallIcon} />
                        <Text
                            style={[
                                styles.priceText,

                                notEnoughGold &&
                                styles.priceTextInsufficient,
                            ]}
                        >
                            {
                                price ??
                                '---'
                            }
                        </Text>
                    </RoyalContentPanel>

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
                    ><View pointerEvents="none" style={StyleSheet.absoluteFillObject}><RoyalContentPanel style={{...StyleSheet.absoluteFillObject,padding:0,minHeight:0}}/></View>
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
        </RoyalContentPanel>
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
        <RoyalContentPanel
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
        </RoyalContentPanel>
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

        sheet: { height: '72%', paddingTop: 18, paddingHorizontal: 14, paddingBottom: 14 },

        handle: {  },

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
            fontFamily: ROYAL_FONT.body,
            color:
                FARM_COLORS.text,

            fontSize:
                19,

            fontWeight:
                '900',
        },

        subtitle: {
            fontFamily: ROYAL_FONT.body,
            marginTop:
                1,

            color:
                '#8C6638',

            fontSize:
                11,

            fontWeight:
                '800',
        },

        goldBadge: { minHeight: 0, minWidth: 82, paddingHorizontal: 10, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 4 },

        goldText: {
            fontFamily: ROYAL_FONT.body,
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






        },

        closeText: {
            fontFamily: ROYAL_FONT.body,
            color:'#142847',

            fontSize:
                23,

            lineHeight:
                25,

            fontWeight:
                '900',
        },

        infoBar: { minHeight: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9, paddingVertical: 10, paddingHorizontal: 14 },

        infoText: {
            fontFamily: ROYAL_FONT.body,
            flex:
                1,

            marginRight:
                8,

            color:
                '#f2db9b',

            fontSize:
                11,

            fontWeight:
                '800',
        },

        levelBadge: { minHeight: 0, paddingHorizontal: 9, paddingVertical: 4 },

        levelText: {
            fontFamily: ROYAL_FONT.body,
            color:
                '#142847',

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



            padding:
                9,






        },

        cardLocked: {
            opacity:
                0.58,


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






        },

        treeIcon: {  },

        smallIcon: { width: 18, height: 18 },
        treeArtwork: { width: 64, height: 84 },

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
            fontFamily: ROYAL_FONT.body,
            flex:
                1,

            color:
                '#56381D',

            fontSize:
                16,

            fontWeight:
                '900',
        },

        lockBadge: { minHeight: 0, paddingHorizontal: 6, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', gap: 3 },

        lockText: {
            fontFamily: ROYAL_FONT.body,
            color:
                '#142847',

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

        stat: { minHeight: 0, flex: 1, alignItems: 'center', paddingHorizontal: 4, paddingVertical: 6 },

        statLabel: {
            fontFamily: ROYAL_FONT.body,
            color:
                '#8B6A40',

            fontSize:
                8,

            fontWeight:
                '800',
        },

        statValue: {
            fontFamily: ROYAL_FONT.body,
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

        priceBadge: { minHeight: 0, flex: 1, paddingVertical: 7, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 4 },

        priceBadgeInsufficient: {  },

        priceText: {fontFamily: ROYAL_FONT.body,
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






        },

        plantButtonDisabled: {



        },

        plantButtonPressed: {
            transform: [
                {
                    scale:
                        0.96,
                },
            ],
        },

        plantButtonText: {fontFamily: ROYAL_FONT.body,
            color:'#142847',

            fontSize:
                11,

            fontWeight:
                '900',
        },

        plantButtonTextDisabled: {
            color:'#142847',
        },
    });
