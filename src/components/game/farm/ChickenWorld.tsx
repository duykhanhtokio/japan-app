import {
    Animated,
    Easing,
    Image,
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import type {
    AnimalSlotState,
} from '@/game/core/game-types';

const BACKGROUND = require(
    '../../../../assets/game/farm/background/chicken_coop_background.png'
);

const CHICKEN = {
    idle: require('../../../../assets/game/farm/animals/chicken/chicken_idle.png'),
    eat01: require('../../../../assets/game/farm/animals/chicken/chicken_eat_01.png'),
    eat02: require('../../../../assets/game/farm/animals/chicken/chicken_eat_02.png'),
    eat03: require('../../../../assets/game/farm/animals/chicken/chicken_eat_03.png'),
    ready: require('../../../../assets/game/farm/animals/chicken/chicken_ready.png'),
    egg: require('../../../../assets/game/farm/animals/chicken/egg_ready.png'),
} as const;

const CANVAS_WIDTH = 832;
const CANVAS_HEIGHT = 1792;

type SourcePoint = {
    x: number;
    y: number;
};

/*
 * Tọa độ tâm của 12 ổ trên chicken_coop_background.png.
 * Ba slot hiện tại dùng ba vị trí đầu tiên.
 */
const NEST_CENTERS: readonly SourcePoint[] = [
    { x: 244, y: 879 },
    { x: 367, y: 879 },
    { x: 492, y: 879 },
    { x: 615, y: 879 },
    { x: 240, y: 1045 },
    { x: 361, y: 1045 },
    { x: 483, y: 1045 },
    { x: 602, y: 1045 },
    { x: 235, y: 1210 },
    { x: 351, y: 1210 },
    { x: 468, y: 1210 },
    { x: 584, y: 1210 },
] as const;

type Props = {
    slots: readonly AnimalSlotState[];
    selectedSlotId: string | null;
    now: number;
    onSelectSlot: (slotId: string) => void;
    onFeed: (slotId: string) => void;
    onCare: (slotId: string) => void;
    onCollect: (slotId: string) => void;
};

type Viewport = {
    width: number;
    height: number;
};

function formatRemainingTime(
    readyAt: number | undefined,
    now: number
) {
    if (readyAt === undefined) {
        return '';
    }

    const seconds = Math.max(
        0,
        Math.ceil((readyAt - now) / 1000)
    );

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const rest = seconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
    }

    return `${minutes}:${String(rest).padStart(2, '0')}`;
}

function ChickenSprite({
    producing,
    ready,
    index,
}: {
    producing: boolean;
    ready: boolean;
    index: number;
}) {
    const bounce = useRef(new Animated.Value(0)).current;
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.delay(index * 90),
                Animated.timing(bounce, {
                    toValue: 1,
                    duration: producing ? 230 : 1200,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(bounce, {
                    toValue: 0,
                    duration: producing ? 230 : 1200,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();
        return () => animation.stop();
    }, [bounce, index, producing]);

    useEffect(() => {
        if (!producing) {
            setFrame(0);
            return;
        }

        const timer = setInterval(
            () => setFrame(current => (current + 1) % 3),
            180
        );

        return () => clearInterval(timer);
    }, [producing]);

    const source = ready
        ? CHICKEN.ready
        : producing
            ? [CHICKEN.eat01, CHICKEN.eat02, CHICKEN.eat03][frame]
            : CHICKEN.idle;

    const translateY = bounce.interpolate({
        inputRange: [0, 1],
        outputRange: [0, producing ? 3 : -2],
    });

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.spriteWrap,
                { transform: [{ translateY }] },
            ]}
        >
            <Image
                source={source}
                resizeMode="contain"
                style={styles.sprite}
            />
        </Animated.View>
    );
}

function ChickenSlot({
    slot,
    index,
    selected,
    now,
    scale,
    offsetX,
    offsetY,
    onSelect,
    onFeed,
    onCare,
    onCollect,
}: {
    slot: AnimalSlotState;
    index: number;
    selected: boolean;
    now: number;
    scale: number;
    offsetX: number;
    offsetY: number;
    onSelect: () => void;
    onFeed: () => void;
    onCare: () => void;
    onCollect: () => void;
}) {
    const center = NEST_CENTERS[index] ?? NEST_CENTERS[0];
    const sourceWidth = 112;
    const sourceHeight = 126;

    const careRequirement = slot.production?.careRequirements.find(
        requirement =>
            !requirement.completed &&
            requirement.dueAt <= now
    );

    const careRequired =
        slot.status === 'producing' &&
        slot.production?.status === 'care_required';

    const producing = slot.status === 'producing';
    const ready = slot.status === 'ready';
    const remaining = formatRemainingTime(
        slot.production?.readyAt ?? slot.readyAt,
        now
    );

    const careIcon = careRequirement?.type === 'drink'
        ? '💧'
        : careRequirement?.type === 'feed'
            ? '🌾'
            : '❗';

    return (
        <Pressable
            onPress={onSelect}
            style={({ pressed }) => [
                styles.slot,
                {
                    left: offsetX + (center.x - sourceWidth / 2) * scale,
                    top: offsetY + (center.y - sourceHeight / 2) * scale,
                    width: sourceWidth * scale,
                    height: sourceHeight * scale,
                    borderRadius: 16 * scale,
                },
                selected && styles.selected,
                pressed && styles.pressed,
            ]}
        >
            <ChickenSprite
                producing={producing && !careRequired}
                ready={ready}
                index={index}
            />

            {slot.status === 'idle' && (
                <Pressable
                    onPress={event => {
                        event.stopPropagation();
                        onFeed();
                    }}
                    style={styles.feedButton}
                    hitSlop={6}
                >
                    <Text style={styles.feedText}>🌾 えさ</Text>
                </Pressable>
            )}

            {producing && !careRequired && remaining !== '' && (
                <View pointerEvents="none" style={styles.timerBadge}>
                    <Text style={styles.timerText}>⏱ {remaining}</Text>
                </View>
            )}

            {careRequired && (
                <Pressable
                    onPress={event => {
                        event.stopPropagation();
                        onCare();
                    }}
                    style={styles.careButton}
                    hitSlop={8}
                >
                    <Text style={styles.careIcon}>{careIcon}</Text>
                    <View style={styles.alertDot}>
                        <Text style={styles.alertText}>!</Text>
                    </View>
                </Pressable>
            )}

            {ready && (
                <Pressable
                    onPress={event => {
                        event.stopPropagation();
                        onCollect();
                    }}
                    style={styles.eggButton}
                    hitSlop={8}
                >
                    <Image
                        source={CHICKEN.egg}
                        resizeMode="contain"
                        style={styles.egg}
                    />
                    <Text style={styles.collectText}>収穫</Text>
                </Pressable>
            )}
        </Pressable>
    );
}

