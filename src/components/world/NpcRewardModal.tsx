import { useEffect, useRef } from 'react';
import { Animated, Image, ImageBackground, Modal, StyleSheet, Text, View } from 'react-native';
import { npcForCategory, sceneForCategory } from '@/components/world/life-assets';
import type { NpcCategory } from '@/data/npc-progression';
import { RoyalButton, ROYAL, ROYAL_FONT } from '@/components/ui/RoyalSurface';

const PROGRESS_FRAMES=[
 require('../../../assets/app/ui/royal-af/reward-grape-stars-0-v2.png'),
 require('../../../assets/app/ui/royal-af/reward-grape-stars-1-v2.png'),
 require('../../../assets/app/ui/royal-af/reward-grape-stars-2-v2.png'),
 require('../../../assets/app/ui/royal-af/reward-grape-stars-3-v2.png'),
 require('../../../assets/app/ui/royal-af/reward-grape-stars-4-v2.png'),
 require('../../../assets/app/ui/royal-af/reward-grape-stars-5-v2.png'),
];

export default function NpcRewardModal({visible,category,progress,isUnlock,onClose}:{visible:boolean;category:NpcCategory|null;progress:number;isUnlock:boolean;onClose:()=>void}){
 const reveal=useRef(new Animated.Value(0)).current;
 useEffect(()=>{if(!visible)return;reveal.setValue(0);Animated.spring(reveal,{toValue:1,speed:7,bounciness:9,useNativeDriver:true}).start()},[visible,reveal]);
 if(!category)return null;
 const stars=isUnlock?5:Math.max(0,Math.min(5,progress));
 const revealed=isUnlock||stars>=5;
 return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}><View style={s.backdrop}>
  <Text style={s.kicker}>{revealed?'おめでとう！':'課題達成！'}</Text><Text style={s.heading}>{revealed?'新しい仲間が加わりました！':'カードゲージが増えました！'}</Text>
  <Animated.View style={[s.card,{transform:[{perspective:1000},{rotateY:reveal.interpolate({inputRange:[0,.44,1],outputRange:['92deg','-9deg','0deg']})}],opacity:reveal}]}> 
   <Image source={PROGRESS_FRAMES[stars]} resizeMode="stretch" style={s.frame}/>
   <View style={s.sceneWindow}><ImageBackground source={sceneForCategory(category.category)} resizeMode="cover" style={s.scene}><View style={s.characterWindow}><Image source={npcForCategory(category.category)} resizeMode="contain" style={[s.npc,!revealed&&s.lockedNpc]}/>{!revealed&&<Text style={s.lock}>?</Text>}</View></ImageBackground></View>
   <View style={s.namePlate}><Text style={s.job}>{revealed?category.ja:'？？？'}</Text><Text style={s.category}>{revealed?'仲間カード':'次の仲間'}</Text></View>
  </Animated.View>
  <Text style={s.message}>{revealed?'このNPCがいるロケーションで会話できるようになりました。':`あと${5-stars}課題で新しいNPCを解放できます。`}</Text>
  <RoyalButton onPress={onClose} style={s.button}><Text style={s.buttonText}>{revealed?'カードを受け取る':'続ける'}</Text></RoyalButton>
 </View></Modal>
}

const s=StyleSheet.create({
 backdrop:{flex:1,alignItems:'center',justifyContent:'center',padding:20,backgroundColor:'rgba(3,9,21,.93)',overflow:'hidden'},kicker:{zIndex:3,color:ROYAL.paleGold,fontFamily:ROYAL_FONT.body,fontSize:14,letterSpacing:3.2,textShadowColor:'#3e2c11',textShadowOffset:{width:0,height:2},textShadowRadius:5},heading:{zIndex:3,color:'#f8efd9',fontFamily:ROYAL_FONT.heading,fontSize:24,lineHeight:35,textAlign:'center',marginTop:5,textShadowColor:'#080d15',textShadowOffset:{width:0,height:3},textShadowRadius:6},
 card:{zIndex:3,width:286,aspectRatio:2/3,marginTop:10},sceneWindow:{position:'absolute',zIndex:2,left:'11.5%',right:'11.5%',top:'10.6%',height:'59.5%',overflow:'hidden'},scene:{flex:1},characterWindow:{position:'absolute',left:'2%',right:'2%',top:'2%',bottom:0,alignItems:'center',overflow:'hidden'},npc:{position:'absolute',top:'-2%',width:'205%',height:'225%'},lockedNpc:{tintColor:'#020307',opacity:.97},lock:{position:'absolute',top:'34%',color:ROYAL.white,fontFamily:ROYAL_FONT.heading,fontSize:58,textShadowColor:'#000',textShadowOffset:{width:0,height:4},textShadowRadius:7},frame:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%',zIndex:1},namePlate:{position:'absolute',zIndex:4,left:'14%',right:'14%',top:'71.7%',height:'11.2%',alignItems:'center',justifyContent:'center'},job:{width:'100%',color:'#332717',fontFamily:ROYAL_FONT.heading,fontSize:17,lineHeight:22,textAlign:'center',includeFontPadding:false},category:{width:'100%',color:'#77603a',fontFamily:ROYAL_FONT.body,fontSize:10,lineHeight:14,letterSpacing:1,textAlign:'center',includeFontPadding:false},
 message:{zIndex:3,maxWidth:360,color:'#eaf7ff',fontFamily:ROYAL_FONT.body,fontSize:15,lineHeight:22,textAlign:'center',marginTop:14},button:{zIndex:3,minWidth:230,minHeight:56,marginTop:14},buttonText:{color:'#fff',fontFamily:ROYAL_FONT.heading,fontSize:17},
});
