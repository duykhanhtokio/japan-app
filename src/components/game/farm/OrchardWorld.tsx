import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    OrchardPlotState,
} from '@/game/core/orchard-types';

import {
    getOrchardTree,
} from '@/game/data/orchards';

import {
    FARM_COLORS,
} from './farm-theme';

type OrchardWorldProps = {
    plots:
        readonly OrchardPlotState[];

    selectedPlotId:
        string | null;

    onSelectPlot:
        (
            plotId:
                string
        ) => void;
};

const ORCHARD_POSITIONS = [
    {
        left:
            '20%',
        top:
            '42%',
    },
    {
        left:
            '53%',
        top:
            '42%',
    },
    {
        left:
            '20%',
        top:
            '67%',
    },
    {
        left:
            '53%',
        top:
            '67%',
    },
] as const;

export default function OrchardWorld({
    plots,
    selectedPlotId,
    onSelectPlot,
}: OrchardWorldProps) {
    return (
        <View
            style={
                styles.frame
            }
        >
            <View
                style={
                    styles.world
                }
            >
                {/*
                 * =============================================
                 * BACKGROUND
                 * =============================================
                 */}

                <View
                    pointerEvents="none"
                    style={
                        StyleSheet.absoluteFill
                    }
                >
                    <View
                        style={
                            styles.upperGrass
                        }
                    />

                    <View
                        style={
                            styles.hillLeft
                        }
                    />

                    <View
                        style={
                            styles.hillRight
                        }
                    />

                    <View
                        style={
                            styles.path
                        }
                    />

                    <View
                        style={
                            styles.river
                        }
                    />

                    <Text
                        style={
                            styles.treeLeft
                        }
                    >
                        🌳
                    </Text>

                    <Text
                        style={
                            styles.treeRight
                        }
                    >
                        🌲
                    </Text>

                    <Text
                        style={
                            styles.flowerLeft
                        }
                    >
                        🌼
                    </Text>

                    <Text
                        style={
                            styles.flowerRight
                        }
                    >
                        🌻
                    </Text>
                </View>

                {/*
                 * =============================================
                 * ORCHARD HOUSE
                 * =============================================
                 */}

                <View
                    pointerEvents="none"
                    style={
                        styles.orchardHouse
                    }
                >
                    <Text
                        style={
                            styles.houseIcon
                        }
                    >
                        🏡
                    </Text>

                    <View
                        style={
                            styles.houseLabel
                        }
                    >
                        <Text
                            style={
                                styles.houseLabelText
                            }
                        >
                            果樹園
                        </Text>
                    </View>
                </View>

                {/*
                 * =============================================
                 * ORCHARD PLOTS
                 * =============================================
                 */}

                {plots.map(
                    (
                        plot,
                        index
                    ) => {
                        const position =
                            ORCHARD_POSITIONS[
                                index
                            ];

                        if (!position) {
                            return null;
                        }

                        return (
                            <View
                                key={
                                    plot.id
                                }
                                style={[
                                    styles.plotPosition,
                                    {
                                        left:
                                            position.left,

                                        top:
                                            position.top,
                                    },
                                ]}
                            >
                                <OrchardPlot
                                    plot={
                                        plot
                                    }
                                    number={
                                        index +
                                        1
                                    }
                                    selected={
                                        selectedPlotId ===
                                        plot.id
                                    }
                                    onPress={() =>
                                        onSelectPlot(
                                            plot.id
                                        )
                                    }
                                />
                            </View>
                        );
                    }
                )}

                <View
                    pointerEvents="none"
                    style={
                        styles.foregroundFence
                    }
                >
                    <Text
                        style={
                            styles.fenceText
                        }
                    >
                        🪵  🪵  🪵
                    </Text>
                </View>
            </View>
        </View>
    );
}

/*
 * =========================================================
 * ORCHARD PLOT
 * =========================================================
 */

