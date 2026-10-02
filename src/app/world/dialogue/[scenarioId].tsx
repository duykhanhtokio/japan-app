import * as Speech from 'expo-speech';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated as NativeAnimated, Image, ImageBackground, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { npcForCategory, sceneForCategory } from '@/components/world/life-assets';
import { locationBackground } from '@/components/world/location-backgrounds.generated';
import { useAppLanguage } from '@/context/LanguageContext';
import { useGameSpeech } from '@/hooks/useGameSpeech';
import { useUserProfile } from '@/hooks/useUserProfile';
import { loadDialogueTurns } from '@/services/dialogue-content-loader';
import { getLifeLocationById, getLifeScenarioById } from '@/services/life-content-repository';
import WaitingSpeechDots from '@/components/world/WaitingSpeechDots';
import JapaneseRuby from '@/components/world/JapaneseRuby';
import RoyalReadingFrame from '@/components/world/RoyalReadingFrame';
import NpcRewardModal from '@/components/world/NpcRewardModal';
import { normalizeNpcCategory, npcCategoryById, type NpcCategory } from '@/data/npc-progression';
import { recordNpcScenario } from '@/services/npc-progression-storage';
import { scenarioMission } from '@/components/world/scenario-mission';
import { displayLocationNameJa } from '@/components/world/world-ja';
import { getPlayerNativeHint } from '@/components/world/player-answer-guidance';
import { RoyalBackButton, RoyalButton, RoyalHintButton, RoyalNavyFrame, ROYAL, ROYAL_FONT, ROYAL_PLACEMENT, ROYAL_TEXT_FIT, ROYAL_TYPE, useRoyalPositioning } from '@/components/ui/RoyalSurface';

const missingHint:Record<string,string>={ja:'この文のヒントはまだありません。',vi:'Chưa có gợi ý cho câu này.',en:'No hint is available for this line yet.',id:'Petunjuk untuk kalimat ini belum tersedia.','zh-CN':'这句话暂时没有提示。','zh-TW':'這句話暫時沒有提示。',hi:'इस वाक्य के लिए संकेत अभी उपलब्ध नहीं है।',bn:'এই বাক্যের ইঙ্গিত এখনও পাওয়া যায়নি।',ne:'यस वाक्यको सङ्केत अझै उपलब्ध छैन।',my:'ဤစာကြောင်းအတွက် အရိပ်အမြွက် မရရှိသေးပါ။',th:'ยังไม่มีคำใบ้สำหรับประโยคนี้',km:'មិនទាន់មានតម្រុយសម្រាប់ប្រយោគនេះទេ។',tl:'Wala pang pahiwatig para sa linyang ito.'};

const MICROPHONE = require('../../../../assets/app/ui/royal-af/microphone-v2.png');

type Theme={bubble:string;border:string;depth:string;accent:string;text:string;reading:string};
function themeFor(category?:string|null):Theme{const v=(category??'').toLowerCase();if(/hospital|pharmacy/.test(v))return{bubble:'rgba(245,253,255,.97)',border:'#76bfd0',depth:'#3f8394',accent:'#237d94',text:'#173947',reading:'#52717b'};if(/restaurant|cafe|ramen|izakaya/.test(v))return{bubble:'rgba(255,250,240,.97)',border:'#d9a65e',depth:'#956322',accent:'#9b5e22',text:'#422d1c',reading:'#765b46'};if(/nature|park|shrine|onsen/.test(v))return{bubble:'rgba(247,255,244,.97)',border:'#88ba72',depth:'#4f8142',accent:'#397337',text:'#203c24',reading:'#56705a'};if(/police|construction|station/.test(v))return{bubble:'rgba(245,250,255,.97)',border:'#6e9ec8',depth:'#345f87',accent:'#2e6491',text:'#1d3549',reading:'#586c7e'};return{bubble:'rgba(255,252,246,.97)',border:'#d4b477',depth:'#806331',accent:'#81612c',text:'#342d23',reading:'#6e6252'}}

