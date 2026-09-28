import { router } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { RoyalBackButton, ROYAL, ROYAL_FONT, ROYAL_LAYOUT, ROYAL_TEXT_FIT } from '@/components/ui/RoyalSurface';

const HUD_IVORY=require('../../../assets/app/ui/royal-af/dialogue-frame-v1.png');
const HUD_NAVY=require('../../../assets/app/ui/royal-af/button-wide-v2.png');
const HUD_PLAYER=require('../../../assets/app/ui/royal-af/hud-player-medallion-v1.png');
const HUD_COIN=require('../../../assets/app/ui/royal-af/hud-coin-v1.png');
const HUD_FILL=require('../../../assets/app/ui/royal-af/map-marker-fill-v1.png');
const HUD_TOP_COMPOSITE=require('../../../assets/app/ui/royal-af/hud-top-composite-v1.png');

type Props={name?:string;abilityLevel?:string;abilityTarget?:string;abilityProgress?:number;conversationCredits?:number;conversationCreditMax?:number;coins?:number;onProfile?:()=>void;onCoins?:()=>void;onBack?:()=>void;variant?:'royal'|'study'|'approved';level?:number;xpCurrent?:number;xpMax?:number;diamonds?:number;onDiamonds?:()=>void;onSettings?:()=>void};

function goBackOrHome(){
 if(router.canGoBack()) router.back();
 else router.replace('/home');
}
function coinDisplay(value:number){
 return value>=100000?`${Math.floor(value/10000).toLocaleString('ja-JP')}万`:value.toLocaleString('ja-JP');
}

