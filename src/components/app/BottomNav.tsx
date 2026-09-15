import { router } from 'expo-router';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { ROYAL, ROYAL_FONT, ROYAL_LAYOUT } from '@/components/ui/RoyalSurface';

const NAV_NAVY=require('../../../assets/app/ui/royal-af/button-wide-v2.png');
const NAV_IVORY=require('../../../assets/app/ui/royal-af/dialogue-frame-v1.png');
const TABS:Array<{id:BottomNavTab;icon:ImageSourcePropType;label:string;route:'/home'|'/game'|'/tasks'|'/profile'}>=[
 {id:'home',icon:require('../../../assets/app/ui/royal-af/nav-home-v1.png'),label:'ホーム',route:'/home'},
 {id:'game',icon:require('../../../assets/app/ui/royal-af/nav-game-v1.png'),label:'ゲーム',route:'/game'},
 {id:'tasks',icon:require('../../../assets/app/ui/royal-af/nav-mission-v1.png'),label:'ミッション',route:'/tasks'},
 {id:'profile',icon:require('../../../assets/app/ui/royal-af/nav-profile-v1.png'),label:'プロフィール',route:'/profile'},
];
export type BottomNavTab='home'|'game'|'tasks'|'profile';
export default function BottomNav({active}:{active:BottomNavTab}){return <View style={styles.container}>{TABS.map(tab=><Pressable key={tab.id} accessibilityRole="button" accessibilityLabel={tab.label} onPress={()=>router.replace(tab.route)} style={({pressed})=>[styles.item,pressed&&styles.pressed]}><ImageBackground source={active===tab.id?NAV_IVORY:NAV_NAVY} resizeMode="stretch" style={styles.frame}><Image source={tab.icon} resizeMode="contain" style={styles.icon}/><Text numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1} minimumFontScale={.7} style={[styles.label,active===tab.id&&styles.labelActive]}>{tab.label}</Text></ImageBackground></Pressable>)}</View>}
const styles=StyleSheet.create({container:{width:'100%',height:ROYAL_LAYOUT.homeBottomNavHeight,flexDirection:'row',gap:2},item:{flex:1,minWidth:0,height:'100%'},frame:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:14,paddingTop:10,paddingBottom:10},icon:{width:28,height:28},label:{width:'100%',color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:11.5,lineHeight:15,textAlign:'center',includeFontPadding:false,textShadowColor:'#211305',textShadowOffset:{width:0,height:1},textShadowRadius:2},labelActive:{color:ROYAL.darkGold,textShadowColor:'rgba(255,255,255,.5)'},pressed:{opacity:.84,transform:[{translateY:2},{scale:.985}]}});
