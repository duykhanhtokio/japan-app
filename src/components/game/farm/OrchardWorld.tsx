import {
    Image,
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useState } from 'react';

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

const ART_WIDTH = 941;
const ART_HEIGHT = 1672;
const ORCHARD_POSITIONS = [
    { x: 0.13, y: 0.39 },
    { x: 0.57, y: 0.39 },
    { x: 0.13, y: 0.57 },
    { x: 0.57, y: 0.57 },
] as const;

export default function OrchardWorld({
    plots,
    selectedPlotId,
    onSelectPlot,
}: OrchardWorldProps) {
    const [viewport, setViewport] = useState({ width: 0, height: 0 });

    function handleLayout(event: LayoutChangeEvent) {
        const { width, height } = event.nativeEvent.layout;
        setViewport({ width, height });
    }

    const scale = viewport.width > 0 && viewport.height > 0
        ? Math.min(viewport.width / ART_WIDTH, viewport.height / ART_HEIGHT)
        : 0;
    const artworkWidth = ART_WIDTH * scale;
    const artworkHeight = ART_HEIGHT * scale;
    const offsetX = (viewport.width - artworkWidth) / 2;
    const offsetY = (viewport.height - artworkHeight) / 2;

    return (
        <View style={styles.frame} onLayout={handleLayout}>
            <Image

                source={require('../../../../assets/game/farm/background/orchard_map_background.png')}
                resizeMode="cover"
                blurRadius={12}
                style={StyleSheet.absoluteFill}
            />
            {scale > 0 && <Image

                source={require('../../../../assets/game/farm/background/orchard_map_background.png')}
                resizeMode="contain"
                style={{
                    position: 'absolute',
                    left: offsetX,
                    top: offsetY,
                    width: artworkWidth,
                    height: artworkHeight,
                }}
            />}
            {scale > 0 && <View style={StyleSheet.absoluteFill}>
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
                                        left: offsetX + position.x * artworkWidth,
                                        top: offsetY + position.y * artworkHeight,
                                        width: artworkWidth * 0.30,
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

            </View>}
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

    const treeArtwork = plot.mature && plot.treeId === 'apple'
        ? require('../../../../assets/game/farm/orchard/apple_tree.png')
        : plot.mature && plot.treeId === 'grape'
            ? require('../../../../assets/game/farm/orchard/grape_vine.png')
            : require('../../../../assets/game/farm/orchard/sapling.png');

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
                !locked && styles.plot,

                selected &&
                !locked &&
                styles.plotSelected,

                pressed &&
                !locked &&
                styles.plotPressed,
            ]}
        >
            {!locked && <View
                style={
                    styles.soil
                }
            >
                {plot.treeId ? (
                    <>
                        <Image source={treeArtwork} resizeMode="contain" style={styles.treeSprite} />

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
                        <Image source={treeArtwork} resizeMode="contain" style={styles.emptySprite} />

                        <Text
                            style={
                                styles.emptyText
                            }
                        >
                            植える
                        </Text>
                    </>
                )}
            </View>}

            {!locked && <View
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
            </View>}
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

        plotPosition: {
            position:
                'absolute',

            width:
                '30%',
        },

        plot: {
            width: '100%',
            aspectRatio: 1.12,
            alignItems: 'center',
            justifyContent: 'center',
        },

        plotSelected: {
            transform: [{ scale: 1.05 }],
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
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },

        emptySprite: {
            width: '48%',
            height: '58%',
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

        treeSprite: {
            width: '100%',
            height: '82%',
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

    });
