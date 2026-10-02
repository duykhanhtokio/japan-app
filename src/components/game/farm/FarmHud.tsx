import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import RoyalPaperPanel from '@/components/ui/RoyalPaperPanel';
import { RoyalBackButton, ROYAL, ROYAL_FONT } from '@/components/ui/RoyalSurface';

type Props={level:number;xpCurrent:number;xpMax:number;gold:number;diamonds:number;keys:number;onGoldPlus:()=>void;onDiamondPlus:()=>void};
const AVATAR=require('../../../../assets/app/ui/royal-af/hud-player-medallion-v1.png');
const COIN=require('../../../../assets/app/ui/royal-af/hud-coin-v1.png');
const KEY=require('../../../../assets/app/ui/royal-af/mission-key-v1.png');
const PLUS=require('../../../../assets/game/farm/hud/hud_plus.png');

export default function FarmHud({level,xpCurrent,xpMax,gold,diamonds,keys,onGoldPlus,onDiamondPlus}:Props){
 return <View style={s.container}>
  <View style={s.top}>
   <RoyalBackButton onPress={()=>router.replace('/home')}/>
   <RoyalPaperPanel tone="hud" style={s.player}>
    <Image source={AVATAR} resizeMode="contain" style={s.avatar}/>
    <View style={s.playerCopy}><Text numberOfLines={1} adjustsFontSizeToFit style={s.level}>Lv. {level}</Text><Text numberOfLines={1} adjustsFontSizeToFit style={s.xp}>EXP {xpCurrent}/{xpMax}</Text></View>
   </RoyalPaperPanel>
  </View>
  <View style={s.resources}>
   <Resource label="ゴールド" value={gold} icon={COIN} onPress={onGoldPlus}/>
   <Resource label="ダイヤ" value={diamonds} onPress={onDiamondPlus}/>
   <Resource label="鍵" value={keys} icon={KEY}/>
  </View>
 </View>;
}
function Resource({label,value,icon,onPress}:{label:string;value:number;icon?:number;onPress?:()=>void}){
 const content=<RoyalPaperPanel tone="hud" style={s.resource}>
  <View style={s.labelRow}>{icon&&<Image source={icon} resizeMode="contain" style={s.icon}/>}<Text numberOfLines={1} adjustsFontSizeToFit style={s.label}>{label}</Text></View>
  <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.65} style={s.value}>{value.toLocaleString()}</Text>
  {onPress&&<Image source={PLUS} resizeMode="contain" style={s.plus}/>}
 </RoyalPaperPanel>;
 return onPress?<Pressable accessibilityRole="button" accessibilityLabel={`${label}を追加`} onPress={onPress} style={({pressed})=>[s.cell,pressed&&{opacity:.8}]}>{content}</Pressable>:<View style={s.cell}>{content}</View>;
}
const s=StyleSheet.create({
 container:{width:'100%',maxWidth:780,alignSelf:'center',gap:6},
 top:{flexDirection:'row',alignItems:'center',gap:6},
 player:{flex:1,minHeight:72,paddingVertical:10,paddingHorizontal:22,flexDirection:'row',alignItems:'center',gap:12},
 avatar:{width:50,height:50},playerCopy:{flex:1,minWidth:0},
 level:{fontFamily:ROYAL_FONT.heading,color:ROYAL.paleGold,fontSize:20,lineHeight:26},
 xp:{fontFamily:ROYAL_FONT.body,color:'#fff',fontSize:14,lineHeight:20},
 resources:{flexDirection:'row',gap:6},cell:{flex:1,minWidth:0},
 resource:{minHeight:72,paddingVertical:16,paddingHorizontal:16,alignItems:'center',justifyContent:'center'},
 labelRow:{flexDirection:'row',alignItems:'center',gap:4},icon:{width:18,height:18},
 label:{fontFamily:ROYAL_FONT.body,color:ROYAL.paleGold,fontSize:12,lineHeight:17},
 value:{fontFamily:ROYAL_FONT.heading,color:'#fff',fontSize:17,lineHeight:23,fontVariant:['tabular-nums'],width:'100%',textAlign:'center'},
 plus:{position:'absolute',right:1,bottom:1,width:22,height:22},
});
