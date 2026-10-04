import ImageBackground from '@/components/ui/FocusedImageBackground';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { sceneForCategory } from '@/components/world/life-assets';
import { locationBackground } from '@/components/world/location-backgrounds.generated';
import { categoryLabelJa, displayLocationNameJa } from '@/components/world/world-ja';
import { DepthPressable } from '@/components/world/WorldSurface';
import { RoyalBackButton, RoyalButton, RoyalInfoPanel, ROYAL, ROYAL_CONTENT_GROUP, ROYAL_FONT, ROYAL_PLACEMENT, ROYAL_TEXT_FIT, ROYAL_TYPE, useRoyalPositioning } from '@/components/ui/RoyalSurface';
import { scenarioMission } from '@/components/world/scenario-mission';
import { getLifeLocationById, getLifeScenariosByLocation, hasLifeDialogue } from '@/services/life-content-repository';
import { nextLocationScenario } from '@/services/dialogue-visit-storage';

const KAIWA_GUIDE = [
 '① 下の「今回の課題」で目的を確認し、「開始」を押します。課題が複数ある場所では、次の訪問で別の課題が表示されます。',
 '② 相手の日本語を最後まで聞きます。聞き取れないときは提灯のボタンで文字を確認できます。',
 '③ 自分の番では、相手の話に合う日本語を考えて答えます。音声認識に対応したビルドではマイクを押して話し、認識された言葉を画面で確認できます。',
 '④ 提灯を押すと例文を確認できます。「前へ」で一つ前の発話に戻り、「次へ」で会話を進めます。相手の音声が再生中の間は次へ進めません。',
 '⑤ 最後の「終了」で課題を記録し、カードの進み具合を確認します。同じ課題をやり直してもカードの達成回数は増えません。',
 '※ 現在、話した内容の正誤は自動採点していません。マイクを利用できない環境でも会話を進められます。',
];

