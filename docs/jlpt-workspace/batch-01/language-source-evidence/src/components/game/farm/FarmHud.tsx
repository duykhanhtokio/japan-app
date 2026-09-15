import {
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useRoyalPositioning } from '@/components/ui/RoyalPositioning';

import { router } from 'expo-router';

const HUD_TOP = require('../../../../assets/game/farm/hud/hud_top_cluster_v4.png');

const HUD_ASPECT_RATIO = 2071 / 299;

type Props = {
    level: number;
    xpCurrent: number;
    xpMax: number;
    gold: number;
    diamonds: number;
    keys: number;
    onGoldPlus: () => void;
    onDiamondPlus: () => void;
};

export default function FarmHud({
    level,
    xpCurrent,
    xpMax,
    gold,
    diamonds,
    keys,
    onGoldPlus,
    onDiamondPlus,
}: Props) {
    const { width } = useRoyalPositioning();
    const hudWidth = Math.min(width - 12, 900);
    const hudHeight = hudWidth / HUD_ASPECT_RATIO;
    const fontSize = Math.max(9, Math.min(14, hudWidth * 0.029));

    return (
        <View style={[styles.container, { width: hudWidth, height: hudHeight }]}>
            <ImageBackground
                source={HUD_TOP}
                resizeMode="contain"
                style={styles.artwork}
            >
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="ホームへ戻る"
                    onPress={() => router.replace('/home')}
                    style={({ pressed }) => [styles.homeHitArea, pressed && styles.pressed]}
                />

                <Text
                    numberOfLines={1}
                    style={[styles.level, { fontSize }]}
                >
                    Lv. {level}
                </Text>

                <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.65}
                    style={[styles.xpText, { fontSize: fontSize * 0.67 }]}
                >
                    {xpCurrent}/{xpMax}
                </Text>

                <HudValue value={gold} left="51.3%" width="11.2%" fontSize={fontSize} />
                <HudValue value={diamonds} left="71.5%" width="10.8%" fontSize={fontSize} />
                <HudValue value={keys} left="89.5%" width="8.2%" fontSize={fontSize} />

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="ゴールドを追加"
                    hitSlop={4}
                    onPress={onGoldPlus}
                    style={({ pressed }) => [styles.goldPlusHitArea, pressed && styles.pressed]}
                />

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="ダイヤを追加"
                    hitSlop={4}
                    onPress={onDiamondPlus}
                    style={({ pressed }) => [styles.diamondPlusHitArea, pressed && styles.pressed]}
                />
            </ImageBackground>
        </View>
    );
}

function HudValue({
    value,
    left,
    width,
    fontSize,
}: {
    value: number;
    left: `${number}%`;
    width: `${number}%`;
    fontSize: number;
}) {
    return (
        <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            style={[styles.value, { left, width, fontSize }]}
        >
            {value.toLocaleString()}
        </Text>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
    },
    artwork: {
        width: '100%',
        height: '100%',
    },
    pressed: {
        opacity: 0.62,
        transform: [{ scale: 0.94 }],
    },
    homeHitArea: {
        position: 'absolute',
        left: '0.6%',
        top: '4%',
        width: '12.5%',
        height: '90%',
        borderRadius: 999,
    },
    level: {
        position: 'absolute',
        left: '26.4%',
        top: '17%',
        width: '15%',
        color: '#4A2A12',
        fontWeight: '900',
    },
    xpText: {
        position: 'absolute',
        left: '28.1%',
        top: '59%',
        width: '15.2%',
        color: '#FFFFFF',
        fontWeight: '900',
        textAlign: 'center',
        textShadowColor: '#24430E',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
    value: {
        position: 'absolute',
        top: '39%',
        color: '#4A2A12',
        fontWeight: '900',
        textAlign: 'center',
        fontVariant: ['tabular-nums'],
    },
    goldPlusHitArea: {
        position: 'absolute',
        left: '63.0%',
        top: '58%',
        width: '5.0%',
        height: '40%',
        borderRadius: 999,
    },
    diamondPlusHitArea: {
        position: 'absolute',
        left: '82.8%',
        top: '58%',
        width: '5.0%',
        height: '40%',
        borderRadius: 999,
    },
});
