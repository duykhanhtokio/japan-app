import { EffectPressable as Pressable } from '@/components/effects/EffectPressable';
import type { PropsWithChildren } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
export const WorldAnimatedView = Animated.View;
export function DepthPressable({ children, onPress, style, accessibilityLabel }: PropsWithChildren<{ onPress:()=>void; style?:StyleProp<ViewStyle>; accessibilityLabel?:string }>) {
  return <View style={style}><Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={styles.fill}>{children}</Pressable></View>;
}
const styles = StyleSheet.create({ fill: { flex: 1 } });
