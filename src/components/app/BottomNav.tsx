import { router } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { ROYAL, ROYAL_FONT, ROYAL_LAYOUT } from '@/components/ui/RoyalSurface';

const NAV_NAVY=require('../../../assets/app/ui/royal-af/button-wide-v2.png');
const NAV_IVORY=require('../../../assets/app/ui/royal-af/dialogue-frame-v1.png');
const NAV_COMPOSITE_HOME=require('../../../assets/app/ui/royal-af/nav-composite-home-v1.png');
const TABS:{id:BottomNavTab;icon:ImageSourcePropType;label:string;route:'/home'|'/game'|'/tasks'|'/profile'}[]=[
 {id:'home',icon:require('../../../assets/app/ui/royal-af/nav-home-v1.png'),label:'ホーム',route:'/home'},
 {id:'game',icon:require('../../../assets/app/ui/royal-af/nav-game-v1.png'),label:'ゲーム',route:'/game'},
 {id:'tasks',icon:require('../../../assets/app/ui/royal-af/nav-mission-v1.png'),label:'ミッション',route:'/tasks'},
 {id:'profile',icon:require('../../../assets/app/ui/royal-af/nav-profile-v1.png'),label:'プロフィール',route:'/profile'},
];
export type BottomNavTab='home'|'game'|'tasks'|'profile';
export default function BottomNav({active,variant='royal'}:{active:BottomNavTab;variant?:'royal'|'study'|'approved'}){
 const [artworkWidth,setArtworkWidth]=useState(0);
 if(variant==='approved'&&active==='home'){
  const imageHeight=artworkWidth*724/2172;
  const barHeight=artworkWidth*(531-195)/2172;
  const imageTop=(ROYAL_LAYOUT.homeBottomNavHeight-barHeight)/2-artworkWidth*195/2172;
  return <View onLayout={event=>setArtworkWidth(Math.round(event.nativeEvent.layout.width))} style={styles.approvedContainer}>
   {artworkWidth>0&&<View pointerEvents="none" style={[styles.approvedArtwork,{width:artworkWidth,height:imageHeight,top:imageTop}]}><Image source={NAV_COMPOSITE_HOME} resizeMode="stretch" style={styles.approvedArtworkImage}/></View>}
   {TABS.map(tab=><Pressable key={tab.id} accessibilityRole="button" accessibilityLabel={tab.label} accessibilityState={{selected:active===tab.id}} onPress={()=>router.replace(tab.route)} style={({pressed})=>[styles.approvedItem,pressed&&styles.pressed]}>
    <Image source={tab.icon} resizeMode="contain" style={styles.approvedIcon}/>
    <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.75} style={[styles.approvedLabel,active===tab.id&&styles.approvedLabelActive]}>{tab.label}</Text>
   </Pressable>)}
  </View>;
 }
 return <View style={[styles.container,variant==='study'&&styles.studyContainer]}>{TABS.map(tab=><Pressable key={tab.id} accessibilityRole="button" accessibilityLabel={tab.label} accessibilityState={{selected:active===tab.id}} onPress={()=>router.replace(tab.route)} style={({pressed})=>[styles.item,variant==='study'&&styles.studyItem,pressed&&styles.pressed]}>{variant==='study'?<View style={[styles.studyFrame,active===tab.id&&styles.studyFrameActive]}><Image source={tab.icon} resizeMode="contain" style={styles.studyIcon}/><Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.85} style={[styles.studyLabel,active===tab.id&&styles.studyLabelActive]}>{tab.label}</Text></View>:<ImageBackground source={active===tab.id?NAV_IVORY:NAV_NAVY} resizeMode="stretch" style={styles.frame}><Image source={tab.icon} resizeMode="contain" style={styles.icon}/><Text numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1} minimumFontScale={.7} style={[styles.label,active===tab.id&&styles.labelActive]}>{tab.label}</Text></ImageBackground>}</Pressable>)}</View>;
}
const styles=StyleSheet.create({
 container:{width:'100%',height:ROYAL_LAYOUT.homeBottomNavHeight,flexDirection:'row',gap:2},
 item:{flex:1,minWidth:0,height:'100%'},frame:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:14,paddingTop:10,paddingBottom:10},
 icon:{width:28,height:28},label:{width:'100%',color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:11.5,lineHeight:15,textAlign:'center',includeFontPadding:false,textShadowColor:'#211305',textShadowOffset:{width:0,height:1},textShadowRadius:2},labelActive:{color:ROYAL.darkGold,textShadowColor:'rgba(255,255,255,.5)'},
 studyItem:{height:54},studyContainer:{height:'auto',minHeight:ROYAL_LAYOUT.homeBalancedBottomNavHeight,paddingHorizontal:6,paddingTop:7,paddingBottom:6,gap:6,borderWidth:1,borderRadius:14,borderColor:ROYAL.gold,backgroundColor:ROYAL.lacquer},
 studyFrame:{flex:1,minWidth:0,alignItems:'center',justifyContent:'center',gap:1,borderRadius:10,borderWidth:1,borderColor:'transparent'},studyFrameActive:{borderColor:ROYAL.gold,backgroundColor:ROYAL.lacquerLight},studyIcon:{width:23,height:23},studyLabel:{width:'100%',paddingHorizontal:2,color:ROYAL.white,fontFamily:ROYAL_FONT.body,fontSize:11,lineHeight:15,textAlign:'center'},studyLabelActive:{color:ROYAL.paleGold},
 approvedContainer:{width:'100%',height:ROYAL_LAYOUT.homeBottomNavHeight,flexDirection:'row',position:'relative',overflow:'hidden'},approvedArtwork:{position:'absolute',left:0},approvedArtworkImage:{width:'100%',height:'100%'},approvedItem:{flex:1,minWidth:0,alignItems:'center',justifyContent:'center',paddingTop:5,paddingBottom:4,paddingHorizontal:8},approvedIcon:{width:25,height:25},approvedLabel:{width:'100%',color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:11,lineHeight:15,textAlign:'center',includeFontPadding:false},approvedLabelActive:{color:ROYAL.lacquer},
 pressed:{opacity:.84,transform:[{translateY:2},{scale:.985}]},
});