export default function GameHeader({name='プレイヤー',abilityLevel='N5',abilityTarget='N4',abilityProgress=0,conversationCredits=0,conversationCreditMax=100,coins=0,onProfile,onCoins,onBack,variant='royal'}:Props){
 const abilityRatio=clamp01(abilityProgress),creditRatio=conversationCreditMax>0?clamp01(conversationCredits/conversationCreditMax):0;
 const [topWidth,setTopWidth]=useState(0);
 const {width:screenWidth}=useWindowDimensions();
 if(variant==='approved'){
  const scale=Math.max(.9,Math.min(1.18,screenWidth/390));
  const avatarSize=Math.round(89*scale);
  const artworkHeight=topWidth*757/2078;
  const plaqueHeight=topWidth*(538-184)/2078;
  const artworkTop=(ROYAL_LAYOUT.homeHudTopRowHeight-plaqueHeight)/2-topWidth*184/2078;
  return <View style={s.container}>
   <View style={s.approvedTopRow}>
    <RoyalBackButton onPress={onBack??goBackOrHome}/>
    <View onLayout={event=>setTopWidth(Math.round(event.nativeEvent.layout.width))} style={s.approvedTopBody}>
     {topWidth>0&&<View pointerEvents="none" style={[s.approvedTopArt,{height:artworkHeight,top:artworkTop}]}><Image source={HUD_TOP_COMPOSITE} resizeMode="stretch" style={s.approvedTopImage}/></View>}
     <Pressable accessibilityRole="button" accessibilityLabel={name} onPress={()=>onProfile?onProfile():router.push('/profile')} style={s.approvedProfile}>
      <Image source={HUD_PLAYER} resizeMode="contain" style={[s.approvedAvatar,{width:avatarSize,height:avatarSize}]}/>
      <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.7} maxFontSizeMultiplier={1} style={[s.approvedName,{fontSize:20*scale,lineHeight:26*scale}]}>{name}</Text>
     </Pressable>
     <Pressable accessibilityRole="button" accessibilityLabel={`コイン ${coins}`} onPress={onCoins} style={s.approvedCoins}>
      <Image source={HUD_COIN} resizeMode="contain" style={[s.approvedCoinIcon,{width:26*scale,height:26*scale}]}/>
      <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.7} maxFontSizeMultiplier={1} style={[s.approvedCoinValue,{fontSize:16*scale,lineHeight:22*scale}]}>{coinDisplay(coins)}</Text>
     </Pressable>
    </View>
   </View>
   <View style={s.energyStack}>
    <EnergyBar label="日本語能力" value={`${abilityLevel} / ${abilityTarget}`} ratio={abilityRatio} tint={ROYAL.gold} large/>
    <EnergyBar label="CREDIT" value={conversationCredits.toLocaleString()} ratio={creditRatio} tint="#d96379" large/>
   </View>
  </View>;
 }
 if(variant==='study') return <View style={s.studyContainer}>
  <View style={s.studyTop}>
   <Pressable accessibilityRole="button" accessibilityLabel="戻る" onPress={onBack??goBackOrHome} style={s.studyBack}><Text style={s.studyBackText}>‹</Text></Pressable>
   <Pressable accessibilityRole="button" accessibilityLabel={`${name}のプロフィール`} onPress={()=>onProfile?onProfile():router.push('/profile')} style={s.studyIdentity}>
    <Image source={HUD_PLAYER} resizeMode="contain" style={s.studyAvatar}/>
    <View style={s.studyIdentityText}><Text numberOfLines={1} style={s.studyName}>{name}</Text><Text style={s.studySubtitle}>学習状況</Text></View>
   </Pressable>
   <View accessibilityLabel={`コイン ${coins}`} style={s.studyCoins}><Image source={HUD_COIN} resizeMode="contain" style={s.studyCoinIcon}/><Text numberOfLines={1} style={s.studyCoinValue}>{coins.toLocaleString()}</Text></View>
  </View>
  <View style={s.studyMetrics}>
   <StudyMetric label="日本語能力" value={`${abilityLevel} → ${abilityTarget}`} ratio={abilityRatio}/>
   <StudyMetric label="CREDIT" value={`${conversationCredits.toLocaleString()} / ${conversationCreditMax.toLocaleString()}`} ratio={creditRatio}/>
  </View>
 </View>;
 return <View style={s.container}>
  <View style={s.topRow}>
   <RoyalBackButton onPress={onBack??goBackOrHome}/>
   <Pressable accessibilityRole="button" accessibilityLabel={name} onPress={()=>onProfile?onProfile():router.push('/profile')} style={({pressed})=>[s.profile,pressed&&s.pressed]}>
    <ImageBackground source={HUD_IVORY} resizeMode="stretch" style={s.nameFrame}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} minimumFontScale={.68} style={s.name}>{name}</Text></ImageBackground>
    <Image source={HUD_PLAYER} resizeMode="contain" style={s.avatar}/>
   </Pressable>
   <Pressable accessibilityRole="button" accessibilityLabel={`コイン ${coins}`} onPress={onCoins} style={({pressed})=>[s.coinPressable,pressed&&s.pressed]}><ImageBackground source={HUD_IVORY} resizeMode="stretch" style={s.coinFrame}><Image source={HUD_COIN} resizeMode="contain" style={s.coinIcon}/><Text {...ROYAL_TEXT_FIT} numberOfLines={1} minimumFontScale={.62} style={s.coinValue}>{coins.toLocaleString()}</Text></ImageBackground></Pressable>
  </View>
  <View style={s.energyStack}>
   <EnergyBar label="日本語能力" value={`${abilityLevel} / ${abilityTarget}`} ratio={abilityRatio} tint={ROYAL.gold}/>
   <EnergyBar label="CREDIT" value={conversationCredits.toLocaleString()} ratio={creditRatio} tint="#d96379"/>
  </View>
 </View>
}

