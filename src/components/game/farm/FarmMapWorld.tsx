import {
    Image,
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    View,
    useWindowDimensions,
} from 'react-native';

import {
    useState,
} from 'react';

import {
    isFarmAreaUnlocked,
    type FarmAreaUnlockId,
} from '@/game/data/farm-area-unlocks';
import { RoyalCapsule } from '@/components/ui/RoyalSurface';

export type FarmMapDestination =
    | 'vegetable'
    | 'orchard'
    | 'chicken'
    | 'cow'
    | 'restaurant'
    | 'shop'
    | 'produce';

type FarmMapWorldProps = {
    farmLevel:
        number;

    onSelect:
        (
            destination:
                FarmMapDestination
        ) => void;
};

type ViewportSize = {
    width:
        number;

    height:
        number;
};

type Hotspot = {
    id:
        FarmMapDestination;

    /*
     * Coordinates are expressed in the ORIGINAL
     * approved Farm Map coordinate system.
     *
     * x/y = center of interaction area, in %.
     * width/height = touch size, in %.
     */
    x:
        number;

    y:
        number;

    width:
        number;

    height:
        number;
};

/*
 * Approved master artwork:
 * 853 x 1844
 *
 * IMPORTANT:
 * Keep these values synchronized with
 * farm_map_master.png.
 */
const MAP_WIDTH =
    853;

const MAP_HEIGHT =
    1844;
const LANDSCAPE_WIDTH = 1672;
const LANDSCAPE_HEIGHT = 941;
const TABLET_WIDTH = 1448;
const TABLET_HEIGHT = 1086;
const PORTRAIT_ART = require('../../../../assets/game/farm/background/farm_map_master.png');
const LANDSCAPE_ART = require('../../../../assets/game/farm/background/farm_map_landscape_v1.png');
const TABLET_ART = require('../../../../assets/game/farm/background/farm_map_tablet_landscape_v1.png');
const DESTINATION_LABELS: Record<FarmMapDestination, string> = {
    restaurant: 'レストラン', orchard: '果樹園', chicken: '鶏小屋',
    cow: '牛舎', vegetable: '野菜畑', produce: '直売所', shop: 'ショップ',
};

/*
 * Coordinates recalibrated for the approved
 * full-screen Farm Map.
 */
const HOTSPOTS:
    readonly Hotspot[] = [
        {
            id: 'restaurant',
            x: 17,
            y: 30,
            width: 24,
            height: 15,
        },
        {
            id:
                'orchard',

            x:
                45,

            y:
                36,

            width:
                32,

            height:
                18,
        },

        {
            id:
                'chicken',

            x:
                15,

            y:
                47,

            width:
                28,

            height:
                17,
        },

        {
            id:
                'cow',

            x:
                82,

            y:
                42,

            width:
                30,

            height:
                20,
        },

        {
            id:
                'vegetable',

            x:
                16,

            y:
                68,

            width:
                31,

            height:
                22,
        },

        {
            id:
                'produce',

            x:
                50,

            y:
                70,

            width:
                27,

            height:
                18,
        },

        {
            id:
                'shop',

            x:
                82,

            y:
                68,

            width:
                31,

            height:
                20,
        },
    ];
const LANDSCAPE_HOTSPOTS: readonly Hotspot[] = [
    { id: 'restaurant', x: 22, y: 28, width: 20, height: 25 },
    { id: 'orchard', x: 49, y: 30, width: 23, height: 24 },
    { id: 'chicken', x: 19, y: 52, width: 24, height: 25 },
    { id: 'cow', x: 80, y: 48, width: 23, height: 26 },
    { id: 'vegetable', x: 20, y: 75, width: 28, height: 23 },
    { id: 'produce', x: 52, y: 74, width: 19, height: 20 },
    { id: 'shop', x: 84, y: 76, width: 22, height: 22 },
];
const TABLET_HOTSPOTS: readonly Hotspot[] = [
    { id: 'restaurant', x: 25, y: 27, width: 22, height: 22 },
    { id: 'orchard', x: 49, y: 33, width: 24, height: 22 },
    { id: 'chicken', x: 23, y: 48, width: 25, height: 22 },
    { id: 'cow', x: 77, y: 47, width: 23, height: 25 },
    { id: 'vegetable', x: 22, y: 72, width: 27, height: 22 },
    { id: 'produce', x: 49, y: 72, width: 19, height: 19 },
    { id: 'shop', x: 77, y: 73, width: 23, height: 22 },
];

