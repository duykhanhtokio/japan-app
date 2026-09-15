import { Redirect, router } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROYAL_FONT, useRoyalPositioning } from '@/components/ui/RoyalSurface';
import { DEVELOPMENT_FEATURES } from '@/config/development-features';

const PETALS = [
  { x: 0.05, delay: 0, duration: 8200, size: 15 },
  { x: 0.16, delay: 2700, duration: 9600, size: 11 },
  { x: 0.29, delay: 900, duration: 8800, size: 14 },
  { x: 0.43, delay: 4300, duration: 10200, size: 10 },
  { x: 0.58, delay: 1800, duration: 9100, size: 13 },
  { x: 0.73, delay: 5200, duration: 9700, size: 11 },
  { x: 0.87, delay: 3200, duration: 8500, size: 15 },
  { x: 0.96, delay: 700, duration: 10400, size: 10 },
] as const;

function FallingPetal({ x, delay, duration, size }: (typeof PETALS)[number]) {
  const { width, height } = useWindowDimensions();
  const fall = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(fall, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(fall, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [delay, duration, fall]);

  return (
    <Animated.Image
      source={require('../../assets/app/welcome/sakura-petal-welcome-v2.png')}
      style={{
        position: 'absolute',
        top: -30,
        left: x * width,
        width: size,
        height: size,
        opacity: fall.interpolate({ inputRange: [0, 0.06, 0.9, 1], outputRange: [0, 0.8, 0.7, 0] }),
        transform: [
          { translateY: fall.interpolate({ inputRange: [0, 1], outputRange: [0, height + 70] }) },
          { translateX: fall.interpolate({ inputRange: [0, 0.3, 0.68, 1], outputRange: [0, 28, -22, 14] }) },
          { rotate: fall.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '620deg'] }) },
        ],
      }}
    />
  );
}

function ShimmerLine({ text, compact }: { text: string; compact: boolean }) {
  const values = useRef(Array.from({ length: text.length }, () => new Animated.Value(0))).current;

  useEffect(() => {
    const sweep = Animated.loop(Animated.sequence([
      Animated.stagger(72, values.map((value) => Animated.sequence([
        Animated.timing(value, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(value, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]))),
      Animated.delay(1250),
    ]));
    sweep.start();
    return () => sweep.stop();
  }, [values]);

  return (
    <View style={styles.shimmerLine}>
      {Array.from(text).map((character, index) => (
        <View key={`${character}-${index}`} style={styles.shimmerCharacter}>
          <Text style={[styles.taglineCharacter, compact && styles.taglineCharacterCompact]}>{character}</Text>
          <Animated.Text
            accessibilityElementsHidden
            style={[
              styles.taglineCharacter,
              styles.taglineHighlight,
              compact && styles.taglineCharacterCompact,
              {
                opacity: values[index],
                transform: [{ scale: values[index].interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }],
              },
            ]}
          >{character}</Animated.Text>
        </View>
      ))}
    </View>
  );
}

function WelcomeTitle({ compact }: { compact: boolean }) {
  const float = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floating = Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: 1, duration: 2100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(float, { toValue: 0, duration: 2100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    const glowing = Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 1250, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0, duration: 1250, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    floating.start();
    glowing.start();
    return () => { floating.stop(); glowing.stop(); };
  }, [float, glow]);

  const titleSize = compact ? 31 : 42;
  return (
    <Animated.View style={[styles.titleWrap, {
      transform: [
        { translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) },
        { rotate: float.interpolate({ inputRange: [0, 1], outputRange: ['-0.25deg', '0.25deg'] }) },
      ],
    }]}>
      <Text accessibilityElementsHidden style={[styles.titleLayer, styles.titleDeep, { fontSize: titleSize }]}>日本へようこそ！</Text>
      <Text accessibilityElementsHidden style={[styles.titleLayer, styles.titleMid, { fontSize: titleSize }]}>日本へようこそ！</Text>
      <Text style={[styles.titleFace, { fontSize: titleSize }]}>
        <Text style={styles.red}>日</Text><Text style={styles.coral}>本</Text><Text style={styles.gold}>へ</Text><Text style={styles.sky}>ようこそ</Text><Text style={styles.red}>！</Text>
      </Text>
      <Animated.View pointerEvents="none" style={[styles.titleGlow, {
        opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.75] }),
        transform: [{ scaleX: glow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1.15] }) }],
      }]} />
      <View style={styles.tagline}>
        <ShimmerLine compact={compact} text="育成就労と、日本で暮らすすべての人のための" />
        <ShimmerLine compact={compact} text="総合学習・生活ガイド" />
      </View>
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  if (DEVELOPMENT_FEATURES.skipRegistration) return <Redirect href="/home" />;

  return <WelcomeContent />;
}