function clamp01(value:number){return Math.min(1,Math.max(0,Number.isFinite(value)?value:0))}
function StudyMetric({label,value,ratio}:{label:string;value:string;ratio:number}){
 const percentage=Math.round(clamp01(ratio)*100);
 return <View style={s.studyMetric}>
  <View style={s.studyMetricHeading}><Text numberOfLines={1} style={s.studyMetricLabel}>{label}</Text><Text style={s.studyMetricPercent}>{percentage}%</Text></View>
  <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.85} style={s.studyMetricValue}>{value}</Text>
  <View style={s.studyTrack}><View style={[s.studyFill,{width:`${percentage}%`}]}/></View>
 </View>;
}
function EnergyBar({label,value,ratio,tint,large=false}:{label:string;value:string;ratio:number;tint:string;large?:boolean}){
 const percentage=Math.round(clamp01(ratio)*100);
 return <ImageBackground source={HUD_NAVY} resizeMode="stretch" style={s.energyFrame}>
  <View style={[s.energyCopy,large&&s.energyCopyLarge]}><Text numberOfLines={1} maxFontSizeMultiplier={1} style={[s.energyLabel,large&&s.energyLabelLarge]}>{label}</Text><Text numberOfLines={1} maxFontSizeMultiplier={1} style={[s.energyValue,large&&s.energyValueLarge]}>{value}</Text></View>
  <View style={s.track}><View style={[s.fillClip,{width:`${Math.max(2,percentage)}%`}]}><Image source={HUD_FILL} resizeMode="stretch" tintColor={tint} style={s.fillImage}/></View></View>
  <Text numberOfLines={1} maxFontSizeMultiplier={1} style={[s.percent,large&&s.percentLarge]}>{percentage}%</Text>
 </ImageBackground>
}

