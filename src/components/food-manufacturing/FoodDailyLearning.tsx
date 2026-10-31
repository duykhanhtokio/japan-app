import {useState} from 'react';
import ui from '@/data/food-manufacturing/daily-ui-translations.json';
import {Image,Modal,Pressable,ScrollView,StyleSheet,Text,View,type ImageSourcePropType} from 'react-native';
import {foodDailyBinding,foodDailyCompanions} from '@/data/food-manufacturing/daily-learning';
import {foodManufacturingTranslation,type FoodManufacturingLesson} from '@/data/food-manufacturing';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {FoodLessonRuby} from './FoodLessonRuby';
const drawings:Record<string,ImageSourcePropType>={
 'health':require('../../../assets/food-manufacturing/daily-diagrams/health.webp'),
 'stop':require('../../../assets/food-manufacturing/daily-diagrams/stop.webp'),
 'signs':require('../../../assets/food-manufacturing/daily-diagrams/signs.webp'),
 'label':require('../../../assets/food-manufacturing/daily-diagrams/label.webp'),
 'calibration':require('../../../assets/food-manufacturing/daily-diagrams/calibration.webp'),
 'normal':require('../../../assets/food-manufacturing/daily-diagrams/normal.webp'),
 'allergen':require('../../../assets/food-manufacturing/daily-diagrams/allergen.webp'),
 'chemicals':require('../../../assets/food-manufacturing/daily-diagrams/chemicals.webp'),
 'circular':require('../../../assets/food-manufacturing/daily-diagrams/circular.webp'),
 'clothing':require('../../../assets/food-manufacturing/daily-diagrams/clothing.webp'),
 'cold':require('../../../assets/food-manufacturing/daily-diagrams/cold.webp'),
 'control':require('../../../assets/food-manufacturing/daily-diagrams/control.webp'),
 'defense':require('../../../assets/food-manufacturing/daily-diagrams/defense.webp'),
 'detector':require('../../../assets/food-manufacturing/daily-diagrams/detector.webp'),
 'downtime':require('../../../assets/food-manufacturing/daily-diagrams/downtime.webp'),
 'fifo':require('../../../assets/food-manufacturing/daily-diagrams/fifo.webp'),
 'floor':require('../../../assets/food-manufacturing/daily-diagrams/floor.webp'),
 'foreign':require('../../../assets/food-manufacturing/daily-diagrams/foreign.webp'),
 'guard':require('../../../assets/food-manufacturing/daily-diagrams/guard.webp'),
 'hands':require('../../../assets/food-manufacturing/daily-diagrams/hands.webp'),
 'heatcurve':require('../../../assets/food-manufacturing/daily-diagrams/heatcurve.webp'),
 'lifting':require('../../../assets/food-manufacturing/daily-diagrams/lifting.webp'),
 'lots':require('../../../assets/food-manufacturing/daily-diagrams/lots.webp'),
 'microbes':require('../../../assets/food-manufacturing/daily-diagrams/microbes.webp'),
 'privacy':require('../../../assets/food-manufacturing/daily-diagrams/privacy.webp'),
 'probe':require('../../../assets/food-manufacturing/daily-diagrams/probe.webp'),
 'receipt':require('../../../assets/food-manufacturing/daily-diagrams/receipt.webp'),
 'risk':require('../../../assets/food-manufacturing/daily-diagrams/risk.webp'),
 'safety':require('../../../assets/food-manufacturing/daily-diagrams/safety.webp'),
 'seal':require('../../../assets/food-manufacturing/daily-diagrams/seal.webp'),
 'stats':require('../../../assets/food-manufacturing/daily-diagrams/stats.webp'),
 'teaching':require('../../../assets/food-manufacturing/daily-diagrams/teaching.webp'),
 'wash':require('../../../assets/food-manufacturing/daily-diagrams/wash.webp'),
 'yield':require('../../../assets/food-manufacturing/daily-diagrams/yield.webp'),
 'zones':require('../../../assets/food-manufacturing/daily-diagrams/zones.webp'),
};
/** Controlled semantic drawings, not universal operating instructions or limit values. */
export function FoodDailyLearning({lesson,language,showTranslation,textColor,readingColor}:{lesson:FoodManufacturingLesson;language:string;showTranslation:boolean;textColor:string;readingColor:string}){
 const [expanded,setExpanded]=useState(false),labels=showTranslation&&language!=='ja'?(ui.locales as Record<string,{compare:string;explain:string;close:string}>)[language]:undefined;
 const binding=foodDailyBinding(lesson);if(!binding)return null;
 const p=lesson.paragraphs.find(p=>p.id===binding.captionParagraphId)!,t=showTranslation&&language!=='ja'?foodManufacturingTranslation(lesson,language):null;
 const source=drawings[binding.diagramKind];
 return <View testID={`food-daily-learning-${lesson.id}`} style={s.section}>
 {source&&<View testID={`food-daily-diagram-${lesson.id}`} style={s.figure}>
 <Pressable accessibilityRole="button" accessibilityLabel={`${p.titleJa}・拡大`} onPress={()=>setExpanded(true)}><Image source={source} resizeMode="contain" accessibilityLabel={`${p.titleJa}。${p.textJa}${t?`。${t.paragraphTitles[p.id]}。${t.paragraphs[p.id]}`:''}`} style={s.image}/></Pressable>
 <FoodLessonRuby lesson={lesson} field={`paragraphs.${p.id}.titleJa`} text={p.titleJa} color={textColor} readingColor={readingColor} heading/>
 <FoodLessonRuby lesson={lesson} field={`paragraphs.${p.id}.textJa`} text={p.textJa} color={textColor} readingColor={readingColor}/>
 {t&&<TranslationText>{t.paragraphTitles[p.id]}{'\n'}{t.paragraphs[p.id]}</TranslationText>}
 </View>}
 {foodDailyCompanions(lesson).map(({lesson:peer,paragraphs,includeActivity})=>{const pt=showTranslation&&language!=='ja'?foodManufacturingTranslation(peer,language):null;return <View key={peer.id} testID={`food-daily-companion-${peer.id}`} style={s.companion}>
 <Text style={[s.heading,{color:textColor}]}>関連する場面を比べる</Text>{labels&&<TranslationText>{labels.compare}</TranslationText>}
 <FoodLessonRuby lesson={peer} field="titleJa" text={peer.titleJa} color={textColor} readingColor={readingColor} heading/>{pt&&<TranslationText>{pt.title}</TranslationText>}
 {paragraphs.map(cp=><View key={cp.id} style={s.paragraph}>
 <FoodLessonRuby lesson={peer} field={`paragraphs.${cp.id}.titleJa`} text={cp.titleJa} color={textColor} readingColor={readingColor} heading/>
 <FoodLessonRuby lesson={peer} field={`paragraphs.${cp.id}.textJa`} text={cp.textJa} color={textColor} readingColor={readingColor}/>
 {pt&&<TranslationText>{pt.paragraphTitles[cp.id]}{'\n'}{pt.paragraphs[cp.id]}</TranslationText>}
 </View>)}
 {includeActivity&&<View style={s.paragraph}><Text style={[s.heading,{color:textColor}]}>比較して説明する</Text>{labels&&<TranslationText>{labels.explain}</TranslationText>}<FoodLessonRuby lesson={peer} field="activityJa" text={peer.activityJa} color={textColor} readingColor={readingColor}/>{pt&&<TranslationText>{pt.activity}</TranslationText>}</View>}
 </View>;})}
 <Modal visible={expanded} animationType="none" onRequestClose={()=>setExpanded(false)}><View style={{flex:1,backgroundColor:'#fffaf0',paddingTop:36}}><Pressable accessibilityRole="button" accessibilityLabel="図を閉じる" onPress={()=>setExpanded(false)} style={{padding:16}}><Text style={{color:'#233c4c',fontSize:18}}>図を閉じる{labels?` · ${labels.close}`:''}</Text></Pressable><ScrollView horizontal><ScrollView style={{width:1200}}><Image source={source} resizeMode="contain" accessibilityLabel={p.titleJa} style={{width:1200,height:760}}/></ScrollView></ScrollView></View></Modal>
 </View>;
}
const s=StyleSheet.create({section:{gap:18,paddingVertical:14},figure:{gap:12},image:{width:'100%',height:undefined,aspectRatio:1200/760,alignSelf:'center'},companion:{gap:10,paddingTop:18,borderTopWidth:1,borderColor:'#bda36a'},heading:{fontSize:18,lineHeight:28,fontWeight:'700'},paragraph:{gap:8,paddingVertical:10}});