export default function ChickenWorld({
    slots,
    selectedSlotId,
    now,
    onSelectSlot,
    onFeed,
    onCare,
    onCollect,
}: Props) {
    const [viewport, setViewport] = useState<Viewport>({
        width: 0,
        height: 0,
    });

    const chickenSlots = useMemo(
        () => slots.filter(slot => slot.animalId === 'chicken'),
        [slots]
    );

    function handleLayout(event: LayoutChangeEvent) {
        const { width, height } = event.nativeEvent.layout;
        setViewport({ width, height });
    }

    const scale = viewport.width > 0 && viewport.height > 0
        ? Math.max(
            viewport.width / CANVAS_WIDTH,
            viewport.height / CANVAS_HEIGHT
        )
        : 1;

    const renderedWidth = CANVAS_WIDTH * scale;
    const renderedHeight = CANVAS_HEIGHT * scale;
    const offsetX = (viewport.width - renderedWidth) / 2;
    const offsetY = (viewport.height - renderedHeight) / 2;

    return (
        <View style={styles.world} onLayout={handleLayout}>
            {viewport.width > 0 && (
                <>
                    <Image
                        source={BACKGROUND}
                        resizeMode="stretch"
                        style={[
                            styles.background,
                            {
                                left: offsetX,
                                top: offsetY,
                                width: renderedWidth,
                                height: renderedHeight,
                            },
                        ]}
                    />

                    {chickenSlots.slice(0, NEST_CENTERS.length).map(
                        (slot, index) => (
                            <ChickenSlot
                                key={slot.id}
                                slot={slot}
                                index={index}
                                selected={selectedSlotId === slot.id}
                                now={now}
                                scale={scale}
                                offsetX={offsetX}
                                offsetY={offsetY}
                                onSelect={() => onSelectSlot(slot.id)}
                                onFeed={() => onFeed(slot.id)}
                                onCare={() => onCare(slot.id)}
                                onCollect={() => onCollect(slot.id)}
                            />
                        )
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    world: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: '#78A94E',
    },
    background: {
        position: 'absolute',
    },
    slot: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selected: {
        borderColor: '#FFE47A',
        backgroundColor: 'rgba(255,228,122,0.14)',
        shadowColor: '#FFD43B',
        shadowOpacity: 0.65,
        shadowRadius: 7,
        elevation: 6,
    },
    pressed: {
        opacity: 0.82,
    },
    spriteWrap: {
        width: '82%',
        height: '76%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sprite: {
        width: '100%',
        height: '100%',
    },
    feedButton: {
        position: 'absolute',
        bottom: -3,
        minWidth: 55,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#9A6227',
        backgroundColor: '#FFF0C5',
    },
    feedText: {
        color: '#4C2D14',
        fontSize: 16,
        fontWeight: '900',
        textAlign: 'center',
    },
    timerBadge: {
        position: 'absolute',
        bottom: -3,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: '#D3A94C',
        backgroundColor: 'rgba(64,42,22,0.9)',
    },
    timerText: {
        color: '#FFF4CF',
        fontSize: 15,
        fontWeight: '900',
    },
    careButton: {
        position: 'absolute',
        right: -4,
        top: -8,
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#A86A21',
        backgroundColor: '#FFF1C7',
    },
    careIcon: {
        fontSize: 18,
    },
    alertDot: {
        position: 'absolute',
        right: -4,
        top: -5,
        width: 15,
        height: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E34332',
    },
    alertText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900',
    },
    eggButton: {
        position: 'absolute',
        right: -2,
        bottom: -5,
        width: 42,
        alignItems: 'center',
    },
    egg: {
        width: 34,
        height: 34,
    },
    collectText: {
        marginTop: -3,
        paddingHorizontal: 5,
        paddingVertical: 1,
        overflow: 'hidden',
        borderRadius: 7,
        color: '#5B3416',
        backgroundColor: '#FFF0C5',
        fontSize: 15,
        fontWeight: '900',
    },
});
