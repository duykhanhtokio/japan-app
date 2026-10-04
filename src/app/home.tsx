import ImageBackground from '@/components/ui/FocusedImageBackground';
import RoyalPaperPanel, { royalOpenFrameGeometry, royalOpenStrokeGeometry } from '@/components/ui/RoyalPaperPanel';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '@/components/app/BottomNav';
import GameHeader from '@/components/app/GameHeader';
import { RoyalNavyFrame, ROYAL_FONT, ROYAL_TYPE, ROYAL_LAYOUT, useRoyalPositioning } from '@/components/ui/RoyalSurface';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getGameProgress } from '@/services/progress-storage';
import type { PlayerStats } from '@/types/progress';
import { RANKS, type LearningEconomy } from '@/services/learning-economy';
import { syncJlptQualification } from '@/services/sync-jlpt-qualification';

const EMPTY_STATS:PlayerStats={xp:0,coins:0,diamonds:0,conversationCredits:0,vocabularyLearned:0,kanjiLearned:0,dialogueCompleted:0,lifeDialogueCompleted:0,workDialogueCompleted:0,speakingAccuracy:0,speakingFluency:0,pronunciation:0,listening:0,speakingMinutes:0};
const MODES=[
 {image:require('../../assets/app/home-cards/study-man.png'),badge:'WRITING & READING',ja:'筆記学習',en:'Written Study',description:'Từ vựng・Ngữ pháp・Kanji・Đọc hiểu',route:'/learn' as const},
 {image:require('../../assets/app/home-cards/conversation-three.png'),badge:'SPEAKING ROLEPLAY',ja:'会話練習',en:'Speaking Roleplay',description:'Hội thoại đời sống trên khắp Nhật Bản',route:'/world' as const},
 {image:require('../../assets/app/home-cards/tokutei-engine-safety.png'),badge:'SPECIFIED SKILLS',ja:'特定技能学習',en:'Specified Skills',description:'Tiếng Nhật chuyên ngành và kỹ năng công việc',route:'/specified-skills' as const},
];

function abilityPair(raw:string){const level=raw||'N5',next:Record<string,string>={N5:'N4',N4:'N3',N3:'N2',N2:'N1',N1:'N1'};return {level,target:raw?next[level]??'N1':'N5'}}

export default function HomeScreen(){
 const [stats,setStats]=useState(EMPTY_STATS),[economy,setEconomy]=useState<LearningEconomy|null>(null),{profile,reloadProfile}=useUserProfile(),insets=useSafeAreaInsets(),royal=useRoyalPositioning();
 useFocusEffect(useCallback(()=>{let active=true;void Promise.all([getGameProgress(),reloadProfile(),syncJlptQualification()]).then(([progress,,ledger])=>{if(active){setStats(progress.stats);setEconomy(ledger)}}).catch(error=>console.log('Load home progress error:',error));return()=>{active=false}},[reloadProfile]));
 const topInset=insets.top+ROYAL_LAYOUT.backSafeTop;
 const bottomInset=Math.max(insets.bottom,8);
 const ability=abilityPair(economy?.officialRank??'');
 const qualifiedExams=Object.fromEntries(RANKS.map(rank=>[rank,Object.keys(economy?.passed[rank]??{}).length]));
 // The approved artwork is 3:1. Keep that ratio as the available width changes;
 // the ScrollView accommodates taller cards on iPad and desktop.
 const availableWidth=useMemo(()=>Math.min(960,royal.width-2*ROYAL_LAYOUT.screenGutter),[royal.width]);
 // Keep the previous artwork dimensions and shrink only its surrounding frame.
 const previousOpening=royalOpenFrameGeometry(availableWidth,1000);
 const artworkWidth=availableWidth-previousOpening.left-previousOpening.right;
 const stroke=royalOpenStrokeGeometry(availableWidth,1000);
 const cardWidth=artworkWidth+stroke.left+stroke.right;
 const cardHeight=artworkWidth/3+stroke.top+stroke.bottom;
 return <ImageBackground fadeDuration={0} source={require('../../assets/app/welcome/welcome-japan-landscape-v2.png')} resizeMode="cover" blurRadius={40} style={styles.background}>
  <View style={[styles.screen,{paddingTop:topInset,paddingBottom:bottomInset}]}>
    <View><GameHeader variant="approved" name={profile.name?.trim()||'プレイヤー'} abilityLevel={ability.level} abilityTarget={ability.target} qualifiedExams={qualifiedExams} conversationCredits={economy?.credits??100} coins={stats.coins}/></View>
   <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} showsVerticalScrollIndicator={false}>
    <View style={styles.headingArea}><RoyalNavyFrame style={styles.headingPlaque}><Text style={styles.heading}>学習モード</Text></RoyalNavyFrame><Text style={styles.headingVi}>Chọn nội dung bạn muốn học</Text></View>
    <View style={[styles.cards,{gap:ROYAL_LAYOUT.homeModeGap}]}>{MODES.map(mode=><LearningImageCard key={mode.ja} {...mode} width={cardWidth} height={cardHeight} onPress={()=>router.push(mode.route)}/>)}</View>
   </ScrollView>
   <View><BottomNav active="home" variant="approved"/></View>
  </View>
 </ImageBackground>
}

