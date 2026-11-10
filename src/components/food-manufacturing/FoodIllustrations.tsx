import {useState} from 'react';
import ui from '@/data/food-manufacturing/daily-ui-translations.json';
import warningTranslations from '@/data/food-manufacturing/illustration-label-translations.json';
import {Image,Modal,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import {foodIllustrationsFor} from '@/data/food-manufacturing/illustrations';
import {foodManufacturingTranslation,type FoodManufacturingLesson} from '@/data/food-manufacturing';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {FoodLessonRuby} from './FoodLessonRuby';

/** Complete artwork stays visible; educational illustrations are not scene backgrounds. */
export function FoodIllustrations({lesson,textColor,readingColor,language,showTranslation}:{lesson:FoodManufacturingLesson;textColor:string;readingColor:string;language:string;showTranslation:boolean}){
 const [expanded,setExpanded]=useState<string|null>(null);
 const translation=showTranslation&&language!=='ja'?foodManufacturingTranslation(lesson,language):null;
 const figures=foodIllustrationsFor(lesson);
 const close=translation?(ui.locales as Record<string,{close:string}>)[language]?.close:undefined;
 const selected=figures.find(figure=>`${lesson.id}:${lesson.sourceHash}:${figure.id}`===expanded);
 const description=(figure:typeof figures[number])=>{
  const p=lesson.paragraphs.find(p=>p.id===figure.captionParagraphId)!;
  const warning=figure.incorrectExample?'誤った保管例。':'';
  const translatedWarning=figure.incorrectExample?(warningTranslations.labels as Record<string,string>)[language]:undefined;
  return `${warning}${p.titleJa}。${p.textJa}${translation?`。${translatedWarning?`${translatedWarning}。`:''}${translation.paragraphTitles[p.id]}。${translation.paragraphs[p.id]}`:''}`;
 };
 return <>{figures.map(figure=>{
  const paragraph=lesson.paragraphs.find(p=>p.id===figure.captionParagraphId)!;
  return <View key={figure.id} testID={figure.id} style={s.figure}>
   {figure.incorrectExample&&<View><Text style={{fontSize:10,lineHeight:17,color:textColor}}>あやまったほかんれい</Text><Text accessibilityRole="header" style={s.warning}>誤った保管例</Text>{translation&&(warningTranslations.labels as Record<string,string>)[language]&&<TranslationText>{(warningTranslations.labels as Record<string,string>)[language]}</TranslationText>}</View>}
   <FoodLessonRuby lesson={lesson} field={`paragraphs.${paragraph.id}.titleJa`} text={paragraph.titleJa} color={textColor} readingColor={readingColor} heading/>
   {translation&&<TranslationText>{translation.paragraphTitles[paragraph.id]}</TranslationText>}
   <FoodLessonRuby lesson={lesson} field={`paragraphs.${paragraph.id}.textJa`} text={paragraph.textJa} color={textColor} readingColor={readingColor}/>
   {translation&&<TranslationText>{translation.paragraphs[paragraph.id]}</TranslationText>}
   <Pressable accessibilityRole="button" accessibilityLabel={description(figure)} onPress={()=>setExpanded(`${lesson.id}:${lesson.sourceHash}:${figure.id}`)}><Image source={figure.source} accessibilityLabel={description(figure)} resizeMode="contain" style={[s.image,{aspectRatio:figure.width/figure.height}]}/></Pressable>
  </View>;
 })}<Modal visible={!!selected} animationType="none" onRequestClose={()=>setExpanded(null)}><View style={s.modal}><Pressable accessibilityRole="button" accessibilityLabel={`図を閉じる${close?` · ${close}`:''}`} onPress={()=>setExpanded(null)}><Text style={s.close}>図を閉じる{close?` · ${close}`:''}</Text></Pressable><ScrollView>{selected&&<View testID={`${selected.id}-zoom`}><Image source={selected.source} accessibilityLabel={description(selected)} resizeMode="contain" style={[s.image,{aspectRatio:selected.width/selected.height}]}/><Text style={s.description}>{description(selected)}</Text></View>}</ScrollView></View></Modal></>;
}
const s=StyleSheet.create({modal:{flex:1,backgroundColor:'#fffaf0',padding:20,paddingTop:36},close:{color:'#183044',fontSize:17,lineHeight:28,padding:12},description:{color:'#183044',fontSize:17,lineHeight:28,paddingVertical:12},figure:{gap:10,paddingVertical:16},image:{width:'100%',height:undefined,alignSelf:'center'},warning:{fontSize:19,lineHeight:30,fontWeight:'700',color:'#a02323',backgroundColor:'#fff2f0',borderWidth:2,borderColor:'#a02323',padding:10}});
