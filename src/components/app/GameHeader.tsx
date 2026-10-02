import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { RoyalBackButton, RoyalNavyFrame, ROYAL, ROYAL_FONT, ROYAL_LAYOUT, ROYAL_TEXT_FIT } from '@/components/ui/RoyalSurface';
import { CREDIT_CAPACITY, RANK_COLORS, RANKS, type JlptRank } from '@/services/learning-economy';

const HUD_ENERGY_FRAME=require('../../../assets/app/ui/royal-af/hud-energy-open-frame-v1.png');
const HUD_PLAYER=require('../../../assets/app/ui/royal-af/hud-player-medallion-v1.png');
const HUD_COIN=require('../../../assets/app/ui/royal-af/hud-coin-v1.png');

type Props={name?:string;abilityLevel?:string;abilityTarget?:string;abilityProgress?:number;conversationCredits?:number;conversationCreditMax?:number;qualifiedExams?:Partial<Record<JlptRank, number>>;coins?:number;onProfile?:()=>void;onCoins?:()=>void;onBack?:()=>void;variant?:'royal'|'study'|'approved';level?:number;xpCurrent?:number;xpMax?:number;diamonds?:number;onDiamonds?:()=>void;onSettings?:()=>void};

// Baseline royal bars shared the 92px stack with a 2px gap: 45px each.
const ROYAL_BAR_HEIGHT = (ROYAL_LAYOUT.homeHudHeight - ROYAL_LAYOUT.homeHudTopRowHeight - 2) / 4;
const APPROVED_BAR_HEIGHT = 64 / 2;

function goBackOrHome(){
 if(router.canGoBack()) router.back();
 else router.replace('/home');
}
function coinDisplay(value:number){
 return value>=100000?`${Math.floor(value/10000).toLocaleString('ja-JP')}万`:value.toLocaleString('ja-JP');
}