const s=StyleSheet.create({
 approvedTopRow:{height:ROYAL_LAYOUT.homeHudTopRowHeight,flexDirection:'row',alignItems:'center',gap:4},
 approvedTopBody:{flex:1,minWidth:0,height:'100%',position:'relative',justifyContent:'center'},
 approvedTopArt:{position:'absolute',left:0,right:0},
 approvedTopImage:{width:'100%',height:'100%'},
 approvedProfile:{position:'absolute',left:0,right:'31%',height:'100%',flexDirection:'row',alignItems:'center',minWidth:0},
 approvedAvatar:{width:ROYAL_LAYOUT.homeAvatarSize,height:ROYAL_LAYOUT.homeAvatarSize,flexShrink:0},
 approvedName:{flex:1,minWidth:0,marginLeft:2,marginRight:4,color:ROYAL.lacquer,fontFamily:ROYAL_FONT.heading,fontSize:20,lineHeight:26},
 approvedCoins:{position:'absolute',right:8,width:'29%',height:58,flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:5,gap:3},
 approvedCoinIcon:{width:22,height:22,flexShrink:0},
 approvedCoinValue:{flex:1,minWidth:0,color:ROYAL.darkGold,fontFamily:ROYAL_FONT.heading,fontSize:16,lineHeight:22,textAlign:'center'},
 studyContainer:{width:'100%',paddingHorizontal:10,paddingTop:8,paddingBottom:10,borderWidth:1,borderRadius:16,borderColor:ROYAL.gold,backgroundColor:ROYAL.lacquer,shadowColor:'#07101f',shadowOpacity:.24,shadowRadius:8,shadowOffset:{width:0,height:4},elevation:4},
 studyTop:{minHeight:48,flexDirection:'row',alignItems:'center',gap:8},
 studyBack:{width:40,height:40,borderRadius:12,borderWidth:1,borderColor:ROYAL.gold,backgroundColor:ROYAL.lacquerLight,alignItems:'center',justifyContent:'center'},
 studyBackText:{color:ROYAL.paleGold,fontSize:29,lineHeight:33,marginTop:-3},
 studyIdentity:{flex:1,minWidth:0,flexDirection:'row',alignItems:'center',gap:6},
 studyAvatar:{width:38,height:38},studyIdentityText:{flex:1,minWidth:0},
 studyName:{color:ROYAL.white,fontFamily:ROYAL_FONT.heading,fontSize:17,lineHeight:23},
 studySubtitle:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.body,fontSize:10,lineHeight:15},
 studyCoins:{minWidth:66,maxWidth:98,minHeight:36,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:3,paddingHorizontal:5,borderWidth:1,borderRadius:11,borderColor:ROYAL.gold,backgroundColor:ROYAL.lacquerLight},
 studyCoinIcon:{width:19,height:19},studyCoinValue:{flexShrink:1,color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:13,lineHeight:19},
 studyMetrics:{flexDirection:'row',gap:8,marginTop:8},
 studyMetric:{flex:1,minWidth:0,paddingHorizontal:9,paddingTop:6,paddingBottom:7,borderRadius:11,backgroundColor:ROYAL.lacquerLight,borderWidth:1,borderColor:'rgba(203,165,90,.6)'},
 studyMetricHeading:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:4},
 studyMetricLabel:{flexShrink:1,color:ROYAL.white,fontFamily:ROYAL_FONT.body,fontSize:10,lineHeight:15},
 studyMetricValue:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:11,lineHeight:17},
 studyMetricPercent:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.body,fontSize:10,lineHeight:15},
 studyTrack:{height:5,borderRadius:3,backgroundColor:'rgba(255,255,255,.22)',overflow:'hidden',marginTop:5},
 studyFill:{height:'100%',backgroundColor:ROYAL.gold,borderRadius:3},
 container:{width:'100%',height:ROYAL_LAYOUT.homeHudHeight,zIndex:100},
 topRow:{height:ROYAL_LAYOUT.homeHudTopRowHeight,flexDirection:'row',alignItems:'center',gap:4},
 profile:{flex:1,minWidth:0,height:'100%',position:'relative',justifyContent:'center'},
 nameFrame:{height:58,marginLeft:48,justifyContent:'center',paddingLeft:38,paddingRight:25,paddingVertical:14},
 avatar:{position:'absolute',left:0,top:3,width:ROYAL_LAYOUT.homeAvatarSize,height:ROYAL_LAYOUT.homeAvatarSize,zIndex:3},
 name:{width:'100%',color:ROYAL.lacquer,fontFamily:ROYAL_FONT.heading,fontSize:19,lineHeight:25,textAlign:'left',includeFontPadding:false},
 coinPressable:{width:ROYAL_LAYOUT.homeCoinWidth,height:58},
 coinFrame:{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:21,gap:4},
 coinIcon:{width:25,height:25,flexShrink:0},coinValue:{flex:1,minWidth:0,color:ROYAL.darkGold,fontFamily:ROYAL_FONT.heading,fontSize:14,lineHeight:19,textAlign:'center',includeFontPadding:false},
 energyStack:{flex:1,gap:2},
 energyFrame:{flex:1,minHeight:44,flexDirection:'row',alignItems:'center',paddingHorizontal:24,paddingVertical:10,gap:7},
 energyCopy:{width:126,flexDirection:'row',alignItems:'center',gap:5},
 energyCopyLarge:{width:136},
 energyLabel:{flexShrink:1,color:'#fff8e8',fontFamily:ROYAL_FONT.body,fontSize:11.5,lineHeight:16,textShadowColor:'#000',textShadowOffset:{width:0,height:1},textShadowRadius:2},
 energyLabelLarge:{fontSize:13,lineHeight:19},
 energyValue:{flexShrink:0,color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:12,lineHeight:16},
 energyValueLarge:{fontSize:13,lineHeight:19},
 track:{flex:1,minWidth:40,height:16,position:'relative',overflow:'hidden'},
 fillClip:{position:'absolute',left:0,top:2,bottom:2,overflow:'hidden'},fillImage:{width:420,height:'100%',opacity:.82},
 percent:{width:34,color:'#fff8e8',fontFamily:ROYAL_FONT.body,fontSize:11,lineHeight:15,textAlign:'right'},
 percentLarge:{fontSize:13,lineHeight:19},
 pressed:{opacity:.84,transform:[{translateY:2},{scale:.985}]}
});