function PulsingMic({disabled,recording,onPress}:{disabled:boolean;recording:boolean;onPress:()=>void}){
 const pulse=useRef(new NativeAnimated.Value(0)).current;
 useEffect(()=>{const loop=NativeAnimated.loop(NativeAnimated.sequence([NativeAnimated.timing(pulse,{toValue:1,duration:1500,useNativeDriver:true}),NativeAnimated.timing(pulse,{toValue:0,duration:1500,useNativeDriver:true})]));loop.start();return()=>loop.stop()},[pulse]);
 return <Pressable accessibilityRole="button" accessibilityLabel={recording?'録音を停止':'録音を開始'} disabled={disabled} onPress={onPress} style={({pressed})=>[s.mic,disabled&&s.disabled,pressed&&s.pressed]}><NativeAnimated.Image source={MICROPHONE} resizeMode="contain" style={[s.micIcon,{opacity:pulse.interpolate({inputRange:[0,1],outputRange:[.42,1]}),transform:[{scale:pulse.interpolate({inputRange:[0,1],outputRange:[.96,1.06]})}]}]}/></Pressable>
}

export default function DialogueScreen(){
 const raw=useLocalSearchParams<{scenarioId:string}>().scenarioId,id=Array.isArray(raw)?raw[0]:raw;
 const scenario=id?getLifeScenarioById(id):null,location=scenario?.locationId?getLifeLocationById(scenario.locationId):null;
 const{profile}=useUserProfile(),{language}=useAppLanguage(),royalPosition=useRoyalPositioning(),insets=useSafeAreaInsets(),wide=royalPosition.isWide;
 const turns=useMemo(()=>id?loadDialogueTurns(id):[],[id]);
 const[index,setIndex]=useState(0),[revealedTurnIds,setRevealedTurnIds]=useState<Set<string>>(()=>new Set()),[npcSpeechDone,setNpcSpeechDone]=useState(true),[rewardVisible,setRewardVisible]=useState(false),[rewardCategory,setRewardCategory]=useState<NpcCategory|null>(null),[rewardProgress,setRewardProgress]=useState(0),[isUnlock,setIsUnlock]=useState(false),[finishing,setFinishing]=useState(false),speech=useGameSpeech(),turn=turns[index],npcTurn=turn?.speaker==='NPC';
 const [spokenLengths,setSpokenLengths]=useState<Record<string,number>>({});
 const [hintStages,setHintStages]=useState<Record<string,number>>({});
 const [stageSize,setStageSize]=useState({width:0,height:0}),[headerHeight,setHeaderHeight]=useState(0);
 const abortListening=speech.abortListening;
 const heardNpcIds=useRef(new Set<string>());
 const npcContext=npcTurn?turn:turns.slice(0,index).reverse().find(item=>item.speaker==='NPC');
 const theme=themeFor(location?.category),background=locationBackground(location?.id,location?.category)??sceneForCategory(location?.category),npcImage=npcForCategory(location?.category),controlsBottom=Math.max(18,insets.bottom+10),mission=scenarioMission(scenario,location?.category),npcCategory=normalizeNpcCategory(location?.category),npcName=npcCategory?`${npcCategory.ja}さん`:'スタッフ',playerName=profile.name?.trim()||'プレイヤー';
 useEffect(()=>{
  let active=true;
  abortListening();
  const begin=async()=>{
  await Speech.stop();
  if(!active)return;
  if(turn?.speaker==='NPC'&&turn.npc?.textJa&&!heardNpcIds.current.has(turn.id)){
   const spokenText=turn.npc.textJa;
   setNpcSpeechDone(false);
   setSpokenLengths(previous=>({...previous,[turn.id]:0}));
   Speech.speak(spokenText,{language:'ja-JP',rate:.82,
    onBoundary:(event:{charIndex:number;charLength?:number})=>{
     if(!active)return;
     const end=Math.min(spokenText.length,event.charIndex+Math.max(1,event.charLength??1));
     setSpokenLengths(previous=>({...previous,[turn.id]:Math.max(previous[turn.id]??0,end)}));
    },
    onDone:()=>{
     if(!active)return;
     heardNpcIds.current.add(turn.id);
     setNpcSpeechDone(true);
     setRevealedTurnIds(previous=>new Set(previous).add(turn.id));
     if(turns[index+1]?.speaker==='PLAYER')setIndex(current=>current===index?index+1:current);
    },
    onStopped:()=>{if(active)setNpcSpeechDone(true)},
    onError:()=>{if(active)setNpcSpeechDone(true)},
   });
  }else setNpcSpeechDone(true);
  };
  void begin().catch(()=>{if(active)setNpcSpeechDone(true)});
  return()=>{active=false;void Speech.stop()};
 },[turn?.id,turn?.speaker,turn?.npc?.textJa,abortListening,index,turns]);
 if(!scenario||!turn)return <SafeAreaView style={s.emptyScreen}><Text style={s.empty}>会話データがありません。</Text></SafeAreaView>;
 const nextHint=(turnId:string,isNpc:boolean)=>{if(isNpc)setHintStages(previous=>({...previous,[turnId]:previous[turnId]?0:1}));else setHintStages(previous=>({...previous,[turnId]:Math.min(2,(previous[turnId]??0)+1)}))},move=(next:number)=>{speech.abortListening();setIndex(Math.max(0,Math.min(turns.length-1,next)))};
 const finish=async()=>{if(finishing)return;const category=normalizeNpcCategory(location?.category);if(!category){router.back();return}setFinishing(true);const result=await recordNpcScenario(scenario.id,category.id);const unlocked=result.unlockedCategoryId?npcCategoryById(result.unlockedCategoryId):null;setRewardCategory(unlocked??category);setRewardProgress(result.progress);setIsUnlock(!!unlocked);setRewardVisible(true);setFinishing(false)};
 const npcSource=Image.resolveAssetSource?.(npcImage),npcRatio=npcSource?npcSource.width/npcSource.height:2/3;
 const npcBoxHeight=stageSize.height*(wide?.82:.72),npcBoxWidth=stageSize.width*(wide?.48:.94);
 const npcDrawHeight=Math.min(npcBoxHeight,npcBoxWidth/npcRatio);
 const npcWaist=stageSize.height-controlsBottom-npcBoxHeight+(npcBoxHeight-npcDrawHeight)/2+npcDrawHeight*.43;
 const conversationTop=Math.max(headerHeight+8,npcWaist);
 const renderPanel=(panel:typeof turn,context=false)=>{
  const isNpc=panel.speaker==='NPC',showText=context||revealedTurnIds.has(panel.id),hintStage=hintStages[panel.id]??0;
  const npcText=showText?panel.npc?.textJa??'':(panel.npc?.textJa??'').slice(0,spokenLengths[panel.id]??0);
  const npcTranslation=panel.npc?.translations?.[language]??(language==='vi'?panel.npc?.translationVi:null);
  return <View key={panel.id} style={s.bubbleWrap}>
   <RoyalNavyFrame style={s.speakerPlate}><Text numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1} style={s.speakerName}>{isNpc?npcName:playerName}</Text></RoyalNavyFrame>
   <View style={s.bubbleDepth}><RoyalReadingFrame>
    {!isNpc?hintStage===0?<WaitingSpeechDots/>:hintStage===1?<Text style={[s.guidance,{color:theme.text}]}>{(panel.player?getPlayerNativeHint(panel.player,language):null)??missingHint[language]}</Text>:<JapaneseRuby text={panel.player?.recommendedAnswerJa??''} segments={panel.player?.recommendedAnswerRuby}/>:<>
     <Text style={[s.japanese,{color:theme.text}]}>{npcText||' '}</Text>
     {hintStage>0&&language!=='ja'&&<Text style={[s.translation,{color:theme.reading}]}>{npcTranslation??missingHint[language]}</Text>}
    </>}
    {!isNpc&&(speech.recognizing||!!speech.transcript)&&<Text style={[s.transcript,{color:theme.text}]}>「{speech.transcript||'音声を認識しています…'}」</Text>}
   </RoyalReadingFrame><RoyalHintButton onPress={()=>nextHint(panel.id,isNpc)} color={isNpc?'gold':'red'} style={s.hintButton}/></View>
  </View>;
 };
 return <ImageBackground source={background} resizeMode="cover" style={s.screen}><View style={s.backdrop}/><SafeAreaView onLayout={event=>{const {width,height}=event.nativeEvent.layout;setStageSize({width,height});}} style={s.safe}>
  <View onLayout={event=>setHeaderHeight(event.nativeEvent.layout.height)} style={s.header}><View style={s.headerRow}><RoyalBackButton onPress={()=>router.back()}/><View style={s.headerTitle}><View style={s.titleRow}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.title}>{location?displayLocationNameJa(location.nameJa,location.category):'会話練習'}</Text></View></View></View><View style={s.missionCard}><RoyalNavyFrame style={s.missionLabel}><Text style={s.missionLabelText}>課題</Text></RoyalNavyFrame><RoyalReadingFrame><Text maxFontSizeMultiplier={1} style={s.missionText}>{mission}</Text></RoyalReadingFrame></View></View>
  <View pointerEvents="none" style={[s.npcLayer,{bottom:controlsBottom},wide&&s.npcLayerWide]}><Image source={npcImage} resizeMode="contain" style={s.npcImage}/></View>
  <ScrollView style={[s.conversation,{top:conversationTop,bottom:controlsBottom+76},wide&&s.conversationWide]} contentContainerStyle={s.conversationContent} nestedScrollEnabled>
   {npcContext&&renderPanel(npcContext,!npcTurn)}
   {!npcTurn&&renderPanel(turn)}
   <View style={s.actionRow}>{!npcTurn&&<PulsingMic disabled={!speech.speechAvailable} recording={speech.recognizing} onPress={()=>{if(speech.recognizing)speech.stopListening();else void speech.startListening()}}/>}</View>
  </ScrollView>
  <View style={[s.controls,{bottom:controlsBottom},wide&&s.controlsWide]}><RoyalButton disabled={index===0} onPress={()=>move(index-1)} style={s.control}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.controlText}>前へ</Text></RoyalButton><RoyalButton disabled={finishing||(npcTurn&&!npcSpeechDone)} onPress={()=>index+1<turns.length?move(index+1):finish()} style={s.control}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.controlText}>{index+1<turns.length?'次へ':finishing?'保存中…':npcTurn&&!npcSpeechDone?'再生中…':'終了'}</Text></RoyalButton></View>
  <NpcRewardModal visible={rewardVisible} category={rewardCategory} progress={rewardProgress} isUnlock={isUnlock} onClose={()=>{if(scenario.locationId)router.dismissTo(`/world/location/${scenario.locationId}`);else router.back()}}/>
 </SafeAreaView></ImageBackground>
}