function WelcomeContent() {
  const royalPosition = useRoyalPositioning();
  const insets = useSafeAreaInsets();
  const { isLandscape } = royalPosition;
  const compact = royalPosition.isCompactPhone;
  const startWidth = Math.min(
    royalPosition.width - 32,
    isLandscape ? 520 : 370,
  );
  const startLeft = (royalPosition.width - startWidth) / 2;
  const camera = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  const background = useMemo(
    () => isLandscape
      ? require('../../assets/app/welcome/welcome-japan-landscape-v2.png')
      : require('../../assets/app/welcome/welcome-japan-portrait-v2.png'),
    [isLandscape],
  );

  useEffect(() => {
    console.log('[ROYAL_LAYOUT] welcome-centered-frame-v17.8');
    const cameraMove = Animated.loop(Animated.sequence([
      Animated.timing(camera, { toValue: 1, duration: 9000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(camera, { toValue: 0, duration: 9000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    const buttonPulse = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    cameraMove.start();
    buttonPulse.start();
    return () => { cameraMove.stop(); buttonPulse.stop(); };
  }, [camera, pulse]);

  return (
    <View style={styles.screen}>
      <Animated.Image
        source={background}
        resizeMode="cover"
        blurRadius={16}
        style={[styles.backgroundFill, {
          transform: [
            { scale: camera.interpolate({ inputRange: [0, 1], outputRange: [1.08, 1.12] }) },
            { translateX: camera.interpolate({ inputRange: [0, 1], outputRange: [-2, 3] }) },
            { translateY: camera.interpolate({ inputRange: [0, 1], outputRange: [2, -3] }) },
          ],
        }]}
      />
      <View pointerEvents="none" style={styles.backdropTint} />
      <Animated.Image
        source={background}
        resizeMode="contain"
        style={[styles.backgroundContain, {
          transform: [
            { scale: camera.interpolate({ inputRange: [0, 1], outputRange: [0.995, 1.008] }) },
            { translateY: camera.interpolate({ inputRange: [0, 1], outputRange: [1.5, -1.5] }) },
          ],
        }]}
      />
      <View pointerEvents="none" style={styles.colorWash} />
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {PETALS.map((petal, index) => <FallingPetal key={index} {...petal} />)}
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.titleArea, isLandscape && styles.titleAreaLandscape]}>
          <WelcomeTitle compact={compact || isLandscape} />
        </View>

      </SafeAreaView>

      <View style={[styles.bottomArea, { width: startWidth, left: startLeft, bottom: insets.bottom + (isLandscape ? 6 : 22) }]}>
        <Pressable onPress={() => router.push('/portal')} style={({ pressed }) => [styles.startHitbox, pressed && styles.pressed]}>
          <Animated.View style={[styles.startPulse, {
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] }),
            transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.99, 1.015] }) }],
          }]}>
            <Image source={require('../../assets/app/ui/royal-af/button-wide-v2.png')} resizeMode="stretch" style={styles.startFrame} />
            <View pointerEvents="none" style={styles.startContent}>
              <Text style={styles.startText}><Text style={styles.red}>PRESS</Text><Text style={styles.coral}> TO </Text><Text style={styles.gold}>ST</Text><Text style={styles.sky}>AR</Text><Text style={styles.red}>T</Text></Text>
            </View>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, overflow: 'hidden', backgroundColor: '#61b9e6' },
  backgroundFill: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', opacity: 0.8 },
  backgroundContain: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  backdropTint: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(42,103,133,0.12)' },
  colorWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(24,75,97,0.025)' },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  titleArea: { alignItems: 'center', paddingTop: 20, paddingHorizontal: 12 },
  titleAreaLandscape: { paddingTop: 4 },
  titleWrap: { alignItems: 'center', justifyContent: 'center' },
  titleLayer: { position: 'absolute', top: 0, fontWeight: '900', letterSpacing: 1.2 },
  titleDeep: { color: '#7c3d5c', transform: [{ translateX: 3 }, { translateY: 6 }] },
  titleMid: { color: '#fff4bd', transform: [{ translateX: 1.5 }, { translateY: 3 }] },
  titleFace: { fontWeight: '900', letterSpacing: 1.2, textShadowColor: 'rgba(255,255,255,0.95)', textShadowOffset: { width: 0, height: -1 }, textShadowRadius: 4 },
  red: { color: '#f15f72' },
  coral: { color: '#ff8b68' },
  gold: { color: '#f7c84b' },
  sky: { color: '#52b9df' },
  titleGlow: { width: '78%', height: 3, borderRadius: 3, marginTop: 6, backgroundColor: '#fff5a6', shadowColor: '#fff3a1', shadowOpacity: 1, shadowRadius: 10 },
  tagline: { marginTop: 12, alignItems: 'center', paddingHorizontal: 4 },
  shimmerLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: 21 },
  shimmerCharacter: { position: 'relative' },
  taglineCharacter: { color: '#183f58', fontSize: 16, lineHeight: 20, fontWeight: '900', letterSpacing: 0.1, textShadowColor: 'rgba(255,255,255,0.95)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  taglineCharacterCompact: { fontSize: 16.5, lineHeight: 18 },
  taglineHighlight: { position: 'absolute', top: 0, left: 0, color: '#fff3a0', textShadowColor: '#ffffff', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 7 },
  bottomArea: { position:'absolute',height:88 },
  startHitbox: { flex:1,alignItems:'stretch',justifyContent:'center' },
  startPulse:{flex:1,position:'relative'},
  startFrame:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},
  startContent:{...StyleSheet.absoluteFillObject,alignItems:'center',justifyContent:'center',paddingHorizontal:42},
  startText: { width:'100%',fontSize: 18, lineHeight:26,fontFamily:ROYAL_FONT.heading,fontWeight: '900', letterSpacing: 3, textAlign:'center',textAlignVertical:'center',includeFontPadding:false,textShadowColor: 'rgba(255,255,255,.95)', textShadowOffset: { width: 0, height: 1 },textShadowRadius:5 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
});