function OrchardPlot({
    plot,
    number,
    selected,
    onPress,
}: {
    plot:
        OrchardPlotState;

    number:
        number;

    selected:
        boolean;

    onPress:
        () => void;
}) {
    const locked =
        plot.status ===
        'locked';

    const tree =
        plot.treeId
            ? getOrchardTree(
                plot.treeId
            )
            : undefined;

    let treeIcon =
        '🌱';

    if (
        plot.mature &&
        plot.treeId ===
            'apple'
    ) {
        treeIcon =
            '🍎';
    } else if (
        plot.mature &&
        plot.treeId ===
            'grape'
    ) {
        treeIcon =
            '🍇';
    } else if (
        plot.mature
    ) {
        treeIcon =
            '🌳';
    }

    return (
        <Pressable
            disabled={
                locked
            }
            onPress={
                onPress
            }
            style={({
                pressed,
            }) => [
                styles.plot,

                selected &&
                !locked &&
                styles.plotSelected,

                locked &&
                styles.plotLocked,

                pressed &&
                !locked &&
                styles.plotPressed,
            ]}
        >
            <View
                style={
                    styles.soil
                }
            >
                {locked ? (
                    <>
                        <Text
                            style={
                                styles.lockIcon
                            }
                        >
                            🔒
                        </Text>

                        <Text
                            style={
                                styles.lockText
                            }
                        >
                            未開放
                        </Text>
                    </>
                ) : plot.treeId ? (
                    <>
                        <Text
                            style={
                                styles.treeIcon
                            }
                        >
                            {treeIcon}
                        </Text>

                        <Text
                            numberOfLines={
                                1
                            }
                            style={
                                styles.treeName
                            }
                        >
                            {
                                tree
                                    ?.name
                                    .textJa ??
                                plot.treeId
                            }
                        </Text>

                        <Text
                            style={
                                styles.treeStatus
                            }
                        >
                            {
                                getStatusLabel(
                                    plot
                                )
                            }
                        </Text>
                    </>
                ) : (
                    <>
                        <Text
                            style={
                                styles.emptyIcon
                            }
                        >
                            🌱
                        </Text>

                        <Text
                            style={
                                styles.emptyText
                            }
                        >
                            植える
                        </Text>
                    </>
                )}
            </View>

            <View
                style={
                    styles.numberBadge
                }
            >
                <Text
                    style={
                        styles.numberText
                    }
                >
                    {number}
                </Text>
            </View>
        </Pressable>
    );
}

