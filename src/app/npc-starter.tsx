import { router } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { npcCardById } from '@/components/world/npc-card-assets';
import { npcForCategory, sceneForCategory } from '@/components/world/life-assets';
import { NPC_CATEGORIES, type NpcCategory } from '@/data/npc-progression';
import { chooseStarterNpc } from '@/services/npc-progression-storage';
import { RoyalButton, RoyalCapsule, RoyalDialogueFrame, RoyalLockCrest, ROYAL, ROYAL_FONT, ROYAL_TEXT_FIT, resolveRoyalGrid, useRoyalPositioning } from '@/components/ui/RoyalSurface';

const cardFrame=require('../../assets/app/life/rewards/npc-card-frame-royal.png');

export default function NpcStarterScreen(){
 const[saving,setSaving]=useState(false),royalPosition=useRoyalPositioning(),grid=resolveRoyalGrid(royalPosition.width,{phoneColumns:2,tabletColumns:4,desktopColumns:5,phoneInset:14,wideInset:14,gap:12}),station=NPC_CATEGORIES.find(item=>item.id==='station')??NPC_CATEGORIES[0];
 const start=async()=>{if(saving)return;setSaving(true);await chooseStarterNpc('station');router.replace('/home')};
 return <View style={s.screen}><View style={s.sky}/><SafeAreaView style={s.safe}>
  <View style={s.header}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.kicker}>最初の相棒</Text><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.title}>最初の仲間</Text><Text {...ROYAL_TEXT_FIT} minimumFontScale={0.68} numberOfLines={3} style={s.guide}>駅員からスタートします。会話レッスンを達成すると、ほかのNPCカードが順番に解放されます。</Text></View>
  <Animated.FlatList entering={FadeInDown.duration(450)} data={NPC_CATEGORIES} numColumns={grid.columns} key={grid.columns} keyExtractor={item=>item.id} contentContainerStyle={[s.list,{paddingHorizontal:grid.horizontalInset}]} columnWrapperStyle={[s.row,{gap:grid.gap}]} renderItem={({item})=><View style={{width:grid.cardWidth}}><NpcStarterCard item={item} unlocked={item.id==='station'}/></View>}/>
  <RoyalDialogueFrame style={s.confirmBar}><View><Text maxFontSizeMultiplier={1} style={s.confirmLabel}>最初のNPC</Text><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.confirmName}>{station.ja}</Text></View><RoyalButton disabled={saving} onPress={start} style={s.confirm}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.confirmText}>{saving?'保存中…':'駅員と始める'}</Text></RoyalButton></RoyalDialogueFrame>
 </SafeAreaView></View>
}

function NpcStarterCard({item,unlocked}:{item:NpcCategory;unlocked:boolean}){
 return <View accessibilityLabel={`${item.ja} ${unlocked?'利用可能':'ロック中'}`} style={[s.miniCard,unlocked&&s.unlocked]}>
  {unlocked?<Image source={npcCardById[item.id]} resizeMode="cover" style={s.completeCard}/>:<ImageBackground source={sceneForCategory(item.category)} resizeMode="cover" style={s.lockedScene}>
   <View style={s.sceneVeil}/><View style={s.characterWindow}><Image source={npcForCategory(item.category)} resizeMode="contain" style={s.lockedNpc}/><Text style={s.question}>?</Text></View>
   <Image source={cardFrame} resizeMode="stretch" style={s.frame}/><View style={s.lockedGlass}/><RoyalLockCrest style={s.lockCrest}/>
  </ImageBackground>}
  {unlocked&&<RoyalCapsule label="利用可能" style={s.startPill}/>}
 </View>
}

const s=StyleSheet.create({screen:{flex:1,backgroundColor:ROYAL.ivory},sky:{...StyleSheet.absoluteFillObject,backgroundColor:ROYAL.ivory},safe:{flex:1},header:{paddingHorizontal:18,paddingTop:10,paddingBottom:14},kicker:{color:'#8b6d38',fontFamily:ROYAL_FONT.body,fontSize:12,letterSpacing:2.8},title:{color:'#1b2633',fontFamily:ROYAL_FONT.heading,fontSize:30,lineHeight:42,marginTop:3,textShadowColor:'rgba(255,255,255,.8)',textShadowOffset:{width:0,height:2},textShadowRadius:2},guide:{color:'#58636c',fontFamily:ROYAL_FONT.body,fontSize:15,lineHeight:23,marginTop:6,maxWidth:760},list:{paddingBottom:120},row:{marginBottom:14},miniCard:{width:'100%',aspectRatio:.667,overflow:'hidden',shadowColor:'#020713',shadowOffset:{width:0,height:9},shadowOpacity:.5,shadowRadius:12,elevation:10},unlocked:{},completeCard:{width:'100%',height:'100%'},lockedScene:{flex:1},sceneVeil:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(14,21,27,.12)'},characterWindow:{position:'absolute',left:'7%',right:'7%',top:'6%',bottom:'25%',alignItems:'center',overflow:'hidden'},lockedNpc:{position:'absolute',top:0,width:'170%',height:'190%',tintColor:'#020307',opacity:.96},question:{position:'absolute',top:'38%',color:'#f7efd9',fontFamily:ROYAL_FONT.heading,fontSize:58,lineHeight:66,textShadowColor:'#000',textShadowOffset:{width:0,height:4},textShadowRadius:5},frame:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%',zIndex:3},lockedGlass:{...StyleSheet.absoluteFillObject,zIndex:4,backgroundColor:'rgba(202,215,223,.22)'},lockCrest:{position:'absolute',zIndex:6,right:8,top:8,width:54,height:54},startPill:{position:'absolute',zIndex:6,right:8,top:8,minWidth:92,height:42},confirmBar:{position:'absolute',left:12,right:12,bottom:8,minHeight:88,paddingHorizontal:34,paddingTop:24,paddingBottom:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},confirmLabel:{color:'#7c6a4c',fontFamily:ROYAL_FONT.body,fontSize:12},confirmName:{color:'#202a35',fontFamily:ROYAL_FONT.heading,fontSize:18,marginTop:2},confirm:{height:54,minWidth:165},confirmText:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:15,textShadowColor:'rgba(0,0,0,.25)',textShadowOffset:{width:0,height:1},textShadowRadius:2},disabled:{opacity:.55}});