export default function GameHeader({name='プレイヤー',abilityLevel='N5',abilityTarget='N4',conversationCredits=CREDIT_CAPACITY,conversationCreditMax=CREDIT_CAPACITY,qualifiedExams={},coins=0,onProfile,onCoins,onBack,variant='royal'}:Props){
 const creditRatio=conversationCreditMax>0?clamp01(conversationCredits/conversationCreditMax):0;
 const target = RANKS.includes(abilityTarget as JlptRank) ? abilityTarget as JlptRank : 'N5';
 const passed = Math.min(6,qualifiedExams[target]??0);
 const examLabel = `${target} 合格 ${passed}/6`;
 const visibleRanks = RANKS.filter(rank=>RANKS.indexOf(rank)>RANKS.indexOf(abilityLevel as JlptRank)&& (qualifiedExams[rank]??0)>0);
 const otherProgress=visibleRanks.filter(rank=>rank!==target).map(rank=>`${rank} ${qualifiedExams[rank]}/6`).join(' · ');
 const {width:screenWidth}=useWindowDimensions();
 if(variant==='approved'){
  const scale=Math.max(.9,Math.min(1.18,screenWidth/390));
  const avatarSize=Math.round(72*scale);
  return <View style={[s.container,s.approvedContainer]}>
   <View style={s.approvedTopRow}>
    <RoyalBackButton onPress={onBack??goBackOrHome}/>
    <View style={s.approvedTopBody}>
     <Pressable accessibilityRole="button" accessibilityLabel={name} onPress={()=>onProfile?onProfile():router.push('/profile')} style={s.approvedProfile}>
      <Image source={HUD_PLAYER} resizeMode="contain" style={[s.approvedAvatar,{width:avatarSize,height:avatarSize}]}/>
      <RoyalNavyFrame style={[s.approvedNameFrame,{paddingHorizontal:'19%'}]}><Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.7} maxFontSizeMultiplier={1} style={[s.approvedName,{fontSize:(screenWidth<360?14:20)*scale,lineHeight:26*scale}]}>{name}</Text></RoyalNavyFrame>
     </Pressable>
     <Pressable accessibilityRole="button" accessibilityLabel={`コイン ${coins}`} onPress={onCoins} style={s.approvedCoins}>
      <RoyalNavyFrame style={s.approvedCoinFrame}><Image source={HUD_COIN} resizeMode="contain" style={[s.approvedCoinIcon,{width:18*scale,height:18*scale}]}/>
      <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.7} maxFontSizeMultiplier={1} style={[s.approvedCoinValue,{fontSize:16*scale,lineHeight:22*scale}]}>{coinDisplay(coins)}</Text></RoyalNavyFrame>
     </Pressable>
    </View>
   </View>
   <View style={[s.energyStack,s.approvedEnergyStack]}>
    <EnergyBar label="CREDIT" value={`${conversationCredits}/${conversationCreditMax}`} ratio={creditRatio} tint="#ba343a" large/>
    <EnergyBar label={otherProgress?`${examLabel} · ${otherProgress}`:examLabel} value="" ratio={passed/6} tint={RANK_COLORS[target]} large/>
   </View>
  </View>;
 }
 if(variant==='study') return <View style={s.studyContainer}>
  <View style={s.studyTop}>
   <RoyalBackButton onPress={onBack??goBackOrHome}/>
   <Pressable accessibilityRole="button" accessibilityLabel={`${name}のプロフィール`} onPress={()=>onProfile?onProfile():router.push('/profile')} style={s.studyIdentity}>
    <Image source={HUD_PLAYER} resizeMode="contain" style={s.studyAvatar}/>
    <View style={s.studyIdentityText}><Text numberOfLines={1} style={s.studyName}>{name}</Text><Text style={s.studySubtitle}>学習状況</Text></View>
   </Pressable>
   <View accessibilityLabel={`コイン ${coins}`} style={s.studyCoins}><Image source={HUD_COIN} resizeMode="contain" style={s.studyCoinIcon}/><Text numberOfLines={1} style={s.studyCoinValue}>{coins.toLocaleString()}</Text></View>
  </View>
  <View style={s.studyMetrics}>
   <StudyMetric label="CREDIT" value={`${conversationCredits} / ${conversationCreditMax}`} ratio={creditRatio}/>
   <StudyMetric label={examLabel} value="" ratio={passed/6}/>
  </View>
 </View>;
 return <View style={s.container}>
  <View style={s.topRow}>
   <RoyalBackButton onPress={onBack??goBackOrHome}/>
   <Pressable accessibilityRole="button" accessibilityLabel={name} onPress={()=>onProfile?onProfile():router.push('/profile')} style={({pressed})=>[s.profile,pressed&&s.pressed]}>
    <RoyalNavyFrame style={s.nameFrame}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} minimumFontScale={.68} style={s.name}>{name}</Text></RoyalNavyFrame>
    <Image source={HUD_PLAYER} resizeMode="contain" style={s.avatar}/>
   </Pressable>
   <Pressable accessibilityRole="button" accessibilityLabel={`コイン ${coins}`} onPress={onCoins} style={({pressed})=>[s.coinPressable,pressed&&s.pressed]}><RoyalNavyFrame style={s.coinFrame}><Image source={HUD_COIN} resizeMode="contain" style={s.coinIcon}/><Text {...ROYAL_TEXT_FIT} numberOfLines={1} minimumFontScale={.62} style={s.coinValue}>{coins.toLocaleString()}</Text></RoyalNavyFrame></Pressable>
  </View>
  <View style={s.energyStack}>
   <EnergyBar label="CREDIT" value={`${conversationCredits}/${conversationCreditMax}`} ratio={creditRatio} tint="#ba343a"/>
   <EnergyBar label={examLabel} value="" ratio={passed/6} tint={RANK_COLORS[target]}/>
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
 const [height,setHeight]=useState(large?APPROVED_BAR_HEIGHT:ROYAL_BAR_HEIGHT);
 const percentage=Math.round(clamp01(ratio)*100);
 // The transparent source has its visible frame at y=156..550 of 724 px.
 // Crop those empty source margins inside the measured bar, so art and fill share one box.
 const artHeight=height*724/394;
 const artTop=-height*156/394;
 return <View onLayout={event=>{
  const next=event.nativeEvent.layout.height;
  if(next>0&&next!==height)setHeight(next);
 }} style={[s.energyFrame,large&&s.approvedEnergyFrame]}>
  <View pointerEvents="none" style={s.energyInset}>
   <View style={s.energyIvory}/>
   <View style={[s.energyColorClip,{width:`${percentage}%`,backgroundColor:tint}]}/>
  </View>
  <Image source={HUD_ENERGY_FRAME} resizeMode="stretch" style={[s.energyOrnament,{height:artHeight,top:artTop}]}/>
  <View pointerEvents="none" style={s.energyTextSafe}><Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.78} maxFontSizeMultiplier={1} style={[s.energyCenteredText,label==='CREDIT'&&s.creditText]}>{label}{value?`  ${value}`:''}</Text></View>
 </View>;
}

