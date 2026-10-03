import { ROYAL_FONT } from '@/components/ui/RoyalSurface';
import FarmBadgeFrame from './FarmBadgeFrame';
import FarmAreaIcon from './FarmAreaIcon';
import { Image as CachedImage } from 'expo-image';
import {
    Animated,
    Easing,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from 'react-native';

import {
    useEffect,
    useMemo,
    useRef,
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
const LANDSCAPE_WIDTH = 1672;
const LANDSCAPE_HEIGHT = 941;
const LANDSCAPE_BACKGROUND = require('../../../../assets/game/farm/background/cow_barn_landscape_v1.png');

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
const LANDSCAPE_STALL_CENTERS: readonly SourcePoint[] = [
    ...[0.37, 0.50, 0.63].map(x => ({ x: x * LANDSCAPE_WIDTH, y: 0.30 * LANDSCAPE_HEIGHT })),
    ...[0.37, 0.50, 0.63].map(x => ({ x: x * LANDSCAPE_WIDTH, y: 0.48 * LANDSCAPE_HEIGHT })),
    ...[0.37, 0.50, 0.63].map(x => ({ x: x * LANDSCAPE_WIDTH, y: 0.65 * LANDSCAPE_HEIGHT })),
];

type Props = {
    slots: readonly AnimalSlotState[];
    selectedSlotId: string | null;
    now: number;
    onSelectSlot: (slotId: string) => void;
    onFeed: (slotId: string) => void;
    onCare: (slotId: string) => void;
    onCollect: (slotId: string) => void;
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
    landscape,
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
    landscape: boolean;
    onSelect: () => void;
    onFeed: () => void;
    onCare: () => void;
    onCollect: () => void;
}) {
    const centers = landscape ? LANDSCAPE_STALL_CENTERS : STALL_CENTERS;
    const center = centers[index] ?? centers[0];
    const sourceWidth = landscape ? 130 : index < 3 ? 104 : 112;
    const sourceHeight = landscape ? 115 : 132;
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
    const careLabel = careRequirement?.type === 'drink' ? '水' : '!';

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
                ><FarmBadgeFrame/>
                    <View style={{flexDirection:"row",alignItems:"center",gap:3}}><FarmAreaIcon name="rice" size={16}/><Text numberOfLines={1} style={styles.feedText}>えさ</Text></View>
                </Pressable>
            )}

            {producing && !careRequired && remaining !== '' && (
                <View pointerEvents="none" style={styles.timerBadge}><FarmBadgeFrame dark/>
                    <Text style={styles.timerText}>{remaining}</Text>
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
                ><FarmBadgeFrame/>
                    {careRequirement?.type === 'feed' ? <FarmAreaIcon name="rice" size={24}/> : <Text style={styles.careIcon}>{careLabel}</Text>}
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
                    <View style={styles.collectBadge}><FarmBadgeFrame/><Text numberOfLines={1} style={styles.collectText}>搾乳</Text></View>
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
    const viewport=useWindowDimensions();
    const isLandscape = viewport.width > viewport.height;
    const sourceWidth = isLandscape ? LANDSCAPE_WIDTH : CANVAS_WIDTH;
    const sourceHeight = isLandscape ? LANDSCAPE_HEIGHT : CANVAS_HEIGHT;
    const centers = isLandscape ? LANDSCAPE_STALL_CENTERS : STALL_CENTERS;
    const cowSlots = useMemo(
        () => slots.filter(slot => slot.animalId === 'cow'),
        [slots]
    );


    const scale = viewport.width > 0 && viewport.height > 0
        ? Math.max(viewport.width / sourceWidth, viewport.height / sourceHeight)
        : 1;
    const renderedWidth = sourceWidth * scale;
    const renderedHeight = sourceHeight * scale;
    const offsetX = (viewport.width - renderedWidth) / 2;
    const offsetY = (viewport.height - renderedHeight) / 2;

    return (
        <View style={styles.world}>
            <CachedImage source={isLandscape ? LANDSCAPE_BACKGROUND : BACKGROUND} contentFit="cover" transition={0} cachePolicy="memory-disk" style={[StyleSheet.absoluteFill,{width:'100%',height:'100%'}]} />
            {(
                <>
                    {cowSlots.slice(0, centers.length).map((slot, index) => (
                        <CowSlot
                            key={slot.id}
                            slot={slot}
                            index={index}
                            selected={selectedSlotId === slot.id}
                            now={now}
                            scale={scale}
                            offsetX={offsetX}
                            offsetY={offsetY}
                            landscape={isLandscape}
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
    world: { flex: 1, overflow: 'hidden', backgroundColor: '#142847' },
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
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderRadius: 12,



    },
    feedText: {fontFamily: ROYAL_FONT.body,

        color: '#4C2D14',
        fontSize: 11,
        fontWeight: '900',
        textAlign: 'center',
    },
    timerBadge: {
        position: 'absolute',
        bottom: -3,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 11,



    },
    timerText: {fontFamily: ROYAL_FONT.body,
 color: '#FFF4CF', fontSize: 15, fontWeight: '900' },
    careButton: {
        position: 'absolute',
        right: -4,
        top: -8,
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',



    },
    careIcon: {fontFamily: ROYAL_FONT.body,
 fontSize: 18 },
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
    alertText: {fontFamily: ROYAL_FONT.body,
 color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
    milkButton: {
        position: 'absolute',
        right: -2,
        bottom: -5,
        width: 42,
        alignItems: 'center',
    },
    milk: { width: 34, height: 34 },
    collectBadge: {
        minWidth: 52,
        marginTop: -3,
        paddingHorizontal: 7,
        paddingVertical: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    collectText: {fontFamily: ROYAL_FONT.body,
        color: '#5B3416',
        fontSize: 15,
        fontWeight: '900',
    },
});
