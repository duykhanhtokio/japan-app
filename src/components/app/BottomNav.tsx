import { replacePrepared } from '@/components/ui/prepareSceneRoute';
import { useIsFocused } from '@react-navigation/native';
import ImageBackground from '@/components/ui/FocusedImageBackground';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import { ROYAL, ROYAL_FONT, ROYAL_LAYOUT } from '@/components/ui/RoyalSurface';

const NAV_NAVY=require('../../../assets/app/ui/royal-af/button-wide-v2.png');
const NAV_IVORY=require('../../../assets/app/ui/royal-af/dialogue-frame-v1.png');
const NAV_COMPOSITE_NAVY=require('../../../assets/app/ui/royal-af/nav-composite-navy-v1.png');
const TABS:{id:BottomNavTab;icon:ImageSourcePropType;label:string;route:'/home'|'/game'|'/tasks'|'/profile'}[]=[
 {id:'home',icon:require('../../../assets/app/ui/royal-af/nav-home-v1.png'),label:'ホーム',route:'/home'},
 {id:'game',icon:require('../../../assets/app/ui/royal-af/nav-game-v1.png'),label:'ゲーム',route:'/game'},
 {id:'tasks',icon:require('../../../assets/app/ui/royal-af/nav-mission-v1.png'),label:'ミッション',route:'/tasks'},
 {id:'profile',icon:require('../../../assets/app/ui/royal-af/nav-profile-v1.png'),label:'プロフィール',route:'/profile'},
];
export type BottomNavTab='home'|'game'|'tasks'|'profile';
export default function BottomNav({active,variant='approved'}:{active:BottomNavTab;variant?:'royal'|'study'|'approved'}){
 const {width:screenWidth}=useWindowDimensions();
 const focused=useIsFocused();
 const approvedHeight=Math.round(76*Math.max(.9,Math.min(1.18,screenWidth/390)));
 // Preserve the outgoing layout but release its tab imagery. Stack screens
 // can remain mounted after navigation; only the focused screen owns tabs.
 if(!focused)return <View pointerEvents="none" style={{height:variant==='approved'?approvedHeight:variant==='study'?ROYAL_LAYOUT.homeBalancedBottomNavHeight:ROYAL_LAYOUT.homeBottomNavHeight,width:'100%'}}/>;
 if(variant==='approved'){
  const scale=Math.max(.9,Math.min(1.18,screenWidth/390));
  const navHeight=Math.round(76*scale);
  const imageHeight=navHeight*724/336;
  const barHeight=navHeight;
  const imageTop=(navHeight-barHeight)/2-navHeight*195/336;
  return <View style={[styles.approvedContainer,{height:navHeight}]}>
   <View pointerEvents="none" style={[styles.approvedArtwork,{width:'100%',height:imageHeight,top:imageTop}]}><Image fadeDuration={0} source={NAV_COMPOSITE_NAVY} resizeMode="stretch" style={styles.approvedArtworkImage}/></View>
   {TABS.map((tab,index)=><View key={tab.id} style={{position:'absolute',top:0,bottom:0,left:`${[105,590,1085,1575][index]/2172*100}%`,width:`${[485,495,490,495][index]/2172*100}%`}}><ApprovedTab tab={tab} active={active===tab.id} scale={scale}/></View>)}
  </View>;
 }
 return <View style={[styles.container,variant==='study'&&styles.studyContainer]}>{TABS.map(tab=><Pressable key={tab.id} accessibilityRole="button" accessibilityLabel={tab.label} accessibilityState={{selected:active===tab.id}} onPress={()=>{if(active!==tab.id)replacePrepared(tab.route)}} style={({pressed})=>[styles.item,variant==='study'&&styles.studyItem,pressed&&styles.pressed]}>{variant==='study'?<View style={[styles.studyFrame,active===tab.id&&styles.studyFrameActive]}><Image fadeDuration={0} source={tab.icon} resizeMode="contain" style={styles.studyIcon}/><Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.85} style={[styles.studyLabel,active===tab.id&&styles.studyLabelActive]}>{tab.label}</Text></View>:<ImageBackground source={active===tab.id?NAV_IVORY:NAV_NAVY} resizeMode="stretch" style={styles.frame}><Image fadeDuration={0} source={tab.icon} resizeMode="contain" style={styles.icon}/><Text numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1} minimumFontScale={.7} style={[styles.label,active===tab.id&&styles.labelActive]}>{tab.label}</Text></ImageBackground>}</Pressable>)}</View>;
}
function ApprovedTab({tab,active,scale}:{tab:typeof TABS[number];active:boolean;scale:number}){
 return <View style={styles.approvedItem}>
  <Pressable accessibilityRole="button" accessibilityLabel={tab.label} accessibilityState={{selected:active}} onPress={()=>{if(!active)replacePrepared(tab.route)}} style={({pressed})=>[styles.approvedTouch,pressed&&{opacity:.9}]}>

   <Image fadeDuration={0} source={tab.icon} resizeMode="contain" style={[styles.approvedIcon,{width:27*scale,height:27*scale}]}/>
   <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.8} maxFontSizeMultiplier={1} style={[styles.approvedLabel,{fontSize:12*scale,lineHeight:17*scale},active&&styles.approvedLabelActive]}>{tab.label}</Text>
  </Pressable>
 </View>;
}
const styles=StyleSheet.create({
 container:{width:'100%',height:ROYAL_LAYOUT.homeBottomNavHeight,flexDirection:'row',gap:2},
 item:{flex:1,minWidth:0,height:'100%'},frame:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:14,paddingTop:10,paddingBottom:10},
 icon:{width:28,height:28},label:{width:'100%',color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:11.5,lineHeight:15,textAlign:'center',includeFontPadding:false,textShadowColor:'#211305',textShadowOffset:{width:0,height:1},textShadowRadius:2},labelActive:{color:ROYAL.darkGold,textShadowColor:'rgba(255,255,255,.5)'},
 studyItem:{height:54},studyContainer:{height:'auto',minHeight:ROYAL_LAYOUT.homeBalancedBottomNavHeight,paddingHorizontal:6,paddingTop:7,paddingBottom:6,gap:6,borderWidth:1,borderRadius:14,borderColor:ROYAL.gold,backgroundColor:ROYAL.lacquer},
 studyFrame:{flex:1,minWidth:0,alignItems:'center',justifyContent:'center',gap:1,borderRadius:10,borderWidth:1,borderColor:'transparent'},studyFrameActive:{borderColor:ROYAL.gold,backgroundColor:ROYAL.lacquerLight},studyIcon:{width:23,height:23},studyLabel:{width:'100%',paddingHorizontal:2,color:ROYAL.white,fontFamily:ROYAL_FONT.body,fontSize:11,lineHeight:15,textAlign:'center'},studyLabelActive:{color:ROYAL.paleGold},
 approvedContainer:{width:'100%',height:ROYAL_LAYOUT.homeBottomNavHeight,flexDirection:'row',position:'relative',overflow:'hidden'},approvedArtwork:{position:'absolute',left:0},approvedArtworkImage:{width:'100%',height:'100%'},approvedItem:{flex:1,minWidth:0},approvedTouch:{flex:1,alignItems:'center',justifyContent:'center',paddingTop:4,paddingBottom:4,paddingHorizontal:6},approvedIcon:{width:31,height:31},approvedLabel:{width:'100%',color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:14,lineHeight:19,textAlign:'center',includeFontPadding:false},approvedLabelActive:{color:ROYAL.ivory,fontWeight:'700'},
 pressed:{transform:[{translateY:4},{scale:.975}]},
});
