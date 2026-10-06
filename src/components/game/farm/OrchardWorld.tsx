import CachedImage from '@/components/ui/FocusedArtwork';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
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

const ART_WIDTH = 941;
const ART_HEIGHT = 1672;
const LANDSCAPE_WIDTH = 1672;
const LANDSCAPE_HEIGHT = 941;
const PORTRAIT_ART = require('../../../../assets/game/farm/background/orchard_map_background.png');
const LANDSCAPE_ART = require('../../../../assets/game/farm/background/orchard_map_landscape_v1.png');
const ORCHARD_POSITIONS = [
    { x: 0.13, y: 0.39 },
    { x: 0.57, y: 0.39 },
    { x: 0.13, y: 0.57 },
    { x: 0.57, y: 0.57 },
] as const;
const LANDSCAPE_POSITIONS = [
    { x: 0.25, y: 0.43 },
    { x: 0.62, y: 0.43 },
    { x: 0.25, y: 0.67 },
    { x: 0.62, y: 0.67 },
] as const;

export default function OrchardWorld({
    plots,
    selectedPlotId,
    onSelectPlot,
}: OrchardWorldProps) {
    const viewport=useWindowDimensions();
    const isLandscape = viewport.width > viewport.height;
    const imageWidth = isLandscape ? LANDSCAPE_WIDTH : ART_WIDTH;
    const imageHeight = isLandscape ? LANDSCAPE_HEIGHT : ART_HEIGHT;
    const positions = isLandscape ? LANDSCAPE_POSITIONS : ORCHARD_POSITIONS;


    const scale = viewport.width > 0 && viewport.height > 0
        ? Math.max(viewport.width / imageWidth, viewport.height / imageHeight)
        : 0;
    const artworkWidth = imageWidth * scale;
    const artworkHeight = imageHeight * scale;
    const offsetX = (viewport.width - artworkWidth) / 2;
    const offsetY = (viewport.height - artworkHeight) / 2;

    return (
        <View style={styles.frame}>
            <CachedImage source={isLandscape ? LANDSCAPE_ART : PORTRAIT_ART}
                contentFit="cover" transition={0} cachePolicy="memory-disk"
                style={[StyleSheet.absoluteFill,{width:'100%',height:'100%'}]}
            />
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
                            positions[
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
                                        width: artworkWidth * (isLandscape ? 0.13 : 0.30),
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
                        <Image fadeDuration={0} source={treeArtwork} resizeMode="contain" style={styles.treeSprite} />

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
                        <Image fadeDuration={0} source={treeArtwork} resizeMode="contain" style={styles.emptySprite} />

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
            flex: 1,
            width: '100%',
            minHeight: 0,
            overflow: 'hidden',
            backgroundColor: 'transparent',
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
                'transparent',
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
