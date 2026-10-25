import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useEffects } from './EffectsProvider';

export function LanternGlow() {
  const { ready, preferences, reduceMotion, active } = useEffects();
  const focused = useIsFocused();
  const glow = useRef(new Animated.Value(.45)).current;
  const visible = ready && preferences.lighting && focused && active;
  useEffect(() => {
    glow.setValue(.45);
    if (!visible || reduceMotion) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: .8, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      Animated.timing(glow, { toValue: .45, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [visible, reduceMotion, glow]);
  if (!visible) return null;
  return <Animated.View pointerEvents="none" accessible={false} style={{ position: 'absolute', left: -8, right: -8,
    top: 5, bottom: 5, borderRadius: 50, backgroundColor: 'rgba(255,187,65,.12)', opacity: glow }} />;
}
