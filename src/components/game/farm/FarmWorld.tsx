import { Image as CachedImage } from 'expo-image';
import {
    Image,
    LayoutChangeEvent,
    StyleSheet,
    View,
    useWindowDimensions,
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
const VEGETABLE_LANDSCAPE = require('../../../../assets/game/farm/background/vegetable_map_landscape_v1.png');
const LANDSCAPE_WIDTH = 1672;
const LANDSCAPE_HEIGHT = 940;
const LANDSCAPE_PLOT_RECTS = [
    { x: 0.26 * LANDSCAPE_WIDTH, y: 0.34 * LANDSCAPE_HEIGHT, width: 0.22 * LANDSCAPE_WIDTH, height: 0.12 * LANDSCAPE_HEIGHT },
    { x: 0.53 * LANDSCAPE_WIDTH, y: 0.34 * LANDSCAPE_HEIGHT, width: 0.22 * LANDSCAPE_WIDTH, height: 0.12 * LANDSCAPE_HEIGHT },
    { x: 0.22 * LANDSCAPE_WIDTH, y: 0.48 * LANDSCAPE_HEIGHT, width: 0.26 * LANDSCAPE_WIDTH, height: 0.13 * LANDSCAPE_HEIGHT },
    { x: 0.53 * LANDSCAPE_WIDTH, y: 0.48 * LANDSCAPE_HEIGHT, width: 0.26 * LANDSCAPE_WIDTH, height: 0.13 * LANDSCAPE_HEIGHT },
    { x: 0.18 * LANDSCAPE_WIDTH, y: 0.64 * LANDSCAPE_HEIGHT, width: 0.29 * LANDSCAPE_WIDTH, height: 0.14 * LANDSCAPE_HEIGHT },
    { x: 0.54 * LANDSCAPE_WIDTH, y: 0.64 * LANDSCAPE_HEIGHT, width: 0.29 * LANDSCAPE_WIDTH, height: 0.14 * LANDSCAPE_HEIGHT },
] as const;

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
    const window = useWindowDimensions();
    const isLandscape = (viewport.width || window.width) > (viewport.height || window.height);
    const sourceWidth = isLandscape ? LANDSCAPE_WIDTH : SOURCE_WIDTH;
    const sourceHeight = isLandscape ? LANDSCAPE_HEIGHT : SOURCE_HEIGHT;

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

        setViewport(current => current.width === width && current.height === height ? current : { width, height });
    }

    /*
     * The source artwork covers the entire viewport; edges may be cropped.
     *
     * Both the bitmap and every FarmPlot use the exact same:
     * - scale
     * - offsetX
     * - offsetY
     *
     * No percentage layout is involved.
     */
    const scale =
        viewport.width > 0 && viewport.height > 0
            ? Math.max(viewport.width / sourceWidth, viewport.height / sourceHeight)
            : 1;

    const renderedWidth =
        sourceWidth *
        scale;

    const renderedHeight =
        sourceHeight *
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
            <CachedImage source={
                    isLandscape ? VEGETABLE_LANDSCAPE : VEGETABLE_BACKGROUND
                }
                contentFit="cover" transition={0} cachePolicy="memory-disk"
                style={[StyleSheet.absoluteFill,{width:'100%',height:'100%'}]}
            />

            {viewport.width > 0 &&
                plots.map(
                    (
                        plot,
                        index
                    ) => {
                        const sourceRect =
                            (isLandscape ? LANDSCAPE_PLOT_RECTS : FARM_PLOT_SOURCE_RECTS)[
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

        plot: {
            position:
                'absolute',

            zIndex:
                10,
        },
    });
