import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '@/components/app/BottomNav';
import GameHeader from '@/components/app/GameHeader';
import { ROYAL_FONT, ROYAL_LAYOUT, useRoyalPositioning } from '@/components/ui/RoyalSurface';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getGameProgress } from '@/services/progress-storage';
import type { PlayerStats } from '@/types/progress';

const EMPTY_STATS:PlayerStats={xp:0,coins:0,diamonds:0,conversationCredits:0,vocabularyLearned:0,kanjiLearned:0,dialogueCompleted:0,lifeDialogueCompleted:0,workDialogueCompleted:0,speakingAccuracy:0,speakingFluency:0,pronunciation:0,listening:0,speakingMinutes:0};
const MODES=[
 {image:require('../../assets/app/home-cards/writing.jpg'),badge:'WRITING & READING',ja:'筆記学習',en:'Written Study',description:'Từ vựng・Ngữ pháp・Kanji・Đọc hiểu',route:'/learn' as const},
 {image:require('../../assets/app/home-cards/speaking.jpg'),badge:'SPEAKING ROLEPLAY',ja:'会話練習',en:'Speaking Roleplay',description:'Hội thoại đời sống trên khắp Nhật Bản',route:'/world' as const},
 {image:require('../../assets/app/home-cards/specified-skills.jpg'),badge:'SPECIFIED SKILLS',ja:'特定技能学習',en:'Specified Skills',description:'Tiếng Nhật chuyên ngành và kỹ năng công việc',route:'/specified-skills' as const},
];

function abilityPair(raw:string){const level=raw||'N5',next:Record<string,string>={未受験:'N5',N5:'N4',N4:'N3',N3:'N2',N2:'N1',N1:'N1'};return {level,target:next[level]??'N4'}}

export default function HomeScreen(){
 const [stats,setStats]=useState(EMPTY_STATS),{profile,reloadProfile}=useUserProfile(),insets=useSafeAreaInsets(),royal=useRoyalPositioning();
 useFocusEffect(useCallback(()=>{let active=true;void Promise.all([getGameProgress(),reloadProfile()]).then(([progress])=>{if(active)setStats(progress.stats)}).catch(error=>console.log('Load home progress error:',error));return()=>{active=false}},[reloadProfile]));
 const edgeInset=Math.max(insets.top,insets.bottom)+ROYAL_LAYOUT.homeEdgeGap;
 const ability=abilityPair(profile.level);
 const cardHeight=useMemo(()=>{const usable=royal.height-edgeInset*2-ROYAL_LAYOUT.homeHudHeight-ROYAL_LAYOUT.homeBottomNavHeight-ROYAL_LAYOUT.homeHeadingHeight-ROYAL_LAYOUT.homeModeGap*2;return Math.max(124,Math.min(178,Math.floor(usable/3)))},[edgeInset,royal.height]);
 return <ImageBackground source={require('../../assets/app/home/home-bg.jpg')} style={styles.background} resizeMode="cover"><View pointerEvents="none" style={styles.overlay}/>
  <View style={[styles.screen,{paddingTop:edgeInset,paddingBottom:edgeInset}]}>
   <View style={styles.content}>
    <GameHeader name={profile.name?.trim()||'プレイヤー'} abilityLevel={ability.level} abilityTarget={ability.target} abilityProgress={(stats.xp%1000)/1000} conversationCredits={stats.conversationCredits} coins={stats.coins}/>
    <View style={styles.headingArea}><Text style={styles.heading}>学習モード</Text><Text style={styles.headingVi}>Chọn nội dung bạn muốn học</Text></View>
    <View style={[styles.cards,{gap:ROYAL_LAYOUT.homeModeGap}]}>{MODES.map(mode=><LearningImageCard key={mode.ja} {...mode} height={cardHeight} onPress={()=>router.push(mode.route)}/>)}</View>
   </View>
   <BottomNav active="home"/>
  </View>
 </ImageBackground>
}

function LearningImageCard({image,badge,ja,en,description,height,onPress}:{image:any;badge:string;ja:string;en:string;description:string;height:number;onPress:()=>void}){return <Pressable onPress={onPress} style={({pressed})=>[styles.card,{height},pressed&&styles.cardPressed]}><ImageBackground source={image} resizeMode="cover" style={styles.cardImage} imageStyle={styles.cardRadius}><View pointerEvents="none" style={styles.cardShade}/><View style={styles.badge}><Text numberOfLines={1} style={styles.badgeText}>{badge}</Text></View><View style={styles.cardBottom}><Text numberOfLines={1} adjustsFontSizeToFit style={styles.cardJapanese}>{ja}</Text><Text numberOfLines={1} style={styles.cardEnglish}>{en}</Text><Text numberOfLines={1} adjustsFontSizeToFit style={styles.cardDescription}>{description}</Text><Text style={styles.startText}>始める　→</Text></View></ImageBackground></Pressable>}

const styles=StyleSheet.create({
 background:{flex:1},overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(15,10,25,.42)'},screen:{flex:1,paddingHorizontal:ROYAL_LAYOUT.screenGutter,gap:ROYAL_LAYOUT.homeModeGap},content:{flex:1,minHeight:0},headingArea:{height:ROYAL_LAYOUT.homeHeadingHeight,alignItems:'center',justifyContent:'center'},heading:{color:'#fff',fontSize:22,lineHeight:28,fontFamily:ROYAL_FONT.heading,textAlign:'center',textShadowColor:'#000',textShadowOffset:{width:0,height:2},textShadowRadius:3},headingVi:{color:'rgba(255,255,255,.86)',fontSize:10.5,lineHeight:14,fontFamily:ROYAL_FONT.body,textAlign:'center'},cards:{flex:1,minHeight:0,justifyContent:'center'},card:{width:'100%',minHeight:124,borderRadius:20,overflow:'hidden',shadowColor:'#000',shadowOpacity:.22,shadowRadius:9,shadowOffset:{width:0,height:5},elevation:6},cardPressed:{opacity:.74,transform:[{scale:.985}]},cardImage:{flex:1,paddingHorizontal:15,paddingVertical:11,justifyContent:'space-between'},cardRadius:{borderRadius:20},cardShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,.43)'},badge:{alignSelf:'flex-start',paddingHorizontal:9,paddingVertical:4},badgeText:{color:'#fff',fontSize:7.5,letterSpacing:.7,fontFamily:ROYAL_FONT.body,textShadowColor:'#000',textShadowOffset:{width:0,height:1},textShadowRadius:2},cardBottom:{zIndex:2},cardJapanese:{color:'#fff',fontSize:21,lineHeight:26,fontFamily:ROYAL_FONT.heading},cardEnglish:{color:'rgba(255,255,255,.9)',fontSize:10,lineHeight:13,fontFamily:ROYAL_FONT.body},cardDescription:{color:'rgba(255,255,255,.84)',fontSize:8.5,lineHeight:12,fontFamily:ROYAL_FONT.body,marginTop:1},startText:{alignSelf:'flex-end',color:'#fff3cf',fontSize:10.5,lineHeight:14,fontFamily:ROYAL_FONT.heading,marginTop:2}
});