export default function LocationScreen(){
 const raw=useLocalSearchParams<{locationId:string}>().locationId,id=Array.isArray(raw)?raw[0]:raw,location=id?getLifeLocationById(id):null,royalPosition=useRoyalPositioning();
 const scenarios=useMemo(()=>id?getLifeScenariosByLocation(id).filter(x=>hasLifeDialogue(x.id)):[],[id]);
 const [selectedId,setSelectedId]=useState<string|null>(null),[guideVisible,setGuideVisible]=useState(false);
 useEffect(()=>{if(!id)return;let active=true;setSelectedId(null);void nextLocationScenario(id,scenarios.map(x=>x.id)).then(next=>{if(active)setSelectedId(next)});return()=>{active=false}},[id,scenarios]);
 if(!location)return <SafeAreaView style={s.empty}><Text>ロケーションが見つかりません。</Text></SafeAreaView>;
 const activeScenario=scenarios.find(x=>x.id===selectedId),bg=locationBackground(location.id,location.category)??sceneForCategory(location.category),wide=royalPosition.isWide;
 return <ImageBackground source={bg} resizeMode="cover" style={s.screen}><SafeAreaView style={s.safe}>
  <View style={s.header}><RoyalBackButton onPress={()=>router.back()}/><View style={s.heading}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.kicker}>会話練習・{categoryLabelJa(location.category)}</Text><Text {...ROYAL_TEXT_FIT} numberOfLines={2} style={s.title}>{displayLocationNameJa(location.nameJa,location.category)}</Text><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.subtitle}>今回の課題</Text></View></View>
  <ScrollView contentContainerStyle={[s.content,wide&&s.contentWide]} showsVerticalScrollIndicator={false}>
   <RoyalButton onPress={()=>setGuideVisible(true)} compact style={s.guideButton}><Text style={s.playText}>会話の進め方</Text></RoyalButton>
   <View style={[s.scenarioGrid,wide&&s.scenarioGridWide]}>{activeScenario&&<View key={activeScenario.id} style={wide?s.wideItem:undefined}><DepthPressable onPress={()=>router.push(`/world/dialogue/${activeScenario.id}`)} style={s.scenarioDepth}><RoyalInfoPanel sizingGroup={ROYAL_CONTENT_GROUP.worldScenario} label="今回の課題" style={s.scenario}><View style={s.scenarioContent}><Text maxFontSizeMultiplier={1} style={s.objective}>{scenarioMission(activeScenario,location.category)}</Text></View></RoyalInfoPanel></DepthPressable><RoyalButton onPress={()=>router.push(`/world/dialogue/${activeScenario.id}`)} style={s.play} compact><Text maxFontSizeMultiplier={1} style={s.playText}>開始</Text></RoyalButton></View>}</View>
   <RoyalButton onPress={()=>router.push('/world/dialogue-history')} style={s.history} compact><Text style={s.playText}>学習した会話を見る</Text></RoyalButton>
  </ScrollView>
  {guideVisible && <Modal visible={guideVisible} transparent animationType="none" onRequestClose={()=>setGuideVisible(false)}>
   <SafeAreaView style={s.guideOverlay}><View style={s.guideCard}><Text style={s.summaryTitle}>会話の進め方</Text><ScrollView style={s.guideScroll} contentContainerStyle={s.guideCopy}>{KAIWA_GUIDE.map(line=><Text key={line} maxFontSizeMultiplier={1} style={s.guideLine}>{line}</Text>)}</ScrollView><RoyalButton onPress={()=>setGuideVisible(false)} compact><Text style={s.playText}>閉じる</Text></RoyalButton></View></SafeAreaView>
  </Modal>}
 </SafeAreaView></ImageBackground>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:'transparent'},shade:{...StyleSheet.absoluteFillObject,backgroundColor:'transparent'},safe:{flex:1},header:{flexDirection:'row',alignItems:'center',gap:ROYAL_PLACEMENT.headerGap,paddingHorizontal:ROYAL_PLACEMENT.headerHorizontal,paddingTop:ROYAL_PLACEMENT.headerTop},heading:{flex:1},kicker:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.body,fontSize:15,letterSpacing:1.8},title:{color:'#fff',fontFamily:ROYAL_FONT.heading,fontSize:27,lineHeight:38,textShadowColor:'rgba(0,0,0,.55)',textShadowOffset:{width:0,height:2},textShadowRadius:4},subtitle:{color:'#e6f7fb',fontFamily:ROYAL_FONT.body,fontSize:16,marginTop:1},content:{flexGrow:1,justifyContent:'flex-end',padding:16,paddingTop:110,paddingBottom:42},contentWide:{paddingHorizontal:'8%',paddingTop:75},guideButton:{width:220,alignSelf:'center',marginBottom:18},guideOverlay:{flex:1,backgroundColor:'transparent',justifyContent:'center',alignItems:'center',padding:20},guideCard:{width:'100%',maxWidth:640,maxHeight:'85%',padding:20,borderWidth:2,borderColor:ROYAL.gold,borderRadius:18,backgroundColor:ROYAL.ivory},guideScroll:{flexShrink:1},guideCopy:{paddingVertical:8},summary:{marginBottom:14},summaryInner:{paddingVertical:12},summaryWide:{maxWidth:760},summaryLabel:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.body,fontSize:ROYAL_TYPE.fieldLabel,letterSpacing:1.5},summaryTitle:{color:ROYAL.lacquer,fontFamily:ROYAL_FONT.heading,fontSize:17,lineHeight:24,marginBottom:6,textAlign:'center'},guideLine:{width:'100%',color:ROYAL.lacquer,fontFamily:ROYAL_FONT.body,fontSize:14,lineHeight:22,marginBottom:7},scenarioGrid:{gap:18},scenarioGridWide:{flexDirection:'row',flexWrap:'wrap'},wideItem:{width:'49%'},scenarioDepth:{borderRadius:21},scenario:{minHeight:132},scenarioContent:{minHeight:84,width:'100%',alignItems:'center',justifyContent:'center',paddingVertical:10},objective:{width:'100%',color:ROYAL.paleGold,fontFamily:ROYAL_FONT.body,fontSize:ROYAL_TYPE.optionSecondary,lineHeight:21,textAlign:'center'},play:{width:148,height:56,alignSelf:'center',marginTop:6},history:{minHeight:50,alignSelf:'center',marginTop:16,paddingHorizontal:18},playText:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:14,letterSpacing:.8},empty:{flex:1,alignItems:'center',justifyContent:'center'}});
