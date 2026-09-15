import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    FarmPlotState,
} from '@/game/core/game-types';

import {
    getProductionProgress,
    getProductionRemainingSeconds,
} from '@/game/care/care-engine';

type FarmPlotProps = {
    plot:
        FarmPlotState;

    number:
        number;

    selected:
        boolean;

    now:
        number;

    onPress:
        () => void;
};

type PlotVisual = {
    icon?:
        string;

    label:
        string;

    progress:
        number;

    urgent:
        boolean;
};

function formatRemainingTime(
    seconds:
        number
) {
    const safe =
        Math.max(
            0,
            seconds
        );

    const hours =
        Math.floor(
            safe /
            3600
        );

    const minutes =
        Math.floor(
            (
                safe %
                3600
            ) /
            60
        );

    const secs =
        safe %
        60;

    if (
        hours >
        0
    ) {
        return (
            `${hours}:` +
            `${String(
                minutes
            ).padStart(
                2,
                '0'
            )}:` +
            `${String(
                secs
            ).padStart(
                2,
                '0'
            )}`
        );
    }

    return (
        `${minutes}:` +
        `${String(
            secs
        ).padStart(
            2,
            '0'
        )}`
    );
}

function getPlotVisual(
    plot:
        FarmPlotState,
    now:
        number
): PlotVisual {
    if (
        plot.status ===
        'locked'
    ) {
        return {
            icon:
                '🔒',

            label:
                '未開放',

            progress:
                0,

            urgent:
                false,
        };
    }

    if (
        plot.status ===
        'empty'
    ) {
        return {
            icon:
                '＋',

            label:
                '植える',

            progress:
                0,

            urgent:
                false,
        };
    }

    if (
        plot.status ===
        'cleanup_required'
    ) {
        return {
            icon:
                '🪏',

            label:
                '古い株を抜く',

            progress:
                1,

            urgent:
                true,
        };
    }

    if (
        plot.status ===
        'fertilizer_required'
    ) {
        return {
            icon:
                '🟤',

            label:
                '肥料をまく',

            progress:
                0,

            urgent:
                true,
        };
    }

    if (
        plot.status ===
        'ready'
    ) {
        return {
            icon:
                '🌾',

            label:
                '収穫する',

            progress:
                1,

            urgent:
                true,
        };
    }

    const production =
        plot.production;

    if (!production) {
        return {
            icon:
                '🌱',

            label:
                '成長中',

            progress:
                0,

            urgent:
                false,
        };
    }

    const progress =
        getProductionProgress(
            production,
            now
        );

    const remaining =
        getProductionRemainingSeconds(
            production,
            now
        );

    if (
        production.status ===
        'care_required'
    ) {
        const requirement =
            production
                .careRequirements
                .find(
                    current =>
                        !current.completed &&
                        current.dueAt <=
                            now
                );

        return {
            icon:
                '💧',

            label:
                requirement?.type ===
                    'fertilizer'
                    ? '肥料が必要'
                    : '水やりが必要',

            progress,

            urgent:
                true,
        };
    }

    return {
        icon:
            progress >=
                0.66
                ? '🌿'
                : '🌱',

        label:
            formatRemainingTime(
                remaining
            ),

        progress,

        urgent:
            false,
    };
}

export default function FarmPlot({
    plot,
    number,
    selected,
    now,
    onPress,
}: FarmPlotProps) {
    const visual =
        getPlotVisual(
            plot,
            now
        );

    const locked =
        plot.status ===
        'locked';

    const progressWidth =
        `${Math.round(
            visual.progress *
            100
        )}%` as const;

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
                styles.touchArea,

                selected &&
                    styles.selected,

                pressed &&
                    styles.pressed,

                locked &&
                    styles.locked,
            ]}
        >
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

            <Text
                style={[
                    styles.stateIcon,

                    locked &&
                        styles.lockIcon,
                ]}
            >
                {visual.icon}
            </Text>

            <View
                style={[
                    styles.statusBadge,

                    visual.urgent &&
                        styles.statusUrgent,

                    locked &&
                        styles.statusLocked,
                ]}
            >
                <Text
                    numberOfLines={
                        1
                    }
                    style={
                        styles.statusText
                    }
                >
                    {visual.label}
                </Text>
            </View>

            {plot.status ===
                'growing' && (
                <View
                    style={
                        styles.progressTrack
                    }
                >
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width:
                                    progressWidth,
                            },
                        ]}
                    />
                </View>
            )}
        </Pressable>
    );
}

const styles =
    StyleSheet.create({
        touchArea: {
            flex:
                1,

            position:
                'relative',

            alignItems:
                'center',

            justifyContent:
                'center',

            borderRadius:
                22,

            borderWidth:
                2,

            borderColor:
                'transparent',
        },

        selected: {
            borderColor:
                '#FFE56B',

            backgroundColor:
                'rgba(255, 226, 72, 0.15)',

            shadowColor:
                '#FFD33D',

            shadowOpacity:
                0.9,

            shadowRadius:
                9,

            elevation:
                8,
        },

        pressed: {
            opacity:
                0.78,

            transform: [
                {
                    scale:
                        0.97,
                },
            ],
        },

        locked: {
            backgroundColor:
                'rgba(42, 37, 32, 0.48)',
        },

        numberBadge: {
            position:
                'absolute',

            left:
                7,

            top:
                7,

            width:
                25,

            height:
                25,

            alignItems:
                'center',

            justifyContent:
                'center',

            borderRadius:
                13,

            borderWidth:
                2,

            borderColor:
                '#7C4B1F',

            backgroundColor:
                '#FFF5D2',
        },

        numberText: {
            color:
                '#5B3416',

            fontSize:
                11,

            fontWeight:
                '900',
        },

        stateIcon: {
            fontSize:
                35,

            textAlign:
                'center',
        },

        lockIcon: {
            fontSize:
                29,
        },

        statusBadge: {
            position:
                'absolute',

            bottom:
                8,

            minWidth:
                '58%',

            maxWidth:
                '90%',

            paddingHorizontal:
                8,

            paddingVertical:
                4,

            borderRadius:
                10,

            borderWidth:
                1,

            borderColor:
                '#6A451F',

            backgroundColor:
                'rgba(255, 248, 222, 0.93)',
        },

        statusUrgent: {
            borderColor:
                '#A83C23',

            backgroundColor:
                'rgba(255, 225, 181, 0.96)',
        },

        statusLocked: {
            borderColor:
                '#60584D',

            backgroundColor:
                'rgba(82, 75, 67, 0.9)',
        },

        statusText: {
            color:
                '#4E3219',

            fontSize:
                9,

            fontWeight:
                '900',

            textAlign:
                'center',
        },

        progressTrack: {
            position:
                'absolute',

            left:
                '18%',

            right:
                '18%',

            bottom:
                2,

            height:
                5,

            overflow:
                'hidden',

            borderRadius:
                3,

            backgroundColor:
                'rgba(55, 42, 22, 0.45)',
        },

        progressFill: {
            height:
                '100%',

            borderRadius:
                3,

            backgroundColor:
                '#72D84B',
        },
    });
