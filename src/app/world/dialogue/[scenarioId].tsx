import * as Speech from 'expo-speech';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated as NativeAnimated, Image, ImageBackground, LayoutChangeEvent, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { npcForCategory, sceneForCategory } from '@/components/world/life-assets';
import { useAppLanguage } from '@/context/LanguageContext';
import { useGameSpeech } from '@/hooks/useGameSpeech';
import { useUserProfile } from '@/hooks/useUserProfile';
import { loadDialogueTurns } from '@/services/dialogue-content-loader';
import { getLifeLocationById, getLifeScenarioById } from '@/services/life-content-repository';
import NpcRewardModal from '@/components/world/NpcRewardModal';
import { normalizeNpcCategory, npcCategoryById, type NpcCategory } from '@/data/npc-progression';
import { recordNpcScenario } from '@/services/npc-progression-storage';
import { scenarioMission } from '@/components/world/scenario-mission';
import { getPlayerAnswerGuidance } from '@/components/world/player-answer-guidance';
import { RoyalBackButton, RoyalButton, RoyalDialogueFrame, RoyalField, RoyalHintButton, RoyalLabelPlaque, ROYAL, ROYAL_CONTENT_GROUP, ROYAL_FONT, ROYAL_PLACEMENT, ROYAL_TEXT_FIT, ROYAL_TYPE, useRoyalPositioning } from '@/components/ui/RoyalSurface';

const MICROPHONE = require('../../../../assets/app/ui/royal-af/microphone-v2.png');

type Theme={bubble:string;border:string;depth:string;accent:string;text:string;reading:string};
function themeFor(category?:string|null):Theme{const v=(category??'').toLowerCase();if(/hospital|pharmacy/.test(v))return{bubble:'rgba(245,253,255,.97)',border:'#76bfd0',depth:'#3f8394',accent:'#237d94',text:'#173947',reading:'#52717b'};if(/restaurant|cafe|ramen|izakaya/.test(v))return{bubble:'rgba(255,250,240,.97)',border:'#d9a65e',depth:'#956322',accent:'#9b5e22',text:'#422d1c',reading:'#765b46'};if(/nature|park|shrine|onsen/.test(v))return{bubble:'rgba(247,255,244,.97)',border:'#88ba72',depth:'#4f8142',accent:'#397337',text:'#203c24',reading:'#56705a'};if(/police|construction|station/.test(v))return{bubble:'rgba(245,250,255,.97)',border:'#6e9ec8',depth:'#345f87',accent:'#2e6491',text:'#1d3549',reading:'#586c7e'};return{bubble:'rgba(255,252,246,.97)',border:'#d4b477',depth:'#806331',accent:'#81612c',text:'#342d23',reading:'#6e6252'}}

function PulsingMic({disabled,onPress}:{disabled:boolean;onPress:()=>void}){
 const pulse=useRef(new NativeAnimated.Value(0)).current;
 useEffect(()=>{const loop=NativeAnimated.loop(NativeAnimated.sequence([NativeAnimated.timing(pulse,{toValue:1,duration:1500,useNativeDriver:true}),NativeAnimated.timing(pulse,{toValue:0,duration:1500,useNativeDriver:true})]));loop.start();return()=>loop.stop()},[pulse]);
 return <Pressable accessibilityRole="button" accessibilityLabel="録音を開始" disabled={disabled} onPress={onPress} style={({pressed})=>[s.mic,disabled&&s.disabled,pressed&&s.pressed]}><NativeAnimated.Image source={MICROPHONE} resizeMode="contain" style={[s.micIcon,{opacity:pulse.interpolate({inputRange:[0,1],outputRange:[.42,1]}),transform:[{scale:pulse.interpolate({inputRange:[0,1],outputRange:[.96,1.06]})}]}]}/></Pressable>
}

