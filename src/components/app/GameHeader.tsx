import { router } from 'expo-router';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { RoyalBackButton, ROYAL, ROYAL_FONT, ROYAL_LAYOUT, ROYAL_TEXT_FIT } from '@/components/ui/RoyalSurface';

const HUD_IVORY=require('../../../assets/app/ui/royal-af/dialogue-frame-v1.png');
const HUD_NAVY=require('../../../assets/app/ui/royal-af/button-wide-v2.png');
const HUD_PLAYER=require('../../../assets/app/ui/royal-af/hud-player-medallion-v1.png');
const HUD_COIN=require('../../../assets/app/ui/royal-af/hud-coin-v1.png');
const HUD_FILL=require('../../../assets/app/ui/royal-af/map-marker-fill-v1.png');

type Props={name?:string;abilityLevel?:string;abilityTarget?:string;abilityProgress?:number;conversationCredits?:number;conversationCreditMax?:number;coins?:number;onProfile?:()=>void;onCoins?:()=>void;onBack?:()=>void;level?:number;xpCurrent?:number;xpMax?:number;diamonds?:number;onDiamonds?:()=>void;onSettings?:()=>void};

export default function GameHeader({name='プレイヤー',abilityLevel='N5',abilityTarget='N4',abilityProgress=0,conversationCredits=0,conversationCreditMax=100,coins=0,onProfile,onCoins,onBack}:Props){
 const abilityRatio=clamp01(abilityProgress),creditRatio=conversationCreditMax>0?clamp01(conversationCredits/conversationCreditMax):0;
 return <View style={s.container}>
  <View style={s.topRow}>
   <RoyalBackButton onPress={onBack??(()=>router.back())}/>
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
function EnergyBar({label,value,ratio,tint}:{label:string;value:string;ratio:number;tint:string}){
 const percentage=Math.round(clamp01(ratio)*100);
 return <ImageBackground source={HUD_NAVY} resizeMode="stretch" style={s.energyFrame}>
  <View style={s.energyCopy}><Text numberOfLines={1} maxFontSizeMultiplier={1} style={s.energyLabel}>{label}</Text><Text numberOfLines={1} maxFontSizeMultiplier={1} style={s.energyValue}>{value}</Text></View>
  <View style={s.track}><View style={[s.fillClip,{width:`${Math.max(2,percentage)}%`}]}><Image source={HUD_FILL} resizeMode="stretch" tintColor={tint} style={s.fillImage}/></View></View>
  <Text numberOfLines={1} maxFontSizeMultiplier={1} style={s.percent}>{percentage}%</Text>
 </ImageBackground>
}

const s=StyleSheet.create({
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
 energyLabel:{flexShrink:1,color:'#fff8e8',fontFamily:ROYAL_FONT.body,fontSize:11.5,lineHeight:16,textShadowColor:'#000',textShadowOffset:{width:0,height:1},textShadowRadius:2},
 energyValue:{flexShrink:0,color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:12,lineHeight:16},
 track:{flex:1,minWidth:40,height:16,position:'relative',overflow:'hidden'},
 fillClip:{position:'absolute',left:0,top:2,bottom:2,overflow:'hidden'},fillImage:{width:420,height:'100%',opacity:.82},
 percent:{width:34,color:'#fff8e8',fontFamily:ROYAL_FONT.body,fontSize:11,lineHeight:15,textAlign:'right'},
 pressed:{opacity:.84,transform:[{translateY:2},{scale:.985}]}
});
