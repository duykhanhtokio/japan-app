import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import RoyalPaperPanel from '@/components/ui/RoyalPaperPanel';
import { RoyalBackButton, ROYAL, ROYAL_FONT } from '@/components/ui/RoyalSurface';

type Props={level:number;xpCurrent:number;xpMax:number;gold:number;diamonds:number;keys:number;onBack:()=>void;onGoldPlus:()=>void;onDiamondPlus:()=>void};
const AVATAR=require('../../../../assets/app/ui/royal-af/hud-player-medallion-v1.png');
const COIN=require('../../../../assets/app/ui/royal-af/hud-coin-v1.png');
const DIAMOND=require('../../../../assets/app/ui/royal-af/hud-diamond-v1.png');
const KEY=require('../../../../assets/app/ui/royal-af/mission-key-v1.png');

export default function FarmHud({level,xpCurrent,xpMax,gold,diamonds,keys,onBack,onGoldPlus,onDiamondPlus}:Props){
 const xpRatio=Math.max(0,Math.min(1,xpMax>0?xpCurrent/xpMax:0));
 return <View pointerEvents="box-none" style={s.container}>
  <View style={s.back}><RoyalBackButton onPress={onBack}/></View>
  <View style={s.frames}>
   <RoyalPaperPanel tone="hud" style={s.playerFrame}>
    <View accessibilityLabel={`レベル ${level}、EXP ${xpCurrent}/${xpMax}`} style={s.player}>
     <Image source={AVATAR} resizeMode="contain" style={s.avatar}/>
     <View style={s.playerCopy}><Text numberOfLines={1} adjustsFontSizeToFit style={s.level}>Lv.{level}</Text><Text numberOfLines={1} style={s.xp}>EXP {Math.floor(xpRatio*100)}%</Text><View accessibilityRole="progressbar" accessibilityLabel="EXP" accessibilityValue={{min:0,max:xpMax,now:xpCurrent}} style={s.xpTrack}><View style={[s.xpFill,{width:`${xpRatio*100}%`}]}/></View></View>
    </View>
   </RoyalPaperPanel>
   <RoyalPaperPanel tone="hud" style={s.row}>
    <Resource label="ゴールド" value={gold} icon={COIN} onPress={onGoldPlus}/>
    <Resource label="ダイヤ" value={diamonds} icon={DIAMOND} onPress={onDiamondPlus}/>
    <Resource label="鍵" value={keys} icon={KEY}/>
   </RoyalPaperPanel>
  </View>
 </View>;
}
function Resource({label,value,icon,onPress}:{label:string;value:number;icon:number;onPress?:()=>void}){
 const content=<><Image source={icon} resizeMode="contain" style={s.icon}/><Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.7} style={s.value}>{value>=1000000?`${(value/1000000).toFixed(2)}M`:value>=10000?`${(value/1000).toFixed(1)}K`:value.toLocaleString()}</Text></>;
 return onPress?<Pressable accessibilityRole="button" accessibilityLabel={`${label} ${value}、追加`} onPress={onPress} style={({pressed})=>[s.cell,pressed&&{opacity:.7}]}>{content}</Pressable>:<View accessibilityLabel={`${label} ${value}`} style={s.cell}>{content}</View>;
}
const s=StyleSheet.create({
 container:{width:'100%',maxWidth:900,alignSelf:'center',gap:4},back:{alignSelf:'flex-start'},
 frames:{width:'100%',flexDirection:'row',alignItems:'stretch',gap:8},
 playerFrame:{flex:1,minWidth:0,minHeight:78,paddingVertical:9,paddingHorizontal:12,justifyContent:'center'},
 row:{flex:1,minWidth:0,minHeight:78,paddingVertical:13,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:3},
 player:{minWidth:0,flexDirection:'row',alignItems:'center',gap:6},avatar:{width:60,height:60,flexShrink:0},playerCopy:{flex:1,minWidth:0},
 level:{fontFamily:ROYAL_FONT.heading,color:ROYAL.paleGold,fontSize:14,lineHeight:20},xp:{fontFamily:ROYAL_FONT.body,color:'#fff',fontSize:10,lineHeight:15},
 xpTrack:{height:10,width:'100%',position:'relative',overflow:'hidden',backgroundColor:'#142847',marginTop:2},xpFill:{height:'100%',backgroundColor:'#d1ab53'},xpBorder:{...StyleSheet.absoluteFillObject,padding:0,minHeight:0},
 cell:{flex:1,minWidth:0,justifyContent:'center',alignItems:'center',gap:3},icon:{width:30,height:30},
 value:{fontFamily:ROYAL_FONT.heading,color:'#fff',fontSize:12,lineHeight:18,fontVariant:['tabular-nums'],width:'100%',textAlign:'center'},
});