const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:'#d9e7ef'},backdrop:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(5,12,24,.15)'},safe:{flex:1},
 header:{zIndex:10,width:'100%',paddingHorizontal:ROYAL_PLACEMENT.headerHorizontal,paddingTop:ROYAL_PLACEMENT.headerTop},headerRow:{flexDirection:'row',alignItems:'center',gap:ROYAL_PLACEMENT.headerGap},headerTitle:{flex:1},
 titleRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:6},title:{flex:1,color:'#fff',fontFamily:ROYAL_FONT.heading,fontSize:20,textShadowColor:'rgba(0,0,0,.65)',textShadowOffset:{width:0,height:2},textShadowRadius:5},
 missionCard:{position:'relative',paddingTop:12,marginTop:4,width:'100%',maxWidth:560,alignSelf:'center'},missionLabel:{position:'absolute',top:0,left:16,zIndex:30,elevation:14,width:120,height:26,justifyContent:'center'},missionLabelText:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.body,fontSize:13,textAlign:'center'},missionText:{color:'#18304b',fontFamily:ROYAL_FONT.body,fontSize:ROYAL_TYPE.explanation,lineHeight:ROYAL_TYPE.explanationLine,textAlign:'center'},
 npcLayer:{position:'absolute',zIndex:1,left:'3%',right:'3%',height:'72%'},npcLayerWide:{left:'2%',right:'50%',height:'82%'},npcImage:{width:'100%',height:'100%'},
 bubbleLayer:{position:'absolute',zIndex:5,left:10,right:10},bubbleLayerWide:{left:'51%',right:'3%'},bubbleScroll:{paddingTop:18,paddingBottom:8},
 conversation:{position:'absolute',left:10,right:10,minHeight:0,zIndex:5,elevation:12},conversationWide:{left:'51%',right:'3%'},conversationContent:{flexGrow:1,justifyContent:'flex-end',alignItems:'center',paddingTop:12,paddingBottom:8},bubbleWrap:{position:'relative',paddingTop:10,paddingBottom:10,width:'100%'},playerWrap:{marginLeft:'7%',marginRight:0},speakerPlate:{position:'absolute',top:0,left:16,zIndex:30,elevation:14,width:120,maxWidth:'45%',height:26,justifyContent:'center',paddingHorizontal:14},speakerName:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,textAlign:'center',fontSize:12,lineHeight:17},
 bubbleDepth:{position:'relative',shadowColor:'#020713',shadowOffset:{width:0,height:8},shadowOpacity:.42,shadowRadius:12,elevation:10},bubble:{minHeight:108,paddingRight:58,paddingBottom:48},
 japanese:{fontFamily:ROYAL_FONT.heading,fontSize:17,lineHeight:21,textAlign:'center'},reading:{fontFamily:ROYAL_FONT.body,fontSize:ROYAL_TYPE.optionSecondary,lineHeight:19,marginTop:3,textAlign:'center'},guidance:{fontFamily:ROYAL_FONT.body,fontSize:17,lineHeight:21,textAlign:'center'},
 translation:{fontFamily:ROYAL_FONT.body,fontSize:ROYAL_TYPE.optionSecondary,lineHeight:21,marginTop:7,textAlign:'center'},
 actionRow:{height:44,width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:28},hintButton:{position:'absolute',right:0,bottom:-12,zIndex:20,width:30,height:38},
 speechArea:{marginTop:8,alignItems:'center',justifyContent:'center',gap:6,minHeight:44},transcript:{width:'100%',fontSize:16,lineHeight:24,fontFamily:ROYAL_FONT.body,textAlign:'center',textAlignVertical:'center',includeFontPadding:false},speechNotice:{marginTop:4,marginHorizontal:12,color:'#fff3e1',fontFamily:ROYAL_FONT.body,fontSize:12,lineHeight:18,textAlign:'center',textShadowColor:'#31151a',textShadowOffset:{width:0,height:1},textShadowRadius:3},mic:{width:44,height:44,alignItems:'center',justifyContent:'center'},micIcon:{width:28,height:28},
 controls:{position:'absolute',zIndex:8,left:10,right:10,flexDirection:'row',gap:6},controlsWide:{left:'51%',right:'3%'},control:{flex:1,height:66},controlText:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:18},pressed:{opacity:.86,transform:[{scale:.97}]},disabled:{opacity:.35},emptyScreen:{flex:1,backgroundColor:'#0b1b2a'},empty:{color:'#fff',fontFamily:ROYAL_FONT.body,padding:24,fontSize:18},
});
