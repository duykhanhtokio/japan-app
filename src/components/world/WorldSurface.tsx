import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

export const WorldAnimatedView = Animated.View;
export const worldEnter = FadeInDown.springify().damping(17).stiffness(155);
export const worldFade = FadeIn.duration(360);

export function DepthPressable({ children, onPress, style, accessibilityLabel }: PropsWithChildren<{ onPress:()=>void; style?:StyleProp<ViewStyle>; accessibilityLabel?:string }>) {
  const pressed=useSharedValue(0);
  const animated=useAnimatedStyle(()=>({transform:[{translateY:interpolate(pressed.value,[0,1],[0,4])},{scale:interpolate(pressed.value,[0,1],[1,.975])}],shadowOpacity:interpolate(pressed.value,[0,1],[.24,.08])}));
  return <Animated.View style={[styles.depth,style,animated]}><Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} onPressIn={()=>{pressed.value=withTiming(1,{duration:90})}} onPressOut={()=>{pressed.value=withSpring(0,{damping:13,stiffness:250})}} style={styles.fill}>{children}</Pressable></Animated.View>;
}

const styles=StyleSheet.create({depth:{shadowColor:'#020713',shadowOffset:{width:0,height:9},shadowOpacity:.48,shadowRadius:11,elevation:10},fill:{flex:1}});
