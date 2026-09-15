import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, useWindowDimensions, View } from 'react-native';

const PETALS = [
  { x: 0.06, delay: 0, duration: 7600, size: 18 },
  { x: 0.18, delay: 1700, duration: 9100, size: 13 },
  { x: 0.31, delay: 600, duration: 8200, size: 16 },
  { x: 0.47, delay: 2600, duration: 9800, size: 12 },
  { x: 0.61, delay: 1100, duration: 8500, size: 17 },
  { x: 0.76, delay: 3400, duration: 9300, size: 14 },
  { x: 0.91, delay: 2100, duration: 8000, size: 16 },
];

function Petal({ x, delay, duration, size, height, width }: (typeof PETALS)[number] & { height: number; width: number }) {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const run = Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(progress, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(progress, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]));
    run.start();
    return () => run.stop();
  }, [delay, duration, progress]);
  return <Animated.Image source={require('../../../assets/app/registration/sakura-petal-v2.png')} style={{
    position: 'absolute', left: x * width, top: -28, width: size, height: size,
    opacity: progress.interpolate({ inputRange: [0, 0.08, 0.9, 1], outputRange: [0, 0.82, 0.74, 0] }),
    transform: [
      { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, height + 70] }) },
      { translateX: progress.interpolate({ inputRange: [0, 0.35, 0.72, 1], outputRange: [0, 28, -18, 16] }) },
      { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '520deg'] }) },
    ],
  }} />;
}

export function SakuraPetalField() {
  const { height, width } = useWindowDimensions();
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{PETALS.map((petal, index) => <Petal key={index} {...petal} height={height} width={width} />)}</View>;
}
