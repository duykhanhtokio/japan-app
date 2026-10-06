import { backPrepared, dismissToPrepared } from '@/components/ui/prepareSceneRoute';
import SafeAreaView from '@/components/ui/StableSafeAreaView';
import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import ImageBackground from '@/components/ui/FocusedImageBackground';
import * as Speech from 'expo-speech';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated as NativeAnimated, Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { npcPresentationForCategory, sceneForCategory } from '@/components/world/life-assets';
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
 return <Pressable accessibilityRole="button" accessibilityLabel={recording?'録音を停止':'録音を開始'} disabled={disabled} onPress={onPress} style={({pressed})=>[s.mic,disabled&&{opacity:.7},pressed&&s.pressed]}><NativeAnimated.Image fadeDuration={0} source={MICROPHONE} resizeMode="contain" style={[s.micIcon,{opacity:pulse.interpolate({inputRange:[0,1],outputRange:[.78,1]}),transform:[{scale:pulse.interpolate({inputRange:[0,1],outputRange:[.96,1.06]})}]}]}/></Pressable>
}

// Conservative line budgeting before paint; Latin glyphs occupy half a full-width cell.
function copyLines(text:string,width:number,size:number){
 const capacity=Math.max(1,width/size);let lines=1,used=0;
 for(const char of text){if(char==='\n'){lines++;used=0;continue;}const unit=/[\u0000-\u007f]/.test(char)?.6:1;if(used+unit>capacity){lines++;used=0;}used+=unit;}
 return lines;
}

