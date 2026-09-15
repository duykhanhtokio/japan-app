import {
    Image,
    LayoutChangeEvent,
    StyleSheet,
    View,
} from 'react-native';

import {
    useState,
} from 'react';

import type {
    FarmPlotState,
} from '@/game/core/game-types';

import FarmPlot from './FarmPlot';

import {
    FARM_PLOT_SOURCE_RECTS,
} from './farm-theme';

type FarmWorldProps = {
    plots:
        readonly FarmPlotState[];

    selectedPlotId:
        string | null;

    now:
        number;

    onSelectPlot:
        (
            plotId:
                string
        ) => void;
};

type ViewportSize = {
    width:
        number;

    height:
        number;
};

const SOURCE_WIDTH =
    832;

const SOURCE_HEIGHT =
    1792;

const VEGETABLE_BACKGROUND =
    require(
        '../../../../assets/game/farm/background/vegetable_map_background_v2.png'
    );

export default function FarmWorld({
    plots,
    selectedPlotId,
    now,
    onSelectPlot,
}: FarmWorldProps) {
    const [
        viewport,
        setViewport,
    ] =
        useState<ViewportSize>({
            width:
                0,

            height:
                0,
        });

    function handleLayout(
        event:
            LayoutChangeEvent
    ) {
        const {
            width,
            height,
        } =
            event.nativeEvent
                .layout;

        setViewport({
            width,
            height,
        });
    }

    /*
     * The source artwork always fills the viewport width.
     *
     * Both the bitmap and every FarmPlot use the exact same:
     * - scale
     * - offsetX
     * - offsetY
     *
     * No percentage layout is involved.
     */
    const scale =
        viewport.width > 0
            ? viewport.width /
              SOURCE_WIDTH
            : 1;

    const renderedWidth =
        SOURCE_WIDTH *
        scale;

    const renderedHeight =
        SOURCE_HEIGHT *
        scale;

    const offsetX =
        (
            viewport.width -
            renderedWidth
        ) /
        2;

    const offsetY =
        (
            viewport.height -
            renderedHeight
        ) /
        2;

    return (
        <View
            onLayout={
                handleLayout
            }
            style={
                styles.viewport
            }
        >
            <Image
                source={
                    VEGETABLE_BACKGROUND
                }
                resizeMode="cover"
                blurRadius={
                    5
                }
                style={
                    styles.backdrop
                }
            />

            <Image
                source={
                    VEGETABLE_BACKGROUND
                }
                resizeMode="stretch"
                style={[
                    styles.artwork,
                    {
                        left:
                            offsetX,

                        top:
                            offsetY,

                        width:
                            renderedWidth,

                        height:
                            renderedHeight,
                    },
                ]}
            />

            {viewport.width > 0 &&
                plots.map(
                    (
                        plot,
                        index
                    ) => {
                        const sourceRect =
                            FARM_PLOT_SOURCE_RECTS[
                                index
                            ];

                        if (!sourceRect) {
                            return null;
                        }

                        return (
                            <View
                                key={
                                    plot.id
                                }
                                style={[
                                    styles.plot,
                                    {
                                        left:
                                            offsetX +
                                            sourceRect.x *
                                                scale,

                                        top:
                                            offsetY +
                                            sourceRect.y *
                                                scale,

                                        width:
                                            sourceRect.width *
                                            scale,

                                        height:
                                            sourceRect.height *
                                            scale,
                                    },
                                ]}
                            >
                                <FarmPlot
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
                                    now={
                                        now
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
        </View>
    );
}

const styles =
    StyleSheet.create({
        viewport: {
            flex:
                1,

            position:
                'relative',

            overflow:
                'hidden',

            backgroundColor:
                '#176AA7',
        },

        backdrop: {
            ...StyleSheet.absoluteFillObject,

            opacity:
                0.88,
        },

        artwork: {
            position:
                'absolute',
        },

        plot: {
            position:
                'absolute',

            zIndex:
                10,
        },
    });