function getStatusLabel(
    plot:
        OrchardPlotState
): string {
    switch (
        plot.status
    ) {
        case 'growing':
            return '成長中';

        case 'producing':
            return '実が育っています';

        case 'ready':
            return '収穫できます';

        case 'empty':
            return '空き';

        case 'locked':
            return '未開放';
    }
}

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles =
    StyleSheet.create({
        frame: {
            flex:
                1,

            minHeight:
                400,

            marginHorizontal:
                8,

            marginTop:
                7,

            borderRadius:
                24,

            borderWidth:
                3,

            borderColor:
                '#B77A2C',

            overflow:
                'hidden',

            backgroundColor:
                FARM_COLORS.grass,

            shadowColor:
                '#000000',

            shadowOffset: {
                width:
                    0,

                height:
                    4,
            },

            shadowOpacity:
                0.18,

            shadowRadius:
                5,

            elevation:
                5,
        },

        world: {
            flex:
                1,

            minHeight:
                400,

            position:
                'relative',

            overflow:
                'hidden',

            backgroundColor:
                '#79BC4D',
        },

        upperGrass: {
            position:
                'absolute',

            left:
                0,

            right:
                0,

            top:
                0,

            height:
                '34%',

            backgroundColor:
                '#A9D96F',
        },

        hillLeft: {
            position:
                'absolute',

            width:
                '70%',

            height:
                '24%',

            left:
                '-19%',

            top:
                '-8%',

            borderRadius:
                200,

            backgroundColor:
                '#609C43',

            transform: [
                {
                    rotate:
                        '-5deg',
                },
            ],
        },

        hillRight: {
            position:
                'absolute',

            width:
                '72%',

            height:
                '25%',

            right:
                '-20%',

            top:
                '-5%',

            borderRadius:
                200,

            backgroundColor:
                '#6AAA49',

            transform: [
                {
                    rotate:
                        '7deg',
                },
            ],
        },

        path: {
            position:
                'absolute',

            width:
                '22%',

            height:
                '100%',

            left:
                '5%',

            top:
                '20%',

            borderRadius:
                80,

            backgroundColor:
                '#D8B36B',

            transform: [
                {
                    rotate:
                        '7deg',
                },
            ],
        },

        river: {
            position:
                'absolute',

            width:
                '22%',

            height:
                '125%',

            right:
                '-8%',

            top:
                '-8%',

            borderRadius:
                80,

            backgroundColor:
                '#71CBE8',

            borderLeftWidth:
                5,

            borderLeftColor:
                '#D9D58B',

            transform: [
                {
                    rotate:
                        '9deg',
                },
            ],
        },

        orchardHouse: {
            position:
                'absolute',

            left:
                '36%',

            top:
                '7%',

            alignItems:
                'center',
        },

        houseIcon: {
            fontSize:
                62,
        },

        houseLabel: {
            marginTop:
                -7,

            paddingHorizontal:
                9,

            paddingVertical:
                3,

            borderRadius:
                9,

            backgroundColor:
                FARM_COLORS.cream,

            borderWidth:
                1,

            borderColor:
                FARM_COLORS
                    .creamBorder,
        },

        houseLabelText: {
            color:
                FARM_COLORS.text,

            fontSize:
                9,

            fontWeight:
                '900',
        },

        plotPosition: {
            position:
                'absolute',

            width:
                '25%',
        },

        plot: {
            width:
                '100%',

            aspectRatio:
                1.35,

            borderRadius:
                14,

            borderWidth:
                3,

            borderColor:
                '#5C351B',

            backgroundColor:
                '#9C6936',

            padding:
                5,

            shadowColor:
                '#000000',

            shadowOffset: {
                width:
                    0,

                height:
                    3,
            },

            shadowOpacity:
                0.22,

            shadowRadius:
                3,

            elevation:
                4,

            position:
                'relative',
        },

        plotSelected: {
            borderColor:
                '#FFD348',

            borderWidth:
                4,

            transform: [
                {
                    scale:
                        1.04,
                },
            ],
        },

        plotLocked: {
            backgroundColor:
                '#59564E',

            borderColor:
                '#454139',

            opacity:
                0.76,
        },

        plotPressed: {
            transform: [
                {
                    scale:
                        0.96,
                },
            ],
        },

        soil: {
            flex:
                1,

            borderRadius:
                9,

            backgroundColor:
                FARM_COLORS.soil,

            borderWidth:
                1,

            borderColor:
                FARM_COLORS
                    .soilDark,

            alignItems:
                'center',

            justifyContent:
                'center',
        },

        lockIcon: {
            fontSize:
                26,
        },

        lockText: {
            marginTop:
                2,

            color:
                '#FFF3D1',

            fontSize:
                8,

            fontWeight:
                '900',
        },

        emptyIcon: {
            fontSize:
                28,
        },

        emptyText: {
            marginTop:
                1,

            color:
                '#FFF4D6',

            fontSize:
                9,

            fontWeight:
                '900',
        },

        treeIcon: {
            fontSize:
                30,
        },

        treeName: {
            color:
                '#FFF4D6',

            fontSize:
                9,

            fontWeight:
                '900',
        },

        treeStatus: {
            color:
                '#FFE39A',

            fontSize:
                7,

            fontWeight:
                '800',

            marginTop:
                1,
        },

        numberBadge: {
            position:
                'absolute',

            left:
                -7,

            top:
                -8,

            width:
                22,

            height:
                22,

            borderRadius:
                11,

            backgroundColor:
                FARM_COLORS.cream,

            borderWidth:
                2,

            borderColor:
                FARM_COLORS
                    .creamBorder,

            alignItems:
                'center',

            justifyContent:
                'center',
        },

        numberText: {
            color:
                FARM_COLORS.text,

            fontSize:
                10,

            fontWeight:
                '900',
        },

        treeLeft: {
            position:
                'absolute',

            left:
                '3%',

            top:
                '12%',

            fontSize:
                42,
        },

        treeRight: {
            position:
                'absolute',

            right:
                '4%',

            top:
                '26%',

            fontSize:
                41,
        },

        flowerLeft: {
            position:
                'absolute',

            left:
                '16%',

            bottom:
                '5%',

            fontSize:
                18,
        },

        flowerRight: {
            position:
                'absolute',

            right:
                '18%',

            bottom:
                '6%',

            fontSize:
                19,
        },

        foregroundFence: {
            position:
                'absolute',

            right:
                '3%',

            bottom:
                '1%',
        },

        fenceText: {
            fontSize:
                17,
        },
    });
