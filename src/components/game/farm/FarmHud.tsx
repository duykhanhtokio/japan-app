import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import RoyalPaperPanel from '@/components/ui/RoyalPaperPanel';
import { RoyalBackButton, ROYAL, ROYAL_FONT } from '@/components/ui/RoyalSurface';

type Props={level:number;xpCurrent:number;xpMax:number;gold:number;diamonds:number;keys:number;onGoldPlus:()=>void;onDiamondPlus:()=>void};
const AVATAR=require('../../../../assets/app/ui/royal-af/hud-player-medallion-v1.png');
const COIN=require('../../../../assets/app/ui/royal-af/hud-coin-v1.png');
const KEY=require('../../../../assets/app/ui/royal-af/mission-key-v1.png');

export default function FarmHud({level,xpCurrent,xpMax,gold,diamonds,keys,onGoldPlus,onDiamondPlus}:Props){
 return <View pointerEvents="box-none" style={s.container}>
  <RoyalBackButton onPress={()=>router.replace('/home')}/>
  <RoyalPaperPanel tone="hud" style={s.row}>
   <View accessibilityLabel={`レベル ${level}、EXP ${xpCurrent}/${xpMax}`} style={s.player}>
    <Image source={AVATAR} resizeMode="contain" style={s.avatar}/>
    <View style={s.playerCopy}><Text numberOfLines={1} adjustsFontSizeToFit style={s.level}>Lv.{level}</Text><Text numberOfLines={1} adjustsFontSizeToFit style={s.xp}>EXP {xpCurrent}/{xpMax}</Text></View>
   </View>
   <Resource label="ゴールド" value={gold} icon={COIN} onPress={onGoldPlus} wide/>
   <Resource label="ダイヤ" value={diamonds} onPress={onDiamondPlus}/>
   <Resource label="鍵" value={keys} icon={KEY}/>
  </RoyalPaperPanel>
 </View>;
}
function Resource({label,value,icon,onPress,wide=false}:{label:string;value:number;icon?:number;onPress?:()=>void;wide?:boolean}){
 const content=<><View style={s.labelRow}>{icon&&<Image source={icon} resizeMode="contain" style={s.icon}/>}<Text numberOfLines={1} adjustsFontSizeToFit style={s.label}>{label}{onPress?' +':''}</Text></View><Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.8} style={s.value}>{value.toLocaleString()}</Text></>;
 const style=[s.cell,wide&&s.gold];
 return onPress?<Pressable accessibilityRole="button" accessibilityLabel={`${label} ${value}、追加`} onPress={onPress} style={({pressed})=>[style,pressed&&{opacity:.7}]}>{content}</Pressable>:<View accessibilityLabel={`${label} ${value}`} style={style}>{content}</View>;
}
const s=StyleSheet.create({
 container:{width:'100%',maxWidth:900,alignSelf:'center',flexDirection:'row',alignItems:'center',gap:4},
 row:{flex:1,minWidth:0,minHeight:58,paddingVertical:10,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:4},
 player:{flex:1.15,minWidth:0,flexDirection:'row',alignItems:'center',gap:3},avatar:{width:24,height:28},playerCopy:{flex:1,minWidth:0},
 level:{fontFamily:ROYAL_FONT.heading,color:ROYAL.paleGold,fontSize:13,lineHeight:18},xp:{fontFamily:ROYAL_FONT.body,color:'#fff',fontSize:9,lineHeight:14},
 cell:{flex:.7,minWidth:0,minHeight:38,justifyContent:'center',alignItems:'center'},gold:{flex:1.15},
 labelRow:{flexDirection:'row',alignItems:'center',gap:2},icon:{width:13,height:13},label:{flexShrink:1,fontFamily:ROYAL_FONT.body,color:ROYAL.paleGold,fontSize:9,lineHeight:14},
 value:{fontFamily:ROYAL_FONT.heading,color:'#fff',fontSize:12,lineHeight:18,fontVariant:['tabular-nums'],width:'100%',textAlign:'center'},
});