export default function DialogueRoute(){
 const raw=useLocalSearchParams<{scenarioId:string}>().scenarioId,id=Array.isArray(raw)?raw[0]:raw;
 return <DialogueScreen key={id} id={id}/>;
}
function DialogueScreen({id}:{id?:string}){
 const scenario=id?getLifeScenarioById(id):null,location=scenario?.locationId?getLifeLocationById(scenario.locationId):null;
 const{profile}=useUserProfile(),{language}=useAppLanguage(),royalPosition=useRoyalPositioning(),insets=useSafeAreaInsets(),wide=royalPosition.isWide;
 const turns=useMemo(()=>id?loadDialogueTurns(id):[],[id]);
 const[index,setIndex]=useState(0),[revealedTurnIds,setRevealedTurnIds]=useState<Set<string>>(()=>new Set()),[npcSpeechDone,setNpcSpeechDone]=useState(true),[rewardVisible,setRewardVisible]=useState(false),[rewardCategory,setRewardCategory]=useState<NpcCategory|null>(null),[rewardProgress,setRewardProgress]=useState(0),[isUnlock,setIsUnlock]=useState(false),[finishing,setFinishing]=useState(false),speech=useGameSpeech(),turn=turns[index],npcTurn=turn?.speaker==='NPC';
 const [spokenLengths,setSpokenLengths]=useState<Record<string,number>>({});
 const [playerTranscripts,setPlayerTranscripts]=useState<Record<string,string>>({});
 const latestTranscript=useRef('');
 latestTranscript.current=speech.finalTranscript.trim()||speech.transcript.trim();
 const [hintStages,setHintStages]=useState<Record<string,number>>({});
 const viewport=useWindowDimensions();
 const stageSize=viewport;
 const abortListening=speech.abortListening;
 const heardNpcIds=useRef(new Set<string>());
 const playerTurn=turn?.speaker==='PLAYER'?turn:null;
 const turnMotion=useRef(new NativeAnimated.Value(1)).current;
 const transitionBusy=useRef(false);
 const [transitioning,setTransitioning]=useState(false);
 const advanceTurn=useCallback((next:number)=>{
  if(transitionBusy.current||next===index||!turns.length)return;
  transitionBusy.current=true;
  setTransitioning(true);
  const departingTurn=turns[index];
  if(departingTurn?.speaker==='PLAYER'&&latestTranscript.current){
   const transcript=latestTranscript.current;
   setPlayerTranscripts(previous=>({...previous,[departingTurn.id]:transcript}));
  }
  abortListening();
  void Speech.stop();
  turnMotion.setValue(0);
  setIndex(Math.max(0,Math.min(turns.length-1,next)));
  NativeAnimated.timing(turnMotion,{toValue:1,duration:320,useNativeDriver:true}).start(()=>{
   transitionBusy.current=false;
   setTransitioning(false);
  });
 },[abortListening,index,turnMotion,turns.length]);
 useEffect(()=>()=>turnMotion.stopAnimation(),[turnMotion]);
 useEffect(()=>{
  if(turn?.speaker==='PLAYER'&&speech.finalTranscript.trim()&&!speech.recognizing&&!speech.speechError&&index+1<turns.length){
   advanceTurn(index+1);
  }
 },[advanceTurn,index,speech.finalTranscript,speech.recognizing,speech.speechError,turn?.speaker,turns.length]);
 const theme=themeFor(location?.category),background=locationBackground(location?.id,location?.category)??sceneForCategory(location?.category),npcPresentation=npcPresentationForCategory(location?.category),npcImage=npcPresentation.source,controlsBottom=Math.max(18,insets.bottom+10),mission=scenarioMission(scenario,location?.category),npcCategory=normalizeNpcCategory(location?.category),npcName=npcCategory?`${npcCategory.ja}さん`:'スタッフ',playerName=profile.name?.trim()||'プレイヤー';
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
     if(turns[index+1]?.speaker==='PLAYER')advanceTurn(index+1);
    },
    onStopped:()=>{if(active)setNpcSpeechDone(true)},
    onError:()=>{if(active)setNpcSpeechDone(true)},
   });
  }else setNpcSpeechDone(true);
  };
  void begin().catch(()=>{if(active)setNpcSpeechDone(true)});
  return()=>{active=false;void Speech.stop()};
 },[turn?.id,turn?.speaker,turn?.npc?.textJa,abortListening,index,turns,advanceTurn]);
 if(!scenario||!turn)return <RoyalPageBackground source={require('../../../../assets/app/backgrounds/profile-details.png')}><SafeAreaView style={s.emptyScreen}><Text style={s.empty}>会話データがありません。</Text></SafeAreaView></RoyalPageBackground>;
 const nextHint=(turnId:string,isNpc:boolean)=>{if(isNpc)setHintStages(previous=>({...previous,[turnId]:previous[turnId]?0:1}));else setHintStages(previous=>({...previous,[turnId]:Math.min(2,(previous[turnId]??0)+1)}))},move=(next:number)=>advanceTurn(next);
 const finish=async()=>{if(finishing)return;const category=normalizeNpcCategory(location?.category);if(!category){backPrepared();return}setFinishing(true);const result=await recordNpcScenario(scenario.id,category.id);const unlocked=result.unlockedCategoryId?npcCategoryById(result.unlockedCategoryId):null;setRewardCategory(unlocked??category);setRewardProgress(result.progress);setIsUnlock(!!unlocked);setRewardVisible(true);setFinishing(false)};
 const npcRatio=npcPresentation.width/npcPresentation.height;
 const npcBoxHeight=stageSize.height*(wide?.82:.72),npcBoxWidth=stageSize.width*(wide?.48:.94);
 const npcDrawHeight=Math.min(npcBoxHeight,npcBoxWidth/npcRatio);
 const npcWaist=stageSize.height-controlsBottom-npcBoxHeight+(npcBoxHeight-npcDrawHeight)/2+npcDrawHeight*npcPresentation.waistY/npcPresentation.height;
 const dockReserve=wide?96:124;
 const missionWidth=(wide?stageSize.width*.46:Math.min(560,stageSize.width-24))-56;
 const missionFont=wide?12:ROYAL_TYPE.explanation,missionLine=wide?16:ROYAL_TYPE.explanationLine;
 const missionLines=copyLines(mission,missionWidth,missionFont);
 const headerHeight=insets.top+ROYAL_PLACEMENT.headerTop+44+4+12+(wide?20:36)+missionLines*missionLine;
 const conversationTop=Math.max(headerHeight+8,npcWaist);
 const visiblePanels=turns.slice(Math.max(0,index-1),index+1);
 const availableHeight=Math.max(0,stageSize.height-conversationTop-controlsBottom-dockReserve);
 const slotHeight=Math.max(0,(availableHeight-40)/2);
 const renderPanel=(panel:typeof turn,context=false)=>{
  const isNpc=panel.speaker==='NPC',showText=context||revealedTurnIds.has(panel.id),hintStage=hintStages[panel.id]??0;
  const npcText=showText?panel.npc?.textJa??'':(panel.npc?.textJa??'').slice(0,spokenLengths[panel.id]??0);
  const npcTranslation=panel.npc?.translations?.[language]??(language==='vi'?panel.npc?.translationVi:null);
  const panelTranscript=isNpc?'':context?playerTranscripts[panel.id]??'':speech.transcript;
  const panelRecognizing=!isNpc&&!context&&speech.recognizing;
  const budgetHeight=slotHeight;
  const copyWidth=Math.max(80,(wide?stageSize.width*.46:stageSize.width-20)-56);
  const fullNpc=panel.npc?.textJa??'';
  const panelCopy=isNpc?fullNpc:hintStage===1?(panel.player?getPlayerNativeHint(panel.player,language):null)??missingHint[language]:hintStage===2?panel.player?.recommendedAnswerJa??'':'';
  const copyPixels=(size:number)=>copyLines(panelCopy,copyWidth,size)*size*(isNpc?1.15:hintStage===2?1.9:1.15)+(isNpc&&hintStage>0&&language!=='ja'?3+copyLines(npcTranslation??missingHint[language],copyWidth,size)*size*1.15:0)+(!isNpc&&panelTranscript?copyLines(panelTranscript,copyWidth,size)*size*1.15:0);
  const panelInsets=wide?40:60;
  // Last NPC hugs the complete sentence, including revealed translation.
  // Reserve against full copy so speech boundary events never resize the panel.
  const allocatedHeight=Math.min(budgetHeight,Math.max(isNpc?100:140,copyPixels(17)+panelInsets));
  const copyHeight=Math.max(20,allocatedHeight-panelInsets);
  let fontSize=17;
  while(fontSize>6&&copyPixels(fontSize)>copyHeight)fontSize-=.5;
  const fit={fontSize,lineHeight:fontSize*1.15};
  return <View key={panel.id} style={[s.bubbleWrap,{height:allocatedHeight}]}>
   <RoyalNavyFrame style={s.speakerPlate}><Text numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1} style={s.speakerName}>{isNpc?npcName:playerName}</Text></RoyalNavyFrame>
   <View style={[s.bubbleDepth,{flex:1}]}><RoyalReadingFrame style={[{flex:1},wide&&{paddingVertical:8,paddingHorizontal:22}]}>
    {!isNpc?hintStage===0?context?<View/>:<WaitingSpeechDots/>:hintStage===1?<Text maxFontSizeMultiplier={1} style={[s.guidance,fit,{color:theme.text}]}>{(panel.player?getPlayerNativeHint(panel.player,language):null)??missingHint[language]}</Text>:<JapaneseRuby fontSize={fontSize} text={panel.player?.recommendedAnswerJa??''} segments={panel.player?.recommendedAnswerRuby}/>:<>
     <Text maxFontSizeMultiplier={1} style={[s.japanese,fit,{color:theme.text}]}>{npcText||' '}</Text>
     {hintStage>0&&language!=='ja'&&<Text maxFontSizeMultiplier={1} style={[s.translation,fit,{color:theme.reading}]}>{npcTranslation??missingHint[language]}</Text>}
    </>}
    {!isNpc&&(panelRecognizing||!!panelTranscript)&&<Text maxFontSizeMultiplier={1} style={[s.transcript,fit,{color:theme.text}]}>「{panelTranscript||'音声を認識しています…'}」</Text>}
   </RoyalReadingFrame><RoyalHintButton onPress={()=>nextHint(panel.id,isNpc)} color={isNpc?'gold':'red'} style={s.hintButton}/></View>
  </View>;
 };
 return <ImageBackground inheritBackdrop key={location?.id} source={background} resizeMode="cover" style={s.screen}><View style={s.safe}>
  <View style={[s.header,{paddingTop:insets.top+ROYAL_PLACEMENT.headerTop}]}><View style={s.headerRow}><RoyalBackButton onPress={()=>backPrepared()}/><View style={s.headerTitle}><View style={s.titleRow}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.title}>{location?displayLocationNameJa(location.nameJa,location.category):'会話練習'}</Text></View></View></View><View style={[s.missionCard,wide&&s.missionCardWide]}><RoyalNavyFrame style={s.missionLabel}><Text style={s.missionLabelText}>課題</Text></RoyalNavyFrame><RoyalReadingFrame explanation style={wide?{paddingVertical:10}:undefined}><Text maxFontSizeMultiplier={1} style={[s.missionText,{color:ROYAL.paleGold},wide&&{fontSize:12,lineHeight:16}]}>{mission}</Text></RoyalReadingFrame></View></View>
  <View testID="dialogue-npc" pointerEvents="none" style={[s.npcLayer,{left:stageSize.width*(wide?.02:.03),top:stageSize.height-controlsBottom-npcBoxHeight,width:npcBoxWidth,height:npcBoxHeight}]}><Image key={location?.category} fadeDuration={0} source={npcImage} resizeMode="contain" style={s.npcImage}/></View>
  <View testID="dialogue-panels" pointerEvents={transitioning?'none':'auto'} style={[s.conversation,{top:conversationTop,bottom:controlsBottom+dockReserve,overflow:'hidden'},wide&&s.conversationWide]}>
   {visiblePanels.map((panel,slot)=>{
    const previous=visiblePanels.length===2&&slot===0;
    return <NativeAnimated.View key={panel.id} style={{position:'absolute',left:0,right:0,top:previous?0:slotHeight+16,transform:[{translateY:turnMotion.interpolate({inputRange:[0,1],outputRange:[slotHeight+16,0]})}]}}>
     {renderPanel(panel,previous)}
    </NativeAnimated.View>;
   })}
  </View>
  {playerTurn&&<View testID="dialogue-microphone" style={[s.microphoneDock,{bottom:controlsBottom+(wide?52:72),height:wide?44:48},wide&&s.conversationWide]}><PulsingMic disabled={transitioning||!speech.speechAvailable||(npcTurn&&!npcSpeechDone)} recording={speech.recognizing} onPress={()=>{if(speech.recognizing)speech.stopListening();else void speech.startListening()}}/></View>}
  <View style={[s.controls,{bottom:controlsBottom},wide&&s.controlsWide]}><RoyalButton contentStyle={wide?{paddingVertical:4}:undefined} disabled={transitioning||index===0} onPress={()=>move(index-1)} style={[s.control,wide&&{height:44,minHeight:44}]}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.controlText}>前へ</Text></RoyalButton><RoyalButton contentStyle={wide?{paddingVertical:4}:undefined} disabled={transitioning||finishing||(npcTurn&&!npcSpeechDone)} onPress={()=>index+1<turns.length?move(index+1):finish()} style={[s.control,wide&&{height:44,minHeight:44}]}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.controlText}>{index+1<turns.length?'次へ':finishing?'保存中…':npcTurn&&!npcSpeechDone?'再生中…':'終了'}</Text></RoyalButton></View>
  {rewardVisible&&<NpcRewardModal visible={rewardVisible} category={rewardCategory} progress={rewardProgress} isUnlock={isUnlock} onClose={()=>{if(scenario.locationId)dismissToPrepared(`/world/location/${scenario.locationId}`);else backPrepared()}}/>}
 </View></ImageBackground>
}

