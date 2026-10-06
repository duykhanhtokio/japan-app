import { Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
 const {width,height,fontScale}=useWindowDimensions();
 const insets=useSafeAreaInsets();
 // Reserve room for the copy and close control, including larger system text.
 // Scrolling keeps every control reachable in landscape and large type.
 const wide=width>height;
 const availableHeight=height-insets.top-insets.bottom-32;
 const cardWidth=Math.max(100,Math.min(240,width-insets.left-insets.right-40,(availableHeight-(wide?110:240)*Math.max(1,fontScale))/1.5));
 if(!visible||!category)return null;
 const stars=isUnlock?5:Math.max(0,Math.min(5,progress));
 const revealed=isUnlock||stars>=5;
 return <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent><View testID="npc-reward-modal" accessibilityViewIsModal style={[s.backdrop,{paddingTop:insets.top+16,paddingBottom:insets.bottom+16,paddingLeft:insets.left+20,paddingRight:insets.right+20}]}>
 <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
  <Text style={s.kicker}>{revealed?'おめでとう！':'課題達成！'}</Text><Text style={s.heading}>{revealed?'新しい仲間が加わりました！':'カードゲージが増えました！'}</Text>
  <View style={[s.body,wide&&s.bodyWide]}>
  <View style={[s.card,{width:cardWidth}]}>
   <Image fadeDuration={0} source={PROGRESS_FRAMES[stars]} resizeMode="stretch" style={s.frame}/>
   <View style={s.sceneWindow}><ImageBackground source={sceneForCategory(category.category)} resizeMode="cover" style={s.scene}><View style={s.characterWindow}><Image fadeDuration={0} source={npcForCategory(category.category)} resizeMode="contain" style={[s.npc,!revealed&&s.lockedNpc]}/>{!revealed&&<Text style={s.lock}>?</Text>}</View></ImageBackground></View>
   <View style={s.namePlate}><Text numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1} style={s.job}>{revealed?category.ja:'？？？'}</Text><Text numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1} style={s.category}>{revealed?'仲間カード':'次の仲間'}</Text></View>
  </View>
  <View style={[s.details,wide&&s.detailsWide]}>
  <Text style={s.message}>{revealed?'このNPCがいるロケーションで会話できるようになりました。':`あと${5-stars}課題で新しいNPCを解放できます。`}</Text>
  <RoyalButton onPress={onClose} style={s.button}><Text style={s.buttonText}>{revealed?'カードを受け取る':'続ける'}</Text></RoyalButton>
 </View></View>
 </ScrollView></View></Modal>
}

const s=StyleSheet.create({
 body:{width:'100%',alignItems:'center'},bodyWide:{flexDirection:'row',justifyContent:'center',gap:24},details:{alignItems:'center',maxWidth:360},detailsWide:{flex:1},
 backdrop:{flex:1,backgroundColor:ROYAL.lacquer,overflow:'hidden'},scroll:{flex:1,width:'100%'},content:{flexGrow:1,alignItems:'center',justifyContent:'center',paddingVertical:8},kicker:{zIndex:3,color:ROYAL.paleGold,fontFamily:ROYAL_FONT.body,fontSize:14,letterSpacing:3.2,textShadowColor:'#3e2c11',textShadowOffset:{width:0,height:2},textShadowRadius:5},heading:{zIndex:3,color:'#f8efd9',fontFamily:ROYAL_FONT.heading,fontSize:24,lineHeight:35,textAlign:'center',marginTop:5,textShadowColor:'#080d15',textShadowOffset:{width:0,height:3},textShadowRadius:6},
 card:{zIndex:3,flexShrink:0,aspectRatio:2/3,marginTop:10},sceneWindow:{position:'absolute',zIndex:2,left:'11.5%',right:'11.5%',top:'10.6%',height:'59.5%',overflow:'hidden'},scene:{flex:1},characterWindow:{position:'absolute',left:'2%',right:'2%',top:'2%',bottom:0,alignItems:'center',overflow:'hidden'},npc:{position:'absolute',top:'-2%',width:'205%',height:'225%'},lockedNpc:{tintColor:'#020307',opacity:.97},lock:{position:'absolute',top:'34%',color:ROYAL.white,fontFamily:ROYAL_FONT.heading,fontSize:58,textShadowColor:'#000',textShadowOffset:{width:0,height:4},textShadowRadius:7},frame:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%',zIndex:1},namePlate:{position:'absolute',zIndex:4,left:'14%',right:'14%',top:'71.7%',height:'11.2%',alignItems:'center',justifyContent:'center'},job:{width:'100%',color:'#332717',fontFamily:ROYAL_FONT.heading,fontSize:17,lineHeight:22,textAlign:'center',includeFontPadding:false},category:{width:'100%',color:'#77603a',fontFamily:ROYAL_FONT.body,fontSize:10,lineHeight:14,letterSpacing:1,textAlign:'center',includeFontPadding:false},
 message:{zIndex:3,maxWidth:360,color:'#eaf7ff',fontFamily:ROYAL_FONT.body,fontSize:15,lineHeight:22,textAlign:'center',marginTop:14},button:{zIndex:3,minWidth:230,minHeight:56,marginTop:14},buttonText:{color:'#fff',fontFamily:ROYAL_FONT.heading,fontSize:17},
});
