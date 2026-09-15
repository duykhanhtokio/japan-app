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
    '../../../../assets/game/farm/background/cow_barn_background.png'
);

const COW = {
    idle: require('../../../../assets/game/farm/animals/cow/cow_idle.png'),
    milk: require('../../../../assets/game/farm/animals/cow/milk_can.png'),
} as const;

const CANVAS_WIDTH = 853;
const CANVAS_HEIGHT = 1844;

type SourcePoint = {
    x: number;
    y: number;
};

/*
 * Tọa độ tâm 9 ô bò trên cow_barn_background.png.
 * Mọi tọa độ cùng nằm trên canvas gốc 853 x 1844 nên ảnh và vùng
 * tương tác luôn scale cùng nhau trên iOS, Android và web.
 */
const STALL_CENTERS: readonly SourcePoint[] = [
    { x: 327, y: 596 },
    { x: 441, y: 596 },
    { x: 556, y: 596 },
    { x: 189, y: 756 },
    { x: 185, y: 919 },
    { x: 185, y: 1072 },
    { x: 684, y: 756 },
    { x: 687, y: 919 },
    { x: 687, y: 1072 },
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

function formatRemainingTime(readyAt: number | undefined, now: number) {
    if (readyAt === undefined) return '';

    const seconds = Math.max(0, Math.ceil((readyAt - now) / 1000));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const rest = seconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
    }

    return `${minutes}:${String(rest).padStart(2, '0')}`;
}

function CowSprite({ producing, index }: { producing: boolean; index: number }) {
    const movement = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.delay(index * 85),
                Animated.timing(movement, {
                    toValue: 1,
                    duration: producing ? 620 : 1350,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(movement, {
                    toValue: 0,
                    duration: producing ? 620 : 1350,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();
        return () => animation.stop();
    }, [index, movement, producing]);

    const translateY = movement.interpolate({
        inputRange: [0, 1],
        outputRange: [0, producing ? 4 : -2],
    });

    const rotate = movement.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', producing ? '3deg' : '1deg'],
    });

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.spriteWrap,
                { transform: [{ translateY }, { rotate }] },
            ]}
        >
            <Image source={COW.idle} resizeMode="contain" style={styles.sprite} />
        </Animated.View>
    );
}

function CowSlot({
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
    const center = STALL_CENTERS[index] ?? STALL_CENTERS[0];
    const sourceWidth = index < 3 ? 104 : 112;
    const sourceHeight = 132;
    const careRequirement = slot.production?.careRequirements.find(
        requirement => !requirement.completed && requirement.dueAt <= now
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
                    borderRadius: 15 * scale,
                },
                selected && styles.selected,
                pressed && styles.pressed,
            ]}
        >
            <CowSprite producing={producing && !careRequired} index={index} />

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
                    style={styles.milkButton}
                    hitSlop={8}
                >
                    <Image source={COW.milk} resizeMode="contain" style={styles.milk} />
                    <Text style={styles.collectText}>搾乳</Text>
                </Pressable>
            )}
        </Pressable>
    );
}

export default function CowWorld({
    slots,
    selectedSlotId,
    now,
    onSelectSlot,
    onFeed,
    onCare,
    onCollect,
}: Props) {
    const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });
    const cowSlots = useMemo(
        () => slots.filter(slot => slot.animalId === 'cow'),
        [slots]
    );

    function handleLayout(event: LayoutChangeEvent) {
        const { width, height } = event.nativeEvent.layout;
        setViewport({ width, height });
    }

    const scale = viewport.width > 0 && viewport.height > 0
        ? Math.max(viewport.width / CANVAS_WIDTH, viewport.height / CANVAS_HEIGHT)
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

                    {cowSlots.slice(0, STALL_CENTERS.length).map((slot, index) => (
                        <CowSlot
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
                    ))}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    world: { flex: 1, overflow: 'hidden', backgroundColor: '#79A94D' },
    background: { position: 'absolute' },
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
    pressed: { opacity: 0.82 },
    spriteWrap: {
        width: '84%',
        height: '72%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sprite: { width: '100%', height: '100%' },
    feedButton: {
        position: 'absolute',
        bottom: -3,
        minWidth: 57,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#8A5523',
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
    timerText: { color: '#FFF4CF', fontSize: 15, fontWeight: '900' },
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
    careIcon: { fontSize: 18 },
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
    alertText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
    milkButton: {
        position: 'absolute',
        right: -2,
        bottom: -5,
        width: 42,
        alignItems: 'center',
    },
    milk: { width: 34, height: 34 },
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