export default function DialogueScreen(){
 const raw=useLocalSearchParams<{scenarioId:string}>().scenarioId,id=Array.isArray(raw)?raw[0]:raw;
 const scenario=id?getLifeScenarioById(id):null,location=scenario?.locationId?getLifeLocationById(scenario.locationId):null;
 const{profile}=useUserProfile(),{language}=useAppLanguage(),royalPosition=useRoyalPositioning(),insets=useSafeAreaInsets(),wide=royalPosition.isWide;
 const turns=useMemo(()=>id?loadDialogueTurns(id,profile.level):[],[id,profile.level]);
 const[index,setIndex]=useState(0),[revealedTurnIds,setRevealedTurnIds]=useState<Set<string>>(()=>new Set()),[npcSpeechDone,setNpcSpeechDone]=useState(true),[rewardVisible,setRewardVisible]=useState(false),[rewardCategory,setRewardCategory]=useState<NpcCategory|null>(null),[rewardProgress,setRewardProgress]=useState(0),[isUnlock,setIsUnlock]=useState(false),[finishing,setFinishing]=useState(false),[railHeight,setRailHeight]=useState(0),[visibleStart,setVisibleStart]=useState(0),[measureVersion,setMeasureVersion]=useState(0),speech=useGameSpeech(),turn=turns[index],npcTurn=turn?.speaker==='NPC';
 const abortListening=speech.abortListening;
 const bubbleHeights=useRef<Record<number,number>>({});
 const theme=themeFor(location?.category),background=sceneForCategory(location?.category),npcImage=npcForCategory(location?.category),controlsBottom=Math.max(18,insets.bottom+10),dialogueBottom=controlsBottom+68,mission=scenarioMission(scenario,location?.category),npcCategory=normalizeNpcCategory(location?.category),npcName=npcCategory?`${npcCategory.ja}さん`:'スタッフ',playerName=profile.name?.trim()||'プレイヤー';
 useEffect(()=>{abortListening();Speech.stop();if(turn?.speaker==='NPC'&&turn.npc?.textJa){setNpcSpeechDone(false);Speech.speak(turn.npc.textJa,{language:'ja-JP',rate:.82,onDone:()=>setNpcSpeechDone(true),onStopped:()=>setNpcSpeechDone(true),onError:()=>setNpcSpeechDone(true)})}else setNpcSpeechDone(true);return()=>{Speech.stop()}},[turn?.id,turn?.speaker,turn?.npc?.textJa,abortListening]);
 useEffect(()=>{if(!railHeight)return;let used=0,start=index;for(let i=index;i>=0;i--){const h=bubbleHeights.current[i];if(!h)continue;if(used+h>railHeight-8&&used>0)break;used+=h;start=i}setVisibleStart(start)},[index,revealedTurnIds,railHeight,measureVersion]);
 if(!scenario||!turn)return <SafeAreaView style={s.emptyScreen}><Text style={s.empty}>会話データがありません。</Text></SafeAreaView>;
 const nextHint=()=>setRevealedTurnIds(previous=>{const next=new Set(previous);next.add(turn.id);return next}),move=(next:number)=>{speech.abortListening();setIndex(Math.max(0,Math.min(turns.length-1,next)))};
 const finish=async()=>{if(finishing)return;const category=normalizeNpcCategory(location?.category);if(!category){router.back();return}setFinishing(true);const result=await recordNpcScenario(scenario.id,category.id);const unlocked=result.unlockedCategoryId?npcCategoryById(result.unlockedCategoryId):null;setRewardCategory(unlocked??category);setRewardProgress(result.progress);setIsUnlock(!!unlocked);setRewardVisible(true);setFinishing(false)};
 const onBubbleLayout=(bubbleIndex:number,e:LayoutChangeEvent)=>{const next=e.nativeEvent.layout.height+12;if(Math.abs((bubbleHeights.current[bubbleIndex]??0)-next)>1){bubbleHeights.current[bubbleIndex]=next;setMeasureVersion(v=>v+1)}};
 return <ImageBackground source={background} resizeMode="cover" style={s.screen}><View style={s.backdrop}/><SafeAreaView style={s.safe}>
  <View style={s.header}><RoyalBackButton onPress={()=>router.back()}/><View style={s.headerTitle}><View style={s.titleRow}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.title}>{location?.nameJa??'会話練習'}</Text></View><RoyalField sizingGroup={ROYAL_CONTENT_GROUP.worldHeaderMission} label="課題" style={s.missionCard}><Text maxFontSizeMultiplier={1} style={s.missionText}>{mission}</Text></RoyalField></View></View>
  <View pointerEvents="none" style={[s.npcLayer,{bottom:controlsBottom},wide&&s.npcLayerWide]}><Image source={npcImage} resizeMode="contain" style={s.npcImage}/></View>
  <View onLayout={(e)=>setRailHeight(e.nativeEvent.layout.height)} style={[s.bubbleLayer,{bottom:dialogueBottom},wide&&s.bubbleLayerWide]}><View style={s.bubbleScroll}>
   {turns.slice(visibleStart,index+1).map((item,offset)=>{const bubbleIndex=visibleStart+offset,current=bubbleIndex===index,isNpc=item.speaker==='NPC',revealed=revealedTurnIds.has(item.id),showAnswer=isNpc?revealed:(!current||revealed),ja=isNpc?item.npc?.textJa:item.player?.recommendedAnswerJa,reading=isNpc?item.npc?.furigana:item.player?.recommendedAnswerFurigana,guidance=!isNpc&&item.player?getPlayerAnswerGuidance(item.player,language):'';return <Animated.View key={item.id} onLayout={(e)=>onBubbleLayout(bubbleIndex,e)} entering={FadeIn.duration(220)} exiting={FadeOut.duration(180)} layout={LinearTransition.duration(220)} style={[s.bubbleWrap,!isNpc&&s.playerWrap]}><RoyalLabelPlaque style={s.speakerPlate}>{isNpc?npcName:playerName}</RoyalLabelPlaque><View style={s.bubbleDepth}><RoyalDialogueFrame style={s.bubble}> 
    {showAnswer ? (
      <>
        <Text {...ROYAL_TEXT_FIT} minimumFontScale={0.65} style={[s.japanese,{color:theme.text}]}>{ja}</Text>
        {!!reading && reading !== ja && <Text {...ROYAL_TEXT_FIT} minimumFontScale={0.62} style={[s.reading,{color:theme.reading}]}>{reading}</Text>}
      </>
    ) : isNpc ? (
      <Text {...ROYAL_TEXT_FIT} minimumFontScale={0.62} style={[s.guidance,{color:theme.text}]}>音声を聞いてください。文字を確認する場合は提灯を押してください。</Text>
    ) : (
      <Text {...ROYAL_TEXT_FIT} minimumFontScale={0.62} style={[s.guidance,{color:theme.text}]}>{guidance}</Text>
    )}
    {current&&!isNpc&&<View style={s.speechArea}>{(speech.recognizing||!!speech.transcript)&&<Text style={[s.transcript,{color:theme.text}]}>「{speech.transcript||'音声を認識しています…'}」</Text>}<PulsingMic disabled={!speech.speechAvailable||speech.recognizing} onPress={()=>speech.startListening()}/>{!!speech.speechError&&<Text style={s.error}>{speech.speechError}</Text>}</View>}
   </RoyalDialogueFrame>{current&&<RoyalHintButton onPress={nextHint} style={s.hintButton}/>}</View></Animated.View>})}
  </View></View>
  <View style={[s.controls,{bottom:controlsBottom},wide&&s.controlsWide]}><RoyalButton disabled={index===0} onPress={()=>move(index-1)} style={s.control}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.controlText}>前へ</Text></RoyalButton><RoyalButton disabled={finishing||(npcTurn&&!npcSpeechDone)} onPress={()=>index+1<turns.length?move(index+1):finish()} style={s.control}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.controlText}>{index+1<turns.length?'次へ':finishing?'保存中…':npcTurn&&!npcSpeechDone?'再生中…':'終了'}</Text></RoyalButton></View>
  <NpcRewardModal visible={rewardVisible} category={rewardCategory} progress={rewardProgress} isUnlock={isUnlock} onClose={()=>{setRewardVisible(false);if(scenario.cityId)router.replace(`/world/city/${scenario.cityId}`);else router.back()}}/>
 </SafeAreaView></ImageBackground>
}