const s=StyleSheet.create({
 screen:{flex:1},safe:{flex:1},
 header:{zIndex:10,width:'100%',paddingHorizontal:ROYAL_PLACEMENT.headerHorizontal,paddingTop:ROYAL_PLACEMENT.headerTop},headerRow:{flexDirection:'row',alignItems:'center',gap:ROYAL_PLACEMENT.headerGap},headerTitle:{flex:1},
 titleRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:6},title:{flex:1,color:'#fff',fontFamily:ROYAL_FONT.heading,fontSize:20,textShadowColor:'rgba(0,0,0,.65)',textShadowOffset:{width:0,height:2},textShadowRadius:5},
 missionCard:{position:'relative',paddingTop:12,marginTop:4,width:'100%',maxWidth:560,alignSelf:'center'},missionCardWide:{width:'46%',alignSelf:'flex-end'},missionLabel:{position:'absolute',top:0,left:16,zIndex:30,elevation:14,width:120,height:26,justifyContent:'center'},missionLabelText:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.body,fontSize:13,textAlign:'center'},missionText:{color:'#18304b',fontFamily:ROYAL_FONT.body,fontSize:ROYAL_TYPE.explanation,lineHeight:ROYAL_TYPE.explanationLine,textAlign:'center'},
 npcLayer:{position:'absolute',zIndex:1},npcImage:{width:'100%',height:'100%'},
 bubbleLayer:{position:'absolute',zIndex:5,left:10,right:10},bubbleLayerWide:{left:'51%',right:'3%'},bubbleScroll:{paddingTop:18,paddingBottom:8},
 conversation:{position:'absolute',left:10,right:10,minHeight:0,zIndex:5,elevation:12},conversationWide:{left:'51%',right:'3%'},conversationContent:{flexGrow:1,justifyContent:'flex-end',alignItems:'center',paddingTop:12,paddingBottom:8},bubbleWrap:{position:'relative',paddingTop:12,paddingBottom:12,width:'100%'},playerWrap:{marginLeft:'7%',marginRight:0},speakerPlate:{position:'absolute',top:0,left:16,zIndex:30,elevation:14,width:120,maxWidth:'45%',height:26,justifyContent:'center',paddingHorizontal:14},speakerName:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,textAlign:'center',fontSize:12,lineHeight:17},
 bubbleDepth:{position:'relative',shadowColor:'#020713',shadowOffset:{width:0,height:8},shadowOpacity:.42,shadowRadius:12,elevation:10},bubble:{minHeight:108,paddingRight:58,paddingBottom:48},
 japanese:{fontFamily:ROYAL_FONT.heading,fontSize:17,lineHeight:21,textAlign:'center'},reading:{fontFamily:ROYAL_FONT.body,fontSize:ROYAL_TYPE.optionSecondary,lineHeight:19,marginTop:3,textAlign:'center'},guidance:{fontFamily:ROYAL_FONT.body,fontSize:17,lineHeight:21,textAlign:'center'},
 translation:{fontFamily:ROYAL_FONT.body,fontSize:ROYAL_TYPE.optionSecondary,lineHeight:21,marginTop:3,textAlign:'center'},
 microphoneDock:{position:'absolute',left:10,right:10,zIndex:9,elevation:14,height:48,alignItems:'center',justifyContent:'center'},
 actionRow:{height:44,width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:28},hintButton:{position:'absolute',right:8,bottom:-28.5,zIndex:20,width:45,height:57},
 speechArea:{marginTop:8,alignItems:'center',justifyContent:'center',gap:6,minHeight:44},transcript:{width:'100%',fontSize:16,lineHeight:24,fontFamily:ROYAL_FONT.body,textAlign:'center',textAlignVertical:'center',includeFontPadding:false},speechNotice:{marginTop:4,marginHorizontal:12,color:'#fff3e1',fontFamily:ROYAL_FONT.body,fontSize:12,lineHeight:18,textAlign:'center',textShadowColor:'#31151a',textShadowOffset:{width:0,height:1},textShadowRadius:3},mic:{width:44,height:44,alignItems:'center',justifyContent:'center'},micIcon:{width:28,height:28},
 controls:{position:'absolute',zIndex:8,left:10,right:10,flexDirection:'row',gap:6},controlsWide:{left:'51%',right:'3%'},control:{flex:1,height:66,minHeight:66},controlText:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:18},pressed:{opacity:.86,transform:[{scale:.97}]},disabled:{opacity:.35},emptyScreen:{flex:1,backgroundColor:'transparent'},empty:{color:'#fff',fontFamily:ROYAL_FONT.body,padding:24,fontSize:18},
});
