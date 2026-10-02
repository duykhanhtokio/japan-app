import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function WaitingSpeechDots(){
 const lights=useRef(Array.from({length:6},()=>new Animated.Value(.2))).current;
 useEffect(()=>{
  const loop=Animated.loop(Animated.sequence([
   ...lights.map(value=>Animated.timing(value,{toValue:1,duration:160,useNativeDriver:true})),
   Animated.delay(240),
   Animated.parallel(lights.map(value=>Animated.timing(value,{toValue:.2,duration:180,useNativeDriver:true}))),
  ]));loop.start();return()=>loop.stop();
 },[lights]);
 return <View accessibilityLabel="マイク入力待ち" style={s.row}>{lights.map((opacity,index)=><Animated.View key={index} style={[s.dot,{opacity}]}/>)}</View>;
}
const s=StyleSheet.create({row:{minHeight:32,flexDirection:'row',justifyContent:'center',alignItems:'center',gap:9},dot:{width:6,height:6,borderRadius:3,backgroundColor:'#bd8b30',shadowColor:'#e9bc55',shadowOpacity:.9,shadowRadius:4,shadowOffset:{width:0,height:0}}});
