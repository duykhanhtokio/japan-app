import { useEffect, useRef } from 'react';
import { Animated, Easing, ImageSourcePropType, StyleSheet, useWindowDimensions, View } from 'react-native';

export type NpcMotionState='idle'|'speaking'|'finish';
type Props={idle:ImageSourcePropType;talk:ImageSourcePropType;finish:ImageSourcePropType;state:NpcMotionState};

/** Stable layered actor: the body never rocks or scales. Only pose layers fade. */
export function NpcActor({idle,talk,finish,state}:Props){
  const {width,height}=useWindowDimensions();
  const landscape=width>height;
  const tablet=Math.min(width,height)>=700;
  const idleOpacity=useRef(new Animated.Value(1)).current;
  const talkOpacity=useRef(new Animated.Value(0)).current;
  const finishOpacity=useRef(new Animated.Value(0)).current;
  const mouth=useRef(new Animated.Value(0)).current;
  const breath=useRef(new Animated.Value(0)).current;
  const bow=useRef(new Animated.Value(0)).current;
  const usesDedicatedTalkPose=talk!==idle;
  const usesDedicatedPoses=usesDedicatedTalkPose||finish!==idle;
  useEffect(()=>{
    Animated.parallel([
      Animated.timing(idleOpacity,{toValue:state==='idle'?1:0,duration:260,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
      Animated.timing(talkOpacity,{toValue:state==='speaking'?1:0,duration:320,easing:Easing.inOut(Easing.cubic),useNativeDriver:true}),
      Animated.timing(finishOpacity,{toValue:state==='finish'?1:0,duration:420,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
    ]).start();
  },[finishOpacity,idleOpacity,state,talkOpacity]);
  useEffect(()=>{
    mouth.stopAnimation();
    mouth.setValue(0);
    if(state!=='speaking'||usesDedicatedTalkPose)return;
    const loop=Animated.loop(Animated.sequence([
      Animated.timing(mouth,{toValue:1,duration:135,easing:Easing.out(Easing.quad),useNativeDriver:true}),
      Animated.timing(mouth,{toValue:.22,duration:110,easing:Easing.inOut(Easing.quad),useNativeDriver:true}),
      Animated.delay(75),
      Animated.timing(mouth,{toValue:.82,duration:120,easing:Easing.out(Easing.quad),useNativeDriver:true}),
      Animated.timing(mouth,{toValue:0,duration:145,easing:Easing.in(Easing.quad),useNativeDriver:true}),
      Animated.delay(95),
    ]));
    loop.start();
    return()=>loop.stop();
  },[mouth,state,usesDedicatedTalkPose]);
  useEffect(()=>{
    // Breathing is applied only to the upper-body layer. The feet and body
    // position remain fixed, so the character never rocks as one flat image.
    const loop=Animated.loop(Animated.sequence([
      Animated.timing(breath,{toValue:1,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
      Animated.timing(breath,{toValue:0,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
    ]));
    loop.start();
    return()=>loop.stop();
  },[breath]);
  useEffect(()=>{
    bow.stopAnimation();
    bow.setValue(0);
    if(state!=='finish'||usesDedicatedPoses)return;
    Animated.sequence([
      Animated.timing(bow,{toValue:1,duration:420,easing:Easing.inOut(Easing.cubic),useNativeDriver:true}),
      Animated.delay(520),
      Animated.timing(bow,{toValue:0,duration:520,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
    ]).start();
  },[bow,state,usesDedicatedPoses]);
  const actorHeight=landscape?height*.92:tablet?height*.75:height*.72;
  const actorWidth=landscape?Math.min(width*.48,height*.72):Math.min(width*1.04,height*.68);
  const layerStyle={width:actorWidth,height:actorHeight};
  return <View pointerEvents="none" style={styles.root}>
    <View style={styles.shadow}/>
    {usesDedicatedPoses?<>
      <Animated.Image source={idle} resizeMode="contain" style={[styles.layer,layerStyle,{opacity:idleOpacity}]}/>
      <Animated.Image source={talk} resizeMode="contain" style={[styles.layer,layerStyle,{opacity:talkOpacity}]}/>
      <Animated.Image source={finish} resizeMode="contain" style={[styles.layer,layerStyle,{opacity:finishOpacity}]}/>
    </>:<>
      <View style={[styles.lowerClip,{width:actorWidth,height:actorHeight*.46}]}>
        <Animated.Image source={idle} resizeMode="contain" style={[styles.splitImage,layerStyle]}/>
      </View>
      <Animated.View style={[
        styles.upperClip,
        {width:actorWidth,height:actorHeight*.54,bottom:actorHeight*.46},
        {transform:[
          {translateY:breath.interpolate({inputRange:[0,1],outputRange:[0,-1.5]})},
          {translateY:bow.interpolate({inputRange:[0,1],outputRange:[0,5]})},
          {scaleY:bow.interpolate({inputRange:[0,1],outputRange:[1,.975]})},
        ]},
      ]}>
        <Animated.Image source={idle} resizeMode="contain" style={[styles.splitImage,layerStyle,{bottom:-actorHeight*.46}]}/>
      </Animated.View>
    </>}
    {!usesDedicatedTalkPose&&<Animated.View style={[
      styles.mouth,
      {
        bottom:actorHeight*.807,
        opacity:mouth,
        transform:[{scaleY:mouth.interpolate({inputRange:[0,1],outputRange:[.28,1.35]})}],
      },
    ]}/>} 
  </View>;
}
const styles=StyleSheet.create({
  root:{...StyleSheet.absoluteFillObject,zIndex:3,alignItems:'center',justifyContent:'flex-end'},
  layer:{position:'absolute',bottom:0},
  lowerClip:{position:'absolute',bottom:0,overflow:'hidden'},
  upperClip:{position:'absolute',overflow:'hidden'},
  splitImage:{position:'absolute',bottom:0,left:0},
  shadow:{position:'absolute',bottom:7,width:'28%',height:18,borderRadius:999,backgroundColor:'rgba(20,13,9,.18)'},
  mouth:{position:'absolute',zIndex:8,width:7,height:4,borderRadius:8,backgroundColor:'#7d302f'},
});