function LearningImageCard({image,badge,ja,en,description,width,height,onPress}:{image:any;badge:string;ja:string;en:string;description:string;width:number;height:number;onPress:()=>void}){
 const bounds={width,height};
 const inner=royalOpenStrokeGeometry(bounds.width,bounds.height);
 const viewportWidth=Math.max(0,bounds.width-inner.left-inner.right),viewportHeight=Math.max(0,bounds.height-inner.top-inner.bottom);
 const source={width:2172,height:724}; // Verified dimensions of all three original PNGs.
 // Frame and artwork use the same numeric bounds on their first render.
 const scale=bounds.width>0&&bounds.height>0?Math.max(viewportWidth/source.width,viewportHeight/source.height):0;
 const artworkWidth=source.width*scale,artworkHeight=source.height*scale;
 return <Pressable testID={`home-mode-${ja}`} onPress={onPress} style={({pressed})=>[styles.card,{width,height},pressed&&styles.cardPressed]}>{scale>0&&<View testID={`home-artwork-viewport-${ja}`} pointerEvents="none" style={{position:'absolute',left:inner.left,top:inner.top,width:viewportWidth,height:viewportHeight,borderRadius:inner.radius,overflow:'hidden'}}><Image testID={`home-artwork-${ja}`} fadeDuration={0} source={image} resizeMode="stretch" style={[styles.cardArtwork,{width:artworkWidth,height:artworkHeight,left:(viewportWidth-artworkWidth)/2,top:(viewportHeight-artworkHeight)/2}]}/></View>}
<View style={styles.cardImage}><View pointerEvents="none" style={styles.cardShade}/><View style={styles.badge}><Text numberOfLines={1} style={styles.badgeText}>{badge}</Text></View><View style={styles.cardBottom}><Text numberOfLines={1} adjustsFontSizeToFit style={styles.cardJapanese}>{ja}</Text><Text numberOfLines={1} style={styles.cardEnglish}>{en}</Text><Text numberOfLines={1} adjustsFontSizeToFit style={styles.cardDescription}>{description}</Text><Text style={styles.startText}>始める　→</Text></View></View><RoyalPaperPanel borderOnly immediateBorder style={styles.cardBorder}/></Pressable>}

const styles=StyleSheet.create({
 background:{flex:1,backgroundColor:'#142847'},screen:{flex:1,paddingHorizontal:ROYAL_LAYOUT.screenGutter,gap:ROYAL_LAYOUT.homeModeGap},content:{flex:1,minHeight:0},contentInner:{flexGrow:1,paddingBottom:ROYAL_LAYOUT.homeModeGap},headingArea:{minHeight:100,paddingVertical:12,gap:6,alignItems:'center',justifyContent:'center'},headingPlaque:{width:'76%',maxWidth:360,height:52,justifyContent:'center',paddingHorizontal:34},heading:{color:'#f2db9b',fontSize:ROYAL_TYPE.pageTitle,lineHeight:28,fontFamily:ROYAL_FONT.heading,textAlign:'center'},headingVi:{color:'#fff7df',fontSize:10.5,lineHeight:14,fontFamily:ROYAL_FONT.body,textAlign:'center'},cards:{flex:1,minHeight:0,justifyContent:'center',alignItems:'center'},card:{width:'100%',maxWidth:960,borderRadius:20,overflow:'hidden',borderWidth:0,shadowColor:'#000',shadowOpacity:.22,shadowRadius:9,shadowOffset:{width:0,height:5},elevation:6},cardPressed:{opacity:.9},cardArtwork:{position:'absolute'},cardBorder:{...StyleSheet.absoluteFillObject,paddingHorizontal:0,paddingVertical:0,minHeight:0},cardImage:{flex:1,paddingHorizontal:36,paddingVertical:7,justifyContent:'space-between'},cardRadius:{borderRadius:20},cardShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,.08)'},badge:{alignSelf:'flex-start',paddingHorizontal:9,paddingVertical:4},badgeText:{color:'#fff',fontSize:7.5,letterSpacing:.7,fontFamily:ROYAL_FONT.body,textShadowColor:'#000',textShadowOffset:{width:0,height:1},textShadowRadius:2},cardBottom:{zIndex:2},cardJapanese:{color:'#fff',fontSize:21,lineHeight:26,fontFamily:ROYAL_FONT.heading,textShadowColor:'#020611',textShadowOffset:{width:0,height:1},textShadowRadius:4},cardEnglish:{color:'rgba(255,255,255,.9)',fontSize:10,lineHeight:13,fontFamily:ROYAL_FONT.body},cardDescription:{color:'rgba(255,255,255,.84)',fontSize:8.5,lineHeight:12,fontFamily:ROYAL_FONT.body,marginTop:1},startText:{alignSelf:'flex-end',color:'#fff3cf',fontSize:10.5,lineHeight:14,fontFamily:ROYAL_FONT.heading,marginTop:2}
});