export default function FarmMapWorld({
    farmLevel,
    onSelect,
}: FarmMapWorldProps) {
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
    const aspect = (viewport.width || window.width) / (viewport.height || window.height);
    const isLandscape = aspect > 1;
    const isTabletLandscape = isLandscape && aspect < 1.55;
    const sourceWidth = isTabletLandscape ? TABLET_WIDTH : isLandscape ? LANDSCAPE_WIDTH : MAP_WIDTH;
    const sourceHeight = isTabletLandscape ? TABLET_HEIGHT : isLandscape ? LANDSCAPE_HEIGHT : MAP_HEIGHT;

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
     * Equivalent to resizeMode="cover",
     * but we calculate the geometry ourselves.
     *
     * This is important because hotspots must
     * undergo exactly the same transformation
     * as the Farm Map artwork.
     */
    const scale =
        viewport.width > 0 &&
        viewport.height > 0
            ? Math.max(
                  viewport.width /
                      sourceWidth,

                  viewport.height /
                      sourceHeight
              )
            : 1;

    const renderedWidth =
        sourceWidth *
        scale;

    const renderedHeight =
        sourceHeight *
        scale;

    /*
     * Center the artwork so it covers the viewport.
     *
     * Hotspots use the same scale and offsets as the artwork.
     */
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
                source={isTabletLandscape ? TABLET_ART : isLandscape ? LANDSCAPE_ART : PORTRAIT_ART}
                resizeMode="cover"
                style={[StyleSheet.absoluteFill,{width:'100%',height:'100%'}]}
            />
            {viewport.width >
                0 &&
                viewport.height >
                    0 && (
                    <>
                        {(isTabletLandscape ? TABLET_HOTSPOTS : isLandscape ? LANDSCAPE_HOTSPOTS : HOTSPOTS).map(
                            hotspot => {
                                const progressionId =
                                    hotspot.id ===
                                    'produce'
                                        ? null
                                        : hotspot.id as
                                              FarmAreaUnlockId;

                                const unlocked =
                                    progressionId !== null && isFarmAreaUnlocked(
                                        progressionId,
                                        farmLevel
                                    );

                                const centerX =
                                    offsetX +
                                    (
                                        hotspot.x /
                                        100
                                    ) *
                                        renderedWidth;

                                const centerY =
                                    offsetY +
                                    (
                                        hotspot.y /
                                        100
                                    ) *
                                        renderedHeight;

                                const hotspotWidth =
                                    (
                                        hotspot.width /
                                        100
                                    ) *
                                    renderedWidth;

                                const hotspotHeight =
                                    (
                                        hotspot.height /
                                        100
                                    ) *
                                    renderedHeight;

                                return (
                                    <Pressable
                                        key={
                                            hotspot.id
                                        }
                                        accessibilityRole="button"
                                        accessibilityLabel={DESTINATION_LABELS[hotspot.id]}
                                        disabled={
                                            !unlocked
                                        }
                                        onPress={() =>
                                            onSelect(
                                                hotspot.id
                                            )
                                        }
                                        style={({
                                            pressed,
                                        }) => [
                                            styles.hotspot,

                                            {
                                                left:
                                                    centerX -
                                                    hotspotWidth /
                                                        2,

                                                top:
                                                    centerY -
                                                    hotspotHeight /
                                                        2,

                                                width:
                                                    hotspotWidth,

                                                height:
                                                    hotspotHeight,
                                            },

                                            pressed &&
                                                unlocked &&
                                                styles.hotspotPressed,
                                        ]}
                                    >
                                        {isLandscape && (
                                            <RoyalCapsule
                                                label={DESTINATION_LABELS[hotspot.id]}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    alignSelf: 'center',
                                                    width: Math.min(108, Math.max(64, hotspotWidth * 0.8)),
                                                    height: Math.min(38, Math.max(26, viewport.height * 0.065)),
                                                    opacity: unlocked ? 1 : 0.58,
                                                }}
                                                textStyle={{ fontSize: viewport.width < 900 ? 11 : 14 }}
                                            />
                                        )}
                                    </Pressable>
                                );
                            }
                        )}
                    </>
                )}
        </View>
    );
}

const styles =
    StyleSheet.create({
        viewport: {
            flex:
                1,

            width:
                '100%',

            minHeight:
                0,

            position:
                'relative',

            overflow:
                'hidden',

            backgroundColor:
                '#173C24',
        },

        hotspot: {
            position:
                'absolute',

            borderRadius:
                18,
        },

        hotspotPressed: {
            backgroundColor:
                'rgba(255, 225, 116, 0.16)',
        },

    });
