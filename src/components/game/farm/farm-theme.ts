export const FARM_COLORS = {
    cream:
        '#FFF4D6',

    creamLight:
        '#FFFBEF',

    creamBorder:
        '#D8A94E',

    gold:
        '#FFC83D',

    goldDark:
        '#B87416',

    green:
        '#69B83F',

    greenDark:
        '#39752A',

    grass:
        '#73B947',

    soil:
        '#815027',

    soilDark:
        '#56331C',

    wood:
        '#5B3215',

    woodLight:
        '#855022',

    text:
        '#3B2415',

    textMuted:
        '#80694F',

    white:
        '#FFFFFF',

    locked:
        '#81786D',

    shadow:
        'rgba(67, 38, 12, 0.28)',
} as const;

export type FarmPlotSourceRect = {
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
 * Exact pixel rectangles measured directly from:
 *
 * vegetable_map_background_v2.png
 * Source canvas: 832 x 1792
 *
 * Do not convert these values to screen percentages.
 * FarmWorld applies the same source-to-screen matrix
 * used by the background artwork.
 */
export const FARM_PLOT_SOURCE_RECTS:
    readonly FarmPlotSourceRect[] = [
        {
            x:
                120,

            y:
                600,

            width:
                270,

            height:
                210,
        },

        {
            x:
                442,

            y:
                600,

            width:
                270,

            height:
                210,
        },

        {
            x:
                90,

            y:
                837,

            width:
                285,

            height:
                230,
        },

        {
            x:
                430,

            y:
                837,

            width:
                300,

            height:
                230,
        },

        {
            x:
                30,

            y:
                1090,

            width:
                340,

            height:
                300,
        },

        {
            x:
                430,

            y:
                1090,

            width:
                340,

            height:
                300,
        },
    ];