const s=StyleSheet.create({
 approvedTopRow:{height:ROYAL_LAYOUT.homeHudTopRowHeight,flexDirection:'row',alignItems:'center',gap:8},
 approvedTopBody:{flex:1,minWidth:0,height:'100%',flexDirection:'row',alignItems:'center',gap:8},
 approvedNameFrame:{flex:1,minWidth:0,height:58,justifyContent:'center',paddingHorizontal:14},
 approvedCoinFrame:{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:'22%',gap:5},
 approvedTopArt:{position:'absolute',left:0,right:0},
 approvedTopImage:{width:'100%',height:'100%'},
 approvedProfile:{flex:1,height:'100%',flexDirection:'row',alignItems:'center',minWidth:0},
 approvedAvatar:{width:ROYAL_LAYOUT.homeAvatarSize,height:ROYAL_LAYOUT.homeAvatarSize,flexShrink:0},
 approvedName:{width:'100%',flexShrink:1,minWidth:0,marginLeft:0,marginRight:0,color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:20,lineHeight:26,textAlign:'center',textAlignVertical:'center',includeFontPadding:false},
 approvedCoins:{width:'36%',minWidth:100,height:58},
 approvedCoinIcon:{width:22,height:22,flexShrink:0},
 approvedCoinValue:{flex:1,minWidth:0,color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:16,lineHeight:22,textAlign:'center',includeFontPadding:false},
 studyContainer:{width:'100%',paddingHorizontal:10,paddingTop:8,paddingBottom:10,borderWidth:1,borderRadius:16,borderColor:ROYAL.gold,backgroundColor:ROYAL.lacquer,shadowColor:'#07101f',shadowOpacity:.24,shadowRadius:8,shadowOffset:{width:0,height:4},elevation:4},
 studyTop:{minHeight:48,flexDirection:'row',alignItems:'center',gap:8},
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
 container:{width:'100%',height:ROYAL_LAYOUT.homeHudTopRowHeight+2*ROYAL_BAR_HEIGHT,zIndex:100},
 approvedContainer:{height:ROYAL_LAYOUT.homeHudTopRowHeight+66},
 topRow:{height:ROYAL_LAYOUT.homeHudTopRowHeight,flexDirection:'row',alignItems:'center',gap:4},
 profile:{flex:1,minWidth:0,height:'100%',position:'relative',justifyContent:'center'},
 nameFrame:{height:58,marginLeft:48,justifyContent:'center',paddingLeft:38,paddingRight:25,paddingVertical:14},
 avatar:{position:'absolute',left:0,top:3,width:ROYAL_LAYOUT.homeAvatarSize,height:ROYAL_LAYOUT.homeAvatarSize,zIndex:3},
 name:{width:'100%',color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:19,lineHeight:25,textAlign:'center',includeFontPadding:false},
 coinPressable:{width:ROYAL_LAYOUT.homeCoinWidth,height:58},
 coinFrame:{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:'22%',gap:5},
 coinIcon:{width:20,height:20,flexShrink:0},coinValue:{flex:1,minWidth:0,color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:14,lineHeight:19,textAlign:'center',includeFontPadding:false},
 energyStack:{height:2*ROYAL_BAR_HEIGHT,flex:0,gap:0},
 approvedEnergyStack:{flex:0,height:66,gap:2},
 energyFrame:{flex:0,height:ROYAL_BAR_HEIGHT,minHeight:ROYAL_BAR_HEIGHT,position:'relative',overflow:'hidden'},
 approvedEnergyFrame:{flex:0,height:APPROVED_BAR_HEIGHT,minHeight:APPROVED_BAR_HEIGHT},
 energyInset:{position:'absolute',left:'3.4%',right:'3.4%',top:'16%',bottom:'13%',borderRadius:10,overflow:'hidden'},
 energyIvory:{...StyleSheet.absoluteFillObject,backgroundColor:'#fff7e7'},
 energyColorClip:{height:'100%'},
 energyOrnament:{position:'absolute',left:0,right:0,width:'100%'},
 energyTextSafe:{position:'absolute',left:'16%',right:'16%',top:0,bottom:0,alignItems:'center',justifyContent:'center'},
 energyCenteredText:{width:'100%',textAlign:'center',color:'#142335',fontFamily:ROYAL_FONT.heading,fontSize:13,lineHeight:20,includeFontPadding:false,textShadowColor:'transparent',textShadowOffset:{width:0,height:0},textShadowRadius:0},
 creditText:{backgroundColor:'#142847',borderRadius:6,color:'#fff7df',fontWeight:'700',textShadowColor:'#43121a',textShadowOffset:{width:0,height:1},textShadowRadius:1},
 pressed:{opacity:.84,transform:[{translateY:2},{scale:.985}]}
});