const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:'#d9e7ef'},backdrop:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(5,12,24,.15)'},safe:{flex:1},
 header:{zIndex:10,flexDirection:'row',alignItems:'flex-start',gap:ROYAL_PLACEMENT.headerGap,paddingHorizontal:ROYAL_PLACEMENT.headerHorizontal,paddingTop:ROYAL_PLACEMENT.headerTop},headerTitle:{flex:1},
 titleRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:6},title:{flex:1,color:'#fff',fontFamily:ROYAL_FONT.heading,fontSize:20,textShadowColor:'rgba(0,0,0,.65)',textShadowOffset:{width:0,height:2},textShadowRadius:5},
 missionCard:{marginTop:4,maxWidth:430,minHeight:112},missionText:{color:'#18304b',fontFamily:ROYAL_FONT.body,fontSize:ROYAL_TYPE.explanation,lineHeight:ROYAL_TYPE.explanationLine,textAlign:'center'},
 npcLayer:{position:'absolute',zIndex:1,left:'3%',right:'3%',height:'72%'},npcLayerWide:{left:'2%',right:'50%',height:'82%'},npcImage:{width:'100%',height:'100%'},
 bubbleLayer:{position:'absolute',zIndex:5,left:10,right:10,top:'68%',overflow:'hidden'},bubbleLayerWide:{left:'51%',right:'3%',top:'64%'},bubbleScroll:{flex:1,justifyContent:'flex-start',paddingTop:18,paddingBottom:14},
 bubbleWrap:{marginBottom:17,marginRight:'7%',paddingTop:8},playerWrap:{marginLeft:'7%',marginRight:0},speakerPlate:{position:'absolute',zIndex:14,left:18,top:-2,minWidth:116,maxWidth:'72%',height:43},
 bubbleDepth:{position:'relative',shadowColor:'#020713',shadowOffset:{width:0,height:8},shadowOpacity:.42,shadowRadius:12,elevation:10},bubble:{minHeight:108},
 japanese:{fontFamily:ROYAL_FONT.heading,fontSize:ROYAL_TYPE.dialogue,lineHeight:ROYAL_TYPE.dialogueLine,textAlign:'center'},reading:{fontFamily:ROYAL_FONT.body,fontSize:ROYAL_TYPE.optionSecondary,lineHeight:19,marginTop:3,textAlign:'center'},guidance:{fontFamily:ROYAL_FONT.body,fontSize:ROYAL_TYPE.dialogue,lineHeight:ROYAL_TYPE.dialogueLine,textAlign:'center'},
 hintButton:{position:'absolute',right:8,bottom:6,zIndex:20,width:50,height:62},
 speechArea:{marginTop:8,alignItems:'center',justifyContent:'center',gap:6,minHeight:44},transcript:{width:'100%',fontSize:16,lineHeight:24,fontFamily:ROYAL_FONT.body,textAlign:'center',textAlignVertical:'center',includeFontPadding:false},error:{color:'#a22d35',fontFamily:ROYAL_FONT.body},mic:{width:42,height:42,alignItems:'center',justifyContent:'center'},micIcon:{width:'100%',height:'100%'},
 controls:{position:'absolute',zIndex:8,left:10,right:10,flexDirection:'row',gap:6},controlsWide:{left:'51%',right:'3%'},control:{flex:1,height:66},controlText:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:18},pressed:{opacity:.86,transform:[{scale:.97}]},disabled:{opacity:.35},emptyScreen:{flex:1,backgroundColor:'#0b1b2a'},empty:{color:'#fff',fontFamily:ROYAL_FONT.body,padding:24,fontSize:18},
});
