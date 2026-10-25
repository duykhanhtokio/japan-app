import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useEffects } from './EffectsProvider';

/** Decorative only: never participates in layout or intercepts map gestures. */
export function SceneLighting({ subtle = false }: { subtle?: boolean }) {
  const { preferences, ready, reduceMotion, active } = useEffects();
  const focused = useIsFocused();
  const { width, height } = useWindowDimensions();
  const phase = useRef(new Animated.Value(0)).current;
  const visible = ready && preferences.lighting && focused && active;
  useEffect(() => {
    phase.setValue(0);
    if (!visible || reduceMotion) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(phase, { toValue: 1, duration: 7500, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      Animated.timing(phase, { toValue: 0, duration: 7500, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [visible, reduceMotion, phase]);
  if (!visible) return null;
  return <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
    style={[StyleSheet.absoluteFillObject, { overflow: 'hidden', opacity: subtle ? .55 : 1 }]}>
    {[0, 1, 2].map(i => <Animated.View key={`ray-${i}`} style={{ position: 'absolute', top: -height * .2,
      left: width * (.1 + i * .3), width: width * .13, height: height * 1.5,
      opacity: phase.interpolate({ inputRange: [0, 1], outputRange: [.35, .7] }),
      transform: [{ translateX: phase.interpolate({ inputRange: [0, 1], outputRange: [-12, 18] }) }, { rotate: '24deg' }] }}>
      {[0, 1, 2, 3, 4].map(j => <View key={j} style={{ position: 'absolute', top: 0, bottom: 0,
        left: `${j * 8}%`, right: `${j * 8}%`, backgroundColor: 'rgba(255,225,158,0.024)' }} />)}
    </Animated.View>)}
    {Array.from({ length: subtle ? 5 : 9 }, (_, i) => <Animated.View key={`light-${i}`} style={{ position: 'absolute',
      left: width * (((i * 37 + 11) % 91) / 100), top: height * (((i * 23 + 19) % 89) / 100),
      width: i % 3 === 0 ? 5 : 3, height: i % 3 === 0 ? 5 : 3, borderRadius: 5,
      backgroundColor: '#ffe6a6', opacity: phase.interpolate({ inputRange: [0, .5, 1], outputRange: i % 2 ? [.15, .6, .25] : [.6, .2, .55] }),
      transform: [{ translateY: phase.interpolate({ inputRange: [0, 1], outputRange: [12, -22 - i * 2] }) },
        { translateX: phase.interpolate({ inputRange: [0, 1], outputRange: [-6, 9] }) }] }} />)}
  </View>;
}
